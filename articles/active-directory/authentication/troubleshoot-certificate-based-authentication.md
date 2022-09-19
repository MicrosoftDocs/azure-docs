---
title: Troubleshoot Azure AD certificate-based authentication without federation (Preview) - Azure Active Directory
description: Learn how to troubleshoot Azure AD certificate-based authentication in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/15/2022

ms.author: justinha
author: vimrang
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Troubleshoot Azure AD certificate-based authentication (Preview)

This topic covers how to troubleshoot Azure AD certificate-based authentication (CBA).

>[!NOTE]
>Azure AD certificate-based authentication is currently in public preview. Some features might not be supported or have limited capabilities. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

## Why don't I see an option to sign in using certificates against Azure Active Directory after I enter my username?

An administrator needs to enable CBA for the tenant to make the sign-in with certificate option available for users. For more information, see [Step 2: Configure authentication binding policy](how-to-certificate-based-authentication.md#step-2-configure-authentication-binding-policy).

## User-facing sign-in error messages

If the user is unable to sign in using Certificate-based Authentication, they may see one of the following user-facing errors on the Azure AD sign-in screen.

### ADSTS1001000 - Unable to acquire certificate policy from tenant

This is a server-side error that occurs when the server could not fetch an authentication policy for the user using the SAN Principal Name/SAN RFC822Name field of the user certificate. Make sure that the authentication policy rules are correct, a valid certificate is used, and retry. 

### AADSTS1001003 – User sign-in fails with "Unable To Acquire Value Specified In Binding From Certificate"

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/binding.png" alt-text="Screenshot of binding error." :::

This error is returned if the user selects the wrong user certificate from the list while signing in.

Make sure the certificate is valid and works for the user binding and authentication policy configuration.

### AADSTS50034 - User sign-in fails with "Your account or password is incorrect. If you don't remember your password, reset it now."

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/reset.png" alt-text="Screenshot of password reset error." :::

Make sure the user is trying to sign in with the correct username. This error happens when a unique user can't be found using the [username binding](how-to-certificate-based-authentication.md#step-3-configure-username-binding-policy) on the certificate fields.

- Make sure user bindings are set correctly and the certificate field is mapped to the correct user Attribute.
- Make sure the user Attribute contains the correct value that matches the certificate field value.

For more information, see [Step 3: Configure username binding policy](how-to-certificate-based-authentication.md#step-3-configure-username-binding-policy).

If the user is a federated user moving to Azure AD and if the user binding configuration is Principal Name > onPremisesUserPrincipalName:

- Make sure the onPremisesUserPrincipalName is being synchronized, and ALT IDs are enabled in Azure AD Connect. 
- Make sure the value of onPremisesUserPrincipalName is correct and synchronized in Azure AD Connect.

>[!NOTE]
>There is a known issue that this scenario is not logged into the sign-in logs.

### AADSTS130501 - User sign-in fails with "Sign in was blocked due to User Credential Policy"

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/policy-failed.png" alt-text="Screenshot of policy error." :::

There is also a known issue when a user who is not in scope for CBA ties to sign in with a certificate to an [Office app](https://office.com) or any portal app, and the sign-in fails with an error:

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/alt-failed.png" alt-text="Screenshot of the alternative error message for Azure Active Directory certificate-based authentication in Azure AD.":::

In both cases, the error can be resolved by making sure the user is in scope for Azure AD CBA. For more information, see [Step 4: Enable CBA on the tenant](how-to-certificate-based-authentication.md#step-4-enable-cba-on-the-tenant).

### AADSTS90100: flowtoken parameter is empty or not valid

After sign-in fails and I retry sign-in with the correct certificate, I get an error:

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/user-error.png" alt-text="Screenshot of the error message for user who signs in with Azure Active Directory certificate-based authentication.":::

This is a client behavior where the browser keeps using the original certificate selected. When the sign-in fails, close the existing browser session and retry sign-in from a new browser session.

## User sign-in failed but not much diagnostic information

There is a known issue when the authentication sometimes fails, the failure screen may not have an error message or troubleshooting information.

For example, if a user certificate is revoked and is part of a Certificate Revocation List, then authentication fails correctly. However, instead of the error message, you might see the following screen:

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/failed.png" alt-text="Screenshot of the error message for Azure Active Directory certificate-based authentication.":::

To get more diagnostic information, look in **Sign-in logs**. If a user authentication fails due to CRL validation for example, sign-in logs show the error information correctly.

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/details.png" alt-text="Screenshot of Authentication Details." lightbox="./media/troubleshoot-certificate-based-authentication/details.png":::

## Why didn't my changes to authentication policy changes take effect?

The authentication policy is cached. After a policy update, it may take up to an hour for the changes to be effective. Try after an hour to make sure the policy caching is not the cause.

## I get an error ‘Cannot read properties of undefine’ while trying to add a custom authentication rule

This is a known issue, and we are working on graceful error handling. This error happens when there is no Certification Authority (CA) on the tenant. To resolve the error, see [Configure the certificate authorities](how-to-certificate-based-authentication.md#step-1-configure-the-certification-authorities).

:::image type="content" border="true" source="./media/troubleshoot-certificate-based-authentication/no-ca.png" alt-text="Screenshot of the error message when no Certification Authority is set for Azure Active Directory.":::


## I see a valid Certificate Revocation List (CRL) endpoint set, but why don't I see any CRL revocation?

- Make sure the CRL distribution point is set to a valid HTTP URL.
- Make sure the CRL distribution point is accessible via an internet-facing URL.
- Make sure the CRL sizes are within the limit for public preview. For more information about the maximum CRL size, see [What is the maximum size for downloading a CRL?](certificate-based-authentication-faq.yml#is-there-a-limit-for-crl-size-).

## Next steps 

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with Azure AD CBA](concept-certificate-based-authentication-limitations.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Windows SmartCard logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Azure AD CBA on mobile devices (Android and iOS)](concept-certificate-based-authentication-mobile.md)
- [FAQ](certificate-based-authentication-faq.yml)


