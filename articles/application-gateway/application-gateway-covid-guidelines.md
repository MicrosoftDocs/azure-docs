---
title: Application Gateway COVID-19 Update
description: This article provides an update given the current COVID-19 situation and guidelines on how to set up your Application Gateway. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 03/21/2020
ms.author: caya
---

# Application Gateway COVID-19 Update 

This article describes a few suggested guidelines for organizations in setting up their Application Gateways to handle extra traffic due to COVID-19. Organizations can use Application Gateway with Web Application Firewall (WAF) for a scalable and secure way to manage traffic to their web applications. 

The following suggestions are to help organizations to have the best set up possible for their Application Gateways with WAF. 

## Use the v2 SKUs over v1 for their autoscaling capabilities and performance benefits
The v2 SKUs offer autoscaling to ensure that your Application Gateway can scale up as traffic increases and offers other significant performance benefits such as 5x better SSL offload performance, quicker deployment and update times, zone redundancy, and more when compared to v1. Please see our [v2 documentation](https://docs.microsoft.com/azure/application-gateway/application-gateway-autoscaling-zone-redundant) for more information. 

## Set maximum instance count to the maximum possible (125) 
Assuming you have a v2 SKU Application Gateway, setting the maximum instance count to the maximum possible count of 125 allows the Application Gateway to scale out as needed and will allow it handle the possible increase in traffic to your applications. You will only be charged for the Capacity Units (CUs) you use.  

## Set your minimum instance count based on your average CU usage 
Assuming you have a v2 SKU Application Gateway, autoscaling will take 6-7 minutes to scale out, and by having a higher minimum instance count, the Application Gateway will be better able to handle your traffic when load is increased, as every spike in traffic won't require an autoscaling operation.  
