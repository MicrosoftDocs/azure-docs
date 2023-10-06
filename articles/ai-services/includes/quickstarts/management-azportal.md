---
title: "Quickstart: Create an Azure AI services resource in the Azure portal"
titleSuffix: Azure AI services
description: Get started with Azure AI services by creating and subscribing to a resource in the Azure portal.
services: cognitive-services
author: aahill
manager: nitinme
keywords: Azure AI services, cognitive intelligence, cognitive solutions, ai services
ms.service: cognitive-services
ms.topic: quickstart
ms.date: 02/13/2023
ms.author: aahi
---

## Prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
* [!INCLUDE [contributor-requirement](./contributor-requirement.md)]

## Create a new multi-service resource

The multi-service resource is listed under **Azure AI services** > **Azure AI services multi-service account** in the portal. To create a multi-service resource follow these instructions:
1. Select this link to create a multi-service resource: [https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne)

1. On the **Create** page, provide the following information:

    |Project details| Description   |
    |--|--|
    | **Subscription** | Select one of your available Azure subscriptions. |
    | **Resource group** | The Azure resource group that will contain your Azure AI services resource. You can create a new group or add it to a pre-existing group. |
    | **Region** | The location of your Azure AI service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
    | **Name** | A descriptive name for your Azure AI services resource. For example, *MyCognitiveServicesResource*. |
    | **Pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).

    :::image type="content" source="../../media/cognitive-services-apis-create-account/resource_create_screen-multi.png" alt-text="Multi-service resource creation screen":::

1. Configure other settings for your resource as needed, read and accept the conditions (as applicable), and then select **Review + create**.

> [!Tip]
> If your subscription doesn't allow you to create an Azure AI services resource, you may need to enable the privilege of that [Azure resource provider](../../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) using the [Azure portal](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal), [PowerShell command](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell) or an [Azure CLI command](../../../azure-resource-manager/management/resource-providers-and-types.md#azure-cli). If you are not the subscription owner, ask the *Subscription Owner* or someone with a role of *admin* to complete the registration for you or ask for the **/register/action** privileges to be granted to your account.

## Get the keys for your resource

1. After your resource is successfully deployed, select **Next Steps** > **Go to resource**.

    :::image type="content" source="../../media/cognitive-services-apis-create-account/cognitive-services-resource-deployed.png" alt-text="Get resource keys screen":::

1. From the quickstart pane that opens, you can access the resource endpoint and manage keys.

[!INCLUDE [environment-variables](environment-variables.md)]

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources contained in the group.

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
1. Locate the resource group containing the resource to be deleted.
1. If you want to delete the entire resource group, select the resource group name. On the next page, Select **Delete resource group**, and confirm.
1. If you want to delete only the Azure AI services resource, select the resource group to see all the resources within it. On the next page, select the resource that you want to delete, select the ellipsis menu for that row, and select **Delete**.

If you need to recover a deleted resource, see [Recover or purge deleted Azure AI services resources](../../recover-purge-resources.md).

