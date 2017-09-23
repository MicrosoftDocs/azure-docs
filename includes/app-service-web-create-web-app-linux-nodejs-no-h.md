In the Cloud Shell, create a [web app](../articles/app-service/containers/app-service-linux-intro.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp#create) command. Don't forget to replace `<app name>` with a unique app name.

The runtime in the following command is set to `NODE|8.1`. To see all supported runtimes, run [az webapp list-runtimes](/cli/azure/webapp#list-runtimes). 

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app name> --runtime "NODE|8.1" --deployment-local-git
```

When the web app has been created, the Azure CLI shows output similar to the following example:

```json
Local git is configured with url of 'https://<username>@<app name>.scm.azurewebsites.net/<app name>.git'
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app name>.azurewebsites.net",
  "deploymentLocalGitUrl": "https://<username>@<app name>.scm.azurewebsites.net/<app name>.git",
  "enabled": true,
  < JSON data removed for brevity. >
}
```

You’ve created an empty new web app in a Linux container, with git deployment enabled.

> [!NOTE]
> The URL of the Git remote is shown in the `deploymentLocalGitUrl` property, with the format `https://<username>@<app name>.scm.azurewebsites.net/<app name>.git`. Save this URL as you'll need it later.
>
