<properties
	pageTitle="Manage access to Log Analytics | Microsoft Azure"
	description="Manage access to Log Analytics using a variety of administrative tasks on users, accounts, OMS workspaces, and Azure accounts."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/19/2016"
	ms.author="banders"/>

# Manage access to Log Analytics

To manage access to Log Analytics, you'll use a variety of administrative tasks on users, accounts, OMS workspaces, and Azure accounts. To create a new workspace in the Operations Management Suite (OMS), you choose a workspace name, associate it with your account, and you choose a geographical location. A workspace is essentially a container that includes account information and simple configuration information for the account. You or other members of your organization might use multiple OMS workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

The [First look: Get started with Log Analytics](log-analytics-get-started.md) article shows you how to quickly get up and running and the rest of this article describes in more detail some of the actions you'll need to manage access to OMS.

Although you might not need to perform every management task at first, we'll cover all the commonly used tasks that you might use in the following sections:

- Manage accounts and users
- Add a group to an existing workspace
- Determine the number of workspaces you need
- Link an existing workspace to an Azure subscription
- Upgrade a workspace to a paid data plan
- Change a data plan type
- Add an Azure Active Directory Organization to an existing workspace
- Control access to OMS Log Analytics resources
- Close your OMS workspace

## Manage accounts and users
You manage accounts and users using the **Accounts** tab in the Settings page. There, you can perform the tasks in the following sections.  

![manage users](./media/log-analytics-manage-access/setup-workspace-manage-users.png)

### Add a user to an existing workspace

Use the following steps to add a user or group to an OMS workspace. The user or group will be able to view and act on all alerts that are associated with this workspace.

