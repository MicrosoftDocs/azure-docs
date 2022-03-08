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
ms.devlang: javascript
ms.topic: how-to
ms.date: 12/13/2021
ms.author: inhenkel
ms.custom: devx-track-js
---
# Connect to Media Services v3 API - Node.js

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to connect to the Azure Media Services v3 node.js SDK using the service principal sign-in method. You will work with files in the *media-services-v3-node-tutorials* samples repository. The *HelloWorld-ListAssets* sample contains the code for connecting then list Assets in the account.

## Prerequisites

- An installation of Visual Studio Code.
- Install [Node.js](https://nodejs.org/en/download/).
- Install [TypeScript](https://www.typescriptlang.org/download).
- [Create a Media Services account](./account-create-how-to.md). Be sure to remember the resource group name and the Media Services account name.
- Create a service principal for your application. See [access APIs](./access-api-howto.md).<br/>**Pro tip!** Keep this window open or copy everything in the JSON tab to Notepad. 
- Make sure to get the latest version of the [AzureMediaServices SDK for JavaScript](https://www.npmjs.com/package/@azure/arm-mediaservices).

> [!IMPORTANT]
> Review the Azure Media Services [naming conventions](media-services-apis-overview.md#naming-conventions) to understand the important naming restrictions on entities.

## Clone the Node.JS samples repo

You will work with some files in Azure Samples. Clone the Node.JS samples repository.

```git
git clone https://github.com/Azure-Samples/media-services-v3-node-tutorials.git
```

## Install the Node.js packages

### Install @azure/arm-mediaservices

```bash
npm install @azure/arm-mediaservices
```

For this example, you will use the following packages in the `package.json` file.

|Package|Description|
|---|---|
|`@azure/arm-mediaservices`|Azure Media Services SDK. <br/>To make sure you are using the latest Azure Media Services package, check [npm install @azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices).|
|`@azure/identity` | Required for Azure AD authentication using Service Principal or Managed Identity|
|`@azure/storage-blob`|Storage SDK. Used when uploading files into assets.|
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
    "@azure/arm-mediaservices": "^10.0.0",
    "@azure/abort-controller": "^1.0.2",
    "@azure/identity": "^2.0.0",
    "@azure/storage-blob": "^12.4.0"
  }
}
```

## Connect to Node.js client using TypeScript

### Sample *.env* file

Copy the content of this file to a file named *.env*. It should be stored at the root of your working repository. These are the values you got from the API Access page for your Media Services account in the portal.

To access the values needed for entering into the *.env* file, it is recommended to first read and review the how-to article [Access the API](./access-api-howto.md).
You can use either the Azure portal or the CLI to get the values needed to enter into this sample's environment variables file.

Once you have created the *.env* file, you can start working with the samples.

```nodejs
# Values from the API Access page in the portal
AADCLIENTID="00000000-0000-0000-0000-000000000000"
AADSECRET="00000000-0000-0000-0000-000000000000"
AADTENANTID="00000000-0000-0000-0000-000000000000"

# Change this to match your Azure AD Tenant domain name. 
AADTENANTDOMAIN="microsoft.onmicrosoft.com"

# Set this to your Media Services Account name, resource group it is contained in, and location
ACCOUNTNAME="amsaccount"
RESOURCEGROUP="amsResourceGroup"

# Set this to your Azure Subscription ID
SUBSCRIPTIONID="00000000-0000-0000-0000-000000000000"

# You must change this if you are using Gov Cloud, China, or other non standard cloud regions
AADENDPOINT="https://login.microsoftonline.com"

# DRM Testing
DRMSYMMETRICKEY="add random base 64 encoded string here"
```

## Run the sample application *HelloWorld-ListAssets*


1. Launch Visual Studio Code from the root Folder. 

```bash
cd media-services-v3-node-tutorials
code .
```

2. Install the packages used in the *package.json* file from a Terminal

```
npm install 
```
3. Make a copy of the *sample.env* file,  rename it to *.env* and update the values in the file to match your account and subscription information. You may need to gather this information from the Azure portal first. 

4. Change directory into the *HelloWorld-ListAssets* folder

```bash
cd HelloWorld-ListAssets
```

5. Open the *list-assets.ts* file in the HelloWorld-ListAssets folder and press the F5 key in Visual Studio code to begin running the script. You should see a list of assets displayed if you have assets already in the account. If the account is empty, you will see an empty list.  

To quickly see assets listed, use the portal to upload a few video files. Assets will automatically be created each one and running this script again will then return their names.

### A closer look at the *HelloWorld-ListAssets* sample

The *HelloWorld-ListAssets* sample shows you how to connect to the Media Services client with a Service Principal and list Assets in the account. See the comments in the code for a detailed explanation of what it does.

```ts
import { DefaultAzureCredential } from "@azure/identity";
import {
  AzureMediaServices
} from '@azure/arm-mediaservices';

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

export async function main() {
  // Copy the samples.env file and rename it to .env first, then populate it's values with the values obtained 
  // from your Media Services account's API Access page in the Azure portal.
  const clientId: string = process.env.AADCLIENTID as string;
  const secret: string = process.env.AADSECRET as string;
  const tenantDomain: string = process.env.AADTENANTDOMAIN as string;
  const subscriptionId: string = process.env.SUBSCRIPTIONID as string;
  const resourceGroup: string = process.env.RESOURCEGROUP as string;
  const accountName: string = process.env.ACCOUNTNAME as string;

  // This sample uses the default Azure Credential object, which relies on the environment variable settings.
  // If you wish to use User assigned managed identity, see the samples for v2 of @azure/identity
  // Managed identity authentication is supported via either the DefaultAzureCredential or the ManagedIdentityCredential classes
  // https://docs.microsoft.com/javascript/api/overview/azure/identity-readme?view=azure-node-latest
  // See the following examples for how to authenticate in Azure with managed identity
  // https://github.com/Azure/azure-sdk-for-js/blob/@azure/identity_2.0.1/sdk/identity/identity/samples/AzureIdentityExamples.md#authenticating-in-azure-with-managed-identity 


  // const credential = new ManagedIdentityCredential("<USER_ASSIGNED_MANAGED_IDENTITY_CLIENT_ID>");
  const credential = new DefaultAzureCredential();

  let mediaServicesClient =  new AzureMediaServices(credential, subscriptionId)

  // List Assets in Account
  console.log("Listing assets in account:")
  for await (const asset of mediaServicesClient.assets.list(resourceGroup, accountName, { top:1000 })){
    console.log(asset.name);
  }

}

main().catch((err) => {
  console.error("Error running sample:", err.message);
});
```

## More samples

Many more samples are available in the [repository](https://github.com/Azure-Samples/media-services-v3-node-tutorials). Please review the readme file for the latest updated samples.

## References for Media Services JavaScript/TypeScript developers

- [npm install @azure/arm-mediaservices](https://www.npmjs.com/package/@azure/arm-mediaservices)
- [Reference documentation for Azure Media Services modules for Node.js](/javascript/api/overview/azure/media-services)
- [Azure for JavaScript & Node.js developers](/azure/developer/javascript/)
- [Media Services source code in the @azure/azure-sdk-for-js Git Hub repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)
- [Azure Package Documentation for Node.js developers](/javascript/api/overview/azure/)
- [Media Services concepts](concepts-overview.md)
- [Azure for JavaScript & Node.js developers](/azure/developer/javascript/)
- [Media Services source code in the @azure/azure-sdk-for-js repo](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/mediaservices/arm-mediaservices)

## Next steps

Explore the Media Services [Node.js ref](/javascript/api/overview/azure/arm-mediaservices-readme) documentation and check out [samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials) that show how to use Media Services API with node.js.
