---
title: Azure Stack Validation as a Service release notes  | Microsoft Docs
description: Azure Stack Validation as a Service release notes.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/11/2019
ms.author: mabrigg
ms.reviewer: johnhas
ms.lastreviewed: 03/11/2019

---

# Release notes for Validation as a Service

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

This article has the release notes for Azure Stack Validation as a Service.

## Version 4.0.5

2019 January 17

- Disk Identification Test updated to address storage pool inconsistencies. Version: 5.1.14.0 -> 5.1.15.0
- Azure Stack Monthly Update Verification updated to address approved software and content validation inconsistencies. Version: 5.1.14.0 -> 5.1.17.0
- OEM Extension Package Verification updated to do perform necessary checks before the Azure Stack update step. Version: 5.1.14.0 -> 5.1.16.0
- Internal bug fixes

## Version 4.0.2

2019 January 7

If you are running the Azure Stack Monthly Update Verification workflow and the version for your OEM update package is not 1810 or higher, you will receive an error once you get to the OEM update step. This is a bug. A fix is being developed.The mitigation steps are as follows:

1. Run the OEM update as normal.
2. Execute Test-AzureStack after successful application of the package and save the output.
3. Cancel the test.
4. Send the saved output to VaaSHelp@microsoft.com to receive passing results for the run.

## Version 4.0.2

2018 November 30

- Internal bug fixes

## Version 4.0.1

2018 October 8

- VaaS prerequisites

    `Install-VaaSPrerequisites` no longer requires cloud admin credentials. If you are running the latest version of this cmdlet, see [Download and install the agent](azure-stack-vaas-local-agent.md#download-and-install-the-agent) for the revised commands for installing prerequisites. Here are the commands:

    ```PowerShell
    $ServiceAdminCreds = New-Object System.Management.Automation.PSCredential "<aadServiceAdminUser>", (ConvertTo-SecureString "<aadServiceAdminPassword>" -AsPlainText -Force)
    Import-Module .\VaaSPreReqs.psm1 -Force
    Install-VaaSPrerequisites -AadTenantId $AadTenantId `
                              -ServiceAdminCreds $ServiceAdminCreds `
                              -ArmEndpoint https://adminmanagement.$ExternalFqdn `
                              -Region $Region
    ```

## Version 4.0.0

2018 August 29

- VaaS prerequisites and VHD updates

    `Install-VaaSPrerequisites` now requires cloud admin credentials to address an issue during Package Validation. The documentation at [Download and install the agent](azure-stack-vaas-local-agent.md#download-and-install-the-agent) has been updated with the following:

    ```PowerShell
    $ServiceAdminCreds = New-Object System.Management.Automation.PSCredential "<aadServiceAdminUser>", (ConvertTo-SecureString "<aadServiceAdminPassword>" -AsPlainText -Force)
    $CloudAdminCreds = New-Object System.Management.Automation.PSCredential "<cloudAdminDomain\username>", (ConvertTo-SecureString "<cloudAdminPassword>" -AsPlainText -Force)
    Import-Module .\VaaSPreReqs.psm1 -Force
    Install-VaaSPrerequisites -AadTenantId $AadTenantId `
                              -ServiceAdminCreds $ServiceAdminCreds `
                              -ArmEndpoint https://adminmanagement.$ExternalFqdn `
                              -Region $Region `
                              -CloudAdminCredentials $CloudAdminCreds
    ```
    > [!NOTE]
    > The `$CloudAdminCreds` required by the script are for the Azure Stack instance being validated. They are not the Azure Active Directory credentials used by the VaaS tenant.

- Local agent update

    The previous version of the local agent is not compatible with the current 4.0.0 release of the service. All users must update their local agents. See [Download and install the agent](azure-stack-vaas-local-agent.md#download-and-install-the-agent) for instructions on installing the newest agent.

- PowerShell automation update

    Changes were made to `LaunchVaaSTests` PowerShell scripts that require the latest version of the scripting packages. See [Launch the Test Pass workflow](azure-stack-vaas-automate-with-powershell.md#launch-the-test-pass-workflow) for instructions on installing the latest version of the scripting package.

- Validation as a Service Portal

  - Package signing notifications

    When an OEM customization package is submitted as part of the Package Validation workflow, the package format will be validated to ensure that it follows the published specification. If the package does not comply, the run will fail. E-mail notifications will be sent to the email address of the registered Azure Active Directory contact for the tenant.

  - Interactive test category

    The **Interactive** test category has been added. These tests exercise interactive, non-automated Azure Stack scenarios.

  - Interactive Feature Verification

    The ability to provide focused feedback for certain features is now available in the Test Pass workflow. The `OEM Update on Azure Stack 1806 RC Validation 5.1.4.0` test checks to see if specific updates were correctly applied and then collects feedback.

## Next steps

- [Troubleshoot Validation as a Service](azure-stack-vaas-troubleshoot.md)
