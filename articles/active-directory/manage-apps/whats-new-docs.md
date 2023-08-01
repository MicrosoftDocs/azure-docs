---
title: "What's new in Azure Active Directory application management"
description: "New and updated documentation for the Azure Active Directory application management."
ms.date: 08/01/2023
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: reference
ms.workload: identity
ms.author: jomondi
author: omondiatieno
manager: CelesteDG
---

# Azure Active Directory application management: What's new

Welcome to what's new in Azure Active Directory (Azure AD) application management documentation. This article lists new docs that have been added and those that have had significant updates in the last three months. To learn what's new with the application management service, see [What's new in Azure AD](../fundamentals/whats-new.md).

## July 2023

### New articles

- [Restore revoked permissions granted to applications](restore-permissions.md) - New how-to guide on how to restore previously revoked permissions.

### Updated articles

- [Review permissions granted to enterprise applications](manage-application-permissions.md) - Added portal UI procedures for revoking permissions.
- [Debug SAML-based single sign-on to applications](debug-saml-sso-issues.md) - Reviewed the article for freshness.
- [Configure Azure Active Directory SAML token encryption](howto-saml-token-encryption.md) - Added Microsoft Graph PowerShell examples and removed unnecessary steps.

The following PowerShell samples were updated to use Microsoft Graph PowerShell cmdlets.
- [Export secrets and certs (app registrations)](scripts/powershell-export-all-app-registrations-secrets-and-certs.md)
- [Export secrets and certs (enterprise apps)](scripts/powershell-export-all-enterprise-apps-secrets-and-certs.md)
- [Export expiring secrets and certs (app registrations)](scripts/powershell-export-apps-with-expiring-secrets.md)

The following PowerShell sample was added:
- [Export expiring secrets and certs (enterprise apps)](scripts/powershell-export-enterprise-apps-with-expiring-secrets.md)

## June 2023

### Updated articles

- [Manage consent to applications and evaluate consent requests](manage-consent-requests.md)
- [Plan application migration to Azure Active Directory](migrate-adfs-apps-phases-overview.md)
- [Tutorial: Configure Secure Hybrid Access with Azure Active Directory and Silverfort](silverfort-integration.md)
- [Tutorial: Migrate your applications from Okta to Azure Active Directory](migrate-applications-from-okta.md)
- [Tutorial: Configure Datawiza to enable Azure Active Directory Multi-Factor Authentication and single sign-on to Oracle JD Edwards](datawiza-sso-oracle-jde.md)
- [Tutorial: Configure Datawiza to enable Azure Active Directory Multi-Factor Authentication and single sign-on to Oracle PeopleSoft](datawiza-sso-oracle-peoplesoft.md)
- [Tutorial: Configure Cloudflare with Azure Active Directory for secure hybrid access](cloudflare-integration.md)
- [Configure Datawiza for Azure AD Multi-Factor Authentication and single sign-on to Oracle EBS](datawiza-sso-mfa-oracle-ebs.md)
- [Tutorial: Configure F5 BIG-IP Access Policy Manager for Kerberos authentication](f5-big-ip-kerberos-advanced.md)
- [Tutorial: Configure F5 BIG-IP Easy Button for Kerberos single sign-on](f5-big-ip-kerberos-easy-button.md)
## May 2023

### New articles

- [Phase 2: Classify apps and plan pilot](migrate-adfs-classify-apps-plan-pilot.md)
- [Phase 1: Discover and scope apps](migrate-adfs-discover-scope-apps.md)
- [Phase 4: Plan management and insights](migrate-adfs-plan-management-insights.md)
- [Phase 3: Plan migration and testing](migrate-adfs-plan-migration-test.md)
- [Represent AD FS security policies in Azure Active Directory: Mappings and examples](migrate-adfs-represent-security-policies.md)
- [SAML-based single sign-on: Configuration and Limitations](migrate-adfs-saml-based-sso.md)

### Updated articles

- [Tutorial: Migrate Okta sync provisioning to Azure AD Connect synchronization](migrate-okta-sync-provisioning.md)
- [Application management videos](app-management-videos.md)
- [Understand the stages of migrating application authentication from AD FS to Azure AD](migrate-adfs-apps-to-azure.md)
- [Plan application migration to Azure Active Directory](migrate-application-authentication-to-azure-active-directory.md)
- [Tutorial: Migrate Okta sync provisioning to Azure AD Connect-based synchronization](migrate-okta-sync-provisioning-to-azure-active-directory.md)
- [Tutorial: Configure F5 BIG-IP Easy Button for SSO to Oracle JDE](f5-big-ip-oracle-jde-easy-button.md)
- [Tutorial: Configure F5 BIG-IP Easy Button for SSO to Oracle PeopleSoft](f5-big-ip-oracle-peoplesoft-easy-button.md)
- [Tutorial: Configure Cloudflare with Azure Active Directory for secure hybrid access](cloudflare-azure-ad-integration.md)
- [Tutorial: Configure F5 BIG-IP Easy Button for SSO to SAP ERP](f5-big-ip-sap-erp-easy-button.md)
- [Tutorial: Migrate Okta federation to Azure Active Directory-managed authentication](migrate-okta-federation.md)
