---
title: Overview of Application Migration
description: Provides an overview of an app migration approach from Azure Spring Apps to Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Overview of application migration

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article provides an overview of an app migration approach from Azure Spring Apps to Azure Container Apps.

## Prerequisites

- An existing Azure Spring Apps instance.
- An existing Azure container app. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).

## Deploy an application

Azure Container Apps enables you to deploy from container registries, such as Azure Container Registry (ACR) or Docker Hub. You can use tools like the Azure portal, the Azure CLI, or others for the deployment. The following example shows you how to deploy an application to the target managed environment `my-container-apps`. For more information, see [Deploy your first container app with containerapp up](../../container-apps/get-started.md) or [Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).

```azurecli
az containerapp up \
    --resource-group my-container-apps \
    --name my-container-app \
    --location centralus \
    --environment 'my-container-apps' \
    --image mcr.microsoft.com/k8se/quickstart:latest \
    --target-port 80 \
    --ingress external
```

Azure Container Apps now offers a preview feature for Java applications. This feature enables users to deploy applications directly from a JAR file or source code from local or a code repository. We highly recommend that you deploy container apps using a container image.

## Environment variables

Azure Container Apps enables you to configure environment variables. You can set them up when you create a new app or later by creating a new revision.

To change environment variables through the Azure portal, you need to create a new revision explicitly. When using the Azure CLI, you can update the app with the command `az containerapp update`, as shown in the following example, which creates a new revision automatically. It's important not to duplicate environment variables. If multiple variables have the same name, only the last one in the list takes effect.

```azurecli
az containerapp update \
    --resource-group <RESOURCE_GROUP_NAME> \
    --name <APP NAME> \
    --set-env-vars <VAR_NAME>=<VAR_VALUE>
```

