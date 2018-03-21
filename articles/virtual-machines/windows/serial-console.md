---
title: Azure virtual machine Serial Console | Microsoft Docs
description: Bi-Directional Serial Console for Azure virtual machines.
services: virtual-machines-windows
documentationcenter: ''
author: harijay
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/05/2018
ms.author: harijay
---

# Azure's virtual machine Serial Console (preview) 


The virtual machine Serial Console on Azure provides access to a text-based console for Linux and Windows virtual machines. This serial connection is to COM1 serial port of the virtual machine and provides access to the virtual machine and are not related to virtual machine's network / operating system state. Access to the Serial Console for a virtual machine can be done only via Azure portal currently and allowed only for those users who have VM Contributor or above access to the virtual machine. 

> [!Note] 
> Previews are made available to you on the condition that you agree to the terms of use. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews.] (https://azure.microsoft.com/support/legal/preview-supplemental-terms/)
>Currently this service is in **public preview** and access to the Serial Console for virtual machines is available to global Azure regions. At this point Serial Console is not available Azure Government, Azure Germany, and Azure China cloud.

 

## Prerequisites 

* Virtual machine  MUST have [boot diagnostics](boot-diagnostics.md) enabled 
* The account using the Serial Console must have [Contributor role](../../active-directory/role-based-access-built-in-roles.md) for VM and the [boot diagnostics](boot-diagnostics.md) storage account. 

## Open the Serial Console
Serial Console for virtual machines is only accessible via [Azure portal](https://portal.azure.com). Below are the steps to access the Serial Console for virtual machines via portal 

  1. Open the Azure portal
  2. In the left menu, select virtual machines.
  3. Click on the VM in the list. The overview page for the VM will open.
  4. Scroll down to the Support + Troubleshooting section and click on the Serial Console (Preview) option. A new pane with the Serial Console will open and start the connection.

![](../media/virtual-machines-serial-console/virtual-machine-windows-serial-console-connect.gif)

### Disable feature
The Serial Console functionality can be deactivated for specific VMs by disabling that VM's boot diagnostics setting.

## Serial Console Security 

### Access Security 
Access to Serial console is limited to users who have [VM Contributors](../../active-directory/role-based-access-built-in-roles.md#virtual-machine-contributor) or above access to the virtual machine. If your AAD tenant requires Multi-Factor Authentication then access to the Serial Console will also need MFA as its access is via [Azure portal](https://portal.azure.com).

### Channel Security
All data is sent back and forth is encrypted on the wire.

### Audit logs
All access to the Serial Console is currently logged in the [boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/linux/boot-diagnostics) logs of the virtual machine. Access to these logs are owned and controlled by the Azure virtual machine administrator.  

>[!CAUTION] 
While no access passwords for the console are logged, if commands run within the console contain or output passwords, secrets, user names or any other form of Personally Identifiable Information (PII), those will be written to the virtual machine boot diagnostics logs, along with all other visible text, as part of the implementation of the Serial Console's scrollback functionality. These logs are circular and only individuals with read permissions to the diagnostics storage account have access to them, however we recommend following the best practice of using the Remote Desktop for anything that may involve secrets and/or PII. 

### Concurrent usage
If a user is connected to Serial Console and another user successfully requests access to that same virtual machine, the first user will be disconnected and the second user connected in a manner akin to the first user standing up and leaving the physical console and a new user sitting down.

>[!CAUTION] 
This means that the user who gets disconnected will not be logged out! The ability to enforce a logout upon disconnect (via SIGHUP or similar mechanism) is still in the roadmap. For Windows there is an automatic timeout enabled in SAC, however for Linux you can configure terminal timeout setting. 


## Accessing Serial Console for Windows 
Newer Windows Server images on Azure will have [Special Administrative Console](https://technet.microsoft.com/library/cc787940(v=ws.10).aspx) (SAC) enabled by default. SAC is supported on server versions of Windows but is not available on client versions (e.g. Windows 10, Windows 8 or Windows 7). 
To enable Serial console for Windows virtual machines created with using Feb2018 or lower images please the following steps: 

1. Connect to your Windows virtual machine via Remote Desktop
2. From an Administrative command prompt run the following commands 
* `bcdedit /ems {current} on`
* `bcdedit /emssettings EMSPORT:1 EMSBAUDRATE:115200`
3. Reboot the system for the SAC console to be enabled

![](..media/virtual-machines-serial-console/virtual-machine-windows-serial-console-connect.gif)

If needed SAC can be enabled offline as well, 

1. Attach the windows disk you want SAC configured for as a data disk to existing VM. 
2. From an Administrative command prompt run the following commands 
* `bcdedit /store <mountedvolume>\boot\bcd /ems {default} on`
* `bcdedit /store <mountedvolume>\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200`

### How do I know if SAC is enabled or not 

If [SAC] (https://technet.microsoft.com/library/cc787940(v=ws.10).aspx) is not enabled the Serial Console will not show the SAC prompt. It can show a VM Health information in some cases or it would be blank.  

### Enabling boot menu to show in the Serial Console 

If you need to enable Windows boot loader prompts to show in the Serial Console you can add the following additional options to Windows boot loader.

1. Connect to your Windows virtual machine via Remote Desktop
2. From an Administrative command prompt run the following commands 
* `bcdedit /set {bootmgr} displaybootmenu yes`
* `bcdedit /set {bootmgr} timeout 5`
* `bcdedit /set {bootmgr} bootems yes`
3. Reboot the system for the boot menu to be enabled

> [!NOTE] 
> At this point support for function keys is not enabled, if you require advanced boot options use bcdedit /set {current} onetimeadvancedoptions on, see [bcdedit](https://docs.microsoft.com/windows-hardware/drivers/devtest/bcdedit--set) for more details

## Common Scenarios for accessing Windows Serial Console 
Scenario          | Actions in the Serial Console                
:------------------|:----------------------------------------
Incorrect firewall rules | Access the Serial Console and fix iptables or Windows firewall rules 
Filesystem corruption/check | Access the Serial Console and recover filesystem after logging in to SAC CMD
RDP configuration issues | Access the Serial Console and log in to cmd channel. Check health of the Terminal services and restart if needed.
Network lock down system| Access Serial Console and log in to cmd channel. Check the firewall status by [netsh](https://docs.microsoft.com/windows-server/networking/technologies/netsh/netsh-contexts) command line. 

## Errors
Most errors are transient in nature and retrying connection address these. Below table shows a list of errors and mitigation 

Error                            |   Mitigation 
:---------------------------------|:--------------------------------------------|
Unable to retrieve boot diagnostics settings for '<VMNAME>'. To use the Serial Console, ensure that boot diagnostics is enabled for this VM. | Ensure that the VM has [boot diagnostics](boot-diagnostics.md) enabled. 
The VM is in a stopped deallocated state. Start the VM and retry the Serial Console connection. | Virtual machine must be in a started state to access the Serial Console
You do not have the required permissions to use this VM Serial Console. Ensure you have at least VM Contributor role permissions.| Serial console access requires certain permission to access. See [access requirements](#prerequisites) for details
Unable to determine the resource group for the boot diagnostics storage account '<STORAGEACCOUNTNAME>'. Verify that boot diagnostics is enabled for this VM and you have access to this storage account. | Serial console access requires certain permission to access. See [access requirements](#prerequisites) for details

## Known Issues 
As we are still in the preview stages for Serial Console access, we are working through some known issues, below is the list of these with possible workarounds 

Issue                           |   Mitigation 
:---------------------------------|:--------------------------------------------|
There is no option with virtual machine scale set instance Serial Console | At the time of preview, access to the Serial Console for virtual machine scale set instances is not supported.
Hitting enter after the connection banner does not show a log in prompt | [Hitting enter does nothing](https://github.com/Microsoft/azserialconsole/blob/master/Known_Issues/Hitting_enter_does_nothing.md)
Only health information is shown when connecting to a Windows VM| [Windows Health Signals](https://github.com/Microsoft/azserialconsole/blob/master/Known_Issues/Windows_Health_Info.md)

## Frequently asked questions 
**Q. How can I send feedback?**
A. Provide feedback as an issue by going to https://aka.ms/serialconsolefeedback. Alternatively (less preferred) Send feedback via azserialhelp@microsoft.com or in the virtual machine category of http://feedback.azure.com 
**Q. I get an Error "Existing console has conflicting OS type "Windows" with the requested OS type of Linux?**
This is a known issue to fix this, simply open [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) in bash mode and retry.
**Q. I am not able to access the Serial Console, where can I file a support case?**
This preview feature is covered via Azure Preview Terms. Support for this is best handled via channels mentioned above. 

## Next Steps
* The Serial Console is also available for [Linux](../linux/serial-console.md) VMs
* Learn more about [bootdiagnostics](boot-diagnostics.md)
