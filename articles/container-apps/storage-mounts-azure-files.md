---
title: "Tutorial: Create an Azure Files volume mount in Azure Container Apps"
description: Learn to create an Azure Files storage mount in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 07/19/2022
ms.author: cshoe
---

# Tutorial: Create an Azure Files volume mount in Azure Container Apps

Learn to write to permanent storage in a container app using an Azure Files storage mount. For more information about storage mounts, see [Use storage mounts in Azure Container Apps](storage-mounts.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment
> * Create an Azure Storage account
> * Define a file share in the storage account
> * Link the environment to the storage file share
> * Mount the storage share in an individual container
> * Verify the storage mount by viewing the website access log

## Prerequisites

- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli).

## Set up the environment

The following commands help you define  variables and ensure your Container Apps extension is up to date.

1. Sign in to the Azure CLI.

    # [Bash](#tab/bash)

    ```azurecli
    az login
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az login
    ```

    ---

1. Set up environment variables used in various commands to follow.

    # [Bash](#tab/bash)

    ```azurecli
    RESOURCE_GROUP="my-container-apps-group"
    ENVIRONMENT_NAME="my-storage-environment"
    LOCATION="canadacentral"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $RESOURCE_GROUP="my-container-apps-group"
    $ENVIRONMENT_NAME="my-storage-environment"
    $LOCATION="canadacentral"
    ```

    ---

1. Ensure you have the latest version of the Container Apps Azure CLI extension.

    # [Bash](#tab/bash)

    ```azurecli
    az extension add -n containerapp --upgrade
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az extension add -n containerapp --upgrade
    ```

    ---

1. Register the `Microsoft.App` namespace.

    # [Bash](#tab/bash)

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az provider register --namespace Microsoft.App
    ```

    ---

1. Register the `Microsoft.OperationalInsights` provider for the Azure Monitor Log Analytics workspace if you haven't used it before.

    # [Bash](#tab/bash)

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az provider register --namespace Microsoft.OperationalInsights
    ```

    ---

## Create an environment

The following steps create a resource group and a Container Apps environment.

1. Create a resource group.

    # [Bash](#tab/bash)

    ```azurecli
    az group create \
      --name $RESOURCE_GROUP \
      --location $LOCATION \
      --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az group create `
      --name $RESOURCE_GROUP `
      --location $LOCATION `
      --query "properties.provisioningState"
    ```

    ---

    Once created, the command returns a "Succeeded" message.

    At the end of this tutorial, you can delete the resource group to remove all the services created during this article.

1. Create a Container Apps environment.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --location "$LOCATION" \
      --query "properties.provisioningState"
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp env create `
      --name $ENVIRONMENT_NAME `
      --resource-group $RESOURCE_GROUP `
      --location "$LOCATION" `
      --query "properties.provisioningState"
    ```

    ---

    Once created, the command returns a "Succeeded" message.

    Storage mounts are associated with a Container Apps environment and configured within individual container apps.

## Set up a storage account

Next, create a storage account and establish a file share to mount to the container app.

1. Define a storage account name.

    This command generates a random suffix to the storage account name to ensure uniqueness.

    # [Bash](#tab/bash)

    ```azurecli
    STORAGE_ACCOUNT_NAME="myacastorageaccount$RANDOM"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $STORAGE_ACCOUNT_NAME="myacastorageaccount$(Get-Random -Maximum 10000)"
    ```

    ---

