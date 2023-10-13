---
title: Azure HDInsight known issues
description: Track known issues and the ETA for the fix in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting-known-issue
ms.date: 10/13/2023
---

# Azure HDInsight known issues

This page lists known issues for the Azure HDInsight service. Before submitting a Support request, review this list to see if the issue that you're experiencing is already known and being addressed.

For service level outages or degradation notifications, check the [Azure service health status](https://azure.status.microsoft/status) page.

Azure HDInsight has the following known issues:

| HDInsight component | Issue description | 
|---------------------|-------------------|
| Kafka | [Kafka 2.4.1 has validation error in ARM templates](#kafka-241-has-validation-error-in-arm-templates) |
| Spark | [Conda version regression in recent HDInsight release](#conda-version-regression-in-recent-hdinsight-release)|
| Platform | [Cluster reliability issue](#cluster-reliability-issue) observed with Azure HDInsight clusters using images older than March 2022|

## Known issues summary

### Kafka 2.4.1 has validation error in ARM templates
**Issue published date**: October, 13 2023

When submitting cluster creation requests using ARM templates, Runbooks, PowerShell, Azure CLI, and other automation tools, you may receive a BadRequest error message if you specify clusterType="Kafka", HDI version = "5.0" and Kafka version = "2.4.1".

#### Troubleshooting steps

When using [templates or automation tools](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods) to create HDInsight Kafka clusters, choose componentVersion = "2.4". This enables you to successfully create a Kafka 2.4.1 cluster in HDInsight 5.0.

#### Resources

- [Create HDInsight clusters using automation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
- [HDInsight Kafka cluster](/azure/hdinsight/kafka/apache-kafka-introduction)

### Conda version regression in recent HDInsight release
**Issue published date**: October, 13 2023

In the latest Azure HDInsight release, the conda version was mistakenly downgraded to version 4.2.9. This regression is fixed in an upcoming release, but currently it can impact Spark job execution and result in script action failures. Conda 4.3.30 is the expected version in 5.0 and 5.1 clusters, so follow the steps to mitigate the issue.

<!--/issueDescription-->

#### Recommended Steps

1. SSH to any VM in the cluster.
2. Switch to the root user: `sudo su`
3. Check the conda version: `/usr/bin/anaconda/bin/conda info`
4. If the version is 4.2.9, run the following [script action](/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#script-action-to-a-running-cluster) on all nodes to upgrade the cluster to conda version 4.3.30:

   `https://hdiconfigactions2.blob.core.windows.net/hdi-sre-workspace/conda_update_4_3_30_patch.sh`

#### Recommended Documents

- [Script action to a running cluster](/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux#script-action-to-a-running-cluster)
- [Safely manage Python environment on Azure HDInsight using Script Action](/azure/hdinsight/spark/apache-spark-python-package-installation)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)

### Cluster reliability issue
**Issue published date**: October, 13 2023

As part of the proactive reliability management of Azure HDInsight, we recently came across a potential reliability issue on HDInsight clusters that use images dated February 2022 or older.

#### Issue Background

In HDInsight images dated prior to March 2022, a known bug was discovered on one particular AzLinux build. The `waagent`, a lightweight process that manages virtual machines, was unstable and resulted in VM outages. HDInsight clusters that consumed the AzLinux build have experienced service outages, job failures, and adverse effects on features like IPSec and Autoscale.

#### Required Action

If your cluster was created prior to February 2022, we advise rebuilding your cluster with the latest HDInsight image by October 31, 2023. Cluster images dated prior to March 2022 not support beyond this date. These images not receive security updates, bug fixes, or patches, leaving them susceptible to vulnerabilities. 

> [!IMPORTANT]  
> It’s recommended to keep your clusters updated to the latest HDInsight version on a regular basis. Using clusters based on the latest HDInsight image ensures that clusters have the latest operating system patches, security patches, bug fixes, library versions, and minimizes risk and potential security vulnerabilities.
>

#### FAQ

##### What happens in the case of a VM outage in the HDInsight clusters that use these impacted HDInsight images?

Recovery of such Virtual Machines is not straight-forward restarts and could result in several hours of outage with a mandatory manual intervention from the Microsoft support team.

##### Is this issue rectified in latest HDInsight images?

Yes, we've fixed this issue on the HDInsight images dated March 1, 2022 or later. It is advised to move to the latest stable version to ensure SLA and service reliability. 

#### How do we determine the date of the HDInsight image our clusters are built on? 

The last 10 digits in your image version indicate the date and time of HDInsight image. For example, if your cluster image is “5.0.3000.1.2208310943” indicates that the date of your image is 31 August 2022. Learn how to [verify your HDInsight image version.](/azure/hdinsight/view-hindsight-cluster-image-version)

#### Resources

- [Create HDInsight clusters using automation](/azure/hdinsight/hdinsight-hadoop-provision-linux-clusters#cluster-setup-methods)
- [Supported HDInsight versions](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions)
- [HDInsight Kafka cluster](/azure/hdinsight/kafka/apache-kafka-introduction)
- [Verify your HDInsight image version](/azure/hdinsight/view-hindsight-cluster-image-version)


## Recently closed known issues

Select the **Title** to view more information about that specific known issue. Fixed issues are removed after 60 days.

| Issue ID         | Area                   |Title                    | Issues publish date| Status |
|------------------|------------------------|-------------------------|-------------------|-------|
|NA|NA|NA|NA|NA|

## Next steps

* [Check Azure Service Health status](https://azure.status.microsoft/status)
* [HDInsight cluster management best practices](cluster-management-best-practices.md)
* [HDInsight 5.x component versions](hdinsight-5x-component-versioning.md)
* [Create Apache Hadoop clusters in HDInsight by using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md)
