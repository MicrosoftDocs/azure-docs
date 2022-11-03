---
title: Troubleshoot common build issues in Azure Spring Apps
description: Describes how to troubleshoot common build issues in Azure Spring Apps
author: yilims
ms.service: spring-apps
ms.topic: troubleshooting
ms.date: 10/24/2022
ms.author: yili7
---

# Troubleshoot common build issues in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article will help you solve various problems that can arise when your Azure Spring Apps deployment is failed during build phase.

## Build exit codes

Azure Spring Apps Enterprise tier leverage [Tanzu Buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/index.html) to transform your application source code into images. 
When deploying your Azure Spring Apps via [Azure CLI](/cli/azure/install-azure-cli), you will see build log in Azure CLI console. 
If the build is failed, exit code and error message is shown in the CLI console.
The exit code and error message indicates the reason why the buildpack execution is failed during different [phase](https://buildpacks.io/docs/concepts/components/lifecycle/). 
The following list describes the most common exit codes:

- **20** - All buildpacks groups have failed to detect. 
  
  Consider the following possible causes for 20 exit code:
  - The builder you are using doesn't support the language your project used.
    - If you are using the default builder, check [the language the default builder supports](how-to-enterprise-build-service.md#default-builder-and-tanzu-buildpacks).
    - If you are using the custom builder, check if your custom builder has the Buildpack supports the language your project used.

  - You are running against the wrong path.
  
    For example, your Maven project's pom.xml file is not in root path. You can set BP_MAVEN_POM_FILE to specify the project's pom.xml file. 
    
  - There's something wrong with your application.

    For example, your jar file doesn't have a /META-INF/MANIFEST.MF file which contains a Main-Class entry.
    
- **51** - Buildpack build error.
  
  Consider the following possible causes for 51 exit code:

  - Error message "Build failed in stage build with reason OOMKilled" is shown in Azure CLI console.

    Build is failed due to insufficient memory, increase memory via setting build environment variable in Azure CLI:
    ```azurecli
    az spring app deploy
        --resource-group <your-resource-group-name> \
        --service <your-Azure-Spring-Apps-name> \
        --name <your-app-name> \
        --build-memory 3Gi
    ```

  - Application source code error:
  
    For example, there's compilation error in your source code. You can check the build log to find out the root cause.
    
  - Download dependency error:
  
    For example, maven dependency download is failed due to network issue. 
    
- **62** - Failed to write image to Azure Container Registry.
  
  Consider the following possible causes for 62 exit code:

  - Error message "failed to write image to the following tags" is shown in build log.
  
    Failed to write image to Azure Container Registry due to network issue, you can retry to fix the issue.

 If your application is a static file or dynamic front-end application served by a web server, see the [Common build and deployment errors](how-to-enterprise-deploy-static-file.md#common-build-and-deployment-errors) section of [Deploy static files in Azure Spring Apps Enterprise tier](how-to-enterprise-deploy-static-file.md).

## Next steps

- [Troubleshoot common Azure Spring Apps issues](./troubleshoot.md)
