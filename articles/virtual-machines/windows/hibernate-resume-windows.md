---
title: Learn about hibernating your Windows virtual machine
description: Learn how to hibernate a Windows virtual machine.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: how-to
ms.date: 04/09/2024
ms.author: jainan
ms.reviewer: mattmcinnes
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Hibernating Windows virtual machines

**Applies to:** :heavy_check_mark: Windows VMs

[!INCLUDE [hibernate-resume-intro](../includes/hibernate-resume-intro.md)]

## How hibernation works
To learn how hibernation works, check out the [hibernation overview](../hibernate-resume.md).

## Supported configurations
Hibernation support is limited to certain VM sizes and OS versions. Make sure you have a supported configuration before using hibernation.

### Supported Windows versions
The following Windows operating systems support hibernation:

- Windows Server 2022
- Windows Server 2019
- Windows 11 Pro
- Windows 11 Enterprise
- Windows 11 Enterprise multi-session
- Windows 10 Pro
- Windows 10 Enterprise
- Windows 10 Enterprise multi-session

### Prerequisites and configuration limitations
- The Windows page file can't be on the temp disk.  
- Applications such as Device Guard and Credential Guard that require virtualization-based security (VBS) work with hibernation when you enable Trusted Launch on the VM and Nested Virtualization in the guest OS.

For general limitations, Azure feature limitations supported VM sizes, and feature prerequisites check out the ["Supported configurations" section in the hibernation overview](../hibernate-resume.md#supported-configurations).

## Creating a Linux VM with hibernation enabled

To hibernate a VM, you must first enable the feature while creating the VM. You can only enable hibernation for a VM on initial creation. You can't enable this feature after the VM is created.

To enable hibernation during VM creation, you can use the Azure portal, CLI, PowerShell, ARM templates and API. 

### [Portal](#tab/enableWithPortal)

To enable hibernation in the Azure portal, check the 'Enable hibernation' box during VM creation.

![Screenshot of the checkbox in the Azure portal to enable hibernation while creating a new Windows VM.](./media/hibernate-resume/hibernate-enable-during-vm-creation.png)


### [CLI](#tab/enableWithCLI)

To enable hibernation in the Azure CLI, create a VM by running the following [az vm create]() command with ` --enable-hibernation` set to `true`.

```azurecli
 az vm create --resource-group myRG \
   --name myVM \
   --image Win2019Datacenter \
   --public-ip-sku Standard \
   --size Standard_D2s_v5 \
   --enable-hibernation true 
```

### [PowerShell](#tab/enableWithPS)

To enable hibernation when creating a VM with PowerShell, run the following command:

```powershell
New-AzVm ` 
 -ResourceGroupName 'myRG' ` 
 -Name 'myVM' ` 
 -Location 'East US' ` 
 -VirtualNetworkName 'myVnet' ` 
 -SubnetName 'mySubnet' ` 
 -SecurityGroupName 'myNetworkSecurityGroup' ` 
 -PublicIpAddressName 'myPublicIpAddress' ` 
 -Size Standard_D2s_v5 ` 
 -Image Win2019Datacenter ` 
 -HibernationEnabled ` 
 -OpenPorts 80,3389 
```

### [REST](#tab/enableWithREST)

First, [create a VM with hibernation enabled](/rest/api/compute/virtual-machines/create-or-update#create-a-vm-with-hibernationenabled)

```json
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/{vm-name}?api-version=2021-11-01
```
Your output should look something like this:

```
{
  "location": "eastus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_D2s_v5"
    },
    "additionalCapabilities": {
      "hibernationEnabled": true
    },
    "storageProfile": {
      "imageReference": {
        "publisher": "MicrosoftWindowsServer",
        "offer": "WindowsServer",
        "sku": "2019-Datacenter",
        "version": "latest"
      },
      "osDisk": {
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Standard_LRS"
        },
        "name": "vmOSdisk",
        "createOption": "FromImage"
      }
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
          "properties": {
            "primary": true
          }
        }
      ]
    },
    "osProfile": {
      "adminUsername": "{your-username}",
      "computerName": "{vm-name}",
      "adminPassword": "{your-password}"
    },
    "diagnosticsProfile": {
      "bootDiagnostics": {
        "storageUri": "http://{existing-storage-account-name}.blob.core.windows.net",
        "enabled": true
      }
    }
  }
}

