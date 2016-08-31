<properties
   pageTitle="Enable Public Access to an ACS app | Microsoft Azure"
   description="How to enable public access to an Azure Container Service."
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
   ms.date="08/26/2016"
   ms.author="adegeo"/>

# Enable public access to an Azure Container Service application

Any DC/OS container in the ACS [public agent pool](container-service-mesos-marathon-ui.md#deploy-a-docker-formatted-container) is automatically exposed to the internet. By default, ports **80**, **443**, **8080** are opened, and any (public) container listening on those ports will be accessible. This article shows you how to open more ports for your applications in Azure Container Service.

## Open a port (portal) 

First, we need to open the port we want.

1. Log in to the portal.
2. Find the resource group that you deployed the Azure Container Service to.
3. Select the agent load balancer (which is named similar to **XXXX-agent-lb-XXXX**).

    ![Azure container service load balancer](media/container-service-dcos-agents/agent-load-balancer.png)

4. Click **Probes** and then **Add**.

    ![Azure container service load balancer probes](media/container-service-dcos-agents/add-probe.png)

5. Fill out the probe form, including the protocol and port. Click OK

6. Back at the properties of the agent load balancer, click **Load balancing rules** and then **Add**.

    ![Azure container service load balancer rules](media/container-service-dcos-agents/add-balancer-rule.png)

## Add a security rule (portal)

Next, we need to add a security rule that routes traffic from our opened port through the firewall.

1. Log in to the portal.
2. Find the resource group that you deployed the Azure Container Service to.
3. Select the **public** agent network security group (which is named similar to **XXXX-agent-public-nsg-XXXX**).

    ![Azure container service network security group](media/container-service-dcos-agents/agent-nsg.png)

4. Select **Inbound security rules** and then **Add**.

    ![Azure container service network security group rules](media/container-service-dcos-agents/add-firewall-rule.png)

5. Fill out the firewall rule to allow your public port.

## Next steps

Learn about the difference between [public and private DC/OS agents](container-service-dcos-agents.md).

Read more information about [managing your DC/OS containers](container-service-mesos-marathon-ui.md).