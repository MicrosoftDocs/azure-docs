---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-storage
ms.topic: include
ms.date: 12/15/2022
ms.author: pauljewell
ms.custom: include file
---

Make sure you're authenticated with the same Microsoft Entra account you assigned the role to. You can authenticate via Azure CLI, Visual Studio Code, or Azure PowerShell.

### [Azure CLI](#tab/sign-in-azure-cli)

Sign-in to Azure through the Azure CLI using the following command:

```azurecli
az login
```

### [Visual Studio Code](#tab/sign-in-visual-studio-code)

You will need to [install the Azure CLI](/cli/azure/install-azure-cli) to work with `DefaultAzureCredential` through Visual Studio code.

On the main menu of Visual Studio Code, navigate to **Terminal > New Terminal**.

Sign-in to Azure through the Azure CLI using the following command:

```azurecli
az login
```

### [PowerShell](#tab/sign-in-powershell)

Sign-in to Azure using PowerShell via the following command:

```azurepowershell
Connect-AzAccount
```

--- 
