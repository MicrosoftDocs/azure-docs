---
title: include file
description: include file
services: functions
author: ggailey777
manager: cfowler
ms.service: functions
ms.topic: include
ms.date: 05/01/2018
ms.author: glenga
ms.custom: include file
---

When the Functions host runs locally, it writes logs to the following path:

```
<DefaultTempDirectory>\LogFiles\Application\Functions
```

On Windows, `<DefaultTempDirectory>` is the first found value of the TMP, TEMP, USERPROFILE environment variables, or the Windows directory.
On MacOS or Linux, `<DefaultTempDirectory>` is the TMPDIR environment variable.

> [!NOTE]
> When the Functions host starts, it overwrites the existing file structure in the directory.