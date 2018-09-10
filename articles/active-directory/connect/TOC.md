# Overview
## [What is Azure AD Connect?](active-directory-aadconnect.md)
## [What is Azure AD Connect Sync?](../hybrid/how-to-connect-sync-whatis.md)
### [Users and contacts](../hybrid/concept-azure-ad-connect-sync-user-and-contacts.md)
### [Architecture](../hybrid/concept-azure-ad-connect-sync-architecture.md)
### [Declarative Provisioning](../hybrid/concept-azure-ad-connect-sync-declarative-provisioning.md)
#### [Declarative Provisioning Expressions](../hybrid/concept-azure-ad-connect-sync-declarative-provisioning-expressions.md)
### [Default configuration](../hybrid/concept-azure-ad-connect-sync-default-configuration.md)
## [What is Azure AD Connect and Federation?](../hybrid/how-to-connect-fed-whatis.md)


# Get started
## [Prerequisites](../hybrid/how-to-connect-install-prerequisites.md)
## [Install Azure AD Connect](../hybrid/how-to-connect-install-select-installation.md)
### [Express settings](../hybrid/how-to-connect-install-express.md)
### [Custom settings](../hybrid/how-to-connect-install-custom.md)
### [Upgrade from DirSync](../hybrid/how-to-dirsync-upgrade-get-started.md)
### [Upgrade from a previous version](../hybrid/how-to-upgrade-previous-version.md)
### [Install using an existing ADSync database](../hybrid/how-to-connect-install-existing-database.md)
### [Install using SQL delegated administrator permissions](../hybrid/how-to-connect-install-sql-delegation.md)
### [Move the Azure AD Connect database to a remote SQL Server](../hybrid/how-to-connect-install-move-db.md)

# How to
## Plan and design
### [Design concepts](../hybrid/plan-connect-design-concepts.md)
### [Topologies for Azure AD Connect](../hybrid/plan-connect-topologies.md)
### [Active Directory Federation Services in Azure](../hybrid/how-to-connect-fed-azure-adfs.md)
### [Special considerations for instances](../hybrid/reference-connect-instances.md)
### [When you already have Azure AD](../hybrid/how-to-connect-install-existing-tenant.md)
## [Manage Azure AD Connect](../hybrid/how-to-connect-post-installation.md)
### [Renew certs for O365 and Azure AD](../hybrid/how-to-connect-fed-o365-certs.md)
### [Update the SSL certificate for an Active Directory Federation Services (AD FS) farm](../hybrid/how-to-connect-fed-ssl-update.md)

### [Device options](../hybrid/how-to-connect-device-options.md)
#### [Enable device writeback](../hybrid/how-to-connect-device-writeback.md)
#### [Hybrid Azure AD join post-config tasks](../hybrid/how-to-connect-fed-hybrid-azure-ad-join-post-config-tasks.md)

### [User sign-on options](../hybrid/plan-connect-user-signin.md)
#### [Seamless Single Sign-on](../hybrid/how-to-connect-sso.md)
##### [Quick start](../hybrid/how-to-connect-sso-quick-start.md)
##### [How does it work?](../hybrid/how-to-connect-sso-how-it-works.md)
##### [Frequently asked questions](../hybrid/how-to-connect-sso-faq.md)
##### [Troubleshoot](../hybrid/tshoot-connect-sso.md)
##### [User Privacy and Azure AD Seamless Single Sign-On](../hybrid/how-to-connect-sso-user-privacy.md)
#### [Pass-through Authentication](../hybrid/how-to-connect-pta.md)
##### [Quick start](../hybrid/how-to-connect-pta-quick-start.md)
##### [Current limitations](../hybrid/how-to-connect-pta-current-limitations.md)
##### [How does it work?](../hybrid/how-to-connect-pta-how-it-works.md)
##### [Upgrade preview agents](../hybrid/how-to-connect-pta-upgrade-preview-authentication-agents.md)
##### [Frequently asked questions](../hybrid/how-to-connect-pta-faq.md)
##### [Troubleshoot](../hybrid/tshoot-connect-pass-through-authentication.md)
##### [Security deep dive](../hybrid/how-to-connect-pta-security-deep-dive.md)
##### [User Privacy and Azure Active Directory Pass-through Authentication](../hybrid/how-to-connect-pta-user-privacy.md)
### [Multiple domain support for federating](../hybrid/how-to-connect-install-multiple-domains.md)
### [Automatic upgrade](../hybrid/how-to-connect-install-automatic-upgrade.md)
### [Use a SAML 2.0 Identity Provider (IdP) for Single Sign On](../hybrid/how-to-connect-fed-saml-idp.md)



