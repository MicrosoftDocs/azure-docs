---
title: Time sync for Linux VMs in Azure 
description: Time sync for Linux virtual machines.
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: gwallace

tags: azure-resource-manager

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/17/2018
ms.author: cynthn
---

# Time sync for Linux VMs in Azure

Time sync is important for security and event correlation. Sometimes it is used for distributed transactions implementation. Time accuracy between multiple computer systems is achieved through synchronization. Synchronization can be affected by multiple things, including reboots and network traffic between the time source and the computer fetching the time. 

Azure is backed by infrastructure running Windows Server 2016. Windows Server 2016 has improved algorithms used to correct time and condition the local clock to synchronize with UTC.  The Windows Server 2016 Accurate Time feature greatly improved how the VMICTimeSync service that governs VMs with the host for accurate time. Improvements include more accurate initial time on VM start or VM restore and interrupt latency correction. 

> [!NOTE]
> For a quick overview of Windows Time service, take a look at this [high-level overview video](https://aka.ms/WS2016TimeVideo).
>
> For more information, see [Accurate time for Windows Server 2016](/windows-server/networking/windows-time-service/accurate-time). 

## Overview

Accuracy for a computer clock is gauged on how close the computer clock is to the Coordinated Universal Time (UTC) time standard. UTC is defined by a multinational sample of precise atomic clocks that can only be off by one second in 300 years. But, reading UTC directly requires specialized hardware. Instead, time servers are synced to UTC and are accessed from other computers to provide scalability and robustness. Every computer has time synchronization service running that knows what time servers to use and periodically checks if computer clock needs to be corrected and adjusts time if needed. 

Azure hosts are synchronized to internal Microsoft time servers that take their time from Microsoft-owned Stratum 1 devices, with GPS antennas. Virtual machines in Azure can either depend on their host to pass the accurate time (*host time*) on to the VM or the VM can directly get time from a time server, or a combination of both. 

On stand-alone hardware, the Linux OS only reads the host hardware clock on boot. After that, the clock is maintained using the interrupt timer in the Linux kernel. In this configuration, the clock will drift over time. In newer Linux distributions on Azure, VMs can use the VMICTimeSync provider, included in the Linux integration services (LIS), to query for clock updates from the host more frequently.

Virtual machine interactions with the host can also affect the clock. During [memory preserving maintenance](../maintenance-and-updates.md#maintenance-that-doesnt-require-a-reboot), VMs are paused for up to 30 seconds. For example, before maintenance begins the VM clock shows 10:00:00 AM and lasts 28 seconds. After the VM resumes, the clock on the VM would still show 10:00:00 AM, which would be 28 seconds off. To correct for this, the VMICTimeSync service monitors what is happening on the host and prompts for changes to happen on the VMs to compensate.

Without time synchronization working, the clock on the VM would accumulate errors. When there is only one VM, the effect might not be significant unless the workload requires highly accurate timekeeping. But in most cases, we have multiple, interconnected VMs that use time to track transactions and the time needs to be consistent throughout the entire deployment. When time between VMs is different, you could see the following effects:

- Authentication will fail. Security protocols like Kerberos or certificate-dependent technology rely on time being consistent across the systems.
- It's very hard to figure out what have happened in a system if logs (or other data) don't agree on time. The same event would look like it occurred at different times, making correlation difficult.
- If clock is off, the billing could be calculated incorrectly.



## Configuration options

There are generally three ways to configure time sync for your Linux VMs hosted in Azure:

- The default configuration for Azure Marketplace images uses both NTP time and VMICTimeSync host-time. 
- Host-only using VMICTimeSync.
- Use another, external time server with or without using VMICTimeSync host-time.


### Use the default

By default, most Azure Marketplace images for Linux are configured to sync from two sources: 

- NTP as primary, which gets time from an NTP server. For example, Ubuntu 16.04 LTS Marketplace images use **ntp.ubuntu.com**.
- The VMICTimeSync service as secondary, used to communicate the host time to the VMs and make corrections after the VM is paused for maintenance. Azure hosts use Microsoft-owned Stratum 1 devices to keep accurate time.

In newer Linux distributions, the VMICTimeSync service uses the precision time protocol (PTP), but earlier distributions may not support PTP and will fall-back to NTP for getting time from the host.

To confirm NTP is synchronizing correctly, run the `ntpq -p` command.

### Host-only 

Because NTP servers like time.windows.com and ntp.ubuntu.com are public, syncing time with them requires sending traffic over the internet. Varying packet delays can negatively affect quality of the time sync. Removing NTP by switching to host-only sync can sometimes improve your time sync results.

Switching to host-only time sync makes sense if you experience time sync issues using the default configuration. Try out the host-only sync to see if that would improve the time sync on your VM. 

### External time server

If you have specific time sync requirements, there is also an option of using external time servers. External time servers can provide specific time, which can be useful for test scenarios, ensuring time uniformity with machines hosted in non-Microsoft datacenters, or handling leap seconds in a special way.

You can combine an external time server with the VMICTimeSync service to provide results similar to the default configuration. Combining an external time server with VMICTimeSync is the best option for dealing with issues that can be cause when VMs are paused for maintenance. 

## Tools and resources

There are some basic commands for checking your time synchronization configuration. Documentation for Linux distribution will have more details on the best way to configure time synchronization for that distribution.

### Integration services

Check to see if the integration service (hv_utils) is loaded.

```bash
lsmod | grep hv_utils
```
You should see something similar to this:

```
hv_utils               24418  0
hv_vmbus              397185  7 hv_balloon,hyperv_keyboard,hv_netvsc,hid_hyperv,hv_utils,hyperv_fb,hv_storvsc
```

See if the Hyper-V integration services daemon is running.

```bash
ps -ef | grep hv
```

You should see something similar to this:

```
root        229      2  0 17:52 ?        00:00:00 [hv_vmbus_con]
root        391      2  0 17:52 ?        00:00:00 [hv_balloon]
```


### Check for PTP

With newer versions of Linux, a Precision Time Protocol (PTP) clock source is available as part of the VMICTimeSync provider. On older versions of Red Hat Enterprise Linux or CentOS 7.x the [Linux Integration Services](https://github.com/LIS/lis-next) can be downloaded and used to install the updated driver. When using PTP, the Linux device will be of the form /dev/ptp*x*. 

See which PTP clock sources are available.

```bash
ls /sys/class/ptp
```

In this example, the value returned is *ptp0*, so we use that to check the clock name. To verify the device, check the clock name.

```bash
cat /sys/class/ptp/ptp0/clock_name
```

This should return **hyperv**.

### chrony

On Ubuntu 19.10 and later versions, Red Hat Enterprise Linux, and CentOS 7.x, [chrony](https://chrony.tuxfamily.org/) is configured to use a PTP source clock. Instead of chrony, older Linux releases use the Network Time Protocol daemon (ntpd), which doesn't support PTP sources. To enable PTP in those releases, chrony must be manually installed and configured (in chrony.conf) by using the following code:

```bash
refclock PHC /dev/ptp0 poll 3 dpoll -2 offset 0
```

For more information about Ubuntu and NTP, see [Time Synchronization](https://help.ubuntu.com/lts/serverguide/NTP.html).

For more information about Red Hat and NTP, see [Configure NTP](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-configuring_ntp_using_ntpd#s1-Configure_NTP). 

For more information about chrony, see [Using chrony](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-configuring_ntp_using_the_chrony_suite#sect-Using_chrony).

If both chrony and TimeSync sources are enabled simultaneously, you can mark one as **prefer**, which sets the other source as a backup. Because NTP services do not update the clock for large skews except after a long period, the VMICTimeSync will recover the clock from paused VM events far more quickly than NTP-based tools alone.

By default, chronyd accelerates or slows the system clock to fix any time drift. If the drift becomes too big, chrony fails to fix the drift. To overcome this, the `makestep` parameter in **/etc/chrony.conf** can be changed to force a timesync if the drift exceeds the threshold specified.

 ```bash
makestep 1.0 -1
```

Here, chrony will force a time update if the drift is greater than 1 second. To apply the changes restart the chronyd service:

```bash
systemctl restart chronyd
```

### systemd 

On SUSE and Ubuntu releases before 19.10, time sync is configured using [systemd](https://www.freedesktop.org/wiki/Software/systemd/). For more information about Ubuntu, see [Time Synchronization](https://help.ubuntu.com/lts/serverguide/NTP.html). For more information about SUSE, see Section 4.5.8 in [SUSE Linux Enterprise Server 12 SP3 Release Notes](https://www.suse.com/releasenotes/x86_64/SUSE-SLES/12-SP3/#InfraPackArch.ArchIndependent.SystemsManagement).

## Next steps

For more information, see [Accurate time for Windows Server 2016](/windows-server/networking/windows-time-service/accurate-time).


