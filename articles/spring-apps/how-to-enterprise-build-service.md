---
title: How to Use Tanzu Build Service in Azure Spring Apps Enterprise Tier
titleSuffix: Azure Spring Apps Enterprise Tier
description: Learn how to Use Tanzu Build Service in Azure Spring Apps Enterprise Tier
author: karlerickson
ms.author: fenzho
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/23/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Use Tanzu Build Service

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to use VMware Tanzu® Build Service™ with Azure Spring Apps Enterprise Tier.

VMware Tanzu Build Service automates container creation, management, and governance at enterprise scale. Tanzu Build Service uses the open-source [Cloud Native Buildpacks](https://buildpacks.io/) project to turn application source code into container images. It executes reproducible builds aligned with modern container standards and keeps images up to date.

## Concept
### Buildpacks

VMware Tanzu Buildpacks provide framework and runtime support for applications. Buildpacks typically examine your applications to determine what dependencies to download and how to configure the apps to communicate with bound services.

#### Language Family Buildpacks

The [language family buildpacks](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-index.html) are [composite buildpacks](https://paketo.io/docs/concepts/buildpacks/#composite-buildpacks) that provide easy out-of-the-box support the most popular language runtimes and app configurations. These buildpacks combine multiple component buildpacks into ordered groupings. The groupings satisfy each buildpack’s requirements.

### Builder

A [Builder](https://docs.vmware.com/en/Tanzu-Build-Service/1.6/vmware-tanzu-build-service/GUID-index.html#builder) is a Tanzu Build Service resource, it contains a set of buildpacks and a [stack](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-stacks.html) used in the process of building source code.


### Build Agent Pool

Tanzu Build Service in the Enterprise tier is the entry point to containerize user applications from both source code and artifacts. There's a dedicated build agent pool that reserves compute resources for a given number of concurrent build tasks. The build agent pool prevents resource contention with your running apps.

The Build Agent Pool scale set sizes available are:

| Scale Set | CPU/Gi        |
|-----------|---------------|
| S1        | 2 vCPU, 4 Gi  |
| S2        | 3 vCPU, 6 Gi  |
| S3        | 4 vCPU, 8 Gi  |
| S4        | 5 vCPU, 10 Gi |
| S5        | 6 vCPU, 12 Gi |

## How to configure Build Agent Pool

You can configure the number of resources given to the build agent pool during creating a new service instance of Azure Spring Apps using the **VMware Tanzu settings**.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page with V M ware Tanzu settings highlighted and Allocated Resources dropdown showing." lightbox="media/how-to-enterprise-build-service/agent-pool.png":::

The following image shows the resources given to the Tanzu Build Service Agent Pool after you've successfully provisioned the service instance. You can also update the configured agent pool size here after service instance created.

:::image type="content" source="media/how-to-enterprise-build-service/agent-pool-size.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Build Service page with 'General info' highlighted." lightbox="media/how-to-enterprise-build-service/agent-pool-size.png":::

## How to use default builder to deploy an app

In Enterprise Tier, the `default` builder includes all supported language family buildpacks in Azure Spring Apps, so it can be used to build polyglot apps.

The `default` builder is read only, so it can't be edited or deleted. When deploy an app, if the builder isn't specified, then the `default` builder will be used.

```azurecli
az spring app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-JAR-file>
```
is equals to 

```azurecli
az spring app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-JAR-file> \
    --builder default
```

For more details about deploying a ployglot app, see  [How to Deploy Polyglot Apps in Azure Spring Apps Enterprise Tier](how-to-enterprise-deploy-polyglot-apps.md).

## How to configure APM integration and CA certificates

By leveraging Tanzu Partner Buildpacks and CA Certificates Buildpack, Enterprise tier provides smooth and easy-to-use configuration experience to support APM integration and CA certificates integration scenarios for polyglot apps. See more details in [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-intergration-and-ca-certificates.md).

## How to manage custom builders to deploy an app
### How to manage a custom builder

Besides the `default` builder, you can also create custom builders with the provided buildpacks.

All the builders configured in a Spring Cloud Service instance are listed in the **Build Service** section under **VMware Tanzu components**.

:::image type="content" source="media/how-to-enterprise-build-service/builder-list.png" alt-text="Screenshot of Azure portal showing the Build Service page with list of configured builders." lightbox="media/how-to-enterprise-build-service/builder-list.png":::

Select **Add** to create a new builder. The image below shows the resources you should use to create the custom builder.

The [OS Stack](https://docs.pivotal.io/tanzu-buildpacks/stacks.html) include `Bionic Base`, `Bionic Full`, `Jammy Base`, `Jammy Full`. Bionic based on `Ubuntu 18.04 (Bionic Beaver)` and Jammy based on `Ubuntu 22.04 (Jammy Jellyfish)`.
See the base/full usage scenario [here](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/services/tanzu-buildpacks/GUID-stacks.html#ubuntu-stacks)

:::image type="content" source="media/how-to-enterprise-build-service/builder-create.png" alt-text="Screenshot of Azure portal showing the Add Builder pane." lightbox="media/how-to-enterprise-build-service/builder-create.png":::

You can also edit a custom builder when the builder isn't used in a deployment. You can update the buildpacks or the OS Stack, but the builder name is read only.

:::image type="content" source="media/how-to-enterprise-build-service/builder-edit.png" alt-text="Screenshot of Azure portal showing the Build Service page with builders list and context menu showing the Edit Builder command." lightbox="media/how-to-enterprise-build-service/builder-edit.png":::

You can delete any custom builder when the builder isn't used in a deployment.

### How to build apps using a custom builder 
When you deploy an app, you can build the app by specifying a specific builder in the command:

```azurecli
az spring app deploy \
    --name <app-name> \
    --builder <builder-name> \
    --artifact-path <path-to-your-JAR-file>
```

The builder is a resource that continuously contributes to your deployments. The builder provides the latest runtime images and latest buildpacks.
When existing active deployments that build by a builder, then the builder aren't allowed to be deleted. To delete such kinds of builder, save the configuration as a new builder first. After you deploy apps with the new builder, the deployments are linked to the new builder. You can then migrate the deployments under the previous builder to the new builder, and make deletions.

For more details about deploying a ployglot app, see  [How to Deploy Polyglot Apps in Azure Spring Apps Enterprise Tier](how-to-enterprise-deploy-polyglot-apps.md).

## Real-time build logs

A build task will be triggered when an app is deployed from an Azure CLI command. Build logs are streamed in real time as part of the CLI command output. For information on using build logs to diagnose problems, see [Analyze logs and metrics with diagnostics settings](./diagnostic-services.md) .

---

## Next steps

- [Azure Spring Apps](index.yml)
