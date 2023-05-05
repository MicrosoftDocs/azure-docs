---
title: How to deploy polyglot apps in Azure Spring Apps Enterprise tier
description: Shows you how to deploy polyglot apps in Azure Spring Apps Enterprise tier.
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 01/13/2023
ms.custom: devx-track-java, event-tier1-build-2022
---

# How to deploy polyglot apps in Azure Spring Apps Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy polyglot apps in Azure Spring Apps Enterprise tier, and how these polyglot apps can use the build service features provided by buildpacks.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.45.0 or higher.

## Deploy a polyglot application

When you create an Enterprise tier instance of Azure Spring Apps, you'll be provided with a `default` builder with one of the following supported [language family buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-index.html):

- [tanzu-buildpacks/java-azure](https://network.tanzu.vmware.com/products/tanzu-java-azure-buildpack)
- [tanzu-buildpacks/dotnet-core](https://network.tanzu.vmware.com/products/tanzu-dotnet-core-buildpack)
- [tanzu-buildpacks/go](https://network.tanzu.vmware.com/products/tanzu-go-buildpack)
- [tanzu-buildpacks/web-servers](https://network.tanzu.vmware.com/products/tanzu-web-servers-buildpack/)
- [tanzu-buildpacks/nodejs](https://network.tanzu.vmware.com/products/tanzu-nodejs-buildpack)
- [tanzu-buildpacks/python](https://network.tanzu.vmware.com/products/tanzu-python-buildpack/)

These buildpacks support deployment from source code or artifact for Java, .NET Core, Go, web static files, Node.js, and Python apps. You can also create a custom builder by specifying buildpacks and stack. For more information, see the [Manage custom builders](how-to-enterprise-build-service.md#manage-custom-builders) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

When deploying polyglot apps, you should choose a builder to build the app, as shown in the following example. If you don't specify the builder, a `default` builder will be used.

```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

If you deploy the app with an artifact file, use `--artifact-path` to specify the file path. Both JAR and WAR files are acceptable.

If the Azure CLI detects the WAR package as a thin JAR, use `--disable-validation` to disable validation.

If you deploy the source code folder to an active deployment, use `--source-path` to specify the folder, as shown in the following example:

```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --source-path <path-to-source-code>
```

You can also configure the build environment to build the app. For example, in a Java application, you can specify the JDK version using the `BP_JVM_VERSION` build environment.

To specify build environments, use `--build-env`, as shown in the following example. The available build environment variables are described later in this article.

```azurecli
az spring app deploy \
    --name <app-name> \
    --build-env <key1=value1> <key2=value2> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

Additionally, for each build, you can specify the build resources, as shown in the following example.

```azurecli
az spring app deploy \
    --name <app-name> \
    --build-env <key1=value1> <key2=value2> \
    --build-cpu <build-cpu-size> \
    --build-memory <build-memory-size> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

The default build CPU/memory resource is `1 vCPU, 2 Gi`. If your app needs a smaller or larger amount of memory, then use `--build-memory` to specify the memory resources; for example, `500Mi`, `1Gi`, `2Gi`, and so on. If your app needs a smaller or larger amount of CPU resources, then use `--build-cpu` to specify the CPU resources; for example, `500m`, `1`, `2`, and so on. The maximum CPU/memory resource limit for a build is `8 vCPU, 16Gi`.

The CPU and memory resources are limited by the build service agent pool size. For more information, see the [Build agent pool](how-to-enterprise-build-service.md#build-agent-pool) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md). The sum of the processing build resource quota can't exceed the agent pool size.

The parallel number of build tasks depends on the agent pool size and each build resource. For example, if the build resource is the default `1 vCPU, 2 Gi` and the agent pool size is `6 vCPU, 12 Gi`, then the parallel build number is 6.

Other build tasks will be blocked for a while because of resource quota limitations.

Your application must listen on port 8080. Spring Boot applications will override the `SERVER_PORT` to use 8080 automatically.

The following table indicates the features supported for each language.

| Feature                                                         | Java | Python | Node | .NET Core | Go |[Static Files](how-to-enterprise-deploy-static-file.md)|
|-----------------------------------------------------------------|------|--------|------|-----------|----|-----------|
| App lifecycle management                                        | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Assign endpoint                                                 | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Azure Monitor                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Out of box APM integration                                      | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| Blue/green deployment                                           | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Custom domain                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Scaling - auto scaling                                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Scaling - manual scaling (in/out, up/down)                      | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Managed Identity                                                | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| API portal for VMware Tanzu®                                    | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Spring Cloud Gateway for VMware Tanzu®                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Application Configuration Service for VMware Tanzu®             | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| VMware Tanzu® Service Registry                                  | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| Virtual network                                                 | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Outgoing IP Address                                             | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| E2E TLS                                                         | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Advanced troubleshooting - thread/heap/JFR dump                 | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| Bring your own storage                                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Integrate service binding with Resource Connector               | ✔️   | ❌    | ❌   | ❌       | ❌ | ❌       |
| Availability Zone                                               | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| App Lifecycle events                                            | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Reduced app size - 0.5 vCPU and 512 MB                          | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Automate app deployments with Terraform and Azure Pipeline Task | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Soft Deletion                                                   | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| Interactive diagnostic experience (AppLens-based)               | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
| SLA                                                             | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |

For more information about the supported configurations for different language apps, see the corresponding section later in this article.

### Deploy Java applications

The buildpack for deploying Java applications is [tanzu-buildpacks/java-azure](https://network.tanzu.vmware.com/products/tanzu-java-azure-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                                        | Comment                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                                                                                                                                                                                                                                                                                                                |
|--------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Provides the Microsoft OpenJDK.                                                            | Configures the JVM version. The default JDK version is 11. We currently support only JDK 8, 11, and 17.                                                                                                                                                    | `BP_JVM_VERSION`                                                                                                      | `--build-env BP_JVM_VERSION=11.*`                                                                                                                                                                                                                                                                                                    |
|                                                                                            | Runtime env. Configures whether Java Native Memory Tracking (NMT) is enabled. The default value is *true*. Not supported in JDK 8.                                                                                                                         | `BPL_JAVA_NMT_ENABLED`                                                                                                | `--env BPL_JAVA_NMT_ENABLED=true`                                                                                                                                                                                                                                                                                                    |
|                                                                                            | Configures the level of detail for Java Native Memory Tracking (NMT) output. The default value is *summary*. Set to *detail* for detailed NMT output.                                                                                                      | `BPL_JAVA_NMT_LEVEL`                                                                                                  | `--env BPL_JAVA_NMT_ENABLED=summary`                                                                                                                                                                                                                                                                                                 |
| Add CA certificates to the system trust store at build and runtime.                        | See the [Use CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                                  |
| Integrate with Application Insights, Dynatrace, Elastic, New Relic, App Dynamic APM agent. | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).                                                                                                                         | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                                  |
| Deploy WAR package with Apache Tomcat or TomEE.                                            | Set the application server to use. Set to *tomcat* to use Tomcat and *tomee* to use TomEE. The default value is *tomcat*.                                                                                                                                  | `BP_JAVA_APP_SERVER`                                                                                                  | `--build-env BP_JAVA_APP_SERVER=tomee`                                                                                                                                                                                                                                                                                               |
| Support Spring Boot applications.                                                          | Indicates whether to contribute Spring Cloud Bindings support for the image at build time. The default value is *false*.                                                                                                                                   | `BP_SPRING_CLOUD_BINDINGS_DISABLED`                                                                                   | `--build-env BP_SPRING_CLOUD_BINDINGS_DISABLED=false`                                                                                                                                                                                                                                                                                |
|                                                                                            | Indicates whether to auto-configure Spring Boot environment properties from bindings at runtime. This feature requires Spring Cloud Bindings to have been installed at build time or it will do nothing. The default value is *false*.                     | `BPL_SPRING_CLOUD_BINDINGS_DISABLED`                                                                                  | `--env BPL_SPRING_CLOUD_BINDINGS_DISABLED=false`                                                                                                                                                                                                                                                                                     |
| Support building Maven-based applications from source.                                     | Used for a multi-module project. Indicates the module to find the application artifact in. Defaults to the root module (empty)                                                                                                                             | `BP_MAVEN_BUILT_MODULE`                                                                                               | `--build-env BP_MAVEN_BUILT_MODULE=./gateway`                                                                                                                                                                                                                                                                                        |
| Support building Gradle-based applications from source.                                    | Used for a multi-module project. Indicates the module to find the application artifact in. Defaults to the root module (empty)                                                                                                                             | `BP_GRADLE_BUILT_MODULE`                                                                                              | `--build-env BP_GRADLE_BUILT_MODULE=./gateway`                                                                                                                                                                                                                                                                                       |
| Enable configuration of labels on the created image.                                       | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> see more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>`                                                                                                                                                                                                                                                                                                 |
| Integrate JProfiler agent.                                                                 | Indicates whether to integrate JProfiler support. The default value is *false*.                                                                                                                                                                            | `BP_JPROFILER_ENABLED`                                                                                                | build phase: <br>`--build-env BP_JPROFILER_ENABLED=true` <br> runtime phase: <br> `--env BPL_JPROFILER_ENABLED=true` <br> `BPL_JPROFILER_PORT=<port>` (optional, defaults to *8849*) <br> `BPL_JPROFILER_NOWAIT=true` (optional. Indicates whether the JVM will execute before JProfiler has attached. The default value is *true*.) |
|                                                                                            | Indicates whether to enable JProfiler support at runtime. The default value is *false*.                                                                                                                                                                    | `BPL_JPROFILER_ENABLED`                                                                                               | `--env BPL_JPROFILER_ENABLED=false`                                                                                                                                                                                                                                                                                                  |
|                                                                                            | Indicates which port the JProfiler agent will listen on. The default value is *8849*.                                                                                                                                                                      | `BPL_JPROFILER_PORT`                                                                                                  | `--env BPL_JPROFILER_PORT=8849`                                                                                                                                                                                                                                                                                                      |
|                                                                                            | Indicates whether the JVM will execute before JProfiler has attached. The default value is *true*.                                                                                                                                                         | `BPL_JPROFILER_NOWAIT`                                                                                                | `--env BPL_JPROFILER_NOWAIT=true`                                                                                                                                                                                                                                                                                                    |
| Integrate [JRebel](https://www.jrebel.com/) agent.                                         | The application should contain a *rebel-remote.xml* file.                                                                                                                                                                                                  | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                                  |
| AES encrypts an application at build time and then decrypts it at launch time.             | The AES key to use at build time.                                                                                                                                                                                                                          | `BP_EAR_KEY`                                                                                                          | `--build-env BP_EAR_KEY=<value>`                                                                                                                                                                                                                                                                                                     |
|                                                                                            | The AES key to use at run time.                                                                                                                                                                                                                            | `BPL_EAR_KEY`                                                                                                         | `--env BPL_EAR_KEY=<value>`                                                                                                                                                                                                                                                                                                          |
| Integrate [AspectJ Weaver](https://www.eclipse.org/aspectj/) agent.                        | `<APPLICATION_ROOT>`/*aop.xml* exists and *aspectj-weaver.\*.jar* exists.                                                                                                                                                                                  | N/A                                                                                                                   | N/A                                                                                                                                                                                                                                                                                                                                  |

### Deploy .NET applications

The buildpack for deploying .NET applications is [tanzu-buildpacks/dotnet-core](https://network.tanzu.vmware.com/products/tanzu-dotnet-core-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                |
|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Configure the .NET Core runtime version.                            | Supports *Net6.0* and *Net7.0*. <br> You can configure through a *runtimeconfig.json* or MSBuild Project file. <br> The default runtime is *6.0.\**.                                                                                                       | N/A                                                                                                                   | N/A                                  |
| Add CA certificates to the system trust store at build and runtime. | See the [Use CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                  |
| Integrate with Dynatrace APM agent.                                 | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).                                                                                                                         | N/A                                                                                                                   | N/A                                  |
| Enable configuration of labels on the created image.                | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>` |

### Deploy Python applications

The buildpack for deploying Python applications is [tanzu-buildpacks/python](https://network.tanzu.vmware.com/products/tanzu-python-buildpack/).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                  |
|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| Specify a Python version.                                           | Supports *3.7.\**, *3.8.\**, *3.9.\**, *3.10.\**, *3.11.\**. The default value is *3.10.\**<br> You can specify the version via the `BP_CPYTHON_VERSION` environment variable during build.                                                                | `BP_CPYTHON_VERSION`                                                                                                  | `--build-env BP_CPYTHON_VERSION=3.8.*` |
| Add CA certificates to the system trust store at build and runtime. | See the [Use CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                    |
| Enable configuration of labels on the created image.                | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>`   |

### Deploy Go applications

The buildpack for deploying Go applications is [tanzu-buildpacks/go](https://network.tanzu.vmware.com/products/tanzu-go-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                 | Comment                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                                    |
|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| Specify a Go version.                                               | Supports *1.18.\**, *1.19.\**. The default value is *1.18.\**.<br> The Go version is automatically detected from the app’s *go.mod* file. You can override this version by setting the `BP_GO_VERSION` environment variable at build time.                 | `BP_GO_VERSION`                                                                                                       | `--build-env BP_GO_VERSION=1.19.*`                       |
| Configure multiple targets.                                         | Specifies multiple targets for a Go build.                                                                                                                                                                                                                 | `BP_GO_TARGETS`                                                                                                       | `--build-env BP_GO_TARGETS=./some-target:./other-target` |
| Add CA certificates to the system trust store at build and runtime. | See the [Use CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                                      |
| Integrate with Dynatrace APM agent.                                 | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).                                                                                                                         | N/A                                                                                                                   | N/A                                                      |
| Enable configuration of labels on the created image.                | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>`                     |

### Deploy Node.js applications

The buildpack for deploying Node.js applications is [tanzu-buildpacks/nodejs](https://network.tanzu.vmware.com/products/tanzu-nodejs-buildpack).

The following table lists the features supported in Azure Spring Apps:

| Feature description                                                  | Comment                                                                                                                                                                                                                                                    | Environment variable                                                                                                  | Usage                                |
|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Specify a Node version.                                              | Supports *12.\**, *14.\**, *16.\**, *18.\**, *19.\**. The default value is *18.\**. <br>You can specify the Node version via an *.nvmrc* or *.node-version* file at the application directory root. `BP_NODE_VERSION` overrides the settings.              | `BP_NODE_VERSION`                                                                                                     | `--build-env BP_NODE_VERSION=18.*`   |
| Add CA certificates to the system trust store at build and runtime.  | See the [Use CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md). | N/A                                                                                                                   | N/A                                  |
| Integrate with Dynatrace, Elastic, New Relic, App Dynamic APM agent. | See [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).                                                                                                                         | N/A                                                                                                                   | N/A                                  |
| Enable configuration of labels on the created image.                 | Configures both OCI-specified labels with short environment variable names and arbitrary labels using a space-delimited syntax in a single environment variable.                                                                                           | `BP_IMAGE_LABELS` <br> `BP_OCI_AUTHORS` <br> See more envs [here](https://github.com/paketo-buildpacks/image-labels). | `--build-env BP_OCI_AUTHORS=<value>` |

### Deploy WebServer applications

The buildpack for deploying WebServer applications is [tanzu-buildpacks/web-servers](https://network.tanzu.vmware.com/products/tanzu-web-servers-buildpack/).

For more information, see [Deploy web static files](how-to-enterprise-deploy-static-file.md).

## Next steps

- [Azure Spring Apps](index.yml)
