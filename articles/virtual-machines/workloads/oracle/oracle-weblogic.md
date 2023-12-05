---
title: What are solutions for running Oracle WebLogic Server on Azure Virtual Machines
description: Learn how to run Oracle WebLogic Server on Microsoft Azure Virtual Machines.
author: rezar
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 10/24/2023
ms.author: rezar
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm
---
# What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?

**Applies to:** :heavy_check_mark: Linux VMs 

This page describes the solutions for running Oracle WebLogic Server (WLS) on Azure virtual machines. These solutions are jointly developed and supported by Oracle and Microsoft.

You can also run WLS on the Azure Kubernetes Service. The solutions to do so are described in [this Microsoft article](./weblogic-aks.md).

WLS is a leading Java application server running some of the most mission-critical enterprise Java applications across the globe. WLS forms the middleware foundation for the Oracle software suite. Oracle and Microsoft are committed to empowering WLS customers with choice and flexibility to run workloads on Azure as a leading cloud platform.

The Azure WLS solutions are aimed at making it as easy as possible to migrate your Java applications to Azure virtual machines. The solutions do so by generating deployed resources for most common cloud provisioning scenarios. The solutions automatically provision virtual network, storage, Java, WLS, and Linux resources. With minimal effort, WebLogic Server is provisioned. The solutions can set up security with a network security group, load balancing with Azure App Gateway or Oracle HTTP Server, and distributed caching with Oracle Coherence. You can also automatically connect to your existing database including Azure PostgreSQL, Azure MySQL, Azure SQL, and the Oracle Database on the Oracle Cloud or Azure.

:::image type="content" source="media/oracle-weblogic/wls-on-azure.gif" alt-text="You can use the Azure portal to deploy WebLogic Server on Azure":::

There are solution templates available to meet different scenarios such as [single instance with an admin server](https://portal.azure.com/#create/oracle.20191009-arm-oraclelinux-wls-admin20191009-arm-oraclelinux-wls-admin), and [cluster](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster). The solutions are available free of charge. These solutions are described and linked below. You can find detailed documentation on the solutions [here](https://wls-eng.github.io/arm-oraclelinux-wls/).

_These offers are Bring-Your-Own-License_. They assume you have already got the appropriate licenses with Oracle and are properly licensed to run offers in Azure.

The solution templates support a range of operating system, Java, and WLS versions through base images (such as WebLogic Server 14 and Java 11 on Red Hat Enterprise Linux 8). These base images are also available on Azure Marketplace on their own. The base images are suitable for customers that require complex, customized Azure deployments.

If you prefer step-by-step guidance for going from zero to a WLS cluster without any solution templates or base images, see [Install Oracle WebLogic Server on Azure Virtual Machines manually](/azure/developer/java/migration/migrate-weblogic-to-azure-vm-manually?toc=/azure/virtual-machines/workloads/oracle/toc.json&bc=/azure/virtual-machines/workloads/oracle/breadcrumb/toc.json).

_If you're interested in working closely on your migration scenarios with the engineering team developing these offers, select the [CONTACT ME](https://azuremarketplace.microsoft.com/marketplace/apps/oracle.oraclelinux-wls-cluster?tab=Overview) button_ on the [marketplace offer overview page](https://azuremarketplace.microsoft.com/marketplace/apps/oracle.oraclelinux-wls-cluster?tab=Overview). Program managers, architects, and engineers will reach back out to you shortly and start close collaboration.

## Oracle WebLogic Server with Admin Server

[This solution template](https://portal.azure.com/#create/oracle.20191009-arm-oraclelinux-wls-admin20191009-arm-oraclelinux-wls-admin) provisions a single virtual machine and installs WLS on it. It creates a domain and starts up the administration server. You can manage the domain and get started with application deployments right away.

## Oracle WebLogic Server Cluster

[This solution template](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster) creates a highly available cluster of WLS virtual machines. The administration server and all managed servers are started by default. You can manage the cluster and get started with highly available applications right away.

The solutions enable a wide range of production-ready deployment architectures with relative ease. You can meet most migration cases in the most productive way possible by allowing a focus on business application development.

:::image type="content" source="media/oracle-weblogic/weblogic-architecture-vms.png" alt-text="Complex WebLogic Server deployments are enabled on Azure":::

After resources are automatically provisioned by the solutions, you have complete flexibility to customize your deployments further. It's likely on top of deploying applications you'll integrate further Azure resources with your deployments. You're encouraged to [connect with the development team](https://azuremarketplace.microsoft.com/marketplace/apps/oracle.oraclelinux-wls-cluster?tab=Overview) and provide feedback on further improving the solutions.

## Next steps

Explore the offers on Azure.

> [!div class="nextstepaction"]
> [Oracle WebLogic Server with Admin Server](https://portal.azure.com/#create/oracle.20191009-arm-oraclelinux-wls-admin20191009-arm-oraclelinux-wls-admin)

> [!div class="nextstepaction"]
> [Oracle WebLogic Server Cluster](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster)
