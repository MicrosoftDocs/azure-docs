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
| HR | [SuccessFactors - User Provisioning](../../active-directory/saas-apps/sap-successfactors-inbound-provisioning-tutorial.md) |
| HR | [Workday - User Provisioning](../../active-directory/saas-apps/workday-inbound-cloud-only-tutorial.md)|
|[LDAP directory](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md)| OpenLDAP<br>Microsoft Active Directory Lightweight Directory Services<br>389 Directory Server<br>Apache Directory Server<br>IBM Tivoli DS<br>Isode Directory<br>NetIQ eDirectory<br>Novell eDirectory<br>Open DJ<br>Open DS<br>Oracle (previously Sun ONE) Directory Server Enterprise Edition<br>RadiantOne Virtual Directory Server (VDS) |
| [SQL database](../../active-directory/app-provisioning/tutorial-ecma-sql-connector.md)| Microsoft SQL Server and Azure SQL<br>IBM DB2 10.x<br>IBM DB2 9.x<br>Oracle 10g and 11g<br>Oracle 12c and 18c<br>MySQL 5.x|
| Cloud platform| [AWS IAM Identity Center](../../active-directory/saas-apps/aws-single-sign-on-provisioning-tutorial.md) |
| Cloud platform| [Google Cloud Platform - User Provisioning](../../active-directory/saas-apps/g-suite-provisioning-tutorial.md) |
| Business applications|[SAP Cloud Identity Platform - Provisioning](../../active-directory/saas-apps/sap-cloud-platform-identity-authentication-provisioning-tutorial.md) |
| CRM| [Salesforce - User Provisioning](../../active-directory/saas-apps/salesforce-provisioning-tutorial.md) |
| ITSM| [ServiceNow](../../active-directory/saas-apps/servicenow-provisioning-tutorial.md)|


<a name='entra-identity-governance-integrations'></a>

## Microsoft Entra ID Governance integrations
The list below provides key integrations between Microsoft Entra ID Governance and various applications, including both provisioning and SSO integrations. For a full list of applications that Microsoft Entra ID integrates with specifically for SSO, see [here](../../active-directory/saas-apps/tutorial-list.md). 

Microsoft Entra ID Governance can be integrated with many other applications, using standards such as OpenID Connect, SAML, SCIM, SQL and LDAP. If you're using a SaaS application which isn't listed, then [ask the SaaS vendor to onboard](../manage-apps/v2-howto-app-gallery-listing.md).  For integration with other applications, see [integrating applications with Microsoft Entra ID](identity-governance-applications-integrate.md).

