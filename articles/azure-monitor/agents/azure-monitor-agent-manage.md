---
title: Install and manage Azure Monitor Agent
description: Options for installing and managing Azure Monitor Agent on Azure virtual machines and Azure Arc-enabled servers.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 07/15/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.reviewer: jeffwo

---

# Install and manage Azure Monitor Agent

This article details the different methods to install, uninstall, update, and configure [Azure Monitor Agent](azure-monitor-agent-overview.md) on Azure virtual machines, scale sets, and Azure Arc-enabled servers.

> [!IMPORTANT]
> Azure Monitor Agent requires at least one data collection rule (DCR) to begin collecting data after it's installed on the client machine. Depending on the installation method you use, a DCR may or may not be created automatically. If not, then you need to configure data collection following the guidance at [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md).

## Prerequisites

See the following articles for prerequisites and other requirements for Azure Monitor Agent:

* [Azure Monitor Agent supported operating systems and environments](./azure-monitor-agent-requirements.md)
* [Azure Monitor Agent requirements](./azure-monitor-agent-requirements.md) 
* [Azure Monitor Agent network configuration](./azure-monitor-agent-network-configuration.md)

> [!IMPORTANT]
> Installing, upgrading, or uninstalling Azure Monitor Agent won't require a machine restart.

## Installation options

The following table lists the different options for installing Azure Monitor Agent on Azure VMs and Azure Arc-enabled servers. The [Azure Arc agent](../../azure-arc/servers/deployment-options.md) must be installed on any machines not in Azure before Azure Monitor Agent can be installed.

| Installation method | Description | 
|:---|:---|
| VM extension | Use any of the methods below to use the Azure extension framework to install the agent. This method does not create a DCR, so you must create at least one and associate it with the agent before data collection will begin. |
| [Create a DCR](./azure-monitor-agent-data-collection.md) | When you create a DCR in the Azure portal, Azure Monitor Agent is installed on any machines that are added as resources for the DCR. The agent will begin collecting data defined in the DCR immediately.
| [VM insights](../vm/vminsights-enable-overview.md) | When you enable VM insights on a machine, Azure Monitor Agent is installed, and a DCR is created that collects a predefined set of data. You shouldn't modify this DCR, but you can create additional DCRs to collect other data. |
| [Container insights](../containers/kubernetes-monitoring-enable.md#container-insights) | When you enable Container insights on a Kubernetes cluster, a containerized version of Azure Monitor Agent is installed in the cluster, and a DCR is created that immediately begins collecting data. You can modify this DCR using guidance at [Configure data collection and cost optimization in Container insights using data collection rule](../containers/container-insights-data-collection-dcr.md).
| [Client installer](./azure-monitor-agent-windows-client.md) | Installs the agent by using a Windows MSI installer for Windows 10 and Windows 11 clients. |
| [Azure Policy](./azure-monitor-agent-policy.md) | Use Azure Policy to automatically install the agent on Azure virtual machines and Azure Arc-enabled servers and automatically associate them with required DCRs. |

> [!NOTE]
> To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).
> Cloning a machine with Azure Monitor Agent installed is not supported. The best practice for these situations is to use [Azure Policy](../../azure-arc/servers/deploy-ama-policy.md) or an Infrastructure as a code tool to deploy AMA at scale.

## Install agent extension

This section provides details on installing Azure Monitor Agent using the VM extension.

### [Portal](#tab/azure-portal)
Use the guidance at [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md) to install the agent using the Azure portal and create a DCR to collect data.

### [PowerShell](#tab/azure-powershell)

You can install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers by using the PowerShell command for adding a virtual machine extension. 

### Azure virtual machines

Use the following PowerShell commands to install Azure Monitor Agent on Azure virtual machines. Choose the appropriate command based on your chosen authentication method.

* Windows
    ```powershell
    ## User-assigned managed identity
    Set-AzVMExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true -SettingString '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":"/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
    
    ## System-assigned managed identity
    Set-AzVMExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true
    ```

* Linux
    ```powershell
    ## User-assigned managed identity
    Set-AzVMExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true -SettingString '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
    
    ## System-assigned managed identity
    Set-AzVMExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion <version-number> -EnableAutomaticUpgrade $true
    ```

### Azure virtual machines scale set 

Use the [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension) PowerShell cmdlet to install Azure Monitor Agent on Azure virtual machines scale sets.

### Azure Arc-enabled servers

