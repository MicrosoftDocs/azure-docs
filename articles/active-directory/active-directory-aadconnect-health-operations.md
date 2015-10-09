<properties
	pageTitle="Azure AD Connect Health Operations."
	description="This article describes additional operations that can be performed once you have deployed Azure AD Connect Health."
	services="active-directory"
	documentationCenter=""
	authors="billmath"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/15/2015"
	ms.author="billmath"/>

# Azure AD Connect Health Operations

The following topic describes the various operations that can be performed using Azure AD Connect Health.

## Enable Email Notifications
You can configure the Azure AD Connect Health Service to send email notifications when alerts are generated indicating your identity  infrastructure is not healthy. This will occur when an alert is generated, as well as when it is marked as resolved. Follow the instructions below to configure email notifications. Please note that by default email notifications are disabled.


### To enable Azure AD Connect Health Email Notifications

1. Open the Alerts Blade for the service for which you wish to receive email notification.
2. Click on the "Notification Settings" button from the action bar.
3. Turn the Email Notification switch to ON.
4. Select the check box to configure all the Global Admins to receive email notifications.
5. If you wish to receive email notifications on any other email addresses, you can specify them in the Additional Email Recipient box. To remove an email address from this list, right click on the entry and select Delete.
6. To finalize the changes click on "Save". All changes will take effects only after you select "Save".

## Delete a server or service instance

### Delete a server from Azure AD Connect Health Service
In some instances, you may wish to remove a server from being monitored. Follow the instructions below to remove a server from Azure AD Connect Health Service.

When deleting a server, be aware of the following:

- This action will STOP collecting any further data from that server. This server will be removed from the monitoring service. After this action, you will not be able to view new alerts, monitoring or usage analytics data for this server.
- This action will NOT uninstall or remove the Health Agent from your server. If you have not uninstalled the Health Agent before performing this step, you may see error events on the server related to the Health Agent.
- This action will NOT delete the data already collected from this server. That data will be deleted as per the Microsoft Azure Data Retention Policy.
- After performing this action, if you wish to start monitoring the same server again, you will need to uninstall and re-install the health agent on this server.


#### To delete a server from Azure AD Connect Health Service

1. Open the Server Blade from the Server List Blade by selecting the server name to be removed.
2. On the Server Blade, click on the "Delete" button from the action bar.
3. Confirm the action to delete the server by typing the server name in the confirmation box.
4. Click on the "Delete" button.


### Delete a service instance from Azure AD Connect Health Service

In some instances, you may wish to remove a service instance. Follow the instructions below to remove a service instance from Azure AD Connect Health Service.

When deleting a service instance, be aware of the following:

- This action will remove the current service instance from the monitoring service.
- This action will NOT uninstall or remove the Health Agent from any of the servers that were monitored as part of this service instance. If you have not uninstalled the Health Agent before performing this step, you may see error events on the server(s) related to the Health Agent.
- All data from this service instance will be deleted as per the Microsoft Azure Data Retention Policy.
- After performing this action, if you wish to start monitoring the service, please uninstall and re-install the health agent on all the servers that will be monitored. After performing this action, if you wish to start monitoring the same server again, you will need to uninstall and re-install the health agent on this server.


#### To delete a service instance from Azure AD Connect Health Service

1. Open the Service Blade from the Service List Blade by selecting the service identifier (farm name) that you wish to remove.
2. On the Server Blade, click on the "Delete" button from the action bar.
3. Confirm the service name by typing it in the confirmation box. (for example: sts.contoso.com)
4. Click on the "Delete" button.
<br><br>

## Enable Auditing for AD FS

In order for the Usage Analytics feature to gather data and analyze the Azure AD Connect Health agent needs the information in the AD FS Audit Logs. These logs are not enabled by default. This only applies to AD FS federation servers. You do not need to enable auditing on AD FS Proxy servers or Web Application Proxy servers. Use the following procedures to enable AD FS auditing and to locate the AD FS audit logs.

#### To enable auditing for AD FS 2.0

1. Click **Start**, point to **Programs**, point to **Administrative Tools**, and then click **Local Security Policy**.
2. Navigate to the **Security Settings\Local Policies\User Rights Management** folder, and then double-click Generate security audits.
3. On the **Local Security Setting** tab, verify that the AD FS 2.0 service account is listed. If it is not present, click **Add User or Group** and add it to the list, and then click **OK**.
4. Open a command prompt with elevated privileges and run the following command to enable auditing.<code>auditpol.exe /set /subcategory:"Application Generated" /failure:enable /success:enable</code>
5. Close Local Security Policy, and then open the Management snap-in.  To open the Management snap-in, click **Start**, point to **Programs**, point to **Administrative Tools**, and then click AD FS 2.0 Management.
6. In the Actions pane, click Edit Federation Service Properties.
7. In the **Federation Service Properties** dialog box, click the **Events** tab.
8. Select the **Success audits** and **Failure audits** check boxes.
9. Click **OK**.

#### To enable auditing for AD FS on Windows Server 2012 R2

