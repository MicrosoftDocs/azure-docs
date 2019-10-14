---
title: Azure Diagnostics Extension for Windows | Microsoft Docs
description: Monitor Azure Windows VMs using the Azure Diagnostics Extension
services: virtual-machines-windows
documentationcenter: ''
author: johnkemnetz
manager: ashwink
editor: ''

ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 04/06/2018
ms.author: johnkem

---
# Azure Diagnostics Extension for Windows VMs

## Overview

The Azure Diagnostics VM extension enables you to collect monitoring data, such as performance counters and event logs, from your Windows VM. You can granularly specify what data you want to collect and where you want the data to go, such as an Azure Storage account or an Azure Event Hub. You can also use this data to build charts in the Azure portal or create metric alerts.

## Prerequisites

### Operating system

The Azure Diagnostics Extension can be run against Windows 10 Client, Windows Server 2008 R2, 2012, 2012 R2, and 2016.

### Internet connectivity

The Azure Diagnostics Extension requires that the target virtual machine is connected to the internet. 

## Extension schema

[The Azure Diagnostics Extension schema and property values are described in this document.](../../azure-monitor/platform/diagnostics-extension-schema-1dot3.md)

## Template deployment

Azure VM extensions can be deployed with Azure Resource Manager templates. The JSON schema detailed in the previous section can be used in an Azure Resource Manager template to run the Azure Diagnostics extension during an Azure Resource Manager template deployment. See [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](extensions-diagnostics-template.md).

## Azure CLI deployment

The Azure CLI can be used to deploy the Azure Diagnostics extension to an existing virtual machine. Replace the protected settings and settings properties with valid JSON from the extension schema above. 

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name IaaSDiagnostics \
  --publisher Microsoft.Azure.Diagnostics \
  --version 1.9.0.0 --protected-settings protected-settings.json \
  --settings public-settings.json 
```

## PowerShell deployment

The `Set-AzVMDiagnosticsExtension` command can be used to add the Azure Diagnostics extension to an existing virtual machine. See also [Use PowerShell to enable Azure Diagnostics in a virtual machine running Windows](ps-extensions-diagnostics.md).

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]


```powershell
$vm_resourcegroup = "myvmresourcegroup"
$vm_name = "myvm"
$diagnosticsconfig_path = "DiagnosticsPubConfig.xml"

Set-AzVMDiagnosticsExtension -ResourceGroupName $vm_resourcegroup `
  -VMName $vm_name `
  -DiagnosticsConfigurationPath $diagnosticsconfig_path
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

[See this article](../../azure-monitor/platform/diagnostics-extension-troubleshooting.md) for a more comprehensive troubleshooting guide for the Azure Diagnostics extension.

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next Steps
* [Learn more about the Azure Diagnostics Extension](../../azure-monitor/platform/diagnostics-extension-overview.md)
* [Review the extension schema and versions](../../azure-monitor/platform/diagnostics-extension-schema.md)
