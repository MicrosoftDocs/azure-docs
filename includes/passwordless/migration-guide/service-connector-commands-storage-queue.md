You can use Service Connector to create a connection between an Azure compute hosting environment and a target service using the Azure CLI. The Service Connector CLI commands automatically assign the proper role to your identity. You can learn more about Service Connector and which scenarios are supported on the [overview page](../../../articles/service-connector/overview.md).

1. Retrieve the client ID of the managed identity you created using the `az identity show` command. Copy the value for later use.

    ```azurecli
    az identity show \
        --name MigrationIdentity \
        --resource-group <your-resource-group> \
        --query clientId
    ```

1. Use the appropriate CLI command to establish the service connection:

    # [Azure App Service](#tab/app-service-connector)
    
    If you're using an Azure App Service, use the [az webapp connection](/cli/azure/webapp/connection/create) command:
    
    ```azurecli
    az webapp connection create storage-queue \
        --resource-group <resource-group-name> \
        --name <webapp-name> \
        --target-resource-group <target-resource-group-name> \
        --account <target-storage-account-name> \
        --user-identity "client-id=<your-identity-client-id>" "subs-id=<your-subscription-id>"
    ```
    
    # [Azure Spring Apps](#tab/spring-connector)
    
    If you're using Azure Spring Apps, use the [az spring-cloud connection](/cli/azure/spring-cloud/connection/create) command:
    
    ```azurecli
    az spring-cloud connection create storage-queue \
        --resource-group <resource-group-name> \
        --service <service-instance-name> \
        --app <app-name> \
        --deployment <deployment-name> \
        --target-resource-group <target-resource-group> \
        --account <target-storage-account-name> \
        --user-identity "client-id=<your-identity-client-id>" "subs-id=<your-subscription-id>"
    ```
    
    # [Azure Container Apps](#tab/container-apps-connector)
    
    If you're using Azure Container Apps, use the [az containerapp connection](/cli/azure/containerapp/connection) command:
    
    ```azurecli
    az containerapp connection create storage-queue \
        --resource-group <resource-group-name> \
        --name <containerapp-name> \
        --target-resource-group <target-resource-group-name> \
        --account <target-storage-account-name> \
        --user-identity "client-id=<your-identity-client-id>" "subs-id=<your-subscription-id>"
    ```

    ---