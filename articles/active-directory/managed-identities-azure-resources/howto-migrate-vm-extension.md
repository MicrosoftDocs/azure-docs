---
title: How to migrate from the virtual machine extension for managed identity to Azure Instance Metadata Service for authentication
description: Step by step instructions to migrate off of the VM extension to Azure Instance Metadata Service (IMDS) for authentication.
services: active-directory
documentationcenter: 
author: priyamohanram
manager: daveba
editor: 

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/25/2018
ms.author: priyamo
---

# How to migrate from the virtual machine managed identities extension to Azure Instance Metadata Service

## Virtual machine extension for managed identities

The virtual machine (VM) extension for managed identities is used to request tokens on behalf of services that run on the VM. The workflow consists of the following steps:

1. First, the service calls a local endpoint, `http://localhost/oauth2/token` to request an access token.
2. The VM extension then uses the locally injected credentials to get an access token from Azure AD. 
3. The service then uses the access token to authenticate to an Azure service like KeyVault or storage.

Due to several limitations as outlined in the next section, the VM extension is planned to be deprecated in favor of using the Azure Instance Metadata Service (IMDS) endpoint. 

### Provision the VM extension 

When you create a system-assigned managed identity or a user-assigned managed identity, you may optionally choose to provision the managed identities for Azure resources VM extension using the `-Type` parameter on the [Set-AzVMExtension](https://docs.microsoft.com/powershell/module/az.compute/set-azvmextension) cmdlet. You can pass either `ManagedIdentityExtensionForWindows` or `ManagedIdentityExtensionForLinux`, depending on the type of VM, and name it using the `-Name` parameter. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition:

```powershell
   $settings = @{ "port" = 50342 }
   Set-AzVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
```
Provisioning of the VM extension might fail due to DNS lookup failures. If this happens, restart the VM, and try again. 

### Troubleshoot the VM extension 

#### Restart the VM extension after a failure

On Windows and certain versions of Linux, if the extension stops, the following cmdlet may be used to manually restart it:

```powershell
Set-AzVMExtension -Name <extension name>  -Type <extension Type>  -Location <location> -Publisher Microsoft.ManagedIdentity -VMName <vm name> -ResourceGroupName <resource group name> -ForceRerun <Any string different from any last value used>
```

Where: 
- Extension name and type for Windows is: `ManagedIdentityExtensionForWindows`
- Extension name and type for Linux is: `ManagedIdentityExtensionForLinux`

#### "Automation script" fails when attempting schema export for managed identities for Azure resources extension

When managed identities for Azure resources is enabled on a VM, the following error is shown when attempting to use the “Automation script” feature for the VM, or its resource group:

![Managed identities for Azure resources automation script export error](./media/msi-known-issues/automation-script-export-error.png)

The managed identities for Azure resources VM extension does not currently support the ability to export its schema to a resource group template. As a result, the generated template does not show configuration parameters to enable managed identities for Azure resources on the resource. These sections can be added manually by following the examples in [Configure managed identities for Azure resources on an Azure VM using a templates](qs-configure-template-windows-vm.md).

When the schema export functionality becomes available for the managed identities for Azure resources VM extension (planned for deprecation in January 2019), it will be listed in [Exporting Resource Groups that contain VM extensions](../../virtual-machines/extensions/export-templates.md#supported-virtual-machine-extensions).

## Limitations of the VM extension 

There are several major limitations to using the VM extension. 

 * The most serious limitation is the fact that the credentials used to request tokens are stored on the VM. An attacker who successfully breaches the VM can exfiltrate the credentials. 
 * Furthermore, the VM extension is still unsupported by several Linux distributions, with a huge development cost to modify, build and test the extension on each of those distributions. Currently, only the following Linux distributions are supported: 
    * CoreOS Stable
    * CentOS 7.1 
    * Red Hat 7.2 
    * Ubuntu 15.04 
    * Ubuntu 16.04
 * There is a performance impact to deploying VMs with managed identities, as the VM extension also has to be provisioned. 
 * Finally, the VM extension can only support having 32 user-assigned managed identities per VM. 

## Azure Instance Metadata Service

The [Azure Instance Metadata Service (IMDS)](https://docs.microsoft.com/en-us/azure/virtual-machines/instance-metadata-service) is a REST endpoint that provides information about running virtual machine instances that can be used to manage and configure your virtual machines. The endpoint is available at a well-known non-routable IP address (`169.254.169.254`) that can be accessed only from within the VM.

There are several advantages to using Azure IMDS to request tokens. 

1. The service is external to the VM, therefore the credentials used by managed identities are no longer present on the VM. Instead, they are hosted and secured on the host machine of the Azure VM.   
2. All Windows and Linux operating systems supported on Azure IaaS can use managed identities.
3. Deployment is faster and easier, since the VM extension no longer needs to be provisioned.
4. With the IMDS endpoint, up to 1000 user-assigned managed identities can be assigned to a single VM.
5. There is no significant change to the requests using IMDS as opposed to those using the VM extension, therefore it is fairly simple to port over existing deployments that currently use the VM extension.

For these reasons, the Azure IMDS service will be the defacto way to request tokens, once the VM extension is deprecated. 

## Sample HTTP requests to Azure Instance Metadata Service

The following table lists commonly used HTTP requests on both the VM extension and Azure IMDS endpoint. 

* If system assigned managed identity is enabled and no identity is specified in the request, IMDS will default to the system assigned managed identity.
* If system assigned managed identity is not enabled, and only one user assigned managed identity exists, IMDS will default to that single user assigned managed identity.
* If system assigned managed identity is not enabled, and multiple user assigned managed identities exist, then specifying a managed identity in the request is required.

