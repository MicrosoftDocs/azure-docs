---
title: Manage secrets in Azure Container Apps
description: Learn to store and consume sensitive configuration values in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 03/23/2023
ms.author: cshoe
ms.custom: event-tier1-build-2022, ignite-2022, devx-track-azurecli, devx-track-azurepowershell, build-2023, devx-track-linux
---

# Manage secrets in Azure Container Apps

Azure Container Apps allows your application to securely store sensitive configuration values. Once secrets are defined at the application level, secured values are available to revisions in your container apps. Additionally, you can reference secured values inside scale rules. For information on using secrets with Dapr, refer to [Dapr integration](./dapr-overview.md).

- Secrets are scoped to an application, outside of any specific revision of an application.
- Adding, removing, or changing secrets doesn't generate new revisions.
- Each application revision can reference one or more secrets.
- Multiple revisions can reference the same secret(s).

An updated or deleted secret doesn't automatically affect existing revisions in your app. When a secret is updated or deleted, you can respond to changes in one of two ways:

1. Deploy a new revision.
2. Restart an existing revision.

Before you delete a secret, deploy a new revision that no longer references the old secret. Then deactivate all revisions that reference the secret.

## Defining secrets

Secrets are defined as a set of name/value pairs. The value of each secret is specified directly or as a reference to a secret stored in Azure Key Vault.

### Store secret value in Container Apps

When you define secrets through the portal, or via different command line options.

# [Azure portal](#tab/azure-portal)

1. Go to your container app in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Secrets**.

1. Select **Add**.

1. In the *Add secret* context pane, enter the following information:

    - **Name**: The name of the secret.
    - **Type**: Select **Container Apps Secret**.
    - **Value**: The value of the secret.

1. Select **Add**.

# [ARM template](#tab/arm-template)

Secrets are defined at the application level in the `resources.properties.configuration.secrets` section.

```json
"resources": [
{
    ...
    "properties": {
        "configuration": {
            "secrets": [
            {
                "name": "queue-connection-string",
                "value": "<MY-CONNECTION-STRING-VALUE>"
            }],
        }
    }
}
```

Here, a connection string to a queue storage account is declared in the `secrets` array. In this example, you would replace `<MY-CONNECTION-STRING-VALUE>` with the value of your connection string.

# [Azure CLI](#tab/azure-cli)

When you create a container app, secrets are defined using the `--secrets` parameter.

- The parameter accepts a space-delimited set of name/value pairs.
- Each pair is delimited by an equals sign (`=`).

```azurecli-interactive
az containerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --environment "my-environment-name" \
  --image demos/queuereader:v1 \
  --secrets "queue-connection-string=<CONNECTION_STRING>"
```

Here, a connection string to a queue storage account is declared in the `--secrets` parameter. Replace `<CONNECTION_STRING>` with the value of your connection string.

# [PowerShell](#tab/powershell)

When you create a container app, secrets are defined as one or more Secret objects that are passed through the `ConfigurationSecrets` parameter.

```azurepowershell-interactive
$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName my-resource-group -EnvName my-environment-name).Id
$TemplateObj = New-AzContainerAppTemplateObject -Name queuereader -Image demos/queuereader:v1
$SecretObj = New-AzContainerAppSecretObject -Name queue-connection-string -Value $QueueConnectionString

$ContainerAppArgs = @{
    Name = 'my-resource-group'
    Location = '<location>'
    ResourceGroupName = 'my-resource-group'
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $TemplateObj
    ConfigurationSecret = $SecretObj
}

New-AzContainerApp @ContainerAppArgs
```

Here, a connection string to a queue storage account is declared. The value for `queue-connection-string` comes from an environment variable named `$QueueConnectionString`.

---

### <a name="reference-secret-from-key-vault"></a>Reference secret from Key Vault

When you define a secret, you create a reference to a secret stored in Azure Key Vault. Container Apps automatically retrieves the secret value from Key Vault and makes it available as a secret in your container app.

To reference a secret from Key Vault, you must first enable managed identity in your container app and grant the identity access to the Key Vault secrets.

To enable managed identity in your container app, see [Managed identities](managed-identity.md).

