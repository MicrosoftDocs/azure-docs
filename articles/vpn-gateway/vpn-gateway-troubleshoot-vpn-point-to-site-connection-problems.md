---
title: Troubleshoot Azure point-to-site connection problems| Microsoft Docs
description: Learn how to troubleshoot point-to-site connection problems.
services: vpn-gateway
documentationcenter: na
author: genlin
manager: willchen
editor: ''
tags: ''

ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/23/2017
ms.author: genli
---
# Troubleshooting: Azure point-to-site connection problems

This article lists common point-to-site connection problems that you might experience. It also discusses possible causes and solutions for these problems.

## VPN client error: A certificate could not be found

### Symptom

When you try to connect to an Azure virtual network by using the VPN client, you receive the following error message:

**A certificate could not be found that can be used with this Extensible Authentication Protocol. (Error 798)**

### Cause

This problem occurs if the client certificate is missing from **Certificates - Current User\Personal\Certificates**.

### Solution

Make sure that the client certificate is installed in the following location of the Certificates store (Certmgr.msc):
 
**Certificates - Current User\Personal\Certificates**

For more information about how to install the client certificate, see [Generate and export certificates for point-to-site connections](vpn-gateway-certificates-point-to-site.md).

> [!NOTE]
> When you import the client certificate, do not select the **Enable strong private key protection** option.

## VPN client error: The message received was unexpected or badly formatted

### Symptom

When you try to connect to an Azure virtual network by using the VPN client, you receive the following error message:

**The message received was unexpected or badly formatted. (Error 0x80090326)**

### Cause

This problem occurs if the root certificate public key is not uploaded into the Azure VPN gateway. It can also occur if the key is corrupted or expired.

### Solution

