---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### bgwriter_delay

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Background Writer |
| Description    | Specifies the delay between activity rounds for the background writer. In each round the writer issues writes for some number of dirty buffers.                          |
| Data type      | integer   |
| Default value  | `20`          |
| Allowed values | `10-10000`     |
| Parameter type | dynamic        |
| Documentation  | [bgwriter_delay](https://www.postgresql.org/docs/14/runtime-config-resource.html)          |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### bgwriter_flush_after

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Background Writer |
| Description    | Number of pages after which previously performed writes by the background writer are flushed to disk.                                                                    |
| Data type      | integer   |
| Default value  | `64`          |
| Allowed values | `0-256`        |
| Parameter type | dynamic        |
| Documentation  | [bgwriter_flush_after](https://www.postgresql.org/docs/14/runtime-config-resource.html)    |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### bgwriter_lru_maxpages

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Background Writer |
| Description    | In each round, no more than this many buffers will be written by the background writer.                                                                                  |
| Data type      | integer   |
| Default value  | `100`         |
| Allowed values | `0-1073741823` |
| Parameter type | dynamic        |
| Documentation  | [bgwriter_lru_maxpages](https://www.postgresql.org/docs/14/runtime-config-resource.html)   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### bgwriter_lru_multiplier

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Background Writer |
| Description    | The average recent need of buffers is multiplied by bgwriter_lru_multiplier to arrive at an estimate of the number of buffers that will be needed during the next round. |
| Data type      | numeric   |
| Default value  | `2`           |
| Allowed values | `0-10`         |
| Parameter type | dynamic        |
| Documentation  | [bgwriter_lru_multiplier](https://www.postgresql.org/docs/14/runtime-config-resource.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



