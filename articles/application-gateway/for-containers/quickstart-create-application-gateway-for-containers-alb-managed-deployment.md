---

title: 'Quickstart: Create Application Gateway for Containers - ALB managed deployment'
titlesuffix: Azure Application Load Balancer
description: In this quickstart, you learn how to provision Application Gateway for Containers in a managed by ALB controller configuration.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: quickstart
ms.date: 7/7/2023
ms.author: greglin
---

# Quickstart: Create an Application Gateway for Containers - ALB Managed deployment

This document provides instructions on how to deploy the 3 types of resources (Application Gateway for Containers, Association, and Frontend) needed for Application Gateway for Containers to work with your AKS workload, and how to install ALB Controller on your AKS cluster to control the behavior of the Application Gateway for Containers.

This guide assumes you are following an "ALB Managed" deployment strategy, in which ALB controller deployed into your Kubernetes cluster will be responsible for the lifecycle of the Application Gateway for Containers resource and its sub resources. ALB Controller will create Application Gateway for Containers resource when an ApplicationLoadBalancer custom resource is defined on the cluster and its lifecycle will be based on the lifecycle of the custom resource.
- In Gateway API: Every time a Gateway object is created referencing the ApplicationLoadBalancer resource, ALB Controller will provision a new Frontend resource and manage its lifecycle based on the lifecycle of the Gateway object.

## Prerequisites

## Uninstall Application Gateway for Containers and ALB Controller

1. To delete the Application Gateway for Containers, you may simply delete the Resource Group containing the Application Gateway for Containers resources:

	```bash
	az group delete --resource-group $RESOURCE_GROUP
	```

2. To uninstall ALB Controller and its resources from your cluster run the following commands:

	```bash
	 helm uninstall alb-controller -n azure-alb-system
	 kubectl delete ns azure-alb-system
	 kubectl delete gatewayclass azure-alb-external
	```