To resolve this problem, check the status of the root certificate in the Azure portal to see whether it has been revoked. If it is not revoked, try to delete the root certificate and reupload. For more information, see [Create certificates](vpn-gateway-howto-point-to-site-classic-azure-portal.md#generatecerts).

## VPN client error: A certificate chain processed but terminated 

### Symptom 

When you try to connect to an Azure virtual network by using the VPN client, you receive the following error message:

**A certificate chain processed but terminated in a root certificate which is not trusted by the trust provider.**

### Solution

1. Make sure that the following certificates are in the correct location:

    | Certificate | Location |
    | ------------- | ------------- |
    | AzureClient.pfx  | Current User\Personal\Certificates |
    | Azuregateway-*GUID*.cloudapp.net  | Current User\Trusted Root Certification Authorities|
    | AzureGateway-*GUID*.cloudapp.net, AzureRoot.cer    | Local Computer\Trusted Root Certification Authorities|

2. If the certificates are already in the location, try to delete the certificates and reinstall them. The **azuregateway-*GUID*.cloudapp.net** certificate is in the VPN client configuration package that you downloaded from the Azure portal. You can use file archivers to extract the files from the package.

## File download error: Target URI is not specified

### Symptom

You receive the following error message:

**File download error. Target URI is not specified.**

### Cause 

This problem occurs because of an incorrect gateway type. 

### Solution

The VPN gateway type must be **VPN**, and the VPN type must be **RouteBased**.

## VPN client error: Azure VPN custom script failed 

### Symptom

When you try to connect to an Azure virtual network by using the VPN client, you receive the following error message:

**Custom script (to update your routing table) failed. (Error 8007026f)**

### Cause

This problem might occur if you are trying to open the site-to-point VPN connection by using a shortcut.

### Solution 

Open the VPN package directly instead of opening it from the shortcut.

## Cannot install the VPN client

### Cause 

An additional certificate is required to trust the VPN gateway for your virtual network. The certificate is included in the VPN client configuration package that is generated from the Azure portal.

### Solution

Extract the VPN client configuration package, and find the .cer file. To install the certificate, follow these steps:

1. Open mmc.exe.

2. Add the **Certificates** snap-in.
3. Select the **Computer** account for the local computer.
4. Right-click the **Trusted Root Certification Authorities** node. Click **All-Task** > **Import**, and browse to the .cer file you extracted from the VPN client configuration package.
5. Restart the computer. 
6. Try to install the VPN client.

## Azure portal error: Failed to save the VPN gateway, and the data is invalid

### Symptom

When you try to save the changes for the VPN gateway in the Azure portal, you receive the following error message:

**Failed to save virtual network gateway &lt;*gateway name*&gt;. Data for certificate &lt;*certificate ID*&gt; is invalid.**

### Cause 

This problem might occur if the root certificate public key that you uploaded contains an invalid character, such as a space.

### Solution

Make sure that the data in the certificate does not contain invalid characters, such as line breaks (carriage returns). The entire value should be one long line. The following text is a sample of the certificate:

    -----BEGIN CERTIFICATE-----
    MIIC5zCCAc+gAwIBAgIQFSwsLuUrCIdHwI3hzJbdBjANBgkqhkiG9w0BAQsFADAW
    MRQwEgYDVQQDDAtQMlNSb290Q2VydDAeFw0xNzA2MTUwMjU4NDZaFw0xODA2MTUw
    MzE4NDZaMBYxFDASBgNVBAMMC1AyU1Jvb3RDZXJ0MIIBIjANBgkqhkiG9w0BAQEF
    AAOCAQ8AMIIBCgKCAQEAz8QUCWCxxxTrxF5yc5uUpL/bzwC5zZ804ltB1NpPa/PI
    sa5uwLw/YFb8XG/JCWxUJpUzS/kHUKFluqkY80U+fAmRmTEMq5wcaMhp3wRfeq+1
    G9OPBNTyqpnHe+i54QAnj1DjsHXXNL4AL1N8/TSzYTm7dkiq+EAIyRRMrZlYwije
    407ChxIp0stB84MtMShhyoSm2hgl+3zfwuaGXoJQwWiXh715kMHVTSj9zFechYd7
    5OLltoRRDyyxsf0qweTFKIgFj13Hn/bq/UJG3AcyQNvlCv1HwQnXO+hckVBB29wE
    sF8QSYk2MMGimPDYYt4ZM5tmYLxxxvGmrGhc+HWXzMeQIDAQABozEwLzAOBgNVHQ8B
    Af8EBAMCAgQwHQYDVR0OBBYEFBE9zZWhQftVLBQNATC/LHLvMb0OMA0GCSqGSIb3
    DQEBCwUAA4IBAQB7k0ySFUQu72sfj3BdNxrXSyOT4L2rADLhxxxiK0U6gHUF6eWz
    /0h6y4mNkg3NgLT3j/WclqzHXZruhWAXSF+VbAGkwcKA99xGWOcUJ+vKVYL/kDja
    gaZrxHlhTYVVmwn4F7DWhteFqhzZ89/W9Mv6p180AimF96qDU8Ez8t860HQaFkU6
    2Nw9ZMsGkvLePZZi78yVBDCWMogBMhrRVXG/xQkBajgvL5syLwFBo2kWGdC+wyWY
    U/Z+EK9UuHnn3Hkq/vXEzRVsYuaxchta0X2UNRzRq+o706l+iyLTpe6fnvW6ilOi
    e8Jcej7mzunzyjz4chN0/WVF94MtxbUkLkqP
    -----END CERTIFICATE-----

## Azure portal error: Failed to save the VPN gateway, and the resource name is invalid

### Symptom

When you try to save the changes for the VPN gateway in the Azure portal, you receive the following error message: 

**Failed to save virtual network gateway &lt;*gateway name*&gt;. Resource name &lt;*certificate name you try to upload*&gt; is invalid**.

### Cause

This problem occurs because the name of the certificate contains an invalid character, such as a space. 

## Azure portal error: VPN package file download error 503

### Symptom

When you try to download the VPN client configuration package, you receive the following error message:

**Failed to download the file. Error details: error 503. The server is busy.**
 
### Solution

This error can be caused by a temporary network problem. Try to download the VPN package again after a few minutes.

## Azure VPN Gateway upgrade: All P2S clients are unable to connect

### Cause

If the certificate is more than 50 percent through its lifetime, the certificate is rolled over.

### Solution

To resolve this problem, create and redistribute new certificates to the VPN clients. 

## Too many VPN clients connected at once

For each VPN gateway, the maximum number of allowable connections is 128. You can see the total number of connected clients in the Azure portal.

## Point-to-site VPN incorrectly adds a route for 10.0.0.0/8 to the route table

### Symptom

When you dial the VPN connection on the point-to-site client, the VPN client should add a route toward the Azure virtual network. The IP helper service should add a route for the subnet of the VPN clients. 

The VPN client range belongs to a smaller subnet of 10.0.0.0/8, such as 10.0.12.0/24. Instead of a route for 10.0.12.0/24, a route for 10.0.0.0/8 is added that has higher priority. 

This incorrect route breaks connectivity with other on-premises networks that might belong to another subnet within the 10.0.0.0/8 range, such as 10.50.0.0/24, that don't have a specific route defined. 

### Cause

This behavior is by design for Windows clients. When the client uses the PPP IPCP protocol, it obtains the IP address for the tunnel interface from the server (the VPN gateway in this case). However, because of a limitation in the protocol, the client does not have the subnet mask. Because there is no other way to get it, the client tries to guess the subnet mask based on the class of the tunnel interface IP address. 

Therefore, a route is added based on the following static mapping: 

If address belongs to class A --> apply /8

If address belongs to class B --> app

If address belongs to class C --> apply /24

## VPN client cannot access network file shares

### Symptom

The VPN client has connected to the Azure virtual network. However, the client cannot access network shares.

### Cause

The SMB protocol is used for file share access. When the connection is initiated, the VPN client adds the session credentials and the failure occurs. After the connection is established, the client is forced to use the cache credentials for Kerberos authentication. This process initiates queries to the Key Distribution Center (a domain controller) to get a token. Because the client connects from the Internet, it might not be able to reach the domain controller. Therefore, the client cannot fail over from Kerberos to NTLM. 

The only time that the client is prompted for a credential is when it has a valid certificate (with SAN=UPN) issued by the domain to which it is joined. The client also must be physically connected to the domain network. In this case, the client tries to use the certificate and reaches out to the domain controller. Then the Key Distribution Center returns a "KDC_ERR_C_PRINCIPAL_UNKNOWN" error. The client is forced to fail over to NTLM. 

### Solution

To work around the problem, disable the caching of domain credentials from the following registry subkey: 

    HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\DisableDomainCreds - Set the value to 1 


## Cannot find the point-to-site VPN connection in Windows after reinstalling the VPN client

### Symptom

You remove the point-to-site VPN connection and then reinstall the VPN client. In this situation, the VPN connection is not configured successfully. You do not see the VPN connection in the **Network connections** settings in Windows.

### Solution

To resolve the problem, delete the old VPN client configuration files from **C:\Users\TheUserName\AppData\Roaming\Microsoft\Network\Connections**, and then run the VPN client installer again.