---
title: 'Create a scheduled Python WebJob'
description: WebJobs on App Service enable you to automate repetitive tasks on your app. Learn how to create scheduled WebJobs in Azure App Service.
ms.topic: quickstart
ms.date: 4/24/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: glenga
#Customer intent: As a web developer, I want to quickly run a background script that prints the current time.
---

# Quickstart: Create a scheduled WebJob

WebJobs in Azure App Service let you run scripts or programs as background tasks. In this quickstart, you’ll create a scheduled WebJob that prints the current time, using a prebuilt script for either Windows or Linux.

## Prerequisites

- An Azure account. [Create one for free](https://azure.microsoft.com/free/).
- An existing App Service app running on your preferred OS:
  - Windows App Service (any stack: code or container)
  - Linux App Service (any stack: code or container))
- Enable **Always On** in the App Service settings: [Configure Always On](configure-common.md?tabs=portal#configure-general-settings)
- For Windows containers and all Linux apps, set the app setting `WEBSITE_SKIP_RUNNING_KUDUAGENT = false`

## Step 1: Download a sample WebJob

Choose the version that matches your App Service OS:

| Platform | Download link | Included script |
|----------|----------------|-----------------|
| **Windows** | [Download CMD version](https://github.com/Azure-Samples/App-Service-WebJobs-Quickstart/raw/main/windows/webjob-windows.zip) | `run.cmd` (uses `echo %date% %time%`) |
| **Linux**   | [Download Bash version](https://github.com/Azure-Samples/App-Service-WebJobs-Quickstart/raw/main/linux/webjob-linux.zip)   | `run.sh` (uses `date`) |

Each zip contains a single script that prints the current system date and time.

## Step 2: Add the WebJob in the Azure portal

1. In the [Azure portal](https://portal.azure.com), go to your **App Service** app.
2. In the left menu, select **WebJobs** > **+ Add**.
3. Fill in the form with the following values:

   | Setting            | Value             |
   |--------------------|-------------------|
   | **Name**           | `webjob`          |
   | **File Upload**    | The `.zip` file you downloaded |
   | **Type**           | `Triggered`       |
   | **Triggers**       | `Scheduled`       |
   | **CRON Expression**| `0 0/1 * * * *`   |

[!INCLUDE [webjobs-cron-timezone-note](../../includes/webjobs-cron-timezone-note.md)]

4. Click **OK** to create the WebJob.

## Step 3: Monitor WebJob logs

Select the log for the WebJob you created earlier.

    :::image type="content" source="media/quickstart-webjobs/review-webjobs-logs.png" alt-text="Screenshot that shows how to view WebJob logs in an App Service app in the portal (scheduled WebJob).":::


The output should look similar to the following.

    :::image type="content" source="media/quickstart-webjobs/webjobs-log-output.png" alt-text="Screenshot that shows WebJobs log output.":::

## Step 4: Clean up

To remove the WebJob, select the WebJob in the portal and select `Delete`.

    :::image type="content" source="media/quickstart-webjobs/delete-webjobs.png" alt-text="Screenshot showing how you can delete a WebJob in the portal.":::

## <a name="NextSteps"></a> Next steps

## Next step

[Build a custom scheduled WebJob from scratch using .NET, Python, Node.js, Java, or PHP](tutorial-webjobs.md)

## Create a scheduled WebJob in Azure

1. In the [Azure portal](https://portal.azure.com), go to the **App Service** page of your App Service app.

1. From the left pane, select **WebJobs**, then select **Add**.

    :::image type="content" source="media/webjobs-create/add-webjob.png" alt-text="Screenshot that shows how to add a WebJob in an App Service app in the portal (scheduled WebJob).":::

1. Fill in the **Add WebJob** settings as specified in the table, then select **Create Webjob**. For **File Upload**, be sure to select the .zip file you downloaded earlier in the [Download the sample WebJob](#download-the-sample-webjob) section.

    :::image type="content" source="media/webjobs-create/configure-new-scheduled-webjob.png" alt-text="Screenshot that shows how to configure a scheduled WebJob in an App Service app.":::

   | Setting      | value   | Description  |
   | ------------ | ----------------- | ------------ |
   | **Name** | webjob | The WebJob name. Must start with a letter or a number and must not contain special characters other than "-" and "_". |
   | **File Upload** | webjob.zip | The *.zip* file that contains your executable or script file. The supported file types are listed in the [supported file types](webjobs-create.md?tabs=windowscode#acceptablefiles) section. |
   | **Type** | Triggered | Specifies when the WebJob runs: Continuous or Triggered. |
   | **Triggers** | Scheduled | Scheduled or Manual. Ensure [Always on](configure-common.md?tabs=portal#configure-general-settings) is enabled for the schedule to work reliably.|
   | **CRON Expression** | 0 0/1 * * * * | For this quickstart, we use a schedule that runs every minute. See [CRON expressions](webjobs-create.md?tabs=windowscode#ncrontab-expressions) to learn more about the syntax. |

1. The new WebJob appears on the **WebJobs** page. If you see a message that says the WebJob was added, but you don't see it, select **Refresh**. 

1. The scheduled WebJob is run at the schedule defined by the CRON expression. 

    :::image type="content" source="media/webjobs-create/scheduled-webjob-run.png" alt-text="Screenshot that shows how to run a manually scheduled WebJob in the Azure portal.":::
