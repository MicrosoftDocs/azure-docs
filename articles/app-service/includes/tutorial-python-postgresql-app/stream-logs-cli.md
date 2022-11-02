---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/21/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

Run the following Azure CLI commands to see the log stream. This command uses parameters cached in the .azure/config file.

**Step 1.** Configure Azure App Service to output logs to the App Service filesystem using the [az webapp log config](/cli/azure/webapp/log#az-webapp-log-config) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp log config \
    --web-server-logging filesystem \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp log config `
    --web-server-logging filesystem `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME
```

---

**Step 2.** To stream logs, use the [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp log tail \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp log tail `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME
```

---

**Step 3.** Refresh the home page in the app or attempt other requests to generate some log messages. The output should look similar to the following.

```Output
Starting Live Log Stream ---

2022-02-10T14:01:00.846167125Z Request for index page received
2022-02-10T14:01:00.847060433Z 169.254.130.1 - - [10/Feb/2022:14:01:00 +0000] "GET / HTTP/1.1" 200 4909 "https://msdocs-python-postgres-webapp.azurewebsites.net/1/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:00.909664401Z 169.254.130.1 - - [10/Feb/2022:14:01:00 +0000] "GET /static/bootstrap/css/bootstrap.min.css HTTP/1.1" 200 0 "https://msdocs-python-postgres-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:00.921269807Z 169.254.130.1 - - [10/Feb/2022:14:01:00 +0000] "GET /static/fontawesome/css/all.min.css HTTP/1.1" 200 0 "https://msdocs-python-postgres-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:01.022254723Z 169.254.130.1 - - [10/Feb/2022:14:01:01 +0000] "GET /static/images/azure-icon.svg HTTP/1.1" 200 0 "https://msdocs-python-postgres-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:01.032642118Z 169.254.130.1 - - [10/Feb/2022:14:01:01 +0000] "GET /static/bootstrap/js/bootstrap.min.js HTTP/1.1" 200 0 "https://msdocs-python-postgres-webapp.azurewebsites.net/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
2022-02-10T14:01:01.225921972Z 169.254.130.1 - - [10/Feb/2022:14:01:01 +0000] "GET /static/fontawesome/webfonts/fa-solid-900.woff2 HTTP/1.1" 200 0 "https://msdocs-python-postgres-webapp.azurewebsites.net/static/fontawesome/css/all.min.css" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.43"
```
