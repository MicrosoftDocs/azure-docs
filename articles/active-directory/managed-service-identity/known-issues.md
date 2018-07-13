---
title: FAQs and known issues with Managed Service Identity (MSI) for Azure Active Directory
description: Known issues with Managed Service Identity for Azure Active Directory.
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

# FAQs and known issues with Managed Service Identity (MSI) for Azure Active Directory

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

## Frequently Asked Questions (FAQs)

### Does MSI work with Azure Cloud Services?

No, there are no plans to support MSI in Azure Cloud Services.

### Does MSI work with the Active Directory Authentication Library (ADAL) or the Microsoft Authentication Library (MSAL)?

No, MSI is not yet integrated with ADAL or MSAL. For details on acquiring an MSI token using the MSI REST endpoint, see [How to use an Azure VM Managed Service Identity (MSI) for token acquisition](how-to-use-vm-token.md).

### What is the security boundary of a Managed Service Identity?

The security boundary of the identity is the resource to which it is attached to. For example, the security boundary for a Virtual Machine MSI, is the Virtual Machine. Any code running on that VM, is able to call the MSI endpoint and request tokens. It is the similar experience with other resources that support MSI.

### Should I use the MSI VM IMDS endpoint or the MSI VM extension endpoint?

When using MSI with VMs, we encourage using the MSI IMDS endpoint. The Azure Instance Metadata Service is a REST Endpoint accessible to all IaaS VMs created via the Azure Resource Manager. Some of the benefits of using MSI over IMDS are:

1. All Azure IaaS supported operating systems can use MSI over IMDS. 
2. No longer need to install an extension on your VM to enable MSI. 
3. The certificates used by MSI are no longer present in the VM. 
4. The IMDS endpoint is a well-known non-routable IP address, only available from within the VM. 

The MSI VM extension is still availble to be used today; however, moving forward we will default to using the IMDS endpoint. The MSI VM extension will start on a deprecation plan soon. 

For more information on Azure Instance Metada Service, see [IMDS documentation](https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service)

### What are the supported Linux distributions?

All Linux distributions supported by Azure IaaS can be used with MSI via the IMDS endpoint. 

Note: The MSI VM Extension only supports the following Linux distributions:
- CoreOS Stable
- CentOS 7.1
- Red Hat 7.2
- Ubuntu 15.04
- Ubuntu 16.04

Other Linux distributions are currently not supported and extension might fail on unsupported distributions.

The extension works on CentOS 6.9. However, due to lack of system support in 6.9, the extension will not auto restart if crashed or stopped. It restarts when the VM restarts. To restart the extension manually, see [How do you restart the MSI extension?](#how-do-you-restart-the-msi-extension)

### How do you restart the MSI extension?
On Windows and certain versions of Linux, if the extension stops, the following cmdlet may be used to manually restart it:

```powershell
Set-AzureRmVMExtension -Name <extension name>  -Type <extension Type>  -Location <location> -Publisher Microsoft.ManagedIdentity -VMName <vm name> -ResourceGroupName <resource group name> -ForceRerun <Any string different from any last value used>
```

Where: 
- Extension name and type for Windows is: ManagedIdentityExtensionForWindows
- Extension name and type for Linux is: ManagedIdentityExtensionForLinux

## Known issues

### "Automation script" fails when attempting schema export for MSI extension

When Managed Service Identity is enabled on a VM, the following error is shown when attempting to use the “Automation script” feature for the VM, or its resource group:

![MSI automation script export error](../managed-service-identity/media/msi-known-issues/automation-script-export-error.png)

The Managed Service Identity VM extension does not currently support the ability to export its schema to a resource group template. As a result, the generated template does not show configuration parameters to enable Managed Service Identity on the resource. These sections can be added manually by following the examples in [Configure a VM Managed Service Identity by using a template](qs-configure-template-windows-vm.md).

When the schema export functionality becomes available for the MSI VM extension, it will be listed in [Exporting Resource Groups that contain VM extensions](../../virtual-machines/extensions/export-templates.md#supported-virtual-machine-extensions).

### Configuration blade does not appear in the Azure portal

If the VM Configuration blade does not appear on your VM, then MSI has not been enabled in the portal in your region yet.  Check again later.  You can also enable MSI for your VM using [PowerShell](qs-configure-powershell-windows-vm.md) or the [Azure CLI](qs-configure-cli-windows-vm.md).

### Cannot assign access to virtual machines in the Access Control (IAM) blade

If **Virtual Machine** does not appear in the Azure portal as a choice for **Assign access to** in **Access Control (IAM)** > **Add permissions**, then Managed Service Identity has not been enabled in the portal in your region yet. Check again later.  You can still select the Managed Service Identity for the role assignment by searching for the MSI’s Service Principal.  Enter the name of the VM in the **Select** field, and the Service Principal appears in the search result.

### VM fails to start after being moved from resource group or subscription

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

## Known issues with User Assigned Identities

- User Assigned Identity assignments are only avaialble for VM and VMSS. IMPORTANT: User Assigned Identity assignments will change in the upcoming months.
- Duplicate User Assigned Identities on the same VM/VMSS, will cause the VM/VMSS to fail. This includes identities that are added with different casing. e.g. MyUserAssignedIdentity and myuserassignedidentity. 
- Provisioning of the VM extension to a VM might fail due to DNS lookup failures. Restart the VM, and try again. 
- Adding a 'non-existent' user assigned identity will cause the VM to fail. 
- Creating a user assigned identity with special characters (i.e. underscore) in the name, is not supported.
- User assigned identity names are restricted to 24 characters for end to end scenario. User Assigned identities with names longer than 24 characters will fail to be assigned.
- If using the managed identity virtual machine extension, the supported limit is 32 user assigned managed identities. Without the managed identity virtual machine extension, the supported limit is 512.  
- When adding a second user assigned identity, the clientID might not be available to requests tokens for the VM extension. As a mitigation, restart the MSI VM extension with the following two bash commands:
 - `sudo bash -c "/var/lib/waagent/Microsoft.ManagedIdentity.ManagedIdentityExtensionForLinux-1.0.0.8/msi-extension-handler disable"`
 - `sudo bash -c "/var/lib/waagent/Microsoft.ManagedIdentity.ManagedIdentityExtensionForLinux-1.0.0.8/msi-extension-handler enable"`
- When a VM has a user assigned identity but no system assigned identity, the portal UI will show MSI as disabled. To enable the system assigned identity, use an Azure Resource Manager template, an Azure CLI, or an SDK.
