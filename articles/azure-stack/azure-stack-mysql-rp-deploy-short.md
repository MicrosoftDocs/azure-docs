<properties
	pageTitle="Use MySQL databases as PaaS on Azure Stack | Microsoft Azure"
	description="Understand the quick steps to deploy the MySQL Resource Provider and provide MySQL as a service on Azure Stack."
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
	ms.date="04/27/2016"
	ms.author="dumagar"/>

# Use MySQL databases as PaaS on Azure Stack
You can deploy a MYSQL Resource Provider on Azure Stack, which lets you create MySQL servers and databases through Azure Resource Manager deployment templates and provide MySQL databases as a service. MySQL databases support many website platforms and are common on the websites scene. After you deploy the resource provider, you can create WordPress websites from the Azure Web Apps PaaS add-on for Azure Stack.

## Quick steps to deploy the resource provider
Use these steps if you're already familiar with Azure Stack. If you want more detail, follow the links in each section or go straight to [Deploy the MySQL Database Resource Provider Adapter on Azure Stack POC](azure-stack-mysql-rp-deploy-long.md).

1.  Make sure you fulfill all [set up steps before you deploy](azure-stack-mysql-rp-deploy-long.md#set-up-steps-before-you-deploy):

	- .NET 3.5 framework already set up in the base Windows Server image (if you downloaded the Azure Stack bits after 2/23/2016, you can skip this step)
    - [Azure-Stack-Compatible PowerShell release](http://aka.ms/azStackPsh)
    - IE security settings configured properly on the ClientVM ([turn off IE enhanced security and enable cookies](azure-stack-mysql-rp-deploy-long.md#Turn-off-IE-enhanced-security-and-enable-cookies))

2. [Download the MySQL RP binaries](http://aka.ms/masmysqlrp) and extract it on the ClientVM in your Azure Stack PoC.

3. [Run the bootstrap.cmd and script](azure-stack-mysql-rp-deploy-long.md#Bootstrap-the-resource-provider-deployment-PowerShell-and-Prepare-for-deployment).

	A set of scripts grouped by two major tabs opens in the PowerShell Integrated Scripting Environment (ISE). Run all the loaded scripts in sequence from left to right in each tab.

4. Run scripts in the “Prepare” tab from left to right to:

	- Create a wildcard certificate to secure communication between the resource provider and Azure Resource Manager.
	- Accept the MySQL EULA terms and download the MySQL binaries
	- Upload the certificates and all other artifacts to an Azure Stack storage account
	- Publish gallery packages to allow deployment MySQL resources through gallery

	> [AZURE.IMPORTANT] If any of the above scripts hangs for no apparent reason after submitting you AAD tenant, your security settings might be blocking one of the DLLs required for the deployment to run. To resolve this, look for the Microsoft.AzureStack.Deployment.Telemetry.Dll in your RP folder, right click it, click **Properties** and check **Unblock** in the "General" tab.

5. Run scripts in the “Deploy” tab from left to right to:

	- [Deploy a VM](azure-stack-mysql-rp-deploy-long.md#Deploy-the-MySQLResource-Provider-VM) that will host both your resource provider and MySQL Servers and databases you will instantiate. This script references a JSON parameter file, which you need to update with some values before you run the script.
	- [Register a local DNS record](azure-stack-mysql-rp-deploy-long.md#Update-the-local-DNS) that will map to your resource provider VM.
	- [Register you resource provider](azure-stack-mysql-rp-deploy-long.md#Register-the-MySQL-RP-Resource-Provider) with the local Azure Resource Manager.

	> [AZURE.IMPORTANT] All scripts assume the base operating system image fulfills the prerequisites (.NET 3.5, Javascript and cookies enabled on the clientVM, and the latest version of Azure PowerShell). If you get errors running the scripts, double-check that you fulfilled the prerequisites.

5. [Test your new MySQL RP](/azure-stack-MySql-rp-deploy-long.md#create-your-first-mysql-database-to=test-your-deployment) by deploying a MySQL database from the Azure Stack portal. Click **Create &gt; Custom &gt; MySQL Server and Database**.

This should get your MySQL Resource Provider up and running in about 25 minutes.
