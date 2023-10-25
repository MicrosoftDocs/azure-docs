---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 05/11/2022
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

# [Azure PowerShell](#tab/azure-powershell)

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
