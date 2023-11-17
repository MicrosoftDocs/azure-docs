---
title: What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service
description: Learn how to run Oracle WebLogic Server on the Azure Kubernetes Service.
author: rezar
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 10/24/2023
ms.author: rezar
ms.reviewer: cynthn
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks
---
# What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service?

**Applies to:** :heavy_check_mark: Linux VMs 

This page describes the solutions for running Oracle WebLogic Server (WLS) on the Azure Kubernetes Service (AKS). These solutions are jointly developed and supported by Oracle and Microsoft.

It's also possible to run WebLogic Server on Azure Virtual Machines. The solutions to do so are described in [this Microsoft article](./oracle-weblogic.md).

WebLogic Server is a leading Java application server running some of the most mission-critical enterprise Java applications across the globe. WebLogic Server forms the middleware foundation for the Oracle software suite. Oracle and Microsoft are committed to empowering WebLogic Server customers with choice and flexibility to run workloads on Azure as a leading cloud platform.

## WLS on AKS certified and supported
WebLogic Server is certified by Oracle and Microsoft to run well on AKS. The WLS on AKS solutions are aimed at making it as easy as possible to run your containerized and orchestrated Java applications on Kubernetes. The solutions are focused on reliability, scalability, manageability, and enterprise support.

WLS clusters are fully enabled to run on Kubernetes via the WebLogic Kubernetes Operator (referred to simply as the 'Operator' from here onward). The Operator follows the standard Kubernetes Operator pattern. It simplifies the management and operation of WebLogic domains on Kubernetes by automating otherwise manual tasks and adding extra operational reliability features. The Operator supports Oracle WebLogic Server 12c, Oracle Fusion Middleware Infrastructure 12c and beyond. For details on the Operator, refer to the [official documentation from Oracle](https://oracle.github.io/weblogic-kubernetes-operator/).

## WLS on AKS marketplace solution template
Beyond certifying WLS on AKS, Oracle and Microsoft jointly provide a [marketplace solution template](https://portal.azure.com/#create/oracle.20210620-wls-on-aks20210620-wls-on-aks) with the goal of making it as quick and easy as possible to migrate WLS workloads to AKS. The offer does so by automating the provisioning of a number of Java and Azure resources. The automatically provisioned resources include an AKS cluster, the WebLogic Kubernetes Operator, WLS Docker images, and the Azure Container Registry (ACR). It's possible to use an existing AKS cluster or ACR instance with the offer. The offer also supports configuring load balancing with Azure App Gateway or the Azure Load Balancer, easing database connectivity, publishing metrics to Azure Monitor and mounting Azure Files as Kubernetes Persistent Volumes. The currently supported database integrations include Azure PostgreSQL, Azure MySQL, Azure SQL, and the Oracle Database on the Oracle Cloud or Azure.

:::image type="content" source="media/oracle-weblogic/wls-aks-demo.gif" alt-text="You can use the marketplace solution to deploy WebLogic Server on AKS":::

After the solution template performs most boilerplate resource provisioning and configuration, you can focus on deploying your WLS application to AKS, typically through a DevOps tool such as GitHub Actions and tools from WebLogic Kubernetes tooling such as the WebLogic Image Tool and WebLogic Deploy Tooling. You're completely free to customize the deployment further.

You can find detailed documentation on the solution template [here](https://azuremarketplace.microsoft.com/marketplace/apps/oracle.oraclelinux-wls-cluster).

## Guidance, scripts, and samples for WLS on AKS

Oracle and Microsoft also provide basic step-by-step guidance, scripts, and samples for running WebLogic Server on AKS. The guidance is suitable for customers that wish to remain as close as possible to a native Kubernetes manual deployment experience as an alternative to using a solution template. The guidance is incorporated into the Azure Kubernetes Service sample section of the [Operator documentation](https://oracle.github.io/weblogic-kubernetes-operator/samples/azure-kubernetes-service/). The guidance allows a very high degree of configuration and customization.

The guidance supports two ways of deploying WLS domains to AKS. Domains can be deployed directly to Kubernetes Persistent Volumes. This deployment option is good if you want to migrate to AKS but still want to administer WLS using the Admin Console or the WebLogic Scripting Tool (WLST). The option also allows you to move to AKS without adopting Docker development. The more Kubernetes native way of deploying WLS domains to AKS is to build custom container images based on official WLS images from the Oracle Container Registry, publish the custom images to ACR and deploy the domain to AKS using the Operator.

_These solutions are all Bring-Your-Own-License_. They assume you've already got the appropriate licenses with Oracle and are properly licensed to run offers in Azure.

_If you're interested in working closely on your migration scenarios with the engineering team developing these solutions, fill out [this short survey](https://aka.ms/wls-on-azure-survey) and include your contact information_. Program managers, architects, and engineers will reach back out to you shortly and start close collaboration.

## Deployment architectures

The solutions for running Oracle WebLogic Server on the Azure Kubernetes Service enable a wide range of production-ready deployment architectures with relative ease.

:::image type="content" source="media/oracle-weblogic/wls-aks-architecture.jpg" alt-text="Complex WebLogic Server deployments are enabled on AKS":::

Beyond what the solutions provide you have complete flexibility to customize your deployments further. It's likely on top of deploying applications you'll integrate further Azure resources with your deployments or tune the deployments to your specific applications. You're encouraged to provide feedback in the [survey](https://aka.ms/wls-on-azure-survey) on further improving the solutions.

## Next steps

Explore running Oracle WebLogic Server on the Azure Kubernetes Service.

> [!div class="nextstepaction"]
> [WLS on AKS marketplace solution](https://portal.azure.com/#create/oracle.20210620-wls-on-aks20210620-wls-on-aks)

> [!div class="nextstepaction"]
> [WLS on AKS marketplace solution documentation](https://azuremarketplace.microsoft.com/marketplace/apps/oracle.oraclelinux-wls-cluster)

> [!div class="nextstepaction"]
> [Guidance, scripts and samples for running WLS on AKS](https://oracle.github.io/weblogic-kubernetes-operator/samples/azure-kubernetes-service/)

> [!div class="nextstepaction"]
> [WebLogic Kubernetes Operator](https://oracle.github.io/weblogic-kubernetes-operator/)
