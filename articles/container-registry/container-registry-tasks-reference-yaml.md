---
title: Azure Container Registry Tasks reference - YAML
description: Reference for defining tasks in YAML for ACR Tasks, including task properties, step types, step properties, and built-in variables.
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: article
ms.date: 03/28/2019
ms.author: danlep
---

# ACR Tasks reference: YAML

Multi-step task definition in ACR Tasks provides a container-centric compute primitive focused on building, testing, and patching containers. This article covers the commands, parameters, properties, and syntax for the YAML files that define your multi-step tasks.

This article contains reference for creating multi-step task YAML files for ACR Tasks. If you'd like an introduction to ACR Tasks, see the [ACR Tasks overview](container-registry-tasks-overview.md).

## acr-task.yaml file format

ACR Tasks supports multi-step task declaration in standard YAML syntax. You define a task's steps in a YAML file. You can then run the task manually by passing the file to the [az acr run][az-acr-run] command. Or, use the file to create a task with [az acr task create][az-acr-task-create] that's triggered automatically on a Git commit or base image update. Although this article refers to `acr-task.yaml` as the file containing the steps, ACR Tasks supports any valid filename with a [supported extension](#supported-task-filename-extensions).

The top-level `acr-task.yaml` primitives are **task properties**, **step types**, and **step properties**:

* [Task properties](#task-properties) apply to all steps throughout task execution. There are several global task properties, including:
  * `version`
  * `stepTimeout`
  * `workingDirectory`
* [Task step types](#task-step-types) represent the types of actions that can be performed in a task. There are three step types:
  * `build`
  * `push`
  * `cmd`
* [Task step properties](#task-step-properties) are parameters that apply to an individual step. There are several step properties, including:
  * `startDelay`
  * `timeout`
  * `when`
  * ...and many more.

The base format of an `acr-task.yaml` file, including some common step properties, follows. While not an exhaustive representation of all available step properties or step type usage, it provides a quick overview of the basic file format.

```yml
version: # acr-task.yaml format version.
stepTimeout: # Seconds each step may take.
steps: # A collection of image or container actions.
  - build: # Equivalent to "docker build," but in a multi-tenant environment
  - push: # Push a newly built or retagged image to a registry.
    when: # Step property that defines either parallel or dependent step execution.
  - cmd: # Executes a container, supports specifying an [ENTRYPOINT] and parameters.
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

Task properties typically appear at the top of an `acr-task.yaml` file, and are global properties that apply throughout the full execution of the task steps. Some of these global properties can be overridden within an individual step.

| Property | Type | Optional | Description | Override supported | Default value |
| -------- | ---- | -------- | ----------- | ------------------ | ------------- |
| `version` | string | Yes | The version of the `acr-task.yaml` file as parsed by the ACR Tasks service. While ACR Tasks strives to maintain backward compatibility, this value allows ACR Tasks to maintain compatibility within a defined version. If unspecified, defaults to the latest version. | No | None |
| `stepTimeout` | int (seconds) | Yes | The maximum number of seconds a step can run. If the property is specified on a task, it sets the default `timeout` property of all the steps. If the `timeout` property is specified on a step, it overrides the property provided by the task. | Yes | 600 (10 minutes) |
| `workingDirectory` | string | Yes | The working directory of the container during runtime. If the property is specified on a task, it sets the default `workingDirectory` property of all the steps. If specified on a step, it overrides the property provided by the task. | Yes | `$HOME` |
| `env` | [string, string, ...] | Yes |  Array of strings in `key=value` format that define the environment variables for the task. If the property is specified on a task, it sets the default `env` property of all the steps. If specified on a step, it overrides any environment variables inherited from the task. | None |
| `secrets` | [secret, secret, ...] | Yes | Array of [secret](#secret) objects. | None |
| `networks` | [network, network, ...] | Yes | Array of [network](#network) objects. | None |

### secret

The secret object has the following properties.

| Property | Type | Optional | Description | Default value |
| -------- | ---- | -------- | ----------- | ------- |
| `id` | string | No | The identifier of the secret. | None |
| `keyvault` | string | Yes | The Azure Key Vault Secret URL. | None |
| `clientID` | string | Yes | The client ID of the user-assigned managed identity for Azure resources. | None |

### network

The network object has the following properties.

| Property | Type | Optional | Description | Default value |
| -------- | ---- | -------- | ----------- | ------- | 
| `name` | string | No | The name of the network. | None |
| `driver` | string | Yes | The driver to manage the network. | None |
| `ipv6` | bool | Yes | Whether IPv6 networking is enabled. | `false` |
| `skipCreation` | bool | Yes | Whether to skip network creation. | `false` |
| `isDefault` | bool | Yes | Whether the network is a default network provided with Azure Container Registry | `false` |

## Task step types

ACR Tasks supports three step types. Each step type supports several properties, detailed in the section for each step type.

| Step type | Description |
| --------- | ----------- |
| [`build`](#build) | Builds a container image using familiar `docker build` syntax. |
| [`push`](#push) | Executes a `docker push` of newly built or retagged images to a container registry. Azure Container Registry, other private registries, and the public Docker Hub are supported. |
| [`cmd`](#cmd) | Runs a container as a command, with parameters passed to the container's `[ENTRYPOINT]`. The `cmd` step type supports parameters like `env`, `detach`, and other familiar `docker run` command options, enabling unit and functional testing with concurrent container execution. |

## build

Build a container image. The `build` step type represents a multi-tenant, secure means of running `docker build` in the cloud as a first-class primitive.

### Syntax: build

```yml
version: v1.0.0
steps:
  - [build]: -t [imageName]:[tag] -f [Dockerfile] [context]
    [property]: [value]
```

The `build` step type supports the parameters in the following table. The `build` step type also supports all build options of the [docker build](https://docs.docker.com/engine/reference/commandline/build/) command, such as `--build-arg` to set build-time variables.

| Parameter | Description | Optional |
| --------- | ----------- | :-------: |
| `-t` &#124; `--image` | Defines the fully qualified `image:tag` of the built image.<br /><br />As images may be used for inner task validations, such as functional tests, not all images require `push` to a registry. However, to instance an image within a Task execution, the image does need a name to reference.<br /><br />Unlike `az acr build`, running ACR Tasks doesn't provide default push behavior. With ACR Tasks, the default scenario assumes the ability to build, validate, then push an image. See [push](#push) for how to optionally push built images. | Yes |
| `-f` &#124; `--file` | Specifies the Dockerfile passed to `docker build`. If not specified, the default Dockerfile in the root of the context is assumed. To specify a Dockerfile, pass the filename relative to the root of the context. | Yes |
| `context` | The root directory passed to `docker build`. The root directory of each task is set to a shared [workingDirectory](#task-step-properties), and includes the root of the associated Git cloned directory. | No |

### Properties: build

The `build` step type supports the following properties. Find details of these properties in the [Task step properties](#task-step-properties) section of this article.

| | | |
| -------- | ---- | -------- |
| `detach` | bool | Optional |
| `disableWorkingDirectoryOverride` | bool | Optional |
| `entryPoint` | string | Optional |
| `env` | [string, string, ...] | Optional |
| `expose` | [string, string, ...] | Optional |
| `id` | string | Optional |
| `ignoreErrors` | bool | Optional |
| `isolation` | string | Optional |
| `keep` | bool | Optional |
| `network` | object | Optional |
| `ports` | [string, string, ...] | Optional |
| `pull` | bool | Optional |
| `repeat` | int | Optional |
| `retries` | int | Optional |
| `retryDelay` | int (seconds) | Optional |
| `secret` | object | Optional |
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

```yml
version: v1.0.0
steps:
  - build: -t {{.Run.Registry}}/hello-world -f hello-world.dockerfile ./subDirectory
```

## push

Push one or more built or retagged images to a container registry. Supports pushing to private registries like Azure Container Registry, or to the public Docker Hub.

### Syntax: push

The `push` step type supports a collection of images. YAML collection syntax supports inline and nested formats. Pushing a single image is typically represented using inline syntax:

```yml
version: v1.0.0
steps:
  # Inline YAML collection syntax
  - push: ["{{.Run.Registry}}/hello-world:{{.Run.ID}}"]
```

For increased readability, use nested syntax when pushing multiple images:

```yml
version: v1.0.0
steps:
  # Nested YAML collection syntax
  - push:
    - {{.Run.Registry}}/hello-world:{{.Run.ID}}
    - {{.Run.Registry}}/hello-world:latest
```

### Properties: push

The `push` step type supports the following properties. Find details of these properties in the [Task step properties](#task-step-properties) section of this article.

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

```yml
version: v1.0.0
steps:
  - [cmd]: [containerImage]:[tag (optional)] [cmdParameters to the image]
```

### Properties: cmd

The `cmd` step type supports the following properties:

| | | |
| -------- | ---- | -------- |
| `detach` | bool | Optional |
| `disableWorkingDirectoryOverride` | bool | Optional |
| `entryPoint` | string | Optional |
| `env` | [string, string, ...] | Optional |
| `expose` | [string, string, ...] | Optional |
| `id` | string | Optional |
| `ignoreErrors` | bool | Optional |
| `isolation` | string | Optional |
| `keep` | bool | Optional |
| `network` | object | Optional |
| `ports` | [string, string, ...] | Optional |
| `pull` | bool | Optional |
| `repeat` | int | Optional |
| `retries` | int | Optional |
| `retryDelay` | int (seconds) | Optional |
| `secret` | object | Optional |
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

```yml
version: v1.0.0
steps:
  - cmd: docker.io/bash:3.0 echo hello world
```

By using the standard `docker run` image reference convention, `cmd` can run images from any private registry or the public Docker Hub. If you're referencing images in the same registry in which ACR Task is executing, you don't need to specify any registry credentials.

* Run an image that's from an Azure container registry

    Replace `[myregistry]` with the name of your registry:

    ```yml
    version: v1.0.0
    steps:
        - cmd: [myregistry].azurecr.io/bash:3.0 echo hello world
    ```

* Generalize the registry reference with a Run variable

    Instead of hard-coding your registry name in an `acr-task.yaml` file, you can make it more portable by using a [Run variable](#run-variables). The `Run.Registry` variable expands at runtime to the name of the registry in which the task is executing.

    To generalize the preceding task so that it works in any Azure container registry, reference the [Run.Registry](#runregistry) variable in the image name:

    ```yml
    version: v1.0.0
    steps:
      - cmd: {{.Run.Registry}}/bash:3.0 echo hello world
    ```

## Task step properties

Each step type supports several properties appropriate for its type. The following table defines all of the available step properties. Not all step types support all properties. To see which of these properties are available for each step type, see the [cmd](#cmd), [build](#build), and [push](#push) step type reference sections.

| Property | Type | Optional | Description | Default value |
| -------- | ---- | -------- | ----------- | ------- |
| `detach` | bool | Yes | Whether the container should be detached when running. | `false` |
| `disableWorkingDirectoryOverride` | bool | Yes | Whether to disable `workingDirectory` override functionality. Use this in combination with `workingDirectory` to have complete control over the container's working directory. | `false` |
| `entryPoint` | string | Yes | Overrides the `[ENTRYPOINT]` of a step's container. | None |
| `env` | [string, string, ...] | Yes | Array of strings in `key=value` format that define the environment variables for the step. | None |
| `expose` | [string, string, ...] | Yes | Array of ports that are exposed from the container. |  None |
| [`id`](#example-id) | string | Yes | Uniquely identifies the step within the task. Other steps in the task can reference a step's `id`, such as for dependency checking with `when`.<br /><br />The `id` is also the running container's name. Processes running in other containers in the task can refer to the `id` as its DNS host name, or for accessing it with docker logs [id], for example. | `acb_step_%d`, where `%d` is the 0-based index of the step top-down in the YAML file |
| `ignoreErrors` | bool | Yes | Whether to mark the step as successful regardless of whether an error occurred during container execution. | `false` |
| `isolation` | string | Yes | The isolation level of the container. | `default` |
| `keep` | bool | Yes | Whether the step's container should be kept after execution. | `false` |
| `network` | object | Yes | Identifies a network in which the container runs. | None |
| `ports` | [string, string, ...] | Yes | Array of ports that are published from the container to the host. |  None |
| `pull` | bool | Yes | Whether to force a pull of the container before executing it to prevent any caching behavior. | `false` |
| `privileged` | bool | Yes | Whether to run the container in privileged mode. | `false` |
| `repeat` | int | Yes | The number of retries to repeat the execution of a container. | 0 |
| `retries` | int | Yes | The number of retries to attempt if a container fails its execution. A retry is only attempted if a container's exit code is non-zero. | 0 |
| `retryDelay` | int (seconds) | Yes | The delay in seconds between retries of a container's execution. | 0 |
| `secret` | object | Yes | Identifies an Azure Key Vault secret or managed identity for Azure resources. | None |
| `startDelay` | int (seconds) | Yes | Number of seconds to delay a container's execution. | 0 |
| `timeout` | int (seconds) | Yes | Maximum number of seconds a step may execute before being terminated. | 600 |
| [`when`](#example-when) | [string, string, ...] | Yes | Configures a step's dependency on one or more other steps within the task. | None |
| `user` | string | Yes | The user name or UID of a container | None |
| `workingDirectory` | string | Yes | Sets the working directory for a step. By default, ACR Tasks creates a root directory as the working directory. However, if your build has several steps, earlier steps can share artifacts with later steps by specifying the same working directory. | `$HOME` |

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

Parallel images build:

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
* `Run.Commit`
* `Run.Branch`

### Run.ID

Each Run, through `az acr run`, or trigger based execution of tasks created through `az acr task create` have a unique ID. The ID represents the Run currently being executed.

Typically used for a uniquely tagging an image:

```yml
version: v1.0.0
steps:
    - build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} .
```

### Run.Registry

The fully qualified server name of the registry. Typically used to generically reference the registry where the task is being run.

```yml
version: v1.0.0
steps:
  - build: -t {{.Run.Registry}}/hello-world:{{.Run.ID}} .
```

### Run.Date

The current UTC time the run began.

### Run.Commit

For a task triggered by a commit to a GitHub repository, the commit identifier.

### Run.Branch

For a task triggered by a commit to a GitHub repository, the branch name.

## Next steps

For an overview of multi-step tasks, see the [Run multi-step build, test, and patch tasks in ACR Tasks](container-registry-tasks-multi-step.md).

For single-step builds, see the [ACR Tasks overview](container-registry-tasks-overview.md).

<!-- IMAGES -->

<!-- LINKS - External -->
[acr-tasks]: https://github.com/Azure-Samples/acr-tasks

<!-- LINKS - Internal -->
[az-acr-run]: /cli/azure/acr#az-acr-run
[az-acr-task-create]: /cli/azure/acr/task#az-acr-task-create
[az-configure]: /cli/azure/reference-index#az-configure
