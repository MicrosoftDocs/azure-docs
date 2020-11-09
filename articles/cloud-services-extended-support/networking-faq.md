---
title: Cloud Services (extended support) Networking Components
description: Frequently asked questions for Cloud Services (extended support) Networking Components
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Cloud Services (extended support) Networking Components 

This article covers frequently asked questions related to Cloud Services (extended support) networking components.

## Why can’t I create a deployment without virtual network? 

Virtual networks are a required resource for any deployment on ARM. Therefore, now cloud services (extended support) deployments must live inside a virtual network.  

## Why am I now seeing so many networking resources?  

In ARM, components of your cloud services (extended support) deployment are exposed as a resource for better visibility and improved control.  

Virtual Networks are now required unlike in ASM where they were optional.  

Load Balancer & Public IP will be read only.  

NSGs can be changed by customer.  

## What restrictions apply for a subnet with respective to Cloud Services (extended support) 

Subnet containing cloud services (extended support) deployment cannot be shared with deployment from other compute products like Virtual Machines, Virtual Machines Scale Set, Service Fabric. Etc.  

Customers need to use a different subnet in the same Virtual Network.  

These restrictions apply to both new virtual networks created on ARM and virtual networks migrated from ASM.  

## What IP allocation methods are supported on Cloud services (extended support)? 

Cloud Services (extended support) supports dynamic & static IP allocation methods. Static IP address are referenced as reserved IP in Cscfg.  

## Why am I getting charged for IP addresses? 

Customers are billed for IP Address use on Cloud Services (extended support).  

## Will Networking Security Groups be exposed to customers to edit from Portal or using PowerShell? 

Yes, Network Security Groups. This is the current experience both in RDFE and ARM. And customers need to be in control of their own security enforcement. 
