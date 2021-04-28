---
title: "What's new in Azure Active Directory business-to-customer (B2C)"
description: "New and updated documentation for the Azure Active Directory business-to-customer (B2C)."
ms.date: 04/28/2021
ms.service: active-directory
ms.subservice: B2C
ms.topic: reference
ms.workload: identity
ms.author: mimart
author: msmimart
manager: CelesteDG
---

# Azure Active Directory B2C: What's new

Welcome to what's new in Azure Active Directory B2C documentation. This article lists new docs that have been added and those that have had significant updates in the last three months. To learn what's new with the B2C service, see [What's new in Azure Active Directory](../active-directory/fundamentals/whats-new.md).

## March 2021

### New articles

- [Enable custom domains for Azure Active Directory B2C](custom-domain.md)
- [Investigate risk with Identity Protection in Azure AD B2C](identity-protection-investigate-risk.md)
- [Set up sign-up and sign-in with an Apple ID  using Azure Active Directory B2C (Preview)](identity-provider-apple-id.md)
- [Set up a force password reset flow in Azure Active Directory B2C](force-password-reset.md)
- [Embedded sign-in experience](embedded-login.md)

### Updated articles

- [Set up sign-up and sign-in with an Amazon account using Azure Active Directory B2C](identity-provider-amazon.md)
- [Set up sign-in with a Salesforce SAML provider by using SAML protocol in Azure Active Directory B2C](identity-provider-salesforce-saml.md)
- [Migrate an OWIN-based web API to b2clogin.com or a custom domain](multiple-token-endpoints.md)
- [Technical profiles](technicalprofiles.md)
- [Add Conditional Access to user flows in Azure Active Directory B2C](conditional-access-user-flow.md)
- [Set up a password reset flow in Azure Active Directory B2C](add-password-reset-policy.md)
- [RelyingParty](relyingparty.md)


## February 2021

- [Keep me signed in (KMSI)](https://docs.microsoft.com/azure/active-directory-b2c/session-behavior?pivots=b2c-user-flow#enable-keep-me-signed-in-kmsi) is now supported by user flows. This article shows how one can enable the KMSI feature for users of  web and native applications

## January 2021

### New articles

- [Customize the user interface in Azure Active Directory B2C](customize-ui.md)
- [Azure Active Directory B2C service limits and restrictions](service-limits.md)
- [Set up sign-up and sign-in with an Azure AD B2C account from another Azure AD B2C tenant](identity-provider-azure-ad-b2c.md)
- [Set up the local account identity provider](identity-provider-local.md)
- [Set up a sign-in flow in Azure Active Directory B2C](add-sign-in-policy.md)

### Updated articles

- [Track user behavior in Azure Active Directory B2C using Application Insights](analytics-with-application-insights.md)
- [TechnicalProfiles](technicalprofiles.md)
- [Customize the user interface with HTML templates in Azure Active Directory B2C](customize-ui-with-html.md)
- [Manage Azure AD B2C with Microsoft Graph](microsoft-graph-operations.md)
- [Add AD FS as a SAML identity provider using custom policies in Azure Active Directory B2C](identity-provider-adfs.md)
- [Set up sign-in with a Salesforce SAML provider by using SAML protocol in Azure Active Directory B2C](identity-provider-salesforce-saml.md)
- [Tutorial: Register a web application in Azure Active Directory B2C](tutorial-register-applications.md)
- [Set up sign-up and sign-in with an Amazon account using Azure Active Directory B2C](identity-provider-amazon.md)
- [Set up sign-up and sign-in with an Azure AD B2C account from another Azure AD B2C tenant](identity-provider-azure-ad-b2c.md)
- [Set up sign-in for multi-tenant Azure Active Directory using custom policies in Azure Active Directory B2C](identity-provider-azure-ad-multi-tenant.md)
- [Set up sign-in for a specific Azure Active Directory organization in Azure Active Directory B2C](identity-provider-azure-ad-single-tenant.md)
- [Set up sign-up and sign-in with a Facebook account using Azure Active Directory B2C](identity-provider-facebook.md)
- [Set up sign-up and sign-in with a GitHub account using Azure Active Directory B2C](identity-provider-github.md)
- [Set up sign-up and sign-in with a Google account using Azure Active Directory B2C](identity-provider-google.md)
- [Set up sign-up and sign-in with a ID.me account using Azure Active Directory B2C](identity-provider-id-me.md)
- [Set up sign-up and sign-in with a LinkedIn account using Azure Active Directory B2C](identity-provider-linkedin.md)
- [Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C](identity-provider-microsoft-account.md)
- [Set up sign-up and sign-in with a QQ account using Azure Active Directory B2C](identity-provider-qq.md)
- [Set up sign-up and sign-in with a Salesforce account using Azure Active Directory B2C](identity-provider-salesforce.md)
- [Set up sign-up and sign-in with a Twitter account using Azure Active Directory B2C](identity-provider-twitter.md)
- [Set up sign-up and sign-in with a WeChat account using Azure Active Directory B2C](identity-provider-wechat.md)
- [Set up sign-up and sign-in with a Weibo account using Azure Active Directory B2C](identity-provider-weibo.md)
- [Azure AD B2C custom policy overview](custom-policy-overview.md)


## December 2020

### New articles

- [Create a user flow in Azure Active Directory B2C](add-sign-up-and-sign-in-policy.md)
- [Set up phone sign-up and sign-in for user flows (preview)](phone-authentication-user-flows.md)

### Updated articles

- [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md)
- [Azure Active Directory B2C code samples](code-samples.md)
- [Page layout versions](page-layout.md)

## November 2020

- [Set up phone sign-up and sign-in with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/phone-authentication) This article discusses how to use  custom policies to enable your customers to sign up and sign in to your applications through a one-time password sent to their phone.
-  Learn how to transfer the Azure AD B2C auditing logs to an Azure Log Analytics workspace, and [create a dashboard or create alerts that are based on Azure AD B2C users' activities](https://docs.microsoft.com/azure/active-directory-b2c/azure-monitor). 


## October 2020

- [Use API connectors to customize and extend sign-up user flows](https://docs.microsoft.com/azure/active-directory-b2c/api-connectors-overview) This article discusses how developers can use API connectors to integrate yur sign-up user flows with web APIs to customize the sign-up experience and integrate with external systems.
- [User phone number CRUD operations MS Graph API](https://docs.microsoft.com/azure/active-directory-b2c/microsoft-graph-operations#user-phone-number-management) This article shows how Azure AD B2C can be managed through Microsoft Graph.
- [User input validation delay](https://docs.microsoft.com/azure/active-directory-b2c/self-asserted-technical-profile#metadata) using `setting.inputVerificationDelayTimeInMilliseconds` metadata.
- [Display control UI new localization](https://docs.microsoft.com/azure/active-directory-b2c/localization-string-ids#verification-display-control-user-interface-elements) format. This example shows the use of some of the user interface elements in the MFA enrollment page

- [SubJourneys](https://docs.microsoft.com/azure/active-directory-b2c/subjourneys) can be used to organize and simplify the flow of orchestration steps within a user journey.
- [ID token hint](https://docs.microsoft.com/azure/active-directory-b2c/id-token-hint) allows relying party applications to send an inbound JWT as part of the OAuth2 authorization request. 
- [Documentation]
   - Provide optional claims to your app, [user flow](https://docs.microsoft.com/azure/active-directory-b2c/configure-tokens#provide-optional-claims-to-your-app) and [custom policy](https://docs.microsoft.com/azure/active-directory-b2c/configure-tokens-custom-policy#provide-optional-claims-to-your-app)
   - [Localization XML samples](https://docs.microsoft.com/azure/active-directory-b2c/localization-string-ids#sign-up-or-sign-in-example)
   - Configure Application Insights in Production for [error handling](https://docs.microsoft.com/azure/active-directory-b2c/troubleshoot-with-application-insights#configure-application-insights-in-production)
   - [Remote profile solution](https://docs.microsoft.com/azure/active-directory-b2c/data-residency#remote-profile-solution) allows you to store and read user profiles from a remote database.
   - [Using application Id in the scope](https://docs.microsoft.com/azure/active-directory-b2c/access-tokens#openid-connect-scopes) The OpenID Connect standard specifies several special scope values
   - [Facebook app registration new steps](https://docs.microsoft.com/azure/active-directory-b2c/identity-provider-facebook)
   - [Migrating to page layout sample](https://docs.microsoft.com/azure/active-directory-b2c/contentdefinitions#migrating-to-page-layout)
   - Add AD FS as a SAML identity provider [troubleshooting](https://docs.microsoft.com/azure/active-directory-b2c/identity-provider-adfs2016-custom?tabs=app-reg-ga#troubleshooting-ad-fs-service)
- SAML Protocol
   - [SAML IDP initiated support](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers#enable-identity-provider-initiated-flow-optional) This article discusses how you can connect your Security Assertion Markup Language (SAML) applications (service providers) to Azure Active Directory B2C (Azure AD B2C) for authentication.
   - [SAML token spec and customization](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers#saml-token) 
   - [SAML new metadata TokenNotBeforeSkewInSeconds](https://docs.microsoft.com/azure/active-directory-b2c/saml-issuer-technical-profile#metadata)
   - [SAML relying party WantsSignedResponses and XmlSignatureAlgorithm metadata](https://docs.microsoft.com/azure/active-directory-b2c/relyingparty#metadata)
   - New `{SAML:Subject}` [claim resolver](https://docs.microsoft.com/azure/active-directory-b2c/claim-resolver-overview#saml)
   - Use the [SAML identity provider technical profile](https://docs.microsoft.com/azure/active-directory-b2c/saml-identity-provider-technical-profile#input-claims) input InputClaims element to send a NameId within the Subject of the SAML AuthN Request.

## September 2020

### New articles
- [Overview of policy keys in Azure Active Directory B2C](policy-keys-overview.md)

### Updated articles
- [Set redirect URLs to b2clogin.com for Azure Active Directory B2C](b2clogin.md)
- [Define an OpenID Connect technical profile in an Azure Active Directory B2C custom policy](openid-connect-technical-profile.md)
- [Set up phone sign-up and sign-in with custom policies in Azure AD B2C](phone-authentication-user-flows.md)


## August 2020

### Updated articles
- [Page layout versions](page-layout.md)
- [Billing model for Azure Active Directory B2C](billing.md)

## June 2020

- [AD SSPR technical profile](https://docs.microsoft.com/azure/active-directory-b2c/aad-sspr-technical-profile) provides support for verifying an email address for self-service password reset (SSPR).
- [Custom email verification with Mailjet](https://docs.microsoft.com/azure/active-directory-b2c/custom-email-mailjet) This article describes how to use custom email in Azure Active Directory B2C (Azure AD B2C) to send customized email to users that sign up to use your applications

## May 2020

- [SAML Service provider in GA](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers) this article describes how to connect your Security Assertion Markup Language (SAML) applications (service providers) to Azure Active Directory B2C (Azure AD B2C) for authentication.
- [Azure AD B2C to Azure AD B2C federation](https://docs.microsoft.com/azure/active-directory-b2c/identity-provider-azure-ad-b2c?pivots=b2c-custom-policy) is supported.
- Learn how to:
   - [Configure session using custom policy, with single sign-out](https://docs.microsoft.com/azure/active-directory-b2c/session-behavior-custom-policy)
   - [Amazon federation app registration is updated with the Amazon new developer console](https://docs.microsoft.com/azure/active-directory-b2c/identity-provider-amazon-custom)

## April 2020

- [Single sign-out](https://docs.microsoft.com/azure/active-directory-b2c/session-overview#single-sign-out) for both OAuth2, OIDC and SAML relying party applications.
  - [Session overview](https://docs.microsoft.com/azure/active-directory-b2c/session-overview)
  - [GetSingleItemFromJson](https://docs.microsoft.com/azure/active-directory-b2c/json-transformations#getsingleitemfromjson) claims transformation
-  [SetClaimsIfRegexMatch](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#setclaimsifregexmatch) claims transformation now supports grouping extraction, to get a value from a string claim.
- [StringCollectionContainsClaim](https://docs.microsoft.com/azure/active-directory-b2c/stringcollection-transformations#stringcollectioncontainsclaim) claims transformation
- Claim resolver now supports [claim values](https://docs.microsoft.com/azure/active-directory-b2c/claim-resolver-overview#claims)
- SAML:RelayState [claim resolver](https://docs.microsoft.com/azure/active-directory-b2c/claim-resolver-overview#saml)

## March 2020

- Phone factor technical profile supports auto dial. For more information check the [metadata](https://docs.microsoft.com/azure/active-directory-b2c/phone-factor-technical-profile#metadata).
- [Keep me signed in (KMSI)](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-keep-me-signed-in) page layout version 1.2.0 and above requires `setting.enableRememberMe` metadata.
- Secure a REST API technical profile with [bearer token](https://docs.microsoft.com/azure/active-directory-b2c/secure-rest-api#oauth2-bearer-authentication)
- Azure AD B2C UI supports (in GA) Safari for iOS and macOS, version 12 and above [doc link](https://docs.microsoft.com/azure/active-directory-b2c/customize-ui-overview#custom-html-and-css)
- Documentation
  - [Recommendations and best practices for Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/best-practices)
  - [User profile attributes](https://docs.microsoft.com/azure/active-directory-b2c/user-profile-attributes)
  - [Phone factor technical profile](https://docs.microsoft.com/azure/active-directory-b2c/phone-factor-technical-profile)
  - [Application Insights technical profile ](https://docs.microsoft.com/azure/active-directory-b2c/application-insights-technical-profile)

- [claim resolvers](https://docs.microsoft.com/azure/active-directory-b2c/claim-resolver-overview) `{OIDC:scope}`, `{OIDC:RedirectUri}`, `{Context:KMSI}` and [SAML claims resolvers](https://docs.microsoft.com/azure/active-directory-b2c/claim-resolver-overview#saml)
- Azure AD attribute `signInNames` the unique sign in name of the local account user of **any type** in the directory . Use this to get a user with sign in value without specifying the local account type. For more information, see [Sign In and Sign Up with Username or Email sample](https://github.com/azure-ad-b2c/samples/tree/master/policies/username-or-email)

## February 2020

- [Document] Learn how to:
  - [Localize your custom verification email](https://docs.microsoft.com/azure/active-directory-b2c/custom-email#optional-localize-your-email)
  - [Manage Azure AD B2C with Microsoft Graph](https://docs.microsoft.com/azure/active-directory-b2c/microsoft-graph-get-started?tabs=applications)
  - [Manage Azure AD B2C user accounts with Microsoft Graph](https://docs.microsoft.com/azure/active-directory-b2c/manage-user-accounts-graph-api)
  - [Deploy custom policies with Azure Pipelines](https://docs.microsoft.com/azure/active-directory-b2c/deploy-custom-policies-devops)
  - [Manage Azure AD B2C custom policies with Azure PowerShell](https://docs.microsoft.com/azure/active-directory-b2c/manage-custom-policies-powershell)
  - [Guidelines for using custom page content](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-ui-customization#guidelines-for-using-custom-page-content)
  - [Claim data types](https://docs.microsoft.com/azure/active-directory-b2c/claimsschema#datatype) and [UserInputType](https://docs.microsoft.com/azure/active-directory-b2c/claimsschema#userinputtype)
- New Use [Azure Monitor](https://docs.microsoft.com/azure/active-directory-b2c/azure-monitor) to route Azure Azure AD B2C usage activity events to different monitoring solutions.
- New Claims transformations:
  - Boolean: [Compare Boolean claim to value](https://docs.microsoft.com/azure/active-directory-b2c/boolean-transformations#comparebooleanclaimtovalue).
  - Date: [Convert DateTime to Date claim](https://docs.microsoft.com/azure/active-directory-b2c/date-transformations#convertdatetimetodateclaim)
  - General: [Copy claim](https://docs.microsoft.com/azure/active-directory-b2c/general-transformations#copyclaim)
  - String: [String contains](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#stringcontains), [Substring](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#stringsubstring), [Find and replace](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#stringreplace), [String join](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#stringjoin),[ String split](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#stringsplit), [Set claims if Regex match](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#setclaimsifregexmatch), [Copies localized strings into claims](https://docs.microsoft.com/azure/active-directory-b2c/string-transformations#getlocalizedstringstransformation)
  - StringCollection: [String collection contains](https://docs.microsoft.com/azure/active-directory-b2c/stringcollection-transformations#stringcollectioncontains)
  - PhoneNumber: [ConvertPhoneNumberClaimToString](https://docs.microsoft.com/azure/active-directory-b2c/phone-number-claims-transformations#convertphonenumberclaimtostring), now you can convert a phoneNumber data type back into a string data type.

## January 2020

- [Python web app sample](https://docs.microsoft.com/azure/active-directory-b2c/code-samples#web-apps-and-apis) - Demonstrate how to Integrate B2C of Microsoft identity platform with a Python web application.
- Logout force to pass a previously issued ID token to the logout endpoint as a hint about the end user's current authenticated session with the client, is now supported with custom policies using `EnforceIdTokenHintOnLogout` attribute of the [SingleSignOn](https://docs.microsoft.com/azure/active-directory-b2c/relyingparty#singlesignon) element.
- [Company branding (preview)](https://docs.microsoft.com/azure/active-directory-b2c/customize-ui-overview#company-branding-preview) - You can customize your user flow pages with a banner logo, background image, and background color by using Azure Active Directory Company branding
- The Microsoft Azure AD B2C service is compatible with SameSite browser configurations, including support for SameSite=None with the Secure attribute. For more information, see [Azure AD B2C Cookie Definitions](https://docs.microsoft.com/azure/active-directory-b2c/cookie-definitions)

## December 2019

- Azure Active Directory B2C is [deprecating login.microsoftonline.com](https://azure.microsoft.com/updates/b2c-deprecate-msol/)
- [Azure MFA technical profile](https://docs.microsoft.com/azure/active-directory-b2c/multi-factor-auth-technical-profile) provides support for verifying a phone number by using Azure Multi-Factor Authentication (MFA).
- [Phone number claims transformations](https://docs.microsoft.com/azure/active-directory-b2c/phone-number-claims-transformations)
- [Phone sign-up and sign-in](https://docs.microsoft.com/azure/active-directory-b2c/phone-authentication) in Azure AD B2C enables your users to sign up and sign in to your applications by using a one-time password (OTP)
-SAML app registration, [learn how to configure Azure AD B2C to act as a SAML identity provider to your web applications.](https://docs.microsoft.com/azure/active-directory-b2c/connect-with-saml-service-providers)
- [Display Controls](https://docs.microsoft.com/azure/active-directory-b2c/display-controls) is a new user interface element that has special functionality and interacts with the Azure Active Directory B2C (Azure AD B2C) back-end service. It allows the user to perform actions on the page that invoke a validation technical profile at the back end.  Use a [Verification Display Control](https://docs.microsoft.com/azure/active-directory-b2c/display-control-verification) to verify a claim, for example an email address or phone number, with a verification code sent to the user. 
- Self-Asserted technical profile, now supports [Display Claims](https://docs.microsoft.com/azure/active-directory-b2c/self-asserted-technical-profile#display-claims) with reference to claim types and display controls.
- Azure AD B2C now provides support for managing the generation and verification of a one-time password. Use the [OTP technical profile](https://docs.microsoft.com/azure/active-directory-b2c/one-time-password-technical-profile) to generate a code, and then verify that code later.
- REST API technical profile, support of [JSON payload input claim](https://docs.microsoft.com/azure/active-directory-b2c/restful-technical-profile#send-a-json-payload)  
- REST API technical profile, support of sending bearer token that is stored in a policy key. Use `AuthenticationType` metadata to `Bearer`
- [GenerateJson](https://docs.microsoft.com/azure/active-directory-b2c/json-transformations) claims transformation generates a complex JSON using input claim and input parameters.
- Use [custom email](https://docs.microsoft.com/azure/active-directory-b2c/custom-email) in Azure AD B2C to send customized email to users that sign up to use your applications.

## November 2019

- [Use the Azure portal to create and delete consumer users in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/manage-users-portal) This article shows how a user can add or delete users through being assigned to the User administrator or Global administrator role.

- [app registration experience](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications?tabs=applications). With the new UX (in preview), you manage your Azure AD and Azure AD B2C applications in the same place.

- [Azure Active Directory B2C Monthly Active Users (MAU) pricing model](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-how-to-enable-billing) This article shows MAU billing, linking your Azure AD B2C tenants to a subscription, and changing your pricing tier.

- [Fix] When using `AlwaysUseDefaultValue` (in input claims or output claims) with a [claim resolver](https://docs.microsoft.com/azure/active-directory-b2c/claim-resolver-overview) . If the claim resolve is missing, B2C returns an empty string (without error message). For example, if the query string parameter `idp` is missing, the `selected_idp` contains an empty string.

    ```XML
    <InputClaim ClaimTypeReferenceId="selected_idp" DefaultValue="{OAUTH-KV:idp}" AlwaysUseDefaultValue="true" />
    ```

## October 2019

- [Manage password protection settings](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-threat-management#manage-password-protection-settings) This article helps you manage your passwords.

- [Use MS Graph API to perform CRUD operations against User Flows](https://docs.microsoft.com/graph/api/resources/identityuserflow?view=graph-rest-beta) User Flows enable you to define predefined, configurable policies for sign in, sign up, combined sign up and sign in, password reset and profile update

- [Use MS Graph API to perform CRUD operations against Custom Policies](https://docs.microsoft.com/graph/api/resources/trustframeworkpolicy?view=graph-rest-beta)

- [Use MS Graph API to perform CRUD operations against IEF Key Containers](https://docs.microsoft.com/graph/api/resources/trustframeworkkeyset?view=graph-rest-beta)

    - [MS Graph API samples](https://github.com/Azure-Samples/ActiveDirectory-B2C-MSGraph-PolicyAndKeysets) for User Flow, Custom Policies, and Key CRUD operations.

## August 2019

- Pass through an identity provider's access token in Azure AD B2C with [user flow](https://docs.microsoft.com/azure/active-directory-b2c/idp-pass-through-user-flow) and [custom policy](https://docs.microsoft.com/azure/active-directory-b2c/idp-pass-through-custom)

## May 2019

- [Azure AD admin roles for B2C are in public preview](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles#b2c-user-flow-administrator) This article lists the Azure AD built-in roles you can assign to allow management of Azure AD resources
