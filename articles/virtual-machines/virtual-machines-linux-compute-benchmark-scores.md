<properties
 pageTitle="Compute benchmark scores for Linux VMs | Microsoft Azure"
 description="Compare CoreMark compute benchmark scores for Azure VMs running Linux"
 services="virtual-machines-linux"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>
<tags
ms.service="virtual-machines-linux"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="infrastructure-services"
 ms.date="07/18/2016"
 ms.author="danlep"/>

# Compute benchmark scores for Linux VMs

The following CoreMark benchmark scores show compute performance for Azure's high performance VM lineup running Ubuntu. Compute benchmark scores are also available for [Windows VMs](virtual-machines-windows-compute-benchmark-scores.md).




## A-series - compute-intensive


Size | vCPUs | NUMA nodes | CPU | Runs | Iterations/sec | StdDev
------- | ------ | ---- | -------| ---- | ---- | -----
Standard_A8 | 8 | 1 | Intel Xeon CPU E5-2670 0 @ 2.6 GHz| 179 | 110,294 | 554
Standard_A9 | 16 | 2 | Intel Xeon CPU E5-2670 0 @ 2.6 GHz| 189 | 210,816| 2,126
Standard_A10 | 8 | 1 | Intel Xeon CPU E5-2670 0 @ 2.6 GHz| 188 | 110,025 | 1,045
Standard_A11 | 16 | 2 | Intel Xeon CPU E5-2670 0 @ 2.6 GHz| 188 | 210,727| 2,073

## Dv2-series


Size | vCPUs | NUMA nodes | CPU | Runs | Iterations/sec | StdDev
------- | ------ | ---- | -------| ---- | ---- | -----
Standard_D1_v2 | 1 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 140 | 14,852 | 780
Standard_D2_v2 | 2 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 133 | 29,467 | 1,863
Standard_D3_v2 | 4 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 139 | 56,205 | 1,167
Standard_D4_v2 | 8 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 126 | 108,543 | 3,446
Standard_D5_v2 | 16 | 2 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 126 | 205,332 | 9,998
Standard_D11_v2 | 2 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 125 | 28,598 | 1,510
Standard_D12_v2 | 4 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 131 | 55,673 | 1,418
Standard_D13_v2 | 8 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 140 | 107,986 | 3,089
Standard_D14_v2 | 16 | 2 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 140 | 208,186 | 8,839
Standard_D15_v2	| 20 | 2 | Intel Xeon E5-2673 v3 @ 2.4 GHz |28 | 268,560 | 4,667

## F-series

Size | vCPUs | NUMA nodes | CPU | Runs | Iterations/sec | StdDev
------- | ------ | ---- | -------| ---- | ---- | -----
Standard_F1 | 1 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 154 | 15,602 | 787
Standard_F2 | 2 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 126 | 29,519 | 1,233
Standard_F4 | 4 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 147 | 58,709 | 1,227
Standard_F8 | 8 | 1 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 224 | 112,772 | 3,006
Standard_F16 | 16 | 2 | Intel Xeon E5-2673 v3 @ 2.4 GHz | 42 | 218,571 | 5,113



## G-series


Size | vCPUs | NUMA nodes | CPU | Runs | Iterations/sec | StdDev
------- | ------ | ---- | -------| ---- | ---- | -----
Standard_G1 | 2 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 83 | 31,310 | 2,891
Standard_G2 | 4 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 84 | 60,112 | 3,537
Standard_G3 | 8 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 84 | 107,522 | 4,537
Standard_G4 | 16 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 83 | 195,116 | 5,024
Standard_G5 | 32 | 2 | Intel Xeon E5-2698B v3 @ 2 GHz | 84 | 360,329 | 14,212

## GS-series


Size | vCPUs | NUMA nodes | CPU | Runs | Iterations/sec | StdDev
------- | ------ | ---- | -------| ---- | ---- | -----
Standard_GS1 | 2 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 84 | 28,613 | 1,884
Standard_GS2 | 4 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 83 | 54,348 | 3,474
Standard_GS3 | 8 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 83 | 104,564 | 1,834
Standard_GS4 | 16 | 1 | Intel Xeon E5-2698B v3 @ 2 GHz | 84 | 194,111 | 4,735
Standard_GS5 | 32 | 2 | Intel Xeon E5-2698B v3 @ 2 GHz | 84 | 357,396 | 16,228


## About CoreMark

Linux numbers were computed by running [CoreMark](http://www.eembc.org/coremark/faq.php) on Ubuntu. CoreMark was configured with the number of threads set to the number of virtual CPUs and concurrency set to PThreads. The target number of iterations was adjusted based on expected performance to provide a runtime of at least 20 seconds (typically much longer), with the final score representing the number of iterations completed divided by the number of seconds it took to run the test.  Each test was run at least seven times on each VM.  Tests were run in October 2015 on multiple VMs in every Azure public region the VM was supported in on the date run.
## Next steps



* For storage capacities, disk details, and additional considerations for choosing among VM sizes, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

* To run the CoreMark scripts on Linux VMs, download the [CoreMark script pack](http://download.microsoft.com/download/3/0/5/305A3707-4D3A-4599-9670-AAEB423B4663/AzureCoreMarkScriptPack.zip).
