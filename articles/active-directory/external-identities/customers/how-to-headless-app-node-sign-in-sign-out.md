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
 - Import the required modules
 - Create an instance of a public client application
 - Create an instance of the DeviceCodeFlow
 - Add the scopes your application requires
 - Initiate 


## Import the required packages

The application we're building uses MSAL Node. Add the f

In index.js, add the following file to import 

```javascript
Copy code
const msal = require('@azure/msal-node');
const deviceCodeFlow = require('@azure/msal-node').DeviceCodeFlow;
```

## Create an instance of a public client application

Create a new instance of the PublicClientApplication class:

```javascript

const pca = new msal.PublicClientApplication({
  auth: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID'
  },
  cache: {
    cachePlugin
  }
});
```
Replace YOUR_CLIENT_ID and YOUR_TENANT_ID with your client ID and tenant ID, respectively.

## Create a new instance of the DeviceCodeFlow class:

```javascript
const deviceCodeRequest = {
  scopes: ["User.Read"]
};
const deviceCodeFlow = new deviceCodeFlow(pca, deviceCodeRequest);
```

## Replace User.Read with the scopes that your application requires.

Call the initiateDeviceCodeFlow() method on the DeviceCodeFlow instance:

```javascript
deviceCodeFlow.initiateDeviceCodeFlow().then((response) => {
  console.log(response.message);
});
```
This will initiate the device code flow and display the user code and verification URL in the console.

Instruct the user to open the verification URL on a separate device and enter the user code when prompted.

Once the user has authenticated and authorized the application, you can use the acquireTokenByDeviceCode() method to obtain an access token:

```javascript
deviceCodeFlow.acquireTokenByDeviceCode().then((response) => {
  console.log(response.accessToken);
});
```
This will retrieve an access token that can be used to access the requested resources.

Note: You will need to implement your own caching plugin to handle the storage and retrieval of tokens in a headless environment. The cachePlugin parameter in step 3 should be replaced with your own cache plugin implementation.