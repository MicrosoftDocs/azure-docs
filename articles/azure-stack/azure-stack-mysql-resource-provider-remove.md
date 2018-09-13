---
title: Removing the MySQL resource provider on Azure Stack | Microsoft Docs
description: Learn how you can remove the MySQL resource provider from your Azure Stack deployment.
services: azure-stack
documentationCenter: ''
author: jeffgilb
manager: femila
editor: ''
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/13/2018
ms.author: jeffgilb
ms.reviewer: jeffgo

---

# Remove the MySQL resource provider

Before you remove the MySQL resource provider, you must remove all the provider dependencies. You'll also need a copy of the deployment package that was used to install the resource provider.

## Dependency cleanup

There are several cleanup tasks to do before you run the DeployMySqlProvider.ps1 script to remove the resource provider.

The tenants are responsible for the following cleanup tasks:

* Delete all their databases from the resource provider. (Deleting the tenant databases doesn't delete the data.)
* Unregister from the provider namespace.

The administrator is responsible for the following cleanup tasks:

* Deletes the hosting servers from the MySQL Adapter.
* Deletes any plans that reference the MySQL Adapter.
* Deletes any quotas that are associated with the MySQL Adapter.

## To remove the MySQL resource provider

1. Verify that you've removed all the existing MySQL resource provider dependencies.

   >[!NOTE]
   >Uninstalling the MySQL resource provider will proceed even if dependent resources are currently using the resource provider.
  
2. Get a copy of the MySQL resource provider binary and then run the self-extractor to extract the contents to a temporary directory.
3. Get a copy of the SQL resource provider binary and then run the self-extractor to extract the contents to a temporary directory.
4. Open a new elevated PowerShell console window and change to the directory where you extracted the MySQL resource provider binary files.
5. Run the DeployMySqlProvider.ps1 script using the following parameters:
    - **Uninstall**. Removes the resource provider and all associated resources.
    - **PrivilegedEndpoint**. The IP address or DNS name of the privileged endpoint.
    - **AzureEnvironment**. The Azure environment used for deploying Azure Stack. Required only for Azure AD deployments.
    - **CloudAdminCredential**. The credential for the cloud administrator, necessary to access the privileged endpoint.
    - **DirectoryTenantID**
    - **AzCredential**. The credential for the Azure Stack service admin account. Use the same credentials that you used for deploying Azure Stack.

## Next steps

[Offer App Services as PaaS](azure-stack-app-service-overview.md)
