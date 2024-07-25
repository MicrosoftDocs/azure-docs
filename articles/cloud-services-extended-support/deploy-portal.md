---
title: Deploy Azure Cloud Services (extended support) - Azure portal
description: Deploy Azure Cloud Services (extended support) by using the Azure portal.
ms.topic: quickstart
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 07/24/2024
---

# Deploy Cloud Services (extended support) by using the Azure portal

This article shows you how to use the Azure portal to create an Azure Cloud Services (extended support) deployment.

## Prerequisites

Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support) and create the required resources.

## Deploy Cloud Services (extended support)

To deploy Cloud Services (extended support) by using the portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter **Cloud Services (extended support)**, and then select it in the search results.

    :::image type="content" source="media/deploy-portal-1.png" alt-text="Screenshot that shows a Cloud Services (extended support) search in the Azure portal, and selecting the result.":::

1. On the **Cloud services (extended support)** services pane, select **Create**.

    :::image type="content" source="media/deploy-portal-2.png" alt-text="Screenshot that shows selecting Create in the menu to create a new instance of Cloud Services (extended support).":::

    The **Create a cloud service (extended support)** pane opens.

1. On the **Basics** tab, select or enter the following information:

    - **Subscription**: Select a subscription to use for the deployment.
    - **Resource group**: Select an existing resource group, or create a new one.
    - **Cloud service name**: Enter a name for your Cloud Services (extended support) deployment.
        - The DNS name of the cloud service is separate and is specified by the DNS name label of the public IP address. You can modify the DNS name in **Public IP** on the **Configuration** tab.
    - **Region**: Select the region to deploy the service to.

    :::image type="content" source="media/deploy-portal-3.png" alt-text="Image shows the Cloud Services (extended support) Basics tab.":::

1. On the **Basics** tab under **Cloud service configuration, package, and service definition**, add your package (.cspkg or .zip) file, configuration (.cscfg) file, and definition (.csdef) file for the deployment. You can add existing files from blob storage or upload the files from your local machine. If you upload the files from your local machine, the files are then stored in a storage account in Azure.

    :::image type="content" source="media/deploy-portal-4.png" alt-text="Screenshot that shows the section of the Basics tab where you upload files and select storage.":::

1. Select the **Configuration** tab, and then select or enter the following information:

    - **Virtual network**: Select a virtual network to associate with the cloud service, or create a new virtual network.

      - Cloud Services (extended support) deployments *must* be in a virtual network.
      - The virtual network *must* also be referenced in the configuration (.cscfg) file under `NetworkConfiguration`.

    - **Public IP**: Select an existing public IP address to associate with the cloud service, or create a new one.

        - If you have IP input endpoints defined in your definition (.csdef) file, create a public IP address for your cloud service.
        - Cloud Services (extended support) supports only a Basic SKU public IP address.
        - If your configuration (.cscfg) file contains a reserved IP address, set the allocation type for the public IP address to **Static**.
        - (Optional) You can assign a DNS name for your cloud service endpoint by updating the DNS label property of the public IP address associated with the cloud service.  
    - (Optional) **Start cloud service**: Select the checkbox if you want to start the service immediately after it deploys.
    - **Key vault**: Select a key vault.
        - A key vault is required when you specify one or more certificates in your configuration (.cscfg) file. When you select a key vault, we attempt to find the selected certificates that are defined in your configuration (.cscfg) file based on the certificate thumbprints. If any certificates are missing from your key vault, you can upload them now    , and then select **Refresh**.  

   :::image type="content" source="media/deploy-portal-5.png" alt-text="Screenshot that shows the Configuration tab in the Azure portal when you create a Cloud Services (extended support) deployment.":::

1. When all information is entered or selected, select the **Review + Create** tab to validate your deployment configuration and create your Cloud Services (extended support) deployment.

## Related content

- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy Cloud Services (extended support) by using [Azure PowerShell](deploy-powershell.md), an [ARM template](deploy-template.md), or [Visual Studio](deploy-visual-studio.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support).
