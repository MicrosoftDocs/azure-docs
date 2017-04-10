---
title: Connect a Web App to a Content Deliver Network | Microsoft Docs
description: Connect a Web App to a Content Deliver Network to deliver your static files from edge nodes.
services: app-service
author: syntaxc4
ms.author: cfowler
ms.date: 04/03/2017
ms.topic: hero-article
ms.service: app-service-web
manager: erikre
---
# Connect a Web App to a Content Delivery Network

In this tutorial, you will create an Azure CDN Profile and an Azure CDN Endpoint to serve the static files from your Web App via the Azure CDN pop locations.

> [!TIP]
> Review the update to date list of [Azure CDN pop locations](https://docs.microsoft.com/en-us/azure/cdn/cdn-pop-locations).
>

## Before you begin

Before running this sample, install the following prerequisites locally:

1. [Download and install git](https://git-scm.com/)
1. Download and install the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample

Clone the sample app repository to your local machine.

```bash
git clone https://github.com/Azure-Samples/
```

> [!TIP]
> Alternatively, you can [download the sample](https://github.com/Azure-Samples//archive/master.zip) as a zip file and extract it.

Change to the directory that contains the sample code.

```bash
cd 
```

## Step 1 - Login to Azure Portal

First, open your favorite browser and browse to the Azure [Portal](https://portal.azure.com).

## Step 2 - Create a CDN Profile

Click the `+ New` button in the left hand navigation, Click on **Web + Mobile**. Under the Web + Mobile category, select **CDN**.

Specify the following fields:

| Field | Description |
|---|---|
| Name | A name for the CDN profile. |
| Location | This is the Azure location where your CDN profile information will be stored. It has no impact on CDN endpoint locations. |
| Resource group | For more information on Resource Groups, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview#resource-groups) |
| Pricing tier | See the [CDN Overview](../cdn/cdn-overview#azure-cdn-features) for a comparison of pricing tiers. |

Click **Create**.

Open the resource groups hub from the left hand navigation, select **myResourceGroup**. From the resource listing, select **myCDNProfile**.

![azure-cdn-profile-created](media/app-service-web-tutorial-content-delivery-network/azure-cdn-profile-created.png)

## Step 3 - Create a CDN Endpoint

Click on `+ Endpoint` from the commands beside the search box, this will launch the Endpoint creation blade.

Specify the following fields:

| Field | Description |
|---|---|
| Name | This name will be used to access your cached resources at the domain `<endpointname>.azureedge.net` |
| Origin type | Select WebApp. Selecting an origin type provides you with contextual menus for the remaining fields. Selecting custom origin, will provide you with a text field for your origin hostname. |
| Origin hostname |  The dropdown will list all available origins of the origin type you specified. If you selected Custom origin as your Origin type, you will type in the domain of your custom origin  |

Click **Add**.

The Endpoint will be created, once the Content Delivery Network endpoint is created the status will be updated to **running**.

![azure-cdn-endpoint-created](media/app-service-web-tutorial-content-delivery-network/azure-cdn-endpoint-created.png)

## Step 4 - Add a Custom Domain



## Step 5 - Version content with query strings



## Next Steps

