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
ms.date: 10/16/2018
ms.author: mabrigg
ms.reviewer: johnhas

# Article intent: As a partner OEM, verify that the lab environment is able to execute tests through Validation as Service.
---

# Quickstart: Schedule your first test

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Schedule a test in the Validation as a Service (VaaS) portal for your Azure Stack solution.

In this quickstart, you will create a Test Pass workflow. This involves gathering your solution's environment parameters and selecting one or more tests to run against your solution.

> [!NOTE]
> While the Test Pass workflow can be used to run any test provided by VaaS, including tests from the validation workflows, results from the Test Pass workflow are not considered official. For information about official validation workflows, see [Workflows](azure-stack-vaas-key-concepts.md#workflows).

## Prerequisites

Before you follow this quickstart, you should complete the following items:

- [Set up your Validation as a Service resources](azure-stack-vaas-set-up-resources.md)
- [Deploy the local agent](azure-stack-vaas-local-agent.md) (Recommended)
- [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md) (Recommended)

## Start a new Test Pass workflow

1. Sign in to the [VaaS portal](https://azurestackvalidation.com).

    ![Sign into the VaaS portal](media/vaas_portalsignin.png)

2. [!INCLUDE [azure-stack-vaas-workflow-step_select-solution](includes/azure-stack-vaas-workflow-step_select-solution.md)]
3. Select **Start** on the **Test Passes** tile.

## Specify parameters

1. [!INCLUDE [azure-stack-vaas-workflow-step_naming](includes/azure-stack-vaas-workflow-step_naming.md)]
2. [!INCLUDE [azure-stack-vaas-workflow-step_upload-stampinfo](includes/azure-stack-vaas-workflow-step_upload-stampinfo.md)]
3. [!INCLUDE [azure-stack-vaas-workflow-step_test-params](includes/azure-stack-vaas-workflow-step_test-params.md)]
4. [!INCLUDE [azure-stack-vaas-workflow-step_tags](includes/azure-stack-vaas-workflow-step_tags.md)]
5. Select **Next** to select tests to schedule.

## Select tests to run

1. Select the test(s) you want to run against your solution.
    - If you want to override the common parameters (that is, the parameters provided in the previous section) for any test, click on the **Edit** link next to specify new values.
2. [!INCLUDE [azure-stack-vaas-workflow-step_select-agent](includes/azure-stack-vaas-workflow-step_select-agent.md)]
3. Select **Next** to review the workflow.

## Review and submit

1. Review the displayed information. The workflow will be created with the provided information and the selected tests will be scheduled. If anything appears incorrect, use the **Previous** buttons to navigate to an earlier section.
2. [!INCLUDE [azure-stack-vaas-workflow-step_submit](includes/azure-stack-vaas-workflow-step_submit.md)]

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)
