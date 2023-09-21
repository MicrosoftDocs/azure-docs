---
title: Home Realm Discovery policy
description: Learn how to manage Home Realm Discovery policy for Microsoft Entra authentication for federated users, including auto-acceleration and domain hints.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 01/02/2023
ms.author: jomondi
ms.reviewer: sreyanth, ludwignick
ms.custom: enterprise-apps, has-azure-ad-ps-ref
---
# Home Realm Discovery for an application

Home Realm Discovery (HRD) is the process that allows Microsoft Entra ID to determine which identity provider (IDP) a user needs to authenticate with at sign-in time.  When a user signs in to a Microsoft Entra tenant to access a resource, or to the Microsoft Entra common sign-in page, they type a user name (UPN). Microsoft Entra ID uses that to discover where the user needs to sign in.

The user will be taken to one of the following identity providers to be authenticated:

- The home tenant of the user (might be the same tenant as the resource that the user is attempting to access).

- Microsoft account. The user is a guest in the resource tenant that uses a consumer account for authentication.

- An on-premises identity provider such as Active Directory Federation Services (AD FS).

- Another identity provider that's federated with the Microsoft Entra tenant.

## Auto-acceleration

Some organizations configure domains in their Microsoft Entra tenant to federate with another IdP, such as AD FS for user authentication.

When a user signs into an application, they are first presented with a Microsoft Entra sign-in page. After they have typed their UPN, if they are in a federated domain they are then taken to the sign-in page of the IdP serving that domain. Under certain circumstances, administrators might want to direct users to the sign-in page when they're signing in to specific applications.

As a result users can skip the initial Microsoft Entra ID page. This process is referred to as "sign-in auto-acceleration." Microsoft does not recommend configuring auto-acceleration any longer, as it can prevent the use of stronger authentication methods such as FIDO and hinders collaboration. See [Enable passwordless security key sign-in](../authentication/howto-authentication-passwordless-security-key.md) to learn the benefits of not configuring auto-acceleration. To learn how to prevent sign-in auto-acceleration, see [Disable auto-acceleration sign-in](prevent-domain-hints-with-home-realm-discovery.md).

In cases where the tenant is federated to another IdP for sign-in, auto-acceleration makes user sign-in more streamlined.  You can configure auto-acceleration for individual applications. See [Configure auto-acceleration](configure-authentication-for-federated-users-portal.md) to learn how to force auto-acceleration using HRD.

> [!NOTE]
> If you configure an application for auto-acceleration, users can't use managed credentials (like FIDO) and guest users can't sign in. If you take a user straight to a federated IdP for authentication, there is no way for them to get back to the Microsoft Entra sign-in page. Guest users, who might need to be directed to other tenants or an external IdP such as a Microsoft account, can't sign in to that application because they're skipping the HRD step.

There are three ways to control auto-acceleration to a federated IdP:

- Use a domain hint on authentication requests for an application.
- Configure a HRD policy to [force auto-acceleration](configure-authentication-for-federated-users-portal.md)
- Configure a HRD policy to [ignore domain hints](prevent-domain-hints-with-home-realm-discovery.md) from specific applications or for certain domains.

## Domain hints

Domain hints are directives that are included in the authentication request from an application. They can be used to accelerate the user to their federated IdP sign-in page. Or they can be used by a multi-tenant application to accelerate the user straight to the branded Microsoft Entra sign-in page for their tenant.

For example, the application "largeapp.com" might enable their customers to access the application at a custom URL "contoso.largeapp.com." The app might also include a domain hint to contoso.com in the authentication request.

Domain hint syntax varies depending on the protocol that's used, and it's typically configured in the application in the following ways:

- For applications that use the **WS-Federation**:  `whr` query string parameter. For example, whr=contoso.com.

- For applications that use the **SAML**:  Either a SAML authentication request that contains a domain hint or a query string whr=contoso.com.

- For applications that use the **OpenID Connect**: `domain_hint`  query string parameter. For example, domain_hint=contoso.com.

By default, Microsoft Entra ID attempts to redirect sign-in to the IDP that's configured for a domain if **both** of the following are true:

- A domain hint is included in the authentication request from the application **and**
- The tenant is federated with that domain.

If the domain hint doesn't refer to a verified federated domain, it is ignored.

> [!NOTE]
> If a domain hint is included in an authentication request and should be respected, its presence overrides auto-acceleration that is set for the application in HRD policy.

### HRD policy for auto-acceleration

Some applications do not provide a way to configure the authentication request they emit. In these cases, it's not possible to use domain hints to control auto-acceleration. Auto-acceleration can be [configured via Home Realm Discovery](configure-authentication-for-federated-users-portal.md) policy to achieve the same behavior.

### HRD policy to prevent auto-acceleration

Some Microsoft and SaaS applications automatically include domain_hints (for example, `https://outlook.com/contoso.com` results in a login request with `&domain_hint=contoso.com` appended), which can disrupt rollout of managed credentials like FIDO.  You can use [Home Realm Discovery policy to ignore domain hints](prevent-domain-hints-with-home-realm-discovery.md) from certain apps or for certain domains, during rollout of managed credentials.

