---
title: Block legacy authentication
description: Block legacy authentication using Azure AD Conditional Access.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 09/26/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, jebeckha, grtaylor

ms.collection: M365-identity-device-management
---
# Which authentication scenarios have Backup Authentication System Coverage?

Hundreds of millions of users and millions of organizations depend on the high availability of Azure Active Directory (Azure AD) authentication of users and services 24 hours a day, seven days a week, globally. We promise a 99.99% Service Level for authenticationauthentication, and we continuously seek to improve it every day   byit by enhancing the resilience of our authentication service. In pursuit of this goal and recognizing that perfect resilience of a complex system is elusive, we launched a backup system in 2021.

The Azure AD Backup Authentication System is comprised of multiple decorrelated backup services that work together to increase authentication resilience in case of outages. This system transparently and automatically handles authentications  for supported applications and services if the primary Azure AD service is unavailable or degraded. It adds an additional layer of resilience on top of the multiple levels of redundancy in Azure AD as described here. 
We are on a journey to achieve wide coverage of all applications and services under re-authentication scenarios. This document is a snapshot in time on our journey, it specifies supported and unsupported authentication patterns with specific app by app examples to help our customers in their resilience planning.
In summary, during an outage of the primary service, users will be able to continue working on the following types of applications as long as they had accessed them in the last 3 days in the same device and no blocking policies exist that would curtail their access:
•	The majority of Microsoft applications like Outlook, OfficeWord, Excel, PowerPoint, and SharePpoint, and OneDrive 
•	Most Many  non-Microsoft email clients, such as the #1 e-mail client on iOS and Android . like Apple Mail, Gmail, and Samsung Mail
•	Mmany non-Microsoft SaaS applications available in the app gallery, like ADP, Atlassian, AWS, GoToMeeting, Kronos, Marketo, SAP, Trello, and Workday  
•	Selected line of business applications, as determined by their authentication patterns
If your services rely on Azure Managed Identities or you’ve built them in Azure by leveraging our Virtual Machines, Cloud Storage, Cognitive Services, and App Services  (for example), then the critical infrastructure authentication between those services will be protected .
In the next 12-18 months, our target is to cover more applications and services including:  a. doubling the number of non-Microsoft SaaS apps covered, , b. improvinged backup support for more Microsoft apps like Teams. and c. covering more infrastructure scenarios in addition to the   outside the Azure Managed Identity   scenarios that are covered today.
Microsoft is continuously expanding the number of cloud environments supported and the scenarios covered. This article is current as of May June 2023.
User Identity Resilience in the Backup Authentication System
The Backup Authentication System for users provides resilience to supported applications and users in case of an AAD Azure AD   outage. This system syncs authentication metadata when the system is healthy and uses that to enable users to continue to access applications during outages of the primary service while still enforcing policy controls.
Which Microsoft applications are covered by the Backup Authentication System?  
 Note
Backup coverage is provided seamlessly to tens of thousands of applications based on protocol and scenario patterns. Some of the most common Microsoft applications are listed below, with a more comprehensive list included in Appendix A  .
Native Applications 
Native applications are those that are installed to a device, such as the Windows desktop versions of Office, or their iOS and Android counterparts. Since native applications often use different protocols than their web counterparts the backup protection coverage may be different.
For all apps listed as “protected”, the coverage is subject to the user activity and policy conditions listed above. Some functionality of these apps may be degraded during an outage.
Application 	Device Platform	Users Protected by Backup Authentication
Office (Word, Excel, PowerPoint)  	Windows , iOS, Android, MacOS	Protected
OneNote	Windows, iOS, Android, MacOS	Not Yet Protected
 Outlook	Windows, Android, iOS	Protected
OneDrive	Windows, iOS, MacOs	Protected
OneDrive	Android	Not Yet Protected
SharePoint  	Windows, iOS	Protected
SharePoint	Android	Not Yet Protected
Protection expected Sept. 2023 
Teams	Windows, iOS, Android, MacOS	Partially protected   Limited support for ongoing meeting access and chat
Azure Information Protection	All Platforms	Protected
 
Web Applications
Web Applications are accessed through a browser or browser control embedded within another application.
Application	Users Protected by Backup Authentication
Microsoft 365 AppOffice Web App	Protected
  Outlook Web Access	Protected
SharePoint Online	Protected
Teams Web 	Not Yet Protected 
M365 Admin Portal	Protected
Azure Portal	Not Yet Protected
Azure App Service  	Protected for user authentication
My Apps Portal	Not Yet Protected
Which non-Microsoft workloads are supported?

The Backup Authentication System automatically provides incremental resilience to tens of thousands of supported non-Microsoft applications based on their authentication patterns. See Appendix B for a list of the most common non-Microsoft applications and their coverage status. For an in depth explanation of which authentication patterns are supported, see the Understanding Application Support for the Backup Authentication System article. 
Authentication Pattern	Protection Status	Applications with coverage (examples)	
Native applications using the OAuth 2.0 protocol to access resource applications, such as the most popular non-Microsoft e-mail and IM clients.	Protected	#1 iOS email client app, and #1 Android email client appApple Mail, Aqua Mail, Gmail, Samsung Email, Spark, Thunderbird,  	
Web applications that are configured to authenticate with OpenID Connect using only id tokens.	Protected	29,500 “Line of Business” applications 	
Web applications authenticating with the SAML protocol, when configured* for IDP-Initiated Single Sign On (SSO)	Protected	ADP, Atlassian Cloud, AWS, GoToMeeting, Kronos, Marketo, Palo Alto Networks   , SAP Cloud Identity Trello, Workday, Zscaler	


			

