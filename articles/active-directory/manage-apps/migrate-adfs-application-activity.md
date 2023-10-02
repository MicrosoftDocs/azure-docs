---
title: Use the activity report to move AD FS apps to Microsoft Entra ID
description: The Active Directory Federation Services (AD FS) application activity report lets you quickly migrate applications from AD FS to Microsoft Entra ID. This migration tool for AD FS identifies compatibility with Microsoft Entra ID and gives migration guidance.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 03/23/2023
ms.author: jomondi
ms.collection: M365-identity-device-management
ms.reviewer: alamaral
ms.custom: not-enterprise-apps
---

# Review the application activity report

Many organizations use Active Directory Federation Services (AD FS) to provide single sign-on to cloud applications. There are significant benefits to moving your AD FS applications to Microsoft Entra ID for authentication, especially in terms of cost management, risk management, productivity, compliance, and governance. But understanding which applications are compatible with Microsoft Entra ID and identifying specific migration steps can be time consuming.

The AD FS application activity report in the [Microsoft Entra admin center](https://entra.microsoft.com) lets you quickly identify which of your applications are capable of being migrated to Microsoft Entra ID. It assesses all AD FS applications for compatibility with Microsoft Entra ID, checks for any issues, and gives guidance on preparing individual applications for migration. With the AD FS application activity report, you can:

* **Discover AD FS applications and scope your migration.** The AD FS application activity report lists all AD FS applications in your organization that have had an active user login in the last 30 days. The report indicates an apps readiness for migration to Microsoft Entra ID. The report doesn't display Microsoft related relying parties in AD FS such as Office 365. For example, relying parties with name 'urn:federation:MicrosoftOnline'.

* **Prioritize applications for migration.** Get the number of unique users who have signed in to the application in the past 1, 7, or 30 days to help determine the criticality or risk of migrating the application.
* **Run migration tests and fix issues.** The reporting service automatically runs tests to determine if an application is ready to migrate. The results are displayed in the AD FS application activity report as a migration status. If the AD FS configuration is not compatible with a Microsoft Entra configuration, you get specific guidance on how to address the configuration in Microsoft Entra ID.

The AD FS application activity data is available to users who are assigned any of these admin roles: global administrator, reports reader, security reader, application administrator, or cloud application administrator.

## Prerequisites

- Your organization must be currently using AD FS to access applications.
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, Global Reader, or owner of the service principal.
- Microsoft Entra Connect Health must be enabled in your Microsoft Entra tenant.
- The Microsoft Entra Connect Health for AD FS agent must be installed.
- [Learn more about Microsoft Entra Connect Health](../hybrid/connect/how-to-connect-health-adfs.md).
- [Get started with setting up Microsoft Entra Connect Health and install the AD FS agent](../hybrid/connect/how-to-connect-health-agent-install.md).


>[!IMPORTANT]
>There are a couple reasons you won't see all the applications you are expecting after you have installed Microsoft Entra Connect Health. The AD FS application activity report only shows AD FS relying parties with user logins in the last 30 days. Also, the report won't display Microsoft related relying parties such as Office 365.

## Discover AD FS applications that can be migrated

The AD FS application activity report is available in the Microsoft Entra admin center under Microsoft Entra ID **Usage & insights** reporting. The AD FS application activity report analyzes each AD FS application to determine if it can be migrated as-is, or if additional review is needed.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Under **Activity**, select **Usage & Insights**, and then select **AD FS application activity** to open a list of all AD FS applications in your organization.

   ![AD FS application activity](media/migrate-adfs-application-activity/adfs-application-activity.png)

1. For each application in the AD FS application activity list, view the **Migration status**:

   - **Ready to migrate** means the AD FS application configuration is fully supported in Microsoft Entra ID and can be migrated as-is.

   - **Needs review** means some of the application's settings can be migrated to Microsoft Entra ID, but you'll need to review the settings that can't be migrated as-is.

   - **Additional steps required** means Microsoft Entra ID doesn't support some of the application's settings, so the application can’t be migrated in its current state.

## Evaluate the readiness of an application for migration

1. In the AD FS application activity list, select the status in the **Migration status** column to open migration details. You'll see a summary of the configuration tests that passed, along with any potential migration issues.

   ![Migration details](media/migrate-adfs-application-activity/migration-details.png)

1. Select a message to open additional migration rule details. For a full list of the properties tested, see the [AD FS application configuration tests](#ad-fs-application-configuration-tests) table, below.

   ![Migration rule details](media/migrate-adfs-application-activity/migration-rule-details.png)

### AD FS application configuration tests

The following table lists all configuration tests that are performed on AD FS applications.

|Result  |Pass/Warning/Fail  |Description  |
|---------|---------|---------|
|Test-ADFSRPAdditionalAuthenticationRules <br> At least one non-migratable rule was detected for AdditionalAuthentication.       | Pass/Warning          | The relying party has rules to prompt for multifactor authentication. To move to Microsoft Entra ID, translate those rules into Conditional Access policies. If you're using an on-premises MFA, we recommend that you move to Microsoft Entra multifactor authentication. [Learn more about Conditional Access](../authentication/concept-mfa-howitworks.md).        |
|Test-ADFSRPAdditionalWSFedEndpoint <br> Relying party has AdditionalWSFedEndpoint set to true.       | Pass/Fail          | The relying party in AD FS allows multiple WS-Fed assertion endpoints. Currently, Microsoft Entra-only supports one. If you have a scenario where this result is blocking migration, [let us know](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).     |
|Test-ADFSRPAllowedAuthenticationClassReferences <br> Relying Party has set AllowedAuthenticationClassReferences.       | Pass/Fail          | This setting in AD FS lets you specify whether the application is configured to only allow certain authentication types. We recommend using Conditional Access to achieve this capability.  If you have a scenario where this result is blocking migration, [let us know](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).  [Learn more about Conditional Access](../authentication/concept-mfa-howitworks.md).         |
|Test-ADFSRPAlwaysRequireAuthentication <br> AlwaysRequireAuthenticationCheckResult      | Pass/Fail          | This setting in AD FS lets you specify whether the application is configured to ignore SSO cookies and **Always Prompt for Authentication**. In Microsoft Entra ID, you can manage the authentication session using Conditional Access policies to achieve similar behavior. [Learn more about configuring authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).          |
|Test-ADFSRPAutoUpdateEnabled <br> Relying Party has AutoUpdateEnabled set to true       | Pass/Warning          | This setting in AD FS lets you specify whether AD FS is configured to automatically update the application based on changes within the federation metadata. Microsoft Entra ID doesn't support this today but should not block the migration of the application to Microsoft Entra ID.           |
|Test-ADFSRPClaimsProviderName <br> Relying Party has multiple ClaimsProviders enabled       | Pass/Fail          | This setting in AD FS calls out the identity providers from which the relying party is accepting claims. In Microsoft Entra ID, you can enable external collaboration using Microsoft Entra B2B. [Learn more about Microsoft Entra B2B](../external-identities/what-is-b2b.md).          |
|Test-ADFSRPDelegationAuthorizationRules      | Pass/Fail          | The application has custom delegation authorization rules defined. This is a WS-Trust concept that  Microsoft Entra ID supports by using modern authentication protocols, such as OpenID Connect and OAuth 2.0. [Learn more about the Microsoft identity platform](../develop/v2-protocols-oidc.md).          |
|Test-ADFSRPImpersonationAuthorizationRules       | Pass/Warning          | The application has custom impersonation authorization rules defined. This is a WS-Trust concept that Microsoft Entra ID supports by using modern authentication protocols, such as OpenID Connect and OAuth 2.0. [Learn more about the Microsoft identity platform](../develop/v2-protocols-oidc.md).          |
|Test-ADFSRPIssuanceAuthorizationRules <br> At least one non-migratable rule was detected for IssuanceAuthorization.       | Pass/Warning          | The application has custom issuance authorization rules defined in AD FS. Microsoft Entra ID supports this functionality with Microsoft Entra Conditional Access. [Learn more about Conditional Access](../conditional-access/overview.md). <br> You can also restrict access to an application by user or groups assigned to the application. [Learn more about assigning users and groups to access applications](./assign-user-or-group-access-portal.md).            |
|Test-ADFSRPIssuanceTransformRules <br> At least one non-migratable rule was detected for IssuanceTransform.       | Pass/Warning          | The application has custom issuance transform rules defined in AD FS. Microsoft Entra ID supports customizing the claims issued in the token. To learn more, see [Customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).           |
|Test-ADFSRPMonitoringEnabled <br> Relying Party has MonitoringEnabled set to true.       | Pass/Warning          | This setting in AD FS lets you specify whether AD FS is configured to automatically update the application based on changes within the federation metadata. Microsoft Entra doesn’t support this today but should not block the migration of the application to Microsoft Entra ID.           |
|Test-ADFSRPNotBeforeSkew <br> NotBeforeSkewCheckResult      | Pass/Warning          | AD FS allows a time skew based on the NotBefore and NotOnOrAfter times in the SAML token. Microsoft Entra ID automatically handles this by default.          |
|Test-ADFSRPRequestMFAFromClaimsProviders <br> Relying Party has RequestMFAFromClaimsProviders set to true.       | Pass/Warning          | This setting in AD FS determines the behavior for MFA when the user comes from a different claims provider. In Microsoft Entra ID, you can enable external collaboration using Microsoft Entra B2B. Then, you can apply Conditional Access policies to protect guest access. Learn more about [Microsoft Entra B2B](../external-identities/what-is-b2b.md) and [Conditional Access](../conditional-access/overview.md).          |
|Test-ADFSRPSignedSamlRequestsRequired <br> Relying Party has SignedSamlRequestsRequired set to true       | Pass/Fail          | The application is configured in AD FS to verify the signature in the SAML request. Microsoft Entra ID accepts a signed SAML request; however, it will not verify the signature. Microsoft Entra ID has different methods to protect against malicious calls. For example, Microsoft Entra ID uses the reply URLs configured in the application to validate the SAML request. Microsoft Entra ID will only send a token to reply URLs configured for the application. If you have a scenario where this result is blocking migration, [let us know](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).          |
|Test-ADFSRPTokenLifetime <br> TokenLifetimeCheckResult        | Pass/Warning         | The application is configured for a custom token lifetime. The AD FS default is one hour. Microsoft Entra ID supports this functionality using Conditional Access. To learn more, see [Configure authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).          |
|Relying Party is set to encrypt claims. This is supported by Microsoft Entra ID       | Pass          | With Microsoft Entra ID, you can encrypt the token sent to the application. To learn more, see [Configure Microsoft Entra SAML token encryption](./howto-saml-token-encryption.md).          |
|EncryptedNameIdRequiredCheckResult      | Pass/Fail          | The application is configured to encrypt the nameID claim in the SAML token. With Microsoft Entra ID, you can encrypt the entire token sent to the application. Encryption of specific claims is not yet supported. To learn more, see [Configure Microsoft Entra SAML token encryption](./howto-saml-token-encryption.md).         |

## Check the results of claim rule tests

If you have configured a claim rule for the application in AD FS, the experience will provide a granular analysis for all the claim rules. You'll see which claim rules can be moved to Microsoft Entra ID and which ones need further review.

1. In the AD FS application activity list, select the status in the **Migration status** column to open migration details. You'll see a summary of the configuration tests that passed, along with any potential migration issues.

2. On the **Migration rule details** page, expand the results to display details about potential migration issues and to get additional guidance. For a detailed list of all claim rules tested, see the [Check the results of claim rule tests](#check-the-results-of-claim-rule-tests) table, below.

   The example below shows migration rule details for the IssuanceTransform rule. It lists the specific parts of the claim that need to be reviewed and addressed before you can migrate the application to Microsoft Entra ID.

   ![Migration rule details additional guidance](media/migrate-adfs-application-activity/migration-rule-details-guidance.png)

### Claim rule tests

The following table lists all claim rule tests that are performed on AD FS applications.

|Property  |Description  |
|---------|---------|
|UNSUPPORTED_CONDITION_PARAMETER      | The condition statement uses Regular Expressions to evaluate if the claim matches a certain pattern.  To achieve a similar functionality in Microsoft Entra ID, you can use pre-defined transformation such as  IfEmpty(), StartWith(), Contains(), among others. For more information, see [Customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).          |
|UNSUPPORTED_CONDITION_CLASS      | The condition statement has multiple conditions that need to be evaluated before running the issuance statement. Microsoft Entra ID may support this functionality with the claim’s transformation functions where you can evaluate multiple claim values.  For more information, see [Customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).          |
|UNSUPPORTED_RULE_TYPE      | The claim rule couldn’t be recognized. For more information on how to configure claims in Microsoft Entra ID, see [Customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).          |
|CONDITION_MATCHES_UNSUPPORTED_ISSUER      | The condition statement uses an Issuer that is not supported in Microsoft Entra ID. Currently, Microsoft Entra doesn’t source claims from stores different that Active Directory or Microsoft Entra ID. If this is blocking you from migrating applications to Microsoft Entra ID, [let us know](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).         |
|UNSUPPORTED_CONDITION_FUNCTION      | The condition statement uses an aggregate function to issue or add a single claim regardless of the number of matches.  In Microsoft Entra ID, you can evaluate the attribute of a user to decide what value to use for the claim with functions like IfEmpty(), StartWith(), Contains(), among others. For more information, see [Customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).          |
|RESTRICTED_CLAIM_ISSUED      | The condition statement uses a claim that is restricted in Microsoft Entra ID. You may be able to issue a restricted claim, but you can’t modify its source or apply any transformation. For more information, see [Customize claims emitted in tokens for a specific app in Microsoft Entra ID](../develop/saml-claims-customization.md).          |
|EXTERNAL_ATTRIBUTE_STORE      | The issuance statement uses an attribute store different that Active Directory. Currently, Microsoft Entra doesn’t source claims from stores different that Active Directory or Microsoft Entra ID. If this result is blocking you from migrating applications to Microsoft Entra ID, [let us know](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).          |
|UNSUPPORTED_ISSUANCE_CLASS      | The issuance statement uses ADD to add claims to the incoming claim set. In Microsoft Entra ID, this may be configured as multiple claim transformations.  For more information, see [Customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).         |
|UNSUPPORTED_ISSUANCE_TRANSFORMATION      | The issuance statement uses Regular Expressions to transform the value of the claim to be emitted. To achieve similar functionality in Microsoft Entra ID, you can use predefined transformation such as `Extract()`, `Trim()`, and `ToLower()`. For more information, see [Customize claims issued in the SAML token for enterprise applications](../develop/saml-claims-customization.md).          |

## Troubleshooting

### Can't see all my AD FS applications in the report

 If you have installed Microsoft Entra Connect Health but you still see the prompt to install it or you don't see all your AD FS applications in the report it may be that you don't have active AD FS applications or your AD FS applications are microsoft application.

 The AD FS application activity report lists all the AD FS applications in your organization with active users sign-in in the last 30 days. Also, the report doesn't display microsoft related relying parties in AD FS such as Office 365. For example, relying parties with name 'urn:federation:MicrosoftOnline', 'microsoftonline', 'microsoft:winhello:cert:prov:server' won't show up in the list.

## Next steps

* [Video: How to use the AD FS activity report to migrate an application](https://www.youtube.com/watch?v=OThlTA239lU)
* [Managing applications with Microsoft Entra ID](what-is-application-management.md)
* [Manage access to apps](what-is-access-management.md)
* [Microsoft Entra Connect federation](../hybrid/connect/how-to-connect-fed-whatis.md)
