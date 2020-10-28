---
title: What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service
description: Learn how to run Oracle WebLogic Server on the Azure Kubernetes Service.
author: rezar
ms.service: container-service
ms.topic: article
ms.date: 10/28/2020
ms.author: rezar
ms.reviewer: cynthn

---
# What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service?

This page describes the solutions for running Oracle WebLogic Server (WLS) on the Azure Kubernetes Service (AKS). These solutions are jointly developed and supported by Oracle and Microsoft.

It is also possible to run WLS on Azure Virtual Machines. The solutions to do so are described in [this Microsoft article](https://docs.microsoft.com/en-us/azure/virtual-machines/workloads/oracle/oracle-weblogic). 

WLS is a leading Java application server running some of the most mission critical enterprise Java applications across the globe. WLS forms the middleware foundation for the Oracle software suite. Oracle and Microsoft are committed to empowering WLS customers with choice and flexibility to run workloads on Azure as a leading cloud platform.

WLS is certified by Oracle and Microsoft to run well on AKS. The WLS on AKS solutions are aimed at making it as easy as possible to run your containerized and orchestrated Java EE applications on Docker and Kubernetes infrastructure in a reliable, scalable, manageable and supported fashion.

WLS clusters are fully enabled to run on Kubernetes via the WebLogic Kubernetes Operator (hereafter referred to simply as the 'Operator'). The Operator follows the standard Kubernetes operator pattern. It simplifies the management and operation of WebLogic domains and deployments on Kubernetes by automating otherwise manual tasks and adding additional operational reliability features. The Operator supports Oracle WebLogic Server 12c, Oracle Fusion Middleware Infrastructure 12c and beyond. We have tested the official Docker images for WLS 12.2.1.3 and 12.2.1.4 with the Operator. For details on the Operator, please refer to the documentation at the end of this article.

In addition to certifying WLS on AKS, Oracle and Microsoft jointly provide detailed instructions, scripts and samples for running WLS on AKS. [This guidance](https://oracle.github.io/weblogic-kubernetes-operator/samples/simple/azure-kubernetes-service/) is incorporated into the Operator documentation and is aimed at making production WLS on AKS deployments as easy as possible. The guidance utilizes official WLS Docker images provided by Oracle. Failover is achieved via Azure Files accessed through Kubernetes persistent volume claims. Azure Load Balancers are supported when provisioned using a Kubernetes Service of type 'LoadBalancer'. The guidance allows a high degree of configuration and customization.

The guidance currently assumes deploying the domain outside the Docker image and using the standard Docker images from Oracle. We will add guidance for enabling custom images with your domain inside a Docker image. Further ease-of-use and Azure service integrations are possible in the future via Marketplace offerings mirroring the WLS on Azure Virtual Machines solutions.

_These solutions are Bring-Your-Own-License_. They assume you've already got the appropriate licenses with Oracle and are properly licensed to run offers in Azure.

_If you're interested in working closely on your migration scenarios with the engineering team developing these solutions, please fill out [this short survey](https://aka.ms/wls-on-azure-survey) and include your contact information_. Program managers, architects, and engineers will reach back out to you shortly and start close collaboration. The opportunity to collaborate on a migration scenario is free while the solutions are under active initial development.

The solutions will enable a wide range of production-ready deployment architectures with relative ease.

:::image type="content" source="media/oracle-weblogic/weblogic-architecture-aks.png" alt-text="Complex WebLogic Server deployments are enabled on AKS":::

Beyond what the solutions provide customers have complete flexibility to customize their deployments further. It's likely on top of deploying applications customers will integrate further Azure resources with their deployments. Customers are encouraged to provide feedback on further improving the solutions.

## Next steps

Explore running WLS on AKS.

> [!div class="nextstepaction"]
> [Guidance, scripts and samples for running Oracle WebLogic Server on the Azure Kubernetes Service](https://oracle.github.io/weblogic-kubernetes-operator/samples/simple/azure-kubernetes-service/)

> [!div class="nextstepaction"]
> [WebLogic Kubernetes Operator](https://oracle.github.io/weblogic-kubernetes-operator/)
