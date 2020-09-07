---
title: Azure Defender for container registries - the benefits and features
description: Learn about the benefits and features of Azure Defender for container registries.
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: conceptual
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for container registries

Azure Container Registry (ACR) is a managed, private Docker registry service that stores and manages your container images for Azure deployments in a central registry. It's based on the open-source Docker Registry 2.0.

To protect all the Azure Resource Manager based registries in your subscription, enable **Azure Defender for container registries** at the subscription level. Security Center will then scan any image that gets pushed to the registry. This feature is charged per image.


## Vulnerability assessment and management for your registry's images

**Azure Defender for container registries** includes a vulnerability scanner to scan the images in your ARM-based Azure Container Registry registries and provide deeper visibility into your images'  vulnerabilities. The integrated scanner is powered by Qualys, the industry-leading vulnerability scanning vendor.

When issues are found – by Qualys or Security Center – you'll get notified in the Security Center dashboard. For every vulnerability, Security Center provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Security Center's recommendations for containers, see the [reference list of recommendations](recommendations-reference.md#recs-containers).

Security Center filters and classifies findings from the scanner. When an image is healthy, Security Center marks it as such. Security Center generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Security Center reduces the potential for unwanted informational alerts.


## When are images scanned?

Whenever an image is pushed to your registry, Security Center automatically scans that image. To trigger the scan of an image, push it to your repository.

Since new vulnerabilities are discovered every day, **Azure Defender for container registries** also scans any image that has been pulled within the last 30 days. There is no additional charge for a rescan - this is 

When a new image is pushed, or when 
There are always new vulns and so we scan every day. 

We were scanning only on push. Now it's immediate on every push PLUS rescanning all images pulled in the last 30 days.

RESCANNING - Not only when pushed to a register. Instead once a day for all images pulled in the last 30 days.

In AKS I can see which ACR images are currently running and scan those.

No impact on billing - only billed once for an image


When the scan completes (typically after approximately 2 minutes, but can be up to 15 minutes), findings are available as Security Center recommendations like this:

[![Sample Azure Security Center recommendation about vulnerabilities discovered in an Azure Container Registry (ACR) hosted image](media/azure-container-registry-integration/container-security-acr-page.png)](media/azure-container-registry-integration/container-security-acr-page.png#lightbox)

## Benefits of integration

Security Center identifies Azure Resource Manager based ACR registries in your subscription and seamlessly provides:

* **Azure-native vulnerability scanning** for all pushed Linux images. Security Center scans the image using a scanner from the industry-leading vulnerability scanning vendor, Qualys. This native solution is seamlessly integrated by default.

* **Security recommendations** for Linux images with known vulnerabilities. Security Center provides details of each reported vulnerability and a  severity classification. Additionally, it gives guidance for how to  remediate the specific vulnerabilities found on each image pushed to registry.

![Azure Security Center and Azure Container Registry (ACR) high-level overview](./media/azure-container-registry-integration/aks-acr-integration-detailed.png)




## FAQ for Azure Container Registry image scanning

### How does Security Center scan an image?
The image is pulled from the registry. It's then run in an isolated sandbox with the Qualys scanner that extracts a list of known vulnerabilities.

Security Center filters and classifies findings from the scanner. When an image is healthy, Security Center marks it as such. Security Center generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Security Center reduces the potential for unwanted informational alerts.

### How often does Security Center scan my images?
Image scans are triggered on every push.

### Can I get the scan results via REST API?
Yes. The results are under [Sub-Assessments Rest API](/rest/api/securitycenter/subassessments/list/). Also, you can use Azure Resource Graph (ARG), the Kusto-like API for all of your resources: a query can fetch a specific scan.
 
### What registry types are scanned? What types are billed?
The availability section lists the types of container registries supported by Azure Defender for container registries. 

If registries that aren't supported are connected to your Azure subscription, they won't be scanned and you will not be billed for them.


## Next steps

To learn more about Security Center's container security features, see:

* [Azure Security Center and container security](container-security.md)

* [Integration with Azure Kubernetes Service](azure-kubernetes-service-integration.md)

* [Virtual Machine protection](security-center-virtual-machine-protection.md) - Describes Security Center's recommendations
