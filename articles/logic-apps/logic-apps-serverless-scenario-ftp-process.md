---
title: Process files from an FTP server with Azure Serverless | Microsoft Docs
description: Trigger a serverless app on all new files added to an FTP server.
keywords: ''
services: logic-apps
author: jeffhollan
manager: anneta
editor: ''
documentationcenter: ''

ms.assetid: d565873c-6b1b-4057-9250-cf81a96180ae
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: jehollan
---
# Process files from an FTP server with Azure Logic Apps and Azure Functions

Azure Serverless tools provide powerful capabilities to quickly build and host applications in the cloud, without having to think about infrastructure.  In this scenario, we will process files as they are updated to an FTP server, and route them to different storage directories based on the file extenstion.

## Overview of the scenario and tools used