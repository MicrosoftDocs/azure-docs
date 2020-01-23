---
title: Publish Azure HDInsight applications 
description: Learn how to create an HDInsight application, and then publish it in the Azure Marketplace.
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/14/2018
ms.author: hrasheed

---
# Publish an HDInsight application in the Azure Marketplace
You can install an Azure HDInsight application on a Linux-based HDInsight cluster. In this article, learn how to publish an HDInsight application in the Azure Marketplace. For general information about publishing in the Azure Marketplace, see [Publish an offer in the Azure Marketplace](../marketplace/marketplace-publishers-guide.md).

HDInsight applications use the *Bring Your Own License (BYOL)* model. In a BYOL scenario, an application provider is responsible for licensing the application to app users. App users are charged only for the Azure resources they create, such as the HDInsight cluster, and the cluster's VMs and nodes. Currently, billing for the application itself doesn't occur in Azure.

For more information, see these HDInsight application-related articles:

* [Install HDInsight applications](hdinsight-apps-install-applications.md). Learn how to install an HDInsight application on your clusters.
* [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md). Learn how to install and test custom HDInsight applications.

## Prerequisites
To submit your custom application in the Marketplace, first, [create and test your custom application](hdinsight-apps-install-custom-applications.md).

You also must register your developer account. For more information, see [Publish an offer in the Azure Marketplace](../marketplace/marketplace-publishers-guide.md) and [Create a Microsoft Developer account](../marketplace/marketplace-publishers-guide.md).

## Define the application
Two steps are involved in publishing applications in the Marketplace. First, define a *createUiDef.json* file. The createUiDef.json file indicates which clusters your application is compatible with. Then, publish the template from the Azure portal. Here's a sample createUiDef.json file:

```json
{
    "handler": "Microsoft.HDInsight",
    "version": "0.0.1-preview",
    "clusterFilters": {
        "types": ["Hadoop", "HBase", "Storm", "Spark"],
        "versions": ["3.6"]
    }
}
```

| Field | Description | Possible values |
| --- | --- | --- |
| types |The cluster types that the application is compatible with. |Hadoop, HBase, Storm, Spark (or any combination of these) |
| versions |The HDInsight cluster types that the application is compatible with. |3.4 |

## Application installation script
When an application is installed on a cluster (either on an existing cluster, or on a new one), an edge node is created. The application installation script runs on the edge node.

  > [!IMPORTANT]  
  > The name of the application installation script must be unique for a specific cluster. The script name must have the following format:
  > 
  > "name": "[concat('hue-install-v0','-' ,uniquestring(‘applicationName’)]"
  > 
  > The script name has three parts:
  > 
  > * A script name prefix, which must include either the application name or a name relevant to the application.
  > * A hyphen, for readability.
  > * A unique string function, with the application name as the parameter.
  > 
  > In the persisted script action list, the preceding example is displayed as **hue-install-v0-4wkahss55hlas**. See a [sample JSON payload](https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/Hue/azuredeploy.json).
  > 

The installation script must have the following characteristics:
* The script is idempotent. Multiple calls to the script produce the same result.
* The script is properly versioned. Use a different location for the script when you are upgrading or testing changes. This ensures that customers who are installing the application are not affected by your updates or testing. 
* The script has adequate logging at each point. Usually, script logs are the only way to debug application installation issues.
* Calls to external services or resources have adequate retries so that the installation is not affected by transient network issues.
* If your script starts services on the nodes, services are monitored and configured to start automatically if a node reboot occurs.

## Package the application
Create a .zip file that contains all the files that are required to install your HDInsight application. You use the .zip file to publish the application. The .zip file includes the following files:

* createUiDefinition.json
* mainTemplate.json (For a sample, see [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).)
* All required scripts

> [!NOTE]  
> You can host the application files (including any web app files) on any publicly accessible endpoint.

## Publish the application
To publish an HDInsight application:

1. Sign in to [Azure Publishing](https://publish.windowsazure.com/).
2. In the left menu, select **Solution templates**.
3. Enter a title, and then select **Create a new solution template**.
4. If you haven't already registered your organization, select **Create Dev Center account and join the Azure program**.  For more information, see [Create a Microsoft Developer account](../marketplace/marketplace-publishers-guide.md).
5. Select **Define some Topologies to get Started**. A solution template is a "parent" to all its topologies. You can define multiple topologies in one offer or solution template. When an offer is pushed to staging, it is pushed with all its topologies. 
6. Enter a topology name, and then select **+**.
7. Enter a new version, and then select **+**.
8. Upload the .zip file you created when you packaged the application.  
9. Select **Request Certification**. The Microsoft certification team reviews the files and certifies the topology.

## Next steps
* Learn how to [install HDInsight applications](hdinsight-apps-install-applications.md) in your clusters.
* Learn how to [install custom HDInsight applications](hdinsight-apps-install-custom-applications.md) and deploy an unpublished HDInsight application to HDInsight.
* Learn how to [use Script Action to customize Linux-based HDInsight clusters](hdinsight-hadoop-customize-cluster-linux.md) and add more applications. 
* Learn how to [create Linux-based Apache Hadoop clusters in HDInsight by using Azure Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).
* Learn how to [use an empty edge node in HDInsight](hdinsight-apps-use-edge-node.md) to access HDInsight clusters, test HDInsight applications, and host HDInsight applications.

