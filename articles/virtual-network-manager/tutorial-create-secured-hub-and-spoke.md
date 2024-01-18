---
title: 'Tutorial: Create a secured hub and spoke network'
description: In this tutorial, you learn how to create a hub and spoke network topology for your virtual networks using Azure Virtual Network Manager. Then you secure your network by blocking outbound traffic on ports 80 and 443.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: tutorial
ms.date: 08/01/2023
ms.custom: FY23 content-maintenance, engagement-FY24
---

# Tutorial: Create a secured hub and spoke network

In this tutorial, you create a hub and spoke network topology using Azure Virtual Network Manager. You then deploy a virtual network gateway in the hub virtual network to allow resources in the spoke virtual networks to communicate with remote networks using VPN. Also, you configure a security configuration to block outbound network traffic to the internet on ports 80 and 443. Last, you verify that configurations were applied correctly by looking at the virtual network and virtual machine settings.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create multiple virtual networks.
> * Deploy a virtual network gateway.
> * Create a hub and spoke network topology.
> * Create a security configuration blocking traffic on port 80 and 443.
> * Verify configurations were applied.

:::image type="content" source="media/tutorial-create-secured-hub-and-spoke/create-secure-hub-spoke-network.png" alt-text="Diagram of secure hub and spoke topology components.":::
## Prerequisite

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Before you can complete steps in this tutorial, you must first [create an Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance. The instance needs to included the **Connectivity** and **Security admin** features. This tutorial used a Virtual Network Manager instance named **vnm-learn-eastus-001**.

## Create virtual networks

This procedure walks you through creating three virtual networks that will be connected using the hub and spoke network topology.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Virtual network**. Then select **Create** to begin configuring the virtual network.

1. On the *Basics* tab, enter or select the following information:

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-vnet-basic.png" alt-text="Screenshot of basics tab for hub and spoke virtual network.":::

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Resource group | Select or create a new resource group to store the virtual network. This quickstart uses a resource group named **rg-learn-eastus-001**. |
    | Name | Enter **vnet-learn-prod-eastus-001** for the virtual network name. |
    | Region | Select the **East US** region. |

 1. Select **Next: IP Addresses** and configure the following network address space:

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-vnet-ip.png" alt-text="Screenshot of IP addresses tab for hub and spoke virtual network.":::

    | Setting | Value |
    | -------- | ----- |
    | IPv4 address space | Enter **10.0.0.0/16** as the address space. |
    | Subnet name | Enter the name **default** for the subnet. |
    | Subnet address space | Enter the subnet address space of **10.0.0.0/24**. |

1. Select **Review + create** and then select **Create** to deploy the virtual network.


1. Repeat steps 2-5 to create two more virtual networks into the same resource group with the following information:


    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the same subscription you selected in step 3. |
    | Resource group | Select the **rg-learn-eastus-001**. |
    | Name | Enter **vnet-learn-prod-eastus-002** and **vnet-learn-hub-eastus-001** for the two virtual networks. |
    | Region | Select **(US) East US** |
    | vnet-learn-prod-eastus-002 IP addresses | IPv4 address space: 10.1.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.1.0.0/24|
    | vnet-learn-hub-eastus-001 IP addresses | IPv4 address space: 10.2.0.0/16 </br> Subnet name: default </br> Subnet address space: 10.2.0.0/24|

## Deploy a virtual network gateway

Deploy a virtual network gateway into the hub virtual network. This virtual network gateway is necessary for the spokes to *Use hub as a gateway* setting.

1. Select **+ Create a resource** and search for **Virtual network gateway**. Then select **Create** to begin configuring the virtual network gateway.


1. On the *Basics* tab, enter or select the following settings:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/gateway-basics.png" alt-text="Screenshot of create the virtual network gateway basics tab.":::

    | Setting | Value |
    | -------- | ----- |
    | Subscription | Select the subscription you want to deploy this virtual network into. |
    | Name | Enter **gw-learn-hub-eastus-001** for the virtual network gateway name. |
    | SKU | Select **VpnGW1** for the SKU. |
    | Generation | Select **Generation1** for the generation. |
    | Virtual network | Select the **vnet-learn-hub-eastus-001** for the VNet. |
    | **Public IP Address** |  |
    | Public IP address name | Enter the name **gwpip-learn-hub-eastus-001** for the public IP. |
    | **SECOND PUBLIC IP ADDRESS** | |
    | Public IP address name | Enter the name **gwpip-learn-hub-eastus-002** for the public IP. |

    
1. Select **Review + create** and then select **Create** after validation has passed. The deployment of a virtual network gateway can take about 30 minutes. You can move on to the next section while waiting for this deployment to complete. However, you may find **gw-learn-hub-eastus-001** doesn't display that it has a gateway due to timing and sync across the Azure portal.

## Create a dynamic network group

1. Go to your Azure Virtual Network Manager instance. This tutorial assumes you've created one using the [quickstart](create-virtual-network-manager-portal.md) guide. The network group in this tutorial is called **ng-learn-prod-eastus-001**.

1. Select **Network groups** under *Settings*, and then select **+ Create** to create a new network group.

    :::image type="content" source="./media/create-virtual-network-manager-portal/add-network-group-2.png" alt-text="Screenshot of add a network group button.":::

1. On the **Create a network group** screen, enter the following information:

    :::image type="content" source="./media/create-virtual-network-manager-portal/create-network-group.png" alt-text="Screenshot of the Basics tab on Create a network group page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **ng-learn-prod-eastus-001** for the network group name. |
    | Description | Provide a description about this network group. |

1. Select **Create** to create the virtual network group.
1. From the **Network groups** page, select the created network group from above to configure the network group.
1. On the **Overview** page, select **Create Azure Policy** under *Create policy to dynamically add members*.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/define-dynamic-membership.png" alt-text="Screenshot of the defined dynamic membership button.":::

1. On the **Create Azure Policy** page, select or enter the following information:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-conditional.png" alt-text="Screenshot of create a network group conditional statements tab.":::

    | Setting | Value |
    | ------- | ----- |
    | Policy name | Enter **azpol-learn-prod-eastus-001** in the text box. |
    | Scope | Select **Select Scopes** and choose your current subscription. |
    | Criteria |  |
    | Parameter | Select **Name** from the drop-down.|
    | Operator | Select **Contains** from the drop-down.| 
    | Condition | Enter **-prod** for the condition in the text box. |

1. Select **Preview resources** to view the **Effective virtual networks** page and select **Close**. This page shows the virtual networks that will be added to the network group based on the conditions defined in Azure Policy.

    :::image type="content" source="media/create-virtual-network-manager-portal/effective-virtual-networks.png" alt-text="Screenshot of Effective virtual networks page with results of conditional statement.":::

1. Select **Save** to deploy the group membership. It can take up to one minute for the policy to take effect and be added to your network group.
1. On the **Network Group** page under **Settings**, select **Group Members** to view the membership of the group based on the conditions defined in Azure Policy. The **Source** is listed as **azpol-learn-prod-eastus-001**.

    :::image type="content" source="media/create-virtual-network-manager-portal/group-members-list.png" alt-text="Screenshot of dynamic group membership under Group Membership.":::

## Create a hub and spoke connectivity configuration

1. Select **Configurations** under **Settings**, then select **+ Create**.

1. Select **Connectivity configuration** from the drop-down menu to begin creating a connectivity configuration.

1. On the **Basics** page, enter the following information, and select **Next: Topology >**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/connectivity-configuration.png" alt-text="Screenshot of add a connectivity configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **cc-learn-prod-eastus-001**. |
    | Description | *(Optional)* Provide a description about this connectivity configuration. |


1. On the **Topology** tab, select **Hub and Spoke**. This reveals other settings.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/hub-configuration.png" alt-text="Screenshot of selecting a hub for the connectivity configuration.":::

1.  Select **Select a hub** under **Hub** setting. Then, select **vnet-learn-hub-eastus-001** to serve as your network hub and select **Select**.

    :::image type="content" source="media/tutorial-create-secured-hub-and-spoke/select-hub.png" alt-text="Screenshot of Select a hub configuration.":::
    
    > [!NOTE] 
    > Depending on the timing of deployment, you may not see the target hub virtual networked as have a gateway under **Has gateway**. This is due to the deployment of the virtual network gateway. It can take up to 30 minutes to deploy, and may not display immediately in the various Azure portal views.
    
1.  Under **Spoke network groups**, select **+ add**. Then, select **ng-learn-prod-eastus-001** for the network group and select **Select**.

    :::image type="content" source="media/create-virtual-network-manager-portal/add-network-group-configuration.png" alt-text="Screenshot of Add network groups page.":::

1. After you've added the network group, select the following options. Then select add to create the connectivity configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/network-group-options.png" alt-text="Screenshot of settings for network group configuration.":::

    | Setting | Value |
    | ------- | ----- |
    | Direct Connectivity | Select the checkbox for **Enable connectivity within network group**. This setting allows spoke virtual networks in the network group in the same region to communicate with each other directly. |
    | Global Mesh | Leave **Enable mesh connectivity across regions** option **unchecked**. This setting isn't required as both spokes are in the same region  |
    | Hub as gateway | Select the checkbox for **Hub as a gateway**. |    


1. Select **Next: Review + create >** and then create the connectivity configuration.

## Deploy the connectivity configuration

Make sure the virtual network gateway has been successfully deployed before deploying the connectivity configuration. If you deploy a hub and spoke configuration with **Use the hub as a gateway** enabled and there's no gateway, the deployment fails. For more information, see [use hub as a gateway](concept-connectivity-configuration.md#use-hub-as-a-gateway).

1. Select **Deployments** under *Settings*, then select **Deploy configuration**.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployments.png" alt-text="Screenshot of deployments page in Network Manager.":::

1. Select the following settings:

    :::image type="content" source="./media/create-virtual-network-manager-portal/deploy-configuration.png" alt-text="Screenshot of deploy a configuration page.":::

    | Setting | Value |
    | ------- | ----- |
    | Configurations | Select **Include connectivity configurations in your goal state** . |
    | Connectivity configurations | Select **cc-learn-prod-eastus-001**.  |
    | Target regions | Select **East US** as the deployment region. |


1. Select **Next** and then select **Deploy** to complete the deployment.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-confirmation.png" alt-text="Screenshot of deployment confirmation message.":::

1. The deployment displays in the list for the selected region. The deployment of the configuration can take a few minutes to complete.

    :::image type="content" source="./media/create-virtual-network-manager-portal/deployment-in-progress.png" alt-text="Screenshot of configuration deployment in progress status.":::

## Create a security admin configuration

1. Select **Configuration** under *Settings* again, then select **+ Create**, and select **SecurityAdmin** from the menu to begin creating a SecurityAdmin configuration.

1. Enter the name **sac-learn-prod-eastus-001** for the configuration, then select **Next: Rule collections**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/security-admin-configuration.png" alt-text="Screenshot of Security Admin configuration page.":::

1. Enter the name **rc-learn-prod-eastus-001** for the rule collection and select **ng-learn-prod-eastus-001** for the target network group. Then select **+ Add**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-rule-collection.png" alt-text="Screenshot of add a rule collection page.":::

1. Enter and select the following settings, then select **Add**:

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/add-rule.png" alt-text="Screenshot of add a rule page and rule settings.":::

    | Setting | Value |
    | ------- | ----- |
    | Name    | Enter **DENY_INTERNET** |
    | Description | Enter **This rule blocks traffic to the internet on HTTP and HTTPS** |
    | Priority | Enter **1** |
    | Action | Select **Deny** |
    | Direction | Select **Outbound** |
    | Protocol | Select **TCP** |
    | **Source** |  |
    | Source type | Select **IP** |
    | Source IP addresses | Enter **\*** |
    | **Destination** |  |
    | Destination type | Select **IP addresses** |
    | Destination IP addresses | Enter **\*** |
    | Destination port | Enter **80, 443** |

1. Select **Add** to add the rule collection to the configuration.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/save-rule-collection.png" alt-text="Screenshot of save button for a rule collection.":::

1. Select **Review + create** and **Create** to create the security admin configuration.

## Deploy the security admin configuration

1. Select **Deployments** under *Settings*, then select **Deploy configurations**.

1. Under *Configurations*, Select **Include security admin in your goal state** and the **sac-learn-prod-eastus-001** configuration you created in the last section. Then select **East US** as the target region and select **Next**.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deploy-security.png" alt-text="Screenshot of deploying a security configuration.":::

1. Select **Next** and then **Deploy**. You should now see the deployment show up in the list for the selected region. The deployment of the configuration can take a few minutes to complete.

## Verify deployment of configurations

### Verify from a virtual network

1. Go to **vnet-learn-hub-eastus-001** virtual network and select **Network Manager** under **Settings**. The **Connectivity configurations** tab lists **cc-learn-prod-eastus-001** connectivity configuration applied in the 

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vnet-connectivity-configuration.png" alt-text="Screenshot of connectivity configuration applied to the virtual network.":::

1. Select the **Security admin configurations** tab and expand **Outbound** to list the security admin rules applied to this virtual network.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/verify-security-admin-configuration.png" alt-text="Screenshot of security admin configuration applied to the virtual network."::: 

1. Select **Peerings** under **Settings** to list the virtual network peerings created by Virtual Network Manager. Its name starts with **ANM_**. 

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vnet-peerings.png" alt-text="Screenshot of virtual network peerings created by Virtual Network Manager." lightbox="media/tutorial-create-secured-hub-and-spoke/vnet-peerings-large.png":::

### Verify from a VM

1. [Deploy a test virtual machine](../virtual-machines/linux/quick-create-portal.md) into **vnet-learn-prod-eastus-001**.

1. Go to the test VM created in *vnet-learn-prod-eastus-001* and select **Networking** under *Settings*. Select **Outbound port rules** and verify the **DENY_INTERNET** rule is applied.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/vm-security-rules.png" alt-text="Screenshot of test VM's network security rules.":::

1. Select the network interface name and select **Effective routes** under **Help** to verify the routes for the virtual network peerings.The `10.2.0.0/16` route with the **Next Hop Type** of `VNet peering` is the route to the hub virtual network.

    :::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/effective-routes.png" alt-text="Screenshot of effective routes from test VM network interface." :::

## Clean up resources

If you no longer need the Azure Virtual Network Manager, you need to make sure all of following is true before you can delete the resource:

* There are no deployments of configurations to any region.
* All configurations have been deleted.
* All network groups have been deleted.

Use the [remove components checklist](concept-remove-components-checklist.md) to make sure no child resources are still available before deleting the resource group.

## Next steps

Learn how to block network traffic with a [Security admin configuration](how-to-block-network-traffic-portal.md).
