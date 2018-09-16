---
title: Generate Azure Stack Public Key Infrastructure certificates for Azure Stack integrated systems deployment | Microsoft Docs
description: Describes the Azure Stack PKI certificate deployment process for Azure Stack integrated systems.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2018
ms.author: mabrigg
ms.reviewer: ppacent
---

# Azure Stack certificates signing request generation

The Azure Stack Readiness Checker tool described in this article is available [from the PowerShell Gallery](https://aka.ms/AzsReadinessChecker). The tool creates Certificate Signing Requests (CSRs) suitable for an Azure Stack deployment. Certificates should be requested, generated, and validated with enough time to test before deployment.

The Azure Stack Readiness Checker tool (AzsReadinessChecker) performs the following certificate requests:

 - **Standard Certificate Requests**  
    Request according to [Generate PKI Certificates for Azure Stack Deployment](azure-stack-get-pki-certs.md).
 - **Platform-as-a-Service**  
    Optionally request platform-as-a-service (PaaS) names to certificates as specified in [Azure Stack Public Key Infrastructure certificate requirements - Optional PaaS Certificates](azure-stack-pki-certs.md#optional-paas-certificates).



## Prerequisites

Your system should meet the following prerequisites before generating the CSR(s) for PKI certificates for an Azure Stack deployment:

 - Microsoft Azure Stack Readiness Checker
 - Certificate attributes:
    - Region name
    - External fully qualified domain name (FQDN)
    - Subject
 - Windows 10 or Windows Server 2016
 
  > [!NOTE]
  > When you receive your certificates back from your certificate authority the steps in [Prepare Azure Stack PKI certificates](azure-stack-prepare-pki-certs.md) will need to be completed on the same system!

## Generate certificate signing request(s)

Use these steps to prepare and validate the Azure Stack PKI certificates: 

1.  Install AzsReadinessChecker from a PowerShell prompt (5.1 or above), by running the following cmdlet:

    ````PowerShell  
        Install-Module Microsoft.AzureStack.ReadinessChecker
    ````

2.  Declare the **subject** as an ordered dictionary. For example: 

    ````PowerShell  
    $subjectHash = [ordered]@{"OU"="AzureStack";"O"="Microsoft";"L"="Redmond";"ST"="Washington";"C"="US"} 
    ````
    > [!note]  
    > If a common name (CN) is supplied this will be overwritten by the first DNS name of the certificate request.

3.  Declare an output directory that already exists. For example:

    ````PowerShell  
    $outputDirectory = "$ENV:USERPROFILE\Documents\AzureStackCSR"
    ````
4.  Declare identify system

    Azure Active Directory

    ```PowerShell
    $IdentitySystem = "AAD"
    ````

    Active Directory Federation Services

    ```PowerShell
    $IdentitySystem = "ADFS"
    ````

5. Declare **region name** and an **external FQDN** intended for the Azure Stack deployment.

    ```PowerShell
    $regionName = 'east'
    $externalFQDN = 'azurestack.contoso.com'
    ````

    > [!note]  
    > `<regionName>.<externalFQDN>` forms the basis on which all external DNS names in Azure Stack are created, in this example, the portal would be `portal.east.azurestack.contoso.com`.  

6. To generate certificate signing requests for each DNS name:

    ```PowerShell  
    Start-AzsReadinessChecker -RegionName $regionName -FQDN $externalFQDN -subject $subjectHash -OutputRequestPath $OutputDirectory -IdentitySystem $IdentitySystem
    ````

    To include PaaS Services specify the switch ```-IncludePaaS```

7. Alternatively, for Dev/Test environments. To generate a single certificate request with multiple Subject Alternative Names add **-RequestType SingleCSR** parameter and value (**not** recommended for production environments):

    ```PowerShell  
    Start-AzsReadinessChecker -RegionName $regionName -FQDN $externalFQDN -subject $subjectHash -RequestType SingleCSR -OutputRequestPath $OutputDirectory -IdentitySystem $IdentitySystem
    ````

    To include PaaS Services specify the switch ```-IncludePaaS```
    
8. Review the output:

    ````PowerShell  
    AzsReadinessChecker v1.1803.405.3 started
    Starting Certificate Request Generation

    CSR generating for following SAN(s): dns=*.east.azurestack.contoso.com&dns=*.blob.east.azurestack.contoso.com&dns=*.queue.east.azurestack.contoso.com&dns=*.table.east.azurestack.cont
    oso.com&dns=*.vault.east.azurestack.contoso.com&dns=*.adminvault.east.azurestack.contoso.com&dns=portal.east.azurestack.contoso.com&dns=adminportal.east.azurestack.contoso.com&dns=ma
    nagement.east.azurestack.contoso.com&dns=adminmanagement.east.azurestack.contoso.com*dn2=*.adminhosting.east.azurestack.contoso.com@dns=*.hosting.east.azurestack.contoso.com
    Present this CSR to your Certificate Authority for Certificate Generation: C:\Users\username\Documents\AzureStackCSR\wildcard_east_azurestack_contoso_com_CertRequest_20180405233530.req
    Certreq.exe output: CertReq: Request Created

    Finished Certificate Request Generation

    AzsReadinessChecker Log location: C:\Program Files\WindowsPowerShell\Modules\Microsoft.AzureStack.ReadinessChecker\1.1803.405.3\AzsReadinessChecker.log
    AzsReadinessChecker Completed
    ````

9.  Submit the **.REQ** file generated to your CA (either internal or public).  The output directory of **Start-AzsReadinessChecker** contains the CSR(s) necessary to submit to a Certificate Authority.  It also contains a child directory containing the INF file(s) used during certificate request generation, as a reference. Be sure that your CA generates certificates using your generated request that meet the [Azure Stack PKI Requirements](azure-stack-pki-certs.md).

## Next steps

[Prepare Azure Stack PKI certificates](azure-stack-prepare-pki-certs.md)
