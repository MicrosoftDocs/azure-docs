<properties
   pageTitle="Public and Private Agent Pools ACS | Microsoft Azure"
   description="How the public and private agent pools work with an Azure Container Service cluster."
   services="container-service"
   documentationCenter=""
   authors="Thraka"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/16/2016"
   ms.author="adegeo"/>

# Agent Pools

Azure Container Service divides agents into multiple pools. And while each virtual machine in a pool is identical, each pool has its own subnet. Therefore, each pool can be marked as either public or private, affecting accessibility between machines in your container service.

### Private agents

Private agent nodes run through a non-routable network. This network is only accessible from the admin zone or through the public zone edge router. By default, DC/OS launches apps on private agent nodes. Consult the [DC/OS documentation](https://dcos.io/docs/1.7/administration/securing-your-cluster/) for more information about network security.

### Public agents

Public agent nodes run DC/OS apps and services through a publicly accessible network. Consult the [DC/OS documentation](https://dcos.io/docs/1.7/administration/securing-your-cluster/) for more information about network security.

## Using agent pools

By default, **Marathon** deploys any new application to the *private* agent nodes. You have to explicitly deploy the application to the *public* node. Unfortunately deploying to the public node is not as straight forward as checking a box. During the creation of a new application, go to the **Optional** tab and enter **slave_public** for the **Accepted Resource Roles**. This process is documented [here](container-service-mesos-marathon-ui.md#deploy-a-docker-formatted-container) and in the [DC\OS](https://dcos.io/docs/1.7/administration/installing/custom/create-public-agent/) documentation.

## Next steps

Read more information about [managing your DC/OS containers](container-service-mesos-marathon-ui.md).