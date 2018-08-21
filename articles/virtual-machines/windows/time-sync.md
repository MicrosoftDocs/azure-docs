---
title: Time sync for Windows VMs in Azure| Microsoft Docs
description: Time sync for Windows virtual machines.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 08/21/2018
ms.author: cynthn
---

# Time sync for Windows VMs in Azure

There are two services responsible for time synchronization: **w32time** and **vmictimesync**. By default, w32time uses and NtpClient provider configured to get time from time.windows.com and VMICTimeSync that is getting time from the host via vmictimesync service.
 
w32time would prefer the time provider in the following order of priority: stratum level, root delay, root dispersion, time offset. Practically though in majority of the cases it would prefer time.windows.com to the host. That happens because time.windows.com reports lower stratum. But time.windows.com is public a NTP server and reaching to it requires sending traffic over the internet. That results in varying packet delays and that by itself can negatively affect quality of the time sync. 
 
For customers that need stable and precise time sync it is best to switch to time sync from the host only. This way the whole time server hierarchy resides in the collocated MS-owned datacenter infrastructure where delays are predictable and small. This also allows us to improve time sync on VMs by improving time sync on the hosts. 
 
Such time sync, however, requires VM to run on the latest Windows OS. You would need to use WS2016 or Windows 10 or more recent OS that have the needed software components. Plus this way VM has only one channel to get the time instead of two. For resiliency reasons customers need to ensure that they have redundant VM to handle possible failures in the time sync mechanism. We try our best to harden the time sync from the host, but common engineering sense advises to be redundant.
 
Note that if you have domain on your VMs, the domain itself would enforce time sync hierarchy on your VMs. But the forest root still needs to take time from somewhere and that could be the host time. It is possible to bypass domain time sync hierarchy and sync all VMs from their hosts. Ultimately all hosts are synced to UTC and such setup removes extra stratum layers. But this way domain admins loose some of the control over the domain time.
 
Scripts below show how you can test what time sync setup is being currently used and how you can switch to host-only time sync. The scripts are intentionally simple to provide the big-picture perspective. If you are to use some automated way to apply any of these scripts, you'll need to add error processing. Also note that some of the provided commands would require administrator permissions to work. For more details what each setting and command does, see these links:
 
https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/Windows-Time-Service-Tools-and-Settings
https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/windows-server-2016-improvements
https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time
https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/support-boundary
 
Get your current time sync settings
 
If you want to test if your Windows VM is using the default time sync setup, run the following commands.
echo If VMICTimeProvider time provider (sync from host) is enabled you would get 1 in the output
w32tm /dumpreg /subkey:TimeProviders\VMICTimeProvider | findstr /i "enabled"
echo See if NtpClient time provider is configured to use NTP servers (NTP) or domain time sync (NT5DS)
echo In case of domain time sync the domain time servers are used instead of NtpServer parameter
w32tm /dumpreg /subkey:Parameters | findstr /i "type"
 
echo See if NtpClient time provider (sync from external time server) is enabled and what server does it use
w32tm /dumpreg /subkey:TimeProviders\NtpClient | findstr /i "enabled"
w32tm /dumpreg /subkey:Parameters | findstr /i "ntpserver"
 
To see what exactly time provider is being used at this moment run this command sometime after OS boot.
 
echo Test w32time current time source
w32tm /query /source
Here is the output you can get and what does it mean.
 
- time.windows.com - w32time by default would get time from time.windows.com, time sync quality depends on internet connectivity to it and is affected by packet delays. This is the usual output from the default setup.
- VM IC Time Synchronization Provider. Your VM is syncing time from the host. This usually is outputted when you would opt in for host-only time sync. Also it is possible that NtpServer is not available at the moment or responds with a worse stratum layer. So it's best to check registry config as well for disambiguation.
- Your domain server - the current machine is in domain and the domain defined the time sync hierarchy.
- Another server - w32time was explicitly configured to get the time from that server. Time sync quality depends on this time server quality.
- Local CMOS Clock - clock is unsynchronized. You can get this output if w32time service didn't get enough time after OS boot to actually start.  Or when all the configured time sources are not available.
 
## Opt-in for host-only time sync
 
We are constantly working on improving time sync on hosts and can guarantee that all the time sync infrastructure is collocated in Microsoft-owned datacenters. If you have time sync issues with the default setup that prefers to use time.windows.com as the primary time source, you can use the following commands to opt-in to host-only time sync.
 

Mark the VMIC provider as enabled.

```
reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\TimeProviders\VMICTimeProvider /v Enabled /t REG_DWORD /d 1 /f 
```

Mark the NTPClient provider as disabled.

```
reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\TimeProviders\NtpClient /v Enabled /t REG_DWORD /d 0 /f
```

Restart the w32time service.

```
net stop w32time && net start w32time
```
 
Internally we optimize the used time sync hierarchy, tweak NTP settings and extensively monitor the time sync on the hosts. Also we provide time sync evidence data for auditors. But in case you are syncing time from the host and detected a problem you can report it via the Azure feedback tool available on the Azure portal.

