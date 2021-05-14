---
title: Scan registry images with Azure Defender
description: Learn about using Azure Defender for container registries to scan images in your Azure container registries
ms.topic: article
ms.date: 05/14/2021
---

# Scan registry images with Azure Defender

To scan images in your Azure container registries for vulnerabilities, you can integrate third-party solution or enable Azure security features. In Azure Security Center, enable [Azure Defender for container registries](../security-center/defender-for-container-registries-introduction.md) at the subscription level. Azure Security Center will then scan images that are pushed to a registry, imported into a registry, or any images pulled within the last 30 days. This feature is charged per image.

* Learn more about [using Azure Defender for container registry](../security-center/defender-for-container-registries-usage.md)
* Learn more about [container security in Azure Security Center](../security-center/container-security.md)

## Scan a network-restricted registry

If you've disabled public registry access, configured IP access rules, or created private endpoints for a container registry, enable the network setting to [**allow trusted Microsoft services**](allow-access-trusted-services.md) to access the registry. This setting is required for Azure Security Center to access a network-restricted registry to scan images.

> [!NOTE]
> After enabling the setting to allow access by trusted services, it can take several minutes before Azure Defender can scan registry images.

## Registry operations by Azure Defender

To access the registry to scan images, Azure Defender needs to authenticate with the registry and to pull images. These events 


## Next steps

* Learn more about registry access by [trusted services](allow-access-trusted-services.md).
* To restrict access to a registry using a private endpoint in a virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).
* To set up registry firewall rules, see [Configure public IP network rules](container-registry-access-selected-networks.md).
