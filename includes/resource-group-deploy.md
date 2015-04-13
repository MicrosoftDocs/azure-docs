## How to use PowerShell

>[AZURE.NOTE] To install the latest Azure PowerShell cmdlets, see [How to install and configure Azure PowerShell](./powershell-install-configure.md).

1. Login to your Azure account.

      Add-AzureAccount

2. If you have multiple subscriptions, select your desired subscription.

      Select-AzureSubscription -SubscriptionID <YourSubscriptionId>

3. Switch to the Azure Resource Manager module.

      Switch-AzureMode AzureResourceManager

4. If you do not have an existing resource group, create a new resource group.

    New-AzureResourceGroup -Name <YourResourceGroupName> -Location <YourLocationName>

5. To create a new deployment for your resource group, you have the following options:
    - Use inline parameters.

        New-AzureResourceGroupDeployment -Name <YourDeploymentName> -ResourceGroupName <YourResourceGroupName> -TemplateFile <PathOrLinkToTemplate> -myParameterName "parameterValue"

   - Use a parameter object.

       $parameters = @{"<ParameterName>"="<Parameter Value>"}
       New-AzureResourceGroupDeployment -Name <YourDeploymentName> -ResourceGroupName <YourResourceGroupName> -TemplateFile <PathOrLinkToTemplate> -TemplateParameterObject $parameters

   - Using a parameter file.

       New-AzureResourceGroupDeployment -Name <YourDeploymentName> -ResourceGroupName <YourResourceGroupName> -TemplateFile <PathOrLinkToTemplate> -TemplateParameterFile <PathOrLinkToParameterFile>

6. To get information about deployment failures.

    Get-AzureResourceGroupLog -ResourceGroup <YourResourceGroupName> -Status Failed

7. To get detailed information about deployment failures.

    Get-AzureResourceGroupLog -ResourceGroup <YourResourceGroupName> -Status Failed -DetailedOutput

## How to use xplat-cli

>[AZURE.NOTE] To install the latest Azure xplat cli, see [Install and Configure the Microsoft Azure Cross-Platform Command-Line Interface](./xplat-cli.md).

1. Login to your Azure account.

    azure login

2. If you have multiple subscriptions, select your desired subscription.

    azure account set <YourSubscriptionNameOrId>

3. Switch to Azure Resource Manager module

    azure config mode arm

4. If you do not have an existing resource group, create a new resource group.

    azure group create -n <YourResourceGroupName> -l <YourLocationName>

5. To create a new deployment for your resource group, you have the following options:
   - Use inline parameters and a local template.

         azure group deployment create -f <PathToTemplate> {"ParameterName":"ParameterValue"} -g <ResourceGroupName> -n <YourDeploymentName>

   - Use inline parameters and a link to a template.

         azure group deployment create --template-uri <LinkToTemplate> {"ParameterName":"ParameterValue"} -g <ResourceGroupName> -n <YourDeploymentName>

   - Use a parameter file.
    
         azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g <ResourceGroupName> -n <YourDeploymentName>

6. To get information about your latest deployment.

     azure group log show -l <ResourceGroupName>

7. To get detailed information about deployment failures.
      
     azure group log show -l -v <ResourceGroupName>
