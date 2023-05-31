---
title: 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/30/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: joroja

ms.collection: M365-identity-device-management
---
# Which authentication scenarios have Backup Authentication System Coverage?

Users and organizations around the world depend on the high availability of Azure Active Directory (Azure AD) authentication of users and services 24 hours a day, seven days a week. We promise a 99.99% Service Level availability for authentication, and we continuously seek to improve it by enhancing the resilience of our authentication service. To further improve resilience during outages, we implemented a backup system in 2021.

The Azure AD Backup Authentication System is made up of multiple decorrelated backup services that work together to increase authentication resilience if there's an outage. This system transparently and automatically handles authentications for supported applications and services if the primary Azure AD service is unavailable or degraded. It adds an extra layer of resilience on top of the multiple levels of redundancy in Azure AD as described [here](https://azure.microsoft.com/en-us/blog/advancing-service-resilience-in-azure-active-directory-with-its-backup-authentication-service/). 

We are on a journey to achieve wide coverage of all applications and services under reauthentication scenarios. This document is a snapshot in time on our journey, it specifies supported and unsupported authentication patterns with specific app by app examples to help our customers in their resilience planning.

During an outage of the primary service, users are able to continue working on the following types of applications as long as they accessed them in the last three days in the same device and no blocking policies exist that would curtail their access:

- Most Microsoft applications like Outlook, Word, Excel, PowerPoint, SharePoint, and OneDrive
- Many non-Microsoft email clients, running natively such as the #1 e-mail clients on iOS and Android. like many non-Microsoft SaaS applications available in the app gallery, like ADP, Atlassian, AWS, GoToMeeting, Kronos, Marketo, SAP, Trello, and Workday
- Selected line of business applications, as determined by their authentication patterns

Service to service authentication that relies on Azure Managed Identities or is built on Azure services, like Virtual Machines, Cloud Storage, Cognitive Services, and App Services, also receive incremental resilience from the back up authentication system.

In the next 12-18 months, our target is to cover more applications and services including: a. doubling the number of non-Microsoft SaaS apps covered, b. improving backup support for more Microsoft apps like Teams. and c. covering more infrastructure scenarios in addition to the Azure Managed Identity scenarios that are covered today

Microsoft is continuously expanding the number of cloud environments supported and the scenarios covered. 

## User Identity Resilience in the Backup Authentication System

The Backup Authentication System for users provides resilience to supported applications and users if there's an Azure AD outage. This system syncs authentication metadata when the system is healthy and uses that to enable users to continue to access applications during outages of the primary service while still enforcing policy controls.

### Which Microsoft applications are covered by the Backup Authentication System? 

The Backup Authentication System provides resilience to supported applications if there's an Azure AD outage. The system syncs user authentication metadata when the system is healthy and uses that to maintain user access to applications during outages of the primary authentication service.

#### Microsoft applications covered by the Backup Authentication System

> [!NOTE]
> Seamless backup coverage is provided to tens of thousands of applications based on protocol and authentication scenario patterns. Some of the most common Microsoft applications are listed below, with a more comprehensive list included in Appendix A.

##### Native Applications 

Native applications are those that are installed on a device, such as the Windows desktop versions of Office, or their iOS and Android counterparts. Since native applications often use different protocols than their web counterparts, the backup protection coverage may be different.

For all apps listed as “protected”, some functionality of these apps may be degraded during an outage depending on user activity and policy conditions. Please see section “Configuration impacts to resiliency”. 

| Application | Device Platform | Users Protected by Backup Authentication |
| --- | --- | --- |
| Word, Excel, PowerPoint | Windows, iOS, Android, macOS | Protected |
| OneNote | Windows, iOS, Android, macOS | Not Protected |
| Outlook | Windows, Android, iOS | Protected |
| OneDrive | Windows, iOS, macOS | Protected |
| OneDrive | Android | Not Protected |
| SharePoint | Windows, iOS | Protected |
| SharePoint | Android | Not Protected Protection expected Sept. 2023 |
| Teams | Windows, iOS, Android, macOS | Limited support for active meeting access and active chats |
| Azure Information Protection | All Platforms | Protected |
 
