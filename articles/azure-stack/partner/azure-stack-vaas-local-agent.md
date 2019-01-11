---
title: Deploy the local agent | Microsoft Docs
description: Deploy the local agent for Azure Stack Validation as a Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 11/26/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Deploy the local agent

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Learn how to use the Validation as a Service (VaaS) local agent to check your hardware. The local agent must be deployed on the Azure Stack solution being validated prior to running validation tests.

> [!Note]  
> You must make sure that the machine on which the local agent is running doesn't lose out-bound access to the internet. This machine must be accessible only to users who you have authorized to use VaaS on behalf of your tenant.

To deploy the local agent:

1. Install the local agent
2. Perform sanity checks
3. Run the local agent

## Download and start the local agent

Download the agent to a machine that meets the prerequisites in your datacenter that is not part of the Azure Stack system, but one that has access to all the Azure Stack endpoints.

### Machine prerequisites

Check that your machine meets the following criteria:

- Access to all Azure Stack endpoints
- .NET 4.6 and PowerShell 5.0 installed
- At least 8-GB RAM
- Minimum 8 core processors
- Minimum 200-GB disk space
- Stable network connectivity to the internet

Azure Stack is the system under test. The machine should not be part of Azure Stack or hosted in the Azure Stack cloud.

### Download and install the agent

1. Open Windows PowerShell in an elevated prompt on the machine you will use to run the tests.
2. Run the following command to download the local agent:

    ```PowerShell
    Invoke-WebRequest -Uri "https://storage.azurestackvalidation.com/packages/Microsoft.VaaSOnPrem.TaskEngineHost.latest.nupkg" -outfile "OnPremAgent.zip"
    Expand-Archive -Path ".\OnPremAgent.zip" -DestinationPath VaaSOnPremAgent -Force
    Set-Location VaaSOnPremAgent\lib\net46
    ```

3. Run the following command to install the local agent dependencies:

    ```PowerShell
    $ServiceAdminCreds = New-Object System.Management.Automation.PSCredential "<aadServiceAdminUser>", (ConvertTo-SecureString "<aadServiceAdminPassword>" -AsPlainText -Force)
    Import-Module .\VaaSPreReqs.psm1 -Force
    Install-VaaSPrerequisites -AadTenantId $AadTenantId `
                              -ServiceAdminCreds $ServiceAdminCreds `
                              -ArmEndpoint https://adminmanagement.$ExternalFqdn `
                              -Region $Region
    ```

    **Parameters**

    | Parameter | Description |
    | --- | --- |
    | aadServiceAdminUser | The global admin user for your Azure AD tenant. For example it may be, vaasadmin@contoso.onmicrosoft.com. |
    | aadServiceAdminPassword | The password for the global admin user. |
    | AadTenantId | Azure AD tenant ID for the Azure account registered with Validation as a Service. |
    | ExternalFqdn | You can get the fully qualified domain name from the configuration file. For instruction, see [Workflow common parameters in Azure Stack Validation as a Service](azure-stack-vaas-parameters.md). |
    | Region | The region of your Azure AD tenant. |

The command downloads a public image repository (PIR) image (OS VHD) and copy from an Azure blob storage to your Azure Stack storage.

![Download prerequisites](media/installingprereqs.png)

> [!Note]
> If you're experiencing slow network speed when downloading these images, download them separately to a local share and specify the parameter **-LocalPackagePath** *FileShareOrLocalPath*. You can find more guidance on your PIR download in the section [Handle slow network connectivity](azure-stack-vaas-troubleshoot.md#handle-slow-network-connectivity) of [Troubleshoot Validation as a Service](azure-stack-vaas-troubleshoot.md).

## Checks before starting the tests

The tests run remote actions. The machine that runs the tests must have access to the Azure Stack endpoints, otherwise the tests will not work. If you are using the VaaS local agent, use the machine where the agent will run. You can check that your machine has access to the Azure Stack endpoints by running the following checks:

1. Check that the Base URI can be reached. Open a CMD prompt or bash shell, and run the following command, replacing `<EXTERNALFQDN>` with the External FQDN of your environment:

    ```bash
    nslookup adminmanagement.<EXTERNALFQDN>
    ```

2. Open a web browser and go to `https://adminportal.<EXTERNALFQDN>` in order to check that the MAS Portal can be reached.

3. Sign in using the Azure AD service administrator name and password values provided when creating the test pass.

4. Check the system's health by running the **Test-AzureStack** PowerShell cmdlet as described in [Run a validation test for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-diagnostic-test). Fix any warnings and errors before launching any tests.

## Run the agent

1. Open Windows PowerShell in an elevated prompt.

2. Run the following command:

    ````PowerShell
    .\Microsoft.VaaSOnPrem.TaskEngineHost.exe -u <VaaSUserId> -t <VaaSTenantId>
    ````

      **Parameters**  
    | Parameter | Description |
    | --- | --- |
    | VaaSUserId | User ID used to sign in to the VaaS Portal (for example, UserName@Contoso.com) |
    | VaaSTenantId | Azure AD tenant ID for the Azure account registered with Validation as a Service. |

    > [!Note]  
    > When you run the agent, the current working directory must be the location of the task engine host executable, **Microsoft.VaaSOnPrem.TaskEngineHost.exe.**

If you don't see any errors reported, then the local agent has succeeded. The following example text appears on the console window.

`Heartbeat Callback at 11/8/2016 4:45:38 PM`

![Started agent](media/startedagent.png)

An agent is uniquely identified by its name. By default, it uses the fully qualified domain name (FQDN) name of the machine from where it was started. You must minimize the window to avoid any accidental selects on the window as changing the focus pauses all other actions.

## Next steps

- [Troubleshoot Validation as a Service](azure-stack-vaas-troubleshoot.md)
- [Validation as a Service key concepts](azure-stack-vaas-key-concepts.md)
- [Quickstart: Use the Validation as a Service portal to schedule your first test](azure-stack-vaas-schedule-test-pass.md)