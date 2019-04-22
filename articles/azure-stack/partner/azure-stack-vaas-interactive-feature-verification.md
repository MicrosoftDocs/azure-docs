---
title: Interactive feature verification testing in Azure Stack Validation as a Service | Microsoft Docs
description: Learn how to create interactive feature verification tests for Azure Stack with Validation as a Service.
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

# Interactive feature verification testing  

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

You can use the interactive feature verification testing framework to request tests for your system. When you request a test, Microsoft uses the framework to prepare tests that require manual interactive steps. Microsoft can use the framework to chain together several standalone automated tests.

This article describes a simple manual scenario. The test checks replacing a disk in Azure Stack. The framework gathers diagnostic logs at each step. You can debug issues as you find them. The framework also allows the sharing of logs produced by other tools or processes, and enables you to provide feedback on the scenario.

> [!Important]  
> This article references the steps to perform Disk Identification. This is simply a demonstration, as any results gathered from the Test Pass workflow may not be used for new solution verification.

## Overview of interactive testing

A test for disk replacement is a common scenario. In this example, the test has five steps:

1. Create a new **Test Pass** workflow.
2. Select the **Disk Identification Test**.
3. Complete the manual step when prompted.
4. Check the result of the scenario.
5. Send the test result to Microsoft.

## Create a new test pass

If you do not have an existing test pass available, please follow the directions for [scheduling a test](azure-stack-vaas-schedule-test-pass.md).

## Schedule the test

1. Select **Disk Identification Test**.

    > [!Note]  
    > The version of the test will increment as improvements to the test collateral are made. The highest version should always be used unless Microsoft indicates otherwise.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image4.png)

1. Provide the domain admin username and password by selecting **Edit**.

1. Select the appropriate test execution agent/DVM to launch the test on.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image5.png)

1. Select **Submit** to start the test.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image6.png)

1. Access the UI for the interactive test from the agent selected in the previous step.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image8.png)

1. Follow the **Documentation** and **Validation** links to review instructions from Microsoft on how to perform this scenario.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image9.png)

1. Select **Next**.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image10.png)

1. Follow the instructions to run the precheck script.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image11.png)

1. Once the precheck script has completed successfully, run the manual scenario (Disk replacement) as per the **Documentation** and **Validation** links from the **Information** tab.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image12.png)

    > [!Important]  
    > Do not close the dialog box while you are performing the manual scenario.

1. When you are finished performing the manual scenario, follow the instructions to run the post check script.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image13.png)

1. On successful completion of the manual scenario (Disk replacement), select **Next**.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image14.png)

    > [!Important]  
    > If you close the window, the test will stop before it is done.

1. Provide feedback for the test experience. These questions will help Microsoft assess the success rate and release quality of the scenario.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image15.png)

1. Attach any log files you wish to submit to Microsoft.

    ![Alt text](media/azure-stack-vaas-interactive-feature-verification/image16.png)

1. Accept the feedback submission EULA.

1. Select **Submit** to send the results to Microsoft.

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)
