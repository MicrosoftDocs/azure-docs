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

# Frequently asked questions for Cloud Services (extended support)

## What new features do I get immediately after migration?
Cloud services customers get features like Template (Infrastructure as Code deployment model), Role based access control, ARM Policies for improved control on security & privacy, Resource Tagging, Private Links, Azure Firewall, Vnet Peering, Key Vault support, etc. Customers will continue getting newer improved VM sizes, quicker security & performance improvements, and newer ARM features. 

## Are there any pricing differences     
Customers are now charged for use of Key Vault, Dynamic IP address, Reserved (static) IP address. 

Public IP resources deployed through Resource Manager are charged differently. Dynamic IPs are also chargeable in addition to static public IPs. For more details on Public IP charges in ARM, refer here: https://azure.microsoft.com/en-in/pricing/details/ip-addresses/

## Do I get DNS name for my Cloud Services (extended support)? Will its default naming convention change?  
Yes, cloud services (extended support) can also be given a DNS name . With Azure Resource Manager, the DNS label is an optional property of the Public IP address that is assigned to the cloud service. The format of the DNS name for ARM based deployments as <userlabel>. <region>. cloudapp.azure.com

## What is the resource name for Cloud Services (classic) & Cloud Services (extended support)?
- Cloud Services (classic): microsoft.classiccompute/domainnames,
- Cloud Services (extended support): microsoft.compute/cloudservices

## What is the template schema for resources like Cloud Services (Extended Support), Virtual Network, Public IP and Network Security Groups?
a.	Public documents on template schemas for all networking resources: Virtual Network, Public IP, Network Security Groups, 
b.	Public document on template schemas for all compute resources: [Cloud Services (extended support)]  (Get link from Gaurav), Key Vault

## Why do I need to define certain resources (eg: Public IP resource) under the resources section and also mention them within Network Profile section of microsoft.compute/cloudservices resource?
a.	To create or update a resource (like Pubilc IP, VNet), the definition for the resource is added under the resources section of the Template. 
b.	Resource definition within resources section of the template is used to create or update that particular resource.
c.	Within Network Profile section, resources like the Public IP addresses are linked to the Cloud services resources. Eg: A public IP address is associated with the front-end of the load balancer within the network profile object of the Cloud Service.  
d.	Therefore, if a resource like Vnet already exist and you need to only link it with your Cloud Service deployment, then you can either skip defining the Vnet resource or keep the definition ensuring its properties are unchanged. ARM will automatically ignore the Vnet resource definition if it has not changed.  

## How can I use a Template to deploy or manage my deployment. 
a.	Template & Parameters file can be passed as a parameter via Rest API or PS/CLI command. It can also be uploaded via Portal to create/manage the deployment.  

##	Between Template & Cscfg/Csdef who takes precedence on deployment definition and values?
a.	Both. If template is being used for deployment automation, then the information on Template and Cscfg/Csdef should match else deployment will fail. 

## What is changing in my existing deployment file?
a.	To make migration simpler, we ensured your existing deployment files do not change much. 
b.	Changes to Csdef:  
i.	Replace name property of load balancer probe, Endpoints, Reserved IP, Public IP to now use fully qualified ARM resource name:
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
ii.	Replace deprecated vm size with mentioned [alternate sizes](Get link for sizes doc from micah  ). Pricing does not change if the alternate sizes are used.

c.	Changes to Cscfg:
i.	Update the DNS name (Newer syntax: Get data from altaf )

## 	Do I need to maintain 4 files (Template, parameter, Csdef, Cscfg) instead of only 2 file?
a.	Not necessarily. Template & parameter files are only used for deployment automation. Like before, you can still manually create dependent resources first and then a Cloud Services (extended support) deployment using PS/CLI commands. 
b.	You can find details on a basic create operation in the [power shell quick starter](Tanmay to add link once available).

## Why don’t I see a production & staging slot deployment anymore?
Unlike Cloud Services (classic), Cloud Services (extended support) do not support the logical concept of hosted service which included two slots (Production & Staging) slots. Each deployment is an independent Cloud Service (extended support) deployment. 

