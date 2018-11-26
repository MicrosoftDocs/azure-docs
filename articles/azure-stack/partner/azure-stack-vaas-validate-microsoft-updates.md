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
ms.date: 11/26/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Validate software updates from Microsoft

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Microsoft will periodically release updates to the Azure Stack software. These updates are provided to Azure Stack co-engineering partners in advance of being made publicly available so that they can validate the updates against their solutions and provide feedback to Microsoft.

[!INCLUDE [azure-stack-vaas-workflow-validation-completion](includes/azure-stack-vaas-workflow-validation-completion.md)]

## Apply monthly update

[!INCLUDE [azure-stack-vaas-workflow-section_update-azs](includes/azure-stack-vaas-workflow-section_update-azs.md)]

## Create a workflow

Update validations use the same workflow as **Package Validation**. Follow the instructions at [Create a Package Validation workflow](azure-stack-vaas-validate-oem-package.md#create-a-package-validation-workflow).

## Run tests

Update validations use the same workflow as **Package Validation**. Follow the instructions at [Execute Package Validation tests](azure-stack-vaas-validate-oem-package.md#run-package-validation-tests).

You do not need to request package signing for update validations.

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)
