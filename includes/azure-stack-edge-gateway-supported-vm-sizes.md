---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 10/02/2023
ms.author: alkohli
---

The VM size determines the amount of compute resources (like CPU, GPU, and memory) that are made available to the VM. You should create virtual machines by using a VM size appropriate for the workload. Even though all machines will be running on the same hardware, machine sizes have different limits for disk access. This can help you manage overall disk access across your VMs. If a workload increases, you can also resize an existing virtual machine.

The following VMs are supported for creation on your Azure Stack Edge device.

### Dv2-series
| Size             | vCPU  | Memory (GiB)  | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | Max data disks  | Max NICs  | Premium Storage |
|------------------|-------|---------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|-----------------|-----------|---|
| **Standard_D1_v2**   | 1     | 3.5           | 50                  | 1000                           | 3000                                | 500                              | 4               | 2         | No  |
| **Standard_D2_v2**   | 2     | 7             | 100                 | 1000                           | 6000                                | 500                              | 8               | 4         | No  |
| **Standard_D3_v2**   | 4     | 14            | 200                 | 1000                           | 12000                               | 500                              | 16              | 4         | No  |
| **Standard_D4_v2**   | 8     | 28            | 400                 | 1000                           | 24000                               | 500                              | 32              | 8         | No  |
| **Standard_D5_v2**   | 16    | 56            | 800                 | 1000                           | 48000                               | 500                              | 64              | 8         | No  |
| **Standard_D11_v2**  | 2     | 14            | 100                 | 1000                           | 6000                                | 500                              | 8               | 2         | No  |
| **Standard_D12_v2**  | 4     | 28            | 200                 | 1000                           | 12000                               | 500                              | 16              | 4         | No  |
| **Standard_D13_v2**  | 8     | 56            | 400                 | 1000                           | 24000                               | 500                              | 32              | 8         | No  |

<!--| **Standard_D14_v2**  | 16    | 114           | 800                 | 1000                           | 48000                               | 500                              | 64              | 8         |-->


### DSv2-series
| Size              | vCPU  | Memory (GiB)  | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | Max data disks  | Max NICs  | Premium Storage |
|-------------------|-------|---------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|-----------------|-----------|---|
| **Standard_DS1_v2**   | 1     | 3.5           | 7                   | 2000                           | 4000                                | 2300                             | 4               | 2         | Yes |
| **Standard_DS2_v2**   | 2     | 7             | 14                  | 2000                           | 8000                                | 2300                             | 8               | 2         | Yes |
| **Standard_DS3_v2**   | 4     | 14            | 28                  | 2000                           | 16000                               | 2300                             | 16              | 4         | Yes |
| **Standard_DS4_v2**   | 8     | 28            | 56                  | 2000                           | 32000                               | 2300                             | 32              | 8         | Yes |
| **Standard_DS5_v2**   | 16    | 56            | 112                 | 2000                           | 64000                               | 2300                             | 64              | 8         | Yes |
| **Standard_DS11_v2**  | 2     | 14            | 28                  | 2000                           | 8000                                | 2300                             | 8               | 2         | Yes |
| **Standard_DS12_v2**  | 4     | 28            | 56                  | 2000                           | 16000                               | 2300                             | 16              | 4         | Yes |
| **Standard_DS13_v2**  | 8     | 56            | 112                 | 2000                           | 32000                               | 2300                             | 32              | 8         | Yes |

<!--| **Standard_DS14_v2**  | 16    | 114           | 224                 | 2000                           | 64000                               | 2300                             | 64              | 8         |-->

