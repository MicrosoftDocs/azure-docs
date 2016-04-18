<properties
   pageTitle="ACS container management through the web UI"
   description="Deploy containers to an Azure Container Service cluster service using the Marathon Web UI."
   services="container-service"
   documentationCenter=""
   authors="neilpeterson"
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
   ms.author="nepeters"/>
   
# Container management through the web UI
   
Mesos provides an environment for deploying and scaling clustered workload while abstracting the underlying hardware. On top of Mesos, a framework manages scheduling and executing compute workload. While frameworks are available for many popular workloads, this document will detail creating and scaling container deployments with Marathon. Before working through these examples, you will need a Mesos cluster configured in ACS and have remote connectivity to this cluster. For more information in these items see the following articles.

- [Deploying an Azure Container Service Cluster](./container-service-deployment.md) 
- [Connecting to an ACS Cluster](./container-service-connect.md)

## Explore the Mesos UI

With an SSH Tunnel established, browse to http://localhost/Mesos. This will load the Mesos web UI. From the page you can gather information about the Mesos cluster such as activated agents, task status, and resource availability.

![Create deployment](media/ui1.png)

## Explore the Marathon UI

To see the Marathon UI, browse to http://localhost/Marathon. From this screen you can start new container or other application on the ACS Mesos cluster, as well see information about running containers and application.  

![Create deployment](media/ui2.png)

## Deploy a Docker Formated Container

To use Marathon to start a new container on the Mesos cluster, click the `Create Application` button. The New Application form is used to define the application or container parameters. For this example, a simple Nginx container will be deployed. Enter the following information.
 Click  create` when completed. 
 
Field           | Value
----------------|-----------
ID              | nginx
Image           | nginx
Network         | Bridged
Container Port  | 80
Host Port       | 80
Protocol        | TCP

![Create deployment](media/ui3.png)

Back on the Marathon main page, deployment status for the container can be seen.

![Create deployment](media/ui4.png)

If you switch back to the Mesos app (http://localhost/Mesos), you will now see that a task, in this case a Docker formatted container, is running on the Mesos cluster. You can also see the cluster node that the task is running on.

![Create deployment](media/ui5.png)

## Scale Your Containers

The Marathon Web UI can also be used to scale the instance count of a container. To do so navigate to the Marathon page, select the container that you would like to scale, and click the `scale` button. On the Scale Application window, enter the number of container instance that you would like and select `Scale Application`.

![Create deployment](media/ui6.png)

Once the scale operation has completed, you will see multiple instance of the same task spread across Mesos agents.

![Create deployment](media/ui8.png)
