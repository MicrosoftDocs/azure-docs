<properties
	pageTitle="Manage DocumentDB with ARM templates and CLI | Microsoft Azure"
	description="Deploy and manage database accounts for Azure DocumentDB using Resource Manager templates and Azure CLI."
	services="documentdb"
	authors="mimig1"
	manager="jhubbard"
	editor=""
	documentationCenter=""/>


<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="11/30/2015" 
	ms.author="mimig"/>

# Deploy and manage DocumentDB by using Azure Resource Manager templates and the Azure CLI

> [AZURE.SELECTOR]
- [Portal](documentdb-create-account.md)
- [CLI](documentdb-deploy-rmtemplates-powershell.md)
- [PowerShell](documentdb-deploy-rmtemplates-powershell.md)

This article shows you how to use Azure Resource Manager templates and the Azure CLI to create a DocumentDB account. 

- [Create a DocumentDB account using CLI](#quick-create-documentdb-account)
- [Create a DocumentDB account from an ARM template](#deploy-documentdb-from-a-template)

You can also use the Azure Quickstart templates to have a DocumentDB account created for you, see *Todo: Update link* [Azure Quickstart templates](http://azure.microsoft.com/documentation/templates/).

## Getting ready

Before you can use the Azure CLI with Azure resource groups, you need to have the right Azure CLI version and a work or school account.

### Update your Azure CLI version to 0.9.10 or later

At the command prompt, type `azure --version` to see whether you have already installed version 0.9.10 or later.

	azure --version
    0.9.10 (node: 0.12.7)

If your version is not 0.9.10 or later, you need to either [install the Azure CLI](../xplat-cli-install.md) or update by using one of the native installers or through **npm** by typing `npm update -g azure-cli` to update or `npm install -g azure-cli` to install.

You can also run Azure CLI as a Docker container by using the following [Docker image](https://registry.hub.docker.com/u/microsoft/azure-cli/). From a Docker host, run the following command:

	docker run -it microsoft/azure-cli

### Set your Azure account and subscription

If you don't already have an Azure subscription but you do have a Visual Studio subscription, you can activate your [Visual Studio subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). Or you can sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).

You need to have a work or school account to use Azure resource management templates. If you have one, you can type `azure login` and enter your user name and password, and you should successfully log in.

> [AZURE.NOTE] If you don't have one, you'll see an error message indicating that you need a different type of account. To create one from your current Azure account, see [Creating a work or school identity in Azure Active Directory](resource-group-create-work-id-from-personal.md).

Your account may have more than one subscription. You can list your subscriptions by typing `azure account list`, which might look something like this:

    azure account list
    info:    Executing command account list
    data:    Name                              Id                                    Tenant Id                            Current
    data:    --------------------------------  ------------------------------------  ------------------------------------  -------
    data:    Contoso Admin                     xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  true
    data:    Fabrikam dev                      xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  false  
    data:    Fabrikam test                     xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  false  
    data:    Contoso production                xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  false  

You can set the current Azure subscription by typing the following. Use the subscription name or the ID that has the resources you want to manage.

	azure account set <subscription name or ID> true

### Switch to the Azure CLI resource group mode

By default, the Azure CLI starts in the service management mode (**asm** mode). Type the following to switch to resource group mode.

	azure config mode arm



> [AZURE.NOTE] You can switch back to the default set of commands by typing `azure config mode asm`.

## Understanding Azure resource templates and resource groups

Most applications are built from a combination of different resource types (such as one or more DocumentDB account, storage accounts, a virtual network, or a content delivery network). The default Azure service management API and the Azure preview portal represented these items by using a service-by-service approach. This approach requires you to deploy and manage the individual services individually (or find other tools that do so), and not as a single logical unit of deployment.

*Azure Resource Manager templates* make it possible for you to deploy and manage these different resources as one logical deployment unit in a declarative fashion. Instead of imperatively telling Azure what to deploy one command after another, you describe your entire deployment in a JSON file -- all of the resources and associated configuration and deployment parameters -- and tell Azure to deploy those resources as one group.

You can then manage the overall life cycle of the group's resources by using Azure CLI resource management commands to:

- Stop, start, or delete all of the resources within the group at once.
- Apply Role-Based Access Control (RBAC) rules to lock down security permissions on them.
- Audit operations.
- Tag resources with additional metadata for better tracking.

You can learn lots more about Azure resource groups and what they can do for you in the [Azure Resource Manager overview](../resource-group-overview.md). If you're interested in authoring templates, see [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

## <a id="quick-create-documentdb-account"></a>Task: Create a DocumentDB account using CLI

First, create a resource group by replacing these values in the following PowerShell command and running it: 

- <Resource group name/> with the name of the resource group to create.
- <Location/> with the location in which to create the resource group. 

    azure group create <Resource group name> <Location>

For example:

    azure group create new_res_grp westus

Which produces the following output:

    info:    Executing command group create
    + Getting resource group new_res_grp
    + Creating resource group new_res_grp
    info:    Created resource group new_res_grp
    data:    Id:                  /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/new_res_grp
    data:    Name:                new_res_grp
    data:    Location:            West US
    data:    Provisioning State:  Succeeded
    data:    Tags: null
    data:
    info:    group create command OK

Second, create a DocumentDB account in the new resource group by entering the following command at the command prompt:

> [AZURE.TIP] If you run this command in Azure PowerShell or Windows PowerShell you will receive an error about an unexpected token. Instead, run this command at the normal Windows Command Prompt. 

    azure resource create -g <resourceGroupName> -n <databaseAccountName> -r "Microsoft.DocumentDB/databaseAccounts" -o "2014-04-01" -l <databaseAccountLocation> -p "{\"databaseAccountOfferType\":\"Standard\"}" 

For example: 

    azure resource create -g new_res_group -n samplecliacct -r "Microsoft.DocumentDB/databaseAccounts" -o 2014-04-01  -l westus -p "{\"databaseAccountOfferType\":\"Standard\"}"

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

## <a id="deploy-documentdb-from-a-template"></a>Task: Create a DocumentDB account from an ARM template

Use the instructions in this section to create a DocumentDB account with an ARM template and parameters file. This template creates a single DocumentDB account and enables you to describe what you want precisely and repeat it without errors. 

### Step 1: Create a template and parameter file

Create a local template file with the following content. Name the file azuredeploy.json.

    {
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#", 
    "contentVersion": "1.0.0.0", 
    "parameters": {
        "databaseAccountName": {
            "type": "string"
        },
        "location": {
            "type": "string"
        } 			
    },
    "variables": {
    },
    "resources": [
        {
            "apiVersion": "2014-04-01",
            "type": "Microsoft.DocumentDb/databaseAccounts",
            "name": "[parameters('databaseAccountName')]", 
            "location": "[parameters('location')]", 
            "properties": {
                "name": "[parameters('databaseAccountName')]",
                "databaseAccountOfferType":  "Standard"
            }
        }
    ]
    }

This template requires the following parameters:

- A unique DocumentDB database account name.
- The location in which to create the account.

Now create a parameters file to specify the values of those parameters. Copy the following content into a new file and name the file azuredeploy.parameters.json.

    {
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "databaseAccountName": {
            "value": "sampledatabasename"
        },
        "location": {
            "value": "West US"
        }
    }
    }

Update the values "sampledatabasename" and "West US" to the database name and region you'd like to use, then save the file. 

> [AZURE.WARNING] Database account names can only use lowercase letters, numbers, the '-' character and must be between 3 and 50 characters.

### Step 2: Create the DocumentDB account by using the template

Once you have your local files, you must create a resource group for your template deployment and then deploy the template.

To create the resource group, type `azure group create <group name> <location>` with the name of the group you want and the datacenter location into which you want to deploy. This happens quickly:

    azure group create new_res_group westus
    info:    Executing command group create
    + Getting resource group myResourceGroup
    + Creating resource group myResourceGroup
    info:    Created resource group myResourceGroup
    data:    Id:                  /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup
    data:    Name:                myResourceGroup
    data:    Location:            westus
    data:    Provisioning State:  Succeeded
    data:    Tags: null
    data:
    info:    group create command OK

To create a new deployment for your resource group, run the following command and provide the path to the template file, the path to the parameter file, the name of the resource group in which to deploy, and a deployment name (optional). 

    azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

For example: 

    azure group deployment create -f azuredeploy.json -e azuredeploy.parameters.json -g myResourceGroup

You will receive the following type of information: 

    C:\Users\test>azure group deployment create -f azure
    deploy.json -e azuredeploy.parameters.json -g new_res_group
    info:    Executing command group deployment create
    + Initializing template configurations and parameters
    + Creating a deployment
    info:    Created template deployment "azuredeploy"
    + Waiting for deployment to complete
    data:    DeploymentName     : azuredeploy
    data:    ResourceGroupName  : new_res_group
    data:    ProvisioningState  : Succeeded
    data:    Timestamp          : 2015-11-30T18:50:23.6300288Z
    data:    Mode               : Incremental
    data:    Name                 Type    Value
    data:    -------------------  ------  ------------------
    data:    databaseAccountName  String  sampledatabasename
    data:    location             String  West US
    info:    group deployment create command OK

> [AZURE.TIP] If you received the error "Deployment provisioning state was not successful", there is likely a problem with the parameter's you've chosen. Ensure that your database account name is using only valid characters, that the location you've specified is a region in which DocumentDB is available.  

## Next steps

Now that you have a DocumentDB account, the next step is to create a DocumentDB database. You can create a database by using one of the following:

- The preview portal, as described in [Create a DocumentDB database using the Azure preview portal](documentdb-create-database.md).
- The C# .NET samples in the [DatabaseManagement](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples/DatabaseManagement) project of the [azure-documentdb-net](https://github.com/Azure/azure-documentdb-net/tree/master/samples/code-samples) repository on GitHub.
- The [DocumentDB SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx). DocumentDB has .NET, Java, Python, Node.js, and JavaScript API SDKs. 

After creating your database, you need to [add one or more collections](documentdb-create-collection.md) to the database, then [add documents](documentdb-view-json-document-explorer.md) to the collections. 

After you have documents in a collection, you can use [DocumentDB SQL](documentdb-sql-query.md) to [execute queries](documentdb-sql-query.md#executing-queries) against your documents by using the [Query Explorer](documentdb-query-collections-query-explorer.md) in the preview portal, the [REST API](https://msdn.microsoft.com/library/azure/dn781481.aspx), or one of the [SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx).

To learn more about DocumentDB, explore these resources:

-	[Learning path for DocumentDB](https://azure.microsoft.com/documentation/learning-paths/documentdb/)
-	[DocumentDB resource model and concepts](documentdb-resources.md)

For more templates you can use, see [Azure Quickstart templates](http://azure.microsoft.com/documentation/templates/).