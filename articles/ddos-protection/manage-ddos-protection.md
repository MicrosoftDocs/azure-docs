---
title: 'Quickstart: Create and configure Azure DDoS Network Protection using - Azure portal'
description: Learn how to use Azure DDoS Network Protection to mitigate an attack.
author: AbdullahBell
ms.author: abell
ms.service: ddos-protection
ms.topic: quickstart 
ms.date: 09/05/2023
ms.custom: template-quickstart, ignite-2022
---

# Quickstart: Create and configure Azure DDoS Network Protection using the Azure portal

Get started with Azure DDoS Network Protection by using the Azure portal.

A DDoS protection plan defines a set of virtual networks that have DDoS Network Protection enabled, across subscriptions. You can configure one DDoS protection plan for your organization and link virtual networks from multiple subscriptions under a single Microsoft Entra tenant to the same plan.

In this QuickStart, you create a DDoS protection plan and link it to a virtual network.

:::image type="content" source="./media/manage-ddos-protection/ddos-network-protection-diagram-simple.png" alt-text="Diagram of DDoS Network Protection.":::

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Sign in to the [Azure portal](https://portal.azure.com). Ensure that your account is assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in the how-to guide on [Permissions](manage-permissions.md).

## Create a DDoS protection plan

1. Select **Create a resource** in the upper left corner of the Azure portal.
1. Search the term *DDoS*. When **DDoS protection plan** appears in the search results, select it.
1. Select **Create**.
1. Enter or select the following values.

    |Setting        |Value                                              |
    |---------      |---------                                          |
    |Subscription   | Select your subscription.                         |
    |Resource group | Select **Create new** and enter **MyResourceGroup**.|
    |Name           | Enter **MyDdosProtectionPlan**.                     |
    |Region         | Enter **East US**.                                  |

1. Select **Review + create** then **Create**

[!INCLUDE [DDoS-Protection-region-requirement.md](../../includes/DDoS-Protection-region-requirement.md)]

## Enable DDoS protection for a virtual network
### Enable for a new virtual network

1. Select **Create a resource** in the upper left corner of the Azure portal.
1. Select **Networking**, and then select **Virtual network**.
1. Enter or select the following values then select **Next**.

    | Setting         | Value                                           |
    | ---------       | ---------                                       |
    | Subscription    | Select your subscription.                                    |
    | Resource group  | Select **Use existing**, and then select **MyResourceGroup** |
    | Name            | Enter **MyVnet**.                                 |
    | Region          | Enter **East US**.                                                   |

1. In the *Security* pane, select **Enable** on the **Azure DDoS Network Protection** radio.
1. Select **MyDdosProtectionPlan** from the **DDoS protection plan** pane. The plan you select can be in the same, or different subscription than the virtual network, but both subscriptions must be associated to the same Microsoft Entra tenant.
1. Select **Next**. In the IP address pane, select **Add IPv4 address space** and enter the following values. Then select **Add**.

    | Setting              | Value                                                                         |
    | ---------            | ---------                                                                     |
    | IPv4 address space   | Enter **10.1.0.0/16.**                                                        |
    | Subnet name          | Under **Subnet name**, select the **Add subnet** link and enter **mySubnet.** |
    | Subnet address range | Enter **10.1.0.0/24.**                                                        |

1. Select **Review + create** then **Create**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-create-virtual-network.gif" alt-text="Gif of creating a virtual network with Azure DDoS Protection.":::

[!INCLUDE [DDoS-Protection-virtual-network-relocate-note.md](../../includes/DDoS-Protection-virtual-network-relocate-note.md)]

### Enable for an existing virtual network

1. Create a DDoS protection plan by completing the steps in [Create a DDoS protection plan](#create-a-ddos-protection-plan), if you don't have an existing DDoS protection plan.
1. Enter the name of the virtual network that you want to enable DDoS Network Protection for in the **Search resources, services, and docs box** at the top of the Azure portal. When the name of the virtual network appears in the search results, select it.
1. Select **DDoS protection**, under **Settings**.
1. Select **Enable**. Under **DDoS protection plan**, select an existing DDoS protection plan, or the plan you created in step 1, and then select **Save**. The plan you select can be in the same, or different subscription than the virtual network, but both subscriptions must be associated to the same Microsoft Entra tenant. 

    :::image type="content" source="./media/manage-ddos-protection/ddos-update-virtual-network.gif" alt-text="Gif of enabling DDoS Protection for a virtual network.":::

### Add Virtual Networks to an existing DDoS protection plan

You can also enable the DDoS protection plan for an existing virtual network from the DDoS Protection plan, not from the virtual network. 

1. Search for "DDoS protection plans" in the **Search resources, services, and docs box** at the top of the Azure portal. When **DDoS protection plans** appears in the search results, select it.
1. Select the desired DDoS protection plan you want to enable for your virtual network. 
1. Select  **Protected resources** under **Settings**.
1. Select **+Add** and select the right subscription, resource group and the virtual network name. Select **Add** again. 

    :::image type="content" source="./media/manage-ddos-protection/ddos-add-to-virtual-network.gif" alt-text="Gif of adding a virtual network with Azure DDoS Protection.":::
## Configure an Azure DDoS Protection Plan using Azure Firewall Manager (preview)

Azure Firewall Manager is a platform to manage and protect your network resources at scale. You can associate your virtual networks with a DDoS protection plan within Azure Firewall Manager. This functionality is currently available in Public Preview. See [Configure an Azure DDoS Protection Plan using Azure Firewall Manager](../firewall-manager/configure-ddos.md).

:::image type="content" source="./media/manage-ddos-protection/ddos-protection.png" alt-text="Screenshot showing virtual network with DDoS Protection Plan.":::

## Enable DDoS protection for all virtual networks

This [built-in policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94de2ad3-e0c1-4caf-ad78-5d47bbc83d3d) detects any virtual networks in a defined scope that don't have DDoS Network Protection enabled. This policy will then optionally create a remediation task that creates the association to protect the Virtual Network. See [Azure Policy built-in definitions for Azure DDoS Network Protection](policy-reference.md) for full list of built-in policies.

## Validate and test

First, check the details of your DDoS protection plan:

1. Select **All services** on the top, left of the portal.
1. Enter *DDoS* in the **Filter** box. When **DDoS protection plans** appear in the results, select it.
1. Select your DDoS protection plan from the list.

The _MyVnet_ virtual network should be listed.

## View protected resources
Under **Protected resources**, you can view your protected virtual networks and public IP addresses, or add more virtual networks to your DDoS protection plan:

:::image type="content" source="./media/manage-ddos-protection/ddos-protected-resources.png" alt-text="Screenshot showing protected resources.":::

### Disable for a virtual network:

To disable DDoS protection for a virtual network proceed with the following steps.

1. Enter the name of the virtual network you want to disable DDoS Network Protection for in the **Search resources, services, and docs box** at the top of the portal. When the name of the virtual network appears in the search results, select it.
1. Under **DDoS Network Protection**, select **Disable**.

    :::image type="content" source="./media/manage-ddos-protection/ddos-disable-in-virtual-network.gif" alt-text="Gif of disabling DDoS Protection within virtual network.":::

## Clean up resources

You can keep your resources for the next tutorial. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also delete the DDoS protection plan and all its related resources. If you don't intend to use this DDoS protection plan, you should remove resources to avoid unnecessary charges.

   >[!WARNING]
   >This action is irreversible.

1. In the Azure portal, search for and select **Resource groups**, or select **Resource groups** from the Azure portal menu.

1. Filter or scroll down to find the _MyResourceGroup_ resource group.

1. Select the resource group, then select **Delete resource group**.

1. Type the resource group name to verify, and then select **Delete**.

> [!NOTE]
> If you want to delete a DDoS protection plan, you must first dissociate all virtual networks from it.

## Next steps

To learn how to configure metrics alerts through Azure Monitor, continue to the tutorials.

> [!div class="nextstepaction"]
> [Configure Azure DDoS Protection metric alerts through portal](alerts.md)