##### Web Applications

Web Applications are accessed through a browser or browser control embedded within another application.

| Application | Users Protected by Backup Authentication |
| --- | --- |
| Microsoft 365 App | Protected |
| Outlook Web Access | Protected |
| SharePoint Online | Protected |
| Teams Web | Not Protected |
| Microsoft 365 Admin Portal | Protected |
| Azure portal | Not Protected |
| Azure App Service | Protected for user authentication |
| My Apps Portal | Not Protected |

### Which non-Microsoft workloads are supported?

The Backup Authentication System automatically provides incremental resilience to tens of thousands of supported non-Microsoft applications based on their authentication patterns. See Appendix B for a list of the most common non-Microsoft applications and their coverage status. For an in depth explanation of which authentication patterns are supported, see the [Understanding Application Support for the Backup Authentication System](MISSING_LINK) article. 

| Authentication Pattern | Protection Status | Applications with coverage (examples) |
| --- | --- | --- |
| Native applications using the OAuth 2.0 protocol to access resource applications, such as the most popular non-Microsoft e-mail and IM clients. | Protected | #1 iOS email client app, and #1 Android email client appApple Mail, Aqua Mail, Gmail, Samsung Email, Spark, Thunderbird, |
| Web applications that are configured to authenticate with OpenID Connect using only ID tokens. | Protected | 29,500 “Line of Business” applications |
| Web applications authenticating with the SAML protocol, when configured* for IDP-Initiated Single Sign On (SSO) | Protected | ADP, Atlassian Cloud, AWS, GoToMeeting, Kronos, Marketo, Palo Alto Networks, SAP Cloud Identity Trello, Workday, Zscaler |

<!--- This whole section seems too future facing for my comfort. Blog post fine but not docs. Last asterisk section could remain.
### Non-Microsoft application types that are not protected

Authentication Pattern | Protected by Backup Authentication | Applications not yet covered (examples) |
| --- | --- | --- |
| Web applications that authenticate using Open ID Connect and request access tokens | Not Protected | Adobe Identity Management, Apple Business Manager, Apple School Manager, Line of Business (LOB) applications using MSAL, Smartsheet |
| Web applications that use the SAML protocol for authentication, when configured as SP-Initiated SSO | Not Protected | Blackboard Learn, Clever, DocuSign, FortiGate SSL VPN, Google Cloud G Suite Connector, Salesforce, Zoom |

*As of June 2023, applications using IdP-initiated SAML flows are supported. Some applications (like Atlassian Cloud, and Workday can be configured as “SP or as IDP initiated.”)
--->
### What makes a user supportable by the Backup Authentication System?

During an outage, a user can authenticate using the Backup Authentication System if the following conditions are met:

1. The user has successfully authenticated using the same app and device in the last three days.
1. The user isn't required to authenticate interactively
1. The user is accessing a resource as a member of their home tenant, rather than exercising a B2B or B2C scenario.
1. The user isn't subject to Conditional Access policies that limit the Backup Authentication System, like disabling [Resilience Defaults]().
1. The user hasn't been subject to a revocation event, such as a credential change since their last successful authentication.

### How does interactive authentication and user activity affect resilience?

The Backup Authentication System relies on metadata from a prior authentication to reauthenticate the user during an outage. For this reason, a user must have authenticated in the last three days using the same app on the same device for the backup service to be effective. Users who are inactive or haven't yet authenticated to a given app aren't served by the Backup Authentication System for that application.

### How do Conditional Access policies affect resilience?

