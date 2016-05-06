## How to deploy with PowerShell

1. Login to your Azure account.

          Add-AzureAccount

   After providing your credentials, the command returns information about your account.

          Id                             Type       ...
          --                             ----    
          example@contoso.com            User       ...   

2. If you have multiple subscriptions, provide the subscription id you wish to use for deployment. 

          Select-AzureSubscription -SubscriptionID <YourSubscriptionId>

3. Switch to the Azure Resource Manager module.

          Switch-AzureMode AzureResourceManager

4. If you do not have an existing resource group, create a new resource group. Provide the name of the resource group and location that you need for your solution.

        New-AzureResourceGroup -Name ExampleResourceGroup -Location "West US"

   A summary of the new resource group is returned.

        ResourceGroupName : ExampleResourceGroup
        Location          : westus
        ProvisioningState : Succeeded
        Tags              :
        Permissions       :
                    Actions  NotActions
                    =======  ==========
                    *
        ResourceId        : /subscriptions/######/resourceGroups/ExampleResourceGroup

5. To create a new deployment for your resource group, run the **New-AzureResourceGroupDeployment** command and provide the necessary parameters. The parameters will include a name for your deployment, the name of your resource group, the path or URL to the template you created, and any other parameters needed for your scenario. 
   
   You have the following options for providing parameter values: 
   
   - Use inline parameters.

            New-AzureResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathOrLinkToTemplate> -myParameterName "parameterValue"

   - Use a parameter object.

            $parameters = @{"<ParameterName>"="<Parameter Value>"}
            New-AzureResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathOrLinkToTemplate> -TemplateParameterObject $parameters

   - Using a parameter file.

            New-AzureResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile <PathOrLinkToTemplate> -TemplateParameterFile <PathOrLinkToParameterFile>

  When the resource group has been deployed, you will see a summary of the deployment.

             DeploymentName    : ExampleDeployment
             ResourceGroupName : ExampleResourceGroup
             ProvisioningState : Succeeded
             Timestamp         : 4/14/2015 7:00:27 PM
             Mode              : Incremental
             ...

6. To get information about deployment failures.

        Get-AzureResourceGroupLog -ResourceGroup ExampleResourceGroup -Status Failed

7. To get detailed information about deployment failures.

        Get-AzureResourceGroupLog -ResourceGroup ExampleResourceGroup -Status Failed -DetailedOutput