## How does this affect VIP Swap feature?
During create of a new cloud service (extended support) deployment, you can define the deployment id of the deployment you want to swap with. This defines the VIP Swap relationship between two cloud services. 

## Why can’t I create an empty Cloud Service anymore?
Since the concept of hosted service names do not exist anymore, you cannot create an empty cloud service without any deployment.

If your current architecture used to create a ready to use environment with an empty cloud service and later provision a deployment, you can do something similar using Resource Groups. An ready to use environment can be created using Resource Groups and later cloud service deployments can be created when needed. 

## How are role & role instance metrics changing?
There is no change in the role & role instance metrics reported on Portal. 

## How are Web & Worker roles changing?
There is no change to the design, architecture and the components of Web & Worker roles. 

## How are role instances changing?
Since the changes are only to the way deployment management used to happen, there is no change to the design, architecture, and the components of the role instances. 

## How will guest os updates change?
Cloud Services (extended support) will continue to get regular guest os rollouts. There is no changes to the rollout method. Cloud Services (classic) & Cloud Services (extended support) will the same updates at a regular cadence. 

##	Where will Cloud Services (extended support) be available?
Cloud Services (extended support) is now available in all Public Cloud Regions. It will be available in sovereign clouds soon after General Available release. 

##	What happens to my Quota?
Customers will need to request for new quota on ARM using the same process used for any other compute product. Quota in ARM is regional unlike global in ASM. Therefore, a separate quota request needs to made for each region. Learn More about increasing region specific quota & VM Sku specific quota. 


##	How does my application code change on Cloud Services (extended support)
There is no change required for your application code packaged in Cspkg. Your existing applications should continue to work as before. 

##	What resources linked to a cloud services (extended support) deployment need to live in the same resource group  ?
Storage Accounts, Public IP, Load balancer, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same region and resource group. 

##	What resources linked to a cloud services (extended support) deployment need to live in the same region ?
a.	Key Vault, Virtual Network, Public IP, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same region.

##	What resources linked to a cloud services (extended support) deployment need to live in the same virtual network?
Public IP, Load balancer, Cloud Services (extended support) deployment, NSGs, Route Tables need to live in the same virtual network. 

##	Do Cloud Services (extended support) support Stopped Allocated and Stopped Deallocated states?

Similar to Cloud Services (classic) deployment, Cloud Services (extended support) deployment only supports Stopped Allocated state which appears as stopped on Portal. 

Stopped Deallocated state is not supported. 

##	Does Cloud Services (extended support) deployment support scaling across clusters, availability zones, and regions?
No, Similar to Cloud Services (classic), Cloud Services (extended support) deployment cannot scale across multiple clusters, availability zones and regions. 

## Will Cloud Services (extended support) mitigate the failures due to Allocation failures?
No, Cloud Service (extended support) deployments are tied to a cluster like Cloud Services (classic). Therefore, allocation failures will continue to exist if the cluster is full. 

##	Why can’t I create a deployment without virtual network?
Virtual networks are a required resource for any deployment on ARM. Therefore, now cloud services (extended support) deployments must live inside a virtual network. 

##	Why am I now seeing so many networking resources? 
In ARM, components of your cloud services (extended support) deployment are exposed as a resource for better visibility and improved control. 

##	What restrictions apply for a subnet with respective to Cloud Services (extended support)
aSubnet containing cloud services (extended support) deployment cannot be shared with deployment from other compute products like Virtual Machines, Virtual Machines Scale Set, Service Fabric. Etc. 

Customers need to use a different subnet in the same Virtual Network. 

This restrictions apply to both new virtual networks created on ARM and virtual networks migrated from ASM. 

##	What IP allocation methods are supported on Cloud services (extended support)?
Cloud Services (extended support) supports dynamic & statis IP allocation methods. Static IP address are referenced as reserved IP in Cscfg. 

