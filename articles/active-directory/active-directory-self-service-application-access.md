<properties
	pageTitle="Self-service application access and delegated management with Azure Active Directory | Microsoft Azure"
	description="This article describes how to enable self-service application access and delegated management with Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="asmalser-msft"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/09/2016"
	ms.author="asmalser"/>

#Self-service application access and delegated management with Azure Active Directory

Enabling self-service capabilities for end users is a common scenario for enterprise IT. Lots of users, lots of applications, and the person who is best-informed to make access grant decisions may not be the directory administrator. Often the best person to decide who can access an application is a team lead or other delegated administrator. But at the end of the day, it’s the user who uses the app, and the user knows what they need to be able to do their job.

Self-service application access is a feature of [Azure Active Directory Premium](https://azure.microsoft.com/trial/get-started-active-directory/) that allow directory administrators to:

* Enable users to request access to applications using a “Get more applications” tile in the [Azure AD access panel](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users)
* Set which applications users can request access to
* Set whether or not an approval is required for users to be able to self-assign access to an application
* Set who should approve the requests and manage access for each application

Today this capability is supported for all pre-integrated and custom apps that support federated or password-based single sign-on in the [Azure Active Directory application gallery](https://azure.microsoft.com/marketplace/active-directory/all/), including apps like Salesforce, Dropbox, Google Apps, and more.
This article describes how to:

* Configure self-service application access for end users, including configuring an optional approval workflow 
* Delegate access management for specific applications to the most appropriate people in your organization, and enable them to use the Azure AD access panel to approve access requests, directly assign access to selected users, or (optionally) set credentials for application access when password-based single sign-on is configured


##Configuring self-service application access

To enable self-service application access and configured which applications can be added or requested by your end users, follow the instructions below.

**1:** Sign into the [Azure classic portal](https://manage.windowsazure.com/).

**2:**	Under the **Active Directory** section, select your directory, then select the **Applications** tab. 

**3:** Select the **Add** button, and use the gallery option to select and add an application.

**4:** After your app has been added, you’ll get the app Quick Start page. Click **Configure Single Sign-On**, select the desired single sign-on mode, and save the configuration. 

**5:** Next, select the **Configure** tab. To enable users to request access to this app from the Azure AD access panel, set **Allow self-service application access** to **Yes**.

![][1]

**6:** To optionally configure an approval workflow for access requests, set **Require approval before granting access** to **Yes**. Then one or more approvers can be selected using the **Approvers** button.

An approver can be any user in the organization with an Azure AD account, and could be responsible for account provisioning, licensing, or any other business process your organization requires before granting access to an app. The approver could even be the group owner of one or more shared account groups, and can assign the users to one of these groups to give them access via a shared account. 

If no approval is required, then users will instantly get the application added to their Azure AD access panel. This appropriate if the application has been set up for [automatic user provisioning](active-directory-saas-app-provisioning.md), or has been set up [“user-managed” password SSO mode](active-directory-appssoaccess-whatis.md#password-based-single-sign-on) where the user already has a user account and knows the password.

**7:** If the application has been configured to use password-based single sign-on, then an option for allowing the approver to set the SSO credentials on behalf of each user is also available. See the following section on delegate access management for more information.

**8:** Finally, the **Group for Self-Assigned Users** shows the name of the group that will be used to store the users who have been granted or assigned access to the application. The access approver become the owner of this group. If the group name shown does not exist, it will be created automatically. Optionally the group name can be set to the name of an existing group.

**9:** Click **Save** at the bottom of the screen to save the configuration. Now users will be able to request access to this app from the access panel.

**10:** To try the end user experience, sign into you organization’s Azure AD access panel at https://myapps.microsoft.com, preferably using a different account that isn’t an app approver. 

**11:** Under the **Applications** tab, click the **Get more applications** tile. This displays a gallery of all of the applications that have been enabled for self-service application access in the directory, with the ability to search and filter by app category on the left. 

**12:** Clicking on an app kicks off the request process. If no approval process is required, then the application will be immediately added under the **Applications** tab after a short confirmation. If approval is required, then you will see a dialog indicating this, and an email will be send to the approvers. (Quick note: You need to be signed into the access panel as a non-approver to see this request process).

**13:** The email directs the approver to sign into the Azure AD access panel and approve the request. Once the request is approved (and any special processes you define have been performed by the approver), the user will then see the application appear under their **Applications** tab where they can sign into it.

##Delegated application access management

An application access approver can be any user in your organization who is the most appropriate person to approve or deny access to the application in question. This user could be responsible for account provisioning, licensing, or any other business process your organization requires before granting access to an app.
 
When configuring self-service application access described above, any assigned application Approvers will see an additional **Manage Applications** tile in the Azure AD access panel, which shows them which applications that they are the access administrator for. Clicking an app shows a screen with several options.

![][2]

###Approve Requests

The **Approve Requests** tile allows approvers to see any pending approvals specific to that app, and redirects to the Approvals tab where the requests can be confirmed or denied. Note that the approver also receives automated emails whenever a request is created that instructs them what to do.

###Add Users

The **Add Users** tile allows approvers to directly grant selected users access to the application. Upon clicking this tile, the approver sees a dialog allows them to view and search for users in their directory. Adding a user results in the application being shown in those user’s Azure AD access panels or Office 365. If any manual user provisioning process is required at the app before the user will be able to sign in, then the approver should perform this process before assigning access.  

###Manage Users

The **Manage Users** tile allows approvers to directly update or remove which users have access to the application. 

###Configure Password SSO Credentials (if applicable)

The **Configure** tile is only shown if the application was configured by the IT administrator to use password-based single sign on, and the administrator granted the approver the ability to set password SSO credentials as described previously. When selected, the Approver is presented with several options for how the credentials will be propagated to assigned users:

![][3]

* **Users sign in with their own passwords** – In this mode, the assigned users know what their usernames and passwords are for the application, and will be prompted to enter them upon their first sign-in to the application. This corresponds to the password SSO case where the [users manage credentials](active-directory-appssoaccess-whatis.md#password-based-single-sign-on).

* **Users are automatically signed in using separate accounts that I manage** – In this mode, the assigned users not be required to enter or know their app-specific credentials when signing into the application. Instead, the approver sets the credentials for each user after assigning access using the **Add User** tile. When the user clicks on the application in their access panel or Office 365, they will be automatically signed in using the credentials set by the approver. This corresponds to the password SSO case where the [administrators manage credentials](active-directory-appssoaccess-whatis.md#password-based-single-sign-on).

* **Users are automatically signed in using a single account that I manage** -  This is a special case, and is appropriate to use when all assigned users need to be granted access using a single shared account. The most common use case for this is social media applications, where an organization has a single “company” account and multiple users need to make updates to that account. This also corresponds to the password SSO case where the [administrators manage credentials](active-directory-appssoaccess-whatis.md#password-based-single-sign-on). However, after selecting this option, the approver will be prompted to enter the username and password for the single shared account. Once completed, all assigned users will be signed in using this account when clicking on the application in their Azure AD access panels or Office 365.

##Additional Resources
- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)

<!--Image references-->
[1]: ./media/active-directory-self-service-application-access/ssaa_admin.PNG
[2]: ./media/active-directory-self-service-application-access/ssaa_ap_manage_app.PNG
[3]: ./media/active-directory-self-service-application-access/ssaa_ap_manage_app_config.PNG
