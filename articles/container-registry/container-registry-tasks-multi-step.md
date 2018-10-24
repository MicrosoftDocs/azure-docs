---
title: Automate image build, test, and patch with Azure Container Registry multi-step tasks
description: An introduction multi-step tasks, a feature of ACR Tasks in Azure Container Registry that provides task-based workflows for building, testing, and patching container images in the cloud.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 09/24/2018
ms.author: danlep
---

# Run multi-step build, test, and patch tasks in ACR Tasks

Multi-step tasks extend the single image build-and-push capability of ACR Tasks with multi-step, multi-container-based workflows. Use multi-step tasks to build and push several images, in series or in parallel, and run those images as commands within a single task run. Each step defines a container image build or push operation, and can also define the execution of a container. Each step in a multi-step task uses a container as its execution environment.

> [!IMPORTANT]
> If you previously created tasks during the preview with the `az acr build-task` command, those tasks need to be re-created using the [az acr task][az-acr-task] command.

For example, you can run a task with steps that automate the following:

1. Build a web application image
1. Run the web application container
1. Build a web application test image
1. Run the web application test container which performs tests against the running application container
1. If the tests pass, build a Helm chart archive package
1. Perform a `helm upgrade` using the new Helm chart archive package

All steps are performed within Azure, offloading the work to Azure's compute resources and freeing you from infrastructure management. Besides your Azure container registry, you pay only for the resources you use. For information on pricing, see the **Container Build** section in [Azure Container Registry pricing][pricing].

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Common task scenarios

Multi-step tasks enable scenarios like the following:

* Build, tag, and push one or more container images, in series or in parallel.
* Run and capture unit test and code coverage results.
* Run and capture functional tests. ACR Tasks supports running multiple containers, executing a series of requests between them.
* Perform task-based execution, including pre/post steps of a container image build.
* Deploy one or more containers with your favorite deployment engine to your target environment.

## Multi-step task definition

A multi-step task in ACR Tasks is defined as a series of steps within a YAML file. Each step can specify dependencies on the successful completion of one or more previous steps. The following task step types are available:

* [`build`](container-registry-tasks-reference-yaml.md#build): Build one or more container images using familiar `docker build` syntax, in series or in parallel.
* [`push`](container-registry-tasks-reference-yaml.md#push): Push built images to a container registry. Private registries like Azure Container Registry are supported, as is the public Docker Hub.
* [`cmd`](container-registry-tasks-reference-yaml.md#cmd): Run a container, such that it can operate as a function within the context of the running task. You can pass parameters to the container's `[ENTRYPOINT]`, and specify properties like env, detach, and other familiar `docker run` parameters. The `cmd` step type enables unit and functional testing, with concurrent container execution.

Multi-step tasks can be as simple as building and pushing a single image:

```yaml
version: 1.0-preview-1
steps:
  - build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} .
  - push: ["{{.Run.Registry}}/hello-world:{{.Run.ID}}"]
```

Or more complex, such as this task which includes steps for build, test, helm package, and helm deploy:

```yaml
version: 1.0-preview-1
steps:
  - id: build-web
    build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} .
    when: ["-"]
  - id: build-tests
    build -t {{.Run.Registry}}/hello-world-tests ./funcTests
    when: ["-"]
  - id: push
    push: ["{{.Run.Registry}}/helloworld:{{.Run.ID}}"]
    when: ["build-web", "build-tests"]
  - id: hello-world-web
    cmd: {{.Run.Registry}}/helloworld:{{.Run.ID}}
  - id: funcTests
    cmd: {{.Run.Registry}}/helloworld:{{.Run.ID}}
    env: ["host=helloworld:80"]
  - cmd: {{.Run.Registry}}/functions/helm package --app-version {{.Run.ID}} -d ./helm ./helm/helloworld/
  - cmd: {{.Run.Registry}}/functions/helm upgrade helloworld ./helm/helloworld/ --reuse-values --set helloworld.image={{.Run.Registry}}/helloworld:{{.Run.ID}}
```

## Run a sample task

Tasks support both manual execution, called a "quick run," and automated execution on Git commit or base image update.

To run a task, you first define the task's steps in a YAML file, then execute the Azure CLI command [az acr run][az-acr-run].

Here's an example Azure CLI command that runs a task using a sample task YAML file. Its steps build and then push an image. Update `\<acrName\>` with the name of your own Azure container registry before running the command.

```azurecli
az acr run --registry <acrName> -f build-push-hello-world.yaml https://github.com/Azure-Samples/acr-tasks.git
```

When you run the task, the output should show the progress of each step defined in the YAML file. In the following output, the steps appear as `acb_step_0` and `acb_step_1`.

```console
$ az acr run --registry myregistry -f build-push-hello-world.yaml https://github.com/Azure-Samples/acr-tasks.git
Sending context to registry: myregistry...
Queued a run with ID: yd14
Waiting for an agent...
2018/09/12 20:08:44 Using acb_vol_0467fe58-f6ab-4dbd-a022-1bb487366941 as the home volume
2018/09/12 20:08:44 Creating Docker network: acb_default_network
2018/09/12 20:08:44 Successfully set up Docker network: acb_default_network
2018/09/12 20:08:44 Setting up Docker configuration...
2018/09/12 20:08:45 Successfully set up Docker configuration
2018/09/12 20:08:45 Logging in to registry: myregistry.azurecr-test.io
2018/09/12 20:08:46 Successfully logged in
2018/09/12 20:08:46 Executing step: acb_step_0
2018/09/12 20:08:46 Obtaining source code and scanning for dependencies...
2018/09/12 20:08:47 Successfully obtained source code and scanned for dependencies
Sending build context to Docker daemon  109.6kB
Step 1/1 : FROM hello-world
 ---> 4ab4c602aa5e
Successfully built 4ab4c602aa5e
Successfully tagged myregistry.azurecr-test.io/hello-world:yd14
2018/09/12 20:08:48 Executing step: acb_step_1
2018/09/12 20:08:48 Pushing image: myregistry.azurecr-test.io/hello-world:yd14, attempt 1
The push refers to repository [myregistry.azurecr-test.io/hello-world]
428c97da766c: Preparing
428c97da766c: Layer already exists
yd14: digest: sha256:1a6fd470b9ce10849be79e99529a88371dff60c60aab424c077007f6979b4812 size: 524
2018/09/12 20:08:55 Successfully pushed image: myregistry.azurecr-test.io/hello-world:yd14
2018/09/12 20:08:55 Step id: acb_step_0 marked as successful (elapsed time in seconds: 2.035049)
2018/09/12 20:08:55 Populating digests for step id: acb_step_0...
2018/09/12 20:08:57 Successfully populated digests for step id: acb_step_0
2018/09/12 20:08:57 Step id: acb_step_1 marked as successful (elapsed time in seconds: 6.832391)
The following dependencies were found:
- image:
    registry: myregistry.azurecr-test.io
    repository: hello-world
    tag: yd14
    digest: sha256:1a6fd470b9ce10849be79e99529a88371dff60c60aab424c077007f6979b4812
  runtime-dependency:
    registry: registry.hub.docker.com
    repository: library/hello-world
    tag: latest
    digest: sha256:0add3ace90ecb4adbf7777e9aacf18357296e799f81cabc9fde470971e499788
  git: {}


Run ID: yd14 was successful after 19s
```

For more information about automated builds on Git commit or base image update, see the [Automate image builds](container-registry-tutorial-build-task.md) and [Base image update builds](container-registry-tutorial-base-image-update.md) tutorial articles.

## Preview feedback

While the multi-step task feature of ACR Tasks is in preview, we invite you to provide feedback. Several feedback channels are available:

* [Issues](https://aka.ms/acr/issues) - View existing bugs and issues, and log new ones
* [UserVoice](https://aka.ms/acr/uservoice) - Vote on existing feature requests or create new requests
* [Discuss](https://aka.ms/acr/feedback) - Engage in Azure Container Registry discussion with the Stack Overflow community

## Next steps

You can find multi-step task reference and examples here:

* [Task reference](container-registry-tasks-reference-yaml.md) - Task step types, their properties, and usage.
* [Task examples][task-examples] - Example `task.yaml` files for several scenarios, simple to complex.

<!-- IMAGES -->

<!-- LINKS - External -->
[pricing]: https://azure.microsoft.com/pricing/details/container-registry/
[task-examples]: https://github.com/Azure-Samples/acr-tasks
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-acr-run]: /cli/azure/acr/run#az-acr-run
[az-acr-task]: /cli/azure/acr#az-acr-task