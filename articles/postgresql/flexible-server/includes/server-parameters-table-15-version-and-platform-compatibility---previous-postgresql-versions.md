---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### array_nulls

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Version and Platform Compatibility / Previous PostgreSQL Versions |
| Description    | Enables input of NULL (case insensitive) to be considered as NULL value rather than the literal String 'NULL'. |
| Data type      | boolean     |
| Default value  | `on`            |
| Allowed values | `on,off`               |
| Parameter type | dynamic        |
| Documentation  | [array_nulls](https://www.postgresql.org/docs/15/arrays.html)                         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### backslash_quote

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Version and Platform Compatibility / Previous PostgreSQL Versions |
| Description    | Sets whether \"\\'\" is allowed in string literals.                                                            |
| Data type      | enumeration |
| Default value  | `safe_encoding` |
| Allowed values | `safe_encoding,on,off` |
| Parameter type | dynamic        |
| Documentation  |                                                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### escape_string_warning

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Version and Platform Compatibility / Previous PostgreSQL Versions |
| Description    | Warns about backslash escapes in ordinary string literals.                                                     |
| Data type      | boolean     |
| Default value  | `on`            |
| Allowed values | `on,off`               |
| Parameter type | dynamic        |
| Documentation  | [escape_string_warning](https://www.postgresql.org/docs/15/runtime-config-query.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### lo_compat_privileges

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Version and Platform Compatibility / Previous PostgreSQL Versions |
| Description    | Enables backward compatibility mode for privilege checks on large objects.                                     |
| Data type      | boolean     |
| Default value  | `off`           |
| Allowed values | `on,off`               |
| Parameter type | dynamic        |
| Documentation  | [lo_compat_privileges](https://www.postgresql.org/docs/15/runtime-config-client.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### quote_all_identifiers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Version and Platform Compatibility / Previous PostgreSQL Versions |
| Description    | When generating SQL fragments, quotes all identifiers.                                                         |
| Data type      | boolean     |
| Default value  | `off`           |
| Allowed values | `on,off`               |
| Parameter type | dynamic        |
| Documentation  |                                                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### standard_conforming_strings

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Version and Platform Compatibility / Previous PostgreSQL Versions |
| Description    | Causes '...' strings to treat backslashes literally.                                                           |
| Data type      | boolean     |
| Default value  | `on`            |
| Allowed values | `on,off`               |
| Parameter type | dynamic        |
| Documentation  |                                                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### synchronize_seqscans

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Version and Platform Compatibility / Previous PostgreSQL Versions |
| Description    | Enables synchronized sequential scans.                                                                         |
| Data type      | boolean     |
| Default value  | `on`            |
| Allowed values | `on,off`               |
| Parameter type | dynamic        |
| Documentation  |                                                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



