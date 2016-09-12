<properties
	pageTitle="Connect to Azure Stack CLI | Microsoft Azure"
	description="Learn how to use the cross-platform command line interface (CLI) to manage and deploy resources on Azure Stack"
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

# Install and Configure Azure CLI

In this document, we guide you through using Azure CLI to manage resources across Windows, Linux, and Mac client platforms.  

## Install Azure CLI
Quickly install the Azure Command-Line Interface (Azure CLI) to use a set of open-source shell-based commands for creating and managing resources in Microsoft Azure Stack.

  	[Download the Windows CLI](http://aka.ms/azstack-windows-cli)

  	[Download the Mac CLI](http://aka.ms/azstack-linux-cli)

  	[Download the Linux CLI](http://aka.ms/azstack-mac-cli)


  	If you’re on Mac or Linux, you can also get the CLI by using the command `npm install -g azure-cli@0.10.4`</br>


## Connect to Azure Stack
In the following steps, you configure Azure CLI to connect to Azure Stack, login, and retrieve subscription information.

1.  Use the following command to add the Azure Stack environment:

		azure account env add AzureStack --resource-manager-endpoint-url "https://api.azurestack.local" --management-endpoint-url "https://api.azurestack.local" --active-directory-endpoint-url  "https://login.windows.net" --portal-url "https://portal.azurestack.local" --gallery-endpoint-url "https://portal.azurestack.local" --active-directory-resource-id "https://azurestack.local-api/" --active-directory-graph-resource-id "https://graph.windows.net/"

2.  Log in using the following command (replace *username* with your username).

		azure login -e AzureStack -u “<username>”
  
	>[AZURE.NOTE]If you're getting certificate validation issues, disable certificate validation by running the command `set 		NODE_TLS_REJECT_UNAUTHORIZED=0`

3. Set the Azure configuration mode to ARM by using the following command.

        azure config mode arm

4. Retrieve a list of subscriptions.

        azure account list     

## Next steps

[Manage user permissions](azure-stack-manage-permissions.md)
