---
title: Secure an app in Azure Container Apps
description: Learn to secure applications in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  how-to
ms.date: 09/16/2021
ms.author: cshoe
---

# Secure an app in Azure Container Apps

Azure Container Apps allows your application to securely store sensitive configuration values. Once defined at the application level, secured values are available to containers, inside scale rules, and via Dapr.

- Secrets are scoped to an application, outside of any specific revision of an application.
- Adding, removing, or changing secrets does not generate new revisions.
- Each application revision can reference one or more secrets.
- Multiple revisions can reference the same secret(s).

When a secret is updated or deleted, you can respond to changes in one of two ways:

 1. Deploy a new revision.
 2. Restart an existing revision.

An updated or removed secret does not automatically re-start a revision.

- Before you delete a secret, deploy a new revision that no longer references the old secret.
- If you change a secret value, you need to restart the revision to consume the new value.

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

Here, a connection string to a queue storage account is declared in the `secrets` array. To use this configuration you would replace `<MY-CONNECTION-STRING-VALUE>` with the value of your connection string.

# [Azure CLI](#tab/azure-cli)

Secrets are defined using the `--secrets` parameter.

- The parameter accepts a comma-delimited set of name/value pairs.
- Each pair is delimited by an equals sign (`=`).

```bash
az containerapp create \
  --resource-group "my-resource-group" \
  --name queuereader \
  --environment "my-environment-name" \
  --image demos/queuereader:v1 \
  --secrets "queue-connection-string=$CONNECTION_STRING" \
  ...
```

Here, a connection string to a queue storage account is declared in the `--secrets` parameter. The value for `queue-connection-string` comes from an environment variable named `$CONNECTION_STRING`.

---

## Using secrets

Application secrets are referenced via the `secretref` property. Secret values are mapped to application-level secrets where the `secretref` value matches the secret name declared at the application level.

## Example

The following example shows an application that declares a connection string at the application level and is used throughout the configuration via `secretref`.

# [ARM template](#tab/arm-template)

```json
"resources": [
{
    "name": "myapp",
    "type": "Microsoft.Web/containerApps",
    "apiVersion": "2021-02-01",
    "kind": "containerapp",
    "location": "eastus",
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

In this example, the application connection string is declared as `queue-connection-string` and becomes available elsewhere in the configuration sections.

:::code language="json" source="code/secure-app-arm-template.json" highlight="47,48,64,65":::

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret. Also, the Azure Queue Storage scale rule's authorization configuration uses the `queue-connection-string` as a connection is established.

We recommend passing the secret value as an ARM parameter as shown in this example so that your secrets aren't committed to source control with your ARM template.

# [Azure CLI](#tab/azure-cli)

In this example, you create an application with a secret that's referenced in an environment variable using the Azure CLI.

```bash
az containerapp create \
  --resource-group "my-resource-group" \
  --name myQueueApp \
  --environment "my-environment-name" \
  --image demos/myQueueApp:v1 \
  --secrets "queue-connection-string=$CONNECTIONSTRING" \
  --environment-variables "QueueName=myqueue,ConnectionString=secretref:queue-connection-string"
```

Here, the environment variable named `connection-string` gets its value from the application-level `queue-connection-string` secret by using `secretref`.

---

## Next steps

> [!div class="nextstepaction"]
> [Containers](containers.md)