```
To learn more about REST, check out an [API example](/rest/api/compute/virtual-machines/create-or-update#create-a-vm-with-hibernationenabled)

---

Once you've created a VM with hibernation enabled, you need to configure the guest OS to successfully hibernate your VM. 

## Configuring hibernation in the guest OS

To hibernate a VM, you must first enable the feature while creating the VM. You can only enable hibernation for a VM on initial creation. You can't enable this feature after the VM is created.

After ensuring that your VM configuration is supported, you can use the Azure portal, CLI, PowerShell, ARM templates and API to enable hibernation during VM creation.

### [Portal](#tab/enableWithPortal)

To enable hibernation in the Azure portal, check the 'Enable hibernation' box during VM creation.

![Screenshot of the checkbox in the Azure portal to enable hibernation when creating a new Windows VM.](../media/hibernate-resume/hibernate-enable-during-vm-creation.png)


### [CLI](#tab/enableWithCLI)

To enable hibernation in the Azure CLI, create a VM by running the following [az vm create]() command with ` --enable-hibernation` set to `true`.

```azurecli
 az vm create --resource-group myRG \
   --name myVM \
   --image Win2019Datacenter \
   --public-ip-sku Standard \
   --size Standard_D2s_v5 \
   --enable-hibernation true 
```

### [PowerShell](#tab/enableWithPS)

To enable hibernation when creating a VM with PowerShell, run the following command:

```powershell
New-AzVm ` 
 -ResourceGroupName 'myRG' ` 
 -Name 'myVM' ` 
 -Location 'East US' ` 
 -VirtualNetworkName 'myVnet' ` 
 -SubnetName 'mySubnet' ` 
 -SecurityGroupName 'myNetworkSecurityGroup' ` 
 -PublicIpAddressName 'myPublicIpAddress' ` 
 -Size Standard_D2s_v5 ` 
 -Image Win2019Datacenter ` 
 -HibernationEnabled ` 
 -OpenPorts 80,3389 
```

### [REST](#tab/enableWithREST)

First, [create a VM with hibernation enabled](/rest/api/compute/virtual-machines/create-or-update#create-a-vm-with-hibernationenabled).

```json
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/{vm-name}?api-version=2021-11-01
```
Your output should look something like this:

```
{
  "location": "eastus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_D2s_v5"
    },
    "additionalCapabilities": {
      "hibernationEnabled": true
    },
    "storageProfile": {
      "imageReference": {
        "publisher": "MicrosoftWindowsServer",
        "offer": "WindowsServer",
        "sku": "2019-Datacenter",
        "version": "latest"
      },
      "osDisk": {
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Standard_LRS"
        },
        "name": "vmOSdisk",
        "createOption": "FromImage"
      }
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
          "properties": {
            "primary": true
          }
        }
      ]
    },
    "osProfile": {
      "adminUsername": "{your-username}",
      "computerName": "{vm-name}",
      "adminPassword": "{your-password}"
    },
    "diagnosticsProfile": {
      "bootDiagnostics": {
        "storageUri": "http://{existing-storage-account-name}.blob.core.windows.net",
        "enabled": true
      }
    }
  }
}

```
To learn more about REST, check out an [API example](/rest/api/compute/virtual-machines/create-or-update#create-a-vm-with-hibernationenabled).

---

Once you've created a VM with hibernation enabled, you need to configure the guest OS to successfully hibernate your VM. 

Enabling hibernation while creating a Windows VM automatically installs the 'Microsoft.CPlat.Core.WindowsHibernateExtension' VM extension. This extension configures the guest OS for hibernation. This extension doesn't need to be manually installed or updated, as this extension is managed by the Azure platform.

>[!NOTE]
>When you create a VM with hibernation enabled, Azure automatically places the page file on the C: drive. If you're using a specialized image, then you'll need to follow additional steps to ensure that the pagefile is located on the C: drive. 

>[!NOTE]
>Using the WindowsHibernateExtension requires the Azure VM Agent to be installed on the VM. If you choose to opt-out of the Azure VM Agent, then you can configure the OS for hibernation by running powercfg /h /type full inside the guest. You can then verify if hibernation is enabled inside guest using the powercfg /a command.


[!INCLUDE [hibernate-resume-platform-instructions](../includes/hibernate-resume-platform-instructions.md)]

## Troubleshooting
Refer to the [Hibernate troubleshooting guide](../hibernate-resume-troubleshooting.md) and the [Windows VM hibernation troubleshooting guide](./hibernate-resume-troubleshooting-windows.md) for more information.

## FAQs
Refer to the [Hibernate FAQs](../hibernate-resume.md#faqs) for more information.

## Next Steps:
- [Learn more about Azure billing](/azure/cost-management-billing/)
- [Look into Azure VM Sizes](../sizes.md)
