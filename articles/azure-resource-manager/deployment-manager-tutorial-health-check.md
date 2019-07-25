---
title: Use Azure Deployment Manager with Resource Manager templates | Microsoft Docs
description: Use Resource Manager templates with Azure Deployment Manager to deploy Azure resources.
services: azure-resource-manager
documentationcenter: ''
author: mumian

ms.service: azure-resource-manager
ms.date: 05/31/2019
ms.topic: tutorial
ms.author: jgao

---

# Tutorial: Use health check in Azure Deployment Manager (Public preview)

Learn how to integrate health check in [Azure Deployment Manager](./deployment-manager-overview.md). This tutorial is based of the [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md) tutorial. You must complete that tutorial before you proceed with this one.

In the rollout template used in [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md), you used a wait step. In this tutorial, you replace the wait step with a health check step.

> [!IMPORTANT]
> If your subscription is marked for Canary to test out new Azure features, you can only use Azure Deployment Manager to deploy to the Canary regions. 

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

Additional resources:

- The [Azure Deployment Manager REST API reference](https://docs.microsoft.com/rest/api/deploymentmanager/).
- [An Azure Deployment Manager sample](https://github.com/Azure-Samples/adm-quickstart).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* Complete [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md).
* Download [the templates and the artifacts](https://armtutorials.blob.core.windows.net/admtutorial/ADMTutorial.zip) that is used by this tutorial.

## Create a health check service simulator

In production, you typically use one or more monitoring providers. In order to make health integration as easy as possible, Microsoft has been working with some of the top service health monitoring companies to provide you with a simple copy/paste solution to integrate health checks with your deployments. For a list of these companies, see [Health monitoring providers](./deployment-manager-health-check.md#health-monitoring-providers). For the purpose of this tutorial, you create an [Azure Function](/azure/azure-functions/) to simulate a health monitoring service. This function takes a status code, and returns the same code. Your Azure Deployment Manager template uses the status code to determine how to proceed with the deployment.

The following two files are used for deploying the Azure Function. You don't need to download these files to go through the tutorial.

* A Resource Manager template located at [https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json](https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json). You deploy this template to create an Azure Function.
* A zip file of the Azure Function source code, [https://armtutorials.blob.core.windows.net/admtutorial/ADMHCFunction0417.zip](https://armtutorials.blob.core.windows.net/admtutorial/ADMHCFunction0417.zip). This zip called is called by the Resource Manager template.

To deploy the Azure function, select **Try it** to open the Azure Cloud shell, and then paste the following script into the shell window.  To paste the code, right-click the shell window and then select **Paste**.

> [!IMPORTANT]
> **projectName** in the PowerShell script is used to generate names for the Azure services that are deployed in this tutorial. Different Azure services have different requirements on the names. To ensure the deployment is successful, choose a name with less than 12 characters with only lower case letters and numbers.
> Save a copy of the project name. You use the same projectName through the tutorial.

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

    Replace `{healthStatus}` in the URL with a status code. In this tutorial, use **unhealthy** to test the unhealthy scenario, and use either **healthy** or **warning** to test the healthy scenario. Create two URLs, one with the unhealthy status, and the other with healthy status. For examples:

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

The purpose of this section is to show you how to include a health check step in the rollout template. You don't have to create your own CreateADMRollout.json file to complete this tutorial. The revised rollout template is shared in a storage account that is used in the subsequent sections.

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

1. Replace the wait step resource definition with a health check step resource definition:

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

1. Update the **dependsON** of the rollout definition to include the newly defined health check step:

    ```json
    "dependsOn": [
        "[resourceId('Microsoft.DeploymentManager/artifactSources', variables('rolloutArtifactSource').name)]",
        "[resourceId('Microsoft.DeploymentManager/steps/', 'healthCheckStep')]"
    ],
    ```

1. Update **stepGroups** to include the health check step. The **healthCheckStep** is called in **postDeploymentSteps** of **stepGroup2**. **stepGroup3** and **stepGroup4** are only deployed if the healthy status is either *healthy* or *warning*.

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

    If you compare the **stepGroup3** section before and after it is revised, this section now depends on **stepGroup2**.  This is necessary when **stepGroup3** and the subsequent step groups depend on the results of health monitoring.

    The following screenshot illustrates the areas modified, and how the health check step is used:

    ![Azure Deployment Manager health check template](./media/deployment-manager-tutorial-health-check/azure-deployment-manager-hc-rollout-template.png)

## Deploy the topology

To simplify the tutorial, the topology template and artifacts are shared at the following locations so that you don't need to prepare your own copy. If you want to use your own, follow the instructions in [Tutorial: Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md).

* Topology template: https://armtutorials.blob.core.windows.net/admtutorial/ADMTemplates/CreateADMServiceTopology.json
* Artifacts store: https://armtutorials.blob.core.windows.net/admtutorial/ArtifactStore

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

To simplify the tutorial, the revised rollout template is shared at the following locations so that you don't need to prepare your own copy. If you want to use your own, follow the instructions in [Tutorial: Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md).

* Topology template: https://armtutorials.blob.core.windows.net/admtutorial/ADMTemplatesHC/CreateADMRollout.json
* Artifacts store: https://armtutorials.blob.core.windows.net/admtutorial/ArtifactStore

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

The following sample output shows the deployment failed due to the unhealthy status:

```output
Service: myhc0417ServiceWUSrg
    TargetLocation: WestUS
    TargetSubscriptionId: <Subscription ID>

    ServiceUnit: myhc0417ServiceWUSWeb
        TargetResourceGroup: myhc0417ServiceWUSrg

        Step: RestHealthCheck/healthCheckStep.PostDeploy
            Status: Failed
            StepGroup: stepGroup2
            Operation Info:
                Start Time: 05/06/2019 17:58:31
                End Time: 05/06/2019 17:58:32
                Total Duration: 00:00:01
                Error:
                    Code: ResourceReportedUnhealthy
                    Message: Health checks failed as the following resources were unhealthy: '05/06/2019 17:58:32 UTC: Health check 'appHealth' failed with the following errors: Response from endpoint 'https://myhc0417webapp.azurewebsites.net/api/healthStatus/unhealthy' does not match the regex pattern(s): 'Status: healthy, Status: warning.'. Response content: "Status: unhealthy"..'.
Get-AzDeploymentManagerRollout :
Service: myhc0417ServiceWUSrg
    ServiceUnit: myhc0417ServiceWUSWeb
        Step: RestHealthCheck/healthCheckStep.PostDeploy
            Status: Failed
            StepGroup: stepGroup2
            Operation Info:
                Start Time: 05/06/2019 17:58:31
                End Time: 05/06/2019 17:58:32
                Total Duration: 00:00:01
                Error:
                    Code: ResourceReportedUnhealthy
                    Message: Health checks failed as the following resources were unhealthy: '05/06/2019 17:58:32 UTC: Health check 'appHealth' failed with the following errors: Response from endpoint 'https://myhc0417webapp.azurewebsites.net/api/healthStatus/unhealthy' does not match the regex pattern(s): 'Status: healthy, Status: warning.'. Response content: "Status: unhealthy"..'.
At line:1 char:1
+ Get-AzDeploymentManagerRollout `
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
+ CategoryInfo          : NotSpecified: (:) [Get-AzDeploymentManagerRollout], Exception
+ FullyQualifiedErrorId : RolloutFailed,Microsoft.Azure.Commands.DeploymentManager.Commands.GetRollout


ResourceGroupName       : myhc0417rg
BuildVersion            : 1.0.0.0
ArtifactSourceId        : /subscriptions/<Subscription ID>/resourceGroups/myhc0417rg/providers/Mi
                          crosoft.DeploymentManager/artifactSources/myhc0417ArtifactSourceRollout
TargetServiceTopologyId : /subscriptions/<Subscription ID>/resourceGroups/myhc0417rg/providers/Mi
                          crosoft.DeploymentManager/serviceTopologies/myhc0417ServiceTopology
Status                  : Failed
TotalRetryAttempts      : 0
Identity                : Microsoft.Azure.Commands.DeploymentManager.Models.PSIdentity
OperationInfo           : Microsoft.Azure.Commands.DeploymentManager.Models.PSRolloutOperationInfo
Services                : {myhc0417ServiceWUS, myhc0417ServiceWUSrg}
Name                    : myhc0417Rollout
Type                    : Microsoft.DeploymentManager/rollouts
Location                : centralus
Id                      : /subscriptions/<Subscription ID>/resourcegroups/myhc0417rg/providers/Mi
                          crosoft.DeploymentManager/rollouts/myhc0417Rollout
Tags                    :
```

After the rollout is completed, you shall see one additional resource group created for West US.

## Deploy the rollout with the healthy status

Repeat this section to redeploy the rollout with the healthy status URL.  After the rollout is completed, you shall see one more resource group created for East US.

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
