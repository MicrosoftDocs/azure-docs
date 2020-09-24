---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 05/05/2019
 ms.author: rogarana
 ms.custom: include file
---
| Resource | Target | Hard limit |
|----------|--------------|------------|
| Storage Sync Services per region | 100 Storage Sync Services | Yes |
| Sync groups per Storage Sync Service | 200 sync groups | Yes |
| Registered servers per Storage Sync Service | 99 servers | Yes |
| Cloud endpoints per sync group | 1 cloud endpoint | Yes |
| Server endpoints per sync group | 50 server endpoints | No |
| Server endpoints per server | 30 server endpoints | Yes |
| File system objects (directories and files) per sync group | 100 million objects | No |
| Maximum number of file system objects (directories and files) in a directory | 5 million objects | Yes |
| Maximum object (directories and files) security descriptor size | 64 KiB | Yes |
| File size | 100 GiB | No |
| Minimum file size for a file to be tiered | V9: Based on file system cluster size (double file system cluster size). For example, if the file system cluster size is 4kb, the minimum file size will be 8kb.<br> V8 and older: 64 KiB  | Yes |

> [!Note]  
> An Azure File Sync endpoint can scale up to the size of an Azure file share. If the Azure file share size limit is reached, sync will not be able to operate.
