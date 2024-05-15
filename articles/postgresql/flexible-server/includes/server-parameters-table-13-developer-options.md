---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### allow_in_place_tablespaces

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Allows tablespaces directly inside pg_tblspc, for testing.                |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### allow_system_table_mods

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Allows modifications of the structure of system tables.                   |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### backtrace_functions

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Log backtrace for errors in these functions.                              |
| Data type      | string      |
| Default value  |               |
| Allowed values |                  |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### force_parallel_mode

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Forces use of parallel query facilities.                                  |
| Data type      | enumeration |
| Default value  | `off`         |
| Allowed values | `off,on,regress` |
| Parameter type | dynamic        |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### ignore_checksum_failure

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Continues processing after a checksum failure.                            |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### ignore_invalid_pages

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Continues recovery after an invalid pages failure.                        |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### ignore_system_indexes

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Disables reading from system indexes.                                     |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_debugging_support

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Register JIT compiled function with debugger.                             |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_dump_bitcode

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Write out LLVM bitcode to facilitate JIT debugging.                       |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_expressions

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Allow JIT compilation of expressions.                                     |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on`             |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_profiling_support

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Register JIT compiled function with perf profiler.                        |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_tuple_deforming

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Allow JIT compilation of tuple deforming.                                 |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on`             |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### post_auth_delay

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Waits N seconds on connection startup after authentication.               |
| Data type      | integer     |
| Default value  | `0`           |
| Allowed values | `0`              |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pre_auth_delay

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Waits N seconds on connection startup before authentication.              |
| Data type      | integer     |
| Default value  | `0`           |
| Allowed values | `0`              |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### trace_notify

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Generates debugging output for LISTEN and NOTIFY.                         |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### trace_recovery_messages

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Enables logging of recovery-related debugging information.                |
| Data type      | enumeration |
| Default value  | `log`         |
| Allowed values | `log`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### trace_sort

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Emit information about resource usage in sorting.                         |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### wal_consistency_checking

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Sets the WAL resource managers for which WAL consistency checks are done. |
| Data type      | string      |
| Default value  |               |
| Allowed values |                  |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### zero_damaged_pages

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Developer Options |
| Description    | Continues processing past damaged page headers.                           |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`            |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



