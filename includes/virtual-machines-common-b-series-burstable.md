---
 title: include file
 description: include file
 services: virtual-machines
 author: jonbeck7
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/09/2018
 ms.author: azcspmt;jonbeck;cynthn
 ms.custom: include file
---

The B-series VM family allows you to choose which VM size provides you the necessary base level performance for your workload, with the ability to burst CPU performance up to 100% of an Intel® Broadwell E5-2673 v4 2.3 GHz, or an Intel® Haswell 2.4 GHz E5-2673 v3 processor vCPU.

The B-series VMs are ideal for workloads that do not need the full performance of the CPU continuously, like web servers, proof of concepts,  small databases and development build environments. These workloads typically have burstable performance requirements. The B-series provides you with the ability to purchase a VM size with baseline performance and the VM instance builds up credits when it is using less than its baseline. When the VM has accumulated credit, the VM can burst above the baseline using up to 100% of the vCPU when your application requires higher CPU performance.

The B-series comes in the following six VM sizes:

| Size          | vCPU's | Memory: GiB | Temp storage (SSD) GiB | Base CPU Perf of VM | Max CPU Perf of VM | Credits Banked / Hour | Max Banked Credits |
|---------------|--------|-------------|----------------|--------------------------------|---------------------------|-----------------------|--------------------|
| Standard_B1s  | 1      | 1           | 4              | 10%                            | 100%                      | 6                     | 144                |
| Standard_B1ms | 1      | 2           | 4              | 20%                            | 100%                      | 12                    | 288                |
| Standard_B2s  | 2      | 4           | 8              | 40%                            | 200%                      | 24                    | 576                |
| Standard_B2ms | 2      | 8           | 16             | 60%                            | 200%                      | 36                    | 864                |
| Standard_B4ms | 4      | 16          | 32             | 90%                            | 400%                      | 54                    | 1296               |
| Standard_B8ms | 8      | 32          | 64             | 135%                           | 800%                      | 81                    | 1944               |




## Q & A 

### Q: How do you get 135% baseline performance from a VM?
**A**: The 135% is shared amongst the 8 vCPU’s that make up the VM size. For example, if your application uses 4 of the 8 cores working on batch processing and each of those 4 vCPU’s are running at 30% utilization the total amount of VM CPU performance would equal 120%.  Meaning that your VM would be building credit time based on the 15% delta from your baseline performance.  But it also means that when you have credits available that same VM can use 100% of all 8 vCPU’s giving that VM a Max CPU performance of 800%.


### Q: How can I monitor my credit balance and consumption
**A**: We will be introducing 2 new metrics in the coming weeks, the **Credit** metric will allow you to view how many credits your VM has banked and the **ConsumedCredit** metric will show how many CPU credits your VM has consumed from the bank.    You will be able to view these metrics from the metrics pane in the portal or programmatically through the Azure Monitor APIs.

For more information on how to access the metrics data for Azure, see [Overview of metrics in Microsoft Azure](../articles/monitoring-and-diagnostics/monitoring-overview-metrics.md).

### Q: How are credits accumulated?
**A**: The VM accumulation and consumption rates are set such that a VM running at exactly its base performance level will have neither a net accumulation or consumption of bursting credits.  A VM will have a net increase in credits whenever it is running below its base performance level and will have a net decrease in credits whenever the VM is utilizing the CPU more than its base performance level.

**Example**:  I deploy a VM using the B1ms size for my small time and attendance database application. This size allows my application to use up to 20% of a vCPU as my baseline, which is 0.2 credits per minute I can use or bank. 

My application is busy at the beginning and end of my employees work day, between 7:00-9:00 AM and 4:00 - 6:00PM. During the other 20 hours of the day, my application is typically at idle, only using 10% of the vCPU. For the non-peak hours, I earn 0.2 credits per minute but only consume 0.l credits per minute, so my VM will bank 0.1 x 60 = 6 credits per hour.  For the 20 hours that I am off-peak, I will bank 120 credits.  

During peak hours my application averages 60% vCPU utilization, I still earn 0.2 credits per minute but I consume 0.6 credits per minute, for a net cost of 0.4 credits a minute or 0.4 x 60 = 24 credits per hour. I have 4 hours per day of peak usage, so it costs 4 x 24 = 96 credits for my peak usage.

If I take the 120 credits I earned off-peak and subtract the 96 credits I used for my peak times, I bank an additional 24 credits per day that I can use for other bursts of activity.


### Q: Does the B-Series support Premium Storage data disks?
**A**: Yes, all B-Series sizes support Premium Storage data disks.   
	
### Q: Why is my remaining credit set to 0 after a redeploy or a stop/start?
**A** : When a VM is “REDPLOYED” and the VM  moves to another node, the accumulated credit is lost. If the VM is stopped/started, but remains on the same node, the VM retains the accumulated credit. Whenever the VM starts fresh on a node, it gets an initial credit,  for Standard_B8ms it is 240 mins.

	

	
