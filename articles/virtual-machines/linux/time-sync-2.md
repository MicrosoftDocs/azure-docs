---
title: Time sync for Linux VMs in Azure | Microsoft Docs
description: Time sync for Linux virtual machines.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 08/21/2018
ms.author: cynthn
---

[‎8/‎31/‎2018 10:52 AM]  Josh Poulson:  
[    2.459986] hv_utils: TimeSync IC version 4.0 
dmesg | grep hv


dmesg | grep "Hyper-V Host Build"
[    0.000000] Hyper-V Host Build:14393-10.0-0-0.280  



LIS - in kernel, but need to install or start?
Is there a specific daemon that is part of LIS that is for time sync?
How do you figure out which version of LIS is installed?
LIS vs agent? Anything the agent is doing?


Recommendations:
Newer distros - host-only, host + NTP, host + PTP, PTP only, NTP only

What is chrony configuring? Something in LIS or just the PTP piece?

Azure image vs custom image 

hybrid environments and mixed environments

What is TimeSync version 4 protocol? Is this really NTP 4.0 or something else?



# Time sync for Linux VMs in Azure

Azure is now backed by infrastructure running Windows Server 2016. Windows Server 2016 has improved algorithms used to correct time and condition the local clock to synchronize with UTC.  Windows Server 2016 also improved the Hyper-V TimeSync service. Improvements include more accurate initial time on VM start or VM restore and interrupt latency correction for samples provided to Windows Time (W32time). 

