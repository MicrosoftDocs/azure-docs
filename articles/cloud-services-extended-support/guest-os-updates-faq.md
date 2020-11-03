---
title: Cloud Services (extended support) Guest OS Changes
description: Frequently asked questions for Cloud Services (extended support)
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Guest OS Changes

Frequently asked questions related to Cloud Services (extended support) Guest OS changes.


## How will guest os updates change? 

Cloud Services (extended support) will continue to get regular guest os rollouts. There is no changes to the rollout method. Cloud Services (classic) & Cloud Services (extended support) will the same updates at a regular cadence.  

## Where will Cloud Services (extended support) be available? 

Cloud Services (extended support) is now available in all Public Cloud Regions. It will be available in sovereign clouds soon after General Available release.  

## What happens to my Quota? 

Customers will need to request for new quota on ARM using the same process used for any other compute product. Quota in ARM is regional unlike global in ASM. Therefore, a separate quota request needs to made for each region. Learn More about increasing region specific quota & VM Sku specific quota.  

## How do I RDP into my role instance? 

NEEDS INFORMATION

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

