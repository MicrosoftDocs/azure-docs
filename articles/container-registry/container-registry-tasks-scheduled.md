---
title: Schedule Azure Container Registry tasks
description: Set timers to run an Azure Container Registry task on a defined schedule.
services: container-registry
author: dlepow
ms.service: container-registry
ms.topic: article
ms.date: 06/26/2019
ms.author: danlep
---

# Run an ACR Task on a defined schedule

Scenarios to run scheduled tasks include:

* Run a container workload for maintenance operations. For example, you might have a containerized app that removes unneeded images from your registry.
* Run a set of tests on a production image to detect changes in your production environment,

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this quickstart. If you'd like to use it locally, version 2.0.68 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].


## Things to know

* **Timer trigger** - To schedule a task, add a *timer trigger* with a *cron expression*. The cron expression for a timer trigger is a string with five fields specifying the minute, hour, day, month, and day of week to trigger the task. For example, the expression `"0 12 * * Mon-Fri"` triggers a task at noon UTC on each weekday. See [details](#cron-expressions) later in this article.
* **Multiple timer triggers** - Adding multiple timer triggers to a task is allowed, as long as the schedules differ. Specify multiple triggers when you create the task, or add them later. If timer schedules overlap at a particular time, ACR Tasks runs the task at the expected time in one of the schedules, and then triggers the task for the other one minute later. Optionally name the timer triggers to help you manage them, or ACR Tasks will provide default trigger names.
* **Other task triggers** - Add timer triggers to a task in addition to enabling triggers based on source code or base image updates. You can also manually trigger a scheduled task.


## Create a task with a schedule

You can add a timer trigger to task when you create the task the the [az acr task create][az-acr-task-create] command. Add the `--schedule` parameter and pass a cron expression for the timer. The following example triggers building the `hello-world` image in registry *myregistry* 12 times per hour. This example triggers the task at 5 minutes past the hour, 10 minutes past the hour, and so on. Source control update triggers are disabled in this example, but you could set it up to be triggered by source code updates. 

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

Run the [az acr task show][az-acr-task-show] command to see that the timer trigger is configured in the task. By default, the base image update trigger is also enabled.

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

Output:

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

Output in this example shows details for the original timer trigger with default name *t1* and the added trigger *timer2*:

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

*  For example, .... Timers don't depend on the time that a task is created or a timer is added.

## Next steps


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