<properties
	pageTitle="Connect to Azure Stack CLI | Microsoft Azure"
	description="Learn how to use the cross-platform command-line interface (CLI) to manage and deploy resources on Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="HeathL17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/26/2016"
	ms.author="helaw"/>

# Install and configure Azure CLI

In this document, we guide you through the process of using the Azure command-line interface (CLI) to manage resources on Windows, Linux, and Mac client platforms.  

## Install Azure CLI
Quickly install the Azure CLI to use a set of open-source, shell-based commands for creating and managing resources in Microsoft Azure Stack.

[Download the Windows CLI](http://aka.ms/azstack-windows-cli)

[Download the Mac CLI](http://aka.ms/azstack-linux-cli)

[Download the Linux CLI](http://aka.ms/azstack-mac-cli)


  If you’re on Mac or Linux, you can also get the CLI by using the following command:
  
    `npm install -g azure-cli@0.10.4`.


## Connect to Azure Stack
In the following steps, you configure Azure CLI to connect to Azure Stack. Then you sign in and retrieve subscription information.

1.  Retrieve the value for active-directory-resource-id by executing this PowerShell:
        
          (Invoke-RestMethod -Uri https://api.azurestack.local/metadata/endpoints?api-version=1.0 -Method Get).authentication.audiences[0]

2.  Use the following CLI command to add the Azure Stack environment, making sure to update *--active-directory-resource-id* with the data URL retrieved above:

           azure account env add AzureStack --resource-manager-endpoint-url "https://api.azurestack.local" --management-endpoint-url "https://api.azurestack.local" --active-directory-endpoint-url  "https://login.windows.net" --portal-url "https://portal.azurestack.local" --gallery-endpoint-url "https://portal.azurestack.local" --active-directory-resource-id "https://azurestack.local-api/" --active-directory-graph-resource-id "https://graph.windows.net/"

3.  Sign in by using the following command (replace *username* with your user name):

		azure login -e AzureStack -u “<username>”

	>[AZURE.NOTE]If you're getting certificate validation issues, disable certificate validation by running the command `set 		NODE_TLS_REJECT_UNAUTHORIZED=0`.

4.  Set the Azure configuration mode to Azure Resource Manager by using the following command:

        azure config mode arm

5.  Retrieve a list of subscriptions.

        azure account list     

## Next steps

[Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)

[Connect with PowerShell](azure-stack-connect-powershell.md)

[Manage user permissions](azure-stack-manage-permissions.md)
