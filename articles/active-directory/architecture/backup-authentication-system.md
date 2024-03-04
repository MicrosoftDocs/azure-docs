---
title: Azure AD's backup authentication system
description: Increasing the resilience of the authentication plane with the backup authentication system.

services: active-directory
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 06/02/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: joroja

ms.collection: M365-identity-device-management
---
# Azure AD's backup authentication system

Users and organizations around the world depend on the high availability of Azure Active Directory (Azure AD) authentication of users and services 24 hours a day, seven days a week. We promise a 99.99% Service Level availability for authentication, and we continuously seek to improve it by enhancing the resilience of our authentication service. To further improve resilience during outages, we implemented a backup system in 2021.

The Azure AD backup authentication system is made up of multiple backup services that work together to increase authentication resilience if there's an outage. This system transparently and automatically handles authentications for supported applications and services if the primary Azure AD service is unavailable or degraded. It adds an extra layer of resilience on top of the multiple levels of existing redundancy. This resilience is described in the blog post [Advancing service resilience in Azure Active Directory with its backup authentication service](https://azure.microsoft.com/blog/advancing-service-resilience-in-azure-active-directory-with-its-backup-authentication-service/). This system syncs authentication metadata when the system is healthy and uses that to enable users to continue to access applications during outages of the primary service while still enforcing policy controls.

During an outage of the primary service, users are able to continue working with their applications, as long as they accessed them in the last three days from the same device, and no blocking policies exist that would curtail their access:

In addition to Microsoft applications, we support:

- Native email clients on iOS and Android. 
- SaaS applications available in the app gallery, like ADP, Atlassian, AWS, GoToMeeting, Kronos, Marketo, SAP, Trello, Workday, and more.
- Selected line of business applications, based on their authentication patterns.

Service to service authentication that relies on Azure AD managed identities or are built on Azure services, like virtual machines, cloud storage, Azure AI services, and App Services, receives increased resilience from the back up authentication system. 

Microsoft is continuously expanding the number of supported scenarios. 

## Which non-Microsoft workloads are supported?