Use the following PowerShell commands to install Azure Monitor Agent on Azure Arc-enabled servers.

* Windows
    ```powershell
    New-AzConnectedMachineExtension -Name AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -EnableAutomaticUpgrade
    ```

* Linux
    ```powershell
    New-AzConnectedMachineExtension -Name AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -MachineName <arc-server-name> -Location <arc-server-location> -EnableAutomaticUpgrade
    ```

#### [Azure CLI](#tab/azure-cli)

You can install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers by using the Azure CLI command for adding a virtual machine extension.

### Azure virtual machines

Use the following CLI commands to install Azure Monitor Agent on Azure virtual machines. Choose the appropriate command based on your chosen authentication method.

#### User-assigned managed identity

* Windows
    ```azurecli
    az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true --settings '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":"/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
    ```

* Linux
    ```azurecli
    az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true --settings '{"authentication":{"managedIdentity":{"identifier-name":"mi_res_id","identifier-value":"/subscriptions/<my-subscription-id>/resourceGroups/<my-resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<my-user-assigned-identity>"}}}'
    ```

#### System-assigned managed identity

* Windows
    ```azurecli
    az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true
    ```

* Linux
    ```azurecli
    az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids <vm-resource-id> --enable-auto-upgrade true
    ```

### Azure virtual machines scale set 

Use the [az vmss extension set](/cli/azure/vmss/extension) CLI cmdlet to install Azure Monitor Agent on Azure virtual machines scale sets.

### Azure Arc-enabled servers

Use the following CLI commands to install Azure Monitor Agent on Azure Arc-enabled servers.

* Windows
    ```azurecli
    az connectedmachine extension create --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
    ```

* Linux
    ```azurecli
    az connectedmachine extension create --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --type AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --location <arc-server-location> --enable-auto-upgrade true
    ```

#### [Resource Manager template](#tab/azure-resource-manager)

You can use Resource Manager templates to install Azure Monitor Agent on Azure virtual machines and on Azure Arc-enabled servers and to create an association with data collection rules. You must create any data collection rule prior to creating the association.

Get sample templates for installing the agent and creating the association from the following resources:

