# [Azure Active Directory Documentation](index.md)

# Overview
## [What is Azure Active Directory?](fundamentals/active-directory-whatis.md)
## [About Azure identity management](fundamentals/identity-fundamentals.md)
## [Understand Azure identity solutions](fundamentals/understand-azure-identity-solutions.md)
## [Choose a hybrid identity solution](choose-hybrid-identity-solution.md)
## [Associate Azure subscriptions](fundamentals/active-directory-how-subscriptions-associated-directory.md)
## [Residency and data considerations](fundamentals/active-directory-data-storage-eu.md)
## [FAQs](fundamentals/active-directory-faq.md)
## [What's New](fundamentals/whats-new.md)


# Get started
## [Get started with Azure AD](fundamentals/get-started-azure-ad.md)
## [Sign up for Azure AD Premium](fundamentals/active-directory-get-started-premium.md)
## [Add a custom domain name](fundamentals/add-custom-domain.md)
## [Configure company branding](fundamentals/customize-branding.md)
## [Add users to Azure AD](fundamentals/add-users-azure-active-directory.md)
## [Assign licenses to users](fundamentals/license-users-groups.md)
## [Configure Self-service password reset](authentication/quickstart-sspr.md)
## [Add your organization's privacy info in Azure AD](active-directory-properties-area.md)


# How to
## Plan and design
### [Understand Azure AD architecture](fundamentals/active-directory-architecture.md)
### [Claims mapping in Azure Active Directory](active-directory-claims-mapping.md)
### [Deploy a hybrid identity solution](active-directory-hybrid-identity-design-considerations-overview.md)
#### Determine requirements
##### [Identity](active-directory-hybrid-identity-design-considerations-business-needs.md)
##### [Directory sync](active-directory-hybrid-identity-design-considerations-directory-sync-requirements.md)
##### [Multi-factor auth](active-directory-hybrid-identity-design-considerations-multifactor-auth-requirements.md)
##### [Identity lifecycle strategy](active-directory-hybrid-identity-design-considerations-lifecycle-adoption-strategy.md)
#### [Plan for data security](active-directory-hybrid-identity-design-considerations-data-protection-strategy.md)
##### [Data protection](active-directory-hybrid-identity-design-considerations-dataprotection-requirements.md)
##### [Content management](active-directory-hybrid-identity-design-considerations-contentmgt-requirements.md)
##### [Access control](active-directory-hybrid-identity-design-considerations-accesscontrol-requirements.md)
##### [Incident response](active-directory-hybrid-identity-design-considerations-incident-response-requirements.md)
#### Plan your identity lifecycle
##### [Tasks](active-directory-hybrid-identity-design-considerations-hybrid-id-management-tasks.md)
##### [Adoption strategy](active-directory-hybrid-identity-design-considerations-identity-adoption-strategy.md)
#### [Next steps](active-directory-hybrid-identity-design-considerations-nextsteps.md)
#### [Tools comparison](active-directory-hybrid-identity-design-considerations-tools-comparison.md)

