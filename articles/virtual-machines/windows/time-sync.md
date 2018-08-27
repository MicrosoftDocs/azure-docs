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
ms.date: 08/27/2018
ms.author: cynthn
---

# Time sync for Windows VMs in Azure

Azure is now backed by infrastructure running Windows Server 2016. Windows Server 2016 has improved algorithms used to correct time and condition the local clock to synchronize with UTC.  Windows Server 2016 also improved the VMICTimeSync service that governs how VMs sync with the host for accurate time. Improvements include more accurate initial time on VM start or VM restore and interrupt latency correction for samples provided to Windows Time (W32time). 

>[!NOTE]
>For a quick overview of Windows Time service, take a look at this [high-level overview video](https://aka.ms/WS2016TimeVideo).
>
> For more details about time sync in Windows Server 2016, see [Accurate time for Windows Server 2016](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time). 

## Configuration options

There are three options for configuring time sync for your Windows VMs hosted in Azure:

- Host time and time.windows.com. This is the default configuration used in Azure Marketplace images.
- Host-only 
- Use another, external time server.


### Use the default

By default Windows OS VM images are configured for w32time to sync from two sources: 

- The NtpClient provider, which gets information from time.windows.com 
- The VMICTimeSync service and VMICTimeProvider, gets time from the host. 

VMICTimeProvider combined with running VMICTimeSync ensures that host and guest times are within a 5 second boundary and that time is corrected when VM is resumed after a pause. 

w32time would prefer the time provider in the following order of priority: stratum level, root delay, root dispersion, time offset. In most cases, w32time would prefer time.windows.com to the host because time.windows.com reports lower stratum. 

For domain joined machines the domain itself establishes time sync hierarchy, but the forest root still need to take time from somewhere and the following considerations would still hold true.


### Host-only 

Because time.windows.com is public a NTP server that requires sending traffic over the internet, varying packet delays can negatively affect quality of the time sync. Removing time.windows.com by switching to host-only sync can sometimes improve your time sync results.

Switching to host-only time sync makes sense if you experience time sync issues using the default configuration. Try out the host-only sync to see if that would improve the time sync on VM. 

### External time server

If you have specific time sync requirements, there is also an option of using external time servers. Such time servers can provide specific time, for example for test scenarios or for time uniformity with machines hosted in not-MS datacenters or if you need to handle leap seconds in a special way.

You can use an external time server as the NtpClient alone, or combine it with the VMICTimeSync service and VMICTimeProvider to provide results similar to the default configuration. 

## Check your configuration

Scripts below show how you can test what time sync setup is being currently used and how you can switch to host-only time sync. The scripts are intentionally simple to provide the big-picture perspective. If you are to use some automated way to apply any of these scripts, you'll need to add error processing. Also note that some of the provided commands would require administrator permissions to work. For more details what each setting and command does, see these links:

- [Windows Time Service Tools and Settings](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/Windows-Time-Service-Tools-and-Settings)
- [Windows Server 2016 Improvements
](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/windows-server-2016-improvements)
- [Accurate Time for Windows Server 2016](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time)
- [Support boundary to configure the Windows Time service for high-accuracy environments](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/support-boundary)



If you want to test if your Windows VM is using the default time sync setup, run the following commands.

Check to see if VMICTimeProvider time provider (sync from host) is enabled. 

```
w32tm /dumpreg /subkey:TimeProviders\VMICTimeProvider | findstr /i "enabled"
```
If VMICTimeProvider time provider (sync from host) is enabled you would get the following output:

Enabled           REG_DWORD           1


To see if the NtpClient time provider is configured to use NTP servers (NTP) or domain time sync (NT5DS).

```
w32tm /dumpreg /subkey:Parameters | findstr /i "type"
```

If the VM is using NTP, you will see the following output:

Value Name                 Value Type          Value Data
Type                       REG_SZ              NTP


See what server the NtpClient time provider is using.

```
w32tm /dumpreg /subkey:Parameters | findstr /i "ntpserver"
```

If the VM is using the default, the output will look like this:

NtpServer                  REG_SZ              time.windows.com,0x8



To see what exactly time provider is being used currently.

```
w32tm /query /source
```

In the default configuration, the output would be something like this:

Here is the output you could see and what it would mean:
	
- **time.windows.com** - in the default configuration, w32time would get time from time.windows.com. The time sync quality depends on internet connectivity to it and is affected by packet delays. This is the usual output from the default setup.
- **VM IC Time Synchronization Provider**  - the VM is syncing time from the host. This usually is the result if you opt-in for host-only time sync or the NtpServer is not available at the moment. 
- *<your domain server>* - the current machine is in a domain and the domain defines the time sync hierarchy.
- *<some other server>* - w32time was explicitly configured to get the time from that another server. Time sync quality depends on this time server quality.
- Local CMOS Clock - clock is unsynchronized. You can get this output if w32time hasn't had enough time to start after a reboot or when all the configured time sources are not available.


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

Restart the w32time Service.

```
net stop w32time && net start w32time
```

## Windows Server 2012 and R2 VMs 

Windows Server 2012 and Windows Server 2012 R2 have different default settings for time sync. The w32time by default is configured in a way that prefers low overhead of the service over to precise time. 

If you want to move your Windows Server 2012 and 2012 R2 deployments to use the newer defaults that prefer precise time, you can apply the following settings.

Update the w32time poll and update intervals to match Windows Server 2016 settings.

```
reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Config /v MinPollInterval /t REG_DWORD /d 6 /f
reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Config /v MaxPollInterval /t REG_DWORD /d 10 /f
reg add HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Config /v UpdateInterval /t REG_DWORD /d 100 /f
w32tm /config /update
```

For w32time to be able to use the new poll intervals, the  NtpServers need to use them. If servers are annotated with 0x1 bitflag mask, that would override this mechanism and w32time would use SpecialPollInterval instead. Make sure that specified NTP servers are either using 0x8 flag or no flag at all:

Check what flags are being used for the used NTP servers.

```
w32tm /dumpreg /subkey:Parameters | findstr /i "ntpserver"
```

## Next steps

To learn more about the Windows Server 2016 host improvements, see [Windows Server 2016 Improvements
](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/windows-server-2016-improvements)


