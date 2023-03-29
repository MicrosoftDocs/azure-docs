Use the following Azure CLI commands to associate an identity with your app:

Retrieve the ID of the managed identity you created using the [az identity show](/cli/azure/identity) command. Copy the output value to use in the next step.

```azurecli
az identity show --name MigrationIdentity -g <your-identity-resource-group-name> --query id
```

# [Azure App Service](#tab/app-service-identity)

You can assign a managed identity to an Azure App Service instance with the [az webapp identity assign](/cli/azure/webapp/identity) command.

```azurecli
az webapp identity assign \
    --resource-group <resource-group-name> \
    --name <webapp-name>
    --identities <managed-identity-id>
```

# [Azure Spring Apps](#tab/spring-apps-identity)

You can assign a managed identity to an Azure Spring Apps instance with the [az spring app identity assign](/cli/azure/spring/app/identity) command.

```azurecli
az spring app identity assign \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-name>
    --user-assigned <managed-identity-id>
```

# [Azure Container Apps](#tab/container-apps-identity)

You can assign a managed identity to a virtual machine with the [az containerapp identity assign](/cli/azure/containerapp/identity) command.

```azurecli
az containerapp identity assign \
    --resource-group <resource-group-name> \
    --name <app-name>
    --user-assigned <managed-identity-id>
```

# [Azure virtual machines](#tab/virtual-machines-identity)

You can assign a managed identity to a virtual machine with the [az vm identity assign](/cli/azure/vm/identity) command.

```azurecli
az vm identity assign \
    --resource-group <resource-group-name> \
    --name <virtual-machine-name>
    --identities <managed-identity-id>
```

# [Azure Kubernetes Service](#tab/aks-identity)

You can assign a managed identity to an Azure Kubernetes Service (AKS) instance with the [az aks update](/cli/azure/aks) command.

```azurecli
az aks update \
    --resource-group <resource-group-name> \
    --name <cluster-name> \
    --enable-managed-identity \
    --assign-identity <managed-identity-id> \
    --assign-kubelet-identity <managed-identity-id>
```

---