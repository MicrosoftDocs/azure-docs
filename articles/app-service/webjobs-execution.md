---
title: How WebJobs run in Azure App Service
description: Understand how WebJobs are discovered, triggered, and managed by the Kudu engine in Azure App Service.
ms.topic: conceptual
ms.service: azure-app-service
author: msangapu-msft
ms.author: msangapu
ms.date: 05/01/2025
ms.collection: ce-skilling-ai-copilot
---

# How WebJobs run in Azure App Service

Azure WebJobs allow you to run background tasks within your App Service app, without needing separate infrastructure. These tasks are discovered and managed by the Kudu engine, the built-in App Service deployment and runtime management service. Kudu handles WebJob execution, file system access, diagnostics, and log collection behind the scenes.

This article explains how WebJobs are discovered, how the runtime decides what to execute, and how you can configure behavior using the optional `settings.job` file.

## Platform-specific notes

WebJobs support a variety of script and executable formats, depending on the App Service hosting environment. The types of files you can run—and the runtimes available—vary slightly based on whether you're using Windows code, Linux code, or custom containers. In general, built-in runtimes are available for common scripting languages, and additional file types are supported when they match the language runtime of your app or container.

[!INCLUDE [webjob-types](./includes/webjobs-create/webjob-types.md)]

>[!IMPORTANT]
> WebJobs that are continuous, scheduled, or event-driven may stop running if the web app hosting them becomes idle. Web apps can time out after 20 minutes of inactivity, and only direct requests to the app reset this idle timer. Actions like viewing the portal or accessing the Kudu tools do not keep the app active.
> To ensure WebJobs run reliably, enable the Always on setting in the Configuration pane of your App Service.
> This setting is available only in the Basic, Standard, and Premium pricing tiers.

## Job discovery and folder structure

WebJobs are stored in the `site/wwwroot/App_Data/jobs/` folder of your App Service app. There are two subfolders:

- `continuous/`: For long-running jobs that start automatically and run continuously.
- `triggered/`: For jobs that run on-demand or on a schedule.

Each job has its own subfolder under the corresponding type, named after the WebJob. For example:

```
App_Data/jobs/triggered/myjob/
App_Data/jobs/continuous/myjob/
```

Inside the job folder, the Kudu engine looks for a file to execute. This file can be a script or executable.

## Entry point detection

The WebJobs runtime uses a file named `run.*` (such as `run.py`, `run.sh`, or `run.js`) as the explicit entry point for a job. This file tells the platform which script or binary to execute first, ensuring consistent and predictable behavior across environments.

The filename must be exactly `run.*` to be autodetected. Files like `start.sh` or `job.py` will be ignored unless manually triggered. If no `run.*` file is found, the platform attempts to detect a fallback entry point by selecting the first supported file based on the language platform of the WebJob. For example:
- A Python WebJob with multiple `.py` files (for example, `file1.py`, `file2.py`) will execute the first `.py` file it finds in the archive.
- A Node.js WebJob looks for the first `.js` file.
- A Bash-based WebJob looks for the first `.sh` script.

This fallback behavior can lead to unpredictable execution when multiple script files are present—especially in multi-file projects—so it's recommended to include a `run.*` file to define the entry point explicitly.

On Linux-based WebJobs, `.sh` scripts must include a shebang (#!) and must be marked as executable.

## WebJob configuration with settings.job

You can customize WebJob behavior using an optional `settings.job` file (JSON format) placed in the job's root folder. This file supports several properties:

| Property | Description |
|----------|-------------|
| `schedule` | (string) A CRON expression used to schedule a triggered job. Example: `"0 */15 * * * *"`. Only applicable to triggered jobs. |
| `is_singleton` | (bool) Ensures only one instance of the job runs across all scaled-out instances. Default: `true` for continuous jobs, `false` for triggered/on-demand. |
| `stopping_wait_time` | (number, seconds) Grace period (default 5s) given to the script before it's killed when the WebJob is stopped (for example, during site swaps or restarts). |
| `shutdownGraceTimeLimit` | (number, seconds) Max time (default 0s, meaning no limit) given for the entire WebJob process shutdown, including the `stopping_wait_time`, before it's forcefully terminated. |
| `run_mode` | (string) Values: `continuous`, `scheduled`, `on_demand`. Overrides job type detection based on the folder. |

> [!NOTE]
> `stopping_wait_time` applies specifically to the running script's grace period, while `shutdownGraceTimeLimit` defines the overall process shutdown time-out. Consult the [Kudu documentation](https://github.com/projectkudu/kudu/wiki/WebJobs) for detailed behavior.

### Example
```json
{
  "schedule": "0 0 * * * *", // Run once at the top of every hour
  "is_singleton": true,
  "stopping_wait_time": 60,
  "shutdownGraceTimeLimit": 120
}
```

## Logging and diagnostics

WebJob logs are handled by the Kudu engine and are available under the `App_Data/jobs/<type>/<jobname>` folder. Additionally, logs can be viewed in the Azure portal or accessed via the SCM (Kudu) endpoint:

```
https://<your-app>.scm.azurewebsites.net/api/triggeredwebjobs/<job>/history
```
For more advanced monitoring and querying capabilities, consider integrating with [Application Insights](/azure/azure-monitor/app/app-insights-overview).

Triggered WebJobs include a full history of executions. Continuous WebJobs stream logs in real time.

## Troubleshooting tips

- **WebJob not starting:** Check for a missing or misnamed `run.*` file. Ensure it's in the correct job folder (`triggered` or `continuous`).
- **Permissions error (Linux):** Ensure the script has execute permissions (`chmod +x run.sh`) and includes a valid shebang (e.g., `#!/bin/bash`).
- **Job not stopping gracefully:** Use `settings.job` to define `stopping_wait_time` and potentially `shutdownGraceTimeLimit`.
- **Scheduled job not running:** Verify the CRON expression in `settings.job` is correct and the App Service Plan has "Always On" enabled if needed.
- **Check Kudu logs:** Examine the detailed execution logs and deployment logs available in the Kudu console (`https://<your-app>.scm.azurewebsites.net/`) under Tools > WebJobs and potentially Log stream.

## <a name="NextSteps"></a> Next steps

- [WebJobs overview](overview-webjobs.md)
- [Create a scheduled WebJob](quickstart-webjobs.md)