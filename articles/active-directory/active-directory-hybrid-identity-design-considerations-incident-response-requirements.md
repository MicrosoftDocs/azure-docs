
<properties
	pageTitle="Azure Active Directory hybrid identity design considerations - determine incident rResponse requirements |Microsoft Azure Requirements "
	description="Determine monitoring and reporting capabilities for the hybrid identity solution that can be leveraged by IT to take actions to identify and mitigate a potential threats"
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
	ms.date="08/08/2016"
	ms.author="billmath"/>

# Determine incident response requirements for your hybrid identity solution

Large or medium organizations most likely will have a [security incident response](https://technet.microsoft.com/library/cc700825.aspx) in place to help IT take actions accordingly to the level of incident. The identity management system is an important component in the incident response process because it can be used to help identifying who performed a specific action against the target. The hybrid identity solution must be able to provide monitoring and reporting capabilities that can be leveraged by IT to take actions to identify and mitigate a potential threat. In a typical incident response plan you will have the following phases as part of the plan:

1.	Initial assessment.
2.	Incident communication.
3.	Damage control and risk reduction.
4.	Identification of what it was compromise and severity.
5.	Evidence preservation.
6.	Notification to appropriate parties.
7.	System recovery.
8.	Documentation.
9.	Damage and cost assessment.
10.	Process and plan revision.

During the identification of what it was compromise and severity- phase, it will be necessary to identify the systems that have been compromised, files that have been accessed and determine the sensitivity of those files. Your hybrid identity system should be able to fulfill these requirements to assist you identifying the user that made those changes. 

## Monitoring and reporting
Many times the identity system can also help in initial assessment phase mainly if the system has built in auditing and reporting capabilities. During the initial assessment, IT Admin must be able to identify a suspicious activity, or the system should be able to trigger it automatically based on a pre-configured task. Many activities could indicate a possible attack, however in other cases, a badly configured system might lead to a number of false positives in an intrusion detection system. 

The identity management system should assist IT admins to identify and report those suspicious activities. Usually these technical requirements can be fulfilled by monitoring all systems and having a reporting capability that can highlight potential threats. Use the questions below to help you design your hybrid identity solution while taking into consideration incident response requirements:

- Does your company has a security incident response in place?
 - If yes, is the current identity management system used as part of the process?
- Does your company need to identify suspicious sign-on attempts from users across different devices?
- Does your company need to detect potential compromised user’s credentials?
- Does your company need to audit user’s access and action?
- Does your company need to know when a user reset his password?

## Policy enforcement

During damage control and risk reduction-phase, it is important to quickly reduce the actual and potential effects of an attack. That action that you will take at this point can make the difference between a minor and a major one. The exact response will depend on your organization and the nature of the attack that you face. If the initial assessment concluded that an account was compromised, you will need to enforce policy to block this account. That’s just one example where the identity management system will be leveraged. Use the questions below to help you design your hybrid identity solution while taking into consideration how policies will be enforced to react to an ongoing incident:

- Does your company have policies in place to block users from access the network if necessary?
 - If yes, does the current solution integrate with the hybrid identity management system that you are going to adopt?
- Does your company need to enforce conditional access for users that are in quarantine? 
 
>[AZURE.NOTE]
Make sure to take notes of each answer and understand the rationale behind the answer. [Define data protection strategy](active-directory-hybrid-identity-design-considerations-data-protection-strategy.md) will go over the options available and advantages/disadvantages of each option.  By having answered those questions you will select which option best suits your business needs.

## Next steps
[Define data protection strategy](active-directory-hybrid-identity-design-considerations-data-protection-strategy.md)

## See Also
[Design considerations overview](active-directory-hybrid-identity-design-considerations-overview.md)