1. Create an Azure Storage account.

    # [Bash](#tab/bash)

    ```azurecli
    az storage account create \
      --resource-group $RESOURCE_GROUP \
      --name $STORAGE_ACCOUNT_NAME \
      --location "$LOCATION" \
      --kind StorageV2 \
      --sku Standard_LRS \
      --enable-large-file-share \
      --query provisioningState
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az storage account create `
      --resource-group $RESOURCE_GROUP `
      --name $STORAGE_ACCOUNT_NAME `
      --location "$LOCATION" `
      --kind StorageV2 `
      --sku Standard_LRS `
      --enable-large-file-share `
      --query provisioningState
    ```

    ---

    Once created, the command returns a "Succeeded" message.

1. Define a file share name.

    # [Bash](#tab/bash)

    ```bash
    STORAGE_SHARE_NAME="myfileshare"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $STORAGE_SHARE_NAME="myfileshare"
    ```

    ---

1. Create the Azure Storage file share.

    # [Bash](#tab/bash)

    ```azurecli
    az storage share-rm create \
      --resource-group $RESOURCE_GROUP \
      --storage-account $STORAGE_ACCOUNT_NAME \
      --name $STORAGE_SHARE_NAME \
      --quota 1024 \
      --enabled-protocols SMB \
      --output table
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az storage share-rm create `
      --resource-group $RESOURCE_GROUP `
      --storage-account $STORAGE_ACCOUNT_NAME `
      --name $STORAGE_SHARE_NAME `
      --quota 1024 `
      --enabled-protocols SMB `
      --output table
    ```

    ---

1. Get the storage account key.

    # [Bash](#tab/bash)

    ```bash
    STORAGE_ACCOUNT_KEY=`az storage account keys list -n $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv`
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $STORAGE_ACCOUNT_KEY=$(az storage account keys list -n $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)
    ```

    ---

    The storage account key is required to create the storage link in your Container Apps environment.

1. Define the storage mount name.

    # [Bash](#tab/bash)

    ```bash
    STORAGE_MOUNT_NAME="mystoragemount"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $STORAGE_MOUNT_NAME="mystoragemount"
    ```

    ---

    This value is the name used to define the storage mount link from your Container Apps environment to your Azure Storage account.

## Create the storage mount

Now you can update the container app configuration to support the storage mount.

1. Create the storage link in the environment.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp env storage set \
      --access-mode ReadWrite \
      --azure-file-account-name $STORAGE_ACCOUNT_NAME \
      --azure-file-account-key $STORAGE_ACCOUNT_KEY \
      --azure-file-share-name $STORAGE_SHARE_NAME \
      --storage-name $STORAGE_MOUNT_NAME \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --output table
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp env storage set `
      --access-mode ReadWrite `
      --azure-file-account-name $STORAGE_ACCOUNT_NAME `
      --azure-file-account-key $STORAGE_ACCOUNT_KEY `
      --azure-file-share-name $STORAGE_SHARE_NAME `
      --storage-name $STORAGE_MOUNT_NAME `
      --name $ENVIRONMENT_NAME `
      --resource-group $RESOURCE_GROUP `
      --output table
    ```

    ---

    This command creates a link between container app environment and the file share created with the `az storage share-rm` command.

    Now that the storage account and environment are linked, you can create a container app that uses the storage mount.

1. Define the container app name.

    # [Bash](#tab/bash)

    ```bash
    CONTAINER_APP_NAME="my-container-app"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $CONTAINER_APP_NAME="my-container-app"
    ```

    ---

1. Create the container app.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp create \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT_NAME \
      --image nginx \
      --min-replicas 1 \
      --max-replicas 1 \
      --target-port 80 \
      --ingress external \
      --query properties.configuration.ingress.fqdn
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp create `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --environment $ENVIRONMENT_NAME `
      --image nginx `
      --min-replicas 1 `
      --max-replicas 1 `
      --target-port 80 `
      --ingress external `
      --query properties.configuration.ingress.fqdn
    ```

    ---

    This command displays the URL of your new container app.

1. Copy the URL and paste into your web browser to navigate to the website.

    Once the page loads, you'll see the "Welcome to nginx!" message. Keep this browser tab open. You'll return to the website during the storage mount verification steps.

    Now that you've confirmed the container app is configured, you can update the app to with a storage mount definition.

1. Export the container app's configuration.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp show \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --output yaml > app.yaml
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp show `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --output yaml > app.yaml
    ```

    ---

    > [!NOTE]
    > While this application doesn't have secrets, many apps do feature secrets. By default, when you export an app's configuration, the values for secrets aren't included in the generated YAML.
    >
    > If you don't need to change secret values, then you can remove the `secrets` section and your secrets remain unaltered. Alternatively, if you need to change a secret's value, make sure to provide both the `name` and `value` for all secrets in the file before attempting to update the app. Omitting a secret from the `secrets` section deletes the secret.

1. Open *app.yaml* in a code editor.

