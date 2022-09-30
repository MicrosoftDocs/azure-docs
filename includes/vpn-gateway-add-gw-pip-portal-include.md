---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/29/2022
 ms.author: cherylmc
 ms.custom: include file

# The numbers in this include are correct. They add on to sections in multiple articles that are already numbered.
---
3. Specify in the values for **Public IP address**. These settings specify the public IP address object that gets associated to the VPN gateway. The public IP address is dynamically assigned to this object when the VPN gateway is created. The only time the Public IP address changes is when the gateway is deleted and re-created. It doesn't change across resizing, resetting, or other internal maintenance/upgrades of your VPN gateway.

   :::image type="content" source="./media/vpn-gateway-add-gw-pip-portal/pip-details.png" alt-text="Screenshot of public IP address field." lightbox="./media/vpn-gateway-add-gw-pip-portal/pip-details.png":::

     * **Public IP address type**: In most cases, you want to use the Basic Public IP address type. If you don't see this field on the portal page, you may have selected a gateway SKU that pre-selects this value for you.
     * **Public IP address**: Leave **Create new** selected.
     * **Public IP address name**: In the text box, type a name for your public IP address instance.
     * **Public IP address SKU**: This field is controlled by the **Public IP Address Type** setting.
     * **Assignment**: VPN gateway supports only Dynamic.
     * **Enable active-active mode**: Only select **Enable active-active mode** if you're creating an active-active gateway configuration. Otherwise, leave this setting **Disabled**.
     * Leave **Configure BGP** as **Disabled**, unless your configuration specifically requires this setting. If you do require this setting, the default ASN is 65515, although this value can be changed.
4. Select **Review + create** to run validation.
5. Once validation passes, select **Create** to deploy the VPN gateway.