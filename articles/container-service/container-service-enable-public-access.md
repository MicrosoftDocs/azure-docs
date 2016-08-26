<properties
   pageTitle="Enable Public Access to Azure Container Service| Microsoft Azure"
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

# Public access to an Azure Container Service

By default, DC/OS deploys services of a container service in a private agent pool. If you [deploy services to a public](container-service-mesos-marathon-ui.md#deploy-a-docker-formatted-container) agent pool, you must open access to it to make it publically available. For example, if you deployed the Marathon Load Balancer service to the public agent pool, it would be available on port 9090. You may want to open a different port.

## Open a port (portal) 

First, we need to open the port we want.

1. Log into the portal.
2. Find the resource group that you deployed the container service to.
3. Select the agent load balancer (which will be named similar to **XXXX-agent-lb-XXXX**).

    ![Azure container service load balancer](media/container-service-dcos-agents/agent-load-balancer.png)

4. Click **Probes** and then **Add**.

    ![Azure container service load balancer probes](media/container-service-dcos-agents/add-probe.png)

5. Fill out the probe form, including the protocol and port. Click OK

6. Back at the properties of the agent load balancer, click **Load balancing rules** and then **Add**.

    ![Azure container service load balancer rules](media/container-service-dcos-agents/add-balancer-rule.png)

## Add a security rule (portal)

Next, we need to add a security rule that routes traffic from our opened port through the firewall.

1. Log into the portal.
2. Find the resource group that you deployed the container service to.
3. Select the **public** agent network security group (which will be named similar to **XXXX-agent-public-nsg-XXXX**).

    ![Azure container service network security group](media/container-service-dcos-agents/agent-nsg.png)

4. Select **Inbound security rules** and then **Add**.

    ![Azure container service network security group rules](media/container-service-dcos-agents/add-firewall-rule.png)

5. Fill out the firewall rule to allow your public port.

## Next steps

Learn about the difference between [public and private DC/OS agents](container-service-dcos-agents.md).

Read more information about [managing your DC/OS containers](container-service-mesos-marathon-ui.md).