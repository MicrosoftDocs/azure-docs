---
title: Overview of Azure Active Directory authentication strength
description: Learn how admins can use Azure AD Conditional Access to distinguish which authentication methods can be used based on relevant security factors.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/12/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla, inbarckms

ms.collection: M365-identity-device-management
---
# Conditional Access authentication strength 

Authentication strength is a Conditional Access control that allows administrators to require specific combinations of authentication methods to access a resource. For example, they can require phishing-resistant authentication methods to access a sensitive resource. But to access a nonsensitive resource, they can allow less secure multifactor authentication (MFA) combinations, such as password + SMS. 

Authentication strength is based on the [Authentication methods policy](concept-authentication-methods.md), where administrators can scope authentication methods for specific users and groups to be used across Azure Active Directory (Azure AD) federated applications. Authentication strength allows further control over the usage of these methods based upon specific scenarios such as sensitive resource access, user risk, location, and more. 

Administrators can require an authentication strength to access a resource by creating a Conditional Access policy with the **Require authentication strength** control. They can choose from three built-in authentication strengths: **Multifactor authentication strength**, **Passwordless MFA strength**, and **Phishing-resistant MFA strength**. They can also create a custom authentication strength policy based on the authentication method combinations they want to allow. 

:::image type="content" source="media/concept-authentication-strengths/conditional-access-policy-authentication-strength-grant-control.png" alt-text="Screenshot of a Conditional Access policy with an authentication strength policy configured in grant controls.":::

## Scenarios for authentication strengths

Authentication strengths can help customers address scenarios, such as: 

- Require specific authentication methods to access a sensitive resource.
- Require a specific authentication method when a user takes a sensitive action within an application (in combination with Conditional Access authentication context).
- Require users to use a specific authentication method when they access sensitive applications outside of the corporate network.
- Require more secure authentication methods for users at high risk. 
- Require specific authentication methods from guest users who access a resource tenant (in combination with cross-tenant settings). <!-- Namrata - Add / review external users scenario here -->

## Authentication strengths  

An authentication strength can include a combination of authentication methods. Users can satisfy the strength requirements by authenticating with any of the allowed combinations. For example, the built-in **Phishing-resistant MFA strength** allows the following combinations:

- Windows Hello for Business

  OR

- FIDO2 security key

  OR

- Azure AD Certificate-Based Authentication (Multi-Factor)

:::image type="content" source="media/concept-authentication-strengths/authentication-strength-definitions.png" alt-text="Screenshot showing the phishing-resistant MFA strength policy definition.":::

### Built-in authentication strengths

Built-in authentication strengths are combinations of authentication methods that are predefined by Microsoft. Built-in authentication strengths are always available and can't be modified. Microsoft will update built-in authentication strengths when new methods become available. 

The following table lists the combinations of authentication methods for each built-in authentication strength. Depending on which methods are available in the authentication methods policy and registered for users, they can use any one of the combinations to sign-in.

-	**MFA strength** - the same set of combinations that could be used to satisfy the **Require multifactor authentication** setting.
-	**Passwordless MFA strength** - includes authentication methods that satisfy MFA but don't require a password.
-	**Phishing-resistant MFA strength** - includes methods that require an interaction between the authentication method and the sign-in surface.

|Authentication method combination |MFA strength | Passwordless MFA strength| Phishing-resistant MFA strength|
|----------------------------------|-------------|-------------------------------------|-------------------------------------------|
|FIDO2 security key| &#x2705; | &#x2705; | &#x2705; |
|Certificate-based authentication (Multi-Factor) | &#x2705; | &#x2705; | &#x2705; |
|Password + something you have<sup>1</sup>| &#x2705; | | |
|Federated single-factor + something you have<sup>1</sup>| &#x2705; | | |
|Certificate-based authentication (single-factor)| | | |
|SMS sign-in | | | |
|Password | | | |
|Federated single-factor| | | |

<!-- We will move these methods  back to the table as they become supported - expected very soon
|Windows Hello for Business| &#x2705; | &#x2705; | &#x2705; |
|Microsoft Authenticator (Phone Sign-in)| &#x2705; | &#x2705; | | 
|Temporary Access Pass (One-time use AND Multi-use)| &#x2705; | | | 
|Email One-time pass (Guest)| | | |
|Federated Multi-Factor| &#x2705; | | |-->

<sup>1</sup>Something you have refers to one of the following methods: SMS, voice, push notification, software OATH token. 

The following API call can be used to list definitions of all the built-in authentication strengths:

```http
GET https://graph.microsoft.com/beta/identity/conditionalAccess/authenticationStrengths/policies?$filter=policyType eq 'builtIn'
```

### Custom authentication strengths

In addition to the three built-in authentication strengths, administrators can create up to 15 of their own custom authentication strengths to exactly suit their requirements. A custom authentication strength can contain any of the supported combinations in the preceding table. A custom authentication strength can be edited. But if a custom strength is referenced by a Conditional Access policy, an administrator needs to confirm the edit. A custom authentication strength can't be deleted if it's is referenced by a Conditional Access policy. 

1. In the Azure portal, browse to **Azure Active Directory** > **Security** > **Authentication methods** > **Authentication strengths (Preview)**.
1. Select **New authentication strength**.
1. Provide a descriptive **Name** for your new authentication strength.
1. Optionally provide a **Description**.
1. Select any of the available methods you want to allow.
1. Choose **Next** and review the policy configuration.

   :::image type="content" source="media/concept-authentication-strengths/authentication-strength-custom.png" alt-text="Screenshot showing the creation of a custom authentication strength policy.":::

#### FIDO2 security key advanced options
Custom authentication strengths allow customers to further restrict the usage of some FIDO2 security keys based on their Authenticator Attestation GUIDs (AAGUIDs). The capability allows administrators to require a FIDO2 key from a specific manufacture in order to access the resource.

<!-- Steps to configure FIDO2 AA GUID -- Justin can you help with this? -->

#### Update and delete custom authentication strengths policies

Deletion of a custom authentication strengths policy is not allowed if it is being referenced by a Conditional Access policy. Click on the Conditional Access policies column to find which policies are referencing the authentication strengths policy you would like to delete.
 
Editing of a custom authentication strength policy is allowed. If the policy is referenced by a Conditional Access policy, the administrator is required to confirm this step. 

## Using authentication strength policies in Conditional Access
After you review and choose built-in authentication strength policies, or create your own custom strengths, you can use them in Conditional Access policies. By referencing an authentication strength in a Conditional Access policy, you can restrict which authentication methods are allowed when the Conditional Access policy applies to sign-in.
<!-- ### Place holder:How to create conditional access policy that uses authentication strength
-	Add a note that you can use either require mfa or require auth strengths
- (JF) Possibly add a reference doc that lists all the definitions of the things you can configure?
-->

### How Conditional Access Authentication strengths policies are used in combination with Authentication methods policy
The authentication method policy defines which methods can be used in the tenant. 

Under the legacy authentication methods policy (Under Security > Multifactor Authentication > Additional cloud-based multifactor authentication settings), methods are enabled or disabled for all the users in the tenant. In the new authentication methods policy (Under Security > Authentication methods > Policies), authentication methods can be scoped for users and groups. These policies define if a user can use a specific authentication method for all resources federated with Azure AD.

In addition, users must register or be configured for an authentication method in order to use it. For example, a user can register for SMS, but Certificate-based Authentication must be configured on the user’s device by their administrator.

The Conditional Access authentication strengths takes the above into consideration when evaluating the user’s access to the resource. For example, an administrator has configured a custom authentication strengths policy that includes FIDO2 Security Key or SMS. The user is accessing a resource protected by this policy. During sign-in we check which methods the user is allowed to use (legacy and new authentication method policy), which methods they have registered and which methods are allowed by the Conditional Access policy.

## User experience

<!---Should we add a flowchart or another conceptual diagram to illustrate this?--->

To evaluate if the user should gain access to the resource, the following considerations are taken into account: 

- Which method was previously used sign-in?
- Which methods are available in the authentication strength policy? 
- Which methods are allowed for user sign-in in the authentication methods policy?
- Is the user registered for the required methods?

When a user accesses a resource protected by an authentication strength Conditional Access policy, we evaluate if the methods they have previously used satisfy the authentication requirements. For example, let's say a user signs in with password + SMS. They access a resource protected by an MFA authentication strength policy. In this case, the user can access the resource without another authentication prompt.

Let's suppose they next access a resource protected by Phishing-resistant MFA authentication strength policy. At this point, the user will be prompted to provide a phishing-resistant authentication method, such as Windows Hello for Business. 

If the user is not registered for any of the methods required by the authentication strength policy, they'll register a required method by using [combined registration interrupt mode](concept-registration-mfa-sspr-combined.md#interrupt-mode). <!-- making this a comment for now because we have a limitation. Once it is fixed we can remove the comment::: Only users who satisfy MFA are redirected to register another strong authentication method.-->

If the authentication strength policy doesn't include a method that the user can register and use, the user is blocked from sign-in to the resource. 

### Registering authentication methods

The following authentication methods can't be registered as part of combined registration interrupt mode: 
* [Microsoft Authenticator (phone sign-in)](https://support.microsoft.com/account-billing/add-your-work-or-school-account-to-the-microsoft-authenticator-app-43a73ab5-b4e8-446d-9e54-2a4cb8e4e93c)
* [FIDO2](howto-authentication-passwordless-security-key.md)
* [Certificate-based authentication](concept-certificate-based-authentication.md)
* [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-prepare-people-to-use) 

If a user is not registered for these methods, they can register a required method by using [combined registration managed mode](concept-registration-mfa-sspr-combined.md#manage-mode). They can't access the resource until the required method is registered. For the best user experience, make sure users complete combined registered in advance for the different methods they may need to use.

## External users 
<!-- Namrata to include admin section-->

### User experience for external users
<!-- Namrata to add -->


## Known issues
- **Registration experience when the user is already registered for at least one strong authentication method** - If the user is not registered for any of the methods required by the authentication strength policy, the user will be redirected to register a required method. However, if the user is already registered for another strong authentication method, they must complete MFA before registering a new method. At the end of authentication process, the user is redirected to **My Sign-ins page** without indication about which methods they should register. This issue doesn't effect users who haven't registered _any_ strong authentication methods. For optimal user experience, we recommend you ensure your users are registered for the methods enforced by the authentication strengths policy.


- **Users who signed in by using certificate-based authentication aren't prompted to reauthenticate** - If a user first authenticated by using certificate-based authentication and the authentication strength requires another method, such as a FIDO2 security key, the user isn't prompted to use a FIDO2 security key and authentication fails. The user must restart their session to sign-in with a FIDO2 security key.

- **Authentication methods that are currently not supported by authentication strengths** - The following authentication methods are included in the available combinations but currently have limited functionality:
  - Windows Hello for Business
  - Microsoft Authenticator (phone sign-in)
  - Temporary Access Pass (one-time use and multiuse)
  - Federated multifactor
  - Email one-time pass (Guest)
  - Hardware-based OATH token

- **Conditional Access What-if tool** – When running the what-if tool, it will return policies that require authentication strengths correctly. However, when clicking on the authentication strengths name a name page is open with additional information on the methods the user can use. This information may be incorrect.

- **Authentication strength is not enforced on “Register security information” user action** – If an Authentication strengths Conditional Access policy is targeting “Register security information” user action, the policy would not apply. 

<!-- Namrata to update about B2B--->

## Limitations

- **Conditional Access policies are only evaluated after the initial authentication** -  As a result, authentication strength will not restrict a user's initial authentication. Suppose you are using the built-in phishing-resistant MFA strength. A user can still type in their password, but they will be required to use a phishing-resistant method such as FIDO2 security key before they can continue.

- **Require multifactor authentication and Require authentication strength can't be used together in the same Conditional Access policy** - These two Conditional Access grant controls can't be used together because the built-in authentication strength **Multifactor authentication** is equivalent to the **Require multifactor authentication** grant control.


<!---place holder: Auth Strength with CCS - will be documented in resilience-defaults doc-->



## Prerequisites

- **Azure AD Premium P1** - Your tenant needs to have Azure AD Premium P1 license to use Conditional Access. If needed, you can enable a [free trial](https://www.microsoft.com/security/business/get-started/start-free-trial).
- **Enable combined registration** - Authentication strengths policy is supported when using [combined MFA and SSPR registration](howto-registration-mfa-sspr-combined.md). Using the legacy registration will result in poor user experience as the user may register methods that aren't required by the authentication method policy.

## Next steps

- [Troubleshoot authentication strengths](troubleshoot-authentication-strengths.md) 

