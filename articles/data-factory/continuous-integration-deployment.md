---
title: Continuous integration and delivery in Azure Data Factory | Microsoft Docs
description: Learn how to use continuous integration and delivery to move Data Factory pipelines from one environment (development, test, production) to another.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/17/2019
author: djpmsft
ms.author: daperlov
ms.reviewer: maghan
manager: craigg
---
# Continuous integration and delivery (CI/CD) in Azure Data Factory

## Overview

Continuous Integration is the practice of testing each change done to your codebase automatically and as early as possible. Continuous Delivery follows the testing that happens during Continuous Integration and pushes changes to a staging or production system.

In Azure Data Factory, continuous integration & delivery means moving Data Factory pipelines from one environment (development, test, production) to another. To do continuous integration & delivery, you can use Data Factory UX integration with Azure Resource Manager templates. The Data Factory UX can generate a Resource Manager template from the **ARM template** dropdown. When you select **Export ARM template**, the portal generates the Resource Manager template for the data factory and a configuration file that includes all your connections strings and other parameters. Then you've to create one configuration file for each environment (development, test, production). The main Resource Manager template file remains the same for all the environments.

For a nine-minute introduction and demonstration of this feature, watch the following video:

> [!VIDEO https://channel9.msdn.com/Shows/Azure-Friday/Continuous-integration-and-deployment-using-Azure-Data-Factory/player]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Continuous integration lifecycle

Below is a sample overview of the continuous integration and delivery lifecycle in an Azure Data factory configured with Azure Repos Git. For more information on how to configure a Git Repository, see [Source control in Azure Data Factory](source-control.md).

1.  A development data factory is created and configured with Azure Repos Git where all developers have permission to author Data Factory resources such as pipelines and datasets.

1.  As the developers make changes in their feature branch, they debug their pipeline runs with their most recent changes. For more information on how to debug a pipeline run, see [Iterative development and debugging with Azure Data Factory](iterative-development-debugging.md).

1.  Once the developers are satisfied with their changes, they create a pull request from their feature branch to the master or collaboration branch to get their changes reviewed by peers.

1.  After the pull request is approved and changes are merged in the master branch, they can publish to the development factory.

1.  When the team is ready to deploy the changes to the test factory and then to the production factory, they export the Resource Manager template from the master branch.

1.  The exported Resource Manager template gets deployed with different parameter files to the test factory and the production factory.

## Create a Resource Manager template for each environment

From the **ARM template** dropdown, select **Export ARM template** to export the Resource Manager template for your data factory in the development environment.

![](media/continuous-integration-deployment/continuous-integration-image1.png)

In your test and production data factories, select **Import ARM template**. This action takes you to the Azure portal, where you can import the exported template. Select **Build your own template in the editor** to open the Resource Manager template editor.

![](media/continuous-integration-deployment/continuous-integration-image3.png) 

Click **Load file** and select the generated Resource Manager template.

![](media/continuous-integration-deployment/continuous-integration-image4.png)

In the settings pane, enter the configuration values such as linked service credentials. Once you're done, click **Purchase** to deploy the Resource Manager template.

![](media/continuous-integration-deployment/continuous-integration-image5.png)

### Connection strings

Information on how to configure connection strings can be found in each connector's article. For example, for Azure SQL Database, see [Copy data to or from Azure SQL Database by using Azure Data Factory](connector-azure-sql-database.md). To verify a  connection string, you can open the code view for the resource in the Data Factory UX. In code view, the password or account key portion of the connection string is removed. To open code view, select the icon highlighted in the following screenshot.

![Open code view to see connection string](media/continuous-integration-deployment/continuous-integration-codeview.png)

## Automate continuous integration with Azure Pipelines releases

Below is a guide to set up an Azure Pipelines release, which automates the deployment of a data factory to multiple environments.

![Diagram of continuous integration with Azure Pipelines](media/continuous-integration-deployment/continuous-integration-image12.png)

### Requirements

-   An Azure subscription linked to Team Foundation Server or Azure Repos using the [Azure Resource Manager service endpoint](https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints#sep-azure-rm).

-   A Data Factory configured with Azure Repos Git integration.

-   An [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) containing the secrets for each environment.

### Set up an Azure Pipelines release

1.  In the [Azure DevOps user experience](https://dev.azure.com/), open the project configured with your Data Factory.

1.  On the left side of the page, click  **Pipelines** and then select **Releases**.

    ![](media/continuous-integration-deployment/continuous-integration-image6.png)

1.  Select **New pipeline** or if you have existing pipelines, **New**, and then **New release pipeline**.

1.  Select the **Empty job** template.

    ![](media/continuous-integration-deployment/continuous-integration-image13.png)

1.  In the **Stage name** field, enter the name of your environment.

1.  Select **Add an artifact**, and select the same repository configured with your Data Factory. Choose `adf_publish` as the default branch with latest default version.

    ![](media/continuous-integration-deployment/continuous-integration-image7.png)

1.  Add an Azure Resource Manager Deployment task:

    a.  In the stage view, click the **View stage tasks** link.

    ![](media/continuous-integration-deployment/continuous-integration-image14.png)

    b.  Create a new task. Search for **Azure Resource Group Deployment**, and click **Add**.

    c.  In the Deployment task, choose the subscription, resource group, and location for the target Data Factory, and provide credentials if necessary.

    d.  In the action dropdown, select **Create or update resource group**.

    e.  Select **…** in the **Template** field. Browse for the Azure Resource Manager template create via the **Import ARM Template** step in [Create a resource manager template for each environment](continuous-integration-deployment.md#create-a-resource-manager-template-for-each-environment). Look for this file in the folder `<FactoryName>` of the `adf_publish` branch.

    f.  Select **…** in the **Template parameters field.** to choose the parameters file. Choose the correct file depending on whether you created a copy or you’re using the default file *ARMTemplateParametersForFactory.json*.

    g.  Select **…** next to the **Override template parameters** field and fill in the information for the target Data Factory. For credentials that come from key vault, enter the secret name between double quotes. For example, if the secret’s name is `cred1`, enter `"$(cred1)"`for its value.

    ![](media/continuous-integration-deployment/continuous-integration-image9.png)

    h. Select the **Incremental** Deployment Mode.

    > [!WARNING]
    > If you select **Complete** deployment mode, existing resources may be deleted, including all the resources in the target resource group that aren't defined in the Resource Manager template.

1.  Save the release pipeline.

1. To trigger a release, click **Create release**

![](media/continuous-integration-deployment/continuous-integration-image10.png)

### Get secrets from Azure Key Vault

If you've secrets to pass in an Azure Resource Manager template, we recommend using Azure Key Vault with the Azure Pipelines release.

There are two ways to handle secrets:

1.  Add the secrets to parameters file. For more info, see [Use Azure Key Vault to pass secure parameter value during deployment](../azure-resource-manager/resource-manager-keyvault-parameter.md).

    -   Create a copy of the parameters file that is uploaded to the publish branch and set the values of the parameters you want to get from key vault with the following format:

    ```json
    {
	    "parameters": {
		    "azureSqlReportingDbPassword": {
	    		"reference": {
    				"keyVault": {
					    "id": "/subscriptions/<subId>/resourceGroups/<resourcegroupId> /providers/Microsoft.KeyVault/vaults/<vault-name> "
			        },
        		    "secretName": " < secret - name > "
		        }
		    }
	    }
    }
    ```

    -   When you use this method, the secret is pulled from the key vault automatically.

    -   The parameters file needs to be in the publish branch as well.

1.  Add an [Azure Key Vault task](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-key-vault) before the Azure Resource Manager Deployment described in the previous section:

    -   Select the **Tasks** tab, create a new task, search for **Azure Key Vault** and add it.

    -   In the Key Vault task, choose the subscription in which you created the key vault, provide credentials if necessary, and then choose the key vault.

    ![](media/continuous-integration-deployment/continuous-integration-image8.png)

#### Grant permissions to the Azure Pipelines agent

The Azure Key Vault task may fail with an Access Denied error if the proper permissions aren't present. Download the logs for the release, and locate the `.ps1` file with the command to give permissions to the Azure Pipelines agent. You can run the command directly, or you can copy the principal ID from the file and add the access policy manually in the Azure portal. **Get** and **List** are the minimum permissions required.

### Update active triggers

Deployment can fail if you try to update active triggers. To update active triggers, you need to manually stop them and start them after the deployment. You can do this via an Azure Powershell task.

1.  In the Tasks tab of the release, add an **Azure Powershell** task.

1.  Choose **Azure Resource Manager** as the connection type and select your subscription.

1.  Choose **Inline Script** as the script type and then provide your code. The following example stops the triggers:

    ```powershell
    $triggersADF = Get-AzDataFactoryV2Trigger -DataFactoryName $DataFactoryName -ResourceGroupName $ResourceGroupName

    $triggersADF | ForEach-Object { Stop-AzDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name $_.name -Force }
    ```

    ![](media/continuous-integration-deployment/continuous-integration-image11.png)

You can follow similar steps (with the `Start-AzDataFactoryV2Trigger` function) to restart the triggers after deployment.

> [!IMPORTANT]
> In continuous integration and deployment scenarios, the Integration Runtime type across different environments must be the same. For example, if you have a *Self-Hosted* Integration Runtime (IR) in the development environment, the same IR must be of type *Self-Hosted* in other environments such as test and production also. Similarly, if you're sharing integration runtimes across multiple stages, you have to configure the Integration Runtimes as *Linked Self-Hosted* in all environments, such as development, test, and production.

#### Sample pre/postdeployment script

Below is a sample script to stop triggers before deployment and to restart triggers afterwards. The script also includes code to delete resources that have been removed. To install the latest version of Azure PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](https://docs.microsoft.com/powershell/azure/install-az-ps).

```powershell
param
(
    [parameter(Mandatory = $false)] [String] $rootFolder,
    [parameter(Mandatory = $false)] [String] $armTemplate,
    [parameter(Mandatory = $false)] [String] $ResourceGroupName,
    [parameter(Mandatory = $false)] [String] $DataFactoryName,
    [parameter(Mandatory = $false)] [Bool] $predeployment=$true,
    [parameter(Mandatory = $false)] [Bool] $deleteDeployment=$false
)

$templateJson = Get-Content $armTemplate | ConvertFrom-Json
$resources = $templateJson.resources

#Triggers 
Write-Host "Getting triggers"
$triggersADF = Get-AzDataFactoryV2Trigger -DataFactoryName $DataFactoryName -ResourceGroupName $ResourceGroupName
$triggersTemplate = $resources | Where-Object { $_.type -eq "Microsoft.DataFactory/factories/triggers" }
$triggerNames = $triggersTemplate | ForEach-Object {$_.name.Substring(37, $_.name.Length-40)}
$activeTriggerNames = $triggersTemplate | Where-Object { $_.properties.runtimeState -eq "Started" -and ($_.properties.pipelines.Count -gt 0 -or $_.properties.pipeline.pipelineReference -ne $null)} | ForEach-Object {$_.name.Substring(37, $_.name.Length-40)}
$deletedtriggers = $triggersADF | Where-Object { $triggerNames -notcontains $_.Name }
$triggerstostop = $triggerNames | where { ($triggersADF | Select-Object name).name -contains $_ }

if ($predeployment -eq $true) {
    #Stop all triggers
    Write-Host "Stopping deployed triggers"
    $triggerstostop | ForEach-Object { 
        Write-host "Disabling trigger " $_
        Stop-AzDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name $_ -Force 
    }
}
else {
    #Deleted resources
    #pipelines
    Write-Host "Getting pipelines"
    $pipelinesADF = Get-AzDataFactoryV2Pipeline -DataFactoryName $DataFactoryName -ResourceGroupName $ResourceGroupName
    $pipelinesTemplate = $resources | Where-Object { $_.type -eq "Microsoft.DataFactory/factories/pipelines" }
    $pipelinesNames = $pipelinesTemplate | ForEach-Object {$_.name.Substring(37, $_.name.Length-40)}
    $deletedpipelines = $pipelinesADF | Where-Object { $pipelinesNames -notcontains $_.Name }
    #datasets
    Write-Host "Getting datasets"
    $datasetsADF = Get-AzDataFactoryV2Dataset -DataFactoryName $DataFactoryName -ResourceGroupName $ResourceGroupName
    $datasetsTemplate = $resources | Where-Object { $_.type -eq "Microsoft.DataFactory/factories/datasets" }
    $datasetsNames = $datasetsTemplate | ForEach-Object {$_.name.Substring(37, $_.name.Length-40) }
    $deleteddataset = $datasetsADF | Where-Object { $datasetsNames -notcontains $_.Name }
    #linkedservices
    Write-Host "Getting linked services"
    $linkedservicesADF = Get-AzDataFactoryV2LinkedService -DataFactoryName $DataFactoryName -ResourceGroupName $ResourceGroupName
    $linkedservicesTemplate = $resources | Where-Object { $_.type -eq "Microsoft.DataFactory/factories/linkedservices" }
    $linkedservicesNames = $linkedservicesTemplate | ForEach-Object {$_.name.Substring(37, $_.name.Length-40)}
    $deletedlinkedservices = $linkedservicesADF | Where-Object { $linkedservicesNames -notcontains $_.Name }
    #Integrationruntimes
    Write-Host "Getting integration runtimes"
    $integrationruntimesADF = Get-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -ResourceGroupName $ResourceGroupName
    $integrationruntimesTemplate = $resources | Where-Object { $_.type -eq "Microsoft.DataFactory/factories/integrationruntimes" }
    $integrationruntimesNames = $integrationruntimesTemplate | ForEach-Object {$_.name.Substring(37, $_.name.Length-40)}
    $deletedintegrationruntimes = $integrationruntimesADF | Where-Object { $integrationruntimesNames -notcontains $_.Name }

    #Delete resources
    Write-Host "Deleting triggers"
    $deletedtriggers | ForEach-Object { 
        Write-Host "Deleting trigger "  $_.Name
        $trig = Get-AzDataFactoryV2Trigger -name $_.Name -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName
        if ($trig.RuntimeState -eq "Started") {
            Stop-AzDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name $_.Name -Force 
        }
        Remove-AzDataFactoryV2Trigger -Name $_.Name -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Force 
    }
    Write-Host "Deleting pipelines"
    $deletedpipelines | ForEach-Object { 
        Write-Host "Deleting pipeline " $_.Name
        Remove-AzDataFactoryV2Pipeline -Name $_.Name -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Force 
    }
    Write-Host "Deleting datasets"
    $deleteddataset | ForEach-Object { 
        Write-Host "Deleting dataset " $_.Name
        Remove-AzDataFactoryV2Dataset -Name $_.Name -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Force 
    }
    Write-Host "Deleting linked services"
    $deletedlinkedservices | ForEach-Object { 
        Write-Host "Deleting Linked Service " $_.Name
        Remove-AzDataFactoryV2LinkedService -Name $_.Name -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Force 
    }
    Write-Host "Deleting integration runtimes"
    $deletedintegrationruntimes | ForEach-Object { 
        Write-Host "Deleting integration runtime " $_.Name
        Remove-AzDataFactoryV2IntegrationRuntime -Name $_.Name -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Force 
    }

    if ($deleteDeployment -eq $true) {
        Write-Host "Deleting ARM deployment ... under resource group: " $ResourceGroupName
        $deployments = Get-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName
        $deploymentsToConsider = $deployments | Where { $_.DeploymentName -like "ArmTemplate_master*" -or $_.DeploymentName -like "ArmTemplateForFactory*" } | Sort-Object -Property Timestamp -Descending
        $deploymentName = $deploymentsToConsider[0].DeploymentName

       Write-Host "Deployment to be deleted: " $deploymentName
        $deploymentOperations = Get-AzResourceGroupDeploymentOperation -DeploymentName $deploymentName -ResourceGroupName $ResourceGroupName
        $deploymentsToDelete = $deploymentOperations | Where { $_.properties.targetResource.id -like "*Microsoft.Resources/deployments*" }

        $deploymentsToDelete | ForEach-Object { 
            Write-host "Deleting inner deployment: " $_.properties.targetResource.id
            Remove-AzResourceGroupDeployment -Id $_.properties.targetResource.id
        }
        Write-Host "Deleting deployment: " $deploymentName
        Remove-AzResourceGroupDeployment -ResourceGroupName $ResourceGroupName -Name $deploymentName
    }

    #Start Active triggers - After cleanup efforts
    Write-Host "Starting active triggers"
    $activeTriggerNames | ForEach-Object { 
        Write-host "Enabling trigger " $_
        Start-AzDataFactoryV2Trigger -ResourceGroupName $ResourceGroupName -DataFactoryName $DataFactoryName -Name $_ -Force 
    }
}
```

## Use custom parameters with the Resource Manager template

If you're in GIT mode, you can override the default properties in your Resource Manager template to set properties that are parameterized in the template and properties that are hard-coded. You might want to override the default parameterization template in these scenarios:

* You use automated CI/CD and you want to change some properties during Resource Manager deployment, but the properties aren't parameterized by default.
* Your factory is so large that the default Resource Manager template is invalid because it has more than the maximum allowed parameters (256).

Under these conditions, to override the default parameterization template, create a file named *arm-template-parameters-definition.json* in the root folder of the repository. The file name must exactly match. Data Factory tries to read this file from whichever branch you're currently on in the Azure Data Factory portal, not just from the collaboration branch. You can create or edit the file from a private branch, where you can test your changes by using the **Export ARM template** in the UI. Then, you can merge the file into the collaboration branch. If no file is found, the default template is used.


### Syntax of a custom parameters file

Here are some guidelines to use when you author the custom parameters file. The file consists of a section for each entity type: trigger, pipeline, linked service, dataset, integration runtime, and so on.
* Enter the property path under the relevant entity type.
* When you set a property name to '\*'', you indicate that you want to parameterize all properties under it (only down to the first level, not recursively). You can also provide any exceptions to this.
* When you set the value of a property as a string, you indicate that you want to parameterize the property. Use the format `<action>:<name>:<stype>`.
   *  `<action>` can be one of the following characters:
      * `=` means keep the current value as the default value for the parameter.
      * `-` means don't keep the default value for the parameter.
      * `|` is a special case for secrets from Azure Key Vault for connection strings or keys.
   * `<name>` is the name of the parameter. If it's blank, it takes the name of the property. If the value starts with a `-` character, the name is shortened. For example, `AzureStorage1_properties_typeProperties_connectionString` would be shortened to `AzureStorage1_connectionString`.
   * `<stype>` is the type of parameter. If `<stype>` is blank, the default type is `string`. Supported values: `string`, `bool`, `number`, `object`, and `securestring`.
* When you specify an array in the definition file, you indicate that the matching property in the template is an array. Data Factory iterates through all the objects in the array by using the definition that's specified in the Integration Runtime object of the array. The second object, a string, becomes the name of the property, which is used as the name for the parameter for each iteration.
* It's not possible to have a definition that's specific for a resource instance. Any definition applies to all resources of that type.
* By default, all secure strings, such as Key Vault secrets, and secure strings, such as connection strings, keys, and tokens, are parameterized.
 
### Sample parameterization template

Below is an example of what a parameterization template may look like:

```json
{
    "Microsoft.DataFactory/factories/pipelines": {
        "properties": {
            "activities": [{
                "typeProperties": {
                    "waitTimeInSeconds": "-::number",
                    "headers": "=::object"
                }
            }]
        }
    },
    "Microsoft.DataFactory/factories/integrationRuntimes": {
        "properties": {
            "typeProperties": {
                "*": "="
            }
        }
    },
    "Microsoft.DataFactory/factories/triggers": {
        "properties": {
            "typeProperties": {
                "recurrence": {
                    "*": "=",
                    "interval": "=:triggerSuffix:number",
                    "frequency": "=:-freq"
                },
                "maxConcurrency": "="
            }
        }
    },
    "Microsoft.DataFactory/factories/linkedServices": {
        "*": {
            "properties": {
                "typeProperties": {
                    "accountName": "=",
                    "username": "=",
                    "connectionString": "|:-connectionString:secureString",
                    "secretAccessKey": "|"
                }
            }
        },
        "AzureDataLakeStore": {
            "properties": {
                "typeProperties": {
                    "dataLakeStoreUri": "="
                }
            }
        }
    },
    "Microsoft.DataFactory/factories/datasets": {
        "properties": {
            "typeProperties": {
                "*": "="
            }
        }
    }
}
```
Below is an explanation of how the above template is constructed, broken down by resource type.

#### Pipelines
	
* Any property in the path activities/typeProperties/waitTimeInSeconds is parameterized. Any activity in a pipeline that has a code-level property named `waitTimeInSeconds` (for example, the `Wait` activity) is parameterized as a number, with a default name. But it won't have a default value in the Resource Manager template. It will be a mandatory input during the Resource Manager deployment.
* Similarly, a property called `headers` (for example, in a `Web` activity) is parameterized with type `object` (JObject). It has a default value, which is the same value as in the source factory.

#### IntegrationRuntimes

* All properties under the path `typeProperties` are parameterized with their respective default values. For example, there are two properties under **IntegrationRuntimes** type properties: `computeProperties` and `ssisProperties`. Both property types are created with their respective default values and types (Object).

#### Triggers

* Under `typeProperties`, two properties are parameterized. The first one is `maxConcurrency`, which is specified to have a default value and is of type`string`. It has the default parameter name of `<entityName>_properties_typeProperties_maxConcurrency`.
* The `recurrence` property also is parameterized. Under it, all properties at that level are specified to be parameterized as strings, with default values and parameter names. An exception is the `interval` property, which is parameterized as number type, and with the parameter name suffixed with `<entityName>_properties_typeProperties_recurrence_triggerSuffix`. Similarly, the `freq` property is a string and is parameterized as a string. However, the `freq` property is parameterized without a default value. The name is shortened and suffixed. For example, `<entityName>_freq`.

#### LinkedServices

* Linked services are unique. Because linked services and datasets have a wide range of types, you can provide type-specific customization. In this example, all linked services of type `AzureDataLakeStore`, a specific template will be applied, and for all others (via \*) a different template will be applied.
* The `connectionString` property will be parameterized as a `securestring` value, it won't have a default value, and it will have a shortened parameter name that's suffixed with `connectionString`.
* The property `secretAccessKey` happens to be an `AzureKeyVaultSecret` (for example, in an `AmazonS3` linked service). It's automatically parameterized as an Azure Key Vault secret and fetched from the configured key vault. You can also parameterize the key vault itself.

#### Datasets

* Although type-specific customization is available for datasets, configuration can be provided without explicitly having a \*-level configuration. In the above example, all dataset properties under `typeProperties` are parameterized.

### Default parameterization template

Below is the current default parameterization template. If you only need to add a one or a few parameters, editing this directly may be helpful as you will not lose the existing parameterization structure.

```json
{
    "Microsoft.DataFactory/factories/pipelines": {
    },
    "Microsoft.DataFactory/factories/integrationRuntimes":{
        "properties": {
            "typeProperties": {
                "ssisProperties": {
                    "catalogInfo": {
                        "catalogServerEndpoint": "=",
                        "catalogAdminUserName": "=",
                        "catalogAdminPassword": {
                            "value": "-::secureString"
                        }
                    },
                    "customSetupScriptProperties": {
                        "sasToken": {
                            "value": "-::secureString"
                        }
                    }
                },
                "linkedInfo": {
                    "key": {
                        "value": "-::secureString"
                    },
                    "resourceId": "="
                }
            }
        }
    },
    "Microsoft.DataFactory/factories/triggers": {
        "properties": {
            "pipelines": [{
                    "parameters": {
                        "*": "="
                    }
                },  
                "pipelineReference.referenceName"
            ],
            "pipeline": {
                "parameters": {
                    "*": "="
                }
            },
            "typeProperties": {
                "scope": "="
            }

        }
    },
    "Microsoft.DataFactory/factories/linkedServices": {
        "*": {
            "properties": {
                "typeProperties": {
                    "accountName": "=",
                    "username": "=",
                    "userName": "=",
                    "accessKeyId": "=",
                    "servicePrincipalId": "=",
                    "userId": "=",
                    "clientId": "=",
                    "clusterUserName": "=",
                    "clusterSshUserName": "=",
                    "hostSubscriptionId": "=",
                    "clusterResourceGroup": "=",
                    "subscriptionId": "=",
                    "resourceGroupName": "=",
                    "tenant": "=",
                    "dataLakeStoreUri": "=",
                    "baseUrl": "=",
                    "database": "=",
                    "serviceEndpoint": "=",
                    "batchUri": "=",
                    "databaseName": "=",
                    "systemNumber": "=",
                    "server": "=",
                    "url":"=",
                    "aadResourceId": "=",
                    "connectionString": "|:-connectionString:secureString"
                }
            }
        },
        "Odbc": {
            "properties": {
                "typeProperties": {
                    "userName": "=",
                    "connectionString": {
                        "secretName": "="
                    }
                }
            }
        }
    },
    "Microsoft.DataFactory/factories/datasets": {
        "*": {
            "properties": {
                "typeProperties": {
                    "folderPath": "=",
                    "fileName": "="
                }
            }
        }}
}
```

Below is an example of how to add a single value to the default parameterization template. We only want to add an existing Databricks interactive cluster ID for a Databricks linked service to the parameters file. Note the below file is the same as the above file except for `existingClusterId` included under the properties field of `Microsoft.DataFactory/factories/linkedServices`.

```json
{
    "Microsoft.DataFactory/factories/pipelines": {
    },
    "Microsoft.DataFactory/factories/integrationRuntimes":{
        "properties": {
            "typeProperties": {
                "ssisProperties": {
                    "catalogInfo": {
                        "catalogServerEndpoint": "=",
                        "catalogAdminUserName": "=",
                        "catalogAdminPassword": {
                            "value": "-::secureString"
                        }
                    },
                    "customSetupScriptProperties": {
                        "sasToken": {
                            "value": "-::secureString"
                        }
                    }
                },
                "linkedInfo": {
                    "key": {
                        "value": "-::secureString"
                    },
                    "resourceId": "="
                }
            }
        }
    },
    "Microsoft.DataFactory/factories/triggers": {
        "properties": {
            "pipelines": [{
                    "parameters": {
                        "*": "="
                    }
                },  
                "pipelineReference.referenceName"
            ],
            "pipeline": {
                "parameters": {
                    "*": "="
                }
            },
            "typeProperties": {
                "scope": "="
            }
 
        }
    },
    "Microsoft.DataFactory/factories/linkedServices": {
        "*": {
            "properties": {
                "typeProperties": {
                    "accountName": "=",
                    "username": "=",
                    "userName": "=",
                    "accessKeyId": "=",
                    "servicePrincipalId": "=",
                    "userId": "=",
                    "clientId": "=",
                    "clusterUserName": "=",
                    "clusterSshUserName": "=",
                    "hostSubscriptionId": "=",
                    "clusterResourceGroup": "=",
                    "subscriptionId": "=",
                    "resourceGroupName": "=",
                    "tenant": "=",
                    "dataLakeStoreUri": "=",
                    "baseUrl": "=",
                    "database": "=",
                    "serviceEndpoint": "=",
                    "batchUri": "=",
                    "databaseName": "=",
                    "systemNumber": "=",
                    "server": "=",
                    "url":"=",
                    "aadResourceId": "=",
                    "connectionString": "|:-connectionString:secureString",
                    "existingClusterId": "-"
                }
            }
        },
        "Odbc": {
            "properties": {
                "typeProperties": {
                    "userName": "=",
                    "connectionString": {
                        "secretName": "="
                    }
                }
            }
        }
    },
    "Microsoft.DataFactory/factories/datasets": {
        "*": {
            "properties": {
                "typeProperties": {
                    "folderPath": "=",
                    "fileName": "="
                }
            }
        }}
}
```

## Linked Resource Manager templates

If you've set up continuous integration and deployment (CI/CD) for your Data Factories, you may run into the Azure Resource Manager template limits as your factory grows bigger. An Example of a limit is the maximum number of resources in a Resource Manager template. To accommodate large factories, along with generating the full Resource Manager template for a factory, Data Factory now generates Linked Resource Manager templates. With this feature, the entire factory payload is broken down into several files so you don’t run into the limits.

If you've configured Git, the linked templates are generated and saved alongside the full Resource Manager templates in the `adf_publish` branch under a new folder called `linkedTemplates`.

![Linked Resource Manager templates folder](media/continuous-integration-deployment/linked-resource-manager-templates.png)

The Linked Resource Manager templates usually have a master template and a set of child templates linked to the master. The parent template is called `ArmTemplate_master.json`, and child templates are named with the pattern `ArmTemplate_0.json`, `ArmTemplate_1.json`, and so on. To use linked templates instead of the full Resource Manager template, update your CI/CD task to point to `ArmTemplate_master.json` instead of `ArmTemplateForFactory.json` (the full Resource Manager template). Resource Manager also requires you to upload the linked templates into a storage account so that they can be accessed by Azure during deployment. For more info, see [Deploying Linked ARM Templates with VSTS](https://blogs.msdn.microsoft.com/najib/2018/04/22/deploying-linked-arm-templates-with-vsts/).

Remember to add the Data Factory scripts in your CI/CD pipeline before and after the deployment task.

If you don’t have Git configured, the linked templates are accessible via the **Export ARM template** gesture.

## Hot-fix production branch

If you deploy a factory to production and realize there's a bug that needs to be fixed right away, but you can't deploy the current collaboration branch, you may need to deploy a hot-fix.

1.	In Azure DevOps, go to the release that was deployed to production and find the last commit that was deployed.

2.	From the commit message, get the commit ID of collaboration branch.

3.	Create a new hot-fix branch from that commit.

4.	Go to the Azure Data Factory UX and switch to this branch.

5.	Using the Azure Data Factory UX, fix the bug. Test your changes.

6.	Once the fix has been verified, click on **Export ARM template** to get the hot-fix Resource Manager template.

7.	Manually check in this build to the adf_publish branch.

8.	If you've configured your release pipeline to automatically trigger based on adf_publish check-ins, a new release will automatically start. Otherwise, manually queue a release.

9.	Deploy the hot-fix release to the test and production factories. This release contains the previous production payload plus the fix made in step 5.

10.	Add the changes from the hot-fix to development branch so that later releases will not run into the same bug.

## Best practices for CI/CD

If you're using Git integration with your data factory, and you have a CI/CD pipeline that moves your changes from Development into Test and then to Production, we recommend the following best practices:

-   **Git Integration**. You're only required to configure your Development data factory with Git integration. Changes to Test and Production are deployed via CI/CD, and don't need Git integration.

-   **Data Factory CI/CD script**. Before the Resource Manager deployment step in CI/CD, certain tasks are required such as stopping/starting of triggers and cleanup. We recommend using powershell scripts before and after deployment. For more information, see [Update active triggers](#update-active-triggers). 

-   **Integration Runtimes and sharing**. Integration Runtimes don't change often and are similar across all stages in your CI/CD. As a result, Data Factory expects you to have the same name and same type of Integration Runtimes across all stages of CI/CD. If you're looking to share Integration Runtimes across all stages, consider using a ternary factory just for containing the shared Integration Runtimes. You can use this shared factory in all of your environments as a linked integration runtime type.

-   **Key Vault**. When you use Azure Key Vault based linked services, you can take advantages of it further by keeping separate key vaults for different environments. You can also configure separate permission levels for each of them. For example, you may not want your team members to have permissions to production secrets. If you follow this approach, it's recommended you to keep the same secret names across all stages. If you keep the same names, you don't have to change your Resource Manager templates across CI/CD environments since the only thing that changes is the key vault name, which is one of the Resource Manager template parameters.

## Unsupported features

-   You can't publish individual resources. Data factory entities depend on each other and tracking changing dependencies can be difficult and lead to unexpected behavior. For example, triggers depend on pipelines, pipelines depend on datasets and other pipelines, an so on. If it was possible to publish only a subset of the entire change-set, certain unforeseen errors could occur.

-   You can't publish from private branches.

-   You can't host projects on Bitbucket.
