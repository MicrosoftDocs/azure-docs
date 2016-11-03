# Overview
## [What is Azure Active Directory?](active-directory-whatis.md)
## [Which edition should I choose?](active-directory-editions.md)
## [Fundamentals](fundamentals-identity.md)
## [Preview the Azure portal experience](active-directory-preview-explainer.md)


# Get started
## [How to get an Azure AD tenant](active-directory-howto-tenant.md)
## [Azure AD Premium](active-directory-get-started-premium.md)
## [Associate Azure subscriptions](active-directory-how-subscriptions-associated-directory.md)
## [Azure AD licensing](active-directory-licensing-what-is.md)
## [Get Azure for your organization](sign-up-organization.md)
## [FAQs](active-directory-faq.md)


# How to

## Manage users
### Add users
#### [Azure portal](active-directory-users-create-azure-portal.md)
#### [Classic portal](active-directory-create-users.md)

### Add users from other directories
#### [Azure portal](active-directory-users-create-external-azure-portal.md)
#### [Classic portal](active-directory-create-users-external.md)

### [Delete users](active-directory-users-delete-user-azure-portal.md)
### [Manage user profiles](active-directory-users-profile-azure-portal.md)
### [Reset a password](active-directory-users-reset-password-azure-portal.md)
### [Manage user work information](active-directory-users-work-info-azure-portal.md)
### [Shared accounts](active-directory-sharing-accounts.md)

### [Azure AD groups](active-directory-manage-groups.md)
#### Manage groups
##### [Azure portal](active-directory-groups-create-azure-portal.md)
##### [Classic portal](active-directory-accessmanagement-manage-groups.md)
##### [Powershell](active-directory-accessmanagement-groups-settings-v2-cmdlets.md)
#### [Manage group members](active-directory-groups-members-azure-portal.md)
#### [Manage group owners](active-directory-accessmanagement-managing-group-owners.md)
#### [Manage group membership](active-directory-groups-membership-azure-portal.md)
#### [View all groups](active-directory-groups-view-azure-portal.md)
#### [Dedicated groups](active-directory-accessmanagement-dedicated-groups.md)
#### [SaaS apps access](active-directory-accessmanagement-group-saasapps.md)
#### Group settings
##### [Azure portal](active-directory-groups-settings-azure-portal.md)
##### [Cmdlets](active-directory-accessmanagement-groups-settings-cmdlets.md)
#### Advanced rules
##### [Azure portal](active-directory-groups-dynamic-membership-azure-portal.md)
##### [Classic portal](active-directory-accessmanagement-groups-with-advanced-rules.md)
#### [Self-service groups](active-directory-accessmanagement-self-service-group-management.md)
#### [Troubleshoot](active-directory-accessmanagement-troubleshooting.md)

## [View access and usage reports](active-directory-view-access-usage-reports.md)
### [Azure AD Reporting](active-directory-reporting-getting-started.md)
### [Known networks](active-directory-known-networks.md)

### [Reporting guide](active-directory-reporting-guide.md)
#### [Preview](active-directory-reporting-azure-portal.md)
#### [API](active-directory-reporting-api-getting-started.md)
##### [Audit Reference](active-directory-reporting-api-audit-reference.md)
##### [Audit Samples](active-directory-reporting-api-audit-samples.md)
##### [Prerequisites](active-directory-reporting-api-prerequisites.md)
##### [Sign-in reference](active-directory-reporting-api-sign-in-activity-reference.md)
##### [Sign-in samples](active-directory-reporting-api-sign-in-activity-samples.md)


#### [Audit events](active-directory-reporting-audit-events.md)
#### [Retention](active-directory-reporting-retention.md)
#### [Backfill](active-directory-reporting-backfill.md)
#### [Latencies](active-directory-reporting-latencies.md)
#### [Notifications](active-directory-reporting-notifications.md)
### Understand reports
#### [Irregular sign-in](active-directory-reporting-irregular-sign-in-activity.md)
#### [Multiple failures](active-directory-reporting-sign-ins-after-multiple-failures.md)
#### [Suspicious IP addresses](active-directory-reporting-sign-ins-from-ip-addresses-with-suspicious-activity.md)
#### [Multiple geographies](active-directory-reporting-sign-ins-from-multiple-geographies.md)
#### [Possibly infected devices](active-directory-reporting-sign-ins-from-possibly-infected-devices.md)
#### [Unknown sources](active-directory-reporting-sign-ins-from-unknown-sources.md)
#### [Anomalous sign-ins](active-directory-reporting-users-with-anomalous-sign-in-activity.md)

