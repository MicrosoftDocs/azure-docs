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

## Use the default builder to deploy an app

In Enterprise tier, the `default` builder includes all the language family buildpacks supported in Azure Spring Apps so you can use it to build polyglot apps.

The `default` builder is read only, so you can't edit or delete it. When you deploy an app, if you don't specify the builder, the `default` builder will be used, making the following two commands equivalent.

```azurecli
az spring app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-JAR-file>
```

```azurecli
az spring app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-JAR-file> \
    --builder default
```

For more information about deploying a polyglot app, see [How to deploy polyglot apps in Azure Spring Apps Enterprise tier](how-to-enterprise-deploy-polyglot-apps.md).

## Configure APM integration and CA certificates

By using Tanzu Partner Buildpacks and CA Certificates Buildpack, Enterprise tier provides a simplified configuration experience to support application performance monitor (APM) integration and certificate authority (CA) certificates integration scenarios for polyglot apps. For more information, see [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).

## Manage custom builders

As an alternative to the `default` builder, you can create custom builders with the provided buildpacks.

All the builders configured in an Azure Spring Apps service instance are listed in the **Build Service** section under **VMware Tanzu components**, as shown in the following screenshot:

:::image type="content" source="media/how-to-enterprise-build-service/builder-list.png" alt-text="Screenshot of Azure portal showing the Build Service page with list of configured builders." lightbox="media/how-to-enterprise-build-service/builder-list.png":::

Select **Add** to create a new builder. The following screenshot shows the resources you should use to create the custom builder. The [OS Stack](https://docs.pivotal.io/tanzu-buildpacks/stacks.html) includes `Bionic Base`, `Bionic Full`, `Jammy Base`, and `Jammy Full`. Bionic is based on `Ubuntu 18.04 (Bionic Beaver)` and Jammy is based on `Ubuntu 22.04 (Jammy Jellyfish)`. For more information, see [Ubuntu Stacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-stacks.html#ubuntu-stacks) in the VMware documentation.

:::image type="content" source="media/how-to-enterprise-build-service/builder-create.png" alt-text="Screenshot of Azure portal showing the Add Builder pane." lightbox="media/how-to-enterprise-build-service/builder-create.png":::

You can also edit a custom builder when the builder isn't used in a deployment. You can update the buildpacks or the OS Stack, but the builder name is read only.

:::image type="content" source="media/how-to-enterprise-build-service/builder-edit.png" alt-text="Screenshot of Azure portal showing the Build Service page with builders list and context menu showing the Edit Builder command." lightbox="media/how-to-enterprise-build-service/builder-edit.png":::

You can delete any custom builder when the builder isn't used in a deployment.

## Build apps using a custom builder

When you deploy an app, you can use the following command to build the app by specifying a specific builder:

```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

The builder is a resource that continuously contributes to your deployments. The builder provides the latest runtime images and latest buildpacks.

You can't delete a builder when existing active deployments are built by the builder. To delete such a builder, save the configuration as a new builder first. After you deploy apps with the new builder, the deployments are linked to the new builder. You can then migrate the deployments under the previous builder to the new builder, and then delete the original builder.

For more information about deploying a polyglot app, see  [How to deploy polyglot apps in Azure Spring Apps Enterprise tier](how-to-enterprise-deploy-polyglot-apps.md).

## Real-time build logs

A build task will be triggered when an app is deployed from an Azure CLI command. Build logs are streamed in real time as part of the CLI command output. For information on using build logs to diagnose problems, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md).

## Next steps

- [Azure Spring Apps](index.yml)
