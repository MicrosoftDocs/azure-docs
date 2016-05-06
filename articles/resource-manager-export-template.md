<properties 
	pageTitle="Export Azure Resource Manager template | Microsoft Azure" 
	description="Use Azure Resource Manage to export a template from an existing resource group." 
	services="azure-resource-manager" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="05/05/2016" 
	ms.author="tomfitz"/>

# Learn Azure Resource Manager templates by exporting a template from existing resources

Understanding how to construct Azure Resource Manager templates can be daunting, but Resource Manager helps you with that task by
enabling you to export a template from existing resources in your subscription. It doesn't matter how you created the resources, 
or how you have modified them, Resource Manager can generate a template from those resources, 
and you can use that generated template to learn about the template syntax. You can also use this template to automate the re-deploy of your 
infrastructure as needed.

In this tutorial, you will create a storage account through the portal, and export the template for that storage account. Then, you will modify the resource group containing the 
storage account by adding a virtual network to it, and export a new template that represents its current state. Although this topic focuses on a simplified infrastructure, you could use these same steps 
to export a template for more complicated solutions.

You have two options for exporting a template:

1. **Generate a template that represents the current state of your resource group** - This is helpful when you have made changes to a resource group, and need to retrieve the JSON representation of its current state. However, the generated template contains only a minimal number of parameters and no variables. Most of the values in the template are hard-coded. Before deploying the generated template, you may wish to convert more of the values into parameters so you can customize the deployment for different environments.
2. **Retrieve the template that was used for a particular deployment** - This is helpful when you need to view the actual template that was used to deploy resources. Suppose you have deployed a solution through the Marketplace and now want to see the actual template used for the deployment. The template will include all of the parameters and variables defined for the original deployment. However, if someone in your organization has made changes to the resource group outside of what is defined in the template, this template will not represent the current state of the resource group.

> [AZURE.NOTE] The export template feature is in preview, and not all resource types currently support exporting a template. When attempting to export a template, you may see an error that states some resources were not exported. If needed, you can manually add these resources to your template.

## Create the storage account

1. In the [Azure Portal](https://portal.azure.com), select **New**, **Data + Storage**, and **Storage account**.

      ![create storage](./media/resource-manager-export-template/create-storage.png)

2. Provide values to set up your storage account. You must give the storage account a name that is unique across Azure. Create a new resource group named **ExampleStorageGroup**. You can use the default values for the other properties.

      ![provide values for storage](./media/resource-manager-export-template/provide-storage-values.png)

After the deployment completes, your subscription contains the storage account. In the next section, you will export the template.

## Export template for a deployment
   
1. Navigate to the resource group blade for your new resource group. You will notice the result of the last deployment is listed. Select this link.

      ![resource group blade](./media/resource-manager-export-template/resource-group-blade.png)
   
2. You will see a history of deployments for the group. In your case, there is probably only one deployment listed. Select this deployment.

     ![last deployment](./media/resource-manager-export-template/last-deployment.png)

3. A summary of the deployment is displayed. The summary includes the status of the deployment and its operations, and the values you provided for parameters. To see the template that was used for the deployment, select **View template**.

     ![view deployment summary](./media/resource-manager-export-template/deployment-summary.png)

4. Resource Manager generates 5 files for you. They are:

   1. The template that defines the infrastructure for your solution. It contains all of the parameters and variables as originally defined by the template creator. 

   2. A parameter file that you can use to pass in values during deployment. It contains the values that you provided during the first deployment, but you can change any of these values when re-deploying the template.

   3. An Azure PowerShell script file that you can use to deploy the template.

   4. An Azure CLI script file that you can use to deploy the template.
   
   5. A .NET class that you can use to deploy the template.

     Let's pay particular attention to the template. Your template should look similar to:
   
          {
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
              "name": {
                "type": "String"
              },
              "accountType": {
                "type": "String"
              },
              "location": {
                "type": "String"
              },
              "encryptionEnabled": {
                "defaultValue": false,
                "type": "Bool"
              }
            },
            "resources": [
              {
                "type": "Microsoft.Storage/storageAccounts",
                "sku": {
                  "name": "[parameters('accountType')]"
                },
                "kind": "Storage",
                "name": "[parameters('name')]",
                "apiVersion": "2016-01-01",
                "location": "[parameters('location')]",
                "properties": {
                  "encryption": {
                    "services": {
                      "blob": {
                        "enabled": "[parameters('encryptionEnabled')]"
                      }
                    },
                    "keySource": "Microsoft.Storage"
                  }
                }
              } 
            ]
          }
   
   Notice that it defines parameters for the storage account name, type, location, and whether encryption is enabled (which has a default value of **false**). Within 
   the **resources** section, you will see the definition for the storage account to deploy.  
   Wherever you see brackets, you will find an expression that is evaluated during deployment. The bracketed expressions shown above are used to get parameter values during deployment. 
   Therefore, the values of the parameters are used to set properties on the storage account. There are many more expressions you can use, and you will see examples of another expressions 
   later in this topic. For the complete list, see [Azure Resource Manager template functions](resource-group-template-functions.md).
   
   To learn more about the structure of a template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md). For step-by-step guidance on creating a template and figuring out the properties to set, see [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md).

