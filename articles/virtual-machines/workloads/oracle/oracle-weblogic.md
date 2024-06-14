---
title: What are solutions for running Oracle WebLogic Server on Azure Virtual Machines
description: Learn how to run Oracle WebLogic Server on Microsoft Azure Virtual Machines.
author: rezar
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 10/24/2023
ms.author: rezar
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm
---
# What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?

**Applies to:** :heavy_check_mark: Linux VMs 

This page describes the solutions for running Oracle WebLogic Server (WLS) on Azure Virtual Machines. These solutions are jointly developed and supported by Oracle and Microsoft.

You can also run WebLogic Server on the Azure Kubernetes Service. The solutions to do so are described in the article [Running Oracle WebLogic Server on the Azure Kubernetes Service](/azure/virtual-machines/workloads/oracle/weblogic-aks?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json).

WebLogic Server is a leading Java application server running some of the most mission-critical enterprise Java applications across the globe. WebLogic Server forms the middleware foundation for the Oracle software suite. Oracle and Microsoft are committed to empowering WebLogic customers with choice and flexibility to run workloads on Azure as a leading cloud platform. 

There are several offers that target use cases such as [single instance with Administration server enabled](#weblogic-server-single-instance-with-admin-console-on-azure-vm) and WebLogic cluster including both [static cluster](#weblogic-server-configured-cluster-on-azure-vms) and [dynamic clusters](#weblogic-server-dynamic-cluster-on-azure-vms). These offers are solution templates that aim to expedite your Java application deployment to Azure Virtual Machines. They automatically provision virtual network, storage, Java, WebLogic, and Linux resources required for most common cloud provisioning scenarios. After initial provisioning is done, you're completely free to customize deployments further.

:::image type="content" source="media/oracle-weblogic/wls-on-azure.gif" alt-text="You can use the Azure portal to deploy WebLogic Server on Azure":::

 _The offers are Bring-Your-Own-License_. They assume you have already got the appropriate licenses with Oracle and are properly licensed to run offers in Azure.

The solution templates support a range of operating system, Java, and WebLogic Server versions through base images (such as WebLogic Server 14 and Java 11 on Red Hat Enterprise Linux 8). These [base images](#weblogic-server-on-azure-vm-base-images) are also available on Azure Marketplace on their own. The base images are suitable for customers that require complex, customized Azure deployments.

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing WeLogic on Azure solutions, fill out this short [survey on WebLogic migration](https://aka.ms/wls-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## WebLogic Server single instance with admin console on Azure VM

The solution template [WebLogic Server single instance with admin console on Azure VM](https://aka.ms/wls-vm-admin) provisions a single virtual machine and installs WebLogic Server on it. It creates a domain and starts up an administration server. After the solution template performs most boilerplate resource provisioning and configuration, you can manage the domain and get started with Java application deployments right away. 

For the getting started guidance, see [Quickstart: Deploy WebLogic Server on Azure Virtual Machine using the Azure portal](./weblogic-server-azure-virtual-machine.md?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json). For deployment guidance, see [Using Oracle WebLogic Server on Microsoft Azure IaaS](https://wls-eng.github.io/arm-oraclelinux-wls/).


## WebLogic Server configured cluster on Azure VMs

The solution template [WebLogic Server configured cluster on Azure VMs](https://aka.ms/wls-vm-cluster) creates a highly available configured cluster of WebLogic Server on Azure Virtual Machines. The administration server and all managed servers are started by default. After the solution template performs most boilerplate resource provisioning and configuration, you can manage the cluster and get started with highly available applications right away. For deployment guidance, see [Using Oracle WebLogic Server on Microsoft Azure IaaS](https://wls-eng.github.io/arm-oraclelinux-wls/).

The solution enables a wide range of production-ready deployment architectures with relative ease. You can meet most migration cases in the most productive way possible by allowing a focus on business application development.

:::image type="content" source="media/oracle-weblogic/weblogic-architecture-vms.png" alt-text="Complex WebLogic Server deployments are enabled on Azure":::

After resources are automatically provisioned by the solutions, you have complete flexibility to customize your deployments further. It's likely that, on top of deploying applications, you'll integrate further Azure resources with your deployments. You're encouraged to [connect with the development team](https://aka.ms/wls-on-azure-survey) and provide feedback on further improving WebLogic on Azure solutions.

If you prefer step-by-step guidance for going from zero to a WebLogic Server cluster without any solution templates or base images, see [Install Oracle WebLogic Server on Azure Virtual Machines manually](/azure/developer/java/migration/migrate-weblogic-to-azure-vm-manually?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json).

## WebLogic Server dynamic cluster on Azure VMs

The solution template [WebLogic Server dynamic cluster on Azure VMs](https://aka.ms/wls-vm-dynamic-cluster) creates a dynamic cluster of WebLogic Server on Azure Virtual Machines. Administration Server is on one of the Azure Virtual Machines. For deployment guidance, see [Using Oracle WebLogic Server on Microsoft Azure IaaS](https://wls-eng.github.io/arm-oraclelinux-wls/).

## WebLogic Server on Azure VM Base Images

The solution templates introduced above support a range of operating system, Java, and WebLogic Server versions through base images - such as WebLogic Server 14 and Java 11 on Red Hat Enterprise Linux 8. These base images are also available on Azure Marketplace on their own. The base images are suitable for customers that require complex, customized Azure deployments. You can use the keywords *oracle weblogic base image* to search for the current set of [base images of WebLogic Server on Azure VM](https://aka.ms/wls-vm-base-images) available in Azure Marketplace.

## Next steps

The following articles provide more information on getting started with these technologies.

* [Quickstart: Deploy WebLogic Server on Azure Virtual Machine using the Azure portal](./weblogic-server-azure-virtual-machine.md?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
* [Manually install Oracle WebLogic Server on Azure Virtual Machines](/azure/developer/java/migration/migrate-weblogic-to-azure-vm-manually?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
* [What are solutions for running Oracle WebLogic Server on the Azure Kubernetes Service?](./weblogic-aks.md)

For more information about the Oracle WebLogic offers at Azure Marketplace, see [Oracle WebLogic Server on Azure](https://aka.ms/wls-contact-me). These offers are all _Bring-Your-Own-License_. They assume that you already have the appropriate licenses with Oracle and are properly licensed to run offers in Azure.

You're encouraged to [connect with the development team](https://aka.ms/wls-on-azure-survey) and provide feedback on further improving WebLogic on Azure solutions.