1. Open **Local Security Policy** by opening **Server Manager** on the Start screen, or Server Manager in the taskbar on the desktop, then click **Tools/Local Security Policy**.
2. Navigate to the **Security Settings\Local Policies\User Rights Assignment** folder, and then double-click **Generate security audits**.
3. On the **Local Security Setting** tab, verify that the AD FS service account is listed. If it is not present, click **Add User or Group** and add it to the list, and then click **OK**.
4. Open a command prompt with elevated privileges and run the following command to enable auditing: <code>auditpol.exe /set /subcategory:"Application Generated" /failure:enable /success:enable.</code>
5. Close **Local Security Policy**, and then open the **AD FS Management** snap-in (in Server Manager, click Tools, and then select AD FS Management).
6. In the Actions pane, click **Edit Federation Service Properties**.
7. In the Federation Service Properties dialog box, click the **Events** tab.
8. Select the **Success audits and Failure audits** check boxes and then click **OK**.






#### To locate the AD FS audit logs


1. Open **Event Viewer**.
2. Go to Windows Logs and select **Security**.
3. On the right, click **Filter Current Logs**.
4. Under Event Source, select **AD FS Auditing**.

![AD FS audit logs](./media/active-directory-aadconnect-health-requirements/adfsaudit.png)

> [AZURE.WARNING] If you have a group policy that is disabling AD FS auditing then the Azure AD Connect Health Agent will not be able to collect information. Ensure that you don’t have a group policy that may be disabling auditing.


[//]: # (Start of RBAC section)
## Role Based Access Control
### Overview
[Role Based Access Control](role-based-access-control-configure.md)  for Azure AD Connect Health enables the global administrators to provide access to users and/or groups from their organization access to Azure AD Connect Health service  without the users and/or group members required to be global administrators. This is achieved by assigning roles to the intended users.

#### Roles
Azure AD Connect Health supports the following built-in roles.

| Role | Permissions |
| ----------- | ---------- |
| Owner |  Owners can manage everything, including access and perform all operations within Azure AD Connect Health|
|Contributor|  Contributors can manage everything except access and perform all operations within Azure AD Connect Health|
|Reader|	Readers can view everything, but cannot make any changes or perform any operations within Azure AD Connect Health.|

Please note:
- Global Administrators always have full access to all the operations and access control.

- All other roles (which are not listed above), even if they're available in the portal experiences, are not supported within Azure AD Connect Health. For example User Access Administrators and DevTest Lab Users are not supported.

#### Access Scope
A *service instance* in Azure AD Connect Health implies a logical entity that represents one or more servers functioning as a unit. For example in case of AD FS, a farm (such as sts.contoso.com) is a considered a service instance.

Global Administrator or owners can provide access to other users and/or groups at different access scopes within Azure AD Connect Health Service. While specifying access, the scope is determined automatically based on the blade where the action is performed. The following scopes are available:
1. All service instances within Azure AD Connect Health (Directory level)
2. Per service instance within Azure AD Connect Health (Service instance level)

### How to allow users or groups access to Azure AD Connect Health
#### Steps 1: Select the appropriate access scope
- To allow a user access to "all service Instances" within Azure AD Connect Health , open the main blade in Azure AD Connect Health.<br>
![Main Blade](./media/active-directory-aadconnect-health/logo1.png)
- To allow a user access to a specific service instance, open the service instance blade. For example, for sts.fabtoso.com farm, open the sts.fabtoso.com blade.
<br> ![Service Blade](./media/active-directory-aadconnect-health/logo1.png)<br>

#### Step 2: Add users, groups and assign roles
1. Click on the "Users" part from the Configure section.<br>![RBAC part](./media/active-directory-aadconnect-health/logo1.png)
2. Select "Add"
3. Select the "Role"
<br>![RBAC Roles](./media/active-directory-aadconnect-health/logo1.png)<br>
4. Type the name or identifier of the targeted user or group. You can select one or more users or groups at the same time.
5. Select "Ok".
<br> ![RBAC select users and groups](./media/active-directory-aadconnect-health/logo1.png)<br>
6. Once the role assignment is complete, the users and/or groups will appear in the list.
<br>![RBAC user list](./media/active-directory-aadconnect-health/logo1.png)<br>

These steps will allow the listed users and group access as per their assigned roles.Please note:
- Global Administrators always have full access to all the operations but global administrator accounts will not be present in the above list.
- "Invite Users" feature is NOT supported within Azure AD Connect Health.

#### Share the blade location with users or groups
1. After assigning permissions, a user can access Azure AD Connect Health by going to [http://aka.ms/aadconnecthealth](http://aka.ms/aadconnecthealth).
2. Once on the blade, the user can pin the blade or different parts to the dashboard by simply clicking "Pin to dashboard"<br>![Pin blade or part](./media/active-directory-aadconnect-health/logo1.png)<br>

Please note: A user with the "Reader" role assinged will not be able to perform the "create" operation to get Azure AD Connect Health extension from the Azure Marketplace. This user can still get to the blade by going to the above link. For subsequent usage, the user can pin the blade to the dashboard.

### Remove users and/or groups
You can remove a user or a group added to Azure AD Connect Health Role Based Access Control part by right clicking and selecting remove.<br>![Remove a user or group](./media/active-directory-aadconnect-health/logo1.png)<br>

[//]: # (End of RBAC section)


## Related links

* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Agent Installation for AD FS](active-directory-aadconnect-health-agent-install-adfs.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
