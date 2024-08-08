---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### max_replication_slots

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Sending Servers |
| Description    | Specifies the maximum number of replication slots that the server can support. |
| Data type      | integer   |
| Default value  | `10`          |
| Allowed values | `2-262143`     |
| Parameter type | static         |
| Documentation  | [max_replication_slots](https://www.postgresql.org/docs/16/runtime-config-replication.html#GUC-MAX-REPLICATION-SLOTS)   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_slot_wal_keep_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Sending Servers |
| Description    | Sets the maximum WAL size that can be reserved by replication slots.           |
| Data type      | integer   |
| Default value  | `-1`          |
| Allowed values | `-1`           |
| Parameter type | read-only      |
| Documentation  | [max_slot_wal_keep_size](https://www.postgresql.org/docs/16/runtime-config-replication.html#GUC-MAX-SLOT-WAL-KEEP-SIZE) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_wal_senders

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Sending Servers |
| Description    | Sets the maximum number of simultaneously running WAL sender processes.        |
| Data type      | integer   |
| Default value  | `10`          |
| Allowed values | `5-100`        |
| Parameter type | static         |
| Documentation  | [max_wal_senders](https://www.postgresql.org/docs/16/runtime-config-replication.html#GUC-MAX-WAL-SENDERS)               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### track_commit_timestamp

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Sending Servers |
| Description    | Collects transaction commit time.                                              |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | static         |
| Documentation  | [track_commit_timestamp](https://www.postgresql.org/docs/16/runtime-config-replication.html#GUC-TRACK-COMMIT-TIMESTAMP) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### wal_keep_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Sending Servers |
| Description    | Sets the size of WAL files held for standby servers.                           |
| Data type      | integer   |
| Default value  | `400`         |
| Allowed values | `400`          |
| Parameter type | read-only      |
| Documentation  | [wal_keep_size](https://www.postgresql.org/docs/16/runtime-config-replication.html#GUC-WAL-KEEP-SIZE)                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### wal_sender_timeout

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Sending Servers |
| Description    | Sets the maximum time to wait for WAL replication.                             |
| Data type      | integer   |
| Default value  | `60000`       |
| Allowed values | `60000`        |
| Parameter type | read-only      |
| Documentation  | [wal_sender_timeout](https://www.postgresql.org/docs/16/runtime-config-replication.html#GUC-WAL-SENDER-TIMEOUT)         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



