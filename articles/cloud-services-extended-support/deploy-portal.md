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

1. Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support) and create the associated resources. 

2. Sign in to the Azure portal

3.	Using the search bar located at the top of the portal, search for and select **Cloud Services (extended support)**.

    :::image type="content" source="media/deploy-portal-1.png" alt-text="Image shows the all resources blade in the Azure portal.":::
 
4.	In the Cloud Services (extended support) pane select **Create**. 

    :::image type="content" source="media/deploy-portal-2.png" alt-text="Image shows purchasing a cloud service from the marketplace.":::

5. The Cloud Services (extended support) creation window will open to the **Basics** tab. 
    - Select a Subscription.
    - Choose a resource group or create a new one.
    - Enter the desired name for your Cloud Service (extended support) deployment.
    -  Select the region to deploy to.

    :::image type="content" source="media/deploy-portal-3.png" alt-text="Image shows the Cloud Services (extended support) home blade.":::

    > [!NOTE]
    > The subscription used for deploying Cloud Services (extended support) needs to have one of the following roles (owner or contributor) assigned via Azure Resource Manager role based access control (RBAC). If your subscription does not have one of these roles, make sure it is added before proceeding further.

6. Select your configuration (cscfg) and your service definition (csdef) file. You can use an existing definition file or upload a new one. 

    :::image type="content" source="media/deploy-portal-4.png" alt-text="Image shows the upload section of the basics tab during creation.":::

7. Once all fields have been completed, move to and complete the **Configuration** tab. 
    - Select a virtual network to associate with the Cloud Service or create a new one. 
        - Cloud Service (extended support) deployments **must** be in a virtual network. The virtual network **must** also be referenced in the deployment configuration file (cscfg) in the `NetworkConfiguration` section.
    - Select an existing public IP address to associate with the Cloud Service or create a new one.
        - If you have **IP Input Endpoints** defined in your service definition file (csdef), a public IP address will need to be created for your Cloud Service. 
        - Cloud Services (extended support) only supports the Basic IP address SKU.
        - If your cscfg contains a reserved IP address, the allocation type for the public IP address must be **Static**. 
    - (Optional) Start Cloud Service. Choose start or not start the service immediately after creation.
    - Select the Key Vault associated with your cscfg file (based on the thumbprints). If any certificates are missing they can be uploaded now retrieved by selecting **Refresh** in the drop down. 
   

 :::image type="content" source="media/deploy-portal-5.png" alt-text="Image shows the configuration blade in the Azure portal when creating a Cloud Services (extended support).":::

8. Once all fields have been completed, move to the **Review and Create** tab to validate your deployment configuration and create your Cloud Service.

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.md) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).