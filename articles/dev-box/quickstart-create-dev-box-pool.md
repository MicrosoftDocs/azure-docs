---
title: 'Quickstart: Create a Dev Box Pool'
description: 'This quickstart shows how to create and configure a Dev Box environment, including a DevCenter. network connections, Dev Box definitions, projects and a Dev Box Pool.'
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

# Quickstart: Create a Dev Box Pool

This quickstart describes how to set up a Dev Box Pool by using the Azure portal. Follow the steps in this article to configure the resources required to create dev boxes. This is great for a trial experience or pilot of the service.

In this quickstart, you will perform the following actions:

* [Create a DevCenter](#create-a-devcenter)
* [Create a Network Connection](#create-a-network-connection)
* [Create a Dev Box Definition](#create-a-dev-box-definition)
* [Create a Project](#create-a-project)
* [Create a Dev Box Pool](#create-a-dev-box-pool)

## Prerequisites

- As Dev Box (codenamed Fidalgo) is currently in Private Preview, only the subscriptions that are allow-listed can be used to create a Dev Box Pool, if your subscription is not yet allow-listed, reach out to [Dev Box Support](mailto:devboxsupport@microsoft.com)
- Owner or Contributor permissions on an Azure Subscription or specific resource group.

## Create a DevCenter

The following steps illustrate how to use the Azure portal to create and configure a DevCenter in 'Project Fidalgo'. This is performed by the DevCenter Owner persona. If your org already has an existing DevCenter, you can reuse it and skip to the next section.

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters) using the credentials for your Azure subscription. 

2. On the DevCenter page, select **+ Create** 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter.png" alt-text="Azure portal create DevCenter":::

3. On the **Basics** tab, enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select the subscription in which you want to create the DevCenter. The subscription you select must be whitelisted.|
   |**Resource group**|Select an existing resource group or select **Create new**, and enter a name for the resource group. |
   |**Name**|Enter a name for your DevCenter. |
   |**Location**|Select the location/region you want the DevCenter to be created in. |
 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter-basics.png" alt-text="Create DevCenter Basics tab":::
       
    The currently supported Azure locations with capacity are:
    - East US
    - East US 2
    - Southcentral US
    - West US 3
    - West Europe


3. [Optional] In the **Tags** tab, enter a name and value pair that you want to assign.
   :::image type="content" source="./media/quickstart-create-dev-box-pool/create-devcenter-tags.png" alt-text="Create DevCenter Tags tab":::

4. Review + Create

5. Confirm that the DevCenter is created successfully by looking at the notifications. 
   :::image type="content" source="./media/quickstart-create-dev-box-pool/azure-notifications.png" alt-text="Azure portal notifications":::

6. When the deployment is complete, select **Go to resource**.

7. Confirm that you see the **DevCenter** page.
   :::image type="content" source="./media/quickstart-create-dev-box-pool/devcenter-overview.png" alt-text="DevCenter overview page":::


## Create a Network Connection
The following steps illustrate how to use the Azure portal to create and configure a Network Connection in 'Project Fidalgo'. This is performed by the DevCenter owner persona. Network Connections can be created using virtual networks that are either Hybrid Azure AD joined or Native Azure AD joined. Both options are described below. If your DevCenter already has a Network Connection attached, in the region you want to use for your pool, you can use it and skip this section.

### Native Azure AD Join
Currently, you can use the Azure CLI to create an AADJ Network Connection. 

1. Sign in to the [Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FvirtualNetworks) and create a virtual network using [these steps](https://docs.microsoft.com/en-us/azure/virtual-network/manage-virtual-network#create-a-virtual-network). Make sure to:
    1. Use a resource group in the subscription that has been allow-listed for Dev Box Private Preview.
    1. Set the region of the vnet to the region where your Dev Boxes will be created. Supported regions:
        - East US
        - East US 2
        - Southcentral US
        - West US 3
        - West Europe

1. Set up the [Azure CLI Fidalgo extension](/Documentation/CLI-reference.md#setup).

1. Create the Network Connection resource using the following command:
```
az fidalgo admin network-setting create --location {region} --domain-join-type "AzureADJoin" --networking-resource-group-id {rgID} --subnet-id {subnetID} --name {networkConnectionName} --resource-group "rg1"
```
Notes:
- location - is the Azure Region of your other resources, doesn't necessarily have to be the region of your vnet. Supported locations:
  - eastus
  - eastus2
  - southcentralus
  - westus3
  - westeurope
- network-resource-group-id - the resource group in which the NICs will be created, this should be in the same subscription as your vnet.
- subnet-id - append "/subnets/{subnetName}" to the resource ID of the vnet you created
- resource-group - this is the rg where the network connection will be created, should be in the same subscription as the vnet.

After creation, the dev box service will run health checks to ensure that the network connection has been created with the right configuration. You can view the status of the health checks in the [Azure portal](https://ms.portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/networkConnections).

### Hybrid Azure AD Join
1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/networkConnections).
:::image type="content" source="./media/quickstart-create-dev-box-pool/network-connection-grid-empty.png" alt-text="Network Connections Grid":::

2. Click on **+ Create** and in the **Basics** tab of **Create a Network Connection** window, do the following actions:
    1. Select your Azure subscription and resource group (the network connection needs to be in the same subscription as your vnet, but it can be in a different resource group).
    2. Select the Virtual Network and subnet
    To domain join the dev boxes and access corpnet, we are using Hybrid AAD join. Therefore the vnet needs line of sight to the domain controller. Look at the full network requirements in [the Windows 365 documentation](https://docs.microsoft.com/en-us/windows-365/enterprise/requirements-network).
    The vnet should be in the same Azure region as where you want the dev boxes to be created.
    3. Enter a name for the network that can be easily distinguishable when configuring dev box pools. eg: west-us3
    4. Enter the name of the domain you want the dev boxes to join. eg: ad.contoso.com
    5. Enter the Organizational Unit (OU) location for the dev boxes. After they are provisioned, the dev box computer objects will appear in this OU. eg: OU=devboxes,DC=ad,DC=contoso,DC=com
    6. Enter the username and password for an Azure Active Directory user with sufficient permissions to perform a domain join. eg: domainjoin@ad.contoso.com
    7. Select **Review + Create**.

    :::image type="content" source="./media/quickstart-create-dev-box-pool/create-network-connection.png" alt-text="Network Connection Create":::

### Attach Network Connection to DevCenter
A Network Connection is a top level Azure resource. In order for it to be used in Projects to create Dev Box Pools, it must first be attached to the overarching DevCenter.

1. Once the Network Connection is deployed successfully, go back to the DevCenter resource you created and select the **Network Connection** tab from the left menu. Click on **+ Add** and select the Network Connection you just created. Select the Add button to attach the Network Connection to the DevCenter.
:::image type="content" source="./media/quickstart-create-dev-box-pool/network-connection-add.png" alt-text="Attach Network Connection":::

After successful creation, several health checks will be run on the network. You can view the status of the checks on the resource overview page. If there are any errors, please refer to the [troubleshooting documentation](https://docs.microsoft.com/en-us/windows-365/enterprise/troubleshoot-on-premises-network-connection).

:::image type="content" source="./media/quickstart-create-dev-box-pool/network-connection-grid-populated.png" alt-text="Network Connection Status":::

This Network Connection can now be used in the creation of Dev Box Pools. The dev boxes will be created and domain joined in the location of the VNet.

## Create a Dev Box Definition
The following steps illustrate how to use the Azure portal to create and configure a Dev Box Definition under a DevCenter. The Dev Box Definition is a resource that is reusable across Projects in a DevCenter. It defines the image and sku (compute + storage) that will be used in creation of the dev boxes. Dev Box Definitions are created and managed centrally by the DevCenter Owner persona.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters).

2. Select **Fidalgo DevCenters** in the left menu, and select the DevCenter you would like to use.
    :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-definition-grid_empty.png" alt-text="Dev Box Definition Grid":::

3. Select **Dev box definitions** from the left menu, and select **+ Create**.

    :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-definition-create.png" alt-text="Dev Box Definition Create":::
4. Enter a name for the Dev Box Definition.
5. Select an image from the dropdown:
    1.  By default, Azure provides two supported images for Dev Box from the Marketplace, a Windows 10 image and a Windows 11 image. You may choose either one of these from the dropdown according to your preference.
    2. You may also attach your own Azure Compute Gallery from an Azure Subscription that you manage. Learn [how to configure an Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md).
6. Select the image version you would like to use. 
    1. You may use a specific image version statically. All dev boxes created from a Pool using this Definition will use the same image. 
    2. You may also select the *Latest* image version. Using this feature will allow the Pool to always pick up the most recent image version for your chosen image from the Gallery. This way, the dev boxes created will stay up to date with your latest tools and code on your image. Existing dev boxes will not be modified when an image version is updated.
7. For Private Preview, the only sku option available is 8 vCPU / 32 GB RAM / 1024 GB SSD. More compute and storage options will be available at Public Preview.

## Create a Project

The following steps illustrate how to use the Azure portal to create and configure a Project resource in 'Project Fidalgo'. This is done by the DevCenter Owner persona.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/devcenters). 

2. Select **Fidalgo Projects** in the left menu, click on **+ Create** and in the **Basics** tab of **Create a Fidalgo Project** window, do the following actions:
    1. For **Subscription**, select the subscription in which you want to create the Project.
    2. For **Resource group**, Either use an existing resource group or select **Create new**, and enter a name for the resource group.
    3. For **Fidalgo DevCenter**, Select the DevCenter to which you want to associate this Project. This will result in all the DevCenter level settings applied on the Project.
    4. For **Name**, enter a name for the Project.
    5. For **Location**, select the location/region in which you want the Project to be created.
    :::image type="content" source="./media/quickstart-create-dev-box-pool/create-project.png" alt-text="Create a project":::

3. Next, skip the **Subscription mapping** tab, this is relevant only to the Environments service, separate from dev boxes.

4. Review + Create

5. Confirm that the Project is created successfully by looking at the notifications. Select **Go to resource**.

6. Confirm that you see the **Project** page.

    :::image type="content" source="./media/quickstart-create-dev-box-pool/project-page.png" alt-text="Project overview page":::

## Create a Dev Box Pool
The following steps illustrate how to use the Azure portal to create a Dev Box Pool resource within a Project. You will use the Dev Box Definition and Network Connection resources available within the DevCenter to configure a specific Pool that dev boxes will be created from. A Pool can be created and managed by the DevCenter Owner or [Project Admin](/Documentation/how-to-project-admin.md) persona

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/projects). 

1. Select **Fidalgo Projects** in the left menu, and open the Project you want to create the Pool in. 
:::image type="content" source="./media/quickstart-create-dev-box-pool/projects-grid.png" alt-text="List of projects":::

1. Select **Dev box pools** in the left menu, and select the **+ Add** button to open the context pane to create a Pool.
:::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-grid_empty.png" alt-text="Create Dev Box Pool":::

1. For **Name**, enter a name for the Pool. The Pool Name will be visible to developers to select when they are creating dev boxes, and must be unique within a Project.

   :::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-create.png" alt-text="Create Dev Box pool dialog":::

1. For **Dev box definition**, select from the dropdown, the Dev Box Definition that you just created earlier. The definition determines the base image and size for the dev boxes created within this Pool.

1. For **Network connection**, select from the dropdown, the Network Connection that you created earlier. The Network Connection determines the region of the dev boxes created within this Pool.

1. Select **Create**. 
:::image type="content" source="./media/quickstart-create-dev-box-pool/dev-box-pool-grid-populated.png" alt-text="List of existing pools":::

The Pool resource will be deployed and health checks will be run to ensure the image and network pass the validation criteria to be used for dev boxes. 

## Next steps

In this quickstart, you created a Dev Box Pool including the resources necessary to configure it. 

To learn about how to create to your dev box and connect to it, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)

