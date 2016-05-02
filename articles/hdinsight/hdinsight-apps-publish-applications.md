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
   	ms.date="05/02/2016"
   	ms.author="jgao"/>

# Publish HDInsight applications into the Azure Marketplace

An HDInsight application is an application that users can install on a Linux-based HDInsight cluster. These applications can be developed by Microsoft, independent software vendors (ISV) or by yourself. In this article, you will learn how to publish an HDInsight application into the Azure Marketplace.  For general information about publishing into the Azure Marketplace, see [publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md).

HDInsight applications use the *Bring Your Own License (BYOL)* model, where application provider is responsible for licensing the application to end-users, and end-users are only charged by Azure for the resources they create, such as the HDInsight cluster and its VMs/nodes. At this time, billing for the application itself is not done through Azure.

Other HDInsight application related articles:

- [Install HDInsight application](hdinsight-apps-install-applications.md): General information on install published HDInsight applications.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): Learn how to install and test custom HDInsight applications.

 
### Prerequisites

In order to submit your custom application to the marketplace, you must have created and tested your custom application. See the following articles:

- [Define custom HDInsight applications](hdinsight-apps-define-applications.md): Learn how to define your custom HDInsight applications.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): Learn how to install and test custom HDInsight applications.

You must also have register your developer account. See [publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md) and [Create a Microsoft Developer account](marketplace-publishing-accounts-creation-registration.md).

## Define application

There are two steps involved for publishing applications to the Azure Marketplace.  First you define a **createUiDef.json** file to indicate which clusters your application is compatible with; and then you publish the template from the Azure portal. The following is a sample createUiDef.json file.

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

## Package application

Create a zip file that contains all required files for installing your HDInsight applications on an existing HDInsight cluster.

- [createUiDefinition.json](#define-application).
- mainTemplate.json and any linked templates. See a sample at [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).
- All required scripts.

[jgao: do I have to use the file name "mainTemplate.json"?]

[jgao: I assume the mainTemplate is the template for install HDInsight applications on an existing HDInsight application.  If yes, what is the suggested approach for ISVs to distribute the template for installing applications during cluster creation?]

[jgao: I don't believe installing HDI application requires any linked templates.  Please confirm.]

[jgao: I assume the required script is the Bash script.  How about the application files?  For the hue application, this is a compressed file for Hue and another compressed file for installing a web application.  Are these two compressed file needed to be provided?]



## Publish application

Follow the following steps to publish an HDInsight application:

1. Sign on to the [Azure Publishing portal](https://publish.windowsazure.com/).
2. Click **Solution templates** to create a new solution template.
3. Click **Create Dev Center account and join the Azure program** to register your company if you haven't done so.  See [Create a Microsoft Developer account](marketplace-publishing-accounts-creation-registration.md).
4. Click **Define some Topologies to get Started**. A solution template is a "parent" to all of its topologies. You can define multiple topologies in one offer/solution template. When an offer is pushed to staging, it is pushed with all of its topologies. 
5. Add a new version.
6. Upload the zip file prepared in [Package application](#package-application).  
7. Click **Request Certification**. The Microsoft certification team will review the files and certify the topology.
 
 
## Validate application

Following the instructions found at [Install HDInsight application](hdinsight-apps-install-applications.md) to validate your application.

## Next steps

- [Install HDInsight applications](hdinsight-apps-install-applications.md): learn how to deploy a published HDInsight application from the Azure portal.
- [Define HDInsight applications](hdinsight-apps-define-applications.md): learn how to develop ARM templates for deploying HDInsight applications.
- [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
- [Create Linux-based Hadoop clusters in HDInsight using ARM templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call ARM templates to create HDInsight clusters.