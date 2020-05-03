---
title: Azure Serial Console errors | Microsoft Docs
description: Common errors within the Azure Serial Console
services: virtual-machines
documentationcenter: ''
author: asinn826
manager: borisb
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm
ms.workload: infrastructure-services
ms.date: 8/20/2019
ms.author: alsin
---

# Common errors within the Azure Serial Console
There are a set of known errors within the Azure Serial Console. This is a list of those errors and mitigation steps for them.

## Common errors

Error                             |   Mitigation
:---------------------------------|:--------------------------------------------|
"Azure Serial Console requires boot diagnostics to be enabled. Click here to configure boot diagnostics for your virtual machine." | Ensure that the VM or virtual machine scale set has [boot diagnostics](boot-diagnostics.md) enabled. If you are using serial console on a virtual machine scale set instance, ensure that your instance has the latest model.
"Azure Serial Console requires a virtual machine to be running. Use the Start button above to start your virtual machine."  | The VM or virtual machine scale set instance must be in a started state to access the serial console (your VM must not be stopped or deallocated). Ensure your VM or virtual machine scale set instance is running and try again.
"Azure Serial Console is not enabled for this subscription, contact your subscription administrator to enable." | The Azure Serial Console can be disabled at a subscription level. If you are a subscription administrator, you may [enable and disable the Azure Serial Console](./serial-console-enable-disable.md). If you are not a subscription administrator, you should reach out to your subscription administrator for next steps.
A "Forbidden" response was encountered when accessing this VM's boot diagnostic storage account. | Ensure that boot diagnostics doesn't have an account firewall. An accessible boot diagnostic storage account is necessary for the serial console to function. Serial console by design cannot work with storage account firewalls enabled on the boot diagnostics storage account.
You do not have the required permissions to use this VM with the serial console. Ensure you have at least Virtual Machine Contributor role permissions.| The serial console access requires you to have contributor level access or above on your VM or virtual machine scale set. For more information, see the [overview page](serial-console-overview.md).
The storage account '' used for boot diagnostics on this VM could not be found. Verify that boot diagnostics is enabled for this VM, this storage account has not been deleted, and you have access to this storage account. | Double check that you have not deleted the boot diagnostics storage account for your VM or virtual machine scale set
The serial console connection to the VM encountered an error: 'Bad Request' (400) | This can happen if your boot diagnostics URI is incorrect. For example, "http://" was used instead of "https://". The boot diagnostics URI can be fixed with this command: `az vm boot-diagnostics enable --name vmName --resource-group rgName --storage https://<storageAccountUri>.blob.core.windows.net/`
You do not have the required permissions to write to the boot diagnostics storage account for this VM. Please ensure you have at least VM Contributor permissions | Serial console access requires contributor level access on the boot diagnostics storage account. For more information, see the [overview page](serial-console-overview.md).
Unable to determine the resource group for the boot diagnostics storage account *&lt;STORAGEACCOUNTNAME&gt;*. Verify that boot diagnostics is enabled for this VM and you have access to this storage account. | Serial console access requires contributor level access on the boot diagnostics storage account. For more information, see the [overview page](serial-console-overview.md).
Provisioning for this VM has not yet succeeded. Please ensure the VM is fully deployed and retry the serial console connection. | Your VM or virtual machine scale set may still be provisioning. Wait some time and try again.
Web socket is closed or could not be opened. | You may need to add firewall access to `*.console.azure.com`. A more detailed but longer approach is to allow firewall access to the [Microsoft Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which change fairly regularly.
Serial console does not work with a storage account using Azure Data Lake Storage Gen2 with hierarchical namespaces. | This is a known issue with hierarchical namespaces. To mitigate, ensure that your VM's boot diagnostics storage account is not created using Azure Data Lake Storage Gen2. This option can only be set upon storage account creation. You may have to create a separate boot diagnostics storage account without Azure Data Lake Storage Gen2 enabled to mitigate this issue.
The serial console connection to the VM encountered an error: 'Forbidden'(SubscriptionNotEnabled) - Subscription name undefined, id \<subscription id> is in non-Enabled state undefined | This issue may occur if the subscription that a user has created their Cloud Shell storage account in has been disabled. To mitigate, launch Cloud Shell and [perform the steps necessary](https://docs.microsoft.com/azure/cloud-shell/persisting-shell-storage#unmount-clouddrive-1) to reprovision a backing storage account for Cloud Shell in the current subscription.

## Next steps
* Learn more about the [Azure Serial Console for Linux VMs](./serial-console-linux.md)
* Learn more about the [Azure Serial Console for Windows VMs](./serial-console-windows.md)