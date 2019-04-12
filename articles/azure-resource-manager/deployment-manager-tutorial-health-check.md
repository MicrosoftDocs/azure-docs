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
ms.date: 04/12/2019
ms.topic: tutorial
ms.author: jgao

---

# Tutorial: Use Azure Deployment Manager health check (Private preview)

Learn how to use health check steps in [Azure Deployment Manager](./deployment-manager-overview.md). This tutorial is based of the [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md) tutorial.  You must complete that tutorial before you proceed with this one.

In the rollout template used in [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md), you defined and used a wait step. In this tutorial, you replace the wait step with a health check step.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Understand the scenario
> * Download the tutorial files
> * Prepare the artifacts
> * Create the user-defined managed identity
> * Create the service topology template
> * Create the rollout template
> * Deploy the templates
> * Verify the deployment
> * Deploy the newer version
> * Clean up resources

The Azure Deployment Manager REST API reference can be found [here](https://docs.microsoft.com/rest/api/deploymentmanager/).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

To complete this article, you need:

* Complete [Use Azure Deployment Manager with Resource Manager templates](./deployment-manager-tutorial.md).

## Create a health check service

To test the health check function, you need a health check service. An easy solution is to create an [Azure Function](/azure/azure-functions/). The function takes two parameters - application name, and status, and returns the two values. Your Azure Deployment Manager template uses the status value to determine the action. The knowledge of Azure Function is not required to complete this tutorial.

Two files are used for deploying the Azure Function:

* A resource manager template located at [https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json](https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json). You deploy this template to create an Azure Function.  
* A zip file of the Azure Function source code, [https://armtutorials.blob.core.windows.net/admtutorial/RestHealthTest.zip](https://armtutorials.blob.core.windows.net/admtutorial/RestHealthTest.zip). This zip called is called by the resource manager template.

You don't need to download these two files, but it is helpful to review the files.

To deploy the Azure function, select **Try it** to open the Azure Cloud shell, and then paste the following script into the shell window.  To paste the code, right-click the shell window.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter an application name used to create Azure resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$resourceGroupName = "${projectName}rg"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://armtutorials.blob.core.windows.net/admtutorial/deploy_hc_azure_function.json" -projectName $projectName

```

To verify and test the Azure function:

1. Open the [Azure portal](https://portal.azure.com).
1. Open the resource group.  The default name is the project name with "rg" appended.
1. Select the app service from the resource group.  The default name of the app service is the project name with "webapp" appended.
1. Expand **Functions**, and then select **HttpTriggerCSharp1**. 
1. Select **&lt;/> Get function URL**.
1. Select **Copy** to copy the URL to the clipboard.  The URL is similar to:

    ```url
    https://johndole0411webapp.azurewebsites.net/api/applications/{applicationName}/healthStatus/{healthStatus}?code=YQEoeUSinBs49zZ9pgfjqQ3xzJ8BXlLavlL0sEbpeLr2uRIhO49JuA==
    ```

    The code value is the Azure function authorization key. You need the key later in the tutorial.

1. Update the URL with the application name and the health status filled, such as:

    ```url
    https://johndole0411webapp.azurewebsites.net/api/applications/johndoleapp1/healthStatus/healthy?code=YQEoeUSinBs49zZ9pgfjqQ3xzJ8BXlLavlL0sEbpeLr2uRIhO49JuA==
    ```
1. Open the URL from a browser.  The result shall be similar to:

    ```xml
    <string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">AppName: johndoleapp1 Status: healthy</string>
    ```

## Revise the rollout template

bla, bla, bla ...

1. Open Create ADMRollout.json.
1. Replace the wait step resource definition with the following:

    ```json
    {
      "type": "Microsoft.DeploymentManager/steps",
      "apiVersion": "2018-09-01-preview",
      "name": "healthCheckStep",
			"location": "[parameters('azureResourceLocation')]",
      "properties": {
        "stepType": "healthCheck",
        "attributes": {
          "waitDuration": "PT1M",
          "maxElasticDuration": "PT2M",
          "healthyStateDuration": "PT2M",
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
1. Update **stepGroup1** with the following.

    ```
    {
        "name": "stepGroup1",
        "preDeploymentSteps": [
            {
                "stepId": "[resourceId('Microsoft.DeploymentManager/steps/', 'HealthCheckStep')]"
            }
        ],
        "deploymentTargetId": "[resourceId('Microsoft.DeploymentManager/serviceTopologies/services/serviceUnits', variables('serviceTopology').name, variables('serviceTopology').serviceWUS.name,  variables('serviceTopology').serviceWUS.serviceUnit2.name)]",
        "postDeploymentSteps": []
    },



## Deploy the topology


```azurepowershell-interactive

$projectName = Read-Host -Prompt "Enter a project name used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$resourceGroupName = "${projectName}rg"
$artifactLocation = "https://armtutorials.blob.core.windows.net/admtutorial/ArtifactStore" | ConvertTo-SecureString -AsPlainText -Force

# Create the service topology
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://armtutorials.blob.core.windows.net/admtutorial/ADMTemplates/CreateADMServiceTopology.json" `
    -namePrefix $projectName `
    -azureResourceLocation $location `
    -artifactSourceSASLocation $artifactLocation
```


## Deploy the templates

Azure PowerShell can be used to deploy the templates. 

1. Run the script to deploy the service topology.

    ```azurepowershell
    $resourceGroupName = "<Enter a Resource Group Name>"
    $location = "Central US"  
    $filePath = "<Enter the File Path to the Downloaded Tutorial Files>"

    # Create a resource group
    New-AzResourceGroup -Name $resourceGroupName -Location "$location"

    # Create the service topology
    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -TemplateFile "$filePath\ADMTemplates\CreateADMServiceTopology.json" `
        -TemplateParameterFile "$filePath\ADMTemplates\CreateADMServiceTopology.Parameters.json"
    ```

    > [!NOTE]
    > `New-AzResourceGroupDeployment` is an asynchronous call. The success message only means the deployment has successfully begun. To verify the deployment, see step 2 and step 4 of this procedure.

2. Verify the service topology and the underlined resources have been created successfully using the Azure portal:

    ![Azure Deployment Manager tutorial deployed service topology resources](./media/deployment-manager-tutorial/azure-deployment-manager-tutorial-deployed-topology-resources.png)

    **Show hidden types** must be selected to see the resources.

3. <a id="deploy-the-rollout-template"></a>Deploy the rollout template:

    ```azurepowershell
    # Create the rollout
    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -TemplateFile "$filePath\ADMTemplates\CreateADMRollout.json" `
        -TemplateParameterFile "$filePath\ADMTemplates\CreateADMRollout.Parameters.json"
    ```

4. Check the rollout progress using the following PowerShell script:

    ```azurepowershell
    # Get the rollout status
    $rolloutname = "<Enter the Rollout Name>" # "adm0925Rollout" is the rollout name used in this tutorial
    Get-AzDeploymentManagerRollout `
        -ResourceGroupName $resourceGroupName `
        -Name $rolloutName `
        -Verbose
    ```

    The Deployment Manager PowerShell cmdlets must be installed before you can run this cmdlet. See Prerequisites. The -Verbose switch can be used to see the whole output.

    The following sample shows the running status:

    ```
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

    After the rollout is deployed successfully, you shall see two more resource groups created, one for each service.

## Verify the deployment

1. Open the [Azure portal](https://portal.azure.com).
2. Browse to the newly create web applications under the new resource groups created by the rollout deployment.
3. Open the web application in a web browser. Verify the location and the version on the index.html file.

## Deploy the revision

When you have a new version (1.0.0.1) for the web application. You can use the following procedure to redeploy the web application.

1. Open CreateADMRollout.Parameters.json.
2. Update **binaryArtifactRoot** to **binaries/1.0.0.1**.
3. Redeploy the rollout as instructed in [Deploy the templates](#deploy-the-rollout-template).
4. Verify the deployment as instructed in [Verify the deployment](#verify-the-deployment). The web page shall show the 1.0.0.1 version.

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

In this tutorial, you learned how to use Azure Deployment Manager. To learn more, see [Azure Resource Manager documentation](/azure/azure-resource-manager/).
