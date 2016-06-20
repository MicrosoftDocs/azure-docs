<properties
	pageTitle="Azure Active Directory hybrid identity design considerations - determine identity requirements | Microsoft Azure"
	description="Identify the company’s business needs that will lead you to define the requirements for the hybrid identity design."
	documentationCenter=""
	services="active-directory"
	authors="billmath"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="05/02/2016"
	ms.author="billmath"/>

# Determine identity requirements for your hybrid identity solution
The first step in designing a hybrid identity solution is to determine the requirements for the business organization that will be leveraging this solution.  Hybrid identity starts as a supporting role (it supports all other cloud solutions by providing authentication) and goes on to provide new and interesting capabilities that unlock new workloads for users.  These workloads or services that you wish to adopt for your users will dictate the requirements for the hybrid identity design.  These services and workloads need to leverage hybrid identity both on-premises and in the cloud.  

You need to go over these key aspects of the business to understand what it is a requirement now and what the company plans for the future. If you don’t have the visibility of the long term strategy for hybrid identity design, chances are that your solution will not be scalable as the business needs grow and change.   T he diagram below shows an example of a hybrid identity architecture and the workloads that are being unlocked for users. This is just an example of all the new possibilities that can be unlocked and delivered with a solid hybrid identity strategy. 
 
Some components that are part of the hybrid identity architecture
![](./media/hybrid-id-design-considerations/hybrid-identity-architechture.png)

## Determine business needs
Each company will have different requirements, even if these companies are part of the same industry, the real business requirements might vary. You can still leverage best practices from the industry, but ultimately it is the company’s business needs that will lead you to define the requirements for the hybrid identity design. 

Make sure to answer the following questions to identify your business needs:

- Is your company looking to cut IT operational cost?
- Is your company looking to secure cloud assets (SaaS apps, infrastructure)?
- Is your company looking to modernize your IT?
  - Are your users more mobile and demanding IT to create exceptions into your DMZ to allow different type of traffic to access different resources?
  - Does your company have legacy apps that needed to be published to these modern users but are not easy to rewrite?
  - Does your company need to accomplish all these tasks and bring it under control at the same time?
- Is your company looking to secure users’ identities and reduce risk by bringing new tools that leverage the expertise of Microsoft’s Azure security expertise on-premises?
- Is your company trying to get rid of the dreaded “external” accounts on premises and move them to the cloud where they are no longer a dormant threat inside your on-premises environment?

## Analyze on-premises identity infrastructure
Now that you have an idea regarding your company business requirements, you need to evaluate your on-premises identity infrastructure. This evaluation is important for defining the technical requirements to integrate your current identity solution to the cloud identity management system. Make sure to answer the following questions:

- What authentication and authorization solution does your company use on-premises? 
- Does your company currently have any on-premises synchronization services?
- Does your company use any third-party Identity Providers (IdP)?

You also need to be aware of the cloud services that your company might have. Performing an assessment to understand the current integration with SaaS, IaaS or PaaS models in your environment is very important. Make sure to answer the following questions during this assessment:
- Does your company have any integration with a cloud service provider?
- If yes, which services are being used?
- Is this integration currently in production or is it a pilot?


>[AZURE.NOTE]
If you don’t have an accurate mapping of all your apps and cloud services, you can use the Cloud App Discovery tool. This tool can provide your IT department with visibility into all your organization’s business and consumer cloud apps. That makes it easier than ever to discover shadow IT in your organization, including details on usage patterns and any users accessing your cloud applications. To access this tool go to [https://appdiscovery.azure.com](https://appdiscovery.azure.com/)

## Evaluate identity integration requirements
Next, you need to evaluate the identity integration requirements. This evaluation is important to define the technical requirements for how users will authenticate, how the organization’s presence will look in the cloud, how the organization will allow authorization and what the user experience is going to be. Make sure to answer the following questions:

- Will your organization be using federation, standard authentication or both?
- Is federation a requirement?  Because of the following:
 - Kerberos-based SSO
 - Your company has an on-premises applications (either built in-house or 3rd party) that uses SAML or similar federation capabilities.
 - MFA via Smart Cards. RSA SecurID, etc.
 - Client access rules that address the questions below:
     1. Can I block all external access to Office 365 based on the IP address of the client?
     1. Can I block all external access to Office 365, except Exchange ActiveSync?
     1. Can I block all external access to Office 365, except for browser-based apps (OWA, SPO)
     1. Can I block all external access to Office 365 for members of designated AD groups
- Security/auditing concerns
- Already existing investment in federated authentication
- What name will our organization use for our domain in the cloud?
- Does the organization have a custom domain?
    1. Is that domain public and easily verifiable via DNS?
    1. If it is not, then do you have a public domain that can be used to register an alternate UPN in AD?
- Are the user identifiers consistent for cloud representation? 
- Does the organization have apps that require integration with cloud services?
- Does the organization have multiple domains and will they all use standard or federated authentication?

## Evaluate applications that run in your environment
Now that you have an idea regarding your on-premises and cloud infrastructure, you need to evaluate the applications that run in these environments. This evaluation is important to define the technical requirements to integrate these applications to the cloud identity management system. Make sure to answer the following questions:

- Where will our applications live?
- Will users be accessing on-premises applications?  In the cloud? Or both?
- Are there plans to take the existing application workloads and move them to the cloud?
- Are there plans to develop new applications that will reside either on-premises or in the cloud that will use cloud authentication?

## Evaluate user requirements
You also have to evaluate the user requirements. This evaluation is important to define the steps that will be needed for on-boarding and assisting users as they transition to the cloud. Make sure to answer the following questions:

- Will users be accessing applications on-premises?
- Will users be accessing applications in the cloud?
- How do users typically login to their on-premises environment?
- How will users sign-in to the cloud?

>[AZURE.NOTE]
Make sure to take notes of each answer and understand the rationale behind the answer. [Determine incident response requirements](active-directory-hybrid-identity-design-considerations-incident-response-requirements.md) will go over the options available and pros/cons of each option.  By having answered those questions you will select which option best suits your business needs.

## Next steps
[Determine directory synchronization requirements](active-directory-hybrid-identity-design-considerations-directory-sync-requirements.md)

## See also
[Design considerations overview](active-directory-hybrid-identity-design-considerations-overview.md)
