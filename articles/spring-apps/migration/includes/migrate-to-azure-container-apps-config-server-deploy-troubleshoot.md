## Deploy the application to Azure Container Apps

After testing the application locally, you can deploy the new image to the Azure Container Apps application.

### [Azure portal](#tab/Azure-portal)

Use the following steps to deploy:

1. Navigate to your Azure Container Apps application in the Azure portal.
1. In the menu, select **Application** > **Containers**.
1. Select **Edit and deploy** to open the **Create and deploy new revision** page.
1. In the **Container image** section, select the image and then select **Edit**.
1. In the **Edit a container** section, on the **Properties** tab, choose the new image of the application.
1. On the **Environment variables** tab, for **Name**, specify **spring.application.name**. Then, for **Source**, choose **Manual entry** and specify the config file name where the application consumes the configuration.
1. Select **Save** to deploy the new revision.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to update the container app that consumes the configuration data:

```azurecli
az containerapp update \
    --resource-group <your-resource-group> \
    --name <container-app-name> \
    --image <new-container-image> \
    --bind <config-server-name> \
    --set-env-vars spring.application.name=<config-file-name>
```

The `--bind <config-server-name>` parameter creates the link between your container app and the configuration component. You should add the environment variable by setting `--set-env-vars spring.application.name=<config-file-name>` to the app container so that the app can consume the configuration from the right config file.   

---

## Troubleshoot

You can view logs for the managed Config Server for Spring in Azure Container Apps using Log Analytics. Use the following steps:

1. Navigate to your Azure Container Apps environment in the Azure portal.
1. Select the **Monitoring** > **Logs** menu.
1. To view logs, enter a query into the query editor for the `ContainerAppSystemLogs_CL` table, as shown in the following example:

   ```kusto
   ContainerAppSystemLogs_CL
   | where ComponentType_s == "SpringCloudConfig"
   | project Time=TimeGenerated, ComponentName=ComponentName_s, Message=Log_s
   | take 100
   ```

For more information about querying logs, see [Observability of managed Java components in Azure Container Apps](../../../container-apps/java-component-logs.md).
