---
title: Tutorial - Trigger image build by private base image update
description: In this tutorial, you configure an Azure Container Registry Task to automatically trigger container image builds in the cloud when a base image in another private Azure container registry is updated.
ms.topic: tutorial
ms.date: 11/20/2020
ms.custom: devx-track-js, devx-track-azurecli
---

# Tutorial: Automate container image builds when a base image is updated in another private container registry 

[ACR Tasks](container-registry-tasks-overview.md) supports automated image builds when a container's [base image is updated](container-registry-tasks-base-images.md), such as when you patch the OS or application framework in one of your base images. 

In this tutorial, you learn how to create an ACR task that triggers a build in the cloud when a container's base image is pushed to another Azure container registry. You can also try a tutorial to create an ACR task that triggers an image build when a base image is pushed to the [same Azure container registry](container-registry-tutorial-base-image-update.md).

In this tutorial:

> [!div class="checklist"]
> * Build the base image in a base registry
> * Create an application build task in another registry to track the base image 
> * Update the base image to trigger an application image task
> * Display the triggered task
> * Verify updated application image

## Prerequisites

### Complete the previous tutorials

This tutorial assumes you've already configured your environment and completed the steps in the first two tutorials in the series, in which you:

* Create Azure container registry
* Fork sample repository
* Clone sample repository
* Create GitHub personal access token

If you haven't already done so, complete the following tutorials before proceeding:

[Build container images in the cloud with Azure Container Registry Tasks](container-registry-tutorial-quick-task.md)

[Automate container image builds with Azure Container Registry Tasks](container-registry-tutorial-build-task.md)

In addition to the container registry created for the previous tutorials, you need to create a registry to store the base images. If you want to, create the second registry in a different location than the original registry.

### Configure the environment

Populate these shell environment variables with values appropriate for your environment. This step isn't strictly required, but makes executing the multiline Azure CLI commands in this tutorial a bit easier. If you don't populate these environment variables, you must manually replace each value wherever it appears in the example commands.

```azurecli
BASE_ACR=<base-registry-name>   # The name of your Azure container registry for base images
ACR_NAME=<registry-name>        # The name of your Azure container registry for application images
GIT_USER=<github-username>      # Your GitHub user account name
GIT_PAT=<personal-access-token> # The PAT you generated in the second tutorial
```

### Base image update scenario

This tutorial walks you through a base image update scenario. This scenario reflects a development workflow to manage base images in a common, private container registry when creating application images in other registries. The base images could specify common operating systems and frameworks used by a team, or even common service components.

For example, developers who develop application images in their own registries can access a set of base images maintained in the common base registry. The base registry can be in another region or even geo-replicated.

The [code sample][code-sample] includes two Dockerfiles: an application image, and an image it specifies as its base. In the following sections, you create an ACR task that automatically triggers a build of the application image when a new version of the base image is pushed to a different Azure container registry.

* [Dockerfile-app][dockerfile-app]: A small Node.js web application that renders a static web page displaying the Node.js version on which it's based. The version string is simulated: it displays the contents of an environment variable, `NODE_VERSION`, that's defined in the base image.

* [Dockerfile-base][dockerfile-base]: The image that `Dockerfile-app` specifies as its base. It is itself based on a [Node][base-node] image, and includes the `NODE_VERSION` environment variable.

In the following sections, you create a task, update the `NODE_VERSION` value in the base image Dockerfile, then use ACR Tasks to build the base image. When the ACR task pushes the new base image to your registry, it automatically triggers a build of the application image. Optionally, you run the application container image locally to see the different version strings in the built images.

In this tutorial, your ACR task builds and pushes an application container image specified in a Dockerfile. ACR Tasks can also run [multi-step tasks](container-registry-tasks-multi-step.md), using a YAML file to define steps to build, push, and optionally test multiple containers.

## Build the base image

Start by building the base image with an ACR Tasks *quick task*, using [az acr build][az-acr-build]. As discussed in the [first tutorial](container-registry-tutorial-quick-task.md) in the series, this process not only builds the image, but pushes it to your container registry if the build is successful. In this example, the image is pushed to the base image registry.

```azurecli
az acr build --registry $BASE_ACR --image baseimages/node:15-alpine --file Dockerfile-base .
```

## Create a task to track the private base image

Next, create a task in the application image registry with [az acr task create][az-acr-task-create], enabling a [managed identity](container-registry-tasks-authentication-managed-identity.md). The managed identity is used in later steps so that the task authenticates with the base image registry. 

This example uses a system-assigned identity, but you could create and enable a user-assigned managed identity for certain scenarios. For details, see [Cross-registry authentication in an ACR task using an Azure-managed identity](container-registry-tasks-cross-registry-authentication.md).

