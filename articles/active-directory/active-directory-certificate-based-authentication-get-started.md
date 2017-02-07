---
title: Get started with certificate based authentication | Microsoft Docs
description: Learn how to configure certificate based authentication
author: MarkusVi
documentationcenter: na
manager: femila

ms.assetid: c6ad7640-8172-4541-9255-770f39ecce0e
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/06/2017
ms.author: markvi

---
# Get started with certificate based authentication on Android

This topic shows you how to configure and utilize certificate based authentication (CBA) for users of tenants in Office 365 Enterprise, Business, and Education plans. 

CBA enables you to be authenticated by Azure Active Directory with a client certificate on an Android or iOS device when connecting your Exchange online account to: 

* Office mobile applications such as Microsoft Outlook and Microsoft Word   
* Exchange ActiveSync (EAS) clients 

Configuring this feature eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device. 

## Step 1: Select your device platform

- [Android](active-directory-certificate-based-authentication-android.md)
- [iOS](active-directory-certificate-based-authentication-ios.md)


## Step 2: Configure the certificate authorities in Azure Active Directory

To get started, you need to configure the certificate authorities in Azure Active Directory. For each certificate authority, upload the following: 

* The public portion of the certificate, in *.cer* format 
* The Internet facing URLs where the Certificate Revocation Lists (CRLs) reside

Below is the schema for a certificate authority: 

    class TrustedCAsForPasswordlessAuth 
    { 
       CertificateAuthorityInformation[] certificateAuthorities;    
    } 

    class CertificateAuthorityInformation 

    { 
        CertAuthorityType authorityType; 
        X509Certificate trustedCertificate; 
        string crlDistributionPoint; 
        string deltaCrlDistributionPoint; 
        string trustedIssuer; 
        string trustedIssuerSKI; 
    }                

    enum CertAuthorityType 
    { 
        RootAuthority = 0, 
        IntermediateAuthority = 1 
    } 


To upload the information, you can use  the Azure AD module through Windows PowerShell.  
Below are examples for adding, removing or modifying a certificate authority. 


## Step 3: Configure your Azure AD tenant for certificate based authentication

1. Start Windows PowerShell with administrator privileges. 
2. Install the Azure AD module. You need to install Version [2.0.0.33 ](https://www.powershellgallery.com/packages/AzureAD/2.0.0.33) or higher.  
   
        Install-Module -Name AzureAD –RequiredVersion 2.0.0.33 
3. Connect to your target tenant: 
   
        Connect-AzureAD 

### Adding a new certificate authority
1. Set various properties of the certificate authority and add it to Azure Active Directory: 
   
        $cert=Get-Content -Encoding byte "[LOCATION OF THE CER FILE]" 
        $new_ca=New-Object -TypeName Microsoft.Open.AzureAD.Model.CertificateAuthorityInformation 
        $new_ca.AuthorityType=0 
        $new_ca.TrustedCertificate=$cert 
        New-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $new_ca 
2. Get the Certificate Authorities: 
   
        Get-AzureADTrustedCertificateAuthority 

### Retrieving the list certificate authorities
Retrieve the certificate authorities currently stored in Azure Active Directory for your tenant: 

        Get-AzureADTrustedCertificateAuthority 


### Removing a certificate authority
1. Retrieve the certificate authorities: 
   
     $c=Get-AzureADTrustedCertificateAuthority 
2. Remove the certificate for the certificate authority: 
   
        Remove-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[2] 

### Modfiying a certificate authority
1. Retrieve the certificate authorities: 
   
     $c=Get-AzureADTrustedCertificateAuthority 
2. Modify properties on the certificate authority: 
   
        $c[0].AuthorityType=1 
3. Set the **Certificate Authority**: 
   
        Set-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[0] 


## Step 4: Configure revocation

This step is optional and not required if you only want to do a quick functionality test.

To revoke a client certificate, Azure Active Directory fetches the certificate revocation list (CRL) from the URLs uploaded as part of certificate authority information and caches it. The last publish timestamp (**Effective Date** property) in the CRL is used to ensure the CRL is still valid. The CRL is periodically referenced to revoke access to certificates that are a part of the list.

If a more instant revocation is required (for example, if a user loses a device), the authorization token of the user can be invalidated. To invalidate the authorization token, set the **StsRefreshTokenValidFrom** field for this particular user using Windows PowerShell. You must update the **StsRefreshTokenValidFrom** field for each user you want to revoke access for.

To ensure that the revocation persists, you must set the **Effective Date** of the CRL to a date after the value set by **StsRefreshTokenValidFrom** and ensure the certificate in question is in the CRL.

The following steps outline the process for updating and invalidating the authorization token by setting the **StsRefreshTokenValidFrom** field. 

1. Connect with admin credentials to the MSOL service: 
   
        $msolcred = get-credential 
        connect-msolservice -credential $msolcred 
2. Retrieve the current StsRefreshTokensValidFrom value for a user: 
   
     $user = Get-MsolUser -UserPrincipalName test@yourdomain.com` 
     $user.StsRefreshTokensValidFrom 
3. Configure a new StsRefreshTokensValidFrom value for the user equal to the current timestamp: 
   
     Set-MsolUser -UserPrincipalName test@yourdomain.com -StsRefreshTokensValidFrom ("03/05/2016")

The date you set must be in the future. If the date is not in the future, the **StsRefreshTokensValidFrom** property is not set. If the date is in the future, **StsRefreshTokensValidFrom** is set to the current time (not the date indicated by Set-MsolUser command). 


## Step 5: Test your configuration

## Testing Office mobile applications
To test certificate authentication on your mobile Office application: 

1. On your test device, install an Office mobile application (e.g. OneDrive) from the Google Play Store.
2. Verify that the user certificate has been provisioned to your test device. 
3. Launch the application. 
4. Enter your user name, and then pick the user certificate you want to use. 

You should be successfully signed in. 

## Testing Exchange ActiveSync client applications
To access Exchange ActiveSync via certificate based authentication, an EAS profile containing the client certificate must be available to application. The EAS profile must contain the following information:

* The user certificate to be used for authentication 
* The EAS endpoint must be outlook.office365.com (as this feature is currently supported only in the Exchange online multi-tenant environment)

An EAS profile can be configured and placed on the device through the utilization of an MDM such as Intune or by manually placing the certificate in the EAS profile on the device.  

### Testing EAS client applications on Android
To test certificate authentication with an application on Android 5.0 (Lollipop) or later, perform the steps below:  

1. Configure an EAS profile in the application that satisfies the requirements above.  
2. Once the profile is properly configured, open the application, and verify that mail is synchronizing. 

