---
title: Use the activity report to move AD FS apps to Azure Active Directory | Microsoft Docs'
description: The Active Directory Federation Services (AD FS) application activity report lets you quickly migrate applications from AD FS to Azure Active Directory (Azure AD). This migration tool for AD FS identifies compatibility with Azure AD and gives migration guidance.
services: active-directory
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 01/14/2019
ms.author: mimart
ms.collection: M365-identity-device-management
---

# Use the AD FS application activity report (preview) to migrate applications to Azure AD

Many organizations use Active Directory Federation Services (AD FS) to provide single sign-on to cloud applications. There are significant benefits to moving your AD FS applications to Azure AD for authentication, especially in terms of cost management, risk management, productivity, compliance, and governance. But understanding which applications are compatible with Azure AD and identifying specific migration steps can be time consuming.

The AD FS application activity report (preview) in the Azure portal lets you quickly identify which of your applications are capable of being migrated to Azure AD. It assesses all AD FS applications for compatibility with Azure AD, checks for any issues, and gives guidance on preparing individual applications for migration. With the AD FS application activity report, you can:

* **Discover AD FS applications and scope your migration.** The AD FS application activity report lists all the AD FS applications in your organization and indicates their readiness for migration to Azure AD.
* **Prioritize applications for migration.** Get the number of unique users who have signed in to the application in the past 1, 7, or 30 days to help determine the criticality or risk of migrating the application.
* **Run migration tests and fix issues.** The reporting service automatically runs tests to determine if an application is ready to migrate. The results are displayed in the AD FS application activity report as a migration status. If potential migration issues are identified, you get specific guidance on how to address the issues.

The AD FS application activity data is available to users who are assigned any of these admin roles: global administrator, report reader, security reader, application administrator, or cloud application administrator.

## Prerequisites

* Your organization must be currently using AD FS to access applications.
* Azure AD Connect Health must be enabled in your Azure AD tenant.
   * [Learn more about Azure AD Connect Health](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-health-adfs)
   * [Get started setting up Azure AD Connect Health](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-health-agent-install)

## Discover AD FS applications that can be migrated 

The AD FS application activity report is available in the Azure portal under Azure AD **Usage & insights** reporting. The AD FS application activity report analyzes each AD FS application to determine if it can be migrated as-is, or if additional review is needed. 