```azurecli
az acr task create \
    --registry $ACR_NAME \
    --name baseexample2 \
    --image helloworld:{{.Run.ID}} \
    --context https://github.com/$GIT_USER/acr-build-helloworld-node.git#main \
    --file Dockerfile-app \
    --git-access-token $GIT_PAT \
    --arg REGISTRY_NAME=$BASE_ACR.azurecr.io \
    --assign-identity
```

This task is similar to the task created in the [previous tutorial](container-registry-tutorial-build-task.md). It instructs ACR Tasks to trigger an image build when commits are pushed to the repository specified by `--context`. While the Dockerfile used to build the image in the previous tutorial specifies a public base image (`FROM node:15-alpine`), the Dockerfile in this task, [Dockerfile-app][dockerfile-app], specifies a base image in the base image registry:

```Dockerfile
FROM ${REGISTRY_NAME}/baseimages/node:15-alpine
```

This configuration makes it easy to simulate a framework patch in the base image later in this tutorial.

## Give identity pull permissions to base registry

To give the task's managed identity permissions to pull images from the base image registry, first run [az acr task show][az-acr-task-show] to get the service principal ID of the identity. Then run [az acr show][az-acr-show] to get the resource ID of the base registry:

```azurecli
# Get service principal ID of the task
principalID=$(az acr task show --name baseexample2 --registry $ACR_NAME --query identity.principalId --output tsv) 

# Get resource ID of the base registry
baseregID=$(az acr show --name $BASE_ACR --query id --output tsv) 
```
 
Assign the managed identity pull permissions to the registry by running [az role assignment create][az-role-assignment-create]:

```azurecli
az role assignment create \
  --assignee $principalID \
  --scope $baseregID --role acrpull 
```

## Add target registry credentials to the task

Run [az acr task credential add][az-acr-task-credential-add] to add credentials to the task. Pass the `--use-identity [system]` parameter to indicate that the task's system-assigned managed identity can access the credentials.

```azurecli
az acr task credential add \
  --name baseexample2 \
  --registry $ACR_NAME \
  --login-server $BASE_ACR.azurecr.io \
  --use-identity [system] 
```

## Manually run the task

Use [az acr task run][az-acr-task-run] to manually trigger the task and build the application image. This step is needed so that the task tracks the application image's dependency on the base image.

```azurecli
az acr task run --registry $ACR_NAME --name baseexample2
```

Once the task has completed, take note of the **Run ID** (for example, "da6") if you wish to complete the following optional step.

### Optional: Run application container locally

If you're working locally (not in the Cloud Shell), and you have Docker installed, run the container to see the application rendered in a web browser before you rebuild its base image. If you're using the Cloud Shell, skip this section (Cloud Shell does not support `az acr login` or `docker run`).

First, authenticate to your container registry with [az acr login][az-acr-login]:

```azurecli
az acr login --name $ACR_NAME
```

Now, run the container locally with `docker run`. Replace **\<run-id\>** with the Run ID found in the output from the previous step (for example, "da6"). This example names the container `myapp` and includes the `--rm` parameter to remove the container when you stop it.

```bash
docker run -d -p 8080:80 --name myapp --rm $ACR_NAME.azurecr.io/helloworld:<run-id>
```

Navigate to `http://localhost:8080` in your browser, and you should see the Node.js version number rendered in the web page, similar to the following. In a later step, you bump the version by adding an "a" to the version string.

:::image type="content" source="media/container-registry-tutorial-base-image-update/base-update-01.png" alt-text="Screenshot of sample application in browser":::

To stop and remove the container, run the following command:

```bash
docker stop myapp
```

## List the builds

Next, list the task runs that ACR Tasks has completed for your registry using the [az acr task list-runs][az-acr-task-list-runs] command:

```azurecli
az acr task list-runs --registry $ACR_NAME --output table
```

