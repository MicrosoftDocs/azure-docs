---
title: Use Template Validator to check templates for Azure Stack | Microsoft Docs
description: Check templates for deployment to Azure Stack
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: byronr
editor: ''

ms.assetid: d9e6aee1-4cba-4df5-b5a3-6f38da9627a3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: helaw

---

# Check your templates for Azure Stack with Template Validator

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can use the template validation tool to check if your Azure Resource Manager [templates](azure-stack-arm-templates.md) are ready for Azure Stack. The template validation tool is available as a part of the Azure Stack tools. Download the Azure Stack tools by using the steps described in the [download tools from GitHub](azure-stack-powershell-download.md) article. 

To validate templates, you use the following PowerShell modules and the JSON file located in **TemplateValidator** and **CloudCapabilities** folders: 

 - AzureRM.CloudCapabilities.psm1 creates a cloud capabilities JSON file representing the services and versions in a cloud like Azure Stack.
 - AzureRM.TemplateValidator.psm1 uses a cloud capabilities JSON file to test templates for deployment in Azure Stack.
 - AzureStackCloudCapabilities_with_AddOns_20170627.json is a default cloud capabilities file.  You can create your own, or use this file to get started. 

In this topic, you run validation against your templates, and optionally build a cloud capabilities file.

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

Any template validation warnings or errors are logged to the PowerShell console, and are also logged to an HTML file in the source directory. An example of the validation report output looks like this:

![sample validation report](./media/azure-stack-validate-templates/image1.png)

### Parameters

| Parameter | Description | Required |
| ----- | -----| ----- |
| TemplatePath | Specifies the path to recursively find Resource Manager templates | Yes | 
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

## Build cloud capabilities file
The downloaded files include a default *AzureStackCloudCapabilities_with_AddOns_20170627.json* file, which describes the service versions available in Azure Stack Development Kit with PaaS services installed.  If you install additional Resource Providers, you can use the AzureRM.CloudCapabilities PowerShell module to build a JSON file including the new services.  

1.  Make sure you have connectivity to Azure Stack.  These steps can be performed from the Azure Stack development kit host, or you can use [VPN](azure-stack-connect-azure-stack.md#connect-to-azure-stack-with-vpn) to connect from your workstation. 
2.  Import the AzureRM.CloudCapabilities PowerShell module:

    ```PowerShell
    Import-Module .\CloudCapabilities\AzureRM.CloudCapabilities.psm1
    ``` 

3.  Use the Get-CloudCapabilities cmdlet to retrieve service versions and create a cloud capabilities JSON file:

    ```PowerShell
    Get-AzureRMCloudCapabilities -Location 'local' -Verbose
    ```             


## Next steps
 - [Deploy templates to Azure Stack](azure-stack-arm-templates.md)
 - [Develop templates for Azure Stack](azure-stack-develop-templates.md)