Certain policies can't be evaluated in real-time by the Backup Authentication System and must rely on prior evaluations of these policies. Under outage conditions, the service uses a prior evaluation by default to maximize resilience. For example, access that is conditioned on a user having a particular role (like Application Administrator) continues during an outage based on the role the user had during that latest authentication. If the outage-only use of a previous evaluation needs to be restricted, tenant administrators can choose a strict evaluation of all Conditional Access policies, even under outage conditions, by disabling resilience defaults. This decision should be taken with care because disabling [resilience defaults]() for a given policy disables those users from using backup authentication. Resilience defaults must be re-enabled before an outage occurs for the backup system to provide resilience.

Certain other types of policies aren't supported by the Backup Authentication System. Use of the following policies reduce resilience: 

- Use of the [Sign-in Frequency Control]() as part of a Conditional Access Policy.
- Use of the [Authentication Methods Policy]().
- Use of [classic Conditional Access Policies]().

### Workload Identity Resilience in the Backup Authentication System

In addition to user authentication, the Backup Authentication System provides resilience for [Managed Identities (MI)]() and other key Azure infrastructure by offering a regionally isolated authentication service that is redundantly layered with the primary authentication service. This system enables the infrastructure authentication within an Azure region to be resilient to issues that may occur in another region or within the larger Azure Active Directory service. This system complements Azure’s cross-region architecture. Building your own applications using MI and following Azure’s [best practices for resilience and availability]() ensures your applications are highly resilient. In addition to MI, this regionally resilient backup system protects key Azure infrastructure and services that keep the cloud functional.

Summary of Infrastructure Authentication support

| Authentication Pattern | Protected by Backup Authentication | Applications |
| --- | --- | --- |
| Managed identity authentication | Protected | Your services built-on the Azure Infrastructure using Managed Identities. Complete list here. (Appendix) |
| Azure Internal Infrastructure | Protected | Azure services authenticating with each other |
| Service to Service Authentication not using managed identities | Not Protected | Your services built on or off Azure when the identities are registered as Service Principals and not “Managed Identities” |

### Cloud environments that support the Backup Authentication System

The Backup Authentication System is supported in all cloud environments except Azure China. The types of identities supported vary by cloud, as described in the table below. 

| Azure Environment | Types of Identities protected by Backup Authentication |
| --- | --- |
| Azure Commercial | Users, Managed Identities |
| Azure Government | Users, Managed Identities |
| Azure Government Secret | Managed Identities |
| Azure Government Top Secret | Managed Identities |
| Azure China (Operated by 21vianet) | Not available |

## Additional Resources

[Understanding Application Support for the Backup Authentication System]()
[Introduction to the Backup Authentication System]()
[Resilience Defaults for Azure AD Conditional Access]()
[Azure Active Directory SLA Performance Reporting]()
 
## Appendix – Reference lists of applications:
 
### Appendix A - Microsoft Applications and protection level as of May 2023

