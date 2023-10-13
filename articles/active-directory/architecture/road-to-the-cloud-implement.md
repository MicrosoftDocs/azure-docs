---
title: Road to the cloud - Implement a cloud-first approach when moving identity and access management from Active Directory to Microsoft Entra ID
description: Implement a cloud-first approach as part of planning your migration of IAM from Active Directory to Microsoft Entra ID.
documentationCenter: ''
author: janicericketts
manager: martinco
ms.service: active-directory
ms.topic: how-to
ms.subservice: fundamentals
ms.date: 07/27/2023
ms.author: jricketts
ms.custom: references_regions
---
# Implement a cloud-first approach

It's mainly a process and policy-driven phase to stop, or limit as much as possible, adding new dependencies to Active Directory and implement a cloud-first approach for new demand of IT solutions.

It's key at this point to identify the internal processes that would lead to adding new dependencies on Active Directory. For example, most organizations would have a change management process that has to be followed before the implementation of new scenarios, features, and solutions. We strongly recommend making sure that these change approval processes are updated to:

- Include a step to evaluate whether the proposed change would add new dependencies on Active Directory.
- Request the evaluation of Microsoft Entra alternatives when possible.

## Users and groups

You can enrich user attributes in Microsoft Entra ID to make more user attributes available for inclusion. Examples of common scenarios that require rich user attributes include:

* App provisioning: The data source of app provisioning is Microsoft Entra ID, and necessary user attributes must be in there.

* Application authorization: A token that Microsoft Entra ID issues can include claims generated from user attributes so that applications can make authorization decisions based on the claims in the token. It can also contain attributes coming from external data sources through a [custom claims provider](../develop/custom-claims-provider-overview.md).

* Group membership population and maintenance: Dynamic groups enable dynamic population of group membership based on user attributes, such as department information.

These two links provide guidance on making schema changes:

* [Understand the Microsoft Entra schema and custom expressions](../hybrid/cloud-sync/concept-attributes.md)

* [Attributes synchronized by Microsoft Entra Connect](../hybrid/connect/reference-connect-sync-attributes-synchronized.md)

These links provide more information on this topic but aren't specific to changing the schema:

* [Use Microsoft Entra schema extension attributes in claims - Microsoft identity platform](../develop/schema-extensions.md)

* [What are custom security attributes in Microsoft Entra ID (preview)?](../fundamentals/custom-security-attributes-overview.md)

* [Customize Microsoft Entra attribute mappings in application provisioning](../app-provisioning/customize-application-attributes.md)

* [Provide optional claims to Microsoft Entra apps - Microsoft identity platform](../develop/optional-claims.md)

These links provide more information about groups:

* [Create or edit a dynamic group and get status in Microsoft Entra ID](../enterprise-users/groups-create-rule.md)

* [Use self-service groups for user-initiated group management](../enterprise-users/groups-self-service-management.md)

* [Attribute-based application provisioning with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md) or [What is Microsoft Entra entitlement management?](../governance/entitlement-management-overview.md) (for application access)

* [Compare groups](/microsoft-365/admin/create-groups/compare-groups)

* [Restrict guest access permissions in Microsoft Entra ID](../enterprise-users/users-restrict-guest-permissions.md)

You and your team might feel compelled to change your current employee provisioning to use cloud-only accounts at this stage. The effort is nontrivial but doesn't provide enough business value. We recommend that you plan this transition at a different phase of your transformation.

## Devices

Client workstations are traditionally joined to Active Directory and managed via Group Policy objects (GPOs) or device management solutions such as Microsoft Configuration Manager. Your teams will establish a new policy and process to prevent newly deployed workstations from being domain joined. Key points include:

* Mandate [Microsoft Entra join](../devices/concept-directory-join.md) for new Windows client workstations to achieve "no more domain join."

* Manage workstations from the cloud by using unified endpoint management (UEM) solutions such as [Intune](/mem/intune/fundamentals/what-is-intune).

[Windows Autopilot](/mem/autopilot/windows-autopilot) can help you establish a streamlined onboarding and device provisioning, which can enforce these directives.

[Windows Local Administrator Password Solution](../devices/howto-manage-local-admin-passwords.md) (LAPS) enables a cloud-first solution to manage the passwords of local administrator accounts.

For more information, see [Learn more about cloud-native endpoints](/mem/solutions/cloud-native-endpoints/cloud-native-endpoints-overview).

## Applications

Traditionally, application servers are often joined to an on-premises Active Directory domain so that they can use Windows Integrated Authentication (Kerberos or NTLM), directory queries through LDAP, and server management through GPO or Microsoft Configuration Manager.

The organization has a process to evaluate Microsoft Entra alternatives when it's considering new services, apps, or infrastructure. Directives for a cloud-first approach to applications should be as follows. (New on-premises applications or legacy applications should be a rare exception when no modern alternative exists.)

* Provide a recommendation to change the procurement policy and application development policy to require modern protocols (OIDC/OAuth2 and SAML) and authenticate by using Microsoft Entra ID. New apps should also support [Microsoft Entra app provisioning](../app-provisioning/what-is-hr-driven-provisioning.md) and have no dependency on LDAP queries. Exceptions require explicit review and approval.

  > [!IMPORTANT]
  > Depending on the anticipated demands of applications that require legacy protocols, you can choose to deploy [Microsoft Entra Domain Services](/entra/identity/domain-services/overview) when more current alternatives won't work.

* Provide a recommendation to create a policy to prioritize use of cloud-native alternatives. The policy should limit deployment of new application servers to the domain. Common cloud-native scenarios to replace Active Directory-joined servers include:

   * File servers:

     * SharePoint or OneDrive provides collaboration support across Microsoft 365 solutions and built-in governance, risk, security, and compliance.

     * [Azure Files](/azure/storage/files/storage-files-introduction) offers fully managed file shares in the cloud that are accessible via the industry-standard SMB or NFS protocol. Customers can use native [Microsoft Entra authentication to Azure Files](/azure/virtual-desktop/create-profile-container-azure-ad) over the internet without line of sight to a domain controller.

     * Microsoft Entra ID works with third-party applications in the Microsoft [application gallery](/microsoft-365/enterprise/integrated-apps-and-azure-ads).

   * Print servers:

     * If your organization has a mandate to procure [Universal Print](/universal-print/)-compatible printers, see [Partner integrations](/universal-print/fundamentals/universal-print-partner-integrations).

     * Bridge with the [Universal Print connector](/universal-print/fundamentals/universal-print-connector-overview) for incompatible printers.

## Next steps

* [Introduction](road-to-the-cloud-introduction.md)
* [Cloud transformation posture](road-to-the-cloud-posture.md)
* [Establish a Microsoft Entra footprint](road-to-the-cloud-establish.md)
* [Transition to the cloud](road-to-the-cloud-migrate.md)
