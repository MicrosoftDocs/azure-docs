---
title: 'Create a scheduled Python WebJob'
description: WebJobs on App Service enable you to automate repetitive tasks on your app. Learn how to create scheduled WebJobs in Azure App Service.
ms.topic: quickstart
ms.date: 4/24/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: glenga
zone_pivot_groups: app-service-webjobs
#Customer intent: As a web developer, I want to leverage a scheduled background task to keep my application running smoothly.
---

# Quickstart: Create a scheduled WebJob

WebJobs is a feature of Azure App Service that enables you to run a program or script in the same instance as a web app. All app service plans support WebJobs at no additional cost. This sample uses a scheduled (Triggered) WebJob to output the system time once every minute.  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An existing App Service Python app on Linux.  In this quickstart, a [Python app](quickstart-python) is used.
- **[Always on](configure-common.md?tabs=portal#configure-general-settings)** must be enabled on your app.
- Ensure the App setting `WEBSITE_SKIP_RUNNING_KUDUAGENT` is set to `false`.

## Download the sample WebJob

:::zone target="docs" pivot="dotnet"
dotnet
:::zone-end

:::zone target="docs" pivot="python"

You can [download a pre-built sample project](https://github.com/Azure-Samples/App-Service-Python-WebJobs-QuickStart/archive/refs/heads/main.zip) to get started quickly.

The sample includes two files that will run the WebJob: `webjob.py` and `run.sh`.

The Python script, `webjob.py`, that outputs the current time to the console as shown below:

```Python 
import datetime 

current_datetime = datetime.datetime.now() 
print(current_datetime) # Output: 2025-03-27 10:27:21.240752 
``` 

The file, `run.sh`, calls WebJob.py as shown below:

```Bash
#!/bin/bash
/opt/python/3/bin/python3.13 webjob.py
``` 

> [!NOTE]
> `run.sh` invokes the Python script. It's included in the .zip to show the flexibility of WebJobs. Depending on your project needs, you can also omit `run.sh` from your WebJob.

:::zone-end

:::zone target="docs" pivot="node"
node
:::zone-end

:::zone target="docs" pivot="java"
java
:::zone-end

:::zone target="docs" pivot="php"
php
:::zone-end


## Create a scheduled WebJob

1. In the [Azure portal](https://portal.azure.com), go to the **App Service** page of your App Service app.

1. From the left pane, select **WebJobs**, then select **Add**.

    :::image type="content" source="media/webjobs-create/add-webjob.png" alt-text="Screenshot that shows how to add a WebJob in an App Service app in the portal (scheduled WebJob).":::

1. Fill in the **Add WebJob** settings as specified in the table, then select **Create Webjob**.

    :::image type="content" source="media/webjobs-create/configure-new-scheduled-webjob.png" alt-text="Screenshot that shows how to configure a scheduled WebJob in an App Service app.":::

   | Setting      | value   | Description  |
   | ------------ | ----------------- | ------------ |
   | **Name** | myScheduledWebJob | A name that is unique within an App Service app. Must start with a letter or a number and must not contain special characters other than "-" and "_". |
   | **File Upload** | Python-webjob.zip | A *.zip* file that contains your executable or script file and any supporting files needed to run the program or script. The supported executable or script file types are listed in the supported file types section. |
   | **Type** | Scheduled | Specifies when the WebJob runs. Choose `Scheduled` to run based on a CRON expression. |
   | **Triggers** | Scheduled | Ensure Always On is enabled for the schedule to work reliably. This setting is available in Basic, Standard, and Premium tiers.|
   | **CRON Expression** | 0 0/1 * * * * | For this quickstart, we use a schedule that runs every minute. See [CRON expressions](webjobs-create.md?tabs=windowscode#ncrontab-expressions) to learn more about the syntax. |

1. The new WebJob appears on the **WebJobs** page. If you see a message that says the WebJob was added, but you don't see it, select **Refresh**. 

1. The scheduled WebJob is run at the schedule defined by the CRON expression. To run it manually at any time, right-click the WebJob in the list and select the **Run** button, then confirm your selection.

    :::image type="content" source="media/webjobs-create/scheduled-webjob-run.png" alt-text="Screenshot that shows how to run a manually scheduled WebJob in the Azure portal.":::

[!INCLUDE [webjobs-cron-timezone-note](../../includes/webjobs-cron-timezone-note.md)]

### How the WebJob runs

When you deploy a scheduled WebJob to Azure App Service, the platform checks for a CRON schedule and runs the script at the specified time intervals. If `run.sh` or `run.py` is present, it's used as the entry point. Otherwise, the platform will use the first `.py` file it detects in the archive, which can lead to unpredictable results.


## Review the WebJob logs


## Clean up

To remove the WebJob, select the WebJob in the portal and select `Delete`.

## <a name="NextSteps"></a> Next steps

The Azure WebJobs SDK can be used with WebJobs to simplify many programming tasks. For more information, see [What is the WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki).