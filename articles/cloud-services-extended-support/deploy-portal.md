---
title: Deploy a Cloud Service (extended support) - Portal
description: Deploy a Cloud Service (extended support) using the Azure portal
ms.topic: quickstart
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Deploy a Cloud Service (extended support) using the Azure portal

## Create a Cloud Service (extended support)
1.	Log in to the Azure portal
2.	Select **Create a resource** and search for Cloud Services (extended support)

    :::image type="content" source="media/deploy-portal-1.png" alt-text="Image shows the all resources blade in the Azure portal.":::
 
3.	In the Cloud Services (extended support) pane select **Add**.

4. Complete basics tab

    :::image type="content" source="media/deploy-portal-2.png" alt-text="Image shows the basics tab in the Azure portal for creating a Cloud Service (extended support).":::
 
5. Choose your Subscription

    > [!NOTE]
    > The subscription used for deploying cloud services (extended support) needs to have one of the following roles owner or contributor assigned via ARM role based access control (RBAC). If your subscription does not have any one of these roles, please make sure it is added before proceeding further.
    

6. Choose a Resource group or create a new one
7. Enter name of cloud service
8. Select a region
9. Select your Configuration (.cscfg) location, you can use your existing configurations from your blob or upload new configuration from your local machine that will be then stored in your storage account.
10. Select service definition (.csdef)
11. Once all fields have been completed, move to the Configuration tab

## Cloud Service configuration

1. Configure virtual network
Cloud Service deployments through ARM, are always in an explicit Virtual Network. Virtual Network must be referenced in the deployment configuration file CSCFG, within the NetworkConfiguration section. If a VNet is not already pre-created, a new VNet will be created in the Portal at the time of the Cloud Service creation. This is especialy usefull when creating a cloud service in a new resource group.

2. Configure public or internal load balancer
If you have ‘Input Endpoint(s)’ defined in your service definition file (CSDEF), a Public IP Address resource will need to be created for your Cloud Service
o	You can create a new (Public IP Address) resource or select an existing resource that is not currently in-use
o	Basic Public IP Address is the only SKU that can be used for Cloud Services (extended support)
o	If CSCFG contains a Reserved IP, then the allocation type for the Public IP address must be ‘Static’ otherwise it should be ‘Dynamic’
Optionally, give a Fully Qualified name to your cloud service endpoint by filling in the DNS label for the Public IP address assigned to the Cloud Service. 

3. Select a swappable cloud service: you can select an existing cloud service for swapping deployments. This is useful when deploying new versions of your service without any downtime. You can easily switch between “Production” and “Staging” services.

4. Start cloud service – you can choose to not start the service after its created and start it later. Or you can start the service immediately when it is creater.



5. Select Key vault – Key vault is required when you specified one or more certificates in your .cscfg file. When you select a key vault we will try to find the selected certificates from your .cscfg file (based on their thumbprints). If there are some certificates missing in your key vault, we will notify you and you will be able to go to your key vault to upload them. After you uploaded your certificates, just click “Refresh” in the certificates table and we will validate the results for you. 

    :::image type="content" source="media/deploy-portal-3.png" alt-text="Image shows the configuration blade in the Azure portal when creating a Cloud Services (extended support).":::

## Review and Create
In the next steps you can add Tags if needed.
The last step in the create cloud service is Review+Create. At this point we will review and prevalidate your deployment configuration and confirm you created a configuration that should successfully deploy your service. When validation is done, click Create.

## Next steps


