---
title: Override entrypoint in container instance
description: Set a command line to override the entrypoint in a container image when you deploy an Azure container instance
ms.topic: article
ms.date: 04/15/2019
---

# Set the command line in a container instance to override the default command line operation

When you create a container instance, optionally specify a command to override the default command line instruction baked into the container image. This behavior is similar to the `--entrypoint` command-line argument to `docker run`.

Like setting [environment variables](container-instances-environment-variables.md) for container instances, specifying a starting command line is useful for batch jobs where you need to prepare each container dynamically with task-specific configuration.

## Command line guidelines

* By default, the command line specifies a *single process that starts without a shell* in the container. For example, the command line might run a Python script or executable file. The process can specify additional parameters or arguments.

* To execute multiple commands, begin your command line by setting a shell environment that is supported in the container operating system. Examples:

  |Operating system  |Default shell  |
  |---------|---------|
  |Ubuntu     |   `/bin/bash`      |
  |Alpine     |   `/bin/sh`      |
  |Windows     |    `cmd`     |

  Follow the conventions of the shell to combine multiple commands to run in sequence.

* Depending on the container configuration, you might need to set a full path to the command line executable or arguments.

* Set an appropriate [restart policy](container-instances-restart-policy.md) for the container instance, depending on whether the command-line specifies a long-running task or a run-once task. For example, a restart policy of `Never` or `OnFailure` is recommended for a run-once task. 

* If you need information about the default entrypoint set in a container image, use the [docker image inspect](https://docs.docker.com/engine/reference/commandline/image_inspect/) command.

## Command line syntax

The command line syntax varies depending on the Azure API or tool used to create the instances. If you specify a shell environment, also observe the command syntax conventions of the shell.

* [az container create][az-container-create] command: Pass a string with the `--command-line` parameter. Example: `--command-line "python myscript.py arg1 arg2"`).

* [New-AzureRmContainerGroup][new-azurermcontainergroup] Azure PowerShell cmdlet: Pass a string with the `-Command` parameter. Example: `-Command "echo hello"`.

* Azure portal: In the **Command override** property of the container configuration, provide a comma-separated list of strings, without quotes. Example: `python, myscript.py, arg1, arg2`). 

* Resource Manager template or YAML file, or one of the Azure SDKs: Specify the command line property as an array of strings. Example: the JSON array `["python", "myscript.py", "arg1", "arg2"]` in a Resource Manager template. 

  If you're familiar with [Dockerfile](https://docs.docker.com/engine/reference/builder/) syntax, this format is similar to the *exec* form of the CMD instruction.

### Examples

|    |  Azure CLI   | Portal | Template | 
| ---- | ---- | --- | --- |
| **Single command** | `--command-line "python myscript.py arg1 arg2"` | **Command override**: `python, myscript.py, arg1, arg2` | `"command": ["python", "myscript.py", "arg1", "arg2"]` |
| **Multiple commands** | `--command-line "/bin/bash -c 'mkdir test; touch test/myfile; tail -f /dev/null'"` |**Command override**: `/bin/bash, -c, mkdir test; touch test/myfile; tail -f /dev/null` | `"command": ["/bin/bash", "-c", "mkdir test; touch test/myfile; tail -f /dev/null"]` |

## Azure CLI example

As an example, modify the behavior of the [microsoft/aci-wordcount][aci-wordcount] container image, which analyzes text in Shakespeare's *Hamlet* to find the most frequently occurring words. Instead of analyzing *Hamlet*, you could set a command line that points to a different text source.

To see the output of the [microsoft/aci-wordcount][aci-wordcount] container when it analyzes the default text, run it with the following [az container create][az-container-create] command. No start command line is specified, so the default container command runs. For illustration purposes, this example sets [environment variables](container-instances-environment-variables.md) to find the top 3 words that are at least five letters long:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer1 \
    --image mcr.microsoft.com/azuredocs/aci-wordcount:latest \
    --environment-variables NumWords=3 MinLength=5 \
    --restart-policy OnFailure
```

Once the container's state shows as *Terminated* (use [az container show][az-container-show] to check state), display the log with [az container logs][az-container-logs] to see the output.

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer1
```

Output:

```console
[('HAMLET', 386), ('HORATIO', 127), ('CLAUDIUS', 120)]
```

Now set up a second example container to analyze different text by specifying a different command line. The Python script executed by the container, *wordcount.py*, accepts a URL as an argument, and processes that page's content instead of the default.

For example, to determine the top 3 words that are at least five letters long in *Romeo and Juliet*:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer2 \
    --image mcr.microsoft.com/azuredocs/aci-wordcount:latest \
    --restart-policy OnFailure \
    --environment-variables NumWords=3 MinLength=5 \
    --command-line "python wordcount.py http://shakespeare.mit.edu/romeo_juliet/full.html"
```

Again, once the container is *Terminated*, view the output by showing the container's logs:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer2
```

Output:

```console
[('ROMEO', 177), ('JULIET', 134), ('CAPULET', 119)]
```

## Next steps

Task-based scenarios, such as batch processing a large dataset with several containers, can benefit from custom command lines at runtime. For more information about running task-based containers, see [Run containerized tasks with restart policies](container-instances-restart-policy.md).

<!-- LINKS - External -->
[aci-wordcount]: https://hub.docker.com/_/microsoft-azuredocs-aci-wordcount

<!-- LINKS Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[az-container-logs]: /cli/azure/container#az_container_logs
[az-container-show]: /cli/azure/container#az_container_show
[new-azurermcontainergroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[portal]: https://portal.azure.com
