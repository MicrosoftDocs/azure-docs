---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### jit_provider

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Shared Library Preloading |
| Description    | JIT provider to use.                                              |
| Data type      | string    |
| Default value  | `llvmjit`                    |
| Allowed values | `llvmjit`                                                                                                                                                          |
| Parameter type | read-only      |
| Documentation  | [jit_provider](https://www.postgresql.org/docs/12/runtime-config-client.html#GUC-JIT-PROVIDER)                           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### local_preload_libraries

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Shared Library Preloading |
| Description    | Lists unprivileged shared libraries to preload into each backend. |
| Data type      | string    |
| Default value  |                              |
| Allowed values |                                                                                                                                                                    |
| Parameter type | read-only      |
| Documentation  | [local_preload_libraries](https://www.postgresql.org/docs/12/runtime-config-client.html#GUC-LOCAL-PRELOAD-LIBRARIES)     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### session_preload_libraries

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Shared Library Preloading |
| Description    | Lists shared libraries to preload into each backend.              |
| Data type      | set       |
| Default value  |                              |
| Allowed values | `login_hook`                                                                                                                                                       |
| Parameter type | dynamic        |
| Documentation  | [session_preload_libraries](https://www.postgresql.org/docs/12/runtime-config-client.html#GUC-SESSION-PRELOAD-LIBRARIES) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### shared_preload_libraries

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Shared Library Preloading |
| Description    | Sets which shared libraries are preloaded at server start.        |
| Data type      | set       |
| Default value  | `pg_cron,pg_stat_statements` |
| Allowed values | `auto_explain,azure_storage,pg_cron,pg_failover_slots,pg_hint_plan,pg_partman_bgw,pg_prewarm,pg_squeeze,pg_stat_statements,pgaudit,pglogical,timescaledb,wal2json` |
| Parameter type | static         |
| Documentation  | [shared_preload_libraries](https://www.postgresql.org/docs/12/runtime-config-client.html#GUC-SHARED-PRELOAD-LIBRARIES)   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