## [Manage passwords](active-directory-manage-passwords.md)
### [Update your own password](active-directory-passwords-update-your-own-password.md)
### [How it works](active-directory-passwords-how-it-works.md)
### [Policies and restrictions](active-directory-passwords-policy.md)
### Reset passwords
#### [Azure portal](active-directory-users-reset-password-azure-portal.md)
#### [Classic portal](active-directory-create-users-reset-password.md)
### [Expiration policies](active-directory-passwords-set-expiration-policy.md)
### Password Management
#### [Get started](active-directory-passwords-getting-started.md)
#### [Deploy](active-directory-passwords-best-practices.md)
#### [Password reset](active-directory-passwords.md)
#### [Customize](active-directory-passwords-customize.md)
#### [Reports](active-directory-passwords-get-insights.md)
#### [Learn more](active-directory-passwords-learn-more.md)
#### [FAQs](active-directory-passwords-faq.md)
#### [Troubleshoot](active-directory-passwords-troubleshoot.md)

## Manage devices
### [Register your device](active-directory-azureadjoin-personal-device.md)
### [Register a Windows 10 device](active-directory-azureadjoin-user-upgrade.md)

### [Conditional Access](active-directory-conditional-access.md)
#### [Get started](active-directory-conditional-access-azuread-connected-apps.md)
#### [Supported Apps](active-directory-conditional-access-supported-apps.md)
#### [Register devices](active-directory-conditional-access-device-registration-overview.md)
#### [Automatic registration](active-directory-conditional-access-automatic-device-registration.md)
##### [Setup](active-directory-conditional-access-automatic-device-registration-setup.md)
##### [Windows 7](active-directory-conditional-access-automatic-device-registration-windows7.md)
##### [Windows 8.1](active-directory-conditional-access-automatic-device-registration-windows-8-1.md)
#### [Authenticator app](active-directory-conditional-access-azure-authenticator-app.md)
#### [Device policies](active-directory-conditional-access-device-policies.md)
#### [Access to connected apps](active-directory-conditional-access-policy-connected-applications.md)
#### [Deploy on-premises](active-directory-conditional-access-on-premises-setup.md)
#### [FAQs](active-directory-conditional-faqs.md)
#### [Troubleshoot](active-directory-conditional-access-device-remediation.md)
#### [Reference](active-directory-conditional-access-technical-reference.md)

### [Azure AD Join](active-directory-azureadjoin-overview.md)
#### [Deploy](active-directory-azureadjoin-deployment-aadjoindirect.md)
#### [Device registration](active-directory-azureadjoin-setup.md)
#### [Register new devices](active-directory-azureadjoin-user-frx.md)
#### [Domain join](active-directory-azureadjoin-devices-group-policy.md)
#### [Authenticate without passwords](active-directory-azureadjoin-passport.md)
#### [Windows Hello for Business](active-directory-azureadjoin-passport-deployment.md)
#### [Windows 10 guide](active-directory-azureadjoin-windows10-devices-overview.md)
#### [Windows 10 devices](active-directory-azureadjoin-windows10-devices.md)

### Certificate-based Authentication
#### [Android](active-directory-certificate-based-authentication-android.md)
#### [iOS](active-directory-certificate-based-authentication-ios.md)

## Manage apps
### [Overview](active-directory-enable-sso-scenario.md)
### [Getting started guide](active-directory-integrating-applications-getting-started.md)

### [Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md)
#### [Registry settings](active-directory-cloudappdiscovery-registry-settings-for-proxy-services.md)
#### [Security and privacy](active-directory-cloudappdiscovery-security-and-privacy-considerations.md)

### [Remote access to your apps](active-directory-application-proxy-get-started.md)
#### [Enable App Proxy](active-directory-application-proxy-enable.md)
#### [Publish apps](active-directory-application-proxy-publish.md)
#### Publish on separate networks
##### [Azure portal](active-directory-application-proxy-connectors-azure-portal.md)
##### [Classic portal](active-directory-application-proxy-connectors.md)
#### [Custom domains](active-directory-application-proxy-custom-domains.md)
#### [Single sign-on](active-directory-application-proxy-sso-using-kcd.md)
#### [Claims-aware apps](active-directory-application-proxy-claims-aware-apps.md)
#### [Native client apps](active-directory-application-proxy-native-client.md)
#### [Conditional access](active-directory-application-proxy-conditional-access.md)
#### [Silent install](active-directory-application-proxy-silent-installation.md)
#### [Troubleshoot](active-directory-application-proxy-troubleshoot.md)
### [SSO for apps](active-directory-appssoaccess-whatis.md)

