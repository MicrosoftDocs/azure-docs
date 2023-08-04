---
title: Known issue - AutoML Error retrieving generated code FilesharePermissionFailure:Unable to copy files
description: A known issue is posted when a workspace has public IP but the storage is private then the workspace cannot interact with the storage account directly.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - AutoML | Error retrieving generated code FilesharePermissionFailure:Unable to copy files to fileshare because authorization failed.


When a workspace has a public IP but the storage is private, then the workspace cannot interact with the storage account directly.

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

**Status:** Open
S

**Problem area:** Workspace RP


## Cause

When a workspace has a public IP but the storage is private,  the workspace cannot directly interact with the storage account.

## Solutions and workarounds

Starting from the **Outputs+Logs** tab, navigate to the *generated_code* folder to download the script or notebook to your workstation. Then, upload it to the notebooks or the storage account directly

## Next steps

- [About known issues](azureml-known-issues.md)
