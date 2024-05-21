---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### log_min_duration_sample

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / When to Log |
| Description    | Sets the minimum execution time above which a sample of statements will be logged. Sampling is determined by log_statement_sample_rate. |
| Data type      | integer     |
| Default value  | `-1`          |
| Allowed values | `-1`                                                                           |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_min_duration_statement

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / When to Log |
| Description    | Sets the minimum execution time (in milliseconds) above which statements will be logged. -1 disables logging statement durations.       |
| Data type      | integer     |
| Default value  | `-1`          |
| Allowed values | `-1-2147483647`                                                                |
| Parameter type | dynamic        |
| Documentation  | [log_min_duration_statement](https://www.postgresql.org/docs/13/runtime-config-logging.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_min_error_statement

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / When to Log |
| Description    | Causes all statements generating error at or above this level to be logged.                                                             |
| Data type      | enumeration |
| Default value  | `error`       |
| Allowed values | `debug5,debug4,debug3,debug2,debug1,info,notice,warning,error,log,fatal,panic` |
| Parameter type | dynamic        |
| Documentation  | [log_min_error_statement](https://www.postgresql.org/docs/13/runtime-config-logging.html)    |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_min_messages

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / When to Log |
| Description    | Controls which message levels are written to the server log.                                                                            |
| Data type      | enumeration |
| Default value  | `warning`     |
| Allowed values | `debug5,debug4,debug3,debug2,debug1,info,notice,warning,error,log,fatal,panic` |
| Parameter type | dynamic        |
| Documentation  | [log_min_messages](https://www.postgresql.org/docs/13/runtime-config-logging.html)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_statement_sample_rate

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / When to Log |
| Description    | Fraction of statements exceeding log_min_duration_sample to be logged.                                                                  |
| Data type      | numeric     |
| Default value  | `1`           |
| Allowed values | `1`                                                                            |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_transaction_sample_rate

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Reporting and Logging / When to Log |
| Description    | Set the fraction of transactions to log for new transactions.                                                                           |
| Data type      | numeric     |
| Default value  | `0`           |
| Allowed values | `0`                                                                            |
| Parameter type | read-only      |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



