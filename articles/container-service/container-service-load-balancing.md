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

In theory, you could abandon the Arue LB and use only the marathon-lb, but using the Azure LB as the public facing LB provides additional features such as security that would have to be configured and managed separately if marathon-lb were the only LB. 


## Azure LB 

By default the Azure LB exposes ports 80, 8080 and 443. If you are using one of these three ports you can skip ahead to the next section. 

When you add or remove public endpoints, you need to manually update the Azure LB to expose the port(s) through which services are exposed in marathon-lb. That is, when you want to add a port for the public, marathon-lb will know about it, but Azure LB will not, so you’ll have to manually open that port in the azure lb and point it at the marathon lb.
 

To use the Azure LB, add a probe for port 8080 to the agents' LB: 

(*** TODO ***)
FIXME: Add the configuration 

 

## Marathon LB 

The Marathon LB solution will dynamically reconfigure itself based on the containers you have deployed. It's also resilient to the loss of a container or an agent; if this occurs, Mesos will simply restart the container elsewhere and reconfigure the Marathon LB. 


To install the Marathon LB, run the following command:

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
  * Set the value of HAProxy_0_VHOST to the FQDN of your agents. 
  * Set the servicePort to a port >= 10,000. Doing so identifies the service being run in this container; marathon-lb uses this to identify services it should balance across.
  * Set the HAPROXY_GROUP label to "external" 
  * Set hostPort to 0. Doing so means that marathon will arbitrarily allocate an available port.

Copy this JSON into a file called `hello-web.json` and use it to deploy it in a container: 

```bash
dcos marathon app add hello-web.json 
``` 

Now you should be able to hit your agents' FQDN, and each time you refresh you will hit one of your three web servers in a round-robin fashion.

 

## Additional Scenarios

You could have a scenario where, for instance, you use different domains to expose different services. For example: 

my domain.com -> Azure LB:80 -> marathon-lb:10001 -> my container:33292  
mydomain1.com -> Azure LB:80 -> marathon-lb:10002 -> mycontainer1:22321 

To achieve this, check out [Virtual Hosts](https://mesosphere.com/blog/2015/12/04/dcos-marathon-lb/), which provide a way to associated domains to specific marathon-lb paths.

Alternatively, you could expose different ports and remap them to the correct service behind marathon lb. This has the benefit that ports on the container could change at any time and won’t require any change in the Azure LB configuration. For example:

Azure lb:80 -> marathon-lb:10001 -> mycontainer:233423  
Azure lb:8080 -> marathon-lb:1002 -> mycontainer2:33432 
 

## Further Reading 

Check out [this blog post](https://mesosphere.com/blog/2015/12/04/dcos-marathon-lb/) for more information about Marathon LB.
