---
title: Create certificates for Azure Stack Edge Pro GPU via Azure Stack Hub Readiness Checker tool
description: Describes how to create certificate requests and then get and install certificates on your Azure Stack Edge Pro GPU device using the Azure Stack Hub Readiness Checker tool.
author: alkohli
ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 10/01/2021
ms.author: alkohli
---

# Create certificates for your Azure Stack Edge Pro GPU using Azure Stack Hub Readiness Checker tool 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to create certificates for your Azure Stack Edge Pro using the Azure Stack Hub Readiness Checker tool. 

## Using Azure Stack Hub Readiness Checker tool

Use the Azure Stack Hub Readiness Checker tool to create Certificate Signing Requests (CSRs) for an Azure Stack Edge Pro device deployment. You can create these requests after you place an order for the Azure Stack Edge Pro device and wait for the device to arrive.

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
- You've downloaded the Microsoft Azure Stack Hub Readiness Checker tool [from the PowerShell Gallery](https://aka.ms/AzsReadinessChecker) on this system.
- You have the following information for the certificates:
  - Device name
  - Node serial number
  - External fully qualified domain name (FQDN)

## Generate certificate signing requests

Use these steps to prepare the Azure Stack Edge Pro device certificates:

1. Run PowerShell as administrator (5.1 or later).
2. Install the Azure Stack Hub Readiness Checker tool. At the PowerShell prompt, type: 

    ```azurepowershell
    Install-Module -Name Microsoft.AzureStack.ReadinessChecker
    ```

    To get the installed version, type:  

    ```azurepowershell
    Get-InstalledModule -Name Microsoft.AzureStack.ReadinessChecker  | ft Name, Version 
    ```

3. Create a directory for all the certificates if you don't already have one. Type: 
    
    ```azurepowershell
    New-Item "C:\certrequest" -ItemType Directory
    ``` 
    
4. To create a certificate request, provide the following information. If you are generating a VPN certificate, some of these inputs do not apply.
    
    |Input |Description  |
    |---------|---------|
    |`OutputRequestPath`|The file path on your local client where you want the certificate requests to be created.        |
    |`DeviceName`|The name of your device in the **Device** page in the local web UI of your device. <br> This field isn't required for a VPN certificate.         |
    |`NodeSerialNumber`|The `Node serial number` of the device node shown on the **Overview** page in the local web UI of your device. <br> This field isn't required for a VPN certificate.       |
    |`ExternalFQDN`|The `DNS domain` value in the **Device** page in the local web UI of your device.         |
    |`RequestType`|The request type can be for `MultipleCSR` - different certificates for the various endpoints, or `SingleCSR` - a single certificate for all the endpoints. <br> This field isn't required for a VPN certificate.     |

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

    
5. You will find the certificate request files in the directory you specified in the OutputRequestPath parameter above. When using the `MultipleCSR` parameter, you'll see the following four files with the `.req` extension:

    
    |File names  |Type of certificate request  |
    |---------|---------|
    |Starting with your `DeviceName`     |Local web UI certificate request      |
    |Starting with your `NodeSerialNumber`     |Node certificate request         |
    |Starting with `login`     |Azure Resource Manager Endpoint certificate request       |
    |Starting with `wildcard`     |Blob storage certificate request. It contains a wildcard because it covers all the storage accounts that you may create on the device.          |
    |Starting with `AzureStackEdgeVPNCertificate`     |VPN client certificate request.         |

    You'll also see an INF folder. This contains a management.\<edge-devicename\> information file in clear text explaining the certificate details.  


6. Submit these files to your certificate authority (either internal or public). Be sure that your CA generates certificates, using your generated request, that meet the Azure Stack Edge Pro certificate requirements for [node certificates](azure-stack-edge-gpu-certificates-overview.md#node-certificates), [endpoint certificates](azure-stack-edge-gpu-certificates-overview.md#endpoint-certificates), and [local UI certificates](azure-stack-edge-gpu-certificates-overview.md#local-ui-certificates).

## Prepare certificates for deployment

The certificate files that you get from your certificate authority (CA) must be imported and exported with properties that match the certificate requirements of the Azure Stack Edge Pro device. Complete the following steps on the same system where you generated the certificate signing requests.

- To import the certificates, follow the steps in [Import certificates on the clients accessing your Azure Stack Edge Pro device](azure-stack-edge-gpu-manage-certificates.md#import-certificates-on-the-client-accessing-the-device).

- To export the certificates, follow the steps in [Export certificates from the client accessing the Azure Stack Edge Pro device](azure-stack-edge-gpu-prepare-certificates-device-upload.md#export-certificates-as-pfx-format-with-private-key).


## Validate certificates

First, you'll generate a proper folder structure and place the certificates in the corresponding folders. Only then you'll validate the certificates using the tool.

1. Run PowerShell as administrator.

2. To generate the appropriate folder structure, at the prompt type:

    `New-AzsCertificateFolder -CertificateType AzureStackEdgeDevice -OutputPath "$ENV:USERPROFILE\Documents\AzureStackCSR"`

3. Convert the PFX password into a secure string. Type:       

    `$pfxPassword = Read-Host -Prompt "Enter PFX Password" -AsSecureString` 

4. Next, validate the certificates. Type:

    `Invoke-AzsCertificateValidation -CertificateType AzureStackEdgeDevice -DeviceName mytea1 -NodeSerialNumber VM1500-00025 -externalFQDN azurestackedge.contoso.com -CertificatePath $ENV:USERPROFILE\Documents\AzureStackCSR\AzureStackEdge -pfxPassword $pfxPassword`

## Next steps

[Upload certificates on your device](azure-stack-edge-gpu-manage-certificates.md).
