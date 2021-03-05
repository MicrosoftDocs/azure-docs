Next, you'll need to set environment variables in your function app from earlier, containing the reference to the Azure Digital Twins instance you've created. 

Add the setting with the following Azure CLI command. The command can be run in [Cloud Shell](https://shell.azure.com), or locally if you have the Azure CLI [installed on your machine](/cli/azure/install-azure-cli?view=azure-cli-latest&preserve-view=true).

```azurecli-interactive
az functionapp config appsettings set --settings "ADT_SERVICE_URL=https://<Azure Digital Twins instance _host name_>" -g <resource group> -n <your App Service (function app) name>
```
Ensure that the permissions and Managed Identity role assignment are configured correctly for the function app, as described in the section [*Assign permissions to the function app*](../articles/digital-twins/tutorial-end-to-end.md#assign-permissions-to-the-function-app) in the end-to-end tutorial.