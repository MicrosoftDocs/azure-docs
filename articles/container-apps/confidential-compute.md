---
title: Confidential compute in Azure Container Apps (preview)
description: Learn how confidential compute in Azure Container Apps helps protect containerized workloads while data is in use.
services: container-apps
author: jefmarti
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 2026-05-19
ms.author: jefmarti
---

# Confidential compute in Azure Container Apps (preview)

Confidential compute in Azure Container Apps helps protect containerized workloads while data is being processed. In this article, you learn when to use confidential compute, how it works with dedicated workload profiles, how to enable it for a container app, and how to verify that your app runs on confidential compute infrastructure.

> [!IMPORTANT]
> Confidential compute is currently available as a public preview and is supported only in specific regions and workload profile configurations.

## Benefits

Confidential compute complements Azure encryption at rest and encryption in transit by protecting data while it's being processed. When you run workloads on a confidential compute workload profile, you get:

- **Hardware-based isolation** by using Trusted Execution Environments (TEEs).
- **Encryption of data in memory** while workloads are running.
- **Protection against unauthorized access** to data in use, including access from infrastructure operators.

The Azure platform and the underlying confidential VM infrastructure provide and enforce these guarantees. For more information, see [Azure confidential computing](/azure/confidential-computing/).

## When to use confidential compute

Use confidential compute in Azure Container Apps when:

- Your workloads process highly sensitive or regulated data.
- Protecting data while it's being processed is a requirement.
- You want the security benefits of confidential computing without managing infrastructure or modifying application code.

## How it works

You enable confidential compute at the workload profile level, not at the individual container app or revision level. When you add a DC-series dedicated workload profile to your environment, any container apps assigned to that profile automatically run on confidential compute infrastructure backed by confidential VM SKUs.

You don't need to configure any per-app or per-container settings. Deploy container apps by using the same images, tooling, and workflows as non-confidential workloads. You don't need special container runtime configuration or SDKs.

## Prerequisites

Before you enable confidential compute, make sure all of the following conditions are met:

1. You create an Azure Container Apps environment in a supported region.
1. You add a dedicated workload profile that uses a DC-series workload profile type.
1. You create or update a container app with the DC-series workload profile assigned.

## Enable confidential compute

The following example creates a Container Apps environment with a DC-series workload profile and deploys a container app assigned to that profile:

1. Create the environment with a DC-series workload profile.

   ```azurecli
   az containerapp env create \
     --name <environment-name> \
     --resource-group <resource-group-name> \
     --location <supported-region> \
     --workload-profile-type DC4 \
     --workload-profile-name my-wp-confidential
   ```

1. Create the container app and assign it to the workload profile.

   ```azurecli
   az containerapp create \
     --name <container-app-name> \
     --resource-group <resource-group-name> \
     --environment <environment-name> \
     --workload-profile-name my-wp-confidential \
     --image <container-image>
   ```

The `--workload-profile-name my-wp-confidential` parameter assigns the app to the DC-series workload profile, which enables confidential compute.

For steps on adding and managing workload profiles, see [Manage workload profiles with the Azure CLI](workload-profiles-manage-cli.md).

## Verify confidential compute

Use this quick check to confirm the app is assigned to a DC-series workload profile.

### Azure CLI

1. Get the workload profile assigned to the container app.

   ```azurecli
   az containerapp show \
     --name <container-app-name> \
     --resource-group <resource-group-name> \
     --query properties.workloadProfileName \
     -o tsv
   ```

   Example output:

   ```output
   my-wp-confidential
   ```

1. Get the workload profile type for that profile in the environment.

   ```azurecli
   az containerapp env workload-profile list \
     --name <environment-name> \
     --resource-group <resource-group-name> \
     --query "[].{name:name,workloadProfileType:workloadProfileType}"
   ```

   Example output:

   ```output
   [
     {
       "name": "my-wp-confidential",
       "workloadProfileType": "DC4"
     }
   ]
   ```

   In this example, `my-wp-confidential` is a sample profile name. Your profile name can be different.

If the profile assigned to your app has a `workloadProfileType` value that starts with `DC`, such as `DC4` or `DC8`, the app is running on confidential compute infrastructure.

### Azure portal

1. In the Azure portal, open your container app.
1. On the **Overview** page, note the **Environment** value and open that environment.
1. In the Container Apps environment, go to **Workload profiles**.
1. Find the workload profile used by your app and verify that the profile type and size starts with `DC`, such as `DC4` or `DC8`.

## Supported workload profiles

Confidential compute is available only on [DC-series dedicated workload profiles](workload-profiles-overview.md#dedicated-profile-details). Supported sizes include:

- DC4
- DC8
- DC16
- DC32
- DC48
- DC64
- DC96

Availability of these workload profiles depends on the region. Not all regions with DC-series profiles support confidential compute. For the current list of regions where confidential compute is available, see [Supported regions](#supported-regions).

## Supported regions

Azure Container Apps supports confidential compute in the UAE North region. To request a region, open an issue on [GitHub](https://github.com/microsoft/azure-container-apps/issues).

## Related content

- [Security overview in Azure Container Apps](security.md)
- [Workload profiles overview](workload-profiles-overview.md)
- [Azure confidential computing](/azure/confidential-computing/)
