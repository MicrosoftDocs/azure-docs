---
title: Cloud Services (extended support) FAQ
description: Frequently asked questions for Cloud Services (extended support)
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Cloud Services (extended support) Frequently Asked Questions 

This article is broken down into various high level FAQ topics. 

## General FAQ

### How has cloud services changed? 

- Cloud Services (extended support) is now using Azure Resource Manager (ARM) to handle all control plane operation requests (create, update, read, delete). The underlying logic to make infrastructure changes based on these requests haven’t changed.  Therefore, customers immediately get ARM features and the existing deployment files (Cscfg, Csdef) can be reused with minimal changes.  

- As part of migration, customer needs to start using the new Rest APIs, PS commands, new Portal experience for control plane operations.  

- Since Azure Resource Manager & Azure Service Manager (ASM) are inherently different, few features are no longer supported and few features have changed in the way they are used.  

- Features like Load Balancer, Public IP, Virtual Network, Network Security Groups are exposed to customers as a resource on ARM unlike in ASM. However, the way to define these resources in Cscfg, Csdef remain the same.  

- Customers now need to use Key Vault to store and manager their certificates. ASM handled certificate management on behalf of customer. Key Vault provides customers a better control over their certificates and secrets.  

 

### How can I find the list of features that are unsupported and changed?  

List of all supported and unsupported features/scenarios is listed in the Cloud Services (extended support) overview document.  

 

### What resources are available from microsoft for technical assistance and troubleshooting? 

- Microsoft actively monitors Microsoft Q&A, Github, Stack Overflow, Azure Docs & Support channels dedicated for Cloud Services.  

- You can report bug in the product using <link> (Get the link from dev team) and in the documents using Github or Feedback section of the documents.  

 

### What will happen to Cloud Services (classic)? 

Cloud Services (classic) will continue to serve customers until they migrate their existing cloud services (classic) deployments to ARM on Cloud Services (extended support) or any another compute offering. 

 

 

### What does the current public preview release of Cloud Service (extended support) mean? 

Cloud Services (extended support) is now in beta stage and available for customers to try out and test. Customers should not use it to migrate production workloads.  

 

### What are my next steps? 

We recommend following steps: 

1. Read docs and understand what cloud services (extended support) has to offer. 

2. Identify all your subscriptions and create a catalog of all your Cloud Services (classic) deployments. You can use look at all your deployment on Cloud Services (classic) Portal blade or Resource Graph Explorer using Portal or Power shell.  

3. Understand the set of features used and blockers for migration.  

4. Build a catalog of custom tools, automations, dashboards and that needs to be updated to start using newer APIs, PS commands & SDKs. 

5. Reach out to microsoft for assistance with migration if needed. (Support, Cloud Solution Architects, Technical Account Managers, Microsoft Q&A) 

6. Build a detailed migration plan and execution timeline.  

7. Start and complete migration. Customers can either do a lift & shift migration (create parallel deployment on ARM, thoroughly test the deployment, migrate traffic from old to new deployment) or migrate within microsoft provided migration tool (will be soon released).  

 

### What does extended support mean? 

- Cloud services (extended support) was built with the goal to provide an easy migration path to ARM since ARM immediately provides a much better value for money, greatly improved performance & security and scope for future growth.  

- Cloud services (classic) will soon support a migration tool to facilitate migration from cloud services (classic) to cloud services (extended support) with minimal to downtime.  

 

### What is Azure Resource Manager? 

- Azure Resource Manager (ARM) is the new regional deployment and management service for Azure.  

 

### What is the difference between Azure Service Manager (ASM) & Azure Resource Manager (ARM) ? What is the difference between classic deployment model and deployment using resource manager? 

- Classic deployment model uses ASM to manage deployments & resources. Deployment using Resource Manager uses Azure Resource Manager for deployments.  

- Classic vs resource manager document explains the difference between these two deployment models.  

 

### What are resources? What is the difference between classic & ARM resources? 

