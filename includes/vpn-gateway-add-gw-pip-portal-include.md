---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/16/2024
 ms.author: cherylmc

# The numbers in this include are correct. They add on to sections in multiple articles that are already numbered.
---
3. Specify the values for **Public IP address**. These settings specify the public IP address object that gets associated to the VPN gateway. The public IP address is assigned to this object when the VPN gateway is created. The only time the primary public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

   :::image type="content" source="./media/vpn-gateway-add-gw-pip-portal/pip-values.png" alt-text="Screenshot that shows the Public IP address field." lightbox="./media/vpn-gateway-add-gw-pip-portal/pip-values.png":::

     * **Public IP address type**: If you are presented with this option, select **Standard**. The **Basic** public IP address SKU is only supported for **Basic** SKU VPN gateways.
     * **Public IP address**: Leave **Create new** selected.
     * **Public IP address name**: In the text box, enter a name for your public IP address instance.
     * **Public IP address SKU**: Setting is autoselected.
     * **Assignment**: The assignment is typically autoselected. For the Standard SKU, assignment is always Static.
     * **Enable active-active mode**: Select **Disabled**. Only enable this setting if you're creating an active-active gateway configuration.
     * **Configure BGP**: Select **Disabled**, unless your configuration specifically requires this setting. If you do require this setting, the default ASN is 65515, although this value can be changed.
4. Select **Review + create** to run validation.
5. After validation passes, select **Create** to deploy the VPN gateway.