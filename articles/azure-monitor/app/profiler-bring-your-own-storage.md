---
title: Configure BYOS (Bring Your Own Storage) for Profiler & Snapshot Debugger
description: Configure BYOS (Bring Your Own Storage) for Profiler & Snapshot Debugger
ms.topic: conceptual
author: renatosalas
ms.author: regutier
ms.date: 04/14/2020

ms.reviewer: mbullwin
---

# Configure BYOS (Bring Your Own Storage) for Profiler & Snapshot Debugger

## What is Bring Your Own Storage (BYOS) and why I need it?
Applications used to send profiler and snapshot debugger data to a regional storage account provided by the Diagnostic Services.

With Bring Your Own Storage, the diagnostics data, it's written into your own storage accounts, giving you the capability to control it at your own pace.

One thing to have in mind is that you'll take over of all the related costs of the storage account, like Storage and Networking. 

## How does my Storage Account will be accessed?
1. The data it's written by agents running in your Virtual Machines or App Service.
1. Your application contacts our service (Profiler/Debugger) when they want to upload data and we hand back a SAS (Shared Access Signature) token to a blob in your storage account.
1. Later, when you want to analyze the data, the profiler/debugger service will reach back into that storage account to read the blob and write back the results of the analysis.

## What do I need to do to enable BYOS? 
You'll need to add the role `Storage Blob Data Contributor` to the AAD application named `Diagnostic Services Trusted Storage Access` in your storage account.
It can be done via the Access control UI, as shown in Figure 1.0. 

Steps: 
1. Click on the "Add" button in the "Add a role assignment" section 
1. Select "Storage Blob Data Contributor" role 
1. Select "Azure AD user, group, or service principal" in the "Assign access to" section 
1. Search & select "Diagnostic Services Trusted Storage Access" app 
1. Save changes

_![Figure 1.0](media/profiler-bring-your-own-storage/figure10.png)_
_Figure 1.0_ 

After you added the role, it will appear under the "Role assignments" section, like the below Figure 1.1. 
_![Figure 1.1](media/profiler-bring-your-own-storage/figure11.png)_
_Figure 1.1_ 

If you're also using Private Link, it's required one additional configuration to allow connection to our Trusted Microsoft Service from your Virtual Network. Refer to the [Storage Network Security documentation](https://docs.microsoft.com/azure/storage/common/storage-network-security#trusted-microsoft-services).

## Prerequisites
* Make sure to create your Storage Account in the same location as your Application Insights Resource. Ex. If your Application Insights resource is in West US 2, your Storage Account must be also in West US 2. 
* Grant the "Storage Blob Contributor" role to the AAD application "Diagnostic Services Trusted Storage Access" in your storage account via the IAM UI.
* If Private Link enabled, configure the additional setting to allow connection to our Trusted Microsoft Service from your Virtual Network. 

## How to enable
To configure BYOS for code-level diagnostics (Profiler/Debugger), follow the below steps:

1. Create an Azure Resource Manager template file with the following content (byos.template.json).
    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "application_insights_name": {
          "type": "String"
        },
        "application_insights_location": {
          "type": "String"
        },
        "storage_account_name": {
          "type": "String"
        }
      },
      "variables": {},
      "resources": [
        {
          "type": "microsoft.insights/components",
          "apiVersion": "2015-05-01",
          "location": "[parameters('application_insights_location')]",
          "name": "[parameters('application_insights_name')]",
          "properties": {},
          "resources": [
            {
              "type": "linkedStorageAccounts",
              "name": "serviceprofiler",
              "apiVersion": "2020-03-01-preview",
              "properties": {
                "linkedStorageAccount": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storage_account_name'))]"
              },
              "dependsOn": [
                "[concat('Microsoft.Insights/components/', parameters('application_insights_name'))]"
              ]
            }
          ]
        }
      ],
      "outputs": {}
    }
    ```

1. Run the following PowerShell command to deploy previous template (create Linked Storage Account).
    Pattern:
    ```powershell
    New-AzResourceGroupDeployment -ResourceGroupName "{your_resource_name}" -TemplateFile "{local_path_to_arm_template}"
    ```

    Example:
    ```powershell
    New-AzResourceGroupDeployment -ResourceGroupName "byos-test" -TemplateFile "D:\Docs\byos.template.json"
    ```

1. Provide the following parameters when prompted in the PowerShell console:
    
    |           Parameter           |                                Description                               |
    |-------------------------------|--------------------------------------------------------------------------|
    | application_insights_name     | The name of the Application Insights resource to enable BYOS.            |
    | application_insights_location | The location of your Application Insights resource (ex. westus2).        |
    | storage_account_name          | The name of the Storage Account resource that you'll use as your BYOS. |
    
    Expected output:
    ```powershell
    Supply values for the following parameters:
    (Type !? for Help.)
    application_insights_name: byos-test-westus2-ai
    application_insights_location: westus2
    storage_account_name: byosteststoragewestus2
    
    DeploymentName          : byos.template
    ResourceGroupName       : byos-test
    ProvisioningState       : Succeeded
    Timestamp               : 4/16/2020 1:24:57 AM
    Mode                    : Incremental
    TemplateLink            :
    Parameters              :
                              Name                            Type                       Value
                              ==============================  =========================  ==========
                              application_insights_name        String                     byos-test-westus2-ai
                              application_insights_location    String                     westus2
                              storage_account_name             String                     byosteststoragewestus2
                              
    Outputs                 :
    DeploymentDebugLogLevel :
    ```

1. Enable code-level diagnostics (Profiler/Debugger) on the workload of interest through the Azure portal. (App Service > Application Insights) 
_![Figure 2.0](media/profiler-bring-your-own-storage/figure20.png)_
_Figure 2.0_

## Troubleshooting
### Template schema '{schema_uri}' isn't supported.
* Make sure that the `$schema` property of the template is valid. It must follow the following pattern:
`https://schema.management.azure.com/schemas/{schema_version}/deploymentTemplate.json#`
* Make sure that the `schema_version` of the template is within valid values: `2014-04-01-preview, 2015-01-01, 2018-05-01, 2019-04-01, 2019-08-01`.
    Error message:
    ```powershell
    New-AzResourceGroupDeployment : 11:53:49 AM - Error: Code=InvalidTemplate; Message=Deployment template validation failed: 'Template schema
    'https://schema.management.azure.com/schemas/2020-01-01/deploymentTemplate.json#' is not supported. Supported versions are
    '2014-04-01-preview,2015-01-01,2018-05-01,2019-04-01,2019-08-01'. Please see https://aka.ms/arm-template for usage details.'.
    ```

