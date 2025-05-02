---
title: How WebJobs run in Azure App Service
description: Understand how WebJobs are discovered, triggered, and managed by the Kudu engine in Azure App Service.
ms.topic: conceptual
ms.service: azure-app-service
author: msangapu-msft
ms.author: msangapu
ms.date: 05/01/2025
---

# How WebJobs run in Azure App Service

Azure WebJobs allow you to run background tasks within your App Service app, without needing separate infrastructure. These tasks are discovered and managed by the **Kudu engine**, which handles execution, monitoring, and log collection.

This article explains how WebJobs are discovered, how the runtime decides what to execute, and how you can configure behavior using the optional `settings.job` file.

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

The WebJob runtime executes the **first valid script or binary** it finds based on this order:

1. `run.cmd`
2. `run.bat`
3. `run.exe`
4. `run.ps1`
5. `run.sh`
6. `run.py`
7. `run.php`
8. `run.js`
9. `run.fsx`

> [NOTE] The file must be named exactly `run.*` — not `start.sh` or `job.py`.

The platform uses a run.* file (such as run.sh, run.py, or run.js) as the entry point for a WebJob. If no recognized run.* file is present, it may attempt to execute the first supported script file it finds in the archive. This fallback behavior can be unpredictable—especially when multiple script files are included—so it's strongly recommended to explicitly define a run.* file to ensure reliable execution. On Linux, `.sh` scripts must have a shebang (`#!`) and executable permissions.

## WebJob configuration with settings.job

You can customize WebJob behavior using an optional `settings.job` file (JSON format) placed in the job's root folder. This file supports several properties:

| Property | Description |
|----------|-------------|
| `schedule` | (string) A CRON expression used to schedule a triggered job. Example: `"0 */15 * * * *"`. Only applicable to triggered jobs. |
| `is_singleton` | (bool) Ensures only one instance of the job runs across all scaled-out instances. Default: `true` for continuous jobs, `false` for triggered/on-demand. |
| `stopping_wait_time` | (number, seconds) Grace period (default 5s) given to the script before it's killed when the WebJob is stopped (e.g., during site swaps or restarts). |
| `shutdownGraceTimeLimit` | (number, seconds) Max time (default 0s, meaning no limit) given for the entire WebJob process shutdown, including the `stopping_wait_time`, before it's forcefully terminated. |
| `run_mode` | (string) Values: `continuous`, `scheduled`, `on_demand`. Overrides job type detection based on the folder. |

> [NOTE]
> `stopping_wait_time` applies specifically to the running script's grace period, while `shutdownGraceTimeLimit` defines the overall process shutdown timeout. Consult the [Kudu documentation](https://github.com/projectkudu/kudu/wiki/WebJobs) for detailed behavior.

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

## Platform-specific notes

[!INCLUDE [webjobs-always-on-note](../../includes/webjobs-always-on-note.md)]

## Troubleshooting tips

- **WebJob not starting:** Check for a missing or misnamed `run.*` file. Ensure it's in the correct job folder (`triggered` or `continuous`).
- **Permissions error (Linux):** Ensure the script has execute permissions (`chmod +x run.sh`) and includes a valid shebang (e.g., `#!/bin/bash`).
- **Job not stopping gracefully:** Use `settings.job` to define `stopping_wait_time` and potentially `shutdownGraceTimeLimit`.
- **Scheduled job not running:** Verify the CRON expression in `settings.job` is correct and the App Service Plan has "Always On" enabled if needed.
- **Check Kudu logs:** Examine the detailed execution logs and deployment logs available in the Kudu console (`https://<your-app>.scm.azurewebsites.net/`) under Tools > WebJobs and potentially Log stream.

## See also

- [WebJobs overview](overview-webjobs.md)
- [Create a scheduled WebJob](quickstart-webjobs.md)