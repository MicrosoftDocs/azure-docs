## How to deploy with xplat-cli

1. Login to your Azure account.

        azure login

2. If you have multiple subscriptions, provide the subscription id you wish to use for deployment.

        azure account set <YourSubscriptionNameOrId>

3. Switch to Azure Resource Manager module

        azure config mode arm

4. If you do not have an existing resource group, create a new resource group. Provide the name of the resource group and location that you need for your solution.

        azure group create -n ExampleResourceGroup -l <YourLocationName>

5. To create a new deployment for your resource group, run the following command and provide the necessary parameters. The parameters will include a name for your deployment, the name of your resource group, the path or URL to the template you created, and any other parameters needed for your scenario. 
   
   You have the following options for providing parameter values: 

   - Use inline parameters and a local template.

             azure group deployment create -f <PathToTemplate> {"ParameterName":"ParameterValue"} -g ExampleResourceGroup -n ExampleDeployment

   - Use inline parameters and a link to a template.

             azure group deployment create --template-uri <LinkToTemplate> {"ParameterName":"ParameterValue"} -g ExampleResourceGroup -n ExampleDeployment

   - Use a parameter file.
    
             azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

6. To get information about your latest deployment.

         azure group log show -l ExampleResourceGroup

7. To get detailed information about deployment failures.
      
         azure group log show -l -v ExampleResourceGroup

