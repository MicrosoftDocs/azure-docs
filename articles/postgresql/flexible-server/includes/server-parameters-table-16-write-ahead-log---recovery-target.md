---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### recovery_target

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Set to \"immediate\" to end recovery as soon as a consistent state is reached.  |
| Data type      | string      |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_target_action

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Sets the action to perform upon reaching the recovery target.                   |
| Data type      | enumeration |
| Default value  | `pause`       |
| Allowed values | `pause`        |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_target_inclusive

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Sets whether to include or exclude transaction with recovery target.            |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on`           |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_target_lsn

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Sets the LSN of the write-ahead log location up to which recovery will proceed. |
| Data type      | string      |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_target_name

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Sets the named restore point up to which recovery will proceed.                 |
| Data type      | string      |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_target_time

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Sets the time stamp up to which recovery will proceed.                          |
| Data type      | string      |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_target_timeline

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Specifies the timeline to recover into.                                         |
| Data type      | string      |
| Default value  | `latest`      |
| Allowed values | `latest`       |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_target_xid

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery Target |
| Description    | Sets the transaction ID up to which recovery will proceed.                      |
| Data type      | string      |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



