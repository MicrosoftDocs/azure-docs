# Overview
## [What is Azure Active Directory?](active-directory-whatis.md)
## [About Azure identity management](identity-fundamentals.md)
## [Understand Azure identity solutions](understand-azure-identity-solutions.md)
## [Choose a hybrid identity solution](choose-hybrid-identity-solution.md)
## [Associate Azure subscriptions](active-directory-how-subscriptions-associated-directory.md)
## [FAQs](active-directory-faq.md)

# Get started
## [Sign up for Azure AD Premium](active-directory-get-started-premium.md)
## [Add a custom domain name](add-custom-domain.md)
## [Configure company branding](customize-branding.md)
## [Add users to Azure AD](add-users-azure-active-directory.md)
## [Assign licenses to users](license-users-groups.md)
## [Configure Self-service password reset](active-directory-passwords-getting-started.md)


# How to
## Plan and design
### [Understand Azure AD architecture](active-directory-architecture.md)
### [Deploy a hybrid identity solution](active-directory-hybrid-identity-design-considerations-overview.md)
### [Claims mapping in Azure Active Directory](active-directory-claims-mapping.md)
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
### [Assign licenses using groups](active-directory-licensing-whatis-azure-portal.md)
#### [Assign licenses to a group](active-directory-licensing-group-assignment-azure-portal.md)
#### [Identify and resolve license problems in a group](active-directory-licensing-group-problem-resolution-azure-portal.md)
#### [Migrate individual licensed users to group-based licensing](active-directory-licensing-group-migration-azure-portal.md)
#### [Additional scenarios for group-based licensing](active-directory-licensing-group-advanced.md)
#### [Provide terms of use for users and services](active-directory-tou.md)
#### [PowerShell examples for group-based licensing](active-directory-licensing-ps-examples.md)
### [Add users from other directories (classic portal)](active-directory-create-users-external.md)
### [Manage user profiles](active-directory-users-profile-azure-portal.md)
### [Reset a password](active-directory-users-reset-password-azure-portal.md)
### [Manage user work information](active-directory-users-work-info-azure-portal.md)
### [Share accounts](active-directory-sharing-accounts.md)



## [Manage groups and members](active-directory-manage-groups.md)
### Manage groups
#### [Azure portal](active-directory-groups-create-azure-portal.md)
#### [Classic portal](active-directory-accessmanagement-manage-groups.md)
#### [PowerShell](active-directory-accessmanagement-groups-settings-v2-cmdlets.md)
### [Manage group members](active-directory-groups-members-azure-portal.md)
### [Manage group owners](active-directory-accessmanagement-managing-group-owners.md)
### [Manage group membership](active-directory-groups-membership-azure-portal.md)
### [Assign licenses using groups](active-directory-licensing-whatis-azure-portal.md)
#### [Assign licenses to a group](active-directory-licensing-group-assignment-azure-portal.md)
#### [Identify and resolve license problems in a group](active-directory-licensing-group-problem-resolution-azure-portal.md)
#### [Migrate individual licensed users to group-based licensing](active-directory-licensing-group-migration-azure-portal.md)
#### [Additional scenarios for group-based licensing](active-directory-licensing-group-advanced.md)
#### [PowerShell examples for group-based licensing](active-directory-licensing-ps-examples.md)
### [Set up Office 365 groups expiration](active-directory-groups-lifecycle-azure-portal.md)
### [View all groups](active-directory-groups-view-azure-portal.md)
### [Enable dedicated groups](active-directory-accessmanagement-dedicated-groups.md)
### [Add group access to SaaS apps](active-directory-accessmanagement-group-saasapps.md)
### [Restore a deleted Office 365 group](active-directory-groups-restore-azure-portal.md)
### Manage group settings
#### [Azure portal](active-directory-groups-settings-azure-portal.md)
#### [Cmdlets](active-directory-accessmanagement-groups-settings-cmdlets.md)
### Create advanced rules
#### [Azure portal](active-directory-groups-dynamic-membership-azure-portal.md)
#### [Classic portal](active-directory-accessmanagement-groups-with-advanced-rules.md)
### [Set up self-service groups](active-directory-accessmanagement-self-service-group-management.md)
### [Troubleshoot](active-directory-accessmanagement-troubleshooting.md)

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
### Reference
#### [Retention](active-directory-reporting-retention.md)
#### [Latencies](active-directory-reporting-latencies-azure-portal.md)
#### [Notifications](active-directory-reporting-notifications.md)
#### [Sign-in activity error codes](active-directory-reporting-activity-sign-ins-errors.md)
### Troubleshoot
#### [Missing audit data](active-directory-reporting-troubleshoot-missing-audit-data.md)
#### [Missing data in downloads](active-directory-reporting-troubleshoot-missing-data-download.md)
#### [Azure Active Directory Activity logs content pack errors](active-directory-reporting-troubleshoot-content-pack.md)
###	[Programmatic Access](active-directory-reporting-api-getting-started-azure-portal.md)
#### [Audit reference](active-directory-reporting-api-audit-reference.md)
#### [Sign-in reference](active-directory-reporting-api-sign-in-activity-reference.md)
#### [Prerequisites](active-directory-reporting-api-prerequisites-azure-portal.md)
#### [Audit samples](active-directory-reporting-api-audit-samples.md)
#### [Sign-in samples](active-directory-reporting-api-sign-in-activity-samples.md)
#### [Using certificates](active-directory-reporting-api-with-certificates.md)

