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
## [Sign up for Azure AD Premium](fundamentals/active-directory-get-started-premium.md)
## [Add a custom domain name](fundamentals/add-custom-domain.md)
## [Configure company branding](fundamentals/customize-branding.md)
## [Add users to Azure AD](fundamentals/add-users-azure-active-directory.md)
## [Assign licenses to users](fundamentals/license-users-groups.md)
## [Configure Self-service password reset](authentication/quickstart-sspr.md)
## [Add your organization's privacy info in Azure AD](active-directory-properties-area.md)
## [Access Azure Active Directory to create a new tenant](fundamentals/active-directory-access-create-new-tenant.md)


# How to
## Plan and design
### [Understand Azure AD architecture](fundamentals/active-directory-architecture.md)
### [Claims mapping in Azure Active Directory](develop/active-directory-claims-mapping.md)
### [Deploy a hybrid identity solution](hybrid/plan-hybrid-identity-design-considerations-overview.md)
#### Determine requirements
##### [Identity](hybrid/plan-hybrid-identity-design-considerations-business-needs.md)
##### [Directory sync](hybrid/plan-hybrid-identity-design-considerations-directory-sync-requirements.md)
##### [Multi-factor auth](hybrid/plan-hybrid-identity-design-considerations-multifactor-auth-requirements.md)
##### [Identity lifecycle strategy](hybrid/plan-hybrid-identity-design-considerations-lifecycle-adoption-strategy.md)
#### [Plan for data security](hybrid/plan-hybrid-identity-design-considerations-data-protection-strategy.md)
##### [Data protection](hybrid/plan-hybrid-identity-design-considerations-dataprotection-requirements.md)
##### [Content management](hybrid/plan-hybrid-identity-design-considerations-contentmgt-requirements.md)
##### [Access control](hybrid/plan-hybrid-identity-design-considerations-accesscontrol-requirements.md)
##### [Incident response](hybrid/plan-hybrid-identity-design-considerations-incident-response-requirements.md)
#### Plan your identity lifecycle
##### [Tasks](hybrid/plan-hybrid-identity-design-considerations-hybrid-id-management-tasks.md)
##### [Adoption strategy](hybrid/plan-hybrid-identity-design-considerations-identity-adoption-strategy.md)
#### [Next steps](hybrid/plan-hybrid-identity-design-considerations-nextsteps.md)
#### [Tools comparison](hybrid/plan-hybrid-identity-design-considerations-tools-comparison.md)

## Manage users
### [Add new users to Azure AD](fundamentals/add-users-azure-active-directory.md)
### [Manage user profiles](fundamentals/active-directory-users-profile-azure-portal.md)
### [Reset user passwords](fundamentals/active-directory-users-reset-password-azure-portal.md)
### [Share accounts](active-directory-sharing-accounts.md)
### [Assign users to admin roles](fundamentals/active-directory-users-assign-role-azure-portal.md)
### [Add guest users from another directory (B2B)](b2b/what-is-b2b.md)
#### [Admins adding B2B users](b2b/add-users-administrator.md)
#### [Information workers adding B2B users](b2b/add-users-information-worker.md)
#### [API and customization](b2b/customize-invitation-api.md)
#### [Google federation](b2b/google-federation.md)
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
### [Manage groups](fundamentals/active-directory-groups-create-azure-portal.md)
### [Delete a group and its members](fundamentals/active-directory-groups-delete-group.md)
### [Manage group settings](fundamentals/active-directory-groups-settings-azure-portal.md)
## [Manage reports](reports-monitoring/overview-reports.md)
### [Sign-ins activity](reports-monitoring/concept-sign-ins.md)
### [Audit activity](reports-monitoring/concept-audit-logs.md)
### [Users at risk](reports-monitoring/concept-user-at-risk.md)
### [Risky sign-ins](reports-monitoring/concept-risky-sign-ins.md)
### [Risk events](reports-monitoring/concept-risk-events.md)
### [Monitoring logs using Azure Monitor](reports-monitoring/concept-activity-logs-in-azure-monitor.md)
### [FAQ](reports-monitoring/reports-faq.md)

