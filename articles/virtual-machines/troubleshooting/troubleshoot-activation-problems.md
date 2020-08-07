---
title: Troubleshoot Windows virtual machine activation problems in Azure| Microsoft Docs
description: Provides the troubleshoot steps for fixing Windows virtual machine activation problems in Azure
services: virtual-machines-windows, azure-resource-manager
documentationcenter: ''
author: genlin
manager: dcscontentpm
editor: ''
tags: top-support-issue, azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows

ms.topic: troubleshooting
ms.date: 11/15/2018
ms.author: genli
---
# Troubleshoot Azure Windows virtual machine activation problems

If you have trouble when activating Azure Windows virtual machine (VM) that is created from a custom image, you can use the information provided in this document to troubleshoot the issue. 

## Understanding Azure KMS endpoints for Windows product activation of Azure Virtual Machines

Azure uses different endpoints for KMS (Key Management Services) activation depending on the cloud region where the VM resides. When using this troubleshooting guide, use the appropriate KMS endpoint that applies to your region.

* Azure public cloud regions: kms.core.windows.net:1688
* Azure China 21Vianet national cloud regions: kms.core.chinacloudapi.cn:1688
* Azure Germany national cloud regions: kms.core.cloudapi.de:1688
* Azure US Gov national cloud regions: kms.core.usgovcloudapi.net:1688

## Symptom

When you try to activate an Azure Windows VM, you receive an error message resembles the following sample:

**Error: 0xC004F074 The Software LicensingService reported that the computer could not be activated. No Key ManagementService (KMS) could be contacted. Please see the Application Event Log for additional information.**

## Cause

Generally, Azure VM activation issues occur if the Windows VM is not configured by using the appropriate KMS client setup key, or the Windows VM has a connectivity problem to the Azure KMS service (kms.core.windows.net, port 1688). 

## Solution

>[!NOTE]
>If you are using a site-to-site VPN and forced tunneling, see [Use Azure custom routes to enable KMS activation with forced tunneling](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-forced-tunneling). 
>
>If you are using ExpressRoute and you have a default route published, see [Can I block Internet connectivity to virtual networks connected to ExpressRoute circuits?](https://docs.microsoft.com/azure/expressroute/expressroute-faqs).

### Step 1 Configure the appropriate KMS client setup key

For the VM that is created from a custom image, you must configure the appropriate KMS client setup key for the VM.

1. Run **slmgr.vbs /dlv** at an elevated command prompt. Check the Description value in the output, and then determine whether it was created from retail (RETAIL channel) or volume (VOLUME_KMSCLIENT) license media:
  

    ```
    cscript c:\windows\system32\slmgr.vbs /dlv
    ```

2. If **slmgr.vbs /dlv** shows RETAIL channel, run the following commands to set the [KMS client setup key](https://technet.microsoft.com/library/jj612867%28v=ws.11%29.aspx?f=255&MSPPError=-2147217396) for the version of Windows Server being used, and force it to retry activation: 

    ```
    cscript c:\windows\system32\slmgr.vbs /ipk <KMS client setup key>

    cscript c:\windows\system32\slmgr.vbs /ato
     ```

    For example, for Windows Server 2016 Datacenter, you would run the following command:

    ```
    cscript c:\windows\system32\slmgr.vbs /ipk CB7KF-BWN84-R7R2Y-793K2-8XDDG
    ```

### Step 2 Verify the connectivity between the VM and Azure KMS service

1. Download and extract the [PSping](https://docs.microsoft.com/sysinternals/downloads/psping) tool to a local folder in the VM that does not activate. 

2. Go to Start, search on Windows PowerShell, right-click Windows PowerShell, and then select Run as administrator.

3. Make sure that the VM is configured to use the correct Azure KMS server. To do this, run the following command:
  
    ```powershell
    Invoke-Expression "$env:windir\system32\cscript.exe $env:windir\system32\slmgr.vbs /skms kms.core.windows.net:1688"
    ```

    The command should return: Key Management Service machine name set to kms.core.windows.net:1688 successfully.

4. Verify by using Psping that you have connectivity to the KMS server. Switch to the folder where you extracted the Pstools.zip download, and then run the following:
  
    ```
    .\psping.exe kms.core.windows.net:1688
    ```
   In the second-to-last line of the output, make sure that you see: Sent = 4, Received = 4, Lost = 0 (0% loss).

   If Lost is greater than 0 (zero), the VM does not have connectivity to the KMS server. In this situation, if the VM is in a virtual network and has a custom DNS server specified, you must make sure that DNS server is able to resolve kms.core.windows.net. Or, change the DNS server to one that does resolve kms.core.windows.net.

   Notice that if you remove all DNS servers from a virtual network, VMs use Azure's internal DNS service. This service can resolve kms.core.windows.net.
  
    Also make sure that the outbound network traffic to KMS endpoint with 1688 port is not blocked by the firewall in the VM.

5. Verify using [Network Watcher Next Hop](https://docs.microsoft.com/azure/network-watcher/network-watcher-next-hop-overview) that the next hop type from the VM in question to the destination IP 23.102.135.246 (for kms.core.windows.net) or the IP of the appropriate KMS endpoint that applies to your region is **Internet**.  If the result is VirtualAppliance or VirtualNetworkGateway, it is likely that a default route exists.  Contact your network administrator and work with them to determine the correct course of action.  This may be a [custom route](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/custom-routes-enable-kms-activation) if that solution is consistent with your organization's policies.

6. After you verify successful connectivity to kms.core.windows.net, run the following command at that elevated Windows PowerShell prompt. This command tries activation multiple times.

    ```powershell
    1..12 | ForEach-Object { Invoke-Expression "$env:windir\system32\cscript.exe $env:windir\system32\slmgr.vbs /ato" ; start-sleep 5 }
    ```

    A successful activation returns information that resembles the following:
    
    **Activating Windows(R), ServerDatacenter edition (12345678-1234-1234-1234-12345678) …
    Product activated successfully.**

## FAQ 

### I created the Windows Server 2016 from Azure Marketplace. Do I need to configure KMS key for activating the Windows Server 2016? 

 
No. The image in Azure Marketplace has the appropriate KMS client setup key already configured. 

### Does Windows activation work the same way regardless if the VM is using Azure Hybrid Use Benefit (HUB) or not? 

 
Yes. 
 

### What happens if Windows activation period expires? 

 
When the grace period has expired and Windows is still not activated, Windows Server 2008 R2 and later versions of Windows will show additional notifications about activating. The desktop wallpaper remains black, and Windows Update will install security and critical updates only, but not optional updates. See  the Notifications section at the bottom of the [Licensing Conditions](https://technet.microsoft.com/library/ff793403.aspx) page.   

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
