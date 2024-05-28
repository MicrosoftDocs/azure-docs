---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### jit_provider

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Shared Library Preloading |
| Description    | JIT provider to use.                                              |
| Data type      | string    |
| Default value  | `llvmjit`                                                                                                                                            |
| Allowed values | `llvmjit`                                                                                                                                                          |
| Parameter type | read-only      |
| Documentation  |               |


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
| Documentation  |               |


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
| Documentation  |               |


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
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



