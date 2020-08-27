---
title: Global parameters
description: Set global parameters for each of your Azure Data Factory environments
services: data-factory
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
author: djpmsft
ms.author: daperlov
ms.date: 08/05/2020
---

# Global parameters in Azure Data Factory

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Global parameters are constants across a data factory that can be consumed by a pipeline in any expression. They're useful when you have multiple pipelines with identical parameter names and values. When promoting a data factory using the continuous integration and deployment process (CI/CD), you can override these parameters in each environment. 

## Creating global parameters

To create a global parameter, go to the *Global parameters* tab in the *Manage* section. Select **New** to open the creation side-nav.

![Create global parameters](media/author-global-parameters/create-global-parameter-1.png)

In the side-nav, enter a name, select a data type, and specify the value of your parameter.

![Create global parameters](media/author-global-parameters/create-global-parameter-2.png)

After a global parameter is created, you can edit it by clicking the parameter's name. To alter multiple parameters at once, select **Edit all**.

![Create global parameters](media/author-global-parameters/create-global-parameter-3.png)

## Using global parameters in a pipeline

Global parameters can be used in any [pipeline expression](control-flow-expression-language-functions.md). If a pipeline is referencing another resource such as a dataset or data flow, you can pass down the global parameter value via that resource's parameters. Global parameters are referenced as `pipeline().globalParameters.<parameterName>`.

![Using global parameters](media/author-global-parameters/expression-global-parameters.png)

## <a name="cicd"></a> Global parameters in CI/CD

Global parameters have unique CI/CD process relative to other entities in Azure Data Factory. When you publish a factory or export an ARM template with global parameters, a folder called *globalParameters* is created with a file called *your-factory-name_GlobalParameters.json*. This file is a JSON object that contains each global parameter type and value in the published factory.

![Publishing global parameters](media/author-global-parameters/global-parameters-adf-publish.png)

If you're deploying to a new environment such as TEST or PROD, its recommended to create a copy of this global parameters file and overwrite the appropriate environment-specific values. When you republish the original global parameters file will get overwritten, but the copy for the other environment will be untouched.

For example, if you have a factory named 'ADF-DEV' and a global parameter of type string named 'environment' with a value 'dev', when you publish a file named *ADF-DEV_GlobalParameters.json* will get generated. If deploying to a test factory named 'ADF_TEST', create a copy of the JSON file (for example named ADF-TEST_GlobalParameters.json) and replace the parameter values with the environment-specific values. The parameter 'environment' may have a value 'test' now. 

![Deploying global parameters](media/author-global-parameters/powershell-task.png)

Use the below PowerShell script to promote global parameters to additional environments. Add an Azure PowerShell DevOps task before your ARM Template deployment. In the DevOps task, you must specify the location of the new parameters file, the target resource group, and the target data factory.

> [!NOTE]
> To deploy global parameters using PowerShell, you must use at least version 4.4.0 of the Az module.

```powershell
param
(
    [parameter(Mandatory = $true)] [String] $globalParametersFilePath,
    [parameter(Mandatory = $true)] [String] $resourceGroupName,
    [parameter(Mandatory = $true)] [String] $dataFactoryName
)

Import-Module Az.DataFactory

$newGlobalParameters = New-Object 'system.collections.generic.dictionary[string,Microsoft.Azure.Management.DataFactory.Models.GlobalParameterSpecification]'

Write-Host "Getting global parameters JSON from: " $globalParametersFilePath
$globalParametersJson = Get-Content $globalParametersFilePath

Write-Host "Parsing JSON..."
$globalParametersObject = [Newtonsoft.Json.Linq.JObject]::Parse($globalParametersJson)

foreach ($gp in $globalParametersObject.GetEnumerator()) {
    Write-Host "Adding global parameter:" $gp.Key
    $globalParameterValue = $gp.Value.ToObject([Microsoft.Azure.Management.DataFactory.Models.GlobalParameterSpecification])
    $newGlobalParameters.Add($gp.Key, $globalParameterValue)
}

$dataFactory = Get-AzDataFactoryV2 -ResourceGroupName $resourceGroupName -Name $dataFactoryName
$dataFactory.GlobalParameters = $newGlobalParameters

Write-Host "Updating" $newGlobalParameters.Count "global parameters."

Set-AzDataFactoryV2 -InputObject $dataFactory -Force
```

## Next steps

* Learn about Azure Data Factory's [continuous integration and deployment process](continuous-integration-deployment.md)
* Learn how to use the [control flow expression language](control-flow-expression-language-functions.md)