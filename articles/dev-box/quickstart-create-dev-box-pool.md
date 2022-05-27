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
- You must have Owner or Contributor permissions on an Azure Subscription or specific resource group.

## Create a DevCenter

The following steps show how to use the Azure portal to create and configure a DevCenter in Microsoft Dev Box. This task is performed by the DevCenter Owner. 

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters) using the credentials for your Azure subscription. 

2. On the DevCenter page, select **+ Create** 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter.png" alt-text="Screenshot showing the Azure portal DevCenter pane with create highlighted.":::

3. On the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the DevCenter.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**Name**|Enter a name for your DevCenter.|
   |**Location**|Select the location/region you want the DevCenter to be created in.|
 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter-basics.png" alt-text="Screenshot showing the Create DevCenter Basics tab.":::
       
    The currently supported Azure locations with capacity are:
    - East US
    - East US 2
    - South Central US
    - West US 3
    - West Europe


3. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.
   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter-tags.png" alt-text="Screenshot showing the Create DevCenter Tags tab.":::

4. Select **Review + Create**.

5. To check on the progress of the DevCenter creation from any page in the Azure portal, open the notifications pane. 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/azure-notifications.png" alt-text="Screenshot showing Azure portal notifications pane.":::

6. When the deployment is complete, select **Go to resource**.

7. You'll see the **DevCenter** page.
   :::image type="content" source="./media/quickstart-create-dev-box-pool/devcenter-overview.png" alt-text="Screenshot showing the DevCenter overview page.":::

## Create a Network Connection
Network connections allow dev boxes to be connected to your virtual networks, and determine the region into which dev boxes are deployed. The following steps show how to use the Azure portal to create and configure a Network Connection in Microsoft Dev Box. This task is performed by the DevCenter owner. 

Network Connections can be created using virtual networks that are either Hybrid Azure AD joined or Native Azure AD joined. In this quickstart, you'll use a Hybrid Azure AD joined network. 

<!-- ### Native Azure AD Join
Currently, you use the Azure CLI to create an Azure Active Directory Joined (Azure AD) Network Connection. 

1. Sign in to the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FvirtualNetworks).
 
1. Create a virtual network using the steps in this article: [Create, change, or delete an Azure virtual network](../virtual-network/manage-virtual-network.md). 
    1. Set the region of the vnet to the region where your Dev Boxes will be created. Supported regions:
        - East US
        - East US 2
        - Southcentral US
        - West US 3
        - West Europe

1. Set up the [Azure CLI Fidalgo extension](/Documentation/CLI-reference.md#setup).

1. Create the Network Connection resource using the following command:
```
az fidalgo admin network-setting create --location {region} --domain-join-type "AzureADJoin" --networking-resource-group-name {rgName} --subnet-id {subnetID} --name {networkConnectionName} --resource-group "rg1"
```
Notes:
- location - is the Azure Region of your other resources, doesn't necessarily have to be the region of your vnet. Supported locations:
  - eastus
  - eastus2
  - southcentralus
  - westus3
  - westeurope
- network-resource-group-name - the resource group in which the NICs will be created, this should be in the same subscription as your vnet.
- subnet-id - append "/subnets/{subnetName}" to the resource ID of the vnet you created
- resource-group - this is the rg where the network connection will be created, should be in the same subscription as the vnet.

After creation, the dev box service will run health checks to ensure that the network connection has been created with the right configuration. You can view the status of the health checks in the [Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/networkConnections). -->

### Hybrid Azure AD Join
1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/networkConnections).
:::image type="content" source="./media/quickstart-create-dev-box-pool/network-connection-grid-empty.png" alt-text="Network Connections Grid":::

1. On the **Fidalgo Network Connections** page, select **+ Create**.

1. On the **Create a network connection** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the network connection. It must be in the same subscription as your vnet.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group. The network connection can be in a different resource group to your vnet.|
   |**Name**| Enter an easily identifiable name for the network connection. You will use this name when configuring dev box pools.|
   |**Virtual Network**| Select your vnet. The vnet should be in the same Azure region as where you want the dev boxes to be created.|
   |**Subnet**| Select the subnet your dev boxes will be deployed to.| 
   |**AD DNS domain name**|Select the location/region you want the DevCenter to be created in.|
   |**Organizational unit**|Enter the Organizational Unit (OU) name  in the format *OU=devboxes,DC=ad,DC=contoso,DC=com*. After the dev boxes are provisioned, the dev box computer objects will appear in this OU.|
   |**AD username UPN**|Enter the username for an Azure Active Directory user with sufficient permissions to perform a domain join. Use the format *domainjoin@ad.contoso.com*. |
   |**AD domain password**|Enter the password for the user you specified above. |   
 
    >!Note
    >    To domain join the dev boxes and access corpnet, we're using Hybrid Azure AD join. Therefore the vnet needs line of sight to the domain controller. Look at the full network requirements in [Windows 365 documentation](/windows-365/enterprise/requirements-network).
    
1. Select **Review + Create**.
 
