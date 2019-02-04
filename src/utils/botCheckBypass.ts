// @ts-ignore
import {Page} from 'puppeteer';
import * as navigator from '../stubs/firefoxNavigator.json'
// import * as chromeObj from '../stubs/chrome.json';

import {ExtendedNavigator, ExtendedWindow} from "@typings";

const botCheckBypass: (page: Page) => Promise<void> = async (page: Page) => {
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false
    });
    // We can mock this in as much depth as we need for the test.
    // (window as unknown as ExtendedWindow).chrome = JSON.stringify(chromeObj);
   delete (window as unknown as ExtendedWindow).chrome;

   (window as unknown as ExtendedWindow).navigator = JSON.stringify(navigator);



    //   // Pass the Languages Test.
    //   // Overwrite the `plugins` property to use a custom getter.
    //   Object.defineProperty(navigator, 'languages', {
    //     get: () => ['en-US', 'en']
    //   });
    //
    //   // Pass the Plugins Length Test.
    //   // Overwrite the `plugins` property to use a custom getter.
    //   Object.defineProperty(navigator, 'plugins', {
    //     // This just needs to have `length > 0` for the current test,
    //     // but we could mock the plugins too if necessary.
    //     get: () => [1, 2, 3, 4, 5]
    //   });
    //
      // Pass the Permissions Test.
      // const originalQuery = (window.navigator as unknown as ExtendedNavigator).permissions.query;
      // ((window.navigator as unknown as ExtendedNavigator).permissions.query = (parameters: any) =>
      //   parameters.name === 'notifications'
      //     ? Promise.resolve({ state: Notification.permission })
      //     : originalQuery(parameters));
    //
  });
};

export default botCheckBypass;
