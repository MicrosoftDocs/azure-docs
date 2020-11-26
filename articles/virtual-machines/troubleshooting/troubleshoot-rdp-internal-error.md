---
title: Cannot RDP to an Azure VM due to brute force attack | Microsoft Docs
description: Learn how to troubleshoot RDP failure due to brute force attack in Microsoft Azure.| Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: ahmoulic
manager: ushaj
editor: ''

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/26/2020
ms.author: ahmoulic
---

#  Cannot RDP to an Azure VM due to brute force attack

Open-ports on Internet-facing virtual machines are targets for brute force attacks. This article describes general errors you may experience when your Azure VM is under attack and its resolution. 


## Symptoms

1. When you make an RDP connection to a Window VM in Azure, you may receive the following general error message

    - An internal error has occurred
    - Remote Desktop Services session has ended. Your network administrator might have ended the connection. Try connecting again, or contact technical support for assistance.
   
2. You are unable to RDP using the Public IP address and you may be able to RDP using the Private IP address. This will depend if you have a performance spike due to the attack. 

3. Events 4625 from logon is logged almost every second, with failure reason 'Bad Username Or Password'. 

![Images from event logs]
    



## Cause

The machine is under brute force attack and the VM needs to be made more secure. 


## Solution

> [!NOTE]
> RDP port 3389 is exposed to the Internet. Therefore, we recommend that you use this port only for recommended for testing. For production environments, we recommend that you use a VPN or private connection.

To mitigate the issue, reinforce security in your environment. This could be achieve in multiple ways:

 
 1.  Allow specific IP/ range of IP in Network Security Group (NSG) in inbound rule for RDP: 
 
 Check whether the network security group for RDP port 3389 is unsecured (open). If it's unsecured and it shows * as the source IP address for inbound, [restrict the RDP port to a specific user's IP address](https://docs.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview#security-rules), and then test RDP access.
	
2. If the IP's are dynamic for the end-users, you may introduce an intermediate server in your setup which can be used to login to the destination machine.
	
3. Change the default RDP port from 3389 to any port number which is less common, from Run Command. 

![insert image for run command]


4. Use [Just-In-Time access](https://docs.microsoft.com/en-us/azure/security-center/security-center-just-in-time?tabs=jit-config-asc%2Cjit-request-asc#enable-jit-vm-access-)


> [!TIP]
> Use [Azure Security Centre](https://azure.microsoft.com/en-us/services/security-center/) to assess the security state of all your cloud resources. Visualize your security state and improve your security posture by using [Azure Secure Score](https://docs.microsoft.com/en-us/azure/security-center/secure-score-security-controls) recommendations. 
