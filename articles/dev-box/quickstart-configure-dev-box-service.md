---
title: 'Quickstart: Configure Microsoft Dev Box Preview'
titleSuffix: Microsoft Dev Box Preview
description: This quickstart shows you how to configure the Microsoft Dev Box Preview service to provide dev boxes for users.
services: dev-box
ms.service: dev-box
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/24/2023
ms.custom: references_regions
#Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components so that I can provide dev box projects for my users.
---

# Quickstart: Configure Microsoft Dev Box Preview

This quickstart describes how to configure the Microsoft Dev Box Preview service by using the Azure portal to enable development teams to self-serve dev boxes.

This quickstart takes you through the process of setting up your Dev Box environment. You create a dev center to organize your dev box resources, configure network components to enable dev boxes to connect to your organizational resources, and create a dev box definition that will form the basis of your dev boxes. You then create a project and a dev box pool, which work together to help you give access to users who will manage or use the dev boxes.

After you complete this quickstart, you'll have a Dev Box configuration ready for users to create and connect to dev boxes.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or a specific resource group.
- An existing virtual network and subnet. If you don't have them, [follow these instructions to create them](#create-a-virtual-network-and-subnet).
- Network Contributor permissions on an existing virtual network (Owner or Contributor), or permission to create a new virtual network and subnet.
- User licenses. To use Dev Box Preview, each user must be licensed for Windows 11 Enterprise or Windows 10 Enterprise, Microsoft Intune, and Azure Active Directory (Azure AD) P1. These licenses are available independently and are included in the following subscriptions:

  - Microsoft 365 F3
  - Microsoft 365 E3, Microsoft 365 E5
  - Microsoft 365 A3, Microsoft 365 A5
  - Microsoft 365 Business Premium
  - Microsoft 365 Education Student Use Benefit
- [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/), which allows you to use your Windows licenses on Azure with Dev Box.
- A configured and working Azure AD join or hybrid Active Directory join:

  - To learn how to join devices directly to Azure AD, see [Plan your Azure Active Directory join deployment](../active-directory/devices/azureadjoin-plan.md).
  - To learn how to join your AD DS domain-joined computers to Azure AD from an on-premises Azure Active Directory Domain Services (AD DS) environment, see [Plan your hybrid Azure Active Directory join deployment](../active-directory/devices/hybrid-azuread-join-plan.md).
- Certain ports to be open so that the Dev Box service can function, if your organization routes egress traffic through a firewall. For more information, see [Network requirements](/windows-365/enterprise/requirements-network).

## Create a dev center

Use the following steps to create a dev center so that you can manage your dev box resources:  

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/discover-dev-centers.png" alt-text="Screenshot that shows the Azure portal with the search box and the result for dev centers.":::

1. On the **Dev centers** page, select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center.png" alt-text="Screenshot that shows the Azure portal with the Create button on the page for dev centers.":::

