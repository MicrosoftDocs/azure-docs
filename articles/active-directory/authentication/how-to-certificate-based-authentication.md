---
title: Native certificate-based authentication without federation - Azure Active Directory
description: Learn how to configure certificate-based authentication in AZure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 04/28/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# How to configure native certificate-based authentication in Azure Active Directory

You can configure certificate-based authentication to allow SmartCard users to authenticate directly with Azure Active Directory (Azure AD). Native certificate-based authentication removes the need for another identity provider such as Active Directory Federation Services (AD FS) on premises. Native certificate-based authentication helps improve security and reduce costs by moving to cloud native authentication. 

## Restrictions and caveats  

Native certificate-based authentication is supported as part of a public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


Other certificate to user account binding arrangements such as using the subject field, or keyid + issuer, aren’t available in this release. 

Windows sign in with SmartCards isn’t supported directly with Azure AD. Windows SmartCard authentication can be supported on premises for single sign-on (SSO) to cloud resources.  

## Configuration steps

![Configuration steps](media/how-to-certificate-based-authentication/configuration.png)


## Upload the trusted issuers

Your test tenant will need one or more trusted issuers to validate client certs against:

1. Click **Start** > **Run** and type mmc and press Enter.
1. Click **File** > **Add or Remove Snap-ins**.
1. Add the **Certificates** snap-in and choose **Computer account**.
1. Browse to **Personal** > **Certificates** and export the CBATestRoot certificate you created in the previous step (don't export the private key). Use .cer format. 
1. Follow the instructions in the [Get started topic](active-directory-certificate-based-authentication-get-started.md) to upload your CA test certificate to your test tenant. Use the .cer file you exported previously (you can set CrlDistributionPoint to "").
1. Invoke `Get-AzureADTrustedCertificateAuthority` to ensure your trusted issuer was uploaded properly.


## Configure authentication bindings 

This step is optional for users of multifactor authentication. All certificates bind to single-factor authentication by default.

## Configure username bindings

This step is optional. The default binding is:   

Certificate field: Subject Alternative Name: Principal Name<br> 
User Attribute: onPremisesUserPrincipalName<br> 
Priority: 1<br> 

 
Certificate field: Subject Alternative Name: RFC822Name <br>
User Attribute: UserPrincipalName <br>
Priority: 2 <br>


Supported bindings at this time include: 

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

Note that if the specified X.509 certificate field is found on the certificate, but Azure AD doesn’t find a user object using that value, the authentication fails.  Azure AD doesn’t try the next binding in the list.   Only if the X.509 certificate field is not on the certificate does it attempt to the next priority. 

<!---add UI steps from ppt--->

## Examples of graph operations to set the X.509 certificate authentication method 

Update User binding: 

```powershell
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
  

 

Set another User binding and assign priority:

```powershell
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

Make certificate based available for specific users or groups: 

```powershell
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "id": "X509Certificate", 

    "includeTargets": [ 

        { 

            "targetType": "group", 

            "id": "cedad1c0-ebe1-4a78-b77c-cb0e68aba284" 

        }, 

        { 

            "targetType": "user", 

            "id": "331a757c-d651-4f12-bf8c-4704e35582f9" 

        } 

    ] 

} 
```

Make certificate based available all users: 

 
```powershell
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

            "id": "331a757c-d651-4f12-bf8c-4704e35582f9" 

        } 

    ] 

} 
```

Enable the X.509 certificate authentication method: 

```powershell
{ 

    "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration", 

    "state": "enabled" 

} 
```
 

Disable the X.509 certificate authentication method: 

 
```powershell
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


