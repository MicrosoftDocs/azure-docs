---
title: Configure BYOS (Bring Your Own Storage) for Profiler & Snapshot Debugger
description: Configure BYOS (Bring Your Own Storage) for Profiler & Snapshot Debugger
ms.topic: conceptual
author: regutier
ms.author: regutier
ms.date: 04/14/2020

ms.reviewer: mbullwin
---

# Configure BYOS (Bring Your Own Storage) for Profiler & Snapshot Debugger

## What is Bring Your Own Storage (BYOS) and why I need it? 
In normal process, when a customer's application doesn't have the capability of Bring Your Own Storage (BYOS), the data it's written into the regional storage accounts of Diagnostic Services.

With Bring Your Own Storage, the data collected, it's written into their own storage accounts, giving them the capability to control it at their own peace.

One thing to have in mind is that the customer will take over of all the related costs of the storage account. 

## How does my Storage Account will be accessed? 
1. The data it's written by agents running in the customer's Virtual Machines or App Service.
2. The customer's application contacts our service (Profiler/Debugger) when they want to upload data and we hand back a SAS (Shared Access Signature) token to a blob in their storage account.
3. Later, when they want to analyze the data, the profiler/debugger service will reach back into that storage account to read the blob and write back the results of the analysis.

## What do I need to do to enable BYOS? 
The customer needs to add the role `Storage Blob Data Contributor` to the AAD application named `Diagnostic Services Trusted Storage Access` in their storage account.
It can be done via the Access control UI, as shown in Figure 1.0. 

Steps: 
1. Click on the "Add" button in the "Add a role assignment" section 
2. Select "Storage Blob Data Contributor" role 
3. Select "Azure AD user, group, or service principal" in the "Assign access to" section 
4. Search & select "Diagnostic Services Trusted Storage Access" app 
5. Save changes

_![Figure 1.0](media/profiler-bring-your-own-storage/figure10.png)_
_Figure 1.0_ 

After you added the role, it will appear under the "Role assignments" section, like the below Figure 1.1. 
_![Figure 1.1](media/profiler-bring-your-own-storage/figure11.png)_
_Figure 1.1_ 

If you're also using Private Link, it's required one additional configuration to allow connection to our Trusted Microsoft Service from your Virtual Network. Refer to the [Storage Network Security documentation](https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security#trusted-microsoft-services).

## Prerequisites
* Make sure to create your Storage Account in the same location as your Application Insights Resource. Ex. If your Application Insights resource is in West US 2, your Storage Account must be also in West US 2. 
* Grant the "Storage Blob Contributor" role to the AAD application "Diagnostic Services Trusted Storage Access" in your storage account via the IAM UI.
* If Private Link enabled, configure the additional setting to allow connection to our Trusted Microsoft Service from your Virtual Network. 

## Enablement process 
To configure BYOS for code-level diagnostics (Profiler/Debugger), follow the below steps:

1. Create an Azure Resource Manager template file with the following content (byos.template.json).
    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "applicationinsights_name": {
          "type": "String"
        },
        "applicationinsights_location": {
          "type": "String"
        },
        "storageaccount_name": {
          "type": "String"
        }
      },
      "variables": {},
      "resources": [
        {
          "type": "microsoft.insights/components",
          "apiVersion": "2015-05-01",
          "location": "[parameters('applicationinsights_location')]",
          "name": "[parameters('applicationinsights_name')]",
          "properties": {},
          "resources": [
            {
              "type": "linkedStorageAccounts",
              "name": "serviceprofiler",
              "apiVersion": "2020-03-01-preview",
              "properties": {
                "linkedStorageAccount": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageaccount_name'))]"
              },
              "dependsOn": [
                "[concat('Microsoft.Insights/components/', parameters('applicationinsights_name'))]"
              ]
            }
          ]
        }
      ],
      "outputs": {}
    }
    ```

2. Run the following PowerShell command to deploy previous template (create Linked Storage Account).
    ```powershell
    # Command pattern
    New-AzResourceGroupDeployment -ResourceGroupName "{your_resource_name}" -TemplateFile "{local_path_to_arm_template}"
    
    # Command example
    New-AzResourceGroupDeployment -ResourceGroupName "byos-test" -TemplateFile "D:\Docs\byos.template.json"
    ```

3. Provide the following parameters when prompted in the PowerShell console:
    
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

4. Enable code-level diagnostics (Profiler/Debugger) on the workload of interest through the Azure portal. (App Service > Application Insights) 
_![Figure 2.0](media/profiler-bring-your-own-storage/figure20.png)_
_Figure 2.0_

## Troubleshooting
### No registered resource provider found for location '{location}'.
* Make sure that the `$schema` property of the template it's valid. It must follow the following pattern:
`https://schema.management.azure.com/schemas/{schema_version}/deploymentTemplate.json#`
* Make sure that the `apiVersion` of the resource `microsoft.insights/components` it's `2015-05-01`.
* Make sure that the `apiVersion` of the resource `linkedStorageAccount` its `2020-03-01-preview`.
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
* Make sure that the location of the Application Insights resource it's the same as the Storage Account trying to use. 
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
    _Yes, to be precise, BYOS is a requisite to have profiler/debugger enabled with CMK (Customer Manager Keys)._

* Will BYOS work when Private Link was enabled? 
    _Yes, to be precise, BYOS is a requisite to have profiler/debugger enabled with PL (Private Link)._

* Will BYOS work when, both, CMK and PL were enabled? 
    _Yes, it can be possible._

* If I have enabled BYOS, can I go back using Diagnostic Services storage accounts to store my data collected? 
    _Yes, you can, but, right now we don't support data migration from your BYOS._

* After enabling BYOS, will I take over of all the related costs of it? 
    _Yes_