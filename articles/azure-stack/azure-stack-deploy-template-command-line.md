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
	ms.date="01/29/2016"
	ms.author="erikje"/>

# Deploy templates in Azure Stack using the command line

Use the command line to deploy Azure Resource Manager templates to the Azure Stack POC.

ARM templates deploy and provision all of the resources for your application in a single, coordinated operation.

On a Mac, you might need to disable certificate validation in the terminal using:
>
>	`set NODE_TLS_REJECT_UNAUTHORIZED=0`
>
>	`export NODE_TLS_REJECT_UNAUTHORIZED=0`


1.  Download the cross-platform CLI from <https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-install/>

2.  Use the following command to add the Azure Stack environment:

		azure account env add AzureStack --resource-manager-endpoint-url "https://api.azurestack.local" --management-endpoint-url "https://api.azurestack.local" --active-directory-endpoint-url https://login.windows.net --portal-url "https://portal.azurestack.local" --gallery-endpoint-url "https://portal.azurestack.local" --active-directory-resource-id https://azurestack.local-api/ --active-directory-graph-resource-id "https://graph.windows.net/"

3.  Log in using the following command (replace *username* with your username).

		azure login -e AzureStack -u “<username>”

4. Set the Azure configuration mode to ARM by using the following command.

        azure config mode arm

5. Download [this example template](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/simple-template-examples/storage-resource-creation/azuredeploy-storageacct.json) file to a folder on the Microsoft Azure Stack POC client.

6.  In that same folder, create a JSON file containing the following script. Save the file as azuredeploy-storageaccount.paramaters.json.

		{
		"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
		"contentVersion": "1.0.0.0",
		"parameters": {
		    "newStorageAccountName": {
		      "value": "mystor001"
		    }
		  }
		}


7.  In the command line, navigate to the folder where the two files are located.

8.  Run the following command to deploy the template:

		Azure group create "cliRG" "local" -f azuredeploy-storageacct.json -d "testDeploy" -e azuredeploy-storageaccount.paramaters.json

	This deploys the template to the resource group **cliRG** in the Azure Stack POC's default location.

9.  To see this resource group and storage account, use the following commands:

		azure group list

		azure storage account list

## Next steps

[Manage user permissions](azure-stack-manage-permissions.md)
