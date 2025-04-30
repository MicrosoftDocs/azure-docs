---
title: Run Background Tasks with WebJobs
description: Learn how to use WebJobs to run background tasks in Azure App Service. Choose from various script formats and run them with CRON expressions.

ms.assetid: af01771e-54eb-4aea-af5f-f883ff39572b
ms.topic: concept-article
ms.date: 4/17/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: cephalin;suwatch;pbatum;naren.soni;
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./webjobs-create-ieux
#Customer intent: As a web developer, I want to leverage background tasks to keep my application running smoothly.
---

# Run background tasks with WebJobs in Azure App Service

This article explains how to deploy WebJobs by using the [Azure portal](https://portal.azure.com) to upload an executable or script. WebJobs is a feature of [Azure App Service](index.yml) that allows you to run a program or script in the same instance as a web app. All app service plans support WebJobs. There's no extra cost to use WebJobs.

> [!NOTE]
> WebJobs for *Windows container*, *Linux code*, and *Linux container* is in preview. WebJobs for Windows code is generally available and not in preview.

If you're using Visual Studio instead of the Azure App Service to develop and deploy WebJobs, see [Develop and deploy WebJobs using Visual Studio](webjobs-dotnet-deploy-vs.md).

Azure Functions provides another way to run programs and scripts. For a comparison between WebJobs and Functions, see [Choose the right integration and automation services in Azure](../azure-functions/functions-compare-logic-apps-ms-flow-webjobs.md).

## WebJob types

### <a name="acceptablefiles"></a>Supported file types for scripts or programs

### [Windows code](#tab/windowscode)

The following file types are supported:

- Using Windows cmd: *.cmd*, *.bat*, *.exe*
- Using PowerShell: *.ps1*
- Using Bash: *.sh*
- Using Node.js: *.js*
- Using Java: *.jar*

The necessary runtimes to run these file types are already installed on the web app instance.

### [Windows container](#tab/windowscontainer)

> [!NOTE]
> WebJobs for Windows container is in preview.
>

The following file types are supported using Windows cmd: *.cmd*, *.bat*, *.exe*

In addition to these file types, WebJobs written in the language runtime of the Windows container app are supported.

- Example: *.jar* and *.war* scripts are supported if the container is a Java app.

### [Linux code](#tab/linuxcode)

> [!NOTE]
> WebJobs for Linux code is in preview. 
>

*.sh* scripts are supported.

In addition to shell scripts, WebJobs written in the language of the selected runtime are also supported.

- Example: Python (*.py*) scripts are supported if the main site is a Python app.

### [Linux container](#tab/linuxcontainer)

> [!NOTE]
> WebJobs for Linux container is in preview.
>

*.sh* scripts are supported.

In addition to shell scripts, WebJobs written in the language runtime of the Linux container app are also supported.

- Example: Node (*.js*) scripts are supported if the site is a Node.js app.

---

### Continuous vs. triggered WebJobs

The following table describes the differences between *continuous* and *triggered* WebJobs:

|Continuous  |Triggered  |
|---------|---------|
| Starts immediately when the WebJob is created. To keep the job from ending, the program or script typically does its work inside an endless loop. If the job does end, you can restart it. Typically used with WebJobs SDK. | Starts only when triggered manually or on a schedule. |
| Runs on all instances that the web app runs on. You can optionally restrict the WebJob to a single instance. |Runs on a single instance that Azure selects for load balancing.|
| Supports remote debugging. | Doesn't support remote debugging.|
| Code is deployed under `\site\wwwroot\app_data\Jobs\Continuous`. | Code is deployed under `\site\wwwroot\app_data\Jobs\Triggered`. |

[!INCLUDE [webjobs-always-on-note](../../includes/webjobs-always-on-note.md)]



## <a name="CreateContinuous"></a> Create a continuous WebJob

<!-- 
Several steps in the three "Create..." sections are identical; 
when making changes in one don't forget the other two.
-->

> [!IMPORTANT]
> When you have source control configured for your application, Webjobs should be deployed as part of the source control integration. After source control is configured for your application, a WebJob can't be added from the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to the **App Service** page of your App Service web app, API app, or mobile app.

1. Under **Settings** in the left pane, select **WebJobs**, then select **Add**.

    :::image type="content" source="media/webjobs-create/add-webjob.png" alt-text="Screenshot that shows how to add a WebJob in an App Service app in the portal." lightbox="media/webjobs-create/add-webjob.png":::

1. Fill in the **Add WebJob** settings as specified in the table, then select **Create Webjob**.

    :::image type="content" source="media/webjobs-create/configure-new-continuous-webjob.png" alt-text="Screenshot that shows how to configure a multi-instance continuous WebJob for an App Service app.":::

   | Setting      | Sample value   | Description  |
   | ------------ | ----------------- | ------------ |
   | **Name** | myContinuousWebJob | A unique WebJob name. Must start with a letter or a number and must not contain special characters other than `"-"` and `"_"`. |
   | **File Upload** | ConsoleApp.zip | A *.zip* file that contains your executable or script file and any supporting files needed to run the program or script. The supported executable or script file types are listed in the [Supported file types](#acceptablefiles) section. |
   | **Type** | Continuous | The [WebJob types](#webjob-types) are described earlier in this article. |
   | **Scale** | Multi Instance | Available only for Continuous WebJobs. Determines whether the program or script runs on all instances or one instance. The option to run on multiple instances doesn't apply to the Free or Shared [pricing tiers](https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio). | 

1. The new WebJob appears on the **WebJobs** page. If you see a message that says the WebJob was added, but you don't see it, select **Refresh**. 

1. To stop or restart a continuous WebJob, right-click the WebJob in the list and select the **Stop** or **Run** button, then confirm your selection.

    :::image type="content" source="media/webjobs-create/continuous-webjob-stop.png" alt-text="Screenshot that shows how to stop a continuous WebJob in the Azure portal." lightbox="media/webjobs-create/continuous-webjob-stop.png":::

## <a name="CreateOnDemand"></a> Create a manually triggered WebJob

<!-- 
Several steps in the three "Create..." sections are identical; 
when making changes in one don't forget the other two.
-->

1. In the [Azure portal](https://portal.azure.com), go to the **App Service** page of your App Service web app, API app, or mobile app.

1. Under **Settings** in the left pane, select **WebJobs**, then select **Add**.

    :::image type="content" source="media/webjobs-create/add-webjob.png" alt-text="Screenshot that shows how to add a WebJob in an App Service app in the portal (manually triggered WebJob)." lightbox="media/webjobs-create/add-webjob.png":::

1. Fill in the **Add WebJob** settings as specified in the table, then select **Create Webjob**.

    :::image type="content" source="media/webjobs-create/configure-new-triggered-webjob.png" alt-text="Screenshot that shows how to configure a manually triggered WebJob for an App Service app.":::

   | Setting      | Sample value   | Description  |
   | ------------ | ----------------- | ------------ |
   | **Name** | myTriggeredWebJob | A unique WebJob name. Must start with a letter or a number and must not contain special characters other than `"-"` and `"_"`. |
   | **File Upload** | ConsoleApp1.zip | A *.zip* file that contains your executable or script file and any supporting files needed to run the program or script. The supported executable or script file types are listed in the [Supported file types](#acceptablefiles) section. |
   | **Type** | Triggered | The [WebJob types](#webjob-types) are described previously in this article. |
   | **Triggers** | Manual | |

1. The new WebJob appears on the **WebJobs** page. If you see a message that says the WebJob was added, but you don't see it, select **Refresh**. 

1. To run a manually triggered WebJob, right-click the WebJob in the list and select the **Run** button, then confirm your selection.

    :::image type="content" source="media/webjobs-create/triggered-webjob-run.png" alt-text="Screenshot that shows how to run a manually triggered WebJob in the Azure portal." lightbox="media/webjobs-create/triggered-webjob-run.png":::

## <a name="CreateScheduledCRON"></a> Create a scheduled WebJob

A scheduled Webjob is also triggered. You can schedule the trigger to occur automatically on the schedule you specify.
 
<!-- 
Several steps in the three "Create..." sections are identical; 
when making changes in one don't forget the other two.
-->

1. In the [Azure portal](https://portal.azure.com), go to the **App Service** page of your App Service web app, API app, or mobile app.

1. Under **Settings** in the left pane, select **WebJobs**, then select **Add**.

    :::image type="content" source="media/webjobs-create/add-webjob.png" alt-text="Screenshot that shows how to add a WebJob in an App Service app in the portal (scheduled WebJob)." lightbox="media/webjobs-create/add-webjob.png":::

1. Fill in the **Add WebJob** settings as specified in the table, then select **Create Webjob**.

    :::image type="content" source="media/webjobs-create/configure-new-scheduled-webjob.png" alt-text="Screenshot that shows how to configure a scheduled WebJob in an App Service app.":::

   | Setting      | Sample value   | Description  |
   | ------------ | ----------------- | ------------ |
   | **Name** | myScheduledWebJob | A unique WebJob name. Must start with a letter or a number and must not contain special characters other than `"-"` and `"_"`. |
   | **File Upload** | ConsoleApp.zip | A *.zip* file that contains your executable or script file and any supporting files needed to run the program or script. The supported executable or script file types are listed in the [Supported file types](#acceptablefiles) section. |
   | **Type** | Triggered | The [WebJob types](#webjob-types) are described earlier in this article. |
   | **Triggers** | Scheduled | For the scheduling to work reliably, enable the Always On feature. Always On is available only in the Basic, Standard, and Premium pricing tiers.|
   | **CRON Expression** | 0 0/20 * * * * | [CRON expressions](#ncrontab-expressions) are described in the following section. |

1. The new WebJob appears on the **WebJobs** page. If you see a message that says the WebJob was added, but you don't see it, select **Refresh**. 

1. The scheduled WebJob is run according to the schedule defined by the CRON expression. To run it manually at anytime, right-click the WebJob in the list and select the **Run** button, then confirm your selection.

    :::image type="content" source="media/webjobs-create/scheduled-webjob-run.png" alt-text="Screenshot that shows how to run a manually scheduled WebJob in the Azure portal." lightbox="media/webjobs-create/scheduled-webjob-run.png":::

## NCRONTAB expressions

An NCRONTAB expression is similar to a CRON expression, but includes an additional sixth field at the beginning for time precision in seconds. You can enter an [NCRONTAB expression](../azure-functions/functions-bindings-timer.md#ncrontab-expressions) in the portal or include a `settings.job` file at the root of your WebJob *.zip* file, as in the following example:

```json
{
    "schedule": "0 */15 * * * *"
}
```

To learn more, see [Scheduling a triggered WebJob](webjobs-dotnet-deploy-vs.md#scheduling-a-triggered-webjob).

[!INCLUDE [webjobs-cron-timezone-note](../../includes/webjobs-cron-timezone-note.md)]

## Manage WebJobs

You can manage the run state of individual WebJobs running in your site by using the [Azure portal](https://portal.azure.com). Go to **Settings** > **WebJobs**, choose the WebJob, and you can start and stop the WebJob. You can also view and modify the password of the webhook that runs the WebJob.  

You can also [configure an app setting](configure-common.md#configure-app-settings) named `WEBJOBS_STOPPED` with a value of `1` to stop all WebJobs running on your site. You can use this method to prevent conflicting WebJobs from running both in staging and production slots. You can similarly use a value of `1` for the `WEBJOBS_DISABLE_SCHEDULE` setting to disable triggered WebJobs in the site or a staging slot. For slots, remember to enable the **Deployment slot setting** option so that the setting itself doesn't get swapped.

## <a name="ViewJobHistory"></a> View the job history

1. For the WebJob you want to see, select **Logs**.

    :::image type="content" source="media/webjobs-create/open-logs.png" alt-text="Screenshot that shows how to access logs for a WebJob." lightbox="media/webjobs-create/open-logs.png":::

1. In the **WebJob Details** page, select a time to see details for one run.

    :::image type="content" source="media/webjobs-create/webjob-details-page.png" alt-text="Screenshot that shows how to choose a WebJob run to see its detailed logs." lightbox="media/webjobs-create/webjob-details-page.png":::

1. In the **WebJob Run Details** page, you can select **download** to get a text file of the logs, or select the **WebJobs** breadcrumb link at the top of the page to see logs for a different WebJob.

## WebJob status

The following is a list of common WebJob states:

- **Initializing**: The app has started and the WebJob is going through its initialization process.
- **Starting**: The WebJob is starting up.
- **Running**: The WebJob is running.
- **PendingRestart**: A continuous WebJob exits in less than two minutes since it started for any reason, and App Service waits 60 seconds before restarting the WebJob. If the continuous WebJob exits after the two-minute mark, App Service doesn't wait the 60 seconds and restarts the WebJob immediately. 
- **Stopped**: The WebJob was stopped (usually from the Azure portal) and is currently not running and won't run until you start it again manually, even for a continuous or scheduled WebJob.
- **Aborted**: This can occur for many of reasons, such as when a long-running WebJob reaches the time-out marker.

## <a name="NextSteps"></a> Next step

The Azure WebJobs SDK can be used with WebJobs to simplify many programming tasks. For more information, see [What is the WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki).
