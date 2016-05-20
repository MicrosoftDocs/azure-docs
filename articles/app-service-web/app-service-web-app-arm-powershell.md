# Azure Web App ARM PowerShell#

With the release of Microsoft Azure PowerShell version 1.0.0 new commands have been added, that give the user the ability to use ARM based PowerShell commands to manage Web Apps.

To learn about managing Resource Groups, see [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md)

## Managing App Service Plans ##

### Create an App Service Plan ###
To create a new app service plan, use the **New-AzureRmAppServicePlan** cmdlet.

Following are descriptions of the different parameters:

- 	**Name**: name of the app service plan
- 	**Location**: service plan location
- 	**ResourceGroupName**: resource group that includes the newly created app service plan
- 	**Tier**:  the desired pricing tier (Default is Free, other options are Shared, Basic, Standard, and Premium)
- 	**WorkerSize**: the size of workers (Default is small if the Tier parameter was specified as Basic, Standard or Premium)
- 	**NumberofWorkers**: the number of workers in the app service plan (Default value is 1). 

	New-AzureRmAppServicePlan -Name ContosoAppServicePlan -Location "South Central US" -ResourceGroupName  ContosoAzureResourceGroup -Tier Premium -WorkerSize Large -NumberofWorkers 10

### List Existing App Service Plans ###

To list the existing app service plans, use **Get-AzureRmAppServicePlan** cmdlet.

To list all app service plans under your subscription, use: Get-AzureRmAppServicePlan

To list all app service plans under a specific resource group, use:

    Get-AzureRmAppServicePlan -ResourceGroupname ContosoAzureResourceGroup

To get a specific app service plan, use:

    Get-AzureRmAppServicePlan -Name ContosoAppServicePlan


### Configure an existing App Service Plan ###

To change the settings for an existing app service plan, use the **Set-AzureRmAppServicePlan** cmdlet. You can change the tier, worker size, and the number of workers 

    Set-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Tier Standard -WorkerSize Medium -NumberofWorkers 9

### Delete an existing App Service Plan ###

To delete an existing app service plan, all assigned web apps need to be moved or deleted first and then using the **Remove-AzureRmAppServicePlan** cmdlet you can delete the app service plan.

    Remove-AzureRmAppServicePlan -Name ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup

## Managing App Service Web Apps ##

### Create a new Web App ###

To create a new web app, use the **New-AzureRmWebApp** cmdlet.

Following are descriptions of the different parameters:

- **Name**: name for the web app
- **AppServicePlan**: service plan to host the web app
- **ResourceGroupName**: resource group that hosts the App service plan
- **Location**: the web app location.

    New-AzureRmWebApp -Name ContosoWebApp -AppServicePlan ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Location "South Central US"

### Create a new Web App in an App Service Environment ###

To create a new web app in an App Service Environment (ASE), the same **New-AzureRmWebApp** command can be used with extra parameters to specify the ASE name and the resource group name that the ASE belongs to.

    New-AzureRmWebApp -Name ContosoWebApp -AppServicePlan ContosoAppServicePlan -ResourceGroupName ContosoAzureResourceGroup -Location "South Central US"  -ASEName ContosoASEName -ASEResourceGroupName ContosoASEResourceGroupName

To learn more about app service environment, check [Introduction to App Service Environment](app-service-app-service-environment-intro.md)

### List existing Web Apps ###

To list the existing web apps, use the **Get-AzureRmWebApp** cmdlet.

To list all web apps under your subscription, use:

    Get-AzureRmWebApp

To list all web apps under a specific resource group, use:

    Get-AzureRmWebApp -ResourceGroupname ContosoAzureResourceGroup

To get a specific web app, use:

    Get-AzureRmWebApp -Name ContosoWebApp

### Configure an existing Web App ###

To change the settings and configurations for an existing web app, use the **Set-AzureRmWebApp** cmdlet.  Settings can be changed for a full list. For more details, check the [Cmdlet reference link](https://msdn.microsoft.com/library/mt652487.aspx)

Example (1): use this cmdlet to change connection strings

	$connectionstring = @{ “ContosoConn1” = @{ Type = “MySql”; Value = “MySqlConn”}; “ContosoConn2” = @{ Type = “SQLAzure”; Value = “SQLAzureConn”} }
	Set-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -ConnectionStrings $connectionstring

Example (2):  set the web app to run in 64-bit mode

	Set-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -Use32BitWorkerProcess $False

### Change the state of an existing Web App ###

#### Restart a web app ####

To restart a web app, you must specify the name and resource group of the web app.

    Restart-AzureRmWebapp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

#### Stop a web app ####

To stop a web app, you must specify the name and resource group of the web app.

    Stop-AzureRmWebapp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

#### Start a web app ####

To start a web app, you must specify the name and resource group of the web app.

    Start-AzureRmWebapp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

### Manage Web App Publishing profiles ###

Each web app has a publishing profile that is needed to publish your apps, a number of operations can be executed on publishing profiles.

#### Get Publishing Profile ####

To get the publishing profile for a web app, use:

    Get-AzureRmWebAppPublishingProfile -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup -OutputFile .\publishingprofile.txt

Note that this will echo the publishing profile to the command line as well output the publishing profile to a text file.

#### Reset Publishing Profile ####

To reset the publishing profile for a web app, use:

    Reset-AzureRmWebAppPublishingProfile -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup

### Manage Web App Certificates ###

To learn about how to manage web app certificates, see [SSL Certificates binding using PowerShell](app-service-web-app-powerhell-ssl-binding.md)

### Delete an existing Web App ###

To delete an existing web app you can use the **Remove-AzureRmWebApp** cmdlet, you need to specify the name of the web app and the resource group name.

    Remove-AzureRmWebApp -Name ContosoWebApp -ResourceGroupName ContosoAzureResourceGroup


### References ###
- [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md)
- [Introduction to App Service Environment](app-service-app-service-environment-intro.md)
- [SSL Certificates binding using PowerShell](app-service-web-app-powerhell-ssl-binding.md)
- [Azure Cmdlet Reference of Web App ARM PowerShell Cmdlets](https://msdn.microsoft.com/library/mt619237.aspx)