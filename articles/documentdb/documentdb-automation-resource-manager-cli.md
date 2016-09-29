<properties
	pageTitle="DocumentDB Automation - Resource Manager - CLI | Microsoft Azure"
	description="Use Azure Resource Manager templates or CLI to deploy a DocumentDB database account. DocumentDB is a cloud-based NoSQL database for JSON data."
	services="documentdb"
	authors="mimig1"
	manager="jhubbard"
	editor=""
    tags="azure-resource-manager"
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/28/2016" 
	ms.author="mimig"/>

# Automate DocumentDB account creation using Azure CLI and Azure Resource Manager templates 

> [AZURE.SELECTOR]
- [Azure portal](documentdb-create-account.md)
- [Azure CLI and ARM](documentdb-automation-resource-manager-cli.md)

This article shows you how to create an Azure DocumentDB account by using Azure Resource Manager templates or directly with the Azure Command-Line Interface (CLI). To create a DocumentDB account using the Azure portal, see [Create a DocumentDB database account using the Azure portal](documentdb-create-account.md).

DocumentDB database accounts are currently the only DocumentDB resource that can be created using Resource Manager templates and the Azure CLI.

## Getting ready

Before you can use the Azure CLI with Azure resource groups, you need to have the right Azure CLI version and an Azure account. If you don't have the Azure CLI, [install it](../xplat-cli-install.md).

### Update your Azure CLI version

At the command prompt, type `azure --version` to see whether you have already installed version 0.10.4 or later. You may be prompted to participate in Microsoft Azure CLI data collection at this step, and can select y or n to opt-in or opt-out.

	azure --version
    0.10.4 (node: 4.2.4)

If your version is not 0.10.4 or later, you need to either [install the Azure CLI](../xplat-cli-install.md) or update by using one of the native installers, or through **npm** by typing `npm update -g azure-cli` to update or `npm install -g azure-cli` to install.

### Set your Azure account and subscription

If you don't already have an Azure subscription but you do have a Visual Studio subscription, you can activate your [Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). Or you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).

You need to have a work or school account or a Microsoft account identity to use Azure resource management templates. If you have one of these accounts, type the following command:

	azure login

Which produces the following output: 

    info:    Executing command login
    |info:    To sign in, use a web browser to open the page https://aka.ms/devicelogin. 
    Enter the code E1A2B3C4D to authenticate.

> [AZURE.NOTE] If you don't have an Azure account, you see an error message indicating that you need a different type of account. To create one from your current Azure account, see [Creating a work or school identity in Azure Active Directory](../virtual-machines/virtual-machines-windows-create-aad-work-id.md).

Open [https://aka.ms/devicelogin](https://aka.ms/devicelogin) in a browser and enter the code provided in the command output.

![Screenshot showing the device login screen for Microsoft Azure CLI](media/documentdb-automation-resource-manager-cli/azure-cli-login-code.png)

Once you've entered the code, select the identity you want to use in the browser and provide your user name and password if needed.

![Screenshot showing where to select the Microsoft identity account associated with the Azure subscription you want to use](media/documentdb-automation-resource-manager-cli/identity-cli-login.png)

You receive the following confirmation screen when you're successfully logged in, and you can then close the browser window.

![Screenshot showing confirmation of login to the Microsoft Azure Cross-platform Command Line Interface](media/documentdb-automation-resource-manager-cli/login-confirmation.png)

The command shell also provides the following output:

    /info:    Added subscription Visual Studio Ultimate with MSDN
    info:    Setting subscription "Visual Studio Ultimate with MSDN" as default
    +
    info:    login command OK

In addition to the interactive login method described here, there are additional Azure CLI login methods available. For more information about the other methods and information about handling multiple subscriptions, see [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](../xplat-cli-connect.md).

### Switch to the Azure CLI resource group mode

By default, the Azure CLI starts in the service management mode (**asm** mode). Type the following to switch to resource group mode.

	azure config mode arm

Which provides the following output:

    info:    Executing command config mode
    info:    New mode is arm
    info:    config mode command OK

If needed, you can switch back to the default set of commands by typing `azure config mode asm`.

### Create or retrieve your resource group

To create a DocumentDB account, you first need a resource group. If you already know the name of the resource group that you'd like to use, then skip to [Step 2](#create-documentdb-account-cli). 

To review a list of all your current resource groups, run the following command and take note of the resource group name you'd like to use: 

    azure group list

To create a resource group, run the following command, specify the name of the new resource group to create, and the region in which to create the resource group: 

    azure group create <resourcegroupname> <resourcegrouplocation>

 - `<resourcegroupname>` can only use alphanumeric characters, periods, underscores, the '-' character, and parenthesis and cannot end in a period. 
 - `<resourcegrouplocation>` must be one of the regions in which DocumentDB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).

