---
title: Manage workspaces in Azure Log Analytics | Microsoft Docs
description: You can manage workspaces in Azure Log Analytics using a variety of administrative tasks on users, accounts, workspaces, and Azure accounts.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: d0e5162d-584b-428c-8e8b-4dcaa746e783
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/12/2017
ms.author: magoedte

---
# Manage workspaces

To manage access to Log Analytics, you perform various administrative tasks related to workspaces. This article provides best practice advice and procedures to manage workspaces. A workspace is essentially a container that includes account information and simple configuration information for the account. You or other members of your organization might use multiple workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

To create a workspace, you need to:

1. Have an Azure subscription.
2. Choose a workspace name.
3. Associate the workspace with your subscription.
4. Choose a geographical location.

## Determine the number of workspaces you need
A workspace is an Azure resource and is a container where data is collected, aggregated, analyzed, and presented in the Azure portal.

You can have multiple workspaces per Azure subscription and you can have access to more than one workspace. Minimizing the number of workspaces allows you to query and correlate across the most data, since it is not possible to query across multiple workspaces. This section describes when it can be helpful to create more than one workspace.

Today, a workspace provides:

* A geographic location for data storage
* Granularity for billing
* Data isolation
* Scope for configuration

Based on the preceding characteristics, you may want to create multiple workspaces if:

* You are a global company and you need data stored in specific regions for data sovereignty or compliance reasons.
* You are using Azure and you want to avoid outbound data transfer charges by having a workspace in the same region as the Azure resources it manages.
* You want to allocate charges to different departments or business groups based on their usage. When you create a workspace for each department or business group, your Azure bill and usage statement shows the charges for each workspace separately.
* You are a managed service provider and need to keep Log Analytics data for each customer you manage isolated from other customer’s data.
* You manage multiple customers and you want each customer / department / business group to see their own data but not the data for others.

When using agents to collect data, you can [configure each agent to report to one or more workspaces](log-analytics-windows-agents.md).

If you are using System Center Operations Manager, each Operations Manager management group can be connected with only one workspace. However, the Microsoft Monitoring Agent on the computer can be configured to report to both Operations Manager and a different Log Analytics workspace.  

### Workspace information

You can view details about your workspace in the Azure portal. 

#### View workspace information in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **More services** found on the lower left-hand corner of the Azure portal.  In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Click **Log Analytics**.  
    ![Azure hub](./media/log-analytics-manage-access/hub.png)  
3. In the Log Analytics subscriptions blade, select a workspace.
4. The workspace blade displays details about the workspace and links for additional information.  
    ![workspace details](./media/log-analytics-manage-access/workspace-details.png)  


## Manage accounts and users
Each workspace can have multiple accounts associated with it, and each account (Microsoft account or Organizational account) can have access to multiple workspaces.

By default, the Microsoft account or Organizational account that creates the workspace becomes the Administrator of the workspace.

There are two permission models that control access to a Log Analytics workspace:

1. Legacy Log Analytics user roles
2. [Azure role-based access](../active-directory/role-based-access-control-configure.md)

The following table summarizes the access that can be set using each permission model:

|                          | Log Analytics portal | Azure portal | API (including PowerShell) |
|--------------------------|----------------------|--------------|----------------------------|
| Log Analytics user roles | Yes                  | No           | No                         |
| Azure role-based access  | Yes                  | Yes          | Yes                        |

> [!NOTE]
> Log Analytics is moving to use Azure role-based access as the permissions model, replacing the Log Analytics user roles.
>
>

