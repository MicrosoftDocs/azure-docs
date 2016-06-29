<properties
   pageTitle="Azure AD Connect sync: Operational tasks and considerations | Microsoft Azure"
   description="This topic describes operational tasks for Azure AD Connect sync and how to prepare for operating this component."
   services="active-directory"
   documentationCenter=""
   authors="AndKjell"
   manager="StevenPo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="06/27/2016"
   ms.author="andkjell"/>

# Azure AD Connect sync: Operational tasks and consideration
The objective of this topic is to describe operation tasks for Azure AD Connect sync.

## Staging mode
Staging mode can be used for several scenarios, including:

-	High availability.
-	Test and deploy new configuration changes.
-	Introduce a new server and decommission the old.

With a server in staging mode you can make changes to the configuration and preview the changes before you make the server active. It also allows you to run full import and full synchronization to verify that all changes are expected before you make these into your production environment.

During installation you can select the server to be in **staging mode**. This will make the server active for import and synchronization, but it will not do any exports. A server in staging mode will not run password sync or enable password writeback even if you select these features. When you disable staging mode, the server will start exporting and enable password sync and password writeback (if enabled).

You can still force an export by using the synchronization service manager.

A server in staging mode will continue to receive changes from Active Directory and Azure AD. It will always have a copy of the latest changes and can very fast take over the responsibilities of another server. If you make configuration changes to your primary server, it is your responsibility to make the same changes to the server(s) in staging mode.

For those of you with knowledge of older sync technologies, the staging mode is different since the server has its own SQL database. This allows the staging mode server to be located in a different datacenter.

### Verify the configuration of a server
To apply this method, follow these steps:

1. Prepare
2. Import and Synchronize
3. Verify
4. Switch active server

**Prepare**

1. Install Azure AD Connect, select **staging mode**, and unselect **start synchronization** on the last page in the installation wizard. This will allow us to run the sync engine manually.
![ReadyToConfigure](./media/active-directory-aadconnectsync-operations/readytoconfigure.png)
2. Sign off/sign in and from the start menu select **Synchronization Service**.

**Import and Synchronize**

1. Select **Connectors**, and select the first Connector with the type **Active Directory Domain Services**. Click on **Run**, select **Full import**, and **OK**. Do this for all Connectors of this type.
2. Select the Connector with type **Azure Active Directory (Microsoft)**. Click on **Run**, select **Full import**, and **OK**.
3. Make sure Connectors is still selected and for each Connector with type **Active Directory Domain Services**, click **Run**, select **Delta Synchronization**, and **OK**.
4. Select the Connector with type **Azure Active Directory (Microsoft)**. Click **Run**, select **Delta Synchronization**, and then OK.

You have now staged export changes to Azure AD and on-premises AD (if you are using Exchange hybrid deployment). The next steps allow you to inspect what is about to change before you actually start the export to the directories.

**Verify**

1. Start a cmd prompt and go to `%ProgramFiles%\Microsoft Azure AD Sync\bin`
2. Run: `csexport "Name of Connector" %temp%\export.xml /f:x`  
The name of the Connector can be found in Synchronization Service. It will have a name similar to "contoso.com – AAD" for Azure AD.
3. Run: `CSExportAnalyzer %temp%\export.xml > %temp%\export.csv`
4. You now have a file in %temp% named export.csv that can be examined in Microsoft Excel. This file contains all changes which are about to be exported.
5. Make necessary changes to the data or configuration and run these steps again (Import and Synchronize and Verify) until the changes which are about to be exported are expected.

**Understanding the export.csv file**

Most of the file is self-explanatory. Some abbreviations to understand the content:

- OMODT – Object Modification Type. Indicates if the operation at an object level is an Add, Update, or Delete.
- AMODT – Attribute Modification Type. Indicates if the operation at an attribute level is an Add, Update, or delete.

If the attribute value is multi-valued then not every change is displayed. Only the number of values added and removed will be visible.

**Switch active server**

1. On the currently active server either turn off the server (DirSync/FIM/Azure AD Sync) so it is not exporting to Azure AD or set it in staging mode (Azure AD Connect).
2. Run the installation wizard on the server in **staging mode** and disable **staging mode**.
![ReadyToConfigure](./media/active-directory-aadconnectsync-operations/additionaltasks.png)

## Disaster recovery
Part of the implementation design is to plan for what to do in case of a disaster where you lose the sync server. There are different models to use and which one to use will depend on several factors including:

-	What is your tolerance for not being able make changes to objects in Azure AD during the downtime?
-	If you use password synchronization, will the users accept that they have to use the old password in Azure AD in case they change it on-premises?
-	Do you have a dependency on real-time operations, such as password writeback?

Depending on the answers to these questions and your organization’s policy one of the following strategies can be implemented:

-	Rebuild when needed.
-	Have a spare standby server, known as **staging mode**.
-	Use virtual machines.

Since Azure AD Connect sync has a dependency on a SQL database, you should also review the SQL High Availability section if you do not use SQL Express, which is included with Azure AD Connect.

### Rebuild when needed
A viable strategy is to plan for a server rebuild when needed. In many cases installing the sync engine and do the initial import and sync can be completed within a few hours. If there isn’t a spare server available, it is possible to temporarily use a domain controller to host the sync engine.

The sync engine server does not store any state about the objects so the database can be rebuilt from the data in Active Directory and Azure AD. The **sourceAnchor** attribute is used to join the objects from on-premises and the cloud. If you rebuild the server with existing objects on-premises and the cloud, then the sync engine will on reinstallation match those together again.
The things you need to document and save are the configuration changes made to the server, such as filtering and synchronization rules. These must be re-applied before you start synchronizing.

### Have a spare standby server - staging mode
If you have a more complex environment, then having one or more standby servers is recommended. During installation you can enable a server to be in **staging mode**.

For more details, see [staging mode](#staging-mode).

### Use virtual machines
A common and supported method is to run the sync engine in a virtual machine. In case the host has an issue, the image with the sync engine server can be migrated to another server.

### SQL High Availability
When not using the SQL Server Express which comes with Azure AD Connect, the high availability for SQL Server should also be considered. The only high availability solution supported is SQL clustering. Unsupported solutions include mirroring and Always On.

## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
