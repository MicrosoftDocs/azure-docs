---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/29/2024
 ms.author: cherylmc

# The numbers in this include are correct. They add on to sections in multiple articles that are already numbered.
---
3. Specify the values for **Public IP address**. These settings specify the public IP address objects that will be associated to the VPN gateway. A public IP address is assigned to each public IP address object when the VPN gateway is created. The only time the assigned public IP address changes is when the gateway is deleted and re-created. IP addresses don't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

   :::image type="content" source="./media/vpn-gateway-add-azgw-pip-portal/active-az-values.png" alt-text="Screenshot that shows the Public IP address field." lightbox="./media/vpn-gateway-add-gw-pip-portal/pip-values.png":::

   * **Public IP address type**: If this option appears, select **Standard**.

   * **Public IP address**: Leave **Create new** selected.
   * **Public IP address name**: In the text box, enter a name for your public IP address instance.
   * **Public IP address SKU**: Setting is autoselected to Standard SKU.
   * **Assignment**: The assignment is typically autoselected and should be Static.
   * **Availability zone**: Select Zone-redundant, unless you know you want to specify a zone.
   * **Enable active-active mode**: Select **Enabled**. This creates an [active-active](../articles/vpn-gateway/about-active-active-gateways.md) gateway configuration.
   * **Second public IP address:** Select **Create new**.
   * **Public IP address name**: In the text box, enter a name for your public IP address instance.
   * **Public IP address SKU**: Setting is autoselected to Standard SKU.
   * **Availability zone**: Select Zone-redundant, unless you know you want to specify a zone.
   * **Configure BGP:** Select Disabled unless your configuration specifically requires this setting. If you do require this setting, the default ASN is 65515, although this value can be changed.
4. Select **Review + create** to run validation.
5. After validation passes, select **Create** to deploy the VPN gateway.