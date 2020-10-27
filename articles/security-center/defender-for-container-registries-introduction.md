---
title: Azure Defender for container registries - the benefits and features
description: Learn about the benefits and features of Azure Defender for container registries.
author: memildin
ms.author: memildin
ms.date: 9/22/2020
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for container registries

Azure Container Registry (ACR) is a managed, private Docker registry service that stores and manages your container images for Azure deployments in a central registry. It's based on the open-source Docker Registry 2.0.

To protect all the Azure Resource Manager based registries in your subscription, enable **Azure Defender for container registries** at the subscription level. Security Center will then scan images that are pushed to the registry, imported into the registry, or any images pulled within the last 30 days. This feature is charged per image.

## What are the benefits of Azure Defender for container registries?

Security Center identifies Azure Resource Manager based ACR registries in your subscription and seamlessly provides Azure-native vulnerability assessment and management for your registry's images.

**Azure Defender for container registries** includes a vulnerability scanner to scan the images in your Azure Resource Manager-based Azure Container Registry registries and provide deeper visibility into your images'  vulnerabilities. The integrated scanner is powered by Qualys, the industry-leading vulnerability scanning vendor.

When issues are found – by Qualys or Security Center – you'll get notified in the Security Center dashboard. For every vulnerability, Security Center provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue. For details of Security Center's recommendations for containers, see the [reference list of recommendations](recommendations-reference.md#recs-containers).

Security Center filters and classifies findings from the scanner. When an image is healthy, Security Center marks it as such. Security Center generates security recommendations only for images that have issues to be resolved. Security Center provides details of each reported vulnerability and a severity classification. Additionally, it gives guidance for how to remediate the specific vulnerabilities found on each image.

By only notifying when there are problems, Security Center reduces the potential for unwanted informational alerts.


## When are images scanned?

There are three triggers for an image scan:

- **On push** - Whenever an image is pushed to your registry, Security Center automatically scans that image. To trigger the scan of an image, push it to your repository.

- **Recently pulled** - Since new vulnerabilities are discovered every day, **Azure Defender for container registries** also scans any image that has been pulled within the last 30 days. There's no additional charge for a rescan; as mentioned above, you're billed once per image.

- **On import** - Azure Container Registry has import tools to bring images to your registry from Docker Hub, Microsoft Container Registry, or another Azure container registry. **Azure Defender for container registries** scans any supported images you import. Learn more in [Import container images to a container registry](../container-registry/container-registry-import-images.md).
 
The scan completes typically within 2 minutes, but it might take up to 15 minutes. Findings are made available as Security Center recommendations such as this one:

[![Sample Azure Security Center recommendation about vulnerabilities discovered in an Azure Container Registry (ACR) hosted image](media/azure-container-registry-integration/container-security-acr-page.png)](media/azure-container-registry-integration/container-security-acr-page.png#lightbox)


## How does Security Center work with Azure Container Registry

Below is a high-level diagram of the components and benefits of protecting your registries with Security Center.

![Azure Security Center and Azure Container Registry (ACR) high-level overview](./media/azure-container-registry-integration/aks-acr-integration-detailed.png)




## FAQ for Azure Container Registry image scanning

### How does Security Center scan an image?
The image is pulled from the registry. It's then run in an isolated sandbox with the Qualys scanner that extracts a list of known vulnerabilities.

Security Center filters and classifies findings from the scanner. When an image is healthy, Security Center marks it as such. Security Center generates security recommendations only for images that have issues to be resolved. By only notifying when there are problems, Security Center reduces the potential for unwanted informational alerts.

### Can I get the scan results via REST API?
Yes. The results are under [Sub-Assessments Rest API](/rest/api/securitycenter/subassessments/list/). Also, you can use Azure Resource Graph (ARG), the Kusto-like API for all of your resources: a query can fetch a specific scan.

### What registry types are scanned? What types are billed?
For a list of the types of container registries supported by Azure Defender for container registries, see [Availability](defender-for-container-registries-usage.md#availability).

If you connect unsupported registries to your Azure subscription, they won't be scanned and you won't be billed for them.

### Can I customize the findings from the vulnerability scanner?
Yes. If you have an organizational need to ignore a finding, rather than remediate it, you can optionally disable it. Disabled findings don't impact your secure score or generate unwanted noise.

[Learn about creating rules to disable findings from the integrated vulnerability assessment tool](defender-for-container-registries-usage.md#disable-specific-findings-preview).



## Next steps

To learn more about Security Center's container security features, see:

- [Azure Security Center and container security](container-security.md)

- [Introduction to Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md)


