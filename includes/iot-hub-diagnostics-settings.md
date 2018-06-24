---
 title: include file
 description: include file
 services: iot-hub
 author: dominicbetts
 ms.service: iot-hub
 ms.topic: include
 ms.date: 05/17/2018
 ms.author: dobett
 ms.custom: include file
---

### Enable logging with diagnostics settings

1. Sign in to the [Azure portal][lnk-portal] and navigate to your IoT Hub.
1. Select **Diagnostics settings**.
1. Select **Turn on diagnostics**.

   ![Turn on diagnostics][1]

1. Give the diagnostic settings a name.
1. Choose where you want to send the logs. You can select any combination of the three options:
   * Archive to a storage account
   * Stream to an event hub
   * Send to Log Analytics
1. Choose which operations you want to monitor, and enable logs for those operations. The operations that diagnostic settings can report on are:
   * Connections
   * Device telemetry
   * Cloud-to-device messages
   * Device identity operations
   * File uploads
   * Message routing
   * Cloud-to-device twin operations
   * Device-to-cloud twin operations
   * Twin operations
   * Job operations
   * Direct methods  
1. Save the new settings. 

If you want to turn on diagnostics settings with PowerShell, use the following code:

```azurepowershell
Connect-AzureRmAccount
Select-AzureRmSubscription -SubscriptionName <subscription that includes your IoT Hub>
Set-AzureRmDiagnosticSetting -ResourceId <your resource Id> -ServiceBusRuleId <your service bus rule Id> -Enabled $true
```

New settings take effect in about 10 minutes. After that, logs appear in the configured archival target on the **Diagnostics settings** blade. For more information about configuring diagnostics, see [Collect and consume log data from your azure resources][lnk-diagnostics-settings].

<!-- Images -->
[1]: ./media/iot-hub-diagnostics-settings/turnondiagnostics.png

<!-- Links -->
[lnk-portal]: https://portal.azure.com
[lnk-diagnostics-settings]: ../articles/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md
