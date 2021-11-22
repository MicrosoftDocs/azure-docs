---
title: Download load test execution logs for reporting
titleSuffix: Azure Load Testing
description: Learn how to download the Azure Load Testing execution logs for use in third-party tools.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---
# Download load test execution logs for reporting in 3rd party tools

In this article, you'll learn how to find and download logs for your load test on **Azure portal**.  

In this article you'll learn how to:  

> [!div class="checklist"]

> - Locate your log files for your load test runs.  
> - Download logs of your load test run from the dashboard.  

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- You need an Azure Load Testing Resource already created. If you need to create a Load Test Resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  
- You must have a valid test created with at least one test run completed. You can also use the sample test plan and the app in our tutorial. See [how-to-identify-bottlenecks-azure-portal](./tutorial-identify-bottlenecks-azure-portal.md).  

## Access and download logs for your load test  

1. Go to your load test resource.  
2. Select **Tests** in the navigation menu to view the list of test plans.  
3. Pick the correct test plan from the list. Use the filters at the top to find the test plan you want.  
4. Select the test plan to open the test run page.  
5. Choose your test run. Use the search box to find the test run you want. You can also use the filters on **Time Range** and **Status** to further curate the list.  
:::image type="content" source="media/how-to-find-download-logs/test-run.png" alt-text="Selecting the test run form the test run page.":::  
6. Go to the dashboard for your test run by clicking on the test run instance.  
7. On the dashboard, select **Logs** from the **Download** menu on the command bar.  
:::image type="content" source="media/how-to-find-download-logs/logs.png" alt-text="Downloading the logs from the test run page.":::  
8. The browser download action opens. Choose a file name and a destination directory to save the logs as a zipped folder.  
9. You may use any zip tool to unzip the folder and access the log file.
