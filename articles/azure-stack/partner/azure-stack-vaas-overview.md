---
title: An overview of validation as a service for Azure Stack | Microsoft Docs
description: An overview of Azure Stack validation as a service known issues.
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

# What is validation as a service for Azure Stack?

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Validation as a service (VaaS) is a native Azure service designed for solution partners who are co-engineering Azure Stack offerings with Microsoft. Solution partners can use the service to check that their solutions meet Microsoft's requirements and work as expected with Azure Stack.

The primary use for VaaS is:

- Validate new Azure Stack solutions
- Validate changes to the Azure Stack software
- Get digitally signed solution partner packages used during deployment
- Preview Azure Stack validation collateral

## Validate new Azure Stack solution

Partners use the solution validation workflow to check new Azure Stack solutions. The solution must pass the required Hardware Lab Kit (HKL) Azure Stack tests component tests. You only need to run the workflow twice for each new solution: once for the minimum and maximum configuration.

For more information, see [Validate a new Azure Stack solution](azure-stack-vaas-validate-solution-new.md).

## Validate changes to the Azure Stack software

Partners use the  package validation workflow to check that their solution works with the recent Azure Stack software update. At a minimum, the package validation workflow must be run on the hardware environment recommended by Microsoft, and on a solution where the patch and update (P&U) were used to apply the update. You should run the package validation on the baseline build.

For more information, see [Validate software updates from Microsoft](azure-stack-vaas-validate-microsoft-updates.md).

## Get digitally signed solution partner packages

In addition to validating Azure Stack updates, you can use the package validation workflow to check updates to OEM customization packages, which include Azure Stack partner-specific drivers, firmware, and other software used during deployment of the Azure Stack software. Deploy the package you are checking on the current version of the Azure Stack software using at a least the minimum sized solution that will be supported. The updated package must be uploaded to the service before to starting the test. If the tests succeed, notify vaashelp@microsoft.com. Tell the Azure Stack partner that the package has completed testing and should be digitally signed with the Azure Stack digital signature. Microsoft signs the package and notifies the Azure Stack partner that the package is available for download in the portal.

For more information, see [Validate OEM packages](azure-stack-vaas-validate-oem-package.md).

## Preview Azure Stack validation collateral

Microsoft regularly makes new features available in Azure Stack. As part of the development process for delivering these features to market, new test collateral is made available in the test-pass workflow. The test-pass workflow includes test collateral from the other workflows to allow for unofficial test execution. Do not use the test-pass workflow to submit results for approval. Use the solution validation and package validations workflow to get official approval for your solution.

## Next steps

- Get started, and [Set up your validation as a service account](azure-stack-vaas-validate-solution-new.md)
