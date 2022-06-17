---
title: Configure the Microsoft Dev Box service.
description: 'This quickstart shows you how to configure the Microsoft Dev Box service to provide dev boxes for your users. You will create a DevCenter, add a network connection, and then create a dev box definition, a project and a dev box pool.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
---
<!-- 
  Customer intent:
	As an enterprise admin I want to understand how to create and configure each Dev Box component so that I can provide Dev Boxes for my users.
 -->

# Quickstart: Configure the Microsoft Dev Box service

This quickstart describes how to configure the Microsoft Dev Box service by using the Azure portal. You'll create and configure every component necessary to provide dev boxes your users. 

In this quickstart, you'll perform the following tasks:

* [Create a DevCenter](#create-a-devcenter)
* [Create a Network Connection](#create-a-network-connection)
* [Create a Dev Box Definition](#create-a-dev-box-definition)
* [Create a Project](#create-a-project)
* [Create a Dev Box Pool](#create-a-dev-box-pool)

## Prerequisites

To complete this quick start, make sure that you have:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- Owner or Contributor permissions on an Azure Subscription or specific resource group.
- A virtual network with a subnet.

## Create a DevCenter

The following steps show you how to use the Azure portal to create and configure a DevCenter in Microsoft Dev Box. This task is performed by the DevCenter owner. 

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters) using the credentials for your Azure subscription. 

1. In the left pane, verify that **Dev Box DevCenters** is selected, and then select **+ Create**. 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter.png" alt-text="Screenshot showing the Azure portal DevCenter pane with create highlighted.":::

1. On the **Create a DevCenter** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the DevCenter.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a name for your DevCenter.|
   |**Location**|Select the location/region you want the DevCenter to be created in.|
 
<!--   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter-basics.png" alt-text="Screenshot showing the Create DevCenter Basics tab."::: -->
       
   The currently supported Azure locations with capacity are:
    - East US
    - East US 2
    - South Central US
    - West US 3
    - West Europe


1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.
<!--   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter-tags.png" alt-text="Screenshot showing the Create DevCenter Tags tab."::: -->

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. You can check on the progress of the DevCenter creation from any page in the Azure portal, by opening the notifications pane. 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/azure-notifications.png" alt-text="Screenshot showing Azure portal notifications pane.":::

1. When the deployment is complete, select **Go to resource**.

1. You'll see the **DevCenter** page.
   :::image type="content" source="./media/quickstart-create-dev-box-pool/devcenter-overview.png" alt-text="Screenshot showing the DevCenter overview page.":::

## Create a Network Connection
Network connections determine the region into which dev boxes are deployed and allow them to be connected to your existing virtual networks. The following steps show you how to use the Azure portal to create and configure an Azure Active Directory (AD) joined network connection in Microsoft Dev Box. This task is performed by the DevCenter owner. 

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/networkConnections).

1. On the **Network Connections** page, select **+ Create**.

1. On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|

<!--:::image type="content" source="./media/quickstart-create-dev-box-pool/create-native-network-connection-full-blank.png" alt-text="Screenshot showing the create network connection basics tab."::: -->

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. You'll see the network connection overview page.
 
### Attach Network Connection to DevCenter
You need to attach a network connection to a DevCenter before it can be used in projects to create dev box pools.

1. In the Azure portal, navigate to the DevCenter you created and select **Networking**. 
 
1. Select  **+ Add**.
 
1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**. 

After creation, several health checks are run on the network. You can view the status of the checks on the resource overview page. Network connections that pass all the health checks can be added to a DevCenter and used in the creation of Dev Box Pools. The dev boxes within the dev box pools will be created and domain joined in the location of the virtual network assigned to the network connection.

:::image type="content" source="./media/quickstart-create-dev-box-pool/network-connection-grid-populated.png" alt-text="Screenshot showing the status of a Network Connection Status":::

To resolve any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Create a Dev Box Definition
The following steps show you how to use the Azure portal to create and configure a Dev Box Definition in a DevCenter. You can use Dev Box Definitions across multiple Projects in the same DevCenter. Dev Box Definitions define the image and sku (compute + storage) that will be used in creation of the dev boxes. Dev Box Definitions are created and managed centrally by the DevCenter Owner.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

1. Open the DevCenter where you want to create the Dev Box Definition.
   <!-- :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-definition-grid_empty.png" alt-text="Dev Box Definition Grid"::: -->

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **+ Create**.

1. The **Create dev box definition** page appears as shown:

      :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-definition-create.png" alt-text="Dev Box Definition Create":::

   Enter the following values:

   |Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. Azure provides a Windows 10 image and a Windows 11 image for Dev Box from the Marketplace.|To make more images available for the dev box pool, you can attach your own Azure Compute Gallery from an Azure Subscription that you manage. Learn [how to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).|
   |**Image version**|Select a specific, numbered version to ensure all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure new dev boxes use the latest image available.|Selecting the Latest image version enables the dev box pool to use the most recent image version for your chosen image from the Gallery. This way, the dev boxes created will stay up to date with the latest tools and code on your image. Existing dev boxes will not be modified when an image version is updated.|

1. Select **Create**.

> [!IMPORTANT]
> For Private Preview, the only sku option available is 8 vCPU / 32 GB RAM / 1024 GB SSD. More compute and storage options will be available at Public Preview.

## Create a Project

The following steps show you how to use the Azure portal to create and configure a Project in Microsoft Dev Box. This task is performed by the DevCenter Owner.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters). 

1. Select **Projects** in the left menu, and on the Projects page,  select **+ Create**.
 
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

    :::image type="content" source="./media/quickstart-create-dev-box-pool/project-page.png" alt-text="Project overview page":::

## Create a Dev Box Pool
The following steps show you how to use the Azure portal to create a Dev Box Pool within a Project. You'll use the Dev Box Definition and Network Connection that you've already created in the DevCenter to configure a specific Dev Box Pool. Dev box users will create their dev boxes from this pool. A Dev Box Pool can be created and managed by the DevCenter Owner or Project Admin.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/projects). 

1. Select **Projects** and open the project you want to create the pool in. 
:::image type="content" source="./media/quickstart-create-dev-box-pool/projects-grid.png" alt-text="List of projects":::

1. Select **Dev box pools** and then select **+ Add**.
:::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-grid_empty.png" alt-text="Create Dev Box Pool":::

1. On the **Create a dev box pool** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The Network Connection determines the region of the dev boxes created within this pool.|

<!--   :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-create.png" alt-text="Create Dev Box pool dialog"::: -->

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

The Pool will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. 

:::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-grid-populated.png" alt-text="Screenshot showing a list of existing pools":::


## Next steps

In this quickstart, you created a Dev Box Pool including the resources necessary to configure it. 

To learn about how to create to your dev box and connect to it, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)

