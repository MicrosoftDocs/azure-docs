---
title: Azure Security Center and Azure Container Registry
description: "Learn about Azure Security Center's integration with Azure Container Registry"
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/19/2019
ms.author: memildin

---

# Azure Container Registry integration with Security Center

Azure Container Registry (ACR) is a managed, private Docker registry service that stores and manages your container images for Azure deployments in a central registry. It's based on the open-source Docker Registry 2.0.

If you're on Azure Security Center's standard tier, you can add the Container Registries bundle. This optional feature brings deeper visibility into the vulnerabilities of the images in your ARM-based registries. Enable or disable the bundle at the subscription level to cover all registries in a subscription. This feature is charged per image, as shown on the [pricing page](security-center-pricing.md). Enabling the Container Registries bundle, ensures that Security Center is ready to scan images that get pushed to the registry. 

Whenever an image is pushed to your registry, Security Center automatically scans that image. To trigger the scan of an image, push it to your repository.

When the scan completes (typically after approximately 10 minutes, but can take up to 48h), findings are available in Security Center recommendations like this:

[![Sample Azure Security Center recommendation about vulnerabilities discovered in an Azure Container Registry (ACR) hosted image](media/azure-container-registry-integration/container-security-acr-page.png)](media/azure-container-registry-integration/container-security-acr-page.png#lightbox)

## Benefits of integration

Security Center identifies ARM-based ACR registries in your subscription and seamlessly provides:

* **Azure-native vulnerability scanning** for all pushed Linux images. Security Center scans the image using a scanner from the industry-leading vulnerability scanning vendor, Qualys. This native solution is seamlessly integrated by default.

* **Security recommendations** for Linux images with known vulnerabilities. Security Center provides details of each reported vulnerability and a  severity classification. Additionally, it gives guidance for how to  remediate the specific vulnerabilities found on each image pushed to registry.

![Azure Security Center and Azure Container Registry (ACR) high-level overview](./media/azure-container-registry-integration/aks-acr-integration-detailed.png)

## Next steps

To learn more about Security Center's container security features, see:

* [Azure Security Center and container security](container-security.md)

* [Integration with Azure Kubernetes Service](azure-kubernetes-service-integration.md)

* [Virtual Machine protection](security-center-virtual-machine-protection.md) - Describes Security Center's recommendations
