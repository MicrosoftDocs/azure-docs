---
title: How Cloud Foundry Integrates with Azure | Microsoft Docs
description: Describes how Cloud Foundry can use Azure services to enhance the Enterprise experience
services: virtual-machines-linux
documentationcenter: ''
author: ningk
tags: Cloud-Foundry
ms.assetid: 00c76c49-3738-494b-b70d-344d8efc0853
ms.service: virtual-machines-linux
ms.topic: conceptual
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/11/2018
ms.author: ningk
---
# Integrate Cloud Foundry with Azure

[Cloud Foundry](https://docs.cloudfoundry.org/) is a PaaS platform running on top of cloud providers’ IaaS platform. It offers consistent application deployment experience across cloud providers. It can also integrate with various Azure services, with enterprise grade HA, scalability, and cost savings.
There are [6 subsystems of Cloud Foundry](https://docs.cloudfoundry.org/concepts/architecture/),  that can be flexibly scale online, including: Routing, Authentication, Application life-cycle management, Service management, Messaging and Monitoring. For each of the subsystems, you can configure Cloud Foundry to use correspondent Azure service. 

![Cloud Foundry on Azure Integration Architecture](media/CFOnAzureEcosystem-colored.png)

## 1. High Availability and Scalability
### Managed Disk
Bosh uses Azure CPI (Cloud Provider Interface) for disk creating and deleting routines. By default, unmanaged disks are used. It requires customer to manually create storage accounts,    then configure the accounts in CF manifest files. This is because of the limitation on the number of disks per storage account.
Now [Managed Disk](https://azure.microsoft.com/services/managed-disks/) is available, offers managed secure and reliable disk storage for virtual machines. Customer no longer need to deal with the storage account for scale and HA. Azure arranges disks automatically. 
Whether it's a new or an existing deployment, the Azure CPI will handle the creation or migration of the managed disk during a CF deployment. It's supported with PCF 1.11. You can also explore the open-source Cloud Foundry [Managed Disk guidance](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/managed-disks) for reference. 
### Availability Zone *
As a cloud-native application platform, Cloud Foundry is designed with [four level of High availability](https://docs.pivotal.io/pivotalcf/2-1/concepts/high-availability.html). While the first
three levels of software failures can be handled by CF system itself, platform fault tolerance is provided by cloud providers. The key CF components should be protected with a cloud provider’s platform HA solution. This includes GoRouters, Diego Brains, CF database and service tiles. By default, [Azure Availability Set](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/deploy-cloudfoundry-with-availability-sets) is used for fault tolerance between clusters in a data center.
The good new is, [Azure Availability Zone](https://docs.microsoft.com/azure/availability-zones/az-overview ) is released now, bringing the fault tolerance to next level, with low latency redundancy across data centers.
Azure Availability Zone achieves HA by placing a set of VMs into 2+ data centers, each set of VMs are redundant to other sets. If one Zone is down, the other sets are still live, isolated from the disaster.
> [!NOTE] 
> Azure Availability Zone is not offered to all regions yet, check the latest [announcement for the list of supported regions](https://docs.microsoft.com/azure/availability-zones/az-overview). For Open Source Cloud Foundry, check [Azure Availability Zone for open source Cloud Foundry guidance](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/availability-zone).

## 2. Network Routing
By default, Azure basic load balancer is used for incoming CF API/apps requests, forwarding them to the Gorouters. CF components like Diego Brain, MySQL, ERT can also use the load balancer to balance the traffic for HA. Azure also provides a set of fully managed load-balancing solutions. If you're looking for TLS/SSL termination ("SSL offload") or per HTTP/HTTPS request application layer processing, consider Application Gateway. For high availability and scalability load balancing on layer 4, consider standard load balancer.
### Azure Application Gateway *
[Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-introduction) offers various layer 7 load balancing capabilities, including SSL offloading, end to end TLS, Web Application Firewall, cookie-based session affinity and more. You can [configure Application Gateway in Open Source Cloud Foundry](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/application-gateway). For PCF, check the  [PCF 2.1 release notes](https://docs.pivotal.io/pivotalcf/2-1/pcf-release-notes/opsmanager-rn.html#azure-application-gateway) for POC test.

### Azure Standard Load Balancer *
Azure Load Balancer is a Layer 4 load balancer. It's used to distribute the traffic among instances of services in a load-balanced set. The standard version provides [advanced features](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview) on top of the basic version. For example 1. The backend pool max limit is raised from 100 to 1000 VMs.  2. The endpoints now support multiple availability sets instead of single availability set.  3. Additional features like HA ports, richer monitoring data, and so on. If you're moving to Azure Availability Zone, standard load balancer is required. For a new deployment, we recommend you to start with Azure Standard Load Balancer. 

## 3. Authentication 
[Cloud Foundry User Account and Authentication](https://docs.cloudfoundry.org/concepts/architecture/uaa.html) is the central identity management service for CF and its various components. [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-whatis) is Microsoft’s multi-tenant, cloud-based directory and identity management service. 
By default, UAA is used for Cloud Foundry authentication. As an advanced option, UAA also supports Azure AD as an external user store. Azure AD users can access Cloud Foundry using their LDAP identity, without a Cloud Foundry account. Follow these steps to [configure the Azure AD for UAA in PCF](https://docs.pivotal.io/p-identity/1-6/azure/index.html).

## 4. Data storage for Cloud Foundry Runtime System
Cloud Foundry offers great extensibility to use Azure blobstore or Azure MySQL/PostgreSQL services for application runtime system storage.
### Azure Blobstore for Cloud Foundry Cloud Controller blobstore
The Cloud Controller blobstore is a critical data store for buildpacks, droplets, packages, and resource pools. By default, NFS server is used for Cloud Controller blobstore. 
To avoid single point of failure, use Azure Blob Storage as external store. Check out the [Cloud Foundry documentation](https://docs.cloudfoundry.org/deploying/common/cc-blobstore-config.html) for background, and [options in Pivotal Cloud Foundry](https://docs.pivotal.io/pivotalcf/2-0/customizing/azure.html).

### MySQL/PostgreSQL as Cloud Foundry Elastic Run Time Database *
CF Elastic Runtime requires two major system databases:
#### CCDB 
The Cloud Controller database.  Cloud Controller provides REST API endpoints for clients to access the system. CCDB stores tables for orgs, spaces, services, user roles, and more for Cloud controller.
#### UAADB 
The database for User Account and Authentication. It stores the user authentication related data, for example encrypted user names and passwords.

By default, a local system database (MySQL) can be used. For HA and to scale, leverage Azure managed MySQL or PostgreSQL services. 
Here is the instruction of [enabling Azure MySQL/PostgreSQL for CCDB, UAADB and other system databases with Open Source Cloud Foundry](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/configure-cf-external-databases-using-azure-mysql-postgres-service).

## 5. Open Service Broker
Azure service broker offers consistent interface to manage application’s access to Azure services. The new [Open Service Broker for Azure project](https://github.com/Azure/open-service-broker-azure) provides a single and simple way to deliver services to applications across Cloud Foundry, OpenShift, and Kubernetes. See the [Azure Open Service Broker for PCF tile](https://pivotal.io/platform/services-marketplace/data-management/microsoft-azure) for deployment instructions on PCF.

## 6. Metrics and Logging
The Azure Log Analytics Nozzle is a Cloud Foundry component, that forwards metrics from the [Cloud Foundry loggregator firehose](https://docs.cloudfoundry.org/loggregator/architecture.html) to [Azure Monitor logs](https://azure.microsoft.com/services/log-analytics/). With the Nozzle, you can collect, view, and analyze your CF system health and performance metrics across multiple deployments.
Click [here](https://docs.microsoft.com/azure/cloudfoundry/cloudfoundry-oms-nozzle) to learn how to deploy the Azure Log Analytics Nozzle to both Open Source and Pivotal Cloud Foundry environment, and then access the data from the Azure Monitor logs console. 
> [!NOTE]
> From PCF 2.0, BOSH health metrics for VMs are forwarded to the Loggregator Firehose by default, and are integrated into Azure Monitor logs console.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## 7. Cost Saving
### Cost Saving for Dev/Test Environments
#### B-Series: *
While F and D VM series were commonly recommended for Pivotal Cloud Foundry production environment, the new “burstable” [B-series](https://azure.microsoft.com/blog/introducing-b-series-our-new-burstable-vm-size/) brings new options. The B-series burstable VMs are ideal for workloads that don't need the full performance of the CPU continuously, like web servers, small databases and development and test environments. These workloads typically have burstable performance requirements. It is $0.012/hour (B1) compared to $0.05/hour (F1), see the full list of [VM sizes](https://docs.microsoft.com/azure/virtual-machines/linux/sizes-general) and [prices](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) for details. 
#### Managed Standard Disk: 
Premium disks were recommended for reliable performance in production.  With [Managed Disk](https://azure.microsoft.com/services/managed-disks/), standard storage can also deliver similar reliability, with different performance. For workload that isn't performance-sensitive, like dev/Test or non-critical environment, managed standard disks offer an alternative option with lower cost.  
### Cost saving in General 
#### Significant VM Cost Saving with Azure reservations: 
Today all CF VMs are billed using “on-demand” pricing, even though the environments typically stay up indefinitely. Now you can reserve VM capacity on a 1 or 3-year term, and gain discounts of 45-65%. Discounts are applied in the billing system, with no changes to your environment. For details, see [How Azure reservations works](https://azure.microsoft.com/pricing/reserved-vm-instances/). 
#### Managed Premium Disk with Smaller Sizes: 
Managed disks support smaller disk sizes, for example P4(32 GB) and P6(64 GB) for both premium and standard disks. If you have small workloads, you can save cost when migrating from standard premium disks to managed premium disks.
#### Use Azure First Party Services: 
Taking advantage of Azure’s first party service will lower the long-term administration cost, in addition to HA and reliability mentioned in above sections. 

Pivotal has launched a [Small Footprint ERT](https://docs.pivotal.io/pivotalcf/2-0/customizing/small-footprint.html) for PCF customers, the components are co-located into just 4 VMs, running up to 2500 application instances. The trial version is now available through [Azure Market place](https://azuremarketplace.microsoft.com/marketplace/apps/pivotal.pivotal-cloud-foundry).

## Next Steps
Azure integration features are first available with [Open Source Cloud Foundry](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/), before it's available on Pivotal Cloud Foundry. Features marked with * are still not available through PCF. Cloud Foundry integration with Azure Stack isn't covered in this document either.
For PCF support on the features marked with *, or Cloud Foundry integration with Azure Stack, contact your Pivotal and Microsoft account manager for latest status. 

