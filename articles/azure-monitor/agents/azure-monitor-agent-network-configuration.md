---
title: Azure Monitor network configuration
description: Define network settings and enable network isolation for Azure Monitor Agent.
ms.topic: conceptual
ms.date: 07/10/2024
ms.custom: references_regions
ms.reviewer: shseth

---
# Azure Monitor agent network configuration
Azure Monitor Agent supports connecting by using direct proxies, Log Analytics gateway, and private links. This article explains how to define network settings and enable network isolation for Azure Monitor Agent.



## Virtual network service tags

The [Azure virtual network service tags](../../virtual-network/service-tags-overview.md) must be enabled on the virtual network for the virtual machine. Both *AzureMonitor* and *AzureResourceManager* tags are required. 

Azure Virtual network service tags can be used to define network access controls on [network security groups](../../virtual-network/network-security-groups-overview.md#security-rules), [Azure Firewall](../../firewall/service-tags.md), and user-defined routes. Use service tags in place of specific IP addresses when you create security rules and routes. For scenarios where Azure virtual network service tags cannot be used, the Firewall requirements are given below.

>[!NOTE]
> Data collection endpoint public IP addresses are not part of the above mentioned network service tags. If you have custom logs or IIS log data collection rules, consider allowing the data collection endpoint's public IP addresses for these scenarios to work until these scenarios are supported by network service tags. 

## Firewall endpoints
The following table provides the endpoints that firewalls need to provide access to for different clouds. Each is an outbound connection to port 443.

> [!IMPORTANT] 
> For all endpoints, HTTPS inspection must be disabled.

|Endpoint |Purpose | Example |
|:--|:--|:--|
| `global.handler.control.monitor.azure.com` |Access control service - |
| `<virtual-machine-region-name>`.handler.control.monitor.azure.com |Fetch data collection rules for specific machine  | westus2.handler.control.monitor.azure.com |
|`<log-analytics-workspace-id>`.ods.opinsights.azure.com |Ingest logs data | 1234a123-aa1a-123a-aaa1-a1a345aa6789.ods.opinsights.azure.com
| management.azure.com | Only needed if sending time series data (metrics) to Azure Monitor [Custom metrics](../essentials/metrics-custom-overview.md) database  | - |
| `<virtual-machine-region-name>`.monitoring.azure.com  | Only needed if sending time series data (metrics) to Azure Monitor [Custom metrics](../essentials/metrics-custom-overview.md) database | westus2.monitoring.azure.com |
| `<data-collection-endpoint>.<virtual-machine-region-name>`.ingest.monitor.azure.com | Only needed if sending data to Log Analytics [custom logs](./data-collection-text-log.md) table | 275test-01li.eastus2euap-1.canary.ingest.monitor.azure.com |

Replace the suffix in the endpoints with the suffix in the following table for different clouds.

| Cloud | Suffix |
|:---|:---|
| Azure Commercial | .com |
| Azure Government | .us |
| Microsoft Azure operated by 21Vianet | .cn |


>[!NOTE]
> If you use private links on the agent, you must **only** add the [private data collection endpoints (DCEs)](../essentials/data-collection-endpoint-overview.md#components-of-a-dce). The agent does not use the non-private endpoints listed above when using private links/data collection endpoints.
> The Azure Monitor Metrics (custom metrics) preview isn't available in Azure Government and Azure operated by 21Vianet clouds.

> [!NOTE]
> When using AMA with AMPLS, all of your Data Collection Rules much use Data Collection Endpoints. Those DCE's must be added to the AMPLS configuration using [private link](../logs/private-link-configure.md#connect-azure-monitor-resources)

## Proxy configuration

The Azure Monitor Agent extensions for Windows and Linux can communicate either through a proxy server or a [Log Analytics gateway](./gateway.md) to Azure Monitor by using the HTTPS protocol. Use it for Azure virtual machines, Azure virtual machine scale sets, and Azure Arc for servers. Use the extensions settings for configuration as described in the following steps. Both anonymous and basic authentication by using a username and password are supported.

> [!IMPORTANT]
> Proxy configuration isn't supported for [Azure Monitor Metrics (public preview)](../essentials/metrics-custom-overview.md) as a destination. If you're sending metrics to this destination, it will use the public internet without any proxy.

> [!NOTE]
> Setting Linux system proxy via environment variables such as `http_proxy` and `https_proxy` is only supported using Azure Monitor Agent for Linux version 1.24.2 and above. For the ARM template, if you have proxy configuration please follow the ARM template example below declaring the proxy setting inside the ARM template. Additionally, a user can set "global" environment variables that get picked up by all systemd services [via the DefaultEnvironment variable in /etc/systemd/system.conf](https://www.man7.org/linux/man-pages/man5/systemd-system.conf.5.html).


Use PowerShell commands in the following examples depending on your environment and configuration.:

# [Windows VM](#tab/PowerShellWindows)

**No proxy**

```powershell
$settingsString = '{"proxy":{"mode":"none"}}';
Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location>  -SettingString $settingsString
```

**Proxy with no authentication**

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": "false"}}';
Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location>  -SettingString $settingsString
```

**Proxy with authentication**

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": "true"}}';
$protectedSettingsString = '{"proxy":{"username":"[username]","password": "[password]"}}';
Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location>  -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```


# [Linux VM](#tab/PowerShellLinux)

**No proxy**

```powershell
$settingsString = '{"proxy":{"mode":"none"}}';
Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location>  -SettingString $settingsString
```

**Proxy with no authentication**

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": "false"}}';
Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -SettingString $settingsString
```

**Proxy with authentication**

```powershell
$settingsString = '{"proxy":{"mode":"application","address":"http://[address]:[port]","auth": "true"}}';
$protectedSettingsString = '{"proxy":{"username":"[username]","password": "[password]"}}';
Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location>  -SettingString $settingsString -ProtectedSettingString $protectedSettingsString
```


# [Windows Arc-enabled server](#tab/PowerShellWindowsArc)

**No proxy**

```powershell
$settings = @{"proxy" = @{mode = "none"}}
New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settings
```

**Proxy with no authentication**

```powershell
$settings = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = "false"}}
New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settings 
```

**Proxy with authentication**

```powershell
$settings = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = "true"}}
$protectedSettings = @{"proxy" = @{username = "[username]"; password = "[password]"}}
New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settings -ProtectedSetting $protectedSettings
```

# [Linux Arc-enabled server](#tab/PowerShellLinuxArc)

**No proxy**

```powershell
$settings = @{"proxy" = @{mode = "none"}}
New-AzConnectedMachineExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settings
```

**Proxy with no authentication**

```powershell
$settings = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = "false"}}
New-AzConnectedMachineExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settings 
```

**Proxy with authentication**

```powershell
$settings = @{"proxy" = @{mode = "application"; address = "http://[address]:[port]"; auth = "true"}}
$protectedSettings = @{"proxy" = @{username = "[username]"; password = "[password]"}}
New-AzConnectedMachineExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -Setting $settings -ProtectedSetting $protectedSettings
```




# [ARM Policy Template example](#tab/ArmPolicy)

```powershell
{
  "properties": {
    "displayName": "Configure Windows Arc-enabled machines to run Azure Monitor Agent",
    "policyType": "BuiltIn",
    "mode": "Indexed",
    "description": "Automate the deployment of Azure Monitor Agent extension on your Windows Arc-enabled machines for collecting telemetry data from the guest OS. This policy will install the extension if the OS and region are supported and system-assigned managed identity is enabled, and skip install otherwise. Learn more: https://aka.ms/AMAOverview.",
    "metadata": {
      "version": "2.3.0",
      "category": "Monitoring"
    },
    "parameters": {
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Enable or disable the execution of the policy."
        },
        "allowedValues": [
          "DeployIfNotExists",
          "Disabled"
        ],
        "defaultValue": "DeployIfNotExists"
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.HybridCompute/machines"
          },
          {
            "field": "Microsoft.HybridCompute/machines/osName",
            "equals": "Windows"
          },
          {
            "field": "location",
            "in": [
              "australiacentral",
              "australiaeast",
              "australiasoutheast",
              "brazilsouth",
              "canadacentral",
              "canadaeast",
              "centralindia",
              "centralus",
              "eastasia",
              "eastus",
              "eastus2",
              "eastus2euap",
              "francecentral",
              "germanywestcentral",
              "japaneast",
              "japanwest",
              "jioindiawest",
              "koreacentral",
              "koreasouth",
              "northcentralus",
              "northeurope",
              "norwayeast",
              "southafricanorth",
              "southcentralus",
              "southeastasia",
              "southindia",
              "swedencentral",
              "switzerlandnorth",
              "uaenorth",
              "uksouth",
              "ukwest",
              "westcentralus",
              "westeurope",
              "westindia",
              "westus",
              "westus2",
              "westus3"
            ]
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]",
        "details": {
          "type": "Microsoft.HybridCompute/machines/extensions",
          "roleDefinitionIds": [
            "/providers/Microsoft.Authorization/roleDefinitions/cd570a14-e51a-42ad-bac8-bafd67325302"
          ],
          "existenceCondition": {
            "allOf": [
              {
                "field": "Microsoft.HybridCompute/machines/extensions/type",
                "equals": "AzureMonitorWindowsAgent"
              },
              {
                "field": "Microsoft.HybridCompute/machines/extensions/publisher",
                "equals": "Microsoft.Azure.Monitor"
              },
              {
                "field": "Microsoft.HybridCompute/machines/extensions/provisioningState",
                "equals": "Succeeded"
              }
            ]
          },
          "deployment": {
            "properties": {
              "mode": "incremental",
              "template": {
                "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {
                  "vmName": {
                    "type": "string"
                  },
                  "location": {
                    "type": "string"
                  }
                },
                "variables": {
                  "extensionName": "AzureMonitorWindowsAgent",
                  "extensionPublisher": "Microsoft.Azure.Monitor",
                  "extensionType": "AzureMonitorWindowsAgent"
                },
                "resources": [
                  {
                    "name": "[concat(parameters('vmName'), '/', variables('extensionName'))]",
                    "type": "Microsoft.HybridCompute/machines/extensions",
                    "location": "[parameters('location')]",
                    "apiVersion": "2021-05-20",
                    "properties": {
                      "publisher": "[variables('extensionPublisher')]",
                      "type": "[variables('extensionType')]",
                      "autoUpgradeMinorVersion": true,
                      "enableAutomaticUpgrade": true,
                      "settings": {
                      "proxy": {
                        "auth": "false",
                        "mode": "application",
                        "address": "http://XXX.XXX.XXX.XXX"
                        }
                      },
					            "protectedsettings": { }
                    }
                  }
                ]
              },
              "parameters": {
                "vmName": {
                  "value": "[field('name')]"
                },
                "location": {
                  "value": "[field('location')]"
                }
              }
            }
          }
        }
      }
    }
  },
  "id": "/providers/Microsoft.Authorization/policyDefinitions/94f686d6-9a24-4e19-91f1-de937dc171a4",
  "type": "Microsoft.Authorization/policyDefinitions",
  "name": "94f686d6-9a24-4e19-91f1-de937dc171a4"
}
```

---

## Log Analytics gateway configuration

1. Follow the guidance above to configure proxy settings on the agent and provide the IP address and port number that correspond to the gateway server. If you've deployed multiple gateway servers behind a load balancer, the agent proxy configuration is the virtual IP address of the load balancer instead.
1. Add the **configuration endpoint URL** to fetch data collection rules to the allowlist for the gateway
   `Add-OMSGatewayAllowedHost -Host global.handler.control.monitor.azure.com`
   `Add-OMSGatewayAllowedHost -Host <gateway-server-region-name>.handler.control.monitor.azure.com`.
   (If you're using private links on the agent, you must also add the [data collection endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-dce).)
1. Add the **data ingestion endpoint URL** to the allowlist for the gateway
   `Add-OMSGatewayAllowedHost -Host <log-analytics-workspace-id>.ods.opinsights.azure.com`.
1. Restart the **OMS Gateway** service to apply the changes
   `Stop-Service -Name <gateway-name>` and
   `Start-Service -Name <gateway-name>`.

## Next steps

- [Add endpoint to AMPLS resource](../logs/private-link-configure.md#connect-azure-monitor-resources).
