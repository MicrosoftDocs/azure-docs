---
title: Sign in users in a sample Node.js browserless application by using the Device Code flow - Add sign-in support
description: Learn how to configure a browserless application to sign in and sign out users
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/09/2023
ms.custom: developer, devx-track-js
#Customer intent: As a dev, devops, I want to learn about how to build a Node.js browserless application to authenticate users with my Microsoft Entra ID for customers tenant
---

# Add code to sign in users in a Node.js browserless application. 

To sign in users in a Node.js browserless application, you implement the device code flow by following these steps:

 - Create the MSAL configuration object
 - Import the required modules
 - Create an instance of a public client application
 - Create the device code request
 - Initiate the device code flow
 - Run and test your app


## Create the MSAL configuration object

In your code editor, open *authConfig.js*, which holds the MSAL object configuration parameters, and add the following code:

```javascript

const { LogLevel } = require('@azure/msal-node');

const msalConfig = {
    auth: {
        clientId: 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: `https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/`, // replace "Enter_the_Tenant_Subdomain_Here" with your Directory (tenant) subdomain
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                // console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose,
        },
    },
};
```
The `msalConfig` object contains a set of configuration options that can be used to customize the behavior of your authentication flows. This configuration object is passed into the instance of our public client application upon creation. In your *authConfig.js* file, find the placeholders:

- `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the app you registered earlier.

- `Enter_the_Tenant_Subdomain_Here` wand replace it with the Directory (tenant) subdomain. For instance, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant domain name, [learn how to read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

In the configuration object, you also add `LoggerOptions`, which contains two options:

- `loggerCallback` - A callback function that handles the logging of MSAL statements
- `piiLoggingEnabled` - A config option that when set to true, enables logging of personally identifiable information (PII). For our app, we set this option to false. 

After creating the `msalConfig` object, add a `loginRequest` object that contains the scopes our application requires. Scopes define the level of access that the application has to user resources. Although the scopes array in the example snippet has no values, MSAL by default adds the OIDC scopes (openid, profile, email) to any login request. Users are asked to consent to these scopes during sign in. To create the `loginRequest` object, add the following code in *authConfig.js*.

```javascript
const loginRequest = {
    scopes: [],
};
```
In `authcConfig.js`, export the `msalConfig` and `loginRequest` objects to make them accessible when required by adding the following code:

```javascript
module.exports = {
    msalConfig: msalConfig,
    loginRequest: loginRequest,
};
```
## Import MSAL and the configuration

The application we're building uses the Microsoft Authentication Library for Node to authenticate users. To import the MSAL Node package and the configurations defined in the previous step, add the following code to *index.js*

```javascript
const msal = require('@azure/msal-node');
const { msalConfig, loginRequest } = require("./authConfig");

const msalInstance = new msal.PublicClientApplication(msalConfig);
```

## Create an instance of a PublicClientApplication object

To use MSAL Node, you must first create an instance of a [`PublicClientApplication`](/javascript/api/%40azure/msal-node/publicclientapplication) object using the `msalConfig` object. The initialized `PublicClientApplication` object is used to authenticate the user and obtain an access token. 

In *index.js*, add the following code to initialize the public client application:

```javascript
const msalInstance = new msal.PublicClientApplication(msalConfig);
```

## Create the device code request

To create the [`deviceCodeRequest`](/javascript/api/%40azure/msal-node/devicecoderequest) that the application uses to obtain access tokens using the Oauth2 device code flow, add the following code to *index.js*

```javascript
const getTokenDeviceCode = (clientApplication) => {
  
    const deviceCodeRequest = {
        ...loginRequest,
        deviceCodeCallback: (response) => {
            console.log(response.message);
        },
    };

    return clientApplication
        .acquireTokenByDeviceCode(deviceCodeRequest)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error;
        });
}
```
The `getTokenDeviceCode` function takes a single parameter, `clientApplication`, which is an instance of the `PublicClientApplication` object we created previously. The function creates a new object named `deviceCodeRequest`, which includes the `loginRequest` object imported from the *authConfig.js* file. It also contains a `deviceCodeCallback` function that logs the device code message to the console. 

The `clientApplication` object is then used to call the [`acquireTokenByDeviceCode`](/javascript/api/%40azure/msal-node/publicclientapplication#@azure-msal-node-publicclientapplication-acquiretokenbydevicecode) API, passing in the `deviceCodeRequest` object. Once the device code request is executed, the application will display a URL that the user should visit. Upon visiting the URL, the user inputs the code displayed in the console. After entering the code, the promise resolves with either an access token or an error. 

## Initiate the device code flow

Finally, add the following code to *index.js* to initiate the device code flow by calling the `getTokenDeviceCode` function with the `msalInstance` object created earlier. The returned response object is logged to the console.

```javascript
getTokenDeviceCode(msalInstance).then(response => {
    console.log(response)
});
```

## Run and test your app

Now that we're done building the app, we can test it by following these steps:


1. In your terminal, ensure you're in project directory that contains the *package.json* file.  For example, *ciam-sign-in-node-browserless-app*. 

1. Use the steps in [Run and test the browserless app](./sample-browserless-app-node-sign-in.md#run-and-test-sample-browserless-app) article to test your browserless app.


## Next steps 

Learn how to: 

- [Enable password reset](how-to-enable-password-reset-customers.md).
