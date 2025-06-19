---
title: include file
description: include file
services: azure-communication-services
author: aigerim
manager: soricos

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/06/2025
ms.topic: include
ms.custom: include file
ms.author: aigerimb
---

## Set up prerequisites

- [Node.js](https://nodejs.org/)
- [Azure Identity SDK for JavaScript](https://www.npmjs.com/package/@azure/identity) to authenticate with Microsoft Entra ID.
- [Azure Communication Services Common SDK for JavaScript](https://www.npmjs.com/package/@azure/communication-common) to obtain Azure Communication Services access tokens for Microsoft Entra ID user.

## Final code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/entra-id-users-support-quickstart).

## Set up

### Create a new Node.js Application

Open your terminal or command window create a new directory for your app, and navigate to it.

```console
mkdir entra-id-users-support-quickstart && cd entra-id-users-support-quickstart
```

Run `npm init -y` to create a `package.json` file with default settings.

```console
npm init -y
```

### Install the package

Use the `npm install` command to install the Azure Identity and Azure Communication Services Common SDKs for JavaScript.The Azure Communication Services Common SDK version should be `2.4.0` or later.

```console
npm install @azure/communication-common --save
npm install @azure/identity --save
npm install react react-dom --save
npm install vite --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

Add these scripts to your package.json:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## Implement the credential flow

In this quickstart, you will create a simple React application that uses the Azure Common SDK to obtain an access token for a Microsoft Entra ID user.

From the project directory:

1. Create a `index.html` file with the following content:

    ```html
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Entra ID Support Client</title>
        </head>
        <body>
            <div id="root"></div>
            <script type="module" src="/src/main.jsx"></script>
        </body>
    </html>
    ```
1. Create a `src` directory and inside it create a `main.jsx` file with the following content:

    ```javascript
    import React from "react";
    import ReactDOM from "react-dom/client";
    import App from "./App";

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
    ```
1. Create a `src/App.jsx` file with the following content and import the `AzureCommunicationTokenCredential` and `InteractiveBrowserCredential` classes from the Azure Communication Common and Azure Identity SDKs, respectively. Also make sure to update the `clientId`, `tenantId`, and `resourceEndpoint` variables with your Microsoft Entra client ID, tenant ID, and Azure Communication Services resource endpoint URI:

    ```javascript
    import React, { useState } from "react";
    import { AzureCommunicationTokenCredential } from "@azure/communication-common";    
    import { InteractiveBrowserCredential } from "@azure/identity";

    function App() {
        // Set your Microsoft Entra client ID and tenant ID, Azure Communication Services resource endpoint URI.
        const clientId = 'YOUR_ENTRA_CLIENT_ID';
        const tenantId = 'YOUR_ENTRA_TENANT_ID';
        const resourceEndpoint = 'YOUR_COMMUNICATION_SERVICES_RESOURCE_ENDPOINT';
        
        const [accessToken, setAccessToken] = useState("");
        const [error, setError] = useState("");
        
        const handleLogin = async () => {
            try {
                // Quickstart code goes here
                setError("");
            } catch (err) {
                console.error("Error obtaining token:", err);
                setError("Failed to obtain token: " + err.message);
            }
        };

        return (
            <div>
                <h2>Obtain Access Token for Entra ID User</h2>
                <button onClick={handleLogin}>Login and Get Access Token</button>
                {accessToken && (
                    <div>
                    <h4>Access Token:</h4>
                    <textarea value={accessToken} readOnly rows={6} cols={60} />
                    </div>
                )}
                {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
        );
    }

    export default App;
    ```
    You can import any implementation of the [TokenCredential](https://learn.microsoft.com/javascript/api/%40azure/core-auth/tokencredential) interface from the [Azure Identity SDK for JavaScript](https://www.npmjs.com/package/@azure/identity) to authenticate with Microsoft Entra ID. In this quickstart, we use the `InteractiveBrowserCredential` class, which is suitable for browser basic authentication scenarios. For a full list of the credentials offered, see [Credential Classes](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme#credential-classes).

<a name='step-1-obtain-entra-user-token-via-the-identity-library'></a>

### Step 1: Initialize implementation of TokenCredential from Azure Identity SDK

The first step in obtaining Communication Services access token for Entra ID user is getting  an Entra ID access token for your Entra ID user by using [Azure Identity](https://learn.microsoft.com/javascript/api/overview/azure/identity-readme) SDK. To enable authentication for users across multiple tenants, initialize the `InteractiveBrowserCredential` class with the authority set to `https://login.microsoftonline.com/organizations`. For more information, see [Authority](https://learn.microsoft.com//entra/identity-platform/msal-client-application-configuration#authority).

```javascript
// Initialize InteractiveBrowserCredential for use with AzureCommunicationTokenCredential.
const entraTokenCredential = new InteractiveBrowserCredential({
    tenantId: tenantId,
    clientId: clientId,
    authorityHost: "https://login.microsoftonline.com/organizations",
});
```

### Step 2: Initialize AzureCommunicationTokenCredential

Instantiate a `AzureCommunicationTokenCredential` with the TokenCredential created above and your Communication Services resource endpoint URI.

```javascript
// Set up AzureCommunicationTokenCredential to request a Communication Services access token for a Microsoft Entra ID user.
const entraCommunicationTokenCredential = new AzureCommunicationTokenCredential({
    resourceEndpoint: resourceEndpoint,
    tokenCredential: entraTokenCredential,
});
```

Providing scopes is optional. When not specified, the `https://communication.azure.com/clients/.default` scope is automatically used, requesting all API permissions for Communication Services Clients that have been registered on the client application.

<a name='step-3-obtain-acs-access-token-of-the-entra-id-user'></a>

### Step 3: Obtain Azure Communication Services access token for Microsoft Entra ID user

Use the `getToken` method to obtain an access token for the Entra ID user. The `AzureCommunicationTokenCredential` can be used with the Azure Communication Services SDKs.

```javascript
// To obtain a Communication Services access token for Microsoft Entra ID call getToken() function.
let accessToken = await entraCommunicationTokenCredential.getToken();
setAccessToken(accessToken.token);
```

## Run the code

From a console prompt, navigate to the directory *entra-id-users-support-quickstart* , then execute the following `npm` command to run the app.

```console
npm run dev 
```
