---
title: How to create resource set pattern rules
description: Learn how to create a resource set pattern rule to overwrite how assets get grouped into resource sets
author: djpmsft
ms.author: daperlov
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 04/15/2021
---

# Create resource set pattern rules

At-scale data processing systems typically store a single table on a disk as multiple files. This concept is represented in Azure Purview by using resource sets. A resource set is a single object in the data catalog that represents a large number of assets in storage. To learn more, see [Understanding resource sets](concept-resource-sets.md).

When scanning a storage account, Azure Purview uses a set of defined patterns to determine if a group of assets is a resource set. In some cases, Azure Purview's resource set grouping may not accurately reflect your data estate. Resource set pattern rules allow you to customize or override how Azure Purview detects which assets are grouped as resource sets and how they are displayed within the catalog.

Pattern rules are currently supported in the following source types:
- Azure Data Lake Storage Gen2
- Azure Blob Storage
- Azure Files


## How to create a resource set pattern rule

Follow the steps below to create a new resource set pattern rule:

1. Go to the management center. Select **Pattern rules** from the menu under the Resource sets heading. Select **+ New** to create a new rule set.

   :::image type="content" source="media/how-to-resource-set-pattern-rules/create-new-scoped-resource-set-rule.png" alt-text="Create new resource set pattern rule" border="true":::

1. Enter the scope of your resource set pattern rule. Select your storage account type and the name of the storage account you wish to create a rule set on. Each set of rules is applied relative to a folder path scope specified in the **Folder path** field.

   :::image type="content" source="media/how-to-resource-set-pattern-rules/create-new-scoped-resource-set-scope.png" alt-text="Create resource set pattern rule configurations" border="true":::

1. To enter a rule for a configuration scope, select **+ New Rule**.

