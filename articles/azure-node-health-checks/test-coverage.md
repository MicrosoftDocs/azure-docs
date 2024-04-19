---
title: Azure Node Health Checks Test Coverage
description:  Azure Node Health Checks (AzNHC) Node test coverage.
ms.service: azure-node-health-checks
ms.topic: test concepts
author: rafsalas19
ms.author: rafaelsalas
ms.date: 04/15/2024
---

# Azure Node Health Checks Test Coverage

AzNHC is a mix of custom and default tests (explained below). Supported VM SKUs have individual configuration files that list the tests to be run. These tests are chosen to provide coverage over the following components:
 - GPU
 - InfiniBand Cards
 - Ethernet
 - Memory
 - CPU


## Custom Tests
Custom tests refer to tests that were developed by Microsoft integrated into the NHC framework.

### GPU Component Checks
| Check | Check AzNHC Name | Description | Whats Used to Check |
|-------|------------------|-------------|---------------------|
| GPU Count | check_gpu_count | Verifies the number of GPUs based on expected count. | ```nvidia-smi --list-gpus \| wc -l``` |
| NVlink status | check_nvlink_status | Verifies NVlinks are enabled. | ```nvidia-smi nvlink --status```  |
| XID Error | check_gpu_xid | Verifies new xid errors since last check. | syslog |
| Nvidia-smi status | check_nvsmi_healthmon | Check return value of nvidia-smi. | ```nvidia-smi``` |
| GPU peer and host bandwidth check | check_gpu_bandwidth | GPU D2H/H2D/P2P bandwidth check. | [nvbandwidth](https://github.com/NVIDIA/nvbandwidth) |
| GPU Mem Errors (ECC) | check_gpu_ecc | Check ECC and Row Remap status. | ```nvidia-smi -q``` |
| GPU Throttling status | check_gpu_clock_throttling | Verifies GPU throttle codes assertion. | ```nvidia-smi --query-gpu=clocks_event_reasons.active --format=csv,noheader,nounits``` |
| NCCL All Reduce (NVlink) | check_nccl_allreduce | Check GPU NVLink and GPU NCCL bandwidth. | [NCCL-tests](https://github.com/NVIDIA/nccl-tests) |

### InfiniBand Checks
AzNHC is a single node test suite. However, it is still possible to check Infiniband network cards and IB link flaps without having to run multi-node tests.

| Check | Check AzNHC Name | Description | Whats Used to Check |
|-------|------------------|-------------|---------------------|
| IB write loop back (GPU Direct RDMA Only) | check_ib_bw_gdr | Loop IB communications over individual IB devices to validate bandwidth. | [ib_write_bw](https://github.com/linux-rdma/perftest) |
| IB write loop back (no GDR) | check_ib_bw_non_gdr | Loop IB communications over individual IB devices to validate bandwidth. | [ib_write_bw](https://github.com/linux-rdma/perftest) |
| IB LinkFlap | check_ib_link_flapping | Verifies the existence of multiple IB link flaps within a given interval (6 hours).  | syslog |

### CPU Checks
| Check | Check AzNHC Name | Description | Whats Used to Check |
|-------|------------------|-------------|---------------------|
| CPU STREAM | check_cpu_stream | Verifies CPU memory bandwidth using STREAM benchmark. | [STREAM Benchmark](https://www.cs.virginia.edu/stream/) |

### Other
| Check | Check AzNHC Name | Description | Whats Used to Check |
|-------|------------------|-------------|---------------------|
| Device NUMA topology (NCv4/NDv4/NDv5) | check_hw_topology | Verifies GPU/IB devices are in the correct NUMA domains. | ```lstopo``` |

## Default NHC Tests
This refers to tests that exist in the NHC framework by default. Refer to [NHC Github page](https://github.com/mej/nhc) for more information.

| Check | Check AzNHC Name | Description |
|-------|------------------|-------------|
| IB Port | check_hw_ib | Verifies that the IB port status is Active and and rate is as expected. |
| CPU Layout | check_hw_cpuinfo | Verifies number of sockets and cores based off of expected value. |
| Memory | check_hw_physmem | Verifies the amount of memory (RAM) against expected min/max values. |
| Ethernet Port | check_hw_eth  | Verifies that a particular Ethernet device is available. |
