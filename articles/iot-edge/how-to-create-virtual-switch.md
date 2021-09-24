---
title: Create virtual switch for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Installations for creating a virtual switch for Azure IoT Edge for Linux on Windows
author: kgremban

ms.reviewer: fcabrera
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 07/12/2021
ms.author: kgremban
monikerRange: "=iotedge-2018-06"
---

# Azure IoT Edge for Linux on Windows virtual switch creation
Azure IoT Edge for Linux on Windows uses a virtual switch on the host machine to communicate with the virtual machine. Windows desktop versions come with a default switch that can be used, but Windows Server does not. Before you can deploy IoT Edge for Linux on Windows to a Windows Server device, you need to create a virtual switch. Furthermore, you can use this guide to create your custom virtual switch, if needed. 

This article shows you how to create a virtual switch on a Windows device to install IoT Edge for Linux on Windows with the following steps:
- Create a virtual switch
- Create a NAT table
- Install and set up a DHCP server

## Prerequisites
- A Windows device. For supported Windows versions, see [Operating Systems](support.md#operating-systems).
- Hyper-V role installed on the Windows device. For more information on how to enable Hyper-V, see [Install and provision Azure IoT Edge for Linux on a Windows device](./how-to-install-iot-edge-on-windows.md?tabs=powershell#prerequisites).

## Create virtual switch 
The following steps in this section are a generic guide for a virtual switch creation. Ensure that the virtual switch configuration aligns with your networking environment.

1. Open PowerShell in an elevated session.

2. Check the virtual switches on the Windows host, and make sure you don't have a virtual switch that can be used. Check [Get-VMSwitch (Hyper-V)](/powershell/module/hyper-v/get-vmswitch) for full details. 

   ```powershell
   Get-VMSwitch
   ```

   If a virtual switch named **Default Switch** is already created and you don't need a custom virtual switch, you should be able to install IoT Edge for Linux on Windows without following the rest of the steps in this guide.

3. Create a new VM switch with a name and type **Internal** or **Private**. To create an **External** virtual switch, specify either the **NetAdapterInterfaceDescription** or the **NetAdapterName** parameter, which implicitly set the type of the virtual switch to **External**. Check [New-VMSwitch (Hyper-V)](/powershell/module/hyper-v/new-vmswitch) and [Create a virtual switch for Hyper-V virtual machines](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines) for full details and further instructions.
   ```powershell
   New-VMSwitch -Name "{switchName}" -SwitchType {switchType}
   ```

4. Get the interface index of the created switch. Check [Get-NetAdapter (NetAdapter)](/powershell/module/netadapter/get-netadapter) for full details. 
   ```powershell
   (Get-NetAdapter -Name '*{switchName}*').ifIndex
   ```

5. Using the interface index from previous step, get the IP address octet of the created switch network adapter. Check [Get-NetIPAddress (NetTCPIP)](/powershell/module/nettcpip/get-netipaddress) for full details. 
   ```powershell
   Get-NetIPAddress -AddressFamily IPv4  -InterfaceIndex {ifIndex}
   ```

6. Using the IP address family and interface index from previous steps, create and set the new gateway IP address.  For example, If the IPv4 address of the virtual network switch adapter is xxx.xxx.xxx.yyy, you can set the gatewayIp as following xxx.xxx.xxx.1. Check [New-NetIPAddress (NetTCPIP)](/powershell/module/nettcpip/new-netipaddress) for full details.
   ```powershell
   New-NetIPAddress -IPAddress {gatewayIp} -PrefixLength 24 -InterfaceIndex {ifIndex}
   ```

7. Create a Network Address Translation (NAT) object that translates an internal network address to an external network. Use the same IPv4 family address from previous steps. For example, if the IPv4 address of the virtual network switch adapter is xxx.xxx.xxx.yyy, you can set the natIp as following xxx.xxx.xxx.0. Check [New-NetNat (NetNat)](/powershell/module/netnat/new-netnat) for full details. 
   ```powershell
   New-NetNat -Name "{switchName}" -InternalIPInterfaceAddressPrefix "{natIp}/24"
   ```

## Create DHCP Server 

>[!WARNING]
>Authorization might be required to deploy a DHCP server in a corporate network environment. Check if the virtual switch configuration complies with your corporate network's policies. For further information, check the  [Deploy DHCP Using Windows PowerShell](/windows-server/networking/technologies/dhcp/dhcp-deploy-wps) guide. 

1. Check if the DHCP Server feature is installed in the device. Look for the **Install State** column.
   ```powershell
   Get-WindowsFeature -Name 'DHCP'
   ```

2. If not installed, install it by using the following command.
   ```powershell
   Install-WindowsFeature -Name 'DHCP' -IncludeManagementTools
   ```

3. Add the DHCP Server to the default local security groups and restart the server.
   ```powershell
   netsh dhcp add securitygroups
   Restart-Service dhcpserver
   ```

4. Configure the DHCP Server scope. Check [Add-DhcpServerv4Scope (DhcpServer)](/powershell/module/dhcpserver/add-dhcpserverv4scope) for full details.  The DHCP server range of IPs is determined by the **startIp** and the **endIp**. For example,  if 100 addresses want to be available, following the xxx.xxx.xxx.yyy IPv4 address of the virtual network switch adapter from Step 5, startIp = xxx.xxx.xxx.100, endIp = xxx.xxx.xxx.200 and subnetMask = 255.255.255.0.
   ```powershell
   Add-DhcpServerV4Scope -Name "AzureIoTEdgeScope" -StartRange {startIp} -EndRange {endIp} -SubnetMask {subnetMask} -State Active
   ```

5. Finally, assign the NAT object and gatewayIp to the DHCP server, and restart the server to load the configuration.
   ```powershell
   Set-DhcpServerV4OptionValue -ScopeID {natIp} -Router {gatewayIp}
   Restart-service dhcpserver
   ```

## Next steps
Follow the steps in [Install and provision Azure IoT Edge for Linux on a Windows device](how-to-install-iot-edge-on-windows.md) to set up a device with IoT Edge for Linux on Windows.