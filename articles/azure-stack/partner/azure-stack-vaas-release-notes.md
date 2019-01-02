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
ms.date: 11/26/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Release notes for Validation as a Service

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

This article has the release notes for Azure Stack Validation as a Service.

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

    `Install-VaaSPrerequisites` now requires cloud admin credentials to address an issue during package validation. The documentation at [Download and install the agent](azure-stack-vaas-local-agent.md#download-and-install-the-agent) has been updated with the following:

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

    The **Interactive** test category has been added. These tests let partners to exercise interactive, non-automated Azure Stack scenarios.

  - Interactive Feature Verification

    The ability to provide focused feedback for certain features is now available in the Test Pass workflow. The `OEM Update on Azure Stack 1806 RC Validation 5.1.4.0` test checks to see if specific updates were correctly applied and then collects feedback.

## Next steps

- [Troubleshoot Validation as a Service](azure-stack-vaas-troubleshoot.md)