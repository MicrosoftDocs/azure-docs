<properties
   pageTitle="Load balance an Azure Container Service cluster | Microsoft Azure"
   description="Load balance an Azure Container Service cluster."
   services="container-service"
   documentationCenter=""
   authors="rgardler"
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
   ms.author="rogardle"/>

# Load balance an Azure Container Service cluster

In this article, we will set up a web front end which can be scaled up to deliver services behind the Azure LB.


## Prerequisites

[Deploy an instance of Azure Container Service](container-service-deployment.md) with orchestrator type DCOS, [ensure your client can connect to your cluster](container-service-connect.md), and [AZURE.INCLUDE [install the DC/OS CLI](../../includes/container-service-install-dcos-cli-include.md)].


## Load balancing

There are two load-balacing layers in a Container Service cluster: Azure LB for the public entry points (the ones end users will hit), and the underlying marathon-lb that routes inbound requests to container instances servicing requests. As we scale the containers providing the service, the marathon-lb will dynamically adapt.

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
  * Set the value of HAProxy_0_VHOST to the FQDN of the load balancer for your agents. This is of the form `<acsName>agents.<region>.cloudapp.azure.com`. For example, if I created a Container Service cluster with name `myacs` in region `West US`, the FQDN would be: `myacsagents.westus.cloudapp.azure.com`. You can also find this by looking for the load balancer with "agent" in the name when looking through the resources in the resource group you created for your container service in the [Azure Portal](https://portal.azure.com).
  * Set the servicePort to a port >= 10,000. Doing so identifies the service being run in this container; marathon-lb uses this to identify services it should balance across.
  * Set the HAPROXY_GROUP label to "external".
  * Set hostPort to 0. Doing so means that marathon will arbitrarily allocate an available port.

Copy this JSON into a file called `hello-web.json` and use it to deploy a container: 

```bash
dcos marathon app add hello-web.json 
``` 

## Azure LB 

By default the Azure LB exposes ports 80, 8080 and 443. If you are using one of these three ports (as we do in the above example), then there is nothing you need to do: you should be able to hit your agent LB's FQDN, and each time you refresh you will hit one of your three web servers in a round-robin fashion. If, however, you use a different port, you need to add a round-robin rule and a probe on the Azure LB for the port you used. This can be done from the [Azure XPLAT CLI](../xplat-cli-azure-resource-manager.md) with the commands `azure lb rule create` and `azure lb probe create`.


## Additional scenarios

You could have a scenario where you use different domains to expose different services. For example: 

mydomain1.com -> Azure LB:80 -> marathon-lb:10001 -> mycontainer1:33292  
mydomain2.com -> Azure LB:80 -> marathon-lb:10002 -> mycontainer2:22321 

To achieve this, check out [Virtual Hosts](https://mesosphere.com/blog/2015/12/04/dcos-marathon-lb/), which provide a way to associate domains to specific marathon-lb paths.

Alternatively, you could expose different ports and remap them to the correct service behind marathon lb. For example:

Azure lb:80 -> marathon-lb:10001 -> mycontainer:233423  
Azure lb:8080 -> marathon-lb:1002 -> mycontainer2:33432 
 

## Next steps

Check out [this blog post](https://mesosphere.com/blog/2015/12/04/dcos-marathon-lb/) for more information about Marathon LB.
