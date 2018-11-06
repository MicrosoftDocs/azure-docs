---
title: Validate AD FS integration for Azure Stack
description: Use the Azure Stack Readiness Checker to validate AD FS integration for Azure Stack.
services: azure-stack
documentationcenter: ''
author: PatAltimore
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/22/2018
ms.author: patricka
ms.reviewer: jerskine

---

# Validate AD FS integration for Azure Stack

Use the Azure Stack Readiness Checker tool (AzsReadinessChecker) to validate that your environment is ready for Active Directory Federation Services (AD FS) integration with Azure Stack. Validate AD FS integration before you begin datacenter integration or before an Azure Stack deployment.

The readiness checker validates:

* The *federation metadata* contains the valid XML elements for federation.
* The *AD FS SSL certificate* can be retrieved, and a chain of trust can be built. On stamp AD FS must trust the SSL certificate chain. The certificate must be signed by the same *certificate authority* as the Azure Stack deployment certificates or by a trusted root authority partner. For the full list of trusted root authority partners, see [TechNet](https://gallery.technet.microsoft.com/Trusted-Root-Certificate-123665ca).
* The *AD FS signing certificate* is trusted and not nearing expiration.

For more information about Azure Stack datacenter integration, see [Azure Stack datacenter integration - Identity](azure-stack-integrate-identity.md).

## Get the readiness checker tool

Download the latest version of the Azure Stack Readiness Checker tool (AzsReadinessChecker) from the [PowerShell Gallery](https://aka.ms/AzsReadinessChecker).  

## Prerequisites

The following prerequisites must be in place.

**The computer where the tool runs:**

* Windows 10 or Windows Server 2016, with domain connectivity.
* PowerShell 5.1 or later. To check your version, run the following PowerShell command and then review the *Major* version and *Minor* versions:  
   > `$PSVersionTable.PSVersion`
* Latest version of the [Microsoft Azure Stack Readiness Checker](https://aka.ms/AzsReadinessChecker) tool.

**Active Directory Federation Services environment:**

You need at least one of the following forms of metadata:

* The URL for AD FS federation metadata. An example is `https://adfs.contoso.com/FederationMetadata/2007-06/FederationMetadata.xml`.
* The federation metadata XML file. An example is FederationMetadata.xml.

## Validate AD FS integration

1. On a computer that meets the prerequisites, open an administrative PowerShell prompt and then run the following command to install AzsReadinessChecker:

     `Install-Module Microsoft.AzureStack.ReadinessChecker -Force`

1. From the PowerShell prompt, run the following command to start validation. Specify the value for **-CustomADFSFederationMetadataEndpointUri** as the URI for the federation metadata.

     `Invoke-AzsADFSValidation -CustomADFSFederationMetadataEndpointUri https://adfs.contoso.com/FederationMetadata/2007-06/FederationMetadata.xml`

1. After the tool runs, review the output. Confirm that the status is OK for AD FS integration requirements. A successful validation is similar to the following example:

    ```
    Invoke-AzsADFSValidation v1.1809.1001.1 started.

    Testing ADFS Endpoint https://sts.contoso.com/FederationMetadata/2007-06/FederationMetadata.xml

            Read Metadata:                         OK
            Test Metadata Elements:                OK
            Test SSL ADFS Certificate:             OK
            Test Certificate Chain:                OK
            Test Certificate Expiry:               OK

    Details:
    [-] In standalone mode, some tests should not be considered fully indicative of connectivity or readiness the Azure Stack Stamp requires prior to Data Center Integration.
    Additional help URL: https://aka.ms/AzsADFSIntegration

    Log location (contains PII): C:\Users\username\AppData\Local\Temp\AzsReadinessChecker\AzsReadinessChecker.log
    Report location (contains PII): C:\Users\username\AppData\Local\Temp\AzsReadinessChecker\AzsReadinessCheckerReport.json

    Invoke-AzsADFSValidation Completed
    ```

In production environments, testing certificate chains of trust from an operator's workstation isn't fully indicative of the PKI trust posture in the Azure Stack infrastructure. The Azure Stack stamp’s public VIP network needs the connectivity to the CRL for the PKI infrastructure.

## Report and log file

Each time validation runs, it logs results to **AzsReadinessChecker.log** and **AzsReadinessCheckerReport.json**. The location of these files appears with the validation results in PowerShell.

The validation files can help you share status before you deploy Azure Stack or investigate validation problems. Both files persist the results of each subsequent validation check. The report gives your deployment team confirmation of the identity configuration. The log file can help your deployment or support team investigate validation issues.

By default, both files are written to
`C:\Users\<username>\AppData\Local\Temp\AzsReadinessChecker\`.

Use:

* **-OutputPath**: The *path* parameter at the end of the run command to specify a different report location.
* **-CleanReport**: The parameter at the end of the run command to clear AzsReadinessCheckerReport.json of previous report information. For more information, see [Azure Stack validation report](azure-stack-validation-report.md).

## Validation failures

If a validation check fails, details about the failure appear in the PowerShell window. The tool also logs information to *AzsReadinessChecker.log*.

The following examples provide guidance on common validation failures.

### Command Not Found

`Invoke-AzsADFSValidation : The term 'Invoke-AzsADFSValidation' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.`

**Cause**: PowerShell Autoload failed to load the Readiness Checker module correctly.

**Resolution**: Import the Readiness Checker module explicitly. Copy and paste the following code into PowerShell and update \<version\> with the number for the currently installed version.

`Import-Module "c:\Program Files\WindowsPowerShell\Modules\Microsoft.AzureStack.ReadinessChecker\<version>\Microsoft.AzureStack.ReadinessChecker.psd1" -Force`

## Next steps

[View the readiness report](azure-stack-validation-report.md)  
[General Azure Stack integration considerations](azure-stack-datacenter-integration.md)  
