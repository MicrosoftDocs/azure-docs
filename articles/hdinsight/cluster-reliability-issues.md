---
title: Cluster reliability issue with older images in HDInsight clusters
description: Cluster reliability issue with older images in HDInsight clusters
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 03/28/2024
---

# Cluster reliability issue with older images in HDInsight clusters

**Issue published date**: October 13, 2023

As part of the proactive reliability management of Azure HDInsight, we recently found a potential reliability issue on HDInsight clusters that use images dated February 2022 or older.

## Issue background

In HDInsight images dated before March 2022, a known bug was discovered on one particular Azure Linux build. The Microsoft Azure Linux Agent (`waagent`), a lightweight process that manages virtual machines, was unstable and resulted in VM outages. HDInsight clusters that consumed the Azure Linux build have experienced service outages, job failures, and adverse effects on features like IPsec and autoscale.

## Required action

If your cluster was created before March 2022, we advise rebuilding your cluster with the latest HDInsight image. Support for cluster images dated before March 2022 ended on November 10, 2023. These images won't receive security updates, bug fixes, or patches, leaving them highly susceptible to vulnerabilities.

> [!IMPORTANT]  
> We recommend that you keep your clusters updated to the latest HDInsight version on a regular basis. Using clusters that are based on the latest HDInsight image ensures that they have the latest operating system patches, security patches, bug fixes, and library versions. This practice helps you minimize risk and potential security vulnerabilities.

### FAQ

#### What happens if there's a VM outage in HDInsight clusters that use these affected HDInsight images?

You can't recover such virtual machines through straightforward restarts. The outage could last for several hours and require manual intervention from the Microsoft support team.

#### Is this issue rectified in the latest HDInsight images?

Yes. We fixed this issue on HDInsight images dated on or after March 1, 2022. We advise that you move to the latest stable version to maintain the service-level agreement (SLA) and service reliability.

#### How do I determine the date of the HDInsight image that my clusters are built on?

The last 10 digits in your HDInsight image version indicate the date and time of the image. For example, an image version of 5.0.3000.1.2208310943 indicates a date of August 31, 2022. [Learn how to verify your HDInsight image version](/azure/hdinsight/view-hindsight-cluster-image-version).


#### Resources

- [Create HDInsight clusters by using automation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
- [Verify your HDInsight image version](/azure/hdinsight/view-hindsight-cluster-image-version)
