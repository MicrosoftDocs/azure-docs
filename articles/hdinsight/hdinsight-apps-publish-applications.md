<properties
   	pageTitle="Publish HDInsight applications | Microsoft Azure"
   	description="Learn how to create and publish HDInsight applications."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="04/27/2016"
   	ms.author="jgao"/>

# Publish HDInsight applications into the Azure Marketplace

An HDInsight application is an application that users can install on a Linux-based HDInsight cluster. These applications can be developed by Microsoft, independent software vendors (ISV) or by yourself. In this tutorial, you will learn how to publish an HDInsight application into the Azure Marketplace. The application you will publish [Hue](http://gethue.com/). 

HDInsight applications use the *Bring Your Own License (BYOL)* model, where application provider is responsible for licensing the application to end-users, and end-users are only charged by Azure for the resources they create, such as the HDInsight cluster and its VMs/nodes. At this time, billing for the application itself is not done through Azure.

Other HDInsight applicaions related articles:

- [Install HDInsight application](hdinsight-apps-install-applications.md): General information on install published HDInsight applications.
- [Define custom HDInsight applications](hdinsight-apps-define-applications.md): Learn how to define your custom HDInsight applications.
- [Install and use Hue on HDInsight Hadoop clusters](hdinsight-hadoop-hue-linux.md): The installation process described in this tutorial adds an edge node virtual machine in the same virtual network as the cluster, and install Hue on the edge node. To install Hue on the Hadoop worker node directly using script action, see 
 
### Prerequisites

In order to sumit your custom application to the marketplace, you must have created and tested your custom application. See the following articles:

- [Define custom HDInsight applications](hdinsight-apps-define-applications.md): Learn how to define your custom HDInsight applications.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): Learn how to install and test custom HDInsight applications.

## Define applications

There are two steps involved for publishing applications.  First you define a Json file to indicate which clusters your application is compatible with; and then you publish the template from the Azure portal.

	{
		"handler": "Microsoft.HDInsight",
		"version": "0.0.1-preview",
		"clusterFilters": {
			"types": ["Hadoop", "HBase", "Storm", "Spark"],
			"tiers": ["Standard", "Premium"],
			"versions": ["3.4"]
		}
	}


|Field	| Description	| Possible values|
|-------|---------------|----------------|
|types	|The cluster types that the application is compatible with.	|Hadoop, HBase, Storm, Spark, (or any combination of these)|
|tiers	|The cluster tiers that the application is compatible with.	|Standard, Premium, (or both)|
|versions|	The HDInsight cluster types that the application is compatible with.	|3.4|


## Publish applications




1. Sign on to the [Azure Publishing portal](https://publish.windowsazure.com/).
2. Click **Solution templates** from the left menu.


 
## Next steps

- [Install HDInsight applications](hdinsight-apps-install-applications.md): learn how to deploy a published HDInsight application from the Azure portal.
- [Define HDInsight applications](hdinsight-apps-define-applications.md): learn how to develop ARM templates for deploying HDInsight applications.
- [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
- [Create Linux-based Hadoop clusters in HDInsight using ARM templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call ARM templates to create HDInsight clusters.