For more information, see [Dv2 and DSv2-series](../articles/virtual-machines/dv2-dsv2-series.md#dv2-series).


### N-series GPU optimized 

These sizes are supported for GPU VMs on your device and are optimized for compute-intensive GPU-accelerated applications, for example, inferencing workloads. The GPU VM that you deploy should match the GPU type on your Azure Stack Edge device. 

#### NVIDIA Tesla T4 GPU

| Size                  | vCPU  | Memory (GiB)  | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | GPU  | GPU memory (GiB)  | Max NICs  | Premium Storage |
|-----------------------|-------|---------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|------|-------------------|-----------|---|
| **Standard_NC4as_T4_v3**  | 4     | 28            | 176                 | 2000                           | 48000                               | 2300                             | 1    | 16                | 4         | Yes |
| **Standard_NC8as_T4_v3**  | 8     | 56            | 352                 | 2000                           | 48000                               | 2300                             | 1    | 16                | 8         | Yes |
| **Standard_NC16as_T4_v3**   | 16    | 110            | 352                 | 2000                           | 48000                               | 2300                             | 1    | 16                | 8         | Yes |
| **Standard_NC16as_T4_v1**   | 16    | 32            | 352                 | 2000                            | 48000                               | 2300                             | 1    | 16               | 8         | Yes |  
| **Standard_NC32as_T4_v3**   | 32    | 96           | 352                 | 2000                           | 48000                               | 2300                             | 1    | 16               | 8         | Yes |
| **Standard_NC32as_T4_v1**   | 32    | 224           | 352                 | 2000                            | 48000                               | 2300                             | 1    | 16               | 8         | Yes |
| **Standard_NC32as_2T4_v1**  | 32    | 224           | 352                 | 2000                            | 48000                               | 2300                             | 2    | 32                | 8         | Yes |


For more information, see [NCasT4_v3-series](../articles/virtual-machines/nct4-v3-series.md).

#### NVIDIA A2 Tensor Core GPU


| Size                  | vCPU  | Memory (GiB)  | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | GPU  | GPU memory (GiB)  | Max NICs  | Premium Storage |
|-----------------------|-------|---------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|------|-------------------|-----------|---|
| **Standard_NC4as_A2**  | 4     | 28            | 176                 | 2000                           | 48000                               | 2300                             | 1    | 16                | 4         | Yes |
| **Standard_NC8as_A2**  | 8     | 56            | 352                 | 2000                           | 48000                               | 2300                             | 1    | 16                | 8         | Yes |
| **Standard_NC16as_A2**   | 16    | 110            | 352                 | 2000                           | 48000                               | 2300                             | 1    | 16                | 8         | Yes |
| **Standard_NC16as_A2_v1**   | 16 | 32            | 352                 | 2000                           | 48000                            | 2300    | 1    | 16   | 8    | Yes |
| **Standard_NC32as_A2**      | 32 | 96            | 352                 | 2000                           | 48000                            | 2300    | 1    | 16   | 8    | Yes |
| **Standard_NC32as_A2_v1**   | 32 | 224            | 352                 | 2000                           | 48000                            | 2300    | 1    | 16   | 8    | Yes |
| **Standard_NC32as_2A2_v1**  | 32 | 224            | 352                 | 2000                           | 48000                            | 2300    | 2    | 32    | 8    | Yes |


### F-series

These series are optimized for computational workloads and run on Intel Xeon processors. 

| Size           | vCPU  | Memory: GiB  | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | Max data disks  | Max NICs  | Premium Storage |
|----------------|---------|--------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|-----------------|-----------|---|
| **Standard_F1**    | 1       | 2            | 16                  | 1000                           | 3000                                | 500                              | 4               | 2         | Yes |
| **Standard_F2**    | 2       | 4            | 32                  | 1000                           | 6000                                | 500                              | 8               | 4         | Yes |
| **Standard_F4**    | 4       | 8            | 64                  | 1000                           | 12000                               | 500                              | 16              | 4         | Yes |
| **Standard_F8**    | 8       | 16           | 128                 | 1000                           | 24000                               | 500                              | 32              | 8         | Yes |
| **Standard_F12**  | 12      | 24          | 256                  | 1000                           | 48000                               | 500                             | 64              | 8         | Yes |
| **Standard_F16**   | 16      | 32           | 256                 | 1000                           | 48000                               | 500                              | 64              | 8         | Yes |
| **Standard_F1s**   | 1       | 2            | 4                   | 2000                           | 4000                                | 2300                             | 4               | 2         | Yes |
| **Standard_F2s**   | 2       | 4            | 8                   | 2000                           | 8000                                | 2300                             | 8               | 4         | Yes |
| **Standard_F4s**   | 4       | 8            | 16                  | 2000                           | 16000                               | 2300                             | 16              | 4         | Yes |
| **Standard_F8s**   | 8       | 16           | 32                  | 2000                           | 32000                               | 2300                             | 32              | 8         | Yes |
| **Standard_F16s**  | 16      | 32           | 64                  | 2000                           | 64000                               | 2300                             | 64              | 8         | Yes |
| **Standard_F4s_v1**| 4       | 4            | 8                  | 2000                             | 8000                              | 2300                             | 8               | 4         | Yes |
| **Standard_F32s**   | 32       | 48                | 64    | 2000    | 64000   | 2300   | 64   |  8 | Yes   |  
| **Standard_F32s_v1**| 32       | 96     | 64    | 2000    | 64000   | 2300   | 64   | 8   | Yes |
| **Standard_F32s_v3**| 32     | 224      | 64    | 2000    | 64000   | 2300   | 64   | 8   | Yes |

For more information, see [Fsv2-series](../articles/virtual-machines/fsv2-series.md).

### High-performance network VMs

The high-performance network (HPN) virtual machines are tailored for workloads that require fast and uninterrupted performance using high speed network interfaces. Due to the nature of logical core pairing, the supported VM sizes have vCpu count in multiples of 2.  

#### HPN DSv2-series

| Size              | vCPU  | Memory (GiB)  | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | Max data disks  | Max NICs<sup>1</sup> | Premium Storage | 
|-------------------|-------|---------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|-----------------|-----------|---|
| **Standard_DS2_v2_HPN**   | 2     | 7             | 14                  | 2000                           | 8000                                | 2300                             | 8               | 14         | Yes |
| **Standard_DS3_v2_HPN**   | 4     | 14            | 28                  | 2000                           | 16000                               | 2300                             | 16              | 14         | Yes |
| **Standard_DS4_v2_HPN**   | 8     | 28            | 56                  | 2000                           | 32000                               | 2300                             | 32              | 14         | Yes |

<sup>1</sup>Windows Server 2016 Datacenter VHD has a limit of 8 NICs for all HPN VM sizes.

#### HPN F-series

| Size           | vCPU  | Memory (GiB) | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | Max data disks  | Max NICs<sup>1</sup>  | Premium Storage |
|----------------|---------|--------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|-----------------|-----------|---|
| **Standard_F2s_HPN**   | 2       | 4            | 8                   | 2000                           | 8000                                | 2300                             | 8               | 14         | Yes |
| **Standard_F4s_HPN**   | 4       | 8            | 16                  | 2000                           | 16000                               | 2300                             | 16              | 14         | Yes |
| **Standard_F8s_HPN**   | 8       | 16           | 32                  | 2000                           | 32000                               | 2300                             | 32              | 14         | Yes |
| **Standard_F12s_HPN**  | 12      | 24           | 48                  |             2000                           | 48000                                  | 2300                             | 64              | 14 | Yes |
| **Standard_F16s_HPN**  | 16      | 32           | 64                  | 2000                           | 64000                               | 2300                             | 64              | 14         | Yes |
| **Standard_F12_HPN**   | 12      | 24           | 64                 | 1000                           | 48000                               |   500                             | 64              | 14         | Yes |

<sup>1</sup>Windows Server 2016 Datacenter VHD has a limit of 8 NICs for all HPN VM sizes.

#### HPN and NVIDIA Tesla T4 GPU series

| Size           | vCPU  | Memory (GiB) | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | Max data disks  | Max NICs<sup>1</sup>  | GPU   | GPU memory (GiB)   | Premium Storage |
|----------------|---------|--------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|-----------------|-----------|------|------|---|
| **Standard_DS2_v2_HPN_T4_v3**   | 2       | 7            | 14                   | 2000                           | 8000                                | 2300                             | 8               | 14         |1   |16  | Yes |
| **Standard_DS3_v2_HPN_T4_v3**   | 4       | 14            | 28                  | 2000                           | 16000                               | 2300                             | 16              | 14         |1   |16  | Yes |
| **Standard_DS4_v2_HPN_T4_v3**   | 8       | 28            | 56                  | 2000                           | 32000                               | 2300                             | 32              | 14         |1   |16  | Yes |
| **Standard_F2s_HPN_T4_v3**   | 2       | 4            | 8                  | 2000                           | 8000                               | 2300                             | 8              | 14         |1   |16  | Yes |
| **Standard_F4s_HPN_T4_v3**   | 4       | 8            | 16                  | 2000                           | 16000                               | 2300                             | 16              | 14         |1   |16  | Yes |
| **Standard_F8s_HPN_T4_v3**   | 8       | 16            | 32                  | 2000                           | 32000                               | 2300                             | 32              | 14         |1   |16  | Yes |
| **Standard_F12s_HPN_T4_v3**   | 12       | 24            | 48                  | 2000                           | 48000                               | 2300                             | 64              | 14         |1   |16  | Yes |
| **Standard_F16s_HPN_T4_v3**   | 16       | 32            | 64                  | 2000                           | 64000                               | 2300                             | 64              | 14         |1   |16  | Yes |
| **Standard_F12_HPN_T4_v3**   | 12       | 24            | 64                  | 1000                           | 48000                               | 500                             | 64              | 14         |1   |16  | Yes |

<sup>1</sup>Windows Server 2016 Datacenter VHD has a limit of 8 NICs for all HPN VM sizes.

#### HPN and NVIDIA Tesla A2 Tensor Core GPU series

| Size           | vCPU  | Memory (GiB) | Temp storage (GiB)  | Max OS disk throughput (IOPS)  | Max temp storage throughput (IOPS)  | Max data disk throughput (IOPS)  | Max data disks  | Max NICs<sup>1</sup>  | GPU   | GPU memory (GiB)   | Premium Storage |
|----------------|---------|--------------|---------------------|--------------------------------|-------------------------------------|----------------------------------|-----------------|-----------|------|------|---|
| **Standard_DS2_v2_HPN_A2**   | 2       | 7            | 14                   | 2000                           | 8000                                | 2300                             | 8               | 14         |1   |16  | Yes |
| **Standard_DS3_v2_HPN_A2**   | 4       | 14            | 28                  | 2000                           | 16000                               | 2300                             | 16              | 14         |1   |16  | Yes |
| **Standard_DS4_v2_HPN_A2**   | 8       | 28            | 56                  | 2000                           | 32000                               | 2300                             | 32              | 14         |1   |16  | Yes |
| **Standard_F2s_HPN_A2**   | 2       | 4            | 8                  | 2000                           | 8000                               | 2300                             | 8              | 14         |1   |16  | Yes |
| **Standard_F4s_HPN_A2**   | 4       | 8            | 16                  | 2000                           | 16000                               | 2300                             | 16              | 14         |1   |16  | Yes |
| **Standard_F8s_HPN_A2**   | 8       | 16            | 32                  | 2000                           | 32000                               | 2300                             | 32              | 14         |1   |16  | Yes |
| **Standard_F12s_HPN_A2**   | 12       | 24            | 48                  | 2000                           | 48000                               | 2300                             | 64              | 14         |1   |16  | Yes |
| **Standard_F16s_HPN_A2**   | 16       | 32            | 64                  | 2000                           | 64000                               | 2300                             | 64              | 14         |1   |16  | Yes |
| **Standard_F12_HPN_A2**   | 12       | 64            | 64                  | 1000                           | 48000                               | 500                             | 64              | 14         |1   |16  | Yes |

<sup>1</sup>Windows Server 2016 Datacenter VHD has a limit of 8 NICs for all HPN VM sizes.
