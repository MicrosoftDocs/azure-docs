<properties 
	pageTitle="Azure AD Privileged Identity Management" 
	description="A topic that explains what Azure AD Privileged Identity management is and how to configure it." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/04/2015" 
	ms.author="Justinha"/>

# Azure AD Privileged Identity Management

Azure AD Privileged Identity Management lets you manage, control and monitor your privileged identities and their access to resources in Azure AD, and in other Microsoft online services such as Office 365 or Intune.  

To enable users to carry out privileged operations, organizations have often needed to give many of their users permanent privileged access in Azure AD, or for Azure or Office 365 resources, or other SaaS apps. For many customers, this is a growing security risk for their cloud-hosted resources because they cannot sufficiently monitor what those users are doing with their admin privileges. In addition, a compromised user account that has privileged access could impact their overall cloud security. Azure AD Privileged Identity Management helps to resolve this risk.  

Azure AD Privileged Identity Management in this preview lets you:  

- Discover which users are the Azure AD admins
- Enable on-demand, "just in time" administrative access to directory resources
- Get reports about administrator access history and about changes in administrator assignments 
- Get alerts about access to a privileged role 

In this preview, Azure AD Privileged Identity Management can manage the built-in Azure Active Directory organizational roles:  

- Global Administrator 
- Billing Administrator 
- Service Administrator  
- User Administrator 
- Password Administrator 

## Just in time administrator access 

Historically, you could assign a user to an admin role through the Azure Management Portal or Windows PowerShell. As a result, that user becomes **permanent admin**, always active in his or her assigned role. This preview adds support for a **temporary admin**, which is a user who needs to complete an activation process for the assigned role.  The activation process changes the assignment of the user to a role in Azure AD from inactive to active.   

## Enabling Privileged Identity Management for your directory

You can start using Azure AD Privileged Identity Management by accessing the [Microsoft Azure portal](https://portal.azure.com/). For now, Azure AD Privileged Identity Management only appears in the Microsoft Azure portal. You must be a global administrator to enable Azure AD Privileged Identity Management for a directory.

![][1]

After initializing this extension, you will automatically become  the first **Security administrator** of the directory. Only a security administrator can access this extension to manage the access for other administrators.  
During initialization, a tile of Azure AD Privileged Identity Management will be added to the startboard of the Azure Preview portal.

## Privileged Identity Management dashboard 

Azure AD Privileged Identity Manager provides a dashboard which gives you importatnt information such as:

- The number of  users who are assigned to each privileged role  
- The number of temporary and permanent admins 
- The administrator's access history 

![][2]

## Privileged role management 

With Azure AD Privileged Identity Management, you can manage the administrators by adding or removing permanent or temporary administrators to each role.

![][3]

## Configure the role activation settings 

Using the role activation setting you can configure the temporary role activation properties including:

- The duration of the role activation period
- The role activation notification 
- The information a user needs to provide during the role activation process  

![][4]

## Role activation  

In order to activate a role, a temporary admin needs to request a time-bound "activation" for the role. The activation can be requested using the **Activate my role** option in Azure AD Privileged Identity Management. 

An admin who wants to activate a role needs to initialize Azure AD Privileged Identity Management in the Azure Preview portal. 

Any type of admin can use Azure AD Privileged Identity Management to activate his or her role.
 
Role activation is time-bound. In the Role Activation settings,you can configure the length of the activation as well as the required information that the admin needs to provide in order to activate the role. 

![][5]

## Role activation history

Using Azure AD Privileged Identity Management you can also track changes in privileged role assignments and role activation history. This can be done using the audit log options:

![][6]

## What's next

[Microsoft Azure blog](http://azure.microsoft.com/blog/)
[Role-based access control](role-based-access-control-configure.md)

<!--Image references-->
[1]: ./media/active-directory-privileged-identity-management-configure/Search_PIM.png
[2]: ./media/active-directory-privileged-identity-management-configure/PIM_Dash.png
[3]: ./media/active-directory-privileged-identity-management-configure/PIM_AddRemove.png
[4]: ./media/active-directory-privileged-identity-management-configure/PIM_RoleActivationSettings.png
[5]: ./media/active-directory-privileged-identity-management-configure/PIM_RequestActivation.png
[6]: ./media/active-directory-privileged-identity-management-configure/PIM_ActivationHistory.png

