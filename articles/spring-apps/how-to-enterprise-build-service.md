---
title: How to use Tanzu Build Service in Azure Spring Apps Enterprise tier
description: Learn how to use Tanzu Build Service in Azure Spring Apps Enterprise tier.
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/23/2022
ms.custom: devx-track-java, event-tier1-build-2022
---

# Use Tanzu Build Service

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use VMware Tanzu® Build Service™ with Azure Spring Apps Enterprise tier.

VMware Tanzu Build Service automates container creation, management, and governance at enterprise scale. Tanzu Build Service uses the open-source [Cloud Native Buildpacks](https://buildpacks.io/) project to turn application source code into container images. It executes reproducible builds aligned with modern container standards and keeps images up to date.

## Buildpacks

VMware Tanzu Buildpacks provide framework and runtime support for applications. Buildpacks typically examine your applications to determine what dependencies to download and how to configure the apps to communicate with bound services.

The [language family buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-index.html) are [composite buildpacks](https://paketo.io/docs/concepts/buildpacks/#composite-buildpacks) that provide easy out-of-the-box support for the most popular language runtimes and app configurations. These buildpacks combine multiple component buildpacks into ordered groupings. The groupings satisfy each buildpack’s requirements.

## Builders

A [Builder](https://docs.vmware.com/en/Tanzu-Build-Service/1.6/vmware-tanzu-build-service/GUID-index.html#builder) is a Tanzu Build Service resource. A Builder contains a set of buildpacks and a [stack](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-stacks.html) used in the process of building source code.

## Build agent pool

Tanzu Build Service in the Enterprise tier is the entry point to containerize user applications from both source code and artifacts. There's a dedicated build agent pool that reserves compute resources for a given number of concurrent build tasks. The build agent pool prevents resource contention with your running apps.

The following table shows the sizes available for build agent pool scale sets:

| Scale Set | CPU/Gi          |
|-----------|-----------------|
| S1        | 2 vCPU, 4 Gi    |
| S2        | 3 vCPU, 6 Gi    |
| S3        | 4 vCPU, 8 Gi    |
| S4        | 5 vCPU, 10 Gi   |
| S5        | 6 vCPU, 12 Gi   |
| S6        | 8 vCPU, 16 Gi   |
| S7        | 16 vCPU, 32 Gi  |
| S8        | 32 vCPU, 64 Gi  |
| S9        | 64 vCPU, 128 Gi |

Tanzu Build Service allows at most one pool-sized build task to build and twice the pool-sized build tasks to queue.

If the quota of the agent pool is insufficient for the build task, the build request receives an error message with the queue and build status and related information. The following suggestions are included:

- Try smaller sizes of build resource requests.
- Try larger build agent pool sizes.

## Configure the build agent pool

When you create a new Azure Spring Apps service instance using the Azure portal, you can use the **VMware Tanzu settings** tab to configure the number of resources given to the build agent pool.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page with VMware Tanzu settings highlighted and Allocated Resources dropdown showing." lightbox="media/how-to-enterprise-build-service/agent-pool.png":::

The following image shows the resources given to the Tanzu Build Service Agent Pool after you have successfully provisioned the service instance. You can also update the configured agent pool size here after the service instance is created.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool-size.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Build Service page with 'General info' highlighted." lightbox="media/how-to-enterprise-build-service/agent-pool-size.png":::

## Build Service on demand

You can enable or disable Tanzu Build Service when you create an Azure Spring Apps Enterprise tier instance.

### Build and deployment characteristics

By default, the Tanzu Build Service is enabled so that you can use a container registry. If you disable Build Service, you can deploy an application only with a custom container image. You have the following options:

- Build service enabled with an Azure Spring Apps managed container registry

  Azure Spring Apps provides a managed Azure Container Registry to store built images for your applications. You can execute build and deployment together only as one command, but not separately. You can only use the built container images to deploy applications in the same service instance. The images aren't accessible by other Azure Spring Apps Enterprise service instances.

- Enable build service with your own container registry

  This scenario separates build from deployment. You can execute builds from an application's source code or artifacts to a container image separately from the application deployment. You can deploy the container images stored in your owned container registry across other Enterprise service instances.

- Disable build service

  With Build Service disabled, you can only deploy applications with container images either built from other Azure Spring Apps service instances or from your own.

### Configure Build Service settings

You can configure Tanzu Build Service and container registry settings using the Azure portal or the Azure CLI.

#### [Azure portal](#tab/azure-portal)

Use the following steps to enable Tanzu Build Service when provisioning an Azure Spring Apps service instance:

1. Open the [Azure portal](https://portal.azure.com).
1. In **Basics**, select **Enterprise tier** in **Pricing** and specify the required information.
1. Select **Next: VMware Tanzu settings**.
1. In **VMware Tanzu settings**, select **Enable Build Service**. For **Container registry**, the default setting is **Use a managed Azure Container Registry to store built images**.

   :::image type="content" source="media/how-to-enterprise-build-service/enable-build-service-with-default-acr.png" alt-text="Screenshot of the Azure portal showing the Create Azure Spring Apps page with Build Service settings highlighted and Enable Build Service selected." lightbox="media/how-to-enterprise-build-service/enable-build-service-with-default-acr.png":::

1. For **Container registry**, if you select **Use your own container registry to store built images (preview)**, input your container registry's server, username and password.

   :::image type="content" source="media/how-to-enterprise-build-service/enable-build-service-with-user-acr.png" alt-text="Screenshot of the Azure portal showing the Create Azure Spring Apps page with Build Service settings highlighted and managed registry selected." lightbox="media/how-to-enterprise-build-service/enable-build-service-with-user-acr.png":::

1. Select **Review and create** to finish completing the Azure Spring Apps instance.

If you disable **Enable Build Service**, the container registry options aren't provided but you can deploy applications with container images.

:::image type="content" source="media/how-to-enterprise-build-service/disable-build-service.png" alt-text="Screenshot of the Azure portal showing the Create Azure Spring Apps page with the Enable Build Service option not selected." lightbox="media/how-to-enterprise-build-service/disable-build-service.png":::

#### [Azure CLI](#tab/azure-cli)

Use the following steps to enable Tanzu Build Service when provisioning an Azure Spring Apps service instance:

1. Use the following command to sign in to the Azure CLI and set your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for Azure Spring Apps Enterprise tier. This step is necessary only if your subscription has never been used to create an Enterprise tier instance.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Select a location. The location must support Azure Spring Apps Enterprise tier. For more information, see [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md)

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use the following commands to create an Azure Spring Apps service instance depending on whether Build Service is enabled and your preferred container registry setting.

   - Use the following command to create an Azure Spring Apps service instance with Build Service enabled and using a managed Azure Container Registry. The Build Service is enabled by default.

     ```azurecli
     az spring create \
         --resource-group <resource-group-name> \
         --name <Azure-Spring-Apps-service-instance-name> \
         --sku enterprise 
     ```

   - Use the following command to create an Azure Spring Apps service instance with Build Service enabled and using your own container registry. The Build Service is enabled by default.

     ```azurecli
     az spring create \
         --resource-group <resource-group-name> \
         --name <Azure-Spring-Apps-service-instance-name> \
         --sku enterprise \
         --registry-server <your-container-registry-login-server> \
         --registry-username <your-container-registry-username> \
         --registry-password <your-container-registry-password>
     ```

   - Use the following command to create an Azure Spring Apps service instance with Build Service disabled.

     ```azurecli
     az spring create \
         --resource-group <resource-group-name> \
         --name <Azure-Spring-Apps-service-instance-name> \
         --sku enterprise \
         --disable-build-service
     ```

---

## Deploy polyglot applications

You can deploy polyglot applications in an Azure Spring Apps enterprise service instance with Tanzu Build Service either enabled or disabled. For more information about deploying a polyglot application, see [How to deploy polyglot apps in Azure Spring Apps Enterprise tier](how-to-enterprise-deploy-polyglot-apps.md).

## Configure APM integration and CA certificates

By using Tanzu Partner Buildpacks and CA Certificates Buildpack, the Enterprise tier provides a simplified configuration experience to support application performance monitor (APM) integration. This integration includes certificate authority (CA) certificates integration scenarios for polyglot applications. For more information, see [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).

## Real-time build logs

A build task is triggered when an application is deployed from an Azure CLI command. Build logs are streamed in real time as part of the CLI command output. For information about using build logs to diagnose problems, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Next steps

- [Azure Spring Apps](index.yml)