## Manage users
### [Add new users to Azure AD](fundamentals/add-users-azure-active-directory.md)
### [Manage user profiles](fundamentals/active-directory-users-profile-azure-portal.md)
### [Share accounts](active-directory-sharing-accounts.md)
### [Assign users to admin roles](fundamentals/active-directory-users-assign-role-azure-portal.md)
### [Restore a deleted user](fundamentals/active-directory-users-restore.md)
### [Add guest users from another directory (B2B)](b2b/what-is-b2b.md)
#### [Admins adding B2B users](b2b/add-users-administrator.md)
#### [Information workers adding B2B users](b2b/add-users-information-worker.md)
#### [API and customization](b2b/customize-invitation-api.md)
#### [Code and Azure PowerShell samples](b2b/code-samples.md)
#### [Self-service sign-up portal sample](b2b/self-service-portal.md)
#### [Invitation email](b2b/invitation-email-elements.md)
#### [Invitation redemption](b2b/redemption-experience.md)
#### [Add B2B users without an invitation](b2b/add-user-without-invite.md)
#### [Allow or block invitations](b2b/allow-deny-list.md)
#### [Conditional access for B2B](b2b/conditional-access.md)
#### [B2B sharing policies](b2b/delegate-invitations.md)
#### [Add a B2B user to a role](b2b/add-guest-to-role.md)
#### [Dynamic groups and B2B users](b2b/use-dynamic-groups.md)
#### [Leave an organization](b2b/leave-the-organization.md)
#### [Auditing and reports](b2b/auditing-and-reporting.md)
#### [B2B for hybrid organizations](b2b/hybrid-organizations.md)
##### [Grant B2B users access to local apps](b2b/hybrid-cloud-to-on-premises.md)
##### [Grant local users access to cloud apps](b2b/hybrid-on-premises-to-cloud.md)
#### [B2B and Office 365 external sharing](b2b/o365-external-user.md)
#### [B2B licensing](b2b/licensing-guidance.md)
#### [Current limitations](b2b/current-limitations.md)
#### [FAQ](b2b/faq.md)
#### [Troubleshooting B2B](b2b/troubleshoot.md)
#### [Understand the B2B user](b2b/user-properties.md)
#### [B2B user token](b2b/user-token.md)
#### [B2B for Azure AD integrated apps](b2b/configure-saas-apps.md)
#### [B2B user claims mapping](b2b/claims-mapping.md)
#### [Compare B2B collaboration to B2C](b2b/compare-with-b2c.md)
#### [Getting support for B2B](b2b/get-support.md)

## [Manage groups and members](fundamentals/active-directory-manage-groups.md)
### Manage groups
#### [Azure portal](fundamentals/active-directory-groups-create-azure-portal.md)
#### [Azure AD PowerShell for Graph (v2)](users-groups-roles/groups-settings-v2-cmdlets.md)
#### [Azure AD PowerShell MSOnline](users-groups-roles/groups-settings-cmdlets.md)
### [Manage group members](fundamentals/active-directory-groups-members-azure-portal.md)
### [Manage group owners](fundamentals/active-directory-accessmanagement-managing-group-owners.md)
### [Manage group membership](fundamentals/active-directory-groups-membership-azure-portal.md)
### [Assign licenses using groups](fundamentals/active-directory-licensing-whatis-azure-portal.md)
#### [Assign licenses to a group](users-groups-roles/licensing-groups-assign.md)
#### [Identify and resolve license problems in a group](users-groups-roles/licensing-groups-resolve-problems.md)
#### [Migrate individual licensed users to group-based licensing](users-groups-roles/licensing-groups-migrate-users.md)
#### [Migrate users between product licenses](users-groups-roles/licensing-groups-change-licenses.md)
#### [Additional scenarios for group-based licensing](users-groups-roles/licensing-group-advanced.md)
#### [Azure PowerShell examples for group-based licensing](users-groups-roles/licensing-ps-examples.md)
#### [Reference for products and service plans in Azure AD](users-groups-roles/licensing-service-plan-reference.md)
### [Set up Office 365 groups expiration](users-groups-roles/groups-lifecycle.md)
### [Enforce a naming policy for groups](users-groups-roles/groups-naming-policy.md)
### [View all groups](fundamentals/active-directory-groups-view-azure-portal.md)
### [Add group access to SaaS apps](users-groups-roles/groups-saasapps.md)
### [Restore a deleted Office 365 group](fundamentals/active-directory-groups-restore-azure-portal.md)
### [Manage group settings](fundamentals/active-directory-groups-settings-azure-portal.md) 
### Create advanced rules
#### [Azure portal](users-groups-roles/groups-dynamic-membership.md)
### [Set up self-service groups](users-groups-roles/groups-self-service-management.md)
### [Troubleshoot](users-groups-roles/groups-troubleshooting.md)

