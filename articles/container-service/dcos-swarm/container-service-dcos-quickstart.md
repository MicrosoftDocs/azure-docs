---
title: (DEPRECATED) Azure Container Service Quickstart - Deploy DC/OS Cluster
description: Azure Container Service Quickstart - Deploy DC/OS Cluster
author: iainfoulds
ms.service: container-service
ms.topic: quickstart
ms.date: 02/26/2018
ms.author: iainfou
ms.custom: mvc
---

# (DEPRECATED) Deploy a DC/OS cluster

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

DC/OS provides a distributed platform for running modern and containerized applications. With Azure Container Service, provisioning of a production ready DC/OS cluster is simple and quick. This quick start details the basic steps needed to deploy a DC/OS cluster and run basic workload.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

## Log in to Azure 

Log in to your Azure subscription with the [az login](/cli/azure/reference-index#az-login) command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create DC/OS cluster

Create a DC/OS cluster with the [az acs create](/cli/azure/acs#az-acs-create) command.

The following example creates a DC/OS cluster named *myDCOSCluster* and creates SSH keys if they do not already exist. To use a specific set of keys, use the `--ssh-key-value` option.  

```azurecli
az acs create --orchestrator-type dcos --resource-group myResourceGroup --name myDCOSCluster --generate-ssh-keys
```

In some cases, such as with a limited trial, an Azure subscription has limited access to Azure resources. If the deployment fails due to limited available cores, reduce the default agent count by adding `--agent-count 1` to the [az acs create](/cli/azure/acs#az-acs-create) command. 

After several minutes, the command completes, and returns information about the deployment.

## Connect to DC/OS cluster

Once a DC/OS cluster has been created, it can be accesses through an SSH tunnel. Run the following command to return the public IP address of the DC/OS master. This IP address is stored in a variable and used in the next step.

```azurecli
ip=$(az network public-ip list --resource-group myResourceGroup --query "[?contains(name,'dcos-master')].[ipAddress]" -o tsv)
```

To create the SSH tunnel, run the following command and follow the on-screen instructions. If port 80 is already in use, the command fails. Update the tunneled port to one not in use, such as `85:localhost:80`. 

```azurecli
sudo ssh -i ~/.ssh/id_rsa -fNL 80:localhost:80 -p 2200 azureuser@$ip
```

The SSH tunnel can be tested by browsing to `http://localhost`. If a port other that 80 has been used, adjust the location to match. 

If the SSH tunnel was successfully created, the DC/OS portal is returned.

![DCOS UI](./media/container-service-dcos-quickstart/dcos-ui.png)

## Install DC/OS CLI

The DC/OS command line interface is used to manage a DC/OS cluster from the command-line. Install the DC/OS cli using the [az acs dcos install-cli](/cli/azure/acs/dcos#az-acs-dcos-install-cli) command. If you are using Azure CloudShell, the DC/OS CLI is already installed. 

If you are running the Azure CLI on macOS or Linux, you might need to run the command with sudo.

```azurecli
az acs dcos install-cli
```

Before the CLI can be used with the cluster, it must be configured to use the SSH tunnel. To do so, run the following command, adjusting the port if needed.

```azurecli
dcos config set core.dcos_url http://localhost
```

## Run an application

The default scheduling mechanism for an ACS DC/OS cluster is Marathon. Marathon is used to start an application and manage the state of the application on the DC/OS cluster. To schedule an application through Marathon, create a file named *marathon-app.json*, and copy the following contents into it. 

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

```azurecli
dcos marathon app add marathon-app.json
```

To see the deployment status for the app, run the following command.

```azurecli
dcos marathon app list
```

When the **WAITING** column value switches from *True* to *False*, application deployment has completed.

```azurecli
ID     MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD   
/test   32   1     1/1    ---       ---      False      DOCKER   None
```

Get the public IP address of the DC/OS cluster agents.

```azurecli
az network public-ip list --resource-group myResourceGroup --query "[?contains(name,'dcos-agent')].[ipAddress]" -o tsv
```

Browsing to this address returns the default NGINX site.

![NGINX](./media/container-service-dcos-quickstart/nginx.png)

## Delete DC/OS cluster

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, DC/OS cluster, and all related resources.

```azurecli
az group delete --name myResourceGroup --no-wait
```

## Next steps

In this quick start, you’ve deployed a DC/OS cluster and have run a simple Docker container on the cluster. To learn more about Azure Container Service, continue to the ACS tutorials.

> [!div class="nextstepaction"]
> [Manage an ACS DC/OS Cluster](container-service-dcos-manage-tutorial.md)
