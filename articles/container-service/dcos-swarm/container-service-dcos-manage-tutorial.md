---
title: (DEPRECATED) Azure Container Service tutorial - Manage DC/OS
description: Azure Container Service tutorial - Manage DC/OS
author: iainfoulds
ms.service: container-service
ms.topic: tutorial
ms.date: 02/26/2018
ms.author: iainfou
ms.custom: mvc
---

# (DEPRECATED) Azure Container Service tutorial - Manage DC/OS

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

DC/OS provides a distributed platform for running modern and containerized applications. With Azure Container Service, provisioning of a production ready DC/OS cluster is simple and quick. This quickstart details basic steps needed to deploy a DC/OS cluster and run basic workload.

> [!div class="checklist"]
> * Create an ACS DC/OS cluster
> * Connect to the cluster
> * Install the DC/OS CLI
> * Deploy an application to the cluster
> * Scale an application on the cluster
> * Scale the DC/OS cluster nodes
> * Basic DC/OS management
> * Delete the DC/OS cluster

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Create DC/OS cluster

First, create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *westeurope* location.

```azurecli
az group create --name myResourceGroup --location westeurope
```

Next, create a DC/OS cluster with the [az acs create](/cli/azure/acs#az-acs-create) command.

The following example creates a DC/OS cluster named *myDCOSCluster* and creates SSH keys if they do not already exist. To use a specific set of keys, use the `--ssh-key-value` option.  

```azurecli
az acs create \
  --orchestrator-type dcos \
  --resource-group myResourceGroup \
  --name myDCOSCluster \
  --generate-ssh-keys
```

After several minutes, the command completes, and returns information about the deployment.

## Connect to DC/OS cluster

Once a DC/OS cluster has been created, it can be accesses through an SSH tunnel. Run the following command to return the public IP address of the DC/OS master. This IP address is stored in a variable and used in the next step.

```azurecli
ip=$(az network public-ip list --resource-group myResourceGroup --query "[?contains(name,'dcos-master')].[ipAddress]" -o tsv)
```

To create the SSH tunnel, run the following command and follow the on-screen instructions. If port 80 is already in use, the command fails. Update the tunneled port to one not in use, such as `85:localhost:80`. 

```console
sudo ssh -i ~/.ssh/id_rsa -fNL 80:localhost:80 -p 2200 azureuser@$ip
```

## Install DC/OS CLI

Install the DC/OS cli using the [az acs dcos install-cli](/cli/azure/acs/dcos#az-acs-dcos-install-cli) command. If you are using Azure CloudShell, the DC/OS CLI is already installed. If you are running the Azure CLI on macOS or Linux, you might need to run the command with sudo.

```azurecli
az acs dcos install-cli
```

Before the CLI can be used with the cluster, it must be configured to use the SSH tunnel. To do so, run the following command, adjusting the port if needed.

```console
dcos config set core.dcos_url http://localhost
```

## Run an application

The default scheduling mechanism for an ACS DC/OS cluster is Marathon. Marathon is used to start an application and manage the state of the application on the DC/OS cluster. To schedule an application through Marathon, create a file named **marathon-app.json**, and copy the following contents into it. 

```json
{
  "id": "demo-app-private",
  "cmd": null,
  "cpus": 1,
  "mem": 32,
  "disk": 0,
  "instances": 1,
  "container": {
    "docker": {
      "image": "nginx",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp",
          "name": "80",
          "labels": null
        }
      ]
    },
    "type": "DOCKER"
  }
}
```

Run the following command to schedule the application to run on the DC/OS cluster.

```console
dcos marathon app add marathon-app.json
```

To see the deployment status for the app, run the following command.

```console
dcos marathon app list
```

When the **TASKS** column value switches from *0/1* to *1/1*, application deployment has completed.

```output
ID     MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD   
/test   32   1     0/1    ---       ---      False      DOCKER   None
```

## Scale Marathon application

In the previous example, a single instance application was created. To update this deployment so that three instances of the application are available, open up the **marathon-app.json** file, and update the instance property to 3.

```json
{
  "id": "demo-app-private",
  "cmd": null,
  "cpus": 1,
  "mem": 32,
  "disk": 0,
  "instances": 3,
  "container": {
    "docker": {
      "image": "nginx",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp",
          "name": "80",
          "labels": null
        }
      ]
    },
    "type": "DOCKER"
  }
}
```

Update the application using the `dcos marathon app update` command.

```console
dcos marathon app update demo-app-private < marathon-app.json
```

To see the deployment status for the app, run the following command.

```console
dcos marathon app list
```

When the **TASKS** column value switches from *1/3* to *3/1*, application deployment has completed.

```output
ID     MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD   
/test   32   1     1/3    ---       ---      False      DOCKER   None
```

## Run internet accessible app

The ACS DC/OS cluster consists of two node sets, one public which is accessible on the internet, and one private which is not accessible on the internet. The default set is the private nodes, which was used in the last example.

To make an application accessible on the internet, deploy them to the public node set. To do so, give the `acceptedResourceRoles` object a value of `slave_public`.

Create a file named **nginx-public.json** and copy the following contents into it.

```json
{
  "id": "demo-app",
  "cmd": null,
  "cpus": 1,
  "mem": 32,
  "disk": 0,
  "instances": 1,
  "container": {
    "docker": {
      "image": "nginx",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp",
          "name": "80",
          "labels": null
        }
      ]
    },
    "type": "DOCKER"
  },
  "acceptedResourceRoles": [
    "slave_public"
  ]
}
```

Run the following command to schedule the application to run on the DC/OS cluster.

```console
dcos marathon app add nginx-public.json
```

Get the public IP address of the DC/OS public cluster agents.

```azurecli
az network public-ip list --resource-group myResourceGroup --query "[?contains(name,'dcos-agent')].[ipAddress]" -o tsv
```

Browsing to this address returns the default NGINX site.

![NGINX](./media/container-service-dcos-manage-tutorial/nginx.png)

## Scale DC/OS cluster

In the previous examples, an application was scaled to multiple instance. The DC/OS infrastructure can also be scaled to provide more or less compute capacity. This is done with the [az acs scale](/cli/azure/acs#az-acs-scale) command. 

To see the current count of DC/OS agents, use the [az acs show](/cli/azure/acs#az-acs-show) command.

```azurecli
az acs show --resource-group myResourceGroup --name myDCOSCluster --query "agentPoolProfiles[0].count"
```

To increase the count to 5, use the [az acs scale](/cli/azure/acs#az-acs-scale) command. 

```azurecli
az acs scale --resource-group myResourceGroup --name myDCOSCluster --new-agent-count 5
```

## Delete DC/OS cluster

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, DC/OS cluster, and all related resources.

```azurecli
az group delete --name myResourceGroup --no-wait
```

## Next steps

In this tutorial, you have learned about basic DC/OS management task including the following. 

> [!div class="checklist"]
> * Create an ACS DC/OS cluster
> * Connect to the cluster
> * Install the DC/OS CLI
> * Deploy an application to the cluster
> * Scale an application on the cluster
> * Scale the DC/OS cluster nodes
> * Delete the DC/OS cluster

Advance to the next tutorial to learn about load balancing application in DC/OS on Azure. 

> [!div class="nextstepaction"]
> [Load balance applications](container-service-load-balancing.md)
