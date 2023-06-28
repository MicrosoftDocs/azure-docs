---
title: Troubleshoot common build issues in Azure Spring Apps
description: Learn how to troubleshoot common build issues in Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: troubleshooting
ms.date: 10/24/2022
ms.author: yili7
ms.custom: devx-track-java
---

# Troubleshoot common build issues in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article describes how to troubleshoot build issues with your Azure Spring Apps deployment.

## Build exit codes

The Azure Spring Apps Enterprise plan uses Tanzu Buildpacks to transform your application source code into images. For more information, see [Tanzu Buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/index.html).

When you deploy your app in Azure Spring Apps using the [Azure CLI](/cli/azure/install-azure-cli), you see a build log in the Azure CLI console. If the build fails, Azure Spring Apps displays an exit code and error message in the CLI console indicating why the buildpack execution failed during different phases of the buildpack [lifecycle](https://buildpacks.io/docs/concepts/components/lifecycle/).

The following list describes some common exit codes:

- **20** - All buildpack groups have failed to detect.
  
  Consider the following possible causes of an exit code of *20*:

  - The builder you're using doesn't support the language your project used.

    If you're using the default builder, check the language the default builder supports. For more information, see the [Supported APM types](how-to-enterprise-configure-apm-integration-and-ca-certificates.md#supported-apm-types) section of [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

    If you're using the custom builder, check whether your custom builder's buildpack supports the language your project used.

  - You're running against the wrong path; for example, your Maven project's *pom.xml* file isn't in the root path.

    Set `BP_MAVEN_POM_FILE` to specify the location of the project's *pom.xml* file.

  - There's something wrong with your application; for example, your *.jar* file doesn't have a */META-INF/MANIFEST.MF* file that contains a `Main-Class` entry.

- **51** - Buildpack build error.
  
  Consider the following possible causes of an exit code of *51*:

  - If Azure Spring Apps displays the error message `Build failed in stage build with reason OOMKilled` in the Azure CLI console, the build failed due to insufficient memory.

    Use the following command to increase memory using the `build-memory` environment variable:

    ```azurecli
    az spring app deploy \
        --resource-group <your-resource-group-name> \
        --service <your-Azure-Spring-Apps-name> \
        --name <your-app-name> \
        --build-memory 3Gi
    ```

  - The build failed because of an application source code error; for example, there's a compilation error in your source code.
  
    Check the build log to find the root cause.

  - The build failed because of a download dependency error; for example, a network issue caused the Maven dependency download to fail.

  - The build failed because of an unsupported JDK version. For example, the JAR file has been compiled using non-Java LTS versions, which are not supported by the buildpack. For supported versions, see the [Deploy Java applications](how-to-enterprise-deploy-polyglot-apps.md#deploy-java-applications) section of [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md).

- **62** - Failed to write image to Azure Container Registry.
  
  Consider the following possible cause of an exit code of *62*:

  - If Azure Spring Apps displays the error message `Failed to write image to the following tags` in the build log, the build failed because of a network issue.

    Retry to fix the issue.

 If your application is a static file or dynamic front-end application served by a web server, see the [Common build and deployment errors](how-to-enterprise-deploy-static-file.md#common-build-and-deployment-errors) section of [Deploy web static files](how-to-enterprise-deploy-static-file.md).

## Next steps

- [Troubleshoot common Azure Spring Apps issues](./troubleshoot.md)
