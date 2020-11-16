---
title: Create certificates using Microsoft Azure Stack Hub Readiness Checker tool | Microsoft Docs
description: Describes how to create certificate requests and then get and install certificates on your Azure Stack Edge Pro GPU device using the Azure Stack Hub Readiness Checker tool.
services: Azure Stack Edge Pro
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/28/2020
ms.author: alkohli
---

# Create certificates for your Azure Stack Edge Pro using Azure Stack Hub Readiness Checker tool 

<!--[!INCLUDE [applies-to-skus](../../includes/azure-stack-edge-applies-to-all-sku.md)]-->

This article describes how to create certificates for your Azure Stack Edge Pro using the Azure Stack Hub Readiness Checker tool. 

## Using Azure Stack Hub Readiness Checker tool

Use the Azure Stack Hub Readiness Checker tool to create Certificate Signing Requests (CSRs) for an Azure Stack Edge Pro device deployment. You can create these requests after placing an order for the Azure Stack Edge Pro device and waiting for the device to arrive. 

> [!NOTE]
> Use this tool only for test or development purposes and not for production devices. 

You can use the Azure Stack Hub Readiness Checker tool (AzsReadinessChecker) to request the following certificates:

- Azure Resource Manager certificate
- Local UI certificate
- Node certificate
- Blob certificate
- VPN certificate


## Prerequisites

To create CSRs for Azure Stack Edge Pro device deployment, make sure that: 

- You've a client running Windows 10 or Windows Server 2016 or later. 
- You've downloaded the Microsoft Azure Stack Hub Readiness Checker tool 1.2002.1133.85 [from the PowerShell Gallery](https://aka.ms/AzsReadinessChecker) on this system. You may need to search for this package. Only this version of the tool can create certificates for Azure Stack Edge Pro devices.
- You have the following information for the certificates:
  - Device name
  - Node serial number
  - External fully qualified domain name (FQDN)

## Generate certificate signing requests

Use these steps to prepare the Azure Stack Edge Pro device certificates:

1. Run PowerShell as administrator (5.1 or later).
2. Install the Azure Stack Hub Readiness Checker tool. At the PowerShell prompt, type: 

    ```azurepowershell
    Install-Module -Name Microsoft.AzureStack.ReadinessChecker -RequiredVersion 1.2002.1133.85 -Force
    ```

    To verify the installed version, type:  

    ```azurepowershell
    Get-InstalledModule -Name Microsoft.AzureStack.ReadinessChecker  | ft Name, Version 
    ```

3. Create a directory for all the certificates if it does not exist. Type: 
    
    ```azurepowershell
    New-Item "C:\certrequest" -ItemType Directory
    ``` 
    
4. To create a certificate request, provide the following information. If you are generating a VPN certificate, some of these inputs do not apply. 
    
    |Input |Description  |
    |---------|---------|
    |`OutputRequestPath`|The file path on your local client where you want the certificate requests to be created.        |
    |`DeviceName`|The name of your device in the **Devices** page in the local web UI of your device. <br> This field is not required for a VPN certificate.         |
    |`NodeSerialNumber`|The serial number of the device node in the **Network** page in the local web UI of your device. <br> This field is not required for a VPN certificate.       |
    |`ExternalFQDN`|The DNSDomain value in the **Devices** page in the local web UI of your device.         |
    |`RequestType`|The request type can be for `MultipleCSR` - different certificates for the various endpoints, or `SingleCSR` - a single certificate for all the endpoints. <br> This field is not required for a VPN certificate.     |

    For all the certificates except the VPN certificate, type: 
    
    ```azurepowershell
    $edgeCSRparams = @{
        CertificateType = 'AzureStackEdgeDEVICE'
        DeviceName = 'myTEA1'
        NodeSerialNumber = 'VM1500-00025'
        externalFQDN = 'azurestackedge.contoso.com'
        requestType = 'MultipleCSR'
        OutputRequestPath = "C:\certrequest"
    }
    New-AzsCertificateSigningRequest @edgeCSRparams
    ```

    If you are creating a VPN certificate, type: 

    ```azurepowershell
    $edgeCSRparams = @{
        CertificateType = 'AzureStackEdgeVPN'
        externalFQDN = 'azurestackedge.contoso.com'
        OutputRequestPath = "C:\certrequest"
    }
    New-AzsCertificateSigningRequest @edgeCSRparams
    ```

    
5. You will find the certificate request files under the directory you specified in the OutputRequestPath parameter above. When using the `MultipleCSR` parameter, you will see 4 files with the `.req` extension. The files are as follows:

    
    |File names  |Type of certificate request  |
    |---------|---------|
    |Starting with your `DeviceName`     |Local web UI certificate request      |
    |Starting with your `NodeSerialNumber`     |Node certificate request         |
    |Starting with `login`     |Azure Resource Manager Endpoint certificate request       |
    |Starting with `wildcard`     |Blob storage certificate request; it contains a wildcard because it covers all the storage accounts that you may create on the device.          |
    |Starting with `AzureStackEdgeVPNCertificate`     |VPN client certificate request.         |

    You also see an INF folder. This contains a management.<edge-devicename> information file in clear text explaining the certificate details.  


6. Submit these files to your certificate authority (either internal or public). Be sure that your CA generates certificates using your generated request that meet the Azure Stack Edge Pro certificate requirements for [node certificates](azure-stack-edge-j-series-manage-certificates.md#node-certificates), [endpoint certificates](azure-stack-edge-j-series-manage-certificates.md#endpoint-certificates), and [local UI certificates](azure-stack-edge-j-series-manage-certificates.md#local-ui-certificates).

## Prepare certificates for deployment

The certificate files that you obtain from your certificate authority (CA) must be imported and exported with properties that match Azure Stack Edge Pro device's certificate requirements. Complete the following steps on the same system where you generated the certificate signing requests.

- To import the certificates, follow the steps in [Import certificates on the clients accessing your Azure Stack Edge Pro device](azure-stack-edge-j-series-manage-certificates.md#import-certificates-on-the-client-accessing-the-device).

- To export the certificates, follow the steps in [Export certificates from the client accessing the Azure Stack Edge Pro device](azure-stack-edge-j-series-manage-certificates.md#import-certificates-on-the-client-accessing-the-device).


## Validate certificates

First, you'll generate a proper folder structure and place the certificates in the corresponding folders. Only then you'll validate the certificates using the tool.

1. Run PowerShell as administrator.

2. To generate the appropriate folder structure, at the prompt type:

    `New-AzsCertificateFolder -CertificateType AzureStackEdge -OutputPath "$ENV:USERPROFILE\Documents\AzureStackCSR"`

3. Convert the PFX password into a secure string. Type:       

    `$pfxPassword = Read-Host -Prompt "Enter PFX Password" -AsSecureString` 

4. Next, validate the certificates. Type:

    `Invoke-AzsCertificateValidation -CertificateType AzureStackEdge -DeviceName mytea1 -NodeSerialNumber VM1500-00025 -externalFQDN azurestackedge.contoso.com -CertificatePath $ENV:USERPROFILE\Documents\AzureStackCSR\AzureStackEdge -pfxPassword $pfxPassword`

## Next steps

[Deploy your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-prep.md)
