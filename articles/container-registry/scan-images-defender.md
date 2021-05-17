---
title: Scan registry images with Azure Defender
description: Learn about using Azure Defender for container registries to scan images in your Azure container registries
ms.topic: article
ms.date: 05/14/2021
---

# Scan registry images with Azure Defender

To scan images in your Azure container registries for vulnerabilities, you can integrate an Azure Marketplace solution, or enable Azure Security Center features for your container registry. In Azure Security Center, optionally enable [Azure Defender for container registries](../security-center/defender-for-container-registries-introduction.md) at the subscription level to scan images for vulnerabilities. Azure Security Center will then scan images that are pushed to a registry, imported into a registry, or any images pulled within the last 30 days. This feature is charged per image.

* Learn more about [using Azure Defender for container registries](../security-center/defender-for-container-registries-usage.md)
* Learn more about [container security in Azure Security Center](../security-center/container-security.md)

## Registry operations by Azure Defender

When scanning images for vulnerabilities, Azure Defender regularly authenticates with the registry to pull images. If vulnerabilities are detected, [recommended remediations](../security-center/defender-for-container-registries-usage.md#view-and-remediate-findings) appear in Azure Security Center.

 After you have taken the recommended steps required to remediate the security issue, replace the image in your registry. Azure Defender rescans the image to confirm that the vulnerabilties are remediated.

> [!TIP]
> If resource logs are collected for your registry, you'll see registry operations by Azure Defender logged along with other operations by registry users and services. For example, you might see an entry similar to the following in the RegistryLoginEvents table when Azure Defender authenticates with the registry:

```

```



## Scan a network-restricted registry


Azure Defender for container registries can scan images or vulnerabilities in a publicly accessible container registry or one that's protected with network access rules. If you've disabled public registry access, configured IP access rules, or created private endpoints for a container registry, you myst enable the network setting to [**allow trusted Microsoft services**](allow-access-trusted-services.md) to access the registry. By default, this setting is enabled in a new container registry.

> [!NOTE]
> After enabling the setting to allow access by trusted services, it can take several minutes before Azure Defender can scan registry images.




## Next steps

* Learn more about registry access by [trusted services](allow-access-trusted-services.md).
* To restrict access to a registry using a private endpoint in a virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).
* To set up registry firewall rules, see [Configure public IP network rules](container-registry-access-selected-networks.md).
