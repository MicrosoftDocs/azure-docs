---
title: Using SQL databases on Azure Stack | Microsoft Docs
description: Learn how you can deploy SQL databases as a service on Azure Stack and the quick steps to deploy the SQL Server resource provider adapter.
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
ms.date: 05/01/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
---

# Remove the SQL resource provider

To remove the SQL resource provider, it is essential to first remove any dependencies:

1. Ensure that you have the original deployment package that you downloaded for this version of the SQL resource provider adapter.

2. All user databases must be deleted from the resource provider. (Deleting the user databases doesn't delete the data.) This task should be performed by the users themselves.

3. The administrator must delete the hosting servers from the SQL resource provider adapter.

4. The administrator must delete any plans that reference the SQL resource provider adapter.

5. The administrator must delete any SKUs and quotas that are associated with the SQL resource provider adapter.

6. Rerun the deployment script with the following elements:
    - The -Uninstall parameter
    - The Azure Resource Manager endpoints
    - The DirectoryTenantID
    - The credentials for the service administrator account