1. On the **Create a dev center** pane, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the dev center.|
   |**ResourceGroup**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Name**|Enter a name for your dev center.|
   |**Location**|Select the location or region where you want the dev center to be created.|

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-basics.png" alt-text="Screenshot that shows the Basics tab on the page for creating a dev center.":::

   For a list of the currently supported Azure locations with capacity, see [Frequently asked questions about Microsoft Dev Box](https://aka.ms/devbox_acom).

1. (Optional) On the **Tags** tab, enter a name/value pair that you want to assign.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-dev-center-tags.png" alt-text="Screenshot that shows the Tags tab on the page for creating a dev center.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Monitor the progress of the dev center creation from any page in the Azure portal by opening the **Notifications** pane.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/notifications-pane.png" alt-text="Screenshot that shows the Notifications pane in the Azure portal.":::

1. When the deployment is complete, select **Go to resource**. Confirm that the dev center page appears.

## Create a network connection

Network connections determine the region in which dev boxes are deployed. They also allow dev boxes to be connected to your existing virtual networks. The following steps show you how to create and configure a network connection in Microsoft Dev Box Preview.  

### Create a virtual network and subnet

You must have a virtual network and subnet available for your network connection. To create them:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **virtual network**. In the list of results, select **Virtual Network**.

1. On the **Virtual Network** page, select **Create**.

1. On the **Create virtual network** page, on the **Basics** tab, enter the following values:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select an existing resource group, or select **Create new** and then enter a name for the new resource group. |
    | **Name** | Enter a name for your virtual network. |
    | **Region** | Enter the location or region where you want the virtual network to be created. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/vnet-basics-tab.png" alt-text="Screenshot that shows the Basics tab on the page for creating a virtual network in the Azure portal.":::

1. On the **IP Addresses** tab, note the default IP address assignment and subnet. You can accept the defaults unless they conflict with your existing configuration.

1. Select the **Review + create** tab. Review the virtual network and subnet configuration.

1. Select **Create**.

### Create the connection

You now need a network connection to associate the virtual network and subnet with the dev center. To create the connection, complete the steps on the relevant tab.

#### [Azure AD join](#tab/AzureADJoin/)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **network connections**. In the list of results, select **Network connections**.

1. On the **Network connections** page, select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-network-connection.png" alt-text="Screenshot that shows the page for network connections and the button for creating a connection.":::

1. On the **Create a network connection** pane, on the **Basics** tab, enter the following values:

   Name|Value|
   |----|----|
   |**Domain join type**|Select **Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**ResourceGroup**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network that you want the network connection to use.|
   |**Subnet**|Select the subnet that you want the network connection to use.|

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-nc-native-join.png" alt-text="Screenshot that shows the Basics tab on the page for creating a network connection, including the option for Azure Active Directory join.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. The network connection appears on the **Network connections** page.

#### [Hybrid Azure AD join](#tab/HybridAzureADJoin/)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **network connections**. In the list of results, select **Network connections**.

1. On the **Network connections** page, select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-network-connection.png" alt-text="Screenshot that shows the page for network connections and the Create button.":::

1. On the **Create a network connection** pane, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Domain join type**|Select **Hybrid Azure active directory join**.|
   |**Subscription**|Select the subscription in which you want to create the network connection.|
   |**ResourceGroup**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Name**|Enter a descriptive name for your network connection.|
   |**Virtual network**|Select the virtual network that you want the network connection to use.|
   |**Subnet**|Select the subnet that you want the network connection to use.|
   |**AD DNS domain name**| Enter the DNS name of the Active Directory domain that you want to use for connecting and provisioning Cloud PCs. For example: `corp.contoso.com`. |
   |**Organizational unit**| Enter the organizational unit (OU). An OU is a container within an Active Directory domain that can hold users, groups, and computers. |
   |**AD username UPN**| Enter the username, in user principal name (UPN) format, that you want to use for connecting the Cloud PCs to your Active Directory domain. For example: `svcDomainJoin@corp.contoso.com`. This service account must have permission to join computers to the domain and the target OU (if one is set). |
   |**AD domain password**| Enter the password for the user. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-nc-hybrid-join.png" alt-text="Screenshot that shows the Basics tab on the page for creating a network connection, including the option for hybrid Azure Active Directory join.":::

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. When the deployment is complete, select **Go to resource**. The network connection appears on the **Network connections** page.

---

## Attach a network connection to a dev center

To provide network configuration information for dev boxes, associate a network connection with a dev center:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **dev centers**. In the list of results, select **Dev centers**.

1. Select the dev center that you created, and then select **Networking**.

1. Select  **+ Add**.

1. On the **Add network connection** pane, select the network connection that you created, and then select **Add**.

After you attach a network connection, the Azure portal runs several health checks on the network. You can view the status of the checks on the resource overview page. You can add network connections that pass all health checks to a dev center and use them to create dev box pools. Dev boxes that are in dev box pools are created and domain joined in the location of the virtual network that's assigned to the network connection.

:::image type="content" source="./media/quickstart-configure-dev-box-service/network-connection-grid-populated.png" alt-text="Screenshot that shows the status of a network connection.":::

To resolve any errors, see [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

## Create a dev box definition

Dev box definitions define the image and SKU (compute + storage) that will be used in creation of the dev boxes. To create and configure a dev box definition:

1. Open the dev center in which you want to create the dev box definition.

1. Select **Dev box definitions**.

1. On the **Dev box definitions** page, select **Create**.

1. On the **Create dev box definition** page, enter the following values:

   |Name|Value|Note|
   |----|----|----|
   |**Name**|Enter a descriptive name for your dev box definition.|
   |**Image**|Select the base operating system for the dev box. You can select an image from Azure Marketplace or from Azure Compute Gallery. </br> If you're creating a dev box definition for testing purposes, consider using the **Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 22H2** image. |To access custom images when you create a dev box definition, you can use Azure Compute Gallery. For more information, see [Configure Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).|
   |**Image version**|Select a specific, numbered version to ensure that all the dev boxes in the pool always use the same version of the image. Select **Latest** to ensure that new dev boxes use the latest image available.|Selecting the **Latest** image version enables the dev box pool to use the most recent version of your chosen image from the gallery. This way, the created dev boxes will stay up to date with the latest tools and code for your image. Existing dev boxes aren't modified when an image version is updated.|
   |**Compute**|Select the compute combination for your dev box definition.||
   |**Storage**|Select the amount of storage for your dev box definition.||

   :::image type="content" source="./media/quickstart-configure-dev-box-service/recommended-test-image.png" alt-text="Screenshot that shows the page for creating a dev box definition.":::

1. Select **Create**.

## Create a project

Dev box projects enable you to manage team-level settings. These settings include providing access to development teams so that developers can create dev boxes.

To create and configure a project in a dev box:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. On the **Projects** page, select **Create**.

1. On the **Create a project** pane, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the project.|
   |**Resource group**|Select an existing resource group, or select **Create new** and then enter a name for the new resource group.|
   |**Dev center**|Select the dev center that you want to associate with this project. All the settings at the dev center level will be applied to the project.|
   |**Name**|Enter a name for the project. |
   |**Description**|Enter a brief description of the project. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-project-create.png" alt-text="Screenshot that shows the Basics tab on the pane for creating a dev box project.":::

1. (Optional) On the **Tags** tab, enter a name/value pair that you want to assign.

1. Select **Review + Create**.

1. On the **Review** tab, select **Create**.

1. Confirm that the project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that the project appears on the **Projects** page.

## Create a dev box pool

A dev box pool is a collection of dev boxes that have similar settings. Dev box pools specify the dev box definitions and network connections that dev boxes will use. You must associate at least one pool with your project before users can create a dev box.

To create a dev box pool that's associated with a project:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project in which you want to create the dev box pool.
  
   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot that shows the list of existing projects.":::

1. Select **Dev box pools**, and then select **Create**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool.png" alt-text="Screenshot of an empty list of dev box pools within a project, along with selections to start creating a pool.":::

1. On the **Create a dev box pool** pane, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. It must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes that are created in this pool.|
   |**Network connection**|Select an existing network connection. The network connection determines the region of the dev boxes that are created in this pool.|
   |**Dev box Creator Privileges**|Select **Local Administrator** or **Standard User**.|
   |**Enable Auto-stop**|**Yes** is the default. Select **No** to disable an auto-stop schedule. You can configure an auto-stop schedule after the pool is created.|
   |**Stop time**| Select a time to shut down all the dev boxes in the pool. All dev boxes in this pool will be shut down at this time every day.|
   |**Time zone**| Select the time zone that the stop time is in.|
   |**Licensing**| Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/quickstart-configure-dev-box-service/create-pool-details.png" alt-text="Screenshot of the pane for creating a dev box pool.":::

1. Select **Create**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to ensure that the image and network pass the validation criteria for dev boxes. The following screenshot shows four dev box pools, each with a different status.

:::image type="content" source="./media/quickstart-configure-dev-box-service/dev-box-pool-grid-populated.png" alt-text="Screenshot that shows a list of dev box pools and status information.":::

## Provide access to a dev box project

Before users can create dev boxes based on the dev box pools in a project, you must provide access for them through a role assignment. The Dev Box User role enables dev box users to create, manage, and delete their own dev boxes. You must have sufficient permissions to a project before you can add users to it.

To assign roles:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project that you want to give team members access to.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/select-project.png" alt-text="Screenshot of the list of existing projects.":::

1. On the left menu, select **Access control (IAM)**.

   :::image type="content" source="./media/quickstart-configure-dev-box-service/project-permissions.png" alt-text="Screenshot that shows the page for project access control.":::

1. On the command bar, select **Add** > **Add role assignment**.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

   | Setting | Value |
   | --- | --- |
   | **Role** | Select **DevCenter Dev Box User**. |
   | **Assign access to** | Select **User, group, or service principal**. |
   | **Members** | Select the users or groups that you want to be able to access to the project. |

   :::image type="content" source="media/how-to-dev-box-user/add-role-assignment-user.png" alt-text="Screenshot that shows the pane for adding a role assignment.":::

   The user can now view the project and all the pools within it. The user can create dev boxes from any of the pools and manage those dev boxes from the [developer portal](https://aka.ms/devbox-portal).

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

## Assign the Project Admin role

The Microsoft Dev Box Preview service makes it possible for you to delegate administration of projects to a member of the project team. Project administrators can assist with the day-to-day management of projects for their teams, like creating and managing dev box pools. To give users permissions to manage projects, assign the DevCenter Project Admin role to them.

You can assign the DevCenter Project Admin role by using the steps described earlier in [Provide access to a dev box project](#provide-access-to-a-dev-box-project), but select the Project Admin role instead of the Dev Box User role. For more information, see [Provide access to projects for project admins](how-to-project-admin.md).

[!INCLUDE [permissions note](./includes/note-permission-to-create-dev-box.md)]

## Next steps

In this quickstart, you created a dev box project and the resources that are necessary to support it. To learn how to create and connect to a dev box, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)
