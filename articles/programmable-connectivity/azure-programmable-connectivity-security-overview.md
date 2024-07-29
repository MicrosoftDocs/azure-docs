---
title: Overview of Security for Azure Programmable Connectivity
description: Azure Programmable Connectivity is a cloud service that provides a simple and uniform way for developers to access programmable networks, regardless of substrate or location.
author: anzaman
ms.author: alzam
ms.service: azure-programmable-connectivity
ms.topic: overview
ms.date: 01/08/2024
ms.custom: template-overview
---

# Overview of Security for Azure Programmable Connectivity

This article provides an overview of how encryption is used in Azure Programmable Connectivity. It covers the major areas of encryption, including encryption at rest and encryption in transit.

## Encryption at rest

Azure Programmable Connectivity (APC) stores all data at rest securely, including any temporary customer data. Azure Programmable Connectivity uses standard Azure infrastructure, with platform-managed encryption keys, to provide server-side encryption compliant with a range of security standards. For more information, see [encryption of data at rest.](../security/fundamentals/encryption-overview.md)

Azure Programmable Connectivity doesn't store any Customer Data or End-User Identifiable Information.

## Encryption in transit

All traffic handled by Azure Programmable Connectivity is encrypted. This encryption covers all internal communication and calls made to Operator premises.

HTTP traffic is encrypted using TLS, minimum version 1.2.

## Private connectivity

Currently Azure Programmable Connectivity doesn't offer the ability to call APC APIs completely within a private network. Azure Private Link integration is planned in future.

## Audit logging

There are two types of logs that are available to customers to audit their Azure Programmable Connectivity instances:
- Management logs
- Data plane logs

Management logs are the logs of management operations performed on Azure resources such as creation or deletion of APC gateway instances, adding new Operator API Connections and other.
To review actions performed on these resources, go to the corresponding resource page in Azure and select 'Activity log' in the left menu.

Data plane logs are the logs of actions that happen when any calls are made to the APC Gateway API, such as 'sim-swap:verify'. To request these logs a support request needs to be raised. Follow the standard Azure support flow selecting the gateway, which has the logs of interest. Choose 'Using Network APIs' for problem type, and 'Calling APIs' for problem sub-type. In the problem description, indicate that you'd like to request data plane audit logs.
