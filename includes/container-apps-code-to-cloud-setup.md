---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 04/14/2022
ms.author: cshoe
---

# [Bash](#tab/bash)

```azurecli
RESOURCE_GROUP="album-containerapps"
LOCATION="canadacentral"
ENVIRONMENT="env-album-containerapps"
API_NAME="album-api"
GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Now create a unique container registry name.

```azurecli
ACR_NAME=$GITHUB_USERNAME"acaalbums"
```

# [PowerShell](#tab/powershell)

```powershell
$RESOURCE_GROUP="album-containerapps"
$LOCATION="canadacentral"
$ENVIRONMENT="env-album-containerapps"
$API_NAME="album-api"
$GITHUB_USERNAME="<YOUR_GITHUB_USERNAME>"
```

Before you run this command, make sure to replace `<YOUR_GITHUB_USERNAME>` with your GitHub username.

Now create a unique container registry name.

```powershell
$ACR_NAME="acaalbums"+$GITHUB_USERNAME
```

---
