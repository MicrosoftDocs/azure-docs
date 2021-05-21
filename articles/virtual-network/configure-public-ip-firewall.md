---
title: Manage public IP address with Azure Firewall
titleSuffix: Azure Virtual Network
description: Learn about the ways a public IP address is used with Azure Firewall and how to change the configuration.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to 
ms.date: 05/13/2021
ms.custom: template-how-to 
---

# Manage a public IP address with Azure Firewall

A public IP address in Azure is available in standard and basic SKUs. The selection of SKU determines the features of the IP address. The SKU determines the resources that the IP address can be associated with. 

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. Azure Firewall supports standard SKU public IP addresses. Public IP prefixes aren't supported.

Azure Firewall requires a public IP address for it's configuration. A public IP address is used as the external connection point of the Azure Firewall.

In this article, you'll learn how to create a Azure Firewall using an existing public IP in your subscription. 

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Three standard SKU public IP address in your subscription. The IP address can't be associated with any resources. For more information on creating a standard SKU public IP address, see [Create a public IP - Azure portal](create-public-ip-portal.md).
    - For the purposes of the examples in this article, name the new public IP addresses **myStandardPublicIP-1**, **myStandardPublicIP-2**, and **myStandardPublicIP-3**.

## Create Azure Firewall existing public IP

In this section, you'll create a Azure Firewall. You'll select the IP address you created in the prerequisites as the public IP for the firewall.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Firewall**.

3. In the search results, select **Firewalls**.

4. Select **+ Create**.

5. In **Create firewall**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupFW**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myFirewall**. |
    | Region | Select **West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | Firewall tier  | Leave the default of **Standard**. |
    | Firewall management | Leave the default of **Use a Firewall Policy to manage this firewall**.|
    | Firewall policy | Select **Add new**. </br> Enter **myFirewallPolicy** in **Policy name**. </br> In **Region** select **West US 2**. </br> Select **Yes**. |
    | Virtual network name | Enter **myVNet**. |
    | Address space | Enter **10.0.0.0/16**. |
    | Subnet address space | Enter **10.0.0.0/26**. |
    | Public IP address | Select **myStandardPublicIP-1** or your public IP. |
    | Forced tunneling | Leave the default of **Disabled**. |
    
 
6. Select the **Review + create** tab, or select the blue **Review + create** button.

7. Select **Create**.

> [!NOTE]
> This is a simple deployment of Azure Firewall. For advanced configuration and setup, see [Tutorial: Deploy and configure Azure Firewall and policy using the Azure portal](../firewall/tutorial-firewall-deploy-portal-policy.md)
>
> For more information on Azure Firewall, see [What is Azure Firewall?](../firewall/overview.md)

## Change public IP address

In this section, you'll change the public IP address associated with the default public IP configuration of the firewall.

1. In the search box at the top of the portal, enter **Firewall**.

2. In the search results, select **Firewalls**.

3. Select **myFirewall** in **Firewalls**.

4. Select **Public IP configuration** in **Settings** in **myFirewall**.

5. In **Public IP configuration**, select **myStandardPublicIP-1** or your IP address.

6. Select **myStandardPublicIP-2** in **Public IP address** of **Edit public IP configuration**.

7. Select **Save**.

## Add public IP configuration

In this section, you'll add a public IP configuration to the Azure Firewall.

1. In the search box at the top of the portal, enter **Firewall**.

2. In the search results, select **Firewalls**.

3. Select **myFirewall** in **Firewalls**.

4. Select **Public IP configuration** in **Settings** in **myFirewall**.

5. Select **+ Add public IP configuration**.

6. Enter **myNewPublicIPconfig** in **Name**.

7. Select **myStandardPublicIP-3** in **Public IP address**.

8. Select **Add**.
## Next steps

In this article, you learned how to create a Azure Firewall and use an existing public IP. You changed the public IP of the default IP configuration. Finally, you added a public IP configuration to the firewall.

- To learn more about public IP addresses in Azure, see [Public IP addresses](public-ip-addresses.md).
