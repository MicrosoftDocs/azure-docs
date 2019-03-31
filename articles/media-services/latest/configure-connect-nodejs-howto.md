---
title: Connect to Azure Media Services v3 API - Node.js
description: Learn how to connect to Media Services v3 API with Node.js.  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/25/2019
ms.author: juliako

---
# Connect to Media Services v3 API - Node.js

This article shows you how to connect to the Azure Media Services v3 node.js SDK using the service principal sign in method.

## Prerequisites

- Install [Node.js](https://nodejs.org/en/download/).
- [Create a Media Services account](create-account-cli-how-to.md). Be sure to remember the resource group name and the Media Services account name.

## Create package.json

1. Create a package.json file using your favorite editor.
1. Open the file and paste the following code:

```json
{
  "name": "media-services-node-sample",
  "version": "0.1.0",
  "description": "",
  "main": "./index.js",
  "dependencies": {
    "azure-arm-mediaservices": "^4.1.0",
    "azure-storage": "^2.8.0",
    "ms-rest": "^2.3.3",
    "ms-rest-azure": "^2.5.5"
  }
}
```

The following packages should be specified:

|Package|Description|
|---|---|
|`azure-arm-mediaservices`|Azure Media Services SDK. <br/>To make sure you are using the latest Azure Media Services package, check [NPM install azure-arm-mediaservices](https://www.npmjs.com/package/azure-arm-mediaservices/).|
|`azure-storage`|Storage SDK. Used when uploading files into assets.|
|`ms-rest-azure`| Used to sign in.|

You can run the following command to make sure you are using the latest package:

```
npm install azure-arm-mediaservices
```

## Connect to Node.js client

1. Create a .js file using your favorite editor.
1. Open the file and paste the following code.
1. Set the values in the "endpoint config" section to values you got from [access APIs](access-api-cli-how-to.md).

```js
'use strict';

const MediaServices = require('azure-arm-mediaservices');
const msRestAzure = require('ms-rest-azure');
const msRest = require('ms-rest');
const azureStorage = require('azure-storage');

// endpoint config
// make sure your URL values end with '/'
const armAadAudience = "";
const aadEndpoint = "";
const armEndpoint = "";
const subscriptionId = "";
const accountName = "";
const region = "";
const aadClientId = "";
const aadSecret = "";
const aadTenantId = "";
const resourceGroup = "";

let azureMediaServicesClient;

///////////////////////////////////////////
//     Entrypoint for sample script      //
///////////////////////////////////////////

msRestAzure.loginWithServicePrincipalSecret(aadClientId, aadSecret, aadTenantId, {
  environment: {
    activeDirectoryResourceId: armAadAudience,
    resourceManagerEndpointUrl: armEndpoint,
    activeDirectoryEndpointUrl: aadEndpoint
  }
}, async function(err, credentials, subscriptions) {
    if (err) return console.log(err);
    azureMediaServicesClient = new MediaServices(credentials, subscriptionId, armEndpoint, { noRetryPolicy: true });
    
    console.log("connected");

});
```

## Run your app

Open a command prompt. Browse to the sample's directory, and execute the following commands:

```
npm install 
node index.js
```

## See also

[.NET reference](https://docs.microsoft.com/dotnet/api/overview/azure/mediaservices/management?view=azure-dotnet)

## Next steps

- [Media Services concepts](concepts-overview.md)
- [Quickstart]()
- [Node.js reference](https://docs.microsoft.com/javascript/api/azure-arm-mediaservices/?view=azure-node-latest)
- [NPM install azure-arm-mediaservices](https://www.npmjs.com/package/azure-arm-mediaservices/)<br>
