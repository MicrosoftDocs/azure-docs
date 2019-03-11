---
title: Validate a new Azure Stack solution | Microsoft Docs
description: Learn how to validate a new Azure Stack solution with Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 03/11/2019
ms.author: mabrigg
ms.reviewer: johnhas
ms.lastreviewed: 03/11/2019



ROBOTS: NOINDEX

---

# Validate a new Azure Stack solution

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Learn how to use the **solution validation** workflow to certify new Azure Stack solutions.

An Azure Stack solution is a hardware bill of materials (BoM) that has been jointly agreed upon between Microsoft and the partner after meeting the Windows Server logo certification requirements. A solution must be recertified when there has been a change to the hardware BoM. For further questions about when to recertify solutions, contact the team at [vaashelp@microsoft.com](mailto:vaashelp@microsoft.com).

To certify your solution, run the solution validation workflow twice. Run it once for the *minimally* supported configuration. Run it a second time for the *maximally* supported configuration. Microsoft certifies the solution if both configurations pass all tests.

[!INCLUDE [azure-stack-vaas-workflow-validation-completion](includes/azure-stack-vaas-workflow-validation-completion.md)]

## Create a Solution Validation workflow

1. [!INCLUDE [azure-stack-vaas-workflow-step_select-solution](includes/azure-stack-vaas-workflow-step_select-solution.md)]

3. Select **Start** on the **Solution Validations** tile.

    ![Solution validations workflow tile](media/tile_validation-solution.png)

4. [!INCLUDE [azure-stack-vaas-workflow-step_naming](includes/azure-stack-vaas-workflow-step_naming.md)]

5. Select the **solution configuration**.
    - **Minimum**: the solution is configured with the minimum supported number of nodes.
    - **Maximum**: the solution is configured with the maximum supported number of nodes.
6. [!INCLUDE [azure-stack-vaas-workflow-step_upload-stampinfo](includes/azure-stack-vaas-workflow-step_upload-stampinfo.md)]

    ![Solution Validation information](media/workflow_validation-solution_info.png)

7. [!INCLUDE [azure-stack-vaas-workflow-step_test-params](includes/azure-stack-vaas-workflow-step_test-params.md)]

    > [!NOTE]
    > Environment parameters cannot be modified after creating a workflow.

8. [!INCLUDE [azure-stack-vaas-workflow-step_tags](includes/azure-stack-vaas-workflow-step_tags.md)]
9. [!INCLUDE [azure-stack-vaas-workflow-step_submit](includes/azure-stack-vaas-workflow-step_submit.md)]
    You will be redirected to the tests summary page.

## Run Solution Validation tests

In the **Solution Validation tests summary** page, you will see a list of the tests required for completing validation.

In the validation workflows, **scheduling** a test uses the workflow-level common parameters that you specified during workflow creation (see [Workflow common parameters for Azure Stack Validation as a Service](azure-stack-vaas-parameters.md)). If any of test parameter values become invalid, you must resupply them as instructed in [Modify workflow parameters](azure-stack-vaas-monitor-test.md#change-workflow-parameters).

> [!NOTE]
> Scheduling a validation test over an existing instance will create a new instance in place of the old instance in the portal. Logs for the old instance will be retained but are not accessible from the portal.  
Once a test has completed successfully, the **Schedule** action becomes disabled.

1. [!INCLUDE [azure-stack-vaas-workflow-step_select-agent](includes/azure-stack-vaas-workflow-step_select-agent.md)]

2. Select the following tests:
    - Cloud Simulation Engine
    - Compute SDK Operational Suite
    - Disk Identification Test
    - KeyVault Extension SDK Operational Suite
    - KeyVault SDK Operational Suite
    - Network SDK Operational Suite
    - Storage Account SDK Operational Suite

3. Select **Schedule** from the context menu to open a prompt for scheduling the test instance.

4. Review the test parameters and then select **Submit** to schedule the test for execution.

![Schedule Solution Validation test](media/workflow_validation-solution_schedule-test.png)

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)