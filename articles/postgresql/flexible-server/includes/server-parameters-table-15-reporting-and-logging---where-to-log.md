---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### event_source

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the application name used to identify PostgreSQL messages in the event log. |
| Data type      | string      |
| Default value  | `PostgreSQL`                     |
| Allowed values | `PostgreSQL`                     |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_destination

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the destination for server log output.                                      |
| Data type      | enumeration |
| Default value  | `stderr`                         |
| Allowed values | `stderr,csvlog`                  |
| Parameter type | dynamic        |
| Documentation  | [log_destination](https://www.postgresql.org/docs/15/runtime-config-logging.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_directory

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the destination directory for log files.                                    |
| Data type      | string      |
| Default value  | `log`                            |
| Allowed values | `log`                            |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_file_mode

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the file permissions for log files.                                         |
| Data type      | integer     |
| Default value  | `0600`                           |
| Allowed values | `0600`                           |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_filename

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the file name pattern for log files.                                        |
| Data type      | string      |
| Default value  | `postgresql-%Y-%m-%d_%H%M%S.log` |
| Allowed values | `postgresql-%Y-%m-%d_%H%M%S.log` |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### logging_collector

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Start a subprocess to capture stderr output and/or csvlogs into log files.       |
| Data type      | boolean     |
| Default value  | `off`                            |
| Allowed values | `off`                            |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_rotation_age

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the amount of time to wait before forcing log file rotation.                |
| Data type      | integer     |
| Default value  | `60`                             |
| Allowed values | `60`                             |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_rotation_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the maximum size a log file can reach before being rotated.                 |
| Data type      | integer     |
| Default value  | `102400`                         |
| Allowed values | `102400`                         |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_truncate_on_rotation

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Truncate existing log files of same name during log rotation.                    |
| Data type      | boolean     |
| Default value  | `off`                            |
| Allowed values | `off`                            |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### syslog_facility

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the syslog \"facility\" to be used when syslog enabled.                     |
| Data type      | enumeration |
| Default value  | `local0`                         |
| Allowed values | `local0`                         |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### syslog_ident

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Sets the program name used to identify PostgreSQL messages in syslog.            |
| Data type      | string      |
| Default value  | `postgres`                       |
| Allowed values | `postgres`                       |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### syslog_sequence_numbers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Add sequence number to syslog messages to avoid duplicate suppression.           |
| Data type      | boolean     |
| Default value  | `on`                             |
| Allowed values | `on`                             |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### syslog_split_messages

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / Where to Log |
| Description    | Split messages sent to syslog by lines and to fit into 1024 bytes.               |
| Data type      | boolean     |
| Default value  | `on`                             |
| Allowed values | `on`                             |
| Parameter type | read-only      |
| Documentation  |                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



