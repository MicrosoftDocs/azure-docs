---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### client_encoding

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the client-side encoding (character set). The default is to use the database encoding.                                                            |
| Data type      | enumeration |
| Default value  | `UTF8`               |
| Allowed values | `BIG5,EUC_CN,EUC_JP,EUC_JIS_2004,EUC_KR,EUC_TW,GB18030,GBK,ISO_8859_5,ISO_8859_6,ISO_8859_7,ISO_8859_8,JOHAB,KOI8R,KOI8U,LATIN1,LATIN2,LATIN3,LATIN4,LATIN5,LATIN6,LATIN7,LATIN8,LATIN9,LATIN10,MULE_INTERNAL,SJIS,SHIFT_JIS_2004,SQL_ASCII,UHC,UTF8,WIN866,WIN874,WIN1250,WIN1251,WIN1252,WIN1253,WIN1254,WIN1255,WIN1256,WIN1257,WIN1258` |
| Parameter type | dynamic        |
| Documentation  | [client_encoding](https://www.postgresql.org/docs/16/runtime-config-client.html)            |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### DateStyle

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the display format for date and time values.                                                                                                      |
| Data type      | string      |
| Default value  | `ISO, MDY`           |
| Allowed values | `(ISO|POSTGRES|SQL|GERMAN)(, (DMY|MDY|YMD))?`                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  |                                                                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### default_text_search_config

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Selects the text search configuration that is used by those variants of the text search functions that do not have an explicit argument specifying it. |
| Data type      | string      |
| Default value  | `pg_catalog.english` |
| Allowed values | `[A-Za-z._]+`                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  | [default_text_search_config](https://www.postgresql.org/docs/16/runtime-config-client.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### extra_float_digits

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the number of digits displayed for floating-point values.                                                                                         |
| Data type      | integer     |
| Default value  | `1`                  |
| Allowed values | `-15-3`                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [extra_float_digits](https://www.postgresql.org/docs/16/runtime-config-client.html)         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### IntervalStyle

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the display format for interval values.                                                                                                           |
| Data type      | enumeration |
| Default value  | `postgres`           |
| Allowed values | `postgres,postgres_verbose,sql_standard,iso_8601`                                                                                                                                                                                                                                                                                           |
| Parameter type | dynamic        |
| Documentation  |                                                                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### lc_messages

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the language in which messages are displayed.                                                                                                     |
| Data type      | string      |
| Default value  | `en_US.utf8`         |
| Allowed values | `en_US.utf8`                                                                                                                                                                                                                                                                                                                                |
| Parameter type | read-only      |
| Documentation  |                                                                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### lc_monetary

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the locale for formatting monetary amounts.                                                                                                       |
| Data type      | string      |
| Default value  | `en_US.utf-8`        |
| Allowed values | `[A-Za-z0-9._ -]+`                                                                                                                                                                                                                                                                                                                          |
| Parameter type | dynamic        |
| Documentation  | [lc_monetary](https://www.postgresql.org/docs/16/runtime-config-client.html)                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### lc_numeric

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the locale for formatting numbers.                                                                                                                |
| Data type      | string      |
| Default value  | `en_US.utf-8`        |
| Allowed values | `[A-Za-z0-9._ -]+`                                                                                                                                                                                                                                                                                                                          |
| Parameter type | dynamic        |
| Documentation  | [lc_numeric](https://www.postgresql.org/docs/16/runtime-config-client.html)                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### lc_time

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the locale for formatting date and time values.                                                                                                   |
| Data type      | string      |
| Default value  | `en_US.utf8`         |
| Allowed values | `en_US.utf8`                                                                                                                                                                                                                                                                                                                                |
| Parameter type | read-only      |
| Documentation  |                                                                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### TimeZone

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Sets the time zone for displaying and interpreting time stamps.                                                                                        |
| Data type      | string      |
| Default value  | `UTC`                |
| Allowed values | `[A-Za-z0-9/+_-]+`                                                                                                                                                                                                                                                                                                                          |
| Parameter type | dynamic        |
| Documentation  | [TimeZone](https://www.postgresql.org/docs/16/runtime-config-client.html)                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### timezone_abbreviations

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Locale and Formatting |
| Description    | Selects a file of time zone abbreviations.                                                                                                             |
| Data type      | string      |
| Default value  | `Default`            |
| Allowed values | `Default`                                                                                                                                                                                                                                                                                                                                   |
| Parameter type | read-only      |
| Documentation  |                                                                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



