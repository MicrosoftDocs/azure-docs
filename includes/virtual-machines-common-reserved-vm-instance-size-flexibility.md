---
author: yashar
ms.author: banders
ms.service: virtual-machines-windows 
ms.topic: include 
ms.date: 11-20-2018 
---
# Virtual machine size flexibility with Reserved VM Instances

With a reserved virtual machine instance that's optimized for instance size flexibility, the reservation you buy can apply to the virtual machines (VMs) sizes in the same size series group. For example, if you buy a reservation for a VM size that's listed in the DSv2-series table, like Standard_DS5_v2, the reservation discount can apply to the other four sizes that are listed in that same table:

- Standard_DS1_v2
- Standard_DS2_v2
- Standard_DS3_v2
- Standard_DS4_v2

But that reservation discount doesn't apply to VMs sizes that are listed in different tables, like what's in the DSv2-series high memory table: Standard_DS11_v2, Standard_DS12_v2, and so on.

Within the size series group, the number of VMs the reservation discount applies to depends on the VM size you pick when you buy a reservation. It also depends on the sizes of the VMs that you have running. The ratio column that's listed in the following tables compares the relative footprint for each VM size in that group. Use the ratio value to calculate how the reservation discount applies to the VMs you have running.

## Examples

The following examples use the sizes and ratios in the DSv2-series table.

 You buy a reserved VM instance with the size Standard_DS4_v2 where the ratio or relative footprint compared to the other sizes in that series is 8.

- Scenario 1: Run eight Standard_DS1_v2 sized VMs with a ratio of 1. Your reservation discount applies to all eight of those VMs.
- Scenario 2: Run two Standard_DS2_v2 sized VMs with a ratio of 2 each. Also run a Standard_DS3_v2 sized VM with a ratio of 4. The total footprint is 2+2+4=8. So your reservation discount applies to all three of those VMs.
- Scenario 3: Run one Standard_DS5_v2 with a ratio of 16. Your reservation discount applies to half that VM's compute cost.

The following sections show what sizes are in the same size series group when you buy a reserved VM instance optimized for instance size flexibility.

## B-series

| Size | Ratio|
|---|---|
| Standard_B1s | 1 |
|Standard_B2s|4|

For more information, see [B-series burstable virtual machine sizes](../articles/virtual-machines/windows/b-series-burstable.md).

## B-series high memory

| Size | Ratio|
|---|---|
| Standard_B1ms |1|
|Standard_B2ms|4|
|Standard_B4ms|8|
|Standard_B8ms|16|

For more information, see [B-series burstable virtual machine sizes](../articles/virtual-machines/windows/b-series-burstable.md).

## D-series

| Size | Ratio|
|---|---|
| Standard_D1|1|
|Standard_D2|2|
|Standard_D3|4|
|Standard_D4|8|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## D-series high memory

| Size | Ratio|
|---|---|
| Standard_D11|1|
|Standard_D12|2|
|Standard_D13|4|
|Standard_D14|8|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## Ds-series

| Size | Ratio|
|---|---|
|Standard_DS1|1|
|Standard_DS2|2|
|Standard_DS3|4|
|Standard_DS4|8|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## Ds-series high memory

| Size | Ratio|
|---|---|
|Standard_DS11|1|
|Standard_DS12|2|
|Standard_DS13|4|
|Standard_DS14|8|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## DSv2-series

| Size | Ratio|
|---|---|
|Standard_DS1_v2|1|
|Standard_DS2_v2|2|
|Standard_DS3_v2|4|
|Standard_DS4_v2|8|
|Standard_DS5_v2|16|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## DSv2-series high memory

| Size | Ratio|
|---|---|
|Standard_DS11_v2|1|
|Standard_DS11-1_v2|1|
|Standard_DS12_v2|2|
|Standard_DS12-1_v2|2|
|Standard_DS12-2_v2|2|
|Standard_DS13_v2|4|
|Standard_DS13-2_v2|4|
|Standard_DS13-4_v2|4|
|Standard_DS14_v2|8|
|Standard_DS14-4_v2|8|
|Standard_DS14-8_v2|8|
|Standard_DS15_v2|10|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## DSv3-series

| Size | Ratio|
|---|---|
|Standard_D2s_v3|1|
|Standard_D4s_v3|2|
|Standard_D8s_v3|4|
|Standard_D16s_v3|8|
|Standard_D32s_v3|16|
|Standard_D64s_v3|32|

