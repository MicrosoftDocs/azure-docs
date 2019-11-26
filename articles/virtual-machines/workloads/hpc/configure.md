---
title: High Performance Computing - Azure Virtual Machines | Microsoft Docs
description: Learn about High Performance Computing on Azure.
services: virtual-machines
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 05/07/2019
ms.author: amverma
---

# Optimization for Linux

This article shows a few key techniques to optimize your OS image. Learn more about [enabling InfiniBand](enable-infiniband.md) and optimizing the OS images.

## Update LIS

If deploying using a custom image (for example, an older OS such as CentOS/RHEL 7.4 or 7.5), update LIS on the VM.

```bash
wget https://aka.ms/lis
tar xzf lis
pushd LISISO
./upgrade.sh
```

## Reclaim memory

Improve efficiency by automatically reclaiming memory to avoid remote memory access.

```bash
echo 1 >/proc/sys/vm/zone_reclaim_mode
```

To make this persist after VM reboots:

```bash
echo "vm.zone_reclaim_mode = 1" >> /etc/sysctl.conf sysctl -p
```

## Disable firewall and SELinux

Disable firewall and SELinux.

```bash
systemctl stop iptables.service
systemctl disable iptables.service
systemctl mask firewalld
systemctl stop firewalld.service
systemctl disable firewalld.service
iptables -nL
sed -i -e's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
```

## Disable cpupower

Disable cpupower.

```bash
service cpupower status
if enabled, disable it:
service cpupower stop
sudo systemctl disable cpupower
```

## Next steps

* Learn more about [enabling InfiniBand](enable-infiniband.md) and optimizing OS images.

* Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
