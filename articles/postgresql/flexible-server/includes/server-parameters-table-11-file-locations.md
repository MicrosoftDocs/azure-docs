---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### config_file

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | File Locations |
| Description    | Sets the server's main configuration file.       |
| Data type      | string    |
| Default value  | `/datadrive/pg/data/postgresql.conf` |
| Allowed values | `/datadrive/pg/data/postgresql.conf` |
| Parameter type | read-only      |
| Documentation  | [config_file](https://www.postgresql.org/docs/11/runtime-config-file-locations.html#GUC-CONFIG-FILE)             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### data_directory

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | File Locations |
| Description    | Sets the server's data directory.                |
| Data type      | string    |
| Default value  | `/datadrive/pg/data`                 |
| Allowed values | `/datadrive/pg/data`                 |
| Parameter type | read-only      |
| Documentation  | [data_directory](https://www.postgresql.org/docs/11/runtime-config-file-locations.html#GUC-DATA-DIRECTORY)       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### external_pid_file

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | File Locations |
| Description    | Writes the postmaster PID to the specified file. |
| Data type      | string    |
| Default value  |                                      |
| Allowed values |                                      |
| Parameter type | read-only      |
| Documentation  | [external_pid_file](https://www.postgresql.org/docs/11/runtime-config-file-locations.html#GUC-EXTERNAL-PID-FILE) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### hba_file

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | File Locations |
| Description    | Sets the server's \"hba\" configuration file.    |
| Data type      | string    |
| Default value  | `/datadrive/pg/data/pg_hba.conf`     |
| Allowed values | `/datadrive/pg/data/pg_hba.conf`     |
| Parameter type | read-only      |
| Documentation  | [hba_file](https://www.postgresql.org/docs/11/runtime-config-file-locations.html#GUC-HBA-FILE)                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### ident_file

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | File Locations |
| Description    | Sets the server's \"ident\" configuration file.  |
| Data type      | string    |
| Default value  | `/datadrive/pg/data/pg_ident.conf`   |
| Allowed values | `/datadrive/pg/data/pg_ident.conf`   |
| Parameter type | read-only      |
| Documentation  | [ident_file](https://www.postgresql.org/docs/11/runtime-config-file-locations.html#GUC-IDENT-FILE)               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



