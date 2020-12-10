---
title: Test self-hosting
titleSuffix: Azure API Management
description: Learn how to set up unit tests and end-to-end tests for your self-hosted portal.
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Test self-hosting

This article explains how to set up unit tests and end-to-end tests for your self-hosted portal.

## Unit tests

### What is a unit test?
A unit test is an approach to the validation of small pieces of functionality in isolation from other parts of the application.

### Example scenario
Let's assume that we're testing a password input control and expect that it accepts only those passwords containing at least 1 letter, 1 number and 1 special character. So, the test validating all these requirements could looks like this:

```
const passwordInput = new PasswordInput();

passwordInput.value = "";
expect(passwordInput.isValid).to.equal(false);

passwordInput.value = "password";
expect(passwordInput.isValid).to.equal(false);

passwordInput.value = "p@ssw0rd";
expect(passwordInput.isValid.to.equal(true);
```
 
### Project structure
It is a common case to keep a unit test next to the component it is supposed to validate.
```
component.ts
component.spec.ts
```


### Mocking HTTP requests
There are cases when we expect a component to make HTTP requests and react properly to different kind of responses. In order to simulate specific HTTP responses, we can use MockHttpClient that implements HttpClient interface used by many other components of this project.
```
const httpClient = new MockHttpClient();

httpClient.mock()
    .get("/users/jane")
    .reply(200, {
        firstName: "Jane",
        lastName: "Doe"
    });
```

## End-to-end tests
### What is an end-to-end test?
An end-to-end test executes a particular user scenario taking exact steps that the user is expected to perform. In case of a web application, such as APIM developer portal, the user works in the browser, clicking and scrolling through the content to achieve certain results. Using helper browser manipulation libraries like Puppeteer (https://github.com/puppeteer/puppeteer) we can simulate user actions, and hence, automate assumed scenarios. Besides that, while running such tests, we can automatically take screenshots of pages or components at any stage to later compare them with previous results catching every deviation and potential regressions.

### Example scenario
Let's assume that we need to validate a user sign-in flow. This scenario would require us to:
1. Open browser and navigate to the sign-in page;
2. Type-in email;
3. Type-in password;
4. Click "Sign in" button;
5. Verify that user got redirected to Home page;
6. Verify that the page contains "Profile" menu item (one of the possible indicators that sign-in was successful).

To make it perform automatically, we create a script with exactly the same steps:
```
// 1. Open browser and navigate to the sign-in page
const page = await browser.newPage();
await page.goto("https://contoso.com/signin");

// 2. Type-in email
await this.page.type("#email", "john.doe@contoso.com");

// 3. Type-in password
await this.page.type("#password", "p@s$w0rd");

// 4. Click "Sign in" button;
await this.page.click("#signin");

// 5. Verify that user got redirected to Home page
expect(page.url()).to.equal("https://contoso.com");

// 6. Verify that the page contains "Profile" menu item
const profileMenuItem = await this.page.$("#profile");
expect(profileMenuItem).not.equals(null);
```
**Note:** Here strings like "#email", "#password" and "#signin" are CSS-like selectors that identify HTML elements on the page. See related [W3C specification](https://www.w3.org/TR/selectors-3/) to learn more.

### UI component maps
Very often user flows go through the same pages or components, a good example of that would be the main website menu that is present on every page. Therefore, it makes sense to create a UI component map to avoid configuring (and updating) the same selectors for every single test. For example, the steps 2-6 in the basic sign-in scenario described above, could be replaced with just two lines:

```
const signInWidget = new SigninBasicWidget(page);
await signInWidget.signInWithBasic({ email: "...", password: "..." });
```

### Test configuration
Certain scenarios may require pre-created data or configuration, e.g. when we need to automate user sign-in with social accounts that, in most cases, cannot be created on the fly.

For this purpose, we add a special configuration file from where the test scripts can pick up required data (depending on build/test pipeline the secrets can be pulled from a designated secure store).

`src/validate.config.json`
```
{
    "environment": "validation",
    "urls": {
        "home": "https://contoso.com",
        "signin": "https://contoso.com/signin",
        "signup": "https://contoso.com/signup/"
    },
    "signin": {
        "firstName": "John",
        "lastName": "Doe",
        "credentials": {
            "basic": {
                "email": "johndoe@contoso.com",
                "password": "< password >"
            },
            "aadB2C": {
                "email": "johndoe@contoso.com",
                "password": "< password >"
            }
        }
    },
    "signup": {
        "firstName": "John",
        "lastName": "Doe",
        "credentials": {
            "basic": {
                "email": "johndoe@contoso.com",
                "password": "< password >"
            }
        }
    }
}

```

### Headless vs normal tests
Modern browsers like Edge or Chrome allow running automation in both normal and headless modes, where the later is a mode in which the browser operates without a graphical user interface but still performs the same page and DOM manipulations, so it's a great option for running it in delivery pipelines when UI is not needed.

In opposite, when you develop a test script, it would be useful to see what exactly is happening in the browser.

In order to switch between the modes, just change the option in `/tests/constants.ts` file:
```
export const LaunchOptions = {
    headless: false
};
```
Another useful option is `slowMo` which makes execution to pause between each action:
```
export const LaunchOptions = {
    slowMo: 200 // milliseconds
};
```

## Running tests
Out of the box, there are two ways to execute tests in this project:

**NPM command**
```
npm run test
```
**Test Explorer**

Test Explorer extension for VS Code (for example, [Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)) has convenient UI and an option to autorun tests on every change of the source code:

![image](https://user-images.githubusercontent.com/2320302/93644489-eafc7880-f9b6-11ea-8744-363c83c4d302.png)

## Next steps

- [Integrate Application Insights](dev-portal-integrate-application-insights.md)
