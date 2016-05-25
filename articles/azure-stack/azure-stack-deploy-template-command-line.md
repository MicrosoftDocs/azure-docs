<properties
	pageTitle="Deploy templates with the command line in Azure Stack | Microsoft Azure"
	description="Learn how to use the cross-platform command line interface (CLI) to deploy templates from inside the ClientVM or after using the VPN to connect to Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/25/2016"
	ms.author="erikje"/>

# Deploy templates in Azure Stack using the command line

Use the command line to deploy Azure Resource Manager templates to the Azure Stack POC.

ARM templates deploy and provision all of the resources for your application in a single, coordinated operation.



1.   Quickly install the Azure Command-Line Interface (Azure CLI) to use a set of open-source shell-based commands for creating and managing resources in Microsoft Azure Stack.

  	[Download the Windows CLI](http://aka.ms/azstack-windows-cli)

  	[Download the Mac CLI](http://aka.ms/azstack-linux-cli)

  	[Download the Linux CLI](http://aka.ms/azstack-mac-cli)


  	If you’re on a Mac or Linux machine, you can also get the CLI by using the command `npm install -g azure-cli@0.9.11`</br>



2.  Use the following command to add the Azure Stack environment:

		azure account env add AzureStack --resource-manager-endpoint-url "https://api.azurestack.local" --management-endpoint-url "https://api.azurestack.local" --active-directory-endpoint-url  "https://login.windows.net" --portal-url "https://portal.azurestack.local" --gallery-endpoint-url "https://portal.azurestack.local" --active-directory-resource-id "https://azurestack.local-api/" --active-directory-graph-resource-id "https://graph.windows.net/"

3.  Log in using the following command (replace *username* with your username).

		azure login -e AzureStack -u “<username>”
  
	If you're getting certificate validation issues, disable certificate validation by running the command `set 		NODE_TLS_REJECT_UNAUTHORIZED=0`

4. Set the Azure configuration mode to ARM by using the following command.

        azure config mode arm
        
5. Now, to test a deployment with the CLI, download the files azuredeploy.json and azuredeploy.parameters.json from the [create storage account example template](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/101-create-storage-account).

6. Navigate to the folder where these files were downloaded and run the following command to deploy the template:
		
		azure group create "cliRG" "local" –f azuredeploy.json –d "testDeploy" –e azuredeploy.parameters.json
	
	This deploys the template to the resource group cliRG in the Azure Stack POC’s default location.	

7.  To see this resource group and storage account, use the following commands:

		azure group list

		azure storage account list

## Next steps

[Manage user permissions](azure-stack-manage-permissions.md)