### Tasks
#### [Download a sign-in report](reports-monitoring/quickstart-download-sign-in-report.md)
#### [Download an audit report](reports-monitoring/quickstart-download-audit-report.md)
#### [Configure named locations](reports-monitoring/quickstart-configure-named-locations.md)
#### [Find activity reports](reports-monitoring/howto-find-activity-reports.md)
#### [Use the Azure AD Power BI Content Pack](reports-monitoring/howto-power-bi-content-pack.md)
#### [Remediate users flagged for risk](reports-monitoring/howto-remediate-users-flagged-for-risk.md)
#### [Route activity logs to an Azure event hub](reports-monitoring/quickstart-azure-monitor-stream-logs-to-event-hub.md)
#### [Archive activity logs to an Azure storage account](reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md)
#### [Integrate activity logs with Splunk using Azure Monitor](reports-monitoring/tutorial-integrate-activity-logs-with-splunk.md)
#### [Integrate activity logs with SumoLogic using Azure Monitor](reports-monitoring/howto-integrate-activity-logs-with-sumologic.md)

### Reference
#### [Retention](reports-monitoring/reference-reports-data-retention.md)
#### [Latencies](reports-monitoring/reference-reports-latencies.md)
#### [Audit activity reference](reports-monitoring/reference-audit-activities.md)
#### [Sign-in activity error codes](reports-monitoring/reference-sign-ins-error-codes.md)
#### [Interpret the audit log schema in Azure Monitor](reports-monitoring/reference-azure-monitor-audit-log-schema.md)
#### [Interpret the sign-in log schema in Azure Monitor](reports-monitoring/reference-azure-monitor-sign-ins-log-schema.md)

### Troubleshoot
#### [Missing data in Azure AD activity logs](reports-monitoring/troubleshoot-missing-audit-data.md)
#### [Missing data in downloads](reports-monitoring/troubleshoot-missing-data-download.md)
#### [Azure AD activity logs content pack errors](reports-monitoring/troubleshoot-content-pack.md)
#### [Errors in Azure AD Reporting API](reports-monitoring/troubleshoot-graph-api.md)

### [Programmatic Access](reports-monitoring/concept-reporting-api.md)
#### [Prerequisites](reports-monitoring/howto-configure-prerequisites-for-reporting-api.md)
#### [Using certificates](reports-monitoring/tutorial-access-api-with-certificates.md)

## [Manage passwords](authentication/concept-sspr-howitworks.md)

## Manage apps
### [Overview](manage-apps/what-is-application-management.md)
### [Getting started](manage-apps/plan-an-application-integration.md)
### [SaaS app integration tutorials](saas-apps/tutorial-list.md)

### [User provisioning and deprovisioning to SaaS apps](manage-apps/user-provisioning.md) 
#### [App integration tutorials](saas-apps/tutorial-list.md) 
#### [Automate provisioning to SCIM-enabled apps](manage-apps/use-scim-to-provision-users-and-groups.md) 
#### [Customize attribute mappings](manage-apps/customize-application-attributes.md) 
#### [Write expressions for attribute mappings](manage-apps/functions-for-customizing-application-data.md) 
#### [Use scoping filters](manage-apps/define-conditional-rules-for-provisioning-user-accounts.md) 
#### [Report on automatic user provisioning](manage-apps/check-status-user-account-provisioning.md) 
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
##### [Wildcards](manage-apps/application-proxy-wildcard.md)
##### [Remove personal data](manage-apps/application-proxy-remove-personal-data.md)


