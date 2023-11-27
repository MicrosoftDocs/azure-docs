---
title: How to deploy polyglot apps in the Azure Spring Apps Enterprise plan
description: Shows you how to deploy polyglot apps in the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 07/05/2023
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, devx-track-azurecli
---

# How to deploy polyglot apps in the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to deploy polyglot apps in the Azure Spring Apps Enterprise plan, and how these polyglot apps can use the build service features provided by buildpacks.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`

## Deploy polyglot applications in a service instance

This section applies to building and deploying polyglot applications when the build service is enabled. If you disable the build service, you can deploy applications only with a custom container image. You can create your own image or use one built by an Azure Spring Apps Enterprise instance. For more information, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

### Manage builders

When you create an instance of Azure Spring Apps Enterprise, you must choose a default builder from one of the following supported language family buildpacks:

- [Java Azure Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tanzu-java-azure-buildpack)
- [.NET Core Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tanzu-dotnet-core-buildpack)
- [Go Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tanzu-go-buildpack)
- [Web Servers Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tanzu-web-servers-buildpack/)
- [Node.js Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tanzu-nodejs-buildpack)
- [Python Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tanzu-python-buildpack/)
- [Java Native Image Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tanzu-java-native-image-buildpack/)
- [PHP Buildpack for VMware Tanzu](https://network.tanzu.vmware.com/products/tbs-dependencies/#/releases/1335849/artifact_references)

For more information, see [Language Family Buildpacks for VMware Tanzu](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-index.html).

These buildpacks support building with source code or artifacts for Java, .NET Core, Go, web static files, Node.js, and Python apps. You can also create a custom builder by specifying buildpacks and a stack.

All the builders configured in an Azure Spring Apps service instance are listed on the **Build Service** page, as shown in the following screenshot:

:::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/builder-list.png" alt-text="Screenshot of the Azure portal that shows the Build Service page with the Builders list highlighted." lightbox="media/how-to-enterprise-deploy-polyglot-apps/builder-list.png":::

Select **Add** to create a new builder. The following screenshot shows the resources you should use to create the custom builder. The [OS Stack](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-stacks.html) includes `Bionic Base`, `Bionic Full`, `Jammy Tiny`, `Jammy Base`, and `Jammy Full`. Bionic is based on `Ubuntu 18.04 (Bionic Beaver)` and Jammy is based on `Ubuntu 22.04 (Jammy Jellyfish)`. For more information, see the [OS stack recommendations](#os-stack-recommendations) section.

We recommend using `Jammy OS Stack` to create your builder because VMware is deprecating `Bionic OS Stack`.

:::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/builder-create.png" alt-text="Screenshot of the Azure portal that shows the Add Builder page with the OS Stack and selected buildpack name highlighted." lightbox="media/how-to-enterprise-deploy-polyglot-apps/builder-create.png":::

You can also edit a custom builder when the builder isn't used in a deployment. You can update the buildpacks or the OS Stack, but the builder name is read only.

:::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/builder-edit.png" alt-text="Screenshot of the Azure portal that shows the Build Service page with the ellipsis button and Edit builder menu option highlighted." lightbox="media/how-to-enterprise-deploy-polyglot-apps/builder-edit.png":::

The builder is a resource that continuously contributes to your deployments. It provides the latest runtime images and latest buildpacks.

You can't delete a builder when existing active deployments are being built with the builder. To delete a builder in this state, use the following steps:

1. Save the configuration as a new builder.
1. Deploy apps with the new builder. The deployments are linked to the new builder.
1. Migrate the deployments under the previous builder to the new builder.
1. Delete the original builder.

#### OS stack recommendations

In Azure Spring Apps, we recommend using `Jammy OS Stack` to create your builder because `Bioinic OS Stack` is in line for deprecation by VMware. The following list describes the options available:

- Jammy Tiny: Suitable for building a minimal image for the smallest possible size and security footprint. Like building a Java Native Image, it can make the final container image smaller. The integrated libraries are limited. For example, you can't [connect to an app instance for troubleshooting](how-to-connect-to-app-instance-for-troubleshooting.md) because there's no `shell` library.
   - Most Go apps.
   - Java apps. Note that some Apache Tomcat config options are not available, such as setting bin/setenv.sh, because Tiny has no shell.

- Jammy Base: Suitable for most apps without native extensions.
   - Java apps and .NET Core apps.
   - Go apps that require some C libraries.
   - Node.js, Python, or Web Servers apps without native extensions.

- Jammy Full: Includes most libraries, and is suitable for apps with native extensions. For example, it includes a more complete library of fonts. If your app relies on the native extension, then use the `Full` stack.
   - Node.js or Python apps with native extensions.

For more information, see [Ubuntu Stacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-stacks.html#ubuntu-stacks) in the VMware documentation.

### Manage the container registry

This section shows you how to manage the container registry used by the build service if you enable the build service with your own container registry. If you enable the build service with an Azure Spring Apps managed container registry, you can skip this section.

After you enable a user container registry with the build service, you can show and configure the registry using the Azure portal or the Azure CLI.

#### [Azure portal](#tab/Portal)

Use the following steps to show, add, edit, and delete the container registry:

1. Open the [Azure portal](https://portal.azure.com/?AppPlatformExtension=entdf#home).
1. Select **Container registry** in the navigation pane.
1. Select **Add** to create a container registry.

   :::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/add-container-registry.png" alt-text="Screenshot of Azure portal that shows the Container registry page with Add container registry button." lightbox="media/how-to-enterprise-deploy-polyglot-apps/add-container-registry.png":::

1. For a container registry, select the ellipsis (**...**) button, then select **Edit** to view the registry configuration.

   :::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/show-container-registry.png" alt-text="Screenshot of the Azure portal that shows the Container registry page." lightbox="media/how-to-enterprise-deploy-polyglot-apps/show-container-registry.png":::

1. Review the values on the **Edit container registry** page.

   :::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/edit-container-registry.png" alt-text="Screenshot of the Azure portal that shows the Container registry page with Edit container registry pane open for the current container registry in the list." lightbox="media/how-to-enterprise-deploy-polyglot-apps/edit-container-registry.png":::

1. To delete a container registry, select the ellipsis (**...**) button, then select **Delete** to delete the registry. If the container registry is used by build service, it can't be deleted.

   :::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/delete-container-registry.png" alt-text="Screenshot of Azure portal that shows the Container registry page with Delete container registry pane open for the current container registry in the list." lightbox="media/how-to-enterprise-deploy-polyglot-apps/delete-container-registry.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to list all container registries for the service instance:

```azurecli
az spring container-registry list \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> 
```

Use the following command to show the container registry:

```azurecli
az spring container-registry show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <your-container-registry-name>
```

Use the following command to update the container registry:

```azurecli
az spring container-registry update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <your-container-registry-name> \
    --server <your-container-registry-login-server> \
    --username <your-container-registry-username> \
    --password <your-container-registry-password>
```

Use the following command to delete the container registry:

```azurecli
az spring container-registry delete \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <your-container-registry-name> 
```

If the build service is using the container registry, then you can't delete it.

---

The build service can use a container registry, and can also change the associated container registry. This process is time consuming. When the change happens, all the builder and build resources under the build service rebuilds, and then the final container images gets pushed to the new container registry.

#### [Azure portal](#tab/Portal)

Use the following steps to switch the container registry associated with the build service:

1. Open the [Azure portal](https://portal.azure.com/?AppPlatformExtension=entdf#home).
1. Select **Build Service** in the navigation pane.
1. Select **Referenced container registry** to update the container registry for the build service.

   :::image type="content" source="media/how-to-enterprise-deploy-polyglot-apps/switch-build-service-container-registry.png" alt-text="Screenshot of the Azure portal that shows the Build Service page with referenced container registry highlighted." lightbox="media/how-to-enterprise-deploy-polyglot-apps/switch-build-service-container-registry.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to show the build service:

```azurecli
az spring build-service show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name>
```

Use the following command to update the build service with a specific container registry:

```azurecli
az spring build-service update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --registry-name <your-container-registry-name> 
```

---

### Build and deploy polyglot applications

You can build and deploy polyglot applications in the following ways using the container registry:

- For the build service using the Azure Spring Apps managed container registry, you can build an application to an image and then deploy it to the current Azure Spring Apps service instance. The build and deployment are executed together by using the `az spring app deploy` command.

- For the build service using a user-managed container registry, you can build an application into a container image and then deploy the image to the current Azure Spring Apps Enterprise instance and other instances. The build and deploy commands are separate. You can use the build command to create or update a build, then use the deploy command to deploy the container image to the service instance.

For more information, see the [Build service on demand](how-to-enterprise-build-service.md#build-service-on-demand) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

The following examples show some helpful build commands to use.

```azurecli
az configure --defaults group=<resource-group-name> spring=<service-name>

az spring build-service build list
az spring build-service build show --name <build-name>
az spring build-service build create --name <build-name> --artifact-path <artifact-path>
az spring build-service build update --name <build-name> --artifact-path <artifact-path>
az spring build-service build delete --name <build-name>
```

The following Azure CLI examples show building and deploying an artifact file for two container registry scenarios:

- Azure Spring Apps managed container registry.
- User-managed container registry.

#### [Azure Spring Apps managed container registry](#tab/asa-managed-container-registry)

This example builds and deploys in one command. The following command specifies a builder to build an application to a container image, and then deploys the application directly into the Azure Springs Apps Enterprise service instance.

If you don't specify the builder, a `default` builder is used.

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

#### [User-managed container registry](#tab/user-managed-container-registry)

This example builds or updates an application and deploys it using two commands. With a user-managed container registry, you can deploy an application only from a custom container image. For more information, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

The following command builds an application:

```azurecli
az spring build-service build create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

The following command updates an existing build:

```azurecli
az spring build-service build update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

The following command deploys an application.

```azurecli
az spring app deploy \
   --resource-group <resource-group-name> \
   --service <Azure-Spring-Apps-instance-name> \
   --name <app-name> \
   --container-image <your-container-image> \
   --container-registry <your-container-registry> \
   --registry-password <your-password> \
   --registry-username <your-username>
```

---

If you deploy the app with an artifact file, use `--artifact-path` to specify the file path. Both JAR and WAR files are acceptable.

If the Azure CLI detects the WAR package as a thin JAR, use `--disable-validation` to disable validation.

The following example deploys the source code folder to an active deployment by using the `--source-path` parameter to specify the folder.

#### [Azure Spring Apps managed container registry](#tab/asa-managed-container-registry)

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --builder <builder-name> \
    --source-path <path-to-source-code>
```

#### [User-managed container registry](#tab/user-managed-container-registry)

The following command builds an application:

```azurecli
az spring build-service build create \
   --resource-group <resource-group-name> \
   --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --builder <builder-name> \
    --source-path <path-to-source-code>
```

The following command updates an existing build:

```azurecli
az spring build-service build update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --builder <builder-name> \
    --source-path <path-to-source-code>
```

To deploy the application, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

---

You can also configure the build environment to build the app. For example, in a Java application, you can specify the JDK version using the `BP_JVM_VERSION` build environment.

To specify build environments, use `--build-env`, as shown in the following example. The available build environment variables are described later in this article.

#### [Azure Spring Apps managed container registry](#tab/asa-managed-container-registry)

The following command deploys an application:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --build-env <key1=value1> <key2=value2> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

#### [User-managed container registry](#tab/user-managed-container-registry)

The following command builds an application:

```azurecli
az spring build-service build create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --build-env <key1=value1> <key2=value2> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

The following command updates an existing build:

```azurecli
az spring build-service build update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --build-env <key1=value1> <key2=value2> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

To deploy the application, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

---

For each build, you can also specify the build resources, as shown in the following example.

#### [Azure Spring Apps managed container registry](#tab/asa-managed-container-registry)

The following command deploys an application:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <app-name> \
    --build-env <key1=value1> <key2=value2> \
    --build-cpu <build-cpu-size> \
    --build-memory <build-memory-size> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

#### [User-managed container registry](#tab/user-managed-container-registry)

The following command builds an application:

```azurecli
az spring build-service build create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --build-env <key1=value1> <key2=value2> \
    --build-cpu <build-cpu-size> \
    --build-memory <build-memory-size> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
 ```

The following command updates an existing build:

```azurecli
az spring build-service build update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name <build-name> \
    --build-env <key1=value1> <key2=value2> \
    --build-cpu <build-cpu-size> \
    --build-memory <build-memory-size> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

To deploy the application, see [Deploy an application with a custom container image](how-to-deploy-with-custom-container-image.md).

---

The default build CPU/memory resource is `1 vCPU, 2 Gi`. If your application needs a smaller or larger amount of memory, then use `--build-memory` to specify the memory resources - for example, `500Mi`, `1Gi`, `2Gi`, and so on. If your application needs a smaller or larger amount of CPU resources, then use `--build-cpu` to specify the CPU resources - for example, `500m`, `1`, `2`, and so on. The maximum CPU/memory resource limit for a build is `8 vCPU, 16Gi`.

The CPU and memory resources are limited by the build service agent pool size. For more information, see the [Build agent pool](how-to-enterprise-build-service.md#build-agent-pool) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md). The sum of the processing build resource quota can't exceed the agent pool size.

The parallel number of build tasks depends on the agent pool size and each build resource. For example, if the build resource is the default `1 vCPU, 2 Gi` and the agent pool size is `6 vCPU, 12 Gi`, then the parallel build number is 6.

Other build tasks are blocked for a while because of resource quota limitations.

Your application must listen on port 8080. Spring Boot applications override the `SERVER_PORT` to use 8080 automatically.

## Supported languages for deployments

The following table indicates the features supported for each language.

| Feature                                                         | Java | Python | Node | .NET Core | Go | [Static Files](how-to-enterprise-deploy-static-file.md) | Java Native Image |
|-----------------------------------------------------------------|------|--------|------|-----------|----|---------------------------------------------------------|-------------------|
| App lifecycle management                                        | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Assign endpoint                                                 | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Azure Monitor                                                   | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      |                   |
| Out of box APM integration                                      | ✔️  |        |      |           |    |                                                         |                   |
| Blue/green deployment                                           | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Custom domain                                                   | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Scaling - auto scaling                                          | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      |                   |
| Scaling - manual scaling (in/out, up/down)                      | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Managed Identity                                                | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ️                 |
| API portal for VMware Tanzu                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️                                                     | ✔️                |
| Spring Cloud Gateway for VMware Tanzu                         | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️                                                     | ✔️                |
| Application Configuration Service for VMware Tanzu            | ✔️   |        |      |           |    |                                                         | ✔️               |
| VMware Tanzu Service Registry                                 | ✔️   |        |      |           |    |                                                         | ✔️               |
| App Live View for VMware Tanzu                                | ✔️   |        |      |           |    |                                                         | ✔️               |
| Virtual network                                                 | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Outgoing IP Address                                             | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| E2E TLS                                                         | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Advanced troubleshooting - thread/heap/JFR dump                 | ✔️  |        |      |           |    |                                                         |                   |
| Bring your own storage                                          | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Integrate service binding with Resource Connector               | ✔️  |        |      |           |    |                                                         |   ✔️              |
| Availability Zone                                               | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| App Lifecycle events                                            | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Reduced app size - 0.5 vCPU and 512 MB                          | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Automate app deployments with Terraform and Azure Pipeline Task | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Soft Deletion                                                   | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Interactive diagnostic experience (AppLens-based)               | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| SLA                                                             | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Customize health probes                                         | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ✔️               |
| Web shell connect for troubleshooting                           | ✔️  | ✔️     | ✔️  | ✔️        | ✔️ | ✔️                                                      | ️   ✔️           |
| Remote debugging                                                | ✔️  |        |      |           | ️    | ️                                                        | ️                 |

For more information about the supported configurations for different language apps, see the corresponding section later in this article.

### Java Native Image limitations

[Native Image](https://www.graalvm.org/latest/reference-manual/native-image/) is a technology to compile Java code ahead of time to a native executable. Native images provide various advantages, like an instant startup and reduced memory consumption. You can package native images into a lightweight container image for faster and more efficient deployment. Because of the Closed World Optimization, the following [limitations](https://www.graalvm.org/22.1/reference-manual/native-image/Limitations/) apply:

- The following Java features require configuration at executable build time:
  - Dynamic Class Loading
  - Reflection
  - Dynamic Proxy
  - JNI (Java Native Interface)
  - Serialization
- Bytecode isn't available at runtime anymore, so debugging and monitoring with tools targeted to the JVMTI isn't possible.

The following features aren't supported in Azure Spring Apps due to the limitation of Java Native Image. Azure Spring Apps supports them as long as Java Native Image and the community overcomes the limitation.

| Feature                                           | Why it isn't supported                                            |
|---------------------------------------------------|-------------------------------------------------------------------|
| Azure Monitor                                     | GraalVM built native images doesn't support JVM metrics.          |
| Scaling – autoscaling                             | GraalVM built native images doesn't support JVM metrics.          |
| Out-of-box APM integration                        | APM Vendor & Buildpack doesn't support native image.              |
| Managed identity                                  | Azure SDKs doesn't support native image.                          |
| Advanced troubleshooting – thread/heap/JFR dump   | GraalVM built native images doesn't support thread/heap/JFR dump. |
| Remote debugging                                  | GraalVM Native Image doesn't support Remote Debugging.            |
| Passwordless connection using Service Connector     | Azure Java SDK doesn't support native image.                      |

> [!NOTE]
> In the following different language build and deploy configuration sections, `--build-env` means the environment is used in the build phase. `--env` means the environment is used in the runtime phase.
> 
> We recommend that you specify the language version in case the default version changes. For example, use `--build-env BP_JVM_VERSION=11.*` to specify Java 11 as the JDK version. For other languages, you can get the environment variable name in the following descriptions for each language.

### Deploy Java applications

The buildpack for deploying Java applications is [tanzu-buildpacks/java-azure](https://network.tanzu.vmware.com/products/tanzu-java-azure-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                                        | Comment                                                                                                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                                                                                                                                                                                                                                                                                                            |
|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Provides the Microsoft OpenJDK.                                                            | Configures the JVM version. The default JDK version is 11. Currently supported: JDK 8, 11, and 17.                                                                                                                                                                                                                                         | `BP_JVM_VERSION`                                                                                                      | `--build-env BP_JVM_VERSION=11.*`                                                                                                                                                                                                                                                                                                |
|                                                                                            | Runtime env. Configures whether Java Native Memory Tracking (NMT) is enabled. The default value is *true*. Not supported in JDK 8.                                                                                                                                                                                                         | `BPL_JAVA_NMT_ENABLED`                                                                                                | `--env BPL_JAVA_NMT_ENABLED=true`                                                                                                                                                                                                                                                                                                |
|                                                                                            | Configures the level of detail for Java Native Memory Tracking (NMT) output. The default value is *summary*. Set to *detail* for detailed NMT output.                                                                                                                                                                                      | `BPL_JAVA_NMT_LEVEL`                                                                                                  | `--env BPL_JAVA_NMT_ENABLED=summary`                                                                                                                                                                                                                                                                                             |
| Add CA certificates to the system trust store at build and runtime.                        | See the [Configure CA certificates for app builds and deployments](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#configure-ca-certificates-for-app-builds-and-deployments) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                              |
| Integrate with Application Insights, Dynatrace, Elastic, New Relic, App Dynamic APM agent. | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md).                                                                                                                                                                                                          | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                              |
| Deploy WAR package with Apache Tomcat or TomEE.                                            | Set the application server to use. Set to *tomcat* to use Tomcat and *tomee* to use TomEE. The default value is *tomcat*.                                                                                                                                                                                                                  | `BP_JAVA_APP_SERVER`                                                                                                  | `--build-env BP_JAVA_APP_SERVER=tomee`                                                                                                                                                                                                                                                                                           |
| Support Spring Boot applications.                                                          | Indicates whether to contribute Spring Cloud Bindings support for the image at build time. The default value is *false*.                                                                                                                                                                                                                   | `BP_SPRING_CLOUD_BINDINGS_DISABLED`                                                                                   | `--build-env BP_SPRING_CLOUD_BINDINGS_DISABLED=false`                                                                                                                                                                                                                                                                            |
|                                                                                            | Indicates whether to autoconfigure Spring Boot environment properties from bindings at runtime. This feature requires Spring Cloud Bindings to install at build time or it does nothing. The default value is *false*.                                                                                                         | `BPL_SPRING_CLOUD_BINDINGS_DISABLED`                                                                                  | `--env BPL_SPRING_CLOUD_BINDINGS_DISABLED=false`                                                                                                                                                                                                                                                                                 |
| Support building Maven-based applications from source.                                     | Used for a multi-module project. Indicates the module to find the application artifact in. Defaults to the root module (empty).                                                                                                                                                                                                            | `BP_MAVEN_BUILT_MODULE`                                                                                               | `--build-env BP_MAVEN_BUILT_MODULE=./gateway`                                                                                                                                                                                                                                                                                    |
| Support building Gradle-based applications from source.                                    | Used for a multi-module project. Indicates the module to find the application artifact in. Defaults to the root module (empty).                                                                                                                                                                                                            | `BP_GRADLE_BUILT_MODULE`                                                                                              | `--build-env BP_GRADLE_BUILT_MODULE=./gateway`                                                                                                                                                                                                                                                                                   |
| Enable configuration of labels on the created image.                                       | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> see more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>`                                                                                                                                                                                                                                                                                             |
| Integrate JProfiler agent.                                                                 | Indicates whether to integrate JProfiler support. The default value is *false*.                                                                                                                                                                                                                                                            | `BP_JPROFILER_ENABLED`                                                                                                | build phase: <br>`--build-env BP_JPROFILER_ENABLED=true` <br> runtime phase: <br> `--env BPL_JPROFILER_ENABLED=true` <br> `BPL_JPROFILER_PORT=<port>` (optional, defaults to *8849*) <br> `BPL_JPROFILER_NOWAIT=true` (optional. Indicates whether the JVM executes before JProfiler gets attached. The default value is *true*.) |
|                                                                                            | Indicates whether to enable JProfiler support at runtime. The default value is *false*.                                                                                                                                                                                                                                                    | `BPL_JPROFILER_ENABLED`                                                                                               | `--env BPL_JPROFILER_ENABLED=false`                                                                                                                                                                                                                                                                                              |
|                                                                                            | Indicates which port the JProfiler agent listens on. The default value is *8849*.                                                                                                                                                                                                                                                          | `BPL_JPROFILER_PORT`                                                                                                  | `--env BPL_JPROFILER_PORT=8849`                                                                                                                                                                                                                                                                                                  |
|                                                                                            | Indicates whether the JVM executes before JProfiler gets attached. The default value is *true*.                                                                                                                                                                                                                                             | `BPL_JPROFILER_NOWAIT`                                                                                                | `--env BPL_JPROFILER_NOWAIT=true`                                                                                                                                                                                                                                                                                                |
| Integrate [JRebel](https://www.jrebel.com/) agent.                                         | The application should contain a *rebel-remote.xml* file.                                                                                                                                                                                                                                                                                  | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                              |
| AES encrypts an application at build time and then decrypts it at launch time.             | The AES key to use at build time.                                                                                                                                                                                                                                                                                                          | `BP_EAR_KEY`                                                                                                          | `--build-env BP_EAR_KEY=<value>`                                                                                                                                                                                                                                                                                                 |
|                                                                                            | The AES key to use at run time.                                                                                                                                                                                                                                                                                                            | `BPL_EAR_KEY`                                                                                                         | `--env BPL_EAR_KEY=<value>`                                                                                                                                                                                                                                                                                                      |
| Integrate [AspectJ Weaver](https://www.eclipse.org/aspectj/) agent.                        | `<APPLICATION_ROOT>`/*aop.xml* exists and *aspectj-weaver.\*.jar* exists.                                                                                                                                                                                                                                                                  | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                              |

### Deploy .NET applications

The buildpack for deploying .NET applications is [tanzu-buildpacks/dotnet-core](https://network.tanzu.vmware.com/products/tanzu-dotnet-core-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Configure the .NET Core runtime version.                            | Supports *Net6.0* and *Net7.0*. <br> You can configure through a *runtimeconfig.json* or MSBuild Project file. <br> The default runtime is *6.0.\**.                                                                                                                                                                                       | N/A                                                                                                                   | N/A                                  |
| Add CA certificates to the system trust store at build and runtime. | See the [Configure CA certificates for app builds and deployments](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#configure-ca-certificates-for-app-builds-and-deployments) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                  |
| Integrate with the Dynatrace and New Relic APM agents.              | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md).                                                                                                                                                                                                          | N/A                                                                                                                   | N/A                                  |
| Enable configuration of labels on the created image.                | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>` |

### Deploy Python applications

The buildpack for deploying Python applications is [tanzu-buildpacks/python](https://network.tanzu.vmware.com/products/tanzu-python-buildpack/).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                  |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| Specify a Python version.                                           | Supports *3.7.\**, *3.8.\**, *3.9.\**, *3.10.\**, *3.11.\**. The default value is *3.10.\**<br> You can specify the version via the `BP_CPYTHON_VERSION` environment variable during build.                                                                                                                                                | `BP_CPYTHON_VERSION`                                                                                                  | `--build-env BP_CPYTHON_VERSION=3.8.*` |
| Add CA certificates to the system trust store at build and runtime. | See the [Configure CA certificates for app builds and deployments](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#configure-ca-certificates-for-app-builds-and-deployments) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                    |
| Enable configuration of labels on the created image.                | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>`   |

### Deploy Go applications

The buildpack for deploying Go applications is [tanzu-buildpacks/go](https://network.tanzu.vmware.com/products/tanzu-go-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                                    |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| Specify a Go version.                                               | Supports *1.19.\**, *1.20.\**. The default value is *1.19.\**.<br> The Go version is automatically detected from the app’s *go.mod* file. You can override this version by setting the `BP_GO_VERSION` environment variable at build time.                                                                                                 | `BP_GO_VERSION`                                                                                                       | `--build-env BP_GO_VERSION=1.20.*`                       |
| Configure multiple targets.                                         | Specifies multiple targets for a Go build.                                                                                                                                                                                                                                                                                                 | `BP_GO_TARGETS`                                                                                                       | `--build-env BP_GO_TARGETS=./some-target:./other-target` |
| Add CA certificates to the system trust store at build and runtime. | See the [Configure CA certificates for app builds and deployments](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#configure-ca-certificates-for-app-builds-and-deployments) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                                      |
| Integrate with Dynatrace APM agent.                                 | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md).                                                                                                                                                                                                          | N/A                                                                                                                   | N/A                                                      |
| Enable configuration of labels on the created image.                | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>`                     |

### Deploy Node.js applications

The buildpack for deploying Node.js applications is [tanzu-buildpacks/nodejs](https://network.tanzu.vmware.com/products/tanzu-nodejs-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                  | Comment                                                                                                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                |
|----------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Specify a Node version.                                              | Supports *14.\**, *16.\**, *18.\**, *19.\**. The default value is *18.\**. <br>You can specify the Node version via an *.nvmrc* or *.node-version* file at the application directory root. `BP_NODE_VERSION` overrides the settings.                                                                                              | `BP_NODE_VERSION`                                                                                                     | `--build-env BP_NODE_VERSION=19.*`   |
| Add CA certificates to the system trust store at build and runtime.  | See the [Configure CA certificates for app builds and deployments](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#configure-ca-certificates-for-app-builds-and-deployments) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                  |
| Integrate with Dynatrace, Elastic, New Relic, App Dynamic APM agent. | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md).                                                                                                                                                                                                          | N/A                                                                                                                   | N/A                                  |
| Enable configuration of labels on the created image.                 | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>` |
| Deploy an Angular application with Angular Live Development Server.   | Specify the host before running `ng serve` in the [package.json](https://github.com/paketo-buildpacks/samples/blob/main/nodejs/angular-npm/package.json): `ng serve --host 0.0.0.0 --port 8080 --public-host <your application domain name>`. The domain name of the application is available in the application **Overview** page, in the **URL** section. Remove the protocol `https://` before proceeding.                                                                                                                                                                             | `BP_NODE_RUN_SCRIPTS` <br> `NODE_ENV` | `--build-env BP_NODE_RUN_SCRIPTS=build NODE_ENV=development` |

### Deploy WebServer applications

The buildpack for deploying WebServer applications is [tanzu-buildpacks/web-servers](https://network.tanzu.vmware.com/products/tanzu-web-servers-buildpack/).

For more information, see [Deploy web static files](how-to-enterprise-deploy-static-file.md).

### Deploy Java Native Image applications (preview)

The buildpack for deploying Java Native Image applications is [tanzu-buildpacks/java-native-image](https://network.tanzu.vmware.com/products/tanzu-java-native-image-buildpack/).

You can deploy Spring Boot native image applications using the `tanzu-buildpacks/java-native-image` buildpack. [Spring Native](https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html) provides support for compiling Spring Boot applications into native executables. The buildpack uses [Liberica Native Image Kit (NIK)](https://tanzu.vmware.com/content/blog/vmware-tanzu-enterprise-support-spring-boot-native-applications-bellsoft-liberica-nik) to create native images of Spring Boot applications and these applications are fully supported.

When you build a Java Native Image, you must set the build environment `BP_NATIVE_IMAGE` to `true` and the build memory resource shouldn't be less than 8Gi. The build service agent pool size shouldn't be less than `4 vCPU, 8 Gi`. For more information, see the [Build agent pool](how-to-enterprise-build-service.md#build-agent-pool) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

If you want to build the native image into a smaller size container image, then we recommend using a builder with the `Jammy Tiny` OS stack. For more information, see the [OS stack recommendations](#os-stack-recommendations) section.

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                            | Environment variable                                                                                                  | Usage                                                         |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| Integrate with Bellsoft OpenJDK.                                    | Configures the JDK version. Currently supported: JDK 8, 11, and 17.                                                                                                                                                                                                | `BP_JVM_VERSION`                                                                                                      | `--build-env BP_JVM_VERSION=17`                               |
| Configure arguments for the `native-image` command.                 | Arguments to pass directly to the native-image command. These arguments must be valid and correctly formed or the native-image command fails.                                                                                                                      | `BP_NATIVE_IMAGE_BUILD_ARGUMENTS`                                                                                     | `--build-env BP_NATIVE_IMAGE_BUILD_ARGUMENTS="--no-fallback"` |
| Add CA certificates to the system trust store at build and runtime. | See the [Use CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md). | Not applicable.                                                                                                       | Not applicable.                                               |
| Enable configuration of labels on the created image                 | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                                   | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>`                          |
| Support building Maven-based applications from source.              | Used for a multi-module project. Indicates the module to find the application artifact in. Defaults to the root module (empty).                                                                                                                                    | `BP_MAVEN_BUILT_MODULE`                                                                                               | `--build-env BP_MAVEN_BUILT_MODULE=./gateway`                 |

There are some limitations for Java Native Image. For more information, see the [Java Native Image limitations](#java-native-image-limitations) section.

### Deploy PHP applications

The buildpack for deploying PHP applications is [tanzu-buildpacks/php](https://network.tanzu.vmware.com/products/tbs-dependencies/#/releases/1335849/artifact_references).

The Tanzu PHP buildpack is only compatible with the Full OS Stack. We recommend using a builder with the `Jammy Full` OS stack. For more information, see the [OS stack recommendations](#os-stack-recommendations) section.

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                                                                                                    | Environment variable | Usage                               |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|-------------------------------------|
| Specify the PHP version.                                            | Configures the PHP version. Currently supported: PHP *8.0.\**, *8.1.\**, and *8.2.\**. The default value is *8.1.\**                                                                                                                                                                                                                       | `BP_PHP_VERSION`     | `--build-env BP_PHP_VERSION=8.0.*`  |
| Add CA certificates to the system trust store at build and runtime. | See the [Configure CA certificates for app builds and deployments](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#configure-ca-certificates-for-app-builds-and-deployments) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md). | N/A                  | N/A                                 |
| Integrate with Dynatrace, New Relic, App Dynamic APM agent.         | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md).                                                                                                                                                                                                          | N/A                  | N/A                                 |
| Select a Web Server.                                                | The setting options are *php-server*, *httpd*, and *nginx*. The default value is *php-server*.                                                                                                                                                                                                                                             | `BP_PHP_SERVER`      | `--build-env BP_PHP_SERVER=httpd`   |
| Configure Web Directory.                                            | When the web server is HTTPD or NGINX, the web directory defaults to *htdocs*. When the web server is the PHP built-in server, the web directory defaults to */workspace*.                                                                                                                                                                 | `BP_PHP_WEB_DIR`     | `--build-env BP_PHP_WEB_DIR=htdocs` |

## Next steps

- [Deploy web static files](how-to-enterprise-deploy-static-file.md)
