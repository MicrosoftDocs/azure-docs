<properties
	pageTitle="Using SQL databases on Azure Stack | Microsoft Azure"
	description="Learn how you can deploy SQL databases as a service on Azure Stack and the quick steps to deploy the SQL Server resource provider adapter."
	services="azure-stack"
	documentationCenter=""
	authors="Dumagar"
	manager="byronr"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/27/2016"
	ms.author="dumagar"/>

# Use SQL databases on Azure Stack

Use the SQL Server resource provider adapter to expose SQL databases as a service of Azure Stack. After you install the resource provider, you and your users can create databases for cloud-native apps, website that are based on SQL, and workloads that are based on SQL without having to provision a virtual machine (VM) that hosts SQL Server each time.

Because the resource provider doesn't have all the capabilities of Azure SQL Database during the proof of concept (PoC), this article begins with an overview of the resource provider architecture. Then you get a quick overview of the steps to set up the resource provider, with links to the more detailed steps in [Deploy the SQL Database resource provider adapter on Azure Stack POC](azure-stack-sql-rp-deploy-long.md).

## SQL Server resource provider adapter architecture
The resource provider doesn't offer all the database management capabilities of Azure SQL Database. For example, elastic database pools and the ability to dial database performance up and down on the fly aren't available. However, the resource provider does support the same create, read, update, and delete (CRUD) operations that available in Azure SQL Database.

The resource provider is made up of three components:

- **The SQL resource provider adapter VM**, which encompasses the resource provider process and the servers that host SQL Server.
- **The resource provider itself**, which processes provisioning requests and exposes database resources.
- **Servers that host SQL Server**, which provide capacity for databases.

The following conceptual diagram shows these components and the steps that you go through when you deploy the resource provider, set up a server that hosts SQL Server, and then create a database.

![Azure Stack SQL resource provider adapter simple architecture](./media/azure-stack-sql-rp-deploy-short/sqlrparch.png)

## Quick steps to deploy the resource provider
Use these steps if you're already familiar with Azure Stack. If you want more details, follow the links in each section or go straight to [Deploy the SQL Database resource provider adapter on Azure Stack POC](azure-stack-sql-rp-deploy-long.md).

1.  Make sure you complete all [set up steps before you deploy](azure-stack-sql-rp-deploy-long.md#set-up-steps-before-you-deploy) the resource provider:

  - .NET 3.5 framework is already set up in the base Windows Server image. (If you downloaded the Azure Stack bits after February  23, 2016, you can skip this step.)
  - [A release of Azure PowerShell that's compatible with Azure Stack is installed](http://aka.ms/azStackPsh).
  - In Internet Explorer security settings on the ClientVM, [Internet Explorer enhanced security is turned off and cookies are enabled](azure-stack-sql-rp-deploy-long.md#Turn-off-IE-enhanced-security-and-enable-cookies).

2. [Download the SQL Server RP binaries file](http://aka.ms/massqlrprfrsh) and extract it to the ClientVM in your Azure Stack POC.

3. [Run bootstrap.cmd and scripts](azure-stack-sql-rp-deploy-long.md#Bootstrap-the-resource-provider-deployment-PowerShell-and-Prepare-for-deployment).

	A set of scripts is grouped by two major tabs open in the PowerShell Integrated Scripting Environment (ISE). Run all the loaded scripts in sequence from left to right in each tab.

	1. Run scripts in the **Prepare** tab from left to right to:

		- Create a wildcard certificate to secure communication between the resource provider and Azure Resource Manager.
		- Upload the certificates and all other artifacts to a storage account for Azure Stack.
		- Publish gallery packages so that you can deploy SQL and resources through the gallery.

		> [AZURE.IMPORTANT] If any of the scripts hangs for no apparent reason after you submit your Azure Active Directory tenant, your security settings might be blocking a DLL that's required for the deployment to run. To resolve this issue, look for the Microsoft.AzureStack.Deployment.Telemetry.Dll in your resource provider folder, right-click it, click **Properties**, and then check **Unblock** in the **General** tab.

	1. Run scripts in the **Deploy** tab from left to right to:

		- [Deploy a VM](azure-stack-sql-rp-deploy-long.md#Deploy-the-SQL-Server-Resource-Provider-VM) that hosts both your resource provider and SQL Server. This script references a JSON parameter file, which you need to update with some values before you run the script.
		- [Register a local DNS record](azure-stack-sql-rp-deploy-long.md#Update-the-local-DNS) that maps to your resource provider VM.
		- [Register your resource provider](azure-stack-sql-rp-deploy-long.md#Register-the-SQL-RP-Resource-Provider) with the local Azure Resource Manager.

		> [AZURE.IMPORTANT] All scripts assume that the base operating system image fulfills the prerequisites (.NET 3.5 installed, JavaScript and cookies enabled on the ClientVM, and a compatible version of Azure PowerShell installed). If you get errors when you run the scripts, double-check that you fulfilled the prerequisites.

6. [Connect the resource provider to a server that's hosting SQL Server](#Provide-capacity-to-your-SQL-Resource-Provider-by-connecting-it-to-a-hosting-SQL-server) in the Azure Stack portal. Click **Browse** &gt; **Resource Providers** &gt; **SQLRP** &gt; **Go to Resource Provider Management** &gt; **Servers** &gt; **Add**.

	Use “sa” for username and the password that you used when you deployed the resource provider VM.

7. To [Test your new SQL Server resource provider](/azure-stack-sql-rp-deploy-long.md#create-your-first-sql-database-to-test-your-deployment), deploy a SQL database in the Azure Stack portal. Click **Create** &gt; **Custom** &gt; **SQL Server Database**.

This should get your SQL Server resource provider up and running in about 45 minutes (depending on your hardware).
