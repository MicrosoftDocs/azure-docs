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

# Time sync for Linux VMs in Azure

Azure is backed by infrastructure running Windows Server 2016. Windows Server 2016 improved the algorithms it uses to correct time and condition the local clock to synchronize with UTC.  Windows Server 2016 also improved the Hyper-V TimeSync service. Improvements include more accurate initial time on VM start or VM restore and interrupt latency correction for samples provided to w32time. 

>[!NOTE]
>For a quick overview of Windows Time service, take a look at this [high-level overview video](https://aka.ms/WS2016TimeVideo).
>
> For more details about time sync in Windows Server 2016, see [Accurate time for Windows Server 2016](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time). 


The Windows Time service is a component that uses a plug-in model for client and server time synchronization providers.  There are two built-in client providers on Windows, and there are third-party plug-ins available. One provider uses [NTP (RFC 1305)](https://tools.ietf.org/html/rfc1305) or [MS-NTP](https://msdn.microsoft.com/en-us/library/cc246877.aspx) to synchronize the local system time to an NTP and/or MS-NTP compliant reference server. The other provider is for Hyper-V and synchronizes virtual machines (VM) to the Hyper-V host.  When multiple providers exist, Windows will pick the best provider using stratum level first, followed by root delay, root dispersion, and finally time offset.


>[!NOTE] 
>The windows time provider plugin model is [documented on TechNet](https://msdn.microsoft.com/en-us/library/windows/desktop/ms725475%28v=vs.85%29.aspx).


## Allowing Linux VMs to use host

By default this time source is enabled and used to synchronize the clock in events where the guest is paused (for example, when host updates are performed that require it). Azure images are also configured by default with network time protocol enabled with default settings.

Recommendations for time sync settings on Linux are dependent on the age and type of distribution. 

For Linux distributions that support the TimeSync version 4 protocol:

- Enable the TimeSync integration service. In this configuration the VM synchronizes against the host time. 
- Disable NTP time synchronization by either:
	- Disabling any NTP servers in the ntp.conf file
	or
	- Disabling the NTP daemon

In this configuration, the Time Server parameter is this host.  Its Polling Frequency is 5 seconds and the Clock Update Frequency is also 5 seconds.

For older distributions, that do not support TimeSync version 4:

- Synchronize exclusively over NTP. 
- Disable the TimeSync integration service in the VM.

> [!NOTE]
> Note:  Support for accurate time with Linux guests requires a feature that is only supported in the latest upstream Linux kernels and it isn’t something that’s widely available across all Linux distros yet. Please reference [Supported Linux and FreeBSD virtual machines for Hyper-V on Windows](https://technet.microsoft.com/en-us/windows-server-docs/virtualization/hyper-v/supported-linux-and-freebsd-virtual-machines-for-hyper-v-on-windows) for more details about support distributions.


By default the operating system (OS) only reads the hardware clock provided by the host on boot. After that, the clock is maintained by the interrupt timer with the Linux kernel. In such setup clock would drift over time. With Red Hat Enterprise Linux 7.x, CentOS 7.x, Ubuntu 16.04 and 18.04, SUSE Linux Enterprise Server (SLES) 12 Service Pack 3 or SLES 15, and similar versions of the latest Linux distributions, host time sync is available to query the host on a regular basis for clock updates.
 
 
With these versions of Linux, a PTP-based clock source is available. On older versions of Red Hat Enterprise Linux or CentOS 7.x the Linux Integration Services download can also be used to install this driver. Linux Integration Services uses the Hyper-V Time Syncronization protocol to implement a Precision Time Protocol service with this time source. The Linux device will be of the form /dev/ptpx. To see all of the ptp clock sources available:
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
