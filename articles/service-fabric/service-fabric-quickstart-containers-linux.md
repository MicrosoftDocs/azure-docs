---
title: Create an Azure Service Fabric container application on Linux | Microsoft Docs
description: In this quickstart, you create your first Linux container application on Azure Service Fabric.  Build a Docker image with your application, push the image to a container registry, build and deploy a Service Fabric container application.
services: service-fabric
documentationcenter: linux
author: suhuruli
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: python
ms.topic: quickstart
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/05/2017
ms.author: suhuruli
ms.custom: mvc

---

# Quickstart: deploy an Azure Service Fabric Linux container application on Azure
Azure Service Fabric is a distributed systems platform for deploying and managing scalable and reliable microservices and containers. 

This quickstart shows how to deploy Linux containers to a Service Fabric cluster. Once complete, you have a voting application consisting of a Python web front-end and a Redis back-end running in a Service Fabric cluster. 

![quickstartpic][quickstartpic]

In this quickstart, you learn how to:
> [!div class="checklist"]
> * Deploy containers to an Azure Linux Service Fabric cluster
> * Scale and failover containers in Service Fabric

## Prerequisite
1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

2. If you choose to install and use the command-line interface (CLI) locally, ensure you are running the Azure CLI version 2.0.4 or later. To find the version, run az --version. If you need to install or upgrade, see [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Get application package
To deploy containers to Service Fabric, you need a set of manifest files (the application definition), which describe the individual containers and the application.

In the cloud shell, use git to clone a copy of the application definition.

```bash
git clone https://github.com/Azure-Samples/service-fabric-containers.git

cd service-fabric-containers/Linux/container-tutorial/Voting
```
## Deploy the application to Azure

### Set up your Azure Service Fabric Cluster
To deploy the application to a cluster in Azure, create your own cluster.

Party clusters are free, limited-time Service Fabric clusters hosted on Azure. They are run by the Service Fabric team where anyone can deploy applications and learn about the platform. To get access to a Party Cluster, [follow the instructions](http://aka.ms/tryservicefabric). 

In order to perform management operations on the secure party cluster, you can use Service Fabric Explorer, CLI, or Powershell. To use Service Fabric Explorer, you will need to download the PFX file from the Party Cluster website and import the certificate into your certificate store (Windows or Mac) or into the browser itself (Ubuntu). There is no password for the self-signed certificates from the party cluster. 

To perform management operations with Powershell or CLI, you will need the PFX (Powershell) or PEM (CLI). To convert the PFX to a PEM file, please run the following command:  

```bash
openssl pkcs12 -in party-cluster-1277863181-client-cert.pfx -out party-cluster-1277863181-client-cert.pem -nodes -passin pass:
```

For information about creating your own cluster, see [Create a Service Fabric cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md).

> [!Note]
> The web front end service is configured to listen on port 80 for incoming traffic. Make sure that port is open in your cluster. If you are using the Party Cluster, this port is open.
>

### Install Service Fabric Command Line Interface and Connect to your cluster

Connect to the Service Fabric cluster in Azure using the Azure CLI. The endpoint is the management endpoint of your cluster - for example, `https://linh1x87d1d.westus.cloudapp.azure.com:19080`.

```bash
sfctl cluster select --endpoint https://linh1x87d1d.westus.cloudapp.azure.com:19080 --pem party-cluster-1277863181-client-cert.pem --no-verify
```

### Deploy the Service Fabric application 
Service Fabric container applications can be deployed using the described Service Fabric application package or Docker Compose. 

#### Deploy using Service Fabric application package
Use the install script provided to copy the Voting application definition to the cluster, register the application type, and create an instance of the application.

```bash
./install.sh
```

#### Deploy the application using Docker compose
Deploy and install the application on the Service Fabric cluster using Docker Compose with the following command.
```bash
sfctl compose create --deployment-name TestApp --file-path docker-compose.yml
```

Open a browser and navigate to Service Fabric Explorer at http://\<my-azure-service-fabric-cluster-url>:19080/Explorer - for example, `http://linh1x87d1d.westus.cloudapp.azure.com:19080/Explorer`. Expand the Applications node to see that there is now an entry for the Voting application type and the instance you created.

![Service Fabric Explorer][sfx]

Connect to the running container.  Open a web browser pointing to the URL of your cluster  - for example, `http://linh1x87d1d.westus.cloudapp.azure.com:80`. You should see the Voting application in the browser.

![quickstartpic][quickstartpic]

## Fail over a container in a cluster
Service Fabric makes sure your container instances automatically move to other nodes in the cluster, should a failure occur. You can also manually drain a node for containers and move then gracefully to other nodes in the cluster. You have multiple ways of scaling your services, in this example, we are using Service Fabric Explorer.

To fail over the front-end container, do the following steps:

1. Open Service Fabric Explorer in your cluster - for example, `http://linh1x87d1d.westus.cloudapp.azure.com:19080/Explorer`.
2. Click on the **fabric:/Voting/azurevotefront** node in the tree view and expand the partition node (represented by a GUID). Notice the node name in the treeview, which shows you the nodes that the container is currently running on - for example `_nodetype_4`
3. Expand the **Nodes** node in the tree view. Click on the ellipsis (three dots) next to the node that is running the container.
4. Choose **Restart** to restart that node and confirm the restart action. The restart causes the container to fail over to another node in the cluster.

![sfxquickstartshownodetype][sfxquickstartshownodetype]

## Scale applications and services in a cluster
Service Fabric services can easily be scaled across a cluster to accommodate for the load on the services. You scale a service by changing the number of instances running in the cluster.

To scale the web front-end service, do the following steps:

1. Open Service Fabric Explorer in your cluster - for example,`http://linh1x87d1d.westus.cloudapp.azure.com:19080`.
2. Click on the ellipsis (three dots) next to the **fabric:/Voting/azurevotefront** node in the treeview and choose **Scale Service**.

    ![containersquickstartscale][containersquickstartscale]

  You can now choose to scale the number of instances of the web front-end service.

3. Change the number to **2** and click **Scale Service**.
4. Click on the **fabric:/Voting/azurevotefront** node in the tree-view and expand the partition node (represented by a GUID).

    ![containersquickstartscaledone][containersquickstartscaledone]

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
* Check out the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-containers) on GitHub.

[sfx]: ./media/service-fabric-quickstart-containers-linux/containersquickstartappinstance.png
[quickstartpic]: ./media/service-fabric-quickstart-containers-linux/votingapp.png
[sfxquickstartshownodetype]:  ./media/service-fabric-quickstart-containers-linux/containersquickstartrestart.png
[containersquickstartscale]: ./media/service-fabric-quickstart-containers-linux/containersquickstartscale.png
[containersquickstartscaledone]: ./media/service-fabric-quickstart-containers-linux/containersquickstartscaledone.png
