---
title: Overview of Azure Active Directory authentication strength
description: Learn how admins can use Azure AD Conditional Access to distinguish which authentication methods can be used based on relevant security factors.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/02/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla, inbarckms

ms.collection: M365-identity-device-management
---
# Conditional Access authentication strength 

Authentication strength is a Conditional Access control that allows administrators to require specific combinations of authentication methods to access a resource. For example, you can require phishing-resistant authentication methods to access a sensitive resource, while allowing less secure multifactor authentication (MFA) combinations, such as password + SMS, to access nonsensitive applications. 

Authentication strength is based on the Authentication Methods policy <!--- Link to the new auth method policy doc-->,where administrators can scope authentication methods for specific users and groups to be used across Azure Active Directory (Azure AD) federated applications. Authentication strength allows administrators to further scope down the usage of these methods based upon specific scenarios such as sensitive resource access, user risk, location, and more. 

When administrators create a Conditional Access policy with the **Require authentication strength** control, they can choose from three built-in authentication strength policies: **Multifactor authentication strength**, **Passwordless MFA strength**, and **Phishing-resistant MFA strength**. They can also create a custom authentication strength policy based on the authentication method combinations they want to allow. 

:::image type="content" source="media/concept-authentication-strengths/conditional-access-policy-authentication-strength-grant-control.png" alt-text="Screenshot of a Conditional Access policy with an authentication strength policy configured in grant controls.":::

## Scenarios for authentication strength

Authentication strength can help customers address scenarios such as: 

- Require specific authentication methods to access a sensitive resource.
- Require a specific authentication method when a user takes a sensitive action within an application (in combination with Conditional Access authentication context).
- Require users to use a specific authentication method when they access sensitive apps outside of the corporate network.
- Require more secure authentication methods for users at high risk. 
- Require specific authentication methods from guest users accessing a resource tenant (in combination with Cross tenant settings) <!-- Namrata - Add / review external users scenrio here -->

## Authentication strength policy 

An authentication strength policy may contain a combination of authentication methods. Users can satisfy the policy requirements by authenticating with any of the allowed combinations. For example, the built-in **Phishing-resistant MFA** policy allows the following combinations:

- Windows Hello for Business

  OR

- FIDO2 security key

  OR

- Azure AD Certificate-Based Authentication (multifactor)

:::image type="content" source="media/concept-authentication-strengths/authentication-strength-definitions.png" alt-text="Screenshot showing the phish resistant authentication strength policy definition.":::

### Built-in authentication strengths

Built-in authentication strengths are combinations of authentication methods that are predefined by Microsoft. Built-in authentication strengths are always available and can't be modified.

The following table lists the combinations of authentication methods for each built-in authentication strength policy. Depending on which methods are available in the authentication methods policy and registered for users, they can use any one of the combinations to sign-in.

-	**MFA strength policy** - the same set of combinations that could be used to satisfy the **Require multifactor authentication setting**.
-	**Passwordless MFA strength policy** - includes authentication methods that satisfy MFA but don't require a password.
-	**Phishing-resistant MFA strength policy** - includes methods that require an interaction between the authentication method and the sign-in surface.

|Authentication method combination |MFA strength | Passwordless MFA strength| Phishing-resistant MFA strength|
|----------------------------------|-------------|-------------------------------------|-------------------------------------------|
|FIDO2 Security Key| &#x2705; | &#x2705; | &#x2705; |
|Certificate Based Authentication (Multi-Factor) | &#x2705; | &#x2705; | &#x2705; |
|Password + Something you have*| &#x2705; | | |
|Federated Single-Factor + Something you have*| &#x2705; | | |
|Certificate Based Authentication (Single-Factor)| | | |
|SMS sign-in | | | |
|Password | | | |
|Federated Single-Factor| | | |

<!-- We will move these methods  back to the table as they become supported - expected very soon
|Windows Hello for Business| &#x2705; | &#x2705; | &#x2705; |
|Microsoft Authenticator (Phone Sign-in)| &#x2705; | &#x2705; | | 
|Temporary Access Pass (One-time use AND Multi-use)| &#x2705; | | | 
|Email One-time pass (Guest)| | | |
|Federated Multi-Factor| &#x2705; | | |-->

*Something you have refers to one of the following methods: SMS, Voice, Push notification, Software OATH token. 

The following API call can be used to list definitions of all the built-in authentication strengths:

