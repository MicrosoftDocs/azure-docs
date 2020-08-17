---
author: roygara
ms.service: storage
ms.topic: include
ms.date: 08/10/2020
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

|Area  |Standard file  |Premium file  |
|---------|---------|---------|
|Size     |1 TiB         |4 TiB         |
|Max IOPS per file      |1,000         |5,000         |
|Concurrent handles     |2,000         |2,000         |
|Egress     |See standard file throughput values         |300 MiB/sec         |
|Ingress     |See standard file throughput values         |200 MiB/sec         |
|Throughput     |Up to 60 MiB/sec         |See premium file ingress/egress values         |