### Integrate SaaS apps
#### [Azure portal](active-directory-enterprise-apps-manage-sso.md)
#### [Classic portal](active-directory-sso-integrate-saas-apps.md)

### Enterprise apps
#### [Assign users](active-directory-coreapps-assign-user-azure-portal.md)
#### [Customize branding](active-directory-coreapps-change-app-logo-user-azure-portal.md)
#### [Disable user sign-ins](active-directory-coreapps-disable-app-azure-portal.md)
#### [Remove users](active-directory-coreapps-remove-assignment-azure-portal.md)
#### [View all my apps](active-directory-coreapps-view-azure-portal.md)
#### [User account provisioning](active-directory-enterprise-apps-manage-provisioning.md)

### Developers guide
#### [Assign users](active-directory-applications-guiding-developers-assigning-users.md)
#### [Assign groups](active-directory-applications-guiding-developers-assigning-groups.md)
#### [Require assignment](active-directory-applications-guiding-developers-requiring-user-assignment.md)
#### [LoB apps](active-directory-applications-guiding-developers-for-lob-applications.md)

### [Manage access to apps](active-directory-managing-access-to-apps.md)
#### [Self-service access](active-directory-self-service-application-access.md)
#### [Certificates for SSO](active-directory-sso-certs.md)

### [Use SCIM provision users](active-directory-scim-provisioning.md)
### [Document library](active-directory-apps-index.md)


## Manage your Directory
### Custom domain names
#### [Overview](active-directory-add-domain-concepts.md)
#### Add your domain name
##### [Azure portal](active-directory-domains-add-azure-portal.md)
##### [Classic portal](active-directory-add-domain.md)
##### [With AD FS](active-directory-add-domain-federated.md)
#### [Assign users](active-directory-add-domain-add-users.md)
#### Manage domain names
##### [Azure portal](active-directory-domains-manage-azure-portal.md)
##### [Classic portal](active-directory-add-manage-domain-names.md)
### Customize the sign-in page
#### [Azure portal](active-directory-branding-custom-signon-azure-portal.md)
#### [Language-specific](active-directory-branding-localize-azure-portal.md)
#### [Classic portal](active-directory-add-company-branding.md)
### [Administer your directory](active-directory-administer.md)
### [Multiple directories](active-directory-licensing-directory-independence.md)
### [O365 directories](active-directory-manage-o365-subscription.md)
### [Self-service signup](active-directory-self-service-signup.md)
### [Enterprise State Roaming](active-directory-windows-enterprise-state-roaming-overview.md)
#### [Enable](active-directory-windows-enterprise-state-roaming-enable.md)
#### [Group policy settings](active-directory-windows-enterprise-state-roaming-group-policy-settings.md)
#### [Windows 10 settings](active-directory-windows-enterprise-state-roaming-windows-settings-reference.md)
#### [FAQs](active-directory-windows-enterprise-state-roaming-faqs.md)
### [Integrate partners with Azure AD B2B](active-directory-b2b-what-is-azure-ad-b2b.md)
#### [Overview](active-directory-b2b-collaboration-overview.md)
#### [How it works](active-directory-b2b-how-it-works.md)
#### [Compare capabilities](active-directory-b2b-compare-external-identities.md)
#### [Walkthrough](active-directory-b2b-detailed-walkthrough.md)
#### [Limitations](active-directory-b2b-current-preview-limitations.md)
#### [CSV file format](active-directory-b2b-references-csv-file-format.md)
#### [User objects](active-directory-b2b-references-external-user-object-attribute-changes.md)
#### [User tokens](active-directory-b2b-references-external-user-token-format.md)
### [Integrate on-premises identities using Azure AD Connect](active-directory-aadconnect.md?toc=%2fazure%2factive-directory%2fconnect%2ftoc.json)


