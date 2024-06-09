---
title: Azure Monitor agent requirements
description: Options for managing Azure Monitor Agent on Azure virtual machines and Azure Arc-enabled servers.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 7/18/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.reviewer: jeffwo

---

# Azure Monitor agent requirements

## Virtual machine extension details

Azure Monitor Agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. You can install it by using any of the methods to install virtual machine extensions including the methods described in this article.

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | See [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md) | [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md) |

## Extension versions

See [Azure Monitor agent extension versions](./azure-monitor-agent-extension-versions.md).

## Networking

See [Azure Monitor network configuration](./azure-monitor-agent-network-configuration.md).

If you use network firewalls, the [Azure Resource Manager service tag](../../virtual-network/service-tags-overview.md) must be enabled on the virtual network for the virtual machine. The virtual machine must also have access to the following HTTPS endpoints:

  -	global.handler.control.monitor.azure.com
  -	`<virtual-machine-region-name>`.handler.control.monitor.azure.com (example: westus.handler.control.monitor.azure.com)
  - `<log-analytics-workspace-id>`.ods.opinsights.azure.com (example: 12345a01-b1cd-1234-e1f2-1234567g8h99.ods.opinsights.azure.com)  
    (If you use private links on the agent, you must also add the [dce endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-dce)).
> [!NOTE]
> When using AMA with AMPLS, all of your Data Collection Rules much use Data Collection Endpoints. Those DCE's must be added to the AMPLS configuration using [private link](../logs/private-link-configure.md#connect-azure-monitor-resources)


## Permissions
 For methods other than using the Azure portal, you must have the following role assignments to install the agent:  

   | Built-in role | Scopes | Reason |  
   |:---|:---|:---|  
   | <ul><li>[Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)</li><li>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, scale sets,</li><li>Azure Arc-enabled servers</li></ul> | To deploy the agent |  
   | Any role that includes the action *Microsoft.Resources/deployments/** (for example, [Log Analytics Contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li></ul> | To deploy agent extension via Azure Resource Manager templates (also used by Azure Policy) |  
- **Non-Azure**: To install the agent on physical servers and virtual machines hosted *outside* of Azure (that is, on-premises) or in other clouds, you must [install the Azure Arc Connected Machine agent](../../azure-arc/servers/agent-overview.md) first, at no added cost.
- **Authentication**: [Managed identity](../../active-directory/managed-identities-azure-resources/overview.md) must be enabled on Azure virtual machines. Both user-assigned and system-assigned managed identities are supported.
  - **User-assigned**: This managed identity is recommended for large-scale deployments, configurable via [built-in Azure policies](#use-azure-policy). You can create a user-assigned managed identity once and share it across multiple VMs, which means it's more scalable than a system-assigned managed identity. If you use a user-assigned managed identity, you must pass the managed identity details to Azure Monitor Agent via extension settings:
  
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
    We recommend that you use `mi_res_id` as the `identifier-name`. The following sample commands only show usage with `mi_res_id` for the sake of brevity. For more information on `mi_res_id`, `object_id`, and `client_id`, see the [Managed identity documentation](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md#get-a-token-using-http).
  - **System-assigned**: This managed identity is suited for initial testing or small deployments. When used at scale, for example, for all VMs in a subscription, it results in a substantial number of identities created (and deleted) in Microsoft Entra ID. To avoid this churn of identities, use user-assigned managed identities instead. *For Azure Arc-enabled servers, system-assigned managed identity is enabled automatically* as soon as you install the Azure Arc agent. It's the only supported type for Azure Arc-enabled servers.
  - **Not required for Azure Arc-enabled servers**: The system identity is enabled automatically when you [create a data collection rule in the Azure portal](../essentials/data-collection-rule-create-edit.md).

## Disk Space
 Required disk space can vary greatly depending upon how an agent is utilized or if the agent is unable to communicate with the destinations where it is instructed to send monitoring data. By default the agent requires 10Gb of disk space to run. The following provides guidance for capacity planning:

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

> [!NOTE]
> This article only pertains to agent installation or management. After you install the agent, you must review the next article to [configure data collection rules and associate them with the machines](./data-collection-rule-azure-monitor-agent.md) with agents installed. *Azure Monitor Agents can't function without being associated with data collection rules.*

## Next steps

[Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
