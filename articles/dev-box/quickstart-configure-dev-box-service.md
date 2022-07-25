---
title: Configure the Microsoft Dev Box service
description: 'This quickstart shows you how to configure the Microsoft Dev Box service to provide dev boxes for your users. You will create a DevCenter, add a network connection, and then create a dev box definition, and a project.'
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 07/22/2022
ms.custom: references_regions
---
<!-- 
  Customer intent:
	As an enterprise admin I want to understand how to create and configure Dev Box components so that I can provide Dev Box projects my users.
 -->

# Quickstart: Configure the Microsoft Dev Box service

This quickstart describes how to configure the Microsoft Dev Box service by using the Azure portal to enable development teams to self-serve dev boxes.

In this quickstart, you'll perform the following tasks:

* [Create a DevCenter](#create-a-devcenter)
* [Create a network connection](#create-a-network-connection)
* [Attach a network connection to a DevCenter](#attach-network-connection-to-devcenter)
* [Create a dev box definition](#create-a-dev-box-definition)
* [Create a project](#create-a-project)


## Prerequisites

To complete this quick start, make sure that you have:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- Owner or Contributor permissions on an Azure Subscription or specific resource group.
- Network Contributor permissions on an existing virtual network (owner or contributor) or permission to create a new virtual network and subnet.

## Create a DevCenter

The following steps show you how to create and configure a DevCenter.  

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Use the Search box to locate Dev Box resources, and select DevCenters.
   :::image type="content" source="./media/quickstart-configure-dev-box-service/discovery-via-azure-portal.png" alt-text="Screenshot showing the Azure portal with the search box highlighted.":::

1. On the DevCenters page, select **+Add**. 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter.png" alt-text="Screenshot showing the Azure portal DevCenter page with create highlighted.":::

1. On the **Create a DevCenter** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the DevCenter.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a name for your DevCenter.|
   |**Location**|Select the location/region you want the DevCenter to be created in.|
 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter-basics.png" alt-text="Screenshot showing the Create DevCenter Basics tab."::: 
       
<!--
The currently supported Azure locations with capacity are listed here: [Microsoft Dev Box](https://azure.microsoft.com/services/devbox).

Link to ACOM page when available, rather than listing regions-->

4. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.
   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-devcenter-tags.png" alt-text="Screenshot showing the Create DevCenter Tags tab."::: 

5. Select **Review + Create**.

6. On the **Review** tab, select **Create**.

7. You can check on the progress of the DevCenter creation from any page in the Azure portal by opening the notifications pane. 
   :::image type="content" source="./media/quickstart-configure-dev-box-service/azure-notifications.png" alt-text="Screenshot showing Azure portal notifications pane.":::

8. When the deployment is complete, select **Go to resource**. You'll see the DevCenter page.


## Create a network connection
Network connections determine the region into which dev boxes are deployed and allow them to be connected to your existing virtual networks. The following steps show you how to create and configure a network connection in Microsoft Dev Box.  

To perform the steps in this section, you must have and existing virtual network (vnet) and subnet. If you don't have a vnet and subnet available, follow the instructions here: [Create, change, or delete a virtual network](/azure/virtual-network/manage-virtual-network?branch=main) to create a vnet and subnet. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Use the Search box to locate Dev Box resources, and select Network connections.

1. On the **Network Connections** page, select **+Add**.
     :::image type="content" source="./media/quickstart-configure-dev-box-service/network-connections-empty.png" alt-text="Screenshot showing the Network Connections page with Add highlighted.":::

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

4. Select **Review + Create**.

5. On the **Review** tab, select **Create**.

6. When the deployment is complete, select **Go to resource**. You'll see the Network Connection overview page.

## Attach network connection to DevCenter
You need to attach a network connection to a DevCenter before it can be used in projects to create dev box pools.

1. In the [Azure portal](https://portal.azure.com), use the Search box to locate Dev Box resources, and select DevCenters.

1. Select the DevCenter you created and select **Networking**. 
 
1. Select  **+ Add**.
 
1. In the **Add network connection** pane, select the network connection you created earlier, and then select **Add**. 

After creation, several health checks are run on the network. You can view the status of the checks on the resource overview page. Network connections that pass all the health checks can be added to a DevCenter and used in the creation of Dev Box Pools. The Dev Boxes within the Dev Box Pools will be created and domain joined in the location of the vnet assigned to the network connection.

:::image type="content" source="./media/quickstart-configure-dev-box-service/network-connection-grid-populated.png" alt-text="Screenshot showing the status of a network connection.":::

To resolve any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Create a dev box definition
The following steps show you how to create and configure a dev box definition. You can use dev box definitions across multiple projects in the same DevCenter. Dev box definitions define the image and SKU (compute + storage) that will be used in creation of the dev boxes. 

1. Open the DevCenter in which you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **+Add**.

1. On the **Create dev box definition** page, enter the following values:

   Enter the following values:

   |Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. You can select an image from the marketplace or from an Azure Compute Gallery.|To make custom images available for the dev box pool, you can attach an Azure Compute Gallery from an Azure Subscription that you manage. Learn [How to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).|
   |**Image version**|Select a specific, numbered version to ensure all the dev boxes in the pool always use the same version of the image. Select  **Latest** to ensure new dev boxes use the latest image available.|Selecting the Latest image version enables the dev box pool to use the most recent image version for your chosen image from the gallery. This way, the dev boxes created will stay up to date with the latest tools and code on your image. Existing dev boxes will not be modified when an image version is updated.|

      :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-definition-create.png" alt-text="Screenshot of the Create a dev box definition dialog.":::

1. Select **Create**.

## Create a project

The following steps show you how to create and configure a project in dev box.

1. In the [Azure portal](https://portal.azure.com), use the Search box to locate Dev Box resources, and select Projects. 

1. On the Projects page,  select **+Add**.
 
1. On the **Create a project** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the project.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**DevCenter**|Select the DevCenter to which you want to associate this project. All the DevCenter level settings will be applied to the project.|
   |**Name**|Enter a name for your project. |
   |**Description**|Enter a brief description of the project. |

   > [!CAUTION]
   > The **Subscription mapping** tab is used to configure the Environments service. Don't enter any information for Dev Box configuration.

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that you see the **Project** page.

## Next steps

In this quickstart, you created a Dev Box project and the resources necessary to support it. You created a DevCenter, added a network connection, created a dev box definition, and a project.'

To learn about how to manage Dev Box projects, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Configure a Dev Box project](./quickstart-configure-dev-box-project.md)

