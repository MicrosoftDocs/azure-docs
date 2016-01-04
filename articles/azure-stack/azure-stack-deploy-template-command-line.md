<properties 
	pageTitle="Deploy templates with the command line" 
	description="Deploy templates with the command line" 
	services="" 
	documentationCenter="" 
	authors="v-anpasi" 
	manager="v-kiwhit" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/04/2016" 
	ms.author="v-anpasi"/>

# Deploy templates with the command line

You can do use the cross-platform command line interface (CLI) to deploy templates from inside the ClientVM or after using the VPN to connect to the Azure Stack POC.

**Note**: On Mac, you may need to disable certificate validation in the terminal using:

	set NODE_TLS_REJECT_UNAUTHORIZED=0
	
	export NODE_TLS_REJECT_UNAUTHORIZED=0


1.  Download the cross-platform CLI from <https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-install/>

2.  Connect to the Azure Stack deployment using the following command to add the Azure Stack environment:

		azure account env add AzureStack --resource-manager-endpoint-url "https://api.azurestack.local" --management-endpoint-url "https://api.azurestack.local" --active-directory-endpoint-url https://login.windows.net --portal-url "https://portal.azurestack.local" --gallery-endpoint-url "https://portal.azurestack.local" --active-directory-resource-id https://azurestack.local-api/ --active-directory-graph-resource-id "https://graph.windows.net/"

3.  Login using the following command (replace username with the username you wish to login to Azure Stack with).

		azure login -e AzureStack -u “<username>”

After logging in, you can use the Azure CLI. At this time, the functionality remains limited. One example use case is deploying a template.

1.  Download [this template](https://github.com/Azure/AzureStack-QuickStart-Templates/blob/master/simple-template-examples/storage-resource-creation/azuredeploy-storageacct.json) file to a folder on the Microsoft Azure Stack POC client.

2.  In that same file, create a JSON file named azuredeploy-storageaccount.paramaters.json and fill it with the following:

		{
		"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
		"contentVersion": "1.0.0.0",
		"parameters": {
		    "newStorageAccountName": {
		      "value": "mystor001"
		    }
		  }
		}


3.  In the command line, navigate to the folder where the two files are located.

4.  Run the following command to deploy the template:

		Azure group create "cliRG" "local" -f azuredeploy-storageacct.json -d "testDeploy" -e azuredeploy-storageaccount.paramaters.json

	This deploys the template to the resource group **cliRG** in the **local** location that is the default location of the POC.

5.  To see this resource group and storage account, use the following commands:

		azure group list

		azure storage account list
