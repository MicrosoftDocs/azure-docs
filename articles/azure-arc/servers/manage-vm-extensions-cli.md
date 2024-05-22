---
title: Enable VM extension using Azure CLI
description: This article describes how to deploy virtual machine extensions to Azure Arc-enabled servers running in hybrid cloud environments using the Azure CLI.
ms.date: 03/30/2022
ms.topic: conceptual
ms.custom: devx-track-azurecli
---

# Enable Azure VM extensions using the Azure CLI

This article shows you how to deploy, upgrade, update, and uninstall VM extensions, supported by Azure Arc-enabled servers, to a Linux or Windows hybrid machine using the Azure CLI.

> [!NOTE]
> Azure Arc-enabled servers does not support deploying and managing VM extensions to Azure virtual machines. For Azure VMs, see the following [VM extension overview](../../virtual-machines/extensions/overview.md) article.

[!INCLUDE [Azure CLI Prepare your environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Install the Azure CLI extension

The ConnectedMachine commands aren't shipped as part of the Azure CLI. Before using the Azure CLI to connect to Azure and manage VM extensions on your hybrid server managed by Azure Arc-enabled servers, you need to load the ConnectedMachine extension. These management operations can be performed from your workstation, you don't need to run them on the Azure Arc-enabled server.

Run the following command to get it:

```azurecli
az extension add --name connectedmachine
```

## Enable extension

To enable a VM extension on your Azure Arc-enabled server, use [az connectedmachine extension create](/cli/azure/connectedmachine/extension#az-connectedmachine-extension-create) with the `--machine-name`, `--extension-name`, `--location`, `--type`, `settings`, and `--publisher` parameters.

The following example enables the Log Analytics VM extension on an Azure Arc-enabled server:

```azurecli
az connectedmachine extension create --machine-name "myMachineName" --name "OmsAgentForLinux or MicrosoftMonitoringAgent" --location "regionName" --settings '{\"workspaceId\":\"myWorkspaceId\"}' --protected-settings '{\"workspaceKey\":\"myWorkspaceKey\"}' --resource-group "myResourceGroup" --type-handler-version "1.13" --type "OmsAgentForLinux or MicrosoftMonitoringAgent" --publisher "Microsoft.EnterpriseCloud.Monitoring" 
```

The following example enables the Custom Script Extension on an Azure Arc-enabled server:

```azurecli
az connectedmachine extension create --machine-name "myMachineName" --name "CustomScriptExtension" --location "regionName" --type "CustomScriptExtension" --publisher "Microsoft.Compute" --settings "{\"commandToExecute\":\"powershell.exe -c \\\"Get-Process | Where-Object { $_.CPU -gt 10000 }\\\"\"}" --type-handler-version "1.10" --resource-group "myResourceGroup"
```

The following example enables the Key Vault VM extension on an Azure Arc-enabled server:

```azurecli
az connectedmachine extension create --resource-group "resourceGroupName" --machine-name "myMachineName" --location "regionName" --publisher "Microsoft.Azure.KeyVault" --type "KeyVaultForLinux or KeyVaultForWindows" --name "KeyVaultForLinux or KeyVaultForWindows" --settings '{"secretsManagementSettings": { "pollingIntervalInS": "60", "observedCertificates": ["observedCert1"] }, "authenticationSettings": { "msiEndpoint": "http://localhost:40342/metadata/identity" }}'
```

The following example enables the Microsoft Antimalware extension on an Azure Arc-enabled Windows server:

```azurecli
az connectedmachine extension create --resource-group "resourceGroupName" --machine-name "myMachineName" --location "regionName" --publisher "Microsoft.Azure.Security" --type "IaaSAntimalware" --name "IaaSAntimalware" --settings '"{\"AntimalwareEnabled\": \"true\"}"'
```

The following example enables the Datadog extension on an Azure Arc-enabled Windows server:

```azurecli
az connectedmachine extension create --resource-group "resourceGroupName" --machine-name "myMachineName" --location "regionName" --publisher "Datadog.Agent" --type "DatadogWindowsAgent" --settings '{"site": "us3.datadoghq.com"}' --protected-settings '{"api_key": "YourDatadogAPIKey" }'
```

## List extensions installed

To get a list of the VM extensions on your Azure Arc-enabled server, use [az connectedmachine extension list](/cli/azure/connectedmachine/extension#az-connectedmachine-extension-list) with the `--machine-name` and `--resource-group` parameters.

Example:

```azurecli
az connectedmachine extension list --machine-name "myMachineName" --resource-group "myResourceGroup"
```

By default, the output of Azure CLI commands is in JSON (JavaScript Object Notation). To change the default output to a list or table, for example, use [az config set core.output=table](/cli/azure/reference-index). You can also add `--output` to any command for a one time change in output format.

The following example shows the partial JSON output from the `az connectedmachine extension -list` command:

```json
[
  {
    "autoUpgradingMinorVersion": "false",
    "forceUpdateTag": null,
    "id": "/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.HybridCompute/machines/SVR01/extensions/DependencyAgentWindows",
    "location": "regionName",
    "name": "DependencyAgentWindows",
    "namePropertiesInstanceViewName": "DependencyAgentWindows",
```

## Update extension configuration

Some VM extensions require configuration settings in order to install them on the Arc-enabled server, like the Custom Script Extension and the Log Analytics agent VM extension. To upgrade the configuration of an extension, use [az connectedmachine extension update](/cli/azure/connectedmachine/extension#az-connectedmachine-extension-update).

The following example shows how to configure the Custom Script Extension:

```azurecli
az connectedmachine extension update --name "CustomScriptExtension" --type "CustomScriptExtension" --publisher "Microsoft.HybridCompute" --settings "{\"commandToExecute\":\"powershell.exe -c \\\"Get-Process | Where-Object { $_.CPU -lt 100 }\\\"\"}" --type-handler-version "1.10" --machine-name "myMachine" --resource-group "myResourceGroup"
```

## Upgrade extensions

When a new version of a supported VM extension is released, you can upgrade it to that latest release. To upgrade a VM extension, use [az connectedmachine upgrade-extension](/cli/azure/connectedmachine) with the `--machine-name`, `--resource-group`, and `--extension-targets` parameters.

For the `--extension-targets` parameter, you need to specify the extension and the latest version available. To find out what the latest version available is, you can get this information from the **Extensions** page for the selected Arc-enabled server in the Azure portal, or by running [az vm extension image list](/cli/azure/vm/extension/image#az-vm-extension-image-list). You may specify multiple extensions in a single upgrade request by providing a comma-separated list of extensions, defined by their publisher and type (separated by a period) and the target version for each extension, as shown in the example below.

To upgrade the Log Analytics agent extension for Windows that has a newer version available, run the following command:

```azurecli
az connectedmachine upgrade-extension --machine-name "myMachineName" --resource-group "myResourceGroup" --extension-targets '{\"Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\":{\"targetVersion\":\"1.0.18053.0\"}}'
```

You can review the version of installed VM extensions at any time by running the command [az connectedmachine extension list](/cli/azure/connectedmachine/extension#az-connectedmachine-extension-list). The `typeHandlerVersion` property value represents the version of the extension.

## Remove extensions

To remove an installed VM extension on your Azure Arc-enabled server, use [az connectedmachine extension delete](/cli/azure/connectedmachine/extension#az-connectedmachine-extension-delete) with the `--extension-name`, `--machine-name`, and `--resource-group` parameters.

For example, to remove the Log Analytics VM extension for Linux, run the following command:

```azurecli
az connectedmachine extension delete --machine-name "myMachineName" --name "OmsAgentForLinux" --resource-group "myResourceGroup"
```

## Next steps

- You can deploy, manage, and remove VM extensions using the [Azure PowerShell](manage-vm-extensions-powershell.md), from the [Azure portal](manage-vm-extensions-portal.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).

- Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).

- Review the Azure CLI VM extension [Overview](/cli/azure/connectedmachine/extension) article for more information about the commands.
