---
title: What is BareMetal Infrastructure for Nutanix?
description: Learn about the features BareMetal Infrastructure offers for Nutanix workloads. 
ms.topic: conceptual
ms.subservice:  
ms.date: 09/03/2021
---

# What is BareMetal Infrastructure for Nutanix?

In this article, we'll give an overview of the features BareMetal Infrastructure offers for Nutanix workloads.

Nutanix Clusters on Microsoft Azure provides a hybrid cloud solution that operates as a single cloud, allowing you to manage applications and infrastructure in your private cloud and Azure. With your Nutanix clusters running on Azure, you can seamlessly move your applications between on-premises and Azure using a single management console. With Nutanix Clusters on Azure, you can use your existing Azure accounts and networking setup (VPN, VNets, and Subnets), eliminating the need to manage any complex network overlays. With this hybrid offering, you use the same Nutanix software and licenses across your on-premises cluster and Azure to optimize your IT investment efficiently.

You use the Nutanix Clusters console to create a cluster, update the cluster capacity (the number of nodes), and delete a Nutanix cluster. After you create a Nutanix cluster in Azure using Nutanix Clusters, you can operate the cluster in the same manner as you operate your on-prem Nutanix cluster with minor changes in the Nutanix command-line interface (nCLI), the Prism Element and Prism Central web consoles, and APIs.  


### Supported protocols

The following protocols are used for different mount points within BareMetal servers for Nutanix workload.

- OS mount – iSCSI
- Data/log – NFSv3
- backup/archieve – NFSv4

### Licensing

- You bring your own on-premises operating system and Nutanix licenses.

### Operating system

Servers are pre-loaded with operating system RHEL 7.6.

## Next steps

Learn about the SKUs for Nutanix BareMetal workloads.

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