* [Template to install Azure Monitor Agent (Azure and Azure Arc)](../agents/resource-manager-agent.md#azure-monitor-agent)
* [Template to create association with data collection rule](../essentials/data-collection-rule-create-edit.md?tabs=arm#create-a-dcr)

Install the templates by using [any deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md), such as the following commands.

* PowerShell
    ```powershell
    New-AzResourceGroupDeployment -ResourceGroupName "<resource-group-name>" -TemplateFile "<template-filename.json>" -TemplateParameterFile "<parameter-filename.json>"
    ```

* Azure CLI
    ```azurecli
    az deployment group create --resource-group "<resource-group-name>" --template-file "<path-to-template>" --parameters "@<parameter-filename.json>"
    ```

---

## Uninstall

#### [Portal](#tab/azure-portal)

To uninstall Azure Monitor Agent by using the Azure portal, go to your virtual machine, scale set, or Azure Arc-enabled server. Select the **Extensions** tab and select **AzureMonitorWindowsAgent** or **AzureMonitorLinuxAgent**. In the dialog that opens, select **Uninstall**.

#### [PowerShell](#tab/azure-powershell)

### Uninstall on Azure virtual machines

Use the following PowerShell commands to uninstall Azure Monitor Agent on Azure virtual machines.

* Windows
    ```powershell
    Remove-AzVMExtension -Name AzureMonitorWindowsAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> 
    ```

* Linux
    ```powershell
    Remove-AzVMExtension -Name AzureMonitorLinuxAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> 
    ```

### Uninstall on Azure virtual machines scale set 

Use the [Remove-AzVmssExtension](/powershell/module/az.compute/remove-azvmssextension) PowerShell cmdlet to uninstall Azure Monitor Agent on Azure virtual machines scale sets.

### Uninstall on Azure Arc-enabled servers

Use the following PowerShell commands to uninstall Azure Monitor Agent on Azure Arc-enabled servers.

* Windows
    ```powershell
    Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AzureMonitorWindowsAgent
    ```

* Linux
    ```powershell
    Remove-AzConnectedMachineExtension -MachineName <arc-server-name> -ResourceGroupName <resource-group-name> -Name AzureMonitorLinuxAgent
    ```

#### [Azure CLI](#tab/azure-cli)

### Uninstall on Azure virtual machines

Use the following CLI commands to uninstall Azure Monitor Agent on Azure virtual machines.

* Windows
    ```azurecli
    az vm extension delete --resource-group <resource-group-name> --vm-name <virtual-machine-name> --name AzureMonitorWindowsAgent
    ```

* Linux
    ```azurecli
    az vm extension delete --resource-group <resource-group-name> --vm-name <virtual-machine-name> --name AzureMonitorLinuxAgent
    ```

### Uninstall on Azure virtual machines scale set 

Use the [az vmss extension delete](/cli/azure/vmss/extension) CLI cmdlet to uninstall Azure Monitor Agent on Azure virtual machines scale sets.

### Uninstall on Azure Arc-enabled servers

Use the following CLI commands to uninstall Azure Monitor Agent on Azure Arc-enabled servers.

* Windows
    ```azurecli
    az connectedmachine extension delete --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
    ```

* Linux
    ```azurecli
    az connectedmachine extension delete --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name>
    ```

#### [Resource Manager template](#tab/azure-resource-manager)

N/A

---

## Update

> [!NOTE]
> The recommendation is to enable [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) which may take **up to 5 weeks** after a new extension version is released for it to update installed extensions to the released (latest) version across all regions. Upgrades are issued in batches, so you may see some of your virtual machines, scale-sets or Arc-enabled servers get upgraded before others. If you need to upgrade an extension immediately, you may use the manual instructions below.

#### [Portal](#tab/azure-portal)

To perform a one-time update of the agent, you must first uninstall the existing agent version. Then install the new version as described.

We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature. Go to your virtual machine or scale set, select the **Extensions** tab and select **AzureMonitorWindowsAgent** or **AzureMonitorLinuxAgent**. In the dialog that opens, select **Enable automatic upgrade**.

#### [PowerShell](#tab/azure-powershell)

### Update on Azure virtual machines

To perform a one-time update of the agent, you must first uninstall the existing agent version, then install the new version as described.

We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature by using the following PowerShell commands.

* Windows 
    ```powershell
    Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Publisher Microsoft.Azure.Monitor -ExtensionType AzureMonitorWindowsAgent -TypeHandlerVersion <version-number> -Location <location> -EnableAutomaticUpgrade $true
    ```

* Linux
    ```powershell
    Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Publisher Microsoft.Azure.Monitor -ExtensionType AzureMonitorLinuxAgent -TypeHandlerVersion <version-number> -Location <location> -EnableAutomaticUpgrade $true
    ```

### Update on Azure Arc-enabled servers

To perform a one-time upgrade of the agent, use the following PowerShell commands.

* Windows
    ```powershell
    $target = @{"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent" = @{"targetVersion"=<target-version-number>}}
    Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
    ```

* Linux
    ```powershell
    $target = @{"Microsoft.Azure.Monitor.AzureMonitorLinuxAgent" = @{"targetVersion"=<target-version-number>}}
    Update-AzConnectedExtension -ResourceGroupName $env.ResourceGroupName -MachineName <arc-server-name> -ExtensionTarget $target
    ```

We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#manage-automatic-extension-upgrade) feature by using the following PowerShell commands.

* Windows
    ```powershell
    Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AzureMonitorWindowsAgent -EnableAutomaticUpgrade
    ```

* Linux
    ```powershell
    Update-AzConnectedMachineExtension -ResourceGroup <resource-group-name> -MachineName <arc-server-name> -Name AzureMonitorLinuxAgent -EnableAutomaticUpgrade
    ```

#### [Azure CLI](#tab/azure-cli)

### Update on Azure virtual machines

To perform a one-time update of the agent, you must first uninstall the existing agent version, then install the new version as described.
  
We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) feature by using the following CLI commands.

* Windows
    ```azurecli
    az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --vm-name <virtual-machine-name> --resource-group <resource-group-name> --enable-auto-upgrade true
    ```

* Linux
    ```azurecli
    az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --vm-name <virtual-machine-name> --resource-group <resource-group-name> --enable-auto-upgrade true
    ```

### Update on Azure Arc-enabled servers

To perform a one-time upgrade of the agent, use the following CLI commands.

* Windows
    ```azurecli
    az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
    ```

* Linux
    ```azurecli
    az connectedmachine upgrade-extension --extension-targets "{\"Microsoft.Azure.Monitor.AzureMonitorLinuxAgent\":{\"targetVersion\":\"<target-version-number>\"}}" --machine-name <arc-server-name> --resource-group <resource-group-name>
    ```
  
 We recommend that you enable automatic update of the agent by enabling the [Automatic Extension Upgrade](../../azure-arc/servers/manage-automatic-vm-extension-upgrade.md#manage-automatic-extension-upgrade) feature by using the following PowerShell commands.

* Windows
    ```azurecli
    az connectedmachine extension update --name AzureMonitorWindowsAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
    ```

* Linux
    ```azurecli
    az connectedmachine extension update --name AzureMonitorLinuxAgent --machine-name <arc-server-name> --resource-group <resource-group-name> --enable-auto-upgrade true
    ```

#### [Resource Manager template](#tab/azure-resource-manager)

N/A

---

## Configure (Preview)

[Data Collection Rules (DCRs)](../essentials/data-collection-rule-overview.md) serve as a management tool for Azure Monitor Agent (AMA) on your machine. The AgentSettings DCR can be used to configure AMA parameters like `DisQuotaInMb`, ensuring your agent is tailored to your specific monitoring needs.

> [!NOTE]
> Important considerations to keep in mind when working with the AgentSettings DCR:
>
> * The AgentSettings DCR can only be configured via template deployment.
> * AgentSettings is always it's own DCR and can't be added an existing one.
> * For proper functionality, both the machine and the AgentSettings DCR must be located in the same region.

### Supported parameters

The AgentSettings DCR currently supports configuring the following parameters:

| Parameter | Description | Valid values |
| --------- | ----------- | ----------- |
| `MaxDiskQuotaInMB` | Defines the amount of disk space used by the Azure Monitor Agent log files and cache. | 1000-50000 (in MB) |
| `TimeReceivedForForwardedEvents` | Changes WEF column in the Sentinel WEF table to use TimeReceived instead of TimeGenerated data | 0 or 1 |

### Setting up AgentSettings DCR

#### [Portal](#tab/azure-portal)

Currently not supported.

#### [PowerShell](#tab/azure-powershell)

N/A

#### [Azure CLI](#tab/azure-cli)

N/A

#### [Resource Manager template](#tab/azure-resource-manager)

1. **Prepare the environment:**

    [Install AMA](#installation-options) on your VM.

1. **Create a DCR:**

    This example sets the maximum amount of disk space used by AMA cache to 5000 MB.

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "resources": [
        {
        "type": "Microsoft.Insights/dataCollectionRules",
        "name": "dcr-contoso-01",
        "apiVersion": "2023-03-11",
        "properties": 
            {
            "description": "A simple agent settings",
            "agentSettings": 
                {
                "logs": [
                    {
                    "name": "MaxDiskQuotaInMB",
                    "value": "5000"
                    }
                ]
                }
            },
        "kind": "AgentSettings",
        "location": "eastus"
        }
    ]
    }
    ```
    
1. **Associate the DCR with your machine:**

   Use these ARM template and parameter files:

    **ARM template file**
    
    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "vmName": {
          "type": "string",
          "metadata": {
            "description": "The name of the virtual machine."
          }
        },
        "associationName": {
          "type": "string",
          "metadata": {
            "description": "The name of the association."
          }
        },
        "dataCollectionRuleId": {
          "type": "string",
          "metadata": {
            "description": "The resource ID of the data collection rule."
          }
        }
      },
      "resources": [
        {
          "type": "Microsoft.Insights/dataCollectionRuleAssociations",
          "apiVersion": "2021-09-01-preview",
          "scope": "[format('Microsoft.Compute/virtualMachines/{0}', parameters('vmName'))]",
          "name": "[parameters('associationName')]",
          "properties": {
            "description": "Association of data collection rule. Deleting this association will break the data collection for this virtual machine.",
            "dataCollectionRuleId": "[parameters('dataCollectionRuleId')]"
          }
        }
      ]
    }
    ```
    
    **Parameter file**
    
    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "vmName": {
          "value": "my-azure-vm"
        },
        "associationName": {
          "value": "my-windows-vm-my-dcr"
        },
        "dataCollectionRuleId": {
          "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.insights/datacollectionrules/my-dcr"
        }
       }
    }
    ```

1. **Activate the settings:**

    Restart AMA to apply changes.

---

## Next steps

[Create a data collection rule](./azure-monitor-agent-data-collection.md) to collect data from the agent and send it to Azure Monitor.
