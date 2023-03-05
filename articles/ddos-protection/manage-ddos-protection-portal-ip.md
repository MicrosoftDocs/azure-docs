---
title: 'Quickstart: Create and configure Azure DDoS IP Protection - Azure portal'
description: Learn how to use Azure DDoS IP Protection to mitigate an attack. 
author: AbdullahBell
ms.author: abell
ms.service: ddos-protection
ms.topic: quickstart 
ms.date: 03/01/2023
ms.workload: infrastructure-services
ms.custom: template-quickstart 
# Customer intent As an IT admin, I want to learn how to enable DDoS IP Protection on my public IP address.
---

# Quickstart: Create and configure Azure DDoS IP Protection using Azure portal

Get started with Azure DDoS IP Protection by using the Azure portal.
In this quickstart, you'll enable DDoS IP protection and link it to a public IP address.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Sign in to the Azure portal at https://portal.azure.com. Ensure that your account is assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in the how-to guide on [Permissions](manage-permissions.md).

## Enable DDoS IP Protection on a public IP address

### Create a public IP address

1. Select **Create a resource** in the upper left corner of the Azure portal.
1. Select **Networking**, and then select **Public IP address**.
1. Select **Create**.
1. Enter or select the following values.

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4.              |    
    | SKU                     | Select **Standard**.         |
    | Tier                   | Select **Regional**.     |
    | Name                    | Enter **myStandardPublicIP**.          |
    | IP address assignment   | Locked as **Static**.                |
    | Routing Preference     | Select **Microsoft network**. |
    | Idle Timeout (minutes)  | Leave the default of **4**.        |
    | DNS name label          | Leave the value blank.    |
    | Subscription            | Select your subscription.   |
    | Resource group          | Select **Create new**, enter **MyResourceGroup**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**.     |
    | Availability Zone       | Select **No Zone**. |

    :::image type="content" source="./media/ddos-protection-quickstarts/ddos-protection-create-ip.png" alt-text="Screenshot of create standard IP address in Azure portal.":::

1. Select **Create**.

### Enable DDoS IP Protection for an existing Public IP address

1. In the search box at the top of the portal, enter **public IP Address**. Select **public IP Address**.
1. Select your Public IP address. In this example, select **myStandardPublicIP**.
1. In the **Overview** pane, select the **Properties** tab, then select **DDoS protection**. 
        :::image type="content" source="./media/ddos-protection-quickstarts/ddos-protection-view-status.png" alt-text="Screenshot showing view of Public IP Properties.":::
1. In the **Configure DDoS protection** pane, under **Protection type**, select  **IP**, then select **Save**.
        :::image type="content" source="./media/ddos-protection-quickstarts/ddos-protection-select-status.png" alt-text="Screenshot of selecting IP Protection in Public IP Properties.":::
### Disable DDoS IP protection for a Public IP address:

1. Enter the name of the public IP address you want to disable DDoS IP Protection for in the **Search resources, services, and docs box** at the top of the portal. When the name of public IP address appears in the search results, select it.
1. Under **Properties** in the overview pane, select **DDoS Protection**.
1. Under **Protection type** select **Disable**, then select **Save**.
        :::image type="content" source="./media/ddos-protection-quickstarts/ddos-protection-disable-status.png" alt-text="Screenshot of disabling IP Protection in Public IP Properties.":::

> [!NOTE]
> When changing DDoS IP protection from **Enabled** to **Disabled**, telemetry for the public IP resource will not be available.
## Validate and test

First, check the details of your public IP address:

1. Select **All resources** on the top, left of the portal.
1. Enter *public IP address* in the **Filter** box. When **public IP address** appear in the results, select it.
1. Select your public IP Address from the list.
1. In the **Overview** pane, select the **Properties** tab in the middle of the page, then select **DDoS protection**. 
1. View **Protection status** and verify your public IP is protected.
        :::image type="content" source="./media/ddos-protection-quickstarts/ddos-protection-protected-status.png" alt-text="Screenshot of status of IP Protection in Public IP Properties.":::


## Clean up resources

You can keep your resources for the next article. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also remove DDoS IP Protection and all its related resources.

   >[!WARNING]
   >This action is irreversible.

1. In the Azure portal, search for and select **Resource groups**, or select **Resource groups** from the Azure portal menu.

1. Filter or scroll down to find the _MyResourceGroup_ resource group.

1. Select the resource group, then select **Delete resource group**.

1. Type the resource group name to verify, and then select **Delete**.


## Next steps

To learn how to configure metric alerts through the Azure portal, continue to the next article.

> [!div class="nextstepaction"]
> [Configure Azure DDoS Protection metric alerts through portal](alerts.md)
