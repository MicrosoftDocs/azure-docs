---
title: Cloud Services (extended support) General Questions
description: Frequently asked questions for Cloud Services (extended support) - general questions 
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Cloud Services (extended support) General FAQ

This article covers frequently asked questions related to Cloud Services (extended support).

## How has Cloud Services changed? 

Cloud Services (extended support) is now using Azure Resource Manager to handle all control plane operation requests. The underlying logic to make infrastructure changes based on these requests haven’t changed. Customers gain Azure Resource Manager features and the existing deployment files can be reused with minimal changes.  

As part of migration, customer needs to start using the new REST APIs, PowerShell commands and portal experience for control plane operations.  

Features like Load Balancer, Public IP, Virtual Network, Network Security Groups are exposed to customers as a resource in Azure Resource Manager unlike in Azure Service Manager. The way to define these resources in the configuration files remain the same.  

Additionally, customers need to use key vault to store and manage certificates.  

## What will happen to Cloud Services (classic)? 

Cloud Services (classic) will continue to serve customers until they migrate their existing Cloud Services (classic) deployments to ARM on Cloud Services (extended support) or any another compute offering. 

## What does the current public preview release of Cloud Service (extended support) mean? 

Cloud Services (extended support) is now in beta stage and available for customers to try out and test. Customers should not use it to migrate production workloads.  

## What are my next steps? 

1. Read docs and understand what Cloud Services (extended support) have to offer. 

2. Identify all your subscriptions and create a catalog of all your Cloud Services (classic) deployments. You can use look at all your deployment on Cloud Services (classic) Portal blade or Resource Graph Explorer using Portal or PowerShell.  

3. Understand the set of features used and blockers for migration.  

4. Build a catalog of custom tools, automations, dashboards and that needs to be updated to start using newer APIs, PowerShell commands & SDKs. 

5. Reach out to microsoft for assistance with migration if needed. (Support, Cloud Solution Architects, Technical Account Managers, Microsoft Q&A) 

6. Build a detailed migration plan and execution timeline.  

7. Start and complete migration. Customers can either do a lift & shift migration (create parallel deployment on ARM, thoroughly test the deployment, migrate traffic from old to new deployment) or migrate within microsoft provided migration tool.  

## What does extended support mean? 

 Cloud services (extended support) was built with the goal to provide an easy migration path to Azure Resource Manager.

## What is Azure Resource Manager? 

 Azure Resource Manager (ARM) is the new regional deployment and management service for Azure.  

## What is the difference between Azure Service Manager (ASM) & Azure Resource Manager (ARM)? What is the difference between classic deployment model and deployment using Resource Manager? 

 Classic deployment model uses ASM to manage deployments & resources. Deployment using Resource Manager uses Azure Resource Manager for deployments.  

 Classic vs Resource Manager document explains the difference between these two deployment models.  

## What are resources? What is the difference between classic & ARM resources? 

 Resource is a manageable item that is available through Azure. Virtual machines, storage accounts, web apps, databases, and virtual networks are examples of resources. Resource groups, subscriptions, management groups, and tags are all examples of resources. 

 Resources managed by ASM are called classic resources while resources managed by ARM are called ARM resources.  

 Each resource has a resource name to uniquely identify it. Template resource declaration uses these names to tell Azure which resource to manage.  

 Cloud Services (classic): microsoft.classiccompute/domainnames, Cloud Services (extended support): microsoft.compute/cloudservices 

## What new features do I get immediately after migration? 

Cloud services customers get features like Template (Infrastructure as Code deployment model), Role based access control, ARM Policies for improved control on security & privacy, Resource Tagging, Private Links, Azure Firewall, Vnet Peering, Key Vault support, etc. Customers will continue getting newer improved VM sizes, quicker security & performance improvements, and newer ARM features.  

## Are there any pricing differences between Cloud Services (classic) and Cloud Services (extended support)

Customers are now charged for use of key vault, Dynamic IP address, Reserved (static) IP address.  

