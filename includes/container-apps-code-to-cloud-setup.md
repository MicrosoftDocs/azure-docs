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
$ACR_NAME=$GITHUB_USERNAME + "acaalbums"
```

---

### Set your language preference

Set an environment variable for the language you'll be using. The value can be one of the following values:

- csharp
- go
- javascript
- python

# [Bash](#tab/bash)

```bash
LANGUAGE="<LANGUAGE_VALUE>"
```

# [PowerShell](#tab/powershell)

```powershell
$LANGUAGE="<LANGUAGE_VALUE>"
```

---

Before you run this command, replace `<LANGUAGE_VALUE>` with one of the following values: `csharp`, `go`, `javascript`, or `python`.

Next, set an environment variable for the target port of your application.  If you're using the JavaScript API, the target port should be set to `3000`.  Otherwise, set your target port to `80`.

# [Bash](#tab/bash)

```bash
API_PORT="<TARGET_PORT>"
```

# [PowerShell](#tab/powershell)

```powershell
$API_PORT="<TARGET_PORT>"
```

---

Before you run this command, replace `<TARGET_PORT>` with `3000` for node apps, or `80` for all other apps.
