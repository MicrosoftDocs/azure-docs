---
title: Create an Azure Service Fabric container application on Linux | Microsoft Docs
description: Create your first Linux container application on Azure Service Fabric.  Build a Docker image with your application, push the image to a container registry, build and deploy a Service Fabric container application.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/05/2017
ms.author: ryanwi

---

# Deploy a Service Fabric Linux container application on Azure
Azure Service Fabric is a distributed systems platform for deploying and managing scalable and reliable microservices and containers. 

This quickstart shows how to deploy Linux containers to a Service Fabric cluster. Once complete, you have a voting application consisting of a python web front end and a Redis instance running in a Service Fabric cluster. 

![quickstartpic][quickstartpic]

In this quickstart, you learn how to:
> [!div class="checklist"]
> * Deploy Linux containers to Service Fabric
> * Scale and failover containers in Service Fabric

## Prerequisite
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/) before you begin.
  
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the command line interface (CLI) locally ensure you are running the Azure CLI version 2.0.4 or later. To find the version, run az --version. If you need to install or upgrade, see [Install Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

## Get application package
To deploy containers to Service Fabric, you need a set of manifest files (the application definition), which describe the individual containers and the application.

In the cloud shell, use git to clone a copy of the application definition.

```azurecli-interactive
git clone https://github.com/Azure-Samples/service-fabric-dotnet-containers.git

cd service-fabric-dotnet-containers/Linux/container-tutorial/Voting
```

## Deploy the containers to a Service Fabric cluster in Azure
To deploy the application to a cluster in Azure, user your own cluster, or use a Party Cluster.

Party clusters are free, limited-time Service Fabric clusters hosted on Azure. It is maintained by the Service Fabric team where anyone can deploy applications and learn about the platform. To get access to a Party Cluster, [follow the instructions](http://aka.ms/tryservicefabric). 

For information about creating your own cluster, see [Create your first Service Fabric cluster on Azure](service-fabric-get-started-azure-cluster.md).

> [!Note]
> The web front-end service is configured to listen on port 80 for incoming traffic. Make sure that port is open in your cluster. If you are using the Party Cluster, this port is open.
>

### Deploy the application manifests 
Install the Service Fabric command line (sfctl) in your CLI environment

```azurecli-interactive
pip3 install --user sfctl 
export PATH=$PATH:~/.local/bin
```

Connect to the Service Fabric cluster in Azure using the Azure CLI. The endpoint is the management endpoint of you cluster - for example,`http://linh1x87d1d.westus.cloudapp.azure.com:19080`.

```azurecli-interactive
sfctl cluster select --endpoint http://<my-azure-service-fabric-cluster-url>:<port>
```

Use the install script provided in the template to copy the application definition to the cluster, register the application type, and create an instance of the application.

```azurecli-interactive
./install.sh
```

Open a browser and navigate to Service Fabric Explorer at http://<my-azure-service-fabric-cluster-url>:19080/Explorer - for example,`http://linh1x87d1d.westus.cloudapp.azure.com:19080/Explorer`. Expand the Application's node to see that there is now an entry for your application type and the instance you created.

![Service Fabric Explorer][sfx]

Connect to the running container.  Open a web browser pointing to the URL of your cluster  - for example,`http://linh1x87d1d.westus.cloudapp.azure.com:19080`. You should see the Voting application in the browser.

![quickstartpic][quickstartpic]

## Fail over a container in a cluster
Service Fabric makes sure your container instances automatically moves to other nodes in the cluster, should a failure occur. You can also manually drain a node for containers and move then gracefully to other nodes in the cluster. You have multiple ways of scaling your services, in this example, we are using Service Fabric Explorer.

To fail over the front-end container, do the following steps:

1. Open Service Fabric Explorer in your cluster - for example,`http://<my-azure-cluster-url>:19080`.
2. Click on the **fabric:/Voting/azurevotefront** node in the tree-view and expand the partition node (represented by a GUID). Notice the node name in the treeview, which shows you the nodes that container is currently running on - for example `_nodetype_4`
3. Expand the **Nodes** node in the treeview. Click on the ellipsis (three dots) next to the node which is running the container.
4. Choose **Restart** to restart that node and confirm the restart action. The restart causes the container to fail over to another node in the cluster.

![sfx][sfxquickstartshownodetype]application

## Scale applications and services in a cluster
Service Fabric services can easily be scaled across a cluster to accommodate for the load on the services. You scale a service by changing the number of instances running in the cluster.

To scale the web front-end service, do the following steps:

1. Open Service Fabric Explorer in your cluster - for example,`http://<my-cluster-url>.cloudapp.azure.com:19080`.
2. Click on the ellipsis (three dots) next to the **fabric:/Voting/azurevotefront** node in the treeview and choose **Scale Service**.

    ![sfxscale][sfxscale]

    You can now choose to scale the number of instances of the web front-end service.

3. Change the number to **2** and click **Scale Service**.
4. Click on the **fabric:/Voting/azurevotefront** node in the tree-view and expand the partition node (represented by a GUID).

    ![sfxscaledone][sfxscaledone]

    You can now see that the service has two instances. In the tree view, you can see which nodes the instances run on.

By this simple management task, we doubled the resources available for our front-end service to process user load. It's important to understand that you do not need multiple instances of a service to have it run reliably. If a service fails, Service Fabric makes sure a new service instance runs in the cluster.

## Clean up
Use the uninstall script provided in the template to delete the application instance from the cluster and unregister the application type. This command takes some time to clean up the instance and the 'install'sh' command should not be run immediately after this script. 

```bash
./uninstall.sh
```

## Next steps
In this quickstart, you learned how to:
> [!div class="checklist"]
> * Deploy a Linux container application to Azure
> * Failover a container in a Service Fabric cluster
> * Scale a container in a Service Fabric cluster

* Learn more about running [containers on Service Fabric](service-fabric-containers-overview.md).
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
* Check out the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-dotnet-containers) on GitHub.

[sfx]: ./media/service-fabric-quickstart-containers-linux/sfxquickstart.png
[quickstartpic]: ./media/service-fabric-tutorial-deploy-run-containers/votingapp.png
[sfxquickstartshownodetype]:  ./media/service-fabric-quickstart-containers-linux/sfxquickstartshownodetype.png
[sfxscale]: ./media/service-fabric-quickstart-containers-linux/sfxquickstartscale.png
[sfxscaledone]: ./media/service-fabric-quickstart-containers-linux/sfxquickstartscaledone.png