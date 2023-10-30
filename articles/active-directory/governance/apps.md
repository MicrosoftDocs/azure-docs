---
title: Microsoft Entra ID Governance integrations
description: This page provides an overview of the Microsoft Entra ID Governance integrations available to automate provisioning and governance controls.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.topic: overview
ms.workload: identity
ms.date: 08/24/2023
ms.author: billmath
ms.custom: contperf-fy21q3-portal
ms.reviewer: amycolannino
---

# Microsoft Entra ID Governance integrations

[Microsoft Entra ID Governance](identity-governance-applications-prepare.md) allows you to balance your organization's need for security and employee productivity with the right processes and visibility. This page provides an overview of the hundreds of Microsoft Entra ID Governance integrations available. These application integrations are used to automate [identity lifecycle management](what-is-identity-lifecycle-management.md) and implement governance controls across your organization. Through these rich integrations, you can automate providing users [access to applications](entitlement-management-overview.md), perform [periodic reviews](access-reviews-overview.md) of who has access to an application, and secure them with capabilities such as multi-factor authentication. 

## Featured integrations

| Category | Application |
| :--- | :--- |
| HR | [SuccessFactors - User Provisioning](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md) |
| HR | [Workday - User Provisioning](../saas-apps/workday-inbound-cloud-only-tutorial.md)|
|[LDAP directory](../app-provisioning/on-premises-ldap-connector-configure.md)| OpenLDAP<br>Microsoft Active Directory Lightweight Directory Services<br>389 Directory Server<br>Apache Directory Server<br>IBM Tivoli DS<br>Isode Directory<br>NetIQ eDirectory<br>Novell eDirectory<br>Open DJ<br>Open DS<br>Oracle (previously Sun ONE) Directory Server Enterprise Edition<br>RadiantOne Virtual Directory Server (VDS) |
| [SQL database](../app-provisioning/tutorial-ecma-sql-connector.md)| Microsoft SQL Server and Azure SQL<br>IBM DB2 10.x<br>IBM DB2 9.x<br>Oracle 10g and 11g<br>Oracle 12c and 18c<br>MySQL 5.x|
| Cloud platform| [AWS IAM Identity Center](../saas-apps/aws-single-sign-on-provisioning-tutorial.md) |
| Cloud platform| [Google Cloud Platform - User Provisioning](../saas-apps/g-suite-provisioning-tutorial.md) |
| Business applications|[SAP Cloud Identity Platform - Provisioning](../saas-apps/sap-cloud-platform-identity-authentication-provisioning-tutorial.md) |
| CRM| [Salesforce - User Provisioning](../saas-apps/salesforce-provisioning-tutorial.md) |
| ITSM| [ServiceNow](../saas-apps/servicenow-provisioning-tutorial.md)|


<a name='entra-identity-governance-integrations'></a>

## Microsoft Entra ID Governance integrations
The list below provides key integrations between Microsoft Entra ID Governance and various applications, including both provisioning and SSO integrations. For a full list of applications that Microsoft Entra ID integrates with specifically for SSO, see [here](../saas-apps/tutorial-list.md). 

Microsoft Entra ID Governance can be integrated with many other applications, using standards such as OpenID Connect, SAML, SCIM, SQL and LDAP. If you're using a SaaS application which isn't listed, then [ask the SaaS vendor to onboard](../manage-apps/v2-howto-app-gallery-listing.md).  For integration with other applications, see [integrating applications with Microsoft Entra ID](identity-governance-applications-integrate.md).

