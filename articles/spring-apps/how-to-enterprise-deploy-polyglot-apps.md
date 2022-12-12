---
title: How to Deploy Polyglot Apps in Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: How to Deploy Polyglot Apps in Azure Spring Apps Enterprise Tier
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 12/23/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Deploy polyglot applications with buildpacks in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to deploy polyglot apps in Azure Spring Apps Enterprise tier, and how these polyglot apps using the features that provide by buildpacks in build service.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise tier instance. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.43.0 or higher.

## Deploy a polyglot application
In Enterprise Tier, a `default` builder with below supported [language family buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-index.html) will be provided after creating a service.

- [tanzu-buildpacks/java-azure](https://network.tanzu.vmware.com/products/tanzu-java-azure-buildpack)
- [tanzu-buildpacks/dotnet-core](https://network.tanzu.vmware.com/products/tanzu-dotnet-core-buildpack)
- [tanzu-buildpacks/go](https://network.tanzu.vmware.com/products/tanzu-go-buildpack)
- [tanzu-buildpacks/web-servers](https://network.tanzu.vmware.com/products/tanzu-web-servers-buildpack/)
- [tanzu-buildpacks/nodejs](https://network.tanzu.vmware.com/products/tanzu-nodejs-buildpack)
- [tanzu-buildpacks/python](https://network.tanzu.vmware.com/products/tanzu-python-buildpack/)

Correspondingly, Java, dotNet core, go, web staticfiles, node.js, python apps can be supported to deploy from source code or artifact generally. You can also [create a custom builder](how-to-enterprise-build-service.md#How-to-manage-custom-builders-to-deploy-an-app) with specifying buildpacks and stack.

When deploying polyglot apps, you should choose a builder to build the app, if the builder isn't specified, a `default` builder will be used.

```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

If you deploy the app with an artifact file, the use `--artifact-path` to specify the file path. Both jar/war are acceptable. 
When CLI detect the war package as a thin jar, use `--disable-validation` to disable validation.

If you deploy the source code folder to an active deployment, use `--source-path` to specify the folder.

```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --source-path <path-to-source-code>
```

You can also configure the build environment to build the app. E.g. in java application, you can specify the JDK version using `BP_JVM_VERSION` build environment.
To specify build environments, use `--build-env` (you can learn what kind of build environment variables are configurable in latter section).

```azurecli
az spring app deploy \
    --name <app-name> \
    --build-env <key1=value1> <key2=value2> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

Besides, for each build, you can justify the build resources. The default build cpu/memory resource is `1 vCPU, 2 Gi`, if your app need smaller/larger memory, then use `--build-memory` to specify the memory resources(like `500Mi`, `1Gi`, `2Gi`, ect.), 
if your app need smaller/larger cpu resource, then `--build-cpu` to specify the cpu resources(like `500m`, `1`, `2`, ect). 

The cpu and memory resources are limited by build service [agent pool size](how-to-enterprise-build-service.md#build-agent-pool). The sum of processing build resource quota can't exceed agent pool size.

So the parallel number of build tasks depends on the agent pool size and each build resources. E.g. if build resource is default `1 vCPU, 2 Gi` and agent pool size is `6 vCPU, 12 Gi`, then parallel build number is 6. 
Other build task will be blocked for a while because of resource quota limitation.

```azurecli
az spring app deploy \
    --name <app-name> \
    --build-env <key1=value1> <key2=value2> \
    --build-cpu <build-cpu-size> \
    --build-memory <build-memory-size> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

Your application must listen on port 8080. For Spring Boot application, it will override the `SERVER_PORT` to 8080 automatically. 

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
| VNET                                                            | ✔️   | ✔️    | ✔️   | ✔️       | ✔️ | ✔️       |
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

For different language apps, please read corresponding section below to learn about supported configurations in detail.

### Deploy Java application
- participate buildpack: [tanzu-buildpacks/java-azure](https://network.tanzu.vmware.com/products/tanzu-java-azure-buildpack)
- supported features in Azure Spring Apps

| Feature Description  |Comment | Environment Variable | Usage | 
|------|--------|--------|--------|
|Provides the Microsoft OpenJDK  | Configure the JVM version, default JDK version is 11, currently we only support JDK 8/11/17 | BP_JVM_VERSION | --build-env BP_JVM_VERSION=11.* 
| | Runtime env. Configure whether Java Native Memory Tracking (NMT) is enabled. Defaults to `true`. It not support in JKD8| BPL_JAVA_NMT_ENABLED | --env BPL_JAVA_NMT_ENABLED=true 
| | Configure the level of detail for Java Native Memory Tracking (NMT) output. Defaults to `summary`. Set this to `detail` for detailed NMT output.| BPL_JAVA_NMT_LEVEL | --env BPL_JAVA_NMT_ENABLED=summary 
| Add CA certificates to the system truststore at build and runtime| Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) about how to configure CA certificates | N/A | N/A |
| Integrate with Application Insights, Dynatrace, Elastic, New Relic, App Dynamic APM agent | Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md) about how to configure your preferred APM integration | N/A | N/A |
| Deploy WAR package with Apache Tomcat/Tomee | Set the application server to use. If unset or set value to `tomcat`, will use tomcat. If set value to `tomee`, will use tomee | BP_JAVA_APP_SERVER | --build-env BP_JAVA_APP_SERVER=tomee
| Support Spring Boot applications| Whether to contribute Spring Cloud Bindings support to the image at build time. Defaults to `false` | BP_SPRING_CLOUD_BINDINGS_DISABLED| --build-env BP_SPRING_CLOUD_BINDINGS_DISABLED=false
| | Whether to auto-configure Spring Boot environment properties from bindings at runtime. This requires Spring Cloud Bindings to have been installed at build time or it will do nothing. Defaults to `false` | BPL_SPRING_CLOUD_BINDINGS_DISABLED | --env BPL_SPRING_CLOUD_BINDINGS_DISABLED=false
| Support build Maven-based applications from source | Used for multi module project. Configure the module to find application artifact in. Defaults to the root module (empty) | BP_MAVEN_BUILT_MODULE | --build-env BP_MAVEN_BUILT_MODULE=./gateway
| Support build Gradle-based applications from source | Used for multi module project. Configure the module to find application artifact in. Defaults to the root module (empty) | BP_GRADLE_BUILT_MODULE | --build-env BP_GRADLE_BUILT_MODULE=./gateway
| Enable configuration of labels on the created image | configuration of both OCI-specified labels with short environment variable names, as well as arbitrary labels using a space-delimited syntax in a single environment variable | BP_IMAGE_LABELS <br> BP_OCI_AUTHORS <br> see more envs [here](https://github.com/paketo-buildpacks/image-labels) | --build-env BP_OCI_AUTHORS=\<value>|
| Integrate JProfiler agent|  Whether to contribute JProfiler support, default is `false` | BP_JPROFILER_ENABLED  | build phase: <br>--build-env BP_JPROFILER_ENABLED=true <br> runtime phase: <br> --env BPL_JPROFILER_ENABLED=true <br> BPL_JPROFILER_PORT=\<port\>(Optional, default 8849) <br> BPL_JPROFILER_NOWAIT=true(Optional. Whether the JVM will execute before JProfiler has attached. Defaults to true)
| | Whether to enable JProfiler support at runtime, default is `false` | BPL_JPROFILER_ENABLED | --env BPL_JPROFILER_ENABLED=false
| | What port the JProfiler agent will listen on. Defaults to `8849` | BPL_JPROFILER_PORT | --env BPL_JPROFILER_PORT=8849
| | Whether the JVM will execute before JProfiler has attached. Defaults to `true` | BPL_JPROFILER_NOWAIT | --env BPL_JPROFILER_NOWAIT=true
| Integrate [JRebel](https://www.jrebel.com/) agent |  The application should contains a rebel-remote.xml | N/A | N/A |
| AES encrypts an application at build time and then decrypts it at launch time | AES key to use at build time | BP_EAR_KEY|   --build-env BP_EAR_KEY=\<value>
| |AES key to use at run time| BPL_EAR_KEY|  --env BPL_EAR_KEY=\<value>
| Integrate [AspectJ Weaver](https://www.eclipse.org/aspectj/) agent | <APPLICATION_ROOT>/aop.xml exists <br>aspectj-weaver.*.jar exists | N/A | N/A |

### Deploy Dotnet application
- participate buildpack: [tanzu-buildpacks/dotnet-core](https://network.tanzu.vmware.com/products/tanzu-dotnet-core-buildpack)
- supported features in Azure Spring Apps

| Feature Description  |Comment | Environment Variable | Usage | 
|------------------------------------------------|------|--------|------|
| Configure .NET Core runtime version | Support **Net6.0** and **Net7.0**. <br>It can be configured through a runtimeconfig.json, MSBuild Project file. <br> The default runtime is `6.0.*` | N/A | N/A |
| Add CA certificates to the system truststore at build and runtime| Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) about how to configure CA certificates  | N/A | N/A |
| Integrate with Dynatrace APM agent | Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md) about how to configure your preferred APM integration | N/A | N/A |
| Enable configuration of labels on the created image | configuration of both OCI-specified labels with short environment variable names, as well as arbitrary labels using a space-delimited syntax in a single environment variable | BP_IMAGE_LABELS <br> BP_OCI_AUTHORS <br> see more envs [here](https://github.com/paketo-buildpacks/image-labels) | --build-env BP_OCI_AUTHORS=\<value>|

### Deploy Python application
- participate buildpack: [tanzu-buildpacks/python](https://network.tanzu.vmware.com/products/tanzu-python-buildpack/)
- supported features in Azure Spring Apps

| Feature Description  |Comment | Environment Variable | Usage | 
|------------------------------------------------|------|--------|------|
| Specifying a Python Version | Support `3.7.*`, `3.8.*`, `3.9.*`, `3.10.*` versions, the default is `3.10.*`<br> This version can be specified via the `BP_CPYTHON_VERSION` environment variable during build | BP_CPYTHON_VERSION | --build-env BP_CPYTHON_VERSION=3.8.*
| Add CA certificates to the system truststore at build and runtime| Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) about how to configure CA certificates  | N/A | N/A |
| Enable configuration of labels on the created image | configuration of both OCI-specified labels with short environment variable names, as well as arbitrary labels using a space-delimited syntax in a single environment variable | BP_IMAGE_LABELS <br> BP_OCI_AUTHORS <br> see more envs [here](https://github.com/paketo-buildpacks/image-labels) | --build-env BP_OCI_AUTHORS=\<value>|

### Deploy Go application
- participate buildpack: [tanzu-buildpacks/go](https://network.tanzu.vmware.com/products/tanzu-go-buildpack)
- supported features in Azure Spring Apps 

| Feature Description  |Comment | Environment Variable | Usage | 
|------------------------------------------------|------|--------|------|
| Specify a Go version | Support `1.18.*`, `1.19.*` versions, default `1.18.*`.<br> Go version is automatically detected from app’s go.mod. It is possible to override this version by setting the `BP_GO_VERSION` environment variable at build time | BP_GO_VERSION | --build-env BP_GO_VERSION=1.19.*
| Configuring multiple targets | specify multiple targets for go build | BP_GO_TARGETS | --build-env BP_GO_TARGETS=./some-target:./other-target |
| Add CA certificates to the system truststore at build and runtime| Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) about how to configure CA certificates  | N/A | N/A |
| Integrate with Dynatrace APM agent | Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md) about how to configure your preferred APM integration | N/A | N/A |
| Enable configuration of labels on the created image | configuration of both OCI-specified labels with short environment variable names, as well as arbitrary labels using a space-delimited syntax in a single environment variable | BP_IMAGE_LABELS <br> BP_OCI_AUTHORS <br> see more envs [here](https://github.com/paketo-buildpacks/image-labels) | --build-env BP_OCI_AUTHORS=\<value>|

### Deploy NodeJS application
- participate buildpack: [tanzu-buildpacks/nodejs](https://network.tanzu.vmware.com/products/tanzu-nodejs-buildpack)
- supported features in Azure Spring Apps

| Feature Description  |Comment | Environment Variable | Usage |
|------------------------------------------------|------|--------|------|
| Specify a Node version | Support `12.*`, `14.*` , `16.*`, `18.*` versions, default is `16.*` <br>Node version can be specified  via an .nvmrc or .node-version file att the application directory root, `BP_NODE_VERSION` can override the settings | BP_NODE_VERSION | --build-env BP_NODE_VERSION=18.*
| Add CA certificates to the system truststore at build and runtime| Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md#use-ca-certificates) about how to configure CA certificates  | N/A | N/A |
| Integrate with Dynatrace, Elastic, New Relic, App Dynamic APM agent | Please refer to [this doc](./how-to-enterprise-configure-apm-intergration-and-ca-certificates.md) about how to configure your preferred APM integration | N/A | N/A |
| Enable configuration of labels on the created image | configuration of both OCI-specified labels with short environment variable names, as well as arbitrary labels using a space-delimited syntax in a single environment variable | BP_IMAGE_LABELS <br> BP_OCI_AUTHORS <br> see more envs [here](https://github.com/paketo-buildpacks/image-labels) | --build-env BP_OCI_AUTHORS=\<value>|

### Deploy WebServer application
- participate buildpack: [tanzu-buildpacks/web-servers](https://network.tanzu.vmware.com/products/tanzu-web-servers-buildpack/)
- details about [Deploy web static files](how-to-enterprise-deploy-static-file.md#configure-an-auto-generated-server-configuration-file)

## Next steps

- [Azure Spring Apps](index.yml)
