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
- (Recommended) [Deploy the local agent and test virtual machines](azure-stack-vaas-test-vm.md)
- (Recommended) [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md)

## Checks before starting the tests

The tests perform remote operations. The machine that runs the tests must have access to the Azure Stack endpoints, otherwise the tests will not work. If you are using the VaaS local agent, use the machine where the agent will run. You can verify that your machine has access to the Azure Stack endpoints by running the following checks:

1. Check that the Base URI can be reached. Open a CMD prompt or bash shell, and run the following command, replacing <EXTERNALFQDN> with the External FQDN of your environment:

    ```bash  
    nslookup adminmanagement.<EXTERNALFQDN>
    ```

2. Open a web browser and navigate to `https://adminportal.<EXTERNALFQDN>` in order to check that the MAS Portal can be reached.

3. Sign in using the Azure AD service administrator name and password values provided when creating the test pass.

4. Check the system's health by running the **Test-AzureStack** PowerShell cmdlet as described in [Run a validation test for Azure Stack](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-diagnostic-test). Fix any warnings and errors before launching any tests.

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
