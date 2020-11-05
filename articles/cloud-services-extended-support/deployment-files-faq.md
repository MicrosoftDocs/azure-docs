---
title: Cloud Services (extended support) Deployment Files
description: Frequently asked questions for Cloud Services (extended support) Deployment Files
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
--- 

# Deployment Files (Cscfg, Csdef) 

Frequently asked questions related to Cloud Services (extended support) deployment files.


## What is changing in my existing deployment file? 

To make migration simpler, we ensured your existing deployment files do not change much.  

## Changes to Csdef: 

Replace name property of load balancer probe, Endpoints, Reserved IP, Public IP to now use fully qualified ARM resource name: 

`/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`

Replace deprecated vm size with mentioned [alternate sizes](Get link for sizes doc from micah). Pricing does not change if the alternate sizes are used. 

## Changes to Cscfg: 

Update the DNS name 

## Do I need to maintain 4 files (Template, parameter, Csdef, Cscfg) instead of only 2 file? 

Not necessarily. Template & parameter files are only used for deployment automation. Like before, you can still manually create dependent resources first and then a Cloud Services (extended support) deployment using PS/CLI commands.  

You can find details on a basic create operation in the [PowerShell quick starter](). 

