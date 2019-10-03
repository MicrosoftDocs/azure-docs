---
author: roygara
ms.service: storage
ms.topic: include
ms.date: 05/06/2019
ms.author: rogarana
---
| Resource | Standard file shares | Premium file shares |
|----------|---------------|------------------------------------------|
| Minimum size of a file share | No minimum; pay as you go | 100 GiB; provisioned |
| Maximum size of a file share | 5 TiB (GA), 100 TiB (preview) | 100 TiB |
| Maximum size of a file in a file share | 1 TiB | 1 TiB |
| Maximum number of files in a file share | No limit | No limit |
| Maximum IOPS per share | 1,000 IOPS (GA), 10,000 IOPS (preview) | 100,000 IOPS |
| Maximum number of stored access policies per file share | 5 | 5 |
| Target throughput for a single file share | Up to 60 MiB/sec (GA), up to 300 MiB/sec (preview) | See premium file share ingress and egress values|
| Maximum egress for a single file share | See standard file share target throughput | Up to 6,204 MiB/s |
| Maximum ingress for a single file share | See standard file share target throughput | Up to 4,136 MiB/s |
| Maximum open handles per file | 2,000 open handles | 2,000 open handles |
| Maximum number of share snapshots | 200 share snapshots | 200 share snapshots |
| Maximum object (directories and files) name length | 2,048 characters | 2,048 characters |
| Maximum pathname component (in the path \A\B\C\D, each letter is a component) | 255 characters | 255 characters |