If you completed the previous tutorial (and didn't delete the registry), you should see output similar to the following. Take note of the number of task runs, and the latest RUN ID, so you can compare the output after you update the base image in the next section.

```console
$ az acr task list-runs --registry $ACR_NAME --output table

UN ID    TASK            PLATFORM    STATUS     TRIGGER       STARTED               DURATION
--------  --------------  ----------  ---------  ------------  --------------------  ----------
ca12      baseexample2    linux       Succeeded  Manual        2020-11-21T00:00:56Z  00:00:36
ca11      baseexample1    linux       Succeeded  Image Update  2020-11-20T23:38:24Z  00:00:34
ca10      taskhelloworld  linux       Succeeded  Image Update  2020-11-20T23:38:24Z  00:00:24
cay                       linux       Succeeded  Manual        2020-11-20T23:38:08Z  00:00:22
cax       baseexample1    linux       Succeeded  Manual        2020-11-20T23:33:12Z  00:00:30
caw       taskhelloworld  linux       Succeeded  Commit        2020-11-20T23:16:07Z  00:00:29
```

## Update the base image

Here you simulate a framework patch in the base image. Edit **Dockerfile-base**, and add an "a" after the version number defined in `NODE_VERSION`:

```Dockerfile
ENV NODE_VERSION 15.2.1a
```

Run a quick task to build the modified base image. Take note of the **Run ID** in the output.

```azurecli
az acr build --registry $BASE_ACR --image baseimages/node:15-alpine --file Dockerfile-base .
```

Once the build is complete and the ACR task has pushed the new base image to your registry, it triggers a build of the application image. It may take few moments for the task you created earlier to trigger the application image build, as it must detect the newly built and pushed base image.

## List updated build

Now that you've updated the base image, list your task runs again to compare to the earlier list. If at first the output doesn't differ, periodically run the command to see the new task run appear in the list.

```azurecli
az acr task list-runs --registry $ACR_NAME --output table
```

Output is similar to the following. The TRIGGER for the last-executed build should be "Image Update", indicating that the task was kicked off by your quick task of the base image.

```console
$ az acr task list-runs --registry $ACR_NAME --output table

         PLATFORM    STATUS     TRIGGER       STARTED               DURATION
--------  --------------  ----------  ---------  ------------  --------------------  ----------
ca13      baseexample2    linux       Succeeded  Image Update  2020-11-21T00:06:00Z  00:00:43
ca12      baseexample2    linux       Succeeded  Manual        2020-11-21T00:00:56Z  00:00:36
ca11      baseexample1    linux       Succeeded  Image Update  2020-11-20T23:38:24Z  00:00:34
ca10      taskhelloworld  linux       Succeeded  Image Update  2020-11-20T23:38:24Z  00:00:24
cay                       linux       Succeeded  Manual        2020-11-20T23:38:08Z  00:00:22
cax       baseexample1    linux       Succeeded  Manual        2020-11-20T23:33:12Z  00:00:30
caw       taskhelloworld  linux       Succeeded  Commit        2020-11-20T23:16:07Z  00:00:29
```

If you'd like to perform the following optional step of running the newly built container to see the updated version number, take note of the **RUN ID** value for the Image Update-triggered build (in the preceding output, it's "ca13").

### Optional: Run newly built image

If you're working locally (not in the Cloud Shell), and you have Docker installed, run the new application image once its build has completed. Replace `<run-id>` with the RUN ID you obtained in the previous step. If you're using the Cloud Shell, skip this section (Cloud Shell does not support `docker run`).

```bash
docker run -d -p 8081:80 --name updatedapp --rm $ACR_NAME.azurecr.io/helloworld:<run-id>
```

Navigate to http://localhost:8081 in your browser, and you should see the updated Node.js version number (with the "a") in the web page:

:::image type="content" source="media/container-registry-tutorial-base-image-update/base-update-02.png" alt-text="Screenshot of updated sample application in browser":::

What's important to note is that you updated your **base** image with a new version number, but the last-built **application** image displays the new version. ACR Tasks picked up your change to the base image, and rebuilt your application image automatically.

To stop and remove the container, run the following command:

```bash
docker stop updatedapp
```

## Next steps

In this tutorial, you learned how to use a task to automatically trigger container image builds when the image's base image has been updated. Now, move on to the next tutorial to learn how to trigger tasks on a defined schedule.

> [!div class="nextstepaction"]
> [Run a task on a schedule](container-registry-tasks-scheduled.md)

<!-- LINKS - External -->
[base-alpine]: https://hub.docker.com/_/alpine/
[base-dotnet]: https://hub.docker.com/r/microsoft/dotnet/
[base-node]: https://hub.docker.com/_/node/
[base-windows]: https://hub.docker.com/r/microsoft/nanoserver/
[code-sample]: https://github.com/Azure-Samples/acr-build-helloworld-node
[dockerfile-app]: https://github.com/Azure-Samples/acr-build-helloworld-node/blob/master/Dockerfile-app
[dockerfile-base]: https://github.com/Azure-Samples/acr-build-helloworld-node/blob/master/Dockerfile-base

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-acr-build]: /cli/azure/acr#az_acr_build
[az-acr-task-create]: /cli/azure/acr/task#az_acr_task_create
[az-acr-task-update]: /cli/azure/acr/task#az_acr_task_update
[az-acr-task-run]: /cli/azure/acr/task#az_acr_task_run
[az-acr-task-show]: /cli/azure/acr/task#az_acr_task_show
[az-acr-task-credential-add]: /cli/azure/acr/task/credential#az_acr_task_credential_add
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-acr-task-list-runs]: /cli/azure/acr/task#az_acr_task_list_runs
[az-acr-task]: /cli/azure/acr#az_acr_task
[az-acr-show]: /cli/azure/acr#az_acr_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
