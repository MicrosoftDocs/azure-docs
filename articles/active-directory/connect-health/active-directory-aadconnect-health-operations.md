---
title: Azure Active Directory Connect Health operations
description: This article describes additional operations that can be performed once you have deployed Azure AD Connect Health.
services: active-directory
documentationcenter: ''
author: karavar
manager: samueld
editor: curtand

ms.assetid: 86cc3840-60fb-43f9-8b2a-8598a9df5c94
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 1/31/2017
ms.author: vakarand

---
# Azure Active Directory Connect Health operations
This topic describes the various operations you can perform by using Azure Active Directory (Azure AD) Connect Health.

## Enable email notifications
You can configure the Azure AD Connect Health service to send email notifications when alerts indicate that your identity infrastructure is not healthy. This occurs when an alert is generated, and when it is resolved.

![Screenshot of Azure AD Connect Health email notification settings](./media/active-directory-aadconnect-health/email_noti_discover.png)

> [!NOTE]
> Email notifications are enabled by default.
>
>

### To enable Azure AD Connect Health email notifications
1. Open the **Alerts** blade for the service for which you wish to receive email notification.
2. From the action bar, click **Notification Settings**.
3. At the email notification switch, select **ON**.
4. Select the check box if you want all global administrators to receive email notifications.
5. If you wish to receive email notifications at any other email addresses, specify them in the **Additional Email Recipients** box. To remove an email address from this list, right-click the entry and select **Delete**.
6. To finalize the changes, click **Save**. Changes take effect only after you save.

## Delete a server or service instance

In some instances, you may wish to remove a server from being monitored. Here's what you need to know to remove a server from the Azure AD Connect Health service.

When deleting a server, be aware of the following:

* This action stops collecting any further data from that server. This server is removed from the monitoring service. After this action, you are not able to view new alerts, monitoring, or usage analytics data for this server.
* This action does not uninstall the health agent from your server. If you have not uninstalled the health agent before performing this step, you may see errors related to the health agent on the server.
* This action does not delete the data already collected from this server. That data is deleted as per the Azure data retention policy.
* After performing this action, if you wish to start monitoring the same server again, you must uninstall and reinstall the health agent on this server.

### To delete a server from the Azure AD Connect Health service
Azure AD Connect Health for Active Directory Federation Services (AD FS) and Azure AD Connect (Sync):

1. Open the **Server** blade from the **Server List** blade by selecting the server name to be removed.
2. On the **Server** blade, from the action bar, click **Delete**.
3. Confirm by typing the server name in the confirmation box.
4. Click **Delete**.

Azure AD Connect Health for Azure Active Directory Domain Services:

1. Open the **Domain Controllers** dashboard.
2. Select the domain controller to be removed.
3. From the action bar, click **Delete Selected**.
4. Confirm the action to delete the server.
5. Click **Delete**.

### Delete a service instance from Azure AD Connect Health service
In some instances, you may wish to remove a service instance. Here's what you need to know to remove a service instance from the Azure AD Connect Health service.

When deleting a service instance, be aware of the following:

* This action removes the current service instance from the monitoring service.
* This action does not uninstall or remove the health agent from any of the servers that were monitored as part of this service instance. If you have not uninstalled the health agent before performing this step, you may see errors related to the health agent on the server(s).
* All data from this service instance is deleted as per the Azure data retention policy.
* After performing this action, if you wish to start monitoring the service, uninstall and reinstall the health agent on all the servers. After performing this action, if you wish to start monitoring the same server again, uninstall, reinstall, and register the health agent on that server.

#### To delete a service instance from the Azure AD Connect Health service
1. Open the **Service** blade from the **Service List** blade by selecting the service identifier (farm name) that you wish to remove.
2. On the **Server** blade, from the action bar, click **Delete**.
3. Confirm by typing the service name in the confirmation box (for example: sts.contoso.com).
4. Click **Delete**.
   <br><br>

