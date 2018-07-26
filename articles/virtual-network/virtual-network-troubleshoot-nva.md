---
title: Troubleshooting Network Virtual Appliance issues in Azure | Microsoft Docs
description: Learn how to troubleshoot the Network Virtual Appliance issues in Azure.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: ''
tags: azure-resource-manager

ms.service: virtual-network
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/23/2018
ms.author: genli

---

# Troubleshooting Network Virtual appliance issues in Azure

You might receive errors when you use or connect to a network virtual appliance (NVA) in Azure. This article provides troubleshooting steps to help you resolve this problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting guidance 

- Configuration of new or existing NVA
- Check NVA Performance
- Known issues with 3rd party appliances
- Advanced Network Troubleshooting

## Configure a new or existing NVA

To configure, setup and troublesoot a third party NVA, you should first [contact the vendor of the virtual appliances](https://support.microsoft.com/help/2984655/support-for-azure-market-place-for-virtual-machines). The vendor will provide fully support for the product configuration on Azure.

### Check the minimum configuration requirements on Azure

All NVAs have basic minimum requirements to function properly on the Azure platform. The third-party vendor will have all requirements and assist in new configurations or troubleshooting existing configurations. For convenience, these minimum requirements are listed below as well as how to can validate the current configuration.
Validate IP forwarding on the NVA NICs:

**Check wehther IP forwarding is enabled on NVA**

Use Azure portal

1. Locate the NVA resource in the [Azure portal](https://portal.azure.com), select **Networking**, and then select the Network interface.
2. On the **Network interface** page, select **IP configuration**.
3. Make sure that the **IP forwarding** is enabled.

Use PowerShell

a.	Open PowerShell and login to your Azure account.
b.	Run the following command. You must replace the brackets with your information:

    Get-AzureRmNetworkInterface -ResourceGroupName <ResourceGroupName> -Name <NicName>  

c.	Check the **EnableIPForwarding** property.
 
d.	If IP forwarding is not enabled, run the following commands to enable it:

          $nic2 = Get-AzureRmNetworkInterface -ResourceGroupName <ResourceGroupName> -Name <NicName>
          $nic2.EnableIPForwarding = 1
          Set-AzureRmNetworkInterface -NetworkInterface $nic2
          Execute: $nic2 #and check for an expected output:
          EnableIPForwarding   : True
          NetworkSecurityGroup : null

**Validate virtual network routetables to NVA**

1. On Azure portal, open Network Watcher, select **Next Hop**.
2. Specify a target virtual machine and destination IP address to view the next hop. 
3. with the source being a VM in a subnet where you want the next hop to be the NVA/firewall. If the NVA is not listed as the ‘next hop’ View, Create or Update the routes so the next hop is your NVA.

Validate Network Security Groups (NSGs) to/from NVA
1.	Use Network Watcher’s 'IP Flow Verify' to check for NSGs that may be blocking traffic to/from NVA. If you find there is a NSG blocking traffic, locate the NSG in ‘effective security rules’ and update to allow traffic to pass.
2.	Run IP Flow Verify again and use 'Connectivity Check' to test TCP communications from VM to your internal/external IP address.

**Validate NVA and VMs are listening for expected traffic**

1.	RDP/SSH into the NVA and run command "netstat -an" (Windows) or "netstat -an | grep -i listen" (Linux). If you don't see the TCP port used for the connection listed in the results you will need to configure the application on the NVA/VM to listen and respond to traffic reaching those ports.

## Next steps

- [Azure Virtual Network](virtual-networks-overview.md)
- [Azure Virtual Network frequently asked questions (FAQ)](virtual-networks-faq.md)
