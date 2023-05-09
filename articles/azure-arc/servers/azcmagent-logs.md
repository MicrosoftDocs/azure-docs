---
title: azcmagent logs CLI reference
description: Syntax for the azcmagent logs command line tool
ms.topic: reference
ms.date: 04/20/2023
---

# azcmagent logs

Collects log files for the Azure connected machine agent and extensions into a ZIP archive.

## Usage

```
azcmagent logs [flags]
```

## Examples

Collect the most recent log files and store them in a ZIP archive in the current directory.

```
azcmagent logs
```

Collect all log files and store them in a specific location.

```
azcmagent logs --full --output "/tmp/azcmagent-logs.zip"
```

## Flags

`-f`, `--full`

Collect all log files on the system instead of just the most recent. Useful when troubleshooting older problems.

`-o`, `--output`

Specifies the path and name for the ZIP file. If this flag isn't specified, the ZIP is saved to the console's current directory with the name "azcmagent-_TIMESTAMP_-_COMPUTERNAME_.zip"

Sample value: custom-logname.zip

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
