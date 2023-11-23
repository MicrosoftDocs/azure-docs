---
title: Common questions on MDVM and Qualys retirement
description: Answers to common questions on the new Container VA offering powered by Microsoft Defender Vulnerability Management (MDVM) and the Qualys retirement
ms.topic: faq
ms.date: 11/23/2023
---

# Common questions on MDVM and Qualys retirement

Get answers to common questions on the new Container VA offering powered by Microsoft Defender Vulnerability Management (MDVM) and the Qualys retirement.

## How do I migrate to the container vulnerability assessment powered by MDVM?

See [Qualys Migration Guide for Containers](migration-from-qualys-to-microsoft-defender-vulnerability-management.md) for recommended guidance on migrating from Qualys to MDVM for container image vulnerability assessment scanning.

## Why is Microsoft deprecating container vulnerability scanning powered by Qualys?

See [Defender for Cloud unifies Vulnerability Assessment solution powered by Microsoft Defender Vulnerability Management](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-cloud-unified-vulnerability-assessment-powered-by/ba-p/3990112) to learn more about the strategic decision to invest in Microsoft Defender Vulnerability Management for vulnerability assessment scanning.

## Is there any change to pricing when migrating to container vulnerability assessment scanning powered by MDVM?

No. The cost of the vulnerability assessment scanning is included in Defender for Containers, Defender CSPM and Defender for Container Registries (deprecated) and doesn't differ in regard to the scanner being used.

## Am I being billed twice when scanning with both offerings?

No. Each unique image is billed once according to the pricing of the Defender plan enabled, regardless of scanner.

## Does container vulnerability assessment powered by MDVM require an agent?

Vulnerability assessment for container images in the registry is agentless.
Vulnerability assessment for runtime supports both agentless and agent-based deployment. This approach allows us to provide maximum visibility when vulnerability assessment is enabled, while providing improved refresh rate for image inventory on clusters running our agent.

## Is there any difference in supported environments between the Qualys and MDVM powered offerings?

Both offerings support registry scan for Azure Container Registry and runtime vulnerability assessment for Azure Kubernetes Services.
Support for ECR, GCR, GAR, EKS and GKE will be added to the  MDVM powered offering next month.

## How complicated is it to enable container vulnerability assessment powered by MDVM?

The MDVM powered offering is already enabled by default in all supported plans. For instructions on how to re-enable MDVM with a single click if you previously disabled this offering, see [Enabling vulnerability assessments in Azure powered by MDVM](enable-vulnerability-assessment.md).

## How long does it take for a new image to be scanned with the MDVM powered offering?

In Azure, new images are typically scanned in a few minutes, and it might take up to an hour in rare cases.
When released in AWS and GCP, new images are typically scanned within a few hours, and might take up to a day in rare cases.

## Any difference between scanning criteria for the Qualys and MDVM offerings?

Container vulnerability assessment powered by MDVM supports all scan triggers supported by Qualys, and in addition also supports scanning of all images pushed in the last 90 days to a registry. For more information, see [scanning triggers for MDVM](agentless-container-registry-vulnerability-assessment.md#scan-triggers).

## Is there a difference in rescan period between the Qualys and MDVM offerings?

Vulnerability assessments performed using the Qualys scanner are refreshed weekly.
Vulnerability assessments performed using the MDVM scanner are refreshed daily.

## Is there any difference between the OS and language packages covered by the Qualys and MDVM offerings?

Container vulnerability assessment powered by MDVM supports all OS packages and language packages supported by Qualys except FreeBSD. In addition, the offering powered by MDVM also provides support for Red Hat Enterprise version 8 and 9, CentOS versions 8 and 9, Oracle Linux 9, openSUSE Tumbleweed, Debian 12, Fedora 36 and 37, and CBL-Mariner 1 and 2.
There's no different for coverage of language specific packages between the Qualys and MDVM powered offerings.

- [Full list of supported packages and their versions for MDVM](support-matrix-defender-for-containers.md#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-mdvm)

- [Full list of supported packages and their versions for Qualys](support-matrix-defender-for-containers.md#registries-and-images-support-for-azure---vulnerability-assessment-powered-by-qualys)

## Are there any other capabilities that are unique to the MDVM powered offering?

1. Each reported vulnerability is enriched with real-world exploit exploitability insights, helping customers prioritize remediation of vulnerabilities with known exploit methods and exploitability tools. Exploit sources include CISA key, exploit DB, Microsoft Security Response Center, and more.
2. Vulnerability reports for OS packages are enriched with evidence on commands that can be used to find the vulnerable package.

## I have more questions not covered in this FAQ or the migration guide. What should I do?

Open a support ticket or reach out to your account team.

## Next steps
  
- Learn about [Defender for Containers](defender-for-containers-introduction.md)
- Learn more about [container image vulnerability assessment scanning powered by MDVM](agentless-container-registry-vulnerability-assessment.md)
