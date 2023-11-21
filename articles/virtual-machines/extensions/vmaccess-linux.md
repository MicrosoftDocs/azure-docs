---
title: Reset access to an Azure Linux VM 
description: Learn how to manage administrative users and reset access on Linux VMs by using the VMAccess extension and the Azure CLI.
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.collection: linux
ms.date: 04/12/2023
ms.custom: GGAL-freshness822, devx-track-azurecli
---

# VMAccess Extension for Linux

The VMAccess Extension is used to manage administrative users, configure SSH, and check or repair disks on Azure Linux virtual machines (VMs). The extension integrates with Azure Resource Manager templates. It can also be invoked using Azure CLI, Azure Powershell, the Azure portal, and the Azure Virtual Machines REST API.

This article describes how to run the VMAccess Extension from the Azure CLI and through an Azure Resource Manager template. This article also provides troubleshooting steps for Linux systems.

> [!NOTE]
> If you use the VMAccess extension to reset the password of your VM after you install the Microsoft Entra Login extension, rerun the Microsoft Entra Login extension to re-enable Microsoft Entra Login for your VM.

## Prerequisites

### Supported Linux distributions

| **Linux Distro** | **x64** | **ARM64** |
|:-----|:-----:|:-----:|
| Alma Linux |	9.x+ |	9.x+ |
| CentOS |	7.x+,  8.x+ |	7.x+ |
| Debian |	10+ |	11.x+ |
| Flatcar Linux |	3374.2.x+ |	3374.2.x+ |
| Azure Linux | 2.x | 2.x |
| openSUSE |	12.3+ |	Not Supported |
| Oracle Linux |	6.4+, 7.x+, 8.x+ |	Not Supported |
| Red Hat Enterprise Linux |	6.7+, 7.x+,  8.x+ |	8.6+, 9.0+ |
| Rocky Linux |	9.x+ |	9.x+ |
| SLES |	12.x+, 15.x+ |	15.x SP4+ |
| Ubuntu |	18.04+, 20.04+, 22.04+ |	20.04+, 22.04+ |

### Tips
* VMAccess was designed for the purpose of regaining access to a VM in the event that access is lost. Based on this principal, it will grant sudo permission to account specified in the username field. Do not specify a user in the username field if you do not wish that user to regain sudo permissions - instead, login to the VM and use built-in tools (e.g. usermod, chage, etc.) to manage unprivileged users.
* You can only have one version of the extension applied to a VM. To run a second action, update the existing extension with a new configuration.
* During a user update, VMAccess alters the `sshd_config` file and takes a backup of it beforehand. To restore the original backed-up SSH configuration, run VMAccess with `restore_backup_ssh` set to `True`.

## Extension schema

