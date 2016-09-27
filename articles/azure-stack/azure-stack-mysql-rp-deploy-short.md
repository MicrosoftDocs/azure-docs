<properties
	pageTitle="Use MySQL databases as PaaS on Azure Stack | Microsoft Azure"
	description="Understand the quick steps to deploy the MySQL resource provider and provide MySQL as a service on Azure Stack."
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
You can deploy a MySQL resource provider on Azure Stack. After you deploy the resource provider, you can create MySQL servers and databases through Azure Resource Manager deployment templates and provide MySQL databases as a service. MySQL databases, which are common on web sites, support many website platforms. After you deploy the resource provider, you can create WordPress websites from the Azure Web Apps platform as a service (PaaS) add-on for Azure Stack.

## Quick steps to deploy the resource provider
Use these steps if you're already familiar with Azure Stack. If you want more details, follow the links in each section or go straight to [Deploy the MySQL Database Resource Provider Adapter on Azure Stack POC](azure-stack-mysql-rp-deploy-long.md).

1.  Make sure that you [complete all set up steps](azure-stack-mysql-rp-deploy-long.md#set-up-steps-before-you-deploy) before you deploy the resource provider:

	- .NET 3.5 framework is already set up in the base Windows Server image. (If you downloaded the Azure Stack bits after February, 23, 2016, you can skip this step.)
    - [A release of Azure PowerShell that's compatible with Azure Stack is installed](http://aka.ms/azStackPsh).
    - In Internet Explorer security settings on the ClientVM,  [Internet Explorer enhanced security is turned off and cookies are enabled](azure-stack-mysql-rp-deploy-long.md#Turn-off-IE-enhanced-security-and-enable-cookies).

2. [Download the MySQL resource provider binaries file](http://aka.ms/masmysqlrp) and extract it on the ClientVM in your Azure Stack proof of concept (PoC).

3. [Run bootstrap.cmd and the scripts](azure-stack-mysql-rp-deploy-long.md#Bootstrap-the-resource-provider-deployment-PowerShell-and-Prepare-for-deployment).

	A set of scripts that is grouped by two major tabs opens in the PowerShell Integrated Scripting Environment (ISE). Run all the loaded scripts in sequence from left to right in each tab.

	1. Run scripts in the **Prepare** tab from left to right to:

		- Create a wildcard certificate to secure communication between the resource provider and Azure Resource Manager.
		- Accept the MySQL EULA terms and download the MySQL binaries.
		- Upload the certificates and all other artifacts to an Azure Stack storage account.
		- Publish gallery packages so that you can deploy MySQL resources through the gallery.

		> [AZURE.IMPORTANT] If any of the scripts hang for no apparent reason after you submit your Azure Active Directory tenant, your security settings might be blocking a DLL that's required for the deployment to run. To resolve this issue, look for the Microsoft.AzureStack.Deployment.Telemetry.Dll in your resource provider folder, right click it, click **Properties**, and then check **Unblock** in the **General** tab.

	2. Run scripts in the **Deploy** tab from left to right to:

		- [Deploy a virtual machine  (VM)](azure-stack-mysql-rp-deploy-long.md#Deploy-the-MySQLResource-Provider-VM) that will host both your resource provider, MySQL servers and databases that you will instantiate. This script references a JSON parameter file, which you need to update with some values before you run the script.
		- [Register a local DNS record](azure-stack-mysql-rp-deploy-long.md#Update-the-local-DNS) that will map to your resource provider VM.
		- [Register your resource provider](azure-stack-mysql-rp-deploy-long.md#Register-the-MySQL-RP-Resource-Provider) with the local Azure Resource Manager.

		> [AZURE.IMPORTANT] All scripts assume that the base operating system image fulfills the prerequisites (.NET 3.5 installed, JavaScript and cookies enabled on the ClientVM, and the latest version of Azure PowerShell installed). If you get errors when you run the scripts, double-check that you fulfilled the prerequisites.

5. To [test your new MySQL resource provider](/azure-stack-MySql-rp-deploy-long.md#create-your-first-mysql-database-to=test-your-deployment), deploy a MySQL database from the Azure Stack portal. Click **Create** &gt; **Custom** &gt; **MySQL Server and Database**.

This should get your MySQL resource provider up and running in about 25 minutes.
