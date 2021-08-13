---
title: What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service
description: Learn how to run Oracle WebLogic Server on the Azure Kubernetes Service.
author: rezar
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 02/23/2021
ms.author: rezar
ms.reviewer: cynthn

---
# What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service?

This page describes the solutions for running Oracle WebLogic Server (WLS) on the Azure Kubernetes Service (AKS). These solutions are jointly developed and supported by Oracle and Microsoft.

It's also possible to run WebLogic Server on Azure Virtual Machines. The solutions to do so are described in [this Microsoft article](./oracle-weblogic.md).

WebLogic Server is a leading Java application server running some of the most mission critical enterprise Java applications across the globe. WebLogic Server forms the middleware foundation for the Oracle software suite. Oracle and Microsoft are committed to empowering WebLogic Server customers with choice and flexibility to run workloads on Azure as a leading cloud platform.

## WLS on AKS certified and supported
WebLogic Server is certified by Oracle and Microsoft to run well on AKS. The WebLogic Server on AKS solutions are aimed at making it as easy as possible to run your containerized and orchestrated Java applications on Docker and Kubernetes infrastructure. The solutions are focused on reliability, scalability, manageability, and enterprise support.

WebLogic Server clusters are fully enabled to run on Kubernetes via the WebLogic Kubernetes Operator (referred to simply as the 'Operator' from here onward). The Operator follows the standard Kubernetes Operator pattern. It simplifies the management and operation of WebLogic domains and deployments on Kubernetes by automating otherwise manual tasks and adding extra operational reliability features. The Operator supports Oracle WebLogic Server 12c, Oracle Fusion Middleware Infrastructure 12c and beyond. We've tested the official Docker images for WebLogic Server 12.2.1.3 and 12.2.1.4 with the Operator. For details on the Operator, refer to the [official documentation from Oracle](https://oracle.github.io/weblogic-kubernetes-operator/).

## Guidance, scripts, and samples for WLS on AKS
Beyond certifying WebLogic Server on AKS, Oracle and Microsoft jointly provide detailed instructions, scripts, and samples for running WebLogic Server on AKS. The guidance is incorporated into the Azure Kubernetes Service sample section of the [Operator documentation](https://oracle.github.io/weblogic-kubernetes-operator/). The guidance is aimed at making production WebLogic Server on AKS deployments as easy as possible. The guidance uses official WebLogic Server Docker images provided by Oracle. Failover is achieved via Azure Files accessed through Kubernetes Persistent Volume Claims. Azure Load Balancers are supported when provisioned using a Kubernetes Service of type 'LoadBalancer'. The Azure Container Registry (ACR) is supported for deploying WLS domains inside custom Docker images. The guidance allows a high degree of configuration and customization.

:::image type="content" source="media/oracle-weblogic/wls-on-aks.gif" alt-text="You can use the sample scripts to deploy WebLogic Server on AKS":::

The solutions include two ways of deploying WLS domains to AKS. Domains can be deployed directly to Kubernetes Persistent Volumes. This deployment option is good if you want to migrate to AKS but still want to administer WLS using the Admin Console or the WebLogic Scripting Tool (WLST). The option also allows you to move to AKS without adopting Docker development. The more Kubernetes native way of deploying WLS domains to AKS is to build custom Docker images based on official WLS images from the Oracle Container Registry, publish the custom images to ACR and deploy the domain to AKS using the Operator. This option in the solution also allows you to update the domain through Kubernetes ConfigMaps after the deployment is done.

Further ease-of-use and Azure service integrations are possible in the future via Marketplace offerings mirroring Oracle WebLogic Server on Azure Virtual Machines solutions.

_These solutions are Bring-Your-Own-License_. They assume you've already got the appropriate licenses with Oracle and are properly licensed to run offers in Azure.

_If you're interested in working closely on your migration scenarios with the engineering team developing these solutions, fill out [this short survey](https://aka.ms/wls-on-azure-survey) and include your contact information_. Program managers, architects, and engineers will reach back out to you shortly and start close collaboration. The opportunity to collaborate on a migration scenario is free while the solutions are under active initial development.

## Deployment architectures

The solutions for running Oracle WebLogic Server on the Azure Kubernetes Service will enable a wide range of production-ready deployment architectures with relative ease.

:::image type="content" source="media/oracle-weblogic/weblogic-architecture-aks.png" alt-text="Complex WebLogic Server deployments are enabled on AKS":::

Beyond what the solutions provide customers have complete flexibility to customize their deployments further. It's likely on top of deploying applications customers will integrate further Azure resources with their deployments. Customers are encouraged to provide feedback in the survey on further improving the solutions.

## Next steps

Explore running Oracle WebLogic Server on the Azure Kubernetes Service.

> [!div class="nextstepaction"]
> [Guidance, scripts and samples for running WLS on AKS](https://oracle.github.io/weblogic-kubernetes-operator/)

> [!div class="nextstepaction"]
> [WebLogic Kubernetes Operator](https://oracle.github.io/weblogic-kubernetes-operator/)