Azure Container Apps also provides built-in environment variables. These variables offer useful platform metadata during runtime. For more information, see the [Built-in environment variables](../../container-apps/environment-variables.md#built-in-environment-variables) section of [Manage environment variables on Azure Container Apps](../../container-apps/environment-variables.md).

## Secrets

Azure Container Apps helps store sensitive configuration values, known as *secrets*, securely. These secrets are defined at the application level as name/value pairs and are accessible to all container app revisions.

We recommend that you store secrets in Azure Key Vault instead of entering them directly. You can reference the value of each secret from Azure Key Vault using one of the following formats:

- `https://myvault.vault.azure.net/secrets/mysecret` refers to the latest version of a secret.
- `https://myvault.vault.azure.net/secrets/mysecret/<version-ID>` refers to a specific version of a secret.

For this approach, you must enable managed identity for your container app and grant it access to Key Vault. The access policy in Key Vault should allow the app to use `GET` to get secrets. Alternatively, if Key Vault uses Azure role-based access control, you need to assign `Key Vault Secrets User` role. After you set up managed identity, you can add a Key Vault reference as a secret in your app by specifying the secret's URI. Then, the app can retrieve secret at runtime using the managed identity.

Keep the following rules in mind:

- Removing or changing a secret doesn't automatically affect existing revisions. When you update or delete secrets, you need to either deploy a new revision or restart an existing one to reflect the changes.
- You can also use secrets within scale rules.

You can use secrets in container apps by referencing them in environment variables or mounting them in volumes. In environment variables, the secret's value is automatically populated. Alternatively, you can mount secrets in volumes. In this case, each secret is stored as a file with the secret name as the filename and the secret value as the file's content. This flexibility enables you to handle secrets securely and access them within the app environment. For more information, see [Manage secrets in Azure Container Apps](../../container-apps/manage-secrets.md).

If your workload secures sensitive configuration and retrieves properties from Key vault with `spring-cloud-azure-starter-keyvault-secrets` library, you can use either Azure SDK or Spring KeyVault `PropertySource` in Azure Container Apps. You don't need to change the code during migration.

## JVM options

To print the JVM options in Azure Container Apps, follow the steps in [Build Container Image from a JAR or WAR](./migrate-to-azure-container-apps-build-artifacts.md#build-a-jar-file) to containerize your application. You can add `-XX:+PrintFlagsFinal` in the `ENTRYPOINT` of your Dockerfile, as shown in the following example:

```dockerfile
# filename: JAR.dockerfile

FROM mcr.microsoft.com/openjdk/jdk:17-mariner

ARG JAR_FILENAME

COPY $JAR_FILENAME /opt/app/app.jar
ENTRYPOINT ["java", "-XX:+PrintFlagsFinal", "-jar", "/opt/app/app.jar"]
```

To query JVM options in Azure Container Apps, use the following query:

```kusto
ContainerAppConsoleLogs_CL
| where ContainerAppName_s == "<APP_NAME>"
| where Log_s has_any ('{default}', '{command line}', '{ergonomic}')
```

The following log is an example that shows JVM options after running a query:

```log
size_t MinHeapSize = 8388608 {product} {ergonomic}
size_t MaxHeapSize = 268435456 {product} {ergonomic}
```

To adjust the JVM options in Azure Container Apps, you can add JVM options in the `ENTRYPOINT` of your Dockerfile as shown in the following example:

```dockerfile
# filename: JAR.dockerfile

FROM mcr.microsoft.com/openjdk/jdk:17-mariner

ARG JAR_FILENAME

COPY $JAR_FILENAME /opt/app/app.jar
ENTRYPOINT ["java", "-XX:+PrintFlagsFinal", "-Xmx400m", "-Xss200m", "-jar", "/opt/app/app.jar"]
```

For more information about JVM options, see [Java HotSpot VM Options](https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html) and [Configuring JVM Options](https://docs.oracle.com/cd/E37116_01/install.111210/e23737/configuring_jvm.htm#solCONFIGURING-JVM-OPTIONS).

## Storage

Azure Spring Apps and Azure Container Apps both support container-scoped storage, which means that the data stored on the container is available only while the container is running. For Azure Spring Apps, the total storage for an app is 5 GiB. Azure Container Apps offer storage that ranges from 1 GiB to 8 GiB depending on the total number of vCPUs allocated. This storage includes all ephemeral storage assigned to each replica. For more information, see the [Ephemeral storage](../../container-apps/storage-mounts.md?tabs=smb&pivots=azure-portal#ephemeral-storage) section of [Use storage mounts in Azure Container Apps](../../container-apps/storage-mounts.md?tabs=smb&pivots=azure-portal).

Azure Spring Apps and Azure Container Apps both support permanent storage through Azure Files. Azure Container Apps supports mounting file shares using SMB and NFS protocols. You need to create a storage definition in the managed environment, and then define a volume of AzureFile (SMB) or NfsAzureFile (NFS) in a revision. You can complete the entire configuration for AzureFile (SMB) in the Azure portal. For more information, see [Create an Azure Files volume mount in Azure Container Apps](../../container-apps/storage-mounts-azure-files.md). Support for mounting NFS shares is currently in preview. You can configure it using the Azure CLI or an ARM template. For more information, see [NFS Azure file shares](../../storage/files/files-nfs-protocol.md) and the [Create an NFS Azure file share](../../storage/files/storage-files-quick-create-use-linux.md#create-an-nfs-azure-file-share) section of [Tutorial: Create an NFS Azure file share and mount it on a Linux VM using the Azure portal](../../storage/files/storage-files-quick-create-use-linux.md).

## Managed identity

Each container app has a system-assigned managed identity or user-assigned managed identities to access protected Azure resources. To learn how to manage identities and grant permissions, see [Managed identities in Azure Container Apps](../../container-apps/managed-identity.md).

Each container app has an internal REST endpoint, accessible through the `IDENTITY_ENDPOINT` environment variable, which differs from the endpoint used in Azure Spring Apps. If your app uses a direct HTTP `GET` request, you need to adjust the code to get the correct endpoint. If your app uses a managed identity through the Azure Identity client library, you don't need any code changes because Azure Identity manages this detail automatically.

When a workload accesses protected Azure resources, it needs to fetch an access token using the application ID or client ID of a managed identity. In an Azure Spring Apps environment, you can set the client ID of a system-assigned or user-assigned managed identity. Alternatively, you can leave it empty and let the service select application ID from one of the managed identities. In Azure Container Apps, you can't explicitly specify the application ID when using a system-assigned managed identity. However the application ID is required when using a user-assigned managed identity.

## Health probes

Azure Container Apps and Azure Spring Apps both support all three types of health probes including startup probe, liveness probe, and readiness probe. For Azure Container Apps, probes can use either HTTP or TCP protocol. `exec` isn't supported yet.

In Azure Spring Apps, probe settings are configured on the deployment resource. In contrast, for Azure Container Apps, probe settings are defined on the container app resource. The following settings are available:

| Property                        | Description                                                                                      | Azure Spring Apps                                              | Azure Container Apps                                                                                     |
|---------------------------------|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `probeAction`                   | The action of the probe.                                                                         | Supports `HTTPGetAction`, `TCPSocketAction`, and `ExecAction`. | There are no properties for the action type. The user must use either `httpGet` or `tcpSocket` directly. |
| `disableProbe`                  | Indicates whether the probe is disabled.                                                         | Boolean                                                        | Boolean                                                                                                  |
| `initialDelaySeconds`           | The number of seconds after the app instance starts before probes are initiated.                 |                                                                | The value ranges from 1 to 60.                                                                           |
| `periodSeconds`                 | How often, in seconds, to perform the probe.                                                     | Minimum value is 1.                                            | The value ranges from 1 to 240, with a default value of 10.                                              |
| `timeoutSeconds`                | The number of seconds after which the probe times out.                                           | Minimum value is 1.                                            | The value ranges from 1 to 240, with a default value of 1.                                               |
| `failureThreshold`              | The minimum consecutive failures for the probe to be considered failed after having succeeded.   | Minimum value is 1.                                            | The value ranges from 1 to 10, with a default value of 3.                                                |
| `successThreshold`              | The minimum consecutive successes for the probe to be considered successful after having failed. | Minimum value is 1.                                            | The value ranges from 1 to 10, with a default value of 1.                                                |
| `terminationGracePeriodSeconds` | The optional duration in seconds the pod needs to terminate gracefully upon probe failure.       | Default value is 90 seconds.                                   | The maximum value is 3600 seconds.                                                                       |

Currently, you can't configure the probes for Azure Container Apps directly on the Azure portal. Instead, you need to set them up using either an ARM template or a container app YAML file via the Azure CLI. For more information, see [Health probes in Azure Container Apps](../../container-apps/health-probes.md).

## Scale

Azure Container Apps supports horizontal scaling through a set of scaling rules. When a rule is added or changed, a new revision of container app is created.

Scaling has three categories of triggers, HTTP, TCP, and custom. HTTP and TCP are based on the number of request or network connections. For more information, see [Set scaling rules in Azure Container Apps](../../container-apps/scale-app.md).

### Trigger scale based on CPU or memory

The custom container apps scaling rules are based on [ScaledObject](https://keda.sh/docs/latest/concepts/scaling-deployments/)-based [KEDA scaler](https://keda.sh/docs/latest/scalers/). You can achieve scaling with container apps based on CPU or memory usage through KEDA [CPU scaler](https://keda.sh/docs/latest/scalers/cpu/) and [Memory scaler](https://keda.sh/docs/latest/scalers/memory/).

The following example demonstrates a configuration where scaling out occurs when the average memory usage exceeds 25%. The memory usage includes the memory used by the current container app and also the relevant pods, such as internal sidecar containers. KEDA includes built-in configuration to prevent the container app from flapping. For more information about internal settings, see [Set scaling rules in Azure Container Apps](../../container-apps/scale-app.md). You should verify the behavior during runtime to make sure it meets your needs.

```azurecli
az containerapp create \
    --resource-group MyResourceGroup \
    --name my-containerapp \
    --image my-queue-processor --environment MyContainerappEnv \
    --min-replicas 1 --max-replicas 10 \
    --scale-rule-name memory-scaler \
    --scale-rule-type memory \
    --scale-rule-metadata "type=Utilization" \
                          "value=25"
```

### Trigger scale based on Java metrics

KEDA offers an [Azure Monitor scaler](https://keda.sh/docs/2.11/scalers/azure-monitor/), which enables scaling based on metrics available in Azure Monitor. You can use this feature to scale your applications dynamically based on Java-specific metrics that are published to Azure Monitor.

#### Prerequisites

- Register an application in Microsoft Entra ID. For more information, see [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).
- Grant permissions. Assign the registered application the `Monitoring Reader` role for your Azure Container Apps resource.

#### Steps

1. Add secrets. Use the following command to store the Microsoft Entra application's client ID and secret in Azure Container Apps as secrets:

   ```azurecli
   az containerapp secret set \
       --resource-group MyResourceGroup \
       --name my-containerapp \
       --secrets activeDirectoryClientId=<Microsoft-Entra-Application-Client-ID> \
                 activeDirectoryClientPassword=<Microsoft-Entra-Application-Client-Password>
   ```

1. Define a scaling rule. Use the following command to create a custom scaling rule that uses the Azure Monitor scaler. This rule triggers scaling actions based on a specific Java metric, such as `JvmThreadCount`, monitored through Azure Monitor.

   ```azurecli
   az containerapp create \
       --resource-group MyResourceGroup \
       --name my-containerapp \
       --image my-queue-processor --environment MyContainerappEnv \
       --min-replicas 1 --max-replicas 10 \
       --scale-rule-name thread-count \
       --scale-rule-type azure-monitor \
       --scale-rule-auth "activeDirectoryClientId=activeDirectoryClientId" \
                         "activeDirectoryClientPassword=activeDirectoryClientPassword" \
       --scale-rule-metadata "activationTargetValue=1" \
                             "metricAggregationInterval=0:1:0" \
                             "metricAggregationType=Maximum" \
                             "metricName=JvmThreadCount" \
                             "resourceGroupName=MyResourceGroup" \
                             "resourceURI=MyContainerAppShortURI" \
                             "subscriptionId=MyResourceID" \
                             "targetValue=30" \
                             "tenantId=MyTenantID"
   ```

#### Key details

- Secrets management: The application's credentials - client ID and password - are securely stored as secrets.
- Scaling criteria: The `metricName` parameter identifies the Java metric - `JvmThreadCount` in this case - that's used to evaluate when scaling should occur.
- Target value: The `targetValue` parameter sets the threshold for scaling - for example, scaling when the thread count exceeds 30.

By setting up this rule, your container app can dynamically adjust the number of instances based on Java-specific performance metrics, improving responsiveness and resource utilization.
