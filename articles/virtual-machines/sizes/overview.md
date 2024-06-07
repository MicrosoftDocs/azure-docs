---
title: Virtual machine sizes overview 
description: Lists the different instance sizes available for virtual machines in Azure.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/06/2024
ms.author: mattmcinnes
---

# Sizes for virtual machines in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure Virtual Machine (VM) sizes are designed to provide a wide range of options for hosting your servers and their workloads in the cloud. Sizes are categorized into different families and types, each optimized for specific purposes. Users can choose the most suitable VM size based on their requirements, such as CPU, memory, storage, and network bandwidth.

This article describes what sizes are, gives an overview of the available sizes and shows different options for Azure virtual machine instances you can use to run your apps and workloads.

> [!TIP]
> Try the **[Virtual machines selector tool](https://aka.ms/vm-selector)** to find other sizes that best fit your workload.

:::image type="content" source="./media/azure-vms-thumb.jpg" alt-text="YouTube video for selecting the right size for your VM." link="https://youtu.be/zOSvnJFd3ZM":::

## VM size and series naming

Azure VM sizes follow specific naming conventions to denote varying features and specifications. Each character in the name represents different aspects of the VM. These include the VM family, number of vCPUs, and extra features like premium storage or included accelerators.

VM naming is further broken down into the 'Series' name and the 'Size' name. Size names include extra characters representing the number of vCPUs, type of storage, etc.

| Category | Description | Links |
|---| --- | --- |
| **Type** | 	Basic categorization by intended workload. | [General purpose](#general-purpose) <br>[Compute optimized](#compute-optimized) <br>[Memory optimized](#memory-optimized) <br>[Storage optimized](#storage-optimized) <br>[GPU accelerated](#gpu-accelerated) <br>[FPGA accelerated](#fpga-accelerated) |
| **Series** | Group of sizes with similar hardware and features.| [Enter the 'Series' tab here.](#name-structure-breakdown) |
| **Size** | Specific VM configuration, including vCPUs, memory, and accelerators. | [Enter the 'Size' tab here.](#name-structure-breakdown) |

### Name structure breakdown

#### [Series](#tab/breakdownseries)

Here's a breakdown of a 'General purpose, **DCads_v5**-series' size series.

:::image type="content" source="./media/size-series-breakdown.png" alt-text="Graphic showing a breakdown of the DCadsv5 VM size series with text describing each letter and section of the name.":::
<sup>1</sup> Most families are represented using one letter, but others such as GPU sizes (`ND-series`, `NV-series`, etc.) use two.
<br><sup>2</sup> Most subfamilies are represented with a single upper case letter, but others (such as `Ebsv5-series`) are still considered subfamilies of their parent family due to feature differences.
<br><sup>3</sup> If no feature letter for a CPU is listed, the series uses Intel x86-64 CPUs. If the CPU is AMD, it's listed as `a`. If the CPU is ARM based (Microsoft Cobalt or Ampere Altra), it's listed as `p`.
<br><sup>4</sup> There can be any number of extra features in a size name. There could be none (`Dv5-series`) or there could be three (`Dplds_v6-series`).
<br><sup>5</sup> Version numbers only appear in the size name if there are multiple versions of the same series. If you're using the first version of a series (`HB-series`, `B-series`, etc.) it's often not included in the size name.

> [!NOTE]
> Not all sizes will have subfamilies, support accelerators, or specify the CPU vendor. For more information on VM size naming conventions, see **[Azure VM sizes naming conventions](../vm-naming-conventions.md)**.

#### [Size](#tab/breakdownsize)

Here's a breakdown of a 'Standard_**DC8ads_v5**' size in the 'DCadsv5-series'

:::image type="content" source="./media/size-instance-breakdown.png" alt-text="Graphic showing a breakdown of the DC8ads_v5 VM size with text describing each letter and section of the name.":::
<sup>1</sup> Most families are represented using one letter, but others such as GPU sizes (`ND-series`, `NV-series`, etc.) use two.
<br><sup>2</sup> Most subfamilies are represented with a single upper case letter, but others (such as `Ebsv5-series`) are still considered subfamilies of their parent family due to feature differences.
<br><sup>3</sup> If no feature letter for a CPU is listed, the series uses Intel x86-64 CPUs. If the CPU is AMD, it will be listed as `a`. If the CPU is ARM based (Microsoft Cobalt or Ampere Altra), it will be listed as `p`.
<br><sup>4</sup> There can be any number of extra features in a size name. There could be none (`Dv5-series`) or there could be three (`Dplds_v6-series`).
<br><sup>5</sup> Spacers can show up multiple times in a size name such as in the `ND_H100_v5-series`. In this case they separate the GPU ID from the rest of the size name.
<br><sup>6</sup> Version numbers only appear in the size name if there are multiple versions of the same series. If you're using the first version of a series (`HB-series`, `B-series`, etc.) it's often not included in the size name.

> [!NOTE]
> Not all sizes will have subfamilies, support accelerators, or specify the CPU vendor. For more information on VM size naming conventions, see **[Azure VM sizes naming conventions](../vm-naming-conventions.md)**.

---

## List of VM size families by type

This section contains a list of all current generation size series with tabs dedicated to each size family. Each group has a 'Series List' column with a linked list of all available size series, These links will bring you to the family page for that series, where you can find detailed information on each size in that series or go to the series' page for a list of sizes in that series. 

To learn more about a size family, click the 'family' tab under each type section. There you can read a summary on the family, see the workloads it's recommended for, and view the full family page with specifications for all series in that family.

### General purpose
General purpose VM sizes provide balanced CPU-to-memory ratio. Ideal for testing and development, small to medium databases, and low to medium traffic web servers.

#### [Family list](#tab/generalsizelist)
| Family | Workloads | Series List |
|----|---|---|
| [A-family](./general-purpose/a-family.md)  | Entry-level economical |  [Av2-series](./general-purpose/a-family.md#av2-series) <br> [Previous-gen A-family series](./previous-gen-sizes-list.md#general-purpose-previous-gen-sizes) |
| [B-family](./general-purpose/b-family.md)  | Burstable | [Bsv2-series](./general-purpose/b-family.md#bsv2-series) <br> [Basv2-series](./general-purpose/b-family.md#basv2-series) <br> [Bpsv2-series](./general-purpose/b-family.md#bpsv2-series) |
| [D-family](./general-purpose/d-family.md) | Enterprise-grade applications <br> Relational databases <br> In-memory caching <br> Data analytics | [Dpsv6-series](./general-purpose/d-family.md#dpsv6-series) and [Dplsv6-series](./general-purpose/d-family.md#dplsv6-series ) <br> [Dpdsv6-series](./general-purpose/d-family.md#dpdsv6-series) and [Dpldsv6-series](./general-purpose/d-family.md#dpldsv6-series) <br> [Dalsv6 and Daldsv6-series](./general-purpose/d-family.md#dalsv6-and-daldsv6-series) <br> [Dpsv5 and Dpdsv5-series](./general-purpose/d-family.md#dpsv5-and-dpdsv5-series) <br> [Dpldsv5 and Dpldsv5-series](./general-purpose/d-family.md#dplsv5-and-dpldsv5-series) <br> [Dlsv5 and Dldsv5-series](./general-purpose/d-family.md#dlsv5-and-dldsv5-series) <br> [Dv5 and Dsv5-series](./general-purpose/d-family.md#dv5-and-dsv5-series) <br> [Ddv5 and Ddsv5-series](./general-purpose/d-family.md#ddv5-and-ddsv5-series) <br> [Dasv5 and Dadsv5-series](./general-purpose/d-family.md#dasv5-and-dadsv5-series) <br> [Previous-gen D-family series](./previous-gen-sizes-list.md#general-purpose-previous-gen-sizes) |
| [DC-family](./general-purpose/dc-family.md) | D-family with confidential computing | [DCasv5 and DCadsv5-series](./general-purpose/dc-family.md#dcasv5-and-dcadsv5-series) <br> [DCas_cc_v5 and DCads_cc_v5-series](./general-purpose/dc-family.md#dcas_cc_v5-and-dcads_cc_v5-series) <br> [DCesv5 and DCedsv5-series](./general-purpose/dc-family.md#dcesv5-and-dcedsv5-series) <br> [DCsv3 and DCdsv3-series](./general-purpose/dc-family.md#dcsv3-and-dcdsv3-series) <br> [Previous-gen DC-family](./previous-gen-sizes-list.md#general-purpose-previous-gen-sizes)|




#### [A family](#tab/gen-a-fam)
##### A family
[!INCLUDE [a-family-summary](./general-purpose/includes/a-family-summary.md)]

[View the full A family page](./general-purpose/a-family.md)
[!INCLUDE [a-family-workloads](./general-purpose/includes/a-family-workloads.md)]


#### [B family](#tab/gen-b-fam)
##### B family
[!INCLUDE [b-family-summary](./general-purpose/includes/b-family-summary.md)]

[View the full B family page](./general-purpose/b-family.md)
[!INCLUDE [b-family-workloads](./general-purpose/includes/b-family-workloads.md)]


#### [D family](#tab/gen-d-fam)
##### D family
[!INCLUDE [d-family-summary](./general-purpose/includes/d-family-summary.md)]

[View the full D family page](./general-purpose/d-family.md)
[!INCLUDE [d-family-workloads](./general-purpose/includes/d-family-workloads.md)]


#### [DC family](#tab/gen-dc-fam)
##### DC family
[!INCLUDE [dc-family-summary](./general-purpose/includes/dc-family-summary.md)]

[View the full DC family page](./general-purpose/dc-family.md)
[!INCLUDE [dc-family-workloads](./general-purpose/includes/dc-family-workloads.md)]

---
### Compute optimized
Compute optimized VM sizes have a high CPU-to-memory ratio. These sizes are good for medium traffic web servers, network appliances, batch processes, and application servers.

#### [Family list](#tab/computesizelist)
List of compute optimized VM size families:

| Family | Workloads | Series List |
|----|---|---|
| [F-family](./compute-optimized/f-family.md)  | Medium traffic web servers <br> Network appliances <br> Batch processes <br> Application servers | [Fasv6 and Falsv6-series](./compute-optimized/f-family.md#fasv6-and-falsv6-series) <br> [Fsv2-series](./compute-optimized/f-family.md#fsv2-series) <br> [Previous-gen F-family](./previous-gen-sizes-list.md)|
| [FX-family](./compute-optimized/fx-family.md)  | Electronic Design Automation (EDA) <br> Large memory relational databases <br> Medium to large caches <br> In-memory analytics | [FX-series](./compute-optimized/fx-family.md#fx-series) |

To learn more about a specific size family or series, click the tab for that family and scroll to find your desired size series. 


#### [F family](#tab/comp-a-fam)
##### F family
[!INCLUDE [f-family-summary](./compute-optimized/includes/f-family-summary.md)]

[View the full F family page](./compute-optimized/f-family.md)
[!INCLUDE [f-series-workloads](./compute-optimized/includes/f-family-workloads.md)]


#### [FX family](#tab/comp-fx-fam)
##### FX family
[!INCLUDE [fx-family-summary](./compute-optimized/includes/fx-family-summary.md)]

[View the full FX family page](./compute-optimized/fx-family.md)
[!INCLUDE [fx-series-workloads](./compute-optimized/includes/fx-family-workloads.md)]


---
### Memory optimized
Memory optimized VM sizes offer a high memory-to-CPU ratio that is great for relational database servers, medium to large caches, and in-memory analytics.

#### [Family list](#tab/memorysizelist)
List of memory optimized VM sizes with links to each series' family page section:

| Family | Workloads | Series List |
|----|---|---|
| [E-family](./memory-optimized/e-family.md)  | Relational databases <br> Medium to large caches <br> In-memory analytics |[Easv6 and Eadsv6-series](./memory-optimized/e-family.md#easv6-and-eadsv6-series)<br> [Ev5 and Esv5-series](./memory-optimized/e-family.md#ev5-and-esv5-series)<br> [Edv5 and Edsv5-series](./memory-optimized/e-family.md#edv5-and-edsv5-series)<br> [Easv5 and Eadsv5-series](./memory-optimized/e-family.md#easv5-and-eadsv5-series)<br> [Epsv5 and Epdsv5-series](./memory-optimized/e-family.md#epsv5-and-epdsv5-series)<br> [Previous-gen families](./previous-gen-sizes-list.md#memory-optimized-previous-gen-sizes) |
| [Eb-family](./memory-optimized/e-family.md)  | E-family with High remote storage performance | [Ebdsv5 and Ebsv5-series](./memory-optimized/eb-family.md#ebdsv5-and-ebsv5-series) |
| [EC-family](./memory-optimized/ec-family.md)  | E-family with confidential computing | [ECasv5 and ECadsv5-series](./memory-optimized/ec-family.md#ecasv5-and-ecadsv5-series)<br> [ECas_cc_v5 and ECads_cc_v5-series](./memory-optimized/ec-family.md#ecasccv5-and-ecadsccv5-series)<br> [ECesv5 and ECedsv5-series](./memory-optimized/ec-family.md#ecesv5-and-ecedsv5-series) |
| [M-family](./memory-optimized/m-family.md)  | Extremely large databases <br> Large amounts of memory | [Msv3 and Mdsv3-series](./memory-optimized/m-family.md#msv3-and-mdsv3-series)<br> [Mv2-series](./memory-optimized/m-family.md#mv2-series)<br> [Msv2 and Mdsv2-series](./memory-optimized/m-family.md#msv2-and-mdsv2-series) |
| Other families | Older generation memory optimized sizes | [Previous-gen families](./previous-gen-sizes-list.md#memory-optimized-previous-gen-sizes) |

To learn more about a specific size family or series, click the tab for that family and scroll to find your desired size series. 


#### [E family](#tab/mem-e-fam)
##### E family
[!INCLUDE [e-family-summary](./memory-optimized/includes/e-family-summary.md)]

[View the full E family page](./memory-optimized/e-family.md)
[!INCLUDE [e-series-workloads](./memory-optimized/includes/e-family-workloads.md)]


#### [Eb family](#tab/mem-eb-fam)
##### Eb family
[!INCLUDE [eb-family-summary](./memory-optimized/includes/eb-family-summary.md)]

[View the full Eb family page](./memory-optimized/eb-family.md)
[!INCLUDE [eb-series-workloads](./memory-optimized/includes/eb-family-workloads.md)]


#### [EC family](#tab/mem-ec-fam)
##### EC family
[!INCLUDE [ec-family-summary](./memory-optimized/includes/ec-family-summary.md)]

[View the full EC family page](./memory-optimized/ec-family.md)
[!INCLUDE [ec-series-workloads](./memory-optimized/includes/ec-family-workloads.md)]


#### [M family](#tab/mem-m-fam)
##### M family
[!INCLUDE [m-family-summary](./memory-optimized/includes/m-family-summary.md)]

[View the full M family page](./memory-optimized/m-family.md)
[!INCLUDE [m-series-workloads](./memory-optimized/includes/m-family-workloads.md)]

---
### Storage optimized
Storage optimized virtual machine (VM) sizes offer high disk throughput and IO, and are ideal for Big Data, SQL, NoSQL databases, data warehousing, and large transactional databases. Examples include Cassandra, MongoDB, Cloudera, and Redis. 

#### [Family list](#tab/storagesizelist)
List of storage optimized VM size families:

| Family | Workloads | Series List |
|----|---|---|
| [L-family](./storage-optimized/l-family.md)  | High disk throughput and IO <br> Big Data <br> SQL and NoSQL databases <br> Data warehousing <br> Large transactional databases | [Lsv3-series](./storage-optimized/l-family.md#lsv3-series) <br> [Lasv3-series](./storage-optimized/l-family.md#lasv3-series) <br> [Previous-gen L-family](./previous-gen-sizes-list.md#storage-optimized-previous-gen-sizes)|

To learn more about a specific size family or series, click the tab for that family and scroll to find your desired size series. 

#### [L family](#tab/stor-l-fam)
##### L family
[!INCLUDE [l-family-summary](./storage-optimized/includes/l-family-summary.md)]

[View the full L family page](./storage-optimized/l-family.md)
[!INCLUDE [l-series-workloads](./storage-optimized/includes/l-family-workloads.md)]

---
### GPU accelerated
GPU optimized VM sizes are specialized virtual machines available with single, multiple, or fractional GPUs. These sizes are designed for compute-intensive, graphics-intensive, and visualization workloads.

#### [Family list](#tab/gpusizelist)
List of storage optimized VM size families:

| Family | Workloads | Series List |
|----|---|---|
| [NC-family](./gpu-accelerated/nc-family.md)  | Compute-intensive <br> Graphics-intensive <br> Visualization | [NC-series](./gpu-accelerated/nc-family.md#nc-series-v1) <br> [NCads_H100_v5-series](./gpu-accelerated/nc-family.md#ncads_-_h100_v5-series) <br> [NCv2-series](./gpu-accelerated/nc-family.md#ncv2-series) <br> [NCv3-series](./gpu-accelerated/nc-family.md#ncv3-series) <br> [NCasT4_v3-series](./gpu-accelerated/nc-family.md#ncast4_v3-series) <br> [NC_A100_v4-series](./gpu-accelerated/nc-family.md#nc_a100_v4-series)|
| [ND-family](./gpu-accelerated/nd-family.md)  |  Large memory compute-intensive <br> Large memory graphics-intensive <br> Large memory visualization | [ND_MI300X_v5-series](./gpu-accelerated/nd-family.md#nd_mi300x_v5-series) <br> [ND-H100-v5-series](./gpu-accelerated/nd-family.md#nd_h100_v5-series) <br> [NDm_A100_v4-series](./gpu-accelerated/nd-family.md#ndm_a100_v4-series) <br> [ND_A100_v4-series](./gpu-accelerated/nd-family.md#nd_a100_v4-series) |
| [NG-family](./gpu-accelerated/ng-family.md)  | Virtual Desktop (VDI) <br> Cloud gaming |  [NGads V620-series](./gpu-accelerated/ng-family.md#ngads-v620-series) |
| [NV-family](./gpu-accelerated/nv-family.md)  | Virtual desktop (VDI) <br> Single-precision compute <br> Video encoding and rendering |  [NV-series](./gpu-accelerated/nv-family.md#nv-series-v1) <br> [NVv3-series](./gpu-accelerated/nv-family.md#nvv3-series) <br> [NVv4-series](./gpu-accelerated/nv-family.md#nvv4-series) <br> [NVadsA10_v5-series](./gpu-accelerated/nv-family.md#nvads-a10-v5-series) <br> [Previous-gen NV-family](./previous-gen-sizes-list.md#gpu-accelerated-previous-gen-sizes) |

To learn more about a specific size family or series, click the tab for that family and scroll to find your desired size series. 

#### [NC family](#tab/gpu-nc-fam)
##### NC family
[!INCLUDE [nc-family-summary](./gpu-accelerated/includes/nc-family-summary.md)]

[View the full NC family page](./gpu-accelerated/nc-family.md)
[!INCLUDE [nc-series-workloads](./gpu-accelerated/includes/nc-family-workloads.md)]


#### [ND family](#tab/gpu-nd-fam)
##### ND family
[!INCLUDE [nd-family-summary](./gpu-accelerated/includes/nd-family-summary.md)]

[View the full ND family page](./gpu-accelerated/nd-family.md)
[!INCLUDE [nd-series-workloads](./gpu-accelerated/includes/nd-family-workloads.md)]


#### [NG family](#tab/gpu-ng-fam)
##### NG family
[!INCLUDE [ng-family-summary](./gpu-accelerated/includes/ng-family-summary.md)]

[View the full NG family page](./gpu-accelerated/ng-family.md)
[!INCLUDE [ng-series-workloads](./gpu-accelerated/includes/ng-family-workloads.md)]


#### [NV family](#tab/gpu-nv-fam)
##### NV family
[!INCLUDE [nv-family-summary](./gpu-accelerated/includes/nv-family-summary.md)]

[View the full NV family page](./gpu-accelerated/nv-family.md)
[!INCLUDE [nv-series-workloads](./gpu-accelerated/includes/nv-family-workloads.md)]


---
### FPGA accelerated
FPGA optimized VM sizes are specialized virtual machines available with single or multiple FPGAs. These sizes are designed for compute-intensive workloads. This article provides information about the number and type of FPGAs, vCPUs, data disks, and NICs. Storage throughput and network bandwidth are also included for each size in this grouping.

#### [Family list](#tab/fpgasizelist)
List of field programmable gate array accelerated VM size families:

| Family | Workloads | Series List |
|----|---|---|
| [NP-family](./fpga-accelerated/np-family.md)  | Machine learning inference <br> Video transcoding <br> Database search and analytics | [NP-series](./fpga-accelerated/np-family.md#np-series) |

To learn more about a specific size family or series, click the tab for that family and scroll to find your desired size series. 


#### [NP family](#tab/fpga-np-fam)
##### NP family
[!INCLUDE [np-family-summary](./fpga-accelerated/includes/np-family-summary.md)]

[View the full NP family page](./fpga-accelerated/np-family.md)
[!INCLUDE [np-series-workloads](./fpga-accelerated/includes/np-family-workloads.md)]

---
### High performance compute
Azure High Performance Compute VMs are optimized for various HPC workloads such as computational fluid dynamics, finite element analysis, frontend and backend EDA, rendering, molecular dynamics, computational geoscience, weather simulation, and financial risk analysis.

#### [Family list](#tab/hpcsizelist)
List of high performance computing optimized VM size families:

| Family | Workloads | Series List |
|----|---|---|
| [HB-family](./high-performance-compute/hb-family.md) | High memory bandwidth <br> Fluid Dynamics <br> Weather modeling |  [HB-series](./high-performance-compute/hb-family.md#hb-series-v1) <br> [HBv2-series](./high-performance-compute/hb-family.md#hbv2-series) <br> [HBv3-series](./high-performance-compute/hb-family.md#hbv3-series) <br> [HBv4-series](./high-performance-compute/hb-family.md#hbv4-series) |
| [HC-family](./high-performance-compute/hc-family.md) | High density compute <br> Finite element analysis <br> Molecular dynamics <br> Computational chemistry | [HC-series](./high-performance-compute/hc-family.md#hc-series) |
| [HX-family](./high-performance-compute/hx-family.md) | Large memory capacity <br> Electronic Design Automation (EDA) | [HX-series](./high-performance-compute/hx-family.md#hx-series) |

To learn more about a specific size family or series, click the tab for that family and scroll to find your desired size series. 

#### [H family](#tab/hpc-h-fam)
[!INCLUDE [hb-family-summary](./high-performance-compute/includes/hb-family-summary.md)]

[View the full 'HB' family page](./high-performance-compute/hb-family.md)
[!INCLUDE [hb-series-workloads](./high-performance-compute/includes/hb-family-workloads.md)]


#### [HC family](#tab/hpc-hc-fam)
[!INCLUDE [hc-family-summary](./high-performance-compute/includes/hc-family-summary.md)]

[View the full HC family page](./high-performance-compute/hc-family.md)
[!INCLUDE [hc-series-workloads](./high-performance-compute/includes/hc-family-workloads.md)]


#### [HX family](#tab/hpc-hx-fam)
[!INCLUDE [hx-family-summary](./high-performance-compute/includes/hx-family-summary.md)]

[View the full HX family page](./high-performance-compute/hx-family.md)
[!INCLUDE [hx-series-workloads](./high-performance-compute/includes/hx-family-workloads.md)]

---

## Learn platform sizes content
- For information about pricing of the various sizes, see the pricing pages for [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/#Linux) or [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/Windows/#Windows).
- Want to change the size of your VM? See [Change the size of a VM](./resize-vm.md).
- For availability of VM sizes in Azure regions, see [Products available by region](https://azure.microsoft.com/regions/services/).
- To see general limits on Azure VMs, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
- For more information on how Azure names its VMs, see [Azure virtual machine sizes naming conventions](../vm-naming-conventions.md).

## REST API

For information on using the REST API to query for VM sizes, see the following:

- [List available virtual machine sizes for resizing](/rest/api/compute/virtualmachines/listavailablesizes)
- [List available virtual machine sizes for a subscription](/rest/api/compute/resourceskus/list)
- [List available virtual machine sizes in an availability set](/rest/api/compute/availabilitysets/listavailablesizes)


## Benchmark scores

Learn more about compute performance for Linux VMs using the [CoreMark benchmark scores](../linux/compute-benchmark-scores.md).

Learn more about compute performance for Windows VMs using the [SPECInt benchmark scores](../windows/compute-benchmark-scores.md).


[!INCLUDE [sizes-footer](./includes/sizes-footer.md)]