## Manage Azure AD Connect Sync
### [User Privacy and Azure AD Connect](../hybrid/reference-connect-user-privacy.md)
### [Preferred data location for O365 resources](../hybrid/how-to-connect-sync-feature-preferreddatalocation.md)
### [Prevent accidental deletes](../hybrid/how-to-connect-sync-feature-prevent-accidental-deletes.md)
### [Password hash synchronization](../hybrid/how-to-connect-password-hash-synchronization.md)
### [Azure AD service account](../hybrid/how-to-connect-azureadaccount.md)
### [Installation wizard](../hybrid/how-to-connect-installation-wizard.md)
### [How UserPrincipalName is populated](../hybrid/plan-connect-userprincipalname.md)
### [Change the default configuration](../hybrid/how-to-connect-sync-best-practices-changing-default-configuration.md)
### [Configure Filtering](../hybrid/how-to-connect-sync-configure-filtering.md)
### [Scheduler](../hybrid/how-to-connect-sync-feature-scheduler.md)
### [Directory extensions](../hybrid/how-to-connect-sync-feature-directory-extensions.md)

### [Changing the Azure AD Sync service account password](../hybrid/how-to-connect-sync-change-serviceacct-pass.md)
### [Changing the AD DS account password](../hybrid/how-to-connect-sync-change-addsacct-pass.md)
### [Enable AD recycle bin](../hybrid/how-to-connect-sync-recycle-bin.md)

### [Synchronization Service Manager](../hybrid/how-to-connect-sync-service-manager-ui.md)
#### [Operations](../hybrid/how-to-connect-sync-service-manager-ui-operations.md)
#### [Connectors](../hybrid/how-to-connect-sync-service-manager-ui-connectors.md)
#### [Metaverse designer](../hybrid/how-to-connect-sync-service-manager-ui-mvdesigner.md)
#### [Metaverse search](../hybrid/how-to-connect-sync-service-manager-ui-mvsearch.md)


## Manage Federation Services
### [Manage and customize](../hybrid/how-to-connect-fed-management.md)
### [Manage AD FS trust with Azure AD using Azure AD Connect](../hybrid/how-to-connect-azure-ad-trust.md)
### [Federate multiple instances of Azure AD with single instance of AD FS](../hybrid/how-to-connect-fed-single-adfs-multitenant-federation.md)


## Troubleshoot
### [Azure AD connectivity with Azure AD Connect](../hybrid/tshoot-connect-connectivity.md)
### [SQL Connectivty](../hybrid/tshoot-connect-tshoot-sql-connectivity.md)
### [Errors during synchronization](../hybrid/tshoot-connect-sync-errors.md)
### [Object is not synchronized](../hybrid/tshoot-connect-object-not-syncing.md)
### [Object sync using the troubleshooting task](../hybrid/tshoot-connect-objectsync.md)
### [Password hash synchronization](../hybrid/tshoot-connect-password-hash-synchronization.md)
### [LargeObject error caused by userCertificate](../hybrid/tshoot-connect-largeobjecterror-usercertificate.md)
### [How to recover from LocalDB 10-GB limit](../hybrid/tshoot-connect-recover-from-localdb-10gb-limit.md)

# Reference
## [Code samples](https://azure.microsoft.com/resources/samples/?service=active-directory)
## [Identity synchronization and duplicate attribute resiliency](../hybrid/how-to-connect-syncservice-duplicate-attribute-resiliency.md)
## [Hybrid Identity Required Ports and Protocols](../hybrid/reference-connect-ports.md)
## [Features in preview](../hybrid/how-to-connect-preview.md)
## [Version History](../hybrid/reference-connect-version-history.md)
## [Accounts and permissions](../hybrid/reference-connect-accounts-permissions.md)

## Azure AD Connect Sync
### [Attributes synchronized to Azure Active Directory](../hybrid/reference-connect-sync-attributes-synchronized.md)
### [Connector Version Release History](../hybrid/reference-connect-sync-connector-version-history.md)
### [Functions Reference](../hybrid/reference-connect-sync-functions-reference.md)
### [Operational tasks and consideration](../hybrid/how-to-connect-sync-operations.md)
### [Azure AD federation compatibility list](../hybrid/how-to-connect-fed-compatibility.md)
### [Technical Concepts](../hybrid/how-to-connect-sync-technical-concepts.md)
### [Service features](../hybrid/how-to-connect-syncservice-features.md)




# Related
## [Monitor your on-premises identity infrastructure and synchronization services in the cloud](../connect-health/active-directory-aadconnect-health.md)
## [Hybrid Identity Design Guide](https://azure.microsoft.com/documentation/articles/active-directory-hybrid-identity-design-considerations-overview/)


# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/?category=security-identity)
##[Azure AD Connect FAQ](../hybrid/reference-connect-faq.md)
##[DirSync Deprecation](../hybrid/reference-connect-dirsync-deprecated.md)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)

