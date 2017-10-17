---
title: Set up the REST API for Azure Migrate | Microsoft Docs
description: Describes how to set up the REST API for the Azure Migrate service.
services: migration-planner
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 5cd17b0e-b7f2-4973-8806-aef39232f82c
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/25/2017
ms.author: raynew
---

# Set up the Azure Migrate REST API

This article describes how to set up the REST API for [Azure Migrate](migrate-overview.md), and provides a sample REST API call. 

## Get the REST API

1. Download the [REST API YAML](https://azuremigrate.blob.core.windows.net/limitedpreview/2017-09-25-limitedpreview.yaml).
2. Import it in the [Swagger online editor](http://editor.swagger.io/#/). To do this, click **File** > **Import File**, and select the downloaded .yaml file.
3. Install the ARMClient for making REST API calls. To do this, in an Administrator command window, run this command:

    ```C:\>@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"```

4. Then, in an Administrator PowerShell window, run this command:

    ```PS C:\>choco install armclient```

## Create an assessment

This example shows you how to create an assessment with the REST API/

```C:\>armclient get /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/AzMigrate/providers/Microsoft.Migrate/projects/proj-ab/groups/msexpense/assessments/assessment_4_25_2017_21_53_3?api-version=2017-05-10-privatepreview ```

## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