For more information, see [General purpose virtual machine sizes](../articles/virtual-machines/windows/sizes-general.md#dsv3-series-1).

## Dv2-series

| Size | Ratio|
|---|---|
|Standard_D1_v2|1|
|Standard_D2_v2|2|
|Standard_D3_v2|4|
|Standard_D4_v2|8|
|Standard_D5_v2|16|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## Dv2-series high memory

| Size | Ratio|
|---|---|
|Standard_D11_v2|1|
|Standard_D12_v2|2|
|Standard_D13_v2|4|
|Standard_D14_v2|8|
|Standard_D15_v2|10|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## Dv3-series

| Size | Ratio|
|---|---|
| Standard_D2_v3|1|
|Standard_D4_v3|2|
|Standard_D8_v3|4|
|Standard_D16_v3|8|
|Standard_D32_v3|16|
|Standard_D64_v3|32|

For more information, see [General purpose virtual machine sizes](../articles/virtual-machines/windows/sizes-general.md#dv3-series-1).

## ESv3-series

| Size | Ratio|
|---|---|
|Standard_E2s_v3|1|
|Standard_E4s_v3|2|
|Standard_E4-2s_v3|2|
|Standard_E8s_v3|4|
|Standard_E8-2s_v3|4|
|Standard_E8-4s_v3|4|
|Standard_E16s_v3|8|
|Standard_E16-4s_v3|8|
|Standard_E16-8s_v3|8|
|Standard_E20s_v3|10|
|Standard_E32s_v3|16|
|Standard_E32-8s_v3|16|
|Standard_E32-16s_v3|16|
|Standard_E64s_v3|28.8|
|Standard_E64-16s_v3|28.8|
|Standard_E64-32s_v3|28.8|

For more information, see [Memory optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-memory.md#esv3-series).

## Ev3-series

| Size | Ratio|
|---|---|
| Standard_E2_v3|1|
|Standard_E4_v3|2|
|Standard_E8_v3|4|
|Standard_E16_v3|8|
|Standard_E20_v3|10|
|Standard_E32_v3|16|
|Standard_E64_v3|32|

For more information, see [Memory optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-memory.md#ev3-series).

## F-series

| Size | Ratio|
|---|---|
| Standard_F1|1|
|Standard_F2|2|
|Standard_F4|4|
|Standard_F8|8|
Standard_F16|16|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## FS-series

| Size | Ratio|
|---|---|
| Standard_F1s|1|
|Standard_F2s|2|
|Standard_F4s|4|
|Standard_F8s|8|
|Standard_F16s|16|

For more information, see [Previous generations of virtual machine sizes](../articles/virtual-machines/windows/sizes-previous-gen.md).

## Fsv2-series

| Size | Ratio|
|---|---|
|Standard_F2s_v2|1|
|Standard_F4s_v2|2|
|Standard_F8s_v2|4|
|Standard_F16s_v2|8|
|Standard_F32s_v2|16|
|Standard_F64s_v2|32|
|Standard_F72s_v2|36|

For more information, see [Compute optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-compute.md#fsv2-series-1).

## H-series

| Size | Ratio|
|---|---|
| Standard_H8|1|
|Standard_H16|2|

For more information, see [High performance compute VM sizes](../articles/virtual-machines/windows/sizes-hpc.md).

## H-series high memory

| Size | Ratio|
|---|---|
| Standard_H8m|1|
|Standard_H16m|2|

For more information, see [High performance compute VM sizes](../articles/virtual-machines/windows/sizes-hpc.md).

## Ls-series

| Size | Ratio|
|---|---|
| Standard_L4s|1|
|Standard_L8s|2|
|Standard_L16s|4|
|Standard_L32s|8|

For more information, see [Storage optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-storage.md).

## M-series

| Size | Ratio|
|---|---|
| Standard_M64s|1|
|Standard_M128s|2|

For more information, see [Memory optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-memory.md#m-series).

## M-series fractional

| Size | Ratio|
|---|---|
| Standard_M16s|1|
|Standard_M32s|2|

For more information, see [Memory optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-memory.md#m-series).

## M-series fractional high memory

| Size | Ratio|
|---|---|
|Standard_M8ms|1|
|Standard_M8-2ms|1|
|Standard_M8-4ms|1|
|Standard_M16ms|2|
|Standard_M16-4ms|2|
|Standard_M16-8ms|2|
|Standard_M32ms|4|
|Standard_M32-8ms|4|
|Standard_M32-16ms|4|

For more information, see [Memory optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-memory.md#m-series).

## M-series fractional large

| Size | Ratio|
|---|---|
| Standard_M32ls|1|
|Standard_M64ls|2|

For more information, see [Memory optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-memory.md#m-series).

## M-series high memory

| Size | Ratio|
|---|---|
| Standard_M64ms|1|
|Standard_M64-16ms|1|
|Standard_M64-32ms|1|
|Standard_M128ms|2|
|Standard_M128-32ms|2|
|Standard_M128-64ms|2|

For more information, see [Memory optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-memory.md#m-series).

## NC-series

| Size | Ratio|
|---|---|
| Standard_NC6|1|
|Standard_NC12|2|
|Standard_NC24|4|

For more information, see [GPU optimized virtual machine sizes](../articles/virtual-machines/windows/sizes-gpu.md).

## NCv2-series

| Size | Ratio|
|---|---|
| Standard_NC6s_v2|1|
|Standard_NC12s_v2|2|
|Standard_NC24s_v2|4|

For more information, see [GPU optimized virtual machine sizes](../articles/virtual-machines/windows//sizes-gpu.md#ncv2-series).

## NCv3-series

| Size | Ratio|
|---|---|
| Standard_NC6s_v3|1|
|Standard_NC12s_v3|2|
|Standard_NC24s_v3|4|

For more information, see [GPU optimized virtual machine sizes](../articles/virtual-machines/windows//sizes-gpu.md#ncv3-series).

## ND-series

| Size | Ratio|
|---|---|
| Standard_ND6s|1|
|Standard_ND12s|2|
|Standard_ND24s|4|

For more information, see [GPU optimized virtual machine sizes](../articles/virtual-machines/windows//sizes-gpu.md#nd-series).

## NV-series

| Size | Ratio|
|---|---|
| Standard_NV6|1|
|Standard_NV12|2|
|Standard_NV24|4|

For more information, see [GPU optimized virtual machine sizes](../articles/virtual-machines/windows//sizes-gpu.md#nv-series).


