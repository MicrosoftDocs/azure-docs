---
title: Create a Containerized Network Function (CNF) Site Network Service with Nginx
description: Learn how to create a Containerized Network Function (CNF) Site Network Service (SNS) with Nginx.
author: HollyCl
ms.author: hollycl
ms.date: 09/07/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Create a Containerized Network Function (CNF) Site Network Service (SNS) with Nginx  

 This article walks you through the process of creating a Site Network Service (SNS) using the Azure portal. Site Networks Services is an essential part of a Network Service Instance and is associated with a specific site. Each Site Network Service instance references a particular version of a Network Service Design (NSD). 

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Complete the [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md)
- Complete the [Quickstart: Create a Containerized Network Functions site with Nginx](quickstart-containerized-network-function-create-site.md)

## Create the site network service

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Select **Create a resource**.
1. Search for **Site network service**, then select **Create**.

     :::image type="content" source="media/create-site-network-service-main.png" alt-text="Screenshot shows the Marketplace screen with site network service in the search bar. Options beneath the search bar include Site Network Service are shown.":::
1. On the **Basics** tab, enter for select the information in the table and accept the default values for the remaining settings.


    |Setting  |Value  |
    |---------|---------|
    |Subscription     |   Select your subscription.      |
    |Resource group     |     Select resource group **operator-rg** you created when creating the *Site*.   |
    |Name     |  Enter **nginx-sns**.       |
    |Region     |  Select the location you used for your prerequisite resources.       |
    |Site    |  Enter **nginx-site**.       |
    |Managed Identity Type    |    Select **User Assigned**.     |
    |User Assigned Identity | Select **identity-for-nginx**                    
 
     
    :::image type="content" source="media/create-site-network-service-basic-containerized.png" alt-text="Screenshot showing the basics tab to input project, instance and identity details.":::

1. Select **Next: Choose a Network Site Design >**.
1. On this screen, select the **Publisher**, **Network Service Design Resource**, and the **Network Service Design Version** you published earlier.
    > [!NOTE]
    > Be sure to select the same Publisher Offering Location you defined in the Network Service Design Quickstart (nginx-nsdg_NFVI.)
    

    :::image type="content" source="media/create-site-network-service-network-service-design.png" alt-text="Screenshot shows the Choose a Network Service Design tab where you choose the details of the initial Network Service Design version.":::
   
1. Select **Next: Set initial configuration >**. 
1. Select **Create New** and enter *nginx-sns-cgvs* in the **Name** field.

    :::image type="content" source="media/create-site-network-service-configuration.png" alt-text="Screenshot showing the Initial Configuration screen including the dialog box that appears when you select the Create New option. ":::
1. In the resulting editor panel, enter the following configuration:
    
    ```json
    { 
    "nginx-nfdg": { 
        "deploymentParameters": { 
            "service_port": 5222, 
            "serviceAccount_create": false 
        }, 
        "customLocationId": "<resource id of your custom location>", 
        "nginx_nfdg_nfd_version": "1.0.0" 
    }, 
    "managedIdentity": "<managed-identity-resource-id>"
    }
    ```

   > [!TIP]
   > Refer to the Retrieve Custom Location section for config group value for the customlocationID. For more information, see [Quickstart: Prerequisites for Operator and Containerized Network Function (CNF)](quickstart-containerized-network-function-operator.md).

10. Select **Review + Create** then **Create**.
1. Allow the deployment state to reach a state of **Succeeded**. This status indicates your CNF is up and running.
1. Access your CNF by navigating to the **Site Network Service Object** in the Azure portal. Select the **Current State -> Resources** to view the managed resource group created by Azure Operator Service Manager (AOSM).

    :::image type="content" source="media/site-network-service-preview.png" alt-text="Screenshot shows an overview of the site network service created.":::

You have successfully created a Site Network Service for a Nginx Container as a CNF in Azure. You can now manage and monitor your CNF through the Azure portal. 
