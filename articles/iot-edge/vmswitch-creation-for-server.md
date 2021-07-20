---
title: Create vmSwitch on Windows Server | Microsoft Docs
description: Installations for creating a vmSwitch on Windows Server SKUs
author: kgremban
manager: philmea
ms.reviewer: fcabrera
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 07/12/2021
ms.author: kgremban
monikerRange: "=iotedge-2018-06"
---

# Azure IoT Edge for Linux on Windows vSwitch creation for Windows Server SKUs 
Azure IoT Edge for Linux on Windows uses a virtual switch on the host machine to communicate with the virtual machine. Windows desktop versions come with a default switch that can be used, but Windows Server does not. Before you can deploy IoT Edge for Linux on Windows to a Windows Server device, you need to create a virtual switch.

This article shows you how to create a vmSwitch on a Windows Server device to install IoT Edge for Linux on Windows with the following steps:
- Create a vmSwitch
- Create a NAT table
- Install and set up a DHCP server

# Prerequisites
- A Windows Server device. For supported Windows versions, see [Operating Systems](support.md#operating-systems) 
- Hyper-V role installed on the Windows Server device. For more information on how to enable Hyper-V, see [install the Hyper-V role](/windows-server/virtualization/hyper-v/get-started/install-the-hyper-v-role-on-windows-server)

# Create vmSwitch 
The following steps in this section are a generic guide for a vmSwitch creation. Ensure that the virtual switch configuration aligns with your networking environment.

1. Open PowerShell in an elevated session.

2. Check that the Windows host has NO vmSwitch with the name “Default Switch”. Check [Get-VMSwitch (Hyper-V)](https://docs.microsoft.com/powershell/module/hyper-v/get-vmswitch?view=windowsserver2019-ps) for full details. 
 ```powershell
Get-VMSwitch -Name "Default Switch" -SwitchType Internal
```
If a vmSwitch named “Default Switch” is already created, try to use it for EFLOW installation and do no follow this guide.

3. Create a new VM switch with a name and type (Internal | External). Check [New-VMSwitch (Hyper-V)](https://docs.microsoft.com/powershell/module/hyper-v/new-vmswitch?view=windowsserver2019-ps) and [Create a virtual switch for Hyper-V virtual machines](https://docs.microsoft.com/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines) for full details and further instructions.
 ```powershell
New-VMSwitch -Name {switchName} Switch" -SwitchType {switchType}
```

4. Get the interface index of the created switch. [Check Get-NetAdapter (NetAdapter)](https://docs.microsoft.com/powershell/module/netadapter/get-netadapter?view=windowsserver2019-ps) for full details. 
 ```powershell
(Get-NetAdapter -Name '*{switchName}*').ifIndex
```

5. Using the interface index from previous step, get the IP address octet of the created switch network adapter. Check [Get-NetIPAddress (NetTCPIP)](https://docs.microsoft.com/powershell/module/nettcpip/get-netipaddress?view=windowsserver2019-ps) for full details. 
 ```powershell
Get-NetIPAddress -AddressFamily IPv4  -InterfaceIndex {ifIndex}
```

6. Using the IP address family and interface index from previous steps, create and set the new gateway IP address.  (E.g If the IPv4 address of the virtual network switch adapter from Step 5 is xxx.xxx.xxx.yyy, you can set the gatewayIp as following xxx.xxx.xxx.1). Check [New-NetIPAddress (NetTCPIP)](https://docs.microsoft.com/powershell/module/nettcpip/new-netipaddress?view=windowsserver2019-ps) for full details.
 ```powershell
New-NetIPAddress -IPAddress {gatewayIp} -PrefixLength 24 -InterfaceIndex {ifIndex}
```

7. Create a Network Address Translation (NAT) object that translates an internal network address to an external network. Ensure to use the same IPv4 family address from previous steps. (E.g If the IPv4 address of the virtual network switch adapter from Step 5 is xxx.xxx.xxx.yyy, you can set the natIp as following xxx.xxx.xxx.0). Check [New-NetNat (NetNat)](https://docs.microsoft.com/powershell/module/netnat/new-netnat?view=windowsserver2019-ps) for full details. 
 ```powershell
New-NetNat -Name "{switchName}" -InternalIPInterfaceAddressPrefix "{natIp}/24"
```

# Create DHCP Server 

>[!WARNING]
>Authorization might be required to deploy a DHCP server in a corporate network environment. Ensure to check if the virtual switch configuration complies with your corporate network's policies. For further information, ensure to check the  [Deploy DHCP Using Windows PowerShell](https://docs.microsoft.com/windows-server/networking/technologies/dhcp/dhcp-deploy-wps) guide. 

8.	Check if the DHCP Server feature is installed in the device. Look for the **Install State** column.
 ```powershell
Get-WindowsFeature -Name 'DHCP'
```

9.	If not installed, install it by using the following command:
 ```powershell
Install-WindowsFeature -Name 'DHCP' -IncludeManagementTools
```

10.	Add the DHCP Server to the default local security groups and restart the server.
 ```powershell
netsh dhcp add securitygroups
Restart-Service dhcpserver
```

11.	Configure the DHCP Server scope. Check [Add-DhcpServerv4Scope (DhcpServer)](https://docs.microsoft.com/powershell/module/dhcpserver/add-dhcpserverv4scope?view=windowsserver2019-ps) for full details.  The DHCP server range of IPs is determined by the “startIp” and the “endIp”. For example,  if 100 addresses want to be available, following the xxx.xxx.xxx.yyy IPv4 address of the virtual network switch adapter from Step 5, startIp = xxx.xxx.xxx.100, endIp = xxx.xxx.xxx.200 and subnetMask = 255.255.255.0
 ```powershell
Add-DhcpServerV4Scope -Name "AzureIoTEdgeScope" -StartRange {startIp} -EndRange {endIp} -SubnetMask {subnetMask} -State Active
```

12.	 Finally, assign the NAT object and gatewayIp to the DHCP server, and restart the server for loading the configuration
 ```powershell
 Set-DhcpServerV4OptionValue -ScopeID {natIp} -Router {gatewayIp}
Restart-service dhcpserver
```
