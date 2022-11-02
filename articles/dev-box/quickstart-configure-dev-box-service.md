---
title: Configure the Microsoft Dev Box Preview service
titleSuffix: Microsoft Dev Box Preview
description: 'This quickstart shows you how to configure the Microsoft Dev Box Preview service to provide dev boxes for your users. You will create a dev center, add a network connection, and then create a dev box definition, and a project.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 10/12/2022
ms.custom: references_regions
---
<!-- 
  Customer intent:
	As an enterprise admin I want to understand how to create and configure dev box components so that I can provide dev box projects my users.
 -->

# Quickstart: Configure the Microsoft Dev Box Preview service

This quickstart describes how to configure the Microsoft Dev Box service by using the Azure portal to enable development teams to self-serve dev boxes.

In this quickstart, you'll perform the following tasks:

* [Create a dev center](#create-a-dev-center)
* [Create a network connection](#create-a-network-connection)
* [Attach a network connection to a dev center](#attach-network-connection-to-dev-center)
* [Create a dev box definition](#create-a-dev-box-definition)
* [Create a project](#create-a-project)


## Prerequisites

To complete this quick start, make sure that you have:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- Owner or Contributor permissions on an Azure Subscription or a specific resource group.
- Network Contributor permissions on an existing virtual network (owner or contributor) or permission to create a new virtual network and subnet.

## Create a dev center

The following steps show you how to create and configure a dev center.  

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Dev centers* and then select **Dev centers** from the list.

   <!--   :::image type="content" source="./media/quickstart-configure-dev-box-service/discovery-via-azure-portal.png" alt-text="Screenshot showing the Azure portal with the search box highlighted."::: -->

1. On the dev centers page, select **+Create**. 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center.png" alt-text="Screenshot showing the Azure portal Dev center with create highlighted.":::

1. On the **Create a dev center** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the dev center.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a name for your dev center.|
   |**Location**|Select the location/region you want the dev center to be created in.|
 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter-basics.png" alt-text="Screenshot showing the Create dev center Basics tab."::: 
       
   The currently supported Azure locations with capacity are listed here: [Microsoft Dev Box Preview](https://aka.ms/devbox_acom).

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter-tags.png" alt-text="Screenshot showing the Create dev center Tags tab."::: 

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. You can check on the progress of the dev center creation from any page in the Azure portal by opening the notifications pane. 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/azure-notifications.png" alt-text="Screenshot showing Azure portal notifications pane.":::

1. When the deployment is complete, select **Go to resource**. You'll see the dev center page.


## Create a network connection
Network connections determine the region into which dev boxes are deployed and allow them to be connected to your existing virtual networks. The following steps show you how to create and configure a network connection in Microsoft Dev Box.  

To perform the steps in this section, you must have an existing virtual network (vnet) and subnet. If you don't have a vnet and subnet available, follow the instructions here: [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md) to create them. 

If your organization routes egress traffic through a firewall, you need to open certain ports to allow the Dev Box service to function. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, type *Network connections* and then select **Network connections** from the list.

1. On the **Network Connections** page, select **+Create**.
     :::image type="content" source="./media/quickstart-configure-dev-box-service/network-connections-empty.png" alt-text="Screenshot showing the Network Connections page with Create highlighted.":::

1. Follow the steps on the appropriate tab to create your network connection.
   #### [Azure AD join](#tab/AzureADJoin/)

   On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-native-network-connection-full-blank.png" alt-text="Screenshot showing the create network connection basics tab with Azure Active Directory join highlighted.":::

   #### [Hybrid Azure AD join](#tab/HybridAzureADJoin/)

   On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Hybrid Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network you want the network connection to use.|
   |**Subnet**|Select the subnet you want the network connection to use.|
   |**AD DNS domain name**| The DNS name of the Active Directory domain that you want to use for connecting and provisioning Cloud PCs. For example, corp.contoso.com. |
   |**Organizational unit**| An organizational unit (OU) is a container within an Active Directory domain, which can hold users, groups, and computers. |
   |**AD username UPN**| The username, in user principal name (UPN) format, that you want to use for connecting the Cloud PCs to your Active Directory domain. For example, svcDomainJoin@corp.contoso.com. This service account must have permission to join computers to the domain and, if set, the target OU. |
   |**AD domain password**| The password for the user specified above. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-hybrid-network-connection-full-blank.png" alt-text="Screenshot showing the create network connection basics tab with Hybrid Azure Active Directory join highlighted.":::

   ---

5. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. You'll see the Network Connection overview page.

## Attach network connection to dev center
You need to attach a network connection to a dev center before it can be used in projects to create dev box pools.

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Dev centers* and then select **Dev centers** from the list.

1. Select the dev center you created and select **Networking**. 
 
1. Select  **+ Add**.
 
1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**. 

After creation, several health checks are run on the network. You can view the status of the checks on the resource overview page. Network connections that pass all the health checks can be added to a dev center and used in the creation of dev box pools. The dev boxes within the dev box pools will be created and domain joined in the location of the vnet assigned to the network connection.

:::image type="content" source="./media/quickstart-configure-dev-box-service/network-connection-grid-populated.png" alt-text="Screenshot showing the status of a network connection.":::

To resolve any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Create a dev box definition
The following steps show you how to create and configure a dev box definition. You can use dev box definitions across multiple projects in the same dev center. Dev box definitions define the image and SKU (compute + storage) that will be used in creation of the dev boxes. 

1. Open the dev center in which you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **+Create**.

1. On the **Create dev box definition** page, enter the following values:

   Enter the following values:

   |Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. You can select an image from the Azure Marketplace or from an Azure Compute Gallery. </br> If you're creating a dev box definition for testing purposes, consider using the **Windows 11 Enterprise + Microsoft 365 Apps 22H2** image. |To use custom images while creating a dev box definition, you can attach an Azure Compute Gallery that has the custom images. Learn [How to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).|
   |**Image version**|Select a specific, numbered version to ensure all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure new dev boxes use the latest image available.|Selecting the Latest image version enables the dev box pool to use the most recent image version for your chosen image from the gallery. This way, the dev boxes created will stay up to date with the latest tools and code on your image. Existing dev boxes will not be modified when an image version is updated.|
   |**Compute**|Select the compute combination for your dev box definition.||
   |**Storage**|Select the amount of storage for your dev box definition.||

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-box-definition-page.png" alt-text="Screenshot showing the Create dev box definition page.":::

1. Select **Create**.

## Create a project

The following steps show you how to create and configure a project in dev box.

1. In the [Azure portal](https://portal.azure.com), in the search box, type *Projects* and then select **Projects** from the list. 

1. On the Projects page,  select **+Create**.
 
1. On the **Create a project** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the project.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Dev center**|Select the dev center to which you want to associate this project. All the dev center level settings will be applied to the project.|
   |**Name**|Enter a name for your project. |
   |**Description**|Enter a brief description of the project. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create.png" alt-text="Screenshot of the Create a dev box project basics tab.":::

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that you see the **Project** page.

## Next steps

In this quickstart, you created a dev box project and the resources necessary to support it. You created a dev center, added a network connection, created a dev box definition, and a project.

To learn about how to manage dev box projects, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Configure a dev box project](./quickstart-configure-dev-box-project.md)