The legacy Log Analytics user roles only control access to activities performed in the [Log Analytics portal](https://mms.microsoft.com).

The following activities also require Azure permissions:

| Action                                                          | Azure Permissions Needed | Notes |
|-----------------------------------------------------------------|--------------------------|-------|
| Adding and removing management solutions                        | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/*` <br> `Microsoft.OperationsManagement/*` <br> `Microsoft.Automation/*` <br> `Microsoft.Resources/deployments/*/write` | |
| Changing the pricing tier                                       | `Microsoft.OperationalInsights/workspaces/*/write` | |
| Viewing data in the *Backup* and *Site Recovery* solution tiles | Administrator / Co-administrator | Accesses resources deployed using the classic deployment model |
| Creating a workspace in the Azure portal                        | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/workspaces/*` ||


### Managing access to Log Analytics using Azure permissions
To grant access to the Log Analytics workspace using Azure permissions, follow the steps in [use role assignments to manage access to your Azure subscription resources](../active-directory/role-based-access-control-configure.md).

Azure has two built-in user roles for Log Analytics:
- Log Analytics Reader
- Log Analytics Contributor

Members of the *Log Analytics Reader* role can:
- View and search all monitoring data 
- View monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.

| Type    | Permission | Description |
| ------- | ---------- | ----------- |
| Action | `*/read`   | Ability to view all resources and resource configuration. Includes viewing: <br> Virtual machine extension status <br> Configuration of Azure diagnostics on resources <br> All properties and settings of all resources |
| Action | `Microsoft.OperationalInsights/workspaces/analytics/query/action` | Ability to perform Log Search v2 queries |
| Action | `Microsoft.OperationalInsights/workspaces/search/action` | Ability to perform Log Search v1 queries |
| Action | `Microsoft.Support/*` | Ability to open support cases |
|Not Action | `Microsoft.OperationalInsights/workspaces/sharedKeys/read` | Prevents reading of workspace key required to use the data collection API and to install agents |


Members of the *Log Analytics Contributor* role can:
- Read all monitoring data 
- Creating and configuring Automation accounts
- Adding and removing management solutions
- Reading storage account keys 
- Configure collection of logs from Azure Storage
- Edit monitoring settings for Azure resources, including
  - Adding the VM extension to VMs
  - Configuring Azure diagnostics on all Azure resources

> [!NOTE] 
> You can use the ability to add a virtual machine extension to a virtual machine to gain full control over a virtual machine.

| Permission | Description |
| ---------- | ----------- |
| `*/read`     | Ability to view all resources and resource configuration. Includes viewing: <br> Virtual machine extension status <br> Configuration of Azure diagnostics on resources <br> All properties and settings of all resources |
| `Microsoft.Automation/automationAccounts/*` | Ability to create and configure Azure Automation accounts, including adding and editing runbooks |
| `Microsoft.ClassicCompute/virtualMachines/extensions/*` <br> `Microsoft.Compute/virtualMachines/extensions/*` | Add, update and remove virtual machine extensions, including the Microsoft Monitoring Agent extension and the OMS Agent for Linux extension |
| `Microsoft.ClassicStorage/storageAccounts/listKeys/action` <br> `Microsoft.Storage/storageAccounts/listKeys/action` | View the storage account key. Required to configure Log Analytics to read logs from Azure storage accounts |
| `Microsoft.Insights/alertRules/*` | Add, update, and remove alert rules |
| `Microsoft.Insights/diagnosticSettings/*` | Add, update, and remove diagnostics settings on Azure resources |
| `Microsoft.OperationalInsights/*` | Add, update, and remove configuration for Log Analytics workspaces |
| `Microsoft.OperationsManagement/*` | Add and remove management solutions |
| `Microsoft.Resources/deployments/*` | Create and delete deployments. Required for adding and removing solutions, workspaces, and automation accounts |
| `Microsoft.Resources/subscriptions/resourcegroups/deployments/*` | Create and delete deployments. Required for adding and removing solutions, workspaces, and automation accounts |

To add and remove users to a user role, it is necessary to have `Microsoft.Authorization/*/Delete` and `Microsoft.Authorization/*/Write` permission.

Use these roles to give users access at different scopes:
- Subscription - Access to all workspaces in the subscription
- Resource Group - Access to all workspace in the resource group
- Resource - Access to only the specified workspace

Use [custom roles](../active-directory/role-based-access-control-custom-roles.md) to create roles with the specific permissions needed.

### Azure user roles and Log Analytics portal user roles
If you have at least Azure read permission on the Log Analytics workspace, you can open the OMS portal by clicking the **OMS Portal** task when viewing the Log Analytics workspace.

When opening the OMS portal, you switch to using the legacy Log Analytics user roles. If you do not have a role assignment in the Log Analytics portal, the service [checks the Azure permissions you have on the workspace](https://docs.microsoft.com/rest/api/authorization/permissions#Permissions_ListForResource).
Your role assignment in the OMS portal is determined using as follows:

| Conditions                                                   | Log Analytics user role assigned | Notes |
|--------------------------------------------------------------|----------------------------------|-------|
| Your account belongs to a legacy Log Analytics user role     | The specified Log Analytics user role | |
| Your account does not belong to a legacy Log Analytics user role <br> Full Azure permissions to the workspace (`*` permission <sup>1</sup>) | Administrator ||
| Your account does not belong to a legacy Log Analytics user role <br> Full Azure permissions to the workspace (`*` permission <sup>1</sup>) <br> *not actions* of `Microsoft.Authorization/*/Delete` and `Microsoft.Authorization/*/Write` | Contributor ||
| Your account does not belong to a legacy Log Analytics user role <br> Azure read permission | Read Only ||
| Your account does not belong to a legacy Log Analytics user role <br> Azure permissions are not understood | Read Only ||
| For Cloud Solution Provider (CSP) managed subscriptions <br> The account you are signed-in with is in the Azure Active Directory linked to the workspace | Administrator | Typically the customer of a CSP |
| For Cloud Solution Provider (CSP) managed subscriptions <br> The account you are signed-in with is not in the Azure Active Directory linked to the workspace | Contributor | Typically the CSP |

<sup>1</sup> Refer to [Azure permissions](../active-directory/role-based-access-control-custom-roles.md) for more information on role definitions. When evaluating roles, an action of `*` is not equivalent to `Microsoft.OperationalInsights/workspaces/*`.

Some points to keep in mind about the Azure portal:

* When you sign in to the OMS portal using http://mms.microsoft.com, you see the **Select a workspace** list. This list only contains workspaces where you have a Log Analytics user role. To see the workspaces you have access to with Azure subscriptions, you need to specify a tenant as part of the URL. For example:  `mms.microsoft.com/?tenant=contoso.com`. The tenant identifier is often that last part of the e-mail address that you use to sign in with.
* If you want to navigate directly to a portal that you have access to using Azure permissions, then you need to specify the resource as part of the URL. It is possible to get this URL using PowerShell.

  For example, `(Get-AzureRmOperationalInsightsWorkspace).PortalUrl`.

  The URL looks like:
  `https://eus.mms.microsoft.com/?tenant=contoso.com&resource=%2fsubscriptions%2faaa5159e-dcf6-890a-a702-2d2fee51c102%2fresourcegroups%2fdb-resgroup%2fproviders%2fmicrosoft.operationalinsights%2fworkspaces%2fmydemo12`

### Managing users in the OMS portal
You manage users and group on the **Manage Users** tab under the **Accounts** tab in the Settings page.   

![manage users](./media/log-analytics-manage-access/setup-workspace-manage-users.png)


#### Add a user to an existing workspace
Use the following steps to add a user or group to a workspace.

1. In the OMS portal, click the **Settings** tile.
2. Click the **Accounts** tab and then click the **Manage Users** tab.
3. In the **Manage Users** section, choose the account type to add: **Organizational Account**, **Microsoft Account**, **Microsoft Support**.

   * If you choose Microsoft Account, type the email address of the user associated with the Microsoft Account.
   * If you choose Organizational Account, enter part of the user / group’s name or email alias and a list of matching users and groups appears in a dropdown box. Select a user or group.
   * Use Microsoft Support to give a Microsoft Support engineer or other Microsoft employee temporary access to your workspace to help with troubleshooting.

     > [!NOTE]
     > For the best performance, limit the number of Active Directory groups associated with a single OMS account to three—one for administrators, one for contributors, and one for read-only users. Using more groups might impact the performance of Log Analytics.
     >
     >
4. Choose the type of user or group to add: **Administrator**, **Contributor**, or **ReadOnly User**.  
5. Click **Add**.

   If you are adding a Microsoft account, an invitation to join the workspace is sent to the email you provided. After the user follows the instructions in the invitation to join OMS, the user can access the workspace.
   If you are adding an organizational account, the user can access Log Analytics immediately.  

#### Edit an existing user type
You can change the account role for a user associated with your OMS account. You have the following role options:

* *Administrator*: Can manage users, view and act on all alerts, and add and remove servers
* *Contributor*: Can view and act on all alerts, and add and remove servers
* *ReadOnly User*: Users marked as read-only cannot:

  1. Add/remove solutions. The solution gallery is hidden.
  2. Add/modify/remove tiles on **My Dashboard**.
  3. View the **Settings** pages. The pages are hidden.
  4. In the Search view, PowerBI configuration, Saved Searches, and Alerts tasks are hidden.

#### To edit an account
1. In the OMS portal, click the **Settings** tile.
2. Click the **Accounts** tab and then click the **Manage Users** tab.
3. Select the role for the user that you want to change.
4. In the confirmation dialog box, click **Yes**.

### Remove a user from a workspace
Use the following steps to remove a user from a workspace. Removing the user does not close the workspace. Instead, it removes the association between that user and the workspace. If a user is associated with multiple workspaces, that user can still sign in to OMS and see their other workspaces.

1. In the OMS portal, click the **Settings** tile.
2. Click the **Accounts** tab and then click the **Manage Users** tab.
3. Click **Remove** next to the user name that you want to remove.
4. In the confirmation dialog box, click **Yes**.

### Add a group to an existing workspace
1. In the preceding section “To add a user to an existing workspace”, follow steps 1 - 4.
2. Under **Choose User/Group**, select **Group**.  
   ![add a group to an existing workspace](./media/log-analytics-manage-access/add-group.png)
3. Enter the Display Name or Email address for the group you’d like to add.
4. Select the group in the list results and then click **Add**.

## Link an existing workspace to an Azure subscription
All workspaces created after September 26, 2016 must be linked to an Azure subscription at creation time. Workspaces created before this date must be linked to a workspace when you sign in. When you create the workspace from the Azure portal, or when you link your workspace to an Azure subscription, your Azure Active Directory is linked as your organizational account.

### To link a workspace to an Azure subscription in the OMS portal

- When you sign into the OMS portal, you are prompted to select an Azure subscription. Select the subscription that you want to link to your workspace and then click **Link**.  
    ![link Azure subscription](./media/log-analytics-manage-access/required-link.png)

    > [!IMPORTANT]
    > To link a workspace, your Azure account must already have access to the workspace you'd like to link.  In other words, the account you use to access the Azure portal must be **the same** as the account you use to access the workspace. If not, see [Add a user to an existing workspace](#add-a-user-to-an-existing-workspace).

### To link a workspace to an Azure subscription in the Azure portal
1. Sign into the [Azure portal](http://portal.azure.com).
2. Browse for **Log Analytics** and then select it.
3. You see your list of existing workspaces. Click **Add**.  
   ![list of workspaces](./media/log-analytics-manage-access/manage-access-link-azure01.png)
4. Under **OMS Workspace**, click **Or link existing**.  
   ![link existing](./media/log-analytics-manage-access/manage-access-link-azure02.png)
5. Click **Configure required settings**.  
   ![configure required settings](./media/log-analytics-manage-access/manage-access-link-azure03.png)
6. You see the list of workspaces that are not yet linked to your Azure account. Select a workspace.  
   ![select workspaces](./media/log-analytics-manage-access/manage-access-link-azure04.png)
7. If needed, you can change values for the following items:
   * Subscription
   * Resource group
   * Location
   * Pricing tier  
     ![change values](./media/log-analytics-manage-access/manage-access-link-azure05.png)
8. Click **OK**. The workspace is now linked to your Azure account.

> [!NOTE]
> If you do not see the workspace you'd like to link, then your Azure subscription does not have access to the workspace that you created using the OMS portal.  To grant access to this account from the OMS portal, see [Add a user to an existing workspace](#add-a-user-to-an-existing-workspace).
>
>

## Change an Azure Active Directory Organization for a workspace

You can change a workspace's Azure Active Directory organization. Changing the Azure Active Directory Organization allows you to add users and groups from that directory to the workspace.

### To change the Azure Active Directory Organization for a workspace

1. On the Settings page in the OMS portal, click **Accounts** and then click the **Manage Users** tab.  
2. Review the information about organizational accounts, and then click **Change Organization**.  
    ![change organization](./media/log-analytics-manage-access/manage-access-add-adorg01.png)
3. Enter the identity information for the administrator of your Azure Active Directory domain. Afterward, you see an acknowledgment stating that your workspace is linked to your Azure Active Directory domain.  
    ![linked workspace acknowledgment](./media/log-analytics-manage-access/manage-access-add-adorg02.png)

## Next steps
* See [Understand data usage](log-analytics-usage.md) to learn how to analyze the volume of data collected by solutions and sent from computers.
* [Add Log Analytics management solutions from Azure marketplace](log-analytics-add-solutions.md) to add functionality and gather data.