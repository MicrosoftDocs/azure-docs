---
author: baanders
description: include file for Azure Digital Twins - cites known issue with Cloud Shell authentication
ms.service: digital-twins
ms.topic: include
ms.date: 9/1/2020
ms.author: baanders
---

>[!NOTE]
>There is currently a **known issue** in Cloud Shell affecting these command groups: `az dt route`, `az dt model`, `az dt twin`.
>
>To resolve, either run `az login` in Cloud Shell prior to running the command, or use the [local CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) instead of Cloud Shell. For more detail on this, see [*Troubleshooting: Known issues in Azure Digital Twins*](../articles/digital-twins/troubleshoot-known-issues.md#400-client-error-bad-request-in-cloud-shell).