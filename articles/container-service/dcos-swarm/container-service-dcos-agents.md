---
title: (DEPRECATED) DC/OS agent pools for Azure Container Service
description: How the public and private agent pools work with an Azure Container Service DC/OS cluster
author: iainfoulds
ms.service: container-service
ms.topic: conceptual
ms.date: 01/04/2017
ms.author: iainfou
ms.custom: mvc
---

# (DEPRECATED) DC/OS agent pools for Azure Container Service

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

DC/OS clusters in Azure Container Service contain agent nodes in two pools, a public pool and a private pool. An application can be deployed to either pool, affecting accessibility between machines in your container service. The machines can be exposed to the internet (public) or kept internal (private). This article gives a brief overview of why there are public and private pools.


* **Private agents**: Private agent nodes run through a non-routable network. This network is only accessible from the admin zone or through the public zone edge router. By default, DC/OS launches apps on private agent nodes. 

* **Public agents**: Public agent nodes run DC/OS apps and services through a publicly accessible network. 

For more information about DC/OS network security, see the [DC/OS documentation](https://docs.mesosphere.com/).

## Deploy agent pools

The DC/OS agent pools In Azure Container Service are created as follows:

* The **private pool** contains the number of agent nodes that you specify when you [deploy the DC/OS cluster](container-service-deployment.md). 

* The **public pool** initially contains a predetermined number of agent nodes. This pool is added automatically when the DC/OS cluster is provisioned.

The private pool and the public pool are Azure virtual machine scale sets. You can resize these pools after deployment.

## Use agent pools
By default, **Marathon** deploys any new application to the *private* agent nodes. You have to explicitly deploy the application to the *public* nodes during the creation of the application. Select the **Optional** tab and enter **slave_public** for the **Accepted Resource Roles** value. This process is documented [here](container-service-mesos-marathon-ui.md#deploy-a-docker-formatted-container) and in the [DC/OS](https://docs.mesosphere.com/1.7/administration/installing/oss/custom/create-public-agent/) documentation.

## Next steps
* Read more about [managing your DC/OS containers](container-service-mesos-marathon-ui.md).

* Learn how to [open the firewall](container-service-enable-public-access.md) provided by Azure to allow public access to your DC/OS containers.

