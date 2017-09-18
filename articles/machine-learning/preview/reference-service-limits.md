---
title: Azure ML Service Limits | Microsoft Docs
description: This sample describes limits of the Azure ML services.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/25/2017
---

# Service Limits

- Max allowed project folder size: 25 MB
    >[!Note]
    >This limit doesn't apply to `.git`, `docs` and `outputs` folder. These folder names are case-senstive.

- Max allowed experiment execution time: 7 days
- Max size of tracked file in `outputs` folder after a run: 512 MB 

>[!NOTE]
>Please reference [Persisting Changes and Deal with Large Files](how-to-read-write-files.md) if you are working with large files.