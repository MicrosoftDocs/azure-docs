#### [bash](#tab/terminal-bash)

```azurecli
az webapp deployment list-publishing-credentials `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query "{Username:publishingUserName, Password:publishingPassword}" `
    --output table
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az webapp deployment list-publishing-credentials `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query "{Username:publishingUserName, Password:publishingPassword}" `
    --output table
```

---
