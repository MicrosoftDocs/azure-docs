---
title: Introduction to Azure Arc-enabled data services with Active Directory authentication
description: Introduction to Azure Arc-enabled data services with Active Directory authentication
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 12/15/2021
ms.topic: how-to
---

# Introduction to Azure Arc-enabled SQL Managed Instance with Active Directory authentication (Bring your own Keytab)

This article introduces Azure Arc-enabled SQL Managed Instance with Active Directory (AD) Authentication. It specifically talks about the "Bring your own Keytab (BYOK)" mode (a.k.a. manual mode) of deploying a SQL Managed Instance
where the user is expected to provide a pre-created Active Directory account, Service Principal Names and Keytab.

## Background

In order to support Active Directory authentication for SQL Managed Instance, we need to provide the SQL Managed Instance service an environment that allows it to communicate with the Active Directory domain.
To facilitate this, a new Custom Resource Kind called "Active Directory Connector" is introduced. An Active Directory Connector instance acts as a respresentation of an Active Directory domain.

In the BYOK mode, this custom resource deploys a DNS proxy service that mediates between the SQL Managed Instance DNS resolver and the two upstream DNS servers:

1. Kubernetes DNS servers
2. Active Directory DNS servers

When a SQL Managed Instance is deployed with Active Directory Authentication enabled, it will reference the Active Directory Connector instance it wants to use. Referencing the Active Directory Connector in SQL MI spec will
automatically set up the needed environment in the SQL Managed Instance container for SQL Server to perform Active Directory authentication.

## Active Directory Connector and SQL Managed Instance

![Actice Directory Connector](media/active-directory-deployment/active-directory-connector-byok.png)

## Bring Your Own Keytab (BYOK) mode expectations

In BYOK mode, the users are responsible for:

1. Creating and providing an Active Directory account for each SQL Managed Instance that must accept AD authentication.
1. Providing a DNS name belonging to the Active Directory DNS domain for the SQL Managed Instance endpoint.
1. Creating a DNS record in Active Directory for the SQL endpoint.
1. Providing a port number for the SQL Managed Instance endpoint.
1. Registering Service Principal Names (SPNs) under the AD account in Active Directory domain for the SQL endpoint.
1. Creating and providing a keytab file for SQL Managed Instance containing entries for the AD account and SPNs.

## Next steps

* [Deploying Active Directory (AD) Connector](deploy-active-directory-connector.md)
* [Deploying Arc-enabled SQL Managed Instance in Active Directory (AD) Manual Authentication mode](deploy-active-directory-sqlmi.md)
* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sqlmi.md)