## Enable direct ROPC authentication of federated users for legacy applications

Best practice is for applications to use Microsoft Entra libraries and interactive sign-in to authenticate users. The libraries take care of the federated user flows.  Sometimes legacy applications, especially those that use Resource Owner Password Credentials (ROPC) grants, submit username and password directly to Microsoft Entra ID, and aren't written to understand federation. They don't perform HRD and don't interact with the correct federated endpoint to authenticate a user. If you choose to, you can use [Home Realm Discovery policy to enable specific legacy applications](configure-authentication-for-federated-users-portal.md) that submit username/password credentials using the ROPC grant to authenticate directly with Microsoft Entra ID, Password Hash Sync must be enabled.

> [!IMPORTANT]
> Only enable direct authentication if you have Password Hash Sync turned on and you know it's okay to authenticate this application without any policies implemented by your on-premises IdP. If you turn off Password Hash Sync, or turn off Directory Synchronization with AD Connect for any reason, you should remove this policy to prevent the possibility of direct authentication using a stale password hash.

## Set HRD policy

There are three steps to setting HRD policy on an application for federated sign-in auto-acceleration or direct cloud-based applications:

1. Create an HRD policy.

2. Locate the service principal to which to attach the policy.

3. Attach the policy to the service principal.

Policies only take effect for a specific application when they are attached to a service principal.

Only one HRD policy can be active on a service principal at any one time.

You can use the Azure AD PowerShell cmdlets to create and manage HRD policy.

The json object is an example HRD policy definition:

  ```json
  {  
    "HomeRealmDiscoveryPolicy":
    {  
      "AccelerateToFederatedDomain":true,
      "PreferredDomain":"federated.example.edu",
      "AllowCloudPasswordValidation":false
    }
  }
  ```

The policy type is "[HomeRealmDiscoveryPolicy](/graph/api/resources/homeRealmDiscoveryPolicy)".

**AccelerateToFederatedDomain** is optional. If **AccelerateToFederatedDomain** is false, the policy has no effect on auto-acceleration. If **AccelerateToFederatedDomain** is true and there's only one verified and federated domain in the tenant, then users will be taken straight to the federated IdP for sign-in. If it's true and there's more than one verified domain in the tenant, **PreferredDomain** must be specified.

**PreferredDomain** is optional. **PreferredDomain** should indicate a domain to which to accelerate. It can be omitted if the tenant has only one federated domain.  If it's omitted, and there's more than one verified federated domain, the policy has no effect.

 If **PreferredDomain** is specified, it must match a verified, federated domain for the tenant. All users of the application must be able to sign in to that domain - users who cannot sign in at the federated domain will be trapped and unable to complete sign-in.

**AllowCloudPasswordValidation** is optional. If **AllowCloudPasswordValidation** is true, then the application is allowed to authenticate a federated user by presenting username/password credentials directly to the Microsoft Entra token endpoint. This only works if Password Hash Sync is enabled.

Additionally, two tenant-level HRD options exist, not shown above:

- **AlternateIdLogin** is optional.  If enabled, this [allows users to sign in with their email addresses instead of their UPN](../authentication/howto-authentication-use-email-signin.md) at the Microsoft Entra sign-in page.  Alternate IDs rely on the user not being auto-accelerated to a federated IDP.

- **DomainHintPolicy** is an optional complex object that [*prevents* domain hints from auto-accelerating users to federated domains](prevent-domain-hints-with-home-realm-discovery.md). This tenant-wide setting is used to ensure that applications that send domain hints don't prevent users from signing in with cloud-managed credentials.

### Priority and evaluation of HRD policies

HRD policies can be created and then assigned to specific organizations and service principals. This means that it's possible for multiple policies to apply to a specific application, so Microsoft Entra ID must decide which one takes precedence. A set of rules decides which HRD policy (of many applied) takes effect:

- If a domain hint is present in the authentication request, then HRD policy for the tenant (the policy set as the tenant default) is checked to see if domain hints should be ignored. If domain hints are allowed, the behavior that's specified by the domain hint is used.

- Otherwise, if a policy is explicitly assigned to the service principal, it is enforced.

- If there's no domain hint, and no policy is explicitly assigned to the service principal, a policy that's explicitly assigned to the parent organization of the service principal is enforced.

- If there's no domain hint, and no policy has been assigned to the service principal or the organization, the default HRD behavior is used.

## Next steps

- [Configure sign in behavior for an application by using a Home Realm Discovery policy](configure-authentication-for-federated-users-portal.md)
- [Disable auto-acceleration to a federated IDP during user sign-in with Home Realm Discovery policy](prevent-domain-hints-with-home-realm-discovery.md)
- For more information about how authentication works in Microsoft Entra ID, see [Authentication scenarios for Microsoft Entra ID](../develop/authentication-vs-authorization.md).
