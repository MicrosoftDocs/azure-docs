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




## Performance monitoring
Performance monitor counters have been added.  These allow you to baseline, monitor, and troubleshoot time accuracy.  These counters include:

Counter|Description|
----- | ----- |
Computed Time Offset|	The absolute time offset between the system clock and the chosen time source, as computed by W32Time Service in microseconds. When a new valid sample is available, the computed time is updated with the time offset indicated by the sample. This is the actual time offset of the local clock. W32time initiates clock correction using this offset and updates the computed time in between samples with the remaining time offset that needs to be applied to the local clock. Clock accuracy can be tracked using this performance counter with a low polling interval (eg:256 seconds or less) and looking for the counter value to be smaller than the desired clock accuracy limit.|
Clock Frequency Adjustment|	The absolute clock frequency adjustment made to the local system clock by W32Time in parts per billion. This counter helps visualize the actions being taken by W32time.|
NTP Roundtrip Delay|	Most recent round-trip delay experienced by the NTP Client in receiving a response from the server in microseconds. This is the time elapsed on the NTP client between transmitting a request to the NTP server and receiving a valid response from the server. This counter helps characterize the delays experienced by the NTP client. Larger or varying roundtrips can add noise to NTP time computations, which in turn may affect the accuracy of time synchronization through NTP.|
NTP Client Source Count|	Active number of NTP Time sources being used by the NTP Client. This is a count of active, distinct IP addresses of time servers that are responding to this client’s requests. This number may be larger or smaller than the configured peers, depending on DNS resolution of peer names and current reach-ability.|
NTP Server Incoming Requests|	Number of requests received by the NTP Server (Requests/Sec).|
NTP Server Outgoing Responses|	Number of requests answered by NTP Server (Responses/Sec).|

The first 3 counters target scenarios for troubleshooting accuracy issues.  The Troubleshooting Time Accuracy and NTP section below, under [Best Practices](#BestPractices), has more detail.
The last 3 counters cover NTP server scenarios and are helpful when determine the load and baselining your current performance.

### Configuration Updates per Environment
The following describes the changes in default configuration between Windows 2016 and previous versions for each Role.  The settings for Windows Server 2016 and Windows 10 Anniversary Update (build 14393), are now unique which is why there are shown as separate columns. 

|Role|Setting|Windows Server 2016|Windows 10|Windows Server 2012 R2</br>Windows Server 2008 R2</br>Windows 10|
|---|---|---|---|---|
|**Standalone/Nano Server**||||
| |*Time Server*|time.windows.com|NA|time.windows.com|
| |*Polling Frequency*|64 - 1024 seconds|NA|Once a week|
| |*Clock Update Frequency*|Once a second|NA|Once a hour|
|**Domain Controller**||||
| |*Time Server*|PDC/GTIMESERV|NA|PDC/GTIMESERV|
| |*Polling Frequency*|64 -1024 seconds|NA|1024 - 32768 seconds|
| |*Clock Update Frequency*|Once a day|NA|Once a week|
|**Domain Member Server**||||
| |*Time Server*|DC|NA|DC|
| |*Polling Frequency*|64 -1024 seconds|NA|1024 - 32768 seconds|
| |*Clock Update Frequency*|Once a second|NA|Once every 5 minutes|
|**Domain Member Client**||||
| |*Time Server*|NA|DC|DC|
| |*Polling Frequency*|NA|1204 - 32768 seconds|1024 - 32768 seconds|
| |*Clock Update Frequency*|NA|Once every 5 minutes|Once every 5 minutes|
|**Hyper-V Guest**||||
| |*Time Server*|Chooses best option based on stratum of Host and Time server|Chooses best option based on stratum of Host and Time server|Defaults to Host|
| |*Polling Frequency*|Based on Role above|Based on Role above|Based on Role above|
| |*Clock Update Frequency*|Based on Role above|Based on Role above|Based on Role above|

>[!NOTE]
>For Linux in Hyper-V, see the [Allowing Linux to use Hyper-V Host Time](#AllowingLinux) section below.

There are two services responsible for time synchronization: **w32time** and **vmictimesync**. By default, w32time uses and NtpClient provider configured to get time from time.windows.com and VMICTimeSync that is getting time from the host via vmictimesync service.
 
Using time.windows.com or other public facing NTP server requires sending traffic over the internet. That results in varying packet delays and that by itself can negatively affect quality of the time sync. 
 
For customers that need stable and precise time sync it is best to switch to host only time sync. This way the whole time server hierarchy resides in the collocated MS-owned datacenter infrastructure where delays are predictable and small. This also allows us to improve time sync on VMs by improving time sync on the hosts. 
 
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

