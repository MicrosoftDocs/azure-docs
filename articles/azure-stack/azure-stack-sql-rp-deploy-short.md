<properties
	pageTitle="Add a SQL Server resource provider to Azure Stack"
	description="Add a SQL Server resource provider to Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="Dumagar"
	manager="bradleyb"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/31/2016"
	ms.author="dumagar"/>
	
#Using SQL Databases on Azure Stack


Because Azure Stack is still in beta, the SQL Server Resource Provider
adaptor provides the majority of Azure SQL DB functionalities. The SQL
Server Resource Provider adaptor lets you use any SQL Server-based
workload and expose it as a service so that SQL server databases can be
used when you deploy cloud native apps as well as SQL-based websites on
Azure Stack. This article will teach you how to quickly setup your SQL
Server Resource Provider on your Azure Stack proof of concept (PoC).

To deploy a SQL Server resource provider, you will:

1.  Make sure you comply with all the [prerequisites](/azure-stack-sql-rp-long.md#Prerequisites---Before-you-deploy) for RP deployment:

    - .Net 3.5 framework already setup in base image Windows Server image
    - [Azure-Stack-Compatible](http://aka.ms/azStackPsh) PowerShell release
    - IE security settings configured properly on ClientVM

2. [Download the SQL Server RP binaries](http://download.microsoft.com/download/A/3/6/A36BCD4A-8040-44B7-8378-866FA7D1C4D2/AzureStack.Sql.5.11.69.0.zip) and extract it on the ClientVM in your Azure Stack PoC.

3. [Run the bootstrap.cmd and script](/azure-stack-sql-rp-long.md#Bootstrap-the-resource-provider-deployment-PowerShell-and-Prepare-for-deployment) - A set of scripts grouped by tabs will open in PowerShell Integrated Scripting Environment (ISE).

4. Run all the loaded scripts in sequence from left to right in each tab. The scripts will:
    - In the “Prepare” tab:
        - Create a wildcard certificate to secure communication between the resource provider and Azure Resource Manager.
        - Upload the certificates and all other artifacts to an Azure Stack storage account
        - Publish gallery packages to allow deployment SQL and resources through gallery
    - In the “Deploy” tab:
        - [Deploy a VM](/azure-stack-sql-rp-long.md#Deploy-your-SQL-RP-Resource-Provider-VM) that will host both your resource provider and SQL Server instance *

        - [Register a local DNS record](/azure-stack-sql-rp-long.md#Update-the-local-DNS) that will map to your resource provider VM
        - [Register you resource provider](/azure-stack-sql-rp-long.md#Register-the-SQL-RP-Resource-Provider) with the local Azure Resource Manager

>\*This script has a separate parameter file with passwords etc. which
must be complete before running.

>\*\*All scripts assume the base operating system image has .Net 3.5
preinstalled, that the clientVM has JavaScript and cookies enabled, and
that you are using the latest Azure PowerShell.

5\. [Connect your resource provider to a SQL Server](#connec5-long-doc)
    instance in the admin Azure Stack portal:

**Browse** &gt; **Resource** **Providers** &gt; **SQLRP** &gt; **Go to Resource Provider** **Management** &gt; **Servers** &gt; **Add**

Use “sa” for username and the password you used when deploying the resource provider VM.

6\. [Test your new SQL Server RP](#test-your-deployment-create-your-first-sql-database) by deploying a SQL database from the Azure Stack portal:
**Create &gt; Custom &gt; SQL Server Database**

This should get your SQL Server Resource Provider up and running in
about 45 minutes (depending on your hardware). If you wish to know more
about each step, go to the [detailed SQL Server RP deployment
instructions](#_Instructions_for_deploying)

<span id="before-you-deploy" class="anchor"><span
id="_Prerequisites_-_Before" class="anchor"><span
id="_Instructions_for_deploying" class="anchor"></span></span></span>
