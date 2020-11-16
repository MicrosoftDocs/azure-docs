---
title: Deploy an Azure Cloud Service (extended support) - portal
description: Deploy an Azure Cloud Service (extended support) using the Azure portal
ms.topic: quickstart
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Deploy an Azure Cloud Service (extended support) using the Azure portal
Cloud Services (extended support) provides various methods to create a deployment.  This article shows you how to use the Azure portal to create a Cloud Service (extended support) deployment. 

## Create a Cloud Service (extended support)
1.	Log in to the Azure portal
2.	Select **Create a resource** and search for Cloud Services (extended support)

    :::image type="content" source="media/deploy-portal-1.png" alt-text="Image shows the all resources blade in the Azure portal.":::
 
3.	In the Cloud Services (extended support) pane select **Add**.

## Configuring the Cloud Services (extended support) deployment

1. Select the Subscription.

    > [!NOTE]
    > The subscription used for deploying cloud services (extended support) needs to have one of the following roles owner or contributor assigned via Azure Resource Manager role based access control (RBAC). If your subscription does not have any one of these roles, please make sure it is added before proceeding further.
    

6. Choose a Resource group or create a new one.
7. Enter the desired name for your Cloud Service (extended support).
8. Select a region to deploy to. 
9. Select your Configuration (`.cscfg`) file. You can use an existing configuration or upload a new configuration.
10. Select Service Definition (`.csdef`) file. You can use an existing definition file or upload a new one. 
    :::image type="content" source="media/deploy-portal-2.png" alt-text="Image shows the basics tab in the Azure portal for creating a Cloud Service (extended support).":::
11. Once all fields have been completed, move to the Configuration tab



## Cloud Service configuration

1. Select a virtual network. If a virtual network does not exist, one will be created at the time of the Cloud Service creation. 

    >[!NOTE]
    > Cloud Service (extended support) deployments must be in a virtual network. The virtual network must also be referenced in the deployment configuration file `.cscfg` in the `NetworkConfiguration` section. 

2. Select an existing public IP address to associate with your Cloud Service or create a new one. 

    - If you have **IP Input Endpoints** defined in your service definition file (`.csdef`), a public IP address will need to be created for your Cloud Service. 
    - Cloud Services (extended support) only supports the Basic IP address SKU.
    - If your `cscfg` contains a reserved IP address, the allocation type for the public IP address must be **Static**. 

3. (Optional) Swappable Cloud Service. Select an existing Cloud Service for swapping deployments. For more information, see [Cloud Services Swap](cloud-services-swap.md)

4. (Optional) Start Cloud Service. Choose start or not start the service after immediately after creation.

5. Select the key vault associated with your `.cscfg` file (based on their thumbprints). If any certificates are missing you can uploaded them and select **Refresh** in the drop down. 

    :::image type="content" source="media/deploy-portal-3.png" alt-text="Image shows the configuration blade in the Azure portal when creating a Cloud Services (extended support).":::

6. One all fields have been completed, move to the **Review and Create** tab to validate your deployment configuration and create your deployment



## Next steps

[Enable Remote Desktop](enable-rdp.md) for your Cloud Services (extended support) instances.

