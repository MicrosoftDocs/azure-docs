---
title: Introduction to Azure Arc-enabled data services with Active Directory authentication
description: Introduction to Azure Arc-enabled data services with Active Directory authentication
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: cloudmelon
ms.author: melqin
ms.reviewer: mikeray
ms.date: 04/05/2022
ms.topic: how-to
---

# Azure Arc-enabled SQL Managed Instance with Active Directory authentication 

This article describes how to enable Azure Arc-enabled SQL Managed Instance with Active Directory (AD) Authentication. The article demonstrates two possible integration modes: 
-  Bring your own keytab mode 
-  Automatic mode 

In Active Directory, the integration mode describes the management the keytab file.

## Background

Azure Arc-enabled data services support Active Directory (AD) for Identity and Access Management (IAM). The Arc-enabled SQL Managed instances uses an existing on-premises Active Directory (AD) domain for authentication. Users need to do the following steps to enable Active Directory authentication for Arc-enabled SQL Managed Instance: 

- [Deploy data controller](create-data-controller-indirect-cli.md) 
- [Deploy a bring your own keytab AD connector](deploy-byok-active-directory-connector.md) or [Deploy an automatic AD connector](deploy-automatic-active-directory-connector.md)
- [Deploy managed instances](deploy-active-directory-sql-managed-instance.md)

The following diagram shows how to enable Active Directory authentication for Azure Arc-enabled SQL Managed Instance:

![Actice Directory Deployment User journey](media/active-directory-deployment/active-directory-user-journey.png)


## What is an Active Directory (AD) connector?

In order to enable Active Directory authentication for SQL Managed Instance, the managed instance must be deployed in an environment that allows it to communicate with the Active Directory domain. 

To facilitate this, Azure Arc-enabled data services introduces a new Kubernetes-native [Custom Resource Definition (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) called `Active Directory Connector`, it provide Azure Arc-enabled managed instances running on the same data controller the ability to perform Active Directory authentication.


## What is the difference between a bring your own keytab Active Directory (AD) connector and Automatic Active Directory (AD) connector ?

To enable Active Directory Authentication for Arc-enabled SQL Managed Instances, you need an Active Directory (AD) connector where you determine the mode of the AD deployment. The two modes are bring your own keytab or Automatic. 

### Bring your own keytab mode

In this mode, you provide:
 
- A pre-created Active Directory (AD) account prior to the AD deployment
- Service Principal Names (SPNs) under that AD account
- Your own [keytab file](/sql/linux/sql-server-linux-ad-auth-understanding#what-is-a-keytab-file)

When you deploy the bring your own keytab AD connector, you need to create the AD account, register the service principal names (SPN), and create the keytab file. You can create the account using [Active Directory utility (adutil)](/sql/linux/sql-server-linux-ad-auth-adutil-introduction).

For more information, see [deploy a bring your own keytab Active Directory (AD) connector](deploy-automatic-active-directory-connector.md)

### Automatic mode

In automatic mode, you need an automatic Active Directory (AD) connector. You will bring an Organizational Unit (OU) and an AD domain service account has sufficient permissions in the Active Directory. 

Furthermore, the system:

- Creates a domain service AD account for each managed instance.
- Sets SPNs automatically on that AD account.
- Creates and delivers a keytab file to the managed instance.

The mode of the AD connector is determined by the value of `spec.activeDirectory.serviceAccountProvisioning`. Set to either `bring your own keytab` or `automatic`. Once this parameter is set to automatic, the following parameter becomes mandatory too : 
- `spec.activeDirectory.ouDistinguishedName`
- `spec.activeDirectory.domainServiceAccountSecret`

When you deploy SQL Managed Instance with the intention to enable Active Directory Authentication, the deployment needs to reference the Active Directory Connector instance to use. Referencing the Active Directory Connector in managed instance specification automatically sets up the needed environment in the SQL Managed Instance container for the managed instance to authenticate with Active Directory. 

## Next steps

* [Deploy an bring your own keytab Active Directory (AD) connector](deploy-byok-active-directory-connector.md)
* [Deploy an automatic Active Directory (AD) connector](deploy-automatic-active-directory-connector.md)
* [Deploy Azure Arc-enabled SQL Managed Instance in Active Directory (AD)](deploy-active-directory-sql-managed-instance.md)
* [Connect to AD-integrated Azure Arc-enabled SQL Managed Instance](connect-active-directory-sql-managed-instance.md)
