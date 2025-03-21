---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 03/10/2025
 ms.author: cherylmc

# The numbers in this include are correct. They add on to sections in multiple articles that are already numbered.
---
3. Specify the values for **Public IP address**. These settings specify the public IP address object that gets associated to the VPN gateway. The public IP address is assigned to this object when the VPN gateway is created. The only time the primary public IP address changes is when the gateway is deleted and re-created. 

   | Setting | Value |
   | --- | --- |
   | Public IP address name | Example: VNet1GWpip1 |
   | Availability zone | This setting is available for AZ SKUs in regions that support [availability zones](../articles/vpn-gateway/about-zone-redundant-vnet-gateways.md). Example: **Zone-redundant**.  |
   | Enable active-active mode | - Select **Enabled** to take advantage of the benefits of an [active-active gateway](../articles/vpn-gateway/about-active-active-gateways.md). An active-active gateway requires an additional public IP address.<br>- If you plan to use this gateway for site-to-site connections, verify the [active-active design](../articles/vpn-gateway/about-active-active-gateways.md#active-active-mode-design) that you want to use.<br>- Connections with your on-premises VPN device must be configured specifically to take advantage of active-active mode.<br>- Some VPN devices don't support active-active mode. If you're not sure, check with your VPN device vendor. If you're using a VPN device that doesn't support active-active mode, you can select **Disabled** for this setting.  |
   | Second public IP address name | Only available for active-active mode gateways. Example: VNet1GWpip2 |
   | Availability zone | Example: **Zone-redundant**.  |
   | Configure BGP | Select **Disabled**, unless your configuration specifically requires this setting. If you do require this setting, the default ASN is 65515.|
   | Enable Key Vault Access | Select **Disabled** unless you have a specific requirement to enable this setting. |

4. Select **Review + create** to run validation.
5. After validation passes, select **Create** to deploy the VPN gateway.