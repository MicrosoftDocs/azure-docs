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
ms.date: 03/11/2019
ms.author: mabrigg
ms.reviewer: johnhas
ms.lastreviewed: 03/11/2019



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

The following tests should be executed in the following order for monthly software validation:

1. Monthly Azure Stack Update Verification
2. Cloud Simulation Engine

## Validating software updates

1. Create a new **Package Validation** workflow.
1. For the required tests above, follow the instructions from [Run Package Validation tests](azure-stack-vaas-validate-oem-package.md#run-package-validation-tests). See the section below for additional instructions on the **Monthly Azure Stack Update Verification** test.

### Apply the monthly update

1. Select an agent to execute tests against.
1. Schedule **Monthly Azure Stack Update Verification**.
1. Provide the location to the OEM extension package currently deployed on the stamp, and the location to the OEM extension package that will be applied during the update. To configure the URLs for these packages, see [managing packages for validation](azure-stack-vaas-validate-oem-package.md#managing-packages-for-validation).
1. Follow the steps in the UI from the selected agent.

If you have questions or concerns, contact [VaaS Help](mailto:vaashelp@microsoft.com).

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)