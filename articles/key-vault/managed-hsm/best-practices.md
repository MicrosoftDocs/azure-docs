---
title: Best Practices to use Key Vault - Azure Key Vault | Microsoft Docs
description: This document explains some of the best practices to use Key Vault
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 03/07/2019
ms.author: mbaldwin
# Customer intent: As a developer using Key Vault I want to know the best practices so I can implement them.
---
# Best practices using Managed HSM

## Control Access to your Managed HSM

Managed HSM is a cloud service that safeguards encryption keys. Because keys are sensitive and business critical, you need to secure access to your HSM's by allowing only authorized applications and users. This [article](accerss-control.md) provides an overview of the access model. It explains authentication and authorization, and role-based access control.

Suggestions while controlling access to your vault are as follows:
1. Lock down access to your subscription, resource group and Managed HSMs (RBAC)
2. Create Access policies for every HSM
3. Use least privilege access principal to grant access
4. Turn on Firewall and [VNET Service Endpoints](vnet-service-endpoints.md)

## Backup

Make sure you take regular back ups of your HSM.

## Turn on Logging

[Turn on logging](logging.md) for your HSM. Also set up alerts.

## Turn on recovery options

1. Turn on [Soft Delete](soft-delete-overview.md).
2. Turn on purge protection if you want to guard against force deletion of the HSM even after soft delete is turned on.
