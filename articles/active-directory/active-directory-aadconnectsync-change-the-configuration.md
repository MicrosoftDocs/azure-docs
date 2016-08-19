<properties
	pageTitle="Azure AD Connect sync: How to make a change to the default configuration | Microsoft Azure"
	description="Walks you through how to make a change to the configuration in Azure AD Connect sync."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/19/2016"
	ms.author="andkjell"/>


# Azure AD Connect sync: How to make a change to the default configuration
The purpose of this topic is to walk you through how to make changes to the default configuration in Azure AD Connect sync. It provides steps for some common scenarios. With this knowledge, you should be able to make some simple changes to your own configuration based on your own business rules.

## Synchronization Rules Editor
The Synchronization Rules Editor is used to see and change the default configuration. You can find it in the Start Menu under the **Azure AD Connect** group.  
![Start Menu with Sync Rule Editor](./media/active-directory-aadconnectsync-change-the-configuration/startmenu.png)

When you open it, you see the default out-of-box rules.

![Sync Rule Editor](./media\active-directory-aadconnectsync-change-the-configuration/SRE.png)

### Navigating in the editor
The drop-downs at the top of the editor allow you to quickly find a particular rule. For example, if you want to see the rules where the attribute proxyAddresses is included, you would change the drop-downs to the following:  
![SRE filtering](./media/active-directory-aadconnectsync-change-the-configuration/filtering.png)  
To reset filtering and load a fresh configuration, press **F5** on the keyboard.

To the top right, you have a button **Add new rule**. This button is used to create your own custom rule.

At the bottom, you have buttons that take an action on a selected sync rule. **Edit** and **Delete** do what you expect them to. **Export** produces a PowerShell script for recreating the sync rule. This allows you to move a sync rule from one server to another.

## Create your first custom rule
The most common change is changes to the attribute flows. The data in your source directory might not be how you want it in Azure AD. In the example in this section, you want to make sure the given name of a user is always in **Proper case**.

### Disable the scheduler
The [scheduler](active-directory-aadconnectsync-feature-scheduler.md) runs every 30 minutes by default. You want to make sure it is not starting while you are making changes and troubleshoot your new rules. To temporarily disable the scheduler, start PowerShell and run `Set-ADSyncScheduler -SyncCycleEnabled $false`

![Disable the scheduler](./media/active-directory-aadconnectsync-change-the-configuration/schedulerdisable.png)  

### Create the rule

1. Click **Add new rule**.
2. On the **Description** page enter the following:  
![Inbound rule filtering](./media/active-directory-aadconnectsync-change-the-configuration/description.png)  
	- Name: Give the rule a descriptive name.
	- Description: Some clarification so someone else can understand what the rule is for.
	- Connected system: The system the object can be found in. In this case, we select the Active Directory Connector.
	- Connected System/Metaverse Object Type: Select **User** and **Person** respectively.
	- Link Type: Change this value to **Join**.
	- Precedence: Provide a value that is unique in the system. A lower numeric value indicates higher precedence.
	- Tag: Leave empty. Only out-of-box rules from Microsoft should have this box populated with a value.
3. On the **Scoping filter** page, enter **givenName ISNOTNULL**.  
![Inbound rule scoping filter](./media/active-directory-aadconnectsync-change-the-configuration/scopingfilter.png)  
This section is used to define which objects the rule should apply to. If left empty, the rule would apply to all user objects. But that would include conference rooms, service accounts, and other non-people user objects.
4. On the **Join rules**, leave it empty.
5. On the **Transformations** page, change the FlowType to **Expression**. Select the Target Attribute **giveName**, and in Source enter `PCase([givenName])`.
![Inbound rule transformations](./media/active-directory-aadconnectsync-change-the-configuration/transformations.png)  
The sync engine is case-sensitive both on the function name and the name of the attribute. If you type something wrong, you see a warning when you add the rule. The editor allows you to save and continue, so you would have to reopen the rule and correct the rule.
6. Click **Add** to save the rule.

Your new custom rule should be visible with the other sync rules in the system.

### Verify the change
With this new change, you want to make sure it is working as expected and is not throwing any errors. Depending on the number of objects you have, there are two different ways to do this step.

1. Run a full sync on all objects
2. Run a preview and full sync on a single object

Start **Synchronization Service** from the start menu. The steps in this section are all in this tool.

1. **Full sync on all objects**  
Select **Connectors** at the top. Identify the Connector you made a change to in the previous section, in this case the Active Directory Domain Services, and select it. Select **Run** from Actions and select **Full Synchronization** and **OK**.
![Full sync](./media/active-directory-aadconnectsync-change-the-configuration/fullsync.png)  
The objects are now updated in the metaverse. You now want to look at the object in the metaverse.

2. **Preview and full sync on a single object**  
Select **Connectors** at the top. Identify the Connector you made a change to in the previous section, in this case the Active Directory Domain Services, and select it. Select **Search Connector Space**. Use scope to find an object you want to use to test the change. Select the object and click **Preview**. In the new screen, select **Commit Preview**.
![Commit preview](./media/active-directory-aadconnectsync-change-the-configuration/commitpreview.png)  
The change is now committed to the metaverse.

**Look at the object in the metaverse**  
You now want to pick a few sample objects to make sure the value is expected and that the rule applied. Select **Metaverse Search** from the top. Add any filter you need to find the relevant objects. From the search result, open an object. Look at the attribute values and also verify in the **Sync Rules** column that the rule applied as expected.  
![Metaverse search](./media/active-directory-aadconnectsync-change-the-configuration/mvsearch.png)  

### Enable the scheduler
If everything is as expected, you can enable the scheduler again. From PowerShell, run `Set-ADSyncScheduler -SyncCycleEnabled $true`.

## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
