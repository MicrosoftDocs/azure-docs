---
title: Known issue - AutoML Error retrieving generated code FilesharePermissionFailure:Unable to copy files
description: A known issue is posted where you may not be able to update the credentials for that data source even with owner permission.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - AutoML | Error retrieving generated code FilesharePermissionFailure:Unable to copy files


If you have owner permission but no gateway level permission on a data source, you may not be able to update the credentials for that data source.  The page will just show as loading and the credentials won't update.

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

**Status:** Open


**Problem area:** [Option]
<!--- Current options are 'Workspace RP', 'Compute', 'Inferencing',  or 'Pipelines and Designer' --->


## Cause

When a workspace has a public IP but the storage is private,  the workspace cannot directly interact with the storage account.

## Solutions and workarounds

Starting from the **Outputs+Logs** tab, navigate to the *generated_code* folder to download the script or notebook to your workstation. Then, upload it to the notebooks or the storage account directly

## Next steps

- [About known issues](/articles/machine-learning/azureml-known-issues.md
