---
title: How to use Tanzu Build Service in the Azure Spring Apps Enterprise plan
description: Learn how to use Tanzu Build Service in the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/25/2023
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, devx-track-azurecli
---

# Use Tanzu Build Service

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to use VMware Tanzu Build Service with the Azure Spring Apps Enterprise plan.

VMware Tanzu Build Service automates container creation, management, and governance at enterprise scale. Tanzu Build Service uses the open-source [Cloud Native Buildpacks](https://buildpacks.io/) project to turn application source code into container images. It executes reproducible builds aligned with modern container standards and keeps images up to date.

## Buildpacks

VMware Tanzu Buildpacks provide framework and runtime support for applications. Buildpacks typically examine your applications to determine what dependencies to download and how to configure applications to communicate with bound services.

The [language family buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-index.html) are [composite buildpacks](https://paketo.io/docs/concepts/buildpacks/#composite-buildpacks) that provide easy out-of-the-box support for the most popular language runtimes and app configurations. These buildpacks combine multiple component buildpacks into ordered groupings. The groupings satisfy each buildpack's requirements.

## Builders

A [Builder](https://docs.vmware.com/en/Tanzu-Build-Service/1.6/vmware-tanzu-build-service/GUID-index.html#builder) is a Tanzu Build Service resource. A Builder contains a set of buildpacks and a [stack](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-stacks.html) used in the process of building source code.

## Build agent pool

Tanzu Build Service in the Enterprise plan is the entry point to containerize user applications from both source code and artifacts. There's a dedicated build agent pool that reserves compute resources for a given number of concurrent build tasks. The build agent pool prevents resource contention with your running apps.

The following table shows the sizes available for build agent pool scale sets:

| Scale set | CPU/Gi          |
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

Tanzu Build Service allows at most one pool-sized build task to build and twice the pool-sized build tasks to queue. If the quota of the agent pool is insufficient for the build task, the request for this build gets the following error: `The usage of build results in Building or Queuing status are (cpu: xxx, memory: xxxMi) and the remained quota is insufficient for this build. please retry with smaller size of build resourceRequests, retry after the previous build process completed or increased your build agent pool size`.

## Configure the build agent pool

When you create a new Azure Spring Apps Enterprise service instance using the Azure portal, you can use the **VMware Tanzu settings** tab to configure the number of resources given to the build agent pool.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page with V M ware Tanzu settings highlighted and Allocated Resources dropdown showing." lightbox="media/how-to-enterprise-build-service/agent-pool.png":::

The following image shows the resources given to the Tanzu Build Service Agent Pool after you've successfully provisioned the service instance. You can also update the configured agent pool size here after you've created the service instance.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool-size.png" alt-text="Screenshot of Azure portal showing the Build Service page with the dropdown menu to edit allocate resources showing." lightbox="media/how-to-enterprise-build-service/agent-pool-size.png":::

## Build service on demand

You can enable or disable the build service when you create an Azure Spring Apps Enterprise plan instance.

### Build and deployment characteristics

By default, Tanzu Build Service is enabled so that you can use a container registry. If you disable the build service, you can deploy an application only with a custom container image. You have the following options:

- Enable the build service and use the Azure Spring Apps managed container registry.

  Azure Spring Apps provides a managed Azure Container Registry to store built images for your applications. You can execute build and deployment together only as one command, but not separately. You can use the built container images to deploy applications in the same service instance only. The images aren't accessible by other Azure Spring Apps Enterprise service instances.

- Enable the build service and use your own container registry.

  This scenario separates build from deployment. You can execute builds from an application's source code or artifacts to a container image separately from the application deployment. You can deploy the container images stored in your own container registry to multiple Azure Spring Apps Enterprise service instances.

- Disable the build service.

  When you disable the build service, you can deploy applications only with container images, which you can build from any Azure Spring Apps Enterprise service instance.

### Configure build service settings

You can configure Tanzu Build Service and container registry settings using the Azure portal or the Azure CLI.

#### [Azure portal](#tab/azure-portal)

Use the following steps to enable Tanzu Build Service when provisioning an Azure Spring Apps service instance:

1. Open the [Azure portal](https://portal.azure.com).
1. On the **Basics** tab, select **Enterprise tier** in the **Pricing** section, and then specify the required information.
1. Select **Next: VMware Tanzu settings**.
1. On the **VMware Tanzu settings** tab, select **Enable Build Service**. For **Container registry**, the default setting is **Use a managed Azure Container Registry to store built images**.

   :::image type="content" source="media/how-to-enterprise-build-service/enable-build-service-with-default-acr.png" alt-text="Screenshot of the Azure portal showing V M ware Tanzu Settings for the Azure Spring Apps Create page with default Build Service settings highlighted." lightbox="media/how-to-enterprise-build-service/enable-build-service-with-default-acr.png":::

1. If you select **Use your own container registry to store built images (preview)** for **Container registry**, provide your container registry's server, username, and password.

   :::image type="content" source="media/how-to-enterprise-build-service/enable-build-service-with-user-acr.png" alt-text="Screenshot of the Azure portal showing V M ware Tanzu Settings for the Azure Spring Apps Create page with use your own container registry highlighted." lightbox="media/how-to-enterprise-build-service/enable-build-service-with-user-acr.png":::

1. If you disable **Enable Build Service**, the container registry options aren't provided but you can deploy applications with container images.

   :::image type="content" source="media/how-to-enterprise-build-service/disable-build-service.png" alt-text="Screenshot of the Azure portal showing V M ware Tanzu Settings for the Azure Spring Apps Create page with the Enable Build Service not selected." lightbox="media/how-to-enterprise-build-service/disable-build-service.png":::

1. Select **Review and create**.

#### [Azure CLI](#tab/azure-cli)

Use the following steps to enable Tanzu Build Service when provisioning an Azure Spring Apps service instance:

1. Use the following commands to sign in to the Azure CLI, list available subscriptions, and set your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-id>
   ```

1. Use the following command to register the `Microsoft.Saas` namespace.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   ```

1. Use the following command to accept the legal terms and privacy statements for the Azure Spring Apps Enterprise plan. This step is necessary only if your subscription has never been used to create an Enterprise plan instance.

   ```azurecli
   az term accept \
       --plan asa-ent-hr-mtr \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --publisher vmware-inc
   ```

1. Select a location. The location must support the Azure Spring Apps Enterprise plan. For more information, see [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md)

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use one of the following commands to create an Azure Spring Apps service instance:

   - Use the following command to create an Azure Spring Apps service instance with the build service enabled and using a managed Azure Container Registry. The build service is enabled by default.

     ```azurecli
     az spring create \
         --resource-group <resource-group-name> \
         --name <Azure-Spring-Apps-service-instance-name> \
         --sku enterprise
     ```

   - Use the following command to create an Azure Spring Apps service instance with the build service enabled and using your own container registry. The build service is enabled by default.

     ```azurecli
     az spring create \
         --resource-group <resource-group-name> \
         --name <Azure-Spring-Apps-service-instance-name> \
         --sku enterprise \
         --registry-server <your-container-registry-login-server> \
         --registry-username <your-container-registry-username> \
         --registry-password <your-container-registry-password>
     ```

   - Use the following command to create an Azure Spring Apps service instance with the build service disabled.

     ```azurecli
     az spring create \
         --resource-group <resource-group-name> \
         --name <Azure-Spring-Apps-service-instance-name> \
         --sku enterprise \
         --disable-build-service
     ```

---

## Deploy polyglot applications

You can deploy polyglot applications in an Azure Spring Apps Enterprise service instance with Tanzu Build Service either enabled or disabled. For more information, see [How to deploy polyglot apps in Azure Spring Apps Enterprise](how-to-enterprise-deploy-polyglot-apps.md).

## Configure APM integration and CA certificates

By using Tanzu Partner Buildpacks and CA Certificates Buildpack, the Azure Spring Apps Enterprise plan provides a simplified configuration experience to support application performance monitor (APM) integration. This integration includes certificate authority (CA) certificates integration scenarios for polyglot applications. For more information, see [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

## Real-time build logs

A build task is triggered when an application is deployed from an Azure CLI command. Build logs are streamed in real time as part of the CLI command output. For information about using build logs to diagnose problems, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Build history

You can see all the build resources in the **Builds** section of the Azure Spring Apps Build Service page.

:::image type="content" source="media/how-to-enterprise-build-service/build-table.png" alt-text="Screenshot of the Azure portal that shows the Azure Spring Apps Build Service page with Builds highlighted." lightbox="media/how-to-enterprise-build-service/build-table.png":::

- **Build Name**: The name of the build.
- **Provisioning State**: The provisioning state of the build. The values are **Succeeded**, **Failed**, **Updating** and **Creating**. Provisioning state `Updating` or `Creating` means the build can't be updated until the current build finishes. Provisioning state is **Failed** means your latest source code build failed to generate a new build result.
- **Resource Quota**: The resource quota in build pod of the build.
- **Builder**: The builder used in the build.
- **Latest Build Result**: The latest build result image tag of the build.
- **Latest Build Result Provisioning State**: The latest build result provisioning state of the build. The values are **Queuing**, **Building**, **Succeeded**, and **Failed**.
- **Latest Build Result Last Transition Time**: The last transition time for the latest build result of the build.
- **Latest Build Result Last Transition Reason**: The last transition reason for the latest build result of the build. The values are **CONFIG**, **STACK**, and **BUILDPACK**. **CONFIG** value means the build result is changed by builder updates or by a new source code deploy operation. **STACK** value means the build result is changed by stack upgrade and **BUILDPACK** value means the build result is changed by buildpack upgrade.
- **Latest Build Result Last Transition Status**: The last transition status for the latest build result of the build. The values are **True** and **False**.

For `Provisioning State`, when the value is **Failed**, deploy the source code again. If the error persists, create a support ticket.

For `Latest Build Result Provisioning State`, when the value is **Failed**, check the build logs. For more information, see [Troubleshoot common build issues in Azure Spring Apps](troubleshoot-build-exit-code.md). 

For `Latest Build Result Last Transition Status`, when the value is **Failed**, see the **Latest Build Result Last Transition Reason** column. If the reason is `BUILDPACK` or `STACK`, the failure won't affect the deployment. If the reason is `CONFIG`, deploy the source code again. If the error persists, create a support ticket.

## Next steps

- [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-integration-and-ca-certificates.md)
