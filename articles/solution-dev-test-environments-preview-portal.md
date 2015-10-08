<properties
   pageTitle="Development and test environments | Microsoft Azure"
   description="Learn how to use Azure Resource Manager templates to quickly and consistently create and delete development and test environments."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="jimdial"
   manager="carolz"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/08/2015"
   ms.author="jdial"/>

# Development and test environments in Microsoft Azure

Custom applications are typically deployed to multiple development and testing environments before deployment to production. When environments are created on premises, computing resources are either procured or allocated for each environment for each application. The environments often include several physical or virtual machines with specific configurations that are deployed manually or with complex automation scripts. Deployments often take hours and  result in inconsistent configurations across environments.

## Scenario ##

When you provision development and test environments in Microsoft Azure, you only pay for the resources you use.  This article explains how quickly and consistently you can create, maintain, and delete development and test environments using Azure Resource Manager templates and parameter files, as illustrated below.

![Scenario](./media/solution-dev-test-environments-preview-portal/scenario.png)

Three development and testing environments are shown above.  Each has a web application and SQL database.  The names of the application and database in each environment are different.  This article explains how you can use a template to deploy the same resource across environments, and use unique parameter files to specify different configurations for the resources across the environments.

If you're not familiar with Azure Resource Manager concepts, it's recommended that you read the [Azure Resource Manager Overview](resource-group-overview.md) article before reading this article.

You may want to first go through the steps in this article as listed without reading any of the referenced articles to quickly gain some experience using Azure Resource Manager templates. You will no doubt come up with many questions as you go through the steps.  After you've been through the steps once, you'll be able to get answers to most of your questions by experimenting further with the steps and by reading the referenced articles.

## Plan Azure resource use
Once you have a high level design for your application, you can define:

- Which Azure resources your application will include. You might build your application and deploy it as an Azure Web App with an Azure SQL Database.  You might build your application in virtual machines using PHP and MySQL or IIS and SQL Server, or other components. The [Azure App Service, Cloud Services, and Virtual Machines comparison]( app-service-web/choose-web-site-cloud-service-vm.md) article helps you decide which Azure resources you might want to utilize for your application.
- What service level requirements such as availability, security, and scale that your application will meet.

## Using Azure Resource Manager templates
An Azure Resource Manager template defines all of the Azure resources that your application utilizes. Several templates already exist that you can deploy directly in the Azure Preview Portal, or download, modify, and save in a source control system with your application code.  Chances are, an existing template exists that includes the resources you want to use with your application. You can find a list of available templates in the [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/) GitHub repository. 

In the list you'll see a "[201-web-app-sql-database](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-sql-database)" folder. Since many custom applications include a web application and SQL database, this template is used as an example in the remainder of this article to help you understand how to use templates. It's beyond the scope of this article to fully explain everything this template creates and configures, but if you plan to use it to create actual environments in your organization, you'll want to fully understand it by reading the [Provision a web app with a SQL Database](app-service-web/app-service-web-arm-with-sql-database-provision.md) article.