### No registered resource provider found for location '{location}'.
* Make sure that the `apiVersion` of the resource `microsoft.insights/components` is `2015-05-01`.
* Make sure that the `apiVersion` of the resource `linkedStorageAccount` is `2020-03-01-preview`.
    Error message:
    ```powershell
    New-AzResourceGroupDeployment : 6:18:03 PM - Resource microsoft.insights/components 'byos-test-westus2-ai' failed with message '{
      "error": {
        "code": "NoRegisteredProviderFound",
        "message": "No registered resource provider found for location 'westus2' and API version '2020-03-01-preview' for type 'components'. The supported api-versions are '2014-04-01,
    2014-08-01, 2014-12-01-preview, 2015-05-01, 2018-05-01-preview'. The supported locations are ', eastus, southcentralus, northeurope, westeurope, southeastasia, westus2, uksouth,
    canadacentral, centralindia, japaneast, australiaeast, koreacentral, francecentral, centralus, eastus2, eastasia, westus, southafricanorth, northcentralus, brazilsouth, switzerlandnorth,
    australiasoutheast'."
      }
    }'
    ```
### Storage account location should match AI component location.
* Make sure that the location of the Application Insights resource is the same as the Storage Account trying to use. 
    Error message:
    ```powershell
    New-AzResourceGroupDeployment : 1:01:12 PM - Resource microsoft.insights/components/linkedStorageAccounts 'byos-test-centralus-ai/serviceprofiler' failed with message '{
      "error": {
        "code": "BadRequest",
        "message": "Storage account location should match AI component location",
        "innererror": {
          "trace": [
            "System.ArgumentException"
          ]
        }
      }
    }'
    ```

For general Profiler troubleshooting, refer to the [Profiler Troubleshoot documentation](profiler-troubleshooting.md).

For general Snapshot Debugger troubleshooting, refer to the [Snapshot Debugger Troubleshoot documentation](snapshot-debugger-troubleshoot.md). 

## FAQs
* If I have Profiler or Snapshot enabled, and then I enabled BYOS, will my data be migrated into my Storage Account?
    _No, it won't, we don't support migration data._

* Will BYOS work when Customer-Managed Key was enabled? 
    _Yes, to be precise, BYOS is a requisite to have profiler/debugger enabled with Customer-Manager Keys._

* Will BYOS work when Private Link was enabled? 
    _Yes, to be precise, BYOS is a requisite to have profiler/debugger enabled with Private Link._

* Will BYOS work when, both, Customer-Managed Keys and Private Link were enabled? 
    _Yes, it can be possible._

* If I have enabled BYOS, can I go back using Diagnostic Services storage accounts to store my data collected? 
    _Yes, you can, but, right now we don't support data migration from your BYOS._

* After enabling BYOS, will I take over of all the related costs of it, which are Storage and Networking? 
    _Yes_