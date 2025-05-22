---
title: Migrate cloud services not in a virtual network to a virtual network
description: How to migrate nonvnet cloud services to a virtual network
ms.topic: how-to
ms.service: azure-cloud-services-extended-support
author: hirenshah1
ms.author: hirshah
ms.reviewer: mattmcinnes
ms.date: 07/24/2024
# Customer intent: As a cloud administrator, I want to migrate legacy cloud services to a virtual network, so that I can enhance security, preserve DNS and IP settings, and minimize downtime during the transition.
---

# Migrate cloud services not in a virtual network to a virtual network

> [!IMPORTANT]
> As of March 31, 2025, cloud Services (extended support) is deprecated and will be fully retired on March 31, 2027. [Learn more](https://aka.ms/csesretirement) about this deprecation and [how to migrate](https://aka.ms/cses-retirement-march-2025).

Some legacy cloud services are still running without virtual network support. While there's a process for migrating directly through the portal, there are certain considerations that should be made before migration. This article walks you through the process of migrating a non virtual network supporting Cloud Service to a virtual network supporting Cloud Service.

## Advantages of this approach

- No required changes in your configurations. Use the same configurations to deploy a staging deployment.
- Your DNS and Public IP address is preserved.
- Less downtime.


## Migration procedure using the Azure portal

1. Create a non virtual network classic cloud service in the same region as the virtual network you want to migrate to. In the Azure portal, select the 'Staging' drop-down.
    ![Screenshot of the staging drop-down in the Azure portal.](./media/vnet-migrate-staging.png)

1. Create a deployment with same configuration as existing deployment by selecting 'Upload' next to the staging drop-down. The platform creates a Default virtual network deployment in staging slot.
    ![Screenshot of the upload button in the Azure portal.](./media/vnet-migrate-upload.png)

1. Once staging deployment is created, the URL, IP address, and label populate.
    ![Screenshot of the URL, IP, etc. data populated in the Azure portal.](./media/vnet-migrate-populated.png)
The staging deployment has a different Deployment Name, Deployment ID, and Public IP Address different to the production deployment.

1. After verifying the data, select 'Swap' to swap the production and staging deployments.
    ![Screenshot of the swap button in the Azure portal.](./media/vnet-migrate-swap.png)
This operation swaps both the deployments. After swapping, you'll find staging deployment in production slot with the DNS and IP address of production deployment with the production deployment will be present in staging slot.

1. You can now safely delete the staging slot.

1. Trigger the Cloud Service Migration Operation.
    ![Screenshot of the 'Migrate to Arm' button in the Azure portal.](./media/vnet-migrate-to-arm.png)


## Next steps
- [Overview of Platform-supported migration of IaaS resources from classic to Azure Resource Manager](/azure/virtual-machines/migration-classic-resource-manager-overview)
- Migrate to Cloud Services (extended support) using the [Azure portal](in-place-migration-portal.md)
- Migrate to Cloud Services (extended support) using [PowerShell](in-place-migration-powershell.md)
