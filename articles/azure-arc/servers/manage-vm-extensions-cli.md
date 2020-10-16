---
title: Enable VM extension using Azure CLI
description: This article describes how to deploy virtual machine extensions to Azure Arc enabled servers running in hybrid cloud environments using Azure CLI.
ms.date: 10/15/2020
ms.topic: conceptual
---

# Enable Azure VM extensions using the Azure CLI

This article shows you how to deploy and uninstall Azure VM extensions, supported by Azure Arc enabled servers, to a Linux or Windows hybrid machine using the Azure CLI.

[!INCLUDE [Azure CLI Prepare your environment](../../../includes/azure-cli-prepare-your-environment.md)]

## Prerequisites

- [Install the Azure CLI](/cli/azure/install-azure-cli).

Before using the Azure CLI to manage VM extensions on your machine, you need to install the `ConnectedMachine` CLI extension. Run the following command on your Arc enabled server `az extension add connectedmachine`.

## Enable extension

To enable a VM extension on your Arc enabled server, use [az connectedmachine machine-extension create](/cli/azure/ext/connectedmachine/connectedmachine/machine-extension#ext_connectedmachine_az_connectedmachine_machine_extension_create) with the `--machine-name`, `--extension-name`, `--location`, `--type`, `settings`, and `--publisher` parameters.

The following example enables the Log Analytics VM extension on a Arc enabled Linux server:

```azurecli
az connectedmachine machine-extension create --machine-name "myMachine" --name "OmsAgentforLinux" --location "eastus2euap" --type "CustomScriptExtension" --publisher "Microsoft.EnterpriseCloud.Monitoring" --settings "{\"workspaceId\":\"workspaceId"}" --protected-settings "{\workspaceKey\":"\workspacekKey"} --type-handler-version "1.10" --resource-group "myResourceGroup"
```

The following example enables the Custom Script Extension on an Arc enabled server:

```azurecli
az connectedmachine machine-extension create --machine-name "myMachine" --name "CustomScriptExtension" --location "eastus2euap" --type "CustomScriptExtension" --publisher "Microsoft.Compute" --settings "{\"commandToExecute\":\"powershell.exe -c \\\"Get-Process | Where-Object { $_.CPU -gt 10000 }\\\"\"}" --type-handler-version "1.10" --resource-group "myResourceGroup"
```

## List extensions installed

To get a list of the VM extensions on your Arc enabled server, use [az connectedmachine machine-extension list](/cli/azure/ext/connectedmachine/connectedmachine/machine-extension#ext_connectedmachine_az_connectedmachine_machine_extension_list) with the `machine-name` and `resource-group` parameters.

`az connectedmachine machine-extension list --machine-name "myMachine" --resource-group "myResourceGroup"`

## Remove an installed extension

To remove an installed VM extension on your Arc enabled server, use [az connectedmachine machine-extension delete](/cli/azure/ext/connectedmachine/connectedmachine/machine-extension#ext_connectedmachine_az_connectedmachine_machine_extension_delete) with the `extension-name`, `machine-name` and `resource-group` parameters.


 