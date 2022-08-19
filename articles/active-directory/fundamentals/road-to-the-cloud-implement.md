---
title: Road to the cloud - Implementing a cloud-first approach when moving identity and access management from AD to Azure AD
description: Implement a cloud-first approach as part of planning your migration if IAM from AD to Azure AD.
documentationCenter: ''
author: janicericketts
manager: martinco
ms.service: active-directory
ms.topic: how-to
ms.subservice: fundamentals
ms.date: 06/03/2022
ms.author: jricketts
ms.custom: references_regions
---

# Implement cloud first approach

This is mainly a process and policy driven phase to stop, or limit as much as possible, adding new dependencies to AD and implement a cloud-first approach for new demand of IT solutions.

It's key at this point to identify the internal processes that would lead to adding new dependencies on AD. For example, most organizations would have a change management process that has to be followed before new scenarios/features/solutions are implemented. We strongly recommend making sure that these change approval processes are updated to include a step to evaluate whether the proposed change would add new dependencies on AD and request the evaluation of Azure AD alternatives when possible.

## Users and groups

You can enrich user attributes in Azure AD to make more user attributes available for inclusion. Examples of common scenarios that require rich user attributes include:

* App provisioning - The data source of app provisioning is Azure AD and necessary user attributes must be in there.

* Application authorization - Token issued by Azure AD can include claims generated from user attributes so that applications can make authorization decision based on the claims in token.

* Group membership population and maintenance - Dynamic groups enables dynamic population of group membership based on user attributes such as department information.

These two links provide guidance on making schema changes:

* [Understand the Azure AD schema and custom expressions](../cloud-sync/concept-attributes.md)

* [Attributes synchronized by Azure AD Connect](../hybrid/reference-connect-sync-attributes-synchronized.md)

These links provide additional information on this topic but are not specific to changing the schema:

* [Use Azure AD schema extension attributes in claims - Microsoft identity platform](../develop/active-directory-schema-extensions.md)

* [What are custom security attributes in Azure AD? (Preview) - Azure Active Directory](../fundamentals/custom-security-attributes-overview.md)

* [Tutorial - Customize Azure Active Directory attribute mappings in Application Provisioning](../app-provisioning/customize-application-attributes.md)

* [Provide optional claims to Azure AD apps - Microsoft identity platform](../develop/active-directory-optional-claims.md)

These links provide additional information relevant to groups:

* [Create or edit a dynamic group and get status - Azure AD](../enterprise-users/groups-create-rule.md)

* Use dynamic groups for automated group management

* Use self-service groups for user-initiated group management

* For application access, consider using [scope provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md) or [entitlement management](../governance/entitlement-management-overview.md)

For more information on group types, see [Compare groups](/microsoft-365/admin/create-groups/compare-groups).

* Use external identities for collaboration with other organizations - stop creating accounts of external users in on-premises directories

You and your team might feel compelled to change your current employee provisioning to use cloud-only accounts at this stage. The effort is non-trivial and doesn't provide enough business value to warrant the effort. We recommend you plan this transition at a different phase of your transformation.

## Devices

Client workstations are traditionally joined to AD and managed via group policy (GPO) and/or device management solutions such as Microsoft Endpoint Configuration Manager (MECM). Your teams will establish a new policy and process to prevent newly deployed workstations from being domain-joined going forward. Key points include:

* Mandate [Azure AD join](../devices/concept-azure-ad-join.md) for new Windows client workstations to achieve "No more domain join"

* Manage workstations from cloud by using Unified Endpoint Management (UEM) solutions such as [Intune](/mem/intune/fundamentals/what-is-intune)

[Windows Autopilot](/mem/autopilot/windows-autopilot) is highly recommended to establish a streamlined onboarding and device provisioning, which can enforce these directives.

For more information, see [Learn more about cloud-native endpoints](/mem/cloud-native-endpoints-overview)

## Applications

Traditionally, application servers are often joined to an on-premises Active Directory domain so that they can utilize Windows Integrated Authentication (Kerberos or NTLM), directory queries using LDAP and server management using Group Policy or Microsoft Endpoint Configuration Manager (MECM).

The organization has a process to evaluate Azure AD alternatives when considering new services/apps/infrastructure. Directives for a cloud-first approach to applications should be as follows (new on-premises/legacy applications should be a rare exception when no modern alternative exists):

* Provide recommendation to change procurement policy and application development policy to require modern protocols (OIDC/OAuth2 and SAML) and authenticate using Azure AD. New apps should also support [Azure AD App Provisioning](../app-provisioning/what-is-hr-driven-provisioning.md) and have no dependency on LDAP queries. Exceptions require explicit review and approval.

> [!IMPORTANT]
> Depending on anticipated demand of application that require legacy protocols, when more current alternatives are not feasible you can choose to deploy [Azure AD Domain Services](../../active-directory-domain-services/overview.md).

* Provide a recommendation to create a policy to prioritize use of cloud native alternatives. The policy should limit deployment of new application servers to the domain. Common cloud native scenarios to replace AD joined servers include:

   * File servers

     * SharePoint / OneDrive - Collaboration support across Microsoft 365 solutions and built-in governance, risk, security, and compliance.

     * [Azure Files](../../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry standard SMB or NFS protocol. Customers can use native [Azure AD authentication to Azure Files](../../virtual-desktop/create-profile-container-azure-ad.md) over the internet without line of sight to a DC.

     * Azure AD also works with third party applications in our [Application Gallery](/microsoft-365/enterprise/integrated-apps-and-azure-ads)

   * Print Servers

     * Mandate to procure [Universal Print](/universal-print/) compatible printers - [Partner Integrations](/universal-print/fundamentals/universal-print-partner-integrations)

     * Bridge with [Universal Print connector](/universal-print/fundamentals/universal-print-connector-overview) for non-compatible printers

## Next steps

[Introduction](road-to-the-cloud-introduction.md)

[Cloud transformation posture](road-to-the-cloud-posture.md)

[Establish an Azure AD footprint](road-to-the-cloud-establish.md)

[Transition to the cloud](road-to-the-cloud-migrate.md)
