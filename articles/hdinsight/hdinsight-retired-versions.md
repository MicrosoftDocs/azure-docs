---
title: Azure HDInsight retired versions
description: Learn about retired versions in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 07/10/2024
---

# Retired HDInsight versions

This page lists all the versions of HDInsight that are retired and/or out of support. If you’re currently on one of the versions mentioned on this page, we recommend that you immediately migrate to the latest version. If you choose not to migrate and continue using any of the following versions, be aware of the following terms and risks associated with your continued usage of retired and unsupported software:  ​

- As a retired and out of support version of an Azure service, HDInsight hasn't been shipping and won’t ship any updates or security patches to these versions. Some of the OSS components in these versions haven’t been updated for several years.   ​

- By continuing to use these versions, there are security risks that may lead to vulnerabilities, system instability, and potential data loss for you and your customers.  ​

- HDInsight won’t be able to provide support or help if a security compromise occurs, as we don't have pipelines and patching mechanisms for these versions.  ​

- If there are any operational issues, HDInsight won’t be able to provide support for root cause analysis, investigation of failures, or performance degradation/issues.  ​

- There's no guarantee that all the existing functionality of your clusters continues to work as-is, because underlying dependencies determine the availability of the existing features in these versions. If there's a breaking change due to these dependencies, there's no way to recover the impacted clusters.  ​

- The new service capabilities developed by HDInsight won’t be applicable to these versions.  ​

- In the extreme event of a serious security threat to the service caused by the outdated version you're using, HDInsight might choose to stop or delete your clusters immediately to secure the service. In such cases, there's no way to recover the impacted HDInsight clusters, but your data in Azure storage and BYO Azure SQL DBs aren't deleted and can be utilized to migrate to the latest HDInsight version.  ​

## Retired version list

The following table lists the retired versions of HDInsight.

| HDInsight version | HDP version | VM OS | Release date | Support expiration date | Retirement date | Availability in the Azure portal |
| --- | --- | --- | --- | --- | --- | --- |
| HDInsight 3.6 |HDP 2.5 |Ubuntu 16.0.4 LTS |April 4, 2017 |June 30, 2021 |October 1, 2022 |No |
| HDInsight 3.5 |HDP 2.5 |Ubuntu 16.0.4 LTS |September 30, 2016 |September 5, 2017 |June 28, 2018 |No |
| HDInsight 3.4 |HDP 2.4 |Ubuntu 14.0.4 LTS |March 29, 2016 |December 29, 2016 |January 9, 2018  |No |
| HDInsight 3.3 |HDP 2.3 |Windows Server 2012 R2 |December 2, 2015 |June 27, 2016 |July 31, 2018  |No |
| HDInsight 3.3 |HDP 2.3 |Ubuntu 14.0.4 LTS |December 2, 2015 |June 27, 2016 |July 31, 2017  |No |
| HDInsight 3.2 |HDP 2.2 |Ubuntu 12.04 LTS or Windows Server 2012 R2 |February 18, 2015 |March 1, 2016 |April 1, 2017  |No |
| HDInsight 3.1 |HDP 2.1 |Windows Server 2012 R2 |June 24, 2014 |May 18, 2015 |June 30, 2016 |No |
| HDInsight 3.0 |HDP 2.0 |Windows Server 2012 R2 |February 11, 2014 |September 17, 2014 |June 30, 2015  |No |
| HDInsight 2.1 |HDP 1.3 |Windows Server 2012 R2 |October 28, 2013 |May 12, 2014 |May 31, 2015 |No |
| HDInsight 1.6 |HDP 1.1 | |October 28, 2013 |April 26, 2014 |May 31, 2015 | No |

## Call to action

To maintain the security posture,  migrate to the latest image of [HDInsight 5.1](./hdinsight-5x-component-versioning.md#open-source-components-available-with-hdinsight-5x), which is  Generally Available since November 1, 2023. This release contains all the [latest versions of supported software](./hdinsight-5x-component-versioning.md) along with significant improvements on the security patches on open-source components.  ​

## Next steps

- [Supported Apache components and versions in HDInsight](./hdinsight-component-versioning.md)