1. On the **Review** tab, verify the information is correct, and then select **Create**.

    :::image type="content" source="./media/quickstart-create-dev-box-pool/create-network-connection.png" alt-text="Network Connection Create":::

### Attach Network Connection to DevCenter
A Network Connection is a top level Azure resource. In order for it to be used in Projects to create Dev Box Pools, it must first be attached to the overarching DevCenter.

1. Once the Network Connection is deployed successfully, go back to the DevCenter resource you created and select the **Network Connection** tab from the left menu. Select  **+ Add** and select the Network Connection you created. Select the Add button to attach the Network Connection to the DevCenter.
:::image type="content" source="./media/quickstart-create-dev-box-pool/network-connection-add.png" alt-text="Attach Network Connection":::

After successful creation, several health checks will be run on the network. You can view the status of the checks on the resource overview page. If there are any errors, refer to the [Troubleshoot Azure network connections](/windows-365/enterprise/troubleshoot-azure-network-connection).

:::image type="content" source="./media/quickstart-create-dev-box-pool/network-connection-grid-populated.png" alt-text="Network Connection Status":::

This Network Connection can now be used in the creation of Dev Box Pools. The dev boxes will be created and domain joined in the location of the VNet.

## Create a Dev Box Definition
The following steps illustrate how to use the Azure portal to create and configure a Dev Box Definition under a DevCenter. The Dev Box Definition is a resource that is reusable across Projects in a DevCenter. It defines the image and sku (compute + storage) that will be used in creation of the dev boxes. Dev Box Definitions are created and managed centrally by the DevCenter Owner.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

2. Select **Fidalgo DevCenters** in the left menu, and select the DevCenter you would like to use.
    :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-definition-grid_empty.png" alt-text="Dev Box Definition Grid":::

3. Select **Dev box definitions** from the left menu, and select **+ Create**.

    :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-definition-create.png" alt-text="Dev Box Definition Create":::
4. Enter a name for the Dev Box Definition.
5. Select an image from the dropdown:
    1.  By default, Azure provides two supported images for Dev Box from the Marketplace, a Windows 10 image and a Windows 11 image. You may choose either from the dropdown according to your preference.
    2. You may also attach your own Azure Compute Gallery from an Azure Subscription that you manage. Learn [how to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).
6. Select the image version you would like to use. 
    1. You may use a specific image version statically. All dev boxes created from a Pool using this Definition will use the same image. 
    2. You may also select the *Latest* image version. Using this feature will allow the Pool to always pick up the most recent image version for your chosen image from the Gallery. This way, the dev boxes created will stay up to date with your latest tools and code on your image. Existing dev boxes will not be modified when an image version is updated.
7. *For Private Preview, the only sku option available is 8 vCPU / 32 GB RAM / 1024 GB SSD. More compute and storage options will be available at Public Preview.*
1. Select **Create**.

## Create a Project

The following steps illustrate how to use the Azure portal to create and configure a Project resource in Microsoft Dev Box. This task is performed by the DevCenter Owner.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters). 

1. Select **Projects** in the left menu, and on the Projects page,  select **+ Create**.
 
1. On the **Create a *Fidalgo* Project** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the project.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group.|
   |**DevCenter**|Select the DevCenter to which you want to associate this Project. All the DevCenter level settings will be applied to the project.|
   |**Name**|Enter a name for your project. |
   |**Description**|Enter a brief description of the project. |

1. Skip the **Subscription mapping** tab, this is relevant only to the Environments service, separate from dev boxes.

1. [Optional] On the **Tags** tab, enter a name and value pair that you want to assign.

1. Select **Review + Create**, and then select **Create**.

1. Confirm that the Project is created successfully by checking the notifications. Select **Go to resource**.

1. Verify that you see the **Project** page.

    :::image type="content" source="./media/quickstart-create-dev-box-pool/project-page.png" alt-text="Project overview page":::

## Create a Dev Box Pool
The following steps show how to use the Azure portal to create a Dev Box Pool within a Project. You'll use the Dev Box Definition and Network Connection resources that you've already created in the DevCenter to configure a specific Pool that dev box users will use to create their dev boxes. A Pool can be created and managed by the DevCenter Owner or Project Admin.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/projects). 

1. Select **Projects** and open the project you want to create the pool in. 
:::image type="content" source="./media/quickstart-create-dev-box-pool/projects-grid.png" alt-text="List of projects":::

1. Select **Dev box pools** and select **+ Add**.
:::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-grid_empty.png" alt-text="Create Dev Box Pool":::

1. On the **Create a dev box pool** page, on the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Name**|Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes, and must be unique within a project.|
   |**Dev box definition**|Select an existing dev box definition. The definition determines the base image and size for the dev boxes created within this pool.|
   |**Network connection**|Select an existing network connection. The Network Connection determines the region of the dev boxes created within this pool.|

   :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-create.png" alt-text="Create Dev Box pool dialog":::

1. Select **Create**. 
:::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-grid-populated.png" alt-text="List of existing pools":::

The Pool will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. 

## Next steps

In this quickstart, you created a Dev Box Pool including the resources necessary to configure it. 

To learn about how to create to your dev box and connect to it, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)

