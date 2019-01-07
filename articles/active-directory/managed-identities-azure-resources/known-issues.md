---
title: FAQs and known issues with managed identities for Azure resources
description: Known issues with managed identities for Azure resources.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 
ms.assetid: 2097381a-a7ec-4e3b-b4ff-5d2fb17403b6
ms.service: active-directory
ms.component: msi
ms.devlang: 
ms.topic: conceptual
ms.tgt_pltfrm: 
ms.workload: identity
ms.date: 12/12/2017
ms.author: daveba
---

# FAQs and known issues with managed identities for Azure resources

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

## Frequently Asked Questions (FAQs)

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

### Does managed identities for Azure resources work with Azure Cloud Services?

No, there are no plans to support managed identities for Azure resources in Azure Cloud Services.

### Does managed identities for Azure resources work with the Active Directory Authentication Library (ADAL) or the Microsoft Authentication Library (MSAL)?

No, managed identities for Azure resources is not yet integrated with ADAL or MSAL. For details on acquiring a token for managed identities for Azure resources using the REST endpoint, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token ](how-to-use-vm-token.md).

### What is the security boundary of managed identities for Azure resources?

The security boundary of the identity is the resource to which it is attached to. For example, the security boundary for a Virtual Machine with managed identities for Azure resources enabled, is the Virtual Machine. Any code running on that VM, is able to call the managed identities for Azure resources endpoint and request tokens. It is the similar experience with other resources that support managed identities for Azure resources.

### What identity will IMDS default to if don't specify the identity in the request?

- If system assigned managed identity is enabled and no identity is specified in the request, IMDS will default to the system assigned managed identity.
- If system assigned managed identity is not enabled, and only one user assigned managed identity exists, IMDS will default to that single user assigned managed identity. 
- If system assigned managed identity is not enabled, and multiple user assigned managed identities exist, then specifying a managed identity in the request is required.

### Should I use the managed identities for Azure resources VM IMDS endpoint or the VM extension endpoint?

When using managed identities for Azure resources with VMs, we encourage using the managed identities for Azure resources IMDS endpoint. The Azure Instance Metadata Service is a REST Endpoint accessible to all IaaS VMs created via the Azure Resource Manager. Some of the benefits of using managed identities for Azure resources over IMDS are:
    - All Azure IaaS supported operating systems can use managed identities for Azure resources over IMDS.
    - No longer need to install an extension on your VM to enable managed identities for Azure resources. 
    - The certificates used by managed identities for Azure resources are no longer present in the VM.
    - The IMDS endpoint is a well-known non-routable IP address, only available from within the VM.

The managed identities for Azure resources VM extension is still available to be used today; however, moving forward we will default to using the IMDS endpoint. The managed identities for Azure resources VM extension will be deprecated in January 2019. 

For more information on Azure Instance Metadata Service, see [IMDS documentation](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service)

### Will managed identities be recreated automatically if I move a subscription to another directory?

No. If you move a subscription to another directory, you will have to manually re-create them and grant Azure RBAC role assignments again.
    - For system assigned managed identities: disable and re-enable.
    - For user assigned managed identities: delete, re-create and attach them again to the necessary resources (e.g. virtual machines)

### Can I use a managed identity to access a resource in a different directory/tenant?

No. Managed identities do not currently support cross-directory scenarios. 

### What are the supported Linux distributions?

All Linux distributions supported by Azure IaaS can be used with managed identities for Azure resources via the IMDS endpoint. 

The managed identities for Azure resources VM Extension (planned for deprecation in January 2019) only supports the following Linux distributions:
- CoreOS Stable
- CentOS 7.1
- Red Hat 7.2
- Ubuntu 15.04
- Ubuntu 16.04

Other Linux distributions are currently not supported and extension might fail on unsupported distributions.

