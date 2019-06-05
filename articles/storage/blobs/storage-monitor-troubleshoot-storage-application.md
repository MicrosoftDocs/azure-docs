---
title: Monitor and troubleshoot a cloud storage application in Azure | Microsoft Docs 
description: Use diagnostic tools, metrics, and alerting to troubleshoot and monitor a cloud application.
services: storage
author: normesta

ms.service: storage
ms.topic: tutorial
ms.date: 07/20/2018
ms.author: normesta
ms.reviewer: fryu
ms.custom: mvc
---

# Monitor and troubleshoot a cloud storage application

This tutorial is part four and the final part of a series. You learn how to monitor and troubleshoot a cloud storage application.

In part four of the series, you learn how to:

> [!div class="checklist"]
> * Turn on logging and metrics
> * Enable alerts for authorization errors
> * Run test traffic with incorrect SAS tokens
> * Download and analyze logs

[Azure storage analytics](../common/storage-analytics.md) provides logging and metric data for a storage account. This data provides insights into the health of your storage account. To collect data from Azure storage analytics, you can configure logging, metrics and alerts. This process involves turning on logging, configuring metrics, and enabling alerts.

Logging and metrics from storage accounts are enabled from the **Diagnostics** tab in the Azure portal. Storage logging enables you to record details for both successful and failed requests in your storage account. These logs enable you to see details of read, write, and delete operations against your Azure tables, queues, and blobs. They also enable you to see the reasons for failed requests such as timeouts, throttling, and authorization errors.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com)

## Turn on logging and metrics

From the left menu, select **Resource Groups**, select **myResourceGroup**, and then select your storage account in the resource list.

Under **Diagnostics settings (classic)** set **Status** to **On**. Ensure all of the options under **Blob properties** are enabled.

When complete, click **Save**

![Diagnostics pane](media/storage-monitor-troubleshoot-storage-application/enable-diagnostics.png)

## Enable alerts

Alerts provide a way to email administrators or trigger a webhook based on a metric breaching a threshold. In this example, you enable an alert for the `SASClientOtherError` metric.

### Navigate to the storage account in the Azure portal

Under the **Monitoring** section, select **Alerts (classic)**.

Select **Add metric alert (classic)** and complete the **Add rule** form by filling in the required information. From the **Metric** dropdown, select `SASClientOtherError`. To allow your alert to trigger upon the first error, from the **Condition** dropdown select **Greater than or equal to**.

![Diagnostics pane](media/storage-monitor-troubleshoot-storage-application/add-alert-rule.png)

## Simulate an error

To simulate a valid alert, you can attempt to request a non-existent blob from your storage account. The following command requires a storage container name. You can either use the name of an existing container or create a new one for the purposes of this example.

Replace the placeholders with real values (make sure `<INCORRECT_BLOB_NAME>` is set to a value that does not exist) and run the command.

```azurecli-interactive
sasToken=$(az storage blob generate-sas \
    --account-name <STORAGE_ACCOUNT_NAME> \
    --account-key <STORAGE_ACCOUNT_KEY> \
    --container-name <CONTAINER_NAME> \
    --name <INCORRECT_BLOB_NAME> \
    --permissions r \
    --expiry `date --date="next day" +%Y-%m-%d`)

curl https://<STORAGE_ACCOUNT_NAME>.blob.core.windows.net/<CONTAINER_NAME>/<INCORRECT_BLOB_NAME>?$sasToken
```

The following image is an example alert that is based off the simulated failure ran with the preceding example.

 ![Example alert](media/storage-monitor-troubleshoot-storage-application/email-alert.png)

## Download and view logs

Storage logs store data in a set of blobs in a blob container named **$logs** in your storage account. This container does not show up if you list all the blob containers in your account but you can see its contents if you access it directly.

In this scenario, you use [Microsoft Message Analyzer](https://technet.microsoft.com/library/jj649776.aspx) to interact with your Azure storage account.

### Download Microsoft Message Analyzer

Download [Microsoft Message Analyzer](https://www.microsoft.com/download/details.aspx?id=44226) and install the application.

Launch the application and choose **File** > **Open** > **From Other File Sources**.

In the **File Selector** dialog, select **+ Add Azure Connection**. Enter in your **storage account name** and **account key** and click **OK**.

![Microsoft Message Analyzer - Add Azure Storage Connection Dialog](media/storage-monitor-troubleshoot-storage-application/figure3.png)

Once you are connected, expand the containers in the storage tree view to view the log blobs. Select the latest log and click **OK**.

![Microsoft Message Analyzer - Add Azure Storage Connection Dialog](media/storage-monitor-troubleshoot-storage-application/figure4.png)

On the **New Session** dialog, click **Start** to view your log.

Once the log opens, you can view the storage events. As you can see from the following image, there was an `SASClientOtherError` triggered on the storage account. For additional information on storage logging, visit [Storage Analytics](../common/storage-analytics.md).

![Microsoft Message Analyzer - Viewing events](media/storage-monitor-troubleshoot-storage-application/figure5.png)

[Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is another tool that can be used to interact with your storage accounts, including the **$logs** container and the logs that are contained in it.

## Next steps

In part four and the final part of the series, you learned how to monitor and troubleshoot your storage account, such as how to:

> [!div class="checklist"]
> * Turn on logging and metrics
> * Enable alerts for authorization errors
> * Run test traffic with incorrect SAS tokens
> * Download and analyze logs

Follow this link to see pre-built storage samples.

> [!div class="nextstepaction"]
> [Azure storage script samples](storage-samples-blobs-cli.md)