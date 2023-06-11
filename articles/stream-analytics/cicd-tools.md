---
title: Automate builds, tests, and deployments of an Azure Stream Analytics job using CI/CD tools
description: This article describes how to use Azure Stream Analytics CI/CD tools to auto build, test, and deploy an Azure Stream Analytics project.
services: stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.service: stream-analytics
ms.topic: how-to
ms.date: 03/08/2023
---

# Automate builds, tests, and deployments of a Stream Analytics project

The Azure Stream Analytics (ASA) CI/CD npm package allows you to automatically build, test, and deploy your Stream Analytics projects. This article shows how to use the npm package with any CI/CD system. To set up a pipeline with Azure DevOps, see [Use Azure DevOps to create a CI/CD pipeline for a Stream Analytics job](set-up-cicd-pipeline.md).

If you don't have a Stream Analytics project, [create one using Visual Studio Code](./quick-create-visual-studio-code.md) or export an existing one from the Azure portal.

## Installation

You can download the package from [npm site](https://www.npmjs.com/package/azure-streamanalytics-cicd), or run the following command in your terminal.

```powershell
npm install -g azure-streamanalytics-cicd
```

## Build project

> [!NOTE]
> We highly recommend that you use the `--v2` option for the updated ARM template schema. The updated schema has fewer parameters yet retains the same functionality as the previous version.
>
> The old ARM template will be deprecated in the future. From now on, only templates that were created via `build --v2` will receive updates or bug fixes.

```powershell
azure-streamanalytics-cicd build --v2 --project <projectFullPath> [--outputPath <outputPath>]
```

The *build* command does a keyword syntax check and generates Azure Resource Manager (ARM) templates.

| Argument | Description |
|---|---|
| `--project` | Specify the **asaproj.json** file using absolute or relative path. |
| `--outputPath` |  Specify the output folder for storing ARM Templates using absolute or relative path. If `outputPath` isn't specified, the templates are placed in the current directory. |

**Example**:

```powershell
# Go to the project directory
cd <path-to-the-project>

# Build project
azure-streamanalytics-cicd build --v2 --project ./asaproj.json --outputPath ./Deploy
```

If the project is built successfully, you see two JSON files created under the output folder:

* ARM template file: `[ProjectName].JobTemplate.json`
* ARM parameter file: `[ProjectName].JobTemplate.parameters.json`

The default values for **parameters.json** file come from your project settings. If you want to deploy to another environment, replace the values accordingly.

The default values for all credentials are **null**. You're required to set the values before you deploy to Azure.

```json
"Input_EntryStream_sharedAccessPolicyKey": {
  "value": null
}
```

To use Managed Identity for Azure Data Lake Store Gen1 as output sink, you need to provide Access to the service principal using PowerShell before deploying to Azure. Learn more about how to [deploy ADLS Gen1 with Managed Identity with Resource Manager template](https://aka.ms/asamideploy).

## Run locally

If your project has specified local input files, you can run a Stream Analytics script locally by using the `localrun` command.

```powershell
azure-streamanalytics-cicd localrun -project <projectFullPath> [-outputPath <outputPath>] [-customCodeZipFilePath <zipFilePath>]
```
| Argument | Description |
|---|---|
| `--project` | Specify the **asaproj.json** file using absolute or relative path. |
| `--outputPath` |  Specify the output folder for storing ARM Templates using absolute or relative path. If `outputPath` isn't specified, the templates are placed in the current directory. |
| `--customCodeZipFilePath` | The path of the zip file for C# custom code, such as a UDF or deserializer, if they're used. Package the DLLs into a zip file and specify this path. |

**Example**:

```powershell
# Go to the project directory
cd <path-to-the-project>

# Run project locally
azure-streamanalytics-cicd localrun --project ./asaproj.json"
```

> [!NOTE]
> JavaScript UDF only works on Windows.

## Automated test

You can use the CI/CD npm package to configure and run automated tests for your Stream Analytics project.

### Add a test case

```powershell
azure-streamanalytics-cicd addtestcase --project <projectFullPath> [-testConfigPath <testConfigFileFullPath>]
```

You can find the test cases in the test configuration file.

| Argument | Description |
|---|---|
| `--project` | Specify the **asaproj.json** file using absolute or relative path. |
| `--testConfigPath` | The path of the test configuration file. If it isn't specified, the file is searched in **\test** under the current directory of the **asaproj.json** file, with default file name **testConfig.json**. A new file is created if not existed. |

**Example**:

```powershell
# Go to the project directory
cd <path-to-the-project>

# Add a test case
azure-streamanalytics-cicd addtestcase --project ./asaproj.json
```

If the test configuration file is empty, the following content is added to the file. Otherwise, a test case is added to a **TestCases** array. Necessary input configurations are automatically filled according to the input configuration file. **FilePath** of each input and expected output must be specified before running the test. You can modify this configuration manually.

If you want the test validation to ignore a certain output, set the **Required** field of that expected output to **false**.

```json
{
  "Script": [Absolute path of your script],
  "TestCases": [
    {
      "Name": "Case 1",
      "Inputs": [
        {
          "InputAlias": [Input alias string],
          "Type": "Data Stream",
          "Format": "JSON",
          "FilePath": [Required],
          "ScriptType": "InputMock"
        }
      ],
      "ExpectedOutputs": [
        {
          "OutputAlias": [Output alias string],
          "FilePath": [Required],
          "IgnoreFields": [Fields to ignore for test validation, e.g., ["col1", "col2"]],
          "Required": true
        }
      ]
    }
  ]
}
```

### Run unit test

You can use the following command to run multiple test cases for your project. A summary of test results is generated in the output folder. The process exits with code **0** for all tests passed; **-1** for exception occurred; **-2** for tests failed.

```powershell
azure-streamanalytics-cicd test --project <projectFullPath> [--testConfigPath <testConfigFileFullPath>] [--outputPath <outputPath>] [--customCodeZipFilePath <zipFilePath>]
```

| Argument | Description |
|---|---|
| `--project` | The path of the **asaproj.json** file. |
| `--testConfigPath` | The path to the test configuration file. If it isn't specified, the file is searched in **\test** under the current directory of the **asaproj.json** file, with default file name **testConfig.json**.
| `--outputPath` | The path of the test result output folder. If it isn't specified, the output result files are placed in the current directory. |
| `--customCodeZipFilePath` | The path of the zip file for custom code such as a UDF or deserializer, if they're used. You need to package the DLLs to zip file and specify the path. |

If test cases are executed, you can find a **testResultSummary.json** file generated in the output folder.

```json
{
  "Total": (integer) total_number_of_test_cases,
  "Passed": (integer) number_of_passed_test_cases,
  "Failed": (integer) number_of_failed_test_cases,
  "Script": (string) absolute_path_to_asaql_file,
  "Results": [ (array) detailed_results_of_test_cases
    {
      "Name": (string) name_of_test_case,
      "Status": (integer) 0(passed)_or_1(failed),
      "Time": (string) time_span_of_running_test_case,
      "OutputMatched": [ (array) records_of_actual_outputs_equal_to_expected_outputs
        {
          "OutputAlias": (string) output_alias,
          "ExpectedOutput": (string) path_to_the_expected_output_file,
          "Output": (string) path_to_the_actual_output_file
        }
      ],
      "OutputNotEqual": [ (array) records_of_actual_outputs_not_equal_to_expected_outputs
        {
          "OutputAlias": (string) output_alias,
          "ExpectedOutput": (string) path_to_the_expected_output_file,
          "Output": (string) path_to_the_actual_output_file
        }
      ],
      "OutputMissing": [ (array) records_of_actual_outputs_missing
        {
          "OutputAlias": (string) output_alias,
          "ExpectedOutput": (string) path_to_the_expected_output_file,
          "Output": ""
        }
      ],
      "OutputUnexpected": [ (array) records_of_actual_outputs_unexpected
        {
          "OutputAlias": (string) output_alias,
          "ExpectedOutput": "",
          "Output": (string) path_to_the_actual_output_file
        }
      ],
      "OutputUnrequired": [ (array) records_of_actual_outputs_unrequired_to_be_checked
        {
          "OutputAlias": (string) output_alias,
          "ExpectedOutput": (string) path_to_the_expected_output_file,
          "Output": (string) path_to_the_actual_output_file
        }
      ]
    }
  ],
  "Time": (string) time_span_of_running_all_test_cases,
}
```

> [!NOTE]
> If the query results contain float values, you might experience slight differences in the produced values leading to a probably failed test. This is based on the different .NET frameworks powering the Visual Studio or Visual Studio engine and the test processing engine. If you want to make sure that the tests run successfully, you'll have to decrease the precision of your produced values or align the results to be compared manually to the generated test results.


## Deploy to Azure

To deploy your Stream Analytics project using ARM templates, follow these steps:
1. Connect to your Azure account:

    ```powershell
    # Connect to Azure
    Connect-AzAccount
    # Set the Azure subscription
    Set-AzContext [SubscriptionID/SubscriptionName]
    ```

2. Deploy your Stream Analytics project:

    ```powershell
    $templateFile = ".\Deploy\ClickStream-Filter.JobTemplate.json"
    $parameterFile = ".\Deploy\ClickStream-Filter.JobTemplate.parameters.json"
    New-AzResourceGroupDeployment `
      -Name devenvironment `
      -ResourceGroupName myResourceGroupDev `
      -TemplateFile $templateFile `
      -TemplateParameterFile $parameterFile
    ```

For more information about deploying resources with ARM templates, see [Deploy with a Resource Manager template file and Azure PowerShell](https://aka.ms/armdeploytemplate).

## Next steps

* [Continuous integration and Continuous deployment for Azure Stream Analytics](cicd-overview.md)
* [Set up CI/CD pipeline for Stream Analytics job using Azure Pipelines](set-up-cicd-pipeline.md)