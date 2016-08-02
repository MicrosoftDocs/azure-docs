<properties
	pageTitle="Azure Active Directory hybrid identity design considerations - determine multi-factor authentication requirements"
	description="With Conditional access control, Azure Active Directory checks the specific conditions you pick when authenticating the user and before allowing access to the application. Once those conditions are met, the user is authenticated and allowed access to the application."
	documentationCenter=""
	services="active-directory"
	authors="femila"
	manager="billmath"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="05/12/2016"
	ms.author="billmath"/>

# Determine multi-factor authentication requirements for your hybrid identity solution

In this world of mobility, with users accessing data and applications in the cloud and from any device, securing this information has become paramount.  Every day there is a new headline about a security breach.  Although, there is no guarantee against such breaches, multi-factor authentication, provides an additional layer of security to help prevent these breaches.
Start by evaluating the organizations requirements for multi-factor authentication. That is, what is the organization trying to secure.  This evaluation is important to define the technical requirements for setting up and enabling the organizations users for multi-factor authentication.

>[AZURE.NOTE]
If you are not familiar with MFA and what it does, it is strongly recommended that you read the article [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md) prior to continue reading this section.

Make sure to answer the following:

- Is your company trying to secure Microsoft apps? 
- How these apps are published?
- Does your company provide remote access to allow employees to access on-premises apps?

If yes, what type of remote access?You also need to evaluate where the users who are accessing these applications will be located. This evaluation is another important step to define the proper multi-factor authentication strategy. Make sure to answer the following questions:

- Where are the users going to be located?
- Can they be located anywhere?
- Does your company want to establish restrictions according to the user’s location?

Once you understand these requirements, it is important to also evaluate the user’s requirements for multi-factor authentication. This evaluation is important because it will define the requirements for rolling out multi-factor authentication. Make sure to answer the following questions:

- Are the users familiar with multi-factor authentication?
- Will some uses be required to provide additional authentication?  
 - If yes, all the time, when coming from external networks, or accessing specific applications, or under other conditions?
- Will the users require training on how to setup and implement multi-factor authentication?
- What are the key scenarios that your company wants to enable multi-factor authentication for their users?

After answering the previous questions, you will be able to understand if there are multi-factor authentication already implemented on-premises. This evaluation is important to define the technical requirements for setting up and enabling the organizations users for multi-factor authentication. Make sure to answer the following questions:

- Does your company need to protect privileged accounts with MFA?
- Does your company need to enable MFA for certain application for compliance reasons?
- Does your company need to enable MFA for all eligible users of these application or only administrators?
- Do you need have MFA always enabled or only when the users are logged outside of your corporate network?


## Next steps
[Define a hybrid identity adoption strategy](active-directory-hybrid-identity-design-considerations-identity-adoption-strategy.md)


## See also
[Design considerations overview](active-directory-hybrid-identity-design-considerations-overview.md)