1. Sign in to the [Azure portal](https://portal.azure.com) with an admin role that has access to AD FS application activity data (global administrator, report reader, security reader, application administrator, or cloud application administrator).

2. Select **Azure Active Directory**, and then select **Enterprise applications**.

3. Under **Activity**, select **Usage & Insights (Preview)**, and then select **AD FS application activity** to open a list of all AD FS applications in your organization.

   ![AD FS application activity](media/migrate-adfs-application-activity/adfs-application-activity.png)

4. For each application in the AD FS application activity list, view the **Migration status**:

   * **Ready to migrate** means the AD FS application configuration is fully supported in Azure AD and can be migrated as-is.

   * **Needs review** means some of the application's settings can be migrated to Azure AD, but you'll need to review the settings that can't be migrated as-is.

   * **Additional steps required** means Azure AD doesn't support some of the application's settings, so the application can’t be migrated in its current state.

## Evaluate the readiness of an application for migration 

1. In the AD FS application activity list, click the status in the **Migration status** column to open migration details. You'll see a summary of the configuration tests that passed, along with any potential migration issues.

   ![Migration details](media/migrate-adfs-application-activity/migration-details.png)

2. Click a message to open additional migration rule details. For a full list of the properties tested, see the [AD FS application configuration tests](#ad-fs-application-configuration-tests) table, below.

   ![Migration rule details](media/migrate-adfs-application-activity/migration-rule-details.png)

### AD FS application configuration tests

The following table lists all configuration tests that are performed on AD FS applications.

|Result  |Pass/Warning/Fail  |Description  |
|---------|---------|---------|
|Test-ADFSRPAdditionalAuthenticationRules <br> At least one non-migratable rule was detected for AdditionalAuthentication.       | Pass/Warning          | The relying party has rules to prompt for multi-factor authentication (MFA). To move to Azure AD, translate those rules into Conditional Access policies. If you're using an on-premises MFA, we recommend that you move to Azure MFA. [Learn more about Conditional Access](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks).        |
|Test-ADFSRPAdditionalWSFedEndpoint <br> Relying party has AdditionalWSFedEndpoint set to true.       | Pass/Fail          | The relying party in AD FS allows multiple WS-Fed assertion endpoints. Currently, Azure AD only supports one. If you have a scenario where this result is blocking migration, [let us know](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/38695621-allow-multiple-ws-fed-assertion-endpoints).     |
|Test-ADFSRPAllowedAuthenticationClassReferences <br> Relying Party has set AllowedAuthenticationClassReferences.       | Pass/Fail          | This setting in AD FS lets you specify whether the application is configured to only allow certain authentication types. We recommend using Conditional Access to achieve this capability.  If you have a scenario where this result is blocking migration, [let us know](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/38695672-allow-in-azure-ad-to-specify-certain-authentication).  [Learn more about Conditional Access](https://docs.microsoft.com/azure/active-directory/authentication/concept-mfa-howitworks).          |
|Test-ADFSRPAlwaysRequireAuthentication <br> AlwaysRequireAuthenticationCheckResult      | Pass/Fail          | This setting in AD FS lets you specify whether the application is configured to ignore SSO cookies and **Always Prompt for Authentication**. In Azure AD, you can manage the authentication session using Conditional Access policies to achieve similar behavior. [Learn more about configuring authentication session management with Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/howto-conditional-access-session-lifetime).          |
|Test-ADFSRPAutoUpdateEnabled <br> Relying Party has AutoUpdateEnabled set to true       | Pass/Warning          | This setting in AD FS lets you specify whether AD FS is configured to automatically update the application based on changes within the federation metadata. Azure AD doesn’t support this today but should not block the migration of the application to Azure AD.           |
|Test-ADFSRPClaimsProviderName <br> Relying Party has multiple ClaimsProviders enabled       | Pass/Fail          | This setting in AD FS calls out the identity providers from which the relying party is accepting claims. In Azure AD, you can enable external collaboration using Azure AD B2B. [Learn more about Azure AD B2B](https://docs.microsoft.com/azure/active-directory/b2b/what-is-b2b).          |
|Test-ADFSRPDelegationAuthorizationRules      | Pass/Fail          | The application has custom delegation authorization rules defined. This is a WS-Trust concept that  Azure AD supports by using modern authentication protocols, such as OpenID Connect and OAuth 2.0. [Learn more about the Microsoft Identity Platform](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc).          |
|Test-ADFSRPImpersonationAuthorizationRules       | Pass/Warning          | The application has custom impersonation authorization rules defined. This is a WS-Trust concept that Azure AD supports by using modern authentication protocols, such as OpenID Connect and OAuth 2.0. [Learn more about the Microsoft Identity Platform](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc).          |
|Test-ADFSRPIssuanceAuthorizationRules <br> At least one non-migratable rule was detected for IssuanceAuthorization.       | Pass/Warning          | The application has custom issuance authorization rules defined in AD FS. Azure AD supports this functionality with Azure AD Conditional Access. [Learn more about Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview). <br> You can also restrict access to an application by user or groups assigned to the application. [Learn more about assigning users and groups to access applications](https://docs.microsoft.com/azure/active-directory/manage-apps/methods-for-assigning-users-and-groups).            |
|Test-ADFSRPIssuanceTransformRules <br> At least one non-migratable rule was detected for IssuanceTransform.       | Pass/Warning          | The application has custom issuance transform rules defined in AD FS. Azure AD supports customizing the claims issued in the token. To learn more, see [Customize claims issued in the SAML token for enterprise applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization).           |
|Test-ADFSRPMonitoringEnabled <br> Relying Party has MonitoringEnabled set to true.       | Pass/Warning          | This setting in AD FS lets you specify whether AD FS is configured to automatically update the application based on changes within the federation metadata. Azure AD doesn’t support this today but should not block the migration of the application to Azure AD.           |
|Test-ADFSRPNotBeforeSkew <br> NotBeforeSkewCheckResult      | Pass/Warning          | AD FS allows a time skew based on the NotBefore and NotOnOrAfter times in the SAML token. Azure AD automatically handles this by default.          |
|Test-ADFSRPRequestMFAFromClaimsProviders <br> Relying Party has RequestMFAFromClaimsProviders set to true.       | Pass/Warning          | This setting in AD FS determines the behavior for MFA when the user comes from a different claims provider. In Azure AD, you can enable external collaboration using Azure AD B2B. Then, you can apply Conditional Access policies to protect guest access. Learn more about [Azure AD B2B](https://docs.microsoft.com/azure/active-directory/b2b/what-is-b2b) and [Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview).          |
|Test-ADFSRPSignedSamlRequestsRequired <br> Relying Party has SignedSamlRequestsRequired set to true       | Pass/Fail          | The application is configured in AD FS to verify the signature in the SAML request. Azure AD accepts a signed SAML request; however, it will not verify the signature. Azure AD has different methods to protect against malicious calls. For example, Azure AD uses the reply URLs configured in the application to validate the SAML request. Azure AD will only send a token to reply URLs configured for the application. If you have a scenario where this result is blocking migration, [let us know](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/13394589-saml-signature).          |
|Test-ADFSRPTokenLifetime <br> TokenLifetimeCheckResult        | Pass/Warning         | The application is configured for a custom token lifetime. The AD FS default is one hour. Azure AD supports this functionality using Conditional Access. To learn more, see [Configure authentication session management with Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/howto-conditional-access-session-lifetime).          |
|Relying Party is set to encrypt claims. This is supported by Azure AD       | Pass          | With Azure AD, you can encrypt the token sent to the application. To learn more, see [Configure Azure AD SAML token encryption](https://docs.microsoft.com/azure/active-directory/manage-apps/howto-saml-token-encryption).          |
|EncryptedNameIdRequiredCheckResult      | Pass/Fail          | The application is configured to encrypt the nameID claim in the SAML token. With Azure AD, you can encrypt the entire token sent to the application. Encryption of specific claims is not yet supported. To learn more, see [Configure Azure AD SAML token encryption](https://docs.microsoft.com/azure/active-directory/manage-apps/howto-saml-token-encryption).         |

## Check the results of claim rule tests

If you have configured a claim rule for the application in AD FS, the experience will provide a granular analysis for all the claim rules. You'll see which claim rules can be moved to Azure AD and which ones need further review.

1. In the AD FS application activity list, click the status in the **Migration status** column to open migration details. You'll see a summary of the configuration tests that passed, along with any potential migration issues.

2. On the **Migration rule details** page, expand the results to display details about potential migration issues and to get additional guidance. For a detailed list of all claim rules tested, see the [Check the results of claim rule tests](#check-the-results-of-claim-rule-tests) table, below.

   The example below shows migration rule details for the IssuanceTransform rule. It lists the specific parts of the claim that need to be reviewed and addressed before you can migrate the application to Azure AD.

   ![Migration rule details additional guidance](media/migrate-adfs-application-activity/migration-rule-details-guidance.png)

### Claim rule tests

The following table lists all claim rule tests that are performed on AD FS applications.

|Property  |Description  |
|---------|---------|
|UNSUPPORTED_CONDITION_PARAMETER      | The condition statement uses Regular Expressions to evaluate if the claim matches a certain pattern.  To achieve a similar functionality in Azure AD, you can use pre-defined transformation such as  IfEmpty(), StartWith(), Contains(), among others. For more information, see [Customize claims issued in the SAML token for enterprise applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization).          |
|UNSUPPORTED_CONDITION_CLASS      | The condition statement has multiple conditions that need to be evaluated before running the issuance statement. Azure AD may support this functionality with the claim’s transformation functions where you can evaluate multiple claim values.  For more information, see [Customize claims issued in the SAML token for enterprise applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization).          |
|UNSUPPORTED_RULE_TYPE      | The claim rule couldn’t be recognized. For more information on how to configure claims in Azure AD, see [Customize claims issued in the SAML token for enterprise applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization).          |
|CONDITION_MATCHES_UNSUPPORTED_ISSUER      | The condition statement uses an Issuer that is not supported in Azure AD. Currently, Azure AD doesn’t source claims from stores different that Active Directory or Azure AD. If this is blocking you from migrating applications to Azure AD, [let us know](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/38695717-allow-to-source-user-attributes-from-external-dire).         |
|UNSUPPORTED_CONDITION_FUNCTION      | The condition statement uses an aggregate function to issue or add a single claim regardless of the number of matches.  In Azure AD, you can evaluate the attribute of a user to decide what value to use for the claim with functions like IfEmpty(), StartWith(), Contains(), among others. For more information, see [Customize claims issued in the SAML token for enterprise applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization).          |
|RESTRICTED_CLAIM_ISSUED      | The condition statement uses a claim that is restricted in Azure AD. You may be able to issue a restricted claim, but you can’t modify its source or apply any transformation. For more information, see [Customize claims emitted in tokens for a specific app in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-claims-mapping).          |
|EXTERNAL_ATTRIBUTE_STORE      | The issuance statement uses an attribute store different that Active Directory. Currently, Azure AD doesn’t source claims from stores different that Active Directory or Azure AD. If this result is blocking you from migrating applications to Azure AD, [let us know](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/38695717-allow-to-source-user-attributes-from-external-dire).          |
|UNSUPPORTED_ISSUANCE_CLASS      | The issuance statement uses ADD to add claims to the incoming claim set. In Azure AD, this may be configured as multiple claim transformations.  For more information, see [Customize claims issued in the SAML token for enterprise applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-claims-mapping).         |
|UNSUPPORTED_ISSUANCE_TRANSFORMATION      | The issuance statement uses Regular Expressions to transform the value of the claim to be emitted. To achieve similar functionality in Azure AD, you can use pre-defined transformation such as Extract(), Trim(), ToLower, among others. For more information, see [Customize claims issued in the SAML token for enterprise applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization).          |


## Next steps

- [Video: How to use the AD FS activity report to migrate an application](https://www.youtube.com/watch?v=OThlTA239lU)
- [Managing applications with Azure Active Directory](what-is-application-management.md)
- [Manage access to apps](what-is-access-management.md)
- [Azure AD Connect federation](../hybrid/how-to-connect-fed-whatis.md)
