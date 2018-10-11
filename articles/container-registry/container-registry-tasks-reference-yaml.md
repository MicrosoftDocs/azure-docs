---
title: Azure Container Registry Tasks reference - YAML
description: Reference for defining tasks in YAML for ACR Tasks, including task properties, step types, step properties, and built-in variables.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 09/24/2018
ms.author: danlep
---

# ACR Tasks reference: YAML

Multi-step task definition in ACR Tasks provides a container-centric compute primitive focused on building, testing, and patching containers. This article covers the commands, parameters, properties, and syntax for the YAML files that define your multi-step  tasks.

This article contains reference for creating multi-step task YAML files for ACR Tasks. If you'd like an introduction to ACR Tasks, see the [ACR Tasks overview](container-registry-tasks-overview.md).

> [!IMPORTANT]
> The multi-step tasks feature of ACR Tasks is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## acr-task.yaml file format

ACR Tasks supports multi-step task declaration in standard YAML syntax. You define a task's steps in a YAML file that you can then run manually, or have triggered automatically on Git commit or base image update. Although this article refers to `acr-task.yaml` as the file containing the steps, ACR Tasks supports any valid filename with a [supported extension](#supported-task-filename-extensions).

The top-level `acr-task.yaml` primitives are **task properties**, **step types**, and **step properties**:

