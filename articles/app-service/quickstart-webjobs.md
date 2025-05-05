---
title: 'Create a scheduled WebJob using a prebuilt script'
description: Quickly schedule a time-based WebJob in Azure App Service using a prebuilt script for Windows or Linux.
ms.topic: quickstart
ms.date: 5/2/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: glenga
#Customer intent: As a web developer, I want to quickly run a background script that prints the current time.
---

# Quickstart: Create a scheduled WebJob

WebJobs in Azure App Service let you run scripts or programs as background tasks. In this quickstart, you create a scheduled WebJob that prints the current time, using a prebuilt script for either Windows or Linux.

## Prerequisites

- An Azure account. [Create one for free](https://azure.microsoft.com/free/).
- An existing App Service app running on your preferred OS:
  - Windows App Service (any stack: code or container)
  - Linux App Service (any stack: code or container)
- Enable **Always On** in the App Service settings: [Configure Always On](configure-common.md?tabs=portal#configure-general-settings)
- For Windows containers and all Linux apps, set the app setting `WEBSITE_SKIP_RUNNING_KUDUAGENT = false`

## Download a sample WebJob

Choose the version that matches your App Service OS:

| Platform | Download link | Included script |
|----------|----------------|-----------------|
| **Windows** | [Download CMD version](https://github.com/Azure-Samples/App-Service-WebJobs-Quickstart/raw/main/windows/webjob-windows.zip) | `run.cmd` (uses `echo %date% %time%`) |
| **Linux**   | [Download Bash version](https://github.com/Azure-Samples/App-Service-WebJobs-Quickstart/raw/main/linux/webjob-linux.zip)   | `run.sh` (uses `date`) |

Each zip contains a single script that prints the current system date and time.

## Add the WebJob in the Azure portal

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

4. Select **OK** to create the WebJob.

## Verify the WebJob

1. Go to the **WebJobs** tab.
2. Select your WebJob and open **Logs**.
3. Confirm that it runs every minute and prints the system time.

## Clean up

To remove the WebJob, select the WebJob in the portal and select `Delete`.

## <a name="NextSteps"></a> Next step

[Build a custom scheduled WebJob from scratch using .NET, Python, Node.js, Java, or PHP](tutorial-webjobs.md)