<properties
   pageTitle="Scale your ACS cluster with the Azure CLI | Microsoft Azure"
   description="How the public and private agent pools work with an Azure Container Service cluster."
   services="container-service"
   documentationCenter=""
   authors="Thraka"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/16/2016"
   ms.author="adegeo"/>

# Scale an Azure Container Service cluster

You can scale out the amount of nodes your Azure Container Service has by using the Azure CLI tool. When you use the Azure CLI to scale, the tool will return you a new configuration file representing the change applied to the container.

## About the command

The Azure CLI must be in Azure Resource Manager (arm) mode for you to interact with Azure Containers. You can switch to arm mode by calling `azure config mode arm`. The `acs` command has a child-command named `scale` which does all the scale operations for a container. You can get help about the various parameters used in the scale command by running `azure acs scale --help` which will output something similar to this:

```azurecli
azure acs scale --help

help:    The operation to scale a container service.
help:
help:    Usage: acs scale [options] <resource-group> <name> <new-agent-count>
help:
help:    Options:
help:      -h, --help                               output usage information
help:      -v, --verbose                            use verbose output
help:      -vv                                      more verbose with debug output
help:      --json                                   use json output
help:      -g, --resource-group <resource-group>    resource-group
help:      -n, --name <name>                        name
help:      -o, --new-agent-count <new-agent-count>  New agent count
help:      -s, --subscription <subscription>        The subscription identifier
help:
help:    Current Mode: arm (Azure Resource Management)
```

## Scale a container

To scale a container, you first need to know the **resource group** and **name**, and also specify the new count of agents. By using a smaller or higher amount, you can scale down or up respectively.

You may want to know what the current agent count for a container before you scale and choose a new count. Use the `azure acs show` command to output the container config. Note the <mark>BLAH</mark> result.

```azurecli

```  

As it is probably already self evident, you can scale the conatiner by calling `azure acs scale` and supplying the **resource group**, **name**, and **agent count**. When you scale a container, Azure CLI will output a JSON string representing the new configuration of the container, including the new agent count.

```azurecli
azure acs scale myresourcegroup mycontainer 10


``` 

