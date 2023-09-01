---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 04/17/2022
 ms.author: kendownie
 ms.custom: include file
---

- **Capital and operational costs of Windows File Servers with one or more server endpoints.** Azure File Sync as a replication solution is agnostic of where the Windows File Servers that are synchronized with Azure Files are; they could be hosted on-premises, in an Azure VM, or even in another cloud. Unless you are using Azure File Sync with a Windows File Server that is hosted in an Azure VM, the capital (i.e. the upfront hardware costs of your solution) and operating (i.e. cost of labor, electricity, etc.) costs will not be part of your Azure bill, but will still be very much a part of your total cost of ownership. You should consider the amount of data you need to cache on-premises, the number of CPUs and amount of memory your Windows File Servers need to host Azure File Sync workloads (see [recommended system resources for more information](../articles/storage/file-sync/file-sync-planning.md#recommended-system-resources)), and other organization-specific costs you might have.

- **Per server licensing cost for servers registered with Azure File Sync.** To use Azure File Sync with a specific Windows File Server, you must first register it with Azure File Sync's Azure resource, the Storage Sync Service. Each server that you register after the first server has a flat monthly fee. Although this fee is very small, it is one component of your bill to consider. To see the current price of the server registration fee for your desired region, see [the File Sync section on Azure Files pricing page](https://azure.microsoft.com/pricing/details/storage/files/).

- **Azure Files costs.** Because Azure File Sync is a synchronization solution for Azure Files, it will cause you to consume Azure Files resources. Some of these resources, like storage consumption, are relatively obvious, while others such as transaction and snapshot utilization may not be. For most customers, we recommend using standard file shares with Azure File Sync, although Azure File Sync is fully supported with premium file shares if desired.
    - **Storage utilization.** Azure File Sync will replicate any changes you have made to the path on your Windows File Server specified on your server endpoint to your Azure file share, thus causing storage to be consumed. On standard file shares, this means that adding or increasing the size of existing files on server endpoints will cause storage costs to grow, because the changes will be replicated. On premium file shares, changes will be consume provisioned space - it is your responsibility to periodically increase provisioning as needed to account for file share growth.

    - **Snapshot utilization.** Azure File Sync takes share and file-level snapshots as part of regular usage. Although snapshot utilization is always differential, this can contribute in a noticeable way to the total Azure Files bill.

    - **Transactions from churn.** As files change on server endpoints, the changes are uploaded to the cloud share, which generates transactions. When cloud tiering is enabled, additional transactions are generated for managing tiered files, including I/O happening on tiered files, in addition to egress costs. Although the quantity and type of transactions is difficult to predict due to churn rates and cache efficiency, you can use your previous transaction patterns to estimate future costs if you believe your future usage will be similar to your current usage. 
    
    - **Transactions from cloud enumeration.** Azure File Sync enumerates the Azure File Share in the cloud once per day to discover changes that were made directly to the share so that they can sync down to the server endpoints. This scan generates transactions which are billed to the storage account at a rate of one `ListFiles` transaction per directory per day. You can put this number into the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the scan cost.  

    > [!Tip]  
    > If you don't know how many folders you have, check out the TreeSize tool from JAM Software GmbH.