Public IP resources deployed through Resource Manager are charged differently. Dynamic IPs are also chargeable in addition to static public IPs. For more details on Public IP charges in ARM, refer here: https://Azure.microsoft.com/enin/pricing/details/ipaddresses/ 

## Do I get DNS name for my Cloud Services (extended support)? Will its default naming convention change? 

Yes , Cloud Services (extended support) can also be given a DNS name . With Azure Resource Manager, the DNS label is an optional property of the Public IP address that is assigned to the Cloud Service. The format of the DNS name for ARM based deployments as <userlabel>. <region>. cloudapp.Azure.com 

## What is the difference between Cloud Services (classic) and Virtual Machines (classic)? 

ASM provides two compute offering/resources to customers. Virtual Machines (classic) (also known as classic VMs or classic IaaS VMs) is the IaaS offering and Cloud Services (classic) (also known as classic CS, classic PaaS VMs or Web/Worker Roles) is the PaaS offering.  

Virtual Machines (classic) has a resource name microsoft.classiccompute/virtualmachines and Cloud Services (classic) has a resource name microsoft.classiccompute/domainnames 

Deployments for both these resources lie within a logical entity called Hosted Service Name (also known as Cloud Service). This Cloud Service should not be confused with Cloud Services (classic)   

## How will Guest OS updates change? 

There is no changes to the rollout method. Cloud Services (classic) and Cloud Services (extended support) will get the same updates.

## Where will Cloud Services (extended support) be available? 

Cloud Services (extended support) is now available in all Public Cloud Regions. It will be available in sovereign clouds soon after General Available release.  

## What happens to my Quota? 

Customers will need to request for new quota on ARM using the same process used for any other compute product. Quota in ARM is regional unlike global in ASM. Therefore, a separate quota request needs to made for each region. Learn More about increasing region specific quota & VM Sku specific quota.  

## Will Visual studio be supported to create and update deployment? 

Yes, Visual Studio will provide a similar experience to create, update Cloud Services (extended support) deployments.  

[Learn More]() about visual studio support for Cloud Services (extended support) 

## How does my application code change on Cloud Services (extended support) 

There is no change required for your application code packaged in Cspkg. Your existing applications should continue to work as before.  

## What resources are commonly linked to a cloud services (extended support) deployment? 

Availability Sets, Extensions, Key Vault, Alert Rules, Auto scale Rules, Managed Identity, Application Gateway, Application Security Groups, Azure Firewall, Express Route Circuits, Express Route Gateway, Load Balancers, Network Security Groups, Network Watcher, Private Endpoints, Private Links, Public IP Address, Route Tables, Service Endpoint Policies, Virtual Network Gateway, Virtual Networks, VPN Gateways, Resource Groups, Storage Accounts, Traffic Manager, Certificates.  

## What resources linked to a cloud services (extended support) deployment need to live in the same resource group? 

Storage Accounts, Public IP, Load balancer, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same region and resource group.  

## What resources linked to a cloud services (extended support) deployment need to live in the same region? 

Key Vault, Virtual Network, Public IP, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same region. 

## What resources linked to a cloud services (extended support) deployment need to live in the same virtual network? 

Public IP, Load balancer, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same virtual network.  

## Do Cloud Services (extended support) support Stopped Allocated and Stopped Deallocated states? 

Similar to Cloud Services (classic) deployment, Cloud Services (extended support) deployment only supports Stopped Allocated state which appears as stopped on Portal.  

Stopped Deallocated state is not supported.  

## Does Cloud Services (extended support) deployment support scaling across clusters, availability zones, and regions? 

No, Similar to Cloud Services (classic), Cloud Services (extended support) deployment cannot scale across multiple clusters, availability zones and regions.  

## Will Cloud Services (extended support) mitigate the failures due to Allocation failures? 

No, Cloud Service (extended support) deployments are tied to a cluster like Cloud Services (classic). Therefore, allocation failures will continue to exist if the cluster is full.  

