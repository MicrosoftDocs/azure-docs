---
author: mgoedtel
ms.service: log-analytics
ms.topic: include
ms.date: 11/09/2018	
ms.author: magoedte
---
### Troubleshoot Azure Diagnostics

If you receive the following error message, the Microsoft.Insights resource provider isn't registered:

`Failed to update diagnostics for 'resource'. {"code":"Forbidden","message":"Please register the subscription 'subscription id' with Microsoft.Insights."}`

To register the resource provider, perform the following steps in the Azure portal:

1. In the navigation pane on the left, select **Subscriptions**.
1. Select the subscription identified in the error message.
1. Select **Resource providers**.
1. Find the **microsoft.insights** provider.
1. Select the **Register** link.

![Screenshot that shows registering the microsoft.insights resource provider.](./media/log-analytics-troubleshoot-azure-diagnostics/log-analytics-register-microsoft-diagnostics-resource-provider.png)

After the Microsoft.Insights resource provider is registered, retry configuring the diagnostics.

In PowerShell, if you receive the following error message, you must update your version of PowerShell:

`Set-AzDiagnosticSetting : A parameter cannot be found that matches parameter name 'WorkspaceId'.`

To update your version of Azure PowerShell, follow the instructions in [Install Azure PowerShell](/powershell/azure/install-az-ps).
