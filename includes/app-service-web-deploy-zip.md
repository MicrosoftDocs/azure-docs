## Deploy uploaded .ZIP file

In the Cloud Shell, deploy the uploaded .zip file to your web app by using the [az webapp deployment source config-zip](/cli/azure/webapp/deployment/source?view=azure-cli-latest#az_webapp_deployment_source_config_zip) command. Be sure to replace *\<app_name>* with the name of your web app.

```azurecli-interactive
az webapp deployment source config-zip --resource-group myResouceGroup --name <app_name> --src clouddrive/myAppFiles.zip
```

This command deploys the files and directories from the .zip file to your default App Service application folder (`\home\site\wwwroot`) and restarts the app. If any additional custom build process is configured, it is run as well.
