<properties 
	pageTitle="Deploy Azure Resources Using the Compute, Network, and Storage .NET Libraries" 
	description="Learn to use some of the available clients in the Compute, Storage, and Network .NET libraries to create and delete resources in Microsoft Azure" 
	services="multiple" 
	documentationCenter="" 
	authors="davidmu1" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="multiple" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="davidmu"/>

#Deploy Azure Resources Using the Compute, Network, and Storage .NET Libraries

This tutorial shows you how to use some of the available clients in the Compute, Storage, and Network .NET libraries to create and delete resources in Microsoft Azure. It also shows you how to authenticate the requests to Azure Resource Manager by using Azure Active Directory.

[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

To complete this tutorial you also need:

- [Visual Studio](http://msdn.microsoft.com/en-us/library/dd831853.aspx)
- [Azure storage account](http://azure.microsoft.com/en-us/documentation/articles/storage-create-storage-account/)
- [Windows Management Framework 3.0](http://www.microsoft.com/en-us/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/en-us/download/details.aspx?id=40855)
- [Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/)

It takes about 30 minutes to do these steps.

## Step 1: Add an application to Azure AD and set permissions

To use Azure AD to authenticate requests to Azure Resource Manager, an application must be added to the Default Directory. Do the following to add an application:

1. Open an Azure PowerShell command prompt, and then run this command:

        Switch-AzureMode –Name AzureResourceManager

2. Set the Azure account that you want to use for this tutorial. Run this command and enter the credentials for your subscription when prompted:

	    Add-AzureAccount

3. Replace {password} in the following command with the one that you want to use and then run it to create the application:

	    New-AzureADApplication -DisplayName "My AD Application 1" -HomePage "https://myapp1.com" -IdentifierUris "https://myapp1.com"  -Password "{password}"

4. Record the value that is returned for ApplicationId in the response from the previous step. You will need it later in this tutorial:

	![Create an AD application](./media/virtual-machines-arm-deployment/azureapplicationid.png)

	>[AZURE.NOTE] You can also find the application identifier in the client id field of the application in the Azure portal.	

5. Replace {application-id} with the identifier that you just recorded and then create the service principal for the application:

        New-AzureADServicePrincipal -ApplicationId {application-id} 

6. Set the permission to use the application:

	    New-AzureRoleAssignment -RoleDefinitionName Owner -ServicePrincipalName "https://myapp1.com"

the Management Portal before you delete them.