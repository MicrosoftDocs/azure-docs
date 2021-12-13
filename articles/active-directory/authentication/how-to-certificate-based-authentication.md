---
title: Native certificate-based authentication without federation - Azure Active Directory
description: Learn how to configure certificate-based authentication in AZure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 12/10/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Get started with native cloud certificate-based authentication in Azure Active Directory

Cloud native certificate-based authentication (CBA) enables customers to configure their Azure AD tenants to allow or require users to authenticate with X.509 certificates verified against their Enterprise Public Key Infrastructure (PKI) for app and browser sign-in. This feature enables customers to adopt passwordless and authenticate with an x.509 certificate. 
 
During sign-in, users will see an option to authenticate with a certificate instead of entering a password. 
If multiple matching certificates are present on the device, the user can pick which one to use. The certificate is validated, the binding to the user account is checked, and if successful, they are signed in.

<!---Clarify plans that are covered --->
This topic covers how to configure and use certificate-based authentication for tenants in Office 365 Enterprise, US Government plans. You should already have a [public key infrastructure (PKI)](https://aka.ms/securingpki) configured.
 
## Requirements

To configure certificate-based authentication, the following requirements must be met:

- The root certificate authority and any intermediate certificate authorities must be configured in Azure Active Directory.
- Each certificate authority must have a certificate revocation list (CRL) that can be referenced via an internet-facing URL.
- You must have at least one certificate authority configured in Azure Active Directory. You can find related steps in [Configure the certificate authorities](#configure-the-certificate-authorities).
- Your client device must have access to at least one certificate authority that issues client certificates.
- A client certificate for client authentication must have been issued to your client.
 
>[!IMPORTANT]
>The maximum size of a CRL for Azure Active Directory to successfully download and cache is 40MB, and the time required to download the CRL must not exceed 10 seconds. If Azure Active Directory can't download a CRL, certificate-based authentication using certificates issued by the corresponding CA will fail. As a best practice to ensure CRL files are within size constraints, keep certificate lifetimes to within reasonable limits and clean up expired certificates.

- Native certificate-based authentication is supported as part of a public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Step 1: Configure the certificate authorities

To configure your certificate authorities in Azure Active Directory, for each certificate authority, upload the following:

- The public portion of the certificate, in .cer format
- The internet-facing URLs where the Certificate Revocation Lists (CRLs) reside

  The schema for a certificate authority looks as follows:

    ```
    class TrustedCAsForPasswordlessAuth    {       CertificateAuthorityInformation[] certificateAuthorities;    }     class CertificateAuthorityInformation     {        CertAuthorityType authorityType;        X509Certificate trustedCertificate;        string crlDistributionPoint;        string deltaCrlDistributionPoint;        string trustedIssuer;        string trustedIssuerSKI;    }     enum CertAuthorityType    {        RootAuthority = 0,        IntermediateAuthority = 1    } 
    ```

For the configuration, you can use the [Azure Active Directory PowerShell Version 2](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2):

1. Start Windows PowerShell with administrator privileges.
1. Install the Azure AD module version [2.0.0.33](https://www.powershellgallery.com/packages/AzureAD/2.0.0.33) or higher:

   ```powershell
   Install-Module -Name AzureAD –RequiredVersion 2.0.0.33
   ``` 

As a first configuration step, you need to establish a connection with your tenant. As soon as a connection to your tenant exists, you can review, add, delete, and modify the trusted certificate authorities that are defined in your directory.

### Connect 

To establish a connection with your tenant, use the [Connect-AzureAD](https://docs.microsoft.com/powershell/module/azuread/connect-azuread) cmdlet:

```powershell
Connect-AzureAD
```  

### Retrieve

To retrieve the trusted certificate authorities that are defined in your directory, use the [Get-AzureADTrustedCertificateAuthority](https://docs.microsoft.com/powershell/module/azuread/get-azureadtrustedcertificateauthority) cmdlet:

```powershell
Get-AzureADTrustedCertificateAuthority
```  

### Add

To create a trusted certificate authority, use the [New-AzureADTrustedCertificateAuthority](https://docs.microsoft.com/powershell/module/azuread/new-azureadtrustedcertificateauthority) cmdlet and set the crlDistributionPoint attribute to a correct value:

```powershell
$cert=Get-Content -Encoding byte "[LOCATION OF THE CER FILE]"    $new_ca=New-Object -TypeName Microsoft.Open.AzureAD.Model.CertificateAuthorityInformation    $new_ca.AuthorityType=0    $new_ca.TrustedCertificate=$cert    $new_ca.crlDistributionPoint="<CRL Distribution URL>"    New-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $new_ca  
```

>[!NOTE] 
>If the crlDistributionPoint is not set or set to an empty value in the above command there will not be any CRL checking, and revocation of certificates is not possible.

Only one crlDistributionPoint is supported per CA and it needs to be an http url only.
  
### Remove

To remove a trusted certificate authority, use the [Remove-AzureADTrustedCertificateAuthority](https://docs.microsoft.com/powershell/module/azuread/remove-azureadtrustedcertificateauthority) cmdlet:
    
```powershell
$c=Get-AzureADTrustedCertificateAuthority    Remove-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[2]
``` 
 
### Modify
To modify a trusted certificate authority, use the [Set-AzureADTrustedCertificateAuthority](https://docs.microsoft.com/powershell/module/azuread/set-azureadtrustedcertificateauthority) cmdlet:

```powershell
$c=Get-AzureADTrustedCertificateAuthority    $c[0].AuthorityType=1    Set-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[0]	   
```   

## Step 2: Configure Authentication methods policy 

### Using the Azure portal

### Using Graph API

## Step 3: Test your configuration

## Configure manual revocation

## Confirm certificate revocation checks

## Turn certificate revocation checking on or off for a particular CA

## Frequently asked questions

**Can I have more than one CertificateDistributionPoint for a CA?**

No, only one CDP is supported per CA.

**Can I have non-http URLs for CDP?**

No, CDP supports only http URLs.

**Why do I get an error dialog “Your account or password is incorrect” when I try to do Certificate-based authentication?**

This error happens when we are not able to find a unique user from the certificate fields. Please make sure user bindings are set correctly.

**Why do I get an error dialog “Sign-in was blocked due to User Credential Policy” when I use the correct certificate?**

This error happens when the target user is not in scope for the policy. The authentication policy needs to be reviewed to make sure the user is within scope for the policy.

**Will my policy change take effect immediately?**

The policy is cached. After a policy update, it may take up to an hour for the changes to be effective.
 

## Configure authentication bindings 

This step is optional for users of multifactor authentication. All certificates bind to single-factor authentication by default.

## Configure username bindings

This step is optional. The default binding is:   

Certificate field:<br> 
Subject Alternative Name: Principal Name<br> 
User Attribute: onPremisesUserPrincipalName<br> 
Priority: 1<br> 

 
Certificate field:<br> 
Subject Alternative Name: RFC822Name <br>
User Attribute: UserPrincipalName <br>
Priority: 2 <br>


Supported bindings include: 

Certificate fields: 
- Subject Alternative Name: Principal Name 
- Subject Alternative Name: RFC822 Name 
 

User object Attributes: <br>
User Principal Name <br>
onPremisesUserPrincipalName <br>

 
You can set more than one user binding and assign a priority to each one if you are supporting different certificate formats in your environment. With more than one binding configured a priority is required to indicate the order of preference of X.509 user certificate field. The way multiple user bindings are processed is as follows. 

Attempt to use the highest priority (lowest number) binding:  

- If the X.509 certificate field is on the presented certificate. Attempt to look the user up using the value in the specified field. 
  - If a unique user is found, authenticate the user. 
  - If a unique user is not found, authentication fails. 
- If the X.509 certificate field is not on the presented certificate move to the next priority binding. 

Note that if the specified X.509 certificate field is found on the certificate, but Azure AD doesn’t find a user object using that value, the authentication fails. Azure AD doesn’t try the next binding in the list. Only if the X.509 certificate field is not on the certificate does it attempt to the next priority. 

## Examples of graph operations to set the X.509 certificate authentication method 

### Get all authentication methods 

```http
GET https://graph.microsoft.com/beta/policies/authenticationmethodspolicy
```

 

 

### Get current X.509 Certificate authentication method configuration 

```http
GET https://graph.microsoft.com/beta/policies/authenticationmethodspolicy/authenticationMetHodConfigurations/X509Certificate
```
 
### Update X.509 Certificate authentication method configuration 

```http
PATCH https://graph.microsoft.com/beta/policies/authenticationmethodspolicy/authenticationMetHodConfigurations/X509Certificate
```

### Update User binding 

```json
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "certificateUserBindings": [ 

      { 

        "x509CertificateField": "RFC822Name", 

        "userProperty": "userPrincipalName", 

        "priority": 1 

      } 

    ] 

} 
```
  
### Set another User binding and assign priority

You can change the priority. A lower value denotes higher priority. 

```json
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "certificateUserBindings": [ 

      { 

        "x509CertificateField": "PrincipalName", 

                  "userProperty": "onPremisesUserPrincipalName", 

                  "priority": 1 

               }, 

               { 

                  "x509CertificateField": "RFC822Name", 

                  "userProperty": "userPrincipalName", 

                  "priority": 2 

               } 

    ] 

} 
```

### Make certificate based authentication available for specific users or groups

In the following example, replace the group and user GUIDs with the values from your environment. 

```json
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "id": "X509Certificate", 

    "includeTargets": [ 

        { 

            "targetType": "group", 

            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 

        }, 

        { 

            "targetType": "user", 

            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 

        } 

    ] 

} 
```

### Make certificate based available all users

 
```json
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "id": "X509Certificate", 

    "includeTargets": [ 

        { 

            "targetType": "group", 

            "id": "all_users" 

        }, 

        { 

            "targetType": "user", 

            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 

        } 

    ] 

} 
```

### Enable the X.509 certificate authentication method

```json
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "state": "enabled" 

} 
```
 

### Disable the X.509 certificate authentication method

 
```json
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "state": "disabled" 

} 
```


## Enable SmartCard is required for logon 

Define which users can use certificate-based authentication to sign in. Options are: 

- All users 
- Specific users, either individually or by group membership 

After certificate-based authentication is enabled, all users will see the link to sign in with a certificate. Only users who are enabled for certificate-based authentication will be able to authenticate with this method.


## Detailed configuration instructions for X.509 certificate authentication method
	
Use Microsoft Graph and Microsoft Graph explorer to configure tenant CBA settings.

1. Sign in to MS Graph Explorer with your tenant.

1. Right-click **Settings** and click **Select permission**.

   ![Screenshot showing how to select permissions](media/how-to-certificate-based-authentication/select-permissions.png)

1. Type "auth" in the search bar and select everything from the list.

   ![Screenshot showing how to search for authentication methods](media/how-to-certificate-based-authentication/search-auth.png) 

1. At the bottom, click **Consent**. 

   ![Screenshot of providing consent](media/how-to-certificate-based-authentication/consent.png)

1. Select **beta** as Microsoft Graph version.

   ![Screenshot of choosing beta version](media/how-to-certificate-based-authentication/beta.png)