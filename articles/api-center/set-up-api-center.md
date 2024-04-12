---
title: Quickstart - Create your Azure API center (preview) | Microsoft Docs
description: In this quickstart, use the Azure portal to set up an API center for API discovery, reuse, and governance. 
author: dlepow
ms.service: api-center
ms.topic: quickstart
ms.date: 11/07/2023
ms.author: danlep 
---

# Quickstart: Create your API center

Create your [API center](overview.md) to start an inventory of your organization's APIs. The API Center service enables tracking APIs in a centralized location for discovery, reuse, and governance.

After creating your API center, follow the steps in the tutorials to add custom metadata, APIs, versions, definitions, and other information.

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]


## Prerequisites

* If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* At least a Contributor role assignment or equivalent permissions in the Azure subscription. 


## Register the Microsoft.ApiCenter provider

If you haven't already, you need to register the **Microsoft.ApiCenter** resource provider in your subscription, using the portal or other tools. You only need to register the resource provider once. For steps, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider). 

## Create an API center

1. [Sign in](https://portal.azure.com) to the Azure portal.

1. In the search bar, enter *API Centers*. 

1. Select **+ Create**. 

1. On the **Basics** tab, select or enter the following settings: 

    1. Select your Azure subscription. 

    1. Select an existing resource group, or select **New** to create a new one. 

    1. Enter a **Name** for your API center. It must be unique in the region where you're creating your API center. 

    1. In **Region**, select one of the [available regions](overview.md#available-regions) for API Center preview. 

1. Optionally, on the **Tags** tab, add one or more name/value pairs to help you categorize your Azure resources.

1. Select **Review + create**. 

1. After validation completes, select **Create**.

After deployment, your API center is ready to use!


## Next steps

Now you can start adding information to the inventory in your API center. To help you organize your APIs and other information, begin by defining custom metadata properties in your API center.

> [!div class="nextstepaction"]
> [Define metadata properties](add-metadata-properties.md)

