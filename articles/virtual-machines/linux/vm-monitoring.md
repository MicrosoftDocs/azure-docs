---
title: Enable or Disabling Azure VM Monitoring
description: Describes How to Enable or Disable Azure VM Monitoring
services: virtual-machines-linux
documentationcenter: virtual-machines
author: kmouss
manager: timlt
editor: ''

ms.assetid: 6ce366d2-bd4c-4fef-a8f5-a3ae2374abcc
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/08/2016
ms.author: kmouss
---
# Enable or Disable Azure VM Monitoring

This section describes how to enable or disable monitoring on Virtual machines running on Azure. You can enable or disable monitoring using the portal or Azure Command-line Interface for Mac, Linux, and Windows (the Azure CLI).

> [!IMPORTANT]
> This document describes version 2.3 of the Linux Diagnostic Extension, which has been deprecated. Version 2.3 will be supported until June 30, 2018.
>
> Version 3.0 of the Linux Diagnostic Extension can be enabled instead. For more information, see [the documentation](./diagnostic-extension.md).

## Enable / Disable Monitoring through the Azure portal

You can enable  monitoring of your Azure VM, which provides data about your instance in 1-minute periods. (storage changes apply). Detailed diagnostics data is then available for the VM in the portal graphs or through the API. By default, Azure portal enables host-based monitoring of a limited set of metrics. You can enable monitoring of metrics from within a VM while the VM is running or in stopped state.

* Open the Azure portal at [https://portal.azure.com](https://portal.azure.com).
* In the left navigation, click Virtual machines.
* In the list Virtual machines, select a running or stopped instance. The "Virtual machine" blade opens.
* Click All settings.
* Click Diagnostics.
* Change status to On or Off. You can also pick in this blade the level of monitoring details you would like to enable for your virtual machine.

![Enable / Disable Monitoring through the Azure portal.][1]

## Enable / Disable Monitoring with Azure CLI

To enable monitoring for an Azure VM.

* Create a file (named such as PrivateConfig.json):

```json
{
        "storageAccountName":"the storage account to receive data",
        "storageAccountKey":"the key of the account"
}
```

* Enable the extension via Azure CLI.

```azurecli
azure vm extension set myvm LinuxDiagnostic Microsoft.OSTCExtensions 2.3 --private-config-path PrivateConfig.json
```

For more information, see [Using Linux Diagnostic Extension to Monitor Linux VM’s performance and diagnostic data](classic/diagnostic-extension-v2.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).

<!--Image references-->
[1]: ./media/vm-monitoring/portal-enable-disable.png
