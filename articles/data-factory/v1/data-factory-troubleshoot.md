---
title: Troubleshoot Azure Data Factory issues
description: Learn how to troubleshoot issues with using Azure Data Factory.
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel 
ms.custom: devx-track-azurepowershell
robots: noindex
---
# Troubleshoot Data Factory issues
> [!NOTE]
> This article applies to version 1 of Azure Data Factory. 

This article provides troubleshooting tips for issues when using Azure Data Factory. This article does not list all the possible issues when using the service, but it covers some issues and general troubleshooting tips.   

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Troubleshooting tips
### Error: The subscription is not registered to use namespace 'Microsoft.DataFactory'
If you receive this error, the Azure Data Factory resource provider has not been registered on your machine. Do the following:

1. Launch Azure PowerShell.
2. Log in to your Azure account using the following command.

   ```powershell
   Connect-AzAccount
   ```

3. Run the following command to register the Azure Data Factory provider.

   ```powershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.DataFactory
   ```

### Problem: Unauthorized error when running a Data Factory cmdlet
You are probably not using the right Azure account or subscription with the Azure PowerShell. Use the following cmdlets to select the right Azure account and subscription to use with the Azure PowerShell.

1. Connect-AzAccount - Use the right user ID and password
2. Get-AzSubscription - View all the subscriptions for the account.
3. Select-AzSubscription &lt;subscription name&gt; - Select the right subscription. Use the same one you use to create a data factory on the Azure portal.

### Problem: Fail to launch Data Management Gateway Express Setup from Azure portal
The Express setup for the Data Management Gateway requires Internet Explorer or a Microsoft ClickOnce compatible web browser. If the Express Setup fails to start, do one of the following:

* Use Internet Explorer or a Microsoft ClickOnce compatible web browser.

    If you are using Chrome, go to the [Chrome web store](https://chrome.google.com/webstore/), search with "ClickOnce" keyword, choose one of the ClickOnce extensions, and install it.

    Do the same for Firefox (install add-in). Click Open Menu button on the toolbar (three horizontal lines in the top-right corner), click Add-ons, search with "ClickOnce" keyword, choose one of the ClickOnce extensions, and install it.
* Use the **Manual Setup** link shown on the same blade in the portal. You use this approach to download installation file and run it manually. After the installation is successful, you see the Data Management Gateway Configuration dialog box. Copy the **key** from the portal screen and use it in the configuration manager to manually register the gateway with the service.  

### Problem: Fail to connect to SQL Server
Launch **Data Management Gateway Configuration Manager** on the gateway machine and use the **Troubleshooting** tab to test the connection to SQL Server from the gateway machine. See [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshooting-gateway-issues) for tips on troubleshooting connection/gateway related issues.   

### Problem: Input slices are in Waiting state forever
The slices could be in **Waiting** state due to various reasons. One of the common reasons is that the **external** property is not set to **true**. Any dataset that is produced outside the scope of Azure Data Factory should be marked with **external** property. This property indicates that the data is external and not backed by any pipelines within the data factory. The data slices are marked as **Ready** once the data is available in the respective store.

See the following example for the usage of the **external** property. You can optionally specify **externalData*** when you set external to true.

See [Datasets](data-factory-create-datasets.md) article for more details about this property.

```json
{
  "name": "CustomerTable",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "MyLinkedService",
    "typeProperties": {
      "folderPath": "MyContainer/MySubFolder/",
      "format": {
        "type": "TextFormat",
        "columnDelimiter": ",",
        "rowDelimiter": ";"
      }
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    },
    "policy": {
      }
    }
  }
}
```

To resolve the error, add the **external** property and the optional **externalData** section to the JSON definition of the input table and recreate the table.

### Problem: Hybrid copy operation fails
See [Troubleshoot gateway issues](data-factory-data-management-gateway.md#troubleshooting-gateway-issues) for steps to troubleshoot issues with copying to/from an on-premises data store using the Data Management Gateway.

### Problem: On-demand HDInsight provisioning fails
When using a linked service of type HDInsightOnDemand, you need to specify a linkedServiceName that points to an Azure Blob Storage. Data Factory service uses this storage to store logs and supporting files for your on-demand HDInsight cluster.  Sometimes provisioning of an on-demand HDInsight cluster fails with the following error:

```
Failed to create cluster. Exception: Unable to complete the cluster create operation. Operation failed with code '400'. Cluster left behind state: 'Error'. Message: 'StorageAccountNotColocated'.
```

This error usually indicates that the location of the storage account specified in the linkedServiceName is not in the same data center location where the HDInsight provisioning is happening. Example: if your data factory is in West US and the Azure storage is in East US, the on-demand provisioning fails in West US.

Additionally, there is a second JSON property additionalLinkedServiceNames where additional storage accounts may be specified in on-demand HDInsight. Those additional linked storage accounts should be in the same location as the HDInsight cluster, or it fails with the same error.

### Problem: Custom .NET activity fails
See [Debug a pipeline with custom activity](data-factory-use-custom-activities.md#troubleshoot-failures) for detailed steps.

## Use Azure portal to troubleshoot
### Using portal blades
See [Monitor pipeline](data-factory-monitor-manage-pipelines.md) for steps.

### Using Monitor and Manage App
See [Monitor and manage data factory pipelines using Monitor and Manage App](data-factory-monitor-manage-app.md) for details.

## Use Azure PowerShell to troubleshoot
### Use Azure PowerShell to troubleshoot an error
See [Monitor Data Factory pipelines using Azure PowerShell](data-factory-monitor-manage-pipelines.md) for details.

[adfgetstarted]: data-factory-copy-data-from-azure-blob-storage-to-sql-database.md
[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[developer-reference]: /previous-versions/azure/dn834987(v=azure.100)
[cmdlet-reference]: /powershell/resourcemanager/Azurerm.DataFactories/v2.2.0/Azurerm.DataFactories
[json-scripting-reference]: /previous-versions/azure/dn835050(v=azure.100)

[image-data-factory-troubleshoot-with-error-link]: ./media/data-factory-troubleshoot/DataFactoryWithErrorLink.png

[image-data-factory-troubleshoot-datasets-with-errors-blade]: ./media/data-factory-troubleshoot/DatasetsWithErrorsBlade.png

[image-data-factory-troubleshoot-table-blade-with-problem-slices]: ./media/data-factory-troubleshoot/TableBladeWithProblemSlices.png

[image-data-factory-troubleshoot-activity-run-with-error]: ./media/data-factory-troubleshoot/ActivityRunDetailsWithError.png

[image-data-factory-troubleshoot-dataslice-blade-with-active-runs]: ./media/data-factory-troubleshoot/DataSliceBladeWithActivityRuns.png

[image-data-factory-troubleshoot-walkthrough2-with-errors-link]: ./media/data-factory-troubleshoot/Walkthrough2WithErrorsLink.png

[image-data-factory-troubleshoot-walkthrough2-datasets-with-errors]: ./media/data-factory-troubleshoot/Walkthrough2DataSetsWithErrors.png

[image-data-factory-troubleshoot-walkthrough2-table-with-problem-slices]: ./media/data-factory-troubleshoot/Walkthrough2TableProblemSlices.png

[image-data-factory-troubleshoot-walkthrough2-slice-activity-runs]: ./media/data-factory-troubleshoot/Walkthrough2DataSliceActivityRuns.png

[image-data-factory-troubleshoot-activity-run-details]: ./media/data-factory-troubleshoot/Walkthrough2ActivityRunDetails.png