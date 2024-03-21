---
title: Azure HDInsight known issues
description: Track known issues for Azure HDInsight, along with troubleshooting steps, actions, and frequently asked questions.
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 10/13/2023
---

# Azure HDInsight known issues

This article lists known issues for the Azure HDInsight service. Before you submit a support request, review this list to see if Microsoft is already aware of the issue that you're experiencing and is addressing it.

For service-level outages or degradation notifications, check the [Azure Service Health status](https://azure.status.microsoft/status) page.

## Summary of known issues

Azure HDInsight has the following known issues:

| HDInsight component | Issue description |
|---------------------|-------------------|
| Kafka | [Kafka 2.4.1 validation error in ARM templates](#kafka-241-validation-error-in-arm-templates) |
| Platform | [Cluster reliability issue with older images in HDInsight clusters](#cluster-reliability-issue-with-older-images-in-hdinsight-clusters)|

### Kafka 2.4.1 validation error in ARM templates

**Issue published date**: October 13, 2023

When you're submitting cluster creation requests by using Azure Resource Manager templates (ARM templates), runbooks, PowerShell, the Azure CLI, and other automation tools, you might receive a "BadRequest" error message if you specify `clusterType = "Kafka"`, `HDI version = "5.0"`, and `Kafka version = "2.4.1"`.

#### Troubleshooting steps

When you're using [templates or automation tools](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods) to create HDInsight Kafka clusters, choose `componentVersion = "2.4"`. This value enables you to successfully create a Kafka 2.4.1 cluster in HDInsight 5.0.

#### Resources

- [Create HDInsight clusters by using automation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
- [HDInsight Kafka cluster](/azure/hdinsight/kafka/apache-kafka-introduction)


### Cluster reliability issue with older images in HDInsight clusters

**Issue published date**: October 13, 2023

As part of the proactive reliability management of Azure HDInsight, we recently found a potential reliability issue on HDInsight clusters that use images dated February 2022 or older.

#### Issue background

In HDInsight images dated before March 2022, a known bug was discovered on one particular Azure Linux build. The Microsoft Azure Linux Agent (`waagent`), a lightweight process that manages virtual machines, was unstable and resulted in VM outages. HDInsight clusters that consumed the Azure Linux build have experienced service outages, job failures, and adverse effects on features like IPsec and autoscale.

#### Required action

If your cluster was created before March 2022, we advise rebuilding your cluster with the latest HDInsight image. Support for cluster images dated before March 2022 ended on November 10, 2023. These images won't receive security updates, bug fixes, or patches, leaving them highly susceptible to vulnerabilities.

> [!IMPORTANT]  
> We recommend that you keep your clusters updated to the latest HDInsight version on a regular basis. Using clusters that are based on the latest HDInsight image ensures that they have the latest operating system patches, security patches, bug fixes, and library versions. This practice helps you minimize risk and potential security vulnerabilities.

#### FAQ

##### What happens if there's a VM outage in HDInsight clusters that use these affected HDInsight images?

You can't recover such virtual machines through straightforward restarts. The outage could last for several hours and require manual intervention from the Microsoft support team.

##### Is this issue rectified in the latest HDInsight images?

Yes. We fixed this issue on HDInsight images dated on or after March 1, 2022. We advise that you move to the latest stable version to maintain the service-level agreement (SLA) and service reliability.

##### How do I determine the date of the HDInsight image that my clusters are built on?

The last 10 digits in your HDInsight image version indicate the date and time of the image. For example, an image version of 5.0.3000.1.2208310943 indicates a date of August 31, 2022. [Learn how to verify your HDInsight image version](/azure/hdinsight/view-hindsight-cluster-image-version).

#### Resources

- [Create HDInsight clusters by using automation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
- [HDInsight Kafka cluster](/azure/hdinsight/kafka/apache-kafka-introduction)
- [Verify your HDInsight image version](/azure/hdinsight/view-hindsight-cluster-image-version)

## Recently closed known issues

Select the title to view more information about that specific known issue. Fixed issues are removed after 60 days.

| Issue ID         | Area                   |Title                    | Issue publish date| Status |
|------------------|------------------------|-------------------------|-------------------|-------|
|Not applicable|Spark|Conda Version Regression in a recent HDInsight release|October 13, 2023|Closed|

## Next steps

- [Check Azure Service Health status](https://azure.status.microsoft/status)
- [HDInsight cluster management best practices](cluster-management-best-practices.md)
- [HDInsight 5.x component versions](hdinsight-5x-component-versioning.md)
- [Create Apache Hadoop clusters in HDInsight by using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md)
