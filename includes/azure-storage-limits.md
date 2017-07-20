| Resource | Default Limit |
| --- | --- |
| Number of storage accounts per subscription |200<sup>1</sup> |
| TB per storage account |500 TB |
| Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account |Only limit is the 500 TB storage account capacity |
| Max size of a single blob container, table, or queue |500 TB |
| Max number of blocks in a block blob or append blob |50,000 |
| Max size of a block in a block blob |100 MB |
| Max size of a block blob |50,000 X 100 MB (approx. 4.75 TB) |
| Max size of a block in an append blob |4 MB |
| Max size of an append blob |50,000 X 4 MB (approx. 195 GB) |
| Max size of a page blob |8 TB |
| Max size of a table entity |1 MB |
| Max number of properties in a table entity |252 |
| Max size of a message in a queue |64 KB |
| Max size of a file share |5 TB |
| Max size of a file in a file share |1 TB |
| Max number of files in a file share |Only limit is the 5 TB total capacity of the file share |
| Max IOPS per share |1000 |
| Max number of files in a file share |Only limit is the 5 TB total capacity of the file share |
| Max number of blob containers, blobs, file shares, tables, queues, entities, or messages per storage account |Only limit is the 500 TB storage account capacity |
| Max number of stored access policies per container, file share, table, or queue |5 |
| Maximum Request Rate per storage account |Blobs: 20,000 requests per second for blobs of any valid size (capped only by the account's ingress/egress limits) <br />Files: 1000 IOPS (8 KB in size) per file share <br />Queues: 20,000 messages per second (assuming 1 KB message size)<br />Tables: 20,000 transactions per second (assuming 1 KB entity size) |
| Target throughput for single blob |Up to 60 MB per second, or up to 500 requests per second |
| Target throughput for single queue (1 KB messages) |Up to 2000 messages per second |
| Target throughput for single table partition (1 KB entities) |Up to 2000 entities per second |
| Target throughput for single file share |Up to 60 MB per second |
| Max ingress<sup>2</sup> per storage account (US Regions) |10 Gbps if GRS/ZRS<sup>3</sup> enabled, 20 Gbps for LRS |
| Max egress<sup>2</sup> per storage account (US Regions) |20 Gbps if RA-GRS/GRS/ZRS<sup>3</sup> enabled, 30 Gbps for LRS |
| Max ingress<sup>2</sup> per storage account (Non-US regions) |5 Gbps if GRS/ZRS<sup>3</sup> enabled, 10 Gbps for LRS |
| Max egress<sup>2</sup> per storage account (Non-US regions) |10 Gbps if RA-GRS/GRS/ZRS<sup>3</sup> enabled, 15 Gbps for LRS |

<sup>1</sup>This includes both Standard and Premium storage accounts. If you require more than 200 storage accounts, make a request through [Azure Support](https://azure.microsoft.com/support/faq/). The Azure Storage team will review your business case and may approve up to 250 storage accounts. 

<sup>2</sup>*Ingress* refers to all data (requests) being sent to a storage account. *Egress* refers to all data (responses) being received from a storage account.  

<sup>3</sup>Azure Storage replication options include:

* **RA-GRS**: Read-access geo-redundant storage. If RA-GRS is enabled, egress targets for the secondary location are identical to those for the primary location.
* **GRS**:  Geo-redundant storage. 
* **ZRS**: Zone-redundant storage. Available only for block blobs. 
* **LRS**: Locally redundant storage. 