- Resource is a manageable item that is available through Azure. Virtual machines, storage accounts, web apps, databases, and virtual networks are examples of resources. Resource groups, subscriptions, management groups, and tags are all examples of resources. 

- Resources managed by ASM are called classic resources while resources managed by ARM are called ARM resources.  

- Each resource has a resource name to uniquely identify it. Template resource declaration uses these names to tell azure which resource to manage.  

- Cloud Services (classic): microsoft.classiccompute/domainnames, Cloud Services (extended support): microsoft.compute/cloudservices 

 

### What new features do I get immediately after migration? 

Cloud services customers get features like Template (Infrastructure as Code deployment model), Role based access control, ARM Policies for improved control on security & privacy, Resource Tagging, Private Links, Azure Firewall, Vnet Peering, Key Vault support, etc. Customers will continue getting newer improved VM sizes, quicker security & performance improvements, and newer ARM features.  

 

### Are there any pricing differences between Cloud Services (classic) and Cloud Services (extended support)

Customers are now charged for use of Key Vault, Dynamic IP address, Reserved (static) IP address.  

Public IP resources deployed through Resource Manager are charged differently. Dynamic IPs are also chargeable in addition to static public IPs. For more details on Public IP charges in ARM, refer here: https://azure.microsoft.com/en-in/pricing/details/ip-addresses/ 

 

### Do I get DNS name for my Cloud Services (extended support)? Will its default naming convention change? 

Yes , cloud services (extended support) can also be given a DNS name . With Azure Resource Manager, the DNS label is an optional property of the Public IP address that is assigned to the cloud service. The format of the DNS name for ARM based deployments as <userlabel>. <region>. cloudapp.azure.com 

 

### What is the difference between Cloud Services (classic) and Virtual Machines (classic)? 

ASM provides two compute offering/resources to customers. Virtual Machines (classic) (Aka classic VMs or classic IaaS VMs) is the IaaS offering and Cloud Services (classic) (Aka classic CS, classic PaaS VMs or Web/Worker Roles) is the PaaS offering.  

Virtual Machines (classic) has a resource name microsoft.classiccompute/virtualmachines and Cloud Services (classic) has a resource name microsoft.classiccompute/domainnames 

Deployments for both these resources lie within a logical entity called Hosted Service Name (Aka Cloud Service). This Cloud Service should not be confused with Cloud Services (classic)   

 

### I can’t find answer to my questions in any of the public documents. What should I do? 

Please check the Microsoft Q&A, Stack Overview or Github forum. If those forums don’t have the answers, please post your questions, someone from Microsoft will help answer your question.  

 

### The documentation is confusing / outdated. Between cloud services (classic) & cloud services (extended support) documentation, which should be considered as source of truth? 

Cloud Services (extended support) documents takes priority if there is conflict with Cloud Services (classic) documents. For features/scenarios that are not changing Cloud Services (classic) documents needs to be taken as source of truth.  

If there are errors/issues with documents, feel free to report the error using the feedback section of the document or via github links provided at top-right corner of the documents.  

 

 

## Technical FAQ

### Where can I see Cloud Services (Extended Support) deployments? 

Cloud Services (extended support) portal blade is the home to all information related to these deployments and its resources.  

 

### Does Portal support export template feature like for other compute products (Service Fabric & Web Apps)? 

Yes, Export Template is an ARM feature and available out-of-the-box. 	 

 

### Where can I read more about managing my cloud services (extended support) deployments via Portal? 

<Link to gaurav’s documents>  

 
### What is a template, parameter file and how are they related? 

Template and Parameters file is used to define your Azure Infrastructure as a code and automate deployment. Since template defines the azure architecture it can contain definition for multiple azure resources like Cloud Services, Virtual Machine Scale Sets, VNets, etc.  

Parameters file is used to inject custom values in the template like resource names, settings, etc. This enables customers to use one template file and replicate the cloud architecture across different environments and regions.  

Learn more about deployment using Templates.  

 