#### Publishing walkthroughs
##### [Remote Desktop](manage-apps/application-proxy-integrate-with-remote-desktop-services.md)
##### [SharePoint](manage-apps/application-proxy-integrate-with-sharepoint-server.md)
##### [Microsoft Teams](manage-apps/application-proxy-integrate-with-teams.md)
##### [Tableau](manage-apps/application-proxy-integrate-with-tableau.md)
##### [Qlik](manage-apps/application-proxy-qlik.md)
#### [PowerShell](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0#application_proxy_application_management) 

#### [Troubleshoot](manage-apps/application-proxy-troubleshoot.md)

### Manage enterprise apps
#### [Add an application](manage-apps/add-application-portal.md)
#### [View tenant apps](manage-apps/view-applications-portal.md)
#### [Configure single sign-on](manage-apps/configure-single-sign-on-portal.md)
#### [Assign users](manage-apps/assign-user-or-group-access-portal.md)
#### [Customize branding](manage-apps/change-name-or-logo-portal.md)
#### [Disable user sign-ins](manage-apps/disable-user-sign-in-portal.md)
#### [Remove users](manage-apps/remove-user-or-group-access-portal.md)

#### [Manage user account provisioning](manage-apps/configure-automatic-user-provisioning-portal.md)

#### [Advanced certificate signing for SAML apps](manage-apps/certificate-signing-options.md)
#### [Hide an application from a user's experience](manage-apps/hide-application-from-user-portal.md)
### [Configure Sign-In Auto-Acceleration using HRD Policy](manage-apps/configure-authentication-for-federated-users-portal.md)
### [Migrate AD FS apps to Azure AD](manage-apps/migrate-adfs-apps-to-azure.md) 
### [Manage access to apps](manage-apps/what-is-access-management.md)
#### [SSO access](manage-apps/what-is-single-sign-on.md)
#### [Certificates for SSO](manage-apps/manage-certificates-for-federated-single-sign-on.md)
#### [Tenant restrictions](manage-apps/tenant-restrictions.md)
#### [Use SCIM provision users](manage-apps/use-scim-to-provision-users-and-groups.md)

### [Understanding Azure AD application consent experiences](develop/application-consent-experience.md)

### Troubleshoot



#### Access Panel
##### [App not appearing](manage-apps/access-panel-troubleshoot-application-not-appearing.md)
##### [Unexpected app appearing](manage-apps/access-panel-troubleshoot-unexpected-application.md)
##### [Can't sign in](manage-apps/access-panel-troubleshoot-web-sign-in-problem.md)
##### [Error installing browser extension](manage-apps/access-panel-extension-problem-installing.md)
##### [How to use self-service app access](manage-apps/access-panel-manage-self-service-access.md)
##### [Error using self-service app access](manage-apps/access-panel-troubleshoot-self-service-access.md)

#### Adding an app
##### [Choose app type](manage-apps/choose-application-type.md)
##### [Common problems - gallery apps](manage-apps/adding-gallery-app-common-problems.md)
##### [Common problems - non-gallery apps](manage-apps/adding-non-gallery-app-common-problems.md)

#### Application Proxy
##### [Problem displaying app page](manage-apps/application-proxy-page-appearance-broken-problem.md)
##### [Application load is too long](manage-apps/application-proxy-page-load-speed-problem.md)
##### [Links on application page not working](manage-apps/application-proxy-page-links-broken-problem.md)
##### [What ports to open for my app](manage-apps/application-proxy-connectivity-ports-how-to.md)
##### [No working connector in a connector group for my app](manage-apps/application-proxy-connectivity-no-working-connector.md)
##### [Configure in admin portal](manage-apps/application-proxy-config-how-to.md)
##### [Configure single sign-on to my app](manage-apps/application-proxy-config-sso-how-to.md)
##### [Problem creating an app in admin portal](manage-apps/application-proxy-config-problem.md)
##### [Configure Kerberos Constrained Delegation](manage-apps/application-proxy-back-end-kerberos-constrained-delegation-how-to.md)
##### [Configure with PingAccess](manage-apps/application-proxy-back-end-ping-access-how-to.md)
##### ["Can't Access this Corporate Application" error](manage-apps/application-proxy-sign-in-bad-gateway-timeout-error.md)
##### [Problem installing the Application Proxy Agent Connector](manage-apps/application-proxy-connector-installation-problem.md)


