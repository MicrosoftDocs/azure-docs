---
title: How Cloud Foundry Integrates with Azure | Microsoft Docs
description: Describe how Cloud Foundry can utlize Azure services to enhance the Enterprice experience
services: virtual-machines-linux
documentationcenter: ''
author: ningk
manager: timlt
editor: ''
tags: Cloud-Foundry
ms.assetid: 00c76c49-3738-494b-b70d-344d8efc0853
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/11/2018
ms.author: ningk
---
# Integrate Cloud Foundry with Azure for Enterprise Grade Experiences 

[Cloud Foundry](https://docs.cloudfoundry.org/) is a PaaS platform running on top of cloud providers’ IaaS platform. While it offers consistent application deployment experience across cloud providers, it can also integrate with various Azure services, offering enterprise grade HA, scalability, and cost savings.
There are [6 subsystems of Cloud Foundry](https://docs.cloudfoundry.org/concepts/architecture/),  that can be flexibly scale online, including:  1.Routing   2. Authentication   3. Application life cycle management   4. Service management   5. Messaging   6. Monitoring. For each of the subsystems, you can configure Cloud Foundry to utilize correspondent Azure service. 
Note these features are based on Azure, the integration with Azure Stack is in progress. 

![Cloud Foundry on Azure Integration Architecture](media/CFOnAzureEcosystem-colored.png)

## 1. High Availability and Scalability
### Managed Disk
Bosh utilizes Azure CPI (Cloud Provider Interface) for disk creating and deleting routines. By default, unmanaged disks are used. It requires customer to manually create storage accounts,    then configure the accounts in CF manifest files. This is due to the limitation on the number of disks per storage account.
Now [Managed Disk](https://azure.microsoft.com/en-us/services/managed-disks/) is available, offers managed secure and reliable disk storage for virtual machines. Customer no longer need to deal with the storage account for scale and HA. Azure arranges disks automatically. 
Whether it is a new or an existing deployment, the Azure CPI will handle the creation or migration of the managed disk during a CF deployment. It is supported with PCF 1.11. You can also explore the open source [Managed Disk guidance](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/managed-disks) for reference. 
### Availability Zone *
As a cloud-native application platform, Cloud Foundry is designed with [four level of High availability](https://docs.pivotal.io/pivotalcf/2-1/concepts/high-availability.html). While the first
three levels of software failures can be handled by CF system itself, platform fault tolerance is provided by cloud providers. The key CF components (including GoRouters, Diego Brains, CF database and Service tiles) should be protected with a cloud provider’s platform HA solution.  By default, [Azure Availability Set](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/deploy-cloudfoundry-with-availability-sets) is used for fault tolerance between clusters in a data center.
The good new is, [Azure Availability Zone](https://docs.microsoft.com/en-us/azure/availability-zones/az-overview ) is released now, bringing the fault tolerance to next level, with low latency redundancy across data centers.
Azure Availability Zone achieves HA by placing a set of VMs into 2+ data centers, each set of VMs are redundant to other sets. If one Zone is down, the other sets are still live, isolated from the disaster.
Note Azure Availablity Zone is not offered to all regions yet, check the latest [announcement for the list of supported regions](https://docs.microsoft.com/en-us/azure/availability-zones/az-overview). For testing, check [Azure Availability Zone for open source Cloud Foundry](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/availability-zone).

## 2. Network Routing
By default, Azure basic load balancer is used for incoming CF API/apps requests, forwarding them to the Gorouters. CF components like Diego Brain, MySQL, ERT can also use the load balancer to balance the traffic for HA. In addition, Azure provides a set of fully managed load balancing solutions. If you are looking for TLS termination ("SSL offload") or per HTTP/HTTPS request application layer processing, consider Application Gateway. For high availability and scalability load balancing on layer 4, consider standard load balancer.
### Azure Application Gateway *
[Azure Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-introduction) offers various layer 7 load balancing capabilities, including SSL offloading, end to end SSL, Web Application Firewall, cookie-based session affinity and more. It is supported in [Open Source Cloud Foundry]( https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-introduction). Note there is a [known compatibility issue](https://docs.pivotal.io/pivotalcf/2-1/pcf-release-notes/opsmanager-rn.html#azure-application-gateway) with PCF, so you can only test in POC environment for PCF.
### Azure Standard Load Balancer *
Azure Load Balancer is a Layer 4 load balancer. It is used to distribute the traffic among instances of services in a load-balanced set. The standard version provides [advanced features](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview) on top of the basic version. For example 1. The backend pool max limit is raised from 100 to 1000 VMs.  2. The endpoints now support multiple availability sets instead of single availability set.  3. Additional features like HA ports, richer monitoring data, etc. If you are moving to Azure Availability Zone, standard load balancer is required. For a new deployment, we recommend you to start with Azure Standard Load Balancer. Migration guidance is progress. 

## 3. Authentication 
[Cloud Foundry User Account and Authentication](https://docs.cloudfoundry.org/concepts/architecture/uaa.html) is the central identity management service for CF and its various components. [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-whatis) is Microsoft’s multi-tenant, cloud-based directory and identity management service. 
By default, UAA is used for Cloud Foundry authentication. As an advanced option, UAA can also be configured to support Azure AD as an external user store in Cloud Foundry, enabling Azure AD users to use their LDAP identity to access Cloud Foundry, without an additional Cloud Foundry account.   Follow these steps to [configure the Azure AD for UAA in PCF](http://docs.pivotal.io/p-identity/1-6/azure/index.html).

## 4. Data storage for Cloud Foundry App store and App life cycle management
Cloud Foundry offers great extensibility to use Azure blobstore or Azure MySQL/PostgreSQL services for application runtime system storage.
### Azure Blobstore for Cloud Foundry Cloud Controller blobstore
The Cloud Controller blobstore is a critical data store for buildpacks, droplets, packages, and resource pools. By default, NFS server is used for Cloud Controller blobstore. 
Now operators can use Azure Blob Storage for Cloud Controller blobstore instead, enjoying greater availability and scalability. Check out the [Cloud Foundry documentation](https://docs.cloudfoundry.org/deploying/common/cc-blobstore-config.html) for background, and [options in Pivotal Cloud Foundry](https://docs.pivotal.io/pivotalcf/2-0/customizing/azure.html).

### MySQL/PostgreSQL as Cloud Foundry Elastic Run time database*
CF Elastic Runtime requires two major system databases:
#### CCDB 
The Cloud Controller database.  Cloud Controller provides REST API endpoints for clients to access the system. CCDB stores tables for orgs, spaces, services, user roles, and more for Cloud controller.
#### UAADB 
The database for User Account and Authentication. It stores the user authentication related data, for example encrypted user names and passwords.
By default, a local system database (MySQL) can be used. Now customer can leverage Azure managed MySQL or PostgreSQL services for scale. 
Here is instruction on [enabling Azure MySQL/PostgreSQL for CCDB, UAADB and other system databases with Open Source Cloud Foundry](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/configure-cf-external-databases-using-azure-mysql-postgres-service).

## 5. Open Service Broker
Azure service broker offers consistent interface to manage application’s access to Azure services. The new [Open Service Broker for Azure](https://github.com/Azure/open-service-broker-azure) project provides a single and simple way to deliver services to applications running within cloud native platforms across Cloud Foundry, OpenShift, and Kubernetes. See the [Azure Open Service Broker for PCF tile](https://network.pivotal.io/products/azure-open-service-broker-pcf/) for deployment instructions.

## 6. Metrics and logging
The Azure Log Analytics Nozzle is a Cloud Foundry component, that forwards metrics from the [Cloud Foundry loggregator firehose](https://docs.cloudfoundry.org/loggregator/architecture.html) to [Azure Log Analytics](https://azure.microsoft.com/en-us/services/log-analytics/). With the Nozzle, you can collect, view, and analyze your CF system health and performance metrics across multiple deployments.
Click [here](https://docs.microsoft.com/en-us/azure/cloudfoundry/cloudfoundry-oms-nozzle) to learn how to deploy the Azure Log Analytics Nozzle to your CF environment, and then access the data from the Azure Log Analytics OMS console. Note from PCF 2.0, BOSH health metrics generated for all VMs in a deployment are forwarded to the Loggregator Firehose by default, and is now integrated with Azure Log Analytics OMS console.

## 7. Cost Saving
### Cost saving for dev/test environments
#### B-Series: *
While F and D VM series were commonly recommended for Pivotal Cloud Foundry production environment, the new “burstable” [B-series](https://azure.microsoft.com/en-us/blog/introducing-b-series-our-new-burstable-vm-size/) brings new options. The B-series burstable VMs are ideal for workloads that do not need the full performance of the CPU continuously, like web servers, small databases and development and test environments. These workloads typically have burstable performance requirements. It is $0.012/hour (B1) compared to $0.05/hour (F1), see the full list of [VM sizes](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/sizes-general) and [prices](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/) for details. 
#### Managed Standard Disk: 
Premium disks were recommended for reliable performance in production.  With [managed disk](https://azure.microsoft.com/en-us/services/managed-disks/), standard storage can also deliver similar reliability, with different performance. For workload that is not performance-sensitive, like dev/Test or non-critical environment, managed standard disks offer an alternative option with lower cost.  
### Cost saving in general 
#### Significant VM Cost Saving with Reserved Instances: 
Today all CF VMs are billed using “on-demand” pricing, even though the environments typically stay up indefinitely. Now you can reserve VM capacity on a 1 or 3-year term, and gain discounts of 45-65%. Discounts are applied in the billing system, with no changes to your environment. For details, see [how reserved instances works](https://azure.microsoft.com/en-us/pricing/reserved-vm-instances/). 
#### Managed Premium Disk with smaller sizes: 
Managed disks support smaller disk sizes, for example P4(32 GB) and P6(64 GB) for both premium and standard disks. If you have small workloads, you can save cost when migrating from standard premium disks to managed premium disks.
#### Utilizing Azure first party services: 
Taking advantage of Azure’s first party service will lower the long-term administration cost, in addition to HA and reliability mentioned in above sections. 

Pivotal has launched a [Small Footprint ERT](https://docs.pivotal.io/pivotalcf/2-0/customizing/small-footprint.html) for PCF customers, the components are co-located into just 4 VMs, running up to 2500 application instances. The trial version is now available through [Azure Market place](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/pivotal.pivotal-cloud-foundry).

Note Azure integration features are first available with [OSS Cloud Foundry](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/tree/master/docs/advanced/), before it is available on Pivotal Cloud Foundry. For feature marked with *, contact your Microsoft and PCF account manager for PCF support status. 

