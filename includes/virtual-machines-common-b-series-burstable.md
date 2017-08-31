
> [!NOTE] 
> Previews are made available to you on the condition that you agree to the terms of use. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> This preview is limited to the following regions:
> - US - West 2
> - US - East
> - Europe - West
> - Asia Pacific - Southeast


The B-series VM family allows you to choose which VM size provides you the necessary base level performance for your workload, with the ability to burst CPU performance 100% of the core. This VM size provides you the choice of 10%-135% of an Intel® Broadwell E5-2673 v4 2.3 GHz, or an Intel® Haswell 2.4 GHz E5-2673 v3 processor core.

The B-series VMs are ideal for workloads that do not need the full performance of the CPU for large amounts of time, like web servers, small databases and development and test environments. These workloads typically have burstable performance requirements. The B-series provides you with the ability to purchase a VM size with baseline performance and then it builds up credits when the VM is utilizing less than its base performance. When the VM has accumulated credit, the VM can burst above the baseline using up to 100% of the CPU Core when your application requires the higher CPU performance.

The B-series comes in the following 6 VM sizes:

| Size          | vCPU's | Memory: GiB | Local SSD: GiB | Base CPU Perf of VM | Max CPU Perf of VM | Credits Banked / Hour | Max Banked Credits |
|---------------|--------|-------------|----------------|--------------------------------|---------------------------|-----------------------|--------------------|
| Standard_B1s  | 1      | 1           | 4              | 10%                            | 100%                      | 6                     | 144                |
| Standard_B1ms | 1      | 2           | 4              | 20%                            | 100%                      | 12                    | 288                |
| Standard_B2s  | 2      | 4           | 8              | 40%                            | 200%                      | 24                    | 576                |
| Standard_B2ms | 2      | 8           | 16             | 60%                            | 200%                      | 36                    | 864                |
| Standard_B4ms | 4      | 16          | 32             | 90%                            | 400%                      | 54                    | 1296               |
| Standard_B8ms | 8      | 32          | 64             | 135%                           | 800%                      | 81                    | 1944               |




## Q & A about this preview

### Q: How can I participate in this preview?
**A**: Request quota for the B-series in the supported region that you would like to the B-series.  After your quota has been approved then you can use the portal or the APIs to do your deployment as you normally would. For more information, see [Resource Manager core quota increase requests](../articles/azure-supportability/resource-manager-core-quotas-request.md)

### Q: How do you get 135% baseline performance from a VM?
**A**: The 135% is shared amongst the 8 vCPU’s that make up the VM size.  i.e. if your application leverages 4 of the 8 cores working on batch processing and each of those 4 vCPU’s are running at 30% utilization the total amount of VM CPU performance would equal 120%.  Meaning that your VM would be building credit time based on the 15% delta from your baseline performance.  But it also means that when you have credits available that same VM can use 100% of all 8 vCPU’s giving that VM a Max CPU performance of 800%.

### Q: Is there a discount on price during the preview?
**A**: Yes, the preview prices can be viewed on our [pricing page](http://aka.ms/vmsizes).

### Q: How can I monitor my credit balance and consumption
**A**: We will be introducing 2 new metrics in the coming weeks, the **Credit** metric will allow you to view how many credits your VM has banked and the **ConsumedCredit** metric will show how many CPU credits your VM has consumed from the bank.    You will be able to view these metrics from the metrics pane in the portal or programmatically through the Azure Monitor APIs.

For more information on how to access the metrics data for Azure, see [Overview of metrics in Microsoft Azure](../articles/monitoring-and-diagnostics/monitoring-overview-metrics)

### Q: Which regions can I access the preview from?
**A**:  The B-series preview will be available in the following regions:
•	US - West 2
•	US - East
•	Europe - West
•	Asia Pacific - Southeast

After the preview has completed we will release the B-series to all remaining regions.
	
### Q: Does the B-series support Premium Storage data disks?
**A**: Yes, all B-series sizes support Premium Storage data disks.   
	
### Q: How do I accumulate credits?
**A**: The VM accumulation and consumption rates are set such that a VM running at exactly its base performance level will have neither a net accumulation or consumption of bursting credits.  A VM will have a net increase in credits whenever it is running below its base performance level and will have a net decrease in credits whenever the VM is utilizing the CPU more than its base performance level

For example, a VM with a base performance level of 20% that is currently utilizing 10% of a CPU will begin to build credits in the credit bank.


