<properties
   pageTitle=""
   description=""
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="nepeters"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>
   
<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="home-page"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="12/02/2015"
   ms.author="rogardle"/>
   

# Connecting to an ACS Cluster

The Mesos and Swarm clusters deployed by Azure Container Service expose REST endpoints, however these endpoints are not open to the outside world. In order to manage these endpoints an SSH tunnel must be created. Once an SSH tunnel has been established you can run commands against the cluster endpoints, and view the cluster UI through a browser on your own system. This document will walk through creating an SSH tunnel from Windows, Linux and OSX.

**NOTE** - you can create an SSH session with a cluster management system, however this is not recommended. Working directly on a management system exposes some risk for inadvertent configuration change.   

## SSH on Linux and OSX

First thing is to locate the public DNS name of load balanced cluster masters. To do this, expand the resource group such that each resource is being displayed. Locate and select the public IP address of the master. This will open up a blade container information about the public IP address, which will include the DNS name. Save this name for later use.

<insert image>

Now open a shell and run the following command where:

**PORT** is the port of the endpoint you want to expose.
**USERNAME** is the username provided when you deployed the cluster
**DNSPREFIX** is the DNS prefix you provided when you deployed the cluster
**REGION** is the region in which your resource group is located
**SSH_PORT** is either 22 (for the Jumpbox) or 2200, 2201 … 2204 for master0, master1 … master4 REST API's respectively


```
ssh -L PORT:localhost:PORT -N [USERNAME]@[DNSPREFIX]man.[REGION].cloudapp.azure.com -p SSH_PORT
```

An example of this would look similar to the following.

```
ssh -L 8080:localhost:8080 -n azureuser@acsexamplemgmt.japaneast.cloudapp.azure.com -p 2200
```

The Mesos endpoint and UI can now be accessed at http://localhost:5050 and the Marathon endpoint and UI can be accessed at http://localhost:8080.

## SSH Tunnel on Windows

Multiple options are available for creating SSH tunnels on Windows, this document will detail using Putty.

Download Putty to your Windows and open it up.

Enter a host name that is comprised of the admin user name and public DNS name, such as adminuser@PublicDNS. The connection port will be 2200.

![Putty Connection](media/putty1.png)

Select SSH and Authentication and add your private key file for authentication.

![Putty Connection](media/putty2.png)

Select Tunnels and configure the following forwarded ports:
- **Source Port:** 5050
- **Destination:** Master VM Name:5050 – the VM name can be found in Azure 

- **Source Port:** 8080
- **Destination:** Master VM Name:8080 – the VM name can be found in Azure 

![Putty Connection](media/putty3.png)

When complete, save the connection configuration and connect the putty session. When connected the port configuration can be seen in the Putty event log.

![Putty Connection](media/putty4.png)

The Mesos endpoint and UI can now be accessed at http://localhost:5050 and the Marathon endpoint and UI can be accessed at http://localhost:8080.
