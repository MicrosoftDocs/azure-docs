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
ms.date: 05/24/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
---

# Remove the SQL resource provider
To remove the SQL resource provider:

1. Remove any existing SQL resource provider dependencies.

  > [!NOTE]
  > Uninstalling the SQL resource provider will proceed even if dependent resources are currently using the resource provider. 
  
2. Ensure that you have the original deployment package that you downloaded for this version of the SQL resource provider adapter.
3. Rerun the deployment script using the following parameters:
    - Use the -Uninstall parameter
    - The IP address or DNS name of the privileged endpoint.
    - The credential for the cloud administrator, necessary for accessing the privileged endpoint.
    - The credentials for the Azure Stack service admin account. Use the same credentials as you used for deploying Azure Stack.

