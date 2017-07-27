---
title: Deploy a VM with securely stored password on Azure Stack | Microsoft Docs
description: Learn how to deploy a VM using a password stored in Azure Stack Key Vault
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: 23322a49-fb7e-4dc2-8d0e-43de8cd41f80
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/15/2017
ms.author: sngun

---
# Deploy a VM by retrieving the password stored in Key Vault

> [!IMPORTANT] 
> This topic applies only to Azure Stack Technical Preview 2.
>

When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in an Azure Stack key vault and reference the value in other Azure Resource Manager templates. You include only a reference to the secret in your template so the secret is never exposed. You do not need to manually enter
the value for the secret each time you deploy the resources. You specify which users or service principals can access the secret.

## Reference a secret with static ID
You reference the secret from within a parameters file, which passes values to your template. You reference the secret by passing the resource identifier of the key vault and the name of the secret. In this example, the key vault secret must already exist. You use a static value for its resource ID.

    "parameters": {
    "adminPassword": {
    "reference": {
    "keyVault": {
    "id": "/subscriptions/{guid}/resourceGroups/{group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}"
    },
    "secretName": "{Secret name}"


> [!NOTE]
> The parameter that accepts the secret should be a *securestring*.


## Next Steps
[Deploy a sample app with Key Vault](azure-stack-kv-sample-app.md)

[Deploy a VM with a Key Vault certificate](azure-stack-kv-push-secret-into-vm.md)