1. Enter in the following fields to create a rule:

   1. **Rule name:** The name of the configuration rule. This field has no effect on the assets the rule applies to.

   1. **Qualified name:** A qualified path that uses a combination of text, dynamic replacers, and static replacers to match assets to the configuration rule. This path is relative to the scope of the configuration rule. See the [syntax](#syntax) section below for detailed instructions on how to specify qualified names.

   1. **Display name:** The display name of the asset. This field is optional. Use plain text and static replacers to customize how an asset is displayed in the catalog. For more detailed instructions, see the [syntax](#syntax) section below.

   1. **Do not group as resource set:** If enabled, matched resource won't be grouped into a resource set.

      :::image type="content" source="media/how-to-resource-set-pattern-rules/scoped-resource-set-rule-example.png" alt-text="Create new configuration rule." border="true":::

1. Save the rule by clicking **Add**.

## <a name="syntax"></a> Pattern rule syntax

When creating resource set pattern rules, use the following syntax to specify which assets rules apply to.

### Dynamic replacers (single brackets)

Single brackets are used as **dynamic replacers** in a pattern rules. Specify a dynamic replacer in the qualified name using format `{<replacerName:<replacerType>}`. If matched, dynamic replacers are used as a grouping condition that indicate assets should be represented as a resource set. If the assets are grouped into a resource set, the resource set qualified path would contain `{replacerName}` where the replacer was specified.

For example, If two assets `folder1/file-1.csv` and `folder2/file-2.csv` matched to rule `{folder:string}/file-{NUM:int}.csv`, the resource set would be a single entity `{folder}/file-{NUM}.csv`.

#### Special case: Dynamic replacers when not grouping into resource set

If *Do not group as resource set* is enabled for a pattern rule, the replacer name is an optional field. `{:<replacerType>}` is valid syntax. For example, `file-{:int}.csv` would successfully match for `file-1.csv` and `file-2.csv` and create two different assets instead of a resource set.

### Static replacers (double brackets)

Double brackets are used as **static replacers** in the qualified name of a pattern rule. Specify a static replacer in the qualified name using format `{{<replacerName>:<replacerType>}}`. If matched, each set of unique static replacer values will create different resource set groupings.

For example, If two assets `folder1/file-1.csv` and `folder2/file-2.csv` matched to rule `{{folder:string}}/file-{NUM:int}.csv`, two resource sets would be created `folder1/file-{NUM}.csv` and `folder2/file-{NUM}.csv`.

Static replacers can be used to specify the display name of an asset matching to a pattern rule. Using `{{<replacerName>}}` in the display name of a rule will use the matched value in the asset name.

### Available replacement types

Below are the available types that can be used in static and dynamic replacers:

| Type | Structure |
| ---- | --------- |
| string | A series of 1 or more Unicode characters including delimiters like spaces. |
| int | A series of 1 or more 0-9 ASCII characters, it can be 0 prefixed (e.g. 0001). |
| guid | A series of 32 or 8-4-4-4-12 string representation of an UUID as defineddefa in [RFC 4122](https://tools.ietf.org/html/rfc4122). |
| date | A series of 6 or 8 0-9 ASCII characters with optionally separators: yyyymmdd, yyyy-mm-dd, yymmdd, yy-mm-dd, specified in [RFC 3339](https://tools.ietf.org/html/rfc3339). |
| time | A series of 4 or 6 0-9 ASCII characters with optionally separators: HHmm, HH:mm, HHmmss, HH:mm:ss specified in [RFC 3339](https://tools.ietf.org/html/rfc3339). |
| timestamp | A series of 12 or 14 0-9 ASCII characters with optionally separators: yyyy-mm-ddTHH:mm, yyyymmddhhmm, yyyy-mm-ddTHH:mm:ss, yyyymmddHHmmss specified in [RFC 3339](https://tools.ietf.org/html/rfc3339). |
| boolean | Can contain 'true' or 'false', case insensitive. |
| number | A series of 0 or more 0-9 ASCII characters, it can be 0 prefixed (e.g. 0001) followed by optionally a dot '.' and a series of 1 or more 0-9 ASCII characters, it can be 0 postfixed (e.g. .100) |
| hex | A series of 1 or more ASCII characters from the set 0-1 and A-F, the value can be 0 prefixed |
| locale | A string that matches the syntax specified in [RFC 5646](https://tools.ietf.org/html/rfc5646). |

## Order of resource set pattern rules getting applied

Below is the order of operations for applying pattern rules:

1. More specific scopes will take priority if an asset matches to two rules. For example, rules in a scope `container/folder` will apply before rules in scope `container`.

1. Order of rules within a specific scope. This can be edited in the UX.

1. If an asset doesn't match to any specified rule, the default resource set heuristics apply.

## Examples

### Example 1

SAP data extraction into full and delta loads

#### Inputs

Files:

- `https://myazureblob.blob.core.windows.net/bar/customer/full/2020/01/13/saptable_customer_20200101_20200102_01.txt`
- `https://myazureblob.blob.core.windows.net/bar/customer/full/2020/01/13/saptable_customer_20200101_20200102_02.txt`
- `https://myazureblob.blob.core.windows.net/bar/customer/delta/2020/01/15/saptable_customer_20200101_20200102_01.txt`
- `https://myazureblob.blob.core.windows.net/bar/customer/full/2020/01/17/saptable_customer_20200101_20200102_01.txt`
- `https://myazureblob.blob.core.windows.net/bar/customer/full/2020/01/17/saptable_customer_20200101_20200102_02.txt`

#### Pattern rule

**Scope:** `https://myazureblob.blob.core.windows.net/bar/`

**Display name:** 'External  Customer'

**Qualified Name:** `customer/{extract:string}/{year:int}/{month:int}/{day:int}/saptable_customer_{date_from:date}_{date_to:time}_{sequence:int}.txt`

**Resource Set:** true

#### Output

One resource set asset

**Display Name:** External Customer

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/customer/{extract}/{year}/{month}/{day}/saptable_customer_{date_from}_{date_to}_{sequence}.txt`

### Example 2

IoT data in avro format

#### Inputs

Files:

- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-001.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-002.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/02-01-2020/22:33:22-001.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-90/01-01-2020/22:33:22-001.avro`

#### Pattern rules

**Scope:** `https://myazureblob.blob.core.windows.net/bar/`

Rule 1

**Display name:** 'machine-89'

**Qualified Name:** `raw/machinename-89/{date:date}/{time:time}-{id:int}.avro`

**Resource Set:** true

Rule 2

**Display name:** 'machine-90'

**Qualified Name:** `raw/machinename-90/{date:date}/{time:time}-{id:int}.avro`

#### *Resource Set: true*

#### Outputs

2 resource sets

Resource Set 1

**Display Name:** machine-89

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/{date}/{time}-{id}.avro`

Resource Set 2

**Display Name:** machine-90

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-90/{date}/{time}-{id}.avro`

### Example 3

IoT data in avro format

#### Inputs

Files:

- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-001.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-002.avro`
- `https://myazureblob.blob.core.windows.netbar/raw/machinename-89/02-01-2020/22:33:22-001.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-90/01-01-2020/22:33:22-001.avro`

#### Pattern rule

**Scope:** `https://myazureblob.blob.core.windows.net/bar/`

**Display name:** 'Machine-{{machineid}}'

**Qualified Name:** `raw/machinename-{{machineid:int}}/{date:date}/{time:time}-{id:int}.avro`

**Resource Set:** true

#### Outputs

Resource Set 1

**Display name:** machine-89

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/{date}/{time}-{id}.avro`

Resource Set 2

**Display name:** machine-90

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-90/{date}/{time}-{id}.avro`

### Example 4

Don't group into resource sets

#### Inputs

Files:

- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-001.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-002.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/02-01-2020/22:33:22-001.avro`
- `https://myazureblob.blob.core.windows.net/bar/raw/machinename-90/01-01-2020/22:33:22-001.avro`

#### Pattern rule

**Scope:** `https://myazureblob.blob.core.windows.net/bar/`

**Display name:** `Machine-{{machineid}}`

**Qualified Name:** `raw/machinename-{{machineid:int}}/{{:date}}/{{:time}}-{{:int}}.avro`

**Resource Set:** false

#### Outputs

4 individual assets

Asset 1

**Display name:** machine-89

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-001.avro`

Asset 2

**Display name:** machine-89

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/01-01-2020/22:33:22-002.avro`

Asset 3

**Display name:** machine-89

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-89/02-01-2020/22:33:22-001.avro`

Asset 4

**Display name:** machine-90

**Qualified Name:** `https://myazureblob.blob.core.windows.net/bar/raw/machinename-90/01-01-2020/22:33:22-001.avro`

## Next steps

Get started by [registering and scanning an Azure Data Lake Gen2 storage account](register-scan-adls-gen2.md).