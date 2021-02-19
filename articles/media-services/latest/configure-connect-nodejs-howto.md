---
title: Connect to Azure Media Services v3 API - Node.js
description: This article demonstrates how to connect to Media Services v3 API with Node.js.  
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 02/17/2021
ms.author: inhenkel
ms.custom: devx-track-js
---
# Connect to Media Services v3 API - Node.js

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to connect to the Azure Media Services v3 node.js SDK using the service principal sign-in method.

## Prerequisites

- Install [Node.js](https://nodejs.org/en/download/).
- Install [Typescript](https://www.typescriptlang.org/download).
- [Create a Media Services account](./create-account-howto.md). Be sure to remember the resource group name and the Media Services account name.

> [!IMPORTANT]
> Review the Azure Media Services [naming conventions](media-services-apis-overview.md#naming-conventions) to understand the important naming restrictions on entities. 

## Reference documentation for @Azure/arm-mediaservices
- [Reference documentation for Azure Media Services modules for Node.js](https://docs.microsoft.com/javascript/api/overview/azure/media-services?view=azure-node-latest)

## More developer documentation for Node.js on Azure
- [Azure for JavaScript & Node.js developers](https://docs.microsoft.com/azure/developer/javascript/?view=azure-node-latest)
- [Media Services source code in the @azure/azure-sdk-for-js Git Hub repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)
- [Azure Package Documentation for Node.js developers](https://docs.microsoft.com/javascript/api/overview/azure/?view=azure-node-latest)

## Install the Packages

1. Create a package.json file using your favorite editor.
1. Open the file and paste the following code:

   Make sure to get the latest version of the [AzureMediaServices SDK for JavaScript](https://www.npmjs.com/package/@azure/arm-mediaservices).

```json
{
  "name": "media-services-node-sample",
  "version": "0.1.0",
  "description": "",
  "main": "./index.ts",
  "dependencies": {
    "@azure/arm-mediaservices": "^8.0.0",
    "@azure/abort-controller": "^1.0.2",
    "@azure/ms-rest-nodeauth": "^3.0.6",
    "@azure/storage-blob": "^12.4.0",
  }
}
```

The following packages should be specified:

|Package|Description|
|---|---|
|`@azure/arm-mediaservices`|Azure Media Services SDK. <br/>To make sure you are using the latest Azure Media Services package, check [npm install @azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices).|
|`@azure/ms-rest-nodeauth` | Required for AAD authentication using Service Principal or Managed Identity|
|`@azure/storage-blob`|Storage SDK. Used when uploading files into assets.|
|`@azure/ms-rest-js`| Used to sign in.|
|`@azure/storage-blob` | Used to upload and download files into Assets in Azure Media Services for encoding.|
|`@azure/abort-controller`| Used along with the storage client to time out long running download operations|


You can run the following command to make sure you are using the latest package:

### Install @azure/arm-mediaservices
```
npm install @azure/arm-mediaservices
```

### Install @azure/ms-rest-nodeauth

Please install minimum version of "@azure/ms-rest-nodeauth": "^3.0.0".

```
npm install @azure/ms-rest-nodeauth@"^3.0.0"
```

## Connect to Node.js client using TypeScript

1. Create a TypeScript .ts file using your favorite editor.
1. Open the file and paste the following code.
1. Create an .env file and fill out the details from the Azure portal. See [access APIs](./access-api-howto.md).

### Sample .env file
```
# copy the content of this file to a file named ".env". It should be stored at the root of the repo.
# The values can be obtained from the API Access page for your Media Services account in the portal.
AZURE_CLIENT_ID=""
AZURE_CLIENT_SECRET= ""
AZURE_TENANT_ID= ""

# Change this to match your AAD Tenant domain name. 
AAD_TENANT_DOMAIN = "microsoft.onmicrosoft.com"

# Set this to your Media Services Account name, resource group it is contained in, and location
AZURE_MEDIA_ACCOUNT_NAME = ""
AZURE_LOCATION= ""
AZURE_RESOURCE_GROUP= ""

# Set this to your Azure Subscription ID
AZURE_SUBSCRIPTION_ID= ""

# You must change these if you are using Gov Cloud, China, or other non standard cloud regions
AZURE_ARM_AUDIENCE= "https://management.core.windows.net"
AZURE_ARM_ENDPOINT="https://management.azure.com"

# DRM Testing
DRM_SYMMETRIC_KEY="add random base 64 encoded string here"
```

## Typescript - Hello World - List Assets
This sample shows how to connect to the Media Services client with a Service Principal and list Assets in the account. 
If you are using a fresh account, the list will come back empty. You can upload a few assets in the portal to see the results.

```ts
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { AzureMediaServices } from '@azure/arm-mediaservices';
import { AzureMediaServicesOptions } from "@azure/arm-mediaservices/esm/models";
// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

export async function main() {
  // Copy the samples.env file and rename it to .env first, then populate it's values with the values obtained 
  // from your Media Services account's API Access page in the Azure portal.
  const clientId = process.env.AZURE_CLIENT_ID as string;
  const secret = process.env.AZURE_CLIENT_SECRET as string;
  const tenantDomain = process.env.AAD_TENANT_DOMAIN as string;
  const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID as string;
  const resourceGroup = process.env.AZURE_RESOURCE_GROUP as string;
  const accountName = process.env.AZURE_MEDIA_ACCOUNT_NAME as string;

  let clientOptions: AzureMediaServicesOptions = {
    longRunningOperationRetryTimeout: 5, // set the time out for retries to 5 seconds
    noRetryPolicy: false // use the default retry policy.
  }

  const creds = await msRestNodeAuth.loginWithServicePrincipalSecret(clientId, secret, tenantDomain);
  const mediaClient = new AzureMediaServices(creds, subscriptionId, clientOptions);

  // List Assets in Account
  console.log("Listing Assets Names in account:")
  var assets = await mediaClient.assets.list(resourceGroup, accountName);

  assets.forEach(asset => {
    console.log(asset.name);
  });

  if (assets.odatanextLink) {
    console.log("There are more than 1000 assets in this account, use the assets.listNext() method to continue listing more assets if needed")
    console.log("For example:  assets = await mediaClient.assets.listNext(assets.odatanextLink)");
  }
}

main().catch((err) => {
  console.error("Error running sample:", err.message);
});
```

## Run the sample application HelloWorld-ListAssets

Clone the repository for the Node.js Samples

```git
git clone https://github.com/Azure-Samples/media-services-v3-node-tutorials.git
```

Change directory into the AMSv3Samples folder
```bash
cd AMSv3Samples
```

Install the packages used in the packages.json
```
npm install 
```

Change directory into the HelloWorld-ListAssets folder
```bash
cd HelloWorld-ListAssets
```

Launch Visual Studio Code from the AMSv3Samples Folder. This is required to launch from the folder where the ".vscode" folder and tsconfig.json files are located
```dotnetcli
cd ..
code .
```

Open the folder for HelloWorld-ListAssets, and open the index.ts file in the Visual Studio Code editor.
While in the index.ts file, press F5 to launch the debugger. You should see a list of assets displayed if you have assets already in the account. If the account is empty, you will see an empty list.  Upload a few assets in the portal to see the results.

## More Samples

The following samples are available in the [repository](https://github.com/Azure-Samples/media-services-v3-node-tutorials)

|Project name|Use Case|
|---|---|
|Live/index.ts| Basic live streaming example. **WARNING**, make sure to check that all resources are cleaned up and no longer billing in portal when using live|
|StreamFilesSample/index.ts| Basic example for uploading a local file or encoding from a source URL. Sample shows how to use storage SDK to download content, and shows how to stream to a player |
|StreamFilesWithDRMSample/index.ts| Demonstrates how to encode and stream using Widevine and PlayReady DRM |
|VideoIndexerSample/index.ts| Example of using the Video and Audio Analyzer presets to generate metadata and insights from a video or audio file |

## See also

- [Media Services concepts](concepts-overview.md)
- [npm install @azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices)
- [Azure for JavaScript & Node.js developers](https://docs.microsoft.com/azure/developer/javascript/?view=azure-node-latest)
- [Media Services source code in the @azure/azure-sdk-for-js repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)

## Next steps

Explore the Media Services [Node.js ref](/javascript/api/overview/azure/mediaservices/management) documentation and check out [samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials) that show how to use Media Services API with node.js.
