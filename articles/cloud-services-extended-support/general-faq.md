---
title: Cloud Services (extended support) General Questions
description: Frequently asked questions for Cloud Services (extended support) 
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Cloud Services (extended support) General FAQ

Frequently asked questions related to Cloud Services (extended support).


## How has cloud services changed? 

Cloud Services (extended support) is now using Azure Resource Manager (ARM) to handle all control plane operation requests (create, update, read, delete). The underlying logic to make infrastructure changes based on these requests haven’t changed.  Therefore, customers immediately get ARM features and the existing deployment files (Cscfg, Csdef) can be reused with minimal changes.  

As part of migration, customer needs to start using the new Rest APIs, PS commands, new Portal experience for control plane operations.  

Since Azure Resource Manager & Azure Service Manager (ASM) are inherently different, few features are no longer supported and few features have changed in the way they are used.  

Features like Load Balancer, Public IP, Virtual Network, Network Security Groups are exposed to customers as a resource on ARM unlike in ASM. However, the way to define these resources in Cscfg, Csdef remain the same.  

Customers now need to use Key Vault to store and manager their certificates. ASM handled certificate management on behalf of customer. Key Vault provides customers a better control over their certificates and secrets.  

## How can I find the list of features that are unsupported and changed?  

List of all supported and unsupported features/scenarios is listed in the Cloud Services (extended support) overview document.  

## What resources are available from microsoft for technical assistance and troubleshooting? 

Microsoft actively monitors Microsoft Q&A, Github, Stack Overflow, Azure Docs & Support channels dedicated for Cloud Services.  

 You can report bug in the product using <link> (Get the link from dev team) and in the documents using Github or Feedback section of the documents.  

## What will happen to Cloud Services (classic)? 

Cloud Services (classic) will continue to serve customers until they migrate their existing cloud services (classic) deployments to ARM on Cloud Services (extended support) or any another compute offering. 

## What does the current public preview release of Cloud Service (extended support) mean? 

Cloud Services (extended support) is now in beta stage and available for customers to try out and test. Customers should not use it to migrate production workloads.  

## What are my next steps? 

We recommend following steps: 

1. Read docs and understand what cloud services (extended support) has to offer. 

2. Identify all your subscriptions and create a catalog of all your Cloud Services (classic) deployments. You can use look at all your deployment on Cloud Services (classic) Portal blade or Resource Graph Explorer using Portal or Power shell.  

3. Understand the set of features used and blockers for migration.  

4. Build a catalog of custom tools, automations, dashboards and that needs to be updated to start using newer APIs, PS commands & SDKs. 

5. Reach out to microsoft for assistance with migration if needed. (Support, Cloud Solution Architects, Technical Account Managers, Microsoft Q&A) 

6. Build a detailed migration plan and execution timeline.  

7. Start and complete migration. Customers can either do a lift & shift migration (create parallel deployment on ARM, thoroughly test the deployment, migrate traffic from old to new deployment) or migrate within microsoft provided migration tool (will be soon released).  

## What does extended support mean? 

 Cloud services (extended support) was built with the goal to provide an easy migration path to ARM since ARM immediately provides a much better value for money, greatly improved performance & security and scope for future growth.  

 Cloud services (classic) will soon support a migration tool to facilitate migration from cloud services (classic) to cloud services (extended support) with minimal to downtime.  

## What is Azure Resource Manager? 

 Azure Resource Manager (ARM) is the new regional deployment and management service for Azure.  

## What is the difference between Azure Service Manager (ASM) & Azure Resource Manager (ARM) ? What is the difference between classic deployment model and deployment using resource manager? 

 Classic deployment model uses ASM to manage deployments & resources. Deployment using Resource Manager uses Azure Resource Manager for deployments.  

 Classic vs resource manager document explains the difference between these two deployment models.  

## What are resources? What is the difference between classic & ARM resources? 

 Resource is a manageable item that is available through Azure. Virtual machines, storage accounts, web apps, databases, and virtual networks are examples of resources. Resource groups, subscriptions, management groups, and tags are all examples of resources. 

 Resources managed by ASM are called classic resources while resources managed by ARM are called ARM resources.  

 Each resource has a resource name to uniquely identify it. Template resource declaration uses these names to tell azure which resource to manage.  

 Cloud Services (classic): microsoft.classiccompute/domainnames, Cloud Services (extended support): microsoft.compute/cloudservices 

## What new features do I get immediately after migration? 

Cloud services customers get features like Template (Infrastructure as Code deployment model), Role based access control, ARM Policies for improved control on security & privacy, Resource Tagging, Private Links, Azure Firewall, Vnet Peering, Key Vault support, etc. Customers will continue getting newer improved VM sizes, quicker security & performance improvements, and newer ARM features.  

## Are there any pricing differences between Cloud Services (classic) and Cloud Services (extended support)

Customers are now charged for use of Key Vault, Dynamic IP address, Reserved (static) IP address.  

Public IP resources deployed through Resource Manager are charged differently. Dynamic IPs are also chargeable in addition to static public IPs. For more details on Public IP charges in ARM, refer here: https://azure.microsoft.com/enin/pricing/details/ipaddresses/ 

## Do I get DNS name for my Cloud Services (extended support)? Will its default naming convention change? 

Yes , cloud services (extended support) can also be given a DNS name . With Azure Resource Manager, the DNS label is an optional property of the Public IP address that is assigned to the cloud service. The format of the DNS name for ARM based deployments as <userlabel>. <region>. cloudapp.azure.com 

## What is the difference between Cloud Services (classic) and Virtual Machines (classic)? 

ASM provides two compute offering/resources to customers. Virtual Machines (classic) (Aka classic VMs or classic IaaS VMs) is the IaaS offering and Cloud Services (classic) (Aka classic CS, classic PaaS VMs or Web/Worker Roles) is the PaaS offering.  

Virtual Machines (classic) has a resource name microsoft.classiccompute/virtualmachines and Cloud Services (classic) has a resource name microsoft.classiccompute/domainnames 

Deployments for both these resources lie within a logical entity called Hosted Service Name (Aka Cloud Service). This Cloud Service should not be confused with Cloud Services (classic)   

## I can’t find answer to my questions in any of the public documents. What should I do? 

Please check the Microsoft Q&A, Stack Overview or Github forum. If those forums don’t have the answers, please post your questions, someone from Microsoft will help answer your question.  

## The documentation is confusing / outdated. Between cloud services (classic) & cloud services (extended support) documentation, which should be considered as source of truth? 

Cloud Services (extended support) documents takes priority if there is conflict with Cloud Services (classic) documents. For features/scenarios that are not changing Cloud Services (classic) documents needs to be taken as source of truth.  

If there are errors/issues with documents, feel free to report the error using the feedback section of the document or via github links provided at topright corner of the documents.  

