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

This article shows you how to connect to the Azure Media Services v3 node.js SDK using the service principal sign-in method. You will work with files in the *media-services-v3-node-tutorials* samples repository. The *HelloWorld-ListAssets* sample contains the code for connecting then list Assets in the account.

## Prerequisites

- An installation of Visual Studio Code.
- Install [Node.js](https://nodejs.org/en/download/).
- Install [Typescript](https://www.typescriptlang.org/download).
- [Create a Media Services account](./create-account-howto.md). Be sure to remember the resource group name and the Media Services account name.
- Create a service principal for your application. See [access APIs](./access-api-howto.md).<br/>**Pro tip!** Keep this window open or copy everything in the JSON tab to Notepad. 
- Make sure to get the latest version of the [AzureMediaServices SDK for JavaScript](https://www.npmjs.com/package/@azure/arm-mediaservices).

> [!IMPORTANT]
> Review the Azure Media Services [naming conventions](media-services-apis-overview.md#naming-conventions) to understand the important naming restrictions on entities.

## Clone the Node.JS samples repo

You will work with some files in Azure Samples. Clone the Node.JS samples repository.

```git
git clone https://github.com/Azure-Samples/media-services-v3-node-tutorials.git
```

## Install the packages

### Install @azure/arm-mediaservices

```bash
npm install @azure/arm-mediaservices
```

### Install @azure/ms-rest-nodeauth

Please install minimum version of "@azure/ms-rest-nodeauth": "^3.0.0".

```bash
npm install @azure/ms-rest-nodeauth@"^3.0.0"
```

For this example, you will use the following packages in the `package.json` file.

|Package|Description|
|---|---|
|`@azure/arm-mediaservices`|Azure Media Services SDK. <br/>To make sure you are using the latest Azure Media Services package, check [npm install @azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices).|
|`@azure/ms-rest-nodeauth` | Required for AAD authentication using Service Principal or Managed Identity|
|`@azure/storage-blob`|Storage SDK. Used when uploading files into assets.|
|`@azure/ms-rest-js`| Used to sign in.|
|`@azure/storage-blob` | Used to upload and download files into Assets in Azure Media Services for encoding.|
|`@azure/abort-controller`| Used along with the storage client to time out long running download operations|

### Create the package.json file

1. Create a `package.json` file using your favorite editor.
1. Open the file and paste the following code:

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

## Connect to Node.js client using TypeScript



### Sample *.env* file

Copy the content of this file to a file named *.env*. It should be stored at the root of your working repository. These are the values you got from the API Access page for your Media Services account in the portal.

Once you have created the *.env* file, you can start working with the samples.

```nodejs
# Values from the API Access page in the portal
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

## Run the sample application *HelloWorld-ListAssets*

1. Change directory into the *AMSv3Samples* folder

```bash
cd AMSv3Samples
```

2. Install the packages used in the *packages.json* file.

```
npm install 
```

3. Change directory into the *HelloWorld-ListAssets* folder.

```bash
cd HelloWorld-ListAssets
```

4. Launch Visual Studio Code from the AMSv3Samples Folder. This is required to launch from the folder where the ".vscode" folder and tsconfig.json files are located

```dotnetcli
cd ..
code .
```

Open the folder for *HelloWorld-ListAssets*, and open the *index.ts* file in the Visual Studio Code editor.

While in the *index.ts* file, press F5 to launch the debugger. You should see a list of assets displayed if you have assets already in the account. If the account is empty, you will see an empty list.  

To quickly see assets listed, use the portal to upload a few video files. Assets will automatically be created each one and running this script again will then return their names.

### A closer look at the *HelloWorld-ListAssets* sample

The *HelloWorld-ListAssets* sample shows you how to connect to the Media Services client with a Service Principal and list Assets in the account. See the comments in the code for a detailed explanation of what it does.

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

## More Samples

The following samples are available in the [repository](https://github.com/Azure-Samples/media-services-v3-node-tutorials)

|Project name|Use Case|
|---|---|
|Live/index.ts| Basic live streaming example. **WARNING**, make sure to check that all resources are cleaned up and no longer billing in portal when using live|
|StreamFilesSample/index.ts| Basic example for uploading a local file or encoding from a source URL. Sample shows how to use storage SDK to download content, and shows how to stream to a player |
|StreamFilesWithDRMSample/index.ts| Demonstrates how to encode and stream using Widevine and PlayReady DRM |
|VideoIndexerSample/index.ts| Example of using the Video and Audio Analyzer presets to generate metadata and insights from a video or audio file |

## See also

- [Reference documentation for Azure Media Services modules for Node.js](/javascript/api/overview/azure/media-services)
- [Azure for JavaScript & Node.js developers](/azure/developer/javascript/)
- [Media Services source code in the @azure/azure-sdk-for-js Git Hub repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)
- [Azure Package Documentation for Node.js developers](/javascript/api/overview/azure/)
- [Media Services concepts](concepts-overview.md)
- [npm install @azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices)
- [Azure for JavaScript & Node.js developers](/azure/developer/javascript/)
- [Media Services source code in the @azure/azure-sdk-for-js repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)

## Next steps

Explore the Media Services [Node.js ref](/javascript/api/overview/azure/mediaservices/management) documentation and check out [samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials) that show how to use Media Services API with node.js.
