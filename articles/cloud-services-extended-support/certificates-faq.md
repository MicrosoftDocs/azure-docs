---
title: Cloud Services (extended support) Certificates
description: Frequently asked questions for Cloud Services (extended support) Certificates
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---


# Cloud Services (extended support) Certificates 

Frequently asked questions related to Cloud Services (extended support) certificates.

## Why do I need to manage my certificates on Cloud Services (extended support)? 

Cloud Services (extended support) has adopted the same model as other compute offerings where certificates reside within a customer owned Key Vault. This model enables customers to have complete control over their secrets & certificates.  

Instead of uploading certificates during Cloud Services create via Portal/PowerShell, customer just need to upload them to key vault and reference the key vault in the template or PowerShell command.  

Cloud Services (extended support) will search the referenced key vault for the certificates mentioned in the deployment files and use it. Thus, simplifying the deployment process.  

Customers also get immediate access to features provided by key vault like Monitor access & use, Simplified administration of application secrets and many more.  

## How can I create a Key Vault? 

For more information, see [Create a key vault using the Azure portal](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal)

## What are the charges for using Key Vault? 

For more information, see [Azure Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/)

## Can I use one Key Vault for all my deployments in all regions? 

No. Azure key vault is a regional resource and customer will need to deploy a key vault resource in each region as needed. A single key vault can be used for all deployments within a single region. 
