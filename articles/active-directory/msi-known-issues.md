---
title: Known issues with Managed Service Identity (MSI) for Azure Active Directory
description: Known issues with Managed Service Identity for Azure Active Directory.
services: active-directory
documentationcenter: 
author: skwan
manager: mbaldwin
editor: 
ms.assetid: 2097381a-a7ec-4e3b-b4ff-5d2fb17403b6
ms.service: active-directory
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: identity
ms.date: 09/14/2017
ms.author: skwan
---

# Known issues with Managed Service Identity (MSI) for Azure Active Directory

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]

## Configuration blade does not appear in the Azure portal

If the VM Configuration blade does not appear on your VM, then MSI has not been enabled in the portal in your region yet.  Check again later.  You can also enable MSI for your VM using [PowerShell](msi-qs-configure-powershell-windows-vm.md) or the [Azure CLI](msi-qs-configure-cli-windows-vm.md).

## Cannot assign access to virtual machines in the Access Control (IAM) blade

If **Virtual Machine** does not appear in the Azure portal as a choice for **Assign access to** in **Access Control (IAM)** > **Add permissions**, then Managed Service Identity has not been enabled in the portal in your region yet. Check again later.  You can still select the Managed Service Identity for the role assignment by searching for the MSI’s Service Principal.  Enter the name of the VM in the **Select** field, and the Service Principal appears in the search result.

## VM fails to start after being moved from resource group or subscription

If you move a VM in the running state, it continues to run during the move. However, after the move, if the VM is stopped and restarted, it will fail to start. This issue happens because the VM is not updating the reference to the MSI identity and continues to point to it in the old resource group.

**Workaround** 
 
Trigger an update on the VM so it can get correct values for the MSI. You can do a VM property change to update the reference to the MSI identity. For example, you can set a new tag value on the VM with the following command:

```azurecli-interactive
 az  vm update -n <VM Name> -g <Resource Group> --set tags.fixVM=1
```
 
This command sets a new tag "fixVM" with a value of 1 on the VM. 
 
By setting this property, the VM updates with the correct MSI resource URI, and then you should be able to start the VM. 
 
Once the VM is started, the tag can be removed by using following command:

```azurecli-interactive
az vm update -n <VM Name> -g <Resource Group> --remove tags.fixVM
```

## Does MSI work with the Active Directory Authentication Library (ADAL) or the Microsoft Authentication Library (MSAL)?

No, MSI is not yet integrated with ADAL or MSAL.
