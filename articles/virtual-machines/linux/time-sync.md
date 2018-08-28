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

Azure is now backed by infrastructure running Windows Server 2016. Windows Server 2016 has improved algorithms used to correct time and condition the local clock to synchronize with UTC.  Windows Server 2016 also improved the Hyper-V TimeSync service. Improvements include more accurate initial time on VM start or VM restore and interrupt latency correction for samples provided to Windows Time (W32time). 

>[!NOTE]
>For a quick overview of Windows Time service, take a look at this [high-level overview video](https://aka.ms/WS2016TimeVideo).
>
> For more details about time sync in Windows Server 2016, see [Accurate time for Windows Server 2016](https://docs.microsoft.com/en-us/windows-server/networking/windows-time-service/accurate-time). 





## Allowing Linux VMs to use host

Windows Time Service is enabled and used to synchronize the clock in events where the VM is paused (for example, when host updates require it). Azure images are also configured to work with the TimeSync integration service. By default this time source is enabled and used to synchronize the clock in events where the guest is paused (for example, when host updates are performed that require it). 

Recommendations for time sync settings on Linux are dependent on the age and type of distribution. 

Newer distributions of Linux support the TimeSync version 4 protocol. Some of them are:

- Red Hat Enterprise Linux 7.x 
- CentOS 7.x 
- Ubuntu 16.04 and 18.04 
- SUSE Linux Enterprise Server (SLES) 12 Service Pack 3 and SLES 15

If you are creating your own images of Linux distributions that support the TimeSync version 4 protocol for deployment in Azure, instead of using a Marketplace image, you need to:

- Enable the TimeSync integration service https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services#start-and-stop-an-integration-service-from-a-windows-guest. In this configuration the VM synchronizes against the host time. 
- Disable NTP time synchronization by either:
	- Disabling any NTP servers in the ntp.conf file
	or
	- Disabling the NTP daemon

In this configuration, the Time Server parameter is the host.  Its Polling Frequency is 5 seconds and the Clock Update Frequency is also 5 seconds.

For older distributions, that do not support TimeSync version 4:
- Synchronize exclusively over NTP. 
- Disable the TimeSync integration service in the VM.

On older distributions, such as Red Hat Enterprise Linux and CentOS 6.x, PTP is not supported, so either NTP or TimeSync can be used as a time source. Enable TimeSync by disabling your NTP service, then running as root:
echo Y > /sys/module/hv_utils/parameters/timesync_mode


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




