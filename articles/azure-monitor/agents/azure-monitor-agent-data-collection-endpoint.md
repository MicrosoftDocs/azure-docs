---
title: Define Azure Monitor Agent network settings
description: Define network settings and enable network isolation for Azure Monitor Agent.
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 9/16/2022
ms.custom: references_region
ms.reviewer: shseth

---
# Define Azure Monitor Agent network settings

Azure Monitor Agent supports connecting using direct proxies, Log Analytics gateway, and private links. This article explains how to define network settings and enable network isolation for Azure Monitor Agent.

## Virtual network service tags

The Azure Monitor Agent supports [Azure virtual network service tags](../../virtual-network/service-tags-overview.md). Both *AzureMonitor* and *AzureResourceManager* tags are required. 

## Firewall requirements

| Cloud |Endpoint |Purpose |Port |Direction |Bypass HTTPS inspection|
|------|------|------|---------|--------|--------|
| Azure Commercial |global.handler.control.monitor.azure.com |Access control service|Port 443 |Outbound|Yes |
| Azure Commercial |`<virtual-machine-region-name>`.handler.control.monitor.azure.com |Fetch data collection rules for specific machine |Port 443 |Outbound|Yes |
| Azure Commercial |`<log-analytics-workspace-id>`.ods.opinsights.azure.com |Ingest logs data |Port 443 |Outbound|Yes |
| Azure Commercial | management.azure.com | Only needed if sending time series data (metrics) to Azure Monitor [Custom metrics](../essentials/metrics-custom-overview.md) database | Port 443 | Outbound | Yes |
| Azure Government | Replace '.com' above with '.us' | Same as above | Same as above | Same as above| Same as above |
| Azure China | Replace '.com' above with '.cn' | Same as above | Same as above | Same as above| Same as above |

If you use private links on the agent, you must also add the [DCE endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint).

## Proxy configuration

If the machine connects through a proxy server to communicate over the internet, review the following requirements to understand the network configuration required.

The Azure Monitor Agent extensions for Windows and Linux can communicate either through a proxy server or a [Log Analytics gateway](./gateway.md) to Azure Monitor by using the HTTPS protocol. Use it for Azure virtual machines, Azure virtual machine scale sets, and Azure Arc for servers. Use the extensions settings for configuration as described in the following steps. Both anonymous and basic authentication by using a username and password are supported.

> [!IMPORTANT]
> Proxy configuration is not supported for [Azure Monitor Metrics (Public preview)](../essentials/metrics-custom-overview.md) as a destination. If you're sending metrics to this destination, it will use the public internet without any proxy.

1. Use this flowchart to determine the values of the *`Settings` and `ProtectedSettings` parameters first.

    ![Diagram that shows a flowchart to determine the values of settings and protectedSettings parameters when you enable the extension.](media/azure-monitor-agent-overview/proxy-flowchart.png)

    > [!NOTE]
    > Azure Monitor agent for Linux doesn’t support system proxy via environment variables such as `http_proxy` and `https_proxy`

1. After determining the `Settings` and `ProtectedSettings` parameter values, *provide these other parameters* when you deploy Azure Monitor Agent, using PowerShell commands, as shown in the following examples:

# [Windows VM](#tab/PowerShellWindows)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.0 -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```

# [Linux VM](#tab/PowerShellLinux)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.5 -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```

# [Windows Arc-enabled server](#tab/PowerShellWindowsArc)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settingsString -ProtectedSetting $protectedSettingsString
```

# [Linux Arc-enabled server](#tab/PowerShellLinuxArc)

```powershell
$settingsString = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = true}}
$protectedSettingsString = @{"proxy" = @{username = "[username]"; password = "[password]"}}

New-AzConnectedMachineExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settingsString -ProtectedSetting $protectedSettingsString
```

---

## Log Analytics gateway configuration

1. Follow the preceding instructions to configure proxy settings on the agent and provide the IP address and port number that corresponds to the gateway server. If you've deployed multiple gateway servers behind a load balancer, the agent proxy configuration is the virtual IP address of the load balancer instead.
1. Add the **configuration endpoint URL** to fetch data collection rules to the allowlist for the gateway
   `Add-OMSGatewayAllowedHost -Host global.handler.control.monitor.azure.com`
   `Add-OMSGatewayAllowedHost -Host <gateway-server-region-name>.handler.control.monitor.azure.com`.
   (If you're using private links on the agent, you must also add the [data collection endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint).)
1. Add the **data ingestion endpoint URL** to the allowlist for the gateway
   `Add-OMSGatewayAllowedHost -Host <log-analytics-workspace-id>.ods.opinsights.azure.com`.
1. Restart the **OMS Gateway** service to apply the changes
   `Stop-Service -Name <gateway-name>`
   `Start-Service -Name <gateway-name>`.

## Enable network isolation for the Azure Monitor agent
By default, Azure Monitor agent will connect to a public endpoint to connect to your Azure Monitor environment. You can enable network isolation for your agents by creating [data collection endpoints](../essentials/data-collection-endpoint-overview.md)  and adding them to your [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-configure.md#connect-azure-monitor-resources).


### Create data collection endpoint
To use network isolation, you must create a data collection endpoint for each of your regions for agents to connect instead of the public endpoint. See [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-data-collection-endpoint) for details on create a DCE. An agent can only connect to a DCE in the same region. If you have agents in multiple regions, then you must create a DCE in each one.


### Create private link 
With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) resources to your virtual network by using private endpoints. An Azure Monitor Private Link connects a private endpoint to a set of Azure Monitor resources, defining the boundaries of your monitoring network. That set is called an Azure Monitor Private Link Scope (AMPLS). See [Configure your Private Link](../logs/private-link-configure.md) for details on creating and configuring your AMPLS.

### Add DCE to AMPLS
Add the data collection endpoints to a new or existing [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-configure.md#connect-azure-monitor-resources) resource. This adds the DCE endpoints to your private DNS zone (see [how to validate](../logs/private-link-configure.md#review-and-validate-your-private-link-setup)) and allows communication via private links. You can do this from either the AMPLS resource or from within an existing DCE resource's 'Network Isolation' tab.

> [!NOTE]
> Other Azure Monitor resources like the Log Analytics workspace(s) configured in your data collection rules that you wish to send data to, must be part of this same AMPLS resource.


For your data collection endpoint(s), ensure **Accept access from public networks not connected through a Private Link Scope** option is set to **No** under the 'Network Isolation' tab of your endpoint resource in Azure portal, as shown below. This ensures that public internet access is disabled, and network communication only happen via private links.

:::image type="content" source="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" lightbox="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" alt-text="Screenshot for configuring data collection endpoint network isolation.":::


 Associate the data collection endpoints to the target resources by editing the data collection rule in Azure portal. From the **Resources** tab, select **Enable Data Collection Endpoints** and select a DCE for each virtual machine. See [Configure data collection for the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md).


:::image type="content" source="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" lightbox="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" alt-text="Screenshot for configuring data collection endpoint for an agent.":::


## Next steps
- [Associate endpoint to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-data-collection-rule-and-association)
- [Add endpoint to AMPLS resource](../logs/private-link-configure.md#connect-azure-monitor-resources) 
