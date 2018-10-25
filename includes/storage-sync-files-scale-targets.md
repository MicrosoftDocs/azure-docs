---
 title: include file
 description: include file
 services: storage
 author: wmgries
 ms.service: storage
 ms.topic: include
 ms.date: 07/18/2018
 ms.author: wgries
 ms.custom: include file
---
| Resource | Target | Hard limit |
|----------|--------------|------------|
| Storage Sync Services per subscription | 15 Storage Sync Services | No |
| Sync groups per Storage Sync Service | 100 sync groups | Yes |
| Registered servers per Storage Sync Service | 99 servers | Yes |
| Cloud endpoints per Sync Group | 1 cloud endpoint | Yes |
| Server endpoints per Sync Group | 50 server endpoints | No |
| Server endpoints per server | 33-99 server endpoints | Yes, but varies based on configuration (CPU, memory, volumes, file churn, file count, etc.) |
| Endpoint size | 4 TiB | No |
| File system objects (directories and files) per sync group | 25 million objects | No |
| Maximum number of file system objects (directories and files) in a directory | 200,000 objects | Yes |
| Maximum object (directories and files) name length | 255 characters | Yes |
| Maximum object (directories and files) security descriptor size | 4 KiB | Yes |
| File size | 100 GiB | No |
| Minimum file size for a file to be tiered | 64 KiB | Yes |
| Concurrent sync sessions | 2 active sync sessions per processor or maximum of 8 active sync sessions per server | Yes |
