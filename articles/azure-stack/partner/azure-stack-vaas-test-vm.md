---
title: Deploy the local agent and test image virtual machines in Azure Stack validation as a service | Microsoft Docs
description: Deploy the local agent and test image virtual machines for Azure Stack validation as a service.
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

---

# Deploy the local agent and test virtual machines

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

Learn how to use the validation as a service (VaaS) local agent to check your hardware. The local agent must be deployed on the Azure Stack solution being validated prior to running validation tests.

> [!Note]  
> You must make sure that the machine, where the local agent is running, doesn't lose access to the Internet. The machine must only be accessible to users who are authorized to use Azure Stack VaaS.

To test your virtual machines:

1. Install the local agent
2. Inject faults into your system
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
        Invoke-WebRequest -Uri "https://storage.azurestackvalidation.com/packages/Microsoft.VaaSOnPrem.TaskEngineHost.3.2.0.nupkg" -outfile "OnPremAgent.zip"
        Expand-Archive -Path ".\OnPremAgent.zip" -DestinationPath VaaSOnPremAgent.3.2.0 -Force
        Set-Location VaaSOnPremAgent.3.2.0\lib\net46
    ````

3. Run the following command to install the local agent dependencies:

    ```PowerShell  
        $ServiceAdminCreds = New-Object System.Management.Automation.PSCredential "<aadServiceAdminUser>", (ConvertTo-SecureString "<aadServiceAdminPassword>" -AsPlainText -Force)
        Import-Module .\VaaSPreReqs.psm1 -Force
        Install-VaaSPrerequisites -AadTenantId <AadTenantId> `
        -ServiceAdminCreds <ServiceAdminCreds> `
        -ArmEndpoint https://adminmanagement.<ExternalFqdn> `
        -Region <Region>
    ````

    **Parameters**

    | Parameter | Description |
    | --- | --- |
    | aadServiceAdminUser | The global admin user for your Azure AD tenant. For example it may be, vaasadmin@contoso.onmicrosoft.com. |
    | aadServiceAdminPassword | The password for the global admin user. |
    | AadTenantId | Azure AD tenant ID for the Azure account registered with Validation as a Service. |
    | ExternalFqdn | You can get the fully qualified domain name from the configuration file. For instruction, see [Test parameters for validation as a service Azure Stack](azure-stack-vaas-parameters-test.md). |
    | Region | The region of your Azure AD tenant. |

The command downloads a public image repository (PIR) image (OS VHD) and copy from an Azure blob storage to your Azure Stack storage. 

![Download prerequisites](media/installingprereqs.png)

> [!Note]  
> If you're experiencing slow network speed when downloading these images, download them separately to a local share and specify the parameter **-LocalPackagePath** *FileShareOrLocalPath*. You can find more guidance on your PIR download in the section [Handle slow network connectivity](azure-stack-vaas-troubleshoot.md#handle-slow-network-connectivity) of [Troubleshoot validation as a service](azure-stack-vaas-troubleshoot.md).

## Fault injection

Microsoft designed Azure Stack for resilience and to tolerate multiple types of software and hardware faults. Fault injection increases the rate of faults in the system. This increase helps you uncover issues earlier so that you can reduce the number of incidents that bring the system down.

Run the following commands to inject faults into your system.

1. Open Windows PowerShell in an elevated prompt.

2. Run the following command:

    ```PowerShell  
        Import-Module .\VaaSPreReqs.psm1 -Force
        Install-ServiceFabricSDK Install-ServiceFabricSDK
    ```

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

An agent is uniquely identified by its name. By default, it uses the fully qualified domain name (FQDN) name of the machine from where it was started. You must minimize the window to avoid any accidental clicks on the window as changing the focus pauses all other actions.

## Next steps

- [Validate a new Azure Stack solution](azure-stack-vaas-validate-solution-new.md)  
- If you have slow or intermittent Internet connectivity, you can download the PIR image. For more information, see [Handle slow network connectivity](azure-stack-vaas-troubleshoot.md#handle-slow-network-connectivity).
- To learn more about [Azure Stack validation as a service](https://docs.microsoft.com/azure/azure-stack/partner).