5. The portal offers three options for working with this template. You can re-deploy the template right now, download all of the files locally, or save the files to your Azure account for later use through the portal. Select **Download** to save a .zip file that contains all of the exported files.

   ![download template](./media/resource-manager-export-template/download-template.png)

You now have a local copy of the template that was used to deploy your solution through the portal. 

## Add a virtual network

The template you downloaded in the previous section represented the infrastructure for that original deployment, but it will not account for any changes you make after the deployment.
To illustrate this issue, let's modify the resource group by adding a virtual network through the portal.

1. In the resource group blade, select **Add** and pick **virtual network** from the available resources.
   
2. Provide values when creating your virtual network, and select **Create**.

   ![set alert](./media/resource-manager-export-template/create-vnet.png)
   
3. After the virtual network has successfully deployed to your resource group, look again at the deployment history. You will now see two deployments. Select the most recent deployment.

   ![deployment history](./media/resource-manager-export-template/deployment-history.png)
   
4. Look at the template for that deployment. Notice that it only defines the virtual network. To re-deploy the entire infrastructure to a new environment would require deploying both templates, which is not convenient or reliable. Instead, you want all of your infrastructure defined within a single template. In the next section, you will generate a new template that represents the current state of the resource group.

## Export template for a resource group

1. From the resource group blade, you can export the template that represents the current state of the resource group. To view the template for a resource group, select **Export template**.

   ![export resource group](./media/resource-manager-export-template/export-resource-group.png)

2. You will again see the 5 files generated by Resource Manager, but this time the template is a little different from the earlier templates. The template generated from the resource group only has 2 parameters (one for the storage account name, and one for the virtual network name).

        "parameters": {
          "virtualNetworks_ExampleVNET_name": {
            "defaultValue": "ExampleVNET",
            "type": "String"
          },
          "storageAccounts_storagedemoexport_name": {
            "defaultValue": "storagedemoexport",
            "type": "String"
          }
        },
        
     In this case, Resource Manager is not retrieving the actual template used during deployment. Instead, it creates a template based on the current resources. Resource Manager does know which values 
     you want to pass in as parameters, so it hard-codes most values based on the current value in the resource group. For example, the storage account location and replication value are set to:
     
        "location": "northeurope",
        "tags": {},
          "properties": {
            "accountType": "Standard_RAGRS"
        },

3. Download the template so you can work on it locally.

## Customize the template

In this section, you will modify the generated template so you can re-use the template when deploying these resources to other environments. In particular, you may like that Resource Manager generated the template 
for you but you wish to pass in more values as parameters during deployment. The parameters give you more flexibility to specify different settings based on your scenario. 
When customizing the template, you will provide two conveniences that simplify deploying your template. First, you will no longer have to guess a unique name for your storage account. Instead, the template 
will create a unique name. Second, you will specify the the permitted values for the storage account types right in the template. 