| AppName | Protected |
| --- | --- |
| Azure AD Identity Governance - Entitlement Management | Yes |
| Azure Data Factory | Yes |
| Azure Machine Learning Workbench Web App | Yes |
| Azure portal | No |
| Azure SQL Database and Data Warehouse | Yes |
| Azure Synapse Studio | Yes |
| Azure Virtual Desktop Client | Yes |
| Device Management Client | Yes |
| Field Service Mobile | Yes |
| Kusto Web Explorer | Yes |
| KustoClient | Yes |
| Lens Explorer | Yes |
| make.powerapps.com | Yes |
| make.powerpages.microsoft.com | Yes |
| Microsoft Azure CLI | Yes |
| Microsoft Azure Information Protection | Yes |
| Microsoft Azure PowerShell | Yes |
| Microsoft Azure Purview Studio | Yes |
| Microsoft Docs | Yes |
| Microsoft Dynamics CRM for tablets and phones | Yes |
| Microsoft Edge (Android) | No |
| Microsoft Edge (Win, iOS, macOS) | Yes |
| Microsoft Flow | Yes |
| Microsoft Flow Portal | Yes |
| Microsoft Flow Portal GCC | Yes |
| Microsoft Intune Company Portal | No |
| Microsoft Launcher (Android) | No |
| Microsoft Mesh | Yes |
| Microsoft Office | Yes |
| Microsoft Planner | Yes |
| Microsoft Power BI | Yes |
| Microsoft Stream Mobile Native 2.0 (Android, iOS) | Yes |
| Microsoft Stream Portal | No |
| Microsoft Teams (Android) | No |
| Microsoft Teams (iOS, macOS, Windows) | Partial scenario support |
| Microsoft Teams Admin Portal Service | Yes |
| Microsoft Teams Web Client | No |
| Microsoft To-Do client (Android) | No |
| Microsoft To-Do client (Win, iOS, macOS) | Yes |
| Microsoft Todo web app | Yes |
| Microsoft Whiteboard Services | Yes |
| My Apps | No |
| My Profile | Yes |
| My Signins | Yes |
| Office365 Shell WCSS-Client | Yes |
| One Outlook Web | Yes |
| OneDrive (Android) | No |
| OneDrive iOS App | Yes |
| OneDrive SyncEngine | Yes |
| OneNote (macOS) | Yes |
| OneNote (Win) | No |
| Outlook Mobile (Android) | No |
| Outlook Mobile (iOS) | Yes |
| Portfolios | Yes |
| Power BI Desktop | Yes |
| Power Platform Admin Center | Yes |
| PowerApps | Yes |
| PowerApps - apps.gov.powerapps.us | Yes |
| PowerApps - apps.powerapps.com (iOS, Android) | No |
| PowerApps - apps.powerapps.com (Win, macOS) | Yes |
| ProjectWorkManagement | Yes |
| SharePoint | Yes |
| SharePoint Android | No |
| SharePoint Online Web Client Extensibility | Yes |
| Visual Studio | Yes |
| Viva Goals Web App | Yes |
| Windows Search | Yes |
| Windows Virtual Desktop Client | Yes |
| Yammer iPhone | Yes |
| Yammer Web | No |

### Appendix B - Most popular common Non-Microsoft native client apps and app gallery applications

| App Name | Protected | Why not Protected? |
| --- | --- | --- |
| ABBYY FlexiCapture 12 | No | SAML SP-initiated |
| Adobe Experience Manager | No | SAML SP-initiated |
| Adobe Identity Management (OIDC) | No | OIDC with Access Token |
| ADP | Yes | Protected |
| Apple Business Manager | No | SAML SP-initiated |
| Apple Internet Accounts | Yes | Protected |
| Apple School Manager | No | OIDC with Access Token |
| Aqua Mail | Yes | Protected |
| Atlassian Cloud | Yes * | Protected |
| Blackboard Learn | No | SAML SP-initiated |
| Box | No | SAML SP-initiated |
| Brightspace by Desire2Leam | No | SAML SP-initiated |
| Canvas | No | SAML SP-initiated |
| Ceridian Dayforce HCM | No | SAML SP-initiated |
| Cisco AnyConnect | No | SAML SP-initiated |
| Cisco Webex | No | SAML SP-initiated |
| Citrix ADC SAML Connector forAzure AD | No | SAML SP-initiated |
| Clever | No | SAML SP-initiated |
| Cloud Drive Mapper | Yes | Protected |
| Cornerstone Single Sign-on | No | SAML SP-initiated |
| Docusign | No | SAML SP-initiated |
| Druva M365 Advanced | No | SAML SP-initiated | <!--Confirm name of app this doesnt appear correct-->
| F5 BIG-IP ARM Azure AD integration | No | SAML SP-initiated |
| FortiGate SSL VPN | No | SAML SP-initiated |
| Freshworks | No | SAML SP-initiated |
| Gmail | Yes | Protected |
| Google Cloud / G Suite Connector by Microsoft | No | SAML SP-initiated |
| HubSpot Sales | No | SAML SP-initiated |
| Kronos | Yes * | Protected |
| Madrasati App | No | SAML SP-initiated |
| OpenAthens | No | SAML SP-initiated |
| Oracle Fusion ERP | No | SAML SP-initiated |
| Palo Alto Networks - GlobalProtect | No | SAML SP-initiated |
| Polycom - Skype for Business Certified Phone | Yes | Protected |
| Salesforce | No | SAML SP-initiated |
| Samsung Email | Yes | Protected |
| SAP Cloud Platform Identity Authentication | No | SAML SP-initiated |
| SAP concur | Yes * | SAML SP-initiated |
| SAP Concur Travel and Expense | Yes * | Protected |
| SAP Fiori | No | SAML SP-initiated |
| SAP NetWeaver | No | SAML SP-initiated |
| SAP SuccessFactors | No | SAML SP-initiated |
| Service Now | No | SAML SP-initiated |
| Slack | No | SAML SP-initiated |
| Smartsheet | No | SAML SP-initiated |
| Spark | Yes | Protected |
| Thunderbird | Yes | Protected |
| UKG pro | Yes * | Protected |
| VMware Boxer | Yes | Protected |
| walkMe | No | SAML SP-initiated |
| Workday | No | SAML SP-initiated |
| Workplace from Facebook | No | SAML SP-initiated |
| Zoom | No | SAML SP-initiated |
| Zscaler | Yes * | Protected |
| Zscaler Private Access (ZPA) | No | SAML SP-initiated |
| Zscaler ZSCloud | No | SAML SP-initiated |

