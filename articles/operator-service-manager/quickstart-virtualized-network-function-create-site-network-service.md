---
title: Create a Site Network Service for Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF) 
description: Learn how to create a Site Network Service (SNS) for Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)
author: sherrygonz
ms.author: sherryg
ms.date: 09/26/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Create a Site Network Service (SNS) for Ubuntu Virtual Machine (VM) as Virtualized Network Function (VNF)

This quickstart describes the process of creating a Site Network Service (SNS) using the Azure portal. The Site Network Service (SNS) is an essential part of a Network Service Instance and is associated with a specific site. Each Site Network Service (SNS) instance references a particular version of a Network Service Design (NSD).

## Prerequisites

An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

This quickstart assumes you followed the prerequisites in these quickstarts:

- [Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)](quickstart-virtualized-network-function-operator.md)
- [Quickstart: Create a Virtualized Network Functions (VNF) Site](quickstart-virtualized-network-function-create-site.md)

## Create Site Network Service (SNS)

### Create resource

1. In Azure portal, enter "Site Network Services" into the search and select **Site Network Service** from the results.
1. Select **+ Create**.

   :::image type="content" source="media/create-site-network-service-virtual-network-function.png" alt-text="Screenshot showing the Create a resource page search for and select Site Network Service.":::


1. In the **Basics** tab, enter or select the following information. Accept the defaults for the remaining settings.

    |Setting|Value| 
    |---|---| 
    |**Subscription**| Select your subscription.| 
    |**Resource group**| Select *operatorresourcegroup*.| 
    |**Name**| Enter *ubuntu-sns*.| 
    |**Region**| Select the location you used for your prerequisite resources.| 
    |**Site**| Enter *ubuntu-vm-site*.|
    |**Managed Identity Type** | User Assigned. |
    |**User Assigned Identity** |Select **identity-for-ubuntu-vm-sns**.|

    :::image type="content" source="media/basics-tab-virtual-network-function.png" alt-text="Screenshot showing the Basics page where the details for the Site Network Service are input.":::

### Choose Network Service Design

1. On the **Choose a Network Service Design** page, select the Publisher, Network Service Design Resource and Network Service Design Version that you published earlier.


    |Setting|Value| 
    |---|---| 
    |**Publisher Offering Location**| Select **UK South**| 
    |**Publisher**| Select **ubuntu-publisher**| 
    |**Network Service Design resource**| Select **ubuntu-nsdg**| 
    |**Network Service Design version**| Select **1.0.0**| 
    
    
    :::image type="content" source="media/choose-network-service-design-virtual-network-function.png" alt-text="Screenshot showing the Choose a Network Service Design tab and Network Service Design resource.":::

1. Select **Next**.

### Set initial configuration

1. From the **Set initial configuration** tab, choose **Create New**.
1. Enter ubuntu-sns-cgvs into the name field.

    :::image type="content" source="media/review-create-virtual-network-function.png" alt-text="Screenshot showing the Set initial configuration tab, then Review and Create.":::

1. Copy and paste the following JSON file into the ubuntu-sns-cgvs dialog that appears. Edit the place holders to contain your virtual network ID, your managed identity, and your SSH public key values.



    ```json
    {
        "ubuntu-vm-nfdg": {
            "deploymentParameters": {
                "location": "uksouth",
                "subnetName": "ubuntu-vm-subnet",
                "virtualNetworkId": "/subscriptions/<subscription_id>/resourceGroups/<pre-requisites resource group>/providers/Microsoft.Network/virtualNetworks/ubuntu-vm-vnet",
                "sshPublicKeyAdmin": "<Your public ssh key>",
                "ubuntuVmName": "myUbuntuVm"
            },
            "ubuntu_vm_nfdg_nfd_version": "1.0.0"
        },
        "managedIdentity": "<managed-identity-resource-id>"
    }
    ```

1. Refer to [Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)](quickstart-virtualized-network-function-operator.md) in the **Resource ID for the managed identity** section to see how to retrieve the managedIdentity resource ID.


    Additionally, the sshPublicKeyadmin can be listed by executing `cat ~/.ssh/id_rsa.pub` or `cat ~/.ssh/id_dsa.pub` or can be created following [Generate new keys and Get public keys ](/azure/virtual-machines/ssh-keys-portal).

1. Select **Review + create**.
1. Select **Create**.

### Wait for deployment

Wait for the deployment to reach the 'Succeeded' state. After completion, your Virtual Network Function (VNF) should be up and running.

### Access your Virtual Network Function (VNF)

1. To access your Virtual Network Function (VNF), go to the Site Network Service object in the Azure portal.
1. Select the link under **Current State -> Resources**. The link takes you to the managed resource group created by Azure Operator Service Manager.

Congratulations! You have successfully created a Site Network Service for Ubuntu Virtual Machine (VM) as a Virtual Network Function (VNF) in Azure. You can now manage and monitor your Virtual Network Function (VNF) through the Azure portal.
