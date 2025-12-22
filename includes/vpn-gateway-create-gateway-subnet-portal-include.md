---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 06/30/2025
 ms.author: cherylmc
---

1. On the page for your virtual network, on the left pane, select **Subnets** to open the **Subnets** page.
1. At the top of the page, select **+ Subnet** to open the **Add subnet** pane.
1. For **Subnet purpose**, select **Virtual Network Gateway** from the dropdown.
1. The name is automatically entered as **GatewaySubnet**. Adjust starting IP address and size if necessary. For example, **10.1.255.0/27**.
1. Don't adjust the other values on the page. Click **Add** to add the subnet.

For more information about adding a subnet to your virtual network, see [Add, change, or delete a virtual network subnet](../articles/virtual-network/virtual-network-manage-subnet.md). For steps to add an address range to your virtual network, see [Add or remove an address range](../articles/virtual-network/manage-virtual-network.yml).