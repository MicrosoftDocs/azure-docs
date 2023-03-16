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

The following table shows the build agent pool scale set sizes available:

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

Tanzu Build Service allows at most one pool-sized build task to build and twice the pool-sized build tasks to queue. If the quota of the agent pool is insufficient for the build task, the request for this build will get the following error: `The usage of build results in Building or Queuing status are (cpu: xxx, memory: xxxMi) and the remained quota is insufficient for this build. please retry with smaller size of build resourceRequests, retry after the previous build process completed or increased your build agent pool size`.

## Configure the build agent pool

When you create a new Azure Spring Apps service instance using the Azure portal, you can use the **VMware Tanzu settings** tab to configure the number of resources given to the build agent pool.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page with V M ware Tanzu settings highlighted and Allocated Resources dropdown showing." lightbox="media/how-to-enterprise-build-service/agent-pool.png":::

The following image shows the resources given to the Tanzu Build Service Agent Pool after you've successfully provisioned the service instance. You can also update the configured agent pool size here after the service instance is created.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool-size.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Build Service page with 'General info' highlighted." lightbox="media/how-to-enterprise-build-service/agent-pool-size.png":::

## Build Service on demand

You can enable or disable build service when you provision an Azure Spring Apps Enterprise tier instance. 

If you disable build service, then you can only deploy an application with custom container image. If you enable the build service, you should configure the container registry.

There are two kinds of container registry.

1. `Use a managed Azure container Registry to store built images`. With this option, Azure Spring Apps will offer a managed Azure Container Registry to store built images for your apps. The images can only be deployed in this service instance, and accordingly you can't access these images for other Azure Spring Apps Enterprise service instances to use.

2. `Use your own container registry to store built images (preview)`. With this option, you can provide your own container registry. Then the image can be used cross Azure Spring Apps service instances. In this kind of Azure Spring App service instance, you can also deploy an application with a custom container image.

### [Azure portal](#tab/azure-portal)

- Enable Build Service when provisioning an Azure Spring Apps service instance

1. Open the [Azure portal](https://portal.azure.com).
1. On the **Basics** tab, select **Enterprise tier** in the **Pricing** section and specify the required information. Then select **Next: VMware Tanzu settings**.
1. On the **VMware Tanzu settings** tab, select **Enable Build Service**.

   :::image type="content" source="media/how-to-enterprise-build-service/enable-build-service-with-default-acr.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page with VMware Tanzu settings highlighted and Choose container registry with managed Azure Container Registry showing." lightbox="media/how-to-enterprise-build-service/enable-build-service-with-default-acr.png":::

1. Choose container registry, it will use a managed Azure Container Registry by default. If you choose `Use your own container registry to store built images (preview)`, input your container registry's server, username and password.

   :::image type="content" source="media/how-to-enterprise-build-service/enable-build-service-with-user-acr.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page with VMware Tanzu settings highlighted and Choose container registry with user container registry configuration showing." lightbox="media/how-to-enterprise-build-service/enable-build-service-with-user-acr.png":::

- Disable Build Service when provisioning an Azure Spring Apps service instance

1. On the **VMware Tanzu settings** tab, do not select **Enable Build Service**.

   :::image type="content" source="media/how-to-enterprise-build-service/disable-build-service.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page with VMware Tanzu settings highlighted and Not enable build service showing." lightbox="media/how-to-enterprise-build-service/disable-build-service.png":::

### [Azure CLI](#tab/azure-cli)

- Enable Build Service when provisioning an Azure Spring Apps service instance

1. Use the following command to sign in to the Azure CLI and choose your active subscription:

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

1. Select a location. The location must support Azure Spring Apps Enterprise tier. For more information, see the [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md)

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use the following command to create an Azure Spring Apps service instance with Build Service enabled:
   - Enable build service with a managed Azure Container Registry
   ```azurecli
   az spring create \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-service-instance-name> \
       --sku enterprise 
   ```
   - Enable build service with your own container registry
   ```azurecli
   az spring create \
      --resource-group <resource-group-name> \
      --name <Azure-Spring-Apps-service-instance-name> \
      --sku enterprise \
      --registry-server <your-container-registry-login-server> \
      --registry-username <your-container-registry-username> \
      --registry-password <your-container-registry-password>
   ```

- Disable Build Service when provisioning an Azure Spring Apps service instance

1. The previous 5 prepare steps are same as above

1. Use the following command to create an Azure Spring Apps service instance with Build Service disabled:
   ```azurecli
   az spring create \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-service-instance-name> \
       --sku enterprise \
       --disable-build-service
   ```
---

According to above description, the summary of a service instance enable or disable build service is like below:

|                                         | Enable build service with ASA managed container registry                                                                                                                                                                                                                   | Enable build service with user container registry                                                                                                                                                                                                                                          | Disable build service                                                                                                                                                |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Characteristics of build and deployment | Build and deployment can only be executed together as one command and can't be separately executed, and then accordingly the built container images, stored in Azure Spring Apps managed container registry, can only be used to deploy apps in the same service instance. | Separation of build and deployment: build from an app's source code or artifacts to a container image can be executed separately from the app deployment and the container images stored in your owned container registry can be deployed elsewhere to other Enterprise service instances. | Since build service is disabled, so you can only do app deployment with container images either built from other Azure Spring Apps service instances or by your own. |

## Deploy polyglot apps

You can deploy polyglot apps on your need in Azure Spring Apps enterprise service instance with build service either enabled or disabled. For more information about deploying a polyglot app, see [How to deploy polyglot apps in Azure Spring Apps Enterprise tier](how-to-enterprise-deploy-polyglot-apps.md).

## Configure APM integration and CA certificates

By using Tanzu Partner Buildpacks and CA Certificates Buildpack, Enterprise tier provides a simplified configuration experience to support application performance monitor (APM) integration and certificate authority (CA) certificates integration scenarios for polyglot apps. For more information, see [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).

## Real-time build logs

A build task will be triggered when an app is deployed from an Azure CLI command. Build logs are streamed in real time as part of the CLI command output. For information on using build logs to diagnose problems, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Next steps

- [Azure Spring Apps](index.yml)
