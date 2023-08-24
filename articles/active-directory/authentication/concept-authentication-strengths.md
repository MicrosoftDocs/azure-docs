---
title: Overview of Azure Active Directory authentication strength 
description: Learn how admins can use Azure AD Conditional Access to distinguish which authentication methods can be used based on relevant security factors.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 06/02/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla, inbarckms

ms.collection: M365-identity-device-management
---
# Conditional Access authentication strength 

Authentication strength is a Conditional Access control that allows administrators to specify which combination of authentication methods can be used to access a resource. For example, they can make only phishing-resistant authentication methods available to access a sensitive resource. But to access a nonsensitive resource, they can allow less secure multifactor authentication (MFA) combinations, such as password + SMS. 

Authentication strength is based on the [Authentication methods policy](concept-authentication-methods.md), where administrators can scope authentication methods for specific users and groups to be used across Azure Active Directory (Azure AD) federated applications. Authentication strength allows further control over the usage of these methods based upon specific scenarios such as sensitive resource access, user risk, location, and more. 

Administrators can specify an authentication strength to access a resource by creating a Conditional Access policy with the **Require authentication strength** control. They can choose from three built-in authentication strengths: **Multifactor authentication strength**, **Passwordless MFA strength**, and **Phishing-resistant MFA strength**. They can also create a custom authentication strength based on the authentication method combinations they want to allow. 

:::image type="content" border="true" source="./media/concept-authentication-strengths/conditional-access-policy-authentication-strength-grant-control.png" alt-text="Screenshot of a Conditional Access policy with an authentication strength configured in grant controls.":::

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

  Or

- FIDO2 security key

  Or

- Azure AD Certificate-Based Authentication (Multi-Factor)

:::image type="content" border="true" source="./media/concept-authentication-strengths/authentication-strength-definitions.png" alt-text="Screenshot showing the phishing-resistant MFA strength definition.":::

### Built-in authentication strengths

Built-in authentication strengths are combinations of authentication methods that are predefined by Microsoft. Built-in authentication strengths are always available and can't be modified. Microsoft will update built-in authentication strengths when new methods become available. 

The following table lists the combinations of authentication methods for each built-in authentication strength. Depending on which methods are available in the authentication methods policy and registered for users, they can use any one of the combinations to sign-in.

-	**MFA strength** - the same set of combinations that could be used to satisfy the **Require multifactor authentication** setting.
-	**Passwordless MFA strength** - includes authentication methods that satisfy MFA but don't require a password.
-	**Phishing-resistant MFA strength** - includes methods that require an interaction between the authentication method and the sign-in surface.

|Authentication method combination |MFA strength | Passwordless MFA strength| Phishing-resistant MFA strength|
|----------------------------------|-------------|-------------------------------------|-------------------------------------------|
|FIDO2 security key| &#x2705; | &#x2705; | &#x2705; |
|Windows Hello for Business| &#x2705; | &#x2705; | &#x2705; |
|Certificate-based authentication (Multi-Factor) | &#x2705; | &#x2705; | &#x2705; |
|Microsoft Authenticator (Phone Sign-in)| &#x2705; | &#x2705; | | 
|Temporary Access Pass (One-time use AND Multi-use)| &#x2705; | | | 
|Password + something you have<sup>1</sup>| &#x2705; | | |
|Federated single-factor + something you have<sup>1</sup>| &#x2705; | | |
|Federated Multi-Factor| &#x2705; | | |
|Certificate-based authentication (single-factor)| | | |
|SMS sign-in | | | |
|Password | | | |
|Federated single-factor| | | |

<!-- We will move these methods  back to the table as they become supported - expected very soon
|Email One-time pass (Guest)| | | |
-->

<sup>1</sup> Something you have refers to one of the following methods: SMS, voice, push notification, software OATH token and Hardware OATH token.

The following API call can be used to list definitions of all the built-in authentication strengths:

```http
GET https://graph.microsoft.com/beta/identity/conditionalAccess/authenticationStrengths/policies?$filter=policyType eq 'builtIn'
```

### Custom authentication strengths

In addition to the three built-in authentication strengths, administrators can create up to 15 of their own custom authentication strengths to exactly suit their requirements. A custom authentication strength can contain any of the supported combinations in the preceding table. 

1. In the Azure portal, browse to **Azure Active Directory** > **Security** > **Authentication methods** > **Authentication strengths**.
1. Select **New authentication strength**.
1. Provide a descriptive **Name** for your new authentication strength.
1. Optionally provide a **Description**.
1. Select any of the available methods you want to allow.
1. Choose **Next** and review the policy configuration.

   :::image type="content" border="true" source="media/concept-authentication-strengths/authentication-strength-custom.png" alt-text="Screenshot showing the creation of a custom authentication strength.":::

#### Update and delete custom authentication strengths

You can edit a custom authentication strength. If it's referenced by a Conditional Access policy, it can't be deleted, and you need to confirm any edit. 
To check if an authentication strength is referenced by a Conditional Access policy,click **Conditional Access policies** column.

#### FIDO2 security key advanced options
Custom authentication strengths allow customers to further restrict the usage of some FIDO2 security keys based on their Authenticator Attestation GUIDs (AAGUIDs). The capability allows administrators to require a FIDO2 key from a specific manufacture in order to access the resource. To require a specific FIDO2 security key, complete the preceding steps to create a custom authentication strength, select **FIDO2 Security Key**, and click **Advanced options**. 

:::image type="content" border="true" source="./media/concept-authentication-strengths/key.png" alt-text="Screenshot showing Advanced options.":::

Next to **Allowed FIDO2 Keys** click **+**, copy the AAGUID value, and click **Save**.

:::image type="content" border="true" source="./media/concept-authentication-strengths/guid.png" alt-text="Screenshot showing how to add an Authenticator Attestation GUID.":::

## Using authentication strength in Conditional Access
After you determine the authentication strength you need, you'll need to create a Conditional Access policy to require that authentication strength to access a resource. When the Conditional Access policy gets applied, the authentication strength restricts which authentication methods are allowed.
<!-- ### Place holder:How to create Conditional Access policy that uses authentication strength
-	Add a note that you can use either require mfa or require auth strengths
- (JF) Possibly add a reference doc that lists all the definitions of the things you can configure?
-->

### How authentication strength works with the Authentication methods policy
There are two policies that determine which authentication methods can be used to access resources. If a user is enabled for an authentication method in either policy, they can sign in with that method. 

- **Security** > **Authentication methods** > **Policies** is a more modern way to manage authentication methods for specific users and groups. You can specify users and groups for different methods. You can also configure parameters to control how a method can be used.  

  :::image type="content" border="true" source="./media/concept-authentication-strengths/authentication-methods-policy.png" alt-text="Screenshot of Authentication methods policy.":::

- **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings** is a legacy way to control multifactor authentication methods for all of the users in the tenant. 

  :::image type="content" border="true" source="./media/concept-authentication-strengths/service-settings.png" alt-text="Screenshot of MFA service settings.":::

Users may register for authentications for which they are enabled, and in other cases, an administrator can configure a user's device with a method, such as certificate-based authentication.

### How an authentication strength policy is evaluated during sign-in 

The authentication strength Conditional Access policy defines which methods can be used. Azure AD checks the policy during sign-in to determine the user’s access to the resource. For example, an administrator configures a Conditional Access policy with a custom authentication strength that requires FIDO2 Security Key or Password + SMS. The user accesses a resource protected by this policy. During sign-in, all settings are checked to determine which methods are allowed, which methods are registered, and which methods are required by the Conditional Access policy. To be used, a method must be allowed, registered by the user (either before or as part of the access request), and satisfy the authentication strength. 

 
### How multiple Conditional Access authentication strength policies are evaluated 

In general, when there are multiple Conditional Access policies applicable for a single sign-in, all conditions from all policies must be met. In the same vein, when there are multiple Conditional Access policies which apply authentication strengths to the sign-in, the user must satisfy all of the authentication strength policies. For example, if two different authentication strength policies both require FIDO2, the user can use their FIDO2 security key and satisfy both policies. If the two authentication strength policies have different sets of methods, the user must use multiple methods to satisfy both policies. 

#### How multiple Conditional Access authentication strength policies are evaluated for registering security info 

For security info registration, the authentication strength evaluation is treated differently – authentication strengths that target the user action of **Registering security info** are preferred over other authentication strength policies that target **All cloud apps**. All other grant controls (such as **Require device to be marked as compliant**) from other Conditional Access policies in scope for the sign-in will apply as usual.  

For example, let’s assume Contoso would like to require their users to always sign in with a phishing-resistant authentication method and from a compliant device. Contoso also wants to allow new employees to register these authentication methods using a Temporary Access Pass (TAP). TAP can’t be used on any other resource. To achieve this goal, the admin can take the following steps: 

1. Create a custom authentication strength named **Bootstrap and recovery** that includes the Temporary Access Pass authentication combination, it can also include any of the phishing-resistant MFA methods.  
1. Create a Conditional Access policy which targets **All cloud apps** and requires **Phishing-resistant MFA** authentication strength AND **Require compliant device** grant controls. 
1. Create a Conditional Access policy that targets the **Register security information** user action and requires the **Bootstrap and recovery** authentication strength. 

As a result, users on a compliant device would be able to use a Temporary Access Pass to register FIDO2 security keys and then use the newly registered FIDO2 security key to authenticate to other resources (such as Outlook). 

>[!NOTE] 
>If multiple Conditional Access policies target the **Register security information** user action, and they each apply an authentication strength, the user must satisfy all such authentication strengths to sign in. 



## User experience

The following factors determine if the user gains access to the resource: 

- Which authentication method was previously used?
- Which methods are available for the authentication strength? 
- Which methods are allowed for user sign-in in the Authentication methods policy?
- Is the user registered for any available method?

When a user accesses a resource protected by an authentication strength Conditional Access policy, Azure AD evaluates if the methods they have previously used satisfy the authentication strength. If a satisfactory method was used, Azure AD grants access to the resource. For example, let's say a user signs in with password + SMS. They access a resource protected by MFA authentication strength. In this case, the user can access the resource without another authentication prompt.

Let's suppose they next access a resource protected by Phishing-resistant MFA authentication strength. At this point, they'll be prompted to provide a phishing-resistant authentication method, such as Windows Hello for Business. 

If the user hasn't registered for any methods that satisfy the authentication strength, they are redirected to [combined registration](concept-registration-mfa-sspr-combined.md#interrupt-mode). <!-- making this a comment for now because we have a limitation. Once it is fixed we can remove the comment::: Only users who satisfy MFA are redirected to register another strong authentication method.-->

If the authentication strength doesn't include a method that the user can register and use, the user is blocked from sign-in to the resource. 

### Register passwordless authentication methods

The following authentication methods can't be registered as part of combined registration interrupt mode. Make sure users are registered for these methods before you apply a Conditional Access policy that can require them to be used for sign-in. If a user isn't registered for these methods, they can't access the resource until the required method is registered. 