#### Application registration
##### [Enter fields for the application object](develop/registration-config-specific-application-property-how-to.md)
##### [Change token lifetime defaults](develop/registration-config-change-token-lifetime-how-to.md)

#### Authentication
##### [Configure endpoints](develop/registration-config-how-to.md)

#### Conditional Access
##### [Customer did not meet Device Registration pre-reqs](active-directory-conditional-access.md)
##### [Tenant is getting blocked due to incorrect setting of Conditional Access policies](active-directory-conditional-access-device-remediation.md)
##### [How and when do off corpnet rules take effect?](https://aka.ms/calocation)
##### [How to increase the number of devices that user is allowed to register in Azure AD?](active-directory-azureadjoin-setup.md)
##### [How to set up Conditional Access for Exchange Online?](https://aka.ms/csforexchange)
##### [How to set up Conditional Access for Windows 7 devices?](active-directory-conditional-access.md#device-based-conditional-access)
##### [Which applications are supported with conditional access?](active-directory-conditional-access-supported-apps.md)

#### Find an API
##### [Find an API](develop/api-find-an-api-how-to.md)

#### Managing access
##### [Assign users and groups to an app](manage-apps/methods-for-assigning-users-and-groups.md)
##### [Remove a users access to an app](manage-apps/methods-for-removing-user-access.md)
##### [Configure self-service app assignment](manage-apps/manage-self-service-access.md)
##### [Unexpected user assigned](manage-apps/ways-users-get-assigned-to-applications.md)
##### [Unexpected app in the applications list](manage-apps/application-types.md)

#### Multi-tenant apps
##### [Configure a new app](develop/setup-multi-tenant-app.md)
##### [Add to the app gallery](develop/registration-config-multi-tenant-application-add-to-gallery-how-to.md)

#### Permissions
##### [Choose permissions for an API](develop/perms-for-given-api.md)
##### [Grant permissions to my app](develop/registration-config-grant-permissions-how-to.md)
##### [Delegated vs application permissions](develop/delegated-and-app-perms.md)
##### [Application consent](develop/consent-framework.md)

#### Provisioning
##### [How long it takes](manage-apps/application-provisioning-when-will-provisioning-finish-specific-user.md)
##### [Taking hours - gallery app](manage-apps/application-provisioning-when-will-provisioning-finish.md)
##### [Configure user provisioning - gallery app](manage-apps/application-provisioning-config-how-to.md)
##### [Problem configuring user provisioning - gallery app](manage-apps/application-provisioning-config-problem.md)
##### [Problem saving administrator credentials while configuring user provisioning gallery app](manage-apps/application-provisioning-config-problem-storage-limit.md)
##### [Users are not provisioned - gallery app](manage-apps/application-provisioning-config-problem-no-users-provisioned.md)
##### [Wrong users provisioned - galler app](manage-apps/application-provisioning-config-problem-wrong-users-provisioned.md)

#### Single sign-on
##### [Choose a method](manage-apps/single-sign-on-modes.md)
##### [Configure](develop/registration-config-sso-how-to.md)
##### [Configure federated - gallery apps](manage-apps/configure-federated-single-sign-on-gallery-applications.md)
##### [Configuring federated common problems - gallery apps](manage-apps/configure-federated-single-sign-on-gallery-applications-problems.md)
##### [Configure federated - non-gallery apps](manage-apps/configure-federated-single-sign-on-non-gallery-applications.md)
##### [Configure federated common problems - non-gallery apps](manage-apps/configure-federated-single-sign-on-non-gallery-applications-problems.md)
##### [Configure password - gallery apps](manage-apps/configure-password-single-sign-on-gallery-applications.md)
##### [Configure password common problems - gallery apps](manage-apps/configure-password-single-sign-on-gallery-applications-problems.md)
##### [Configure password - non-gallery apps](manage-apps/configure-password-single-sign-on-non-gallery-applications.md)
##### [Configure password common problems - non-gallery apps](manage-apps/configure-password-single-sign-on-non-gallery-applications-problems.md)

