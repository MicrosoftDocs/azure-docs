---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/30/2022
---
First, you need to configure Azure App Service to output logs to the App Service filesystem using the [az webapp log config](/cli/azure/webapp/log#az-webapp-log-config) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp log config \
    --web-server-logging 'filesystem' \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp log config `
    --web-server-logging 'filesystem' `
    --name $appServiceName `
    --resource-group $resourceGroupName
```

---

To stream logs, use the [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail) command.

#### [bash](#tab/terminal-bash)

```azurecli
az webapp log tail \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp log tail `
    --name $appServiceName `
    --resource-group $resourceGroupName
```

---

Refresh the home page in the app or attempt other requests to generate some log messages. The output should look similar to the following.

```Console
2021-10-26T20:12:01.825485319Z npm start
2021-10-26T20:12:04.478474807Z npm info it worked if it ends with ok
2021-10-26T20:12:04.496736134Z npm info using npm@6.14.10
2021-10-26T20:12:04.497958909Z npm info using node@v14.15.1
2021-10-26T20:12:05.874225522Z npm info lifecycle todolist@0.0.0~prestart: todolist@0.0.0
2021-10-26T20:12:05.891572192Z npm info lifecycle todolist@0.0.0~start: todolist@0.0.0
2021-10-26T20:12:05.941127150Z
2021-10-26T20:12:05.941161452Z > todolist@0.0.0 start /home/site/wwwroot
2021-10-26T20:12:05.941168852Z > node ./bin/www
2021-10-26T20:12:05.941173652Z
2021-10-26T20:12:16.234642191Z Mongoose connection open to database
2021-10-26T20:12:19.360371481Z GET /robots933456.txt 404 2144.146 ms - 1497

2021-10-26T20:12:38.419182028Z Total tasks: 6   Current tasks: 3    Completed tasks:  3
2021-10-26T20:12:38.799957538Z GET / 304 500.485 ms - -
2021-10-26T20:12:38.900597945Z GET /stylesheets/style.css 304 2.574 ms - -
2021-10-26T20:12:38.900637447Z GET /css/bootstrap.css 304 12.300 ms - -
2021-10-26T20:12:38.903103684Z GET /images/Azure-A-48px-product.svg 304 8.896 ms - -
2021-10-26T20:12:38.904441659Z GET /js/bootstrap.min.js 304 9.372 ms - -
```
