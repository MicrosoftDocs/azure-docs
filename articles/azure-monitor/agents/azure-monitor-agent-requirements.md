---
title: Azure Monitor agent requirements
description: Requirements for Azure Monitor Agent on Azure virtual machines and Azure Arc-enabled servers and prerequisites for installation.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 7/18/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.reviewer: jeffwo

---

# Azure Monitor agent requirements
This article provides requirements and prerequisites for the Azure Monitor agent. Refer to the details in this article before you follow the guidance to install the agent in [Install and manage Azure Monitor Agent](./azure-monitor-agent-manage.md).

## Virtual machine extension details

Azure Monitor Agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. You can install it by using any of the methods to install virtual machine extensions. For version information, see [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md).

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | See [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md) | [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md) |


## Permissions
 For methods other than using the Azure portal, you must have the following role assignments to install the agent:  

   | Built-in role | Scopes | Reason |  
   |:---|:---|:---|  
   | <ul><li>[Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)</li><li>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, scale sets,</li><li>Azure Arc-enabled servers</li></ul> | To deploy the agent |  
   | Any role that includes the action *Microsoft.Resources/deployments/** (for example, [Log Analytics Contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li></ul> | To deploy agent extension via Azure Resource Manager templates (also used by Azure Policy) |  

[Managed identity](../../active-directory/managed-identities-azure-resources/overview.md) must be enabled on Azure virtual machines. Both user-assigned and system-assigned managed identities are supported. 

- **User-assigned**: This managed identity should be used for large-scale deployments and can be configured with [built-in Azure policies](./azure-monitor-agent-policy.md). You can create a user-assigned managed identity once and share it across multiple VMs making it more scalable than a system-assigned managed identity. If you use a user-assigned managed identity, you must pass the managed identity details to Azure Monitor Agent via extension settings:

    ```json
    {
        "authentication": {
        "managedIdentity": {
            "identifier-name": "mi_res_id" or "object_id" or "client_id",
            "identifier-value": "<resource-id-of-uai>" or "<guid-object-or-client-id>"
        }
        }
    }
    ```
You should use `mi_res_id` as the `identifier-name`. The following sample commands only show usage with `mi_res_id` for the sake of brevity. For more information on `mi_res_id`, `object_id`, and `client_id`, see the [Managed identity documentation](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http).
- **System-assigned**: This managed identity is suited for initial testing or small deployments. When used at scale, for all VMs in a subscription for example, it results in a substantial number of identities created and deleted in Microsoft Entra ID. To avoid this churn of identities, use user-assigned managed identities instead. 

> [!IMPORTANT]
> System-assigned managed identity is the only supported authentication For Azure Arc-enabled servers and is enabled automatically as soon as you install the Azure Arc agent. 


## Disk space
 Required disk space can vary significantly depending on how an agent is configured or if the agent is unable to communicate with the destinations and must cache data. By default the agent requires 10Gb of disk space to run. The following table provides guidance for capacity planning:

| Purpose | Environment | Path | Suggested Space |
|:---|:---|:---|:---|
| Download and install packages | Linux | /var/lib/waagent/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent-{Version}/ | 500 MB |
| Download and install packages | Windows | C:\Packages\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent | 500 MB| 
| Extension Logs | Linux (Azure VM) | /var/log/azure/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent/ | 100 MB |
| Extension Logs | Linux (Azure Arc) | /var/lib/GuestConfig/extension_logs/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent-{version}/ | 100 MB |
| Extension Logs | Windows (Azure VM) | C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent | 100 MB |
| Extension Logs | Windows (Azure Arc) | C:\ProgramData\GuestConfig\extension_logs\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent | 100 MB |
| Agent Cache | Linux | /etc/opt/microsoft/azuremonitoragent, /var/opt/microsoft/azuremonitoragent | 500 MB |
| Agent Cache | Windows (Azure VM) | C:\WindowsAzure\Resources\AMADataStore.{DataStoreName} | 10.5 GB |
| Agent Cache | Windows (Azure Arc) | C:\Resources\Directory\AMADataStore. {DataStoreName} | 10.5 GB |
| Event Cache | Linux | /var/opt/microsoft/azuremonitoragent/events | 10 GB |
| Event Cache | Linux | /var/lib/rsyslog | 1 GB |


## Next steps

[Create a data collection rule](azure-monitor-agent-data-collection.md) to collect data from the agent and send it to Azure Monitor.