The backup authentication system automatically provides incremental resilience to tens of thousands of supported non-Microsoft applications based on their authentication patterns. See the appendix for a list of the most [common non-Microsoft applications and their coverage status](#appendix). For an in depth explanation of which authentication patterns are supported, see the article [Understanding Application Support for the backup authentication system](backup-authentication-system-apps.md) article. 

- Native applications using the OAuth 2.0 protocol to access resource applications, such as popular non-Microsoft e-mail and IM clients like: Apple Mail, Aqua Mail, Gmail, Samsung Email, and Spark.
- Line of business web applications configured to authenticate with OpenID Connect using only ID tokens.
- Web applications authenticating with the SAML protocol, when configured for IDP-Initiated Single Sign On (SSO) like: ADP, Atlassian Cloud, AWS, GoToMeeting, Kronos, Marketo, Palo Alto Networks, SAP Cloud Identity Trello, Workday, and Zscaler.

### Non-Microsoft application types that aren't protected

The following auth patterns aren't currently supported:

- Web applications that authenticate using Open ID Connect and request access tokens
- Web applications that use the SAML protocol for authentication, when configured as SP-Initiated SSO

## What makes a user supportable by the backup authentication system?

During an outage, a user can authenticate using the backup authentication system if the following conditions are met:

1. The user has successfully authenticated using the same app and device in the last three days.
1. The user isn't required to authenticate interactively
1. The user is accessing a resource as a member of their home tenant, rather than exercising a B2B or B2C scenario.
1. The user isn't subject to Conditional Access policies that limit the backup authentication system, like disabling [resilience defaults](../conditional-access/resilience-defaults.md).
1. The user hasn't been subject to a revocation event, such as a credential change since their last successful authentication.

### How does interactive authentication and user activity affect resilience?

The backup authentication system relies on metadata from a prior authentication to reauthenticate the user during an outage. For this reason, a user must have authenticated in the last three days using the same app on the same device for the backup service to be effective. Users who are inactive or haven't yet authenticated to a given app can't use the backup authentication system for that application.

### How do Conditional Access policies affect resilience?

Certain policies can't be evaluated in real-time by the backup authentication system and must rely on prior evaluations of these policies. Under outage conditions, the service uses a prior evaluation by default to maximize resilience. For example, access that is conditioned on a user having a particular role (like Application Administrator) continues during an outage based on the role the user had during that latest authentication. If the outage-only use of a previous evaluation needs to be restricted, tenant administrators can choose a strict evaluation of all Conditional Access policies, even under outage conditions, by disabling resilience defaults. This decision should be taken with care because disabling [resilience defaults](../conditional-access/resilience-defaults.md) for a given policy disables those users from using backup authentication. Resilience defaults must be re-enabled before an outage occurs for the backup system to provide resilience.

Certain other types of policies don't support use of the backup authentication system. Use of the following policies reduce resilience: 

- Use of the [sign-in frequency control](../conditional-access/concept-conditional-access-session.md#sign-in-frequency) as part of a Conditional Access policy.
- Use of the [authentication methods policy](../conditional-access/concept-conditional-access-grant.md#require-authentication-strength).
- Use of [classic Conditional Access policies](../conditional-access/policy-migration.md).

## Workload identity resilience in the backup authentication system

In addition to user authentication, the backup authentication system provides resilience for [managed identities](../managed-identities-azure-resources/overview.md) and other key Azure infrastructure by offering a regionally isolated authentication service that is redundantly layered with the primary authentication service. This system enables the infrastructure authentication within an Azure region to be resilient to issues that may occur in another region or within the larger Azure Active Directory service. This system complements Azure’s cross-region architecture. Building your own applications using MI and following Azure’s [best practices for resilience and availability]() ensures your applications are highly resilient. In addition to MI, this regionally resilient backup system protects key Azure infrastructure and services that keep the cloud functional.

### Summary of infrastructure authentication support

- Your services built-on the Azure Infrastructure using managed identities are protected by the backup authentication system.
- Azure services authenticating with each other are protected by the backup authentication system.
- Your services built on or off Azure when the identities are registered as Service Principals and not “managed identities” **aren't protected** by the backup authentication system.

## Cloud environments that support the backup authentication system

The backup authentication system is supported in all cloud environments except Microsoft Azure operated by 21Vianet. The types of identities supported vary by cloud, as described in the following table. 

| Azure environment | Identities protected |
| --- | --- |
| Azure Commercial | Users, managed identities |
| Azure Government | Users, managed identities |
| Azure Government Secret | managed identities |
| Azure Government Top Secret | managed identities |
| Azure operated by 21Vianet | Not available |

## Appendix

### Popular non-Microsoft native client apps and app gallery applications

| App Name | Protected | Why Not protected? |
| --- | --- | --- |
| ABBYY FlexiCapture 12 | No | SAML SP-initiated |
| Adobe Experience Manager | No | SAML SP-initiated |
| Adobe Identity Management (OIDC) | No | OIDC with Access Token |
| ADP | Yes | Protected |
| Apple Business Manager | No | SAML SP-initiated |
| Apple Internet Accounts | Yes | Protected |
| Apple School Manager | No | OIDC with Access Token |
| Aqua Mail | Yes | Protected |
| Atlassian Cloud | Yes \* | Protected |
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
| Druva | No | SAML SP-initiated |
| F5 BIG-IP ARM Azure AD integration | No | SAML SP-initiated |
| FortiGate SSL VPN | No | SAML SP-initiated |
| Freshworks | No | SAML SP-initiated |
| Gmail | Yes | Protected |
| Google Cloud / G Suite Connector by Microsoft | No | SAML SP-initiated |
| HubSpot Sales | No | SAML SP-initiated |
| Kronos | Yes \* | Protected |
| Madrasati App | No | SAML SP-initiated |
| OpenAthens | No | SAML SP-initiated |
| Oracle Fusion ERP | No | SAML SP-initiated |
| Palo Alto Networks - GlobalProtect | No | SAML SP-initiated |
| Polycom - Skype for Business Certified Phone | Yes | Protected |
| Salesforce | No | SAML SP-initiated |
| Samsung Email | Yes | Protected |
| SAP Cloud Platform Identity Authentication | No | SAML SP-initiated |
| SAP Concur | Yes \* | SAML SP-initiated |
| SAP Concur Travel and Expense | Yes \* | Protected |
| SAP Fiori | No | SAML SP-initiated |
| SAP NetWeaver | No | SAML SP-initiated |
| SAP SuccessFactors | No | SAML SP-initiated |
| Service Now | No | SAML SP-initiated |
| Slack | No | SAML SP-initiated |
| Smartsheet | No | SAML SP-initiated |
| Spark | Yes | Protected |
| UKG pro | Yes \* | Protected |
| VMware Boxer | Yes | Protected |
| walkMe | No | SAML SP-initiated |
| Workday | No | SAML SP-initiated |
| Workplace from Facebook | No | SAML SP-initiated |
| Zoom | No | SAML SP-initiated |
| Zscaler | Yes \* | Protected |
| Zscaler Private Access (ZPA) | No | SAML SP-initiated |
| Zscaler ZSCloud | No | SAML SP-initiated |

> [!NOTE]
> \* Apps configured to authenticate with the SAML protocol are protected when using IDP-Initiated authentication. Service Provider (SP) initiated SAML configurations aren't supported

### Azure resources and their status

| resource | Azure resource name | Status |
| --- | --- | --- | 
| microsoft.apimanagement | API Management service in Azure Government and China regions | Protected |
| microsoft.app | App Service | Protected |
| microsoft.appconfiguration | Azure App Configuration | Protected |
| microsoft.appplatform | Azure App Service | Protected |
| microsoft.authorization | Azure Active Directory | Protected |
| microsoft.automation | Automation Service | Protected |
| microsoft.avs | Azure VMware Solution | Protected |
| microsoft.batch | Azure Batch | Protected |
| microsoft.cache | Azure Cache for Redis | Protected |
| microsoft.cdn | Azure Content Delivery Network (CDN) | Not protected |
| microsoft.chaos | Azure Chaos Engineering | Protected |
| microsoft.cognitiveservices | Azure AI services APIs and Containers | Protected |
| microsoft.communication | Azure Communication Services | Not protected |
| microsoft.compute | Azure Virtual Machines | Protected |
| microsoft.containerinstance | Azure Container Instances | Protected |
| microsoft.containerregistry | Azure Container Registry | Protected |
| microsoft.containerservice | Azure Container Service (deprecated) | Protected |
| microsoft.dashboard | Azure Dashboards | Protected |
| microsoft.databasewatcher | Azure SQL Database Automatic Tuning | Protected |
| microsoft.databox | Azure Data Box | Protected |
| microsoft.databricks | Azure Databricks | Not protected |
| microsoft.datacollaboration | Azure Data Share | Protected |
| microsoft.datadog | Datadog | Protected |
| microsoft.datafactory | Azure Data Factory | Protected |
| microsoft.datalakestore | Azure Data Lake Storage Gen1 and Gen2 | Not protected |
| microsoft.dataprotection | Microsoft Cloud App Security Data Protection API | Protected |
| microsoft.dbformysql | Azure Database for MySQL | Protected |
| microsoft.dbforpostgresql | Azure Database for PostgreSQL | Protected |
| microsoft.delegatednetwork | Delegated Network Management service | Protected |
| microsoft.devcenter | Microsoft Store for Business and Education | Protected |
| microsoft.devices | Azure IoT Hub and IoT Central | Not protected |
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
| microsoft.insights | Application Insights and Log Analytics | Not protected |
| microsoft.iotcentral | IoT Central | Protected |
| microsoft.kubernetes | Azure Kubernetes Service (AKS) | Protected |
| microsoft.kusto | Azure Data Explorer (Kusto) | Protected |
| microsoft.loadtestservice | Visual Studio Load Testing Service | Protected |
| microsoft.logic | Azure Logic Apps | Protected |
| microsoft.machinelearningservices | Machine Learning Services on Azure | Protected |
| microsoft.managedidentity | Managed identities for Microsoft Resources | Protected |
| microsoft.maps | Azure Maps | Protected |
| microsoft.media | Azure Media Services | Protected |
| microsoft.migrate | Azure Migrate | Protected |
| microsoft.mixedreality | Mixed Reality services including Remote Rendering, Spatial Anchors, and Object Anchors | Not protected |
| microsoft.netapp | Azure NetApp Files | Protected |
| microsoft.network | Azure Virtual Network | Protected |
| microsoft.openenergyplatform | Open Energy Platform (OEP) on Azure | Protected |
| microsoft.operationalinsights | Azure Monitor Logs | Protected |
| microsoft.powerplatform | Microsoft Power Platform | Protected |
| microsoft.purview | Azure Purview (formerly Azure Data Catalog) | Protected |
| microsoft.quantum | Microsoft Quantum Development Kit | Protected |
| microsoft.recommendationsservice | Azure AI services Recommendations API | Protected |
| microsoft.recoveryservices | Azure Site Recovery | Protected |
| microsoft.resourceconnector | Azure Resource Connector | Protected |
| microsoft.scom | System Center Operations Manager (SCOM) | Protected |
| microsoft.search | Azure Cognitive Search | Not protected |
| microsoft.security | Azure Security Center | Not protected |
| microsoft.securitydetonation | Microsoft Defender for Endpoint Detonation Service | Protected |
| microsoft.servicebus | Service Bus messaging service and Event Grid Domain Topics | Protected |
| microsoft.servicefabric | Azure Service Fabric | Protected |
| microsoft.signalrservice | Azure SignalR Service | Protected |
| microsoft.solutions | Azure Solutions | Protected |
| microsoft.sql | SQL Server on Virtual Machines and SQL Managed Instance on Azure | Protected |
| microsoft.storage | Azure Storage | Protected |
| microsoft.storagecache | Azure Storage Cache | Protected |
| microsoft.storagesync | Azure File Sync | Protected |
| microsoft.streamanalytics | Azure Stream Analytics | Not protected |
| microsoft.synapse | Synapse Analytics (formerly SQL DW) and Synapse Studio (formerly SQL DW Studio) | Protected |
| microsoft.usagebilling | Azure Usage and Billing Portal | Not protected |
| microsoft.videoindexer | Video Indexer | Protected |
| microsoft.voiceservices | Azure Communication Services - Voice APIs | Not protected |
| microsoft.web | Web Apps | Protected |

## Next steps

- [Application requirements for the backup authentication system](backup-authentication-system-apps.md)
- [Introduction to the backup authentication system](https://azure.microsoft.com/blog/advancing-service-resilience-in-azure-active-directory-with-its-backup-authentication-service/)
- [Resilience Defaults for Conditional Access](../conditional-access/resilience-defaults.md)
- [Azure Active Directory SLA performance reporting](../reports-monitoring/reference-azure-ad-sla-performance.md)
