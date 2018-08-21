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

By default OS only reads hardware clock provided by the host upon boot. After that clock is maintained just by the interrupt timer with the Linux kernel. In such setup clock would drift over time. With Red Hat Enterprise Linux 7.x, CentOS 7.x, Ubuntu 16.04 and 18.04, SUSE Linux Enterprise Server (SLES) 12 Service Pack 3 or SLES 15, and similar versions of the latest Linux distributions, host time sync is available to query the host on a regular basis for clock updates.
 
Windows Server 2016 Accurate Time is described here: https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time  By default this time source is enabled and used to synchronize the clock in events where the guest is paused (for example, when host updates are performed that require it). Azure images are also configured by default with network time protocol enabled with default settings.
 
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
