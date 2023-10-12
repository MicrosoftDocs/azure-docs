---
title: azcopy doc
description: This article provides reference information for the azcopy doc command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/26/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy doc

Generates documentation for the tool in Markdown format.

## Synopsis

Generates documentation for the tool in Markdown format, and stores them in the designated location.

By default, the files are stored in a folder named 'doc' inside the current directory.

```azcopy
azcopy doc [flags]
```

## Options

`-h`, `--help`    help for doc
`--output-location`    (string)    where to put the generated markdown files (default "./doc")

## Options inherited from parent commands

`--cap-mbps`    (float)    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text").

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Microsoft Entra login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.

## See also

- [azcopy](storage-ref-azcopy.md)
