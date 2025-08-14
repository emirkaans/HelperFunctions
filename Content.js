if (!document.getElementById('helperFunctionsInsider')) {
  const script = document.createElement('script');
  script.id = 'helperFunctionsInsider';
  script.src = chrome.runtime.getURL('inject.js');
  (document.head || document.documentElement).appendChild(script);
}