<properties
   pageTitle="Azure Container Service container management through the web UI | Microsoft Azure"
   description="Deploy containers to an Azure Container Service cluster service using the Marathon web UI."
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

DC/OS provides an environment for deploying and scaling clustered workloads, while abstracting the underlying hardware. On top of DC/OS, there is a framework that manages scheduling and executing compute workloads.

While frameworks are available for many popular workloads, this document will describe how you can create and scale container deployments with Marathon. Before working through these examples, you will need a DC/OS cluster that is configured in Azure Container Service. You also need to have remote connectivity to this cluster. For more information on these items, see the following articles.

- [Deploying an Azure Container Service cluster](./container-service-deployment.md)
- [Connecting to an Azure Container Service cluster](./container-service-connect.md)

## Explore the DC/OS UI

With a Secure Shell (SSH) tunnel established, browse to http://localhost/. This will load the DC/OS web UI, and show information about the cluster such as used resources, active agents, and running services can be seen.

![](media/dcos/dcos2.png)

## Explore the Marathon UI

To see the Marathon UI, browse to http://localhost/Marathon. From this screen, you can start a new container or other application on the Azure Container Service DC/OS cluster. You can also see information about running containers and applications.  

![](media/dcos/dcos3.png)

## Deploy a Docker-formatted container

To deploy a new container using Marathon, click the **Create Application** button and enter the following information into the form. Click **Create Application** when ready.

Field           | Value
----------------|-----------
ID              | nginx
Image           | nginx
Network         | Bridged
Host Port       | 80
Protocol        | TCP

![](media/dcos/dcos4.png)

![](media/dcos/dcos5.png)

![](media/dcos/dcos6.png)

If you would like to statically map the container port to a port on the agent, this must be completed using ‘JSON Mode’. To do so, switch the New Application wizard to JSON Mode using the toggle, and then enter the following under the ‘portMappings’ section of the application definition. This example bind port 80 of the container to port 80 of the DC/OS agent. This Wizard can be switch out of JSON Mode once this change has been made.

```none
“hostPort”: 80,
```

![](media/dcos/dcos13.png)

The DC/OS cluster is deployed with set of private and public agents. To access application from the internet, they must be deployed to a public agent. To do so, select the ‘optional’ tab of the New Application wizard and enter ‘slave_public’ for the ‘Accepted Resource Roles’.

![](media/dcos/dcos14.png)

Back on the Marathon main page, you can see the deployment status for the container.

![](media/dcos/dcos7.png)

If you switch back to the DC/OS app (http://localhost/), you will now see that a task, in this case a Docker-formatted container, is running on the DC/OS cluster.

![](media/dcos/dcos8.png)

You can also see the cluster node that the task is running on.

![](media/dcos/dcos9.png)

## Scale your containers

The Marathon UI can be used to scale the instance count of a container. To do so, navigate to the Marathon page, select the container that you would like to scale, and click the **Scale** button. In the **Scale Application** dialog box, enter the number of container instances that you would like, and select **Scale Application**.

![](media/dcos/dcos10.png)

After the scale operation is complete, you will see multiple instances of the same task spread across DC/OS agents.

![](media/dcos/dcos11.png)

![](media/dcos/dcos12.png)

## Next steps

[Work with the DC/OS and Marathon API](./container-service-mesos-marathon-rest.md)
