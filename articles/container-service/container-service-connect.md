---
title: Connect to an Azure Container Service cluster | Microsoft Docs
description: Connect to an Azure Container Service cluster by using an SSH tunnel.
services: container-service
documentationcenter: ''
author: rgardler
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, DC/OS, Azure

ms.assetid: ff8d9e32-20d2-4658-829f-590dec89603d
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/13/2016
ms.author: rogardle

---
# Connect to an Azure Container Service cluster
The DC/OS, Kubernetes and Docker Swarm clusters that are deployed Azure Container Service all expose REST endpoints.  For Kubernetes,
this endpoint is securely exposed on the internet and you can access it directly from any machine connected to the internet. For DC/OS 
and Docker Swarm you must create an SSH tunnel in order to securely connect to the REST endpoint. Each of these connections is
described below.

## Connecting to a Kubernetes cluster.
To connect to a Kubernetes cluster, you need to have the `kubectl` command line tool installed.  The easiest way to install this
tool is to use the Azure 2.0 `az` command line tool.

```console
az acs kubernetes install cli [--install-location=/some/directory]
```

Alternately, you can download the client directly from the [releases page](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#downloads-for-v146)

Once you have `kubectl` installed, you need to copy the cluster credentials to your machine.  The easiest way to do
this is again the `az` command line tool:

```console
az acs kubernetes get-credentials --dns-prefix=<some-prefix> --location=<some-location>
```

This will download the cluster credentials into `$HOME/.kube/config` where `kubectl` expects it to be located.

Alternately, you can use `scp` to securely copy the file from `$HOME/.kube/config` on the master VM to your local machine.

```console
mkdir $HOME/.kube/config
scp azureuser@<master-dns-name>:.kube/config $HOME/.kube/config
```

If you are on Windows you will need to use Bash on Ubuntu on Windows or the Putty 'pscp' tool.

Once you have `kubectl` configured, you can test this by listing the nodes in your cluster:

```console
kubectl get nodes
```

Finally, you can view the Kubernetes Dashboard. First, execute:

```console
kubectl proxy
```

The Kubernetes UI is now available at: http://localhost:8001/ui

For further instructions you can see the [Kubernetes quick start](http://kubernetes.io/docs/user-guide/quick-start/)

## Connecting to a DC/OS or Swarm cluster

The DC/OS and Docker Swarm clusters deployed by Azure Container Service provide several HTTP endpoints locally, but these are not accessible by default from the Internet. In order to use them, you must first create a Secure Shell (SSH) tunnel to an internal system. After this tunnel has been established, you can run commands which use these HTTP endpoints and view the cluster's Web interface from your local system.

This document walks you through creating an SSH tunnel from Linux, OS X, and Windows clients.

> [!NOTE]
> These instructions focus on tunnelling TCP traffic over SSH. You can also start an interactive SSH session with one of the internal cluster management systems, but we don't recommend this. Working directly on an internal system risks inadvertent configuration changes.   
> 
> 

## Create an SSH tunnel on Linux or OS X

1. Get the public DNS name of the load balancer for the master group.

  * To do this in the portal, expand the resource group so that each resource is being displayed. Locate and select the public IP address of the master. This will open up a blade that contains information about the public IP address, which includes the DNS name. Save this name for later use. <br />

  ![Public DNS name](media/pubdns.png)

  * Alternatively, use the `az acs show ...` command and look for the "Master Profile:fqdn" property.

2. Run the following command to create an SSH tunnel with one of the cluster
   masters.  

```bash
ssh -fNL LOCAL_PORT:localhost:REMOTE_PORT -p 2200 [USERNAME]@[DNSPREFIX]mgmt.[REGION].cloudapp.azure.com
```

**LOCAL_PORT** is the local TCP port to be forwarded over the tunnel.  
**REMOTE_PORT** is the TCP port on the service side of the tunnel to connect to. For Swarm, set this to 2375. For DC/OS, set this to 80.  
**USERNAME** is the user name that was provided when you deployed the cluster, by default "azureuser".  
**DNSPREFIX** is the DNS prefix that you provided when you deployed the cluster.  
**REGION** is the region in which your resource group is located.  

> Note: The SSH connection port is 2200 and not the standard port 22.
>
>

## DC/OS tunnel

To open a tunnel for DC/OS endpoints, execute a command like the following:

```bash
ssh -fNL 8888:localhost:80 azureuser@acsexamplemgmt.japaneast.cloudapp.azure.com -p 2200
```

You can now access the DC/OS endpoints from your local system through the following URLs:

* DC/OS: `http://localhost:8888/`
* Marathon: `http://localhost:8888/marathon`
* Mesos: `http://localhost:8888/mesos`

Similarly, you can reach other REST APIs for each application through this tunnel.

## Swarm tunnel

To open a tunnel to the Swarm endpoint, execute a command like the following:

```bash
ssh -fNL 2375:localhost:2375 -p 2200 azureuser@acsexamplemgmt.japaneast.cloudapp.azure.com
```

Now you can set your DOCKER_HOST environment variable as follows. You can continue to use your Docker command-line interface (CLI) as normal.

```bash
export DOCKER_HOST=:2375
```

## Create an SSH tunnel on Windows
There are multiple options for creating SSH tunnels on Windows. This document will describe how to use PuTTY to do this.

Download PuTTY to your Windows system and run the application.

Enter a host name that is comprised of the cluster admin user name and the public DNS name of the first master in the cluster. The **Host Name** will look like this: `adminuser@PublicDNS`. Enter 2200 for the **Port**.

![PuTTY configuration 1](media/putty1.png)

Select **SSH** and **Authentication**. Add your private key file for authentication.

![PuTTY configuration 2](media/putty2.png)

Select **Tunnels** and configure the following forwarded ports:

* **Source Port:** Your preference--use 80 for DC/OS or 2375 for Swarm.
* **Destination:** Use localhost:80 for DC/OS or localhost:2375 for Swarm.

The following example is configured for DC/OS, but will look similar for Docker Swarm.

> [!NOTE]
> Port 80 must not be in use when you create this tunnel.
> 
> 

![PuTTY configuration 3](media/putty3.png)

When you're finished, save the connection configuration, and connect the PuTTY session. When you connect, you can see the port configuration in the PuTTY event log.

![PuTTY event log](media/putty4.png)

When you've configured the tunnel for DC/OS, you can access the related endpoint at:

* DC/OS: `http://localhost/`
* Marathon: `http://localhost/marathon`
* Mesos: `http://localhost/mesos`

When you've configured the tunnel for Docker Swarm, you can access the Swarm cluster through the Docker CLI. You will first need to configure a Windows environment variable named `DOCKER_HOST` with a value of ` :2375`.

## Next steps
Deploy and manage containers with DC/OS or Swarm:

* [Work with Azure Container Service and DC/OS](container-service-mesos-marathon-rest.md)
* [Work with the Azure Container Service and Docker Swarm](container-service-docker-swarm.md)

