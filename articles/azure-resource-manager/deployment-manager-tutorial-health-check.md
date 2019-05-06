---
title: Use Azure Deployment Manager with Resource Manager templates | Microsoft Docs
description: Use Resource Manager templates with Azure Deployment Manager to deploy Azure resources.
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: dougeby
editor: tysonn

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 05/06/2019
ms.topic: tutorial
ms.author: jgao

---

# Tutorial: Use health check in Azure Deployment Manager (Private preview)

Learn how to integrate health check in [Azure Deployment Manager](./deployment-manager-overview.md). This tutorial is based of the [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md) tutorial. You must complete that tutorial before you proceed with this one.

In the rollout template used in [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md), you used a wait step. In this tutorial, you replace the wait step with a health check step.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Create a health check service simulator
> * Revise the rollout template
> * Deploy the topology
> * Deploy the rollout with unhealthy status
> * Verify the rollout deployment
> * Deploy the rollout with healthy status
> * Verify the rollout deployment
> * Clean up resources

The Azure Deployment Manager REST API reference can be found [here](https://docs.microsoft.com/rest/api/deploymentmanager/).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* Complete [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md).
* Download [the templates and the artifacts](https://armtutorials.blob.core.windows.net/admtutorial/ADMTutorial.zip) that is used by this tutorial. 

## Create a health check service simulator

In production, you typically use one or more monitoring providers. For a list of existing monitoring providers, see [Health monitoring providers](./deployment-manager-health-check.md#health-monitoring-providers). For the purpose of this tutorial, you create an [Azure Function](/azure/azure-functions/) to simulate a health monitoring service. This function takes a status code, and returns the same code. Your Azure Deployment Manager template uses the status code to determine the actions. The knowledge of Azure Function is not required to complete this tutorial.

The following two files are used for deploying the Azure Function. You don't need to download these files to go through the tutorial.

* A resource manager template located at [https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json](https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json). You deploy this template to create an Azure Function.  
* A zip file of the Azure Function source code, [https://armtutorials.blob.core.windows.net/admtutorial/ADMHCFunction0417.zip](https://armtutorials.blob.core.windows.net/admtutorial/RestHealthTest.zip). This zip called is called by the resource manager template.

To deploy the Azure function, select **Try it** to open the Azure Cloud shell, and then paste the following script into the shell window.  To paste the code, right-click the shell window and then select **Paste**. 

> [!IMPORTANT]
> **projectName** in the PowerShell script is used to generate names for the Azure services that are deployed in this tutorial. Different Azure services have different requirements on the names. To ensure the deployment is successful, choose a name with less than 12 characters with lower case letters and numbers.
> Make a copy of the project name, and use the same projectName through the tutorial.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$resourceGroupName = "${projectName}rg"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json" -projectName $projectName

```

To verify and test the Azure function:

1. Open the [Azure portal](https://portal.azure.com).
1. Open the resource group.  The default name is the project name with **rg** appended.
1. Select the app service from the resource group.  The default name of the app service is the project name with **webapp** appended.
1. Expand **Functions**, and then select **HttpTrigger1**. 

    ![Azure Deployment Manager health check Azure Function](./media/deployment-manager-tutorial-health-check/azure-deployment-manager-hc-function.png)

1. Select **&lt;/> Get function URL**.
1. Select **Copy** to copy the URL to the clipboard.  The URL is similar to:

    ```url
    https://myhc0417webapp.azurewebsites.net/api/healthStatus/{healthStatus}?code=hc4Y1wY4AqsskAkVw6WLAN1A4E6aB0h3MbQ3YJRF3XtXgHvooaG0aw==
    ```

    Notice `{healthStatus}` in the URL, replace it with a status code. In this tutorial, use either **healthy** or **warning** to test the healthy scenario, and use **unhealth** to test the unhealthy scenario. Create two URLs, one with the unhealthy status, and the other with healthy status. For examples:

    ```url
    https://myhc0417webapp.azurewebsites.net/api/healthStatus/unhealthy?code=hc4Y1wY4AqsskAkVw6WLAN1A4E6aB0h3MbQ3YJRF3XtXgHvooaG0aw==
    https://myhc0417webapp.azurewebsites.net/api/healthStatus/healthy?code=hc4Y1wY4AqsskAkVw6WLAN1A4E6aB0h3MbQ3YJRF3XtXgHvooaG0aw==
    ```
    You need both URLs to completed this tutorial.

1. To test the health monitoring simulator, open the URLs that you created in the last step.  The results for the unhealthy status shall be similar to:

    ```
    Status: unhealthy
    ```

## Revise the rollout template

This section is optional for this tutorial.  The purpose of this section is to show you how to implement a health check step in the rollout template.

1. Open **CreateADMRollout.json**. This JSON file is a part of the download.  See [Prerequisites](#prerequisites).
1. Add two more parameters:

    ```json
    "healthCheckUrl": {
        "type": "string",
        "metadata": {
            "description": "Specifies the health check URL."
        }
    },
    "healthCheckAuthAPIKey": {
        "type": "string",
        "metadata": {
            "description": "Specifies the health check Azure Function function authorization key."
        }
    }
    ```
1. Replace the wait step resource definition with the following JSON:

    ```json
    {
      "type": "Microsoft.DeploymentManager/steps",
      "apiVersion": "2018-09-01-preview",
      "name": "healthCheckStep",
			"location": "[parameters('azureResourceLocation')]",
      "properties": {
        "stepType": "healthCheck",
        "attributes": {
          "waitDuration": "PT0M",
          "maxElasticDuration": "PT0M",
          "healthyStateDuration": "PT1M",
          "type": "REST",
          "properties": {
            "healthChecks": [
              {
                "name": "appHealth",
                "request": {
                  "method": "GET",
                  "uri": "[parameters('healthCheckUrl')]",
                  "authentication": {
                    "type": "ApiKey",
                    "name": "code",
                    "in": "Query",
                    "value": "[parameters('healthCheckAuthAPIKey')]"
                  }
                },
                "response": {
                  "successStatusCodes": [
                    "200"
                  ],
                  "regex": {
                    "matches": [
                      "Status: healthy",
                      "Status: warning"
                    ],
                    "matchQuantifier": "Any"
                  }
                }
              }
            ]
          }
        }
      }
    },
    ```

    Based on the definition, the rollout proceeds if the health status is either *healthy* or *warning*. 

1. Update the **dependsON** of the rollout definition to:

    ```json
    "dependsOn": [
        "[resourceId('Microsoft.DeploymentManager/artifactSources', variables('rolloutArtifactSource').name)]",
        "[resourceId('Microsoft.DeploymentManager/steps/', 'healthCheckStep')]"
    ],
    ```

1. Update **stepGroups** with the following JSON.

    ```json
    "stepGroups": [
        {
            "name": "stepGroup1",
            "preDeploymentSteps": [],
            "deploymentTargetId": "[resourceId('Microsoft.DeploymentManager/serviceTopologies/services/serviceUnits', variables('serviceTopology').name, variables('serviceTopology').serviceWUS.name,  variables('serviceTopology').serviceWUS.serviceUnit2.name)]",
            "postDeploymentSteps": []
        },
        {
            "name": "stepGroup2",
            "dependsOnStepGroups": ["stepGroup1"],
            "preDeploymentSteps": [],
            "deploymentTargetId": "[resourceId('Microsoft.DeploymentManager/serviceTopologies/services/serviceUnits', variables('serviceTopology').name, variables('serviceTopology').serviceWUS.name,  variables('serviceTopology').serviceWUS.serviceUnit1.name)]",
            "postDeploymentSteps": [
                {
                    "stepId": "[resourceId('Microsoft.DeploymentManager/steps/', 'healthCheckStep')]"
                }
            ]
        },
        {
            "name": "stepGroup3",
            "dependsOnStepGroups": ["stepGroup2"],
            "preDeploymentSteps": [],
            "deploymentTargetId": "[resourceId('Microsoft.DeploymentManager/serviceTopologies/services/serviceUnits', variables('serviceTopology').name, variables('serviceTopology').serviceEUS.name,  variables('serviceTopology').serviceEUS.serviceUnit2.name)]",
            "postDeploymentSteps": []
        },
        {
            "name": "stepGroup4",
            "dependsOnStepGroups": ["stepGroup3"],
            "preDeploymentSteps": [],
            "deploymentTargetId": "[resourceId('Microsoft.DeploymentManager/serviceTopologies/services/serviceUnits', variables('serviceTopology').name, variables('serviceTopology').serviceEUS.name,  variables('serviceTopology').serviceEUS.serviceUnit1.name)]",
            "postDeploymentSteps": []
        }
    ]
    ```

    The health check step is used after rolling out stepGroup1 and stepGroup2. stepGroup3 and stepGroup4 are only deployed if the healthy status is either *healthy* or *warning*. 

    The following screenshot illustrates the areas modified, and how the health check step is used:

    ![Azure Deployment Manager health check template](./media/deployment-manager-tutorial-health-check/azure-deployment-manager-hc-rollout-template.png)

## Deploy the topology

To simplify the tutorial, the topology template and artifacts are shared at:

* Topology template: https://armtutorials.blob.core.windows.net/admtutorial/ADMTemplates/CreateADMServiceTopology.json
* Artifacts store: https://armtutorials.blob.core.windows.net/admtutorial/ArtifactStore

If you want to use your own, see [Tutorial: Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md).

To deploy the topology, select **Try it** to open the Cloud shell, and then paste the PowerShell script.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name used earlier in this tutorial"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$resourceGroupName = "${projectName}rg"
$artifactLocation = "https://armtutorials.blob.core.windows.net/admtutorial/ArtifactStore?st=2019-05-06T03%3A57%3A31Z&se=2020-05-07T03%3A57%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=gOh%2Bkhi693rmdxiZFQ9xbKZMU1kbLJDqXw7EP4TaGlI%3D" | ConvertTo-SecureString -AsPlainText -Force

# Create the service topology
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://armtutorials.blob.core.windows.net/admtutorial/ADMTemplatesHC/CreateADMServiceTopology.json" `
    -namePrefix $projectName `
    -azureResourceLocation $location `
    -artifactSourceSASLocation $artifactLocation

```

Verify the service topology and the underlined resources have been created successfully using the Azure portal:

![Azure Deployment Manager tutorial deployed service topology resources](./media/deployment-manager-tutorial/azure-deployment-manager-tutorial-deployed-topology-resources.png)

**Show hidden types** must be selected to see the resources.

## Deploy the rollout with the unhealthy status

To simplify the tutorial, the revised rollout template is shared at:

* Topology template: https://armtutorials.blob.core.windows.net/admtutorial/ADMTemplatesHC/CreateADMRollout.json
* Artifacts store: https://armtutorials.blob.core.windows.net/admtutorial/ArtifactStore

If you want to use your own, see [Tutorial: Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md).

Use the unhealthy status URL you created in [Create a health check service simulator](#create-a-health-check-service-simulator). For **managedIdentityID**, see [Create the user-assigned managed identity](./deployment-manager-tutorial.md#create-the-user-assigned-managed-identity).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name used earlier in this tutorial"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$managedIdentityID = Read-Host -Prompt "Enter a user-assigned managed identity"
$healthCheckUrl = Read-Host -Prompt "Enter the health check Azure function URL"
$healthCheckAuthAPIKey = $healthCheckUrl.Substring($healthCheckUrl.IndexOf("?code=")+6, $healthCheckUrl.Length-$healthCheckUrl.IndexOf("?code=")-6)
$healthCheckUrl = $healthCheckUrl.Substring(0, $healthCheckUrl.IndexOf("?"))

$resourceGroupName = "${projectName}rg"
$artifactLocation = "https://armtutorials.blob.core.windows.net/admtutorial/ArtifactStore?st=2019-05-06T03%3A57%3A31Z&se=2020-05-07T03%3A57%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=gOh%2Bkhi693rmdxiZFQ9xbKZMU1kbLJDqXw7EP4TaGlI%3D" | ConvertTo-SecureString -AsPlainText -Force

# Create the rollout
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://armtutorials.blob.core.windows.net/admtutorial/ADMTemplatesHC/CreateADMRollout.json" `
    -namePrefix $projectName `
    -azureResourceLocation $location `
    -artifactSourceSASLocation $artifactLocation `
    -managedIdentityID $managedIdentityID `
    -healthCheckUrl $healthCheckUrl `
    -healthCheckAuthAPIKey $healthCheckAuthAPIKey

```

> [!NOTE]
> `New-AzResourceGroupDeployment` is an asynchronous call. The success message only means the deployment has successfully begun. To verify the deployment, use `Get-AZDeploymentManagerRollout`.  See the next procedure.

To check the rollout progress using the following PowerShell script:

```azurepowershell
$projectName = Read-Host -Prompt "Enter the same project name used earlier in this tutorial"
$resourceGroupName = "${projectName}rg"
$rolloutName = "${projectName}Rollout"

# Get the rollout status
Get-AzDeploymentManagerRollout `
    -ResourceGroupName $resourceGroupName `
    -Name $rolloutName `
    -Verbose
```

The Deployment Manager PowerShell cmdlets must be installed before you can run this cmdlet. See Prerequisites. The -Verbose switch can be used to see the whole output.

The following sample shows the running status:

```output
VERBOSE:

Status: Succeeded
ArtifactSourceId: /subscriptions/<AzureSubscriptionID>/resourceGroups/adm0925rg/providers/Microsoft.DeploymentManager/artifactSources/adm0925ArtifactSourceRollout
BuildVersion: 1.0.0.0

Operation Info:
    Retry Attempt: 0
    Skip Succeeded: False
    Start Time: 03/05/2019 15:26:13
    End Time: 03/05/2019 15:31:26
    Total Duration: 00:05:12

Service: adm0925ServiceEUS
    TargetLocation: EastUS
    TargetSubscriptionId: <AzureSubscriptionID>

    ServiceUnit: adm0925ServiceEUSStorage
        TargetResourceGroup: adm0925ServiceEUSrg

        Step: Deploy
            Status: Succeeded
            StepGroup: stepGroup3
            Operation Info:
                DeploymentName: 2F535084871E43E7A7A4CE7B45BE06510adm0925ServiceEUSStorage
                CorrelationId: 0b6f030d-7348-48ae-a578-bcd6bcafe78d
                Start Time: 03/05/2019 15:26:32
                End Time: 03/05/2019 15:27:41
                Total Duration: 00:01:08
            Resource Operations:

                Resource Operation 1:
                Name: txq6iwnyq5xle
                Type: Microsoft.Storage/storageAccounts
                ProvisioningState: Succeeded
                StatusCode: OK
                OperationId: 64A6E6EFEF1F7755

...

ResourceGroupName       : adm0925rg
BuildVersion            : 1.0.0.0
ArtifactSourceId        : /subscriptions/<SubscriptionID>/resourceGroups/adm0925rg/providers/Microsoft.DeploymentManager/artifactSources/adm0925ArtifactSourceRollout
TargetServiceTopologyId : /subscriptions/<SubscriptionID>/resourceGroups/adm0925rg/providers/Microsoft.DeploymentManager/serviceTopologies/adm0925ServiceTopology
Status                  : Running
TotalRetryAttempts      : 0
OperationInfo           : Microsoft.Azure.Commands.DeploymentManager.Models.PSRolloutOperationInfo
Services                : {adm0925ServiceEUS, adm0925ServiceWUS}
Name                    : adm0925Rollout
Type                    : Microsoft.DeploymentManager/rollouts
Location                : centralus
Id                      : /subscriptions/<SubscriptionID>/resourcegroups/adm0925rg/providers/Microsoft.DeploymentManager/rollouts/adm0925Rollout
Tags                    :
```

After the rollout is completed, you shall see one additional resource group created for West US.

Repeat this section to redeploy the rollout with the health status URL.  After the rollout is completed, you shall see one additional resource group created for East US.

## Verify the deployment

1. Open the [Azure portal](https://portal.azure.com).
2. Browse to the newly create web applications under the new resource groups created by the rollout deployment.
3. Open the web application in a web browser. Verify the location and the version on the index.html file.

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Use the **Filter by name** field to narrow down the resource groups created in this tutorial. There shall be 3-4:

    * **&lt;namePrefix>rg**: contains the Deployment Manager resources.
    * **&lt;namePrefix>ServiceWUSrg**: contains the resources defined by ServiceWUS.
    * **&lt;namePrefix>ServiceEUSrg**: contains the resources defined by ServiceEUS.
    * The resource group for the user-defined managed identity.
3. Select the resource group name.  
4. Select **Delete resource group** from the top menu.
5. Repeat the last two steps to delete other resource groups created by this tutorial.

## Next steps

In this tutorial, you learned how to use the health check feature of Azure Deployment Manager. To learn more, see [Azure Resource Manager documentation](/azure/azure-resource-manager/).
