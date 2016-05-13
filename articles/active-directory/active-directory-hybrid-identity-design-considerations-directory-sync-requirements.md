<properties
	pageTitle="Azure Active Directory hybrid identity design considerations - determine directory synchronization requirements | Microsoft Azure"
	description="Identify what requirements are needed for synchronizing all the users between on=premises and cloud for the enterprise."
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
	ms.date="05/12/2016"
	ms.author="billmath"/>

# Determine directory synchronization requirements
Synchronization is all about providing users an identity in the cloud based on their on-premises identity. Whether or not they will use synchronized account for authentication or federated authentication, the users will still need to have an identity in the cloud.  This identity will need to be maintained and updated periodically.  The updates can take many forms, from title changes to password changes.  

Start by evaluating the organizations on-premises identity solution and user requirements. This evaluation is important to define the technical requirements for how user identities will be created and maintained in the cloud.  For a majority of organizations, Active Directory is on-premises and will be the on-premises directory that users will by synchronized from, however in some cases this will not be the case.  

Make sure to answer the following questions:


- Do you have one AD forest, multiple, or none?
 - How many Azure AD directories will you be synchronizing to?
 
    1. Are you using filtering?
    2. Do you have multiple Azure AD Connect servers planned?
  
- Do you currently have a synchronization tool on-premises?
  - If yes, does your users if users have a virtual directory/integration of identities?
- Do you have any other directory on-premises that you want to synchronize (e.g. LDAP Directory, HR database, etc)?
  - Are you going to be doing any GALSync?
  - What is the current state of UPNs in your organization? 
  - Do you have a different directory that users authenticate against?
  - Does your company use Microsoft Exchange?
    - Do they plan of having a hybrid exchange deployment?

Now that you have an idea about your synchronization requirements, you need to determine which tool is the correct one to meet these requirements.  Microsoft provides several tools to accomplish directory integration and synchronization.  See the [Hybrid Identity directory integration tools comparison table](active-directory-hybrid-identity-design-considerations-tools-comparison.md) for more information. 
   
Now that you have your synchronization requirements and the tool that will accomplish this for your company, you need to evaluate the applications that use these directory services. This evaluation is important to define the technical requirements to integrate these applications to the cloud. Make sure to answer the following questions:

- Will these applications be moved to the cloud and use the directory?
- Are there special attributes that need to be synchronized to the cloud so these applications can use them successfully?
- Will these applications need to be re-written to take advantage of cloud auth?
- Will these applications continue to live on-premises while users access them using the cloud identity?

You also need to determine the security requirements and constraints directory synchronization. This evaluation is important to get a list of the requirements that will be needed in order to create and maintain user’s identities in the cloud. Make sure to answer the following questions:

- Where will the synchronization server be located?
- Will it be domain joined?
- Will the server be located on a restricted network behind a firewall, such as a DMZ?
  - Will you be able to open the required firewall ports to support synchronization?
- Do you have a disaster recovery plan for the synchronization server?
- Do you have an account with the correct permissions for all forests you want to synch with?
 - If your company doesn’t know the answer for this question, review the section “Permissions for password synchronization” in the article [Install the Azure Active Directory Sync Service](https://msdn.microsoft.com/library/azure/dn757602.aspx#BKMK_CreateAnADAccountForTheSyncService) and determine if you already have an account with these permissions or if you need to create one.
- If you have mutli-forest sync is the sync server able to get to each forest?
 
>[AZURE.NOTE]
Make sure to take notes of each answer and understand the rationale behind the answer. [Determine incident response requirements](active-directory-hybrid-identity-design-considerations-incident-response-requirements.md) will go over the options available. By having answered those questions you will select which option best suits your business needs.

## Next steps
[Determine multi-factor authentication requirements](active-directory-hybrid-identity-design-considerations-multifactor-auth-requirements.md)

## See also
[Design considerations overview](active-directory-hybrid-identity-design-considerations-overview.md)