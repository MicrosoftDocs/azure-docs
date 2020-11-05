---
title: Cloud Services (extended support) Architecture & Features
description: Frequently asked questions for Cloud Services (extended support)
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Cloud Services (extended support) Architecture & Features  

Frequently asked questions related to Cloud Services (extended support) architecture and features.


## Why don’t I see a production & staging slot deployment anymore? 

Unlike Cloud Services (classic), Cloud Services (extended support) do not support the logical concept of hosted service, which included two slots (Production & Staging) slots. Each deployment is an independent Cloud Service (extended support) deployment.  

## How does this affect VIP Swap feature? 

During create of a new cloud service (extended support) deployment, you can define the deployment ID of the deployment you want to swap with. This defines the VIP Swap relationship between two cloud services.  

## Why can’t I create an empty Cloud Service anymore? 

The concept of hosted service names no longer exist. Users cannot create an empty cloud service without any deployment. 

If your current architecture used to create a ready to use environment with an empty cloud service and later provision a deployment, you can do something similar using Resource Groups. A ready to use environment can be created using Resource Groups and later cloud service deployments can be created when needed.  

## How are role & role instance metrics changing? 

There is no change in the role & role instance metrics reported on Portal.  

## How are Web & Worker roles changing? 

There is no change to the design, architecture and the components of Web & Worker roles.  

## How are role instances changing? 

Since the changes are only to the way deployment management used to happen, there is no change to the design, architecture, and the components of the role instances.  