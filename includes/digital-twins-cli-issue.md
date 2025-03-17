---
title: include file
description: Include file for a warning about a known issue with CLI commands.
author: baanders
ms.author: baanders
ms.service: azure-digital-twins
ms.topic: include
ms.date: 3/17/2025
---

>[!NOTE]
> Due to a [known issue](../articles/digital-twins/troubleshoot-known-issues.md#az-dt-commands-fail-in-azure-cli-version-270) with the Azure CLI, `az dt` commands that are run in version 2.70 of the Azure CLI fail with an *AttributeError* message. To bypass this issue, [install](/cli/azure/install-azure-cli) version 2.69 of the CLI locally.