## [Manage reports](active-directory-reporting-azure-portal.md)
### [Sign-ins activity](active-directory-reporting-activity-sign-ins.md)
### [Audit activity](active-directory-reporting-activity-audit-logs.md)
### [Users at risk](active-directory-reporting-security-user-at-risk.md)
### [Risky sign-ins](active-directory-reporting-security-risky-sign-ins.md)
### [Risk events](active-directory-reporting-risk-events.md)
### [FAQ](active-directory-reporting-faq.md)
### Tasks
#### [Configure named locations](active-directory-named-locations.md)
#### [Find activity reports](active-directory-reporting-migration.md)
#### [Use the Azure Active Directory Power BI Content Pack](active-directory-reporting-power-bi-content-pack-how-to.md)
#### [Remediate users flagged for risk](active-directory-report-security-user-at-risk-remediation.md)
### Reference
#### [Retention](active-directory-reporting-retention.md)
#### [Latencies](active-directory-reporting-latencies-azure-portal.md)
#### [Audit activity reference](active-directory-reporting-activity-audit-reference.md)
#### [Sign-in activity error codes](active-directory-reporting-activity-sign-ins-errors.md)
#### [Multi-factor authentication](active-directory-reporting-activity-sign-ins-mfa.md)


### Troubleshoot
#### [Missing audit data](active-directory-reporting-troubleshoot-missing-audit-data.md)
#### [Missing data in downloads](active-directory-reporting-troubleshoot-missing-data-download.md)
#### [Azure Active Directory Activity logs content pack errors](active-directory-reporting-troubleshoot-content-pack.md)
#### [Errors in Azure Active Directory Reporting API](active-directory-reporting-troubleshoot-graph-api.md)


###	[Programmatic Access](active-directory-reporting-api-getting-started-azure-portal.md)
#### [Prerequisites](active-directory-reporting-api-prerequisites-azure-portal.md)
#### [Audit samples](active-directory-reporting-api-audit-samples.md)
#### [Sign-in samples](active-directory-reporting-api-sign-in-activity-samples.md)
#### [Using certificates](active-directory-reporting-api-with-certificates.md)

## Manage passwords
### [Passwords overview](authentication/active-directory-passwords-overview.md)
### User documents
#### [Reset or change your password](active-directory-passwords-update-your-own-password.md)
#### [Password best practices](active-directory-secure-passwords.md)
#### [Register for self-service password reset](active-directory-passwords-reset-register.md)
### [SSPR How it works](authentication/concept-sspr-howitworks.md)
### [SSPR Deployment guide](authentication/howto-sspr-deployment.md)
### [SSPR and Windows 10](authentication/tutorial-sspr-windows.md)
### [SSPR Policies ](authentication/concept-sspr-policy.md)
### [SSPR Customization](authentication/concept-sspr-customization.md)
### [SSPR Data requirements](authentication/howto-sspr-authenticationdata.md)
### [SSPR Reporting](authentication/howto-sspr-reporting.md)
### [Smart lockout](authentication/howto-password-smart-lockout.md)
### [Eliminate weak passwords](authentication/concept-password-ban-bad.md)
### [Configure the banned password list](authentication/howto-password-ban-bad.md)
### [On-premises integration](authentication/concept-password-ban-bad-on-premises.md)
### [Deploy Azure AD password protection](authentication/howto-password-ban-bad-on-premises.md)
### [Configure Azure AD password protection](authentication/howto-password-ban-bad-on-premises-operations.md)
### [Monitor Azure AD password protection](authentication/howto-password-ban-bad-on-premises-troubleshoot.md)
### IT Admins: Reset passwords
#### [Azure portal](fundamentals/active-directory-users-reset-password-azure-portal.md)
### [License SSPR](authentication/concept-sspr-licensing.md)
### [Password writeback](authentication/howto-sspr-writeback.md)
### [Troubleshoot](authentication/active-directory-passwords-troubleshoot.md)
### [FAQ](authentication/active-directory-passwords-faq.md)