[//]: # (Start of RBAC section)
## Manage access With Role-Based Access Control
[Role-Based Access Control (RBAC)](../role-based-access-control-configure.md) for Azure AD Connect Health provides access to users and groups other than global administrators. RBAC assigns roles to the intended users and groups, and provides a mechanism to limit the global administrators within your directory.

### Roles
Azure AD Connect Health supports the following built-in roles:

| Role | Permissions |
| --- | --- |
| Owner |Owners can *manage access* (for example, assign a role to a user or group), *view all information* (for example, view alerts) from the portal, and *change settings* (for example, email notifications) within Azure AD Connect Health. <br>By default, Azure AD global administrators are assigned this role, and this cannot be changed. |
| Contributor |Contributors can *view all information* (for example, view alerts) from the portal, and *change settings* (for example, email notifications) within Azure AD Connect Health. |
| Reader |Readers can *view all information* (for example, view alerts) from the portal within Azure AD Connect Health. |

All other roles (such as User Access Administrators or DevTest Labs Users) have no impact to access within Azure AD Connect Health, even if the roles are available in the portal experience.

### Access scope
Azure AD Connect supports managing access at two levels:

* **All service instances**: This is the recommended path in most cases. It controls access for all service instances (for example, an AD FS farm) across all role types that are being monitored by Azure AD Connect Health.
* **Service instance**: In some cases, you may need to segregate access based on role types or by a service instance. In this case, you can manage access at the service instance level.  

Permission is granted if an end user has access either at the directory or service instance level.

### Allow users or groups access to Azure AD Connect Health
The following steps show how to allow access.
#### Step 1: Select the appropriate access scope
To allow a user access at the *all service instances* level within Azure AD Connect Health, open the main blade in Azure AD Connect Health.<br>

#### Step 2: Add users and groups, and assign roles
1. From the **Configure** section, click **Users**.<br>
   ![Screenshot of Azure AD Connect Health RBAC main blade, with Users highlighted](./media/active-directory-aadconnect-health/RBAC_main_blade.png)
2. Select **Add**.
3. In the **Select a role** pane, select a role (for example, **Owner**).<br>
   ![Screenshot of Azure AD Connect Health RBAC Users window](./media/active-directory-aadconnect-health/RBAC_add.png)
4. Type the name or identifier of the targeted user or group. You can select one or more users or groups at the same time. Click **Select**.
   ![Screenshot of Azure AD Connect Health RBAC Users window](./media/active-directory-aadconnect-health/RBAC_select_users.png)
5. Select **OK**.<br>
6. Once the role assignment is complete, the users and groups appear in the list.<br>
   ![Screenshot of Azure AD Connect Health RBAC Users window, with new users highlighted](./media/active-directory-aadconnect-health/RBAC_user_list.png)

Now the listed users and groups have access, according to their assigned roles.

> [!NOTE]
> * Global administrators always have full access to all the operations, but global administrator accounts are not present in the above list.
> * The Invite Users feature is not supported within Azure AD Connect Health.
>
>

#### Step 3: Share the blade location with users or groups
1. After you assign permissions, a user can access Azure AD Connect Health by going [here](http://aka.ms/aadconnecthealth).
2. On the blade, the user can pin the blade, or different parts of it, to the dashboard. Simply click the **Pin to dashboard** icon.<br>
   ![Screenshot of Azure AD Connect Health RBAC pin blade, with pin icon highlighted](./media/active-directory-aadconnect-health/RBAC_pin_blade.png)

> [!NOTE]
> A user with the Reader role assigned is not able to get Azure AD Connect Health extension from the Azure Marketplace. The user cannot perform the necessary "create" operation to do so. The user can still get to the blade by going to the preceding link. For subsequent usage, the user can pin the blade to the dashboard.
>
>

### Remove users or groups
You can remove a user or a group added to Azure AD Connect Health RBAC. Simply right-click the user or group, and select **Remove**.<br>
![Screenshot of Azure AD Connect Health RBAC Users window, with Remove highlighted](./media/active-directory-aadconnect-health/RBAC_remove.png)

[//]: # (End of RBAC section)

## Next steps
* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Agent Installation](active-directory-aadconnect-health-agent-install.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md)
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
* [Azure AD Connect Health Version History](active-directory-aadconnect-health-version-history.md)
