<properties
	pageTitle="Deploy MySQL on Azure Stack"
	description="Deploy MySQL on Azure Stack"
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
	ms.date="02/08/2016"
	ms.author="dumagar"/>

# Using MySQL Databases as PaaS on Azure Stack
MySQL databases support common website platforms as is a common technology used on the websites scene. You can deploy the MySQL Resource Provider to instantiate MySQL servers and databases through Azure Resource Manager deployment templates, as well as deploy WordPress websites from the Azure Web Apps PaaS add on for Azure Stack.


To deploy a MySQL resource provider, you will:

1.  Make sure you comply with all the [prerequisites](/azure-stack-mysql-rp-deploy-long.md#Prerequisites---Before-you-deploy) for RP deployment:

    - .Net 3.5 framework already setup in base image Windows Server image
    - [Azure-Stack-Compatible](http://aka.ms/azStackPsh) PowerShell release
    - IE security settings configured properly on ClientVM

2. [Download the MySQL RP binaries](http://aka.ms/masmysqlrp) and extract it on the ClientVM in your Azure Stack PoC.

3. [Run the bootstrap.cmd and script](azure-stack-mysql-rp-deploy-long.md#Bootstrap-the-resource-provider-deployment-PowerShell-and-Prepare-for-deployment) - A set of scripts grouped by tabs will open in PowerShell Integrated Scripting Environment (ISE).

4. Run all the loaded scripts in sequence from left to right in each tab. The scripts will:
    - In the “Prepare” tab:
        - Create a wildcard certificate to secure communication between the resource provider and Azure Resource Manager.
        - Accept the MySQL EULA terms and download the MySQL binaries 
        - Upload the certificates and all other artifacts to an Azure Stack storage account
        - Publish gallery packages to allow deployment MySQL resources through gallery
    - In the “Deploy” tab:
        - [Deploy a VM](/azure-stack-mysql-rp-deploy-long.md#Deploy-your-SQL-RP-Resource-Provider-VM) that will host both your resource provider and SQL Server instance *

        - [Register a local DNS record](/azure-stack-mysql-rp-deploy-long.md#Update-the-local-DNS) that will map to your resource provider VM
        - [Register you resource provider](/azure-stack-mysql-rp-deploy-long.md#Register-the-MySQL-RP-Resource-Provider) with the local Azure Resource Manager

>\*This script has a separate parameter file with passwords etc. which
must be complete before running.

>\*\*All scripts assume the base operating system image has .Net 3.5
preinstalled, that the clientVM has JavaScript and cookies enabled, and
that you are using the latest Azure PowerShell.


5\. [Test your new MySQL RP](/azure-stack-MySql-rp-deploy-long.md#test-your-deployment-create-your-first-sql-database) by deploying a SQL database from the Azure Stack portal:
**Create &gt; Custom &gt; MySQL Server Database**

This should get your MySQL Resource Provider up and running in about 45 minutes (depending on your hardware). If you wish to know more
about each step, go to the [detailed MySQL Server RP deployment instructions](/azure-stack-MySql-rp-deploy-long.md#Instructions-for-deploying)

<span id="before-you-deploy" class="anchor"><span
id="_Prerequisites_-_Before" class="anchor"><span
id="_Instructions_for_deploying" class="anchor"></span></span></span>

