---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 08/03/2020
ms.author: alkohli
---

The VM size determines the amount of compute resources like CPU, GPU, and memory that are made available to the VM. Virtual machines should be created using a VM size appropriate for the workload. Even though all machines will be running on the same hardware, machine sizes have different limits for disk access, which can help you manage overall disk access across your VMs. If a workload increases, an existing virtual machine can also be resized.

The following Standard Dv2 series VMs are supported for creation on Azure Stack Edge device.

### Dv2-series
|Size     |vCPU     |Memory (GiB) | Temp storage (GiB)  | Max OS disk throughput (IOPS) | Max temp storage throughput (IOPS) | Max data disks / throughput (IOPS) | Max NICs |
|-------------------|----|----|-----|----|------|------------|---------|
|**Standard_D1_v2** |1   |3.5 |50   |500 |3000  |4 / 4x500   |2 |
|**Standard_D2_v2** |2   |7   |100  |500 |6000  |8 / 8x500   |2 |
|**Standard_D3_v2** |4   |14  |200  |500 |12000 |16 / 16x500 |4 |
|**Standard_D4_v2** |8   |28  |400  |500 |24000 |32 / 32x500 |8 |
|**Standard_D5_v2** |16  |56  |800  |500 |48000 |64 / 64x500 |8 |

### DSv2-series
|Size     |vCPU     |Memory (GiB) | Temp storage (GiB)  | Max OS disk throughput (IOPS) | Max temp storage throughput (IOPS) | Max data disks / throughput (IOPS) | Max NICs |
|--------------------|----|----|----|-----|------|-------------|---------|
|**Standard_DS1_v2** |1   |3.5 |7   |1000 |4000  |4 / 4x2300   |2 |
|**Standard_DS2_v2** |2   |7   |14  |1000 |8000  |8 / 8x2300   |2 |
|**Standard_DS3_v2** |4   |14  |28  |1000 |16000 |16 / 16x2300 |4 |
|**Standard_DS4_v2** |8   |28  |56  |1000 |32000 |32 / 32x2300 |8 |
|**Standard_DS5_v2** |16  |56  |112 |1000 |64000 |64 / 64x2300 |8 |

### Dv2-series
|Size     |vCPU     |Memory (GiB) | Temp storage (GiB)  | Max OS disk throughput (IOPS) | Max temp storage throughput (IOPS) | Max data disks / throughput (IOPS) | Max NICs |
|--------------------|----|----|-----|----|-------|-------------|---------|
|**Standard_D11_v2** |2   |14  |100  |500 |6000   |8 / 8x500    |2 |
|**Standard_D12_v2** |4   |28  |200  |500 |12000  |16 / 16x500  |4 |
|**Standard_D13_v2** |8   |56  |400  |500 |24000  |32 / 32x500  |8 |
|**Standard_D14_v2** |16  |112 |800  |500 |48000  |64 / 64x500  |8 |


### DSv2-series
|Size     |vCPU     |Memory (GiB) | Temp storage (GiB)  | Max OS disk throughput (IOPS) | Max temp storage throughput (IOPS) | Max data disks / throughput (IOPS) | Max NICs |
|---------------------|----|----|-----|-----|-------|--------------|---------|
|**Standard_DS11_v2** |2   |14  |28   |1000 |8000   |4 / 4x2300    |2 |
|**Standard_DS12_v2** |4   |28  |56   |1000 |16000  |8 / 8x2300    |4 |
|**Standard_DS13_v2** |8   |56  |112  |1000 |32000  |16 / 16x2300  |8 |
|**Standard_DS14_v2** |16  |112 |224  |1000 |64000  |32 / 32x2300  |8 |

For more information, go to [Dv2 series on General Purpose VM sizes](../articles/virtual-machines/dv2-dsv2-series.md#dv2-series).