>[!NOTE]
>For a quick overview of Windows Time service, take a look at this [high-level overview video](https://aka.ms/WS2016TimeVideo).
>
> For more details about time sync in Windows Server 2016, see [Accurate time for Windows Server 2016](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time). 

## Overview

By default, a Linux VM only reads the host hardware clock on boot. After that, the clock is maintained using the interrupt timer in the Linux kernel. In this default configuration, the clock can drift over time. In newer Linux distributions on Azure, you can now use host time sync query to get clock updates more frequently.

Windows Server 2016 Accurate Time is described here: https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time  By default this time source is enabled and used to synchronize the clock in events where the guest is paused (for example, when host updates are performed that require it). Azure images are also configured by default with network time protocol enabled with default settings.

With these versions <!-- which ones? -->   of Linux, a PTP-based clock source is available. On older versions of Red Hat Enterprise Linux or CentOS 7.x the Linux Integration Services download can also be used to install this driver. Linux Integration Services uses the Hyper-V Time Syncronization protocol to implement a Precision Time Protocol service with this time source. The Linux device will be of the form /dev/ptpx. To see all of the ptp clock sources available:
	$ ls /sys/class/ptp

To verify the device is the TimeSync device, check the clock name:
	$ cat /sys/class/ptp/ptpx/clock_name
	hyperv

On Red Hat Enterprise Linux and CentOS 7.x, the Linux time tool chrony can be configured to use this clock as a source, which is disabled by default. ntpd doesn’t support PTP sources, so using chronyd is recommended. To switch to the host clock when using chronyd, enable TimeSync as a source in /etc/chrony.conf:
	refclock PHC /dev/ptp0 poll 3 dpoll -2 offset 0

	There is more discussion on Red Hat NTP here: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/s1-configure_ntp and more on chrony here: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/sect-using_chrony
If both chrony and TimeSync sources are enabled simultaneously, one could marked as “prefer” which sets the other source as a backup source. It is not recommended to disable the host time sync service but it is not required to be the preferred source. Because NTP services do not update the clock for large skews except after a long period, the host time sync will recover the clock from paused VM events far more quickly than NTP-based tools alone.
On Ubuntu the timesync service is configured via systemd and there are many choices for configuring a network time sycnhronization service, described on "https://help.ubuntu.com/lts/serverguide/NTP.html"
SLES can be configured via multiple methods as well. See Section 4.5.8 of "https://www.suse.com/releasenotes/x86_64/SUSE-SLES/12-SP3/#InfraPackArch.ArchIndependent.SystemsManagement"
On older distributions, such as Red Hat Enterprise Linux and CentOS 6.x, PTP is not supported, so either NTP or TimeSync can be used as a time source. Enable TimeSync by disabling your NTP service, then running as root:
	echo Y > /sys/module/hv_utils/parameters/timesync_mode
On very old distributions (which are not supported in Azure) Red Hat Enterprise Linux and CentOS 5.x, only the core Time Synchronization is available, where the hardware clock is synchronized on boot and shutdown.

In case of time problems

If VM drifts in time, that's a problem that needs to be investigated.

If w32time is syncing time from some time server and this server is not available for a long time or is supplying wrong time, practically speaking in most cases that is a temporal issue. Likely the issue would be mitigated shortly on the server's end. In case the issue is recurrent you either need to work with the server owners or switch to another time server. Time.windows.com is a public NTP server that is being used by millions of Windows devices and is tuned for handling lots of traffic. Alas, Microsoft at the moment doesn't have a customer feedback channel for time.windows.com, but we monitor it and fix any discovered issues.

If the VM is configured to sync the time from the host and there are problem with time sync, that's an Azure issue. It should be reported via the Azure feedback tool and our engineers would need to investigate what's wrong.



## Allowing Linux VMs to use host

Windows Time Service is enabled and used to synchronize the clock in events where the VM is paused (for example, when host updates require it). Azure images are also configured to work with the TimeSync integration service. By default this time source is enabled and used to synchronize the clock in events where the guest is paused (for example, when host updates are performed that require it). 

Recommendations for time sync settings on Linux are dependent on the age and type of distribution. 

Newer distributions of Linux support the WIndows server 2016 accurate time version 4 protocol and precision time protocol (PTP) . Some of them are:

- Red Hat Enterprise Linux 7.x 
- CentOS 7.x 
- Ubuntu 16.04 and 18.04 
- SUSE Linux Enterprise Server (SLES) 12 Service Pack 3 and SLES 15

If you are creating your own images of Linux distributions that support the TimeSync version 4 protocol for deployment in Azure, instead of using a Marketplace image, you need to:

- Install and enable the TimeSync integration service https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services#start-and-stop-an-integration-service-from-a-linux-guest. In this configuration the VM synchronizes against the host time. 
- Disable NTP time synchronization by either:
	- Disabling any NTP servers in the ntp.conf file
	or
	- Disabling the NTP daemon

In this configuration, the Time Server parameter is the host.  Its Polling Frequency is 5 seconds and the Clock Update Frequency is also 5 seconds.

In older Linux distributions, the default is to only read the host hardware clock on boot. After that, the clock is maintained using the interrupt timer in the Linux kernel. In this default configuration, the clock can drift over time. For older distributions, that do not support TimeSync version 4, you should:

- Synchronize exclusively over NTP. 
- Disable the TimeSync integration service in the VM.

There are a couple of exceptions to this guidance. Red Hat Enterprise Linux and CentOS 6.x doesn't support PTP, but you can use either NTP or TimeSync as a time source. Enable TimeSync by disabling your NTP service, then running as root:

```
Y > /sys/module/hv_utils/parameters/timesync_mode
```

By default the operating system (OS) only reads the hardware clock provided by the host on boot. After that, the clock is maintained by the interrupt timer with the Linux kernel. In such setup clock would drift over time. With Red Hat Enterprise Linux 7.x, CentOS 7.x, Ubuntu 16.04 and 18.04, SUSE Linux Enterprise Server (SLES) 12 Service Pack 3 or SLES 15, and similar versions of the latest Linux distributions, host time sync is available to query the host on a regular basis for clock updates.
 
 
With these versions of Linux, a Precision Time Protocol (PTP) clock source is available. On older versions of Red Hat Enterprise Linux or CentOS 7.x the Linux Integration Services download can also be used to install this driver. Linux Integration Services uses the Hyper-V Time Syncronization protocol to implement PTP with this time source. The Linux device will be of the form /dev/ptpx. To see all of the ptp clock sources available.

```bash
ls /sys/class/ptp
```

In this example, the value returned is *ptp0*, so we use that to check the clock name. To verify the device is the TimeSync device, check the clock name.

```bash
cat /sys/class/ptp/ptp0/clock_name
```

This should return **hyperv**.

## Red Hat  
On Red Hat Enterprise Linux and CentOS 7.x, **chrony** can be used to configure the OS to use the PTP source clock. The Network Time Protocol daemon (ntpd) doesn’t support PTP sources, so using **chronyd** is recommended. To switch to the host clock, enable TimeSync as a source in **/etc/chrony.conf**.

```bash
refclock PHC /dev/ptp0 poll 3 dpoll -2 offset 0
```

For more information on Red Hat and NTP, see [Configure NTP](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/s1-configure_ntp). 

For more information on chrony, see [Using chrony](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/sect-using_chrony).

If both chrony and TimeSync sources are enabled simultaneously, you can mark one as **prefer** which sets the other source as a backup. Having the host time sync service set to **prefer** is not required. Because NTP services do not update the clock for large skews except after a long period, the host time sync will recover the clock from paused VM events far more quickly than NTP-based tools alone.

## Ubuntu 

On Ubuntu the timesync service is configured using **systemd**. For more information, see [Time Synchronization](https://help.ubuntu.com/lts/serverguide/NTP.html).

## SLES 

SLES can be configured using multiple methods. See Section 4.5.8 in [SUSE Linux Enterprise Server 12 SP3 Release Notes](https://www.suse.com/releasenotes/x86_64/SUSE-SLES/12-SP3/#InfraPackArch.ArchIndependent.SystemsManagement).




