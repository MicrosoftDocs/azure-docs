---
title: Removing the SQL resource provider on Azure Stack | Microsoft Docs
description: Learn how you can remove the SQL resource provider from your Azure Stack deployment.
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
ms.date: 06/11/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
---

# Removing the MySQL resource provider  
Before removing the SQL resource provider, it is essential to first remove any dependencies.

## Remove the MySQL resource provider 

1. Verify that you have removed any existing SQL resource provider dependencies.

  > [!NOTE]
  > Uninstalling the SQL resource provider will proceed even if dependent resources are currently using the resource provider. 
  
2. Ensure that you have the original deployment package that you downloaded for this version of the SQL resource provider adapter.
3. Rerun the deployment script using the following parameters:
    - Use the -Uninstall parameter
    - The IP address or DNS name of the privileged endpoint.
    - The credential for the cloud administrator, necessary for accessing the privileged endpoint.
    - The credentials for the Azure Stack service admin account. Use the same credentials as you used for deploying Azure Stack.

## Next steps
[Offer App Services as PaaS](azure-stack-app-service-overview.md)
