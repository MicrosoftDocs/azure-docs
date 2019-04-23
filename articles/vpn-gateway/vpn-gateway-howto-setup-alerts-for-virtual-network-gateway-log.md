---
title: 'How to set up alerts on Azure VPN Gateway diagnostic log events'
description: Steps to configure alerts on VPN Gateway diagnostic log events
services: vpn-gateway
author: anzaman

ms.service: vpn-gateway
ms.topic: conceptional
ms.date: 04/22/2019
ms.author: alzam

---
# Setting up alerts on VPN Gateway diagnostic log events

This article helps you set up alerts based on VPN Gateway diagnostic log events.


## <a name="setup"></a>Setup Azure Monitor alerts based on diagnostic log events using the portal

The example steps below will create an alert for a site-to-site VPN tunnel disconnection event



1. Search for "Log Analytics" under All services and pick "Log Analytics workspaces"
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert0.png "Create")

2. Click "Create" in the Log Analytics page.
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert1.png  "Select")

3. Check "Create New" workspace and fill in the details.
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert2.png  "Select")

4. Find your VPN gateway under the "Monitor" > "Diagnostics settings" blade
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert3.png  "Select")

5. To turn on diagnostics, double-click on the gateway and then click on "Turn on diagnostics"
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert4.png  "Select")

6. Fill in the details and ensure that "Send to Log Analytics" and "TunnelDiagnosticLog" are checked. Pick the Log Analytics Workspace that was created in step 3.
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert5.png  "Select")

7. Navigate to the virtual network gateway resource overview and select "Alerts" from the Monitoring tab, then create a new alert rule or edit an existing alert rule.
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert6.png  "Select")

8. Select the Log Analytics workspace and the resource.
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert7.png  "Select")

9. Select "Custom log search" as the signal logic under "Add condition"
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert8.png  "Select")

10. Enter the following query in the "Search query" text box replacing the values in <> as appropriate.

	AzureDiagnostics |
	where Category  == "TunnelDiagnosticLog" and ResourceId == toupper("<RESOURCEID OF GATEWAY>") and TimeGenerated > ago(5m) and
    remoteIP_s == "<REMOTE IP OF TUNNEL>" and status_s == "Disconnected"

    Set the threshold value to 0 and click "Done"

    ![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert9.png  "Select")

11. On the "Create rule" page, click "Create New" under the ACTION GROUPS section. Fill in the details and click OK
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert10.png  "Select")

12. On the "Create rule" page, fill in the details for "Customize Action" and make sure that the correct Action group name appears in the "Action Group Name" section. Click "Create alert rule" to create the rule.
![point-to-site](./media/vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-log/log-alert11.png  "Select")

## Next steps

To configure alerts on tunnel metrics, see [How to setup alerts on VPN Gateway metrics](vpn-gateway-howto-setup-alerts-for-virtual-network-gateway-metric.md).