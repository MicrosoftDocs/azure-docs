
<properties
	pageTitle="Azure Active Directory hybrid identity design considerations - determine access control requirements| Microsoft Azure"
	description="Covers the pillars of identity, and identifying access requirements for resources for users in a hybrid environment."
	documentationCenter=""
	services="active-directory"
	authors="yuridio"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
	ms.date="04/28/2016"
	ms.author="yuridio"/>

# Determine access control requirements for your hybrid identity solution
When an organization is designing their hybrid identity solution they can also use this opportunity to review access requirements for the resources that they are planning to make it available for users. The data access cross all four pillars of identity, which are:

- Administration
- Authentication
- Authorization
- Auditing

The sections that follows will cover authentication and authorization in more details, administration and auditing are part of the hybrid identity lifecycle. Read [Determine hybrid identity management tasks](active-directory-hybrid-identity-design-considerations-hybrid-id-management-tasks.md) for more information about these capabilities.

>[AZURE.NOTE]
Read [The Four Pillars of Identity - Identity Management in the Age of Hybrid IT](http://social.technet.microsoft.com/wiki/contents/articles/15530.the-four-pillars-of-identity-identity-management-in-the-age-of-hybrid-it.aspx) for more information about each one of those pillars.

## Authentication and authorization
There are different scenarios for authentication and authorization, these scenarios will have specific requirements that must be fulfilled by the hybrid identity solution that the company is going to adopt. Scenarios involving Business to Business (B2B) communication can add an extra challenge for IT Admins since they will need to ensure that the authentication and authorization method used by the organization can communicate with their business partners. During the designing process for authentication and authorization requirements, ensure that the following questions are answered:

- Will your organization authenticate and authorize only users located at their identity management system?
 - Are there any plans for B2B scenarios?
 - If yes, do you already know which protocols (SAML, OAuth, Kerberos, Tokens or Certificates) will be used to connect both businesses?
- Does the hybrid identity solution that you are going to adopt support those protocols?

Another important point to consider is where the authentication repository that will be used by users and partners will be located and the administrative model to be used. Consider the following two core options:
- Centralized: in this model the user’s credentials, policies and administration can be centralized on-premises or in the cloud.
- Hybrid: in this model the user’s credentials, policies and administration will be centralized on-premises and a replicated in the cloud.

Which model your organization will adopt will vary according to their business requirements, you want to answer the following questions to identify where the identity management system will reside and the administrative mode to use:

- Does your organization currently have an identity management on-premises?
 - If yes, do they plan to keep it?
 - Are there any regulation or compliance requirements that your organization must follow that dictates where the identity management system should reside?
- Does your organization use single sign-on for apps located on-premises or in the cloud?
 - If yes, does the adoption of a hybrid identity model affect this process?

## Access Control
While authentication and authorization are core elements to enable access to corporate data through user’s validation, it is also important to control the level of access that these users will have and the level of access administrators will have over the resources that they are managing. Your hybrid identity solution must be able to provide granular access to resources, delegation and role base access control. Ensure that the following question are answered regarding access control:

- Does your company have more than one user with elevated privilege to manage your identity system?
 - If yes, does each user need the same access level?
- Would your company need to delegate access to users to manage specific resources?
 - If yes, how frequently this happens?
- Would your company need to integrate access control capabilities between on-premises and cloud resources?
- Would your company need to limit access to resources according to some conditions?
- Would your company have any application that needs custom control access to some resources?
 - If yes, where are those apps located (on-premises or in the cloud)?
 - If yes, where are those target resources located (on-premises or in the cloud)?

>[AZURE.NOTE]
Make sure to take notes of each answer and understand the rationale behind the answer. [Define Data Protection Strategy](active-directory-hybrid-identity-design-considerations-data-protection-strategy.md) will go over the options available and advantages/disadvantages of each option.  By answering those questions you will select which option best suits your business needs.

## Next steps

[Determine incident response requirements](active-directory-hybrid-identity-design-considerations-incident-response-requirements.md)

## See Also
[Design considerations overview](active-directory-hybrid-identity-design-considerations-overview.md)
