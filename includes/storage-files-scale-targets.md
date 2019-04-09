---
author: tamram
ms.service: storage
ms.topic: include
ms.date: 10/26/2018
ms.author: tamram
---
| Resource | Standard file shares | Premium file shares (preview) |
|----------|---------------|------------------------------------------|
| Minimum size of a file share | No minimum; pay as you go | 100 GiB; provisioned |
| Maximum size of a file share | 5 TiB | 5 TiB (public preview), 100 TiB (limited public preview) |
| Maximum size of a file in a file share | 1 TiB | 1 TiB |
| Maximum number of files in a file share | No limit | No limit |
| Maximum IOPS per share | 1,000 IOPS | 5,120 base IOPS with 15,360 burst limit (public preview), 100,000 IOPS (limited public preview)|
| Maximum number of stored access policies per file share | 5 | 5 |
| Target throughput for a single file share | Up to 60 MiB/sec | See premium file share ingress and egress values|
| Maximum egress for a single file share | See standard file share target throughput | Up to 368 MiB/s (public preview), Up to 6,204 MiB/s (limited public preview) |
| Maximum ingress for a single file share | See standard file share target throughput | Up to 245 MiB/s (public preview), Up to 4,136 MiB/s (limited public preview) |
| Maximum open handles per file | 2,000 open handles | 2,000 open handles |
| Maximum number of share snapshots | 200 share snapshots | 200 share snapshots |
| Maximum object (directories and files) name length | 2,048 characters | 2,048 characters |
| Maximum pathname component (in the path \A\B\C\D, each letter is a component) | 255 characters | 255 characters |