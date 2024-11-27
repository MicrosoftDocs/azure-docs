---
title: Azure HDInsight component retirements and action required
description: Learn about HDInsight retirement versions and its components in Azure HDInsight clusters.
ms.service: azure-hdinsight
ms.topic: conceptual
ms.date: 09/30/2024
---

# Azure HDInsight component retirements and action required

This page lists all the upcoming retirement versions of HDInsight including the components and services. If you’re currently on one of the versions mentioned on this page, we strongly recommend that you immediately migrate to the latest version. If you choose not to migrate and continue using any of the following versions, be aware of the risk will remain associated with your continued usage. 

## Call to action

To maintain the security posture,  migrate to the latest image of [HDInsight 5.1](./hdinsight-5x-component-versioning.md#open-source-components-available-with-hdinsight-5x), which is  Generally Available since November 1, 2023. This release contains all the [latest versions of supported software](./hdinsight-5x-component-versioning.md) along with significant improvements on the security patches on open-source components.  


### Supported HDInsight versions 

This table lists the versions of HDInsight that are available in the Azure portal and other deployment methods like PowerShell, CLI, and the .NET SDK. 

HDInsight bundles open-source components and HDInsight platform into a package that deployed on a cluster. For more information, see [how HDInsight versioning works](hdinsight-overview-versioning.md).

## Supported HDInsight versions

### HDInsight versions 

| HDInsight version | VM OS | Release date| Support type | Support expiration date | Retirement date | High availability | Action Required|
| --- | --- | --- | --- | --- | --- | ---|---|
| [HDInsight 5.1](./hdinsight-5x-component-versioning.md) |Ubuntu 18.0.4 LTS |November 1, 2023 | [Standard](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | Not announced |Not announced| Yes |-|
| [HDInsight 5.0](./hdinsight-5x-component-versioning.md) |Ubuntu 18.0.4 LTS |March 11, 2022 | [Basic](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | March 31, 2025 | March 31, 2025| Yes | [HDInsight 5.x component versions](./hdinsight-5x-component-versioning.md)|
| HDInsight 4.0 |Ubuntu 18.0.4 LTS |September 24, 2018 | [Basic](hdinsight-component-versioning.md#support-options-for-hdinsight-versions) | March 31, 2025 | March 31, 2025 |Yes |[migrate your HDInsight clusters to 5.1](https://azure.microsoft.com/updates/azure-hdinsight-40-will-be-retired-on-31-march-2025-migrate-your-hdinsight-clusters-to-51/) |


**Support expiration** means that Microsoft no longer provides support for the specific HDInsight version. You might not be able to create clusters from the Azure portal. 

**Retirement** means that existing clusters of a HDInsight version continue to run as is. You can't create new clusters of this version through any means, which includes the CLI and SDKs. Other control plane features, such as manual scaling and autoscaling, not guaranteed to work after retirement date. Support isn't available for retired versions. 


|Retirement Item | Retirement Date | Action Required by Customers| Cluster creation required?|
|-|-|-|-|
|[Basic and Standard A-series VMs Retirement](https://azure.microsoft.com/updates/basic-and-standard-aseries-vms-on-hdinsight-will-retire-on-31-august-2024/) |August 31, 2024 |[Av1-series retirement - Azure Virtual Machines](/azure/virtual-machines/sizes/migration-guides/av1-series-retirement) |N|
|[Azure Monitor experience (preview)](https://azure.microsoft.com/updates/v2/hdinsight-azure-monitor-experience-retirement/) | February 01, 2025 |[Azure Monitor Agent (AMA) migration guide for Azure HDInsight clusters](./azure-monitor-agent.md) |Y|


## Next steps

- [Supported Apache components and versions in HDInsight](./hdinsight-component-versioning.md)
