---
title: Validate software updates from Microsoft in Azure Stack Validation as a Service | Microsoft Docs
description: Learn how to validate software updates from Microsoft with Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 1/14/2019
ms.author: mabrigg
ms.reviewer: johnhas

ROBOTS: NOINDEX

---

# Validate software updates from Microsoft

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Microsoft will periodically release updates to the Azure Stack software. These updates are provided to Azure Stack coengineering partners. The updates are provided in advance of publicly available. You can check the updates against your solution and provide feedback to Microsoft.

[!INCLUDE [azure-stack-vaas-workflow-validation-completion](includes/azure-stack-vaas-workflow-validation-completion.md)]

## Apply monthly update

[!INCLUDE [azure-stack-vaas-workflow-section_update-azs](includes/azure-stack-vaas-workflow-section_update-azs.md)]

## Create a workflow

Update validations use the same workflow as **Solution Validation**.

## Run tests

1. Update validations use the same workflow as **Solution Validation**. 

2. Follow the instructions at [Run Solution Validation tests](azure-stack-vaas-validate-oem-package.md#run-package-validation-tests). Select the following tests instead:
    - Monthly Azure Stack Update Verification
    - Cloud Simulation Engine

You don't need to request package signing for update validations.

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)