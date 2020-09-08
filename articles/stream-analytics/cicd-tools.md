---
title: Automate build, test and deployment of an Azure Stream Analytics job using CI/CD tools
description: This article describes how to use Azure Stream Analytics CI/CD tools to auto build, test and deploy an Azure Stream Analytics project.
services: stream-analytics
author: sujie
ms.author: sujie
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: how-to
ms.date: 09/10/2020
---

# Automate build, test and deployment of an Azure Stream Analytics job using CI/CD tools
You can use the Azure Stream Analytics CI/CD npm package to auto build, test and deploy your Azure Stream Analytics Visual Studio Code (recommended) or Visual Studio projects. The projects can be created in the developement tools or exported from existing Stream Analytics jobs. This article describes how to use the npm package in general with any CI/CD system. You can refer to the [specific instructions]() for deployment with Azure Pipelines. 


## Installation
You can [download the package](https://www.npmjs.com/package/azure-streamanalytics-cicd) directly, or install it [globally](https://docs.npmjs.com/downloading-and-installing-packages-globally) via the `npm install -g azure-streamanalytics-cicd` command. This is the recommended approach, which can also be used in a PowerShell or Azure CLI script task of a build pipeline in **Azure Pipelines**.

## Build the project
The **asa-streamanalytics-cicd** npm package provides the tools to generate Azure Resource Manager templates of [Stream Analytics Visual Studio Code projects](quick-create-vs-code.md) (recommended) or [Stream Analytics Visual Studio projects](). It can be used on Windows, macOS, and Linux without installing Visual Studio Code or Visual Studio.

Once you have installed the package, use the following command to build your Stream Analytics projects. 

```powershell
azure-streamanalytics-cicd build -project <projectFullPath> [-outputPath <outputPath>]
```

The *build* command does two things:
1. Keyword syntax check
2. Output the Azure Resource Manager templates. 


| Parameter | Description |
|---|---|
| -project | The absolute path of the **asaproj.json** file for your Visual Studio Code project or **[Your project name].asaproj** for Visual Studio project. |
| -outputPath | The path of the output folder for Azure Resource Manager Tempates. If it is not specified, the templates will be placed in the current directory. |

Example:

VS Code project
```powershell
azure-streamanalytics-cicd build -project "/Users/roger/projects/samplejob/asaproj.json"
```

Visual Studio project
```powershell
azure-streamanalytics-cicd build -project "/Users/roger/projects/samplejob/samplejob.asaproj"
```

When a Stream Analytics project builds successfully, it generates the following two files under the output folder:

*  Azure Resource Manager template file

       [ProjectName].JobTemplate.json

*  Azure Resource Manager parameter file

       [ProjectName].JobTemplate.parameters.json

The default parameters in the parameters.json file are from the settings in your Visual Studio Code or Visual Studio project. If you want to deploy to another environment, replace the parameters accordingly.

> [!NOTE]
> For all the credentials, the default values are set to null. You are **required** to set the values before you deploy to the cloud. Below is an example.

```json
"Input_EntryStream_sharedAccessPolicyKey": {
      "value": null
    },
```

To use Managed Identity for Azure Data Lake Store Gen1 as output sink, you need to provide Access to the service principal using PowerShell before deploying to Azure. Learn more about how to [deploy ADLS Gen1 with Managed Identity with Resource Manager template](stream-analytics-managed-identities-adls.md#resource-manager-template-deployment).


### Local Run
If your project has specified local input files, you can run a Stream Analytics script locally by using the *localrun* command.

```powershell
azure-streamanalytics-cicd localrun -project <projectFullPath> [-outputPath <outputPath>] [-customCodeZipFilePath <zipFilePath>]
```

| Parameter | Description |
|---|---|
| -project | The path of the **asaproj.json** file for your Visual Studio Code project or **[Your project name].asaproj** for Visual Studio project. |
| -outputPath | The path of the output folder. If it is not specified, the output result files will be placed in the current directory. |
| -customCodeZipFilePath | The path of the zip file for C# custom code (UDF, deserializer, etc) if they are used. |

Example:

VS Code project
```powershell
azure-streamanalytics-cicd localrun -project "/Users/roger/projects/samplejob/asaproj.json"
```

Visual Studio project
```powershell
azure-streamanalytics-cicd localrun -project "/Users/roger/projects/samplejob/samplejob.asaproj"
```
[!Note] Javascript UDF only works on Windows. 

## Automated Test
You can use the CI/CD npm package to configure and run automated test for your Stream Analytics script.

### Add test case
The test cases are described in a test configuration file.
To get starated, use the **addtestcase** command to add a test case template into the test configuration file. If the test configuration file doesn't exist, it will create one by default.

```powershell
azure-streamanalytics-cicd addtestcase -project <projectFullPath> [-testConfigPath <testConfigFileFullPath>]
```

| Parameter | Description |
|---|---|
| -project | The path of the **asaproj.json** file for your Visual Studio Code project or **[Your project name].asaproj** for Visual Studio project. |
| -testConfigPath | The path of the test configuration file. If it is not specified, the file will be searched in **\test** under the current directory of the **asaproj.json** file, with default file name **testConfig.json**. A new file will be created if not existed. |

Example:

VS Code project
```powershell
azure-streamanalytics-cicd addtestcase -project "/Users/roger/projects/samplejob/asaproj.json"
```

Visual Studio project
```powershell
azure-streamanalytics-cicd addtestcase -project "/Users/roger/projects/samplejob/samplejob.asaproj"
```

If the test configuration file is empty, the following content will be written into the file. Otherwise, a test case will be added into the array of **TestCases**. Necessary input configurations are auto filled in according to the input configuration files if they exist. Otherwise, they are configured with default values. **FilePath** of each input and expected output must be specified before running the test. You can modify the configuration manually.

[!Note] SerilazationDllPath, SerializationClassName and SerializationPathInLocal
If you want the test validation to ignore centain output, set the **Required** field of that expected output to **false**.

*  testConfig.json
```json
{
  "Script": "",
  "TestCases": [
    {
      "Name": "Case 1",
      "Inputs": [
        {
          "InputAlias": [Input alias string],
          "Type": "Data Stream",
          "Format": "JSON",
          "FilePath": [Required],
          "SerializationDllPath": null,
          "SerializationClassName": null,
          "SerializationDllPathInLocal": null,
          "Sample": null,
          "ScriptType": "InputMock"
        }
      ],
      "ExpectedOutputs": [
        {
          "OutputAlias": [Output alias string],
          "FilePath": "Required",
          "Required": true
        }
      ]
    }
  ]
}
```
### Run unit test
You can use the following command to run multiple test cases for your project. A summary of test result will be placed in the output folder. The process exits with code **0** for all tests passed; **-1** for exception occurred; **-2** for tests failed.


```powershell
azure-streamanalytics-cicd test -project <projectFullPath> [-testConfigPath <testConfigFileFullPath>] [-outputPath <outputPath>] [-customCodeZipFilePath <zipFilePath>]
```

| Parameter | Description |
|---|---|
| -project | The path of the **asaproj.json** file for your Visual Studio Code project or **[Your project name].asaproj** for Visual Studio project. |
| -testConfigPath | The path to the test configuration file. If it is not specified, the file will be searched in **\test** under the current directory of the **asaproj.json** file, with default file name **testConfig.json**.
| -outputPath | The path of the test result output folder. If it is not specified, the output result files will be placed in the current directory. |
| -customCodeZipFilePath | The path of the zip file for custom code (UDF, deserializer, etc) if they are used. |


When all tests are finished, it generates a summary of test results in JSON format into the output folder, named **testResultSummary.json**.

*  Example of testResultSummary.json

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

## Deploy to Azure

You can use the Azure Resource Manager template and parameter files generated from Build to [deploy your job to Azure](azure-resource-manager/templates/template-tutorial-use-parameter-file?tabs=azure-powershell#deploy-template). 


## Next Steps

* [Continuous integration and Continuous deployment for Azure Stream Analytics](cicd/cicd-overview)
* [Setup CI/CD pipeline for Stream Analytics job using Azure Pipelines](cicd/setup-cicd-pipeline)






