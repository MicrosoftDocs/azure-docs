---
title:       B Series CPU Credit Model
description: Overview of B Series CPU Credit Model
author:      iamwilliew 
ms.author:   wwilliams 
ms.service:  virtual-machines
ms.subservice:   sizes
ms.topic:    conceptual
ms.date:     09/12/2023
---

# B Series CPU Credit Model

While traditional Azure virtual machines provide fixed CPU performance, B-series virtual machines are the only VM type that use credits for CPU performance provisioning. B-series VMs utilize a CPU credit model to track how much CPU is consumed - the virtual machine accumulates CPU credits when a workload is operating below the base CPU performance threshold and, uses credits when running above the base CPU performance threshold until all of its credits are consumed. Upon consuming all the CPU credits, a B-series virtual machine is throttled back to its base CPU performance until it accumulates the credits to CPU burst again.

## Credit concepts and definitions 
- Base CPU performance = The minimum CPU performance threshold a VM will have available always. This level sets the bar for net credit accumulation when the CPU utilization is below the base CPU performance level and, net credit consumption when the CPU utilization is above the base CPU performance. 

- Initial Credits = The number of credits allocated to a B-series virtual machine when a VM is deployed. 

- Credits banked/hour = The number of credits a B-seires virtual machine accumulates per hour if the VM is idle (no CPU performance consumption). 

- Max Banked Credits = The maximum number/upper limit of credits a B-seires virtual machine can accumulate. Upon reaching this upper limit, a B-series VM can no longer accumulate more credits.    

- CPU Credits Consumed = The number of CPU credits spent during the measurement time-period.

- CPU Credits Remaining = The number of CPU credits available to consume for a given B-series VM.

- Percentage CPU = CPU performance of a given VM during a measurement period. 


## Credits accumulation and consumption
The credit accumulation and consumption rates are set such that a VM running at exactly its base performance level will have neither a net accumulation or consumption of bursting credits. A VM has a net credit increase whenever it's running below its base CPU performance level and will have a net decrease in credits whenever the VM is utilizing the CPU more than its base CPU performance level.

To conduct calculations on credit accumulations and consumptions, customers can utilize the holistic 'credits banked per minute' formula => 
`((Base CPU performance * number of vCPU)/2 - (Percentage CPU * number of vCPU)/2)/100`.  

Putting this calculation into action, let's say that a customer deploys the Standard_B2ts_v2 VM size and their workload demands 10% of the 'Percentage CPU' or CPU performance, then the 'credits banked per minute' calculation will be as follows: `((20%*2)/2 - (10%*2)/2)/100 = 0.1 credits/minute`. In such a scenario, a B-series VM is accumulating credits given the 'Percentage CPU'/ CPU performance requirement is below the 'Base CPU performance' of the Standard_B2ts_v2. 

Similarly, utilizing the example of a Standard_B32as_v2 VM size, if the workload demands 60% of the CPU performance for a measurement of time - then the 'credits banked per minute' calculation will be as follows: `((40%*32)/2 - (60%*32)/2)/100 =  (6.4 - 9.6)/100 = -3.2 credits per minute`. Here the negative result implies the B-series VM is consuming credits given the 'Percentage CPU'/CPU performance requirement is above the 'Base CPU performance' of the Standard_B32as_v2.  
 

## Credit monitoring
To monitor B-series specific credit metrics, customers can utilize the Azure monitor data platform, see [Overview of metrics in Microsoft Azure](../../azure-monitor/data-platform.md). Azure monitor data platform can be accessed via the Azure portal and other orchestration paths, and via programmatic API calls to Azure monitor.
Via Azure monitor data platform, customers can access B-series credit model-specific metrics such as 'CPU Credits Consumed', 'CPU Credits Remaining', and 'Percentage CPU' for their given B-series size in real time.  


## Other sizes and information

- [General purpose](../sizes-general.md)
- [Compute optimized](../sizes-compute.md)
- [Memory optimized](../sizes-memory.md)
- [Storage optimized](../sizes-storage.md)
- [GPU optimized](../sizes-gpu.md)
- [High performance compute](../sizes-hpc.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

More information on Disks Types: [Disk Types](../disks-types.md#ultra-disks)
