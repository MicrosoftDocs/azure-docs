---
title: Test parameters for validation as a service Azure Stack | Microsoft Docs
description: Reference topic about the configuration file and test pass parameters for validation as a service Azure Stack.
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

# Test parameters for validation as a service Azure Stack

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Before executing any Test Suite from validations as a service (VaaS), select a Solution and create a test pass.

- Sign in with your registered VaaS tenant credentials.
- Create a new Solution (by selecting **Add Solution**) or select any existing.
- Select the **Start** button from the **Test Passes** workflow tile.

> [!Note]  
> Create a new solution entry for each unique machine set/hardware configuration that you're validating, and a new test pass for every build deployment on that machine set.

You will need to enter the parameters required to run the tests in the **Test Pass Information** page. Provide these parameters when starting a new test pass or validation run. Most of the parameters have the same values that you provided when you deployed Azure Stack.

You can enter the values manually listed in the [Test parameters table](#test-parameters), or upload the deployment configuration file, which contains the full Azure Stack stamp information. Once uploaded, the portal loads the values from the file.

> [!Note]  
> You can searching for and typing the test parameter values by finding and loading the configuration file into the portal.

## Export the test parameters using PowerShell

1. Sign in to DVM machine or any machine that has access to Azure Stack environment.
2. Open an elevated PowerShell window, and run:

    ````PowerShell  
        $params = Invoke-RestMethod -Method Get -Uri 'https://ASAppGateway:4443/ServiceTypeId/4dde37cc-6ee0-4d75-9444-7061e156507f/CloudDefinition/GetStampInformation'
        ConvertTo-Json $params > stampinfoproperties.json
    ````

3. Upload **stampinfoproperties.json** to the VaaS portal.

## Find the test parameters in the configuration file

You can also find the test parameter values by opening the ECE **configuration file**. You can find the file at the following path on the DVM machine:  
`C:\EceStore\403314e1-d945-9558-fad2-42ba21985248\80e0921f-56b5-17d3-29f5-cd41bf862787`

## Test parameters 

| Parameter    | Description |
|-------------|-----------------|
| Azure Stack Build                      | Azure Stack Build or version number that was deployed for example, 1.0.170330.0 | 
| Tenant ID                              | Azure Active Directory Tenant specified during Azure Stack deployment. Search for **AADTenant** in the configuration file and select the **GUID** value in the `Id` tag. | 
| Region                                 | Azure Stack deployment region. Search for **Region** in the configuration file. | 
| Tenant Resource Manager                | Tenant Azure Resource Manager endpoint, for example, `https://management.<ExternalFqdn>` | 
| Admin Resource Manager                 | Admin Azure Resource Manager endpoint. for example, `https://adminmanagement.<ExternalFqdn>` | 
| External FQDN                          | External FQDN of the Environment. Search for **ExternalFqdn** in the configuration file. | 
| Tenant User                            | Azure Active Directory Tenant Admin that was either provisioned already or needs to be provisioned by the Service Admin in the Azure AD Directory. For details on provisioning tenant account see [Add a new Azure Stack tenant account in Azure Active Directory](https://docs.microsoft.com/azure/azure-stack/azure-stack-add-new-user-aad). This value is used by the test to perform tenant level operations such as deploying templates to provision resources (VM’s, storage accounts etc.) and execute workloads. | 
| Service Administrator User             | Azure Active Directory Admin of the Azure AD Directory Tenant specified during Azure Stack deployment. Search for **AADTenant** in the configuration file and select the value in the `UniqueName` tag in the configuration file. | 

## Checks before starting the tests

The tests perform remote operations. The machine that runs the tests must have access to the Azure Stack endpoints. Otherwise the test will not work. If you are using the VaaS on premises agent, use the machine where the agent will run. You can verify that your machine has access to the Azure Stack points by running the following checks.

1. Check that the Base URI can be reached. Open a CMD prompt or bash shell, and run the following command:

    ```bash  
    nslookup adminmanagement.<EXTERNALFQDN>
    ```

2. Open a web browser and navigate to `https://adminportal.<EXTERNALFQDN>` in order to check that the MAS Portal can be reached.

3. Sign in using the Azure AD service administrator name and password values provided when creating the test pass.

## Next steps

- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).