* [Task properties](#task-properties) apply to all steps throughout task execution. There are three global task properties:
  * version
  * stepTimeout
  * totalTimeout
* [Task step types](#task-step-types) represent the types of actions that can be performed in a task. There are three step types:
  * build
  * push
  * cmd
* [Task step properties](#task-step-properties) are parameters that apply to an individual step. There are several step properties, including:
  * startDelay
  * timeout
  * when
  * ...and many more.

The base format of an `acr-task.yaml` file, including some common step properties, follows. While not an exhaustive representation of all available step properties or step type usage, it provides a quick overview of the basic file format.

```yaml
version: # acr-task.yaml format version.
stepTimeout: # Seconds each step may take.
totalTimeout: # Total seconds allowed for all steps to complete.
steps: # A collection of image or container actions.
    build: # Equivalent to "docker build," but in a multi-tenant environment
    push: # Push a newly built or retagged image to a registry.
      when: # Step property that defines either parallel or dependent step execution.
    cmd: # Executes a container, supports specifying an [ENTRYPOINT] and parameters.
      startDelay: # Step property that specifies the number of seconds to wait before starting execution.
```

### Supported task filename extensions

ACR Tasks has reserved several filename extensions, including `.yaml`, that it will process as a task file. Any extension *not* in the following list is considered by ACR Tasks to be a Dockerfile: .yaml, .yml, .toml, .json, .sh, .bash, .zsh, .ps1, .ps, .cmd, .bat, .ts, .js, .php, .py, .rb, .lua

YAML is the only file format currently supported by ACR Tasks. The other filename extensions are reserved for possible future support.

## Run the sample tasks

There are several sample task files referenced in the following sections of this article. The sample tasks are in a public GitHub repository, [Azure-Samples/acr-tasks][acr-tasks]. You can run them with the Azure CLI command [az acr run][az-acr-run]. The sample commands are similar to:

```azurecli
az acr run -f build-push-hello-world.yaml https://github.com/Azure-Samples/acr-tasks.git
```

The formatting of the sample commands assumes you've configured a default registry in the Azure CLI, so they omit the `--registry` parameter. To configure a default registry, use the [az configure][az-configure] command with the `--defaults` parameter, which accepts an `acr=REGISTRY_NAME` value.

For example, to configure the Azure CLI with a default registry named "myregistry":

```azurecli
az configure --defaults acr=myregistry
```

## Task properties

Task properties typically appear at the top of an `acr-task.yaml` file, and are global properties that apply throughout the full execution of the task. Some of these global properties can be overridden within an individual step.

| Property | Type | Optional | Description | Override supported | Default value |
| -------- | ---- | -------- | ----------- | ------------------ | ------------- |
| `version` | string | No | The version of the `acr-task.yaml` file as parsed by the ACR Tasks service. While ACR Tasks strives to maintain backward compatibility, this value allows ACR Tasks to maintain compatibility within a defined version. | No | None |
| `stepTimeout` | int (seconds) | Yes | The maximum number of seconds a step can run. This property can be overridden in a step by setting the step's [timeout](#timeout) property. | Yes | 600 (10 minutes) |
| `totalTimeout` | int (seconds) | Yes | The maximum number of seconds that a task may run. A "run" includes the execution and completion of all steps in the task, whether successful or failed. Also included is printing task output like detected image dependencies and task execution status. | No | 3600 (1 hour) |

## Task step types

ACR Tasks supports three step types. Each step type supports several properties, detailed in the section for each step type.

| Step type | Description |
| --------- | ----------- |
| [`build`](#build) | Builds a container image using familiar `docker build` syntax. |
| [`push`](#push) | Executes a `docker push` of newly built or retagged images to a container registry. Azure Container Registry, other private registries, and the public Docker Hub are supported.
| [`cmd`](#cmd) | Runs a container as a command, with parameters passed to the container's `[ENTRYPOINT]`. The `cmd` step type supports parameters like env, detach, and other familiar `docker run` command options, enabling unit and functional testing with concurrent container execution. |

## build

Build a container image. The `build` step type represents a multi-tenant, secure means of running `docker build` in the cloud as a first-class primitive.

### Syntax: build

```yaml
version: 1.0-preview-1
steps:
    - [build]: -t [imageName]:[tag] -f [Dockerfile] [context]
      [property]: [value]
```

The `build` step type supports the following parameters:

| Parameter | Description | Optional |
| --------- | ----------- | :-------: |
| `-t` &#124; `--image` | Defines the fully qualified `image:tag` of the built image.<br /><br />As images may be used for inner task validations, such as functional tests, not all images require `push` to a registry. However, to instance an image within a Task execution, the image does need a name to reference.<br /><br />Unlike `az acr build`, running ACR Tasks does not provide default push behavior. With ACR Tasks, the default scenario assumes the ability to build, validate, then push an image. See [push](#push) for how to optionally push built images. | Yes |
| `-f` &#124; `--file` | Specifies the Dockerfile passed to `docker build`. If not specified, the default Dockerfile in the root of the context is assumed. To specify an alternative Dockerfile, pass the filename relative to the root of the context. | Yes |
| `context` | The root directory passed to `docker build`. The root directory of each task is set to a shared [workingDirectory](#task-step-properties), and includes the root of the associated Git cloned directory. | No |

### Properties: build

The `build` step type supports the following properties You can find details of these properties in the [Task step properties](#task-step-properties) section of this article.

| | | |
| -------- | ---- | -------- |
| `detach` | bool | Optional |
| `entryPoint` | string | Optional |
| `env` | [string, string, ...] | Optional |
| `id` | string | Optional |
| `ignoreErrors` | bool | Optional |
| `keep` | bool | Optional |
| `startDelay` | int (seconds) | Optional |
| `timeout` | int (seconds) | Optional |
| `when` | [string, string, ...] | Optional |
| `workingDirectory` | string | Optional |

### Examples: build

#### Build image - context in root

```azurecli
az acr run -f build-hello-world.yaml https://github.com/AzureCR/acr-tasks-sample.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/build-hello-world.yaml -->
[!code-yml[task](~/acr-tasks/build-hello-world.yaml)]

#### Build image - context in subdirectory

```yaml
version: 1.0-preview-1
steps:
- build: -t {{.Run.Registry}}/hello-world -f hello-world.dockerfile ./subDirectory
```

## push

Push one or more built or retagged images to a container registry. Supports pushing to private registries like Azure Container Registry, or to the public Docker Hub.

### Syntax: push

The `push` step type supports a collection of images. YAML collection syntax supports inline and nested formats. Pushing a single image is typically represented using inline syntax:

```yaml
version: 1.0-preview-1
steps:
  # Inline YAML collection syntax
  - push: ["{{.Run.Registry}}/hello-world:{{.Run.ID}}"]
```

For increased readability, use nested syntax when pushing multiple images:

```yaml
version: 1.0-preview-1
steps:
  # Nested YAML collection syntax
  - push:
    - {{.Run.Registry}}/hello-world:{{.Run.ID}}
    - {{.Run.Registry}}/hello-world:latest
```

### Properties: push

The `push` step type supports the following properties. You can find details of these properties in the [Task step properties](#task-step-properties) section of this article.

| | | |
| -------- | ---- | -------- |
| `env` | [string, string, ...] | Optional |
| `id` | string | Optional |
| `ignoreErrors` | bool | Optional |
| `startDelay` | int (seconds) | Optional |
| `timeout` | int (seconds) | Optional |
| `when` | [string, string, ...] | Optional |

### Examples: push

#### Push multiple images

```azurecli
az acr run -f build-push-hello-world.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/build-push-hello-world.yaml -->
[!code-yml[task](~/acr-tasks/build-push-hello-world.yaml)]

#### Build, push, and run

```azurecli
az acr run -f build-run-hello-world.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/build-run-hello-world.yaml -->
[!code-yml[task](~/acr-tasks/build-run-hello-world.yaml)]

## cmd

The `cmd` step type runs a container.

### Syntax: cmd

```yaml
version: 1.0-preview-1
steps:
    - [cmd]: [containerImage]:[tag (optional)] [cmdParameters to the image]
```

### Properties: cmd

The `cmd` step type supports the following properties:

| | | |
| -------- | ---- | -------- |
| `detach` | bool | Optional |
| `entryPoint` | string | Optional |
| `env` | [string, string, ...] | Optional |
| `id` | string | Optional |
| `ignoreErrors` | bool | Optional |
| `keep` | bool | Optional |
| `startDelay` | int (seconds) | Optional |
| `timeout` | int (seconds) | Optional |
| `when` | [string, string, ...] | Optional |
| `workingDirectory` | string | Optional |

You can find details of these properties in the [Task step properties](#task-step-properties) section of this article.

### Examples: cmd

#### Run hello-world image

This command executes the `hello-world.yaml` task file, which references the [hello-world](https://hub.docker.com/_/hello-world/) image on Docker Hub.

```azurecli
az acr run -f hello-world.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/hello-world.yaml -->
[!code-yml[task](~/acr-tasks/hello-world.yaml)]

#### Run bash image and echo "hello world"

This command executes the `bash-echo.yaml` task file, which references the [bash](https://hub.docker.com/_/bash/) image on Docker Hub.

```azurecli
az acr run -f bash-echo.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/bash-echo.yaml -->
[!code-yml[task](~/acr-tasks/bash-echo.yaml)]

#### Run specific bash image tag

To run a specific image version, specify the tag in the `cmd`.

This command executes the `bash-echo-3.yaml` task file, which references the [bash:3.0](https://hub.docker.com/_/bash/) image on Docker Hub.

```azurecli
az acr run -f bash-echo-3.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/bash-echo-3.yaml -->
[!code-yml[task](~/acr-tasks/bash-echo-3.yaml)]

#### Run custom images

The `cmd` step type references images using the standard `docker run` format. Images not prefaced with a registry are assumed to originate from docker.io. The previous example could equally be represented as:

```yaml
version: 1.0-preview-1
steps:
    - cmd: docker.io/bash:3.0 echo hello world
```

By using the standard `docker run` image reference convention, `cmd` can run images residing in any private registry or the public Docker Hub. If you're referencing images in the same registry in which ACR Task is executing, you don't need to specify any registry credentials.

* Run an image residing in an Azure container registry

    Replace `[myregistry]` with the name of your registry:

    ```yaml
    version: 1.0-preview-1
    steps:
        - cmd: [myregistry].azurecr.io/bash:3.0 echo hello world
    ```

* Generalize the registry reference with a Run variable

    Instead of hard-coding your registry name in an `acr-task.yaml` file, you can make it more portable by using a [Run variable](#run-variables). The `Run.Registry` variable expands at runtime to the name of the registry in which the task is executing.

    To generalize the preceding task so that it works in any Azure container registry, reference the [Run.Registry](#runregistry) variable in the image name:

    ```yaml
    version: 1.0-preview-1
    steps:
        - cmd: {{.Run.Registry}}/bash:3.0 echo hello world
    ```

## Task step properties

Each step type supports several properties appropriate for its type. The following table defines all of the available step properties. Not all step types support all properties. To see which of these properties are available for each step type, see the [cmd](#cmd), [build](#build), and [push](#push) step type reference sections.

| Property | Type | Optional | Description |
| -------- | ---- | -------- | ----------- |
| `detach` | bool | Yes | Whether the container should be detached when running. |
| `entryPoint` | string | Yes | Overrides the `[ENTRYPOINT]` of a step's container. |
| `env` | [string, string, ...] | Yes | Array of strings in `key=value` format that define the environment variables for the step. |
| [`id`](#example-id) | string | Yes | Uniquely identifies the step within the task. Other steps in the task can reference a step's `id`, such as for dependency checking with `when`.<br /><br />The `id` is also the running container's name. Processes running in other containers in the task can refer to the `id` as its DNS host name, or for accessing it with docker logs [id], for example. |
| `ignoreErrors` | bool | Yes | When set to `true`, the step is marked as complete regardless of whether an error occurred during its execution. Default: `false`. |
| `keep` | bool | Yes | Whether the step's container should be kept after execution. |
| `startDelay` | int (seconds) | Yes | Number of seconds to delay a step's execution. |
| `timeout` | int (seconds) | Yes | Maximum number of seconds a step may execute before being terminated. |
| [`when`](#example-when) | [string, string, ...] | Yes | Configures a step's dependency on one or more other steps within the task. |
| `workingDirectory` | string | Yes | Sets the working directory for a step. By default, ACR Tasks creates a root directory as the working directory. However, if your build has several steps, earlier steps can share artifacts with later steps by specifying the same working directory. |

### Examples: Task step properties

#### Example: id

Build two images, instancing a functional test image. Each step is identified by a unique `id` which other steps in the task reference in their `when` property.

```azurecli
az acr run -f when-parallel-dependent.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/when-parallel-dependent.yaml -->
[!code-yml[task](~/acr-tasks/when-parallel-dependent.yaml)]

#### Example: when

The `when` property specifies a step's dependency on other steps within the task. It supports two parameter values:

* `when: ["-"]` - Indicates no dependency on other steps. A step specifying `when: ["-"]` will begin execution immediately, and enables concurrent step execution.
* `when: ["id1", "id2"]` - Indicates the step is dependent upon steps with `id` "id1" and `id` "id2". This step won't be executed until both "id1" and "id2" steps complete.

If `when` isn't specified in a step, that step is dependent on completion of the previous step in the `acr-task.yaml` file.

Sequential step execution without `when`:

```azurecli
az acr run -f when-sequential-default.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/when-sequential-default.yaml -->
[!code-yml[task](~/acr-tasks/when-sequential-default.yaml)]

Sequential step execution with `when`:

```azurecli
az acr run -f when-sequential-id.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/when-sequential-id.yaml -->
[!code-yml[task](~/acr-tasks/when-sequential-id.yaml)]

Parallel image build:

```azurecli
az acr run -f when-parallel.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/when-parallel.yaml -->
[!code-yml[task](~/acr-tasks/when-parallel.yaml)]

Parallel image build and dependent testing:

```azurecli
az acr run -f when-parallel-dependent.yaml https://github.com/Azure-Samples/acr-tasks.git
```

<!-- SOURCE: https://github.com/Azure-Samples/acr-tasks/blob/master/when-parallel-dependent.yaml -->
[!code-yml[task](~/acr-tasks/when-parallel-dependent.yaml)]

## Run variables

ACR Tasks includes a default set of variables that are available to task steps when they execute. These variables can be accessed by using the format `{{.Run.VariableName}}`, where `VariableName` is one of the following:

* `Run.ID`
* `Run.Registry`
* `Run.Date`

### Run&#46;ID

Each Run, through `az acr run`, or trigger based execution of tasks created through `az acr task create` have a unique ID. The ID represents the Run currently being executed.

Typically used for a uniquely tagging an image:

```yaml
version: 1.0-preview-1
steps:
    - build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} .
```

### Run.Registry

The fully qualified server name of the registry. Typically used to generically reference the registry where the task is being run.

```yaml
version: 1.0-preview-1
steps:
    - build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} .
```

### Run.Date

The current UTC time the run began.

## Next steps

For an overview of multi-step tasks, see the [Run multi-step build, test, and patch tasks in ACR Tasks](container-registry-tasks-multi-step.md).

For single-step builds, see the [ACR Tasks overview](container-registry-tasks-overview.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[acr-tasks]: https://github.com/Azure-Samples/acr-tasks
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[az-acr-run]: /cli/azure/acr/run#az-acr-run
[az-configure]: /cli/azure/reference-index#az-configure