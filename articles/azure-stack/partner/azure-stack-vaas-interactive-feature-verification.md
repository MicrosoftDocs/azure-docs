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
ms.date: 11/15/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Interactive feature verification testing  

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Interactive Feature Verification' testing in VaaS is used to give partners the ability to exercise manual (aka interactive) AzureStack scenarios, and those scenarios can be scripted to accommodate a wide verity of test case scenarios.

Partners are guided to execute a curated set of manual scenarios. During scenario execution, VaaS gathers diagnostic logs on an ongoing basis. Upon scenario completion, partners are requested to share additional logs and give feedback on the quality of the scenario. This data is reviewed by the Microsoft Azure Stack team to manage release quality and make product improvements. 

## Walkthrough a test pass

Identifying disk replacement is a core scenario and well suited for implementation with the Interactive Feature Verification testing. In this example the workflow can be divided into seven phases described below:

1.  Create a new  - Test Pass' workflow

2.  Select  - Disk Identification Test.

3.  Start the test

4.  Perform the interactive feature verification scenario

5.  Evaluate the result of the scenario

6.  Send the test result to Microsoft

7.  Verify the status in the VaaS portal

## Test pass workflow

1.  Navigate to the Azure Stack Validation portal at https://www.azurestackvalidation.com and log in.

2.  Create a new solution entry or choose an existing one that represents the Azure Stack solution being certified. Select on the row to select the solution.

3.  Select "Start" on the  - Test Pass' tile to start a new workflow

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image1.png)

4.  Enter a name for the  - Test Pass' workflow

5.  Provide the environment and common test parameters by following the instructions here.

6.  The diagnostics connection string must follow the format specified in the Diagnostics Collection article.

7.  Enter the required parameters for the test.

8.  Select the agent to run the interactive test run.

> [!Note]  
> Domain admin user and password must be specified for disk identification interactive feature verification test.

![Alt text](media\azure-stack-vaas-interactive-feature-verification\image2.png)
## Test selection

1.  Select  - Disk Identification Test&lt;version&gt;' as shown below.

> [!Note]  
> The version of the test will increment as improvements to the test collateral are made. The highest version should always be used unless Microsoft indicates otherwise.

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image4.png)

2.  Provide the domain admin user and password by selecting the "Edit".

3.  Select the appropriate test execution agent/DVM to launch the test on.

> ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image5.png)

1.  Select  - Submit' to start the test for execution.\ ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image6.png)

## Start the test

1.  This test will show the following UI on the machine that is running the VaaS agent. In many cases, this machine will be the DVM or Jumpbox to the stamp.

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image8.png)

## Perform the Scenario

1.  Please follow the  - Documentation' &  - Validation' links to review instructions from Microsoft on how to perform this scenario.

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image9.png)

2.  For reference:

    a.  The Document link points to: Documentation

    b.  The Validation link points to: Validation

3.  Select  - Next' to go to  - Disk Identification'.

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image10.png)

4.  Follow the instructions to run the precheck script.\ ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image11.png)

5.  Once the precheck script is completed successfully, execute the manual scenario (Disk replacement) as per the  - Documentation' and  - Validation' links from the  - Information' tab.

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image12.png)

6.  Do not close the dialog box while you are performing the manual scenario.

7.  When you are finished performing the manual scenario, follow the instructions to run the post check script.\ ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image13.png)

8.  On successful completion of the manual scenario(Disk replacement), select  - Next' to go to the  - Summary' tab.

![Alt text](media\azure-stack-vaas-interactive-feature-verification\image14.png)

> [!Important]  
> Closing the UI will abort the test.

## Evaluate results

1.  After the scenario is complete, please answer the questions shown in the UI.

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image15.png)

2.  These questions will help Microsoft gauge the success rate and release quality of the scenario.

## Submit results

1.  Please attach any log files you wish to submit to Microsoft.

    ![Alt text](media\azure-stack-vaas-interactive-feature-verification\image16.png)

2.  Accept the feedback submission EULA

3.  Select **Submit** to send the results to Microsoft.

This completes your Interactive Feature Validation Scenario testing

## Next steps

- [Monitor and manage tests in the VaaS portal](azure-stack-vaas-monitor-test.md)
