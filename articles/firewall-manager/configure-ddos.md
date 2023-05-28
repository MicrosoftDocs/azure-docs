---
title: Configure Azure DDoS Protection Plan using Azure Firewall Manager
description: Learn how to use Azure Firewall Manager to configure Azure DDoS Protection Plan Standard
author: vhorne
ms.author: victorh
ms.service: firewall-manager
ms.topic: how-to
ms.date: 06/15/2022
ms.custom: template-how-to
---

# Configure an Azure DDoS Protection Plan using Azure Firewall Manager

Azure Firewall Manager is a platform to manage and protect your network resources at scale. You can associate your virtual networks with a DDoS protection plan within Azure Firewall Manager.

> [!TIP]
> DDoS Protection currently does not support virtual WANs. However, you can workaround this limitation by force tunneling Internet traffic to an Azure Firewall in a virtual network that has a DDoS Protection Plan associated with it.

Under a single tenant, DDoS protection plans can be applied to virtual networks across multiple subscriptions. For more information about DDoS protection plans, see  [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md).

To see how this works, you'll create a firewall policy and then a virtual network secured with an Azure Firewall. Then you'll create a DDoS Protection Plan and then associate it with the virtual network.

## Create a firewall policy

Use Firewall Manager to create a firewall policy.

1. From the [Azure portal](https://portal.azure.com), open Firewall Manager.
1. Select **Azure Firewall Policies**.
1. Select **Create Azure Firewall Policy**.
1. For **Resource group**, select **DDoS-Test-rg**.
1. Under **Policy details**, **Name**, type **fw-pol-01**.
1. For **Region**, select **West US 2**.
1. Select **Review + create**.
1. Select **Create**.


## Create a secured virtual network

Use Firewall Manager to create a secured virtual network.

1. Open Firewall Manager.
1. Select **Virtual Networks**.
1. Select **Create new Secured Virtual Network**.
1. For **Resource group**, select **DDoS-Test-rg**.
1. For **Region**, select **West US 2**.
1. For **Hub Virtual Network Name**, type **Hub-vnet-01**.
1. For **Address range**, type **10.0.0.0/16**.
1. Select **Next : Azure Firewall**.
1. For **Public IP address**, select **Add new** and type **fw-pip** for the name and select **OK**.
1. For **Firewall subnet address space**, type **10.0.0.0/24**.
1. Select the **fw-pol-01** for the **Firewall Policy**.
1. Select **Next : Review + create**.
1. Select **Create**.

## Create a DDoS Protection Plan

Create a DDoS Protection Plan using Firewall Manager. You can use the **DDoS Protection Plans** page to create and manage your Azure DDoS Protection Plans.

:::image type="content" source="media/configure-ddos/firewall-ddos.png" alt-text="Screenshot of the Firewall Manager DDoS Protection Plans page":::

1. Open Firewall Manager.
1. Select **DDoS Protection Plans**.
1. Select **Create**.
1. For **Resource group**, select **Create new**.
1. Type **DDos-Test-rg** for the resource group name.
1. Under **Instance details**, **Name**, type **DDoS-plan-01**.
1. For **Region**, select **(US) West US 2**.
1. Select **Review + create**.
1. Select **Create**.

## Associate a DDoS Protection Plan

Now you can associate the DDoS Protection Plan with the secured virtual network.

1. Open Firewall Manager.
1. Select **Virtual Networks**.
1. Select the check box for **Hub-vnet-01**.
1. Select **Manage Security**, **Add DDoS Protection Plan**.
1. For **DDoS protection standard**, select **Enable**.
1. For **DDoS protection plan**, select **DDoS-plan-01**.
1. Select **Add**.
1. After the deployment completes, select **Refresh**.

You should now see that the virtual network has an associated DDoS Protection Plan.

:::image type="content" source="media/configure-ddos/ddos-protection.png" alt-text="Screenshot showing virtual network with DDoS Protection Plan":::

## Next steps

- [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md)
- [Learn more about Azure network security](../networking/security/index.yml)
