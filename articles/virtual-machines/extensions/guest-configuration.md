---
title: Azure Policy Guest Configuration extension
description: Learn about the extension used to audit / configure settings inside virtual machines
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
author: mgreenegit
ms.author: migreene
ms.date: 04/15/2021 
ms.custom: devx-track-azurepowershell

---

# Overview of the Azure Policy Guest Configuration extension

The Guest Configuration extension is a component Azure Policy that performs audit and configuration operations inside virtual machines.
Policies such as security baseline definitions for 
[Linux](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffc9b3da7-8347-4380-8e70-0a0361d8dedd)
and [Windows](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F72650e9f-97bc-4b2a-ab5f-9781a9fcecbc)
can't check settings inside machines until the extension is installed.

## Prerequisites

For the machine to authenticate to the Guest Configuration service, the machine must have a
[System-Assigned Managed Identity](../../active-directory/managed-identities-azure-resources/overview.md).
The identity requirement on a virtual machine is met if the following property is set.

  ```json
  "identity": {
    "type": "SystemAssigned"
  }
  ```

### Operating Systems

Support for the Guest Configuration extension is the same as operating system support
[documented for the end to end solution](../../governance/policy/concepts/guest-configuration.md#supported-client-types).

### Internet connectivity

The agent installed by the Guest Configuration extension must be able to reach
content packages listed by Guest Configuration assignments,
and report status to the Guest Configuration service.
The machine can connect using outbound HTTPS over
TCP port 443, or if a connection is provided through private networking.
To learn more about private networking, see the following articles:

- [Guest Configuration, communicate over private link in Azure](../../governance/policy/concepts/guest-configuration.md#communicate-over-private-link-in-azure)
- [Use private endpoints for Azure Storage](../../storage/common/storage-private-endpoints.md)

## How can I install the extension?

The instance name of the extension must be set to
"AzurePolicyforWindows" or "AzurePolicyforLinux",
because the policies referenced above require these specific strings.

By default, all deployments update to the latest version. The value
of property _autoUpgradeMinorVersion_ defaults to "true" unless it is otherwise
specified. You do not need to worry about updating your code when
new versions of the extension are released.

### Azure Policy

To deploy the latest version of the extension at scale including identity requirements,
[assign](../../governance/policy/assign-policy-portal.md) the Azure Policy:

[Deploy prerequisites to enable Guest Configuration policies on virtual machines](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Guest%20Configuration/GuestConfiguration_Prerequisites.json).

### Azure CLI

To deploy the extension for Linux:


```azurecli
az vm extension set  --publisher Microsoft.GuestConfiguration --name ConfigurationforLinux --extension-instance-name AzurePolicyforLinux --resource-group myResourceGroup --vm-name myVM
```

To deploy the extension for Windows:

```azurecli
az vm extension set  --publisher Microsoft.GuestConfiguration --name ConfigurationforWindows --extension-instance-name AzurePolicyforWindows --resource-group myResourceGroup --vm-name myVM
```

### PowerShell

To deploy the extension for Linux:

```powershell
Set-AzVMExtension -Publisher 'Microsoft.GuestConfiguration' -Type 'ConfigurationforLinux' -Name 'AzurePolicyforLinux' -TypeHandlerVersion 1.0 -ResourceGroupName 'myResourceGroup' -Location 'myLocation' -VMName 'myVM'
```

To deploy the extension for Windows:

```powershell
Set-AzVMExtension -Publisher 'Microsoft.GuestConfiguration' -Type 'ConfigurationforWindows' -Name 'AzurePolicyforWindows' -TypeHandlerVersion 1.0 -ResourceGroupName 'myResourceGroup' -Location 'myLocation' -VMName 'myVM'
```

### Resource Manager template

To deploy the extension for Linux:

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "[concat(parameters('VMName'), '/AzurePolicyforLinux')]",
  "apiVersion": "2019-07-01",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', parameters('VMName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.GuestConfiguration",
    "type": "ConfigurationforLinux",
    "typeHandlerVersion": "1.0",
    "autoUpgradeMinorVersion": true,
    "settings": {},
    "protectedSettings": {}
  }
}
```

To deploy the extension for Windows:

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "[concat(parameters('VMName'), '/AzurePolicyforWindows')]",
  "apiVersion": "2019-07-01",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', parameters('VMName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.GuestConfiguration",
    "type": "ConfigurationforWindows",
    "typeHandlerVersion": "1.0",
    "autoUpgradeMinorVersion": true,
    "settings": {},
    "protectedSettings": {}
  }
}
```

### Terraform

To deploy the extension for Linux:

```terraform
resource "azurerm_virtual_machine_extension" "gc" {
  name                       = "AzurePolicyforLinux"
  virtual_machine_id         = "myVMID"
  publisher                  = "Microsoft.GuestConfiguration"
  type                       = "ConfigurationforLinux"
  type_handler_version       = "1.0"
  auto_upgrade_minor_version = "true"
}
```

To deploy the extension for Windows:

```terraform
resource "azurerm_virtual_machine_extension" "gc" {
  name                       = "AzurePolicyforWindows"
  virtual_machine_id         = "myVMID"
  publisher                  = "Microsoft.GuestConfiguration"
  type                       = "ConfigurationforWindows"
  type_handler_version       = "1.0"
  auto_upgrade_minor_version = "true"
}
```

## Settings

There's no need to include any settings or protected-settings properties on the extension.
All such information is retrieved by the agent from
[Guest Configuration assignment](/rest/api/guestconfiguration/guestconfigurationassignments)
resources. For example, the
[ConfigurationUri](/rest/api/guestconfiguration/guestconfigurationassignments/createorupdate#guestconfigurationnavigation),
[Mode](/rest/api/guestconfiguration/guestconfigurationassignments/createorupdate#configurationmode),
and
[ConfigurationSetting](/rest/api/guestconfiguration/guestconfigurationassignments/createorupdate#configurationsetting)
properties are each managed per-configuration rather than on the VM extension.

## Next steps

* For more information about Azure Policy Guest Configuration, see [Understand Azure Policy's Guest Configuration](../../governance/policy/concepts/guest-configuration.md)
* For more information about how the Linux Agent and extensions work, see [Azure VM extensions and features for Linux](features-linux.md).
* For more information about how the Windows Guest Agent and extensions work, see [Azure VM extensions and features for Windows](features-windows.md).  
* To install the Windows Guest Agent, see [Azure Windows Virtual Machine Agent Overview](agent-windows.md).  
* To install the Linux Agent, see [Azure Linux Virtual Machine Agent Overview](agent-linux.md).  