## [Manage passwords](active-directory-passwords-overview.md)
### User documents
#### [Reset or change your password](active-directory-passwords-update-your-own-password.md)
#### [Password best practices](active-directory-secure-passwords.md)
#### [Register for self-service password reset](active-directory-passwords-reset-register.md)
### [License SSPR](active-directory-passwords-licensing.md)
### [Deploy SSPR](active-directory-passwords-best-practices.md)
### IT Admins: Reset passwords
#### [Azure portal](active-directory-users-reset-password-azure-portal.md)
#### [Azure classic portal](active-directory-create-users-reset-password.md)
### [Understand SSPR policies ](active-directory-passwords-policy.md)
### [Understand password reset](active-directory-passwords-how-it-works.md)
### [Customize SSPR](active-directory-passwords-customize.md)
### [Data used by SSPR](active-directory-passwords-data.md)
### [Reporting on SSPR](active-directory-passwords-reporting.md)
### [Azure AD Connect](./connect/active-directory-aadconnect.md)
### [Password writeback](active-directory-passwords-writeback.md)
### [Password hash synchronization](./connect/active-directory-aadconnectsync-implement-password-synchronization.md#how-password-synchronization-works)
### [Troubleshoot](active-directory-passwords-troubleshoot.md)
### [FAQ](active-directory-passwords-faq.md)


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
### [Overview](active-directory-enable-sso-scenario.md)
### [Getting started](active-directory-integrating-applications-getting-started.md)
### [SaaS app integration tutorials](active-directory-saas-tutorial-list.md)
### [Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md)
#### [Update registry settings](active-directory-cloudappdiscovery-registry-settings-for-proxy-services.md)
#### [Understand security and privacy](active-directory-cloudappdiscovery-security-and-privacy-considerations.md)


### [Access apps remotely with App Proxy](active-directory-application-proxy-get-started.md)
#### Get started
##### [Enable App Proxy](active-directory-application-proxy-enable.md)
##### [Publish apps](application-proxy-publish-azure-portal.md)
##### [Custom domains](active-directory-application-proxy-custom-domains.md)
#### [Single sign-on](application-proxy-sso-overview.md)
##### [SSO with KCD](active-directory-application-proxy-sso-using-kcd.md)
##### [SSO with headers](application-proxy-ping-access.md)
##### [SSO with password vaulting](application-proxy-sso-azure-portal.md)
#### Concepts
##### [Connectors](application-proxy-understand-connectors.md)
##### [Security](application-proxy-security-considerations.md)
##### [Networks](application-proxy-network-topology-considerations.md)