The extension works on CentOS 6.9. However, due to lack of system support in 6.9, the extension will not auto restart if crashed or stopped. It restarts when the VM restarts. To restart the extension manually, see [How do you restart the managed identities for Azure resources extension?](#how-do-you-restart-the-managed-identities-for-Azure-resources-extension)

### How do you restart the managed identities for Azure resources extension?
On Windows and certain versions of Linux, if the extension stops, the following cmdlet may be used to manually restart it:

```powershell
Set-AzureRmVMExtension -Name <extension name>  -Type <extension Type>  -Location <location> -Publisher Microsoft.ManagedIdentity -VMName <vm name> -ResourceGroupName <resource group name> -ForceRerun <Any string different from any last value used>
```

Where: 
- Extension name and type for Windows is: ManagedIdentityExtensionForWindows
- Extension name and type for Linux is: ManagedIdentityExtensionForLinux

## Known issues

### "Automation script" fails when attempting schema export for managed identities for Azure resources extension

When managed identities for Azure resources is enabled on a VM, the following error is shown when attempting to use the “Automation script” feature for the VM, or its resource group:

![Managed identities for Azure resources automation script export error](./media/msi-known-issues/automation-script-export-error.png)

The managed identities for Azure resources VM extension (planned for deprecation in January 2019) does not currently support the ability to export its schema to a resource group template. As a result, the generated template does not show configuration parameters to enable managed identities for Azure resources on the resource. These sections can be added manually by following the examples in [Configure managed identities for Azure resources on an Azure VM using a templates](qs-configure-template-windows-vm.md).

When the schema export functionality becomes available for the managed identities for Azure resources VM extension (planned for deprecation in January 2019), it will be listed in [Exporting Resource Groups that contain VM extensions](../../virtual-machines/extensions/export-templates.md#supported-virtual-machine-extensions).

### Configuration blade does not appear in the Azure portal

If the VM Configuration blade does not appear on your VM, then managed identities for Azure resources has not been enabled in the portal in your region yet.  Check again later.  You can also enable managed identities for Azure resources for your VM using [PowerShell](qs-configure-powershell-windows-vm.md) or the [Azure CLI](qs-configure-cli-windows-vm.md).

### Cannot assign access to virtual machines in the Access control (IAM) blade

If **Virtual Machine** does not appear in the Azure portal as a choice for **Assign access to** in **Access control (IAM)** > **Add role assignment**, then managed identities for Azure resources has not been enabled in the portal in your region yet. Check again later.  You can still select the identity for the VM for the role assignment by searching for the managed identities for Azure resources Service Principal.  Enter the name of the VM in the **Select** field, and the Service Principal appears in the search result.

### VM fails to start after being moved from resource group or subscription

If you move a VM in the running state, it continues to run during the move. However, after the move, if the VM is stopped and restarted, it will fail to start. This issue happens because the VM is not updating the reference to the managed identities for Azure resources identity and continues to point to it in the old resource group.

**Workaround** 
 
Trigger an update on the VM so it can get correct values for the managed identities for Azure resources. You can do a VM property change to update the reference to the managed identities for Azure resources identity. For example, you can set a new tag value on the VM with the following command:

```azurecli-interactive
 az  vm update -n <VM Name> -g <Resource Group> --set tags.fixVM=1
```
 
This command sets a new tag "fixVM" with a value of 1 on the VM. 
 
By setting this property, the VM updates with the correct managed identities for Azure resources resource URI, and then you should be able to start the VM. 
 
Once the VM is started, the tag can be removed by using following command:

```azurecli-interactive
az vm update -n <VM Name> -g <Resource Group> --remove tags.fixVM
```

### VM extension provisioning fails

Provisioning of the VM extension might fail due to DNS lookup failures. Restart the VM, and try again.
 
> [!NOTE]
> The VM extension is planned for deprecation by January 2019. We recommend you move to using the IMDS endpoint.

### Transferring a subscription between Azure AD directories

Managed identities do not get updated when a subscription is moved/transferred to another directory. As a result, any existent system-assigned or user-assigned managed identities will be broken. 

As a workaround once the subscription has been moved, you can disable system-assigned managed identities and re-enable them. Similarly, you can delete and recreate any user-assigned managed identities. 

## Known issues with user-assigned managed identities

- Creating a user-assigned managed identity with special characters (i.e. underscore) in the name, is not supported.
- User-assigned identity names are restricted to 24 characters. If the name is longer than 24 characters, the identity will fail to be assigned to a resource (i.e. Virtual Machine.)
- If using the managed identity virtual machine extension (planned for deprecation in January 2019), the supported limit is 32 user-assigned managed identities. Without the managed identity virtual machine extension, the supported limit is 512.  
- Moving a user-assigned managed identity to a different resource group will cause the identity to break. As a result, you will not be able to request tokens for that identity. 
- Transferring a subscription to another directory will break any existent user-assigned managed identities. 