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
   	ms.date="06/29/2016"
   	ms.author="jgao"/>

# Publish HDInsight applications into the Azure Marketplace

An HDInsight application is an application that users can install on a Linux-based HDInsight cluster. These applications can be developed by Microsoft, independent software vendors (ISV) or by yourself. In this article, you will learn how to publish an HDInsight application into the Azure Marketplace.  For general information about publishing into the Azure Marketplace, see [publish an offer to the Azure Marketplace](../marketplace-publishing/marketplace-publishing-getting-started.md).

HDInsight applications use the *Bring Your Own License (BYOL)* model, where application provider is responsible for licensing the application to end-users, and end-users are only charged by Azure for the resources they create, such as the HDInsight cluster and its VMs/nodes. At this time, billing for the application itself is not done through Azure.

Other HDInsight application related article:

- [Install HDInsight applications](hdinsight-apps-install-applications.md): Learn how to install an HDInsight application to your clusters.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): Learn how to install and test custom HDInsight applications.

 
## Prerequisites

In order to submit your custom application to the marketplace, you must have created and tested your custom application. See the following articles:

- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): Learn how to install and test custom HDInsight applications.

You must also have register your developer account. See [publish an offer to the Azure Marketplace](../marketplace-publishing/marketplace-publishing-getting-started.md) and [Create a Microsoft Developer account](../marketplace-publishing/marketplace-publishing-accounts-creation-registration.md).

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

Create a zip file that contains all required files for installing your HDInsight applications. You will need the zip file in [Publish application](#publish-application).

- [createUiDefinition.json](#define-application).
- mainTemplate.json. See a sample at [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).

	>[AZURE.IMPORTANT] The name of the application install script names must be unique for a particular cluster with the format below. Additionally any install and uninstall script actions should be idempotent, meaning the scripts can be called repeatly while producing the same result.
	
	>	name": "[concat('hue-install-v0','-' ,uniquestring(‘applicationName’)]"
		
	>Note there are three parts to the script name:
		
	>	1. A script name prefix, which shall include either the application name or a name relevant to the application.
	>	2. A "-" for readability.
	>	3. A unique string function with the application name as the parameter.

	>	An example is the above ends up becoming: hue-install-v0-4wkahss55hlas in the persisted script action list. For a sample JSON payload, see [https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/Hue/azuredeploy.json](https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/Hue/azuredeploy.json).

- All required scripts.

> [AZURE.NOTE] The application files (including web appliation files if there is any) can be located on any publicly accessible endpoint.

## Publish application

Follow the following steps to publish an HDInsight application:

1. Sign on to the [Azure Publishing portal](https://publish.windowsazure.com/).
2. Click **Solution templates** to create a new solution template.
3. Click **Create Dev Center account and join the Azure program** to register your company if you haven't done so.  See [Create a Microsoft Developer account](../marketplace-publishing/marketplace-publishing-accounts-creation-registration.md).
4. Click **Define some Topologies to get Started**. A solution template is a "parent" to all of its topologies. You can define multiple topologies in one offer/solution template. When an offer is pushed to staging, it is pushed with all of its topologies. 
5. Add a new version.
6. Upload the zip file prepared in [Package application](#package-application).  
7. Click **Request Certification**. The Microsoft certification team will review the files and certify the topology.

## Next steps

- [Install HDInsight applications](hdinsight-apps-install-applications.md): Learn how to install an HDInsight application to your clusters.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an un-published HDInsight application to HDInsight.
- [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
- [Create Linux-based Hadoop clusters in HDInsight using Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call Resource Manager templates to create HDInsight clusters.