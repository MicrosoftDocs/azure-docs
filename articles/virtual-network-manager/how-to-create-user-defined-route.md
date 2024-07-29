---
title: Create User-Defined Routes with Azure Virtual Network Manager
description: Learn how to deploy User-Defined Routes (UDRs) with Azure Virtual Network Manager using the Azure portal.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 04/30/2024
#customer intent: As a network engineer, I want to deploy User-Defined Routes (UDRs) with Azure Virtual Network Manager.
---

# Create User-Defined Routes (UDRs) in Azure Virtual Network Manager

In this article, you learn how to deploy [User-Defined Routes (UDRs)](concept-user-defined-route-management.md) with Azure Virtual Network Manager in the Azure portal. UDRs allow you to describe your desired routing behavior, and Virtual Network Manager orchestrates UDRs to create and maintain that behavior. You deploy all the resources needed to create UDRs, including the following resources:
    
- Virtual Network Manager instance
    
- Two virtual networks and a network group
    
- Routing configuration to create UDRs for the network group

[!INCLUDE [virtual-network-manager-udr-preview](../../includes/virtual-network-manager-udr-preview.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- You need to have the **Network Contributor Role** for the scope that you want to use for your virtual network manager instance. 

## Create a Virtual Network Manager instance

In this step, you deploy a Virtual Network Manager instance with the defined scope and access that you need. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **+ Create a resource** and search for **Network Manager**. Then select **Network Manager** > **Create** to begin setting up Virtual Network Manager.

1. On the **Basics** tab, enter or select the following information, and then select **Review + create**.

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy Virtual Network Manager. |
    | **Resource group** | Select **Create new** and enter **rg-vnm**.</br> Select **Ok**. |
    | **Name** | Enter **vnm-1**. |
    | **Region** | Select **(US) East US** or a region of your choosing. Virtual Network Manager can manage virtual networks in any region. The selected region is where the Virtual Network Manager instance is deployed. |
    | **Description** | *(Optional)* Provide a description about this Virtual Network Manager instance and the task it's managing. |
    | [Features](concept-network-manager-scope.md#features) | Select **User defined routing** from the dropdown list. |

1. Select the **Management scope** tab or select **Next: Management scope >** to continue.

1. On the **Management scope** tab, select **+ Add**.

1. In **Add scopes**, select your subscription then choose **Select**. 

1. Select **Review + create** and then select **Create** to deploy the Virtual Network Manager instance.

## Create virtual networks and subnets

In this step, you create two virtual networks to become members of a network group.

1. From the **Home** screen, select **+ Create a resource** and search for **Virtual network**. 

1. Select **Virtual network > Create** to begin configuring a virtual network.

1. On the **Basics** tab, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the subscription where you want to deploy this virtual network. |
    | **Resource group** | Select **rg-vnm**. |
    | **Virtual network name** | Enter **vnet-spoke-001**. |
    | **Region** | Select **(US) East US**. |

1. Select **Next > Next** or the **IP addresses** tab.


1. On the **IP addresses** tab, enter an IPv4 address range of **10.0.0.0** and **/16**.

1. Under **Subnets**, select **default** and enter the following information in the **Edit Subnet** window:

    | Setting | Value |
    | -------- | ----- |
    | **Subnet purpose** | Leave as **Default**. |
    | **Name** | Leave as **default**. |
    | **IPv4** | |
    | **IPv4 address range** | Select **10.0.0.0/16**. |
    | **Starting address** | Enter **10.0.1.0**. |
    | **Size** | Enter **/24 (256 addresses)**. |

    :::image type="content" source="media/how-to-deploy-user-defined-routes/edit-subnet.png" alt-text="Screenshot of subnet settings in Azure portal.":::

1. Select **Save** then **Review + create > Create**.

1. Return to home and repeat the preceding steps to create another virtual network with the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select the same subscription that you selected in step 2. |
    | **Resource group** | Select **rg-vnm**. |
    | **Virtual network name** | Enter **vnet-spoke-002**. |
    | **Region** | Select **(US) East US**. |
    | **Edit subnet window** | |
    | **Subnet purpose** | Leave as **Default**. |
    | **Name** | Leave as **default**. |
    | **IPv4** | |
    | **IPv4 address range** | Select **10.1.0.0/16**. |
    | **Starting address** | Enter **10.1.1.0**. |
    | **Size** | Enter **/24 (256 addresses)**. |

1. Select **Save** then **Review + create > Create**.

## Create a network group with Azure Policy

In this step, you create a network group containing your virtual networks using Azure policy.

1. From the **Home** page, select **Resource groups** and browse to the **rg-vnm** resource group, and select the **vnm-1** Virtual Network Manager instance.

1. Under **Settings**, select **Network groups**. Then select **Create**.

1. On the **Create a network group** pane, enter the following information:
   
    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **ng-spoke**. |
    | **Description** | *(Optional)* Provide a description about this network group. |
    | **Member type** | Select **Virtual network**. |

1. Select **Create**.

1. Select **ng-spoke** and choose **Create Azure Policy**.
   
   :::image type="content" source="media/how-to-deploy-user-defined-routes/network-group-page.png" alt-text="Screenshot of network group page with options for group creation and membership view.":::

1. In **Create Azure Policy**, enter or select the following information:
   
    | Setting | Value |
    | ------- | ----- |
    | **Policy name** | Enter **ng-azure-policy**. |
    | **Scope** | Select **Select Scope** and choose your subscription, if not already selected. |

1. Under **Criteria**, enter a conditional statement to define the network group membership. Enter or select the following information:
    
    | Setting | Value |
    | ------- | ----- |
    | **Parameter** | Select **Name** from the dropdown menu. |
    | **Operator** | Select **Contains** from the dropdown menu. |
    | **Condition** | Enter **-spoke-**. |

    :::image type="content" source="media/how-to-deploy-user-defined-routes/create-azure-policy.png" alt-text="Screenshot of create Azure Policy window defining a conditional statement for network group membership.":::
        ```
1. Select **Preview Resources** to see the resources included in the network group, and select **Close**.
   
   :::image type="content" source="media/how-to-deploy-user-defined-routes/azure-policy-preview-resources.png" alt-text="Screenshot of preview screen for Azure Policy resources based on conditional statement.":::

1. Select **Save** to create the policy.
   
## Create a routing configuration and rule collection

In this step, you define the UDRs for the network group by creating a routing configuration and rule collection with routing rules.

1. Return the **vnm-1** Virtual Network Manager instance and **Configurations** under **Settings**.

1. Select **+ Create** or **Create routing configuration**.

1. In **Create a routing configuration**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **routing-configuration**. |
    | **Description** | *(Optional)* Provide a description about this routing configuration. |

1. Select **Rule collections** tab or **Next: Rule collections >**.

1. In **Rule collections**, select **+ Add**.

1. In **Add a rule collection**, enter, or select the following information:
   
    | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **rule-collection-1**. |
    | **Description** | *(Optional)* Provide a description about this rule collection. |
    | **Local route setting** | Select **Direct routing within virtual network**. |
    | **Target network groups** | select **ng-spoke**. |

    :::image type="content" source="media/how-to-deploy-user-defined-routes/add-rule-collection.png" alt-text="Screenshot of Add a rule collection window with target network group selected.":::

    > [!NOTE]
    > With the **Local route setting** option, you can choose how to route traffic within the same virtual network or subnet. For more information, see [Local route settings](concept-user-defined-route-management.md#local-routing-settings).

1. Under **Routing rules**, select **+ add**.

1. In **Add a routing rule**, enter, or select the following information:
   
   | Setting | Value |
    | ------- | ----- |
    | **Name** | Enter **rr-spoke**. |
    | **Destination** | |
    | **Destination type** | Select **IP address**. |
    | **Destination IP addresses/CIDR ranges** | Enter **0.0.0.0/0**. |
    | **Next hop** | |
    | **Next hop type** | Select **Virtual network**. |

    :::image type="content" source="media/how-to-deploy-user-defined-routes/add-routing-rule-virtual-network.png" alt-text="Screenshot of Add a routing rule window with selections for virtual network next hop.":::

1. Select **Add** and **Add to save the routing rule collection.

1. Select **Review + create** and then **Create** to create the routing configuration.

## Deploy the routing configuration

In this step, you deploy the routing configuration to create the UDRs for the network group.

1. On the **Configurations** page, select the checkbox for **routing-configuration** and choose **Deploy** from the taskbar.
   
   :::image type="content" source="media/how-to-deploy-user-defined-routes/deploy-routing-configuration.png" alt-text="Screenshot of routing configurations with configuration selected and deploy link.":::

1. In **Deploy a configuration** , select, or enter the **routing-configuration**
   
   | Setting | Value |
    | ------- | ----- |
    | **Configurations** |  |
    | **Include user defined routing configurations in your goal state** | Select checkbox. |
    | **User defined routing configurations** | Select **routing-configuration**. |
    | **Region** |  |
    | **Target regions** | Select **(US) East US**. |

1. Select **Next** and then **Deploy** to deploy the routing configuration.

> [!NOTE]
> When you create and deploy a routing configuration, you need to be aware of the impact of existing routing rules. For more information, see [limitations for UDR management](./concept-user-defined-route.md#limitations-of-udr-management).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about User-Defined Routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md)