>[AZURE.NOTE] If you want to add a user or group from your Azure Active Directory organizational account, you must first ensure that you have associated your OMS account with your Active Directory domain. See [Add an Azure Active Directory Organization to an existing workspace](#add-an-azure-active-directory-organization-to-an-existing-workspace).

#### To add a user to an existing workspace
1. In OMS, click the **Settings** tile.
2. Click the **Accounts** tab.
3. In the **Manage Users** section, choose the account type to add: **Organizational Account** or **Microsoft Account**.
    - If  you choose Microsoft Account, type the email address of the user associated with the Microsoft Account.
    - If you choose Organizational Account, you can enter part of the user or group’s name or email alias and a list of users and groups will appear. Select a user or  group.

    >[AZURE.NOTE] For the best performance results, limit the number of Active Directory groups associated with a single OMS account to two—one for administrators and one for users. Using more groups might impact the performance of Log Analytics.

7. Choose the type of user or group to add: **Administrator** or **User**.  
8. Click **Add**.

  If you are adding a Microsoft account, an invitation to join the workspace is sent to the email you provided. After the user follows the instructions in the invitation to join OMS, the user can view the alerts and account information for this OMS account, and you will be able to view the user information on the **Accounts**  tab of the **Settings** page.
  If you are adding an organizational account, the user will be able to access Log Analytics immediately.  
  ![invitation email](./media/log-analytics-manage-access/setup-workspace-invitation-email.png)

### Edit an existing user type

You can change the account role for a user associated with your OMS account. You have the following role options:

 - *Administrator*: Can manage users, view and act on all alerts, and add and remove servers

 - *User*: Can view and act on all alerts, and add and remove servers

#### To edit an account
1. On the **Settings** page in the **Accounts** tab in OMS, select the role for the user that you want to change.
2. Click **OK**.

## Remove a user from a OMS workspace

Use the following steps to remove a user from an OMS workspace. Note that this does not close the user’s workspace. Instead, it removes the association between that user and the workspace. If a user is associated with multiple workspaces, that user will still be able to sign in to OMS.

### To remove a user from a workspace

1. On the **Settings** page in the **Accounts** tab of OMS, click Remove next to the user name that you want to remove.
2. Click **OK** to confirm that you want to remove the user.


## Add a group to an existing workspace

1.	Follow steps 1 -4 in “To add a user to an existing workspace”, above.
2.	Under **Choose User/Group**, select **Group**.
    ![add a group to an existing workspace](./media/log-analytics-manage-access/add-group.png)
3.	Enter the Display Name or Email address for the group you’d like to add.
4.	Select the group in the list results and then click **Add**.

## Determine the number of workspaces you need

A workspace is seen as an Azure resource within the Azure Management Portal.

You can either create a new workspace or link to an existing workspace you might have opened earlier for use with System Center Operations Manager, but you haven't yet associated with an Azure subscription (necessary for billing).

A workspace represents the level at which data is collected, aggregated, analyzed, and presented in the OMS portal.
You might choose to have multiple workspaces to segregate data from different environments and systems; each Operations Manager management group (and all its agents) or individual VMs/agents can each be connected with only one workspace.

Each workspace can have multiple user accounts associated with it, and each user account (Microsoft account or Organizational account) can have access to multiple OMS workspaces.

By default, the Microsoft account or Organizational account used to create the workspace becomes the Administrator of the workspace. The administrator can then invite additional Microsoft accounts or pick users from his Azure Active Directory.

## Link an existing workspace to an Azure subscription

It is possible to create a workspace from the [microsoft.com/oms](https://microsoft.com/oms) website.  However, certain limits exist for these workspaces, the most notable being a limit of 500MB/day of data uploads if you're using a free account. To make changes to this workspace you will need to **link your existing workspace to an Azure subscription**.

>[AZURE.IMPORTANT] In order to link a workspace, your Azure account must already have access to the workspace you'd like to link.  In other words, the account you use to access the Azure portal must be **the same** as the account you use to access your OMS workspace. If this is not the case, see [Add a user to an existing workspace](#add-a-user-to-an-existing-workspace).

1.	Sign into the [Azure portal](http://portal.azure.com).
2.	Browse for **Log Analytics (OMS)** and then select it.
3.	You’ll see your list of existing workspaces. Click **Add**.  
    ![list of workspaces](./media/log-analytics-manage-access/manage-access-link-azure01.png)
4.	Under **OMS Workspace**, click **Or link existing**.  
    ![link existing](./media/log-analytics-manage-access/manage-access-link-azure02.png)
5.	Click **Configure required settings**.  
    ![configure required settings](./media/log-analytics-manage-access/manage-access-link-azure03.png)
6.	You’ll see the list of workspaces that are not yet linked to your Azure account. Select a workspace.
    ![select workspaces](./media/log-analytics-manage-access/manage-access-link-azure04.png)
7.	If needed, you can change values for the following items:
    - Subscription
    - Resource group
    - Location
    - Pricing tier  
        ![change values](./media/log-analytics-manage-access/manage-access-link-azure05.png)
8.	Click **Create**. The workspace is now linked to your Azure account.

>[AZURE.NOTE] If you do not see the workspace you'd like to link, then your Azure subscription does not have access to the OMS workspace that you created using the OMS website.  You will need to grant access to this account from inside your OMS workspace using the OMS website. To do so, see [Add a user to an existing workspace](#add-a-user-to-an-existing-workspace).



## Upgrade a workspace to a paid data plan

There are three workspace data plan types for OMS: **Free**, **Standard** and **Premium**.  If you are on a *free* plan, you may have hit your data cap of 500MB.  You will need to upgrade your workspace to a '**pay-as-you-go plan**' in order to collect data beyond this limit. At any time you can convert your plan type.  For more information on OMS pricing, see [Pricing Details](https://www.microsoft.com/en-us/server-cloud/operations-management-suite/pricing.aspx).

>[AZURE.IMPORTANT] Workspace plans can only be changed if they are *linked* to an Azure subscription.  If you created your workspace in Azure or if you've *already* linked your workspace, you can ignore this message.  If you created your workspace with the [OMS website](http://www.microsoft.com/oms), you will need to follow the steps at [Link an existing workspace to an Azure subscription](#link-an-existing-workspace-to-an-azure-subscription).

### Using entitlements from the OMS Add On for System Center

The OMS Add On for System Center provides an entitlement for the Premium plan of OMS Log Analytics, described at [OMS Pricing](https://www.microsoft.com/en-us/server-cloud/operations-management-suite/pricing.aspx).

If you purchase the OMS add-on for System Center, your Microsoft account team or reseller will associate the OMS add-ons to your Enterprise Agreement that includes your Azure purchases. Your OMS add-on creates an entitlement on your agreement, and any Azure subscription can make use of the entitlement. This allows you, for example, to have multiple OMS workspaces that use the entitlement from the OMS add-on.

To ensure that usage of an OMS workspace is applied to your entitlements from the OMS add-on, you'll need to :
1.	Link your OMS workspace to an Azure subscription that is part of the Enterprise Agreement that includes both the OMS add-on purchase and Azure subscription usage
2.	Select the Premium plan for the workspace

When you review your usage in the Azure or OMS portal, you won’t see the OMS add-on entitlements. However, you can see entitlements in the Enterprise Portal.  

If you need to change the Azure subscription that your OMS workspace is linked to, you can use the Azure PowerShell [Move-AzureRMResource](https://msdn.microsoft.com/library/mt652516.aspx) cmdlet.

### Using Azure Commitment from an Enterprise Agreement

If you choose to use standalone pricing for OMS components, you will pay for each component of OMS separately and the usage will appear on your Azure bill.

If you have pre-paid for a certain amount of Azure usage as part of your Enterprise Agreement, then your usage of OMS will use your pre-paid usage. To use your Azure Commitment pricing for OMS Log Analytics, the subscription that the OMS workspace is linked to needs to be part of the Azure Enterprise Agreement.

If you need to change the Azure subscription that the OMS workspace is linked to you can use the Azure PowerShell [Move-AzureRMResource](https://msdn.microsoft.com/library/mt652516.aspx) cmdlet.  



### To change a workspace to a paid data plan

1.	Sign into the [Azure portal](http://portal.azure.com).
2.	Browse for **Log Analytics (OMS)** and then select it.
3.	You’ll see your list of existing workspaces. Select a workspace.  
    ![list of workspaces](./media/log-analytics-manage-access/manage-access-change-plan01.png)
4.	Under **Settings**, click **Pricing tier**.  
    ![pricing tier](./media/log-analytics-manage-access/manage-access-change-plan02.png)
5.	Under **Pricing tier**, select a data plan and then click **Select**.  
    ![select plan](./media/log-analytics-manage-access/manage-access-change-plan03.png)
6.	When you refresh your view in the Azure portal, you’ll see **Pricing tier** updated for the plan you selected.  
    ![update pricing tier](./media/log-analytics-manage-access/manage-access-change-plan04.png)

Now you can collect data beyond the "free" data cap.


## Add an Azure Active Directory Organization to an existing workspace

You can associate your Operational Insights (OMS) workspace with an Azure Active Directory domain. This enables you to add users from Active Directory directly to your OMS workspace without requiring a separate Microsoft account.

### To add an Azure Active Directory Organization to an existing workspace

1. On the Settings page in OMS, click **Accounts** and then click **Workspace Information**.  
2. Review the information about organizational accounts, and then click **Add Organization**.  
    ![add organization](./media/log-analytics-manage-access/manage-access-add-adorg01.png)
3. Enter the identity information for the administrator of your Azure Active Directory domain. Afterward, you'll see an acknowledgment stating that your workspace is linked to your Azure Active Directory domain.
    ![linked workspace acknowledgment](./media/log-analytics-manage-access/manage-access-add-adorg02.png)


## Control access to OMS Log Analytics resources

Giving people access to the OMS workspace is controlled in 2 places:

- For access to the OMS portal, this is managed within the OMS portal and this is separate from whether people have access to the Azure subscriptions that the resources are in.
- For PowerShell and direct REST API access, you manage it within Azure using Azure RBAC

If you have given people access to the OMS portal but not to the Azure subscription that it is linked to, then the Automation, Backup and, Site Recovery solution tiles will not show any data for the user when they log into the OMS portal.

To allow all users to see the data in these solutions, ensure they have at least **reader** access for the Automation Account, Backup Vault and Site Recovery vault that is linked to the OMS workspace.   


## Close your OMS workspace

When you close an OMS workspace, all data related to your workspace is deleted from the OMS service not more than 30 days after you close the workspace.

If you are an administrator, and there are multiple users associated with the workspace, the association between those users and the workspace is broken. If the users are associated with other workspaces, then they can continue using OMS with those other workspaces. However, if they are not associated with other workspaces then they will need to create a new workspace to use OMS.

### To close an OMS workspace

1. On the **Settings** page in the **Accounts** tab of OMS, click **Close Workspace**.

2. Select one of the reasons for closing your workspace, or enter a different reason in the text box.

3. Click **Close workspace**.

## Next Steps
- Connect [Windows agents](log-analytics-windows-agents.md)
