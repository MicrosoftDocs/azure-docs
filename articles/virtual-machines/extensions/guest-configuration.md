---
title: Guest configuration extension
description: Learn about the Guest Configuration extension and explore how to audit and configure settings for Azure virtual machines.
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
author: mgreenegit
ms.author: migreene
ms.date: 04/05/2023
---

# Overview of the Guest Configuration extension

The Guest Configuration extension is a component of Azure Policy that performs audit and configuration operations inside virtual machines (VMs).

To check policies inside VMs, such as security baseline definitions for [Linux](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffc9b3da7-8347-4380-8e70-0a0361d8dedd) and [Windows](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F72650e9f-97bc-4b2a-ab5f-9781a9fcecbc), the Guest Configuration extension must be installed.

## Prerequisites

To enable your VM to authenticate to the Guest Configuration service, your VM must have a [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview). You can satisfy the identity requirement for your VM by setting the `"type": "SystemAssigned"` property:

```json
"identity": {
   "type": "SystemAssigned"
}
```

### Operating systems

Operating system support for the Guest Configuration extension is the same as documented [operating system support for the end-to-end solution](/azure/governance/machine-configuration/overview#supported-client-types).

### Internet connectivity

The agent installed by the Guest Configuration extension must be able to reach content packages listed by Guest Configuration assignments,
and report status to the Guest Configuration service. The VM can connect by using outbound HTTPS over TCP port 443, or a connection provided through private networking.

To learn more about private networking, see the following articles:

- [Guest Configuration, Communicate over Azure Private Link](/azure/governance/machine-configuration/overview#communicate-over-private-link-in-azure)
- [Use private endpoints for Azure Storage](/azure/storage/common/storage-private-endpoints)

## Install the extension

You can install and deploy the Guest Configuration extension directly from the Azure CLI or PowerShell. Deployment templates are also available for Azure Resource Manager (ARM), Bicep, and Terraform. For deployment template details, see [Microsoft.GuestConfiguration guestConfigurationAssignments](/azure/templates/microsoft.guestconfiguration/guestconfigurationassignments?pivots=deployment-language-arm-template).

> [!NOTE]
> In the following deployment examples, replace `<placeholder>` parameter values with specific values for your configuration.

### Deployment considerations

Before you install and deploy the Guest Configuration extension, review the following considerations.

- **Instance name**. When you install the Guest Configuration extension, the instance name of the extension must be set to `AzurePolicyforWindows` or `AzurePolicyforLinux`. The security baseline definition policies described earlier require these specific strings.

- **Versions**. By default, all deployments update to the latest version. The value of the `autoUpgradeMinorVersion` property defaults to `true` unless otherwise specified. This feature helps to alleviate concerns about updating your code when new versions of the Guest Configuration extension are released.

- **Automatic upgrade**. The Guest Configuration extension supports the `enableAutomaticUpgrade` property. When this property is set to `true`, Azure automatically upgrades to the latest version of the extension as future releases become available. For more information, see [Automatic Extension Upgrade for VMs and Virtual Machine Scale Sets in Azure](/azure/virtual-machines/automatic-extension-upgrade).

- **Azure Policy**. To deploy the latest version of the Guest Configuration extension at scale including identity requirements, follow the steps in [Create a policy assignment to identify noncompliant resources](/azure/governance/policy/assign-policy-portal#create-a-policy-assignment) to create the following assignment with Azure Policy:
   - [Deploy prerequisites to enable Guest Configuration policies on virtual machines](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Guest%20Configuration/GuestConfiguration_Prerequisites.json)

- **Other properties**. You don't need to include any settings or protected-settings properties on the Guest Configuration extension. The agent retrieves this class of information from [Guest Configuration assignment](/rest/api/guestconfiguration/guestconfigurationassignments) resources. For example, the [`ConfigurationUri`](/rest/api/guestconfiguration/guestconfigurationassignments/createorupdate#guestconfigurationnavigation), [`Mode`](/rest/api/guestconfiguration/guestconfigurationassignments/createorupdate#configurationmode), and [`ConfigurationSetting`](/rest/api/guestconfiguration/guestconfigurationassignments/createorupdate#configurationsetting) properties are each managed per-configuration rather than on the VM extension.

### Azure CLI

To deploy the extension for Linux:

```azurecli
az vm extension set  --publisher Microsoft.GuestConfiguration --name ConfigurationforLinux --extension-instance-name AzurePolicyforLinux --resource-group <myResourceGroup> --vm-name <myVM> --enable-auto-upgrade true
```

To deploy the extension for Windows:

```azurecli
az vm extension set  --publisher Microsoft.GuestConfiguration --name ConfigurationforWindows --extension-instance-name AzurePolicyforWindows --resource-group <myResourceGroup> --vm-name <myVM> --enable-auto-upgrade true
```

### PowerShell

To deploy the extension for Linux:

```powershell
Set-AzVMExtension -Publisher 'Microsoft.GuestConfiguration' -Type 'ConfigurationforLinux' -Name 'AzurePolicyforLinux' -TypeHandlerVersion 1.0 -ResourceGroupName '<myResourceGroup>' -Location '<myLocation>' -VMName '<myVM>' -EnableAutomaticUpgrade $true
```

To deploy the extension for Windows:

```powershell
Set-AzVMExtension -Publisher 'Microsoft.GuestConfiguration' -Type 'ConfigurationforWindows' -Name 'AzurePolicyforWindows' -TypeHandlerVersion 1.0 -ResourceGroupName '<myResourceGroup>' -Location '<myLocation>' -VMName '<myVM>' -EnableAutomaticUpgrade $true
```

### ARM template

To deploy the extension for Linux:

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "[concat(parameters('VMName'), '/AzurePolicyforLinux')]",
  "apiVersion": "2020-12-01",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', parameters('VMName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.GuestConfiguration",
    "type": "ConfigurationforLinux",
    "typeHandlerVersion": "1.0",
    "autoUpgradeMinorVersion": true,
    "enableAutomaticUpgrade": true, 
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
  "apiVersion": "2020-12-01",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', parameters('VMName'))]"
  ],
  "properties": {
    "publisher": "Microsoft.GuestConfiguration",
    "type": "ConfigurationforWindows",
    "typeHandlerVersion": "1.0",
    "autoUpgradeMinorVersion": true,
    "enableAutomaticUpgrade": true, 
    "settings": {},
    "protectedSettings": {}
  }
}
```

### Bicep template

To deploy the extension for Linux:

```bicep
resource virtualMachine 'Microsoft.Compute/virtualMachines@2021-03-01' existing = {
  name: 'VMName'
}
resource windowsVMGuestConfigExtension 'Microsoft.Compute/virtualMachines/extensions@2020-12-01' = {
  parent: virtualMachine
  name: 'AzurePolicyforLinux'
  location: resourceGroup().location
  properties: {
    publisher: 'Microsoft.GuestConfiguration'
    type: 'ConfigurationforLinux'
    typeHandlerVersion: '1.0'
    autoUpgradeMinorVersion: true
    enableAutomaticUpgrade: true
    settings: {}
    protectedSettings: {}
  }
}
```

To deploy the extension for Windows:

```bicep
resource virtualMachine 'Microsoft.Compute/virtualMachines@2021-03-01' existing = {
  name: 'VMName'
}
resource windowsVMGuestConfigExtension 'Microsoft.Compute/virtualMachines/extensions@2020-12-01' = {
  parent: virtualMachine
  name: 'AzurePolicyforWindows'
  location: resourceGroup().location
  properties: {
    publisher: 'Microsoft.GuestConfiguration'
    type: 'ConfigurationforWindows'
    typeHandlerVersion: '1.0'
    autoUpgradeMinorVersion: true
    enableAutomaticUpgrade: true
    settings: {}
    protectedSettings: {}
  }
}
```

### Terraform template

To deploy the extension for Linux:

```terraform
resource "azurerm_virtual_machine_extension" "gc" {
  name                       = "AzurePolicyforLinux"
  virtual_machine_id         = "<myVMID>"
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
  virtual_machine_id         = "<myVMID>"
  publisher                  = "Microsoft.GuestConfiguration"
  type                       = "ConfigurationforWindows"
  type_handler_version       = "1.0"
  auto_upgrade_minor_version = "true"
}
```

## Error messages

The following table lists possible error messages related to enabling the Guest Configuration extension.

| Error code | Description |
|---|---|
| **NoComplianceReport** | The VM hasn't reported the compliance data. |
| **GCExtensionMissing** | The Guest Configuration extension is missing. |
| **ManagedIdentityMissing** | The managed identity is missing. |
| **UserIdentityMissing** | The user-assigned identity is missing. |
| **GCExtensionManagedIdentityMissing** | The Guest Configuration extension and managed identity are missing. |
| **GCExtensionUserIdentityMissing** | The Guest Configuration extension and user-assigned identity are missing. |
| **GCExtensionIdentityMissing** | The Guest Configuration extension, managed identity, and user-assigned identity are missing. |

## Next steps

- For more information about Azure Policy's guest configuration, see [Understand Azure Policy's Guest Configuration](../../governance/machine-configuration/overview.md).
- For more information about how the Linux Agent and extensions work, see [Azure VM extensions and features for Linux](features-linux.md).
- For more information about how the Windows Guest Agent and extensions work, see [Azure VM extensions and features for Windows](features-windows.md).
- To install the Windows Guest Agent, see [Azure Windows Virtual Machine Agent Overview](agent-windows.md).
- To install the Linux Agent, see [Azure Linux Virtual Machine Agent Overview](agent-linux.md).
