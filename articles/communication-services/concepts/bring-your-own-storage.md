---
title: Azure Communication Services BYOS overview
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services BYOS.
author: RinaRish
manager: visho
services: azure-communication-services

ms.author: ektrishi
ms.date: 02/25/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Bring your own storage (BYOS) overview

[!INCLUDE [Private Preview Disclaimer](../includes/private-preview-include-section.md)]

In many applications end-users may want to store their Call Recording files long-term. Some of the common scenarios are compliance, quality assurance, assessment, post call analysis, training, and coaching. Now with the BYOS (bring your own storage) being available, end-users will have an option to store their files long term and manage the files in a way they need. The end user will be responsible for legal regulations about storing the data. BYOS simplifies downloading of the files from Azure Communication Services (ACS) and minimizes the number of support request if customer was unable to download recording in 48 hours. Data will be transferred securely from Microsoft Azure blob storage to a customer Azure blob storage. 
Here are a few examples:
- Contact Center Recording
- Compliance Recording Scenario
- Healthcare Virtual Visits Scenario
- Conference/meeting recordings and so on

BYOS can be easily integrated into any application regardless of the programming language. When creating a call recording resource in Azure Portal, enable the BYOS option and provide the sas-url to the storage. This simple experience allows developers to meet their needs, scale, and avoid investing time and resources into designing and maintaining a custom solution.

## Feature highlights

- HIPAA complaint

## Next steps
- TBD
