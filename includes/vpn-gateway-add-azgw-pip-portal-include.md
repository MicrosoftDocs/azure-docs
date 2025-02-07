---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 10/30/2024
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
   * **Availability zone**: This setting is available for AZ gateway SKUs in regions that support [availability zones](../articles/vpn-gateway/about-zone-redundant-vnet-gateways.md). Select Zone-redundant, unless you know you want to specify a zone.
   * **Enable active-active mode**: We recommend that you select **Enabled** to take advantage of the benefits of an [active-active mode](../articles/vpn-gateway/about-active-active-gateways.md) gateway. If you plan to use this gateway for a site-to-site connection, take into consideration the following:
      * Verify the [active-active design](../articles/vpn-gateway/about-active-active-gateways.md#active-active-mode-design) that you want to use. Connections with your on-premises VPN device must be configured specifically to take advantage of active-active mode.
      * Some VPN devices don't support active-active mode. If you're not sure, check with your VPN device vendor. If you're using a VPN device that doesn't support active-active mode, you can select **Disabled** for this setting. 
   * **Second public IP address:** Select **Create new**. This is available only if you selected **Enabled** for the **Enable active-active mode** setting.
   * **Public IP address name**: In the text box, enter a name for your public IP address instance.
   * **Public IP address SKU**: Setting is autoselected to Standard SKU.
   * **Availability zone**: Select Zone-redundant, unless you know you want to specify a zone.
   * **Configure BGP:** Select Disabled unless your configuration specifically requires this setting. If you do require this setting, the default ASN is 65515, although this value can be changed.
   * **Enable Key Vault Access**: Select Disabled unless your configuration specifically requires this setting.
4. Select **Review + create** to run validation.
5. After validation passes, select **Create** to deploy the VPN gateway.