---
title: Azure Site Recovery deployment planner upgrade process| Microsoft Docs
description: This article describes how to upgrade Azure Site Recovery deployment planner tool with the latest version.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: garavd
editor:

ms.assetid:
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/26/2017
ms.author: nisoneji

---
# Updating the deployment planner
To update the deployment planner, do the following:

1. Download the latest version of the [Azure Site Recovery deployment planner](https://aka.ms/asr-deployment-planner).

2. Copy the .zip folder to a server that you want to run it on.

3. Extract the .zip folder.

4. Do either of the following:
 * If the latest version doesn't contain a profiling fix and profiling is already in progress on your current version of the planner, continue the profiling.
 * If the latest version does contain a profiling fix, we recommended that you stop profiling on your current version and restart the profiling with the new version.

  >[!NOTE]
  >
  >When you start profiling with the new version, pass the same output directory path so that the tool appends profile data on the existing files. A complete set of profiled data will be used to generate the report. If you pass a different output directory, new files are created, and old profiled data is not used to generate the report.
  >
  >Each new deployment planner is a cumulative update of the .zip file. You don't need to copy the newest files to the previous  folder. You can create and use a new folder.nt version and restart the profiling with the new version.

## Next steps
   