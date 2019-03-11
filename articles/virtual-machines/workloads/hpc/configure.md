---
title: Configuring high-performance computing in Azure | Microsoft Docs
description: Learn how to configure high-performance computing in Azure. 
services: virtual-machines
documentationcenter: ''
author: githubname
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 03/07/2019
ms.author: msalias
---
# Configure high-performance computing




## Reclaim memory 

Automatically reclaim memory to avoid remote memory access?.

```bash
echo 1 >/proc/sys/vm/zone_reclaim_mode
```

To make this persist after VM reboots:

```bash
echo "vm.zone_reclaim_mode = 1" >> /etc/sysctl.conf sysctl -p
```


## Discover partition keys


Discover partition keys (pkeys) for communicating with other VMs.

```bash
/sys/class/infiniband/mlx5_0/ports/1/pkeys/0
/sys/class/infiniband/mlx5_0/ports/1/pkeys/1
```

The bigger one is the tenant key that should be used with MPI. The following are the partition keys, 0x800b should be used with MPI.

```bash
cat /sys/class/infiniband/mlx5_0/ports/1/pkeys/0
0x800b
cat /sys/class/infiniband/mlx5_0/ports/1/pkeys/1
0x7fff
```

Use the partition other than default (0x7fff) partition key. UCX requires the MSB of pkey to be cleared. For example, set UCX_IB_PKEY as 0x000b for 0x800b.


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

## Set up user limits for MPI

Set up user limits for MPI.

```bash
cat << EOF >> /etc/security/limits.conf
*               hard    memlock         unlimited
*               soft    memlock         unlimited
*               hard    nofile          65535
*               soft    nofile          65535
EOF
```


## Set up SSH keys for MPI

Set up SSH keys for MPI types that require it.

```bash
ssh-keygen -f /home/$USER/.ssh/id_rsa -t rsa -N ''
cat << EOF > /home/$USER/.ssh/config
Host *
    StrictHostKeyChecking no
EOF
cat /home/$USER/.ssh/id_rsa.pub >> /home/$USER/.ssh/authorized_keys
chmod 644 /home/$USER/.ssh/config
```

The above syntax assumes shared home directory, else .ssh directory must be copied to each node.

## Disable cpupower

Disable cpupower.

```bash
service cpupower status
if enabled, disable it:
service cpupower stop
sudo systemctl disable cpupower
```

## Next steps
Learn more about [high-performance computing](../../linux/high-performance-computing.md) in Azure.