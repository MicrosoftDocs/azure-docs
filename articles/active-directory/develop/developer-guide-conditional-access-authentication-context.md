---
title: Developer guidance for Microsoft Entra Conditional Access authentication context
description: Developer guidance and scenarios for Microsoft Entra Conditional Access authentication context

services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.date: 11/15/2022

ms.author: cwerner
ms.reviewer: joflore, kkrishna
ms.workload: identity
ms.custom: aaddev
---

# Developer guide to Conditional Access authentication context

[Conditional Access](../conditional-access/overview.md) is the Zero Trust control plane that allows you to target policies for access to all your apps – old or new, private, or public, on-premises, or multicloud. With [Conditional Access authentication context](../conditional-access/concept-conditional-access-cloud-apps.md#authentication-context), you can apply different policies within those apps.

Conditional Access authentication context (auth context) allows you to apply granular policies to sensitive data and actions instead of just at the app level. You can refine your Zero Trust policies for least privileged access while minimizing user friction and keeping users more productive and your resources more secure. Today, it can be used by applications using [OpenId Connect](https://openid.net/specs/openid-connect-core-1_0.html) for authentication developed by your company to protect sensitive resources, like high-value transactions or viewing employee personal data.

Use the Microsoft Entra Conditional Access engine's new auth context feature to trigger a demand for step-up authentication from within your application and services. Developers now have the power to demand enhanced stronger authentication, selectively, like MFA from their end users from within their applications. This feature helps developers build smoother user experiences for most parts of their application, while access to more secure operations and data remains behind stronger authentication controls.

## Problem statement

The IT administrators and regulators often struggle between balancing prompting their users with additional factors of authentication too frequently and achieving adequate security and policy adherence for applications and services where parts of them contain sensitive data and operations. It can be a choice between a strong policy that impacts users' productivity when they access most data and actions or a policy that isn't strong enough for sensitive resources.

So, what if apps were able to mix both, where they can function with a relatively lesser security and less frequent prompts for most users and operations and yet conditionally stepping up the security requirement when the users accessed more sensitive parts?

## Common scenarios

For example, while users may sign in to SharePoint using multi-factor authentication, accessing site collection in SharePoint containing sensitive documents can require a compliant device and only be accessible from trusted IP ranges.

## Prerequisites

**First**, your app should be integrated with the Microsoft identity platform using the use [OpenID Connect](v2-protocols-oidc.md)/ [OAuth 2.0](v2-oauth2-auth-code-flow.md) protocols for authentication and authorization. We recommend you use [Microsoft identity platform authentication libraries](reference-v2-libraries.md) to integrate and secure your application with Microsoft Entra ID. [Microsoft identity platform documentation](index.yml) is a good place to start learning how to integrate your apps with the Microsoft identity platform. Conditional Access Auth Context feature support is built on top of protocol extensions provided by the industry standard [OpenID Connect](v2-protocols-oidc.md) protocol. Developers use a [Conditional Access Auth Context reference](/graph/api/conditionalaccessroot-list-authenticationcontextclassreferences) **value** with the [Claims Request](claims-challenge.md) parameter to give apps a way to trigger and satisfy policy.

**Second**, [Conditional Access](../conditional-access/overview.md) requires Microsoft Entra ID P1 licensing. More information about licensing can be found on the [Microsoft Entra pricing page](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

**Third**, today it's only available to applications that sign-in users. Applications that authenticate as themselves aren't supported. Use the [Authentication flows and application scenarios guide](authentication-flows-app-scenarios.md) to learn about the supported authentication app types and flows in the Microsoft identity platform.

## Integration steps

Once your application is integrated using the supported authentication protocols and registered in a Microsoft Entra tenant that has the Conditional Access feature available for use, you can kick start the process to integrating this feature in your applications that sign-in users.

> [!NOTE]
> A detailed walkthrough of this feature is also available as a recorded session at [Use Conditional Access Auth Context in your app for step\-up authentication](https://www.youtube.com/watch?v=_iO7CfoktTY).

**First**, declare and make the authentication contexts available in your tenant. For more information, see [Configure authentication contexts](../conditional-access/concept-conditional-access-cloud-apps.md#configure-authentication-contexts).

Values **C1-C25** are available for use as **Auth Context IDs** in a tenant. Examples of auth context may be:

- **C1** - Require strong authentication
- **C2** – Require compliant devices
- **C3** – Require trusted locations

Create or modify your Conditional Access policies to use the Conditional Access Auth Contexts. Examples policies could be:

- All users signing-into this web application should have successfully completed 2FA for auth context ID **C1**.
- All users signing into this web application should have successfully completed 2FA and also access the web app from a certain IP address range for auth context ID **C3**.

> [!NOTE]
> The Conditional Access auth context values are declared and maintained separately from applications. It is not advisable for applications to take hard dependency on auth context ids. The Conditional Access policies are usually crafted by IT administrators as they have a better understanding of the resources available to apply policies on. For example, for a Microsoft Entra tenant, IT admins would have the knowledge of how many of the tenant's users are equipped to use 2FA for MFA and thus can ensure that Conditional Access policies that require 2FA are scoped to these equipped users.
> Similarly, if the application is used in multiple tenants, the auth context ids in use could be different and, in some cases, not available at all.

**Second**: The developers of an application planning to use Conditional Access auth context are advised to first provide the application admins or IT admins a means to map potential sensitive actions to auth context IDs. The steps roughly being:

1. Identity actions in the code that can be made available to map against auth context Ids.
1. Build a screen in the admin portal of the app (or an equivalent functionality) that IT admins can use to map sensitive actions against an available auth context ID.
1. See the code sample, [Use the Conditional Access Auth Context to perform step-up authentication](https://github.com/Azure-Samples/ms-identity-ca-auth-context/blob/main/README.md) for an example on how it's done.

These steps are the changes that you need to carry in your code base. The steps broadly comprise of

- Query MS Graph to [list all the available Auth Contexts](/graph/api/conditionalaccessroot-list-authenticationcontextclassreferences).
- Allow IT admins to select sensitive/ high-privileged operations and assign them against the available Auth Contexts using Conditional Access policies.
- Save this mapping information in your database/local store.

:::image type="content" source="media/developer-guide-conditional-access-authentication-context/configure-conditional-access-authentication-context.png" alt-text="Setup flow for creating an authentication context":::

**Third**: Your application, and for this example, we'd assume it's a web API, then needs to evaluate calls against the saved mapping and accordingly raise claim challenges for its client apps. To prepare for this action, the following steps are to be taken:

1. In a sensitive and protected by auth context operation, evaluate the values in the **acrs** claim against the Auth Context ID mappings saved earlier and raise a [Claims Challenge](claims-challenge.md) as provided in the code snippet below.

1. The following diagram shows the interaction between the user, client app, and the web API.

   :::image type="content" source="media/developer-guide-conditional-access-authentication-context/authentication-context-application-flow.png" alt-text="Diagram showing the interaction of user, web app, API, and Microsoft Entra ID":::

   The code snippet that follows is from the code sample, [Use the Conditional Access auth context to perform step-up authentication](https://github.com/Azure-Samples/ms-identity-ca-auth-context/blob/main/README.md). The first method, `CheckForRequiredAuthContext()` in the API

      - Checks if the application's action being called requires step-up authentication. It does so by checking its database for a saved mapping for this method
      - If this action indeed requires an elevated auth context, it checks the **acrs** claim for an existing, matching Auth Context ID.
      - If a matching Auth Context ID isn't found, it raises a [claims challenge](claims-challenge.md#claims-challenge-header-format).

      ```csharp
      public void CheckForRequiredAuthContext(string method)
      {
          string authType = _commonDBContext.AuthContext.FirstOrDefault(x => x.Operation == method
                      && x.TenantId == _configuration["AzureAD:TenantId"])?.AuthContextId;

          if (!string.IsNullOrEmpty(authType))
          {
              HttpContext context = this.HttpContext;
              string authenticationContextClassReferencesClaim = "acrs";

              if (context == null || context.User == null || context.User.Claims == null
                  || !context.User.Claims.Any())
              {
                  throw new ArgumentNullException("No Usercontext is available to pick claims from");
              }

              Claim acrsClaim = context.User.FindAll(authenticationContextClassReferencesClaim).FirstOrDefault(x
                  => x.Value == authType);

              if (acrsClaim == null || acrsClaim.Value != authType)
              {
                  if (IsClientCapableofClaimsChallenge(context))
                  {
                      string clientId = _configuration.GetSection("AzureAd").GetSection("ClientId").Value;
                      var base64str = Convert.ToBase64String(Encoding.UTF8.GetBytes("{\"access_token\":{\"acrs\":{\"essential\":true,\"value\":\"" + authType + "\"}}}"));

                      context.Response.Headers.Append("WWW-Authenticate", $"Bearer realm=\"\", authorization_uri=\"https://login.microsoftonline.com/common/oauth2/authorize\", client_id=\"" + clientId + "\", error=\"insufficient_claims\", claims=\"" + base64str + "\", cc_type=\"authcontext\"");
                      context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                      string message = string.Format(CultureInfo.InvariantCulture, "The presented access tokens had insufficient claims. Please request for claims requested in the WWW-Authentication header and try again.");
                      context.Response.WriteAsync(message);
                      context.Response.CompleteAsync();
                      throw new UnauthorizedAccessException(message);
                  }
                  else
                  {
                      throw new UnauthorizedAccessException("The caller does not meet the authentication  bar to carry our this operation. The service cannot allow this operation");
                  }
              }
          }
      }
      ```

   > [!NOTE]
   > The format of the claims challenge is described in the article, [Claims Challenge in the Microsoft identity platform](claims-challenge.md).

1. In the client application, Intercept the claims challenge and redirect the user back to Microsoft Entra ID for further policy evaluation. The code snippet that follows is from the code sample, [Use the Conditional Access auth context to perform step-up authentication](https://github.com/Azure-Samples/ms-identity-ca-auth-context/blob/main/README.md).

   ```csharp
   internal static string ExtractHeaderValues(WebApiMsalUiRequiredException response)
   {
       if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized && response.Headers.WwwAuthenticate.Any())
       {
           AuthenticationHeaderValue bearer = response.Headers.WwwAuthenticate.First(v => v.Scheme == "Bearer");
           IEnumerable<string> parameters = bearer.Parameter.Split(',').Select(v => v.Trim()).ToList();
           var errorValue = GetParameterValue(parameters, "error");

           try
           {
               // read the header and checks if it contains error with insufficient_claims value.
               if (null != errorValue && "insufficient_claims" == errorValue)
               {
                   var claimChallengeParameter = GetParameterValue(parameters, "claims");
                   if (null != claimChallengeParameter)
                   {
                       var claimChallenge = ConvertBase64String(claimChallengeParameter);

                       return claimChallenge;
                   }
               }
           }
           catch (Exception ex)
           {
               throw ex;
           }
       }
       return null;
   }
   ```

   Handle exception in the call to Web API, if a claims challenge is presented, the redirect the user back to Microsoft Entra ID for further processing.

   ```csharp
   try
   {
       // Call the API
       await _todoListService.AddAsync(todo);
   }
   catch (WebApiMsalUiRequiredException hex)
   {
       // Challenges the user if exception is thrown from Web API.
       try
       {
           var claimChallenge =ExtractHeaderValues(hex);
           _consentHandler.ChallengeUser(new string[] { "user.read" }, claimChallenge);

           return new EmptyResult();
       }
       catch (Exception ex)
       {
           _consentHandler.HandleException(ex);
       }

       Console.WriteLine(hex.Message);
   }
   return RedirectToAction("Index");
   ```

1. (Optional) Declare client capability. Client capabilities help resources providers (RP) like our Web API above to detect if the calling client application understands the claims challenge and can then customize its response accordingly. This capability could be useful where not all of the APIs clients are capable of handling claim challenges and some older ones still expect a different response. For more information, see the section [Client capabilities](claims-challenge.md#client-capabilities).

## Caveats and recommendations

Don't hard-code Auth Context values in your app. Apps should read and apply auth context [using MS Graph calls](/graph/api/resources/authenticationcontextclassreference). This practice is critical for [multi-tenant applications](howto-convert-app-to-be-multi-tenant.md). The Auth Context values will vary between Microsoft Entra tenants and won't be available in Microsoft Entra ID Free edition. For more information on how an app should query, set, and use auth context in their code, see the code sample, [Use the Conditional Access auth context to perform step-up authentication](https://github.com/Azure-Samples/ms-identity-ca-auth-context/blob/main/README.md) as how an app should query, set and use auth context in their code.

Don't use auth context where the app itself is going to be a target of Conditional Access policies. The feature works best when parts of the application require the user to meet a higher bar of authentication.

## Code samples

- [Use the Conditional Access auth context to perform step-up authentication for high-privilege operations in a web app](https://github.com/Azure-Samples/ms-identity-dotnetcore-ca-auth-context-app/blob/main/README.md)
- [Use the Conditional Access auth context to perform step-up authentication for high-privilege operations in a web API](https://github.com/Azure-Samples/ms-identity-ca-auth-context/blob/main/README.md)
- [Use the Conditional Access auth context to perform step-up authentication for high-privilege operations in a React single-page application and an Express web API](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/6-AdvancedScenarios/3-call-api-acrs)

## Authentication context [ACRs] in Conditional Access expected behavior

## Explicit auth context satisfaction in requests

A client can explicitly ask for a token with an Auth Context (ACRS) through the claims in the request's body. If an ACRS was requested, Conditional Access will allow issuing the token with the requested ACRS if all challenges were completed.

## Expected behavior when an auth context isn't protected by Conditional Access in the tenant

Conditional Access may issue an ACRS in a token's claims when all Conditional Access policy assigned to the ACRS value has been satisfied. If no Conditional Access policy is assigned to an ACRS value the claim may still be issued, because all policy requirements have been satisfied.

## Summary table for expected behavior when ACRS are explicitly requested

ACRS requested | Policy applied | Control satisfied | ACRS added to claims |
|--|--|--|--|--|
|Yes | No | Yes | Yes |
|Yes | Yes | No | No |
|Yes | Yes | Yes | Yes |
|Yes | No policies configured with ACRS | Yes | Yes |

## Implicit auth context satisfaction by opportunistic evaluation

A resource provider may opt in to the optional 'acrs' claim. Conditional Access will try to add ACRS to the token claims opportunistically in order to avoid round trips to acquire new tokens to Microsoft Entra ID. In that evaluation, Conditional Access will check if the policies protecting Auth Context challenges are already satisfied and will add the ACRS to the token claims if so.

> [!NOTE]
> Each token type will need to be individually opted-in (ID token, Access token).
>
> If a resource provider doesn't opt in to the optional 'acrs' claim, the only way to get an ACRS in the token will be to explicitly ask for it in a token request. It will not get the benefits of the opportunistic evaluation, therefore every time that the required ACRS will be missing from the token claims, the resource provider will challenge the client to acquire a new token containing it in the claims.

## Expected behavior with auth context and session controls for implicit ACRS opportunistic evaluation

### Sign-in frequency by interval

Conditional Access will consider "sign-in frequency by interval" as satisfied for opportunistic ACRS evaluation when all the present authentication factors auth instants are within the sign-in frequency interval. In case that the first factor auth instant is stale, or if the second factor (MFA) is present and its auth instant is stale, the sign-in frequency by interval won't be satisfied and the ACRS won't be issued in the token opportunistically.

### Cloud App Security (CAS)

Conditional Access will consider CAS session control as satisfied for opportunistic ACRS evaluation, when a CAS session was established during that request. For example, when a request comes in and any Conditional Access policy applied and enforced a CAS session, and in addition there's a Conditional Access policy that also requires a CAS session, since the CAS session will be enforced, that will satisfy the CAS session control for the opportunistic evaluation.

## Expected behavior when a tenant contain Conditional Access policies protecting auth context

The table below will show all corner cases where ACRS is added to the token's claims by opportunistic evaluation.

**Policy A**: Require MFA from all users, excluding the user "Ariel", when asking for "c1" acrs.
**Policy B**: Block all users, excluding user "Jay", when asking for "c2", or "c3" acrs.

| Flow | ACRS requested | Policy applied | Control satisfied | ACRS added to claims |
|--|--|--|--|--|
| Ariel requests for an access token | "c1" | None | Yes for "c1". No for "c2" and "c3" | "c1" (requested) |
| Ariel requests for an access token | "c2" | Policy B | Blocked by policy B | None  |
| Ariel requests for an access token | None  | None | Yes for "c1". No for "c2" and "c3"  | "c1" (opportunistically added from policy A) |
| Jay requests for an access token (without MFA) | "c1" | Policy A | No | None  |
| Jay requests for an access token (with MFA) | "c1" | Policy A | Yes | "c1" (requested), "c2" (opportunistically added from policy B), "c3" (opportunistically added from policy B)|
| Jay requests for an access token (without MFA) | "c2" | None  | Yes for "c2" and "c3". No for "c1" | "c2" (requested), "c3" (opportunistically added from policy B) |
| Jay requests for an access token (with MFA)  | "c2" | None | Yes for "c1", "c2" and "c3"  | "c1" (best effort from A), "c2" (requested), "c3" (opportunistically added from policy B) |
| Jay requests for an access token (with MFA)  | None | None | Yes for "c1", "c2" and "c3"  | "c1", "c2", "c3" all opportunistically added |
| Jay requests for an access token (without MFA)  | None | None | Yes for "c2" and "c3". No for "c1"| "c2", "c3" all opportunistically added |

## Next steps

- [Granular Conditional Access for sensitive data and actions (Blog)](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/granular-conditional-access-for-sensitive-data-and-actions/ba-p/1751775)
- [Zero trust with the Microsoft identity platform](/security/zero-trust/identity-developer)
- [Building Zero Trust ready apps with the Microsoft identity platform](/security/zero-trust/develop/identity)
- [Conditional Access authentication context](../conditional-access/concept-conditional-access-cloud-apps.md#authentication-context)
- [authenticationContextClassReference resource type - MS Graph](/graph/api/conditionalaccessroot-list-authenticationcontextclassreferences)
- [Claims challenge, claims request, and client capabilities in the Microsoft identity platform](claims-challenge.md)
- [Using authentication context with Microsoft Purview Information Protection and SharePoint](/purview/sensitivity-labels-teams-groups-sites#more-information-about-the-dependencies-for-the-authentication-context-option)
- [How to use Continuous Access Evaluation enabled APIs in your applications](app-resilience-continuous-access-evaluation.md)
