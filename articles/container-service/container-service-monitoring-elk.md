
﻿---
title: Monitor an Azure Container Service cluster with ELK stack | Microsoft Docs
description: Monitor an Azure Container Service cluster with ELK (Elastisearch, logstash & Kibana).
services: container-service
documentationcenter: ''
author: saudas
manager: dan.lepow
editor: ''
tags: acs, azure-container-service
keywords: Containers, DC/OS, Azure, monitoring, elk

ms.assetid: 91d9a28a-3a52-4194-879e-30f2fa3d946b
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/08/2016
ms.author: saudas

---
# Monitor an Azure Container Service cluster with ELK
In this article, we will demonstrate how to deploy the ELK () stack on a ACS DC/OS cluster. 

## Prerequisites
[Deploy](container-service-deployment.md) and [connect](container-service-connect.md) a DC/OS cluster configured by 
Azure Container Service. Explore the DC/OS dashboard and marathon services [here](container-service-mesos-marathon-ui.md). 


## ELK (Elastisearch, Logstash, Kibana)
ELK stack is a combination of Elastisearch, Logstash and Kibana that leads to an end to end stack that can be used to monitor containers and 
and cluster and provide

## Configure the ELK stack on a DC/OS cluster
Access your DC/OS UI via [http://localhost:80/](http://localhost:80/) Once in the DC/OS UI navigate to the "Universe". Search and 
install Elastisearch, Logstash and Kibana from the DC/OS universe and in that specific order. You can learn more about configuration 
if you go to the 'Advanced Installation' link.
(./media/container-service-monitoring-elk/elk1.PNG) (./media/container-service-monitoring-elk/elk2.PNG) (./media/container-service-monitoring-elk/elk3.PNG) 

Once the ELK containers and are up and running, you need to enable kibana to be accessed through marathon-lb. Navigate to the 
services section in the left navigation bar and click on the 'Kibana' service. 
Click on the edit button as shown below.
(./media/container-service-monitoring-elk/elk4.PNG)

Turn the edit mode to 'JSON' and scroll down to the labels section
You need to add a "HAPROXY_GROUP" : "external" entry here as shown below
Once you click 'Deploy changes' , your container will restart.
(./media/container-service-monitoring-elk/elk5.PNG)

If you want to verify that kibana is registered as a service in the HAPROXY dashboard, you will need to open port 9090 on the agent cluster as 
HAPROXY runs on port 9090.
By default, we open ports 80, 8080 and 443.
Instructions to open a port and provide public assess are provided [here](container-service-enable-public-access.md)

In order to access the HAPROXY dashboard, open the Marathon-LB admin interface at:
http://$PUBLIC_NODE_IP_ADDRESS:9090/haproxy?stats
Once you navigate to the URL above, you should see the HAPROXY dashboard as shown below and you should see a service entry for Kibana
(./media/container-service-monitoring-elk/elk6.PNG)


To access the Kibana dashboard, which is deployed on port 5601, you will need to open port 5601. Follow instructions [here]((container-service-enable-public-access.md)


 