| Method | Registration requirements |
|--------|---------------------------|
|[Microsoft Authenticator (phone sign-in)](https://support.microsoft.com/account-billing/add-your-work-or-school-account-to-the-microsoft-authenticator-app-43a73ab5-b4e8-446d-9e54-2a4cb8e4e93c) | Can be registered from the Authenticator app.|
|[FIDO2 security key](howto-authentication-passwordless-security-key.md) | Can be registered using [combined registration managed mode](concept-registration-mfa-sspr-combined.md#manage-mode). |
|[Certificate-based authentication](concept-certificate-based-authentication.md) | Requires administrator setup; can't be registered by the user. |
|[Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-prepare-people-to-use) | Can be registered in the Windows Out of Box Experience (OOBE) or the Windows Settings menu.|


### Federated user experience  
For federated domains, MFA may be enforced by Azure AD Conditional Access or by the on-premises federation provider by setting the federatedIdpMfaBehavior. If the federatedIdpMfaBehavior setting is set to enforceMfaByFederatedIdp, the user must authenticate on their federated IdP and can only satisfy the **Federated Multi-Factor** combination of the authentication strength requirement. For more information about the federation settings, see [Plan support for MFA](../hybrid/migrate-from-federation-to-cloud-authentication.md#plan-support-for-mfa).

If a user from a federated domain has multifactor authentication settings in scope for Staged Rollout, the user can complete multifactor authentication in the cloud and satisfy any of the **Federated single-factor + something you have** combinations. For more information about staged rollout, see [Enable Staged Rollout using Azure portal](how-to-mfa-server-migration-utility.md#enable-staged-rollout-using-azure-portal).

## External users

The Authentication methods policy is especially useful for restricting external access to sensitive apps in your organization because you can enforce specific authentication methods, such as phishing-resistant methods, for external users.

When you apply an authentication strength Conditional Access policy to external Azure AD users, the policy works together with MFA trust settings in your cross-tenant access settings to determine where and how the external user must perform MFA. An Azure AD user authenticates in their home Azure AD tenant. Then when they access your resource, Azure AD applies the policy and checks to see if you've enabled MFA trust. Note that enabling MFA trust is optional for B2B collaboration but is *required* for [B2B direct connect](../external-identities/b2b-direct-connect-overview.md#multi-factor-authentication-mfa).

In external user scenarios, the authentication methods that can satisfy authentication strength vary, depending on whether the user is completing MFA in their home tenant or the resource tenant. The following table indicates the allowed methods in each tenant. If a resource tenant has opted to trust claims from external Azure AD organizations, only those claims listed in the “Home tenant” column below will be accepted by the resource tenant for MFA. If the resource tenant has disabled MFA trust, the external user must complete MFA in the resource tenant using one of the methods listed in the “Resource tenant” column.

|Authentication method  |Home tenant  | Resource tenant  |
|---------|---------|---------|
|SMS as second factor                         | &#x2705;        | &#x2705; |
|Voice call                                   | &#x2705;        | &#x2705; |
|Microsoft Authenticator push notification    | &#x2705;        | &#x2705; |
|Microsoft Authenticator phone sign-in        | &#x2705;        |          |
|OATH software token                          | &#x2705;        | &#x2705; |
|OATH hardware token                          | &#x2705;        |          |
|FIDO2 security key                           | &#x2705;        |          |
|Windows Hello for Business                   | &#x2705;        |          |

For more information about how to set authentication strengths for external users, see [Conditional Access: Require an authentication strength for external users](../conditional-access/howto-conditional-access-policy-authentication-strength-external.md).

### User experience for external users

An authentication strength Conditional Access policy works together with [MFA trust settings](../external-identities/cross-tenant-access-settings-b2b-collaboration.md#to-change-inbound-trust-settings-for-mfa-and-device-claims) in your cross-tenant access settings. First, an Azure AD user authenticates with their own account in their home tenant. Then when this user tries to access your resource, Azure AD applies the authentication strength Conditional Access policy and checks to see if you've enabled MFA trust.

- **If MFA trust is enabled**, Azure AD checks the user's authentication session for a claim indicating that MFA has been fulfilled in the user's home tenant. See the preceding table for authentication methods that are acceptable for MFA when completed in an external user's home tenant. If the session contains a claim indicating that MFA policies have already been met in the user's home tenant, and the methods satisfy the authentication strength requirements, the user is allowed access. Otherwise, Azure AD presents the user with a challenge to complete MFA in the home tenant using an acceptable authentication method.
- **If MFA trust is disabled**, Azure AD presents the user with a challenge to complete MFA in the resource tenant using an acceptable authentication method. (See the table above for authentication methods that are acceptable for MFA by an external user.)

## Limitations

- **Conditional Access policies are only evaluated after the initial authentication** -  As a result, authentication strength doesn't restrict a user's initial authentication. Suppose you are using the built-in phishing-resistant MFA strength. A user can still type in their password, but they will be required to use a phishing-resistant method such as FIDO2 security key before they can continue.

- **Require multifactor authentication and Require authentication strength can't be used together in the same Conditional Access policy** - These two Conditional Access grant controls can't be used together because the built-in authentication strength **Multifactor authentication** is equivalent to the **Require multifactor authentication** grant control.

- **Authentication methods that aren't currently supported by authentication strength** - The **Email one-time pass (Guest)** authentication method isn't included in the available combinations.

- **Windows Hello for Business** – If the user signed in with Windows Hello for Business as their primary authentication method, it can be used to satisfy an authentication strength requirement that includes Windows Hello for Business. But if the user signed in with another method like password as their primary authenticating method, and the authentication strength requires Windows Hello for Business, they get prompted to sign in with Windows Hello for Business. 

## FAQ

### Should I use authentication strength or the Authentication methods policy?
Authentication strength is based on the Authentication methods policy. The Authentication methods policy helps to scope and configure authentication methods to be used across Azure AD by specific users and groups. Authentication strength allows another restriction of methods for specific scenarios, such as sensitive resource access, user risk, location, and more.

For example, the administrator of Contoso wants to allow their users to use Microsoft Authenticator with either push notifications or passwordless authentication mode. The administrator goes to the Microsoft Authenticator settings in the Authentication method policy, scopes the policy for the relevant users and set the **Authentication mode** to **Any**. 

Then for Contoso’s most sensitive resource, the administrator wants to restrict the access to only passwordless authentication methods. The administrator creates a new Conditional Access policy, using the built-in **Passwordless MFA strength**. 

As a result, users in Contoso can access most of the resources in the tenant using password + push notification from the Microsoft Authenticator OR only using Microsoft Authenticator (phone sign-in). However, when the users in the tenant access the sensitive application, they must use Microsoft Authenticator (phone sign-in).

## Prerequisites

- **Azure AD Premium P1** - Your tenant needs to have Azure AD Premium P1 license to use Conditional Access. If needed, you can enable a [free trial](https://www.microsoft.com/security/business/get-started/start-free-trial).
- **Enable combined registration** - Authentication strengths are supported when using [combined MFA and SSPR registration](howto-registration-mfa-sspr-combined.md). Using the legacy registration will result in poor user experience as the user may register methods that aren't required by the authentication method policy.

## Next steps

- [Troubleshoot authentication strengths](troubleshoot-authentication-strengths.md) 

