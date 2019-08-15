---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 4/20/2019
ms.author: tamram
---
| Resource | Target        |
|----------|---------------|
| Maximum size of single blob container | Same as maximum storage account capacity |
| Maximum number of blocks in a block blob or append blob | 50,000 blocks |
| Maximum size of a block in a block blob | 100 MiB |
| Maximum size of a block blob | 50,000 X 100 MiB (approximately 4.75 TiB) |
| Maximum size of a block in an append blob | 4 MiB |
| Maximum size of an append blob | 50,000 x 4 MiB (approximately 195 GiB) |
| Maximum size of a page blob | 8 TiB |
| Maximum number of stored access policies per blob container | 5 |
|Target throughput for single blob |Up to storage account ingress/egress limits<sup>1</sup> |

<sup>1</sup> Single object throughput depends on several factors, including, but not limited to: concurrency, request size, performance tier, speed of source for uploads, and destination for downloads. To take advantage of [high-throughput block blob](https://azure.microsoft.com/blog/high-throughput-with-azure-blob-storage/) performance enhancements, use a Put Blob or Put Block request size of > 4 MiB (> 256 KiB for premium-performance block blob storage or for Data Lake Storage Gen2).