##### [Upgrade from TMG or UAG](application-proxy-transition-from-uag-tmg.md)

#### Advanced configurations
##### [Publish on separate networks](active-directory-application-proxy-connectors-azure-portal.md)
##### [Proxy servers](application-proxy-working-with-proxy-servers.md)
##### [Claims-aware apps](active-directory-application-proxy-claims-aware-apps.md)
##### [Native client apps](active-directory-application-proxy-native-client.md)
##### [Silent install](active-directory-application-proxy-silent-installation.md)
##### [Custom home page](application-proxy-office365-app-launcher.md)
##### [Translate inline links](application-proxy-link-translation.md)
#### Publishing walkthroughs
##### [Remote Desktop](application-proxy-publish-remote-desktop.md)
##### [SharePoint](application-proxy-enable-remote-access-sharepoint.md)
##### [Microsoft Teams](application-proxy-teams.md)
#### [Troubleshoot](active-directory-application-proxy-troubleshoot.md)
#### Use the classic portal
##### [Download connectors](application-proxy-enable-classic-portal.md)
##### [Publish apps](active-directory-application-proxy-publish.md)
##### [Use connectors](active-directory-application-proxy-connectors.md)
##### [Conditional access](active-directory-application-proxy-conditional-access.md)

### Manage enterprise apps
#### [Assign users](active-directory-coreapps-assign-user-azure-portal.md)
#### [Customize branding](active-directory-coreapps-change-app-logo-user-azure-portal.md)
#### [Disable user sign-ins](active-directory-coreapps-disable-app-azure-portal.md)
#### [Remove users](active-directory-coreapps-remove-assignment-azure-portal.md)
#### [View all my apps](active-directory-coreapps-view-azure-portal.md)
#### [Manage user account provisioning](active-directory-enterprise-apps-manage-provisioning.md)
#### [Manage single sign-on for enterprise apps](active-directory-enterprise-apps-manage-sso.md)

### [Manage access to apps](active-directory-managing-access-to-apps.md)
#### [Self-service access](active-directory-self-service-application-access.md)
#### [SSO access](active-directory-appssoaccess-whatis.md)
#### [Certificates for SSO](active-directory-sso-certs.md)
#### [Tenant restrictions](active-directory-tenant-restrictions.md)
#### [Use SCIM provision users](active-directory-scim-provisioning.md)

### [Troubleshoot](active-directory-application-troubleshoot-content-map.md)
#### [Application Development](active-directory-application-dev-troubleshoot-content-map.md)
##### [Configuration and Registration](active-directory-application-dev-config-content-map.md)
##### [Development](active-directory-application-dev-development-content-map.md)
#### [Application Management](active-directory-application-management-troubleshoot-content-map.md)
##### [Configuration](active-directory-application-config-content-map.md)
##### [Sign-in](active-directory-application-sign-in-content-map.md)
##### [Provisioning](active-directory-application-provisioning-content-map.md)
##### [Managing Access](active-directory-application-access-content-map.md)
##### [Access Panel](active-directory-application-access-panel-content-map.md)
##### [Application Proxy](active-directory-application-proxy-content-map.md)
##### [Conditional Access](active-directory-application-conditional-access-content-map.md)
### [Develop apps](active-directory-applications-guiding-developers-for-lob-applications.md)
### [Document library](active-directory-apps-index.md)