## Manage devices
### [Introduction](device-management-introduction.md)
### [Using the Azure portal](device-management-azure-portal.md)
### [Plan Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
### [FAQs](device-management-faq.md)
### Tasks
#### [Set up Azure AD registered Windows 10 devices](device-management-azuread-registered-devices-windows10-setup.md)
#### [Set up Azure AD joined devices](device-management-azuread-joined-devices-setup.md)
#### [Set up hybrid Azure AD joined devices](device-management-hybrid-azuread-joined-devices-setup.md)
#### [Deploy on-premises](active-directory-device-registration-on-premises-setup.md)
#### [Azure AD join during Windows 10 first-run experience](device-management-azuread-joined-devices-frx.md)
### Troubleshoot
#### [Hybrid Azure AD joined Windows 10 and Windows Server 2016 devices](device-management-troubleshoot-hybrid-join-windows-current.md)
#### [Hybrid Azure AD joined legacy Windows devices](device-management-troubleshoot-hybrid-join-windows-legacy.md)

## Manage apps
### [Overview](manage-apps/what-is-application-management.md)
### [Getting started](manage-apps/plan-an-application-integration.md)
### [SaaS app integration tutorials](saas-apps/tutorial-list.md)

### [User provisioning and deprovisioning to SaaS apps](active-directory-saas-app-provisioning.md) 
#### [App integration tutorials](saas-apps/tutorial-list.md) 
#### [Automate provisioning to SCIM-enabled apps](manage-apps/use-scim-to-provision-users-and-groups.md) 
#### [Customize attribute mappings](active-directory-saas-customizing-attribute-mappings.md) 
#### [Write expressions for attribute mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md) 
#### [Use scoping filters](active-directory-saas-scoping-filters.md) 
#### [Report on automatic user provisioning](active-directory-saas-provisioning-reporting.md) 
#### [Troubleshoot user provisioning](active-directory-application-provisioning-content-map.md) 

### [Access apps remotely with App Proxy](manage-apps/application-proxy.md)
#### Get started
##### [Enable App Proxy](manage-apps/application-proxy-enable.md)
##### [Publish apps](manage-apps/application-proxy-publish-azure-portal.md)
##### [Custom domains](manage-apps/application-proxy-configure-custom-domain.md)
#### [Single sign-on](manage-apps/application-proxy-single-sign-on.md)
##### [SSO with KCD](manage-apps/application-proxy-configure-single-sign-on-with-kcd.md)
##### [SSO with headers](manage-apps/application-proxy-configure-single-sign-on-with-ping-access.md)
##### [SSO with password vaulting](manage-apps/application-proxy-configure-single-sign-on-password-vaulting.md)
#### Concepts
##### [Connectors](manage-apps/application-proxy-connectors.md)
##### [Security](manage-apps/application-proxy-security.md)
##### [Networks](manage-apps/application-proxy-network-topology.md)


##### [Upgrade from TMG or UAG](manage-apps/application-proxy-migration.md)

#### Advanced configurations
##### [Publish on separate networks](manage-apps/application-proxy-connector-groups.md)
##### [Proxy servers](manage-apps/application-proxy-configure-connectors-with-proxy-servers.md)
##### [Claims-aware apps](manage-apps/application-proxy-configure-for-claims-aware-applications.md)
##### [Native client apps](manage-apps/application-proxy-configure-native-client-application.md)
##### [Silent install](manage-apps/application-proxy-register-connector-powershell.md)
##### [Custom home page](manage-apps/application-proxy-configure-custom-home-page.md)
##### [Translate inline links](manage-apps/application-proxy-configure-hard-coded-link-translation.md)
##### [Wildcards](active-directory-application-proxy-wildcard.md)
##### [Remove personal data](manage-apps/application-proxy-remove-personal-data.md)


#### Publishing walkthroughs
##### [Remote Desktop](manage-apps/application-proxy-integrate-with-remote-desktop-services.md)
##### [SharePoint](manage-apps/application-proxy-integrate-with-sharepoint-server.md)
##### [Microsoft Teams](manage-apps/application-proxy-integrate-with-teams.md)
##### [Tableau](manage-apps/application-proxy-integrate-with-tableau.md)
##### [Qlik](active-directory-application-proxy-qlik.md)
#### [PowerShell](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#application_proxy_application_management) 

#### [Troubleshoot](manage-apps/application-proxy-troubleshoot.md)