| Application | Automated provisioning | Single Sign On (SSO)|
| :--- | :-:  | :-: |
| 389 directory server ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [4me](../../active-directory/saas-apps/4me-provisioning-tutorial.md) | ● | ●| 
| [8x8](../../active-directory/saas-apps/8x8-provisioning-tutorial.md) | ● | ● |
| [15five](../../active-directory/saas-apps/15five-provisioning-tutorial.md) | ● | ● |
| [Acunetix 360](../../active-directory/saas-apps/acunetix-360-provisioning-tutorial.md) | ● | ● |
| [Adobe Identity Management](../../active-directory/saas-apps/adobe-identity-management-provisioning-tutorial.md) | ● | ● |
| [Adobe Identity Management (OIDC)](../../active-directory/saas-apps/adobe-identity-management-provisioning-oidc-tutorial.md) | ● | ● |
| [Airbase](../../active-directory/saas-apps/airbase-provisioning-tutorial.md) | ● | ● |
| [Aha!](../../active-directory/saas-apps/aha-tutorial.md) |  | ● |
| [Airstack](../../active-directory/saas-apps/airstack-provisioning-tutorial.md) | ● |  |
| [Akamai Enterprise Application Access](../../active-directory/saas-apps/akamai-enterprise-application-access-provisioning-tutorial.md) | ● | ● |
| [Airtable](../../active-directory/saas-apps/airtable-provisioning-tutorial.md) | ● | ● |
| [Albert](../../active-directory/saas-apps/albert-provisioning-tutorial.md) | ● |  |
| [AlertMedia](../../active-directory/saas-apps/alertmedia-provisioning-tutorial.md) | ● | ● |
| [Alexis HR](../../active-directory/saas-apps/alexishr-provisioning-tutorial.md) | ● | ● |
| [Alinto Protect (renamed Cleanmail)](../../active-directory/saas-apps/alinto-protect-provisioning-tutorial.md) | ● | |
| [Alvao](../../active-directory/saas-apps/alvao-provisioning-tutorial.md) | ● |  |
| [Amazon Web Services (AWS) - Role Provisioning](../../active-directory/saas-apps/amazon-web-service-tutorial.md) | ● | ● |
| Apache Directory Server ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Appaegis Isolation Access Cloud](../../active-directory/saas-apps/appaegis-isolation-access-cloud-provisioning-tutorial.md) | ● | ● |
| [Apple School Manager](../../active-directory/saas-apps/apple-school-manager-provision-tutorial.md) | ● |  |
| [Apple Business Manager](../../active-directory/saas-apps/apple-business-manager-provision-tutorial.md) | ● |  |
| [Ardoq](../../active-directory/saas-apps/ardoq-provisioning-tutorial.md) | ● | ● |
| [Asana](../../active-directory/saas-apps/asana-provisioning-tutorial.md) | ● | ● |
| [AskSpoke](../../active-directory/saas-apps/askspoke-provisioning-tutorial.md) | ● | ● |
| [Atea](../../active-directory/saas-apps/atea-provisioning-tutorial.md) | ● |  |
| [Atlassian Cloud](../../active-directory/saas-apps/atlassian-cloud-provisioning-tutorial.md) | ● | ● |
| [Atmos](../../active-directory/saas-apps/atmos-provisioning-tutorial.md) | ● |  |
| [AuditBoard](../../active-directory/saas-apps/auditboard-provisioning-tutorial.md) | ● |  |
| [Autodesk SSO](../../active-directory/saas-apps/autodesk-sso-provisioning-tutorial.md) | ● | ● |
| [Azure Databricks SCIM Connector](/azure/databricks/administration-guide/users-groups/scim/aad) | ● |  |
| [AWS IAM Identity Center](../../active-directory/saas-apps/aws-single-sign-on-provisioning-tutorial.md) | ● | ● |
| [Axiad Cloud](../../active-directory/saas-apps/axiad-cloud-provisioning-tutorial.md) | ● | ● |
| [BambooHR](../../active-directory/saas-apps/bamboo-hr-tutorial.md) |  | ● |
| [BenQ IAM](../../active-directory/saas-apps/benq-iam-provisioning-tutorial.md) | ● | ● |
| [Bentley - Automatic User Provisioning](../../active-directory/saas-apps/bentley-automatic-user-provisioning-tutorial.md) | ● |  |
| [Better Stack](../../active-directory/saas-apps/better-stack-provisioning-tutorial.md) | ● |  |
| [BIC Cloud Design](../../active-directory/saas-apps/bic-cloud-design-provisioning-tutorial.md) | ● | ● |
| [BIS](../../active-directory/saas-apps/bis-provisioning-tutorial.md) | ● | ● |
| [BitaBIZ](../../active-directory/saas-apps/bitabiz-provisioning-tutorial.md) | ● | ● |
| [Bizagi Studio for Digital Process Automation](../../active-directory/saas-apps/bizagi-studio-for-digital-process-automation-provisioning-tutorial.md) | ● | ● |
| [BLDNG APP](../../active-directory/saas-apps/bldng-app-provisioning-tutorial.md) | ● |  |
| [Blink](../../active-directory/saas-apps/blink-provisioning-tutorial.md) | ● | ● |
| [Blinq](../../active-directory/saas-apps/blinq-provisioning-tutorial.md) | ● |  |
| [BlogIn](../../active-directory/saas-apps/blogin-provisioning-tutorial.md) | ● | ● |
| [BlueJeans](../../active-directory/saas-apps/bluejeans-provisioning-tutorial.md) | ● | ● |
| [Bonusly](../../active-directory/saas-apps/bonusly-provisioning-tutorial.md) | ● | ● |
| [Box](../../active-directory/saas-apps/box-userprovisioning-tutorial.md) | ● | ● |
| [Boxcryptor](../../active-directory/saas-apps/boxcryptor-provisioning-tutorial.md) | ● | ● |
| [Bpanda](../../active-directory/saas-apps/bpanda-provisioning-tutorial.md) | ● |  |
| [Brivo Onair Identity Connector](../../active-directory/saas-apps/brivo-onair-identity-connector-provisioning-tutorial.md) | ● |  |
| [Britive](../../active-directory/saas-apps/britive-provisioning-tutorial.md) | ● | ● |
| [BrowserStack Single Sign-on](../../active-directory/saas-apps/browserstack-single-sign-on-provisioning-tutorial.md) | ● | ● |
| [BullseyeTDP](../../active-directory/saas-apps/bullseyetdp-provisioning-tutorial.md) | ● | ● |
| [Cato Networks Provisioning](../../active-directory/saas-apps/cato-networks-provisioning-tutorial.md) | ● |  |
| [Cerner Central](../../active-directory/saas-apps/cernercentral-provisioning-tutorial.md) | ● | ● |
| [Cerby](../../active-directory/saas-apps/cerby-provisioning-tutorial.md) | ● | ● |
| [Chaos](../../active-directory/saas-apps/chaos-provisioning-tutorial.md) | ● |  |
| [Chatwork](../../active-directory/saas-apps/chatwork-provisioning-tutorial.md) | ● | ● |
| [CheckProof](../../active-directory/saas-apps/checkproof-provisioning-tutorial.md) | ● | ● |
| [Cinode](../../active-directory/saas-apps/cinode-provisioning-tutorial.md) | ● |  |
| [Cisco Umbrella User Management](../../active-directory/saas-apps/cisco-umbrella-user-management-provisioning-tutorial.md) | ● | ● |
| [Cisco Webex](../../active-directory/saas-apps/cisco-webex-provisioning-tutorial.md) | ● | ● |
| [Clarizen One](../../active-directory/saas-apps/clarizen-one-provisioning-tutorial.md) | ● | ● |
| [Cleanmail Swiss](../../active-directory/saas-apps/cleanmail-swiss-provisioning-tutorial.md) | ● |  |
| [Clebex](../../active-directory/saas-apps/clebex-provisioning-tutorial.md) | ● | ● |
| [Cloud Academy SSO](../../active-directory/saas-apps/cloud-academy-sso-provisioning-tutorial.md) | ● | ● |
| [Coda](../../active-directory/saas-apps/coda-provisioning-tutorial.md) | ● | ● |
| [Code42](../../active-directory/saas-apps/code42-provisioning-tutorial.md) | ● | ● |
| [Cofense Recipient Sync](../../active-directory/saas-apps/cofense-provision-tutorial.md) | ● |  |
| [Comeet Recruiting Software](../../active-directory/saas-apps/comeet-recruiting-software-provisioning-tutorial.md) | ● | ● |
| [Connecter](../../active-directory/saas-apps/connecter-provisioning-tutorial.md) | ● |  |
| [Contentful](../../active-directory/saas-apps/contentful-provisioning-tutorial.md) | ● | ● |
| [Concur](../../active-directory/saas-apps/concur-provisioning-tutorial.md) | ● | ● |
| [Cornerstone OnDemand](../../active-directory/saas-apps/cornerstone-ondemand-provisioning-tutorial.md) | ● | ● |
| [CybSafe](../../active-directory/saas-apps/cybsafe-provisioning-tutorial.md) | ● |  |
| [Dagster Cloud](../../active-directory/saas-apps/dagster-cloud-provisioning-tutorial.md) | ● | ● |
| [Datadog](../../active-directory/saas-apps/datadog-provisioning-tutorial.md) | ● | ● |
| [Documo](../../active-directory/saas-apps/documo-provisioning-tutorial.md) | ● | ● |
| [DocuSign](../../active-directory/saas-apps/docusign-provisioning-tutorial.md) | ● | ● |
| [Dropbox Business](../../active-directory/saas-apps/dropboxforbusiness-provisioning-tutorial.md) | ● | ● |
| [Dialpad](../../active-directory/saas-apps/dialpad-provisioning-tutorial.md) | ● |  |
| [DigiCert](../../active-directory/saas-apps/digicert-tutorial.md) | | ● |
| [Directprint.io](../../active-directory/saas-apps/directprint-io-provisioning-tutorial.md) | ● | ● |
| [Druva](../../active-directory/saas-apps/druva-provisioning-tutorial.md) | ● | ● |
| [Dynamic Signal](../../active-directory/saas-apps/dynamic-signal-provisioning-tutorial.md) | ● | ● |
| [Embed Signage](../../active-directory/saas-apps/embed-signage-provisioning-tutorial.md) | ● | ● |
| [Envoy](../../active-directory/saas-apps/envoy-provisioning-tutorial.md) | ● | ● |
| [Eletive](../../active-directory/saas-apps/eletive-provisioning-tutorial.md) | ● |  |
| [Elium](../../active-directory/saas-apps/elium-provisioning-tutorial.md) | ● | ● |
| [Exium](../../active-directory/saas-apps/exium-provisioning-tutorial.md) | ● | ● |
| [Evercate](../../active-directory/saas-apps/evercate-provisioning-tutorial.md) | ● |  |
| [Facebook Work Accounts](../../active-directory/saas-apps/facebook-work-accounts-provisioning-tutorial.md) | ● | ● |
| [Federated Directory](../../active-directory/saas-apps/federated-directory-provisioning-tutorial.md) | ● |  |
| [Figma](../../active-directory/saas-apps/figma-provisioning-tutorial.md) | ● | ● |
| [Flock](../../active-directory/saas-apps/flock-provisioning-tutorial.md) | ● | ● |
| [Foodee](../../active-directory/saas-apps/foodee-provisioning-tutorial.md) | ● | ● |
| [Fortes Change Cloud](../../active-directory/saas-apps/fortes-change-cloud-provisioning-tutorial.md) | ● | ● |
| [Frankli.io](../../active-directory/saas-apps/frankli-io-provisioning-tutorial.md) | ● | |
| [Freshservice Provisioning](../../active-directory/saas-apps/freshservice-provisioning-tutorial.md) | ● | ● |
| [Funnel Leasing](../../active-directory/saas-apps/funnel-leasing-provisioning-tutorial.md) | ● | ● |
| [Fuze](../../active-directory/saas-apps/fuze-provisioning-tutorial.md) | ● | ● |
| [G Suite](../../active-directory/saas-apps/g-suite-provisioning-tutorial.md) | ● |  |
| [Genesys Cloud for Azure](../../active-directory/saas-apps/purecloud-by-genesys-provisioning-tutorial.md) | ● | ● |
| [getAbstract](../../active-directory/saas-apps/getabstract-provisioning-tutorial.md) | ● | ● |
| [GHAE](../../active-directory/saas-apps/ghae-provisioning-tutorial.md) | ● | ● |
| [GitHub](../../active-directory/saas-apps/github-provisioning-tutorial.md) | ● | ● |
| [GitHub AE](../../active-directory/saas-apps/github-ae-provisioning-tutorial.md) | ● | ● |
| [GitHub Enterprise Managed User](../../active-directory/saas-apps/github-enterprise-managed-user-provisioning-tutorial.md) | ● | ● |
| [GitHub Enterprise Managed User (OIDC)](../../active-directory/saas-apps/github-enterprise-managed-user-oidc-provisioning-tutorial.md) | ● | ● |
| [GoToMeeting](../../active-directory/saas-apps/citrixgotomeeting-provisioning-tutorial.md) | ● | ● |
| [Global Relay Identity Sync](../../active-directory/saas-apps/global-relay-identity-sync-provisioning-tutorial.md) | ● |  |
| [Gong](../../active-directory/saas-apps/gong-provisioning-tutorial.md) | ● |  |
| [GoLinks](../../active-directory/saas-apps/golinks-provisioning-tutorial.md) | ● | ● |
| [Grammarly](../../active-directory/saas-apps/grammarly-provisioning-tutorial.md) | ● | ● |
| [Group Talk](../../active-directory/saas-apps/grouptalk-provisioning-tutorial.md) | ● |  |
| [Gtmhub](../../active-directory/saas-apps/gtmhub-provisioning-tutorial.md) | ● |  |
| [H5mag](../../active-directory/saas-apps/h5mag-provisioning-tutorial.md) | ● |  |
| [Harness](../../active-directory/saas-apps/harness-provisioning-tutorial.md) | ● | ● |
| HCL Domino | ● |  |
| [Headspace](../../active-directory/saas-apps/headspace-provisioning-tutorial.md) | ● | ● |
| [HelloID](../../active-directory/saas-apps/helloid-provisioning-tutorial.md) | ● |  |
| [Holmes Cloud](../../active-directory/saas-apps/holmes-cloud-provisioning-tutorial.md) | ● |  |
| [Hootsuite](../../active-directory/saas-apps/hootsuite-provisioning-tutorial.md) | ● | ● |
| [Hoxhunt](../../active-directory/saas-apps/hoxhunt-provisioning-tutorial.md) | ● | ● |
| [Howspace](../../active-directory/saas-apps/howspace-provisioning-tutorial.md) | ● |  |
| [Humbol](../../active-directory/saas-apps/humbol-provisioning-tutorial.md) | ● |  |
| IBM DB2 ([SQL connector](../../active-directory/app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| IBM Tivoli Directory Server ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Ideo](../../active-directory/saas-apps/ideo-provisioning-tutorial.md) | ● | ● |
| [Ideagen Cloud](../../active-directory/saas-apps/ideagen-cloud-provisioning-tutorial.md) | ● |  |
| [Infor CloudSuite](../../active-directory/saas-apps/infor-cloudsuite-provisioning-tutorial.md) | ● | ● |
| [InformaCast](../../active-directory/saas-apps/informacast-provisioning-tutorial.md) | ● | ● |
| [iPass SmartConnect](../../active-directory/saas-apps/ipass-smartconnect-provisioning-tutorial.md) | ● | ● |
| [Iris Intranet](../../active-directory/saas-apps/iris-intranet-provisioning-tutorial.md) | ● | ● |
| [Insight4GRC](../../active-directory/saas-apps/insight4grc-provisioning-tutorial.md) | ● | ● |
| [Insite LMS](../../active-directory/saas-apps/insite-lms-provisioning-tutorial.md) | ● |  |
| [introDus Pre and Onboarding Platform](../../active-directory/saas-apps/introdus-pre-and-onboarding-platform-provisioning-tutorial.md) | ● |  |
| [Invision](../../active-directory/saas-apps/invision-provisioning-tutorial.md) | ● | ● |
| [InviteDesk](../../active-directory/saas-apps/invitedesk-provisioning-tutorial.md) | ● |  |
| Isode directory server ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Jive](../../active-directory/saas-apps/jive-provisioning-tutorial.md) | ● | ● |
| [Jostle](../../active-directory/saas-apps/jostle-provisioning-tutorial.md) | ● | ● |
| [Joyn FSM](../../active-directory/saas-apps/joyn-fsm-provisioning-tutorial.md) | ● |  |
| [Juno Journey](../../active-directory/saas-apps/juno-journey-provisioning-tutorial.md) | ● | ● |
| [Keeper Password Manager & Digital Vault](../../active-directory/saas-apps/keeper-password-manager-digitalvault-provisioning-tutorial.md) | ● | ● |
| [Keepabl](../../active-directory/saas-apps/keepabl-provisioning-tutorial.md) | ● | ● |
| [Kintone](../../active-directory/saas-apps/kintone-provisioning-tutorial.md) | ● | ● |
| [Kisi Phsyical Security](../../active-directory/saas-apps/kisi-physical-security-provisioning-tutorial.md) | ● | ● |
| [Klaxoon](../../active-directory/saas-apps/klaxoon-provisioning-tutorial.md) | ● | ● |
| [Klaxoon SAML](../../active-directory/saas-apps/klaxoon-saml-provisioning-tutorial.md) | ● | ● |
| [Kno2fy](../../active-directory/saas-apps/kno2fy-provisioning-tutorial.md) | ● | ● |
| [KnowBe4 Security Awareness Training](../../active-directory/saas-apps/knowbe4-security-awareness-training-provisioning-tutorial.md) | ● | ● |
| [Kpifire](../../active-directory/saas-apps/kpifire-provisioning-tutorial.md) | ● | ● |
| [KPN Grip](../../active-directory/saas-apps/kpn-grip-provisioning-tutorial.md) | ● | |
| [LanSchool Air](../../active-directory/saas-apps/lanschool-air-provisioning-tutorial.md) | ● | ● |
| [LawVu](../..//active-directory/saas-apps/lawvu-provisioning-tutorial.md) | ● | ● |
| [LDAP](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) | ● |  |
| [LimbleCMMS](../../active-directory/saas-apps/limblecmms-provisioning-tutorial.md) | ● |  |
| [LinkedIn Elevate](../../active-directory/saas-apps/linkedinelevate-provisioning-tutorial.md) | ● | ● |
| [LinkedIn Sales Navigator](../../active-directory/saas-apps/linkedinsalesnavigator-provisioning-tutorial.md) | ● | ● |
| [Lucid (All Products)](../../active-directory/saas-apps/lucid-all-products-provisioning-tutorial.md) | ● | ● |
| [Lucidchart](../../active-directory/saas-apps/lucidchart-provisioning-tutorial.md) | ● | ● |
| [LUSID](../../active-directory/saas-apps/LUSID-provisioning-tutorial.md) | ● | ● |
| [Leapsome](../../active-directory/saas-apps/leapsome-provisioning-tutorial.md) | ● | ● |
| [LogicGate](../../active-directory/saas-apps/logicgate-provisioning-tutorial.md) | ● |  |
| [Looop](../../active-directory/saas-apps/looop-provisioning-tutorial.md) | ● |  |
| [LogMeIn](../../active-directory/saas-apps/logmein-provisioning-tutorial.md) | ● | ● |
| [Maptician](../../active-directory/saas-apps/maptician-provisioning-tutorial.md) | ● | ● |
| [Markit Procurement Service](../../active-directory/saas-apps/markit-procurement-service-provisioning-tutorial.md) | ● |  |
| [MediusFlow](../../active-directory/saas-apps/mediusflow-provisioning-tutorial.md) | ● |  |
| [MerchLogix](../../active-directory/saas-apps/merchlogix-provisioning-tutorial.md) | ● | ● |
| [Meta Networks Connector](../../active-directory/saas-apps/meta-networks-connector-provisioning-tutorial.md) | ● | ● |
| MicroFocus Novell eDirectory ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| Microsoft 365 | ● | ● |
| Microsoft Active Directory Domain Services | | ● |
| Microsoft Azure | ● | ● |
| [Microsoft Entra Domain Services](../../active-directory-domain-services/synchronization.md) | ● | ● |
| Microsoft Azure SQL ([SQL connector](../../active-directory/app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| Microsoft Lightweight Directory Server (ADAM) ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| Microsoft SharePoint Server (SharePoint) | ● |  |
| Microsoft SQL Server ([SQL connector](../../active-directory/app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| [Mixpanel](../../active-directory/saas-apps/mixpanel-provisioning-tutorial.md) | ● | ● |
| [Mindtickle](../../active-directory/saas-apps/mindtickle-provisioning-tutorial.md) | ● | ● |
| [Miro](../../active-directory/saas-apps/miro-provisioning-tutorial.md) | ● | ● |
| [Monday.com](../../active-directory/saas-apps/mondaycom-provisioning-tutorial.md) | ● | ● |
| [MongoDB Atlas](../../active-directory/saas-apps/mongodb-cloud-tutorial.md) |  | ● |
| [Moqups](../../active-directory/saas-apps/moqups-provisioning-tutorial.md) | ● | ● |
| [Mural Identity](../../active-directory/saas-apps/mural-identity-provisioning-tutorial.md) | ● | ● |
| [MX3 Diagnostics](../../active-directory/saas-apps/mx3-diagnostics-connector-provisioning-tutorial.md) | ● |  |
| [myPolicies](../../active-directory/saas-apps/mypolicies-provisioning-tutorial.md) | ● | ● |
| MySQL ([SQL connector](../../active-directory/app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| NetIQ eDirectory ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Netpresenter Next](../../active-directory/saas-apps/netpresenter-provisioning-tutorial.md) | ● |  |
| [Netskope User Authentication](../../active-directory/saas-apps/netskope-administrator-console-provisioning-tutorial.md) | ● | ● |
| [Netsparker Enterprise](../../active-directory/saas-apps/netsparker-enterprise-provisioning-tutorial.md) | ● | ● |
| [New Relic by Organization](../../active-directory/saas-apps/new-relic-by-organization-provisioning-tutorial.md) | ● | ● |
| [NordPass](../../active-directory/saas-apps/nordpass-provisioning-tutorial.md) | ● | ● |
| [Notion](../../active-directory/saas-apps/notion-provisioning-tutorial.md) | ● | ● |
| Novell eDirectory ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Office Space Software](../../active-directory/saas-apps/officespace-software-provisioning-tutorial.md) | ● | ● |
| [Olfeo SAAS](../../active-directory/saas-apps/olfeo-saas-provisioning-tutorial.md) | ● | ● |
| Open DJ ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| Open DS ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [OpenForms](../../active-directory/saas-apps/openforms-provisioning-tutorial.md) | ● |  |
| [OpenLDAP](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) | ● |  |
| [OpenText Directory Services](../../active-directory/saas-apps/open-text-directory-services-provisioning-tutorial.md) | ● | ● |
| [Oracle Cloud Infrastructure Console](../../active-directory/saas-apps/oracle-cloud-infrastructure-console-provisioning-tutorial.md) | ● | ● |
| Oracle Database ([SQL connector](../../active-directory/app-provisioning/tutorial-ecma-sql-connector.md) ) | ● |  |
| Oracle E-Business Suite | ● | ● |
| [Oracle Fusion ERP](../../active-directory/saas-apps/oracle-fusion-erp-provisioning-tutorial.md) | ● | ● |
| [O'Reilly Learning Platform](../../active-directory/saas-apps/oreilly-learning-platform-provisioning-tutorial.md) | ● | ● |
| Oracle Internet Directory | ● |  |
| Oracle PeopleSoft ERP | ● | ● |
| Oracle SunONE Directory Server ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [PagerDuty](../../active-directory/saas-apps/pagerduty-tutorial.md) |  | ● |
| [Palo Alto Networks Cloud Identity Engine - Cloud Authentication Service](../../active-directory/saas-apps/palo-alto-networks-cloud-identity-engine-provisioning-tutorial.md) | ● | ● |
| [Palo Alto Networks SCIM Connector](../../active-directory/saas-apps/palo-alto-networks-scim-connector-provisioning-tutorial.md) | ● | ● |
| [PaperCut Cloud Print Management](../../active-directory/saas-apps/papercut-cloud-print-management-provisioning-tutorial.md) | ● |  |
| [Parsable](../../active-directory/saas-apps/parsable-provisioning-tutorial.md) | ● |  |
| [Peripass](../../active-directory/saas-apps/peripass-provisioning-tutorial.md) | ● |  |
| [Pingboard](../../active-directory/saas-apps/pingboard-provisioning-tutorial.md) | ● | ● |
| [Plandisc](../../active-directory/saas-apps/plandisc-provisioning-tutorial.md) | ● |  |
| [Playvox](../../active-directory/saas-apps/playvox-provisioning-tutorial.md) | ● |  |
| [Preciate](../../active-directory/saas-apps/preciate-provisioning-tutorial.md) | ● |  |
| [PrinterLogic SaaS](../../active-directory/saas-apps/printer-logic-saas-provisioning-tutorial.md) | ● | ● |
| [Priority Matrix](../../active-directory/saas-apps/priority-matrix-provisioning-tutorial.md) | ● |  |
| [ProdPad](../../active-directory/saas-apps/prodpad-provisioning-tutorial.md) | ● | ● |
| [Promapp](../../active-directory/saas-apps/promapp-provisioning-tutorial.md) | ● |  |
| [Proxyclick](../../active-directory/saas-apps/proxyclick-provisioning-tutorial.md) | ● | ● |
| [Peakon](../../active-directory/saas-apps/peakon-provisioning-tutorial.md) | ● | ● |
| [Proware](../../active-directory/saas-apps/proware-provisioning-tutorial.md) | ● | ● |
| RadiantOne Virtual Directory Server (VDS) ([LDAP connector](../../active-directory/app-provisioning/on-premises-ldap-connector-configure.md) ) | ● |  |
| [Real Links](../../active-directory/saas-apps/real-links-provisioning-tutorial.md) | ● | ● |
| [Reward Gateway](../../active-directory/saas-apps/reward-gateway-provisioning-tutorial.md) | ● | ● |
| [RFPIO](../../active-directory/saas-apps/rfpio-provisioning-tutorial.md) | ● | ● |
| [Rhombus Systems](../../active-directory/saas-apps/rhombus-systems-provisioning-tutorial.md) | ● | ● |
| [Ring Central](../../active-directory/saas-apps/ringcentral-provisioning-tutorial.md) | ● | ● |
| [Robin](../../active-directory/saas-apps/robin-provisioning-tutorial.md) | ● | ● |
| [Rollbar](../../active-directory/saas-apps/rollbar-provisioning-tutorial.md) | ● | ● |
| [Rouse Sales](../../active-directory/saas-apps/rouse-sales-provisioning-tutorial.md) | ● |  |
| [Salesforce](../../active-directory/saas-apps/salesforce-provisioning-tutorial.md) | ● | ● |
| [SafeGuard Cyber](../../active-directory/saas-apps/safeguard-cyber-provisioning-tutorial.md) | ● | ● |
| [Salesforce Sandbox](../../active-directory/saas-apps/salesforce-sandbox-provisioning-tutorial.md) | ● | ● |
| [Samanage](../../active-directory/saas-apps/samanage-provisioning-tutorial.md) | ● | ● |
| SAML-based apps | | ●  |
| [SAP Analytics Cloud](../../active-directory/saas-apps/sap-analytics-cloud-provisioning-tutorial.md) | ● | ● |
| [SAP Cloud Platform](../../active-directory/saas-apps/sap-cloud-platform-identity-authentication-provisioning-tutorial.md) | ● | ● |
| [SAP R/3 and ERP](../../active-directory/app-provisioning/on-premises-sap-connector-configure.md) | ● |  |
| [SAP HANA](../../active-directory/saas-apps/saphana-tutorial.md) | ● | ● |
| [SAP SuccessFactors to Active Directory](../../active-directory/saas-apps/sap-successfactors-inbound-provisioning-tutorial.md) | ● | ● |
| [SAP SuccessFactors to Microsoft Entra ID](../../active-directory/saas-apps/sap-successfactors-inbound-provisioning-cloud-only-tutorial.md) | ● | ● |
| [SAP SuccessFactors Writeback](../../active-directory/saas-apps/sap-successfactors-writeback-tutorial.md) | ● | ● |
| [SchoolStream ASA](../../active-directory/saas-apps/schoolstream-asa-provisioning-tutorial.md) | ● | ● |
| [SCIM-based apps in the cloud](../app-provisioning/use-scim-to-provision-users-and-groups.md) | ● |  |
| [SCIM-based apps on-premises](../app-provisioning/on-premises-scim-provisioning.md) | ● |  |
| [Secure Deliver](../../active-directory/saas-apps/secure-deliver-provisioning-tutorial.md) | ● | ● |
| [SecureLogin](../../active-directory/saas-apps/secure-login-provisioning-tutorial.md) | ● |  |
| [Sentry](../../active-directory/saas-apps/sentry-provisioning-tutorial.md) | ● | ● |
| [ServiceNow](../../active-directory/saas-apps/servicenow-provisioning-tutorial.md) | ● | ● |
| [Segment](../../active-directory/saas-apps/segment-provisioning-tutorial.md) | ● | ● |
| [Shopify Plus](../../active-directory/saas-apps/shopify-plus-provisioning-tutorial.md) | ● | ● |
| [Sigma Computing](../../active-directory/saas-apps/sigma-computing-provisioning-tutorial.md) | ● | ● |
| [Signagelive](../../active-directory/saas-apps/signagelive-provisioning-tutorial.md) | ● | ● |
| [Slack](../../active-directory/saas-apps/slack-provisioning-tutorial.md) | ● | ● |
| [Smartfile](../../active-directory/saas-apps/smartfile-provisioning-tutorial.md) | ● | ● |
| [Smartsheet](../../active-directory/saas-apps/smartsheet-provisioning-tutorial.md) | ● |  |
| [Smallstep SSH](../../active-directory/saas-apps/smallstep-ssh-provisioning-tutorial.md) | ● |  |
| [Snowflake](../../active-directory/saas-apps/snowflake-provisioning-tutorial.md) | ● | ● |
| [Soloinsight - CloudGate SSO](../../active-directory/saas-apps/soloinsight-cloudgate-sso-provisioning-tutorial.md) | ● | ● |
| [SoSafe](../../active-directory/saas-apps/sosafe-provisioning-tutorial.md) | ● | ● |
| [SpaceIQ](../../active-directory/saas-apps/spaceiq-provisioning-tutorial.md) | ● | ● |
| [Splashtop](../../active-directory/saas-apps/splashtop-provisioning-tutorial.md) | ● | ● |
| [StarLeaf](../../active-directory/saas-apps/starleaf-provisioning-tutorial.md) | ● |  |
| [Storegate](../../active-directory/saas-apps/storegate-provisioning-tutorial.md) | ● |  |
| [SurveyMonkey Enterprise](../../active-directory/saas-apps/surveymonkey-enterprise-provisioning-tutorial.md) | ● | ● |
| [Swit](../../active-directory/saas-apps/swit-provisioning-tutorial.md) | ● | ● |
| [Symantec Web Security Service (WSS)](../../active-directory/saas-apps/symantec-web-security-service.md) | ● | ● |
| [Tableau Cloud](../../active-directory/saas-apps/tableau-online-provisioning-tutorial.md) | ● | ● |
| [Tailscale](../../active-directory/saas-apps/tailscale-provisioning-tutorial.md) | ● |  |
| [Talentech](../../active-directory/saas-apps/talentech-provisioning-tutorial.md) | ● |  |
| [Tanium SSO](../../active-directory/saas-apps/tanium-sso-provisioning-tutorial.md) | ● | ● |
| [Tap App Security](../../active-directory/saas-apps/tap-app-security-provisioning-tutorial.md) | ● | ● |
| [Taskize Connect](../../active-directory/saas-apps/taskize-connect-provisioning-tutorial.md) | ● | ● |
| [Teamgo](../../active-directory/saas-apps/teamgo-provisioning-tutorial.md) | ● | ● |
| [TeamViewer](../../active-directory/saas-apps/teamviewer-provisioning-tutorial.md) | ● | ● |
| [TerraTrue](../../active-directory/saas-apps/terratrue-provisioning-tutorial.md) | ● | ● |
| [ThousandEyes](../../active-directory/saas-apps/thousandeyes-provisioning-tutorial.md) | ● | ● |
| [Tic-Tac Mobile](../../active-directory/saas-apps/tic-tac-mobile-provisioning-tutorial.md) | ● |  |
| [TimeClock 365](../../active-directory/saas-apps/timeclock-365-provisioning-tutorial.md) | ● | ● |
| [TimeClock 365 SAML](../../active-directory/saas-apps/timeclock-365-saml-provisioning-tutorial.md) | ● | ● |
| [Templafy SAML2](../../active-directory/saas-apps/templafy-saml-2-provisioning-tutorial.md) | ● | ● |
| [Templafy OpenID Connect](../../active-directory/saas-apps/templafy-openid-connect-provisioning-tutorial.md) | ● | ● |
| [TheOrgWiki](../../active-directory/saas-apps/theorgwiki-provisioning-tutorial.md) | ● |  |
| [Thrive LXP](../../active-directory/saas-apps/thrive-lxp-provisioning-tutorial.md) | ● | ● |
| [Torii](../../active-directory/saas-apps/torii-provisioning-tutorial.md) | ● | ● |
| [TravelPerk](../../active-directory/saas-apps/travelperk-provisioning-tutorial.md) | ● | ● |
| [Tribeloo](../../active-directory/saas-apps/tribeloo-provisioning-tutorial.md) | ● | ● |
| [Twingate](../../active-directory/saas-apps/twingate-provisioning-tutorial.md) | ● |  |
| [Uber](../../active-directory/saas-apps/uber-provisioning-tutorial.md) | ● |  |
| [UNIFI](../../active-directory/saas-apps/unifi-provisioning-tutorial.md) | ● | ● |
| [uniFlow Online](../../active-directory/saas-apps/uniflow-online-provisioning-tutorial.md) | ● | ● |
| [uni-tel A/S](../../active-directory/saas-apps/uni-tel-as-provisioning-tutorial.md) | ● |  |
| [Vault Platform](../../active-directory/saas-apps/vault-platform-provisioning-tutorial.md) | ● | ● |
| [Vbrick Rev Cloud](../../active-directory/saas-apps/vbrick-rev-cloud-provisioning-tutorial.md) | ● | ● |
| [V-Client](../../active-directory/saas-apps/v-client-provisioning-tutorial.md) | ● | ● |
| [Velpic](../../active-directory/saas-apps/velpic-provisioning-tutorial.md) | ● | ● |
| [Visibly](../../active-directory/saas-apps/visibly-provisioning-tutorial.md) | ● | ● |
| [Visitly](../../active-directory/saas-apps/visitly-provisioning-tutorial.md) | ● | ● |
| [Vonage](../../active-directory/saas-apps/vonage-provisioning-tutorial.md) | ● | ● |
| [WATS](../../active-directory/saas-apps/wats-provisioning-tutorial.md) | ● |  |
| [Webroot Security Awareness Training](../../active-directory/saas-apps/webroot-security-awareness-training-provisioning-tutorial.md) | ● |  |
| [WEDO](../../active-directory/saas-apps/wedo-provisioning-tutorial.md) | ● | ● |
| [Whimsical](../../active-directory/saas-apps/whimsical-provisioning-tutorial.md) | ● | ● |
| [Workday to Active Directory](../../active-directory/saas-apps/workday-inbound-tutorial.md) | ● | ● |
| [Workday to Microsoft Entra ID](../../active-directory/saas-apps/workday-inbound-cloud-only-tutorial.md) | ● | ● |
| [Workday Writeback](../../active-directory/saas-apps/workday-writeback-tutorial.md) | ● | ● |
| [Workteam](../../active-directory/saas-apps/workteam-provisioning-tutorial.md) | ● | ● |
| [Workplace by Facebook](../../active-directory/saas-apps/workplace-by-facebook-provisioning-tutorial.md) | ● | ● |
| [Workgrid](../../active-directory/saas-apps/workgrid-provisioning-tutorial.md) | ● | ● |
| [Wrike](../../active-directory/saas-apps/wrike-provisioning-tutorial.md) | ● | ● |
| [Xledger](../../active-directory/saas-apps/xledger-provisioning-tutorial.md) | ● |  |
| [Yellowbox](../../active-directory/saas-apps/yellowbox-provisioning-tutorial.md) | ● |  |
| [Zapier](../../active-directory/saas-apps/zapier-provisioning-tutorial.md) | ● |  |
| [Zendesk](../../active-directory/saas-apps/zendesk-provisioning-tutorial.md) | ● | ● |
| [Zenya](../../active-directory/saas-apps/zenya-provisioning-tutorial.md) | ● | ● |
| [Zero](../../active-directory/saas-apps/zero-provisioning-tutorial.md) | ● | ● |
| [Zip](../../active-directory/saas-apps/zip-provisioning-tutorial.md) | ● | ● |
| [Zoom](../../active-directory/saas-apps/zoom-provisioning-tutorial.md) | ● | ● |
| [Zscaler](../../active-directory/saas-apps/zscaler-provisioning-tutorial.md) | ● | ● |
| [Zscaler Beta](../../active-directory/saas-apps/zscaler-beta-provisioning-tutorial.md) | ● | ● |
| [Zscaler One](../../active-directory/saas-apps/zscaler-one-provisioning-tutorial.md) | ● | ● |
| [Zscaler Private Access](../../active-directory/saas-apps/zscaler-private-access-provisioning-tutorial.md) | ● | ● |
| [Zscaler Two](../../active-directory/saas-apps/zscaler-two-provisioning-tutorial.md) | ● | ● |
| [Zscaler Three](../../active-directory/saas-apps/zscaler-three-provisioning-tutorial.md) | ● | ● |
| [Zscaler ZSCloud](../../active-directory/saas-apps/zscaler-zscloud-provisioning-tutorial.md) | ● | ● |

## Partner driven integrations
There is also a healthy partner ecosystem, further expanding the breadth and depth of integrations available with Microsoft Entra ID Governance. Explore the [partner integrations](../../active-directory/app-provisioning/partner-driven-integrations.md) available, including connectors for:
* Epic
* Cerner
* IBM RACF
* IBM i (AS/400)
* Aurion People & Payroll

## Next steps

To learn more about application provisioning, see [What is application provisioning](../../active-directory/app-provisioning/user-provisioning.md).
