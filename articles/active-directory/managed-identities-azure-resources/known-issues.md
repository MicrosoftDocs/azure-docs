---
title: Known issues with managed identities - Azure AD
description: Known issues with managed identities for Azure resources.
services: active-directory
documentationcenter: 
author: barclayn
manager: daveba
editor: 
ms.assetid: 2097381a-a7ec-4e3b-b4ff-5d2fb17403b6
ms.service: active-directory
ms.subservice: msi
ms.devlang: 
ms.topic: conceptual
ms.tgt_pltfrm: 
ms.workload: identity
ms.date: 04/06/2021
ms.author: barclayn
ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Known issues

## "Automation script" fails when attempting schema export for managed identities for Azure resources extension

When managed identities for Azure resources is enabled on a VM, the following error is shown when attempting to use the “Automation script” feature for the VM, or its resource group:

![Managed identities for Azure resources automation script export error](./media/msi-known-issues/automation-script-export-error.png)

The managed identities for Azure resources VM extension (planned for deprecation in January 2019) does not currently support the ability to export its schema to a resource group template. As a result, the generated template does not show configuration parameters to enable managed identities for Azure resources on the resource. These sections can be added manually by following the examples in [Configure managed identities for Azure resources on an Azure VM using a templates](qs-configure-template-windows-vm.md).

When the schema export functionality becomes available for the managed identities for Azure resources VM extension (planned for deprecation in January 2019), it will be listed in [Exporting Resource Groups that contain VM extensions](../../virtual-machines/extensions/export-templates.md#supported-virtual-machine-extensions).

## VM fails to start after being moved from resource group or subscription

If you move a VM in the running state, it continues to run during the move. However, after the move, if the VM is stopped and restarted, it will fail to start. This issue happens because the VM is not updating the reference to the managed identities for Azure resources identity and continues to point to it in the old resource group.

**Workaround** 
 
Trigger an update on the VM so it can get correct values for the managed identities for Azure resources. You can do a VM property change to update the reference to the managed identities for Azure resources identity. For example, you can set a new tag value on the VM with the following command:

```azurecli-interactive
az vm update -n <VM Name> -g <Resource Group> --set tags.fixVM=1
```
 
This command sets a new tag "fixVM" with a value of 1 on the VM. 
 
By setting this property, the VM updates with the correct managed identities for Azure resources resource URI, and then you should be able to start the VM. 
 
Once the VM is started, the tag can be removed by using following command:

```azurecli-interactive
az vm update -n <VM Name> -g <Resource Group> --remove tags.fixVM
```

## Transferring a subscription between Azure AD directories

Managed identities do not get updated when a subscription is moved/transferred to another directory. As a result, any existent system-assigned or user-assigned managed identities will be broken. 

Workaround for managed identities in a subscription that has been moved to another directory:

 - For system assigned managed identities: disable and re-enable. 
 - For user assigned managed identities: delete, re-create, and attach them again to the necessary resources (for example, virtual machines)

For more information, see [Transfer an Azure subscription to a different Azure AD directory](../../role-based-access-control/transfer-subscription.md).

## Moving a user-assigned managed identity to a different resource group/subscription

Moving a user-assigned managed identity to a different resource group is not supported.

## Next steps

You can review our article listing the [services that support managed identities](services-support-managed-identities.md) and our [frequently asked questions](mi-faq.md)
