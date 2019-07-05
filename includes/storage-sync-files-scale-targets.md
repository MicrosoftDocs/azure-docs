---
 title: include file
 description: include file
 services: storage
 author: wmgries
 ms.service: storage
 ms.topic: include
 ms.date: 05/05/2019
 ms.author: wgries
 ms.custom: include file
---
| Resource | Target | Hard limit |
|----------|--------------|------------|
| Storage Sync Services per region | 20 Storage Sync Services | Yes |
| Sync groups per Storage Sync Service | 100 sync groups | Yes |
| Registered servers per Storage Sync Service | 99 servers | Yes |
| Cloud endpoints per sync group | 1 cloud endpoint | Yes |
| Server endpoints per sync group | 50 server endpoints | No |
| Server endpoints per server | 30 server endpoints | Yes |
| File system objects (directories and files) per sync group | 25 million objects | No |
| Maximum number of file system objects (directories and files) in a directory | 1 million objects | Yes |
| Maximum object (directories and files) security descriptor size | 64 KiB | Yes |
| File size | 100 GiB | No |
| Minimum file size for a file to be tiered | 64 KiB | Yes |
| Concurrent sync sessions | V4 agent and later: The limit varies based on available system resources. <BR> V3 agent: Two active sync sessions per processor or a maximum of eight active sync sessions per server. | Yes

> [!Note]  
> An Azure File Sync endpoint can scale up to the size of an Azure file share. If the Azure file share size limit is reached, sync will not be able to operate.