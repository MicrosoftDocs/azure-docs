---
title: 'Deploy Affirmed Private Network Service on Azure Stack Edge'
description: Learn how to deploy the Affirmed Private Network Service solution 
services: vnf-manager
author: KumudD
ms.service: vnf-manager
ms.topic: how-to    
ms.date: 06/16/2021
ms.author: hollycl
---
# Deploy Affirmed Private Network Service on Azure Stack Edge

This article provides a high-level overview of the process of deploying Affirmed Private Network Service (APNS) on an Azure Stack Edge device via the Microsoft Azure Marketplace. Further details and optional deployment methods are provided in the Affirmed Private Network Service Deployment Guide. 

## Collect required information
To deploy APNS, you must have the following resources and information:
- A suitable management network to join that includes:
    - Virtual network.
    - Virtual subnet.
    - Network security group.
- A valid SAS Token provided by Affirmed Release Engineering.
- Appropriate permissions within your subscription that includes:
    - Managed Application Contributor Role for your subscription.
    - Owner/Contributor role for your resource group.
- An Administrative user and password to program during the deployment.
- Your subscription must be approved for the following Affirmed services:
    - Affirmed Management Systems VM Offer.
    - APNS Managed Application.
    
## Deploying APNS
To automatically deploy the APNS Managed application with all required resources and relevant information necessary, select the APNS Managed Application from the Microsoft Azure Marketplace. When you deploy, all of the required resources are automatically created for you and are contained in a Managed Resource Group. 

Complete the following procedure to deploy APNS:
1.	Open the Azure portal and select **Create a resource**.
2.	Enter *APNS* in the search bar and press Enter.
3.	Select **View Private Offers**. 
    > [!NOTE]
    > The APNS Managed application will not appear until **View Private Offers** is selected.
4.	Select **Create** from the dropdown menu of the **Private Offer**, then select the option to deploy.
5.	Complete the application setup, network settings, and review and create.
6.	Select **Deploy**.

## Next steps

- For step-by-step instructions for deploying APNS and configuring Netfoundry settings on an Azure Stack Edge device, view the Affirmed Private Network Service Deployment guide.
- For information regarding the programmatic GUI-driven portal that operators used to deploy, monitor, and manage private mobile core networks, Affirmed Private Network Service Manager User guide. 