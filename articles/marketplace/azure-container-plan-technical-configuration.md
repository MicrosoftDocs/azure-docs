---
title: Set plan technical configuration for an Azure Container offer in Microsoft AppSource.
description: Set plan technical configuration for an Azure Container offer in Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: keferna
ms.author: keferna
ms.date: 04/21/2021
---

# Set plan technical configuration for an Azure Container offer

Container images must be hosted in a private [Azure Container Registry](https://azure.microsoft.com/services/container-registry/). Use this page to provide reference information for your container image repository inside the Azure Container Registry.

After you submit the offer, your container image is copied to Azure Marketplace in a specific public container registry. All requests from Azure users to use your module are served from the Azure Marketplace public container registry, not your private container registry.

You can target multiple platforms and provide several versions of your module container image using tags. To learn more about tags and versioning, see [Prepare Azure Container technical assets](azure-container-technical-assets.md).

## Image repository details

Provide the **Azure subscription ID** where resource usage is reported and services are billed for the Azure Container Registry that includes your container image. You can find this ID on the [Subscriptions page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal.

Provide the [**Azure resource group name**](../azure-resource-manager/management/manage-resource-groups-portal.md) that contains the Azure Container Registry with your container image. The resource group must be accessible in the subscription ID (above). You can find the name on the [Resource groups](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) page in the Azure portal.

Provide the [**Azure container registry name**](../container-registry/container-registry-intro.md) that has your container image. The container registry must be present in the Azure resource group you provided earlier. Provide only the registry name, not the full login server name. Omit **azurecr.io** from the name. You can find the registry name on the [Container Registries page](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.ContainerRegistry%2Fregistries) in the Azure portal.

Provide the [**Admin username for the Azure Container Registry**](../container-registry/container-registry-authentication.md#admin-account) associated with the Azure Container Registry that has your container image. The username and password (next step) are required to ensure your company has access to the registry. To get the admin username and password, set the **admin-enabled** property to **True** using the Azure Command-Line Interface (CLI). You can optionally set **Admin user** to **Enable** in the Azure portal.

:::image type="content" source="media/azure-container/azure-create-12-update-container-registry-edit.png" alt-text="Illustrates the Update container registry dialog box.":::

Provide the **Admin password for the Azure Container Registry** for the admin username associated with the Azure Container Registry and has your container image. The username and password are required to ensure your company has access to the registry. You can get the password from the Azure portal by going to **Container Registry** > **Access Keys** or with Azure CLI using the [show command](/cli/azure/acr/credential#az-acr-credential-show).

:::image type="content" source="media/azure-container/azure-create-13-access-keys.png" alt-text="Illustrates the access key screen in the Azure portal.":::

Provide the **Repository name within the Azure Container Registry** that has your image. You specify the name of the repository when you push the image to the registry. You can find the name of the repository by going to the [Container Registry](https://azure.microsoft.com/services/container-registry/) > **Repositories page**. For more information, see [View container registry repositories in the Azure portal](../container-registry/container-registry-repositories.md). After the name is set, it can't be changed. Use a unique name for each offer in your account.

## Image versions

Customers must be able to automatically get updates from the Azure Marketplace when you publish an update. If they don't want to update, they must be able to stay on a specific version of your image. You can do this by adding new image tags each time you make an update to the image.

Select **Add Image version** to include an **Image tag** that points to the latest version of your image on all supported platforms. It must also include a version tag (for example, starting with xx.xx.xx, where xx is a number). Customers should use [manifest tags](https://github.com/estesp/manifest-tool) to target multiple platforms. All tags referenced by a manifest tag must also be added so we can upload them. All manifest tags (except the latest tag) must start with either X.Y- or X.Y.Z- where X, Y, and Z are integers. For example, if a latest tag points to `1.0.1-linux-x64`, `1.0.1-linux-arm32`, and `1.0.1-windows-arm32`, these six tags need to be added to this field. For details about tags and versioning, see [Prepare your Azure Container technical assets](azure-container-technical-assets.md).

> [!TIP]
> Add a test tag to your image so you can identify the image during testing.

<!-- possible future restore

## Samples

These examples show how the plan listing fields appear in different views.

These are the fields in Azure Marketplace when viewing plan details:

:::image type="content" source="media/azure-container/azure-create-10-plan-details-mtplc.png" alt-text="Illustrates the fields you see when viewing plan details in Azure Marketplace.":::

These are plan details on the Azure portal:

:::image type="content" source="media/azure-container/azure-create-11-plan-details-portal.png" alt-text="Illustrates plan details on the Azure portal.":::

Select **Save draft**, then **← Plan overview**  in the left-nav menu to return to the plan overview page.
-->
## Next steps

- To **Co-sell with Microsoft** (optional), select it in the left-nav menu. For details, see [Co-sell partner engagement](marketplace-co-sell.md).
- To **Resell through CSPs** (Cloud Solution Partners, also optional), select it in the left-nav menu. For details, see [Resell through CSP Partners](cloud-solution-providers.md).
- If you're not setting up either of these or you've finished, it's time to [Review and publish your offer](review-publish-offer.md).