1. Find the .zip file that you downloaded and extract the contents.

2. Open the template.json file from the extracted files. If you have Visual Studio or Visual Code, you can use either one for editing the template. Otherwise, you can use any json editor or text editor. 

3. To enable passing the values you might want to specify during deployment, replace the **parameters** section with the following parameter definitions. Notice that the allowed values for **storageAccount_accountType**. If you accidentally provide an invalid value, that error is recognized before the deployment starts. Also, notice that you are only providing a prefix for the storage account name, and the prefix is limited to 11 characters. You will see how to create a unique name in the next step.

        "parameters": {
          "storageAccount_prefix": {
            "type": "string",
            "maxLength": 11
          },
          "storageAccount_accountType": {
            "defaultValue": "Standard_RAGRS",
            "type": "string",
            "allowedValues": [
              "Standard_LRS",
              "Standard_ZRS",
              "Standard_GRS",
              "Standard_RAGRS",
              "Premium_LRS"
            ]
          },
          "virtualNetwork_name": {
            "type": "string"
          },
          "addressPrefix": {
            "defaultValue": "10.0.0.0/16",
            "type": "string"
          },
          "subnetName": {
            "defaultValue": "subnet-1",
            "type": "string"
          },
          "subnetAddressPrefix": {
            "defaultValue": "10.0.0.0/24",
            "type": "string"
          }
        },
       
4. Below the **parameters** section, add a **variables** section with the following code. The **storageAccount_name** variable concatenates the prefix from the parameter to a unique string that is generated based on the identifier of the resource group.

        "variables": {
          "storageAccount_name": "[concat(parameters('storageAccount_prefix'), uniqueString(resourceGroup().id))]"
        },

5. To use the parameters and variable in the resource definitions, replace the **resources** section with the following definitions. Notice that the location of the resources is set to use the same location as the resource group through the **resourceGroup().location** expression.

        "resources": [
          {
            "type": "Microsoft.Network/virtualNetworks",
            "name": "[parameters('virtualNetwork_name')]",
            "apiVersion": "2015-06-15",
            "location": "[resourceGroup().location]",
            "properties": {
              "addressSpace": {
                "addressPrefixes": [
                  "[parameters('addressPrefix')]"
                ]
              },
              "subnets": [
                {
                  "name": "[parameters('subnetName')]",
                  "properties": {
                    "addressPrefix": "[parameters('subnetAddressPrefix')]"
                  }
                }
              ]
            },
            "dependsOn": []
          },
          {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[variables('storageAccount_name')]",
            "apiVersion": "2015-06-15",
            "location": "[resourceGroup().location]",
            "tags": {},
            "properties": {
                "accountType": "[parameters('storageAccount_accountType')]"
            },
            "dependsOn": []
          }
        ]

6. Deploy your customized template to your Azure subscription. If needed, install either [Azure PowerShell](powershell-install-configure.md) or [Azure CLI](xplat-cli-install.md).

     For PowerShell, run:
   
        # create a new resource group
        New-AzureRmResourceGroup -Name ExampleResourceGroup -Location "West Europe"

        # deploy the template to the resource group
        New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile {path-to-file}\template.json
        
     For CLI, run:
   
        azure group create -n ExampleResourceGroup -l "West Europe"

        azure group deployment create -f {path-to-file}\azuredeploy.json -g ExampleResourceGroup -n ExampleDeployment

## Next steps

Congratulations! You have learned how to export a template from resources you created in the portal, and customize that template to use in future deployments.

- To learn about how templates are structured, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
- For a walkthrough of creating a template that defines a more complicated solution, see [Resource Manager Template Walkthrough](resource-manager-template-walkthrough.md). 
- To see how to export a template through PowerShell, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md).
- To see how to export a template through Azure CLI, see [Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](xplat-cli-azure-resource-manager.md). 