> [AZURE.NOTE] You can deploy the template to Azure directly by clicking the "Deploy to Azure" button on the [Provision a Web App with a SQL Database](http://azure.microsoft.com/documentation/templates/201-web-app-sql-database/) article.  You might find this helpful to learning about templates, but doing so does not enable you to edit, version, and save your template and parmeter values with your application code. The steps in this article explain how you can save and version your template and parameter values with your application code.

  **Step 1:** View the contents of the [azuredeploy.json](https://github.com/Azure/azure-quickstart-templates/blob/master/201-web-app-sql-database/azuredeploy.json) file in the 201-web-app-sql-database folder. This is the Azure Resource Manager template file. In the view mode, click the "[Raw](https://github.com/Azure/azure-quickstart-templates/raw/master/201-web-app-sql-database/azuredeploy.json)" button. With your mouse, select the entire contents of this file and save it to your computer as a file named "TestApp1-Template.json." 

In the template file you'll see a "resources" section, which defines the Azure resources created by this template. Among other resource types, this template creates [Azure Web App](app-service-web/app-service-web-overview.md) and [Azure SQL Database](sql-database/sql-database-technical-overview.md) resources.

You'll also see a "parameters" section, which defines the parameters that each resource can be configured with. Some of the parameters specified in the template have "defaultValue" properties, while others do not. When deploying Azure resources with a template, you must provide values for all parameters that do not have defaultValue properties.  If you do not provide values for parameters with defaultValue properties, then the value specified for the defaultValue parameter in the template is used.

A template defines which Azure resources are created and the parameters each resource can be configured with. Typically you'll want to create the same resources in each development and test environment. You can learn more about templates and how to design your own by reading the [Best practices for designing Azure Resource Manager templates](best-practices-resource-manager-design-templates.md) article.

## Create parameter files

You'll probably want the same Azure resources created in each environment, but you may want the configuration of the resources to be different in each environment.  This is where parameter files come in.   

  **Step 2:** View the contents of the [azuredeploy-parameters.json](https://github.com/Azure/azure-quickstart-templates/blob/master/201-web-app-sql-database/azuredeploy-parameters.json) file in the 201-web-app-sql-database folder. This is the parameter file for the template file you saved in Step 1. In the view mode, click the "[Raw](https://github.com/Azure/azure-quickstart-templates/raw/master/201-web-app-sql-database/azuredeploy-parameters.json)" button. With your mouse, select the entire contents of this file and save it to three separate files on your computer with the following names:

- TestApp1-Parameters-Development.json
- TestApp1-Parameters-Test.json
- TestApp1-Parameters-Pre-Production.json

  **Step 3:** Using any text or JSON editor, edit the Development and Test environment parameter files you created in Step 2, replacing the existing values in the files with the values below.

  --TestApp1-Parameters-Development.json--

| Parameter | Description |
|---|---|
| **siteName** | TestApp1Dev |
| **hostingPlanName** | TestApp1PlanDev |
| **siteLocation** | Central US |
| **serverName** | testapp1dev |
| **serverLocation** | Central US |
| **administratorLogin** | testapp1Admin |
| **administratorLoginPassword** | #testapp1XYZ |
| **databaseName** | testapp1dev |

--TestApp1-Parameters-Test.json--

| Parameter | Description |
|---|---|
| **siteName** | TestApp1Test |
| **hostingPlanName** | TestApp1PlanTest |
| **siteLocation** | Central US |
| **serverName** | testapp1test |
| **serverLocation** | Central US |
| **administratorLogin** | testapp1Admin |
| **administratorLoginPassword** | #testapp1XYZ |
| **databaseName** | testapp1test |

In Step 6, these parameter files will be used to create unique configurations for the Azure Web App and Azure SQL Database resources in the Development and Test environments.

 **Step 4:** Edit the TestApp1-Parameters-Pre-Production.json parameter file you created in Step 2.  Replace the entire contents of the file with the what's below:

	{
	  "$schema" : "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	  "contentVersion" : "1.0.0.0",
	  "parameters" : {
	    "administratorLogin" : {
	      "value" : "testApp1Admin"
	    },
	    "administratorLoginPassword" : {
	      "value" : "testApp1XP49"
	    },
	    "databaseName" : {
	      "value" : "testapp1preprod"
	    },
	    "hostingPlanName" : {
	      "value" : "TestApp1PlanPreProd"
	    },
	    "serverLocation" : {
	      "value" : "Central US"
	    },
	    "serverName" : {
	      "value" : "testapp1preprod"
	    },
	    "siteLocation" : {
	      "value" : "Central US"
	    },
	    "siteName" : {
	      "value" : "TestApp1PreProd"
	    },
	    "sku" : {
	      "value" : "Standard"
	    },
		"requestedServiceObjectiveName" : {
		  "value" : "S1"
	    }
	  }
	}

In the Pre-Production parameters file above, the **sku** and **requestedServiceObjectiveName** parameters were *added*, whereas they weren't added in the Development and Test parameters files. This is because there are default values specified for these parameters in the template, and in the Development and Test environments, the default values are used, but in the Pre-Production environment non-default values for these parameters are used.

The reason non-default values are used for these parameters in the Pre-Production environment is to test values for these parameters that you might prefer for your Production environment.  These parameters all relate to the Azure [Web App hosting plans](http://azure.microsoft.com/pricing/details/app-service/), or **sku** and Azure [SQL Database](http://azure.microsoft.com/pricing/details/sql-database/), or **requestedServiceObjectiveName** that are used by the application.  Different skus and service objective names have different costs and features and support different service level metrics.

The table below lists the default values for these parameters specified in the template and the values that are used instead of the default values in the Pre-Production parameters file.

| Parameter | Default value | Parameter file value |
|---|---|---|
| **sku** | Free | Standard |
| **requestedServiceObjectiveName** | S0 | S1 |

## Create environments
All Azure resources must be created within an [Azure Resource Group](azure-portal/resource-group-portal.md). Resource groups enable you to group Azure resources so they can be managed collectively.  [Permissions](azure-portal/resource-group-rbac.md) can be assigned to resource groups such that specific people within your organization can create, modify, delete, or view them and the resources within them.  Alerts and billing information for resources in the Resource Group can be viewed in the [Azure Preview Portal](https://portal.azure.com). Resource groups are created in an Azure [location](http://azure.microsoft.com/regions/).  In this article, all resources are created in the Central US location. When you start creating actual environments, you'll choose the location that best meets your requirements. 

  **Step 5:** Create resource groups for the Development and Test environments using either of the methods below.  Both methods will achieve the exact same outcome.

  **Method 1:** Azure Command Line Interface (CLI)

  Ensure that you have the CLI [installed](xplat-cli-install.md) on either a Windows, OS X, or Linux computer, and that you've [connected](xplat-cli-connect.md) your organizational ID to your Azure subscription. From the CLI command line, type the command below to create the resource group for the Development environment.

	azure group create "TestApp1-Development" "Central US"

  The command will return the following if it succeeds:

	info:    Executing command group create
	+ Getting resource group TestApp1-Development
	+ Creating resource group TestApp1-Development
	info:    Created resource group TestApp1-Development
	data:    Id:                  /subscriptions/uuuuuuuu-vvvv-wwww-xxxx-yyyy-zzzzzzzzzzzz/resourceGroups/TestApp1-Development
	data:    Name:                TestApp1-Development
	data:    Location:            centralus
	data:    Provisioning State:  Succeeded
	data:    Tags: null
	data:
	info:    group create command OK

  To create the resource group for the Test environment, type the command below:

	azure group create "TestApp1-Test" "Central US"

  To create the resource group for the Pre-Production environment, type the command below:

	azure group create "TestApp1-Pre-Production" "Central US"

  **Method 2:** PowerShell

  Ensure that you have PowerShell installed on a Windows computer and connected to your subscription as detailed in the [How to install and configure Azure PowerShell](powershell-install-configure.md) article. From a PowerShell command prompt, type the command below to create the resource group for the Development environment. If you are using PowerShell 1.0 Preview, the command is **New-AzureRmResourceGroup** as shown below. If you are using a version of PowerShell prior to 1.0 Preview, the command is **New-AzureResourceGroup**.

	New-AzureRmResourceGroup -Name TestApp1-Development -Location "Central US"

  The command will return the following if it succeeds:

	WARNING: The output object of this cmdlet will be modified in a future release.


	ResourceGroupName : TestApp1-Development
	Location          : centralus
	ProvisioningState : Succeeded
	Tags              : 
	Permissions       : 
	                    Actions  NotActions
	                    =======  ==========
	                    *                  
	                    
	ResourceId        : /subscriptions/uuuuuuuu-vvvv-wwww-xxxx-yyyy-zzzzzzzzzzzz/resourceGroups/TestApp1-Development

  To create the resource group for the Test environment, type the command below:

	New-AzureRmResourceGroup -Name TestApp1-Test -Location "Central US"

  To create the resource group for the Pre-Production environment, type the command below:

	New-AzureRmResourceGroup -Name TestApp1-Pre-Production -Location "Central US"

 **Step 6:** Deploy Azure resources to the resource groups for each environment using the template file for the application and the parameter files for each environment using either of the methods below.  Both methods will achieve the exact same outcome.

  **Method 1:** Azure Command Line Interface (CLI)

  From the CLI command line, type the command below to deploy resources to the resource group you created for the Development environment, replacing [path] with the path to the files you saved in previous steps.

	azure group deployment create -g TestApp1-Development -n Deployment1 -f [path]TestApp1-Template.json -e [path]TestApp1-Parameters-Development.json 

  The command will return the following if it succeeds:

	info:    Executing command group deployment create
	+ Initializing template configurations and parameters
	+ Creating a deployment
	info:    Created template deployment "Deployment1"
	+ Waiting for deployment to complete
	data:    DeploymentName     : Deployment1
	data:    ResourceGroupName  : TestApp1-Development
	data:    ProvisioningState  : Succeeded
	data:    Timestamp          : XXXX-XX-XXT20:20:23.5202316Z
	data:    Mode               : Incremental
	data:    Name                           Type          Value
	data:    -----------------------------  ------------  ----------------------------
	data:    siteName                       String        TestApp1Dev
	data:    hostingPlanName                String        TestApp1PlanDev
	data:    siteLocation                   String        Central US
	data:    sku                            String        Free
	data:    workerSize                     String        0
	data:    serverName                     String        testapp1dev
	data:    serverLocation                 String        Central US
	data:    administratorLogin             String        testapp1Admin
	data:    administratorLoginPassword     SecureString  undefined
	data:    databaseName                   String        testapp1dev
	data:    collation                      String        SQL_Latin1_General_CP1_CI_AS
	data:    edition                        String        Standard
	data:    maxSizeBytes                   String        1073741824
	data:    requestedServiceObjectiveName  String        S0
	info:    group deployment create command OKx

  If the command does not succeed, resolve any error messages and try it again.  Common problems are using parameter values that do not adhere to Azure resource naming constraints. Other troubleshooting tips can be found in the [Troubleshooting resource group deployments in Azure](virtual-machines/resource-group-deploy-debug.md) article.

  From the CLI command line, type the command below to deploy resources to the resource group you created for the Test environment, replacing [path] with the path to the files you saved in previous steps.

	azure group deployment create -g TestApp1-Test -n Deployment1 -f [path]TestApp1-Template.json -e [path]TestApp1-Parameters-Test.json

  From the CLI command line, type the command below to deploy resources to the resource group you created for the Pre-Production environment, replacing [path] with the path to the files you saved in previous steps.

	azure group deployment create -g TestApp1-Pre-Production -n Deployment1 -f [path]TestApp1-Template.json -e [path]TestApp1-Parameters-Pre-Production.json
  
  **Method 2:** PowerShell

  From a PowerShell command prompt, type the command below to deploy resources to the resource group you created for the Development environment, replacing [path] with the path to the files you saved in previous steps. If you are using PowerShell 1.0 Preview, the command is **New-AzureRmResourceGroupDeployment** as shown below. If you are using a version of PowerShell prior to 1.0 Preview, the command is **New-AzureResourceGroupDeployment**.

	New-AzureRmResourceGroupDeployment -ResourceGroupName TestApp1-Development -TemplateFile [path]TestApp1-Template.json -TemplateParameterFile [path]TestApp1-Parameters-Development.json -Name Deployment1 

  The command will return the following if it succeeds:

	DeploymentName    : Deployment1
	ResourceGroupName : TestApp1-Development
	ProvisioningState : Succeeded
	Timestamp         : XX/XX/XXXX 2:44:48 PM
	Mode              : Incremental
	TemplateLink      : 
	Parameters        : 
	                    Name             Type                       Value     
	                    ===============  =========================  ==========
	                    siteName         String                     TestApp1Dev
	                    hostingPlanName  String                     TestApp1PlanDev
	                    siteLocation     String                     Central US
	                    sku              String                     Free      
	                    workerSize       String                     0         
	                    serverName       String                     testapp1dev
	                    serverLocation   String                     Central US
	                    administratorLogin  String                     testapp1Admin
	                    administratorLoginPassword  SecureString                         
	                    databaseName     String                     testapp1dev
	                    collation        String                     SQL_Latin1_General_CP1_CI_AS
	                    edition          String                     Standard  
	                    maxSizeBytes     String                     1073741824
	                    requestedServiceObjectiveName  String                     S0        
	                    
	Outputs           :

  If the command does not succeed, resolve any error messages and try it again.  Common problems are using parameter values that do not adhere to Azure resource naming constraints. Other troubleshooting tips can be found in the [Troubleshooting resource group deployments in Azure](virtual-machines/resource-group-deploy-debug.md) article.

  From a PowerShell command prompt, type the command below to deploy resources to the resource group you created for the Test environment, replacing [path] with the path to the files you saved in previous steps.

	New-AzureRmResourceGroupDeployment -ResourceGroupName TestApp1-Test -TemplateFile [path]TestApp1-Template.json -TemplateParameterFile [path]TestApp1-Parameters-Test.json -Name Deployment1

  From a PowerShell command prompt, type the command below to deploy resources to the resource group you created for the Pre-Production environment, replacing [path] with the path to the files you saved in previous steps.

	New-AzureRmResourceGroupDeployment -ResourceGroupName TestApp1-Pre-Production -TemplateFile [path]TestApp1-Template.json -TemplateParameterFile [path]TestApp1-Parameters-Pre-Production.json -Name Deployment1

The template and parameter files can be versioned and maintained with your application code in a source control system.  You could also save the commands above to script files and save them with your code as well.

## Maintain environments
Throughout development, configuration of the Azure resources in the different environments may be inconsistently changed intentionally or accidentally.  This can cause unnecessary troubleshooting and problem resolution during the application development cycle.

  **Step 7:** Change the environments. Open the [Azure Preview Portal](https://portal.azure.com) and sign into it with the same account you used to complete the steps above. As shown in the picture below, click Browse All-->Resource groups (you may need to scroll down in the Browse blade to see Resource groups). You'll see all three resource groups you created using one of the methods from previous steps.  Click on the TestApp1-Development resource group as shown below.

  ![Portal](./media/solution-dev-test-environments-preview-portal/portal1.png)

  After clicking the TestApp1-Development resource group you'll see the blade that lists the resources created by the template in the resource group deployment you completed in a previous step.  Delete the TestApp1Dev Web App resource by clicking TestApp1Dev-->Delete as shown below.

  ![Portal](./media/solution-dev-test-environments-preview-portal/portal2.png)

  Click "Yes" when the portal prompts you as to whether you're sure you want to delete the resource.  The contents of the resource group are now different than they should be. You can further experiment by deleting multiple resources from multiple resource groups or even changing configuration settings for some of the resources.

> [AZURE.NOTE] Instead of using the Azure Preview Portal to delete a resource from a resource group, you could use the PowerShell [Remove-AzureResource](https://msdn.microsoft.com/library/azure/dn757676.aspx) command or the or "azure resource delete" command from the CLI to accomplish the same task.  

  **Step 8:** Re-deploy the environments to the resource groups using the same commands you used in Step 6, but replace "Deployment1" with "Deployment2." As shown in the Summary section of the picture below, you'll see that all of the resources from the template exist in the TestApp1-Development resource group again. One of the advantages of deploying your environments with Azure Resource Manager templates is that you can easily re-deploy the environments back to a known state at any time.

  ![Portal](./media/solution-dev-test-environments-preview-portal/portal3.png)

  If you click on the text under "Last deployment" in the picture, you'll see a blade that shows the deployment history for the resource group.  Since you used the name "Deployment1" for the first deployment and "Deployment2" for the second deployment, you'll have two entries.  Clicking on a deployment will display a blade that shows the results for each deployment.

## Delete environments
Once you're finished with an environment, you'll want to delete it so you don't incur usage charges for Azure resources you're no longer using.  Deleting environments is even easier than creating them.  In previous steps, individual Azure Resource Groups were created for each environment. When you delete a resource group, all of the resources it contains are also deleted. With that in mind, either of the methods below will delete the environments (resource groups), along with all the Azure resources within them that you deployed previously.

  **Step 9:** Delete the environments using either of the methods below.  Both methods will achieve the exact same outcome.

  **Method 1: Azure CLI**

  From a CLI prompt, type the following:

	azure group delete "TestApp1-Development"

  The command will return the following if you enter "y" when prompted:

	info:    Executing command group delete
	Delete resource group TestApp1-Development? [y/n] y
	+ Deleting resource group TestApp1-Development
	info:    group delete command OK

  From a CLI prompt, type the following to delete the remaining environments:

	azure group delete "TestApp1-Test"
	azure group delete "TestApp1-Pre-Production"
  
  **Method 2:** PowerShell

  If you are using PowerShell 1.0 Preview, the command to delete the resource group is **Remove-AzureRmResourceGroup** as shown below. If you are using a version of PowerShell prior to 1.0 Preview, the command is **Remove-AzureResourceGroup**. From a PowerShell prompt, type the following:    

	Remove-AzureRmResourceGroup -Name TestApp1-Development

  The command will return the following if you enter "y" when prompted:

	Confirm
	Are you sure you want to remove resource group 'TestApp1-Development'
	[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y

  From a PowerShell prompt, type the following to delete the remaining environments:

	Remove-AzureRmResourceGroup -Name TestApp1-Test
	Remove-AzureRmResourceGroup -Name TestApp1-Pre-Production

Regardless of the method you use, once the commands finish executing, the resource groups and all of the resources they contained will no longer exist, and you'll no longer incur billing expenses for the resources.  

To minimize the Azure resource utilization expenses you incur during application development you can use [Azure Automation](automation/automation-intro.md) to schedule jobs that:

- Stop virtual machines at the end of each day and restart them at the start of each day.
- Delete whole environments at the end of each day and re-create them at the start of each day.
 
Now that you've experienced how easy it is to create, maintain, and delete development and test environments, you can learn more about what you just did by further experimenting with the steps above and reading the references contained in this article.

## Next steps

- [Delegate administrative control](role-based-access-control-configure.md) to different resources in each environment by assigning Microsoft Azure AD groups or users to specific roles that have the ability to perform a subset of operations on Azure resources.
- [Assign tags](resource-group-using-tags.md) to the resource groups for each environment and/or the individual resources. You might add an "Environment" tag to your resource groups and set its value to correspond to your environment names. Tags can be particularly helpful when you need to organize resources for billing or management.
- Monitor alerts and billing for resource group resources in the [Azure Preview Portal](https://portal.azure.com).

## Additional resources

- [Create and deploy Azure Resource Manager templates in Visual Studio](http://msdn.microsoft.com/library/azure/Dn872471.aspx) with Azure SDK 2.6 installed.
- Create your application using [Visual Studio Enterprise](https://www.visualstudio.com/products/visual-studio-enterprise-vs), [Visual Studio Code](http://www.visualstudio.com/products/code-vs), or [Web Matrix](http://www.microsoft.com/web/webmatrix/).
- [Deploy a Web App](app-service-web/web-sites-deploy.md) to the environments you created.
- Use [Visual Studio Release Management](http://msdn.microsoft.com/Library/vs/alm/Release/overview) to create managed, continuous deployment pipelines to release quickly, easily, and often.
- Request an invite for the preview of [Azure Dev/Test Lab](http://azure.microsoft.com/campaigns/devtest-lab/). It enables you to manage dev and test lab environments using templates, and configure quotas and policies for use within your organization.
