<properties
	pageTitle="Manage DocumentDB using ARM templates and PowerShell | Microsoft Azure"
	description="Manage DocumentDB using Azure Resource Manager, templates, and PowerShell."
	services="documentdb"
	documentationCenter=""
	authors="mimig1"
	manager="jhubbard"
	editor=""
/>

<tags
	ms.service="documentdb"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/24/2015"
	ms.author="mimig"/>

# Manage DocumentDB using Azure Resource Manager templates and PowerShell

> [AZURE.SELECTOR]
- [Portal](documentdb-create-account.md)
- [CLI](documentdb-deploy-rmtemplates-powershell.md)
- [PowerShell](documentdb-deploy-rmtemplates-powershell.md)

Using Azure PowerShell and Resource Manager templates provides you with a lot of power and flexibility when managing resources in Microsoft Azure. You can use the tasks in this article to create and manage DocumentDB resources.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article covers managing resources with the Resource Manager deployment model. You can also manage resources with the [classic deployment model](virtual-machines-windows-tutorial-classic-portal.md).

These tasks use a Resource Manager template and PowerShell:

- [Create a DocumentDB account using a template and PowerShell commands](#create-account-commands)
- [Create a DocumentDB account using a template and a PowerShell script](#create-account-script)

This task only uses PowerShell: 

- [Delete an account](#delete-account)

<!--- To include later:
- [Change the default consistency of an account](#change-consistency)
- [Rotate keys](#rotate-keys)
-->

Before you get started, make sure you have Azure PowerShell ready to go.

[AZURE.INCLUDE [arm-getting-setup-powershell](../../includes/arm-getting-setup-powershell.md)]



## Azure Resource Manager templates and resource groups

Some of the tasks in this article show you how to use Azure Resource Manager templates and PowerShell to automatically deploy and manage Azure DocumentDB.

Most applications running in Microsoft Azure are built from a combination of different cloud resource types, such as one or more databases, storage accounts, or a virtual network. Azure Resource Manager templates make it possible for you to manage these different resources together by using a JSON description of the resources and associated configuration and deployment parameters.

After you define a JSON-based resource template, you can use it with a PowerShell command to deploy the defined resources in Azure. You can run these commands either separately in the PowerShell command shell, or you can integrate them with a script that contains additional automation logic.

The resources you create using Azure Resource Manager templates are deployed to either a new or existing *Azure resource group*. A resource group allows you to manage multiple deployed resources together as a logical group; this means that you to manage the overall lifecycle of the group/application.

If you're interested in authoring templates, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).

## <a id="create-account"></a>Task: Create a DocumentDB account using Powershell commands

To create a DocumentDB account, you'll need a resource group if you don't already have one, then you'll create the DocumentDB account.

To create the resource group, in the following command, replace *resource group name* with the name of the new resource group and *Azure location* with the Azure datacenter location where you want the resource to be located, and then run it:

	New-AzureResourceGroup -Name "Resource group name" -Location "Azure location"

For example: 

	New-AzureResourceGroup -Name DocumentDBResourceGroup -Location westus

Next, to create the DocumentDB account, in the following command, replace  the following values and run it: 

- <Resource group name\> with the name of the existing resource group. 
- <Deployment name\> with the name that you want to use for the deployment.
- <Location name\> with the location in which to provision the account, valid options include: 
- <New account name> with the unique name of the new account to create. Note that the template does not validate that the DocumentDB account name is a) valid and b) available. It is highly recommended that you verify the availability of the names you plan to supply prior to running the PowerShell commands.

    New-AzureResourceGroupDeployment -Name <Deployment name> -ResourceGroupName <Resource group name created above> -Location <location name> -Force -Verbose -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/documentdb-account-windows/azuredeploy.json -databaseAccountName <New account name>

Here's an example:

	New-AzureResourceGroupDeployment -ResourceGroupName New_Resource_Group -Name DocumentDBDeployment -Location westus -Force -Verbose -TemplateFile .\azuredeploy.json -databaseAccountName NewDocDBAcct

The output resembles the following:

    VERBOSE: 4:57:05 PM - Template is valid.
    VERBOSE: 4:57:07 PM - Create template deployment 'DocumentDBDeployment'.
    VERBOSE: 4:57:14 PM - Resource Microsoft.DocumentDb/databaseAccounts 'NewDocDBAcct' provisioning status is running
    VERBOSE: 5:07:38 PM - Resource Microsoft.DocumentDb/databaseAccounts 'NewDocDBAcct' provisioning status is succeeded


    DeploymentName    : DocumentDBDeployment
    ResourceGroupName : New_Resource_Group
    ProvisioningState : Succeeded
    Timestamp         : 9/24/2015 10:07:37 PM
    Mode              : Incremental
    TemplateLink      :
    Parameters        :
                    Name             Type                       Value
                    ===============  =========================  ==========
                    databaseAccountName  String                     NewDocDBAcct
                    location         String                     westus

    Outputs           :
    

## <a id="create-account-script"></a>Task: Create a DocumentDB account using a template and a PowerShell script

To bundle the creation of a resource group and a DocumentDB account into one command, you can create a Powershell script to handle both tasks at once.

First, save the following Powershell script locally (C:\AutomationScripts) and name the file "deploydocdbaccount.ps1".

*Todo: Test that the template file and parameter file work as expected when deployed to git.*

    Param([string]$resourceGroupName,[string]$docDBAccountName,[string]$location)

    Set-StrictMode -Version 3

    #Switch Azure Powershell Mode
    Switch-AzureMode AzureResourceManager
    Add-AzureAccount

    #Register Resources
    Register-AzureProvider -ProviderNamespace Microsoft.DocumentDb -Force

    # Create or update the resource group using our template file and template parameters
    New-AzureResourceGroupDeployment -ResourceGroupName $resourceGroupName -Location $location -Force -Verbose -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/documentdb-account-windows/azuredeploy.json -TemplateParameterUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/documentdb-account-windows/azuredeploy.param.dev.json

Next, in PowerShell, navigate to the folder where you saved the script (C:\AutomationScripts). Then replace the these values in the following PowerShell command and run it: 

- "Resource group name" with the name of the existing resource group. 
- "Location" with the location in which to provision the account, valid options include: 
- "New account name" with the unique name, all lowercase, of the new account to create. Note that the script does not validate that the DocumentDB account name is a) valid and b) available. It is highly recommended that you verify the availability of the names you plan to supply prior to running the PowerShell command.

	.\deploydocdbaccount.ps1 -ResourceGroupName "Resource group name" -docDBAccountName "New account name" -location "Location"

For example:

    .\deploydocdbaccount.ps1 -ResourceGroupName "New_Resource_Group" -docDBAccountName "sampledocdbacct" -location "West US"

When prompted, enter the user name and password associated with your Azure subscription.

The following output is displayed as your new account is provisioned, which takes 10-15 minutes. The warning about Switch-AzureMode is expected and the documentation will be updated when the new cmdlet is available.

    WARNING: The Switch-AzureMode cmdlet is deprecated and will be removed in a future release.

    Id                             Type       Subscriptions                          Tenants
    --                             ----       -------------                          -------
    user@tenant.com       User       xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

    ProviderNamespace : Microsoft.DocumentDb
    RegistrationState : Registered
    ResourceTypes     : {databaseAccounts, databaseAccountNames, operations}

    VERBOSE: 8:57:04 PM - Template is valid.
    VERBOSE: 8:57:06 PM - Create template deployment 'azuredeploy'.
    VERBOSE: 8:57:14 PM - Resource Microsoft.DocumentDb/databaseAccounts 'sampledocdbacct' provisioning status is running
    VERBOSE: 9:04:08 PM - Resource Microsoft.DocumentDb/databaseAccounts 'sampledocdbacct' provisioning status is succeeded

    DeploymentName     : azuredeploy
    CorrelationId      : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ResourceGroupName  : New_Resource_Group
    ProvisioningState  : Succeeded
    Timestamp          : 9/25/2015 2:04:08 AM
    Mode               : Incremental
    TemplateLink       :
    TemplateLinkString :
    Parameters         : {[databaseAccountName, Microsoft.Azure.Commands.Resources.Models.DeploymentVariable], [location,
    Microsoft.Azure.Commands.Resources.Models.DeploymentVariable]}
    ParametersString   :
                     Name             Type                       Value
                     ===============  =========================  ==========
                     databaseAccountName  String                     sampledocdbacct
                     location         String                     West US

    Outputs            :
    OutputsString      :


## <a id="delete-account"></a>Task: Delete a DocumentDB account using Powershell

In the following command, replace <Deployment name\> with the deployment name and <Resource group name\> with the name of the resource group that contains the DocumentDB account, and then run it:  

*Todo: Double check as this runs without error and returns true, but the acct isn't deleted in the portal yet*

	Remove-AzureResource -Name <Deployment name> -ResourceGroupName <Resource group name> -ResourceType "Microsoft.DocumentDb/databaseAccounts" 

For example:

    Remove-AzureResource -Name "DocumentDBDeployment" -ResourceGroupName "New_Resource_Group" -ResourceType "Microsoft.DocumentDb/databaseAccounts"

> [AZURE.NOTE] You can use the **-Force** parameter to skip the confirmation prompt.

You're asked for confirmation if you didn't use the -Force parameter:

	Confirm
    Are you sure you want to delete the following resource:
    /subscriptions/2c6090c6-f494-488e-a9c6-4f1b0edfd382/resourceGroups/New_Resource_Group/providers/Microsoft.DocumentDb/databaseAccounts/DocumentDBDeployment
    [Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):

The deletion command returns `True` when the DocumentDB account is deleted.

<!--- To include later:

## <a id="change-consistency"></a>Task: Change the default consistency of an account

## <a id="rotate-keys"></a>Task: Rotate keys using a PowerShell script

First, save the following Powershell script locally (C:\AutomationScripts) and name the file "docdbrotatekeys.ps1".


    Param([string]$subName,[string]$rgName,[string]$docDBAccount)

    #Switch Azure Powershell Mode
    Switch-AzureMode AzureResourceManager

    #Add azure account (sign in with email address and password of subscription)
    Add-AzureAccount

    #Select Azure subscription, set as current, put in variable
    Select-AzureSubscription -SubscriptionName $subName -Current
    $sub = Get-AzureSubscription -Current

    #Get Azure AAD auth token
    $clientId = "1950a258-227b-4e31-a9cf-717495945fc2"
    $redirectUri = "urn:ietf:wg:oauth:2.0:oob"
    $resourceClientId = "00000002-0000-0000-c000-000000000000"
    $resourceAppIdURI = "https://management.core.windows.net/"
    $authority = "https://login.windows.net/common"
    $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority,$false
    $authResult = $authContext.AcquireToken($resourceAppIdURI, $clientId, $redirectUri, "Auto")
    $header = $authresult.CreateAuthorizationHeader()
    $tenants = Invoke-RestMethod -Method GET -Uri "https://management.azure.com/tenants?api-version=2014-04-01" -Headers @{"Authorization"=$header} -ContentType "application/json"
    $tenant = $tenants.value.tenantId
    $authority = [System.String]::Format("https://login.windows.net/{0}", $tenant)
    $authContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" -ArgumentList $authority,$false
    $authResult = $authContext.AcquireToken($resourceAppIdURI, $clientId, $redirectUri, "Auto")
    $header = $authresult.CreateAuthorizationHeader()

    #Rotate Keys
    $rotateKeyURL = [System.String]::Format("https://management.azure.com/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.DocumentDB/databaseAccounts/{2}/regenerateKey?api-version=2014-04-01", $sub.SubscriptionId, $rgName, $docDBAccount)

    #Set POST Body.  Valid values for keyKind are "Primary" or "Secondary" or "PrimaryReadonly" or "SecondaryReadonly"
    $rotatePrimaryKeyBody = '{"keyKind":"Primary"}'
    Invoke-RestMethod -Method POST -Uri $rotateKeyURL -Headers @{"Authorization"=$header} -ContentType "application/json" -Body $rotatePrimaryKeyBody

    $rotateProgress = ""
    Do
    {
	    #Poll DocDB Account status (repeat the invoke and inspect the provisioning state until it reads "succeeded")
	    $geturl = [System.String]::Format("https://management.azure.com/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.DocumentDB/databaseAccounts/{2}/?api-version=2014-04-01", $sub.SubscriptionId, $rgName, $docDBAccount)
	    $getResponse = Invoke-RestMethod -Method GET -Uri $geturl -Headers @{"Authorization"=$header} -ContentType "application/json"
	    $rotateProgress = $getResponse.properties.provisioningState
	    write-host "Account status: " $rotateProgress 
	    Start-Sleep -s 30
    }
    Until ($rotateProgress -eq "succeeded")

    Write-host "Key rotated successfully"

    $getKeysURL = [System.String]::Format("https://management.azure.com/subscriptions/{0}/resourcegroups/{1}/providers/Microsoft.DocumentDB/databaseAccounts/{2}/listKeys?api-version=2014-04-01", $sub.SubscriptionId, $rgName, $docDBAccount)

    $keysResponse = Invoke-RestMethod -Method POST -Uri $getKeysURL -Headers @{"Authorization"=$header} -ContentType "application/json"
    #Get a particular key value from the response.  Valid values are "primaryMasterKey", "secondaryMasterKey", "primaryReadonlyMasterKey", "secondaryReadonlyMasterKey"
    $keysResponse.primaryMasterKey

Next, in PowerShell, navigate to the folder where you saved the script (C:\AutomationScripts). Then replace the these values in the following PowerShell command and run it: 

- "Resource group name" with the name of the resource group that contains the DocumentDB account. 
- "DocumentDB account name" with the name of the account that contains the keys to rotate.

string]$subName,[string]$rgName,[string]$docDBAccount

	.\docdbrotatekeys.ps1 -subName "Subscription name" -resourceGroupName "Resource group name" -docDBAccountName "DocumentDB account name" 

