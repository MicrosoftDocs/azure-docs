---
title: Manage secrets in Azure Container Apps
description: Learn to store and consume sensitive configuration values in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 09/29/2022
ms.author: cshoe
ms.custom: event-tier1-build-2022, ignite-2022
---

# Manage secrets in Azure Container Apps

Azure Container Apps allows your application to securely store sensitive configuration values. Once secrets are defined at the application level, secured values are available to container apps. Specifically, you can reference secured values inside scale rules. For information on using secrets with Dapr, refer to [Dapr integration](./dapr-overview.md)

- Secrets are scoped to an application, outside of any specific revision of an application.
- Adding, removing, or changing secrets doesn't generate new revisions.
- Each application revision can reference one or more secrets.
- Multiple revisions can reference the same secret(s).

An updated or deleted secret doesn't automatically affect existing revisions in your app. When a secret is updated or deleted, you can respond to changes in one of two ways:

1. Deploy a new revision.
2. Restart an existing revision.

Before you delete a secret, deploy a new revision that no longer references the old secret. Then deactivate all revisions that reference the secret.

## Defining secrets

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

```bash
az containerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --environment "my-environment-name" \
  --image demos/queuereader:v1 \
  --secrets "queue-connection-string=$CONNECTION_STRING"
```

Here, a connection string to a queue storage account is declared in the `--secrets` parameter. The value for `queue-connection-string` comes from an environment variable named `$CONNECTION_STRING`.

# [PowerShell](#tab/powershell)

When you create a container app, secrets are defined using the `--secrets` parameter.

- The parameter accepts a space-delimited set of name/value pairs.
- Each pair is delimited by an equals sign (`=`).

```azurecli
az containerapp create `
  --resource-group "my-resource-group" `
  --name queuereader `
  --environment "my-environment-name" `
  --image demos/queuereader:v1 `
  --secrets "queue-connection-string=$CONNECTION_STRING"
```

Here, a connection string to a queue storage account is declared in the `--secrets` parameter. The value for `queue-connection-string` comes from an environment variable named `$CONNECTION_STRING`.

---

## <a name="using-secrets"></a>Referencing secrets in environment variables

After declaring secrets at the application level as described in the [defining secrets](#defining-secrets) section, you can reference them in environment variables when you create a new revision in your container app. When an environment variable references a secret, its value is populated with the value defined in the secret.

## Example

The following example shows an application that declares a connection string at the application level. This connection is referenced in a container environment variable and in a scale rule.

# [ARM template](#tab/arm-template)

In this example, the application connection string is declared as `queue-connection-string` and becomes available elsewhere in the configuration sections.

:::code language="json" source="code/secure-app-arm-template.json" highlight="11,12,13,27,28,29,30,31,44,45,61,62":::

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret. Also, the Azure Queue Storage scale rule's authentication configuration uses the `queue-connection-string` secret as to define its connection.

To avoid committing secret values to source control with your ARM template, pass secret values as ARM template parameters.

# [Azure CLI](#tab/azure-cli)

In this example, you create a container app using the Azure CLI with a secret that's referenced in an environment variable. To reference a secret in an environment variable in the Azure CLI, set its value to `secretref:`, followed by the name of the secret.

```bash
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

In this example, you create a container app using the Azure CLI with a secret that's referenced in an environment variable. To reference a secret in an environment variable in the Azure CLI, set its value to `secretref:`, followed by the name of the secret.

```azurecli
az containerapp create `
  --resource-group "my-resource-group" `
  --name myQueueApp `
  --environment "my-environment-name" `
  --image demos/myQueueApp:v1 `
  --secrets "queue-connection-string=$CONNECTIONSTRING" `
  --env-vars "QueueName=myqueue" "ConnectionString=secretref:queue-connection-string"
```

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret.

---

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
