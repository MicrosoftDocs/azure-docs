---
title: Generate Azure Stack Public Key Infrastructure certificates for Azure Stack integrated systems deployment | Microsoft Docs
description: Describes the Azure Stack PKI certificate deployment processfor Azure Stack integrated systems.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/22/2018
ms.author: jeffgilb
ms.reviewer: ppacent
---

# Generate PKI certificates for Azure Stack deployment
Now that you know [the PKI certificate requirements](azure-stack-pki-certs.md) for Azure Stack deployments, you need to obtain those certificates from the Certificate Authority (CA) of your choice. 

## Request certificates using an INF file
One way to request certificates from either a Public CA or an Internal CA is by using an INF file. The Windows built-in certreq.exe utility can use an INF file specifying certificate detail, to generate a request file as described in this section. 

### Sample INF file 
The example certificate request INF file can be used to create an offline certificate request file for submission to a CA (either internal or public). The INF covers all of the required endpoints (including the optional PaaS services) in a single wildcard certificate. 

The sample INF file assumes that region is equal to **sea** and the external FQDN value is **sea&#46;contoso&#46;com**. Change those values to match your environment before generating an .INF file for your deployment. 

    
    [Version] 
    Signature="$Windows NT$"

    [NewRequest] 
    Subject = "C=US, O=Microsoft, L=Redmond, ST=Washington, CN=portal.sea.contoso.com"

    Exportable = TRUE                   ; Private key is not exportable 
    KeyLength = 2048                    ; Common key sizes: 512, 1024, 2048, 4096, 8192, 16384 
    KeySpec = 1                         ; AT_KEYEXCHANGE 
    KeyUsage = 0xA0                     ; Digital Signature, Key Encipherment 
    MachineKeySet = True                ; The key belongs to the local computer account 
    ProviderName = "Microsoft RSA SChannel Cryptographic Provider" 
    ProviderType = 12 
    SMIME = FALSE 
    RequestType = PKCS10
    HashAlgorithm = SHA256

    ; At least certreq.exe shipping with Windows Vista/Server 2008 is required to interpret the [Strings] and [Extensions] sections below

    [Strings] 
    szOID_SUBJECT_ALT_NAME2 = "2.5.29.17" 
    szOID_ENHANCED_KEY_USAGE = "2.5.29.37" 
    szOID_PKIX_KP_SERVER_AUTH = "1.3.6.1.5.5.7.3.1" 
    szOID_PKIX_KP_CLIENT_AUTH = "1.3.6.1.5.5.7.3.2"

    [Extensions] 
    %szOID_SUBJECT_ALT_NAME2% = "{text}dns=*.sea.contoso.com&dns=*.blob.sea.contoso.com&dns=*.queue.sea.contoso.com&dns=*.table.sea.contoso.com&dns=*.vault.sea.contoso.com&dns=*.adminvault.sea.contoso.com&dns=*.dbadapter.sea.contoso.com&dns=*.appservice.sea.contoso.com&dns=*.scm.appservice.sea.contoso.com&dns=api.appservice.sea.contoso.com&dns=ftp.appservice.sea.contoso.com&dns=sso.appservice.sea.contoso.com&dns=adminportal.sea.contoso.com&dns=management.sea.contoso.com&dns=adminmanagement.sea.contoso.com" 
    %szOID_ENHANCED_KEY_USAGE% = "{text}%szOID_PKIX_KP_SERVER_AUTH%,%szOID_PKIX_KP_CLIENT_AUTH%"

    [RequestAttributes]
    

## Generate and submit request to the CA
The following workflow describes how you can customize and use the sample INF file generated earlier to request a certificate from a CA:

1. **Edit and save INF file**. Copy the sample provided and save it to a new text file. Replace the subject name and external FQDN with the values that match your deployment and save the file as an .INF file.
2. **Generate a request using certreq**. Using a Windows computer, launch a command prompt as Administrator and run the following command to generate a request (.req) file: `certreq -new <yourinffile>.inf <yourreqfilename>.req`.
3. **Submit to CA**. Submit the .REQ file generated to your CA (can be internal or public).
4. **Import .CER**. The CA returns a .CER file. Using the same Windows computer from which you generated the request file, import the .CER file returned into the computer/personal store. 
5. **Export and copy .PFX to deployment folders**. Export the certificate (including the Private Key) as a .PFX file, and copy the .PFX file to the deployment folders described in [Azure Stack deployment PKI requirements](azure-stack-pki-certs.md).

## Next steps
[Prepare Azure Stack PKI certificates](prepare-pki-certs.md)