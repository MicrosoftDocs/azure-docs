<properties
   pageTitle="Load balance an Azure Container Service cluster | Microsoft Azure"
   description="Load balance an Azure Container Service cluster."
   services="container-service"
   documentationCenter=""
   authors="gatneil"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Containers, Micro-services, DC/OS, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/18/2016"
   ms.author="negat"/>

# Load balance an Azure Container Service cluster

In this article, we will set up a web front end which can be scaled up to deliver services behind the Azure LB.


## Prerequisites

[Deploy an instance of Azure Container Service](./container-service-deployment.md) with orchestrator type DCOS, [ensure your client can connect to your cluster](./container-service-connect.md), and [install the DC/OS CLI](./container-service-install-dcos-cli.md).


## Load Balancing

There are two load-balacing layers in a Container Service cluster: Azure LB for the public entry points (the ones end users will hit), and the underlying marathon-lb that routes inbound requests to container instances servicing requests. As we scale the containers providing the service, the marathon-lb will dynamically adapt. The Azure LB, however, needs to be manually configured. 

In theory, you could abandon the Azure LB and use only the marathon-lb, but using the Azure LB as the public facing LB provides additional features such as security that would have to be configured and managed separately if marathon-lb were the only LB. 

## Marathon LB 

The Marathon LB solution will dynamically reconfigure itself based on the containers you have deployed. It's also resilient to the loss of a container or an agent; if this occurs, Mesos will simply restart the container elsewhere and reconfigure the Marathon LB. 


To install the Marathon LB, run the following command from your client machine:

```bash
dcos package install marathon-lb 
``` 

Now that we have the marathon-lb package, we can deploy a simple web server using the following configuration:


```json
{ 
  "id": "web", 
  "container": { 
    "type": "DOCKER", 
    "docker": { 
      "image": "tutum/hello-world", 
      "network": "BRIDGE", 
      "portMappings": [ 
        { "hostPort": 0, "containerPort": 80, "servicePort": 10000 } 
      ], 
      "forcePullImage":true 
    } 
  }, 
  "instances": 3, 
  "cpus": 0.1, 
  "mem": 65, 
  "healthChecks": [{ 
      "protocol": "HTTP", 
      "path": "/", 
      "portIndex": 0, 
      "timeoutSeconds": 10, 
      "gracePeriodSeconds": 10, 
      "intervalSeconds": 2, 
      "maxConsecutiveFailures": 10 
  }], 
  "labels":{ 
    "HAPROXY_GROUP":"external",
    "HAPROXY_0_VHOST":"YOUR FQDN",
    "HAPROXY_0_MODE":"http" 
  } 
}

```

The key parts of this are: 
  * Set the value of HAProxy_0_VHOST to the FQDN of the load balancer for your agents. This is of the form `<acsName>agents.<region>.cloudapp.azure.com`. For example, if I created a Container Service cluster with name `negatacs` in region `West US`, the FQDN would be: `negatacsagents.westus.cloudapp.azure.com`. You can also find this by looking for the load balancer with "agent" in the name when looking through the resources in the resource group you created for your container service in the [Azure Portal](https://portal.azure.com).
  * Set the servicePort to a port >= 10,000. Doing so identifies the service being run in this container; marathon-lb uses this to identify services it should balance across.
  * Set the HAPROXY_GROUP label to "external".
  * Set hostPort to 0. Doing so means that marathon will arbitrarily allocate an available port.

Copy this JSON into a file called `hello-web.json` and use it to deploy a container: 

```bash
dcos marathon app add hello-web.json 
``` 

Now you should be able to hit your agent LB's FQDN, and each time you refresh you will hit one of your three web servers in a round-robin fashion.
 

## Further Reading 

Check out [this blog post](https://mesosphere.com/blog/2015/12/04/dcos-marathon-lb/) for more information about Marathon LB.