### Manage enterprise apps
#### [Assign users](manage-apps/assign-user-or-group-access-portal.md)
#### [Customize branding](manage-apps/change-name-or-logo-portal.md)
#### [Disable user sign-ins](manage-apps/disable-user-sign-in-portal.md)
#### [Remove users](manage-apps/remove-user-or-group-access-portal.md)
#### [View all my apps](manage-apps/view-applications-portal.md)
#### [Manage user account provisioning](manage-apps/configure-automatic-user-provisioning-portal.md)
#### [Manage single sign-on for enterprise apps](manage-apps/configure-single-sign-on-portal.md)
#### [Advanced certificate signing for SAML apps](manage-apps/certificate-signing-options.md)
#### [Hide an application from a user's experience](manage-apps/hide-application-from-user-portal.md)
### [Configure Sign-In Auto-Acceleration using HRD Policy](manage-apps/configure-authentication-for-federated-users-portal.md)
### [Migrate AD FS apps to Azure AD](manage-apps/migrate-adfs-apps-to-azure.md) 
### [Manage access to apps](manage-apps/what-is-access-management.md)
#### [SSO access](manage-apps/what-is-single-sign-on.md)
#### [Certificates for SSO](manage-apps/manage-certificates-for-federated-single-sign-on.md)
#### [Tenant restrictions](manage-apps/tenant-restrictions.md)
#### [Use SCIM provision users](manage-apps/use-scim-to-provision-users-and-groups.md)


### Troubleshoot



#### Access Panel
##### [App not appearing](application-access-panel-unexpected-application-not-appearing.md)
##### [Unexpected app appearing](application-access-panel-unexpected-application-appears.md)
##### [Can't sign in](application-access-panel-web-sign-in-problem.md)
##### [Error installing browser extension](application-access-panel-extension-problem-installing.md)
##### [How to use self-service app access](application-access-panel-self-service-applications-how-to.md)
##### [Error using self-service app access](application-access-panel-self-service-applications-problem.md)

#### Adding an app
##### [Choose app type](application-config-add-app-problem-how-to-choose-application-type.md)
##### [Common problems - gallery apps](application-config-add-app-problem-problem-adding-gallery-app.md)
##### [Common problems - non-gallery apps](application-config-add-app-problem-problem-adding-non-gallery-app.md)

#### Application Proxy
##### [Problem displaying app page](application-proxy-page-appearance-broken-problem.md)
##### [Application load is too long](application-proxy-page-load-speed-problem.md)
##### [Links on application page not working](application-proxy-page-links-broken-problem.md)
##### [What ports to open for my app](application-proxy-connectivity-ports-how-to.md)
##### [No working connector in a connector group for my app](application-proxy-connectivity-no-working-connector.md)
##### [Configure in admin portal](application-proxy-config-how-to.md)
##### [Configure single sign-on to my app](application-proxy-config-sso-how-to.md)
##### [Problem creating an app in admin portal](application-proxy-config-problem.md)
##### [Configure Kerberos Constrained Delegation](application-proxy-back-end-kerberos-constrained-delegation-how-to.md)
##### [Configure with PingAccess](application-proxy-back-end-ping-access-how-to.md)
##### ["Can't Access this Corporate Application" error](application-proxy-sign-in-bad-gateway-timeout-error.md)
##### [Problem installing the Application Proxy Agent Connector](application-proxy-connector-installation-problem.md)


#### Application registration
##### [Enter fields for the application object](application-dev-registration-config-specific-application-property-how-to.md)
##### [Change token lifetime defaults](application-dev-registration-config-change-token-lifetime-how-to.md)

#### Authentication
##### [Configure endpoints](application-dev-registration-config-how-to.md)

#### Conditional Access
##### [Customer did not meet Device Registration pre-reqs](active-directory-conditional-access.md)
##### [Tenant is getting blocked due to incorrect setting of Conditional Access policies](active-directory-conditional-access-device-remediation.md)
##### [How and when do off corpnet rules take effect?](https://aka.ms/calocation)
##### [How to increase the number of devices that user is allowed to register in Azure AD?](active-directory-azureadjoin-setup.md)
##### [How to set up Conditional Access for Exchange Online?](https://aka.ms/csforexchange)
##### [How to set up Conditional Access for Windows 7 devices?](active-directory-conditional-access.md#device-based-conditional-access)
##### [Which applications are supported with conditional access?](active-directory-conditional-access-supported-apps.md)

