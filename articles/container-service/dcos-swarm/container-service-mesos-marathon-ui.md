---
title: (DEPRECATED) Manage Azure DC/OS cluster with Marathon UI
description: Deploy containers to an Azure Container Service cluster service by using the Marathon web UI.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 04/04/2017
ms.author: iainfou
ms.custom: mvc
---

# (DEPRECATED) Manage an Azure Container Service DC/OS cluster through the Marathon web UI

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

DC/OS provides an environment for deploying and scaling clustered workloads, while abstracting the underlying hardware. On top of DC/OS, there is a framework that manages scheduling and executing compute workloads.

While frameworks are available for many popular workloads, this document describes how to get started deploying containers with Marathon. 


## Prerequisites
Before working through these examples, you need a DC/OS cluster that is configured in Azure Container Service. You also need to have remote connectivity to this cluster. For more information on these items, see the following articles:

* [Deploy an Azure Container Service cluster](container-service-deployment.md)
* [Connect to an Azure Container Service cluster](../container-service-connect.md)

> [!NOTE]
> This article assumes you are tunneling to the DC/OS cluster through your local port 80.
>

## Explore the DC/OS UI
With a Secure Shell (SSH) tunnel [established](../container-service-connect.md), browse to http:\//localhost/. This loads the DC/OS web UI and shows information about the cluster, such as used resources, active agents, and running services.

![DC/OS UI](./media/container-service-mesos-marathon-ui/dcos2.png)

## Explore the Marathon UI
To see the Marathon UI, browse to http:\//localhost/marathon. From this screen, you can start a new container or another application on the Azure Container Service DC/OS cluster. You can also see information about running containers and applications.  

![Marathon UI](./media/container-service-mesos-marathon-ui/dcos3.png)

## Deploy a Docker-formatted container
To deploy a new container by using Marathon, click **Create Application**, and enter the following information into the form tabs:

| Field | Value |
| --- | --- |
| ID |nginx |
| Memory | 32 |
| Image |nginx |
| Network |Bridged |
| Host Port |80 |
| Protocol |TCP |

![New Application UI--General](./media/container-service-mesos-marathon-ui/dcos4.png)

![New Application UI--Docker Container](./media/container-service-mesos-marathon-ui/dcos5.png)

![New Application UI--Ports and Service Discovery](./media/container-service-mesos-marathon-ui/dcos6.png)

If you want to statically map the container port to a port on the agent, you need to use JSON Mode. To do so, switch the New Application wizard to **JSON Mode** by using the toggle. Then enter the following setting under the `portMappings` section of the application definition. This example binds port 80 of the container to port 80 of the DC/OS agent. You can switch this wizard out of JSON Mode after you make this change.

```none
"hostPort": 80,
```

![New Application UI--port 80 example](./media/container-service-mesos-marathon-ui/dcos13.png)

If you want to enable health checks, set a path on the **Health Checks** tab.

![New Application UI--health checks](./media/container-service-mesos-marathon-ui/dcos_healthcheck.png)

The DC/OS cluster is deployed with set of private and public agents. For the cluster to be able to access applications from the Internet, you need to deploy the applications to a public agent. To do so, select the **Optional** tab of the New Application wizard and enter **slave_public** for the **Accepted Resource Roles**.

Then click **Create Application**.

![New Application UI--public agent setting](./media/container-service-mesos-marathon-ui/dcos14.png)

Back on the Marathon main page, you can see the deployment status for the container. Initially you see a status of **Deploying**. After a successful deployment, the status changes to **Running**.

![Marathon main page UI--container deployment status](./media/container-service-mesos-marathon-ui/dcos7.png)

When you switch back to the DC/OS web UI (http:\//localhost/), you see that a task (in this case, a Docker-formatted container) is running on the DC/OS cluster.

![DC/OS web UI--task running on the cluster](./media/container-service-mesos-marathon-ui/dcos8.png)

To see the cluster node that the task is running on, click the **Nodes** tab.

![DC/OS web UI--task cluster node](./media/container-service-mesos-marathon-ui/dcos9.png)

## Reach the container

In this example, the application is running on a public agent node. You reach the application from the internet by browsing to the agent FQDN of the cluster: `http://[DNSPREFIX]agents.[REGION].cloudapp.azure.com`, where:

* **DNSPREFIX** is the DNS prefix that you provided when you deployed the cluster.
* **REGION** is the region in which your resource group is located.

    ![Nginx from Internet](./media/container-service-mesos-marathon-ui/nginx.png)


## Next steps
* [Work with DC/OS and the Marathon API](container-service-mesos-marathon-rest.md)

* Deep dive on the Azure Container Service with Mesos

    > [!VIDEO https://channel9.msdn.com/Events/Microsoft-Azure/AzureCon-2015/ACON203/player]
    > 
