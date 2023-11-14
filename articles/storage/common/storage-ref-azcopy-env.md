---
title: azcopy env
description: This article provides reference information for the azcopy env command.
author: normesta
ms.service: azure-storage
ms.topic: reference
ms.date: 05/26/2022
ms.author: normesta
ms.subservice: storage-common-concepts
ms.reviewer: zezha-msft
---

# azcopy env

Shows the environment variables that can configure AzCopy's behavior. For a complete list of environment variables, see [AzCopy v10 configuration settings (Azure Storage)](storage-ref-azcopy-configuration-settings.md).

## Synopsis

Shows the environment variables that you can use to configure the behavior of AzCopy.

If you set an environment variable by using the command line, that variable will be readable in your command line history. Consider clearing variables that contain credentials from your command line history.  To keep variables from appearing in your history, you can use a script to prompt the user for their credentials, and to set the environment variable.

```azcopy
azcopy env [flags]
```

## Options

`-h`, `--help`    help for env
`--show-sensitive`    Shows sensitive/secret environment variables.

## Options inherited from parent commands

`--cap-mbps float`    Caps the transfer rate, in megabits per second. Moment-by-moment throughput might vary slightly from the cap. If this option is set to zero, or it's omitted, the throughput isn't capped.

`--output-type`    (string)    Format of the command's output. The choices include: text, json. The default value is 'text'. (default "text")

`--trusted-microsoft-suffixes`    (string)    Specifies additional domain suffixes where Microsoft Entra login tokens may be sent.  The default is '*.core.windows.net;*.core.chinacloudapi.cn;*.core.cloudapi.de;
*.core.usgovcloudapi.net;*.storage.azure.net'. Any listed here are added to the default. For security, you should only put Microsoft Azure domains here. Separate multiple entries with semi-colons.

## See also

- [azcopy](storage-ref-azcopy.md)
