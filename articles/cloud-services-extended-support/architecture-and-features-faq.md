---
title: Cloud Services (extended support) Architecture & Features
description: Frequently asked questions for Cloud Services (extended support) related to architecture and features
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Cloud Services (extended support) architecture & features  

This article covers frequently asked questions related to Cloud Services (extended support) architecture and features.


## Why don’t I see a production & staging slot deployment anymore? 

Unlike Cloud Services (classic), Cloud Services (extended support) do not support the logical concept of hosted service, which included two slots (Production & Staging) slots. Each deployment is an independent Cloud Service (extended support) deployment.  

## How does this affect VIP Swap feature? 

During creation of a new Cloud Service (extended support), you can define the deployment ID you want to swap with. This defines the VIP swap relationship between the two Cloud Services.  

## Why can’t I create an empty Cloud Service anymore? 

The concept of hosted service names no longer exist. Users cannot create an empty Cloud Service. 

If your current architecture used to create a ready to use environment with an empty Cloud Service and later provision a deployment, you can do something similar using Resource Groups instead and at a later point, Cloud Service deployments can be created.  

## How are role & role instance metrics changing? 

There is no change in the role & role instance metrics reported on Azure portal.  

## How are Web & Worker roles changing? 

There is no change to the design, architecture and the components of Web & Worker roles.  

## How are role instances changing? 

There is no change to the design, architecture and the components of the role instances.  