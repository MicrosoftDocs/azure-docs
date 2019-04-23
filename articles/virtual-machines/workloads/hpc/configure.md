---
title: High Performance Computing on Azure | Microsoft Docs
description: Learn about High Performance Computing on Azure.
services: virtual-machines
documentationcenter: ''
author: githubname
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 04/25/2019
ms.author: msalias
---

# Optimization for Linux
 
## Update LIS

If deploying using a custom image (e.g. for an older OS such as CentOS/RHEL 7.4 or 7.5), please update LIS on the VM.

```bash
wget https://aka.ms/lis
tar xzf lis
pushd LISISO
./upgrade.sh
```

## Reclaim memory

Automatically reclaim memory to avoid remote memory access.

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
sed -i -e's/SELINUX=enforcing/SELINUX=disabled/g'/etc/selinux/config
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

Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
