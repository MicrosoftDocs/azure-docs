---
title: Azure Stack Validation as a Service release notes  | Microsoft Docs
description: Azure Stack Validation as a Service known issues.
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

# Release notes for Validation as a Service

[!INCLUDE [Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

This article contains the release notes for Azure Stack Validation as a Service.

## Version 4.0.0

2018-08-29

- VaaS pre-requisite and VHD updates

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

    The previous version of the local agent is not compatible with the 4.0.0 release of the service. All users must update the version of the agent they are using. See [Download and install the agent](azure-stack-vaas-local-agent.md#download-and-install-the-agent) for instructions on installing the newest agent.

- PowerShell automation update

    Changes were made to `LaunchVaaSTests` PowerShell scripts that require the latest version of the scripting packages. See [Launch the Test Pass workflow](azure-stack-vaas-automate-with-powershell.md#launch-the-test-pass-workflow) for instructions on installing the latest version of the scripting package.

- Validation as a Service Portal

  - Package Signing Update

    When an OEM Customization package is submitted as part of the Package Validation Workflow the package format will be validated to ensure it follows the published specification. If the package does not comply the run will fail, and notification of failure will be sent via e-mail to the e-mail address of the registered Azure Active Directory contact for the tenant.

  - Interactive test category

    The **Interactive** test category has been added to identify tests that enable partners to exercise non-automated (i.e., interactive) Azure Stack scenarios.

  - Interactive Feature Verification

    The ability to provide focused feedback for certain features is now available in the Test Pass Workflow. The currently available test ("OEM Update on Azure Stack 1806 RC Validation 5.1.4.0") checks to see if specific updates were correctly applied and then collects feedback. The documentation can be found <TODO>.