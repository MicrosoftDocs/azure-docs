---
 title: include file
 description: include file
 services: virtual-network
 author: asudbring
 ms.service: virtual-network
 ms.topic: include
 ms.date: 03/15/2022
 ms.author: allensu
 ms.custom: include file
---

## Create a virtual network

The following procedure creates a virtual network with a resource subnet, an Azure Bastion subnet, and an Azure Bastion host.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the portal, search for and select **Virtual networks**.

1. On the **Virtual networks** page, select **Create**.

1. On the **Basics** tab of the **Create virtual network** screen, enter or select the following information:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the group *TestRG*.
   - **Virtual network name**: Enter *VNet*.
   - **Region**: Keep the default or select a different region for the network and all its resources.

   :::image type="content" source="media/virtual-networks-quick-create-portal/example-basics-tab.png" alt-text="Screenshot of the Create virtual network screen in the Azure portal.":::

1. Select **Next**.

1. On the **Security** tab, select **Enable Azure Bastion**.

   Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview).

1. Select **Next** to accept the defaults for **Azure Bastion host name** and **Azure Bastion public IP address**.

   :::image type="content" source="media/virtual-networks-quick-create-portal/example-security-tab.png" alt-text="Screenshot of the Security tab of the Create virtual network screen.":::

1. On the **IP Addresses** tab, accept the settings for the **default** subnet and select **Add Azure Bastion subnet** near the bottom of the page.

   :::image type="content" source="media/virtual-networks-quick-create-portal/example-ip-address-tab.png" alt-text="Screenshot of the IP Addresses tab of the Create virtual network screen.":::

1. On the next screen, select **Review + create** to accept the following defaults:

   - A virtual network IPv4 address space of **10.0.0.0/16**.
   - A resource subnet named **default** with address range **10.0.0.0/24**.
   - Another subnet named **AzureBastionSubnet** with address space **10.0.1.0/26**. A subnet that hosts Azure Bastion must be named AzureBastionSubnet.

   :::image type="content" source="media/virtual-networks-quick-create-portal/example-review-create.png" alt-text="Screenshot of the completed IP Addresses tab of the Create virtual network screen.":::

1. After validation succeeds, select **Create**. It takes a few minutes to create the Bastion host.

