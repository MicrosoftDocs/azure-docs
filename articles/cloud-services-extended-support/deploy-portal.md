---
title: Deploy a Azure Cloud Service (extended support) - Azure portal
description: Deploy an Azure Cloud Service (extended support) using the Azure portal
ms.topic: tutorial
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Deploy a Azure Cloud Services (extended support) using the Azure portal
This article explains how to use the Azure portal to create a Cloud Service (extended support) deployment. 

## Before you begin

Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support) and create the associated resources. 

## Deploy a Cloud Services (extended support) 
1. Sign in to the [Azure portal](https://portal.azure.com).

2.	Using the search bar located at the top of the Azure portal, search for and select **Cloud Services (extended support)**.

    :::image type="content" source="media/deploy-portal-1.png" alt-text="Image shows the all resources blade in the Azure portal.":::
 
3.	In the Cloud Services (extended support) pane select **Create**. 

    :::image type="content" source="media/deploy-portal-2.png" alt-text="Image shows purchasing a cloud service from the marketplace.":::

4. The Cloud Services (extended support) creation window will open to the **Basics** tab. 
    - Select a Subscription.
    - Choose a resource group or create a new one.
    - Enter the desired name for your Cloud Service (extended support) deployment.
        - The DNS name of the cloud service is separate and specified by the DNS name label of the public IP address and can be modified in the public IP section in the configuration tab.
    -  Select the region to deploy to.

    :::image type="content" source="media/deploy-portal-3.png" alt-text="Image shows the Cloud Services (extended support) home blade.":::

5. Add your cloud service configuration, package and definition files. You can add existing files from blob storage or upload these from your local machine. If uploading from your local machine, these will be then be stored in a storage account. 

    :::image type="content" source="media/deploy-portal-4.png" alt-text="Image shows the upload section of the basics tab during creation.":::

6. Once all fields have been completed, move to and complete the **Configuration** tab. 
    - Select a virtual network to associate with the Cloud Service or create a new one. 
        - Cloud Service (extended support) deployments **must** be in a virtual network. The virtual network **must** also be referenced in the Service Configuration (.cscfg) file under the `NetworkConfiguration` section.
    - Select an existing public IP address to associate with the Cloud Service or create a new one.
        - If you have **IP Input Endpoints** defined in your Service Definition (.csdef) file, a public IP address will need to be created for your Cloud Service. 
        - Cloud Services (extended support) only supports the Basic IP address SKU.
        - If your Service Configuration (.cscfg) contains a reserved IP address, the allocation type for the public IP must be set tp **Static**. 
        - Optionally, assign a DNS name for your cloud service endpoint by updating the DNS label property of the Public IP address that is associated with the cloud service.  
    - (Optional) Start Cloud Service. Choose start or not start the service immediately after creation.
    - Select a Key Vault 
        - Key Vault is required when you specify one or more certificates in your Service Configuration (.cscfg) file. When you select a key vault we will try to find the selected certificates from your Service Configuration (.cscfg) file based on their thumbprints. If any certificates are missing from your key vault you can upload them now and click **Refresh**.   

 :::image type="content" source="media/deploy-portal-5.png" alt-text="Image shows the configuration blade in the Azure portal when creating a Cloud Services (extended support).":::

7. Once all fields have been completed, move to the **Review and Create** tab to validate your deployment configuration and create your Cloud Service (extended support).

## Next steps 
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support)
