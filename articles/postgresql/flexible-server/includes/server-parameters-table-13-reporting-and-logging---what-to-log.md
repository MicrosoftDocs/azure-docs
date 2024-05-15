---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### application_name

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Sets the application name to be reported in statistics and logs.                                                        |
| Data type      | string      |
| Default value  |               |
| Allowed values | `[A-Za-z0-9._-]*`       |
| Parameter type | dynamic        |
| Documentation  | [application_name](https://www.postgresql.org/docs/13/libpq-connect.html)                        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### debug_pretty_print

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Indents parse and plan tree displays.                                                                                   |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on,off`                |
| Parameter type | dynamic        |
| Documentation  | [debug_pretty_print](https://www.postgresql.org/docs/13/runtime-config-logging.html)             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### debug_print_parse

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs each query's parse tree.                                                                                           |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `on,off`                |
| Parameter type | dynamic        |
| Documentation  | [debug_print_parse](https://www.postgresql.org/docs/13/runtime-config-logging.html)              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### debug_print_plan

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs each query's execution plan.                                                                                       |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `on,off`                |
| Parameter type | dynamic        |
| Documentation  | [debug_print_plan](https://www.postgresql.org/docs/13/runtime-config-logging.html)               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### debug_print_rewritten

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs each query's rewritten parse tree.                                                                                 |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `on,off`                |
| Parameter type | dynamic        |
| Documentation  | [debug_print_rewritten](https://www.postgresql.org/docs/13/runtime-config-logging.html)          |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_autovacuum_min_duration

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Sets the minimum execution time above which autovacuum actions will be logged.                                          |
| Data type      | integer     |
| Default value  | `-1`          |
| Allowed values | `-1-2147483647`         |
| Parameter type | dynamic        |
| Documentation  | [log_autovacuum_min_duration](https://www.postgresql.org/docs/13/runtime-config-autovacuum.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_checkpoints

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs each checkpoint.                                                                                                   |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on,off`                |
| Parameter type | dynamic        |
| Documentation  | [log_checkpoints](https://www.postgresql.org/docs/13/runtime-config-logging.html)                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_connections

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Causes each attempted connection to the server to be logged, as well as successful completion of client authentication. |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on`                    |
| Parameter type | read-only      |
| Documentation  | [log_connections](https://www.postgresql.org/docs/13/runtime-config-logging.html)                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_disconnections

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs end of a session, including duration.                                                                              |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on`                    |
| Parameter type | read-only      |
| Documentation  | [log_disconnections](https://www.postgresql.org/docs/13/runtime-config-logging.html)             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_duration

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs the duration of each completed SQL statement.                                                                      |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `on,off`                |
| Parameter type | dynamic        |
| Documentation  | [log_duration](https://www.postgresql.org/docs/13/runtime-config-logging.html)                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_error_verbosity

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Controls the amount of detail written in the server log for each message that is logged.                                |
| Data type      | enumeration |
| Default value  | `default`     |
| Allowed values | `terse,default,verbose` |
| Parameter type | dynamic        |
| Documentation  | [log_error_verbosity](https://www.postgresql.org/docs/13/runtime-config-logging.html)            |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_hostname

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs the host name in the connection logs.                                                                              |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`                   |
| Parameter type | read-only      |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_line_prefix

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Sets the printf-style string that is output at the beginning of each log line.                                          |
| Data type      | string      |
| Default value  | `%t-%c-`      |
| Allowed values | `[^']*`                 |
| Parameter type | dynamic        |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_lock_waits

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Controls whether a log message is produced when a session waits longer than deadlock_timeout to acquire a lock.         |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `on,off`                |
| Parameter type | dynamic        |
| Documentation  | [log_lock_waits](https://www.postgresql.org/docs/13/runtime-config-logging.html)                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_parameter_max_length

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | When logging statements, limit logged parameter values to first N bytes.                                                |
| Data type      | integer     |
| Default value  | `-1`          |
| Allowed values | `-1`                    |
| Parameter type | read-only      |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_parameter_max_length_on_error

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | When reporting an error, limit logged parameter values to first N bytes.                                                |
| Data type      | integer     |
| Default value  | `0`           |
| Allowed values | `0`                     |
| Parameter type | read-only      |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_replication_commands

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs each replication command.                                                                                          |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on`                    |
| Parameter type | read-only      |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_statement

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Sets the type of statements logged.                                                                                     |
| Data type      | enumeration |
| Default value  | `none`        |
| Allowed values | `none,ddl,mod,all`      |
| Parameter type | dynamic        |
| Documentation  | [log_statement](https://www.postgresql.org/docs/13/runtime-config-logging.html)                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_temp_files

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Logs the use of temporary files larger than this number of kilobytes.                                                   |
| Data type      | integer     |
| Default value  | `-1`          |
| Allowed values | `-1-2147483647`         |
| Parameter type | dynamic        |
| Documentation  | [log_temp_files](https://www.postgresql.org/docs/13/runtime-config-logging.html)                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_timezone

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / What to Log |
| Description    | Sets the time zone to use in log messages.                                                                              |
| Data type      | string      |
| Default value  | `UTC`         |
| Allowed values | `UTC`                   |
| Parameter type | read-only      |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



