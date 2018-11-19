---
title: Use managed identities for Azure resources in Azure Cloud Shell | Microsoft Docs
description: Authenticate code with MSI in Azure Cloud Shell
services: azure
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/14/2018
ms.author: juluk
---

# Use managed identities for Azure resources in Azure Cloud Shell

Azure Cloud Shell supports authorization with managed identities for Azure resources. Utilize this to retrieve access tokens to securely communicate with Azure services.

## About managed identities for Azure resources
A common challenge when building cloud applications is how to securely manage the credentials that need to be in your code for authenticating to cloud services. In Cloud Shell you may need to authenticate retrieval from Key Vault for a credential that a script may need.

Managed identities for Azure resources makes solving this problem simpler by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

## Acquire access token in Cloud Shell

Execute the following commands to set your MSI access token as an environment variable, `access_token`.
```
response=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
access_token=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The MSI access token is $access_token
```

## Handling token expiration

The local MSI subsystem caches tokens. Therefore, you can call it as often as you like, and an on-the-wire call to Azure AD results only if:
- a cache miss occurs due to no token in the cache
- the token is expired

If you cache the token in your code, you should be prepared to handle scenarios where the resource indicates that the token is expired.

To handle token errors, visit the [MSI page about curling MSI access tokens](https://docs.microsoft.com/azure/active-directory/managed-service-identity/how-to-use-vm-token#error-handling).

## Next steps
[Learn more about MSI](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview)  
[Acquiring access tokens from MSI VMs](https://docs.microsoft.com/azure/active-directory/managed-service-identity/how-to-use-vm-token)
