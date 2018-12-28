---
title: Run Container Instances
titleSuffix: Text Analytics -  Azure Cognitive Services
description: 
services: cognitive-services
author: diberry
manager: cgronlun
ms.custom: seodec18
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 01/02/2019
ms.author: diberry
---

# How to use the Sentiment container on Azure Container Instances

Using portal 

## Create Text Analytics resource

### Create resource

### Get Billing endpoint URI and Billing Key

Overview page
Keys page

## Docker run command versus Container instance

## Create Container Instance

### Configure basic settings

container name: sentiment-{username}
container image type: public
container image: mcr.microsoft.com/azure-cognitive-services/sentiment
Subscription: {your subscription}
Resource group: {your resource group}
Location: West US

### Specify container requirements

OS type: Linux
Number of cores: 1
Memory (GB): 2
Networking, Public IP address: yes
DNS name label: sentiment-{username}
Port: 5000
Open additional ports: No
Port protocol: TCP
Advanced, restart policy: Always
Environment variable: "Eula":"accept"
Add Additional environment variables: Yes
Environment variable: "Billing"="{Billing Endpoint URI}"
Environment variable: "ApiKey"="{Billing Key}"

![](../media/how-tos/container-instance/setting-container-environment-variables.png)
![](../media/how-tos/container-instance/container-instance-overview.png)
![](../media/how-tos/container-instance/running-instance-container-log.png)
![](../media/how-tos/container-instance/swagger-docs-on-container.png)

