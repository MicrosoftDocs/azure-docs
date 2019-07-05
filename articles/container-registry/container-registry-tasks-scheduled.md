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

This article shows you how to run an [ACR task](container-registry-tasks-overview.md) on a schedule. Schedule a task by setting up one or more *timer triggers*. 

Scheduling a task is useful for scenarios like the following:

* Run a container workload for scheduled maintenance operations. For example, run a containerized app to remove unneeded images from your registry.
* Run a set of tests on a production image during the workday as part of your live-site monitoring.

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the examples in this article. If you'd like to use it locally, version 2.0.68 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].


## About scheduling a task

* **Trigger with cron expression** - The timer trigger for a task uses a *cron expression*. The expression is a string with five fields specifying the minute, hour, day, month, and day of week to trigger the task. Frequencies of up to once per minute are supported. 

  For example, the expression `"0 12 * * Mon-Fri"` triggers a task at noon UTC on each weekday. See [details](#cron-expressions) later in this article.
* **Multiple timer triggers** - Adding multiple timers to a task is allowed, as long as the schedules differ. 
    * Specify multiple timer triggers when you create the task, or add them later.
    * Optionally name the triggers for easier management, or ACR Tasks will provide default trigger names.
    * If timer schedules overlap at a time, ACR Tasks triggers the task at the scheduled time for each timer. 
* **Other task triggers** - In a timer-triggered task, you can also enable triggers based on [source code commit](container-registry-tutorial-build-task.md) or [base image updates](container-registry-tutorial-base-image-update.md). Like other ACR tasks, you can also [manually trigger][az-acr-task-run] a scheduled task.

## Create a task with a timer trigger

When you create a task with the [az acr task create][az-acr-task-create] command, you can optionally add a timer trigger. Add the `--schedule` parameter and pass a cron expression for the timer. 

As a simple example, the following command triggers running the `hello-world` image from Docker Hub every day at 21:00 UTC. The task runs without a source code context.

```azurecli
az acr task create \
  --name mytask \
  --registry myregistry \
  --context /dev/null \
  --cmd hello-world \
  --schedule "0 21 * * *"
```

Run the [az acr task show][az-acr-task-show] command to see that the timer trigger is configured. By default, the base image update trigger is also enabled.

```console
$ az acr task show --name mytask --registry registry --output table
NAME      PLATFORM    STATUS    SOURCE REPOSITORY       TRIGGERS
--------  ----------  --------  -------------------     -----------------
mytask    linux       Enabled                           BASE_IMAGE, TIMER
```

Trigger the task manually with [az acr task run][az-acr-task-run] to ensure that it is set up properly:

```azurecli
az acr task run --name mytask --registry myregistry
```

If the container runs successfully, the output is similar to the following:

```console
Queued a run with ID: cf2a
Waiting for an agent...
2019/06/28 21:03:36 Using acb_vol_2ca23c46-a9ac-4224-b0c6-9fde44eb42d2 as the home volume
2019/06/28 21:03:36 Creating Docker network: acb_default_network, driver: 'bridge'
[...]
2019/06/28 21:03:38 Launching container with name: acb_step_0

Hello from Docker!
This message shows that your installation appears to be working correctly.
[...]
```

After the scheduled time, run the [az acr task list-runs][az-acr-task-list-runs] command to verify that the timer triggered the task as expected:

```azurecli
az acr task list runs --name mytask --registry myregistry --output table
``` 

When the timer is successful, output is similar to the following:

```console
RUN ID    TASK     PLATFORM    STATUS     TRIGGER    STARTED               DURATION
--------  -------- ----------  ---------  ---------  --------------------  ----------
[...]
cf2b      mytask   linux       Succeeded  Timer      2019-06-28T21:00:23Z  00:00:06
cf2a      mytask   linux       Succeeded  Manual     2019-06-28T20:53:23Z  00:00:06
```
            
## Manage timer triggers

Use the [az acr task timer][az-acr-task-timer] commands to manage the timer triggers for an ACR task.

### Add or update a timer trigger

After a task is created, optionally add a timer trigger by using the [az acr task timer add][az-acr-task-timer-add] command. The following example adds a timer trigger name *timer2* to *mytask* created previously. This timer triggers the task every day at 10:30 UTC.

```azurecli
az acr task timer add \
  --name mytask \
  --registry myregistry \
  --timer-name timer2 \
  --schedule "30 10 * * *"
```

Update the schedule of an existing trigger, or change its status, by using the [az acr task timer update][az-acr-task-timer-update] command. For example, update the trigger named *timer2* to trigger the task at 11:30 UTC:

```azurecli
az acr task timer update \
  --name mytask \
  --registry myregistry \
  --timer-name timer2 \
  --schedule "30 11 * * *"
```

### List timer triggers

The [az acr task timer list][az-acr-task-timer-list] command shows the timer triggers set up for a task:

```azurecli
az acr task timer list --name mytask --registry myregistry
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
    "schedule": "0 21 * * *",
    "status": "Enabled"
  }
]
```

### Remove a timer trigger 

Use the [az acr task timer remove][az-acr-task-timer-remove] command to remove a timer trigger from a task. The following example removes the *timer2* trigger from *mytask*:

```azurecli
az acr task timer remove \
  --name mytask \
  --registry myregistry \
  --timer-name timer2
```

## Cron expressions

ACR Tasks uses the [NCronTab](https://github.com/atifaziz/NCrontab) library to interpret cron expressions. Supported expressions in ACR Tasks have five required fields separated by white space:

`{minute} {hour} {day} {month} {day-of-week}`

The time zone used with the cron expressions is Coordinated Universal Time (UTC). Hours are in 24-hour format.

> [!NOTE]
> ACR Tasks does not support the `{second}` or `{year}` field in cron expressions. If you copy a cron expression used in another system, be sure to remove those fields, if they are used.

Each field can have one of the following types of values:

|Type  |Example  |When triggered  |
|---------|---------|---------|
|A specific value |<nobr>"5 * * * *"</nobr>|every hour at 5 minutes past the hour|
|All values (`*`)|<nobr>"* 5 * * *"</nobr>|every minute of the hour beginning 5:00 UTC (60 times a day)|
|A range (`-` operator)|<nobr>"0 1-3 * * *"</nobr>|3 times per day, at 1:00, 2:00, and 3:00 UTC|  
|A set of values (`,` operator)|<nobr>"20,30,40 * * * *"</nobr>|3 times per hour, at 20 minutes, 30 minutes, and 40 minutes past the hour|
|An interval value (`/` operator)|<nobr>"*/10 * * * *"</nobr>|6 times per hour, at 10 minutes, 20 minutes, and so on, past the hour

[!INCLUDE [functions-cron-expressions-months-days](../../includes/functions-cron-expressions-months-days.md)]

### Cron examples

|Example|When triggered  |
|---------|---------|
|`"*/5 * * * *"`|once every five minutes|
|`"0 * * * *"`|once at the top of every hour|
|`"0 */2 * * *"`|once every two hours|
|`"0 9-17 * * *"`|once every hour from 9:00 to 17:00 UTC|
|`"30 9 * * *"`|at 9:30 UTC every day|
|`"30 9 * * 1-5"`|at 9:30 UTC every weekday|
|`"30 9 * Jan Mon"`|at 9:30 UTC every Monday in January|


## Next steps

For examples of tasks triggered by source code commits or base image updates, check out the [ACR Tasks tutorial series](container-registry-tutorial-quick-task.md).



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