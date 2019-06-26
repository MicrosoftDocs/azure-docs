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

* **Timer trigger** - To schedule a task, add a *timer trigger* and pass a *cron expression* for the timer. The cron expression for ACR Tasks is a string consisting of five fields that specify the minute, hour, day, month, and day of week to run the task. For example, the expression `"0 12 * * Mon-Fri"` triggers a task at noon UTC on Mondays through Fridays. See [details](#cron-expressions) later in this article.
* **Multiple timers** - Adding multiple timers to a task is allowed, as long as the schedules differ. If timer triggers overlap at a particular time, ACR Tasks runs the task at the expected time on one of the timers, and then triggers the task for the other timer one minute later.
* **Works with other task triggers** - You can add timers to a task in addition to enabling triggers based on Git commits or base image updates. You can also trigger the task manually.


## Create a task with a schedule

You can add a timer trigger to task when you create the task the the [az acr task create][az-acr-task-create] command. Add the `--schedule` parameter and pass a cron expression for the timer. The following example builds the `hello-world` image in registry *myregistry* on a schedule of 12 times per hour. This example triggers the task at 5 minutes past the hour, 10 minutes past the hour, and so on. Source control update triggers are disabled in this example, but you could set it up to run when commits are pushed to the repo or a pull request is made. 

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

After several minutes, run the [az acr task list-runs][az-acr-task-list-runs] command to verify see that the timer triggers the task on schedule:

```azurecli
az acr task list runs --name hello-world --registry myregistry
``` 

Output:

```console
RUN ID    TASK         PLATFORM    STATUS     TRIGGER    STARTED               DURATION
--------  -----------  ----------  ---------  ---------  --------------------  ----------
cf2b      hello-world  linux       Succeeded  Timer      2019-06-26T23:20:32Z  00:00:29
cf2a      hello-world  linux       Succeeded  Timer      2019-06-26T23:15:33Z  00:00:25
cf29      hello-world  linux       Succeeded  Timer      2019-06-26T23:10:33Z  00:00:19
```
            
## Manage task timers

### Add a schedule to a task

### Remove a schedule from a task

## Cron expressions

*  For example, .... Timers don't depend on the time that a task is created or a timer is added.

## Next steps


<!-- LINKS - External -->
[task-examples]: https://github.com/Azure-Samples/acr-tasks


<!-- LINKS - Internal -->
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-task-show]: /cli/azure/acr/task#az-acr-task-show
[az-acr-task-list-runs]: /cli/azure/acr/task#az-acr-task-list-runs
[az-acr-task-timer-add]: /cli/azure/acr/task/timer#az-acr-task-timer-add
[az-acr-task-timer-remove]: /cli/azure/acr/task/timer#az-acr-task-timer-remove
[az-acr-run]: /cli/azure/acr#az-acr-run
[az-acr-task]: /cli/azure/acr/task