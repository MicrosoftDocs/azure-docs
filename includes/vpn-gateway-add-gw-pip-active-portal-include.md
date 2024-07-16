---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/17/2024
 ms.author: cherylmc
---
4. Specify in the values for **Public IP address**. These settings specify the public IP address object that gets associated to the VPN gateway. When you create a public IP address object, an IP address is assigned to the object. The public IP address object is then associated to the gateway. For gateways that aren't [zone-redundant](../articles/vpn-gateway/about-zone-redundant-vnet-gateways.md), the only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway. You must associate a public IP address object that uses the **Standard** SKU. The Basic SKU public IP address object is only supported for Basic SKU VPN gateways.

   :::image type="content" source="./media/vpn-gateway-add-gw-pip-active-portal/pip-details.png" alt-text="Screenshot of public IP address field.":::

     * **Public IP address**: Leave **Create new** selected.
     * **Public IP address name**: In the text box, type a name for your public IP address instance.
     * **Assignment**: Static is selected automatically.
     * **Enable active-active mode**: Select **Enabled**.
     * **Second Public IP Address**: Select **Create new**.
     * **Public IP address name**: Name the second Public IP address.
     * Leave **Configure BGP** as **Disabled**, unless your configuration specifically requires this setting. If you do require this setting, the default ASN is 65515, but other ASNs can be used.
5. Select **Review + create** to run validation.
6. Once validation passes, select **Create** to deploy the VPN gateway.