Example input:

    azure group create new_res_group westus

Which produces the following output:

    info:    Executing command group create
    + Getting resource group new_res_group
    + Creating resource group new_res_group
    info:    Created resource group new_res_group
    data:    Id:                  /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/new_res_group
    data:    Name:                new_res_group
    data:    Location:            westus
    data:    Provisioning State:  Succeeded
    data:    Tags: null
    data:
    info:    group create command OK

If you encounter errors, see [Troubleshooting](#troubleshooting). 

## Understanding Resource Manager templates and resource groups

Most applications are built from a combination of different resource types (such as one or more DocumentDB account, storage accounts, a virtual network, or a content delivery network). The default Azure service management API and the Azure portal represented these items by using a service-by-service approach. This approach requires you to deploy and manage the individual services individually (or find other tools that do so), and not as a single logical unit of deployment.

*Azure Resource Manager templates* make it possible for you to deploy and manage these different resources as one logical deployment unit in a declarative fashion. Instead of imperatively telling Azure what to deploy one command after another, you describe your entire deployment in a JSON file -- all the resources and associated configuration and deployment parameters -- and tell Azure to deploy those resources as one group.

You can learn lots more about Azure resource groups and what they can do for you in the [Azure Resource Manager overview](../resource-group-overview.md). If you're interested in authoring templates, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

## <a id="quick-create-documentdb-account"></a>Task: Create a Single Region DocumentDB account

Use the instructions in this section to create a Single Region DocumentDB account. This can be accomplished using Azure CLI with or without Resource Manager templates.

### <a id="create-single-documentdb-account-cli-arm"></a> Create a Single Region DocumentDB account using Azure CLI without Resource Manager templates

Create a DocumentDB account in the new or existing resource group by entering the following command at the command prompt:

> [AZURE.TIP] If you run this command in Azure PowerShell or Windows PowerShell you receive an error about an unexpected token. Instead, run this command at the Windows Command Prompt. 

    azure resource create -g <resourcegroupname> -n <databaseaccountname> -r "Microsoft.DocumentDB/databaseAccounts" -o 2015-04-08 -l <resourcegrouplocation> -p "{\"databaseAccountOfferType\":\"Standard\",\"locations\":["{\"locationName\":\"<databaseaccountlocation>\",\"failoverPriority\":\"<failoverPriority>\"}"]}"

 - `<resourcegroupname>` can only use alphanumeric characters, periods, underscores, the '-' character, and parenthesis and cannot end in a period.
 - `<resourcegrouplocation>` is the region of the current resource group.
 - `<databaseaccountname>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.
 - `<databaseaccountlocation>` must be one of the regions in which DocumentDB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).

Example input: 

    azure resource create -g new_res_group -n samplecliacct -r "Microsoft.DocumentDB/databaseAccounts" -o 2015-04-08 -l westus -p "{\"databaseAccountOfferType\":\"Standard\",\"locations\":["{\"locationName\":\"westus\",\"failoverPriority\":\"0\"}"]}"

Which produces the following output as your new account is provisioned:

    info:    Executing command resource create
    + Getting resource samplecliacct
    + Creating resource samplecliacct
    info:    Resource samplecliacct is updated
    data:
    data:    Id:        /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/new_res_group/providers/Microsoft.DocumentDB/databaseAccounts/samplecliacct
    data:    Name:      samplecliacct
    data:    Type:      Microsoft.DocumentDB/databaseAccounts
    data:    Parent:
    data:    Location:  West US
    data:    Tags:
    data:
    info:    resource create command OK

If you encounter errors, see [Troubleshooting](#troubleshooting). 

After the command returns, the account will be in the **Creating** state for a few minutes, before it changes to the **Online** state in which it is ready for use. You can check on the status of the account in the [Azure portal](https://portal.azure.com), on the **DocumentDB Accounts** blade.

### <a id="create-single-documentdb-account-cli-arm"></a> Create a Single Region DocumentDB account using Azure CLI with Resource Manager templates

The instructions in this section describe how to create a DocumentDB account with an Azure Resource Manager template and an optional parameters file, both of which are JSON files. Using a template enables you to describe exactly what you want and repeat it without errors.

Create a local template file with the following content. Name the file azuredeploy.json.

    {
        "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "databaseAccountName": {
                "type": "string"
            },
            "locationName1": {
                "type": "string"
            }
        },
        "variables": {},
        "resources": [
            {
                "apiVersion": "2015-04-08",
                "type": "Microsoft.DocumentDb/databaseAccounts",
                "name": "[parameters('databaseAccountName')]",
                "location": "[resourceGroup().location]",
                "properties": {
                    "databaseAccountOfferType": "Standard",
                    "locations": [
                        {
                            "failoverPriority": 0,
                            "locationName": "[parameters('locationName1')]"
                        }
                    ]
                }
            }
        ]
    }

The failoverPriority must be set to 0 since this is a single region account. A failoverPriority of 0 indicates that this region be kept as the [write region for the DocumentDB account][scaling-globally]. 
You can either enter the value at the command line, or create a parameter file to specify the value.

To create a parameters file, copy the following content into a new file and name the file azuredeploy.parameters.json. If you plan on specifying the database account name at the command prompt, you can continue without creating this file.

    {
        "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "databaseAccountName": {
                "value": "samplearmacct"
            },
            "locationName1": {
                "value": "westus"
            }
        }
    }

In the azuredeploy.parameters.json file, update the value field of `"samplearmacct"` to the database name you'd like to use, then save the file. `"databaseAccountName"` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters. Update the value field of `"locationName1"` to the region where you would like to create the DocumentDB account.

To create a DocumentDB account in your resource group, run the following command and provide the path to the template file, the path to the parameter file or the parameter value, the name of the resource group in which to deploy, and a deployment name (-n is optional). 

To use a parameter file:

    azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g <resourcegroupname> -n <deploymentname>

 - `<PathToTemplate>` is the path to the azuredeploy.json file created in step 1. If your path name has spaces in it, put double quotes around this parameter.
 - `<PathToParameterFile>` is the path to the azuredeploy.parameters.json file created in step 1. If your path name has spaces in it, put double quotes around this parameter.
 - `<resourcegroupname>` is the name of the existing resource group in which to add a DocumentDB database account. 
 - `<deploymentname>` is the optional name of the deployment.

Example input: 

    azure group deployment create -f azuredeploy.json -e azuredeploy.parameters.json -g new_res_group -n azuredeploy

OR to specify the database account name parameter without a parameter file, and instead get prompted for the value, run the following command:

    azure group deployment create -f <PathToTemplate> -g <resourcegroupname> -n <deploymentname>

Example input which shows the prompt and entry for a database account named samplearmacct:

    azure group deployment create -f azuredeploy.json -g new_res_group -n azuredeploy
    info:    Executing command group deployment create
    info:    Supply values for the following parameters
    databaseAccountName: samplearmacct

As the account is provisioned, you receive the following information: 

    info:    Executing command group deployment create
    + Initializing template configurations and parameters
    + Creating a deployment
    info:    Created template deployment "azuredeploy"
    + Waiting for deployment to complete
    + 
    + 
    info:    Resource 'new_res_group' of type 'Microsoft.DocumentDb/databaseAccounts' provisioning status is Running
    + 
    info:    Resource 'new_res_group' of type 'Microsoft.DocumentDb/databaseAccounts' provisioning status is Succeeded
    data:    DeploymentName     : azuredeploy
    data:    ResourceGroupName  : new_res_group
    data:    ProvisioningState  : Succeeded
    data:    Timestamp          : 2015-11-30T18:50:23.6300288Z
    data:    Mode               : Incremental
    data:    CorrelationId      : 4a5d4049-c494-4053-bad4-cc804d454700
    data:    DeploymentParameters :
    data:    Name                 Type    Value
    data:    -------------------  ------  ------------------
    data:    databaseAccountName  String  samplearmacct
    data:    locationName1        String  westus
    info:    group deployment create command OK

If you encounter errors, see [Troubleshooting](#troubleshooting).  

After the command returns, the account will be in the **Creating** state for a few minutes, before it changes to the **Online** state in which it is ready for use. You can check on the status of the account in the [Azure portal](https://portal.azure.com), on the **DocumentDB Accounts** blade.

## <a id="create-multi-documentdb-account"></a>Task: Create a multi-region DocumentDB account

DocumentDB has the capability to [distribute your data globally][distribute-globally] across various [Azure regions](https://azure.microsoft.com/regions/#services). When creating a DocumentDB account, the regions in which you would like the service to exist can be specified. Use the instructions in this section to create a multi-region DocumentDB account. This can be accomplished using Azure CLI with or without Resource Manager templates.

### <a id="create-multi-documentdb-account-cli"></a> Create a multi-region DocumentDB account using Azure CLI without Resource Manager templates

Create a DocumentDB account in the new or existing resource group by entering the following command at the command prompt:

> [AZURE.TIP] If you run this command in Azure PowerShell or Windows PowerShell you receive an error about an unexpected token. Instead, run this command at the Windows Command Prompt. 

    azure resource create -g <resourcegroupname> -n <databaseaccountname> -r "Microsoft.DocumentDB/databaseAccounts" -o 2015-04-08 -l <resourcegrouplocation> -p "{\"databaseAccountOfferType\":\"Standard\",\"locations\":["{\"locationName\":\"<databaseaccountlocation1>\",\"failoverPriority\":\"<failoverPriority1>\"},{\"locationName\":\"<databaseaccountlocation2>\",\"failoverPriority\":\"<failoverPriority2>\"}"]}"

 - `<resourcegroupname>` can only use alphanumeric characters, periods, underscores, the '-' character, and parenthesis and cannot end in a period.
 - `<resourcegrouplocation>` is the region of the current resource group.
 - `<databaseaccountname>` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters.
 - `<databaseaccountlocation1>` and `<databaseaccountlocation2>` must be regions in which DocumentDB is generally available. The current list of regions is provided on the [Azure Regions page](https://azure.microsoft.com/regions/#services).

Example input: 

    azure resource create -g new_res_group -n samplecliacct -r "Microsoft.DocumentDB/databaseAccounts" -o 2015-04-08 -l westus -p "{\"databaseAccountOfferType\":\"Standard\",\"locations\":["{\"locationName\":\"westus\",\"failoverPriority\":\"0\"},{\"locationName\":\"eastus\",\"failoverPriority\":\"1\"}"]}"

Which produces the following output as your new account is provisioned:

    info:    Executing command resource create
    + Getting resource samplecliacct
    + Creating resource samplecliacct
    info:    Resource samplecliacct is updated
    data:
    data:    Id:        /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/new_res_group/providers/Microsoft.DocumentDB/databaseAccounts/samplecliacct
    data:    Name:      samplecliacct
    data:    Type:      Microsoft.DocumentDB/databaseAccounts
    data:    Parent:
    data:    Location:  West US
    data:    Tags:
    data:
    info:    resource create command OK

If you encounter errors, see [Troubleshooting](#troubleshooting). 

After the command returns, the account will be in the **Creating** state for a few minutes, before it changes to the **Online** state in which it is ready for use. You can check on the status of the account in the [Azure portal](https://portal.azure.com), on the **DocumentDB Accounts** blade.

### <a id="create-multi-documentdb-account-cli-arm"></a> Create a multi-region DocumentDB account using Azure CLI with Resource Manager templates

The instructions in this section describe how to create a DocumentDB account with an Azure Resource Manager template and an optional parameters file, both of which are JSON files. Using a template enables you to describe exactly what you want and repeat it without errors.

Create a local template file with the following content. Name the file azuredeploy.json.

    {
        "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "databaseAccountName": {
                "type": "string"
            },
            "locationName1": {
                "type": "string"
            },
            "locationName2": {
                "type": "string"
            }
        },
        "variables": {},
        "resources": [
            {
                "apiVersion": "2015-04-08",
                "type": "Microsoft.DocumentDb/databaseAccounts",
                "name": "[parameters('databaseAccountName')]",
                "location": "[resourceGroup().location]",
                "properties": {
                    "databaseAccountOfferType": "Standard",
                    "locations": [
                        {
                            "failoverPriority": 0,
                            "locationName": "[parameters('locationName1')]"
                        },
                        {
                            "failoverPriority": 1,
                            "locationName": "[parameters('locationName2')]"
                        }
                    ]
                }
            }
        ]
    }

The preceding template file can be used to create a DocumentDB account with two regions. To create the account with more regions, add it to the "locations" array and add the corresponding parameters.

One of the regions must have a failoverPriority value of 0 to indicate that this region be kept as the [write region for the DocumentDB account][scaling-globally]. The failover priority values must be unique among the locations and the highest failover priority value must be less than the total number of regions. You can either enter the value at the command line, or create a parameter file to specify the value.

To create a parameters file, copy the following content into a new file and name the file azuredeploy.parameters.json. If you plan on specifying the database account name at the command prompt, you can continue without creating this file.

    {
        "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "databaseAccountName": {
                "value": "samplearmacct"
            },
            "locationName1": {
                "value": "westus"
            },
            "locationName2": {
                "value": "eastus"
            }
        }
    }

In the azuredeploy.parameters.json file, update the value field of `"samplearmacct"` to the database name you'd like to use, then save the file. `"databaseAccountName"` can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters. Update the value field of `"locationName1"` and `"locationName2"` to the region where you would like to create the DocumentDB account.

To create a DocumentDB account in your resource group, run the following command and provide the path to the template file, the path to the parameter file or the parameter value, the name of the resource group in which to deploy, and a deployment name (-n is optional). 

To use a parameter file:

    azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g <resourcegroupname> -n <deploymentname>

 - `<PathToTemplate>` is the path to the azuredeploy.json file created in step 1. If your path name has spaces in it, put double quotes around this parameter.
 - `<PathToParameterFile>` is the path to the azuredeploy.parameters.json file created in step 1. If your path name has spaces in it, put double quotes around this parameter.
 - `<resourcegroupname>` is the name of the existing resource group in which to add a DocumentDB database account. 
 - `<deploymentname>` is the optional name of the deployment.

Example input: 

    azure group deployment create -f azuredeploy.json -e azuredeploy.parameters.json -g new_res_group -n azuredeploy

OR to specify the database account name parameter without a parameter file, and instead get prompted for the value, run the following command:

    azure group deployment create -f <PathToTemplate> -g <resourcegroupname> -n <deploymentname>

Example input, which shows the prompt and entry for a database account named samplearmacct:

    azure group deployment create -f azuredeploy.json -g new_res_group -n azuredeploy
    info:    Executing command group deployment create
    info:    Supply values for the following parameters
    databaseAccountName: samplearmacct

As the account is provisioned, you receive the following information: 

    info:    Executing command group deployment create
    + Initializing template configurations and parameters
    + Creating a deployment
    info:    Created template deployment "azuredeploy"
    + Waiting for deployment to complete
    + 
    + 
    info:    Resource 'new_res_group' of type 'Microsoft.DocumentDb/databaseAccounts' provisioning status is Running
    + 
    info:    Resource 'new_res_group' of type 'Microsoft.DocumentDb/databaseAccounts' provisioning status is Succeeded
    data:    DeploymentName     : azuredeploy
    data:    ResourceGroupName  : new_res_group
    data:    ProvisioningState  : Succeeded
    data:    Timestamp          : 2015-11-30T18:50:23.6300288Z
    data:    Mode               : Incremental
    data:    CorrelationId      : 4a5d4049-c494-4053-bad4-cc804d454700
    data:    DeploymentParameters :
    data:    Name                 Type    Value
    data:    -------------------  ------  ------------------
    data:    databaseAccountName  String  samplearmacct
    data:    locationName1        String  westus
    data:    locationName2        String  eastus
    info:    group deployment create command OK

If you encounter errors, see [Troubleshooting](#troubleshooting).  

After the command returns, the account will be in the **Creating** state for a few minutes, before it changes to the **Online** state in which it is ready for use. You can check on the status of the account in the [Azure portal](https://portal.azure.com), on the **DocumentDB Accounts** blade.

## Troubleshooting

If you receive errors like `Deployment provisioning state was not successful` while creating your resource group or database account, you have a few troubleshooting options. 

> [AZURE.NOTE] Providing incorrect characters in the database account name or providing a location in which DocumentDB is not available will cause deployment errors. Database account names can only use lowercase letters, numbers, the '-' character, and must be between 3 and 50 characters. All valid database account locations are listed on the [Azure Regions page](https://azure.microsoft.com/regions/#services).

- If your output contains the following `Error information has been recorded to C:\Users\wendy\.azure\azure.err`, then review the error info in the azure.err file.

- You may find useful info in the log file for the resource group. To view the log file, run the following command:

    	azure group log show <resourcegroupname> --last-deployment

    Example input:

    	azure group log show new_res_group --last-deployment

    Then see [Troubleshooting resource group deployments in Azure](../resource-manager-troubleshoot-deployments-cli.md) for additional information.

- Error information is also available in the Azure portal as shown in the following screenshot. To navigate to the error info: click Resource Groups in the Jumpbar, select the Resource Group that had the error, then in the Essentials area of the Resource group blade click the date of the Last Deployment, then in the Deployment history blade select the failed deployment, then in the Deployment blade click the Operation detail with the red exclamation mark. The Status Message for the failed deployment is displayed in the Operation details blade. 

    ![Screenshot of the Azure portal showing how to navigate to the deployment error message](media/documentdb-automation-resource-manager-cli/portal-troubleshooting-deploy.png) 

## Next steps

Now that you have a DocumentDB account, the next step is to create a DocumentDB database. You can create a database by using one of the following:

- The Azure portal, as described in [Create a DocumentDB database using the Azure portal](documentdb-create-database.md).
- The C# .NET samples in the [DatabaseManagement](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/DatabaseManagement) project of the [azure-documentdb-dotnet](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) repository on GitHub.
- The [DocumentDB SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx). DocumentDB has .NET, Java, Python, Node.js, and JavaScript API SDKs. 

After creating your database, you need to [add one or more collections](documentdb-create-collection.md) to the database, then [add documents](documentdb-view-json-document-explorer.md) to the collections. 

After you have documents in a collection, you can use [DocumentDB SQL](documentdb-sql-query.md) to [execute queries](documentdb-sql-query.md#executing-queries) against your documents by using the [Query Explorer](documentdb-query-collections-query-explorer.md) in the portal, the [REST API](https://msdn.microsoft.com/library/azure/dn781481.aspx), or one of the [SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx).

To learn more about DocumentDB, explore these resources:

-	[Learning path for DocumentDB](https://azure.microsoft.com/documentation/learning-paths/documentdb/)
-	[DocumentDB resource model and concepts](documentdb-resources.md)

For more templates you can use, see [Azure Quickstart templates](https://azure.microsoft.com/documentation/templates/).


<!--Reference style links - using these makes the source content way more readable than using inline links-->
[distribute-globally]: https://azure.microsoft.com/en-us/documentation/articles/documentdb-distribute-data-globally
[scaling-globally]: https://azure.microsoft.com/en-us/documentation/articles/documentdb-distribute-data-globally/#scaling-across-the-planet