## Delegate access to resources
### [Administrator roles](active-directory-assign-admin-roles.md)
#### [Assign admin roles](active-directory-users-assign-role-azure-portal.md)
### [Administrative units](active-directory-administrative-units-management.md)
### [Resource access in Azure](active-directory-understanding-resource-access.md)
### [Role-Based Access Control](role-based-access-control-what-is.md)
#### Manage access
##### [Azure portal](role-based-access-control-manage-assignments.md)
##### [Classic portal](role-based-access-control-configure.md)
#### [Built-in roles](role-based-access-built-in-roles.md)
#### [Custom roles](role-based-access-control-custom-roles.md)
#### [Reporting](role-based-access-control-access-change-history-report.md)
#### More ways to manage roles
##### [Azure CLI](role-based-access-control-manage-access-azure-cli.md)
##### [PowerShell](role-based-access-control-manage-access-powershell.md)
##### [REST](role-based-access-control-manage-access-rest.md)
#### [Troubleshoot](role-based-access-control-troubleshooting.md)
### [Configure token lifetimes](active-directory-configurable-token-lifetimes.md)

## Secure your identities
### [Azure AD Identity Protection](active-directory-identityprotection.md)
#### [Enable](active-directory-identityprotection-enable.md)
#### [Sign-in experience](active-directory-identityprotection-flows.md)
#### [Unblock users](active-directory-identityprotection-unblock-howto.md)
#### [Detect vulnerabilities](active-directory-identityprotection-vulnerabilities.md)
#### [Risk event types](active-directory-identityprotection-risk-events-types.md)
#### [Simulate risk events](active-directory-identityprotection-playbook.md)
#### [Notifications](active-directory-identityprotection-notifications.md)
#### [Glossary](active-directory-identityprotection-glossary.md)
#### [Microsoft Graph](active-directory-identityprotection-graph-getting-started.md)
### [Privileged Identity Management](active-directory-securing-privileged-access.md)

## [Deploy on Azure VMs](virtual-networks-windows-server-active-directory-virtual-machines.md)
### [Windows Server Active Directory on Azure VMs](active-directory-deploying-ws-ad-guidelines.md)
### [Replica domain controller in an Azure virtual network](active-directory-install-replica-active-directory-domain-controller.md)
### [New forest on an Azure virtual network](active-directory-new-forest-virtual-machine.md)

## [Deploy a hybrid identity solution](active-directory-hybrid-identity-design-considerations-overview.md)
### Determine requirements
#### [Identity](active-directory-hybrid-identity-design-considerations-business-needs.md)
#### [Directory sync](active-directory-hybrid-identity-design-considerations-directory-sync-requirements.md)
#### [Multi-factor auth](active-directory-hybrid-identity-design-considerations-multifactor-auth-requirements.md)
#### [Identity lifecycle strategy](active-directory-hybrid-identity-design-considerations-lifecycle-adoption-strategy.md)
### [Plan for data security](active-directory-hybrid-identity-design-considerations-data-protection-strategy.md)
#### [Data protection](active-directory-hybrid-identity-design-considerations-dataprotection-requirements.md)
#### [Content management](active-directory-hybrid-identity-design-considerations-contentmgt-requirements.md)
#### [Access control](active-directory-hybrid-identity-design-considerations-accesscontrol-requirements.md)
#### [Incident response](active-directory-hybrid-identity-design-considerations-incident-response-requirements.md)
### Plan your identity lifecycle
#### [Tasks](active-directory-hybrid-identity-design-considerations-hybrid-id-management-tasks.md)
#### [Adoption strategy](active-directory-hybrid-identity-design-considerations-identity-adoption-strategy.md)
### [Next steps](active-directory-hybrid-identity-design-considerations-nextsteps.md)
### [Tools comparison](active-directory-hybrid-identity-design-considerations-tools-comparison.md)

## [Deploy AD FS in Azure](active-directory-aadconnect-azure-adfs.md)
### [High availability](active-directory-adfs-in-azure-with-azure-traffic-manager.md)
### [Change signature hash algorithm](active-directory-federation-sha256-guidance.md)

## [Troubleshoot Azure AD](active-directory-troubleshooting.md)


# Reference
## [Azure AD service limits and restrictions](active-directory-service-limits-restrictions.md)
## [Active Directory Authentication Library .NET reference](https://msdn.microsoft.com/library/azure/microsoft.identitymodel.clients.activedirectory)
## [Azure Active Directory PowerShell module](https://msdn.microsoft.com/library/azure/mt757189.aspx)

# Related
## [Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md)

# Resources
## [Azure Active Directory forum](https://feedback.azure.com/forums/169401-azure-active-directory)