#### User sign-in problems
##### [Unexpected consent prompt](manage-apps/application-sign-in-unexpected-user-consent-prompt.md)
##### [User consent error](manage-apps/application-sign-in-unexpected-user-consent-error.md)
##### [Problems signing in from custom portal](manage-apps/application-sign-in-other-problem-deeplink.md)
##### [Problems signing in from access panel](manage-apps/application-sign-in-other-problem-access-panel.md)
##### [Error on application sign-in page](manage-apps/application-sign-in-problem-application-error.md)
##### [Problem with password single sign-on - non-gallery app](manage-apps/application-sign-in-problem-password-sso-non-gallery.md)
##### [Problem with password single sign-on - gallery app](manage-apps/application-sign-in-problem-password-sso-gallery.md)
##### [Problem signing into a Microsoft app](manage-apps/application-sign-in-problem-first-party-microsoft.md)
##### [Problem with federated single sign-on - non-gallery app](manage-apps/application-sign-in-problem-federated-sso-non-gallery.md)
##### [Problem with federated single sign-on - gallery app](manage-apps/application-sign-in-problem-federated-sso-gallery.md)
##### [Problem with custom-developed app](manage-apps/application-sign-in-problem-custom-dev.md)
##### [Problem with on-premises app - Application Proxy](manage-apps/application-sign-in-problem-on-premises-application-proxy.md)

### [Develop apps](active-directory-applications-guiding-developers-for-lob-applications.md)


## Manage your directory
### [Azure AD Connect](hybrid/whatis-hybrid-identity.md)
### Custom domain names
#### [Quickstart](fundamentals/add-custom-domain.md)
### [Administer your directory](fundamentals/active-directory-administer.md)
### [Enterprise State Roaming](active-directory-windows-enterprise-state-roaming-overview.md)
#### [Enable](active-directory-windows-enterprise-state-roaming-enable.md)
#### [Group policy settings](active-directory-windows-enterprise-state-roaming-group-policy-settings.md)
#### [Windows 10 settings](active-directory-windows-enterprise-state-roaming-windows-settings-reference.md)
#### [FAQs](active-directory-windows-enterprise-state-roaming-faqs.md)
#### [Troubleshoot](active-directory-windows-enterprise-state-roaming-troubleshooting.md)


### [Integrate on-premises identities using Azure AD Connect](hybrid/whatis-hybrid-identity.md)

### [Configure token lifetimes](develop/active-directory-configurable-token-lifetimes.md)

## Secure your identities

### [Privileged Identity Management](privileged-identity-management/pim-configure.md?toc=%2fazure%2factive-directory%2ftoc.json)

## [Deploy AD FS in Azure](hybrid/how-to-connect-fed-azure-adfs.md)
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

# Related
## [Multi-Factor Authentication](/azure/multi-factor-authentication/)
## [Azure AD Connect](hybrid/whatis-hybrid-identity.md)
## [Azure AD Connect Health](hybrid/whatis-hybrid-identity-health.md)
## [Azure AD for developers](./develop/active-directory-how-to-integrate.md)
## [Azure AD Privileged Identity Management](./privileged-identity-management/pim-configure.md)

# Resources
## [Azure AD deployment plans](./fundamentals/active-directory-deployment-plans.md)
## [Azure feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory)
## [Azure Roadmap](https://azure.microsoft.com/roadmap/?category=security-identity)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD)
## [Pricing](https://azure.microsoft.com/pricing/details/active-directory/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=active-directory)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=active-directory)