#### Find an API
##### [Find an API](application-dev-api-find-an-api-how-to.md)

#### Managing access
##### [Assign users and groups to an app](application-access-assignment-how-to-add-assignment.md)
##### [Remove a users access to an app](application-access-assignment-how-to-remove-assignment.md)
##### [Configure self-service app assignment](application-access-self-service-how-to.md)
##### [Unexpected user assigned](application-access-unexpected-user-assignment.md)
##### [Unexpected app in the applications list](application-access-unexpected-application.md)

#### Multi-tenant apps
##### [Configure a new app](application-dev-setup-multi-tenant-app.md)
##### [Add to the app gallery](application-dev-registration-config-multi-tenant-application-add-to-gallery-how-to.md)

#### Permissions
##### [Choose permissions for an API](application-dev-perms-for-given-api.md)
##### [Grant permissions to my app](application-dev-registration-config-grant-permissions-how-to.md)
##### [Delegated vs application permissions](application-dev-delegated-and-app-perms.md)
##### [Application consent](application-dev-consent-framework.md)

#### Provisioning
##### [How long it takes](application-provisioning-when-will-provisioning-finish-specific-user.md)
##### [Taking hours - gallery app](application-provisioning-when-will-provisioning-finish.md)
##### [Configure user provisioning - gallery app](application-provisioning-config-how-to.md)
##### [Problem configuring user provisioning - gallery app](application-provisioning-config-problem.md)
##### [Problem saving administrator credentials while configuring user provisioning gallery app](application-provisioning-config-problem-storage-limit.md)
##### [Users are not provisioned - gallery app](application-provisioning-config-problem-no-users-provisioned.md)
##### [Wrong users provisioned - galler app](application-provisioning-config-problem-wrong-users-provisioned.md)

#### Single sign-on
##### [Choose a method](application-config-sso-how-to-choose-sign-on-method.md)
##### [Configure](application-dev-registration-config-sso-how-to.md)
##### [Configure federated - gallery apps](application-config-sso-how-to-configure-federated-sso-gallery.md)
##### [Configuring federated common problems - gallery apps](application-config-sso-problem-configure-federated-sso-gallery.md)
##### [Configure federated - non-gallery apps](application-config-sso-how-to-configure-federated-sso-non-gallery.md)
##### [Configure federated common problems - non-gallery apps](application-config-sso-problem-configure-federated-sso-non-gallery.md)
##### [Configure password - gallery apps](application-config-sso-how-to-configure-password-sso-gallery.md)
##### [Configure password common problems - gallery apps](application-config-sso-problem-configure-password-sso-gallery.md)
##### [Configure password - non-gallery apps](application-config-sso-how-to-configure-password-sso-non-gallery.md)
##### [Configure password common problems - non-gallery apps](application-config-sso-problem-configure-password-sso-non-gallery.md)

#### User sign-in problems
##### [Unexpected consent prompt](application-sign-in-unexpected-user-consent-prompt.md)
##### [User consent error](application-sign-in-unexpected-user-consent-error.md)
##### [Problems signing in from custom portal](application-sign-in-other-problem-deeplink.md)
##### [Problems signing in from access panel](application-sign-in-other-problem-access-panel.md)
##### [Error on application sign-in page](application-sign-in-problem-application-error.md)
##### [Problem with password single sign-on - non-gallery app](application-sign-in-problem-password-sso-non-gallery.md)
##### [Problem with password single sign-on - gallery app](application-sign-in-problem-password-sso-gallery.md)
##### [Problem signing into a Microsoft app](application-sign-in-problem-first-party-microsoft.md)
##### [Problem with federated single sign-on - non-gallery app](application-sign-in-problem-federated-sso-non-gallery.md)
##### [Problem with federated single sign-on - gallery app](application-sign-in-problem-federated-sso-gallery.md)
##### [Problem with custom-developed app](application-sign-in-problem-custom-dev.md)
##### [Problem with on-premises app - Application Proxy](application-sign-in-problem-on-premises-application-proxy.md)

