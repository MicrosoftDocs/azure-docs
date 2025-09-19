---
title: 'QuickStart: Create and configure Azure DDoS Network Protection using - Azure portal'
description: Learn how to use Azure DDoS Network Protection to mitigate an attack.
author: AbdullahBell
ms.author: abell
ms.service: azure-ddos-protection
ms.topic: quickstart
ms.date: 03/17/2025
ms.custom: template-quickstart
# Customer intent: As a network administrator, I want to create and configure a DDoS protection plan for my virtual networks, so that I can safeguard my resources from distributed denial-of-service attacks.
---

# QuickStart: Create and configure Azure DDoS Network Protection using the Azure portal

Get started with Azure DDoS Network Protection by using the Azure portal.

A DDoS protection plan defines a set of virtual networks that have DDoS Network Protection enabled, across subscriptions. You can configure one DDoS protection plan for your organization and link virtual networks from multiple subscriptions under a single Microsoft Entra tenant to the same plan.

In this QuickStart, you create a DDoS protection plan and link it to a virtual network.

:::image type="content" source="./media/manage-ddos-protection/ddos-network-protection-diagram-simple.png" alt-text="Diagram of DDoS Network Protection." lightbox="./media/manage-ddos-protection/ddos-network-protection-diagram-simple.png":::

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

[!INCLUDE [DDoS-Protection-virtual-network-relocate-note.md](../../includes/DDoS-Protection-virtual-network-relocate-note.md)]

### Enable for an existing virtual network

1. Create a DDoS protection plan by completing the steps in [Create a DDoS protection plan](#create-a-ddos-protection-plan), if you don't have an existing DDoS protection plan.
1. Enter the name of the virtual network in the **Search resources, services, and docs** box at the top of the Azure portal. When it appears in the search results, select it.
1. Under **Settings**, select **DDoS protection**.
1. Select **Enable**. Under **DDoS protection plan**, choose an existing plan or the one you created in step 1, then select **Save**. The plan can be in the same or a different subscription than the virtual network, but both must be associated with the same Microsoft Entra tenant. 

### Add Virtual Networks to an existing DDoS protection plan

You can also enable the DDoS protection plan for an existing virtual network from the DDoS Protection plan itself. This is useful if you have multiple virtual networks to protect with the same plan. 

1. Search for **DDoS protection plans** in the **Search resources, services, and docs box** at the top of the Azure portal. When it appears, select it.
1. Select the desired DDoS protection plan from the list.
1. Under **Settings**, select **Protected resources**.
1. Select **Add**, choose the subscription, resource group, and virtual network, then select **Add** again.

## Configure an Azure DDoS Protection Plan using Azure Firewall Manager 

Azure Firewall Manager is a platform to manage and protect your network resources at scale. You can associate your virtual networks with a DDoS protection plan within Azure Firewall Manager. See [Configure an Azure DDoS Protection Plan using Azure Firewall Manager](../firewall-manager/configure-ddos.md).

## Enable DDoS protection for all virtual networks

This [built-in policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94de2ad3-e0c1-4caf-ad78-5d47bbc83d3d) detects virtual networks within a defined scope that don't have DDoS Network Protection enabled. It can then optionally create a remediation task to enable protection for the virtual network. See [Azure Policy built-in definitions for Azure DDoS Network Protection](policy-reference.md) for full list of built-in policies.

## View protected resources

First, check the details of your DDoS protection plan:

1. Search for **DDoS protection plans** in the **Search resources, services, and docs box** at the top of the Azure portal. When it appears, select it.
1. Select your DDoS protection plan from the list.
1. Under **Settings**, select **Protected resources**.
1. In the **Protected resources** page, you can view the resources that are protected by this DDoS protection plan.


### Disable for a virtual network:

You can disable DDoS protection for a virtual network while keeping it enabled on other virtual networks. To disable DDoS protection for a virtual network, follow these steps.

1. Search for **Virtual Network** in the **Search resources, services, and docs box** at the top of the Azure portal. When it appears, select it.
1. Under **Settings**, select **DDoS Protection**.
1. Select **Disable** for **DDoS Network Protection**.

> [!NOTE]
> Disabling DDoS protection for a virtual network won't delete the protection plan. You'll still incur costs if you only disable DDoS protection without deleting the plan. To avoid unnecessary charges, you need to delete the DDoS protection plan resource. See [Clean up resources](#clean-up-resources). 

## Clean up resources

You can keep your resources for the next tutorial. If no longer needed, delete the *MyResourceGroup* used in this example. When you delete the resource group, you also delete the DDoS protection plan and all its related resources. If you don't intend to use this DDoS protection plan, you should remove resources to avoid unnecessary charges.

   >[!WARNING]
   >This action is irreversible.

1. In the Azure portal, search for and select **Resource groups**, or select **Resource groups** from the Azure portal menu.

1. Filter or scroll down to find the *MyResourceGroup* resource group.

1. Select the resource group, then select **Delete resource group**.

1. Type the resource group name to verify, and then select **Delete**.

> [!NOTE]
> To delete a DDoS protection plan, first dissociate all virtual networks from it.

## Next steps

To learn how to configure metrics alerts through Azure Monitor, continue to the tutorials.

> [!div class="nextstepaction"]
> [Configure Azure DDoS Protection metric alerts through portal](alerts.md)