1. Replace the `volumes: null` definition in the `template` section with a `volumes:` definition referencing the storage volume.  The template section should look like the following:

    ```yml
    template:
      volumes:
      - name: my-azure-file-volume
        storageName: mystoragemount
        storageType: AzureFile
      containers:
      - image: nginx
        name: my-container-app
        volumeMounts:
        - volumeName: my-azure-file-volume
          mountPath: /var/log/nginx
        resources:
          cpu: 0.5
          ephemeralStorage: 3Gi
          memory: 1Gi
      initContainers: null
      revisionSuffix: ''
      scale:
        maxReplicas: 1
        minReplicas: 1
        rules: null
    ```

    The new `template.volumes` section includes the following properties.

    | Property | Description |
    |--|--|
    | `name` | This value matches the volume created by calling the `az containerapp env storage set` command. |
    | `storageName` | This value defines the name used by containers in the environment to access the storage volume. |
    | `storageType` | This value determines the type of storage volume defined for the environment. In this case, an Azure Files mount is declared. |

    The `volumes` section defines volumes at the app level that your application container or sidecar containers can reference via a `volumeMounts` section associated with a container.

1. Add a `volumeMounts` section to the `nginx` container in the `containers` section.

    ```yml
    containers:
      - image: nginx
        name: my-container-app
        volumeMounts:
        - volumeName: my-azure-file-volume
          mountPath: /var/log/nginx
    ```

    The new `volumeMounts` section includes the following properties:

    | Property | Description |
    |--|--|
    | `volumeName` | This value must match the name defined in the `volumes` definition. |
    | `mountPath` | This value defines the path in your container where the storage is mounted. |

1. Update the container app with the new storage mount configuration.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp update \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --yaml app.yaml \
      --output table
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp update `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP `
      --yaml app.yaml `
      --output table
    ```

    ---

## Verify the storage mount

Now that the storage mount is established, you can manipulate files in Azure Storage from your container. Use the following commands to observe the storage mount at work.

1. Open an interactive shell inside the container app to execute commands inside the running container.

    # [Bash](#tab/bash)

    ```azurecli
    az containerapp exec \
      --name $CONTAINER_APP_NAME \
      --resource-group $RESOURCE_GROUP
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    az containerapp exec `
      --name $CONTAINER_APP_NAME `
      --resource-group $RESOURCE_GROUP
    ```

    ---

    This command may take a moment to open the remote shell. Once the shell is ready, you can interact with the storage mount via file system commands.

1. Change into the nginx */var/log/nginx* folder.

    # [Bash](#tab/bash)

    ```bash
    cd /var/log/nginx
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    cd /var/log/nginx
    ```

    ---

1. Return to the browser and navigate to the website and refresh the page a few times.

    The requests made to the website create a series of log stream entries.

1. Return to your terminal and list the values of the `/var/log/nginx` folder.

    # [Bash](#tab/bash)

    ```bash
    ls
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    ls
    ```

    ---

    Note how the *access.log* and *error.log* files appear in this folder. These files are written to the Azure Files mount in your Azure Storage share created in the previous steps.

1. View the contents of the *access.log* file.

    # [Bash](#tab/bash)

    ```bash
    cat access.log
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    type access.log
    ```

    ---

1. Exit out of the container's interactive shell to return to your local terminal session.

    # [Bash](#tab/bash)

    ```bash
    exit
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    exit
    ```

    ---

1. Now, you can view the files in the Azure portal to verify they exist in your Azure Storage account. Print the name of your randomly generated storage account.

    # [Bash](#tab/bash)

    ```bash
    echo $STORAGE_ACCOUNT_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    echo $STORAGE_ACCOUNT_NAME
    ```

    ---

1. Navigate to the Azure portal and open up the storage account created in this procedure.

1. Under **Data Storage** select **File shares**.

1. Select **myshare** to view the *access.log* and *error.log* files.

## Clean up resources

If you're not going to continue to use this application, run the following command to delete the resource group along with all the resources created in this article.

# [Bash](#tab/bash)

```azurecli
az group delete \
  --name $RESOURCE_GROUP
```

# [PowerShell](#tab/powershell)

```powershell
az group delete `
  --name $RESOURCE_GROUP
```

---

## Next steps

> [!div class="nextstepaction"]
> [Connect container apps together](connect-apps.md)