### [Develop apps](active-directory-applications-guiding-developers-for-lob-applications.md)
### [Document library](active-directory-apps-index.md)

## Manage your directory
### [Azure AD Connect](./connect/active-directory-aadconnect.md)
### Custom domain names
#### [Quickstart](fundamentals/add-custom-domain.md)
#### [Add custom domain names](users-groups-roles/domains-manage.md)
### [Administer your directory](fundamentals/active-directory-administer.md)
### [Delete a directory](users-groups-roles/directory-delete-howto.md)
### [Multiple directories](users-groups-roles/licensing-directory-independence.md)
### [Self-service signup](users-groups-roles/directory-self-service-signup.md)
### [Take over an unmanaged directory](users-groups-roles/domains-admin-takeover.md)
### [Enterprise State Roaming](active-directory-windows-enterprise-state-roaming-overview.md)
#### [Enable](active-directory-windows-enterprise-state-roaming-enable.md)
#### [Group policy settings](active-directory-windows-enterprise-state-roaming-group-policy-settings.md)
#### [Windows 10 settings](active-directory-windows-enterprise-state-roaming-windows-settings-reference.md)
#### [FAQs](active-directory-windows-enterprise-state-roaming-faqs.md)
#### [Troubleshoot](active-directory-windows-enterprise-state-roaming-troubleshooting.md)


### [Integrate on-premises identities using Azure AD Connect](./connect/active-directory-aadconnect.md)

## Delegate access to resources
### [Administrator roles](users-groups-roles/directory-assign-admin-roles.md)
#### [View members of an admin role](users-groups-roles//directory-manage-roles-portal.md)
#### [Assign admin role to a user](fundamentals/active-directory-users-assign-role-azure-portal.md)
#### [Compare member and guest user permissions](fundamentals/users-default-permissions.md)
### [Administrator role security](users-groups-roles/directory-admin-roles-secure.md)  
#### [Create emergency access administrator accounts](users-groups-roles/directory-emergency-access.md)
### [Administrative units](users-groups-roles/directory-administrative-units.md)
### [Configure token lifetimes](active-directory-configurable-token-lifetimes.md)

## Access reviews
### [Access reviews overview](active-directory-azure-ad-controls-access-reviews-overview.md)
### [Complete an access review](active-directory-azure-ad-controls-complete-access-review.md)
### [Create an access review](active-directory-azure-ad-controls-create-access-review.md)
### [How to perform an access review](active-directory-azure-ad-controls-perform-access-review.md)
### [How to review your access](active-directory-azure-ad-controls-how-to-review-your-access.md)
### [Guest access with access reviews](active-directory-azure-ad-controls-manage-guest-access-with-access-reviews.md)
### [Managing user access with reviews](active-directory-azure-ad-controls-manage-user-access-with-access-reviews.md)
### [Managing programs and controls](active-directory-azure-ad-controls-manage-programs-controls.md)
### [Retrieve access review results](active-directory-azure-ad-controls-retrieve-access-review.md)

## Secure your identities
### [Conditional access](active-directory-conditional-access-azure-portal.md)
#### [Get started](active-directory-conditional-access-azure-portal-get-started.md)
#### Quickstarts
##### [Configure per cloud app MFA](active-directory-conditional-access-app-based-mfa.md)
##### [Require terms of use to be accepted](active-directory-conditional-access-tou.md)
##### [Block access when a session risk is detected](active-directory-conditional-access-app-sign-in-risk.md)
#### Tutorials
##### [Migrate classic MFA policy](active-directory-conditional-access-migration-mfa.md)
#### Concepts
##### [Baseline Protection](active-directory-conditional-access-baseline-protection.md)
##### [Conditions](active-directory-conditional-access-conditions.md)
##### [Location conditions](active-directory-conditional-access-locations.md)
##### [Controls](active-directory-conditional-access-controls.md)
##### [What if tool](active-directory-conditional-access-whatif.md)
##### [Understand device policies for Office 365 services](active-directory-conditional-access-device-policies.md)
#### How-to guides
##### [Best practices](active-directory-conditional-access-best-practices.md)
##### [Configure conditional access policies for access attempts from untrusted networks](active-directory-conditional-access-untrusted-networks.md)
##### [Set up device-based conditional access](active-directory-conditional-access-policy-connected-applications.md)
##### [Set up app-based conditional access](active-directory-conditional-access-mam.md)
##### [Provide terms of use for users and apps](active-directory-tou.md)
##### [Migrate classic policies](active-directory-conditional-access-migration.md)
##### [Set up VPN connectivity](https://docs.microsoft.com/windows-server/remote/remote-access/vpn/always-on-vpn/deploy/always-on-vpn-deploy)
##### [Set up SharePoint and Exchange Online](active-directory-conditional-access-no-modern-authentication.md)
##### [Remediation](active-directory-conditional-access-device-remediation.md)
#### [Technical reference](active-directory-conditional-access-technical-reference.md)
#### [FAQs](active-directory-conditional-faqs.md)

