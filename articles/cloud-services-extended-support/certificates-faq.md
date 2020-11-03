---
title: Cloud Services (extended support) Certificates
description: Frequently asked questions for Cloud Services (extended support)
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---


# Certificates 

Frequently asked questions related to Cloud Services (extended support) certificates.


## Why do I need to manage my certificates on Cloud Services (extended support)? 

Cloud Services (extended support) has adopted the same process as other compute offerings where certificates reside within customer owned Key Vault. This enables customers to have complete control over their secrets & certificates.  

Instead of uploading certificates during Cloud Services create via Portal/PS, customer just need to upload them to key vault and reference the key vault in the template or via PS command.  

Cloud Services (extended support) will search the referenced key vault for the certificates mentioned in the deployment files and use it. Thus, simplifying the deployment process.  

Customers also get immediate access to features provided by key vault like Monitor access & use, Simplified administration of application secrets and many more.  

## How can I create a Key Vault? 

Please go through these Quick Starters using Portal, Power shell & CLI.  

What are the charges for using Key Vault? 

Learn More about pricing for Key Vault.  

## Can I use one Key Vault for all my deployments in all regions? 

No, Key Vault is a regional resource and therefore you will need one Key Vault in each region.  

However, one Key Vault can be used for all deployments within a region. 
