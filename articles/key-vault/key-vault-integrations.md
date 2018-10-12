
---
ms.assetid:
title: Azure Key Vault Storage Account Keys
description: Storage account keys provide a seemless integration between Azure Key Vault and key based access to Azure Storage Account.
ms.topic: conceptual
services: key-vault
ms.service: key-vault
author: prashanthyv
ms.author: prashanthyv
manager: ravijan
ms.date: 10/08/2018
---
Integrations with Azure Key Vault
 
There are three types of integrations, in order from most basic to most secure with Azure Key Vault.
1.	Services that take secrets (certificates, connection strings etc) by value from their customers, as part of their ARM API are listed below.
ARM, via templates, enables customers to supply such secrets via AKV. Examples of such integration are:
    -	Customer can supply admin password for a VM they create, via AKV.
    -	Customer can supply admin password for a SQL DB they create, via AKV.
2.	For additional security, services that take secrets (certificates, connection strings etc) directly from customers’ key vaults are listed below. With a few exceptions (that we are pushing to close), these services also keep refreshing the value, so that the customer can rotate their secrets in a central place (their key vault). 
    -	Customer can supply certificates to Azure VMs.
    -	Customers can supply certificates to Azure Web Apps.
    -	Customers can supply certificates to Azure Functions.
    -	Customers can supply certificates to Azure API Management.
    -	Customers can supply certificates to Azure App Gateways (preview).
    -	Customers can supply secrets to AKS containers.
    -	Customers can supply secrets to Azure Data Factory scopes.
3.	For highest security, services that take keys via reference from customers’ key vaults.They call into AKV for decrypt/sign operations with the key, so the key never leaves AKV. 
    -	Customer-managed key for Azure Disk Encryption (VMs).
    -	Customer-managed key for Azure Storage blobs and files.
    -	Customer-managed key for Azure SQL DB.
    -	Customer-managed key for Azure Data Lake stores.
    -	Customer-managed key for Azure Information Protection.
    -	Customer key for Exchange Online
    -	Customer key for SharePoint Online
    