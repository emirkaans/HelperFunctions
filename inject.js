let isInit = false;
let waitedTime = 0;
const intervalTime = 2000;
const maxWait = 10000;

const initFunctions = () => {
  const documentTrigger = () => {
    setTimeout(() => {
      Insider.eventManager.dispatch("cart:amount:update");
    }, 250);
  };

  const compareProductListAndEventTrigger = (newList, oldList) => {
    const dispatchEvent = (data, bool) => {
      Insider.eventManager.dispatch("cart:count:update", {
        product: data,
        isAddedToCart: bool,
      });

      Insider.storage.localStorage.set({
        name: "ins-temp-product-list",
        value: Insider.utils.cart.getCartProductStorage(),
      });
    };

    const removedProducts = oldList.filter((oldProduct) => {
      return (
        newList.filter((newProductControl) => {
          return oldProduct.id === newProductControl.id;
        }).length === 0
      );
    });

    if (Insider.utils.cart.getCartProductStorage().length > 0) {
      removedProducts.map((removedProduct) => {
        dispatchEvent(removedProduct, false);
      });
    } else if (removedProducts.length > 0) {
      dispatchEvent(removedProducts[0], false);
    }

    newList.map((newProduct) => {
      const isOldListContainsNewProduct =
        oldList.filter((oldProduct) => {
          return oldProduct.id === newProduct.id;
        }).length > 0;

      if (isOldListContainsNewProduct) {
        const quantityUpdatedProduct =
          oldList.filter((oldProduct) => {
            return (
              oldProduct.id === newProduct.id &&
              oldProduct.quantity !== newProduct.quantity
            );
          })[0] || {};

        if (quantityUpdatedProduct.id) {
          if (quantityUpdatedProduct.quantity > newProduct.quantity) {
            newProduct.quantity =
              quantityUpdatedProduct.quantity - newProduct.quantity;

            dispatchEvent(newProduct, false);
          } else {
            newProduct.quantity =
              newProduct.quantity - quantityUpdatedProduct.quantity;

            dispatchEvent(newProduct, true);
          }
        }
      } else {
        dispatchEvent(newProduct, true);
      }
    });
  };

  window.setStorage = (totalQuantity, totalAmount, productList) => {
    const oldProductList =
      Insider.storage.localStorage.get("ins-temp-product-list") || [];

    Insider.utils.cart.storeCartProductStorage({
      totalQuantity: totalQuantity,
      productList: productList,
    });

    Insider.storage.localStorage.set({
      name: "paid-products",
      value: productList,
    });

    Insider.storage.localStorage.set({
      name: "total-cart-amount",
      value: parseFloat(totalAmount.toFixed(2)) || 0,
    });

    documentTrigger();
    compareProductListAndEventTrigger(productList, oldProductList);
  };

  window.updateFromIO = () => {
    setTimeout(() => {
      if (Insider.utils.getDataFromIO("basket", "line_items") !== "") {
        const productList = [];
        let totalQuantity = 0;
        let totalAmount = 0;
        const totalPaid =
          parseFloat(
            (
              (parseFloat(Insider.utils.getDataFromIO("basket", "total")) ||
                0) -
              (parseFloat(
                Insider.utils.getDataFromIO("basket", "shipping_cost")
              ) || 0)
            ).toFixed(2)
          ) || 0;
        const lineItems = Insider.utils.getDataFromIO("basket", "line_items");

        if (Insider.fns.isArray(lineItems)) {
          lineItems.map((item) => {
            const productObject = item.product || {};
            const quantity =
              parseInt(item.quantity) || parseInt(productObject.quantity) || 1;
            const price =
              parseFloat(
                (
                  parseFloat(productObject.unit_sale_price) ||
                  parseFloat(productObject.unit_price) ||
                  0
                ).toFixed(2)
              ) || 0;
            const originalPrice =
              parseFloat(
                (parseFloat(productObject.unit_price) || 0).toFixed(2)
              ) || price;

            if (price > 0) {
              productList.push({
                id: (productObject.id || "").toString().trim(),
                name: encodeURIComponent(
                  Insider.dom(
                    `<p>${(productObject.name || "")
                      .toString()
                      .replace(/\s+/g, " ")
                      .trim()}</p>`
                  )
                    .text()
                    .trim()
                ),
                price: price,
                originalPrice: originalPrice < price ? price : originalPrice,
                img: (productObject.product_image_url || "")
                  .toString()
                  .trim()
                  .split("?")[0],
                url: (productObject.url || "").toString().trim().split("?")[0],
                cats: (productObject.taxonomy || [])
                  .filter(Boolean)
                  .reduce((previous, current) => {
                    current = (current || "")
                      .toString()
                      .replace(/\s+/g, " ")
                      .trim();
                    current !== "" &&
                      previous.indexOf(current) === -1 &&
                      previous.push(current);

                    return previous;
                  }, []),
                quantity: quantity,
                time: Insider.dateHelper.now(),
              });

              totalQuantity += quantity;
              totalAmount += price * quantity;
            }
          });

          window.setStorage(
            totalQuantity,
            totalPaid || totalAmount,
            productList
          );
        }
      }
    }, 1000);
  };

  window.parsePrice = (stringPrice) => {
    let price = 0;

    stringPrice = (stringPrice || "").toString();
    price = stringPrice.replace(/[^0-9.,]/g, "");

    if (price.slice(-3).indexOf(",") !== -1) {
      price =
        parseFloat(stringPrice.replace(/[^0-9,]/g, "").replace(",", ".")) || 0;
    } else if (price.slice(-3).indexOf(".") !== -1) {
      price = parseFloat(stringPrice.replace(/[^0-9.]/g, "")) || 0;
    } else {
      price = parseFloat(stringPrice.replace(/[^0-9]/g, "")) || 0;
    }

    return price;
  };

  window.firstLettersUpper = (string) => {
    return (string || "")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => {
        return (
          (word[0] || "").toUpperCase() + word.slice(1).toLowerCase()
        ).trim();
      })
      .join(" ")
      .trim();
  };

  window.getCategories = () => {
    return Insider.systemRules.call("getCategories");
  };

  window.getCurrentProduct = () => {
    return Insider.systemRules.call("getCurrentProduct");
  };

  window.getPaidProducts = () => {
    return Insider.systemRules.call("getPaidProducts");
  };

  console.log(
    "%cHi Emir, Helper Functions injected into window",
    "color: white; background-color: red; font-size: 20px; font-weight: bold; padding: 5px; border-radius: 4px;"
  );
};

const interval = setInterval(() => {
  waitedTime += intervalTime;

  if (window.Insider && !isInit) {
    isInit = true;
    clearInterval(interval);
    initFunctions();
  } else if (waitedTime >= maxWait && !isInit) {
    clearInterval(interval);
    console.log(
      "%cInsider is not loaded",
      "color: white; background-color: red; font-size: 20px; font-weight: bold; padding: 5px; border-radius: 4px;"
    );
  }
}, intervalTime);
