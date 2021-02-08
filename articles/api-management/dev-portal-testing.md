---
title: Test self-hosting
titleSuffix: Azure API Management
description: Learn how to set up unit tests and end-to-end tests for your self-hosted portal.
author: erikadoyle
ms.author: apimpm
ms.date: 02/05/2021
ms.service: api-management
ms.topic: how-to
---

# Test self-hosting

This article explains how to set up unit tests and end-to-end tests for your self-hosted portal.

## Unit tests

### What is a unit test?

A unit test is an approach to the validation of small pieces of functionality. It's done in isolation from other parts of the application.

### Example scenario

In this scenario, you're testing a password input control. It only accepts passwords containing at least:

- One letter

- One number
- One special character.
 
So, the test validating all these requirements will look like this:

```typescript
const passwordInput = new PasswordInput();

passwordInput.value = "";
expect(passwordInput.isValid).to.equal(false);

passwordInput.value = "password";
expect(passwordInput.isValid).to.equal(false);

passwordInput.value = "p@ssw0rd";
expect(passwordInput.isValid.to.equal(true);
```
 
### Project structure

It's a common case to keep a unit test next to the component it's supposed to validate.

```console
component.ts
component.spec.ts
```

### Mocking HTTP requests

There are cases when you expect a component to make HTTP requests. The component should react properly to different kind of responses. To simulate specific HTTP responses, use `MockHttpClient`. It implements `HttpClient` interface used by many other components of the project.

```typescript
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

An end-to-end test executes a particular user scenario taking exact steps that the user is expected to do. In a web application like Azure API Management developer portal, the user selects and scrolls through the content to achieve certain results. You can use browser manipulation helper libraries like [Puppeteer](https://github.com/puppeteer/puppeteer). It lets you simulate user actions and automate assumed scenarios. Puppeteer also automatically take screenshots of pages or components at any stage of the test. Compare them later with previous results to catch deviations and potential regressions.

### Example scenario

In this scenario, you need to validate a user sign-in flow. This scenario would require us to:

1. Open browser and navigate to the sign-in page.

1. Enter the email.

1. Enter the  password.

1. Select **Sign-in**.

1. Verify that user got redirected to Home page.

1. Verify that the page contains **Profile** menu item. It's one of the possible indicators that you successfully signed in.

To run the test automatically, we create a script with exactly the same steps:

```typescript
// 1. Open browser and navigate to the sign-in page.
const page = await browser.newPage();
await page.goto("https://contoso.com/signin");

// 2. Enter email.
await this.page.type("#email", "john.doe@contoso.com");

// 3. Enter password.
await this.page.type("#password", "p@s$w0rd");

// 4. Click Sign-in.
await this.page.click("#signin");

// 5. Verify that user got redirected to Home page.
expect(page.url()).to.equal("https://contoso.com");

// 6. Verify that the page contains Profile menu item.
const profileMenuItem = await this.page.$("#profile");
expect(profileMenuItem).not.equals(null);
```

> [!NOTE]
> Here strings like "#email", "#password" and "#signin" are CSS-like selectors that identify HTML elements on the page. See related [W3C specification](https://www.w3.org/TR/selectors-3/) to learn more.

### UI component maps

User flows often go through the same pages or components. A good example of that is the main website menu that is present on every page. Create a UI component map to avoid configuring and updating the same selectors for every test. For example, steps 2 thorough 6 above could be replaced with just two lines:

```typescript
const signInWidget = new SigninBasicWidget(page);
await signInWidget.signInWithBasic({ email: "...", password: "..." });
```

### Test configuration

Certain scenarios may require pre-created data or configuration. For example, when we need to automate user sign-in with social accounts that, in most cases, cannot be created quickly or easily.

For this purpose, you could add a special configuration file. The test scripts can pick up required data from the file. Depending on the build and test pipeline, the secrets can be pulled from a named secure store.

`src/validate.config.json`

```json
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

Modern browsers like Chrome or Microsoft Edge allow you to run automation in both normal and headless modes. In the headless mode, the browser operates without a graphical user interface. It still carries out the same page and Document Object Model (DOM) manipulations. Running tests in headless mode is a great option in delivery pipelines. The browser UI usually isn't needed in delivery pipelines.

In opposite, when you develop a test script, it would be useful to see what exactly is happening in the browser.

To switch between the modes, just change the option in `/tests/constants.ts` file:

```typescript
export const LaunchOptions = {
    headless: false
};
```

Another useful option is `slowMo`. It makes execution pause between each action:

```typescript
export const LaunchOptions = {
    slowMo: 200 // milliseconds
};
```

## Running tests

There are two built-in ways to execute tests in this project:

**NPM command**

```console
npm run test
```

**Test Explorer**

Test Explorer extension for VS Code (for example, [Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)) has convenient UI and an option to autorun tests on every change of the source code:

![image](https://user-images.githubusercontent.com/2320302/93644489-eafc7880-f9b6-11ea-8744-363c83c4d302.png)

## Next steps

- [Integrate Application Insights](dev-portal-integrate-application-insights.md)
