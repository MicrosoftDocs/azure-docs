---
title: Use starting command line in Azure Container Instances
description: Override the command line in a container image when you run a container in Azure Container Instances
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 12/18/2018
ms.author: danlep
---

# Use a command line in a container instance to override the default container command line

Specify a command line when you create a container instance to override the command line baked into the container image. This is similar to the `--entrypoint` command-line argument to `docker run`.

Like setting [environment variables](container-instances-environment-variables.md), specifying a starting command line is useful for batch jobs where you need to prepare each container dynamically with task-specific configuration.

For example, you can modify the behavior of the [microsoft/aci-wordcount][aci-wordcount] container image, which analyzes text in Shakespeare's *Hamlet* to find the most frequently occurring words. Instead of analyzing *Hamlet*, you could set a command line that points to a different text source.

## Command line syntax

The following are general guidelines for using command lines when creating container instances. The exact syntax varies depends on the Azure API or tool used to create the instances.

* By default, the command line specifies a single process that starts without a shell in the container. 

* If you want to execute multiple commands in the command line, you need to specify a shell environment (for example, `bin/sh`) at the beginning of your command line.

* In the Azure CLI, specify 

### Dockerfile CMD exec-form




## Azure CLI example

To see the output of the [microsoft/aci-wordcount][aci-wordcount] container when it analyzes the default text, run it with this [az container create][az-container-create] command. No start command line  is specified, so the default container command runs. For illustration purposes, this example sets [environment variables](container-instances-environment-variables.md) to find the top 3 five-letter words:

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

Now set up an example container to analyze text other than *Hamlet* by specifying a different command line. The Python script executed by the container, *wordcount.py*, accepts a URL as an argument, and will process that page's content instead of the default.

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

## Azure portal example

To set a command line when you start a container in the Azure portal, specify it in the **Configuration** page when you create the container. In the portal, specify the 

To see an example, start the [microsoft/aci-wordcount][aci-wordcount] container with a command line that runs the Python `wordcount.py` script with a non-default URL.

1. In **Configuration**, set the **Restart policy** to *On failure*
2. In **Environment variables**, enter `"NumWords":"3"` for the first variable, select **Yes** under **Add additional environment variables**, and enter `"MinLength":"5"` for the second variable.
1. in **Command override***, enter the comma-separated values `python, wordcount.py, http://shakespeare.mit.edu/romeo_juliet/full.html`.
1. Select **OK** to verify and then deploy the container.

![Portal page showing environment variable Enable button and text boxes][portal-env-vars-01]

## Azure Resource Manager template example



## Next steps

Task-based scenarios, such as batch processing a large dataset with several containers, can benefit from custom environment variables or command lines at runtime. For more information about running task-based containers, see [Run containerized tasks in Azure Container Instances](container-instances-restart-policy.md).

<!-- IMAGES -->
[portal-env-vars-01]: ./media/container-instances-environment-variables/portal-env-vars-01.png
[portal-env-vars-02]: ./media/container-instances-environment-variables/portal-env-vars-02.png

<!-- LINKS - External -->
[aci-wordcount]: https://hub.docker.com/r/microsoft/aci-wordcount/

<!-- LINKS Internal -->
[az-container-create]: /cli/azure/container#az-container-create
[az-container-exec]: /cli/azure/container#az-container-exec
[az-container-logs]: /cli/azure/container#az-container-logs
[az-container-show]: /cli/azure/container#az-container-show
[azure-cli-install]: /cli/azure/
[azure-instance-log]: /powershell/module/azurerm.containerinstance/get-azurermcontainerinstancelog
[azure-powershell-install]: /powershell/azure/install-azurerm-ps
[new-azurermcontainergroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[portal]: https://portal.azure.com