## Manage your directory
### [Azure AD Connect](./connect/active-directory-aadconnect.md)
### Custom domain names
#### [Overview](active-directory-add-domain-concepts.md)
#### Manage domain names
##### [Azure portal](active-directory-domains-manage-azure-portal.md)
##### [Classic portal](active-directory-add-manage-domain-names.md)
### [Administer your directory](active-directory-administer.md)
### [Multiple directories](active-directory-licensing-directory-independence.md)
### [O365 directories](active-directory-manage-o365-subscription.md)
### [Self-service signup](active-directory-self-service-signup.md)
### [Enterprise State Roaming](active-directory-windows-enterprise-state-roaming-overview.md)
#### [Enable](active-directory-windows-enterprise-state-roaming-enable.md)
#### [Group policy settings](active-directory-windows-enterprise-state-roaming-group-policy-settings.md)
#### [Windows 10 settings](active-directory-windows-enterprise-state-roaming-windows-settings-reference.md)
#### [FAQs](active-directory-windows-enterprise-state-roaming-faqs.md)
#### [Troubleshoot](active-directory-windows-enterprise-state-roaming-troubleshooting.md)

### [Integrate partners with Azure AD B2B](active-directory-b2b-what-is-azure-ad-b2b.md)
#### [Admins adding B2B users](active-directory-b2b-admin-add-users.md)
#### [Information workers adding B2B users](active-directory-b2b-iw-add-users.md)
#### [API and customization](active-directory-b2b-api.md)
#### [Code and PowerShell samples](active-directory-b2b-code-samples.md)
#### [Self-service sign-up portal sample](active-directory-b2b-self-service-portal.md)
#### [Invitation email](active-directory-b2b-invitation-email.md)
#### [Invitation redemption](active-directory-b2b-redemption-experience.md)
#### [Add B2B users without an invitation](active-directory-b2b-add-user-without-invite.md)
#### [Conditional access for B2B](active-directory-b2b-mfa-instructions.md)
#### [B2B sharing policies](active-directory-b2b-delegate-invitations.md)
#### [Add a B2B user to a role](active-directory-b2b-add-guest-to-role.md)
#### [Dynamic groups and B2B users](active-directory-b2b-dynamic-groups.md)
#### [Auditing and reports](active-directory-b2b-auditing-and-reporting.md)
#### [B2B and Office 365 external sharing](active-directory-b2b-o365-external-user.md)
#### [Licensing](active-directory-b2b-licensing.md)
#### [Current limitations](active-directory-b2b-current-limitations.md)
#### [FAQ](active-directory-b2b-faq.md)
#### [Troubleshooting B2B](active-directory-b2b-troubleshooting.md)
#### [Understand the B2B user](active-directory-b2b-user-properties.md)
#### [B2B user token](active-directory-b2b-user-token.md)
#### [B2B for Azure AD integrated apps](active-directory-b2b-configure-saas-apps.md)
#### [B2B user claims mapping](active-directory-b2b-claims-mapping.md)
#### [Compare B2B collaboration to B2C](active-directory-b2b-compare-b2c.md)
#### [Getting support for B2B](active-directory-b2b-support.md)

### [Integrate on-premises identities using Azure AD Connect](./connect/active-directory-aadconnect.md)

## [Manage access to Azure](toc.yml)

## Delegate access to resources
### [Administrator roles](active-directory-assign-admin-roles.md)
#### [Assign admin roles](active-directory-users-assign-role-azure-portal.md)
### [Administrative units](active-directory-administrative-units-management.md)
### [Configure token lifetimes](active-directory-configurable-token-lifetimes.md)

## Azure AD Controls
### [Azure AD Contorls Overview](active-directory-azure-ad-controls-access-reviews-overview.md)
### [Complete an access review](active-directory-azure-ad-controls-complete-an-access-review.md)
### [Create an access review](active-directory-azure-ad-controls-create-an-access-review.md)
### [How to perform an access review](active-directory-azure-ad-controls-perform-an-access-review.md)
### [How to review your access](active-directory-azure-ad-controls-how-to-review-your-access.md)
### [Guest access with access reviews](active-directory-azure-ad-controls-manage-guest-access-with-access-reviews.md)
### [Managing user access with reviews](active-directory-azure-ad-controls-manage-user-access-with-access-reviews.md)
### [Managing programs and controls](active-directory-azure-ad-controls-manage-programs-and-controls.md)


