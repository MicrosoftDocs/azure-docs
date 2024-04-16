---
title: Upload billing data to Azure and view it in the Azure portal
description: Upload billing data to Azure and view it in the Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Upload billing data to Azure and view it in the Azure portal




## Connectivity Modes - Implications for billing data

There are two modes in which you can deploy your Azure Arc-enabled data services:

- **Indirectly connected** - There is no direct connection to Azure. Data is sent to Azure only through an export/upload process.
- **Directly connected** - In this mode there will be a dependency on the Azure Arc-enabled Kubernetes service to provide a direct connection between Azure and the Kubernetes cluster on which the Azure Arc-enabled data services are deployed. This will enable more capabilities from Azure and will also enable you to use the Azure portal to manage your Azure Arc-enabled data services just like you manage your data services in Azure PaaS.  

You can read more about the difference between the [connectivity modes](./connectivity.md).

In the indirectly connected mode, billing data is periodically exported out of the Azure Arc data controller to a secure file and then uploaded to Azure and processed.  In the upcoming directly connected mode, the billing data will be automatically sent to Azure approximately 1/hour to give a near real-time view into the costs of your services. The process of exporting and uploading the data in the indirectly connected mode can also be automated using scripts or we may build a service that will do it for you.

## Upload billing data to Azure - Indirectly connected mode

> [!NOTE]
> Uploading of usage (billing) data is automatically done in the direct connected mode. The following instructions is only for indirect connected mode. 

To upload billing data to Azure, the following should happen first:

1. Create an Azure Arc-enabled data service if you don't have one already. For example create one of the following:
   - [Create a SQL Managed Instance enabled by Azure Arc](create-sql-managed-instance.md)
   - [Create an Azure Arc-enabled PostgreSQL server](create-postgresql-server.md)
2. Wait for at least 2 hours since the creation of the data service so that the billing telemetry collection process can collect some billing data.
3. Follow the steps described in [Upload resource inventory, usage data, metrics and logs to Azure Monitor](upload-metrics-and-logs-to-azure-monitor.md) to get setup with prerequisites for uploading usage/billing/logs data and then proceed to the [Upload usage data to Azure](upload-usage-data.md) to upload the billing data. 


## View billing data in Azure portal

Follow these steps to view billing data in the Azure portal:

1. Open the [Azure portal](https://portal.azure.com).
1. In the search box at the top of the screen type in **Cost Management** and click on the Cost Management service.
1. Under **Cost Management Overview**, click on the **Cost Management** tab.
1. Click on the **Cost analysis** tab on the left.
1. Click the **Cost by resource** button on the top of the view.
1. Make sure that your Scope is set to the subscription in which your data service resources were created.
1. Select **Cost by resource** in the View drop down next to the Scope selector near the top of the view.
1. Make sure the date filter is set to **This month** or some other time range that makes sense given the timing of when you created your data service resources.
1. Click **Add filter** to add a filter by **Resource type** = `Microsoft.AzureArcData/<data service type>` if you want to filter down to just one type of Azure Arc-enabled data service.
1. You will now see a list of all the resources that were created and uploaded to Azure. Since the billing meter is $0, you will see that the cost is always $0.

## Download billing data

You can download billing summary data directly from the Azure portal.

1. In the same **Cost analysis -> view by resource type** view that you reached by following the instructions above, click the Download button near the top.
1. Choose your download file type - Excel or CSV - and click the **Download data** button.
1. Open the file in an appropriate editor given the file type selected.

## Export billing data

You can also periodically, automatically export **detailed** usage and billing data to an Azure Storage container by creating a billing export job. This is useful if you want to see the details of your billing such as how many hours a given instance was billed for in the billing period.

Follow these steps to set up a billing export job:

1. Click **Exports** on the left.
1. Click **Add**.
1. Enter a name and export frequency and click Next.
1. Choose to either create a new storage account or use an existing one and fill out the form to specify the storage account, container, and directory path to export the billing data files to and click Next.
1. Click **Create**.

The billing data export files will be available in approximately 4 hours and will be exported on the schedule you specified when creating the billing export job.

Follow these steps to view the billing data files that are exported:

You can validate the billing data files in the Azure portal. 

> [!IMPORTANT]
> After you create the billing export job, wait 4 hours before you proceed with the following steps.

1. In the search box at the top of the portal, type in **Storage accounts** and click on **Storage Accounts**.
3. Click on the storage account which you specified when creating the billing export job above.
4. Click on Containers on the left.
5. Click on the container you specified when creating the billing export job above.
6. Click on the folder you specified when creating the billing export job above.
7. Drill down into the generated folders and files and click on one of the generated .csv files.
8. Click the **Download** button which will save the file to your local Downloads folder.
9. Open the file using a .csv file viewer such as Excel.
10. Filter the results to show only the rows with the **Resource Type** = `Microsoft.AzureArcData/<data service resource type`.
11. You will see the number of hours the instance was used in the current 24 hour period in the UsageQuantity column.
