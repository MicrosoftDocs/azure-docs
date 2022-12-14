---
title: Get started with Azure Native Qumulo Scalable File Service
description: QuickStart - Get started with Azure Native Qumulo Scalable File Service

ms.topic: quickstart 
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
ms.date: 12/31/2022

---


# QuickStart: Get started with Azure Native Qumulo Scalable File Service

In this quickstart, you create a new instance of Azure Native Qumulo Scalable File Service. When you create the service, the following entities are also created and mapped to a Qumulo File System namespace.

- Delegated subnet
    -  The delegated subnet enables the Qumulo service to inject service endpoints (eNICs) into your virtual network.
- Managed resource group
    -  The resource group will have internal networking and other resources required for the Qumulo service. 
- Qumulo resource
    -  The Qumulo service created in the region of your choosing, with your data stored and managed by this entity.
- Marketplace SaaS resource
    -  The SaaS resource is created automatically based on the plan you select in the Qumulo Marketplace offer. This resource is used for billing purposes.

## Prerequisites

1. Owner or Contributor access to the Azure Subscription. For custom roles, write access to the following:

     1. Resource group where your delegated subnet is created
     1. Resource group where your Qumulo file system namespace is created.

     Check access for a user. For more details about exact permissions refer to [Troubleshoot](qumulo-troubleshoot.md).

1. Create a delegated subnet.

    Delegated subnet: The virtual network owner must [delegate a subnet](/azure/virtual-network/subnet-delegation-overview) to the Qumulo service.
        
    1. Identify the region where you want to subscribe to the Qumulo service.
    1. Create a new virtual network or select an existing virtual network in the same region where you want to create the Qumulo service.
    1. Create a new subnet in the newly created virtual network. Use the default configuration or update the subnet network configuration based on your network policy.
    1. Delegate the newly created subnet as a Qumulo only subnet.

   > [!NOTE]
   > Subnet address range selected should have at least 256 IP addresses: 251 free + 5 Azure reserved addresses. 
   > Your Qumulo subnet should be in the same region as that of the Qumulo service.
   > The subnet must be delegated to `Qumulo.Storage/fileSystems`.

   :::image type="content" source="media/qumulo-create/qumulo-vnet-properties.png" alt-text="Screenshot showing virtual network properties in the Azure portal. ":::

## Find a Azure Native Qumulo Scalable Service resource

1. Go to the Azure portal and sign in.

1. If you've visited the Marketplace in a recent session, select the icon from the available options. Otherwise, search for Marketplace.

1. In the Marketplace, search for *Azure Native Qumulo Scalable File Service.*

1. Select Subscribe.

:::image type="content" source="media/qumulo-create/qumulo-marketplace.png" alt-text="Screenshot showing Azure Native Qumulo Scalable File Service in the Azure Marketplace.":::

## Create a Qumulo resource in Azure

1. You are presented a form to create an Azure Native Qumulo Scalable File Service resource in the working pane.

      :::image type="content" source="media/qumulo-create/qumulo-create.png" alt-text="Screenshot of the Basics tab for creating a Qumulo resource in the working pane.":::
      Screenshot

1. Provide the following values:
<!-- this might look better as a list -->
  
   | **Property** | **Description** |
   |--|--|
   |Subscription | From the drop down select your Azure subscription where you have owner access |
   |Resource group | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview.](/azure/azure-resource-manager/management/overview) |
   |Resource name |Name of the Qumulo file system. The resource name length should be less than 15 character and can contain only alphanumeric and hyphen symbol.|
   |Region |Select one of the available regions from the dropdown. |
   |Availability Zone | Select the availability zone to pin the Qumulo filesystem resources to an availability zone in a region. |
   | Password | Initial password to set the Qumulo administrator access |
   |Storage type | Choose between performance or standard storage configuration based on your workload requirements.|
   |Storage Size | Specify the size of the filesystem that needs to be created.|
   |Pricing Plan | Pay-as-you-go plan is selected by default. For upfront pricing plans or free trials contact azure@qumulo.com |

1. Configure networking

   :::image type="content" source="media/qumulo-create/qumulo-networking.png" alt-text="Screenshot of the Networking tab for creating a Qumulo resource in the working pane.":::
    
    <!-- This might look better as a list  -->
   |**Property** |**Description** |
   |--|--|
   | Virtual network | Select the appropriate virtual network from your subscription where the Qumulo file system should be hosted.|
   | Subnet | Select a subnet from a list of pre-created delegated subnet(s) in the VNet. One delegated subnet can be associated with only one Qumulo file system.|

   -  **Virtual network**
       -  Select the appropriate virtual network from your subscription where the Qumulo file system should be hosted.
   - **Subnet** 
       - Select a subnet from a list of pre-created delegated subnet(s) in the VNet. One delegated subnet can be associated with only one Qumulo file system.
    
    Only virtual networks in the specified region with subnets delegated to Qumulo.Storage/fileSystems will appear on this page. If an expected virtual network is not listed, verify that it is in the chosen region and that the virtual network includes a subnet delegated to Qumulo.

1. Click on **Review + Create** to create the resource.
