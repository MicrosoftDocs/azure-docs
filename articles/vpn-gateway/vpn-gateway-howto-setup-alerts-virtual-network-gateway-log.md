---
title: 'Azure VPN Gateway: Configure alerts on diagnostic resource log events'
description: Steps to configure alerts on VPN Gateway diagnostic resource log events
services: vpn-gateway
author: anzaman

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 06/12/2019
ms.author: alzam

---
# Set up alerts on resource log events from VPN Gateway

This article helps you set up alerts based on resource log events from Azure VPN Gateway using Azure Monitor Log Analytics. 

The following resource logs are available in Azure:

|***Name*** | ***Description*** |
|---		| ---				|
|GatewayDiagnosticLog | Contains resource logs for gateway configuration events, primary changes and maintenance events |
|TunnelDiagnosticLog | Contains tunnel state change events. Tunnel connect/disconnect events have a summarized reason for the state change if applicable |
|RouteDiagnosticLog | Logs changes to static routes and BGP events that occur on the gateway |
|IKEDiagnosticLog | Logs IKE control messages and events on the gateway |
|P2SDiagnosticLog | Logs point-to-site control messages and events on the gateway. Connection source info is provided for IKEv2 connections only |

## <a name="setup"></a>Set up alerts in the Azure portal

The following example steps creates an alert for a disconnection event that involves a site-to-site VPN tunnel:


1. In the Azure portal, search for **Log Analytics** under **All services** and select **Log Analytics workspaces**.

   ![Selections for going to Log Analytics workspaces](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert0.png "Create")

2. Select **Create** on the **Log Analytics** page.

   ![Log Analytics page with Create button](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert1.png  "Select")

3. Select **Create New** and fill in the details.

   ![Details for creating a Log Analytics workspace](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert2.png  "Select")

4. Find your VPN gateway on the **Monitor** > **Diagnostics settings** blade.

   ![Selections for finding the VPN gateway in Diagnostic settings](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert3.png  "Select")

5. To turn on diagnostics, double-click the gateway and then select **Turn on diagnostics**.

   ![Selections for turning on diagnostics](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert4.png  "Select")

6. Fill in the details, and ensure that **Send to Log Analytics** and **TunnelDiagnosticLog** are selected. Choose the Log Analytics Workspace that you created in step 3.

   ![Selected check boxes](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert5.png  "Select")

   > [!NOTE]
   > It may take a few hours for the data to show up initially.

7. Go to the overview for the virtual network gateway resource and select **Alerts** from the **Monitoring** tab. Then create a new alert rule or edit an existing alert rule.

   ![Selections for creating a new alert rule](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert6.png  "Select")

   ![point-to-site](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert6.png  "Select")
8. Select the Log Analytics workspace and the resource.

   ![Selections for workspace and resource](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert7.png  "Select")

9. Select **Custom log search** as the signal logic under **Add condition**.

   ![Selections for a custom log search](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert8.png  "Select")

10. Enter the following query in the **Search query** text box. Replace the values in <> and TimeGenerated as appropriate.

    ```
    AzureDiagnostics
    | where Category == "TunnelDiagnosticLog"
    | where _ResourceId == tolower("<RESOURCEID OF GATEWAY>")
    | where TimeGenerated > ago(5m) 
    | where remoteIP_s == "<REMOTE IP OF TUNNEL>"
    | where status_s == "Disconnected"
    | project TimeGenerated, OperationName, instance_s, Resource, ResourceGroup, _ResourceId 
    | sort by TimeGenerated asc
    ```

    Set the threshold value to 0 and select **Done**.

    ![Entering a query and selecting a threshold](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert9.png  "Select")

11. On the **Create rule** page, select **Create New** under the **ACTION GROUPS** section. Fill in the details and select **OK**.

    ![Details for a new action group](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert10.png  "Select")

12. On the **Create rule** page, fill in the details for **Customize Actions** and make sure that the correct name appears in the **ACTION GROUP NAME** section. Select **Create alert rule** to create the rule.

    ![Selections for creating a rule](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log/log-alert11.png  "Select")

## <a name="setuppowershell"></a>Set up alerts by using PowerShell

The following example steps create an alert for a disconnection event that involves a site-to-site VPN tunnel.

1. Create a Log Analytics workspace:

   ```powershell
   $Location           = 'westus2'
   $ResourceGroupName  = 'TestRG1'
   $Sku                = 'pergb2018'
   $WorkspaceName      = 'LogAnalyticsWS123'

   New-AzOperationalInsightsWorkspace -Location $Location -Name $WorkspaceName -Sku $Sku -ResourceGroupName $ResourceGroupName
   ```

