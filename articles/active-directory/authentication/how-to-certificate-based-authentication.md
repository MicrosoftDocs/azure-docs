---
title: How to configure Microsoft Entra certificate-based authentication
description: Topic that shows how to configure Microsoft Entra certificate-based authentication in Microsoft Entra ID

ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/13/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref, has-azure-ad-ps-ref
---
# How to configure Microsoft Entra certificate-based authentication

Microsoft Entra certificate-based authentication (CBA) enables organizations to configure their Microsoft Entra tenants to allow or require users to authenticate with X.509 certificates created by their Enterprise Public Key Infrastructure (PKI) for app and browser sign-in. This feature enables organizations to adopt phishing-resistant modern passwordless authentication by using an x.509 certificate.
 
During sign-in, users will see also an option to authenticate with a certificate instead of entering a password. 
If multiple matching certificates are present on the device, the user can pick which one to use. The certificate is validated against the user account and if successful, they sign in.

<!---Clarify plans that are covered --->
Follow these instructions to configure and use Microsoft Entra CBA for tenants in Office 365 Enterprise and US Government plans. You should already have a [public key infrastructure (PKI)](https://aka.ms/securingpki) configured.

## Prerequisites

Make sure that the following prerequisites are in place:

- Configure at least one certification authority (CA) and any intermediate CAs in Microsoft Entra ID.
- The user must have access to a user certificate (issued from a trusted Public Key Infrastructure configured on the tenant) intended for client authentication to authenticate against Microsoft Entra ID. 
- Each CA should have a certificate revocation list (CRL) that can be referenced from internet-facing URLs. If the trusted CA doesn't have a CRL configured, Microsoft Entra ID won't perform any CRL checking, revocation of user certificates won't work, and authentication won't be blocked.

>[!IMPORTANT]
>Make sure the PKI is secure and can't be easily compromised. In the event of a compromise, the attacker can create and sign client certificates and compromise any user in the tenant, both users whom are synchronized from on-premises and cloud-only users. However, a strong key protection strategy, along with other physical and logical controls, such as HSM activation cards or tokens for the secure storage of artifacts, can provide defense-in-depth to prevent external attackers or insider threats from compromising the integrity of the PKI. For more information, see [Securing PKI](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn786443(v=ws.11)).

>[!IMPORTANT]
>Please visit the [Microsoft recommendations](/security/sdl/cryptographic-recommendations#security-protocol-algorithm-and-key-length-recommendations) for best practices for Microsoft Cryptographic involving algorithm choice, key length and data protection. Please make sure to use one of the recommended algorithms, key length and NIST approved curves.


>[!NOTE]
>When evaluating a PKI, it is important to review certificate issuance policies and enforcement. As mentioned, adding certificate authorities (CAs) to Microsoft Entra configuration allows certificates issued by those CAs to authenticate any user in Microsoft Entra ID. For this reason, it is important to consider how and when the CAs are allowed to issue certificates, and how they implement reusable identifiers. Where administrators need to ensure only a specific certificate is able to be used to authenticate a user, admins should exclusively use high-affinity bindings to achieve a higher level of assurance that only a specific certificate is able to authenticate the user. For more information, see [high-affinity bindings](concept-certificate-based-authentication-technical-deep-dive.md#understanding-the-username-binding-policy).

<a name='steps-to-configure-and-test-azure-ad-cba'></a>

## Steps to configure and test Microsoft Entra CBA

Some configuration steps to be done before you enable Microsoft Entra CBA. First, an admin must configure the trusted CAs that issue user certificates. As seen in the following diagram, we use role-based access control to make sure only least-privileged administrators are needed to make changes. Only the [Global Administrator](../roles/permissions-reference.md#global-administrator) role can configure the CA.

Optionally, you can also configure authentication bindings to map certificates to single-factor or multifactor authentication, and configure username bindings to map the certificate field to an attribute of the user object. [Authentication Policy Administrators](../roles/permissions-reference.md#authentication-policy-administrator) can configure user-related settings. Once all the configurations are complete, enable Microsoft Entra CBA on the tenant. 

:::image type="content" border="false" source="./media/how-to-certificate-based-authentication/steps.png" alt-text="Diagram of the steps required to enable Microsoft Entra certificate-based authentication.":::

## Step 1: Configure the certification authorities

You can configure CAs by using the Microsoft Entra admin center or PowerShell.

### Configure certification authorities using the Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To enable the certificate-based authentication and configure user bindings in the Microsoft Entra admin center, complete the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator).
1. Browse to **Protection** > **Authentication methods** > **Certifacte-based authentication**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/certificate-authorities.png" alt-text="Screenshot of certification authorities.":::

1. To upload a CA, click **Upload**: 
   1. Select the CA file.
   1. Select **Yes** if the CA is a root certificate, otherwise select **No**.
   1. Set the http internet-facing URL for the CA base CRL that contains all revoked certificates. If the URL isn't set, authentication with revoked certificates won't fail.
   1. Set **Delta CRL URL** - the http internet-facing URL for the CRL that contains all revoked certificates since the last base CRL was published.
   1. Click **Add**.

      :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/upload-certificate-authority.png" alt-text="Screenshot of how to upload certification authority file.":::

1. To delete a CA certificate, select the certificate and click **Delete**.
1. Click **Columns** to add or delete columns.

>[!NOTE]
>Upload of new CAs will fail when any of the existing CAs are expired. Tenant Admin should delete the expired CAs and then upload the new CA.

### Configure certification authorities(CA) using PowerShell

Only one CRL Distribution Point (CDP) for a trusted CA is supported. The CDP can only be HTTP URLs. Online Certificate Status Protocol (OCSP) or Lightweight Directory Access Protocol (LDAP) URLs aren't supported.

[!INCLUDE [Configure certification authorities](../../../includes/active-directory-authentication-configure-certificate-authorities.md)]

### Connect

[!INCLUDE [Connect-AzureAD](../../../includes/active-directory-authentication-connect-azuread.md)]

### Retrieve

[!INCLUDE [Get-AzureAD](../../../includes/active-directory-authentication-get-trusted-azuread.md)]
### Add

>[!NOTE]
>Upload of new CAs will fail when any of the existing CAs are expired. Tenant Admin should delete the expired CAs and then upload the new CA.

[!INCLUDE [New-AzureAD](../../../includes/active-directory-authentication-new-trusted-azuread.md)]

**AuthorityType**
- Use 0 to indicate a Root certification authority
- Use 1 to indicate an Intermediate or Issuing certification authority

**crlDistributionPoint**

You can download the CRL and compare the CA certificate and the CRL information to validate the crlDistributionPoint value in the preceding PowerShell example is valid for the CA you want to add.

The following table and graphic show how to map information from the CA certificate to the attributes of the downloaded CRL.

| CA Certificate Info |= |Downloaded CRL Info|
|----|:-:|----|
|Subject |=|Issuer |
|Subject Key Identifier |=|Authority Key Identifier (KeyID) |

:::image type="content" border="false" source="./media/how-to-certificate-based-authentication/certificate-crl-compare.png" alt-text="Compare CA Certificate with CRL Information.":::

>[!TIP]
>The value for crlDistributionPoint in the preceding example is the http location for the CA’s Certificate Revocation List (CRL). This can be found in a few places.
>
>- In the CRL Distribution Point (CDP) attribute of a certificate issued from the CA.
>
>If Issuing CA is Windows Server:
>
>- On the [Properties](/windows-server/networking/core-network-guide/cncg/server-certs/configure-the-cdp-and-aia-extensions-on-ca1#to-configure-the-cdp-and-aia-extensions-on-ca1)
 of the CA in the certification authority Microsoft Management Console (MMC).
>- On the CA by running `certutil -cainfo cdp`. For more information, see [certutil](/windows-server/administration/windows-commands/certutil#-cainfo).

For more information, see [Understanding the certificate revocation process](./concept-certificate-based-authentication-technical-deep-dive.md#understanding-the-certificate-revocation-process).

### Remove

[!INCLUDE [Remove-AzureAD](../../../includes/active-directory-authentication-remove-trusted-azuread.md)]

### Modify

[!INCLUDE [Set-AzureAD](../../../includes/active-directory-authentication-set-trusted-azuread.md)]

## Step 2: Enable CBA on the tenant

>[!IMPORTANT]
>A user is considered capable for **MFA** when the user is in scope for **Certificate-based authentication** in the Authentication methods policy. This policy requirement means a user can't use proof up as part of their authentication to register other available methods. If the users do not have access to certificates they will be locked out and not be able to register other methods for MFA. So the admin needs to enable users who have a valid certificate into the CBA scope. Do not use all users for CBA target and use groups of users who have valid certificates available. For more information, see [Microsoft Entra multifactor authentication](concept-mfa-howitworks.md).

To enable the certificate-based authentication in the Microsoft Entra admin center, complete the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator).
1. Browse to **Protection** > **Authentication methods** > **Certificate-based Authentication**.
1. Under **Enable and Target**, click **Enable**.
1. Click **All users**, or click **Add groups** to select specific groups.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/enable.png" alt-text="Screenshot of how to enable CBA.":::
 
Once certificate-based authentication is enabled on the tenant, all users in the tenant will see the option to sign in with a certificate. Only users who are enabled for certificate-based authentication will be able to authenticate using the X.509 certificate. 

>[!NOTE]
>The network administrator should allow access to certauth endpoint for the customer’s cloud environment in addition to login.microsoftonline.com. Disable TLS inspection on the certauth endpoint to make sure the client certificate request succeeds as part of the TLS handshake.


## Step 3: Configure authentication binding policy 

The authentication binding policy helps determine the strength of authentication to either a single factor or multifactor. An admin can change the default value from single-factor to multifactor and configure custom policy rules by mapping to issuer Subject or policy OID fields in the certificate.

To enable Microsoft Entra CBA and configure user bindings in the Microsoft Entra admin center, complete the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator).
1. Browse to **Protection** > **Authentication methods** > **Policies**.
1. Under **Manage**, select **Authentication methods** > **Certificate-based Authentication**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/policy.png" alt-text="Screenshot of Authentication policy.":::

1. Click **Configure** to set up authentication binding and username binding.
1. The protection level attribute has a default value of **Single-factor authentication**. Select **Multifactor authentication** to change the default value to MFA.

   >[!NOTE] 
   >The default protection level value will be in effect if no custom rules are added. If custom rules are added, the protection level defined at the rule level will be honored instead.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/change-default.png" alt-text="Screenshot of how to change the default policy to MFA.":::

1. You can also set up custom authentication binding rules to help determine the protection level for client certificates. It can be configured using either the issuer Subject or Policy OID fields in the certificate.

   Authentication binding rules will map the certificate attributes (issuer or Policy OID) to a value, and select default protection level for that rule. Multiple rules can be created.

   To add custom rules, click on **Add rule**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/add-rule.png" alt-text="Screenshot of how to add a rule.":::

   To create a rule by certificate issuer, click **Certificate issuer**.

   1. Select a **Certificate issuer identifier** from the list box.
   1. Click **Multifactor authentication**.

      :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/multifactor-issuer.png" alt-text="Screenshot of multifactor authentication policy.":::

   To create a rule by Policy OID, click **Policy OID**.

   1. Enter a value for **Policy OID**.
   1. Click **Multifactor authentication**.

      :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/multifactor-policy-oid.png" alt-text="Screenshot of mapping to Policy OID.":::

1. Click **Ok** to save any custom rule.

>[!IMPORTANT]
>PolicyOID should be in object identifier format as per https://www.rfc-editor.org/rfc/rfc5280#section-4.2.1.4. For ex: If the certificate policies says "All Issuance Policies" you should enter the OID as 2.5.29.32.0 in the add rules editor. Entering the string "All Issuance Policies" in rules editor is invalid and will not take effect.

## Step 4: Configure username binding policy

The username binding policy helps validate the certificate of the user. By default, we map Principal Name in the certificate to UserPrincipalName in the user object to determine the user. An admin can override the default and create a custom mapping. 

To determine how to configure username binding, see [How username binding works](concept-certificate-based-authentication-technical-deep-dive.md#understanding-the-username-binding-policy).

>[!IMPORTANT]
>If a username binding policy uses synchronized attributes, such as onPremisesUserPrincipalName attribute of the user object, be aware that any user with Active Directory Administrators privileges can make changes that impact the onPremisesUserPrincipalName value in Microsoft Entra ID for any synchronized accounts, including users with delegated administrative privilege over synchronized user accounts or administrative rights over the Microsoft Entra Connect Servers.

1. Create the username binding by selecting one of the X.509 certificate fields to bind with one of the user attributes. The username binding order represents the priority level of the binding. The first one has the highest priority, and so on.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/username-binding-policy.png" alt-text="Screenshot of a username binding policy.":::

   If the specified X.509 certificate field is found on the certificate, but Microsoft Entra doesn’t find a user object using that value, the authentication fails. Microsoft Entra ID will fall back and try the next binding in the list.


1. Click **Save** to save the changes. 

The final configuration will look like this image:

:::image type="content" border="true" source="./media/how-to-certificate-based-authentication/final.png" alt-text="Screenshot of the final configuration.":::

## Step 5: Test your configuration

This section covers how to test your certificate and custom authentication binding rules.

### Testing your certificate

As a first configuration test, you should try to sign in to the [MyApps portal](https://myapps.microsoft.com/) using your on-device browser.

1. Enter your User Principal Name (UPN).

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/name.png" alt-text="Screenshot of the User Principal Name.":::

1. Click **Next**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/certificate.png" alt-text="Screenshot of sign-in with certificate.":::

   If you enabled other authentication methods like Phone sign-in or FIDO2, users may see a different sign-in screen.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/alternative.png" alt-text="Screenshot of the alternative sign-in.":::

1. Select **Sign in with a certificate**.

1. Pick the correct user certificate in the client certificate picker UI and click **OK**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/picker.png" alt-text="Screenshot of the certificate picker UI.":::

1. Users should be signed into [MyApps portal](https://myapps.microsoft.com/). 

If your sign-in is successful, then you know that:

- The user certificate has been provisioned into your test device.
- Microsoft Entra ID is configured correctly with trusted CAs.
- Username binding is configured correctly, and the user is found and authenticated.

### Testing custom authentication binding rules

Let's walk through a scenario where we validate strong authentication. We'll create two authentication policy rules, one by using issuer subject to satisfy single-factor authentication, and another by using policy OID to satisfy multifactor authentication. 

1. Create an issuer Subject rule with protection level as single-factor authentication and value set to your CAs Subject value. For example: 

   `CN = WoodgroveCA`

1. Create a policy OID rule, with protection level as multifactor authentication and value set to one of the policy OID’s in your certificate. For example, 1.2.3.4.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/policy-oid-rule.png" alt-text="Screenshot of the Policy OID rule.":::

1. Create a Conditional Access policy for the user to require multifactor authentication by following steps at [Conditional Access - Require MFA](../conditional-access/howto-conditional-access-policy-all-users-mfa.md#create-a-conditional-access-policy).
1. Navigate to [MyApps portal](https://myapps.microsoft.com/). Enter your UPN and click **Next**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/name.png" alt-text="Screenshot of the User Principal Name.":::

1. Select **Sign in with a certificate**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/certificate.png" alt-text="Screenshot of sign-in with certificate.":::

   If you enabled other authentication methods like Phone sign-in or FIDO2, users may see a different sign-in screen.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/alternative.png" alt-text="Screenshot of the alternative sign-in.":::

1. Select the client certificate and click **Certificate Information**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/client-picker.png" alt-text="Screenshot of the client picker.":::

1. The certificate will be shown, and you can verify the issuer and policy OID values. 
   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/issuer.png" alt-text="Screenshot of the issuer.":::

1. To see Policy OID values, click **Details**.

   :::image type="content" border="true" source="./media/how-to-certificate-based-authentication/authentication-details.png" alt-text="Screenshot of the authentication details.":::

1. Select the client certificate and click **OK**.

1. The policy OID in the certificate matches the configured value of **1.2.3.4** and it will satisfy multifactor authentication. Similarly, the issuer in the certificate matches the configured value of **CN=WoodgroveCA** and it will satisfy single-factor authentication.
1. Because policy OID rule takes precedence over issuer rule, the certificate will satisfy multifactor authentication.
1. The Conditional Access policy for the user requires MFA and the certificate satisfies multifactor, so the user will be authenticated into the application.

<a name='enable-azure-ad-cba-using-microsoft-graph-api'></a>

## Enable Microsoft Entra CBA using Microsoft Graph API

To enable CBA and configure username bindings using Graph API, complete the following steps.

>[!NOTE]
>The following steps use Graph Explorer which is not available in the US Government cloud. US Government cloud tenants can use Postman to test the Microsoft Graph queries.

1. Go to [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. Click **Sign into Graph Explorer** and sign in to your tenant.
1. Follow the steps to [consent to the _Policy.ReadWrite.AuthenticationMethod_ delegated permission](/graph/graph-explorer/graph-explorer-features#consent-to-permissions).
1. GET all authentication methods:

   ```http
   GET  https://graph.microsoft.com/v1.0/policies/authenticationmethodspolicy
   ```

1. GET the configuration for the x509Certificate authentication method:

   ```http
   GET https://graph.microsoft.com/v1.0/policies/authenticationmethodspolicy/authenticationMethodConfigurations/X509Certificate
   ```

1. By default, the x509Certificate authentication method is disabled. To allow users to sign in with a certificate, you must enable the authentication method and configure the authentication and username binding policies through an update operation. To update policy, run a PATCH request.
    
    #### Request body:

    ```http
    PATCH https: //graph.microsoft.com/v1.0/policies/authenticationMethodsPolicy/authenticationMethodConfigurations/x509Certificate
    Content-Type: application/json
    
    {
        "@odata.type": "#microsoft.graph.x509CertificateAuthenticationMethodConfiguration",
        "id": "X509Certificate",
        "state": "enabled",
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
            }, 
            {
                "x509CertificateField": "PrincipalName",
                "userProperty": "certificateUserIds",
                "priority": 3
            }
        ],
        "authenticationModeConfiguration": {
            "x509CertificateAuthenticationDefaultMode": "x509CertificateSingleFactor",
            "rules": [
                {
                    "x509CertificateRuleType": "issuerSubject",
                    "identifier": "CN=WoodgroveCA ",
                    "x509CertificateAuthenticationMode": "x509CertificateMultiFactor"
                },
                {
                    "x509CertificateRuleType": "policyOID",
                    "identifier": "1.2.3.4",
                    "x509CertificateAuthenticationMode": "x509CertificateMultiFactor"
                }
            ]
        },
        "includeTargets": [
            {
                "targetType": "group",
                "id": "all_users",
                "isRegistrationRequired": false
            }
        ]
    }
    ```

1. You'll get a `204 No content` response code. Re-run the GET request to make sure the policies are updated correctly.
1. Test the configuration by signing in with a certificate that satisfies the policy.
 
## Next steps 

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with Microsoft Entra CBA](concept-certificate-based-authentication-limitations.md)
- [Windows SmartCard logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [Microsoft Entra CBA on mobile devices (Android and iOS)](./concept-certificate-based-authentication-mobile-ios.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