### What is the resource name for Cloud Services (classic) & Cloud Services (extended support)? 

Cloud Services (classic): microsoft.classiccompute/domainnames, 

Cloud Services (extended support): microsoft.compute/cloudservices 

 

### What is the template schema for resources like Cloud Services (Extended Support), Virtual Network, Public IP and Network Security Groups? 

Public documents on template schemas for all networking resources: Virtual Network, Public IP, Network Security Groups,  

Public document on template schemas for all compute resources: [Cloud Services (extended support)](Get link from Gaurav), Key Vault 

 

### Why do I need to define certain resources (eg: Public IP resource) under the resources section and also mention them within Network Profile section of microsoft.compute/cloudservices resource? 

To create or update a resource (like Pubilc IP, VNet), the definition for the resource is added under the resources section of the Template.  

Resource definition within resources section of the template is used to create or update that particular resource. 

Within Network Profile section, resources like the Public IP addresses are linked to the Cloud services resources. Eg: A public IP address is associated with the front-end of the load balancer within the network profile object of the Cloud Service.   

Therefore, if a resource like Vnet already exist and you need to only link it with your Cloud Service deployment, then you can either skip defining the Vnet resource or keep the definition ensuring its properties are unchanged. ARM will automatically ignore the Vnet resource definition if it has not changed.  

 

### How can I use a Template to deploy or manage my deployment.  

Template & Parameters file can be passed as a parameter via Rest API or PS/CLI command. It can also be uploaded via Portal to create/manage the deployment.   

 

### Between Template & Cscfg/Csdef who takes precedence on deployment definition and values? 

Both. If template is being used for deployment automation, then the information on Template and Cscfg/Csdef should match else deployment will fail.  

 

 

 

## Deployment Files (Cscfg, Csdef) FAQ

### What is changing in my existing deployment file? 

To make migration simpler, we ensured your existing deployment files do not change much.  

### Changes to Csdef: 

Replace name property of load balancer probe, Endpoints, Reserved IP, Public IP to now use fully qualified ARM resource name: 

/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName} 

Replace deprecated vm size with mentioned [alternate sizes](Get link for sizes doc from micah). Pricing does not change if the alternate sizes are used. 

 

Changes to Cscfg: 

Update the DNS name (Newer syntax: Get data from altaf) 

 

### Do I need to maintain 4 files (Template, parameter, Csdef, Cscfg) instead of only 2 file? 

Not necessarily. Template & parameter files are only used for deployment automation. Like before, you can still manually create dependent resources first and then a Cloud Services (extended support) deployment using PS/CLI commands.  

You can find details on a basic create operation in the [power shell quick starter](Tanmay to add link once available). 

 
## Cloud Services (Extended Support) Architecture & Features FAQ 

### Why don’t I see a production & staging slot deployment anymore? 

Unlike Cloud Services (classic), Cloud Services (extended support) do not support the logical concept of hosted service which included two slots (Production & Staging) slots. Each deployment is an independent Cloud Service (extended support) deployment.  

 

### How does this affect VIP Swap feature? 

During create of a new cloud service (extended support) deployment, you can define the deployment id of the deployment you want to swap with. This defines the VIP Swap relationship between two cloud services.  

 

### Why can’t I create an empty Cloud Service anymore? 

Since the concept of hosted service names do not exist anymore, you cannot create an empty cloud service without any deployment. Unfortunately, there is no alternate solution for this.  

If your current architecture used to create a ready to use environment with an empty cloud service and later provision a deployment, you can do something similar using Resource Groups. An ready to use environment can be created using Resource Groups and later cloud service deployments can be created when needed.  

 

### How are role & role instance metrics changing? 

There is no change in the role & role instance metrics reported on Portal.  

 

### How are Web & Worker roles changing? 

There is no change to the design, architecture and the components of Web & Worker roles.  

 

### How are role instances changing? 

Since the changes are only to the way deployment management used to happen, there is no change to the design, architecture, and the components of the role instances.  

 

