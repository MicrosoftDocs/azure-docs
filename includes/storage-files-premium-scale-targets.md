---
author: roygara
ms.service: storage
ms.topic: include
ms.date: 06/07/2019
ms.author: rogarana
---
#### Additional premium file share limits

|Area  |Target  |
|---------|---------|
|Minimum size increase/decrease    |1 GiB      |
|Baseline IOPS    |1 IOPS per GiB up to 100,000|
|IOPS bursting    |3x IOPS per GiB up to 100,000|
|Egress rate         |60 MiB/s + 0.06 * provisioned GiB        |
|Ingress rate| 40 MiB/s + 0.04 * provisioned GiB |
|Maximum number of snapshots        |200       |

#### Premium file limits

|Area  |Target  |
|---------|---------|
|Size                  |1 TiB         |
|Max IOPS per file     |5,000         |
|Concurrent handles    |2,000         |