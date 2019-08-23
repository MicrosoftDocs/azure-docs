---
author: roygara
ms.service: storage
ms.topic: include
ms.date: 06/07/2019
ms.author: rogarana
---
#### Additional premium file share level limits

|Area  |Target  |
|---------|---------|
|Minimum size increase/decrease    |1 GiB      |
|Baseline IOPS    |1 IOPS per GiB, up to 100,000|
|IOPS bursting    |3x IOPS per GiB, up to 100,000|
|Egress rate         |60 MiB/s + 0.06 * provisioned GiB        |
|Ingress rate| 40 MiB/s + 0.04 * provisioned GiB |

#### File level limits

|Area  |Premium file  |Standard file |
|---------|---------|---------|
|Size                  |1 TiB         |1 TiB|
|Max IOPS per file     |5,000         |1,000|
|Concurrent handles    |2,000         |2,000|
|Ingress  |300 MiB/sec|      See standard file throughput values|
|Egress   |200 Mib/sec| See standard file throughput values|
|Throughput| See premium file ingress/egress values| Up to 60 MiB/sec|