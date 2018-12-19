---
title: Use a starting command line in Azure Container Instances
description: Override the command line in a container image when you run a container in Azure Container Instances
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 12/19/2018
ms.author: danlep
---

# Use a command line in a container instance to override the default container command line

When you create a container instance, optionally specify a command line to override the command line baked into the container image. This behavior is similar to the `--entrypoint` command-line argument to `docker run`.

Like setting [environment variables](container-instances-environment-variables.md) for container instances, specifying a starting command line is useful for batch jobs where you need to prepare each container dynamically with task-specific configuration.

## Command line guidelines

* By default, the command line specifies a *single process that starts without a shell* in the container. For example, the command line might run a Python script or executable file. 

* To execute multiple commands, begin your command line by setting a shell environment in the container operating system (for example, `bin/sh`, `/bin/bash`, or `cmd`). Follow the conventions of the shell to run multiple commands in sequence.

* Depending on the container configuration, you might need to set a full path to the command line executable or arguments.

* Set an appropriate [restart policy](container-instances-restart-policy.md) for the container instance, depending on whether the command-line specifies a long-running task or a run-once task.

* If you need information about the default entrypoint set in a container image, use the [docker image inspect](https://docs.docker.com/engine/reference/commandline/image_inspect/
) command.

## Command line syntax

The command-line syntax varies depending on the Azure API or tool used to create the instances. If you specify a shell environment, also follow the command syntax conventions of the shell.

* [az container create][az-container-create] command: Pass a string with the `--command-line` parameter. Example: `--command-line "python myscript.py arg1 arg2"`).

* [New-AzureRmContainerGroup][new-azurermcontainergroup] Azure PowerShell cmdlet: Pass a string with the `-Command` parameter. 

* Azure portal: In the **Command override** property of the container configuration, provide a comma-separated list of strings, without quotes. Example: `python, myscript.py, arg1, arg2`). 

* Resource Manager template or YAML file, or one of the Azure SDKs: Specify the command line property as an array of strings. Example: the JSON array `["python", "myscript.py", "arg1", "arg2"]` in a template. 

  If you're familiar with [Dockerfile](https://docs.docker.com/engine/reference/builder/) syntax, this format is similar to the *exec* form of the CMD instruction.

### Examples

|    |  Azure CLI   | Portal | Template | 
| ---- | ---- | --- | --- |
| Single command | `--command-line "python myscript.py arg1 arg2"` | **Command override**: `python, myscript.py, arg1, arg2` | `"command": ["python", "myscript.py", "arg1", "arg2"]` |
| Multiple commands | `--command-line "/bin/bash -c 'mkdir test; touch test/myfile; tail -f /dev/null'"` |**Command override**: `/bin/bash, -c, mkdir test; touch test/myfile; tail -f /dev/null` | `"command": ["/bin/bash", "-c", "touch test/myfile; tail -f /dev/null"]` |

## Azure CLI example

As an example, you can modify the behavior of the [microsoft/aci-wordcount][aci-wordcount] container image, which analyzes text in Shakespeare's *Hamlet* to find the most frequently occurring words. Instead of analyzing *Hamlet*, you could set a command line that points to a different text source.

To see the output of the [microsoft/aci-wordcount][aci-wordcount] container when it analyzes the default text, run it with the following [az container create][az-container-create] command. No start command line  is specified, so the default container command runs. For illustration purposes, this example sets [environment variables](container-instances-environment-variables.md) to find the top 3 five-letter words:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer1 \
    --image microsoft/aci-wordcount:latest \
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

Now set up a second example container to analyze different text  by specifying a different command line. The Python script executed by the container, *wordcount.py*, accepts a URL as an argument, and processes that page's content instead of the default.

For example, to determine the top 3 five-letter words in *Romeo and Juliet*:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer2 \
    --image microsoft/aci-wordcount:latest \
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

Task-based scenarios, such as batch processing a large dataset with several containers, can benefit from custom environment variables or command lines at runtime. For more information about running task-based containers, see [Run containerized tasks with restart policies](container-instances-restart-policy.md).

<!-- LINKS - External -->
[aci-wordcount]: https://hub.docker.com/r/microsoft/aci-wordcount/

<!-- LINKS Internal -->
[az-container-create]: /cli/azure/container#az-container-create
[az-container-logs]: /cli/azure/container#az-container-logs
[az-container-show]: /cli/azure/container#az-container-show
[new-azurermcontainergroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[portal]: https://portal.azure.com
