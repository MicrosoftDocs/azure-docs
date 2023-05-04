---
title: Sign in users in a sample Node.js headless application by using Microsoft Entra - Add sign-in and sign-out
description: Learn how to configure a headless application to sign in and sign out users using Microsoft Entra.
services: active-directory
author: Dickson-Mwendia
manager: mwongerapk

ms.author: dmwendia
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample Node.js headless application to authenticate users with my Azure Active Directory (Azure AD) for customers tenant
---

# Add code to sign in users in a Node.js headless application. 

To sign in users in a Node.js headless application, you implement the device code flow by following the steps below:

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
        authority: `https://Enter_the_Tenant_Name_Here.ciamlogin.com/`, // replace "Enter_the_Tenant_Name_Here" with your tenant name
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
The `msalConfig` object contains a set of configuration options that can be used to customize the behavior of your authentication flows. This configuration object is passed into the instance of our public client application upon creation. In your *authConfig.js* file, replace:

- Enter_the_Application_Id_Here with the Application (client) ID of the app you registered earlier.

- Enter_the_Tenant_Name_Here and replace it with the Directory (tenant) name. If you don't have your tenant name, learn how to read tenant details.

In the configuration object, we also add `LoggerOptions` to the configuration object, which contains two options:

- loggerCallback - A callback function which handles the logging of MSAL statements
- piiLoggingEnabled - A config option that when set to true, enables logging of personally identifiable information (PII). For our app, we set this option to false. 

After creating the `msalConfig` object, add a `loginRequest` object that contains the scopes our application requires. Scopes define the level of access that the application has to user resources. Although the scopes array is empty, MSAL will by default add the OIDC scopes (openid, profile, email) to any login request. Users will be asked to consent to these scopes during sign in. To create the `loginRequest` object, add the following code in *authConfig.js*.

```javascript
const loginRequest = {
    scopes: [],
    extraQueryParameters: {
        dc: 'ESTS-PUB-EUS-AZ1-FD000-TEST1', // STS CIAM test slice
    },
};
```
In `authcConfig.js`, export `msalConfig` and `loginRequest` to make them accessible wherever you require them by adding the following code:

```javascript
module.exports = {
    msalConfig: msalConfig,
    loginRequest: loginRequest,
};
```
## Import MSAL and the configuration

The application we're building uses the Microsoft Authentication Library for Node to authenticate users. To import the MSAL Node package and the configurations defined in the step above, add the following code to *index.js*

```javascript
const msal = require('@azure/msal-node');
const { msalConfig, loginRequest } = require("./authConfig");

const msalInstance = new msal.PublicClientApplication(msalConfig);
```

## Create an instance of a PublicClientApplication object

To use MSAL Node, you must first create an instance of a `PublicClientApplication` object using the `msalConfig` object, which will be used to authenticate the user and obtain an access token. 

In *index.js*, add the following code to initialize the public client application:

```javascript
const msalInstance = new msal.PublicClientApplication(msalConfig);
```

## Create the device code request

To create the device code request that the application will use to obtain access tokens using the device code flow, add the following code to *index.js*

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

The `clientApplication` object is then used to call the `acquireTokenByDeviceCode` API, passing in the `deviceCodeRequest` object. Once the device code request is executed, the user will be prompted by the headless application to visit a URL, where they will input the device code shown in the console. Once the code is entered, the promise below should resolve with an access token response. 

## Initiate the device code flow

Finally, add the following code to *index.js* to initiate the device code flow by calling the `getTokenDeviceCode` function with the `msalInstance` object created earlier. The returned response object will be logged to the console.
```javascript
getTokenDeviceCode(msalInstance).then(response => {
    console.log(response)
});
```

## Run and test your app

Now that we're done building the app, we can test it by following the steps below:


1. In your terminal, ensure you're in project directory where you created your application. For example, *ciam-node-headless-app*. 

1. Use the steps in [Run and test the headless app](ow-to-headless-app-node-sample-sign-in.md#run-and-test-sample-headless-app) article to test your headless app.


## Next steps 

Learn how to: 

- [Enable password reset](how-to-enable-password-reset-customers.md).