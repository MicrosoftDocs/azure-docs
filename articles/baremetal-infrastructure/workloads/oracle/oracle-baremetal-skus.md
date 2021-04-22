---
title: BareMetal SKUs for Oracle workloads
description: Learn about the SKUs for the Oracle BareMetal Infrastructure workloads.
ms.topic: reference
ms.subservice: workloads
ms.date: 04/15/2021
---

# BareMetal SKUs for Oracle workloads

In this article, we'll take a look at specialized BareMetal Infrastructure SKUs for Oracle workloads.

BareMetal Infrastructure for Oracle SKUs range from two sockets up to four sockets. You can also choose from various CPU cores and memory sizes to meet the requirements of your workload. Here's a table summarizing features of available SKUs.
 
| **Oracle Certified**  **hardware** | **Model** | **Total Memory** | **Storage** | **Availability** |
| --- | --- | --- | --- | --- |
| YES | SAP HANA on Azure S32m- 2 x Intel® Xeon® I6234 Processor 16 CPU cores and 32 CPU threads | 1.5 TB | --- | Available |
| YES | SAP HANA on Azure S64m- 4 x Intel® Xeon® I6234 Processor 32 CPU cores and 64 CPU threads | 3.0 TB | --- | Available |
| YES | SAP HANA on Azure S96– 2 x Intel® Xeon® E7-8890 v4 Processor 48 CPU cores and 96 CPU threads | 768 GB | 3.0 TB | Available |
| YES | SAP HANA on Azure S224 – 4 x Intel® Xeon® Platinum 8276 processor 112 CPU cores and 224 CPU threads | 3.0 TB | 6.3 TB | Available |
| YES | SAP HANA on Azure S224m– 4 x Intel® Xeon® Platinum 8276 processor 112 CPU cores and 224 CPU threads | 6.0 TB | 10.5 TB | Available |

- CPU cores = sum of non-hyper-threaded CPU cores (the total number of physical processors) of the server unit. 
- CPU threads = sum of compute threads provided by hyper-threaded CPU cores (the total number of logical processors) of the server unit. Most units are configured by default to use Hyper-Threading Technology.
- Servers are dedicated to customers.
- Customer has root access (No hypervisor).
- Servers aren't directly on Azure VNETs.

## Next steps

Learn about the storage offered by BareMetal Infrastructure for Oracle.

> [!div class="nextstepaction"]
> [Storage on BareMetal for Oracle workloads](oracle-baremetal-storage.md)
