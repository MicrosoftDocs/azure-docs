---
title: Configure the Microsoft Dev Box service
description: 'This quickstart shows you how to configure the Microsoft Dev Box service to provide dev boxes for your users. You will create a DevCenter, add a Network Connection, and then create a Dev Box Definition, and a Project.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/04/2022
ms.custom: references_regions
---
<!-- 
  Customer intent:
	As an enterprise admin I want to understand how to create and configure Dev Box components so that I can provide Dev Box Projects my users.
 -->

# Quickstart: Configure the Microsoft Dev Box service

This quickstart describes how to configure the Microsoft Dev Box service by using the Azure portal. The initial Dev Box configuration steps require a DevCenter Owner, which is the role with the highest level of permissions for the Dev Box service. As a DevCenter Owner, you'll create and configure the components necessary to provide dev boxes your users. 

In this quickstart, you'll perform the following tasks:

* [Create a DevCenter](#create-a-devcenter)
* [Create a Network Connection](#create-a-network-connection)
* [Create a Dev Box Definition](#create-a-dev-box-definition)
* [Create a Project](#create-a-project)


## Prerequisites

To complete this quick start, make sure that you have:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- Owner or Contributor permissions on an Azure Subscription or specific resource group.
- A virtual network with a subnet.
- Network Contributor permissions on the virtual network (owner or contributor).

## Create a DevCenter

The following steps show you how to create and configure a DevCenter.  

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters) using the credentials for your Azure subscription. 

1. In the left pane, verify that **Dev Box DevCenters** is selected, and then select **+Add**. 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter.png" alt-text="Screenshot showing the Azure portal DevCenter page with create highlighted.":::

1. On the **Create a DevCenter** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the DevCenter.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a name for your DevCenter.|
   |**Location**|Select the location/region you want the DevCenter to be created in.|
 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter-basics.png" alt-text="Screenshot showing the Create DevCenter Basics tab."::: 
       
The currently supported Azure locations with capacity are:
- East US
- East US 2
- South Central US
- West US 3
- West Europe
<!--Link to ACOM page when available, rather than listing regions-->

4. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter-tags.png" alt-text="Screenshot showing the Create DevCenter Tags tab."::: 

5. Select **Review + Create**.

6. On the **Review** tab, select **Create**.

7. You can check on the progress of the DevCenter creation from any page in the Azure portal, by opening the notifications pane. 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/azure-notifications.png" alt-text="Screenshot showing Azure portal notifications pane.":::

8. When the deployment is complete, select **Go to resource**.

9. You'll see the **DevCenter** page.
   :::image type="content" source="./media/quickstart-configure-dev-box-service/devcenter-overview.png" alt-text="Screenshot showing the DevCenter overview page.":::

## Create a Network Connection
Network Connections determine the region into which Dev Boxes are deployed and allow them to be connected to your existing virtual networks. The following steps show you how to create and configure an Azure Active Directory (AD) joined Network Connection in Microsoft Dev Box.  

To perform the steps in this section, you must have and existing virtual network (vnet) and subnet. If you don't have a vnet and subnet available, follow the instructions here: [Create, change, or delete a virtual network](/azure/virtual-network/manage-virtual-network?branch=main) to create a vnet and subnet. 

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/networkConnections).

1. On the **Network connections** page, select **+Add**.
     :::image type="content" source="./media/quickstart-configure-dev-box-service/network-connections-empty.png" alt-text="Screenshot showing the Network connections page with Add highlighted.":::

1. On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|

     :::image type="content" source="./media/quickstart-configure-dev-box-service/create-native-network-connection-full-blank.png" alt-text="Screenshot showing the create Network connection basics tab.":::

4. Select **Review + Create**.

5. On the **Review** tab, select **Create**.

6. When the deployment is complete, select **Go to resource**. You'll see the Network Connection Overview page.
 
### Attach Network Connection to DevCenter
You need to attach a Network Connection to a DevCenter before it can be used in Projects to create Dev Box Pools.

1. In the Azure portal, navigate to the DevCenter you created and select **Networking**. 
 
1. Select  **+ Add**.
 
1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**. 

After creation, several health checks are run on the network. You can view the status of the checks on the resource overview page. Network connections that pass all the health checks can be added to a DevCenter and used in the creation of Dev Box Pools. The Dev Boxes within the Dev Box Pools will be created and domain joined in the location of the vnet assigned to the network connection.

:::image type="content" source="./media/quickstart-configure-dev-box-service/network-connection-grid-populated.png" alt-text="Screenshot showing the status of a network connection.":::

To resolve any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Create a Dev Box Definition
The following steps show you how to create and configure a Dev Box Definition in a DevCenter. You can use Dev Box Definitions across multiple Projects in the same DevCenter. Dev Box Definitions define the image and SKU (compute + storage) that will be used in creation of the Dev Boxes. Dev Box Definitions are created and managed centrally by the DevCenter Owner.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

1. Open the DevCenter in which you want to create the Dev Box Definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **+Add**.

1. On the **Create dev box definition** page, enter the following values:

   Enter the following values:

   |Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. Azure provides a Windows 10 image and a Windows 11 image for Dev Box from the Marketplace.|To make more images available for the dev box pool, you can attach your own Azure Compute Gallery from an Azure Subscription that you manage. <!-- Learn [how to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md). -->|
   |**Image version**|Select a specific, numbered version to ensure all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure new dev boxes use the latest image available.|Selecting the Latest image version enables the dev box pool to use the most recent image version for your chosen image from the Gallery. This way, the dev boxes created will stay up to date with the latest tools and code on your image. Existing dev boxes will not be modified when an image version is updated.|

      :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-definition-create.png" alt-text="Screenshot of the Create a dev box definition dialog.":::

1. Select **Create**.

> [!IMPORTANT]
> Currently, the SKU option available is 8 vCPU / 32 GB RAM / 1024 GB SSD. 

## Create a Project

The following steps show you how to create and configure a Project in Dev Box. This task is performed by the DevCenter Owner.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters). 

1. Select **Projects** in the left menu, and on the Projects page,  select **+Add**.
 
1. On the **Create a Project** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the project.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**DevCenter**|Select the DevCenter to which you want to associate this Project. All the DevCenter level settings will be applied to the project.|
   |**Name**|Enter a name for your project. |
   |**Description**|Enter a brief description of the project. |

   > [!CAUTION]
   > The **Subscription mapping** tab is used to configure the Environments service. Don't enter any information for Dev Box configuration.

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the Project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that you see the **Project** page.

    :::image type="content" source="./media/quickstart-configure-dev-box-service/project-page.png" alt-text="Screenshot of the Project overview page.":::


## Next steps

In this quickstart, you created a Dev Box project and the resources necessary to support it. You created a DevCenter, added a Network Connection, created a Dev Box Definition, and a Project.'

To learn about how to manage Dev Box projects, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Configure a Dev Box Project](./quickstart-configure-dev-box-project.md)

