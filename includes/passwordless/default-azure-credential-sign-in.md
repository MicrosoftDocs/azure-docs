---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: azure-storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

For local development, make sure you're authenticated with the same Azure AD account you assigned the role to. You can authenticate via popular development tools, such as the Azure CLI or Azure PowerShell. The development tools with which you can authenticate vary across languages.

### [Azure CLI](#tab/sign-in-azure-cli)

Sign-in to Azure through the Azure CLI using the following command:

```azurecli
az login
```

### [Visual Studio](#tab/sign-in-visual-studio)

Select the **Sign in** button in the top right of Visual Studio.

:::image type="content" source="../../articles/storage/blobs/media/storage-quickstart-blobs-dotnet/sign-in-visual-studio-small.png" alt-text="Screenshot showing the button to sign in to Azure using Visual Studio.":::

Sign-in using the Azure AD account you assigned a role to previously.

:::image type="content" source="../../articles/storage/blobs/media/storage-quickstart-blobs-dotnet/sign-in-visual-studio-account-small.png" alt-text="Screenshot showing the account selection.":::

### [Visual Studio Code](#tab/sign-in-visual-studio-code)

You will need to [install the Azure CLI](/cli/azure/install-azure-cli) to work with `DefaultAzureCredential` through Visual Studio Code.

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