## How will guest os updates change? 

Cloud Services (extended support) will continue to get regular guest os rollouts. There is no changes to the rollout method. Cloud Services (classic) & Cloud Services (extended support) will the same updates at a regular cadence.  

 

### Where will Cloud Services (extended support) be available? 

Cloud Services (extended support) is now available in all Public Cloud Regions. It will be available in sovereign clouds soon after General Available release.  

 

### What happens to my Quota? 

Customers will need to request for new quota on ARM using the same process used for any other compute product. Quota in ARM is regional unlike global in ASM. Therefore, a separate quota request needs to made for each region. Learn More about increasing region specific quota & VM Sku specific quota.  

 

### How do I RDP into my role instance? 

(Get details from arpit) 

 

### Will Visual studio be supported to create and update deployment? 

Yes, Visual Studio will provide a similar experience to create, update Cloud Services (extended support) deployments.  

[Learn More] about visual studio support for Cloud Services (extended support) 

 
### How does my application code change on Cloud Services (extended support) 

There is no change required for your application code packaged in Cspkg. Your existing applications should continue to work as before.  

 

### What resources are commonly linked to a cloud services (extended support) deployment? 

Availability Sets, Extensions, Key Vault, Alert Rules, Auto scale Rules, Managed Identity, Application Gateway, Application Security Groups, Azure Firewall, Express Route Circuits, Express Route Gateway, Load Balancers, Network Security Groups, Network Watcher, Private Endpoints, Private Links, Public IP Address, Route Tables, Service Endpoint Policies, Virtual Network Gateway, Virtual Networks, VPN Gateways, Resource Groups, Storage Accounts, Traffic Manager, Certificates.  

 

### What resources linked to a cloud services (extended support) deployment need to live in the same resource group? 

Storage Accounts, Public IP, Load balancer, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same region and resource group.  

 

### What resources linked to a cloud services (extended support) deployment need to live in the same region? 

Key Vault, Virtual Network, Public IP, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same region. 

 

### What resources linked to a cloud services (extended support) deployment need to live in the same virtual network? 

Public IP, Load balancer, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same virtual network.  

 

### Do Cloud Services (extended support) support Stopped Allocated and Stopped Deallocated states? 

Similar to Cloud Services (classic) deployment, Cloud Services (extended support) deployment only supports Stopped Allocated state which appears as stopped on Portal.  

Stopped Deallocated state is not supported.  

 

### Does Cloud Services (extended support) deployment support scaling across clusters, availability zones, and regions? 

No, Similar to Cloud Services (classic), Cloud Services (extended support) deployment cannot scale across multiple clusters, availability zones and regions.  

 

### Will Cloud Services (extended support) mitigate the failures due to Allocation failures? 

No, Cloud Service (extended support) deployments are tied to a cluster like Cloud Services (classic). Therefore, allocation failures will continue to exist if the cluster is full.  

 

 

 

## Networking Components FAQ

### Why can’t I create a deployment without virtual network? 

Virtual networks are a required resource for any deployment on ARM. Therefore, now cloud services (extended support) deployments must live inside a virtual network.  

 

### Why am I now seeing so many networking resources?  

In ARM, components of your cloud services (extended support) deployment are exposed as a resource for better visibility and improved control.  

Virtual Networks are now required unlike in ASM where they were optional.  

Load Balancer & Public IP will be read only.  

NSGs can be changed by customer.  

 

### What restrictions apply for a subnet with respective to Cloud Services (extended support) 

Subnet containing cloud services (extended support) deployment cannot be shared with deployment from other compute products like Virtual Machines, Virtual Machines Scale Set, Service Fabric. Etc.  

Customers need to use a different subnet in the same Virtual Network.  

This restrictions apply to both new virtual networks created on ARM and virtual networks migrated from ASM.  

 

### What IP allocation methods are supported on Cloud services (extended support)? 

Cloud Services (extended support) supports dynamic & statis IP allocation methods. Static IP address are referenced as reserved IP in Cscfg.  

 