To grant access to Key Vault secrets, [create an access policy](../key-vault/general/assign-access-policy.md) in Key Vault for the managed identity you created. Enable the "Get" secret permission on this policy.

# [Azure portal](#tab/azure-portal)

1. Go to your container app in the [Azure portal](https://portal.azure.com).

1. Under the *Settings* section, select **Identity**.

1. In the *System assigned* tab, select **On**.

1. Select **Save** to enable system-assigned managed identity.

1. Under the *Settings* section, select **Secrets**.

1. Select **Add**.

1. In the *Add secret* context pane, enter the following information:

    - **Name**: The name of the secret.
    - **Type**: Select **Key Vault reference**.
    - **Key Vault secret URL**: The URI of your secret in Key Vault.
    - **Identity**: The identity to use to retrieve the secret from Key Vault.

1. Select **Add**.

# [ARM template](#tab/arm-template)

Secrets are defined at the application level in the `resources.properties.configuration.secrets` section.

```json
"resources": [
{
    ...
    "properties": {
        "configuration": {
            "secrets": [
            {
                "name": "queue-connection-string",
                "keyVaultUrl": "<KEY-VAULT-SECRET-URI>",
                "identity": "system"
            }],
        }
    }
}
```

Here, a connection string to a queue storage account is declared in the `secrets` array. Its value is automatically retrieved from Key Vault using the specified identity. To use a user managed identity, replace `system` with the identity's resource ID.

Replace `<KEY-VAULT-SECRET-URI>` with the URI of your secret in Key Vault.

# [Azure CLI](#tab/azure-cli)

When you create a container app, secrets are defined using the `--secrets` parameter.

- The parameter accepts a space-delimited set of name/value pairs.
- Each pair is delimited by an equals sign (`=`).
- To specify a Key Vault reference, use the format `<SECRET_NAME>=keyvaultref:<KEY_VAULT_SECRET_URI>,identityref:<MANAGED_IDENTITY_ID>`. For example, `queue-connection-string=keyvaultref:https://mykeyvault.vault.azure.net/secrets/queuereader,identityref:/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity`.

```azurecli-interactive
az containerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --environment "my-environment-name" \
  --image demos/queuereader:v1 \
  --user-assigned "<USER_ASSIGNED_IDENTITY_ID>" \
  --secrets "queue-connection-string=keyvaultref:<KEY_VAULT_SECRET_URI>,identityref:<USER_ASSIGNED_IDENTITY_ID>"
```

Here, a connection string to a queue storage account is declared in the `--secrets` parameter. Replace `<KEY_VAULT_SECRET_URI>` with the URI of your secret in Key Vault. Replace `<USER_ASSIGNED_IDENTITY_ID>` with the resource ID of the user assigned identity. For system assigned identity, use `system` instead of the resource ID.

> [!NOTE]
> The user assigned identity must have access to read the secret in Key Vault. System assigned identity can't be used with the create command because it's not available until after the container app is created.

# [PowerShell](#tab/powershell)

Secrets Key Vault references aren't supported in PowerShell.

---

> [!NOTE]
> If you're using [UDR With Azure Firewall](networking.md#user-defined-routes-udr), you will need to add the `AzureKeyVault` service tag and the *login.microsoft.com* FQDN to the allow list for your firewall. Refer to [configuring UDR with Azure Firewall](networking.md#configuring-udr-with-azure-firewall) to decide which additional service tags you need.

#### Key Vault secret URI and secret rotation

The Key Vault secret URI must be in one of the following formats:

* `https://myvault.vault.azure.net/secrets/mysecret/ec96f02080254f109c51a1f14cdb1931`: Reference a specific version of a secret.
* `https://myvault.vault.azure.net/secrets/mysecret`: Reference the latest version of a secret.

If a version isn't specified in the URI, then the app uses the latest version that exists in the key vault. When newer versions become available, the app automatically retrieves the latest version within 30 minutes. Any active revisions that reference the secret in an environment variable is automatically restarted to pick up the new value.

For full control of which version of a secret is used, specify the version in the URI.

## <a name="using-secrets"></a>Referencing secrets in environment variables

After declaring secrets at the application level as described in the [defining secrets](#defining-secrets) section, you can reference them in environment variables when you create a new revision in your container app. When an environment variable references a secret, its value is populated with the value defined in the secret.

### Example

The following example shows an application that declares a connection string at the application level. This connection is referenced in a container environment variable and in a scale rule.

# [Azure portal](#tab/azure-portal)

After you've [defined a secret](#defining-secrets) in your container app, you can reference it in an environment variable when you create a new revision.

1. Go to your container app in the [Azure portal](https://portal.azure.com).

1. Open the *Revision management* page.

1. Select **Create new revision**.

1. In the *Create and deploy new revision* page, select a container.

1. In the *Environment variables* section, select **Add**.

1. Enter the following information:

    - **Name**: The name of the environment variable.
    - **Source**: Select **Reference a secret**.
    - **Value**: Select the secret you want to reference.

1. Select **Save**.

1. Select **Create** to create the new revision.

# [ARM template](#tab/arm-template)

In this example, the application connection string is declared as `queue-connection-string` and becomes available elsewhere in the configuration sections.

:::code language="json" source="code/secure-app-arm-template.json" highlight="11,12,13,27,28,29,30,31,44,45,61,62":::

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret. Also, the Azure Queue Storage scale rule's authentication configuration uses the `queue-connection-string` secret as to define its connection.

To avoid committing secret values to source control with your ARM template, pass secret values as ARM template parameters.

# [Azure CLI](#tab/azure-cli)

In this example, you create a container app using the Azure CLI with a secret that's referenced in an environment variable. To reference a secret in an environment variable in the Azure CLI, set its value to `secretref:`, followed by the name of the secret.

```azurecli-interactive
az containerapp create \
  --resource-group "my-resource-group" \
  --name myQueueApp \
  --environment "my-environment-name" \
  --image demos/myQueueApp:v1 \
  --secrets "queue-connection-string=$CONNECTIONSTRING" \
  --env-vars "QueueName=myqueue" "ConnectionString=secretref:queue-connection-string"
```

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret.

# [PowerShell](#tab/powershell)

In this example, you create a container using Azure PowerShell with a secret that's referenced in an environment variable. To reference the secret in an environment variable in PowerShell, set its value to `secretref:`, followed by the name of the secret.

```azurepowershell-interactive
$EnvId = (Get-AzContainerAppManagedEnv -ResourceGroupName my-resource-group -EnvName my-environment-name).Id

$SecretObj = New-AzContainerAppSecretObject -Name queue-connection-string -Value $QueueConnectionString
$EnvVarObjQueue = New-AzContainerAppEnvironmentVarObject -Name QueueName -Value myqueue
$EnvVarObjConn = New-AzContainerAppEnvironmentVarObject -Name ConnectionString -SecretRef queue-connection-string -Value secretref
$TemplateObj = New-AzContainerAppTemplateObject -Name myQueueApp -Image demos/myQueueApp:v1 -Env $EnvVarObjQueue, $EnvVarObjConn

$ContainerAppArgs = @{
    Name = 'myQueueApp'
    Location = '<location>'
    ResourceGroupName = 'my-resource-group'
    ManagedEnvironmentId = $EnvId
    TemplateContainer = $TemplateObj
    ConfigurationSecret = $SecretObj
}

New-AzContainerApp @ContainerAppArgs
```

Here, the environment variable named `ConnectionString` gets its value from the application-level `$QueueConnectionString` secret.

---

## <a name="secrets-volume-mounts"></a>Mounting secrets in a volume

After declaring secrets at the application level as described in the [defining secrets](#defining-secrets) section, you can reference them in volume mounts when you create a new revision in your container app. When you mount secrets in a volume, each secret is mounted as a file in the volume. The file name is the name of the secret, and the file contents are the value of the secret. You can load all secrets in a volume mount, or you can load specific secrets.

### Example

# [Azure portal](#tab/azure-portal)

After you've [defined a secret](#defining-secrets) in your container app, you can reference it in a volume mount when you create a new revision.

1. Go to your container app in the [Azure portal](https://portal.azure.com).

1. Open the *Revision management* page.

1. Select **Create new revision**.

1. In the *Create and deploy new revision* page.

1. Select a container and select **Edit**.

1. In the *Volume mounts* section, expand the **Secrets** section.

1. Select **Create new volume**.

1. Enter the following information:

    - **Name**: mysecrets
    - **Mount all secrets**: enabled

    > [!NOTE]
    > If you want to load specific secrets, disable **Mount all secrets** and select the secrets you want to load.

1. Select **Add**.

1. Under *Volume name*, select **mysecrets**.

1. Under *Mount path*, enter **/mnt/secrets**.

1. Select **Save**.

1. Select **Create** to create the new revision with the volume mount.

# [ARM template](#tab/arm-template)

In this example, two secrets are declared at the application level. These secrets are mounted in a volume named `mysecrets` of type `Secret`. The volume is mounted at the path `/mnt/secrets`. The application can then reference the secrets in the volume mount.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "type": "String"
        },
        "environment_id": {
            "type": "String"
        },
        "queue-connection-string": {
            "type": "Securestring"
        },
        "api-key": {
            "type": "Securestring"
        }
    },
    "variables": {},
    "resources": [
    {
        "name": "queuereader",
        "type": "Microsoft.App/containerApps",
        "apiVersion": "2022-11-01-preview",
        "kind": "containerapp",
        "location": "[parameters('location')]",
        "properties": {
            "managedEnvironmentId": "[parameters('environment_id')]",
            "configuration": {
                "activeRevisionsMode": "single",
                "secrets": [
                    {
                        "name": "queue-connection-string",
                        "value": "[parameters('queue-connection-string')]"
                    },
                    {
                        "name": "api-key",
                        "value": "[parameters('api-key')]"
                    }
                ]
            },
            "template": {
                "containers": [
                    {
                        "image": "myregistry/myQueueApp:v1",
                        "name": "myQueueApp",
                        "volumeMounts": [
                            {
                                "name": "mysecrets",
                                "mountPath": "/mnt/secrets"
                            }
                        ]
                    }
                ],
                "volumes": [
                    {
                        "name": "mysecrets",
                        "storageType": "Secret"
                    }
                ]
            }
        }
    }]
}
```

To load specific secrets and specify their paths within the mounted volume, you define the secrets in the `secrets` array of the volume object. The following example shows how to load only the `queue-connection-string` secret in the `mysecrets` volume mount with a file name of `connection-string.txt`.

```json
{
    "properties": {
        ...
        "configuration": {
            ...
            "secrets": [
                {
                    "name": "queue-connection-string",
                    "value": "[parameters('queue-connection-string')]"
                },
                {
                    "name": "api-key",
                    "value": "[parameters('api-key')]"
                }
            ]
        },
        "template": {
            "containers": [
                {
                    "image": "myregistry/myQueueApp:v1",
                    "name": "myQueueApp",
                    "volumeMounts": [
                        {
                            "name": "mysecrets",
                            "mountPath": "/mnt/secrets"
                        }
                    ]
                }
            ],
            "volumes": [
                {
                    "name": "mysecrets",
                    "storageType": "Secret",
                    "secrets": [
                        {
                            "secretRef": "queue-connection-string",
                            "path": "connection-string.txt"
                        }
                    ]
                }
            ]
        }
        ...
    }
    ...
}
```

In your app, you can read the secret from a file located at `/mnt/secrets/connection-string.txt`.

# [Azure CLI](#tab/azure-cli)

In this example, two secrets are declared at the application level. These secrets are mounted in a volume named `mysecrets` of type `Secret`. The volume is mounted at the path `/mnt/secrets`. The application can then read the secrets as files in the volume mount.

```azurecli-interactive
az containerapp create \
  --resource-group "my-resource-group" \
  --name myQueueApp \
  --environment "my-environment-name" \
  --image demos/myQueueApp:v1 \
  --secrets "queue-connection-string=$CONNECTIONSTRING" "api-key=$API_KEY" \
  --secret-volume-mount "/mnt/secrets"
```

To load specific secrets and specify their paths within the mounted volume, define your app using [YAML](azure-resource-manager-api-spec.md?tabs=yaml#container-app-examples).

# [PowerShell](#tab/powershell)

Mounting secrets as a volume is not supported in PowerShell.

---

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
