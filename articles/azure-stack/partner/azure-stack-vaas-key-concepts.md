---
title: Azure Stack Validation as a Service key concepts | Microsoft Docs
description: Describes key concepts in Azure Stack Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas
---

# Validation as a Service Key Concepts

This article describes key concepts in Validation as a Service (VaaS).

## Solutions

A VaaS solution represents a Azure Stack solution with a particular hardware bill of materials (BoM). The VaaS solution acts as a container for the workflows that run against the Azure Stack solution.

### Create a solution in the VaaS portal

1. Sign in to the [VaaS portal](https://azurestackvalidation.com).
2. On the solutions dashboard, click on **New solution**.
3. Enter a name for the solution.
4. Click **Save** to create the solution.

## Workflows

A VaaS workflow operates within the context of a VaaS solution. It represents a set of test suites that exercise the functionality of an Azure Stack deployment. A workflow should be created for every deployment or software update of an Azure Stack solution.

Workflows are categorized by testing scenario type. These include unofficial testing in the **Test Pass** workflow and official testing in the **validation** workflows.

![VaaS workflow tiles](media/tile_all-workflows.png)

> [!NOTE]
> The **Package Validation** workflow currently supports two scenarios: [Validate OEM packages](azure-stack-vaas-validate-oem-package.md) and [Validate software updates from Microsoft](azure-stack-vaas-validate-microsoft-updates.md).

For more information on workflow types, see [What is Validation as a Service for Azure Stack?](azure-stack-vaas-overview.md).

### Getting started with VaaS workflows

1. On the solutions dashboard, create a new solution or select an existing one. This refreshes and enables the workflow tiles.
2. To create a new workflow, click on **Start** on any tile. For information specific to each workflow, see the following articles:
    - [Quickstart: Use the Validation as a Service portal to schedule your first test](azure-stack-vaas-schedule-test-pass.md)
    - [Validate a new Azure Stack solution](azure-stack-vaas-validate-solution-new.md)
    - [Validate software updates from Microsoft](azure-stack-vaas-validate-microsoft-updates.md)
    - [Validate OEM packages](azure-stack-vaas-validate-oem-package.md)
3. To manage an existing workflow, click on **Manage** on any tile. For additional information, see [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md).