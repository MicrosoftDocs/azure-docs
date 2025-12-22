---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 04/17/2022
 ms.author: kendownie
 ms.custom: include file
---

- **Capital and operational costs of Windows File Servers with one or more server endpoints.** Azure File Sync as a replication solution is agnostic of where the Windows File Servers that are synchronized with Azure Files are; they could be hosted on-premises, in an Azure virtual machine, or even in another cloud. The costs for sync servers hosted on-premises or in other cloud providers include both capital and operating costs that aren't tracked as part of your Azure bill, but are still part of the total cost of ownership of the solution. Capital expenses are the upfront hardware costs of your solution. Operating expenses are the ongoing costs of labor, electricity, etc. You should consider the amount of data you need to cache on-premises, the number of CPUs and amount of memory your Windows File Servers need to host Azure File Sync workloads, and other organization-specific costs you might have. For more information, see [recommended system resources](../articles/storage/file-sync/file-sync-planning.md#recommended-system-resources).

- **Per server licensing cost for servers registered with Azure File Sync.** To use Azure File Sync with a specific Windows File Server, you must first register it with Azure File Sync's Azure resource, the Storage Sync Service. Each server that you register after the first server has a flat monthly fee. Although this fee is small, it is one component of your bill to consider. To see the current price of the server registration fee for your desired region, see [the File Sync section on Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

- **Azure Files costs.** Azure File Sync consumes resources from your Azure file share. Some of these resources, like storage consumption, are relatively obvious, while others such as transaction and snapshot utilization may not be. For most customers, we recommend using HDD provisioned v2 file shares with Azure File Sync, although Azure File Sync is fully supported on all Azure Files billing models (SSD provisioned v2, SSD provisioned v1, or HDD pay-as-you-go).
    - **Storage utilization.** Azure File Sync replicates any changes you make to your server endpoint to your Azure file share causing storage to be consumed. On provisioned file shares, changes consume provisioned space, so it is your responsibility to periodically increase provisioning as needed to account for file share growth. On pay-as-you-go file shares, adding or increasing the size of existing files on server endpoints causes the used storage costs to grow because the changes are replicated. 

    - **Snapshot utilization.** Azure File Sync takes share and file-level snapshots as part of regular usage. Although snapshot utilization is always differential, this can contribute in a noticeable way to the total Azure Files bill.

    - **IOPS / throughput utilization**: Azure File Sync drives IOPS and throughput utilization to transfer changes from your server endpoints to your Azure file share. If you are using a provisioned file share, you should monitor your file share usage to ensure that you have enough IOPS and throughput provisioned that you aren't throttled. If you are using a pay-as-you-go file share, you are charged for the IOPS utilization in the form of transactions. Generally, there are two types of transactions to consider:
        - **Transactions from churn.** As files change on server endpoints, the changes are uploaded to the cloud share, which generates transactions. When cloud tiering is enabled, additional transactions are generated for managing tiered files, including I/O happening on tiered files, in addition to egress costs. Although the quantity and type of transactions is difficult to predict due to churn rates and cache efficiency, you can use your previous transaction patterns to estimate future costs if you believe your future usage will be similar to your current usage. 
        
        - **Transactions from cloud enumeration.** Azure File Sync enumerates the Azure File Share in the cloud once per day to discover changes that were made directly to the share so that they can sync down to the server endpoints. This scan generates transactions which are billed to the storage account at a rate of one `ListFiles` transaction per directory per day. You can put this number into the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the scan cost.  

        > [!Tip]  
        > If you don't know how many folders you have, check out the TreeSize tool from JAM Software GmbH.