```http
GET https://graph.microsoft.com/beta/identity/conditionalAccess/authenticationStrengths/policies?$filter=policyType eq 'builtIn'`
```

As we add support for additional authentication methods and combinations, the built-in authentication strengths policies will get updated. 

### Custom authentication strengths

In addition to the three built-in authentication strengths, administrators can create their own custom authentication strength policies to exactly suit their requirements. A custom authentication strength policy can contain any of the supported combinations in the preceding table. 
Deleting a custom authentication strength is not allowed if the authentication strength policy is referenced by any Conditional Access policy.

1. In the Azure portal, browse to **Azure Active Directory** > **Security** > **Authentication methods** > **Authentication strengths (Preview)**.
1. Select **New authentication strength**.
1. Provide a descriptive **Name** for your new authentication strength.
1. Optionally provide a **Description**.
1. Select any of the available methods you want to be available.
1. Choose **Next** and review the policy configuration.

:::image type="content" source="media/concept-authentication-strengths/authentication-strength-custom.png" alt-text="Screenshot showing the creation of a custom authentication strength policy.":::

#### FIDO2 Key advanced options
Custom authentication strengths allow customers to further restrict the usage of some FIDO2 security keys based on their Authenticator Attestation GUIDs (AAGUIDs). The capability allows administrators to require FIDO2 key from specific manufacture in order to access the resource.
<!-- Steps to configure FIDO2 AA GUID -- Justin can you help with this? -->

## Using Authentication strengths policies in Conditional Access
Once you reviewed the built-in authentication strength policies and decided which one you would like to use, or you have created your own custom strengths, you can start using them in Conditional Access policies. Referencing Authentication strength policy in a Conditional Access policy will restrict the allowed authentication methods to be used when the policy applies on the sign-in.
<!-- ### Place holder:How to create conditional access policy that uses authentication strength
-	Add a note that you can use either require mfa or require auth strengths
- (JF) Possibly add a reference doc that lists all the definitions of the things you can configure?
-->


## User experience

<!---Should we add a flowchart or another conceptual diagram to illustrate this?--->

To evaluate if the user should gain access to the resource, the following considerations are taken into account: 

- Which methods are available in the authentication strength policy? 
- Which methods are allowed for user sign-in in the authentication methods policy?
- Is the user registered for the required methods?

When a user accesses a resource protected by an authentication strength Conditional Access policy, we evaluate if the methods they have previously used satisfy the authentication requirements. For example, let's say a user signs in with password + SMS. They access a resource protected by an MFA authentication strength policy. In this case, the user can access the resource without another authentication prompt.

Let's suppose they next access a resource protected by Phishing-resistant MFA authentication strength policy. At this point, the user will be prompted to provide a phishing-resistant authentication method, such as Windows Hello for Business. 

If the user is not registered for any of the methods required by the authentication strength policy, the user will be redirected to register a required method. <!-- making this a comment for now because we have a limitation. Once it is fixed we can remove the comment::: Only users who satisfy MFA are redirected to register another strong authentication method.-->

If the authentication strength policy doesn't include a method that the user can register and use, the user is blocked from sign-in to the resource. 

### Registering authentication methods

The following authentication methods aren't available to register in the inline registration flow. 
* [Microsoft Authenticator (phone sign-in)](https://support.microsoft.com/account-billing/add-your-work-or-school-account-to-the-microsoft-authenticator-app-43a73ab5-b4e8-446d-9e54-2a4cb8e4e93c)
* [FIDO2](howto-authentication-passwordless-security-key.md)
* [Certificate-based authentication](concept-certificate-based-authentication.md)
* [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-prepare-people-to-use) 

If a user is not registered for these methods, they will be redirected to the inline registration flow and would be advised to register these methods, however they will blocked from accessing the resource until the register the required methods. For the best user experience, make sure users are registered for the different methods they may need to use.


## External users 
<!-- Namrata to include admin section-->

### User experience for external users
<!-- Namrata to add -->


## Known issues
**Registration experience when the user is already registered for at least one strong authentication method** - If the user is not registered for any of the methods required by the authentication strength policy, the user will be redirected to register a required method. However, if the user is already registered for another strong authentication method, they must complete MFA before registering a new method. At the end of authentication process, the user will land in My Sign-ins page without indication about which methods they should register. This issue is not present if the user is not registered for any strong authentication methods. For optimal user experience, we recommend you ensure your users are registered for the methods enforced by the authentication strengths policy.

**Authentication prompts after using Certificate-based authentication** - If a user have first authenticated using Certificate-based authentication and the authentication strengths requires another method, such as FIDO2 security key, user is not prompted to use FIDO2 and the authentication fails. User must restart their session to sign-in with a FIDO2 key.

**Authentication methods that are currently not supported by authentication strengths**: 
The following authentication methods are included in the available combinations but currently have limited functionality:
- Windows Hello for Business
- Microsoft Authenticator (Phone Sign-in)
- Temporary Access Pass (One-time use AND Multi-use)
- Federated Multi-Factor
- Email One-time pass (Guest)
- Hardware-based OATH token
- <!-- Namrata to update about B2B>


## Limitations

**Conditional Access policies are only evaluated after the initial authentication** -  As a result,  authentication strength will not restrict a user's initial authentication. For example, if you are using the built-in phishing-resistant strength, this will not prevent a user from typing in their password, but they will be required to use a phishing-resistant method such as FIDO2 security key before they can continue.

**Conditional Access Policy configuration – Require multifactor authentication** - The Conditional Access grant controls **Require multifactor authentication** and **Require authentication strength** cannot be used together in the same policy. The built-in authentication strength **Multifactor authentication** is equivalent to the **Require multifactor authentication** grant control.


<!-- place holder: Auth Strength with CCS -->
<! Place holder: what-if tool -->


## Prerequisites

**License** Your tenant needs to have Azure AD Premium P1 license to use Conditional Access. If needed, you can enable free trial. 
**Enable combined registration** -  Authentication strengths policy is supported when using the combined registration. Using the legacy registration will result in poor user experience as the user may register methods who are not required by the authentication method policy.

## Next steps

- How to configure access control by using authentication strengths
- [Troubleshoot authentication strengths](troubleshoot-authentication-strengths.md) 

