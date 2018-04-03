---
title: Use Template Validator to check templates for Azure Stack | Microsoft Docs
description: Check templates for deployment to Azure Stack
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid: d9e6aee1-4cba-4df5-b5a3-6f38da9627a3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/20/2018
ms.author: brenduns
ms.reviewer: jeffgo

---

# Check your templates for Azure Stack with Template Validator

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can use the template validation tool to check if your Azure Resource Manager [templates](azure-stack-arm-templates.md) are ready for Azure Stack. The template validation tool is available as a part of the Azure Stack tools. Download the Azure Stack tools by using the steps described in the [download tools from GitHub](azure-stack-powershell-download.md) article. 

To validate templates, you use the following PowerShell modules in **TemplateValidator** and **CloudCapabilities** folders: 

 - AzureRM.CloudCapabilities.psm1 creates a cloud capabilities JSON file representing the services and versions in a cloud like Azure Stack.
 - AzureRM.TemplateValidator.psm1 uses a cloud capabilities JSON file to test templates for deployment in Azure Stack.
 
In this article, you build a cloud capabilities file and then run the validator tool.

## Build cloud capabilities file
Before you use the template validator, run the AzureRM.CloudCapabilities PowerShell module to build a JSON file. If you update your integrated system, or add any new services or VM extensions you should also run that module again.

1.  Make sure you have connectivity to Azure Stack. These steps can be performed from the Azure Stack development kit host, or you can use a [VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn) to connect from your workstation. 
2.  Import the AzureRM.CloudCapabilities PowerShell module:

    ```PowerShell
    Import-Module .\CloudCapabilities\AzureRM.CloudCapabilities.psm1
    ``` 

3.  Use the Get-CloudCapabilities cmdlet to retrieve service versions and create a cloud capabilities JSON file. If you don't specify -OutputPath, the file AzureCloudCapabilities.Json is created in the current directory. Use your actual location:

    ```PowerShell
    Get-AzureRMCloudCapability -Location <your location> -Verbose
    ```             

## Validate templates
In these steps, you validate templates by using the AzureRM.TemplateValidator PowerShell module. You can use your own templates, or validate the [Azure Stack Quickstart templates](https://github.com/Azure/AzureStack-QuickStart-Templates).

1.  Import the AzureRM.TemplateValidator.psm1 PowerShell module:
    
    ```PowerShell
    cd "c:\AzureStack-Tools-master\TemplateValidator"
    Import-Module .\AzureRM.TemplateValidator.psm1
    ```

2.  Run the template validator:

    ```PowerShell
    Test-AzureRMTemplate -TemplatePath <path to template.json or template folder> `
    -CapabilitiesPath <path to cloudcapabilities.json> `
    -Verbose
    ```

Any template validation warnings or errors are logged to the PowerShell console and an HTML file in the source directory. Here is an example of the validation report:

![sample validation report](./media/azure-stack-validate-templates/image1.png)

### Parameters

| Parameter | Description | Required |
| ----- | -----| ----- |
| TemplatePath | Specifies the path to recursively find Azure Resource Manager templates | Yes | 
| TemplatePattern | Specifies the name of template files to match. | No |
| CapabilitiesPath | Specifies the path to cloud capabilities JSON file | Yes | 
| IncludeComputeCapabilities | Includes evaluation of IaaS resources like VM Sizes and VM Extensions | No |
| IncludeStorageCapabilities | Includes evaluation of storage resources like SKU types | No |
| Report | Specifies name of the generated HTML report | No |
| Verbose | Logs errors and warnings to the console | No|


### Examples
This example validates all the [Azure Stack Quickstart templates](https://github.com/Azure/AzureStack-QuickStart-Templates) downloaded locally, and also validates the VM sizes and extensions against Azure Stack Development Kit capabilities.

```PowerShell
test-AzureRMTemplate -TemplatePath C:\AzureStack-Quickstart-Templates `
-CapabilitiesPath .\TemplateValidator\AzureStackCloudCapabilities_with_AddOns_20170627.json.json `
-TemplatePattern MyStandardTemplateName.json`
-IncludeComputeCapabilities`
-Report TemplateReport.html
```


## Next steps
 - [Deploy templates to Azure Stack](azure-stack-arm-templates.md)
 - [Develop templates for Azure Stack](azure-stack-develop-templates.md)

