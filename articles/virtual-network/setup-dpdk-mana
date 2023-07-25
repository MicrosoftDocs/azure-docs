---
title: Microsoft Azure Network Adapter (MANA) and DPDK on Linux
description: Learn about MANA and DPDK for Linux Azure VMs.
author: mamcgove
ms.service: virtual-network
ms.topic: how-to
ms.date: 07/10/2023
ms.author: mamcgove
---

# Microsoft Azure Network Adapter (MANA) and DPDK on Linux

The Microsoft Azure Network Adapter (MANA) is new hardware for Azure virtual machines to enables higher throughput and reliablity. 
To make use of MANA, users must modify their DPDK initialization routines to account for the following:
- MANA's EAL arguments.
- The Linux kernel must release control of the MANA network interfaces before DPDK initialization begins.

Note the following example code for running DPDK with MANA. We recommend using the direct-to-vf 'netvsc' configuration on Azure for maximum performance with MANA.

```
#! /bin/bash

#NOTE: Run as root

# NOTE: DPDK requires either 2MB or 1GB hugepages to be enabled
# Enable 2MB hugepages.
 echo 1024 | sudo tee /sys/devices/system/node/node*/hugepages/hugepages-2048kB/nr_hugepages

# Assuming use of eth1 for DPDK in this demo
MASTER="eth1"

# Get mac address for master interface.
MASTER_MAC="`cat /sys/class/net/$MASTER/address`"

# get name for interface which is slaved to MASTER
SLAVE="`ip -br link show master $MASTER | awk '{ print $1 }'`"

# get MANA device bus info to pass to DPDK
BUS_INFO=`ethtool -i $SLAVE | grep bus-info | awk '{ print $2 }'`

# Set MANA interfaces DOWN before starting DPDK
ip link set $MASTER down
ip link set $SLAVE down


# If setting both interfaces DOWN is not sufficient, 
# binding MASTER to uio_hv_generic may help force the direct use of MANA
# DEV_UUID=$(basename $(readlink /sys/class/net/$MASTER/device))
# NET_UUID="f8615163-df3e-46c5-913f-f2d2f965ed0e"
# modprobe uio_hv_generic
# echo $NET_UUID > /sys/bus/vmbus/drivers/uio_hv_generic/new_id
# echo $DEV_UUID > /sys/bus/vmbus/drivers/hv_netvsc/unbind
# echo $DEV_UUID > /sys/bus/vmbus/drivers/uio_hv_generic/bind

# MANA single queue test
dpdk-testpmd -l 1-3 --vdev="$BUS_INFO,mac=$MASTER_MAC" -- --forward-mode=txonly --auto-start --txd=128 --rxd=128 --stats 2

# MANA multiple queue test (example assumes > 9 cores)
dpdk-testpmd -l 1-9 --vdev="$BUS_INFO,mac=$MASTER_MAC" -- --forward-mode=txonly --auto-start --nb-cores=8  --txd=128 --rxd=128 --txq=8 --rxq=8 --stats 2

```

# Troubleshooting
```
mana_start_tx_queues(): Failed to create qp queue index 0
mana_dev_start(): failed to start tx queues -19
```
Failure to set the MANA slaved device to DOWN can result in 0 packet throughput. 
This can result in the above EAL error message.

```
EAL: No free 2048 kB hugepages reported on node 0
EAL: FATAL: Cannot get hugepage information.
EAL: Cannot get hugepage information.
EAL: Error - exiting with code: 1
Cause: Cannot init EAL: Permission denied
```
Failure to enable hugepages, try enabling hugepages and ensuring the information is visible in meminfo
