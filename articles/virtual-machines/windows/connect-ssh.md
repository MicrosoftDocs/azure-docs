---
title: Connect using SSH to an Azure VM running Windows
description: Learn how to connect using Secure Shell and sign on to a Windows VM.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 06/29/2022
ms.author: migreene
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---
# How to connect using Secure Shell (SSH) and sign on to an Azure virtual machine running Windows

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

The [Win32 OpenSSH](https://github.com/PowerShell/Win32-OpenSSH) project makes remote connectivity with Secure Shell ubiquitous by providing native support in Windows. The capability is provided in
Windows Server version 2019 and later, and can be added to older versions of Windows using a virtual
machine (VM) extension.

The examples below use variables. You can set variables in your environment as follows.

| Shell | Example
|-|-
| Bash/ZSH | myResourceGroup='resGroup10'
| PowerShell | $myResourceGroup='resGroup10'

## Enable SSH

First, you'll need to enable SSH in your Windows machine.

Deploy the SSH extension for Windows. The extension provides an automated installation of the Win32 OpenSSH solution, similar to enabling the capability in newer versions of Windows. Use the following examples to deploy the extension.

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az vm extension set --resource-group $myResourceGroup --vm-name $myVM --name WindowsOpenSSH --publisher Microsoft.Azure.OpenSSH --version 3.0
```

# [Azure PowerShell](#tab/azurepowershell-interactive)

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName $myResourceGroup -VMName $myVM -Name 'OpenSSH' -Publisher 'Microsoft.Azure.OpenSSH' -Type 'WindowsOpenSSH' -TypeHandlerVersion '3.0'
```

# [ARM template](#tab/json)

```json
{
  "type": "Microsoft.Compute/virtualMachines/extensions",
  "name": "[concat(parameters('VMName'), '/WindowsOpenSSH')]",
  "apiVersion": "2020-12-01",
  "location": "[parameters('location')]",
  "properties": {
    "publisher": "Microsoft.Azure.OpenSSH",
    "type": "WindowsOpenSSH",
    "typeHandlerVersion": "3.0"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
resource windowsOpenSSHExtension 'Microsoft.Compute/virtualMachines/extensions@2020-12-01' = {
  parent: virtualMachine
  name: 'WindowsOpenSSH'
  location: resourceGroup().location
  properties: {
    publisher: 'Microsoft.Azure.OpenSSH'
    type: 'WindowsOpenSSH'
    typeHandlerVersion: '3.0'
  }
}
```

---

## Open TCP port

Ensure the appropriate port (by default, TCP 22) is open to allow connectivity to the VM.


# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az network nsg rule create -g $myResourceGroup --nsg-name $myNSG -n allow-SSH --priority 1000 --source-address-prefixes 208.130.28.4/32 --destination-port-ranges 22 --protocol TCP
```

# [Azure PowerShell](#tab/azurepowershell-interactive)

```azurepowershell-interactive
Get-AzNetworkSecurityGroup -Name $MyNSG -ResourceGroupName $myResourceGroup | Add-AzNetworkSecurityRuleConfig -Name allow-SSH -access Allow -Direction Inbound -Priority 1000 -SourceAddressPrefix 208.130.28.4/32 -SourcePortRange '*' -DestinationAddressPrefix '*' -DestinationPortRange 22 -Protocol TCP | Set-AzNetworkSecurityGroup
```

# [ARM template](#tab/json)

```json
{
  "type": "Microsoft.Network/networkSecurityGroups/securityRules",
  "apiVersion": "2021-08-01",
  "name": "allow-SSH",
  "properties": {
    "access": "Allow",
    "destinationAddressPrefix": "*",
    "destinationPortRange": "22",
    "direction": "Inbound",
    "priority": "1000",
    "protocol": "TCP",
    "sourceAddressPrefix": "208.130.28.4/32",
    "sourcePortRange": "*"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
resource allowSSH 'Microsoft.Network/networkSecurityGroups/securityRules@2021-08-01' = {
  name: 'allowSSH'
  parent: MyNSGSymbolicName
  properties: {
    access: 'Allow'
    destinationAddressPrefix: '*'
    destinationPortRange: 'string'
    destinationPortRanges: [
      '22'
    ]
    direction: 'Inbound'
    priority: 1000
    protocol: 'TCP'
    sourceAddressPrefix: '208.130.28.4/32'
    sourcePortRange: '*'
  }
}
```

---

- Your VM must have a public IP address. To check if your VM has a public IP address, select
  **Overview** from the left menu and look at the **Networking** section. If you see an IP address
  next to **Public IP address**, then your VM has a public IP. To learn more about adding a public IP
  address to an existing VM, see
  [Associate a public IP address to a virtual machine](../../virtual-network/ip-services/associate-public-ip-address-vm.md)

- Verify your VM is running. On the Overview tab, in the essentials section, verify the status of
  the VM is Running. To start the VM, select **Start** at the top of the page.

## Authentication

You can authenticate to Windows machines using either username and password or SSH keys. Azure doesn't support provisioning public keys to Windows machines automatically, however you can copy the key using the RunCommand extension.

[!INCLUDE [virtual-machines-common-ssh-overview](../../../includes/virtual-machines-common-ssh-overview.md)]

[!INCLUDE [virtual-machines-common-ssh-support](../../../includes/virtual-machines-common-ssh-support.md)]

### Copy a public key using the RunCommand extension.

The RunCommand extension provides an easy solution to copying a public key into Windows machines
and making sure the file has correct permissions.

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az vm run-command invoke -g $myResourceGroup -n $myVM --command-id RunPowerShellScript --scripts "MYPUBLICKEY | Add-Content 'C:\ProgramData\ssh\administrators_authorized_keys' -Encoding UTF8;icacls.exe 'C:\ProgramData\ssh\administrators_authorized_keys' /inheritance:r /grant 'Administrators:F' /grant 'SYSTEM:F'"
```

# [Azure PowerShell](#tab/azurepowershell-interactive)

```azurepowershell-interactive
Invoke-AzVMRunCommand -ResourceGroupName $myResourceGroup -VMName $myVM -CommandId 'RunPowerShellScript' -ScriptString "MYPUBLICKEY | Add-Content 'C:\ProgramData\ssh\administrators_authorized_keys' -Encoding UTF8;icacls.exe 'C:\ProgramData\ssh\administrators_authorized_keys' /inheritance:r /grant 'Administrators:F' /grant 'SYSTEM:F'"
```

# [ARM template](#tab/json)

```json
{
  "type": "Microsoft.Compute/virtualMachines/runCommands",
  "apiVersion": "2022-03-01",
  "name": "[concat(parameters('VMName'), '/RunPowerShellScript')]",
  "location": "[parameters('location')]",
  "properties": {
    "timeoutInSeconds":600
    "source": {
      "script": "MYPUBLICKEY | Add-Content 'C:\\ProgramData\\ssh\\administrators_authorized_keys -Encoding UTF8';icacls.exe 'C:\\ProgramData\\ssh\\administrators_authorized_keys' /inheritance:r /grant 'Administrators:F' /grant 'SYSTEM:F'"
    }
  }
}
```

# [Bicep](#tab/bicep)

```bicep
resource runPowerShellScript 'Microsoft.Compute/virtualMachines/runCommands@2022-03-01' = {
  name: 'RunPowerShellScript'
  location: resourceGroup().location
  parent: virtualMachine
  properties: {
    timeoutInSeconds: 600
    source: {
      script: "MYPUBLICKEY | Add-Content 'C:\ProgramData\ssh\administrators_authorized_keys' -Encoding UTF8;icacls.exe 'C:\ProgramData\ssh\administrators_authorized_keys' /inheritance:r /grant 'Administrators:F' /grant 'SYSTEM:F'"
    }
  }
}
```

---

## Connect using Az CLI

Connect to Windows machines using `Az SSH` commands.

```azurecli-interactive
az ssh vm  -g $myResourceGroup -n $myVM --local-user $myUsername
```

It's also possible to create a network tunnel for specific TCP ports through the SSH connection. A good use case for this is Remote Desktop which defaults to port 3389.

```azurecli-interactive
az ssh vm  -g $myResourceGroup -n $myVM --local-user $myUsername -- -L 3389:localhost:3389
```

### Connect from Azure portal

1. Go to the [Azure portal](https://portal.azure.com/) to connect to a VM. Search for and select **Virtual machines**.
2. Select the virtual machine from the list.
3. Select **Connect** from the left menu.
4. Select the option that fits with your preferred way of connecting. The portal helps walk you through the prerequisites for connecting.


## Next steps
Learn how to transfer files to an existing VM, see [Use SCP to move files to and from a VM](../copy-files-to-vm-using-scp.md).