### Why am I getting charged for IP addresses? 

Customers are billed for IP Address use on Cloud Services (extended support).  

 

### Why can’t I edit Load Balancer but can edit other networking resources? 

 

### What types of Load Balancers are supported on Cloud Services (extended support)? 

 

### How can I reuse the IP address from my old Cloud Services (classic) deployment? 

 

### What is the syntax for default DNS name, where is it defined and how can I use my custom DNS?  

 

### Will Networking Security Groups be exposed to customers to edit from Portal or using PS? 

Yes, Network Security Groups. This is the current experience both in RDFE and ARM. And customers need to be in control of their own security enforcement. 

 

 

 

## Certificates FAQ

### Why do I need to manage my certificates on Cloud Services (extended support)? 

Cloud Services (extended support) has adopted the same process as other compute offerings where certificates reside within customer owned Key Vault. This enables customers to have complete control over their secrets & certificates.  

Instead of uploading certificates during Cloud Services create via Portal/PS, customer just need to upload them to key vault and reference the key vault in the template or via PS command.  

Cloud Services (extended support) will search the referenced key vault for the certificates mentioned in the deployment files and use it. Thus, simplifying the deployment process.  

Customers also get immediate access to features provided by key vault like Monitor access & use, Simplified administration of application secrets and many more.  

 

### How can I create a Key Vault? 

Please go through these Quick Starters using Portal, Power shell & CLI.  

What are the charges for using Key Vault? 

Learn More about pricing for Key Vault.  

 

### Can I use one Key Vault for all my deployments in all regions? 

No, Key Vault is a regional resource and therefore you will need one Key Vault in each region.  

However, one Key Vault can be used for all deployments within a region. 

 

 

 

## Troubleshooting FAQ

### Does Cloud Services (extended support) support Resource Health Check (RHC)? 

No, Cloud Services (extended support) does not yet support Resource Health Check (RHC) 

 

### I am getting error during create/management of my cloud service (extended support) deployment. What should I do? 

Check what the error message says and what is the recommended mitigation steps. We recommend looking for answers on our public documents, FAQs and community forums like Microsoft Q&A, Stack Overflow and Github.  

If the above steps does not help find the answer, please contact support.  

If you have Basic support plan, we recommend upgrading to a better support plan. Community forums are available for you to post your questions/issues.  

We need our customers to provide us feedback, suggestions, and report bugs (in the product or documents) via our community forums. This helps us make your experience better going forward.  

 

 

 

## Migration FAQ

### How do I migrate my existing deployment to ARM? 

We recommend following steps: 

Read docs and understand what cloud services (extended support) has to offer. 

Identify all your subscriptions and create a catalog of all your Cloud Services (classic) deployments. You can use look at all your deployment on Cloud Services (classic) Portal blade or Resource Graph Explorer using Portal or Power shell.  

Understand the set of features used and blockers for migration 

Build a catalog of custom tools, automations, dashboard built that need to updated to start using newer APIs, PS/CLI commands & SDKs. 

Reach out to microsoft for assistance with migration if needed. (Support, Cloud Solution Architects, Technical Account Managers, Microsoft Q&A) 

Build a detailed migration plan and execution timeline.  

Start and complete migration. Customers can either do a lift & shift migration (create parallel deployment on ARM, thoroughly test the deployment, migrate traffic from old to new deployment) or migrate within microsoft provided migration tool (will be soon released).  

 

### What other compute products are available for migration and how to migrate? 

Customers have a range of offering for all workloads and scenarios available other than Cloud Services (extended support) for migration. The Choosing an Azure compute service document can help you get started.   

Migration to any of the other compute offering will mostly require changes to your architecture, application code and deployment files. Complexity of the migration will depend on complexity of your application, list of features unsupported on other products, volume of migration and many other factors.  

Migration process will look like any other migration: 

First, create a catalog of your deployments, list of features used, scenarios required and custom tools, automations, scripts, dashboard developed.  

