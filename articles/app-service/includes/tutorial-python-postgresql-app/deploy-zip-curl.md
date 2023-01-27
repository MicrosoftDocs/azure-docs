---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/28/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.custom: devx-track-python
---

###### [bash](#tab/deploy-instructions-curl-bash)

```bash
curl -X POST \
     -H 'Content-Type: application/zip' \
     -u <username> \
     -T '<zip-package-path>' \
    https://<app-name>.scm.azurewebsites.net/api/zipdeploy
```

###### [PowerShell terminal](#tab/deploy-instructions-curl-ps)

```powershell
curl -Method 'POST' `
     -ContentType 'Content-Type: application/zip' `
     -Credential '<username>' `
     -InFile <zip-package-path> `
     -Uri https://<app-name>.scm.azurewebsites.net/api/zipdeploy
```

---
