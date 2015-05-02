## How to deploy with xplat-cli

1. Login to your Azure account.

        azure login

  After providing your credentials, the command returns the result of your login.
  
        ...
        info:    login command OK

2. If you have multiple subscriptions, provide the subscription id you wish to use for deployment.

        azure account set <YourSubscriptionNameOrId>

3. Switch to Azure Resource Manager module

        azure config mode arm
        
   You will receive confirmation of the new mode.
   
        info:     New mode is arm

4. If you do not have an existing resource group, create a new resource group. Provide the name of the resource group and location that you need for your solution.

        azure group create -n ExampleResourceGroup -l "West US"
        
   A summary of the new resource group is returned.
   
        info:    Executing command group create
        + Getting resource group ExampleResourceGroup
        + Creating resource group ExampleResourceGroup
        info:    Created resource group ExampleResourceGroup
        data:    Id:                  /subscriptions/####/resourceGroups/ExampleResourceGroup
        data:    Name:                ExampleResourceGroup
        data:    Location:            westus
        data:    Provisioning State:  Succeeded
        data:    Tags:
        data:
        info:    group create command OK

5. To create a new deployment for your resource group, run the following command and provide the necessary parameters. The parameters will include a name for your deployment, the name of your resource group, the path or URL to the template you created, and any other parameters needed for your scenario. 
   
   You have the following options for providing parameter values: 

   - Use inline parameters and a local template.

             azure group deployment create -f <PathToTemplate> {"ParameterName":"ParameterValue"} -g ExampleResourceGroup -n ExampleDeployment

   - Use inline parameters and a link to a template.

             azure group deployment create --template-uri <LinkToTemplate> {"ParameterName":"ParameterValue"} -g ExampleResourceGroup -n ExampleDeployment

   - Use a parameter file.
    
             azure group deployment create -f <PathToTemplate> -e <PathToParameterFile> -g ExampleResourceGroup -n ExampleDeployment

  When the resource group has been deployed, you will see a summary of the deployment.
  
         info:    Executing command group deployment create
         + Initializing template configurations and parameters
         + Creating a deployment
         ...
         info:    group deployment create command OK


6. To get information about your latest deployment.

         azure group log show -l ExampleResourceGroup

7. To get detailed information about deployment failures.
      
         azure group log show -l -v ExampleResourceGroup