Understand the features & scenarios supported on your new compute product and identify work around for blockers. This can be done through public documentation, community forums or using microsoft resources like Fast Track, Cloud Solution Architects, Technical Account Managers and Azure Migration Program.  

Define the migration plan and timeline. This definitely should include how to create a parallel deployment on your new compute product, how to test this new deployment and how to migrate traffic from old to new deployment.  

Execute on the migration. Many of the microsoft resources will work with you throughout the execution and provide help with blockers. Make sure to define detailed timeline with multiple intermediate milestones to track the progress.  

Celebrate the victory upon migration completion. You have just taken the first step towards a brighter, prosperous future.  

 

### Why do I need to migrate? 

ASM is built on an old cloud architecture and therefore has points of failure, low security & reliability compared to ARM, lower value for money & minimal scope of growth.  

Most Virtual Machines (classic) customers and many Cloud Services (classic) customers have either already migrated or are actively migrating their existing deployments to ARM.  

Since ASM customers are the early adopters of Azure, we value your business a lot and want the best tools and experience Azure has to offer.  

 

### Why do I need to migrate now especially when Cloud Services (extended support) is still in Preview? 

Estimating the time required, complexity and efforts for migration is very difficult due to influence of range of variables. We have seen big customers take anywhere from 3 months to 2 years to complete the migration.  

Planning is the most time consuming but the most effective step to understand the scope of work, blockers, complexity for migration and many other factors.  

We therefore ask all customers to at least build a catalog of features & scenarios used today, understand what different compute products have to offer, test migration on test deployments and define a detailed plan.  

If you want to migrate to other compute products, then there is nothing stopping you and can start the migration now.  

If Cloud Services (extended support) is the path for you, early start gives you an opportunity to raise blockers ensuring the product is ready for you immediately after general availability. 

 

### What Microsoft resources are available for me to migrate? 

Microsoft Q&A, Stack Overview, Github, Public documents are available for self-help content, community support and to ask microsoft for assistance. This is available for all customers. 

Microsoft Fast Track & Azure Migration Program can assist customers with planning and execution of migration. Dedicated microsoft personals work with customer throughout the migration. This is available for all customers. (Still onboarding AMP) 

Microsoft Support is available for technical assistance and to handle migration failures.  

 

 

 

 

New Questions or Questions needing review before adding to this document: 

 

 

### Why am I able to see a Load Balancer resource in my subscription and resource group? 

Cloud services (extended support) aims to give customers more control and/or visibility into their 	deployment. The load balancer is now an explicit 'read only' resource automatically created by the platform; customers only need to provide the load balancer name in the ARM template. 

 

### Why is a Virtual Network mandatory for my cloud service (extended support) deployments? 

Virtual Network (VNet) is a fundamental building block and isolation boundary in Azure for deployments created through the Resource Manager. Cloud service (extended support) deployments always need to be in a VNet, that must be referenced in the customers config (cscfg) file. 

 

### Can I use an existing ARM VNet for deploying cloud services (extended support)? 

Yes, you can. Cloud services (extended support) can be deployed either in a new VNet created in ARM or any existing VNet that has other resources deployed in the same VNet. However, you cannot mix cloud services in the same subnet as other native ARM resources. 

 

### Can I use an existing Reserved IP address (classic) to associate with a new cloud service (extended support) deployment? 

Cloud services (extended support) can only use 'Basic' SKU Public IPs in ARM. You can either create new or use an existing 'Basic' SKU public IP resource and reference it in the 'Reserved IP' section of the cscfg. If you wish to use an existing Reserved IP address (classic), you will first need to migrate it to ARM. 

 

### Do I get a DNS name for my cloud services (extended support)? 

Yes, cloud services (extended support) can also be given a DNS name . With Azure Resource Manager, the DNS label is an optional property of the Public IP address that is assigned to the cloud service. The format of the DNS name for ARM based deployments as <userlabel>.<region>. cloudapp.azure.com 

 

 