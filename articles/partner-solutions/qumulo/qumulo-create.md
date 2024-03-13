---
title: Get started with Azure Native Qumulo Scalable File Service
description: In this quickstart, learn how to create an instance of Azure Native Qumulo Scalable File Service.

ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 11/13/2023
---

# Quickstart: Get started with Azure Native Qumulo Scalable File Service

In this quickstart, you create an instance of Azure Native Qumulo Scalable File Service. When you create the service instance, the following entities are also created and mapped to a Qumulo file system namespace:

- A delegated subnet that enables the Qumulo service to inject service endpoints (eNICs) into your virtual network.
- A managed resource group that has internal networking and other resources required for the Qumulo service.
- A Qumulo resource in the region of your choosing. This entity stores and manages your data.
- A Software as a Service (SaaS) resource, based on the plan that you select in the Azure Marketplace offer for Qumulo. This resource is used for billing.

## Prerequisites

1. Make sure that you have **Owner** or **Contributor** access to the Azure subscription. For custom roles, you also need write access to:

   - The resource group where your delegated subnet is created.
   - The resource group where your Qumulo file system namespace is created.

   For more information about permissions and how to check access, see [Troubleshoot Azure Native Qumulo Service](qumulo-troubleshoot.md).

1. Create a [delegated subnet](../../virtual-network/subnet-delegation-overview.md) to the Qumulo service:

    1. Identify the region where you want to subscribe to the Qumulo service.
    1. Create a new virtual network, or select an existing virtual network in the same region where you want to create the Qumulo service.
    1. Create a subnet in the newly created virtual network. Use the default configuration, or update the subnet network configuration based on your network policy.
    1. Delegate the newly created subnet as a Qumulo-only subnet.

   > [!NOTE]
   > The selected subnet address range should have at least 256 IP addresses: 251 free and 5 Azure reserved addresses.
   >
   > Your Qumulo subnet should be in the same region as that of the Qumulo service. The subnet must be delegated to `Qumulo.Storage/fileSystems`.

   :::image type="content" source="media/qumulo-create/qumulo-vnet-properties.png" alt-text="Screenshot that shows virtual network properties in the Azure portal.":::

## Subscribe to Azure Native Qumulo Scalable File Service

1. Go to the Azure portal and sign in.

1. If you've visited Azure Marketplace in a recent session, select the icon from the available options. Otherwise, search for **marketplace** and select the **Marketplace** result under **Services**.

1. In Azure Marketplace, search for **Azure Native Qumulo Scalable File Service**.

1. Select **Subscribe**.

:::image type="content" source="media/qumulo-create/qumulo-marketplace.png" alt-text="Screenshot that shows Azure Native Qumulo Scalable File Service in Azure Marketplace.":::

## Create an Azure Native Qumulo Scalable File Service resource

1. The **Basics** tab provides a form to create an Azure Native Qumulo Scalable File Service resource on the working pane. Provide the following values:
  
   | **Property** | **Description** |
   |--|--|
   |**Subscription** | From the dropdown list, select the Azure subscription where you have **Owner** access. |
   |**Resource group** | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure resource group overview](../../azure-resource-manager/management/overview.md). |
   |**Resource name** | Enter the name of the Qumulo file system. The resource name should have fewer than 15 characters, and it can contain only alphanumeric characters and the hyphen symbol.|
   |**Region** | Select one of the available regions from the dropdown list. |
   |**Availability Zone** | Select an availability zone to pin the Qumulo file system resources to that zone in a region. |
   |**Password** | Create an initial password to set the Qumulo administrator access. |
   |**Service** | Choose the required Azure Native Qumulo (ANQ) version - ANQ V1 or ANQ V2. The default selection is ANQ V2. |
   |**Storage** | This is option is only available for ANQ V1 Scalable File Service. Choose either **Standard** or **Performance** for your storage configuration, based on your workload requirements.  |
   |**Capacity (TB)** | Specify the size of the file system that needs to be created.|
   |**Pricing Plan** | A pay-as-you-go plan is selected by default. For upfront pricing plans or free trials, contact <azure@qumulo.com>. |

   :::image type="content" source="media/qumulo-create/qumulo-create.png" alt-text="Screenshot of the Basics tab for creating a Qumulo resource on the working pane.":::

1. On the **Networking** tab, provide the following values:

   |**Property** |**Description** |
   |--|--|
   | **Virtual network** | Select the appropriate virtual network from your subscription where the Qumulo file system should be hosted.|
   | **Subnet** | Select a subnet from a list of delegated subnets already created in the virtual network. One delegated subnet can be associated with only one Qumulo file system.|

   :::image type="content" source="media/qumulo-create/qumulo-networking.png" alt-text="Screenshot of the Networking tab for creating a Qumulo resource on the working pane.":::

    Only virtual networks in the specified region with subnets delegated to `Qumulo.Storage/fileSystems` appear on this page. If an expected virtual network isn't listed, verify that it's in the chosen region and that the virtual network includes a subnet delegated to Qumulo.

1. Select **Review + Create** to create the resource.

## Next steps

- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)
