---
title: Deploy an Azure Cloud Service (extended support) - portal
description: Deploy an Azure Cloud Service (extended support) using the Azure portal
ms.topic: tutorial
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Deploy Azure Cloud Services (extended support) using the Azure portal
This article explains how to use the Azure portal to create a Cloud Service (extended support) deployment. 

> [!IMPORTANT]
> Cloud Services (extended support) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Register the feature for your subscription
Cloud Services (extended support) is currently in preview. Register the feature for your subscription as follows:

```powershell
Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
```

## Create a Cloud Service (extended support)
1.	Sign in to the Azure portal
2.	Select **Create a resource** and search for Cloud Services (extended support)

    :::image type="content" source="media/deploy-portal-1.png" alt-text="Image shows the all resources blade in the Azure portal.":::
 
3.	In the Cloud Services (extended support) pane select **Create**.

    :::image type="content" source="media/deploy-portal-2.png" alt-text="Image shows purchasing a cloud service from the marketplace.":::

## Configuring the Cloud Services (extended support) deployment

1. Select the Subscription.

    > [!NOTE]
    > The subscription used for deploying Cloud Services (extended support) needs to have one of the following roles (owner or contributor) assigned via Azure Resource Manager role based access control (RBAC). If your subscription does not have one of these roles, make sure it is added before proceeding further.
    
2. Choose a resource group or create a new one.
3. Enter the desired name for your Cloud Service (extended support) deployment.
4. Select the region to deploy to.

    :::image type="content" source="media/deploy-portal-3.png" alt-text="Image shows the basics tab in the Azure portal for creating a Cloud Service (extended support).":::

5. Select your configuration (cscfg) file. You can use an existing configuration file or upload a new one.
6. Select your service definition (csdef) file. You can use an existing definition file or upload a new one. 

    :::image type="content" source="media/deploy-portal-4.png" alt-text="Image shows the upload section of the basics tab during creation.":::

7. Once all fields have been completed, move to the **Configuration** tab.

## Cloud Service configuration

1. Select a virtual network to associate with the Cloud Service or create a new one.   

    >[!NOTE]
    > Cloud Service (extended support) deployments **must** be in a virtual network. The virtual network **must** also be referenced in the deployment configuration file (cscfg) in the `NetworkConfiguration` section. 

2. Select an existing public IP address to associate with the Cloud Service or create a new one. 

    - If you have **IP Input Endpoints** defined in your service definition file (csdef), a public IP address will need to be created for your Cloud Service. 
    - Cloud Services (extended support) only supports the Basic IP address SKU.
    - If your cscfg contains a reserved IP address, the allocation type for the public IP address must be **Static**. 

3. (Optional) Swappable Cloud Service. Select an existing Cloud Service for swapping deployments. For more information, see [Cloud Services Swap](cloud-services-swap.md).

4. (Optional) Start Cloud Service. Choose start or not start the service immediately after creation.

    :::image type="content" source="media/deploy-portal-5.png" alt-text="Image shows the configuration blade in the Azure portal when creating a Cloud Services (extended support).":::
    
5. Select the Key Vault associated with your cscfg file (based on the thumbprints). If any certificates are missing they can be uploaded now retrieved by selecting **Refresh** in the drop down. 

6. Once all fields have been completed, move to the **Review and Create** tab to validate your deployment configuration and create your Cloud Service.

## Next steps
For more information, see [Frequently asked questions about Cloud services (extended support)](faq.md)

