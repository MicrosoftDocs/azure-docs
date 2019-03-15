---
title: (DEPRECATED) Monitor an Azure DC/OS cluster - ELK stack
description: Monitor a DC/OS cluster in Azure Container Service cluster with ELK (Elasticsearch, Logstash, and Kibana).
services: container-service
author: sauryadas
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 03/27/2017
ms.author: saudas
ms.custom: mvc
---

# (DEPRECATED) Monitor an Azure Container Service cluster with ELK

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

In this article, we demonstrate how to deploy the ELK (Elasticsearch, Logstash, Kibana) stack on a DC/OS cluster in Azure Container Service. 

## Prerequisites
[Deploy](container-service-deployment.md) and [connect](../container-service-connect.md) a DC/OS cluster configured by 
Azure Container Service. Explore the DC/OS dashboard and Marathon services [here](container-service-mesos-marathon-ui.md). Also install the [Marathon Load Balancer](container-service-load-balancing.md).


## ELK (Elasticsearch, Logstash, Kibana)
ELK stack is a combination of Elasticsearch, Logstash, and Kibana that provides an end to end stack that can be used to monitor and analyze logs in your cluster.

## Configure the ELK stack on a DC/OS cluster
Access your DC/OS UI via [http://localhost:80/](http://localhost:80/) Once in the DC/OS UI navigate to **Universe**. Search and 
install Elasticsearch, Logstash, and Kibana from the DC/OS Universe and in that specific order. You can learn more about configuration 
if you go to the **Advanced Installation** link.

![ELK1](./media/container-service-monitoring-elk/elk1.PNG) ![ELK2](./media/container-service-monitoring-elk/elk2.PNG) ![ELK3](./media/container-service-monitoring-elk/elk3.PNG) 

Once the ELK containers and are up and running, you need to enable Kibana to be accessed through Marathon-LB. Navigate to 
**Services** > **kibana**, and click **Edit** as shown below.

![ELK4](./media/container-service-monitoring-elk/elk4.PNG)


Toggle to **JSON mode** and scroll down to the labels section.
You need to add a `"HAPROXY_GROUP": "external"` entry here as shown below.
Once you click **Deploy changes**, your container restarts.

![ELK5](./media/container-service-monitoring-elk/elk5.PNG)


If you want to verify that Kibana is registered as a service in the HAPROXY dashboard, you need to open port 9090 on the agent cluster as HAPROXY runs on port 9090.
By default, we open ports 80, 8080, and 443 in the DC/OS agent cluster.
Instructions to open a port and provide public assess are provided [here](container-service-enable-public-access.md).

To access the HAPROXY dashboard, open the Marathon-LB admin interface at:
`http://$PUBLIC_NODE_IP_ADDRESS:9090/haproxy?stats`.
Once you navigate to the URL, you should see the HAPROXY dashboard as shown below and you should see a service entry for Kibana.

![ELK6](./media/container-service-monitoring-elk/elk6.PNG)


To access the Kibana dashboard, which is deployed on port 5601, you need to open port 5601. Follow instructions [here](container-service-enable-public-access.md). Then open the Kibana dashboard at:
`http://localhost:5601`.

## Next steps

* For system and application log forwarding and setup, see [Log Management in DC/OS with ELK](https://docs.mesosphere.com/1.8/administration/logging/elk/).

* To filter logs, see [Filtering Logs with ELK](https://docs.mesosphere.com/1.8/administration/logging/filter-elk/). 

 

