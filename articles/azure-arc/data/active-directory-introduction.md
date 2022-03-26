---
title: Introduction to Azure Arc-enabled data services with Active Directory authentication
description: Introduction to Azure Arc-enabled data services with Active Directory authentication
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 03/26/2022
ms.topic: how-to
---

# Introduction to Azure Arc-enabled SQL Managed Instance with Active Directory authentication 

This article describes Azure Arc-enabled SQL Managed Instance with Active Directory (AD) Authentication by bring your own keytab (BYOK) where the user is expected to provide a pre-created Active Directory account, Service Principal Names and Keytab.

## Background

Arc-enabled data services support Active Directory (AD) for Identity and Access Management (IAM).  The Arc-enabled SQL Managed instances uses an existing Active Directory (AD) for authentication. We recommend creating an organizational unit (OU) for better administration experience and an active directory user account (AD account) prior to the deployment. Users can following the following workflow to enable Active Directory authentication for SQL Managed Instance : 
- [Deploy data controller](create-data-controller-indirect-cli.md) 
- [Deploy AD connector](deploy-active-directory-connector.md) 
- [Deploy SQL Managed instances](deploy-active-directory-sql-managed-instance.md)

The following diagram shows how user proceed to enable Active Directory authentication for SQL Managed Instance :

![Actice Directory Deployment User journey](media/active-directory-deployment/active-directory-user-journey.png)

In order to enable Active Directory authentication for SQL Managed Instance, a SQL Managed Instance must be deployed in an environment that allows it to communicate with the Active Directory domain.
To facilitate this, Azure Arc introduces a new Kubernetes-native [Custom Resource Definition (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) called `Active Directory Connector`. You can specify this kind of resource in the CRD. An Active Directory Connector custom resource stores the information needed to enable connections to DNS and AD for purposes of authenticating users and service accounts.

This custom resource deploys a DNS proxy service that mediates between the SQL Managed Instance DNS resolver and the two upstream DNS servers:

1. Kubernetes DNS servers
2. Active Directory DNS servers

When a SQL Managed Instance is deployed with Active Directory Authentication enabled, it will reference the Active Directory Connector instance it wants to use. Referencing the Active Directory Connector in SQL MI spec will automatically set up the needed environment in the SQL Managed Instance container for SQL MI to perform Active Directory authentication. 

## Active Directory Connector and SQL Managed Instance

![Actice Directory Connector](media/active-directory-deployment/active-directory-connector-byok.png)

## Bring Your Own Keytab (BYOK) 

The following are the steps for user to set up:

1. Creating and providing an Active Directory account for each SQL Managed Instance that must accept AD authentication.
1. Providing a DNS name belonging to the Active Directory DNS domain for the SQL Managed Instance endpoint.
1. Creating a DNS record in Active Directory for the SQL endpoint.
1. Providing a port number for the SQL Managed Instance endpoint.
1. Registering Service Principal Names (SPNs) under the AD account in Active Directory domain for the SQL endpoint.
1. Creating and providing a keytab file for SQL Managed Instance containing entries for the AD account and SPNs.

## Automatic 
The following are the steps for user to set up:
1. Create an organizational unit (OU). 
2. User only need to Providing an Active Directory Domain service AD name and password for each SQL Managed Instance that must accept AD authentication.
3. Providing a port number for the SQL Managed Instance endpoint.


## What is the difference between  Bring Your Own Keytab (BYOK) and Automatic mode ?

To enable Active Directory Authentication for Arc-enabled SQL Managed Instances, you need an Active Directory (AD) connector where you dermine the nature of the AD deployment : Bring Your Own Keytab (BYOK) or Automatic. 

In the automatic mode, system will take care of the following work : 

- The service domain AD account is automatically generated based on the user input.
- The system sets SPNs automatically on that account.
- A keytab file is generated then transport to the SQL Managed instance.


## Next steps

* [Deploy Active Directory (AD) connector](deploy-active-directory-connector.md)
* [Deploy Azure Arc-enabled SQL Managed Instance in Active Directory (AD)](deploy-active-directory-sql-managed-instance.md)
* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md)