##	Why am I getting charged for IP addresses?
Customers are billed for IP Address use on Cloud Services (extended support). 

##	Will Networking Security Groups be exposed to customers to edit from Portal or using PS?
Yes, Network Security Groups. This is the current experience both in RDFE and ARM. And customers need to be in control of their own security enforcement.



##	Why do I need to manage my certificates on Cloud Services (extended support)?
a.	Cloud Services (extended support) has adopted the same process as other compute offerings where certificates reside within customer owned Key Vault. This enables customers to have complete control over their secrets & certificates. 
b.	Instead of uploading certificates during Cloud Services create via Portal/PS, customer just need to upload them to key vault and reference the key vault in the template or via PS command. 
c.	Cloud Services (extended support) will search the referenced key vault for the certificates mentioned in the deployment files and use it. Thus, simplifying the deployment process. 
d.	Customers also get immediate access to features provided by key vault like Monitor access & use, Simplified administration of application secrets and many more. 


##	Can I use one Key Vault for all my deployments in all regions?
No, Key Vault is a regional resource and therefore you will need one Key Vault in each region. However, one Key Vault can be used for all deployments within a region.

##	Does Cloud Services (extended support) support Resource Health Check (RHC)?
No, Cloud Services (extended support) does not yet support Resource Health Check (RHC)

##	I am getting error during create/management of my cloud service (extended support) deployment. What should I do?
a.	Check what the error message says and what is the recommended mitigation steps. We recommend looking for answers on our public documents, FAQs and community forums like Microsoft Q&A, Stack Overflow and Github. 
b.	If the above steps does not help find the answer, please contact support. 
c.	If you have Basic support plan, we recommend upgrading to a better support plan. Community forums are available for you to post your questions/issues. 
d.	We need our customers to provide us feedback, suggestions, and report bugs (in the product or documents) via our community forums. This helps us make your experience better going forward. 

##	How do I migrate my existing deployment to ARM?
a.	We recommend following steps:
i.	Read docs and understand what cloud services (extended support) has to offer.
ii.	Identify all your subscriptions and create a catalog of all your Cloud Services (classic) deployments. You can use look at all your deployment on Cloud Services (classic) Portal blade or Resource Graph Explorer using Portal or Power shell. 
iii.	Understand the set of features used and blockers for migration
iv.	Build a catalog of custom tools, automations, dashboard built that need to updated to start using newer APIs, PS/CLI commands & SDKs.
v.	Reach out to microsoft for assistance with migration if needed. (Support, Cloud Solution Architects, Technical Account Managers, Microsoft Q&A)
vi.	Build a detailed migration plan and execution timeline. 
vii.	Start and complete migration. Customers can either do a lift & shift migration (create parallel deployment on ARM, thoroughly test the deployment, migrate traffic from old to new deployment) or migrate within microsoft provided migration tool (will be soon released).  


##	Why do I need to migrate?
1.	ASM is built on an old cloud architecture and therefore has points of failure, low security & reliability compared to ARM, lower value for money & minimal scope of growth. 
2.	Most Virtual Machines (classic) customers and many Cloud Services (classic) customers have either already migrated or are actively migrating their existing deployments to ARM. 
3.	Since ASM customers are the early adopters of Azure, we value your business a lot and want the best tools and experience Azure has to offer. 

##	Why do I need to migrate now especially when Cloud Services (extended support) is still in Preview?
a.	Estimating the time required, complexity and efforts for migration is very difficult due to influence of range of variables. We have seen big customers take anywhere from 3 months to 2 years to complete the migration. 
b.	Planning is the most time consuming but the most effective step to understand the scope of work, blockers, complexity for migration and many other factors. 
c.	We therefore ask all customers to at least build a catalog of features & scenarios used today, understand what different compute products have to offer, test migration on test deployments and define a detailed plan. 
d.	If you want to migrate to other compute products, then there is nothing stopping you and can start the migration now. 
e.	If Cloud Services (extended support) is the path for you, early start gives you an opportunity to raise blockers ensuring the product is ready for you immediately after general availability.


