---
title: Service-level agreement 
description: Learn about Service-level agreement.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: deshriva
ms.date: 02/08/2021
---

# Service-level agreement

The service-level agreement is defined as a support window. A support window is the time period that an HDInsight version is supported by Microsoft Customer Service and Support.

**Support expiration** means that Microsoft no longer provides support for the specific HDInsight version. And it's no longer available through the Azure portal for cluster creation.

**Retirement** means that existing clusters of an HDInsight version continue to run as is. New clusters of this version can't be created through any means, which includes the CLI and SDKs. Other control plane features, such as manual scaling and autoscaling, are not guaranteed to work after retirement date. Support isn't available for retired versions.

The following tables list the versions of HDInsight. The support expiration and retirement dates are also provided when they're known.

> [!NOTE]
> Once a cluster is deployed with an image, that cluster is not automatically upgraded to newer image version. When creating new clusters, most recent image version will be deployed.

> Customers should test and validate that applications run properly when using new HDInsight version.

> HDInsight reserves the right to change the default version without prior notice. If you have a version dependency, specify the HDInsight version when you create your clusters.

> HDInsight may retire an OSS component version before retiring the HDInsight version.