For example:

    .\docdbrotatekeys.ps1 -subName "Visual Studio Ultimate with MSDN" -resourceGroupName "New_Resource_Group" -docDBAccountName "sampledocdbacct"

If you receive a security warning, click R to run the script. 

When prompted for your credentials, enter the user name and password associated with your Azure subscription.

The following output is displayed as your keys are rotated:

-->

## Next steps

Now that you have a DocumentDB account, the next step is to create a DocumentDB database. You can create a database by using one of the following:

- The preview portal, as described in [Create a DocumentDB database using the Azure preview portal](documentdb-create-database.md).
- The C# .NET samples in the [DatabaseManagement](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/DatabaseManagement) project of the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) repository on GitHub.
- The all-inclusive tutorials: [.NET](documentdb-get-started.md), [.NET MVC](documentdb-dotnet-application.md), [Java](documentdb-java-application.md), [Node.js](documentdb-nodejs-application.md), or [Python](documentdb-python-application.md).
- The [DocumentDB SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx). DocumentDB has .NET, Java, Python, Node.js, and JavaScript API SDKs. 

After creating your database, you need to [add one or more collections](documentdb-create-collection.md) to the database, then [add documents](documentdb-view-json-document-explorer.md) to the collections. 

After you have documents in a collection, you can use [DocumentDB SQL](documentdb-sql-query.md) to [execute queries](documentdb-sql-query.md#executing-queries) against your documents by using the [Query Explorer](documentdb-query-collections-query-explorer.md) in the preview portal, the [REST API](https://msdn.microsoft.com/library/azure/dn781481.aspx), or one of the [SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx).

To learn more about DocumentDB, explore these resources:

-	[Learning pah for DocumentDB](https://azure.microsoft.com/documentation/learning-paths/documentdb/)
-	[DocumentDB resource model and concepts](documentdb-resources.md)

For more templates you can use, see [Azure Quickstart templates](http://azure.microsoft.com/documentation/templates/).
