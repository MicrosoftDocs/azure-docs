<properties
   pageTitle="Connect to an Azure Container Service cluster | Microsoft Azure"
   description="Connect to an Azure Container Service cluster using an SSH Tunnel."
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>
   
<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/16/2016"
   ms.author="rogardle"/>
   

# Connect to an Azure Container Service cluster

The Mesos and Swarm clusters deployed by Azure Container Service expose REST endpoints, however these endpoints are not open to the outside world. In order to manage these endpoints, an SSH tunnel must be created. Once an SSH tunnel has been established, you can run commands against the cluster endpoints and view the cluster UI through a browser on your own system. This document will walk through creating an SSH tunnel from Linux, OSX, and Windows.

> You can create an SSH session with a cluster management system, however this is not recommended. Working directly on a management system exposes risk for inadvertent configuration change.   

## SSH Tunnel on Linux / OSX

First thing is to locate the public DNS name of load balanced masters. To do this, expand the resource group such that each resource is being displayed. Locate and select the public IP address of the master. This will open up a blade containing information about the public IP address, which will include the DNS name. Save this name for later use. <br />

![Putty Connection](media/pubdns.png)

Now open a shell and run the following command where:

**PORT** is the port of the endpoint you want to expose. For Swarm this is 2375, for Mesos use port 80.   
**USERNAME** is the username provided when you deployed the cluster.  
**DNSPREFIX** is the DNS prefix you provided when you deployed the cluster.  
**REGION** is the region in which your resource group is located.  

```
ssh -L PORT:localhost:PORT -N [USERNAME]@[DNSPREFIX]man.[REGION].cloudapp.azure.com -p 2200
```
### Mesos tunnel

To open a tunnel to the Mesos related endpoints execute a command similar to the following.

```
ssh -L 80:localhost:80 -N azureuser@acsexamplemgmt.japaneast.cloudapp.azure.com -p 2200
```

The Mesos related endpoints can now be accessed at:

- Mesos -  `http://localhost/mesos`
- Marathon - `http://localhost/marathon`
- Chronos -`http://localhost/chronos`. 

Similarly, the rest APIs for each application can be reached through this tunnel: Marathon - `http://localhost/marathon/v2`. For more information on the
various APIs available see the Mesosphere documentation for the
[Marathon
API](https://mesosphere.github.io/marathon/docs/rest-api.html) and the
[Chronos API](https://mesos.github.io/chronos/docs/api.html) and the
Apache documentation for the [Mesos Scheduler
API](http://mesos.apache.org/documentation/latest/scheduler-http-api/)

### Swarm tunnel

To open a tunnel to the Swarm endpoint execute a command that looks
similar to the following command.

```
ssh -L 2375:localhost:2375 -N azureuser@acsexamplemgmt.japaneast.cloudapp.azure.com -p 2200
```

Now you can set your DOCKER_HOST environment variable as follows and
continue to use your Docker CLI as normal.

```
export DOCKER_HOST=:2375
```

## SSH tunnel on Windows

Multiple options are available for creating SSH tunnels on Windows, this document will detail using Putty.

Download Putty to your Windows system and run the application.

Enter a host name that is comprised of the clusters admin user name and the public DNS name of the first master in the cluster. The Host Name will look like this, `adminuser@PublicDNS`. Enter 2200 for the Port.

![Putty Connection](media/putty1.png)

Select `SSH` and `Authentication`, add your private key file for authentication.

![Putty Connection](media/putty2.png)

Select `Tunnels` and `configure` the following forwarded ports:
- **Source Port:** Your preference (80 for Mesos and 2375 for Swarm)
- **Destination:** localhost:80 (for Mesos) or localhost:2375 (for Swarm)

The following example is configured for Mesos, but would look similar for Docker Swarm.

> Port 80 must not be in use when creating this tunnel.

![Putty Connection](media/putty3.png)

When complete, save the connection configuration, and connect the putty session. When connected, the port configuration can be seen in the Putty event log.

![Putty Connection](media/putty4.png)

When the tunnel has been configured for Mesos, the related endpoint can be accessed at:

- Mesos -  `http://localhost/mesos`
- Marathon - `http://localhost/marathon`
- Chronos -`http://localhost/chronos`. 

When the tunnel has been configured for Docker Swarm, the Swarm cluster can be accessed through the Docker CLI. You will first need to configure a Windows Environmental variable named `DOCKER_HOST` with a value of ` :2375`.

## Next steps
 
Deploy and manage containers with Mesos or Swarm. 
 
- [Working with ACS and Mesos](./container-service-mesos-marathon-rest.md)



