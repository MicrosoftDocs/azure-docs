---
title: Enable and disable the Azure Serial Console | Microsoft Docs
description: How to enable and disable the Azure Serial Console service
services: virtual-machines
documentationcenter: ''
author: kof-f
manager: westonh
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm
ms.workload: infrastructure-services
ms.date: 1/14/2020
ms.author: kofiforson
---

# Enable and disable the Azure Serial Console

Just like any other resource, the Azure Serial Console can be enabled and disabled. Serial Console is enabled by default for all subscriptions in global Azure. Currently, disabling Serial Console will disable the service for your entire subscription. Disabling or re-enabling Serial Console for a subscription requires contributor level access or above on the subscription.

You can also disable serial console for an individual VM or virtual machine scale set instance by disabling boot diagnostics. You will require contributor level access or above on both the VM/virtual machine scale set and your boot diagnostics storage account.

## VM-level disable
The serial console can be disabled for a specific VM or virtual machine scale set by disabling the boot diagnostics setting. Turn off boot diagnostics from the Azure portal to disable the serial console for the VM or the virtual machine scale set. If you are using serial console on a virtual machine scale set, ensure you upgrade your virtual machine scale set instances to the latest model.


## Subscription-level enable/disable

> [!NOTE]
> Ensure you are in the right cloud (Azure Public Cloud, Azure US Government Cloud) before running this command. You can check with `az cloud list` and set your cloud with `az cloud set -n <Name of cloud>`.

### Azure CLI

Serial console can be disabled and re-enabled for an entire subscription by using the following commands in the Azure CLI (you may use the "Try it" button to launch an instance of the Azure Cloud Shell in which you can run the commands):

To disable serial console for a subscription, use the following commands:
```azurecli-interactive
subscriptionId=$(az account show --output=json | jq -r .id)

az resource invoke-action --action disableConsole --ids "/subscriptions/$subscriptionId/providers/Microsoft.SerialConsole/consoleServices/default" --api-version="2018-05-01"
```

To enable serial console for a subscription, use the following commands:
```azurecli-interactive
subscriptionId=$(az account show --output=json | jq -r .id)

az resource invoke-action --action enableConsole --ids "/subscriptions/$subscriptionId/providers/Microsoft.SerialConsole/consoleServices/default" --api-version="2018-05-01"
```

To get the current enabled/disabled status of serial console for a subscription, use the following commands:
```azurecli-interactive
subscriptionId=$(az account show --output=json | jq -r .id)

az resource show --ids "/subscriptions/$subscriptionId/providers/Microsoft.SerialConsole/consoleServices/default" --output=json --api-version="2018-05-01" | jq .properties
```

### PowerShell

Serial console can also be enabled and disabled using PowerShell.

To disable serial console for a subscription, use the following commands:
```azurepowershell-interactive
$subscription=(Get-AzContext).Subscription.Id

Invoke-AzResourceAction -Action disableConsole -ResourceId /subscriptions/$subscription/providers/Microsoft.SerialConsole/consoleServices/default -ApiVersion 2018-05-01
```

To enable serial console for a subscription, use the following commands:
```azurepowershell-interactive
$subscription=(Get-AzContext).Subscription.Id

Invoke-AzResourceAction -Action enableConsole -ResourceId /subscriptions/$subscription/providers/Microsoft.SerialConsole/consoleServices/default -ApiVersion 2018-05-01
```

## Workaround for Incompatibility with Managed Boot Diagnostics

If you're using a managed boot diagnostics storage account, you've probably run into the following error when trying to use Serial Console:

Serial Console requires a custom boot diagnostics storage account to be used, and is not yet fully compatible with managed boot diagnostics storage accounts. Click to view and change your boot diagnostics storage account configuration. Click here for more details or if you are already using a custom storage account and receive this error.

We are aware that this is not ideal and are working towards rectifying this. In the meantime, if you do plan on using managed storage accounts and need access to Serial Console there is a workaround.

  1. Open the [Azure portal](https://portal.azure.com).

  2. Navigate to **Virtual Machines** and select the Virtual Machine you need console access to. The overview page for the VM opens.

  3. Scroll down to the **Support + troubleshooting** section and select **Boot diagnostics**. A new pane with the Boot diagnostics information opens. Here you can download a Screenshot of the VM or the Serial log.

  4. Click **Settings**. The settings page for the VM Boot diagnostics opens.
   
  5. Select **Enable with custom storage account**.
   
  6. Select your existing Diagnostics storage account from the dropdown menu that appears or create a new one.
   
  7. Once done, you can re-enable your managed storage account by following steps 1-5 and selecting **Enable with managed storage account (recommended)**.
   
> [!NOTE]
> Serial Console is not compatible with storage account firewalls. Please disable any storage account firewalls you have while you use Serial Console and then re-enable them after. We are aware this is not ideal and are working towards rectifying this.





## Next steps
* Learn more about the [Azure Serial Console for Linux VMs](./serial-console-linux.md)
* Learn more about the [Azure Serial Console for Windows VMs](./serial-console-windows.md)
* Learn about [power management options within the Azure Serial Console](./serial-console-power-options.md)