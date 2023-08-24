---
title: 'Tutorial: Configure VMware Identity Service for automatic user provisioning with Azure Active Directory'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to VMware Identity Service.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 4ad9db26-2354-4e47-9dc3-2deb39222c87
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/03/2023
ms.author: thwimmer
---

# Tutorial: Configure VMware Identity Service for automatic user provisioning

This tutorial describes the steps you need to perform in both VMware Identity Service and Azure Active Directory (Azure AD) to configure automatic user provisioning. When configured, Azure AD automatically provisions and de-provisions users and groups to [VMware Identity Service](https://www.vmware.com/) using the Azure AD Provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md). 


## Supported capabilities
> [!div class="checklist"]
> * Create users in VMware Identity Service.
> * Remove users in VMware Identity Service when they do not require access anymore.
> * Keep user attributes synchronized between Azure AD and VMware Identity Service.
> * Provision groups and group memberships in VMware Identity Service.
> * [Single sign-on](vmware-identity-service-tutorial.md) to VMware Identity Service (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [An Azure AD tenant](../develop/quickstart-create-new-tenant.md). 
* A user account in Azure AD with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An VMware Identity Service tenant.
* A user account in VMware Identity Service with Admin permissions.

## Step 1. Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Azure AD and VMware Identity Service](../app-provisioning/customize-application-attributes.md).

## Step 2. Configure VMware Identity Service to support provisioning with Azure AD
Contact VMware Identity Service support to configure VMware Identity Service to support provisioning with Azure AD.

## Step 3. Add VMware Identity Service from the Azure AD application gallery

Add VMware Identity Service from the Azure AD application gallery to start managing provisioning to VMware Identity Service. If you have previously setup VMware Identity Service for SSO you can use the same application. However it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4. Define who will be in scope for provisioning 

The Azure AD provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5. Configure automatic user provisioning to VMware Identity Service 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for VMware Identity Service in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **VMware Identity Service**.

	![Screenshot of the VMware Identity Service link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your VMware Identity Service Tenant URL and Secret Token. Click **Test Connection** to ensure Azure AD can connect to VMware Identity Service. If the connection fails, ensure your VMware Identity Service account has Admin permissions and try again.

 	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to VMware Identity Service**.

1. Review the user attributes that are synchronized from Azure AD to VMware Identity Service in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in VMware Identity Service for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the VMware Identity Service API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by VMware Identity Service|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||&check;
   |externalId|String||
   |emails[type eq "work"].value|String||
   |name.givenName|String||
   |name.familyName|String||
   |phoneNumbers[type eq "work"].value|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String||
   |addresses[type eq \"work\"].country|String||
   |addresses[type eq \"work\"].postalCode|String||
   |addresses[type eq \"work\"].region|String||
   |addresses[type eq \"work\"].locality|String||
   |addresses[type eq \"work\"].streetAddress|String||
   |profileUrl|String||
   |title|String||
   |nickName|String||
   |displayName|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:adSourceAnchor|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:customAttribute1|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:customAttribute2|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:customAttribute3|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:customAttribute4|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:customAttribute5|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:distinguishedName|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:domain|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:User:userPrincipalName|String||
   
1. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to VMware Identity Service**.

1. Review the group attributes that are synchronized from Azure AD to VMware Identity Service in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in VMware Identity Service for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by VMware Identity Service|
   |---|---|---|---|
   |displayName|String|&check;|&check;
   |members|Reference||
   |externalId|String||&check;
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:Group:description|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:Group:distinguishedName|String||
   |urn:ietf:params:scim:schemas:extension:ws1b:2.0:Group:domain|String||
   
1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Azure AD provisioning service for VMware Identity Service, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to VMware Identity Service by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. 

## Step 6. Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
