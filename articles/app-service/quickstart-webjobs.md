---
title: 'Create a scheduled Python WebJob'
description: WebJobs on App Service enable you to automate repetitive tasks on your app. Learn how to create scheduled WebJobs in Azure App Service.
ms.topic: how-to
ms.date: 4/24/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: glenga
#zone_pivot_groups: app-service-webjobs
#Customer intent: As a web developer, I want to leverage a scheduled background task to keep my application running smoothly.
---

# Quickstart: Create a scheduled WebJob

WebJobs is a feature of Azure App Service that enables you to run a program or script in the same instance as a web app. All app service plans support WebJobs. There's no extra cost to use WebJobs. This sample uses a Triggered (scheduled) WebJob to output the system time once every 15 minutes.  

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An existing App Service app on Linux. In this quickstart, [a Python app](quickstart-python.md) is used.
- **[Always on](configure-common.md?tabs=portal)** must enabled on your app.
- App setting `WEBSITE_SKIP_RUNNING_KUDUAGENT` set to `FALSE`.

## Download the sample WebJob

:::zone target="docs" pivot="dotnet"
dotnet
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

:::zone target="docs" pivot="python"
[Download the sample project](https://github.com/Azure-Samples/App-Service-Python-WebJobs-QuickStart/archive/refs/heads/main.zip).

The sample Python WebJob is in `webjob.py`. It outputs the current time to the console as shown below:

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

The file, `run.sh` is included to show the capability of WebJobs. You can also omit the file and only include `webjob.py` in the .zip file.

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
   | **File Upload** | ConsoleApp.zip | A *.zip* file that contains your executable or script file and any supporting files needed to run the program or script. The supported executable or script file types are listed in the supported file types section. |
   | **Type** | Scheduled | Continous, Triggered, or Scheduled. |
   | **Triggers** | Scheduled | For the scheduling to work reliably, enable the Always On feature. Always On is available only in the Basic, Standard, and Premium pricing tiers.|
   | **CRON Expression** | 0 0/20 * * * * | [CRON expressions](webjobs-create.md?tabs=windowscode#ncrontab-expressions) are described in the following section. |

1. The new WebJob appears on the **WebJobs** page. If you see a message that says the WebJob was added, but you don't see it, select **Refresh**. 

1. The scheduled WebJob is run at the schedule defined by the CRON expression. To run it manually at anytime, right-click the WebJob in the list and select the **Run** button, then confirm your selection.

    :::image type="content" source="media/webjobs-create/scheduled-webjob-run.png" alt-text="Screenshot that shows how to run a manually scheduled WebJob in the Azure portal.":::

[!INCLUDE [webjobs-cron-timezone-note](../../includes/webjobs-cron-timezone-note.md)]

## <a name="NextSteps"></a> Next steps

The Azure WebJobs SDK can be used with WebJobs to simplify many programming tasks. For more information, see [What is the WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki).