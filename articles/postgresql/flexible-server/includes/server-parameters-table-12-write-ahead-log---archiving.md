---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### archive_command

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Archiving |
| Description    | Sets the shell command that will be called to archive a WAL file.                         |
| Data type      | string      |
| Default value  | `BlobLogUpload.sh %f %p` |
| Allowed values | `BlobLogUpload.sh %f %p` |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### archive_mode

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Archiving |
| Description    | Allows archiving of WAL files using archive_command.                                      |
| Data type      | enumeration |
| Default value  | `always`                 |
| Allowed values | `always`                 |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### archive_timeout

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Archiving |
| Description    | Forces a switch to the next WAL file if a new file has not been started within N seconds. |
| Data type      | integer     |
| Default value  | `300`                    |
| Allowed values | `300`                    |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



