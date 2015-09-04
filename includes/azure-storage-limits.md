Resource|Default Limit
---|---
Max number of storage accounts per subscription|100<sup>1</sup>
TB per storage account|500 TB
Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account|Only limit is the 500 TB storage account capacity
Max size of a single blob container, table, or queue|500 TB
Max number of blocks in a block blob or append blob|50,000
Max size of a block in a block blob or append blob|4 MB
Max size of a block blob or append blob|50,000 X 4 MB (approx. 195 GB) 
Max size of a page blob |1 TB
Max size of a table entity|1 MB
Max number of properties in a table entity|252
Max size of a message in a queue|64 KB
Max size of a file share|5 TB
Max size of a file in a file share|1 TB
Max number of files in a file share|Only limit is the 5 TB total capacity of the file share
Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account|Only limit is the 500 TB storage account capacity
Max number of stored access policies per container, file share, table, or queue|5
Max 8 KB IOPS per persistent disk (Basic Tier virtual machine)|300<sup>2</sup>
Max 8 KB IOPS per persistent disk (Standard Tier virtual machine)|500<sup>2</sup>
Total Request Rate (assuming 1KB object size) per storage account|Up to 20,000 IOPS, entities per second, or messages per second
Target Throughput for Single Blob|Up to 60 MB per second, or up to 500 requests per second
Target Throughput for Single Queue (1 KB messages)|Up to 2000 messages per second
Target Throughput for Single Table Partition (1 KB entities)|Up to 2000 entities per second
Target Throughput for Single File Share (Preview)|Up to 60 MB per second
Max ingress<sup>3</sup> per storage account (US Regions)|10 Gbps if GRS/ZRS<sup>4</sup> enabled, 20 Gbps for LRS
Max egress<sup>3</sup> per storage account (US Regions)|20 Gbps if GRS/ZRS<sup>4</sup> enabled, 30 Gbps for LRS
Max ingress<sup>3</sup> per storage account (European and Asian Regions)|5 Gbps if GRS/ZRS<sup>4</sup> enabled, 10 Gbps for LRS
Max egress<sup>3</sup> per storage account (European and Asian Regions)|10 Gbps if GRS/ZRS<sup>4</sup> enabled, 15 Gbps for LRS

<sup>1</sup>If you require more than 100 storage accounts, contact [Azure Support](http://azure.microsoft.com/support/faq/) for assistance.

<sup>2</sup>The total request rate limit for a storage account is 20,000 IOPS. If a virtual machine utilizes the maximum IOPS per disk, then to avoid possible throttling, ensure that the total IOPS across all of the virtual machines' VHDs does not exceed the storage account limit (20,000 IOPS).

You can roughly calculate the number of highly utilized disks supported by a single storage account based on the transaction limit. For example, for a Basic Tier VM, the maximum number of highly utilized disks is about 66 (20,000/300 IOPS per disk), and for a Standard Tier VM, it is about 40 (20,000/500 IOPS per disk). However, note that the storage account can support a larger number of disks if they are not all highly utilized at the same time.

<sup>3</sup>*Ingress* refers to all data (requests) being sent to a storage account. *Egress* refers to all data (responses) being received from a storage account.  

<sup>4</sup>GRS refers to geo-redundant storage. ZRS refers to zone-redundant storage, and is available only for block blobs. LRS refers to locally redundant storage. 
