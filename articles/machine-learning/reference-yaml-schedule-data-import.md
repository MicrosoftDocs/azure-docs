---
title: 'CLI (v2) schedule YAML schema for data import (preview)'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) data import schedule YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: amarbadal
ms.author: ambadal
ms.date: 05/25/2023
ms.reviewer: franksolomon
---

# CLI (v2) import schedule YAML schema

[!INCLUDE [CLI v2](includes/machine-learning-CLI-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/schedule.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `$schema` | string | The YAML schema. | |
| `name` | string | **Required.** Name of the schedule. | |
| `description` | string | Description of the schedule. | |
| `tags` | object | Dictionary of tags for the schedule. | |
| `trigger` | object | The trigger configuration to define rule when to trigger job. **One of `RecurrenceTrigger` or `CronTrigger` is required.** | |
| `import_data` | object or string | **Required.** The definition of the import data action that a schedule has triggered. **One of `string` or `ImportDataDefinition` is required.**| |

### Trigger configuration

#### Recurrence trigger

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | string | **Required.** Specifies the schedule type. |recurrence|
|`frequency`| string | **Required.** Specifies the unit of time that describes how often the schedule fires.|`minute`, `hour`, `day`, `week`, `month`|
|`interval`| integer | **Required.** Specifies the interval at which the schedule fires.| |
|`start_time`| string |Describes the start date and time with timezone. If start_time is omitted, the first job will run instantly, and the future jobs trigger based on the schedule, saying start_time will match the job created time. If the start time is in the past, the first job runs at the next calculated run time.|
|`end_time`| string |Describes the end date and time with timezone. If end_time is omitted, the schedule runs until it's explicitly disabled.|
|`timezone`| string |Specifies the time zone of the recurrence. If omitted, by default is UTC. |See [appendix for timezone values](#timezone)|
|`pattern`|object|Specifies the pattern of the recurrence. If pattern is omitted, the job(s) is triggered according to the logic of start_time, frequency and interval.| |

#### Recurrence schedule

Recurrence schedule defines the recurrence pattern, containing `hours`, `minutes`, and `weekdays`.

- When frequency is `day`, pattern can specify `hours` and `minutes`.
- When frequency is `week` and `month`, pattern can specify `hours`, `minutes` and `weekdays`.

| Key | Type | Allowed values |
| --- | ---- | -------------- |
|`hours`|integer or array of integer|`0-23`|
|`minutes`|integer or array of integer|`0-59`|
|`week_days`|string or array of string|`monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`|

#### CronTrigger

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | string | **Required.** Specifies the schedule type. |cron|
| `expression` | string | **Required.** Specifies the cron expression to define how to trigger jobs. expression uses standard crontab expression to express a recurring schedule. A single expression is composed of five space-delimited fields:`MINUTES HOURS DAYS MONTHS DAYS-OF-WEEK`||
|`start_time`| string |Describes the start date and time with timezone. If start_time is omitted, the first job will run instantly and the future jobs trigger based on the schedule, saying start_time will match the job created time. If the start time is in the past, the first job runs at the next calculated run time.|
|`end_time`| string |Describes the end date and time with timezone. If end_time is omitted, the schedule continues to run until it's explicitly disabled.|
|`timezone`| string |Specifies the time zone of the recurrence. If omitted, by default is UTC. |See [appendix for timezone values](#timezone)|

### Import data definition (preview)

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

Customer can directly use `import_data: ./<data_import>.yaml` or can use the following properties to define the data import definition.

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
|`type`| string | **Required.** Specifies the data asset type that you want to import the data as. It can be mltable when importing from a Database source, or uri_folder when importing from a FileSource.|`mltable`, `uri_folder`|
| `name` | string | **Required.** Data asset name to register the imported data under. | |
| `path` | string | **Required.** The path to the datastore that takes in the imported data, specified in one of two ways:  <br><br> - **Required.** A URI of datastore path. Only supported URI type is `azureml`. For more information on how to use the `azureml://` URI format, see [Core yaml syntax](reference-yaml-core-syntax.md). To avoid an over-write, a unique path for each import is recommended. To do this, parameterize the path as shown in this example - `azureml://datastores/<datastore_name>/paths/<source_name>/${{name}}`. The "datastore_name" in the example can be a datastore that you have created or can be workspaceblobstore. Alternately a "managed datastore" can be selected by referencing as shown: `azureml://datastores/workspacemanagedstore`, where the system automatically assigns a unique path. | Azure Machine Learning://<>|
| `source` | object | External source details of the imported data source. See [Attributes of the `source`](#attributes-of-source-preview) for the set of source properties. | |

### Attributes of `source` (preview)

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of external source from where you intend to import data from. Only the following types are allowed at the moment -  `Database` or `FileSystem`| `Database`, `FileSystem` | |
| `query` | string | Define this value only when the `type` defined above is `database` The query in the external source of type `Database` that defines or filters data that needs to be imported.| | |
| `path` | string | Define this value only when the `type` defined above is `FileSystem` The folder path of the folder in the external source of type `FileSystem` where the file(s) or data that needs to be imported resides.| | |
| `connection` | string | **Required.** The connection property for the external source referenced in the format of `azureml:<connection_name>` | | |

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Remarks

The `az ml schedule` command can be used for managing Azure Machine Learning models.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/blob/main/cli/assets/data/README.md). A couple are shown below.

## YAML: Schedule for a data import with recurrence pattern

[!INCLUDE [CLI v2](includes/machine-learning-CLI-v2.md)]

## YAML: Schedule for data import with recurrence pattern (preview)
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: simple_recurrence_import_schedule
display_name: Simple recurrence import schedule
description: a simple hourly recurrence import schedule

trigger:
  type: recurrence
  frequency: day #can be minute, hour, day, week, month
  interval: 1 #every day
  schedule:
    hours: [4,5,10,11,12]
    minutes: [0,30]
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data: ./my-snowflake-import-data.yaml

```
## YAML: Schedule for data import definition inline with recurrence pattern on managed datastore (preview)
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: inline_recurrence_import_schedule
display_name: Inline recurrence import schedule
description: an inline hourly recurrence import schedule

trigger:
  type: recurrence
  frequency: day #can be minute, hour, day, week, month
  interval: 1 #every day
  schedule:
    hours: [4,5,10,11,12]
    minutes: [0,30]
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data:
  type: mltable
  name: my_snowflake_ds
  path: azureml://datastores/workspacemanagedstore
  source:
    type: database
    query: select * from TPCH_SF1.REGION
    connection: azureml:my_snowflake_connection

```

## YAML: Schedule for a data import with cron expression

[!INCLUDE [CLI v2](includes/machine-learning-CLI-v2.md)]

## YAML: Schedule for data import with cron expression (preview)
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: simple_cron_import_schedule
display_name: Simple cron import schedule
description: a simple hourly cron import schedule

trigger:
  type: cron
  expression: "0 * * * *"
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data: ./my-snowflake-import-data.yaml
```

## YAML: Schedule for data import definition inline with cron expression (preview)
```yml
$schema: https://azuremlschemas.azureedge.net/latest/schedule.schema.json
name: inline_cron_import_schedule
display_name: Inline cron import schedule
description: an inline hourly cron import schedule

trigger:
  type: cron
  expression: "0 * * * *"
  start_time: "2022-07-10T10:00:00" # optional - default will be schedule creation time
  time_zone: "Pacific Standard Time" # optional - default will be UTC

import_data:
  type: mltable
  name: my_snowflake_ds
  path: azureml://datastores/workspaceblobstore/paths/snowflake/${{name}}
  source:
    type: database
    query: select * from TPCH_SF1.REGION
    connection: azureml:my_snowflake_connection
```
## Appendix

### Timezone

The current schedule supports the timezones in this table. The key can be used directly in the Python SDK, while the value can be used in the data import YAML. The table is sorted by UTC (Coordinated Universal Time).

| UTC         | Key                             | Value                             |
|-------------|---------------------------------|-----------------------------------|
| UTC -12:00  | DATELINE_STANDARD_TIME          | "Dateline Standard Time"          |
| UTC -11:00  | UTC_11                          | "UTC-11"                          |
| UTC - 10:00 | ALEUTIAN_STANDARD_TIME          | Aleutian Standard Time            |
| UTC - 10:00 | HAWAIIAN_STANDARD_TIME          | "Hawaiian Standard Time"          |
| UTC -09:30  | MARQUESAS_STANDARD_TIME         | "Marquesas Standard Time"         |
| UTC -09:00  | ALASKAN_STANDARD_TIME           | "Alaskan Standard Time"           |
| UTC -09:00  | UTC_09                          | "UTC-09"                          |
| UTC -08:00  | PACIFIC_STANDARD_TIME_MEXICO    | "Pacific Standard Time (Mexico)"  |
| UTC -08:00  | UTC_08                          | "UTC-08"                          |
| UTC -08:00  | PACIFIC_STANDARD_TIME           | "Pacific Standard Time"           |
| UTC -07:00  | US_MOUNTAIN_STANDARD_TIME       | "US Mountain Standard Time"       |
| UTC -07:00  | MOUNTAIN_STANDARD_TIME_MEXICO   | "Mountain Standard Time (Mexico)" |
| UTC -07:00  | MOUNTAIN_STANDARD_TIME          | "Mountain Standard Time"          |
| UTC -06:00  | CENTRAL_AMERICA_STANDARD_TIME   | "Central America Standard Time"   |
| UTC -06:00  | CENTRAL_STANDARD_TIME           | "Central Standard Time"           |
| UTC -06:00  | EASTER_ISLAND_STANDARD_TIME     | "Easter Island Standard Time"     |
| UTC -06:00  | CENTRAL_STANDARD_TIME_MEXICO    | "Central Standard Time (Mexico)"  |
| UTC -06:00  | CANADA_CENTRAL_STANDARD_TIME    | "Canada Central Standard Time"    |
| UTC -05:00  | SA_PACIFIC_STANDARD_TIME        | "SA Pacific Standard Time"        |
| UTC -05:00  | EASTERN_STANDARD_TIME_MEXICO    | "Eastern Standard Time (Mexico)"  |
| UTC -05:00  | EASTERN_STANDARD_TIME           | "Eastern Standard Time"           |
| UTC -05:00  | HAITI_STANDARD_TIME             | "Haiti Standard Time"             |
| UTC -05:00  | CUBA_STANDARD_TIME              | "Cuba Standard Time"              |
| UTC -05:00  | US_EASTERN_STANDARD_TIME        | "US Eastern Standard Time"        |
| UTC -05:00  | TURKS_AND_CAICOS_STANDARD_TIME  | "Turks And Caicos Standard Time"  |
| UTC -04:00  | PARAGUAY_STANDARD_TIME          | "Paraguay Standard Time"          |
| UTC -04:00  | ATLANTIC_STANDARD_TIME          | "Atlantic Standard Time"          |
| UTC -04:00  | VENEZUELA_STANDARD_TIME         | "Venezuela Standard Time"         |
| UTC -04:00  | CENTRAL_BRAZILIAN_STANDARD_TIME | "Central Brazilian Standard Time" |
| UTC -04:00  | SA_WESTERN_STANDARD_TIME        | "SA Western Standard Time"        |
| UTC -04:00  | PACIFIC_SA_STANDARD_TIME        | "Pacific SA Standard Time"        |
| UTC -03:30  | NEWFOUNDLAND_STANDARD_TIME      | "Newfoundland Standard Time"      |
| UTC -03:00  | TOCANTINS_STANDARD_TIME         | "Tocantins Standard Time"         |
| UTC -03:00  | E_SOUTH_AMERICAN_STANDARD_TIME  | "E. South America Standard Time"  |
| UTC -03:00  | SA_EASTERN_STANDARD_TIME        | "SA Eastern Standard Time"        |
| UTC -03:00  | ARGENTINA_STANDARD_TIME         | "Argentina Standard Time"         |
| UTC -03:00  | GREENLAND_STANDARD_TIME         | "Greenland Standard Time"         |
| UTC -03:00  | MONTEVIDEO_STANDARD_TIME        | "Montevideo Standard Time"        |
| UTC -03:00  | SAINT_PIERRE_STANDARD_TIME      | "Saint Pierre Standard Time"      |
| UTC -03:00  | BAHIA_STANDARD_TIM              | "Bahia Standard Time"             |
| UTC -02:00  | UTC_02                          | "UTC-02"                          |
| UTC -02:00  | MID_ATLANTIC_STANDARD_TIME      | "Mid-Atlantic Standard Time"      |
| UTC -01:00  | AZORES_STANDARD_TIME            | "Azores Standard Time"            |
| UTC -01:00  | CAPE_VERDE_STANDARD_TIME        | "Cape Verde Standard Time"        |
| UTC         | UTC                             | UTC                               |
| UTC +00:00  | GMT_STANDARD_TIME               | "GMT Standard Time"               |
| UTC +00:00  | GREENWICH_STANDARD_TIME         | "Greenwich Standard Time"         |
| UTC +01:00  | MOROCCO_STANDARD_TIME           | "Morocco Standard Time"           |
| UTC +01:00  | W_EUROPE_STANDARD_TIME          | "W. Europe Standard Time"         |
| UTC +01:00  | CENTRAL_EUROPE_STANDARD_TIME    | "Central Europe Standard Time"    |
| UTC +01:00  | ROMANCE_STANDARD_TIME           | "Romance Standard Time"           |
| UTC +01:00  | CENTRAL_EUROPEAN_STANDARD_TIME  | "Central European Standard Time"  |
| UTC +01:00  | W_CENTRAL_AFRICA_STANDARD_TIME  | "W. Central Africa Standard Time" |
| UTC +02:00  | NAMIBIA_STANDARD_TIME           | "Namibia Standard Time"           |
| UTC +02:00  | JORDAN_STANDARD_TIME            | "Jordan Standard Time"            |
| UTC +02:00  | GTB_STANDARD_TIME               | "GTB Standard Time"               |
| UTC +02:00  | MIDDLE_EAST_STANDARD_TIME       | "Middle East Standard Time"       |
| UTC +02:00  | EGYPT_STANDARD_TIME             | "Egypt Standard Time"             |
| UTC +02:00  | E_EUROPE_STANDARD_TIME          | "E. Europe Standard Time"         |
| UTC +02:00  | SYRIA_STANDARD_TIME             | "Syria Standard Time"             |
| UTC +02:00  | WEST_BANK_STANDARD_TIME         | "West Bank Standard Time"         |
| UTC +02:00  | SOUTH_AFRICA_STANDARD_TIME      | "South Africa Standard Time"      |
| UTC +02:00  | FLE_STANDARD_TIME               | "FLE Standard Time"               |
| UTC +02:00  | ISRAEL_STANDARD_TIME            | "Israel Standard Time"            |
| UTC +02:00  | KALININGRAD_STANDARD_TIME       | "Kaliningrad Standard Time"       |
| UTC +02:00  | LIBYA_STANDARD_TIME             | "Libya Standard Time"             |
| UTC +03:00  | TÜRKIYE_STANDARD_TIME           | "Türkiye Standard Time"           |
| UTC +03:00  | ARABIC_STANDARD_TIME            | "Arabic Standard Time"            |
| UTC +03:00  | ARAB_STANDARD_TIME              | "Arab Standard Time"              |
| UTC +03:00  | BELARUS_STANDARD_TIME           | "Belarus Standard Time"           |
| UTC +03:00  | RUSSIAN_STANDARD_TIME           | "Russian Standard Time"           |
| UTC +03:00  | E_AFRICA_STANDARD_TIME          | "E. Africa Standard Time"         |
| UTC +03:30  | IRAN_STANDARD_TIME              | "Iran Standard Time"              |
| UTC +04:00  | ARABIAN_STANDARD_TIME           | "Arabian Standard Time"           |
| UTC +04:00  | ASTRAKHAN_STANDARD_TIME         | "Astrakhan Standard Time"         |
| UTC +04:00  | AZERBAIJAN_STANDARD_TIME        | "Azerbaijan Standard Time"        |
| UTC +04:00  | RUSSIA_TIME_ZONE_3              | "Russia Time Zone 3"              |
| UTC +04:00  | MAURITIUS_STANDARD_TIME         | "Mauritius Standard Time"         |
| UTC +04:00  | GEORGIAN_STANDARD_TIME          | "Georgian Standard Time"          |
| UTC +04:00  | CAUCASUS_STANDARD_TIME          | "Caucasus Standard Time"          |
| UTC +04:30  | AFGHANISTAN_STANDARD_TIME       | "Afghanistan Standard Time"       |
| UTC +05:00  | WEST_ASIA_STANDARD_TIME         | "West Asia Standard Time"         |
| UTC +05:00  | EKATERINBURG_STANDARD_TIME      | "Ekaterinburg Standard Time"      |
| UTC +05:00  | PAKISTAN_STANDARD_TIME          | "Pakistan Standard Time"          |
| UTC +05:30  | INDIA_STANDARD_TIME             | "India Standard Time"             |
| UTC +05:30  | SRI_LANKA_STANDARD_TIME         | "Sri Lanka Standard Time"         |
| UTC +05:45  | NEPAL_STANDARD_TIME             | "Nepal Standard Time"             |
| UTC +06:00  | CENTRAL_ASIA_STANDARD_TIME      | "Central Asia Standard Time"      |
| UTC +06:00  | BANGLADESH_STANDARD_TIME        | "Bangladesh Standard Time"        |
| UTC +06:30  | MYANMAR_STANDARD_TIME           | "Myanmar Standard Time"           |
| UTC +07:00  | N_CENTRAL_ASIA_STANDARD_TIME    | "N. Central Asia Standard Time"   |
| UTC +07:00  | SE_ASIA_STANDARD_TIME           | "SE Asia Standard Time"           |
| UTC +07:00  | ALTAI_STANDARD_TIME             | "Altai Standard Time"             |
| UTC +07:00  | W_MONGOLIA_STANDARD_TIME        | "W. Mongolia Standard Time"       |
| UTC +07:00  | NORTH_ASIA_STANDARD_TIME        | "North Asia Standard Time"        |
| UTC +07:00  | TOMSK_STANDARD_TIME             | "Tomsk Standard Time"             |
| UTC +08:00  | CHINA_STANDARD_TIME             | "China Standard Time"             |
| UTC +08:00  | NORTH_ASIA_EAST_STANDARD_TIME   | "North Asia East Standard Time"   |
| UTC +08:00  | SINGAPORE_STANDARD_TIME         | "Singapore Standard Time"         |
| UTC +08:00  | W_AUSTRALIA_STANDARD_TIME       | "W. Australia Standard Time"      |
| UTC +08:00  | TAIPEI_STANDARD_TIME            | "Taipei Standard Time"            |
| UTC +08:00  | ULAANBAATAR_STANDARD_TIME       | "Ulaanbaatar Standard Time"       |
| UTC +08:45  | AUS_CENTRAL_W_STANDARD_TIME     | "Aus Central W. Standard Time"    |
| UTC +09:00  | NORTH_KOREA_STANDARD_TIME       | "North Korea Standard Time"       |
| UTC +09:00  | TRANSBAIKAL_STANDARD_TIME       | "Transbaikal Standard Time"       |
| UTC +09:00  | TOKYO_STANDARD_TIME             | "Tokyo Standard Time"             |
| UTC +09:00  | KOREA_STANDARD_TIME             | "Korea Standard Time"             |
| UTC +09:00  | YAKUTSK_STANDARD_TIME           | "Yakutsk Standard Time"           |
| UTC +09:30  | CEN_AUSTRALIA_STANDARD_TIME     | "Cen. Australia Standard Time"    |
| UTC +09:30  | AUS_CENTRAL_STANDARD_TIME       | "AUS Central Standard Time"       |
| UTC +10:00  | E_AUSTRALIAN_STANDARD_TIME      | "E. Australia Standard Time"      |
| UTC +10:00  | AUS_EASTERN_STANDARD_TIME       | "AUS Eastern Standard Time"       |
| UTC +10:00  | WEST_PACIFIC_STANDARD_TIME      | "West Pacific Standard Time"      |
| UTC +10:00  | TASMANIA_STANDARD_TIME          | "Tasmania Standard Time"          |
| UTC +10:00  | VLADIVOSTOK_STANDARD_TIME       | "Vladivostok Standard Time"       |
| UTC +10:30  | LORD_HOWE_STANDARD_TIME         | "Lord Howe Standard Time"         |
| UTC +11:00  | BOUGAINVILLE_STANDARD_TIME       | "Bougainville Standard Time"     |
| UTC +11:00  | RUSSIA_TIME_ZONE_10             | "Russia Time Zone 10"             |
| UTC +11:00  | MAGADAN_STANDARD_TIME           | "Magadan Standard Time"           |
| UTC +11:00  | NORFOLK_STANDARD_TIME           | "Norfolk Standard Time"           |
| UTC +11:00  | SAKHALIN_STANDARD_TIME          | "Sakhalin Standard Time"          |
| UTC +11:00  | CENTRAL_PACIFIC_STANDARD_TIME   | "Central Pacific Standard Time"   |
| UTC +12:00  | RUSSIA_TIME_ZONE_11             | "Russia Time Zone 11"             |
| UTC +12:00  | NEW_ZEALAND_STANDARD_TIME       | "New Zealand Standard Time"       |
| UTC +12:00  | UTC_12                          | "UTC+12"                          |
| UTC +12:00  | FIJI_STANDARD_TIME              | "Fiji Standard Time"              |
| UTC +12:00  | KAMCHATKA_STANDARD_TIME         | "Kamchatka Standard Time"         |
| UTC +12:45  | CHATHAM_ISLANDS_STANDARD_TIME   | "Chatham Islands Standard Time"   |
| UTC +13:00  | TONGA__STANDARD_TIME            | "Tonga Standard Time"             |
| UTC +13:00  | SAMOA_STANDARD_TIME             | "Samoa Standard Time"             |
| UTC +14:00  | LINE_ISLANDS_STANDARD_TIME      | "Line Islands Standard Time"      |