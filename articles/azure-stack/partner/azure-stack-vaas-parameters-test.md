---
title: Test parameters for Validation as a Service Azure Stack | Microsoft Docs
description: Reference topic about the configuration file and test pass parameters for Validation as a Service Azure Stack.
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

# Test parameters for Validation as a Service Azure Stack

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Before executing any test suites from Validation as a Service (VaaS), select a solution and create a test pass:

- Sign in with your registered VaaS tenant credentials.
- Create a new Solution (by selecting **Add Solution**) or select any existing.
- Select the **Start** button from the **Test Passes** workflow tile.

> [!Note]  
> Create a new solution entry for each unique machine set/hardware configuration that you're validating, and a new test pass for every build deployment on that machine set.

You will need to enter the parameters required to run the tests in the **Test Pass Information** page. Provide these parameters when starting a new test pass or validation run. Most of the parameters have the same values that you provided when you deployed Azure Stack.

## Common test parameters

Common parameters include values such as environment variables and user credentials required by all tests in VaaS. Common test parameters include sensitive information that can't be stored in configuration files. These must be manually provided. Head over to [workflow test parameters](azure-stack-vaas-parameters.md) to provide these values.

## Checks before starting the tests

The tests perform remote operations. The machine that runs the tests must have access to the Azure Stack endpoints, otherwise the tests will not work. If you are using the VaaS local agent, use the machine where the agent will run. You can verify that your machine has access to the Azure Stack endpoints by running the following checks:

1. Check that the Base URI can be reached. Open a CMD prompt or bash shell, and run the following command:

    ```bash  
    nslookup adminmanagement.<EXTERNALFQDN>
    ```

2. Open a web browser and navigate to `https://adminportal.<EXTERNALFQDN>` in order to check that the MAS Portal can be reached.

3. Sign in using the Azure AD service administrator name and password values provided when creating the test pass.

4. Check system health status by running the **Test-AzureStack** PowerShell cmdlet as described in [Run a validation test for Azure Stack](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-diagnostic-test). Fix any warnings and errors before launching any tests.

## Next steps

- To learn more about [Azure Stack Validation as a Service](https://docs.microsoft.com/azure/azure-stack/partner).