### Certificate-based Authentication
#### [Android](active-directory-certificate-based-authentication-android.md)
#### [iOS](active-directory-certificate-based-authentication-ios.md)
#### [Get started](active-directory-certificate-based-authentication-get-started.md)

### [Azure AD Identity Protection](active-directory-identityprotection.md)
#### [Enable](active-directory-identityprotection-enable.md)
#### [Detect vulnerabilities](active-directory-identityprotection-vulnerabilities.md)
#### [Risk events](active-directory-identity-protection-risk-events.md)
#### [Notifications](active-directory-identityprotection-notifications.md)
#### [Sign-in experience](active-directory-identityprotection-flows.md)
#### [Simulate risk events](active-directory-identityprotection-playbook.md)
#### [Unblock users](active-directory-identityprotection-unblock-howto.md)
#### [FAQs](active-directory-identity-protection-faqs.md)
#### [Glossary](active-directory-identityprotection-glossary.md)
#### [Microsoft Graph](active-directory-identityprotection-graph-getting-started.md)
### [Privileged Identity Management](privileged-identity-management/pim-configure.md?toc=%2fazure%2factive-directory%2ftoc.json)

## Integrate other services with Azure AD 
### [Integrate LinkedIn with Azure AD](users-groups-roles/linkedin-integration.md)

## [Deploy AD FS in Azure](active-directory-aadconnect-azure-adfs.md)
### [High availability](active-directory-adfs-in-azure-with-azure-traffic-manager.md)
### [Change signature hash algorithm](active-directory-federation-sha256-guidance.md)

## [Troubleshoot](fundamentals/active-directory-troubleshooting-support-howto.md)

## Deploy Azure AD Proof of Concept (PoC)
### [PoC Playbook: Introduction](active-directory-playbook-intro.md)
### [PoC Playbook: Ingredients](active-directory-playbook-ingredients.md)
### [PoC Playbook: Implementation](active-directory-playbook-implementation.md)
### [PoC Playbook: Building Blocks](active-directory-playbook-building-blocks.md)


# Reference
## [Code samples](https://azure.microsoft.com/resources/samples/?service=active-directory)
## [Azure PowerShell cmdlets](/powershell/azure/overview)
## [Java API Reference](/java/api)
## [.NET API](/active-directory/adal/microsoft.identitymodel.clients.activedirectory)
## [Service limits and restrictions](users-groups-roles/directory-service-limits-restrictions.md)

# Related
## [Multi-Factor Authentication](/azure/multi-factor-authentication/)
## [Azure AD Connect](./connect/active-directory-aadconnect.md)
## [Azure AD Connect Health](./connect-health/active-directory-aadconnect-health.md)
## [Azure AD for developers](./develop/active-directory-how-to-integrate.md)
## [Azure AD Privileged Identity Management](./privileged-identity-management/pim-configure.md)

# Resources
## [Azure feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory)
## [Azure Roadmap](https://azure.microsoft.com/roadmap/?category=security-identity)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD)
## [Pricing](https://azure.microsoft.com/pricing/details/active-directory/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=active-directory)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=active-directory)
