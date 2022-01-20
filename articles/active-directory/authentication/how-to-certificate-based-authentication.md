---
title: Tutorial to configure cloud-native certificate-based authentication without federation (Preview) - Azure Active Directory
description: Tutorial that shows how to configure cloud-native certificate-based authentication in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/19/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Tutorial: Configure cloud-native certificate-based authentication in Azure Active Directory (Preview)

Cloud-native certificate-based authentication (CBA) enables customers to configure their Azure AD tenants to allow or require users to authenticate with X.509 certificates verified against their Enterprise Public Key Infrastructure (PKI) for app and browser sign-in. This feature enables customers to adopt passwordless and authenticate with an x.509 certificate. 
 
During sign-in, users will see an option to authenticate with a certificate instead of entering a password. 
If multiple matching certificates are present on the device, the user can pick which one to use. The certificate is validated, the binding to the user account is checked, and if successful, they are signed in.

<!---Clarify plans that are covered --->
This topic covers how to configure and use certificate-based authentication for tenants in Office 365 Enterprise, US Government plans. You should already have a [public key infrastructure (PKI)](https://aka.ms/securingpki) configured.

Follow these instructions to configure and use cloud-native certificate-based authentication (CBA) for tenants in Azure Active Directory.

>[!NOTE]
>Cloud-native certificate-based authentication is currently in public preview. Some features might not be supported or have limited capabilities. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

## Prerequisites

Make sure that the following prerequisites are in place.

- Configure at least one certificate authority (CA) and any intermediate certificate authorities in Azure Active Directory.
- The user must have access to a user certificate (issued from a trusted Public Key Infrastructure configured on the tenant) intended for client authentication to authenticate against Azure AD. 

>[!IMPORTANT]
>Each CA should have a certificate revocation list (CRL) that can be referenced from internet-facing URLs. If the trusted CA does not have a CRL configured, Azure AD will not perform any CRL checking, revocation of user certificates will not work, and authentication will not be blocked.

## Steps to configure and test cloud-native CBA

There are some configuration steps to complete before enabling cloud-native CBA. First, an admin must configure the trusted CAs that issue user certificates. As seen in the following diagram, we use role-based access control to make sure only least-privileged administrators make changes. Configuring the certificate authority is done only by the [Privileged Authentication Administrator](../roles/permissions-reference.md#privileged-authentication-administrator) role.

Optionally, you can also configure authentication bindings to map certificates to single-factor or multifactor and configure username bindings to map certificate field to a user object attribute. Configuring user-related settings can be done by [Authentication Policy Administrators](../roles/permissions-reference.md#authentication-policy-administrator). Once all the configurations are complete, enable cloud-native CBA on the tenant. 

:::image type="content" border="false" source="./media/tutorial-enable-cloud-native-certificate-based-authentication/steps.png" alt-text="steps to enable cloud-native certificate-based authentication works in Azure AD.":::

## Step 1: Configure the certificate authorities

To configure your certificate authorities in Azure Active Directory, follow the steps to [Configure Certificate Authorities](active-directory-certificate-based-authentication-get-started.md#step-2-configure-the-certificate-authorities).

>[!NOTE]
>Only one Certificate Distribution Point (CDP) for a trusted CA is supported.
>The CDP can be only HTTP URLs. We do not support Online Certificate Status Protocol (OCSP) or Lightweight Directory Access Protocol (LDAP) URLs.

## Step 2: Configure authentication binding policy 

The authentication binding policy helps determine the strength of authentication to either a single factor or multi factor. Admin can leave it at default value of single factor or change to multi factor as well as configure custom policy rules at a more granular level either by issuer Subject or policy OID fields in the certificate.

You can configure the Authentication methods policy two different ways:

- [Azure portal](#azure-portal)
- [Graph API](#graph-api)

### Azure portal

To enable the certificate-based authentication and configure user bindings in the Azure portal, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as a Global Administrator.
1. Search for and select **Azure Active Directory**, then choose **Security** from the menu on the left-hand side.
1. Under **Manage**, select **Authentication methods** > **Certificate-based Authentication**.
1. Under **Basics**, click **On** to enable certificate-based authentication.
1. Certificate-based authentication can be enabled for a targeted set of users.
   1. Click **All Users** to enable for all users.
   1. Click on **Select Users** to enable for a set of users or group. Click **+ Add users**, select specific users and groups, and click **Select** to add them.

   After certificate-based authentication is enabled, all users will see the link to sign in with a certificate. Only users who are enabled for certificate-based authentication will be able to authenticate with this method.

1. Click **Configure** to set up authentication binding and username binding.
1. The protection level attribute has a default value of **Single-factor authentication**. Select **Multi-factor authentication** to change the default value to MFA. The protection level value will be used if no custom rules are added. If custom rules are added, then the protection level defined at the rule level will be honored instead.

1. To add custom rules, click on **Add rule**.
   1. To create a rule by Certificate issuer, make sure to select ‘Certificate issuer’.
   1. Select a **Certificate issuer identifier** from the list box.
   1. Protection level default value is **Single-factor authentication**. Select **Multi-factor authentication** to change the default value to MFA.
 
   There can be only one binding for each certificate field.

   Supported set of bindings:
   - SAN Principal Name -> User Principal Name 
   - SAN Principal Name -> onPremisesUserPrincipalName  
   - RFC822Name -> User Principal Name 
   - RFC822Name -> onPremisesUserPrincipalName 
 
   Default binding (use if no binding explicitly configured) 
   - SAN Principal Name -> User Principal Name 

 
1. To create a rule by Policy OID, make sure to select **Policy OID**.
   1. Enter a value for **Policy OID**.
   1. Protection level default value is **Single-factor authentication**. Select **Multi-factor authentication** to change the default value to MFA.
 
      Strong Authentication binding rules: 
      - Exact match is used for Strong authentication via policy OID.
        If you have a certificate A with policy OID **1.2.3.4.5** and a derived credential B based on that certificate has a policy OID **1.2.3.4.5.6** and the rule is defined as **Policy OID** with value **1.2.3.4.5** with Multi-factor authentication, only the certificate A will satisfy Multi-factor authentication and credential B will satisfy only Single-factor authentication. If the user used derived credential during sign-in and was configured to have MFA, the user will be asked for a second factor for successful authentication.
      - Policy OID rules will take precedence over Certificate issuer rules. If a certificate has both policy OID and Issuer, the policy OID is always checked first and if no policy rule is found then the issuer subject bindings are checked. Policy OID has a higher strongAuth binding priority than the issuer. 
      - If one CA binds to two-factor authentication, all user certificates that this CA issues qualify as two-factor authentication. The same logic applies for single-factor authentication. 
      - If one policy OID binds to two-factor authentication, all user certificates that include this policy OID as one of the OIDs (A user certificate could have multiple policy OIDs) qualify as multifactor authentication.  
      - If there is a conflict between multiple policy OIDs (such as when a certificate has two policy OIDs, one binds to single-factor authentication and the other binds to two-factor authentication) then treat the certificate as a single-factor authentication.
      - One certificate could only have one valid strong authentication binding (that is, a certificate could not bind to both single-factor and two-factor authentication).
 
1. Create the Username binding by selecting one of the X.509 certificate fields to bind with one of the user attributes. The username binding order represents the priority level of the binding. The first one has the highest priority and so on.

   The way multiple user bindings are processed is as follows. Use the highest priority (lowest number) binding.  
   - If the X.509 certificate field is on the presented certificate, attempt to look up the user by using the value in the specified field. 
     - If a unique user is found, authenticate the user. 
     - If a unique user is not found, authentication fails. 
   - If the X.509 certificate field is not on the presented certificate, move to the next priority binding. 
   
   If the specified X.509 certificate field is found on the certificate, but Azure AD doesn’t find a user object using that value, the authentication fails. Azure AD doesn’t try the next binding in the list.

   Only if the X.509 certificate field is not on the certificate does it attempt the next priority.

1. Click **Save** to save the changes. 

### Graph API

To enable the certificate-based authentication and configure username bindings using Graph API, complete the following steps:

1. Go to [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Click **Sign into Graph Explorer** and log in to your tenant.
1. Click **Settings** > **Select permission**.
1. Enter "auth" in the search bar and consent all related permissions.
1. GET all authentication methods

   GET - [https://graph.microsoft.com/beta/policies/authenticationmethodspolicy](https://graph.microsoft.com/beta/policies/authenticationmethodspolicy) 

1. GET X509Certificate authentication method

   GET - [https://graph.microsoft.com/beta/policies/authenticationmethodspolicy/authenticationMetHodConfigurations/X509Certificate](https://graph.microsoft.com/beta/policies/authenticationmethodspolicy/authenticationMetHodConfigurations/X509Certificate) 

1. PATCH X509Certificate strong auth with sample authentication rules with certificate user bindings and certificate rules.
    
    Request body:

    ```json
    {"@odata.context": https://graph.microsoft-ppe.com/testppebetatestx509certificatestrongauth/$metadata#authenticationMethodConfigurations/$entity,	"@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration",	"id": "X509Certificate",	"state": "disabled",	"certificateUserBindings": [{			"x509CertificateField": "PrincipalName",			"userProperty": "onPremisesUserPrincipalName",			"priority": 1		},		{			"x509CertificateField": "RFC822Name",			"userProperty": "userPrincipalName",			"priority": 2		}	],	"authenticationModeConfiguration": {		"x509CertificateAuthenticationDefaultMode": "x509CertificateSingleFactor",		"rules": [{				"x509CertificateRuleType": "issuerSubject",				"identifier": "CN=Microsoft Corp Enterprise CA",				"x509CertificateAuthenticationMode": "x509CertificateMultiFactor"			},			{				"x509CertificateRuleType": "policyOID",				"identifier": "1.2.3.4",				"x509CertificateAuthenticationMode": "x509CertificateMultiFactor"			}		]	},	includeTargets@odata.context: https://graph.microsoft-ppe.com/testppebetatestx509certificatestrongauth/$metadata#policies/authenticationMethodsPolicy/authenticationMethodConfigurations('X509Certificate')/microsoft.graph.x509CertificateAuthenticationMethodConfiguration/includeTargets,	"includeTargets": [{		"targetType": "group",		"id": "all_users",		"isRegistrationRequired": false	}]} 
    ```

   You will get a 204 response and sending a GET command should show the set policies.

1. Test sign in works according to the policies.
 
## Step 3: Test your configuration

### Testing your certificate

As a first configuration test, you should try to sign in to Outlook Web Access or SharePoint Online using your on-device browser.
If your sign-in is successful, then you know that:

- The user certificate has been provisioned to your test device
- Azure Active Directory is configured correctly with trusted CA’s
- User Binding is configured correctly, and user can be found and authenticated.
 
### Testing strong authentication

1. Create a policy OID rule, with protection level as **Multi-factor authentication** and value set to one of the policy OID’s in your certificate.
1. Configure User to have a Multi-factor authentication.
1. Navigate to an application that authenticates with the test tenant. Enter your UPN.
1. Click **Next**. Select **Signin with a certificate**.
1. A certificate dialog prompts for the user to select a certificate. Certificates are expected to be on the device.
1. Click **OK** and Policy in the certificate will satisfy multi-factor authentication and user will be authenticated into the application.
1. If you also have other Authentication Methods enabled in your tenant, users may see the following UI experience instead of the link to ‘Sign in with a Certificate’ and authenticate.

### Sign-in logs
 
Sign-in logs provide information about sign-in and how your resources are used by your users. For more information about sign-in logs, see [Sign-in logs in Azure Active Directory](../reports-monitoring/concept-all-sign-ins.md).
 
There are several entries logged into the sign-in logs for an authentication request.

1. The first entry is logged to note the Certificate request. Authentication details tab will show more detail.
1. The second entry will have status of interrupted which is an expected part of the login flow, where a user is asked if they want to remain signed into this browser to make further logins easier. 
   The **Additional details** tab provides more details.
1. If the sign-in is successful, you will see messages about the login success.
1. If the sign-in failed, there will be a message with the failure reason.

### Audit logs

Any user management changes will be logged in the audit logs.

## Configure manual revocation

To revoke a client certificate, Azure Active Directory fetches the certificate revocation list (CRL) from the URLs uploaded as part of certificate authority information and caches it. The last publish timestamp (Effective Date property) in the CRL is used to ensure the CRL is still valid. The CRL is periodically referenced to revoke access to certificates that are a part of the list.

If a more instant revocation is required (for example, if a user loses a device), the authorization token of the user can be invalidated. To invalidate the authorization token, set the StsRefreshTokenValidFrom field for this user using Windows PowerShell. You must update the StsRefreshTokenValidFrom field for each user you want to revoke access for. 

To ensure that the revocation persists, you must set the Effective Date of the CRL to a date after the value set by StsRefreshTokenValidFrom and ensure the certificate in question is in the CRL.

The following steps outline the process for updating and invalidating the authorization token by setting the StsRefreshTokenValidFrom field.

1. Connect with admin credentials to the MSOL service:

   ```powershell
   $msolcred = get-credential         connect-msolservice -credential $msolcred
   ``` 
1. Retrieve the current StsRefreshTokensValidFrom value for a user:

   ```powershell
   $user = Get-MsolUser -UserPrincipalName test@yourdomain.com`        $user.StsRefreshTokensValidFrom
   ```
         
1. Configure a new StsRefreshTokensValidFrom value for the user equal to the current timestamp:

   ```powershell
   Set-MsolUser -UserPrincipalName test@yourdomain.com -StsRefreshTokensValidFrom ("03/05/2016")
   ``` 

The date you set must be in the future. If the date is not in the future, the StsRefreshTokensValidFrom property is not set. If the date is in the future, StsRefreshTokensValidFrom is set to the current time (not the date indicated by Set-MsolUser command).

## Confirm certificate revocation checks

Run the [Get-AzureADTrustedCertificateAuthority](/powershell/module/azuread/get-azureadtrustedcertificateauthority.md) cmdlet and make sure the CA has a valid http url set in the certificateDistributionPoint attribute.

## Turn certificate revocation checking on or off for a particular CA

We highly recommend not to disable CRL checking as you will not have the revocation ability for the certificates. 

However, to disable CRL checking if there are issues with CRL for a particular CA you can modify a trusted certificate authority, use the [Set-AzureADTrustedCertificateAuthority](/powershell/module/azuread/set-azureadtrustedcertificateauthority.md) cmdlet:

```powershell
$c=Get-AzureADTrustedCertificateAuthority    	$c[0]. crlDistributionPoint =””   	 Set-AzureADTrustedCertificateAuthority -CertificateAuthorityInformation $c[0] 
```

## Next steps 

- [Overview of cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication.md)
- [Technical deep dive for cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication-limitations.md)
- [FAQ](cloud-native-certificate-based-authentication-faq.yml)
- [Troubleshoot cloud-native certificate-based authentication](troubleshoot-cloud-native-certificate-based-authentication.md)

