---
title: Schedule Azure Container Registry tasks
description: Set timers to run an Azure Container Registry task on a defined schedule.
services: container-registry
author: dlepow
ms.service: container-registry
ms.topic: article
ms.date: 06/27/2019
ms.author: danlep
---
# Run an ACR task on a defined schedule

This article shows you how to run an ACR task  on a schedule. You do this by setting up one or more *timer triggers* for the task. Schedule a task for scenarios like the following:

* Run a container workload for scheduled maintenance operations. For example, run a containerized app to remove unneeded images from your registry.
* Run a set of tests on a production image several times during the workday as part of your live-site monitoring.

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the examples in this article. If you'd like to use it locally, version 2.0.68 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].


## About scheduling a task

* **Trigger with cron expression** - The timer trigger for a task uses a *cron expression*. The expression is a string with five fields specifying the minute, hour, day, month, and day of week to trigger the task. Frequencies of up to once per minute are supported. 

  For example, the expression `"0 12 * * Mon-Fri"` triggers a task at noon UTC on each weekday. See [details](#cron-expressions) later in this article.
* **Multiple timer triggers** - Adding multiple timer triggers to a task is allowed, as long as the schedules differ. 
    * Specify multiple triggers when you create the task, or add them later.
    * Optionally name the timer triggers for easier management, or ACR Tasks will provide default trigger names.
    * If timer schedules overlap at a time, ACR Tasks runs the task at the scheduled time for one of the timers, and then triggers the task one minute later for the other. 
* **Other task triggers** - In a timer-triggered task, you can also enable triggers based on source code or base image updates. You can also manually trigger a scheduled task.

## Create a task with a timer trigger

When you create a task with the [az acr task create][az-acr-task-create] command, you can optionally add a timer trigger. Add the `--schedule` parameter and pass a cron expression for the timer. 

The following example triggers building the `hello-world` image in registry *myregistry* every 5 minutes (12 times per hour): at 5 minutes past the hour, 10 minutes past the hour, and so on. Source code update triggers are disabled to simplify this example, but you could enable those. For details, see the tutorial [Automate container image builds with Azure Container Registry Tasks](container-registry-tutorial-build-task.md).

```azurecli
az acr task create \
  --name hello-world \
  --image hello-world:{{.Run.ID}} \
  --registry myregistry \
  --context https://github.com/Azure-Samples/acr-build-helloworld-node.git \
  --file Dockerfile \
  --commit-trigger-enabled false \
  --pull-request-trigger-enabled false \
  --schedule "*/5 * * * *"
```

Run the [az acr task show][az-acr-task-show] command to see that the timer trigger is configured. By default, the base image update trigger is also enabled.

```console
$ az acr task show --name hello-world --registry registry --output table
NAME         PLATFORM    STATUS    SOURCE REPOSITORY                                               TRIGGERS
----------   ----------  --------  --------------------------------------------------------------  -----------------
hello-world  linux       Enabled   https://github.com/Azure-Samples/acr-build-helloworld-node.git  BASE_IMAGE, TIMER
```

After several minutes, run the [az acr task list-runs][az-acr-task-list-runs] command to verify that the timer triggers the task every five minutes:

```azurecli
az acr task list runs --name hello-world --registry myregistry
``` 

When the timer triggers the task successfuly, output is similar to the following:

```console
RUN ID    TASK         PLATFORM    STATUS     TRIGGER    STARTED               DURATION
--------  -----------  ----------  ---------  ---------  --------------------  ----------
[...]
cf2b      hello-world  linux       Succeeded  Timer      2019-06-26T23:20:32Z  00:00:29
cf2a      hello-world  linux       Succeeded  Timer      2019-06-26T23:15:33Z  00:00:25
cf29      hello-world  linux       Succeeded  Timer      2019-06-26T23:10:33Z  00:00:19
```
            
## Manage timer triggers

Use the [az acr task timer][az-acr-task-timer] commands to manage the timer triggers for an ACR task.

### Add or update a timer trigger

After a task is created, add a timer trigger at any time by using the [az acr task timer add][az-acr-task-timer-add] command. The following example adds a timer trigger name *timer2* to the *hello-world* task created previously. This timer triggers the task on weekdays at 10:30 UTC.

```azurecli
az acr task timer add \
  --name hello-world \
  --registry myregistry \
  --timer-name timer2 \
  --schedule "30 10 * * *"
```

Update the schedule of an existing timer trigger, or change its status, by using the [az acr task timer update][az-acr-task-timer-update] command. For example, update the trigger named *timer2* to trigger the task at 11:30 UTC:

```azurecli
az acr task timer update \
  --name hello-world \
  --registry myregistry \
  --timer-name timer2 \
  --schedule "30 11 * * *"
```

### List timer triggers

The [az acr task timer list][az-acr-task-timer-list] command shows the timer triggers set up for a task:

```azurecli
az acr task timer list --name hello-world --registry myregistry
```

Example output:

```JSON
[
  {
    "name": "timer2",
    "schedule": "30 11 * * *",
    "status": "Enabled"
  },
  {
    "name": "t1",
    "schedule": "*/5 * * * *",
    "status": "Enabled"
  }
]
```

### Remove a timer trigger 

Use the [az acr task timer remove][az-acr-task-timer-remove] command to remove a timer trigger from a task. The following example removes the *timer2* trigger from the *hello-world* task:

```azurecli
az acr task timer remove \
  --name hello-world \
  --registry myregistry \
  --timer-name timer2
```

## Cron expressions

ACR Tasks uses the [NCronTab](https://github.com/atifaziz/NCrontab) library to interpret cron expressions. Supported expressions in ACR Tasks have five required fields separated by white space:

`{minute} {hour} {day} {month} {day-of-week}`

The time zone used with the cron expressions is Coordinated Universal Time (UTC).

> [!NOTE]
> ACR Tasks does not support the `{second}` or `{year}` field in cron expressions. If you copy a cron expression used in another system, be sure to remove those fields, if they are used.

Each field can have one of the following types of values:

|Type  |Example  |When triggered  |
|---------|---------|---------|
|A specific value |<nobr>"5 * * * *"</nobr>|at hh:05 where hh is every hour (once an hour)|
|All values (`*`)|<nobr>"* 5 * * *"</nobr>|at 5:mm every day, where mm is every minute of the hour (60 times a day)|
|A range (`-` operator)|<nobr>"5-7 * * * *"</nobr>|at hh:05,hh:06, and hh:07 where hh is every hour (3 times an hour)|  
|A set of values (`,` operator)|<nobr>"5,8,10 * * * *"</nobr>|at hh:05,hh:08, and hh:10 where hh is every hour (3 times an hour)|
|An interval value (`/` operator)|<nobr>"*/5 * * * *"</nobr>|at hh:05, hh:10, hh:15, and so on through hh:55 where hh is every hour (12 times an hour)|

[!INCLUDE [functions-cron-expressions-months-days](../../includes/functions-cron-expressions-months-days.md)]

### Cron examples

|Example|When triggered  |
|---------|---------|
|`"*/5 * * * *"`|once every five minutes|
|`"0 * * * *"`|once at the top of every hour|
|`"0 */2 * * *"`|once every two hours|
|`"0 9-17 * * *"`|once every hour from 9 AM to 5 PM|
|`"30 9 * * *"`|at 9:30 AM every day|
|`"30 9 * * 1-5"`|at 9:30 AM every weekday|
|`"30 9 * Jan Mon"`|at 9:30 AM every Monday in January|


## Next steps

* For examples of triggering tasks based on source code commits or base image updates, check out the [ACR Tasks tutorial series](container-registry-tutorial-quick-task.md).



<!-- LINKS - External -->
[task-examples]: https://github.com/Azure-Samples/acr-tasks


<!-- LINKS - Internal -->
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-task-show]: /cli/azure/acr/task#az-acr-task-show
[az-acr-task-list-runs]: /cli/azure/acr/task#az-acr-task-list-runs
[az-acr-task-timer]: /cli/azure/acr/task/timer
[az-acr-task-timer-add]: /cli/azure/acr/task/timer#az-acr-task-timer-add
[az-acr-task-timer-remove]: /cli/azure/acr/task/timer#az-acr-task-timer-remove
[az-acr-task-timer-list]: /cli/azure/acr/task/timer#az-acr-task-timer-list
[az-acr-task-timer-update]: /cli/azure/acr/task/timer#az-acr-task-timer-update
[az-acr-task-run]: /cli/azure/acr/task#az-acr-task-run
[az-acr-task]: /cli/azure/acr/task
[azure-cli-install]: /cli/azure/install-azure-cli