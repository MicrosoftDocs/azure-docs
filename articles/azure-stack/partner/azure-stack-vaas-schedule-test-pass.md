---
title: Use the Validation as a Service for Azure Stack portal to schedule your first test | Microsoft Docs
description: Use the Validation as a Service for Azure Stack portal to schedule your first test.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

# Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Use the Validation as a Service portal to schedule your first test

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Schedule a test in the Validation as a Service (VaaS) portal against your Azure Stack solution.

In this quickstart, you will create a Test Pass workflow and run any test provided by VaaS.

## Prerequisites

Before you follow this quickstart, you will need to have completed the following items:

- [Set up your Validation as a Service resources](azure-stack-vaas-set-up-resources.md)
- (Recommended) [Deploy the local agent](azure-stack-vaas-local-agent.md)
- (Recommended) [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md)

## Start a new Test Pass workflow

1. Sign in to the [VaaS portal](https://azurestackvalidation.com).

    ![Sign into the VaaS portal](media/vaas_portalsignin.png)

2. [!INCLUDE [azure-stack-vaas-workflow-step_select-solution](includes/azure-stack-vaas-workflow-step_select-solution.md)]
3. Click **Start** on the **Test Passes** tile.

## Provide hardware information and test parameters

1. [!INCLUDE [azure-stack-vaas-workflow-step_naming](includes/azure-stack-vaas-workflow-step_naming.md)]
2. [!INCLUDE [azure-stack-vaas-workflow-step_upload-stampinfo](includes/azure-stack-vaas-workflow-step_upload-stampinfo.md)]
3. [!INCLUDE [azure-stack-vaas-workflow-step_test-params](includes/azure-stack-vaas-workflow-step_test-params.md)]
4. [!INCLUDE [azure-stack-vaas-workflow-step_tags](includes/azure-stack-vaas-workflow-step_tags.md)]
5. Click **Next** to select tests to schedule.

## Select tests to execute

1. Select the test(s) you want to run against your solution.
    - If you want to override test parameters (i.e., the parameters provided in the previous section) for any test, click on the **Edit** link next to specify new values.
2. [!INCLUDE [azure-stack-vaas-workflow-step_select-agent](includes/azure-stack-vaas-workflow-step_select-agent.md)]
3. Click **Next** to review the workflow.

## Review and submit

1. Review the displayed information. The workflow will be created with the provided information and the selected tests will be scheduled. If anything appears incorrect, use the **Previous** buttons to navigate to an earlier section.
2. [!INCLUDE [azure-stack-vaas-workflow-step_submit](includes/azure-stack-vaas-workflow-step_submit.md)]

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)