*Note: Apps configured to authenticate with the SAML protocol are protected when using IDP-Initiated authentication. Service Provider (SP) initiated SAML configurations are not supported
 
### Appendix C - Azure Resources and their status on Backup protection

| resource | Azure Resource Name | Status |
| microsoft.apimanagement | API Management service in Azure Government and China regions | Protected |
| microsoft.app | App Service | Protected |
| microsoft.appconfiguration | Azure App Configuration | Protected |
| microsoft.appplatform | Azure App Service | Protected |
| microsoft.authorization | Azure Active Directory | Protected |
| microsoft.automation | Automation Service | Protected |
| microsoft.avs | Azure VMware Solution | Protected |
| microsoft.batch | Azure Batch | Protected |
| microsoft.cache | Azure Cache for Redis | Protected |
| microsoft.cdn | Azure Content Delivery Network (CDN) | Not Protected |
| microsoft.chaos | Azure Chaos Engineering | Protected |
| microsoft.cognitiveservices | Cognitive Services APIs and Containers | Protected |
| microsoft.communication | Azure Communication Services | Not Protected |
| microsoft.compute | Azure Virtual Machines | Protected |
| microsoft.containerinstance | Azure Container Instances | Protected |
| microsoft.containerregistry | Azure Container Registry | Protected |
| microsoft.containerservice | Azure Container Service (deprecated) | Protected |
| microsoft.dashboard | Azure Dashboards | Protected |
| microsoft.databasewatcher | Azure SQL Database Automatic Tuning | Protected |
| microsoft.databox | Azure Data Box | Protected |
| microsoft.databricks | Azure Databricks | Not Protected |
| microsoft.datacollaboration | Azure Data Share | Protected |
| microsoft.datadog | Datadog | Protected |
| microsoft.datafactory | Azure Data Factory | Protected |
| microsoft.datalakestore | Azure Data Lake Storage Gen1 and Gen2 | Not Protected |
| microsoft.dataprotection | Microsoft Cloud App Security Data Protection API | Protected |
| microsoft.dbformysql | Azure Database for MySQL | Protected |
| microsoft.dbforpostgresql | Azure Database for PostgreSQL | Protected |
| microsoft.delegatednetwork | Delegated Network Management service | Protected |
| microsoft.devcenter | Microsoft Store for Business and Education | Protected |
| microsoft.devices | Azure IoT Hub and IoT Central | Not Protected |
| microsoft.deviceupdate | Windows 10 IoT Core Services Device Update | Protected |
| microsoft.devtestlab | Azure DevTest Labs | Protected |
| microsoft.digitaltwins | Azure Digital Twins | Protected |
| microsoft.documentdb | Azure Cosmos DB | Protected |
| microsoft.eventgrid | Azure Event Grid | Protected |
| microsoft.eventhub | Azure Event Hubs | Protected |
| microsoft.healthbot | Health Bot Service | Protected |
| microsoft.healthcareapis | FHIR API for Azure API for FHIR and Microsoft Cloud for Healthcare solutions | Protected |
| microsoft.hybridcontainerservice | Azure Arc enabled Kubernetes | Protected |
| microsoft.hybridnetwork | Azure Virtual WAN | Protected |
| microsoft.insights | Application Insights and Log Analytics | Not Protected |
| microsoft.iotcentral | IoT Central | Protected |
| microsoft.kubernetes | Azure Kubernetes Service (AKS) | Protected |
| microsoft.kusto | Azure Data Explorer (Kusto) | Protected |
| microsoft.loadtestservice | Visual Studio Load Testing Service | Protected |
| microsoft.logic | Azure Logic Apps | Protected |
| microsoft.machinelearningservices | Machine Learning Services on Azure | Protected |
| microsoft.managedidentity | Managed Identities for Microsoft Resources | Protected |
| microsoft.maps | Azure Maps | Protected |
| microsoft.media | Azure Media Services | Protected |
| microsoft.migrate | Azure Migrate | Protected |
| microsoft.mixedreality | Mixed Reality services including Remote Rendering, Spatial Anchors, and Object Anchors | Not Protected |
| microsoft.netapp | Azure NetApp Files | Protected |
| microsoft.network | Azure Virtual Network | Protected |
| microsoft.openenergyplatform | Open Energy Platform (OEP) on Azure | Protected |
| microsoft.operationalinsights | Azure Monitor Logs | Protected |
| microsoft.powerplatform | Microsoft Power Platform | Protected |
| microsoft.purview | Azure Purview (formerly Azure Data Catalog) | Protected |
| microsoft.quantum | Microsoft Quantum Development Kit | Protected |
| microsoft.recommendationsservice | Azure Cognitive Services Recommendations API | Protected |
| microsoft.recoveryservices | Azure Site Recovery | Protected |
| microsoft.resourceconnector | Azure Resource Connector | Protected |
| microsoft.scom | System Center Operations Manager (SCOM) | Protected |
| microsoft.search | Azure Cognitive Search | Not Protected |
| microsoft.security | Azure Security Center | Not Protected |
| microsoft.securitydetonation | Microsoft Defender for Endpoint Detonation Service | Protected |
| microsoft.servicebus | Service Bus messaging service and Event Grid Domain Topics | Protected |
| microsoft.servicefabric | Azure Service Fabric | Protected |
| microsoft.signalrservice | Azure SignalR Service | Protected |
| microsoft.solutions | Azure Solutions | Protected |
| microsoft.sql | SQL Server on Virtual Machines and SQL Managed Instance on Azure | Protected |
| microsoft.storage | Azure Storage | Protected |
| microsoft.storagecache | Azure Storage Cache | Protected |
| microsoft.storagesync | Azure File Sync | Protected |
| microsoft.streamanalytics | Azure Stream Analytics | Not Protected |
| microsoft.synapse | Synapse Analytics (formerly SQL DW) and Synapse Studio (formerly SQL DW Studio) | Protected |
| microsoft.usagebilling | Azure Usage and Billing Portal | Not Protected |
| microsoft.videoindexer | Video Indexer | Protected |
| microsoft.voiceservices | Azure Communication Services - Voice APIs | Not Protected |
| microsoft.web | Web Apps | Protected |

## Next steps
