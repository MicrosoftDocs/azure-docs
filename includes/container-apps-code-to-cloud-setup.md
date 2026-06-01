---
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: include
ms.date: 02/03/2025
ms.author: cshoe
---

# [Bash](#tab/bash)

Define the following variables in your bash shell.

```azurecli
RESOURCE_GROUP="album-containerapps"
LOCATION="canadacentral"
ENVIRONMENT="env-album-containerapps"
API_NAME="album-api"
FRONTEND_NAME="album-ui"
GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```azurecli
ACR_NAME="acaalbums"$GITHUB_USERNAME
```

# [PowerShell](#tab/powershell)

Define the following variables in your PowerShell console.

```azurepowershell
$ResourceGroup = "album-containerapps"
$Location = "canadacentral"
$Environment = "env-album-containerapps"
$APIName="album-api"
$FrontendName="album-ui"
$GITHUB_USERNAME = "<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Next, define a container registry name unique to you.

```azurepowershell
$ACRName = "acaalbums"+$GITHUB_USERNAME
```

---
