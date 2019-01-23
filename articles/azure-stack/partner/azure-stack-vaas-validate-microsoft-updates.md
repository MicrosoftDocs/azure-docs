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

Microsoft software updates to Azure Stack are designated using a naming convention, for example, 1803 indicating the update is for March 2018. For information about the Azure Stack update policy, cadence and release notes are available, see [Azure Stack servicing policy](https://docs.microsoft.com/azure/azure-stack/azure-stack-servicing-policy).

## Prerequisites

Before you exercise the monthly update process in VaaS, you should be familiar with the following items:

- [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md)
- [Interactive feature verification testing](azure-stack-vaas-interactive-feature-verification.md)

## Required tests

The following tests should be executed in the following order for monthly package validation updates:

1. Monthly Azure Stack Update Verification
2. Cloud Simulation Engine

## Validating software updates

1. Create a new **Package Validation** workflow.

2. Follow the instructions from [Run Package Validation tests](azure-stack-vaas-validate-oem-package.md#run-package-validation-tests).

### Apply the monthly update

Each phase in the Monthly azure Stack Validation test require manual step you will be prompted to execute:

1. **Azure Stack Update**: Update Azure Stack to the latest build available from Microsoft.
2. **OEM Update**: Update the OEM extension package to the latest version

Monthly Azure Stack Update Verification requires no other steps, but if you have questions or concerns, please conatact [VaaS Help](mailto:vaashelp@microsoft.com)

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)