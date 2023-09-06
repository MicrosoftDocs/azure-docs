---
title: Configure private IP addresses for VMs (Classic) - Azure PowerShell
description: Learn how to configure private IP addresses for virtual machines (Classic) using PowerShell.
services: virtual-network
ms.date: 08/24/2023
ms.author: mbender
author: mbender-ms
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: H1Hack27Feb2017, devx-track-azurepowershell
---

# Configure private IP addresses for a virtual machine (Classic) using PowerShell

[!INCLUDE [virtual-networks-static-private-ip-selectors-classic-include](../../../includes/virtual-networks-static-private-ip-selectors-classic-include.md)]

[!INCLUDE [virtual-networks-static-private-ip-intro-include](../../../includes/virtual-networks-static-private-ip-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../../includes/azure-arm-classic-important-include.md)]

This article covers the classic deployment model. You can also [manage a static private IP address in the Resource Manager deployment model](virtual-networks-static-private-ip-arm-ps.md).

[!INCLUDE [virtual-networks-static-ip-scenario-include](../../../includes/virtual-networks-static-ip-scenario-include.md)]

The following sample PowerShell commands expect a simple environment already created. If you want to run the commands as they're displayed in this document, first build the test environment described in [Create a VNet](/previous-versions/azure/virtual-network/virtual-networks-create-vnet-classic-netcfg-ps).

## How to verify if a specific IP address is available

To verify if the IP address *192.168.1.101* is available in a VNet named *TestVNet*, run the following PowerShell command and verify the value for *IsAvailable*:

```azurepowershell
$tstip = @{
    VNetName = "TestVNet"
    IPAddress = "192.168.1.101"
}
Test-AzureStaticVNetIP @tstip

```

Expected output:

```output
IsAvailable          : True
AvailableAddresses   : {}
OperationDescription : Test-AzureStaticVNetIP
OperationId          : fd3097e1-5f4b-9cac-8afa-bba1e3492609
OperationStatus      : Succeeded
```

## How to specify a static private IP address when creating a VM

The following PowerShell script creates a new cloud service named *TestService*. The script then retrieves an image from Azure and creates a VM named *DNS01* in the new cloud service. Finally, the script using the sets the VM to be in a subnet named *FrontEnd*, and sets *192.168.1.7* as a static private IP address for the VM:


```azurepowershell
$azsrv = @{
    ServiceName = "TestService"
    Location = "Central US"
}
New-AzureService @azsrv

$image = Get-AzureVMImage | where {$_.ImageName -like "*RightImage-Windows-2012R2-x64*"}

$azcfg = @{
    Name = "DNS01"
    InstanceSize = "Small"
    ImageName = $image.ImageName
}

$azprv = @{
    AdminUsername = "adminuser"
}

$azsub = @{
    SubnetNames = "FrontEnd"
}

$azip = @{
    IPAddress = "192.168.1.7"
}

$azvm = @{
    ServiceName = "TestService"
    VNetsName = "TestVNet"
}
New-AzureVMConfig @azcfg | Add-AzureProvisioningConfig @azprv -Windows | Set-AzureSubnet @azsub | Set-AzureStaticVNetIP @azip | New-AzureVM @azvm
```

Expected output:

```output
WARNING: No deployment found in service: 'TestService'.
OperationDescription OperationId                          OperationStatus
-------------------- -----------                          ---------------
New-AzureService     fcf705f1-d902-011c-95c7-b690735e7412 Succeeded      
New-AzureVM          3b99a86d-84f8-04e5-888e-b6fc3c73c4b9 Succeeded  
```

## How to retrieve static private IP address information for a VM

To view the static private IP address information for the VM created with the previous script, run the following PowerShell command and observe the values for *IpAddress*:

```azurepowershell
$vm = @{
    Name = "DNS01"
    ServiceName = "TestService"
}
Get-AzureVM @vm
```

Expected output:

```output
DeploymentName              : TestService
Name                        : DNS01
Label                       : 
VM                          : Microsoft.WindowsAzure.Commands.ServiceManagement.Model.PersistentVM
InstanceStatus              : Provisioning
IpAddress                   : 192.168.1.7
InstanceStateDetails        : Windows is preparing your computer for first use...
PowerState                  : Started
InstanceErrorCode           : 
InstanceFaultDomain         : 0
InstanceName                : DNS01
InstanceUpgradeDomain       : 0
InstanceSize                : Small
HostName                    : rsR2-797
AvailabilitySetName         : 
DNSName                     : http://testservice000.cloudapp.net/
Status                      : Provisioning
GuestAgentStatus            : Microsoft.WindowsAzure.Commands.ServiceManagement.Model.GuestAgentStatus
ResourceExtensionStatusList : {Microsoft.Compute.BGInfo}
PublicIPAddress             : 
PublicIPName                : 
NetworkInterfaces           : {}
ServiceName                 : TestService
OperationDescription        : Get-AzureVM
OperationId                 : 34c1560a62f0901ab75cde4fed8e8bd1
OperationStatus             : OK
```

## How to remove a static private IP address from a VM

To remove the static private IP address added to the VM in the previous script, run the following PowerShell command:

```azurepowershell
$vm = @{
    Name = "DNS01"
    ServiceName = "TestService"
}
Get-AzureVM -ServiceName @vm | Remove-AzureStaticVNetIP | Update-AzureVM
```

Expected output:

```output
OperationDescription OperationId                          OperationStatus
-------------------- -----------                          ---------------
Update-AzureVM       052fa6f6-1483-0ede-a7bf-14f91f805483 Succeeded
```

## How to add a static private IP address to an existing VM

To add a static private IP address to the VM created using the previous script, run the following command:

```azurepowershell
$vm = {
    Name = "DNS01"
    ServiceName = "TestService"}

$ip = {
    IPAddress = "192.168.1.7"
}
Get-AzureVM @vm | Set-AzureStaticVNetIP @ip | Update-AzureVM
```

Expected output:

```output
OperationDescription OperationId                          OperationStatus
-------------------- -----------                          ---------------
Update-AzureVM       77d8cae2-87e6-0ead-9738-7c7dae9810cb Succeeded 
```

## Set IP addresses within the operating system

It’s recommended that you don't statically assign the private IP assigned to the Azure virtual machine within the operating system of a VM, unless necessary. If you do manually set the private IP address within the operating system, ensure that it's the same address as the private IP address assigned to the Azure VM. Failure to match the IP address could result in loss of connectivity to the virtual machine.

## Next steps

* Learn about [reserved public IP](/previous-versions/azure/virtual-network/virtual-networks-reserved-public-ip) addresses.

* Learn about [instance-level public IP (ILPIP)](/previous-versions/azure/virtual-network/virtual-networks-instance-level-public-ip) addresses.

* Consult the [Reserved IP REST APIs](/previous-versions/azure/reference/dn722420(v=azure.100)).