2. Turn on diagnostics for the VPN gateway:

   ```powershell
   $ResourceGroupName  = 'TestRG1'
   $VpnGatewayName     = 'VNet1GW'
   $WorkspaceName      = 'LogAnalyticsWS123'

   $VpnGateway         = Get-AzVirtualNetworkGateway -Name $VpnGatewayName -ResourceGroupName $ResourceGroupName
   $Workspace          = Get-AzOperationalInsightsWorkspace -Name $WorkspaceName -ResourceGroupName $ResourceGroupName

   Set-AzDiagnosticSetting `
       -Name 'VPN tunnel' `
       -ResourceId $VpnGateway.Id `
       -WorkspaceId $Workspace.ResourceId `
       -Enabled $true `
       -Category 'TunnelDiagnosticLog'
   ```

3. Create an action group.

   This code creates an action group that sends an e-mail notification when an alert is triggered:

   ```powershell
   $ActionGroupName            = 'EmailAdmins'   # Max. 60 characters long
   $ActionGroupShortName       = 'EmailAdmins'   # Max. 12 characters long
   $ActionGroupReceiverName    = 'My receiver Name'
   $EmailAddress               = 'xyz@contoso.com'
   $ResourceGroupName          = 'TestRG1'

   $ActionGroupReceiver = New-AzActionGroupReceiver -Name $ActionGroupReceiverName -UseCommonAlertSchema -EmailReceiver -EmailAddress $EmailAddress

   Set-AzActionGroup `
      -ResourceGroupName $ResourceGroupName `
      -Name $ActionGroupName `
      -ShortName $ActionGroupShortName `
      -Receiver @($ActionGroupReceiver)
   ```

4. Create an alert rule based on a custom log search:

   ```powershell
   $ActionGroupName    = 'EmailAdmins'
   $EmailSubject       = 'Redmond VPN tunnel is disconnected'
   $Location           = 'westus2'
   $RemoteIp           = '104.42.209.46'
   $ResourceGroupName  = 'TestRG1'
   $VpnGatewayName     = 'VNet1GW'
   $WorkspaceName      = 'LogAnalyticsWS123'

   $VpnGateway         = Get-AzVirtualNetworkGateway -Name $VpnGatewayName -ResourceGroupName $ResourceGroupName
   $Workspace          = Get-AzOperationalInsightsWorkspace -Name $WorkspaceName -ResourceGroupName $ResourceGroupName

   $Query = @"
   AzureDiagnostics |
   where Category == "TunnelDiagnosticLog" |
   where TimeGenerated > ago(5m) |
   where _ResourceId == tolower("$($VpnGateway.id)") |
   where remoteIP_s == "$($RemoteIp)" |
   where status_s == "Disconnected" |
   project TimeGenerated, OperationName, instance_s, Resource, ResourceGroup, _ResourceId |
   sort by TimeGenerated asc
   "@

   $Source             = New-AzScheduledQueryRuleSource -Query $Query -DataSourceId $Workspace.ResourceId
   $Schedule           = New-AzScheduledQueryRuleSchedule -FrequencyInMinutes 5 -TimeWindowInMinutes 5
   $TriggerCondition   = New-AzScheduledQueryRuleTriggerCondition -ThresholdOperator 'GreaterThan' -Threshold 0

   $ActionGroup        = Get-AzActionGroup -ResourceGroupName $ResourceGroupName -Name $ActionGroupName
   $AznsActionGroup    = New-AzScheduledQueryRuleAznsActionGroup -ActionGroup $ActionGroup.Id -EmailSubject $EmailSubject
   $AlertingAction     = New-AzScheduledQueryRuleAlertingAction -AznsAction $AznsActionGroup -Severity '1' -Trigger $TriggerCondition

   New-AzScheduledQueryRule `
       -ResourceGroupName $ResourceGroupName `
       -Location $Location `
       -Action $AlertingAction `
       -Enabled $true `
       -Description 'The tunnel between Azure and Redmond with IP address 104.42.209.46 is disconnected' `
       -Schedule $Schedule `
       -Source $Source `
       -Name 'The Azure to Redmond tunnel is disconnected'
   ```

## Next steps

To configure alerts on tunnel metrics, see [Set up alerts on VPN Gateway metrics](vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric.md).