The VMAccess Extension configuration includes settings for username, passwords, SSH keys, etc. You can store this information in configuration files, specify it on the command line, or include it in an Azure Resource Manager (ARM) template. The following JSON schema contains all the properties available to use in public and protected settings.

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "<name>",
  "apiVersion": "2020-06-01",
  "location": "<location>",
  "dependsOn": [
          "[concat('Microsoft.Compute/virtualMachines/', <vmName>)]"
  ],
  "properties": {
    "publisher": "Microsoft.OSTCExtensions",
    "type": "VMAccessForLinux",
    "typeHandlerVersion": "1.5",
    "autoUpgradeMinorVersion": true,
    "settings": {
      "check_disk": true,
      "repair_disk": false,
      "disk_name": "diskName",
    },
    "protectedSettings": {
      "username": "adminuser1",
      "password": "adminpassword",
      "ssh_key": "ssh-rsa XXXXXX",
      "reset_ssh": false,
      "remove_user": "adminuser2",
      "expiration": "2024-01-01",
      "remove_prior_keys": false,
      "restore_backup_ssh": true
    } 
  }
}
```

### Property values

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2020-06-01 | date |
| publisher | Microsoft.OSTCExtensions | string |
| type | VMAccessForLinux | string |
| typeHandlerVersion | 1.5 | int |

### Settings property values
 
| Name | Data Type | Description |
| ---- | ---- | ---- |
| check_disk | boolean | Whether or not to check disk (optional). Only one between `check_disk` and `repair_disk` can be set to true. |
| repair_disk | boolean | Whether or not to check disk (optional). Only one between `check_disk` and `repair_disk` can be set to true. |
| disk_name | string | Name of disk to repair (required when `repair_disk` is true). |
| username | string | The name of the user to manage (required for all actions on a user account). |
| password | string | The password to set for the user account. |
| ssh_key | string | The SSH public key to add for the user account. The SSH key can be in `ssh-rsa`, `ssh-ed25519`, or `.pem` format. |
| reset_ssh | boolean | Whether or not to reset the SSH. If `true`, it will replace the sshd_config file with an internal resource file corresponding to the default SSH config for that distro. |
| remove_user | string | The name of the user to remove. Cannot be used with `reset_ssh`, `restore_backup_ssh`, and `password`. |
| expiration | string | Expiration to set to for the account. Defaults to never. |
| remove_prior_keys | boolean | Whether or not to remove old SSH keys when adding a new one. Must be used with `ssh_key`. |
| restore_backup_ssh | boolean | Whether or not to restore the original backed-up sshd_config. |

## Template deployment

Azure VM Extensions can be deployed with Azure Resource Manager (ARM) templates. The JSON schema detailed in the previous section can be used in an ARM template to run the VMAccess Extension during the template's deployment. You can find a sample template that includes the VMAccess extension on [GitHub](https://github.com/Azure/azure-quickstart-templates/blob/master/demos/vmaccess-on-ubuntu/azuredeploy.json).

The JSON configuration for a virtual machine extension must be nested inside the virtual machine resource fragment of the template, specifically `"resources": []` object for the virtual machine template and for a virtual machine scale set under `"virtualMachineProfile":"extensionProfile":{"extensions" :[]` object.

## Azure CLI deployment

### Using Azure CLI VM user commands

The following CLI commands under [az vm user](/cli/azure/vm/user) use the VMAccess Extension. To use these commands, you need to [install the latest Azure CLI](/cli/azure/install-az-cli2) and sign in to an Azure account by using [az login](/cli/azure/reference-index).

#### Update SSH key

The following example updates the SSH key for the user `azureUser` on the VM named `myVM`:

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username azureUser \
  --ssh-key-value ~/.ssh/id_rsa.pub
```

> [!NOTE]
> The [`az vm user update` command](/cli/azure/vm) appends the new public key text to the `~/.ssh/authorized_keys` file for the admin user on the VM. This command doesn't replace or remove any existing SSH keys. This command doesn't remove prior keys set at deployment time or subsequent updates by using the VMAccess Extension.


#### Reset password

The following example resets the password for the user `azureUser` on the VM named `myVM`:

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username azureUser \
  --password myNewPassword
```

#### Restart SSH

The following example restarts the SSH daemon and resets the SSH configuration to default values on a VM named `myVM`:

```azurecli-interactive
az vm user reset-ssh \
  --resource-group myResourceGroup \
  --name myVM
```

> [!NOTE]
> The [`az vm user reset-ssh` command](/cli/azure/vm) replaces the sshd_config file with a default config file from the internal resources directory. This command doesn't restore the original SSH configuration found on the virtual machine.

#### Create an administrative/sudo user

The following example creates a user named `myNewUser` with sudo permissions. The account uses an SSH key for authentication on the VM named `myVM`. This method helps you regain access to a VM when current credentials are lost or forgotten. As a best practice, accounts with sudo permissions should be limited.

```azurecli-interactive
az vm user update \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser \
  --ssh-key-value ~/.ssh/id_rsa.pub
```

#### Delete a user

The following example deletes a user named `myNewUser` on the VM named `myVM`:

```azurecli-interactive
az vm user delete \
  --resource-group myResourceGroup \
  --name myVM \
  --username myNewUser
```

### Using Azure CLI VM/VMSS extension commands

You can also use the [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) and [az vmss extension set](/cli/azure/vmss/extension#az-vmss-extension-set) commands to run the VMAccess Extension with the specified configuration.

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.5 \
  --settings '{"check_disk":true}'
  --protected-settings '{"username":"user1","password":"userPassword"}'
```

The `--settings` and `--protected-settings` parameters also accept JSON file paths. For example, to update the SSH public key of a user, create a JSON file named `update_ssh_key.json` and add settings in the following format. Replace the values within the file with your own information:

```json
{
  "username":"azureuser",
  "ssh_key":"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCZ3S7gGp3rcbKmG2Y4vGZFMuMZCwoUzZNGxxxxxx2XV2x9FfAhy8iGD+lF8UdjFX3t5ebMm6BnnMh8fHwkTRdOt3LDQq8o8ElTBrZaKPxZN2thMZnODs5Hlemb2UX0oRIGRcvWqsd4oJmxsXa/Si98Wa6RHWbc9QZhw80KAcOVhmndZAZAGR+Wq6yslNo5TMOr1/ZyQAook5C4FtcSGn3Y+WczaoGWIxG4ZaWk128g79VIeJcIQqOjPodHvQAhll7qDlItVvBfMOben3GyhYTm7k4YwlEdkONm4yV/UIW0la1rmyztSBQIm9sZmSq44XXgjVmDHNF8UfCZ1ToE4r2SdwTmZv00T2i5faeYnHzxiLPA3Enub7xxxxxxwFArnqad7MO1SY1kLemhX9eFjLWN4mJe56Fu4NiWJkR9APSZQrYeKaqru4KUC68QpVasNJHbuxPSf/PcjF3cjO1+X+4x6L1H5HTPuqUkyZGgDO4ynUHbko4dhlanALcriF7tIfQR9i2r2xOyv5gxJEW/zztGqWma/d4rBoPjnf6tO7rLFHXMt/DVTkAfn5wxxtLDwkn5FMyvThRmex3BDf0gujoI1y6cOWLe9Y5geNX0oj+MXg/W0cXAtzSFocstV1PoVqy883hNoeQZ3mIGB3Q0rIUm5d9MA2bMMt31m1g3Sin6EQ== azureuser@myVM"
}
```

Run the VMAccess Extension through the following command:

```azurecli-interactive
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name VMAccessForLinux \
  --publisher Microsoft.OSTCExtensions \
  --version 1.5 \
  --protected-settings update_ssh_key.json
```

## Azure PowerShell deployment

Azure PowerShell can be used to deploy the VMAccess Extension to an existing virtual machine or virtual machine scale set. You can deploy the extension to a VM by running:

```azurepowershell-interactive
$username = "<username>"
$sshKey = "<cert-contents>"

$settings = @{"check_disk" = $true};
$protectedSettings = @{"username" = $username; "ssh_key" = $sshKey};

Set-AzVMExtension -ResourceGroupName "<resource-group>" `
    -VMName "<vm-name>" `
    -Location "<location>" `
    -Publisher "Microsoft.OSTCExtensions" `
    -ExtensionType "VMAccessForLinux" `
    -Name "VMAccessForLinux" `
    -TypeHandlerVersion "1.5" `
    -Settings $settings `
    -ProtectedSettings $protectedSettings
```

You can also provide and modify extension settings through the use of strings:

```azurepowershell-interactive
$username = "<username>"
$sshKey = "<cert-contents>"

$settingsString = '{"check_disk":true}';
$protectedSettingsString = '{"username":"' + $username + '","ssh_key":"' + $sshKey + '"}';

Set-AzVMExtension -ResourceGroupName "<resource-group>" `
    -VMName "<vm-name>" `
    -Location "<location>" `
    -Publisher "Microsoft.OSTCExtensions" `
    -ExtensionType "VMAccessForLinux" `
    -Name "VMAccessForLinux" `
    -TypeHandlerVersion "1.5" `
    -SettingString $settingsString `
    -ProtectedSettingString $protectedSettingsString
```

To deploy to a VMSS, run the following command:

```azurepowershell-interactive
$resourceGroupName = "<resource-group>"
$vmssName = "<vmss-name>"

$protectedSettings = @{
  "username" = "azureUser"
  "password" = "userPassword"
}

$publicSettings = @{
  "repair_disk" = $true
  "disk_name" = "<disk_name>"
}

$vmss = Get-AzVmss `
            -ResourceGroupName $resourceGroupName `
            -VMScaleSetName $vmssName

Add-AzVmssExtension -VirtualMachineScaleSet $vmss `
    -Name "<extension-name>" `
    -Publisher "Microsoft.OSTCExtensions" `
    -Type "VMAccessForLinux" `
    -TypeHandlerVersion "1.5"" `
    -AutoUpgradeMinorVersion $true `
    -Setting $publicSettings `
    -ProtectedSetting $protectedSettings

Update-AzVmss `
    -ResourceGroupName $resourceGroupName `
    -Name $vmssName `
    -VirtualMachineScaleSet $vmss
```

## Troubleshoot and support

Get data about the state of extension deployments from the Azure portal and by using the Azure CLI. To see the deployment state of extensions for a given VM, run the following command by using the Azure CLI.

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

For more help, you can contact the Azure experts at [Azure Community Support](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select **Get support**. For more information about Azure Support, read the [Azure support plans FAQ](https://azure.microsoft.com/support/faq/).
