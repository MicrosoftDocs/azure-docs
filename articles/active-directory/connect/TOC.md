# Overview
## [What is Azure AD Connect?](active-directory-aadconnect.md)
## [What is Azure AD Connect Sync?](active-directory-aadconnectsync-whatis.md)
### [Users and contacts](active-directory-aadconnectsync-understanding-users-and-contacts.md)
### [Architecture](active-directory-aadconnectsync-understanding-architecture.md)
### [Declarative Provisioning](active-directory-aadconnectsync-understanding-declarative-provisioning.md)
#### [Declarative Provisioning Expressions](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md)
### [Default configuration](active-directory-aadconnectsync-understanding-default-configuration.md)
## [What is Azure AD Connect and Federation?](active-directory-aadconnectfed-whatis.md)


# Get started
## [Prerequisites](active-directory-aadconnect-prerequisites.md)
## [Install Azure AD Connect](active-directory-aadconnect-select-installation.md)
### [Express settings](active-directory-aadconnect-get-started-express.md)
### [Custom settings](active-directory-aadconnect-get-started-custom.md)
### [Upgrade from DirSync](active-directory-aadconnect-dirsync-upgrade-get-started.md)
### [Upgrade from a previous version](active-directory-aadconnect-upgrade-previous-version.md)


# How to
## Plan and design
### [Design concepts](active-directory-aadconnect-design-concepts.md)
### [Topologies for Azure AD Connect](active-directory-aadconnect-topologies.md)
### [Active Directory Federation Services in Azure](active-directory-aadconnect-azure-adfs.md)
### [Special considerations for instances](active-directory-aadconnect-instances.md)
### [When you already have Azure AD](active-directory-aadconnect-existing-tenant.md)
## [Manage Azure AD Connect](active-directory-aadconnect-whats-next.md)
### [Renew certs for O365 and Azure AD](active-directory-aadconnect-o365-certs.md)
### [Enable device writeback](active-directory-aadconnect-feature-device-writeback.md)
### [User sign-on options](active-directory-aadconnect-user-signin.md)
#### [Seamless Single Sign-on](active-directory-aadconnect-sso.md)
##### [Quick start](active-directory-aadconnect-sso-quick-start.md)
##### [How does it work?](active-directory-aadconnect-sso-how-it-works.md)
##### [Frequently asked questions](active-directory-aadconnect-sso-faq.md)
##### [Troubleshoot](active-directory-aadconnect-troubleshoot-sso.md)
#### [Pass-through Authentication](active-directory-aadconnect-pass-through-authentication.md)
##### [Quick start](active-directory-aadconnect-pass-through-authentication-quick-start.md)
##### [Current limitations](active-directory-aadconnect-pass-through-authentication-current-limitations.md)
##### [How does it work?](active-directory-aadconnect-pass-through-authentication-how-it-works.md)
##### [Frequently asked questions](active-directory-aadconnect-pass-through-authentication-faq.md)
##### [Troubleshoot](active-directory-aadconnect-troubleshoot-pass-through-authentication.md)
### [Multiple domain support for federating](active-directory-aadconnect-multiple-domains.md)
### [Automatic upgrade](active-directory-aadconnect-feature-automatic-upgrade.md)
### [Use a SAML 2.0 Identity Provider (IdP) for Single Sign On](active-directory-aadconnect-federation-saml-idp.md)



## Manage Azure AD Connect Sync
### [Prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md)
### [Password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md)
### [Azure AD service account](active-directory-aadconnectsync-howto-azureadaccount.md)
### [Installation wizard](active-directory-aadconnectsync-installation-wizard.md)
### [Change the default configuration](active-directory-aadconnectsync-best-practices-changing-default-configuration.md)
### [Configure Filtering](active-directory-aadconnectsync-configure-filtering.md)
### [Scheduler](active-directory-aadconnectsync-feature-scheduler.md)
### [Directory extensions](active-directory-aadconnectsync-feature-directory-extensions.md)

### [Changing the Azure AD Sync service account password](active-directory-aadconnectsync-change-serviceacct-pass.md)
### [Changing the AD DS account password](active-directory-aadconnectsync-change-addsacct-pass.md)
### [Enable AD recycle bin](active-directory-aadconnectsync-recycle-bin.md)

### [Synchronization Service Manager](active-directory-aadconnectsync-service-manager-ui.md)
#### [Operations](active-directory-aadconnectsync-service-manager-ui-operations.md)
#### [Connectors](active-directory-aadconnectsync-service-manager-ui-connectors.md)
#### [Metaverse designer](active-directory-aadconnectsync-service-manager-ui-mvdesigner.md)
#### [Metaverse search](active-directory-aadconnectsync-service-manager-ui-mvsearch.md)


## Manage Federation Services
### [Manage and customize](active-directory-aadconnect-federation-management.md)
### [Federate multiple instances of Azure AD with single instance of AD FS](active-directory-aadconnectfed-single-adfs-multitenant-federation.md)


## Troubleshoot
### [Connectivity](active-directory-aadconnect-troubleshoot-connectivity.md)
### [Errors during synchronization](active-directory-aadconnect-troubleshoot-sync-errors.md)
### [Object is not synchronized](active-directory-aadconnectsync-troubleshoot-object-not-syncing.md)
### [Password synchronization](active-directory-aadconnectsync-troubleshoot-password-synchronization.md)
### [LargeObject error caused by userCertificate](active-directory-aadconnectsync-largeobjecterror-usercertificate.md)
### [How to recover from LocalDB 10-GB limit](active-directory-aadconnect-recover-from-localdb-10gb-limit.md)

# Reference
## [Identity synchronization and duplicate attribute resiliency](active-directory-aadconnectsyncservice-duplicate-attribute-resiliency.md)
## [Hybrid Identity Required Ports and Protocols](active-directory-aadconnect-ports.md)
## [Features in preview](active-directory-aadconnect-feature-preview.md)
## [Version History](active-directory-aadconnect-version-history.md)
## [Accounts and permissions](active-directory-aadconnect-accounts-permissions.md)

## Azure AD Connect Sync
### [Attributes synchronized to Azure Active Directory](active-directory-aadconnectsync-attributes-synchronized.md)
### [Connector Version Release History](active-directory-aadconnectsync-connector-version-history.md)
### [Functions Reference](active-directory-aadconnectsync-functions-reference.md)
### [Operational tasks and consideration](active-directory-aadconnectsync-operations.md)
### [Azure AD federation compatibility list](active-directory-aadconnect-federation-compatibility.md)
### [Technical Concepts](active-directory-aadconnectsync-technical-concepts.md)
### [Service features](active-directory-aadconnectsyncservice-features.md)




# Related
## [Monitor your on-premises identity infrastructure and synchronization services in the cloud](../connect-health/active-directory-aadconnect-health.md)
## [Hybrid Identity Design Guide](https://azure.microsoft.com/documentation/articles/active-directory-hybrid-identity-design-considerations-overview/)


# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
##[Azure AD Connect FAQ](active-directory-aadconnect-faq.md)
##[DirSync Deprecation](active-directory-aadconnect-dirsync-deprecated.md)