## Secure your identities
### [Conditional access](active-directory-conditional-access-azure-portal.md)
#### [Controls](active-directory-conditional-access-controls.md)
#### [Get started](active-directory-conditional-access-azure-portal-get-started.md)
#### [Best practices](active-directory-conditional-access-best-practices.md)
#### [Understand device policies for Office 365 services](active-directory-conditional-access-device-policies.md)
#### Tasks
##### [Set up device-based conditional access](active-directory-conditional-access-policy-connected-applications.md)
##### [Set up app-based conditional access](active-directory-conditional-access-mam.md)
##### [Set up VPN connectivity](active-directory-conditional-access-vpn-connectivity-windows10.md)
##### [Set up SharePoint and Exchange Online](active-directory-conditional-access-no-modern-authentication.md)
##### [Remediation](active-directory-conditional-access-device-remediation.md)
#### [Technical reference](active-directory-conditional-access-technical-reference.md)
#### [FAQs](active-directory-conditional-faqs.md)
#### [Classic portal](active-directory-conditional-access.md)
##### [Get started](active-directory-conditional-access-azuread-connected-apps.md)

### Windows Hello
#### [Authenticate without passwords](active-directory-azureadjoin-passport.md)
#### [Enable Windows Hello for Business](active-directory-azureadjoin-passport-deployment.md)
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
### [Privileged Identity Management](./privileged-identity-management/active-directory-securing-privileged-access.md)

## [Deploy AD DS on Azure VMs](virtual-networks-windows-server-active-directory-virtual-machines.md)
### [Windows Server Active Directory on Azure VMs](active-directory-deploying-ws-ad-guidelines.md)
### [Replica domain controller in an Azure virtual network](active-directory-install-replica-active-directory-domain-controller.md)
### [New forest on an Azure virtual network](active-directory-new-forest-virtual-machine.md)



## [Deploy AD FS in Azure](active-directory-aadconnect-azure-adfs.md)
### [High availability](active-directory-adfs-in-azure-with-azure-traffic-manager.md)
### [Change signature hash algorithm](active-directory-federation-sha256-guidance.md)

## [Troubleshoot](active-directory-troubleshooting-support-howto.md)
### [Troubleshoot Active Directory item is missing or not available](active-directory-troubleshooting.md)

## Deploy Azure AD Proof of Concept (PoC)
### [PoC Playbook: Introduction](active-directory-playbook-intro.md)
### [PoC Playbook: Ingredients](active-directory-playbook-ingredients.md)
### [PoC Playbook: Implementation](active-directory-playbook-implementation.md)
### [PoC Playbook: Building Blocks](active-directory-playbook-building-blocks.md)


# Reference
## [Code samples](https://azure.microsoft.com/en-us/resources/samples/?service=active-directory)
## [PowerShell cmdlets](/powershell/azure/overview)
## [Java API Reference](/java/api)
## [.NET API](/active-directory/adal/microsoft.identitymodel.clients.activedirectory)
## [Service limits and restrictions](active-directory-service-limits-restrictions.md)

# Related
## [Multi-Factor Authentication](/azure/multi-factor-authentication/)
## [Azure AD Connect](./connect/active-directory-aadconnect.md)
## [Azure AD Connect Health](./connect-health/active-directory-aadconnect-health.md)
## [Azure AD for developers](./develop/active-directory-how-to-integrate.md)
## [Azure AD Privileged Identity Management](./privileged-identity-management/active-directory-securing-privileged-access.md)

# Resources
## [Azure feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory)
## [Azure Roadmap](https://azure.microsoft.com/roadmap/?category=security-identity)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=WindowsAzureAD)
## [Pricing](https://azure.microsoft.com/pricing/details/active-directory/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=active-directory)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=active-directory)
