---
title: Stream video files with Azure Media Services - .NET | Microsoft Docs
description: Follow the steps of this quickstart to create a new Azure Media Services account, encode a file, and stream it to Azure Media Player.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''
keywords: azure media services, stream

ms.service: media-services
ms.workload: media
ms.topic: quickstart
ms.custom: mvc
ms.date: 04/08/2018
ms.author: juliako
#Customer intent: As a developer, I want to create a Media Services account so that I can store, encrypt, encode, manage, and stream media content in Azure.
---

# Quickstart: Stream video files - .NET

> [!NOTE]
> The latest version of Azure Media Services is in Preview and may be referred to as v3. To start using v3 APIs, you should create a new Media Services account, as described in this quickstart. 

This quickstart shows you how easy it is to start streaming videos on a wide variety of browsers and devices using Azure Media Services. 

By the end of the quickstart you will be able to stream a video.  

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

If you do not have Visual Studio installed, you can get [Visual Studio Community 2017](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community&rel=15).

## Download the sample

Clone a GitHub repository that contains the streaming .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts.git
 ```

For explanations about what each function in the sample does, examine the code and look at the comments in [this source file](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs).

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create a Media Services account

You first need to create a Media Services account. This section shows what you need for the acount creation using CLI 2.0.

### Create a resource group

Create a resource group using the following command. An Azure resource group is a logical container into which resources like Azure Media Services accounts and the associated Storage accounts are deployed and managed.

```azurecli-interactive
az group create --name amsResourcegroup --location westus2
```

### Create a storage account

When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. 

The following command creates a Storage account that is going to be associated with the Media Services account. In the script below, substitute the `storageaccountforams` placeholder. The account name must have length less than 24.

```azurecli-interactive
az storage account create --name <storageaccountforams> --resource-group amsResourcegroup
```

### Create a Media Services account

Below you can find the Azure CLI commands that creates a new Media Services account. You just need to replace the following highlighted values: `amsaccountname` and `storageaccountforams`.

```azurecli-interactive
az ams account create --name <amsaccountname> --resource-group amsResourcegroup --storage-account <storageaccountforams>
```

## Access the Media Services API

To connect to the latest version of Azure Media Services APIs, you use the Azure AD service principal authentication. The following command creates an Azure AD application and attaches a service principal to the account. You are going to use the returned values to configure you .NET app, as shown in the following step.

Before running the script, replace the `amsaccountname` placeholder. `amsaccountname` is the name of the Azure Media Services account where to attach the service principal. <br/>The command that follows uses the `xml` option that returns an xml that you can paste in your app.config. If you omit the `xml` option, the response will be in `json`.

```azurecli-interactive
az ams account sp create --account-name <amsaccountname> --resource-group amsResourcegroup --xml
```

This command will produce a response similar to this:

```xml
<add key="Region" value="West US 2" />
<add key="ResourceGroup" value="testams_rg" />
<add key="AadEndpoint" value="https://login.microsoftonline.com" />
<add key="AccountName" value="testamsaccountname" />
<add key="SubscriptionId" value="111111111-0000-2222-3333-55555555555" />
<add key="ArmAadAudience" value="https://management.core.windows.net/" />
<add key="AadTenantId" value="2222222222-0000-2222-3333-6666666666666" />
<add key="AadSecret" value="33333333-0000-2222-3333-55555555555" />
<add key="AadClientId" value="44444444-0000-2222-3333-55555555555" />
<add key="ArmEndpoint" value="https://management.azure.com/" />
```
### Configure the sample app

To run the app and access the Media Services APIs, you need to specify the correct access values in App.config. 

1. Open Visual Studio.
2. Browse to the solution that you cloned.
3. In the Solution Explorer, unfold the *EncodeAndStreamFiles* project.
4. Set this project as the start up project.
5. Open App.config.
6. Replace the appSettings values with the values that you got in the previous step.

 ```xml
 <add key="Region" value="value" />
 <add key="ResourceGroup" value="value" />
 <add key="AadEndpoint" value="value" />
 <add key="AccountName" value="value" />
 <add key="SubscriptionId" value="value" />
 <add key="ArmAadAudience" value="value" />
 <add key="AadTenantId" value="value" />
 <add key="AadSecret" value="value" />
 <add key="AadClientId" value="value" />
 <add key="ArmEndpoint" value="value" />
 ```    
 
7. Press Ctrl+Shift+B to build the solution.

## Run the sample app

When you run the app, a URL that can be used to playback the video using the Apple's **HLS** protocol will be displayed:

1. Press Ctrl+F5 to run the *EncodeAndStreamFiles* application.
2. Copy the streaming URL from the console.

In the sample's [source code](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs), you can see how the URL is built. To build it, you need to concatenate the streaming endpoint's host name and the streaming locator path.  

## Test with Azure Media Player

1. Open a web browser and browse to https://ampdemo.azureedge.net/.
2. In the **URL:** box, paste the streaming URL value you got when you ran the application.  
3. Press **Update Player**.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this Quickstart, delete the resource group. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name amsResourcegroup
```

## Examine the code

For explanations about what each function in the sample does, examine the code and look at the comments in [this source file](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs).

The [upload, encode, and stream files](stream-files-tutorial-with-api.md) tutorial gives you a more advanced streaming example with detailed explanations. 

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
