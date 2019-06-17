---
title: Common security attributes for Azure Service Bus Relay
description: A checklist of common security attributes for evaluating Azure Service Bus Relay
services: service-bus-relay
ms.service: service-bus-relay
documentationcenter: ''
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 04/23/2019
ms.author: mbaldwin

---
# Security attributes for Azure Service Bus Relay

This article documents the security attributes built into Azure Service Bus Relay.

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest:<ul><li>Server-side encryption</li><li>Server-side encryption with customer-managed keys</li><li>Other encryption features (such as client-side, always encrypted, etc.)</ul>|  N/A | Relay is a web socket and does not persist data. |
| Encryption in transit:<ul><li>Express route encryption</li><li>In VNet encryption</li><li>VNet-VNet encryption</ul>| Yes | Service requires TLS. |
| Encryption key handling (CMK, BYOK, etc.)| No | Uses Microsoft TLS certs only.  |
| Column level encryption (Azure Data Services)| N/A | |
| API calls encrypted| Yes | HTTPS. |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No |  |
| Network isolation and firewalling support| No |  |
| Forced tunneling support| N/A | Relay is the TLS tunnel  |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Via SAS. |
| Authorization|  Yes | Via SAS. |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml). |
| Data plane logging and audit| Yes | Connection success / failure and errors and logged.  |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes | Through [Azure Resource Manager](../azure-resource-manager/index.yml).|