Non-Microsoft application types that are not protected
Authentication Pattern	Protected by Backup Authentication	Applications not yet covered (examples)
Web applications that authenticate using Open ID Connect and request access tokens 	Not Protected
(ETA: September 2024 )	Adobe Identity Management, Apple Business Manager, Apple School Manager, Line of Business (LOB) applications using MSAL, Smartsheet
Web applications that use the SAML protocol for authentication, when configured as SP-Initiated SSO	Not Protected
(ETA: March 2024 )	Blackboard Learn, Clever, DocuSign, FortiGate SSL VPN, Google Cloud G Suite Connector, Salesforce, Zoom

*As of May June 2023, applications using IdP-initiated SAML flows are supported. Some applications (e.g. Atlassian Cloud, and Workday can be configured as “SP or as IDP initiated.”)
What makes a user supportable by the Backup Authentication System?   
During an outage, a user can authenticate using the Backup Authentication System if the following conditions are met:
1.	The user has successfully authenticated using the same app and device in the last three days.
2.	The user is not required by policy or security reasons to authenticate interactively.
3.	The user is accessing a resource as a member of their home tenant, rather than exercising a B2B or B2C scenario.
4.	The user is not subject to conditional access policies that limit the Backup Authentication System, such as those with Resilience Defaults disabled.
5.	The user has not been subject to a revocation event, such as a credential change, since their last successful authentication.
How does interactive authentication and user activity affect resilience?
The Backup Authentication System relies on metadata from a prior authentication to reauthenticate the user during an outage. For this reason, a user must have authenticated in the last three days using the same app on the same device for the backup service to be effective. Users who are inactive or have not yet authenticated to a given app will not be served by the Backup Authentication System for that application.
How do Conditional Access policies affect resilience?
Certain policies cannot be evaluated in real-time by the Backup Authentication System and must rely on prior evaluations of these policies. Under outage conditions, the service will use a prior evaluation by default to maximize resilience. For example, access that is conditioned on a user having a particular role (e.g., application administrator) will be continued during an outage based on the role the user had during that latest authentication. If the outage-only use of a previous evaluation needs to be restricted, tenant administrators can choose a strict evaluation of all conditional access policies, even under outage conditions, by disabling resilience defaults. This decision should be taken with care because disabling resilience defaults for a given policy disables those users from being supported by backup authentication. Resilience defaults must be re-enabled before an outage occurs for the backup system to provide resilience.
Certain other types of policies are not yet supported by the Backup Authentication System. Use of the following policies will reduce resilienc  e:  
•	Use of the Sign-in Frequency Control as part of a Conditional Access Policy.
•	Use of the Authentication Methods Policy.

Workload Identity Resilience in the Backup Authentication System  
In addition to user authentication, the Backup Authentication System provides resilience for Managed Service Identities (MSI) and other key Azure infrastructure by offering a regionally-isolated authentication   service that is redundantly layered with the primary authentication service. This system enablesnsures theat infrastructure authentication within an Azure region to beis resilient to any issues that may occur in another region or within the larger Azure Active Directory service. This system complements Azure’s cross-region architecture. Building your own applications using MSI and following Azure’s best practices for resilience and availability ensures your applications will be maximallyhighly resilient  . In addition to MSI, this regionally resilient backup system protects key Azure infrastructure and services that keep the cloud functional. 
Summary of Infrastructure Authentication support
Authentication Pattern	Protected by Backup Authentication	Applications 
Managed service identity authentication	Protected	Your services built-on the Azure Infrastructure using Managed Identities. Complete list here. (Appendix)
Azure Internal Infrastructure	Protected	Azure services authenticating with each other
Service to Service Authentication not using managed identities	Not Yet Protected 
(ETA Dec 2024)	Your services built on or off Azure when the identities are registered as Service Principals and not “Managed Identities”


Which cloud environments are supported by the Backup Authentication System?   
The Backup Authentication System is supported in all cloud environments except Azure China. The types of identities supported vary by cloud, as described in the table below. 
Azure Environment	Types of Identities protected by Backup Authentication
Azure Commercial	Users, Managed Service  Identities
Azure Government	Users, Managed Service Identities
Azure Government Secret	   Managed Service Identities

User protection expected by Dec. 2023
Azure Government Top Secret	Managed Service Identities

User protection expected by Dec. 2023
Azure China (Operated by 21vianet)	Not yet available

Managed Service Identity and User protection expected by Dec. 2024

Additional Resources  
Understanding Application Support for the Backup Authentication System
Introduction to the Backup Authentication System
Resilience Defaults for Azure AD Conditional Access.
Azure Active Directory SLA Performance Reporting
  