| Application | Automated provisioning | Single Sign On (SSO)|
| :--- | :-:  | :-: |
| 389 directory server ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [4me](../saas-apps/4me-provisioning-tutorial.md) | ● | ●| 
| [8x8](../saas-apps/8x8-provisioning-tutorial.md) | ● | ● |
| [15five](../saas-apps/15five-provisioning-tutorial.md) | ● | ● |
| [Acunetix 360](../saas-apps/acunetix-360-provisioning-tutorial.md) | ● | ● |
| [Adobe Identity Management](../saas-apps/adobe-identity-management-provisioning-tutorial.md) | ● | ● |
| [Adobe Identity Management (OIDC)](../saas-apps/adobe-identity-management-provisioning-oidc-tutorial.md) | ● | ● |
| [Airbase](../saas-apps/airbase-provisioning-tutorial.md) | ● | ● |
| [Aha!](../saas-apps/aha-tutorial.md) |  | ● |
| [Airstack](../saas-apps/airstack-provisioning-tutorial.md) | ● |  |
| [Akamai Enterprise Application Access](../saas-apps/akamai-enterprise-application-access-provisioning-tutorial.md) | ● | ● |
| [Airtable](../saas-apps/airtable-provisioning-tutorial.md) | ● | ● |
| [Albert](../saas-apps/albert-provisioning-tutorial.md) | ● |  |
| [AlertMedia](../saas-apps/alertmedia-provisioning-tutorial.md) | ● | ● |
| [Alexis HR](../saas-apps/alexishr-provisioning-tutorial.md) | ● | ● |
| [Alinto Protect (renamed Cleanmail)](../saas-apps/alinto-protect-provisioning-tutorial.md) | ● | |
| [Alvao](../saas-apps/alvao-provisioning-tutorial.md) | ● |  |
| [Amazon Business](../saas-apps/amazon-business-provisioning-tutorial.md) | ● | ● |
| [Amazon Web Services (AWS) - Role Provisioning](../saas-apps/amazon-web-service-tutorial.md) | ● | ● |
| Apache Directory Server ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Appaegis Isolation Access Cloud](../saas-apps/appaegis-isolation-access-cloud-provisioning-tutorial.md) | ● | ● |
| [Apple School Manager](../saas-apps/apple-school-manager-provision-tutorial.md) | ● |  |
| [Apple Business Manager](../saas-apps/apple-business-manager-provision-tutorial.md) | ● |  |
| [Ardoq](../saas-apps/ardoq-provisioning-tutorial.md) | ● | ● |
| [Asana](../saas-apps/asana-provisioning-tutorial.md) | ● | ● |
| [AskSpoke](../saas-apps/askspoke-provisioning-tutorial.md) | ● | ● |
| [Atea](../saas-apps/atea-provisioning-tutorial.md) | ● |  |
| [Atlassian Cloud](../saas-apps/atlassian-cloud-provisioning-tutorial.md) | ● | ● |
| [Atmos](../saas-apps/atmos-provisioning-tutorial.md) | ● |  |
| [AuditBoard](../saas-apps/auditboard-provisioning-tutorial.md) | ● |  |
| [Autodesk SSO](../saas-apps/autodesk-sso-provisioning-tutorial.md) | ● | ● |
| [Azure Databricks SCIM Connector](/azure/databricks/administration-guide/users-groups/scim/aad) | ● |  |
| [AWS IAM Identity Center](../saas-apps/aws-single-sign-on-provisioning-tutorial.md) | ● | ● |
| [Axiad Cloud](../saas-apps/axiad-cloud-provisioning-tutorial.md) | ● | ● |
| [BambooHR](../saas-apps/bamboo-hr-tutorial.md) |  | ● |
| [BenQ IAM](../saas-apps/benq-iam-provisioning-tutorial.md) | ● | ● |
| [Bentley - Automatic User Provisioning](../saas-apps/bentley-automatic-user-provisioning-tutorial.md) | ● |  |
| [Better Stack](../saas-apps/better-stack-provisioning-tutorial.md) | ● |  |
| [BIC Cloud Design](../saas-apps/bic-cloud-design-provisioning-tutorial.md) | ● | ● |
| [BIS](../saas-apps/bis-provisioning-tutorial.md) | ● | ● |
| [BitaBIZ](../saas-apps/bitabiz-provisioning-tutorial.md) | ● | ● |
| [Bizagi Studio for Digital Process Automation](../saas-apps/bizagi-studio-for-digital-process-automation-provisioning-tutorial.md) | ● | ● |
| [BLDNG APP](../saas-apps/bldng-app-provisioning-tutorial.md) | ● |  |
| [Blink](../saas-apps/blink-provisioning-tutorial.md) | ● | ● |
| [Blinq](../saas-apps/blinq-provisioning-tutorial.md) | ● |  |
| [BlogIn](../saas-apps/blogin-provisioning-tutorial.md) | ● | ● |
| [BlueJeans](../saas-apps/bluejeans-provisioning-tutorial.md) | ● | ● |
| [Bonusly](../saas-apps/bonusly-provisioning-tutorial.md) | ● | ● |
| [Box](../saas-apps/box-userprovisioning-tutorial.md) | ● | ● |
| [Boxcryptor](../saas-apps/boxcryptor-provisioning-tutorial.md) | ● | ● |
| [Bpanda](../saas-apps/bpanda-provisioning-tutorial.md) | ● |  |
| [Brivo Onair Identity Connector](../saas-apps/brivo-onair-identity-connector-provisioning-tutorial.md) | ● |  |
| [Britive](../saas-apps/britive-provisioning-tutorial.md) | ● | ● |
| [BrowserStack Single Sign-on](../saas-apps/browserstack-single-sign-on-provisioning-tutorial.md) | ● | ● |
| [BullseyeTDP](../saas-apps/bullseyetdp-provisioning-tutorial.md) | ● | ● |
| [Bustle B2B Transport Systems](../saas-apps/bustle-b2b-transport-systems-provisioning-tutorial.md) | ● |  |
| [Canva](../saas-apps/canva-provisioning-tutorial.md) | ● | ● |
| [Cato Networks Provisioning](../saas-apps/cato-networks-provisioning-tutorial.md) | ● |  |
| [Cerner Central](../saas-apps/cernercentral-provisioning-tutorial.md) | ● | ● |
| [Cerby](../saas-apps/cerby-provisioning-tutorial.md) | ● | ● |
| [Chaos](../saas-apps/chaos-provisioning-tutorial.md) | ● |  |
| [Chatwork](../saas-apps/chatwork-provisioning-tutorial.md) | ● | ● |
| [CheckProof](../saas-apps/checkproof-provisioning-tutorial.md) | ● | ● |
| [Cinode](../saas-apps/cinode-provisioning-tutorial.md) | ● |  |
| [Cisco Umbrella User Management](../saas-apps/cisco-umbrella-user-management-provisioning-tutorial.md) | ● | ● |
| [Cisco Webex](../saas-apps/cisco-webex-provisioning-tutorial.md) | ● | ● |
| [Clarizen One](../saas-apps/clarizen-one-provisioning-tutorial.md) | ● | ● |
| [Cleanmail Swiss](../saas-apps/cleanmail-swiss-provisioning-tutorial.md) | ● |  |
| [Clebex](../saas-apps/clebex-provisioning-tutorial.md) | ● | ● |
| [Cloud Academy SSO](../saas-apps/cloud-academy-sso-provisioning-tutorial.md) | ● | ● |
| [Coda](../saas-apps/coda-provisioning-tutorial.md) | ● | ● |
| [Code42](../saas-apps/code42-provisioning-tutorial.md) | ● | ● |
| [Cofense Recipient Sync](../saas-apps/cofense-provision-tutorial.md) | ● |  |
| [Colloquial](../saas-apps/colloquial-provisioning-tutorial.md) | ● | ● |
| [Comeet Recruiting Software](../saas-apps/comeet-recruiting-software-provisioning-tutorial.md) | ● | ● |
| [Connecter](../saas-apps/connecter-provisioning-tutorial.md) | ● |  |
| [Contentful](../saas-apps/contentful-provisioning-tutorial.md) | ● | ● |
| [Concur](../saas-apps/concur-provisioning-tutorial.md) | ● | ● |
| [Cornerstone OnDemand](../saas-apps/cornerstone-ondemand-provisioning-tutorial.md) | ● | ● |
| [Cybozu](../saas-apps/cybozu-provisioning-tutorial.md) | ● | ● |
| [CybSafe](../saas-apps/cybsafe-provisioning-tutorial.md) | ● |  |
| [Dagster Cloud](../saas-apps/dagster-cloud-provisioning-tutorial.md) | ● | ● |
| [Datadog](../saas-apps/datadog-provisioning-tutorial.md) | ● | ● |
| [Documo](../saas-apps/documo-provisioning-tutorial.md) | ● | ● |
| [DocuSign](../saas-apps/docusign-provisioning-tutorial.md) | ● | ● |
| [Dropbox Business](../saas-apps/dropboxforbusiness-provisioning-tutorial.md) | ● | ● |
| [Dialpad](../saas-apps/dialpad-provisioning-tutorial.md) | ● |  |
| [Diffchecker](../saas-apps/diffchecker-provisioning-tutorial.md) | ● | ● |
| [DigiCert](../saas-apps/digicert-tutorial.md) | | ● |
| [Directprint.io](../saas-apps/directprint-io-provisioning-tutorial.md) | ● | ● |
| [Druva](../saas-apps/druva-provisioning-tutorial.md) | ● | ● |
| [Dynamic Signal](../saas-apps/dynamic-signal-provisioning-tutorial.md) | ● | ● |
| [Embed Signage](../saas-apps/embed-signage-provisioning-tutorial.md) | ● | ● |
| [Envoy](../saas-apps/envoy-provisioning-tutorial.md) | ● | ● |
| [Eletive](../saas-apps/eletive-provisioning-tutorial.md) | ● |  |
| [Elium](../saas-apps/elium-provisioning-tutorial.md) | ● | ● |
| [Exium](../saas-apps/exium-provisioning-tutorial.md) | ● | ● |
| [Evercate](../saas-apps/evercate-provisioning-tutorial.md) | ● |  |
| [Facebook Work Accounts](../saas-apps/facebook-work-accounts-provisioning-tutorial.md) | ● | ● |
| [Federated Directory](../saas-apps/federated-directory-provisioning-tutorial.md) | ● |  |
| [Figma](../saas-apps/figma-provisioning-tutorial.md) | ● | ● |
| [Flock](../saas-apps/flock-provisioning-tutorial.md) | ● | ● |
| [Foodee](../saas-apps/foodee-provisioning-tutorial.md) | ● | ● |
| [Forcepoint Cloud Security Gateway - User Authentication](../saas-apps/forcepoint-cloud-security-gateway-tutorial.md) | ● | ● |
| [Fortes Change Cloud](../saas-apps/fortes-change-cloud-provisioning-tutorial.md) | ● | ● |
| [Frankli.io](../saas-apps/frankli-io-provisioning-tutorial.md) | ● | |
| [Freshservice Provisioning](../saas-apps/freshservice-provisioning-tutorial.md) | ● | ● |
| [Funnel Leasing](../saas-apps/funnel-leasing-provisioning-tutorial.md) | ● | ● |
| [Fuze](../saas-apps/fuze-provisioning-tutorial.md) | ● | ● |
| [G Suite](../saas-apps/g-suite-provisioning-tutorial.md) | ● |  |
| [Genesys Cloud for Azure](../saas-apps/purecloud-by-genesys-provisioning-tutorial.md) | ● | ● |
| [getAbstract](../saas-apps/getabstract-provisioning-tutorial.md) | ● | ● |
| [GHAE](../saas-apps/ghae-provisioning-tutorial.md) | ● | ● |
| [GitHub](../saas-apps/github-provisioning-tutorial.md) | ● | ● |
| [GitHub AE](../saas-apps/github-ae-provisioning-tutorial.md) | ● | ● |
| [GitHub Enterprise Managed User](../saas-apps/github-enterprise-managed-user-provisioning-tutorial.md) | ● | ● |
| [GitHub Enterprise Managed User (OIDC)](../saas-apps/github-enterprise-managed-user-oidc-provisioning-tutorial.md) | ● | ● |
| [GoToMeeting](../saas-apps/citrixgotomeeting-provisioning-tutorial.md) | ● | ● |
| [Global Relay Identity Sync](../saas-apps/global-relay-identity-sync-provisioning-tutorial.md) | ● |  |
| [Gong](../saas-apps/gong-provisioning-tutorial.md) | ● |  |
| [GoLinks](../saas-apps/golinks-provisioning-tutorial.md) | ● | ● |
| [Grammarly](../saas-apps/grammarly-provisioning-tutorial.md) | ● | ● |
| [Group Talk](../saas-apps/grouptalk-provisioning-tutorial.md) | ● |  |
| [Gtmhub](../saas-apps/gtmhub-provisioning-tutorial.md) | ● |  |
| [H5mag](../saas-apps/h5mag-provisioning-tutorial.md) | ● |  |
| [Harness](../saas-apps/harness-provisioning-tutorial.md) | ● | ● |
| HCL Domino | ● |  |
| [Headspace](../saas-apps/headspace-provisioning-tutorial.md) | ● | ● |
| [HelloID](../saas-apps/helloid-provisioning-tutorial.md) | ● |  |
| [Holmes Cloud](../saas-apps/holmes-cloud-provisioning-tutorial.md) | ● |  |
| [Hootsuite](../saas-apps/hootsuite-provisioning-tutorial.md) | ● | ● |
| [Hoxhunt](../saas-apps/hoxhunt-provisioning-tutorial.md) | ● | ● |
| [Howspace](../saas-apps/howspace-provisioning-tutorial.md) | ● |  |
| [Humbol](../saas-apps/humbol-provisioning-tutorial.md) | ● |  |
| [Hypervault](../saas-apps/hypervault-provisioning-tutorial.md) | ● |  |
| IBM DB2 ([SQL connector](../app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| IBM Tivoli Directory Server ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Ideo](../saas-apps/ideo-provisioning-tutorial.md) | ● | ● |
| [Ideagen Cloud](../saas-apps/ideagen-cloud-provisioning-tutorial.md) | ● |  |
| [Infor CloudSuite](../saas-apps/infor-cloudsuite-provisioning-tutorial.md) | ● | ● |
| [InformaCast](../saas-apps/informacast-provisioning-tutorial.md) | ● | ● |
| [iPass SmartConnect](../saas-apps/ipass-smartconnect-provisioning-tutorial.md) | ● | ● |
| [Iris Intranet](../saas-apps/iris-intranet-provisioning-tutorial.md) | ● | ● |
| [Insight4GRC](../saas-apps/insight4grc-provisioning-tutorial.md) | ● | ● |
| [Insite LMS](../saas-apps/insite-lms-provisioning-tutorial.md) | ● |  |
| [introDus Pre and Onboarding Platform](../saas-apps/introdus-pre-and-onboarding-platform-provisioning-tutorial.md) | ● |  |
| [Invision](../saas-apps/invision-provisioning-tutorial.md) | ● | ● |
| [InviteDesk](../saas-apps/invitedesk-provisioning-tutorial.md) | ● |  |
| Isode directory server ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Jive](../saas-apps/jive-provisioning-tutorial.md) | ● | ● |
| [Jostle](../saas-apps/jostle-provisioning-tutorial.md) | ● | ● |
| [Joyn FSM](../saas-apps/joyn-fsm-provisioning-tutorial.md) | ● |  |
| [Juno Journey](../saas-apps/juno-journey-provisioning-tutorial.md) | ● | ● |
| [Keeper Password Manager & Digital Vault](../saas-apps/keeper-password-manager-digitalvault-provisioning-tutorial.md) | ● | ● |
| [Keepabl](../saas-apps/keepabl-provisioning-tutorial.md) | ● | ● |
| [Kintone](../saas-apps/kintone-provisioning-tutorial.md) | ● | ● |
| [Kisi Phsyical Security](../saas-apps/kisi-physical-security-provisioning-tutorial.md) | ● | ● |
| [Klaxoon](../saas-apps/klaxoon-provisioning-tutorial.md) | ● | ● |
| [Klaxoon SAML](../saas-apps/klaxoon-saml-provisioning-tutorial.md) | ● | ● |
| [Kno2fy](../saas-apps/kno2fy-provisioning-tutorial.md) | ● | ● |
| [KnowBe4 Security Awareness Training](../saas-apps/knowbe4-security-awareness-training-provisioning-tutorial.md) | ● | ● |
| [Kpifire](../saas-apps/kpifire-provisioning-tutorial.md) | ● | ● |
| [KPN Grip](../saas-apps/kpn-grip-provisioning-tutorial.md) | ● | |
| [LanSchool Air](../saas-apps/lanschool-air-provisioning-tutorial.md) | ● | ● |
| [LawVu](../..//active-directory/saas-apps/lawvu-provisioning-tutorial.md) | ● | ● |
| [LDAP](../app-provisioning/on-premises-ldap-connector-configure.md) | ● |  |
| [LimbleCMMS](../saas-apps/limblecmms-provisioning-tutorial.md) | ● |  |
| [LinkedIn Elevate](../saas-apps/linkedinelevate-provisioning-tutorial.md) | ● | ● |
| [LinkedIn Sales Navigator](../saas-apps/linkedinsalesnavigator-provisioning-tutorial.md) | ● | ● |
| [Litmos](../saas-apps/litmos-provisioning-tutorial.md) | ● | ● |
| [Lucid (All Products)](../saas-apps/lucid-all-products-provisioning-tutorial.md) | ● | ● |
| [Lucidchart](../saas-apps/lucidchart-provisioning-tutorial.md) | ● | ● |
| [LUSID](../saas-apps/LUSID-provisioning-tutorial.md) | ● | ● |
| [Leapsome](../saas-apps/leapsome-provisioning-tutorial.md) | ● | ● |
| [LogicGate](../saas-apps/logicgate-provisioning-tutorial.md) | ● |  |
| [Looop](../saas-apps/looop-provisioning-tutorial.md) | ● |  |
| [LogMeIn](../saas-apps/logmein-provisioning-tutorial.md) | ● | ● |
| [M-Files](../saas-apps/m-files-provisioning-tutorial.md) | ● | ● |
| [Maptician](../saas-apps/maptician-provisioning-tutorial.md) | ● | ● |
| [Markit Procurement Service](../saas-apps/markit-procurement-service-provisioning-tutorial.md) | ● |  |
| [MediusFlow](../saas-apps/mediusflow-provisioning-tutorial.md) | ● |  |
| [MerchLogix](../saas-apps/merchlogix-provisioning-tutorial.md) | ● | ● |
| [Meta Networks Connector](../saas-apps/meta-networks-connector-provisioning-tutorial.md) | ● | ● |
| MicroFocus Novell eDirectory ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| Microsoft 365 | ● | ● |
| Microsoft Active Directory Domain Services | | ● |
| Microsoft Azure | ● | ● |
| [Microsoft Entra Domain Services](/entra/identity/domain-services/synchronization) | ● | ● |
| Microsoft Azure SQL ([SQL connector](../app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| Microsoft Lightweight Directory Server (ADAM) ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| Microsoft SharePoint Server (SharePoint) | ● |  |
| Microsoft SQL Server ([SQL connector](../app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| [Mixpanel](../saas-apps/mixpanel-provisioning-tutorial.md) | ● | ● |
| [Mindtickle](../saas-apps/mindtickle-provisioning-tutorial.md) | ● | ● |
| [Miro](../saas-apps/miro-provisioning-tutorial.md) | ● | ● |
| [Monday.com](../saas-apps/mondaycom-provisioning-tutorial.md) | ● | ● |
| [MongoDB Atlas](../saas-apps/mongodb-cloud-tutorial.md) |  | ● |
| [Moqups](../saas-apps/moqups-provisioning-tutorial.md) | ● | ● |
| [Mural Identity](../saas-apps/mural-identity-provisioning-tutorial.md) | ● | ● |
| [MX3 Diagnostics](../saas-apps/mx3-diagnostics-connector-provisioning-tutorial.md) | ● |  |
| [myPolicies](../saas-apps/mypolicies-provisioning-tutorial.md) | ● | ● |
| MySQL ([SQL connector](../app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| NetIQ eDirectory ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Netpresenter Next](../saas-apps/netpresenter-provisioning-tutorial.md) | ● |  |
| [Netskope User Authentication](../saas-apps/netskope-administrator-console-provisioning-tutorial.md) | ● | ● |
| [Netsparker Enterprise](../saas-apps/netsparker-enterprise-provisioning-tutorial.md) | ● | ● |
| [New Relic by Organization](../saas-apps/new-relic-by-organization-provisioning-tutorial.md) | ● | ● |
| [NordPass](../saas-apps/nordpass-provisioning-tutorial.md) | ● | ● |
| [Notion](../saas-apps/notion-provisioning-tutorial.md) | ● | ● |
| Novell eDirectory ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Office Space Software](../saas-apps/officespace-software-provisioning-tutorial.md) | ● | ● |
| [Olfeo SAAS](../saas-apps/olfeo-saas-provisioning-tutorial.md) | ● | ● |
| [Oneflow](../saas-apps/oneflow-provisioning-tutorial.md) | ● | ● |
| Open DJ ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| Open DS ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [OpenForms](../saas-apps/openforms-provisioning-tutorial.md) | ● |  |
| [OpenLDAP](../app-provisioning/on-premises-ldap-connector-configure.md) | ● |  |
| [OpenText Directory Services](../saas-apps/open-text-directory-services-provisioning-tutorial.md) | ● | ● |
| [Oracle Cloud Infrastructure Console](../saas-apps/oracle-cloud-infrastructure-console-provisioning-tutorial.md) | ● | ● |
| Oracle Database ([SQL connector](../app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| Oracle E-Business Suite | ● | ● |
| [Oracle Fusion ERP](../saas-apps/oracle-fusion-erp-provisioning-tutorial.md) | ● | ● |
| [O'Reilly Learning Platform](../saas-apps/oreilly-learning-platform-provisioning-tutorial.md) | ● | ● |
| Oracle Internet Directory | ● |  |
| Oracle PeopleSoft ERP | ● | ● |
| Oracle SunONE Directory Server ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [PagerDuty](../saas-apps/pagerduty-tutorial.md) |  | ● |
| [Palo Alto Networks Cloud Identity Engine - Cloud Authentication Service](../saas-apps/palo-alto-networks-cloud-identity-engine-provisioning-tutorial.md) | ● | ● |
| [Palo Alto Networks SCIM Connector](../saas-apps/palo-alto-networks-scim-connector-provisioning-tutorial.md) | ● | ● |
| [PaperCut Cloud Print Management](../saas-apps/papercut-cloud-print-management-provisioning-tutorial.md) | ● |  |
| [Parsable](../saas-apps/parsable-provisioning-tutorial.md) | ● |  |
| [Peripass](../saas-apps/peripass-provisioning-tutorial.md) | ● |  |
| [Pingboard](../saas-apps/pingboard-provisioning-tutorial.md) | ● | ● |
| [Plandisc](../saas-apps/plandisc-provisioning-tutorial.md) | ● |  |
| [Playvox](../saas-apps/playvox-provisioning-tutorial.md) | ● |  |
| [Postman](../saas-apps/postman-provisioning-tutorial.md) | ● | ● |
| [Preciate](../saas-apps/preciate-provisioning-tutorial.md) | ● |  |
| [PrinterLogic SaaS](../saas-apps/printer-logic-saas-provisioning-tutorial.md) | ● | ● |
| [Priority Matrix](../saas-apps/priority-matrix-provisioning-tutorial.md) | ● |  |
| [ProdPad](../saas-apps/prodpad-provisioning-tutorial.md) | ● | ● |
| [Promapp](../saas-apps/promapp-provisioning-tutorial.md) | ● |  |
| [Proxyclick](../saas-apps/proxyclick-provisioning-tutorial.md) | ● | ● |
| [Peakon](../saas-apps/peakon-provisioning-tutorial.md) | ● | ● |
| [Proware](../saas-apps/proware-provisioning-tutorial.md) | ● | ● |
| RadiantOne Virtual Directory Server (VDS) ([LDAP connector](../app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Real Links](../saas-apps/real-links-provisioning-tutorial.md) | ● | ● |
| [Recnice](../saas-apps/recnice-provisioning-tutorial.md) | ● |  |
| [Reward Gateway](../saas-apps/reward-gateway-provisioning-tutorial.md) | ● | ● |
| [RFPIO](../saas-apps/rfpio-provisioning-tutorial.md) | ● | ● |
| [Rhombus Systems](../saas-apps/rhombus-systems-provisioning-tutorial.md) | ● | ● |
| [Ring Central](../saas-apps/ringcentral-provisioning-tutorial.md) | ● | ● |
| [Robin](../saas-apps/robin-provisioning-tutorial.md) | ● | ● |
| [Rollbar](../saas-apps/rollbar-provisioning-tutorial.md) | ● | ● |
| [Rouse Sales](../saas-apps/rouse-sales-provisioning-tutorial.md) | ● |  |
| [Salesforce](../saas-apps/salesforce-provisioning-tutorial.md) | ● | ● |
| [SafeGuard Cyber](../saas-apps/safeguard-cyber-provisioning-tutorial.md) | ● | ● |
| [Salesforce Sandbox](../saas-apps/salesforce-sandbox-provisioning-tutorial.md) | ● | ● |
| [Samanage](../saas-apps/samanage-provisioning-tutorial.md) | ● | ● |
| SAML-based apps | | ●  |
| [SAP Analytics Cloud](../saas-apps/sap-analytics-cloud-provisioning-tutorial.md) | ● | ● |
| [SAP Cloud Platform](../saas-apps/sap-cloud-platform-identity-authentication-provisioning-tutorial.md) | ● | ● |
| [SAP R/3 and ERP](../app-provisioning/on-premises-sap-connector-configure.md) | ● |  |
| [SAP HANA](../saas-apps/saphana-tutorial.md) | ● | ● |
| [SAP SuccessFactors to Active Directory](../saas-apps/sap-successfactors-inbound-provisioning-tutorial.md) | ● | ● |
| [SAP SuccessFactors to Microsoft Entra ID](../saas-apps/sap-successfactors-inbound-provisioning-cloud-only-tutorial.md) | ● | ● |
| [SAP SuccessFactors Writeback](../saas-apps/sap-successfactors-writeback-tutorial.md) | ● | ● |
| [SchoolStream ASA](../saas-apps/schoolstream-asa-provisioning-tutorial.md) | ● | ● |
| [SCIM-based apps in the cloud](../app-provisioning/use-scim-to-provision-users-and-groups.md) | ● |  |
| [SCIM-based apps on-premises](../app-provisioning/on-premises-scim-provisioning.md) | ● |  |
| [ScreenSteps](../saas-apps/screensteps-provisioning-tutorial.md) | ● | ● |
| [Secure Deliver](../saas-apps/secure-deliver-provisioning-tutorial.md) | ● | ● |
| [SecureLogin](../saas-apps/secure-login-provisioning-tutorial.md) | ● |  |
| [Sentry](../saas-apps/sentry-provisioning-tutorial.md) | ● | ● |
| [ServiceNow](../saas-apps/servicenow-provisioning-tutorial.md) | ● | ● |
| [Segment](../saas-apps/segment-provisioning-tutorial.md) | ● | ● |
| [Shopify Plus](../saas-apps/shopify-plus-provisioning-tutorial.md) | ● | ● |
| [Sigma Computing](../saas-apps/sigma-computing-provisioning-tutorial.md) | ● | ● |
| [Signagelive](../saas-apps/signagelive-provisioning-tutorial.md) | ● | ● |
| [Slack](../saas-apps/slack-provisioning-tutorial.md) | ● | ● |
| [Smartfile](../saas-apps/smartfile-provisioning-tutorial.md) | ● | ● |
| [Smartsheet](../saas-apps/smartsheet-provisioning-tutorial.md) | ● |  |
| [Smallstep SSH](../saas-apps/smallstep-ssh-provisioning-tutorial.md) | ● |  |
| [Snowflake](../saas-apps/snowflake-provisioning-tutorial.md) | ● | ● |
| [Soloinsight - CloudGate SSO](../saas-apps/soloinsight-cloudgate-sso-provisioning-tutorial.md) | ● | ● |
| [SoSafe](../saas-apps/sosafe-provisioning-tutorial.md) | ● | ● |
| [SpaceIQ](../saas-apps/spaceiq-provisioning-tutorial.md) | ● | ● |
| [Splashtop](../saas-apps/splashtop-provisioning-tutorial.md) | ● | ● |
| [StarLeaf](../saas-apps/starleaf-provisioning-tutorial.md) | ● |  |
| [Storegate](../saas-apps/storegate-provisioning-tutorial.md) | ● |  |
| [SurveyMonkey Enterprise](../saas-apps/surveymonkey-enterprise-provisioning-tutorial.md) | ● | ● |
| [Swit](../saas-apps/swit-provisioning-tutorial.md) | ● | ● |
| [Symantec Web Security Service (WSS)](../saas-apps/symantec-web-security-service.md) | ● | ● |
| [Tableau Cloud](../saas-apps/tableau-online-provisioning-tutorial.md) | ● | ● |
| [Tailscale](../saas-apps/tailscale-provisioning-tutorial.md) | ● |  |
| [Talentech](../saas-apps/talentech-provisioning-tutorial.md) | ● |  |
| [Tanium SSO](../saas-apps/tanium-sso-provisioning-tutorial.md) | ● | ● |
| [Tap App Security](../saas-apps/tap-app-security-provisioning-tutorial.md) | ● | ● |
| [Taskize Connect](../saas-apps/taskize-connect-provisioning-tutorial.md) | ● | ● |
| [Teamgo](../saas-apps/teamgo-provisioning-tutorial.md) | ● | ● |
| [TeamViewer](../saas-apps/teamviewer-provisioning-tutorial.md) | ● | ● |
| [TerraTrue](../saas-apps/terratrue-provisioning-tutorial.md) | ● | ● |
| [ThousandEyes](../saas-apps/thousandeyes-provisioning-tutorial.md) | ● | ● |
| [Tic-Tac Mobile](../saas-apps/tic-tac-mobile-provisioning-tutorial.md) | ● |  |
| [TimeClock 365](../saas-apps/timeclock-365-provisioning-tutorial.md) | ● | ● |
| [TimeClock 365 SAML](../saas-apps/timeclock-365-saml-provisioning-tutorial.md) | ● | ● |
| [Templafy SAML2](../saas-apps/templafy-saml-2-provisioning-tutorial.md) | ● | ● |
| [Templafy OpenID Connect](../saas-apps/templafy-openid-connect-provisioning-tutorial.md) | ● | ● |
| [TheOrgWiki](../saas-apps/theorgwiki-provisioning-tutorial.md) | ● |  |
| [Thrive LXP](../saas-apps/thrive-lxp-provisioning-tutorial.md) | ● | ● |
| [Torii](../saas-apps/torii-provisioning-tutorial.md) | ● | ● |
| [TravelPerk](../saas-apps/travelperk-provisioning-tutorial.md) | ● | ● |
| [Tribeloo](../saas-apps/tribeloo-provisioning-tutorial.md) | ● | ● |
| [Twingate](../saas-apps/twingate-provisioning-tutorial.md) | ● |  |
| [Uber](../saas-apps/uber-provisioning-tutorial.md) | ● |  |
| [UNIFI](../saas-apps/unifi-provisioning-tutorial.md) | ● | ● |
| [uniFlow Online](../saas-apps/uniflow-online-provisioning-tutorial.md) | ● | ● |
| [uni-tel A/S](../saas-apps/uni-tel-as-provisioning-tutorial.md) | ● |  |
| [Vault Platform](../saas-apps/vault-platform-provisioning-tutorial.md) | ● | ● |
| [Vbrick Rev Cloud](../saas-apps/vbrick-rev-cloud-provisioning-tutorial.md) | ● | ● |
| [V-Client](../saas-apps/v-client-provisioning-tutorial.md) | ● | ● |
| [Velpic](../saas-apps/velpic-provisioning-tutorial.md) | ● | ● |
| [Visibly](../saas-apps/visibly-provisioning-tutorial.md) | ● | ● |
| [Visitly](../saas-apps/visitly-provisioning-tutorial.md) | ● | ● |
| [VMware](../saas-apps/vmware-identity-service-provisioning-tutorial.md) | ● | ● |
| [Vonage](../saas-apps/vonage-provisioning-tutorial.md) | ● | ● |
| [WATS](../saas-apps/wats-provisioning-tutorial.md) | ● |  |
| [Webroot Security Awareness Training](../saas-apps/webroot-security-awareness-training-provisioning-tutorial.md) | ● |  |
| [WEDO](../saas-apps/wedo-provisioning-tutorial.md) | ● | ● |
| [Whimsical](../saas-apps/whimsical-provisioning-tutorial.md) | ● | ● |
| [Workday to Active Directory](../saas-apps/workday-inbound-tutorial.md) | ● | ● |
| [Workday to Microsoft Entra ID](../saas-apps/workday-inbound-cloud-only-tutorial.md) | ● | ● |
| [Workday Writeback](../saas-apps/workday-writeback-tutorial.md) | ● | ● |
| [Workteam](../saas-apps/workteam-provisioning-tutorial.md) | ● | ● |
| [Workplace by Facebook](../saas-apps/workplace-by-facebook-provisioning-tutorial.md) | ● | ● |
| [Workgrid](../saas-apps/workgrid-provisioning-tutorial.md) | ● | ● |
| [Wrike](../saas-apps/wrike-provisioning-tutorial.md) | ● | ● |
| [Xledger](../saas-apps/xledger-provisioning-tutorial.md) | ● |  |
| [XM Fax and XM SendSecure](../saas-apps/xm-fax-and-xm-send-secure-provisioning-tutorial.md) | ● | ● |
| [Yellowbox](../saas-apps/yellowbox-provisioning-tutorial.md) | ● |  |
| [Zapier](../saas-apps/zapier-provisioning-tutorial.md) | ● |  |
| [Zendesk](../saas-apps/zendesk-provisioning-tutorial.md) | ● | ● |
| [Zenya](../saas-apps/zenya-provisioning-tutorial.md) | ● | ● |
| [Zero](../saas-apps/zero-provisioning-tutorial.md) | ● | ● |
| [Zip](../saas-apps/zip-provisioning-tutorial.md) | ● | ● |
| [Zoho One](../saas-apps/zoho-one-provisioning-tutorial.md) | ● | ● |
| [Zoom](../saas-apps/zoom-provisioning-tutorial.md) | ● | ● |
| [Zscaler](../saas-apps/zscaler-provisioning-tutorial.md) | ● | ● |
| [Zscaler Beta](../saas-apps/zscaler-beta-provisioning-tutorial.md) | ● | ● |
| [Zscaler One](../saas-apps/zscaler-one-provisioning-tutorial.md) | ● | ● |
| [Zscaler Private Access](../saas-apps/zscaler-private-access-provisioning-tutorial.md) | ● | ● |
| [Zscaler Two](../saas-apps/zscaler-two-provisioning-tutorial.md) | ● | ● |
| [Zscaler Three](../saas-apps/zscaler-three-provisioning-tutorial.md) | ● | ● |
| [Zscaler ZSCloud](../saas-apps/zscaler-zscloud-provisioning-tutorial.md) | ● | ● |

## Partner driven integrations
There is also a healthy partner ecosystem, further expanding the breadth and depth of integrations available with Microsoft Entra ID Governance. Explore the [partner integrations](../app-provisioning/partner-driven-integrations.md) available, including connectors for:
* Epic
* Cerner
* IBM RACF
* IBM i (AS/400)
* Aurion People & Payroll

## Next steps

To learn more about application provisioning, see [What is application provisioning](../app-provisioning/user-provisioning.md).
