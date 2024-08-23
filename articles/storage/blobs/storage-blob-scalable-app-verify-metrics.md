---
title: Verify throughput and latency metrics for a storage account in the Azure portal 
description: Learn how to verify throughput and latency metrics for a storage account in the portal.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: tutorial
ms.date: 02/20/2018
ms.author: akashdubey
---

# Verify throughput and latency metrics for a storage account

This tutorial is part four and the final part of a series. In the previous tutorials, you learned how to upload and download larges amounts of random data to an Azure storage account. This tutorial shows you how you can use metrics to view throughput and latency in the Azure portal.

In part four of the series, you learn how to:

> [!div class="checklist"]
> - Configure charts in the Azure portal
> - Verify throughput and latency metrics

[Azure storage metrics](./monitor-blob-storage.md?toc=/azure/storage/blobs/toc.json) uses Azure monitor to provide a unified view into the performance and availability of your storage account.

## Configure metrics

1. Navigate to **Metrics** under **SETTINGS** in your storage account.

1. Choose Blob from the **SUB SERVICE** drop-down.

1. Under **METRIC**, select one of the metrics. For a list of supported metrics, see [Supported metrics for Microsoft.Storage/storageAccounts](monitor-blob-storage-reference.md#supported-metrics-for-microsoftstoragestorageaccounts).

    These metrics give you an idea of the latency and throughput of the application. The metrics you configure in the portal are in 1-minute averages. If a transaction finished in the middle of a minute, that minute data is halved for the average. In the application, the upload and download operations were timed and provided you output of the actual amount of time it took to upload and download the files. This information can be used in conjunction with the portal metrics to fully understand throughput.

1. Select **Last 24 hours (Automatic)** next to **Time**. Choose **Last hour** and **Minute** for **Time granularity**, then click **Apply**.

    ![Storage account metrics](./media/storage-blob-scalable-app-verify-metrics/figure1.png)

Charts can have more than one metric assigned to them, but assigning more than one metric disables the ability to group by dimensions.

## Dimensions

[Dimensions](./monitor-blob-storage-reference.md?toc=/azure/storage/blobs/toc.json#metrics-dimensions) are used to look deeper into the charts and get more detailed information. Different metrics have different dimensions. One dimension that is available is the **API name** dimension. This dimension breaks out the chart into each separate API call. The first image below shows an example chart of total transactions for a storage account. The second image shows the same chart but with the API name dimension selected. As you can see, each transaction is listed giving more details into how many calls were made by API name.

![Storage account metrics - transactions without a dimension](./media/storage-blob-scalable-app-verify-metrics/transactionsnodimensions.png)

![Storage account metrics - transactions](./media/storage-blob-scalable-app-verify-metrics/transactions.png)

## Clean up resources

When no longer needed, delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the VM and click Delete.

## Next steps

In part four of the series, you learned about viewing metrics for the example solution, such as how to:

> [!div class="checklist"]
> - Configure charts in the Azure portal
> - Verify throughput and latency metrics

Follow this link to see pre-built storage samples.

> [!div class="nextstepaction"]
> [Azure storage script samples](storage-samples-blobs-cli.md)

[previous-tutorial]: storage-blob-scalable-app-download-files.md
