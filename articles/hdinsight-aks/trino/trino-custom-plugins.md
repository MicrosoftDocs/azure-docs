---
title: Add custom plugins in Azure HDInsight on AKS
description: Add custom plugins to an existing Trino cluster in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 10/19/2023
---

# Custom plugins

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article provides details on how to deploy custom plugins to your Trino cluster with HDInsight on AKS. 

Trino provides a rich interface allowing users to write their own plugins such as event listeners, custom SQL functions etc. You can add the configuration described in this article to make custom plugins available in your Trino cluster using ARM template. 

## Prerequisites
* An operational Trino cluster with HDInsight on AKS.
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Review complete cluster [ARM template](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json) sample.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).

## Add custom plugins

A `userPluginsSpec.plugins` configuration authored in resource `[*].properties.clusterProfile.trinoProfile` section in the ARM template allows you to specify the plugins that need to be downloaded during a cluster deployment.   
`userPluginsSpec.plugins` defines a list that describes what plugins need to be installed and from which location, as described by the following fields. 

|Property| Description|
|---|---|
|name|This field maps to the subdirectory in trino plugins directory that contains all the plugins under path field as described here.|
|path|Fully qualified path to a directory containing all the jar files required for the plugin. The supported storage for storing these jars is Azure Data Lake Storage Gen2.|
|enabled|A boolean property that enables/disables this plugin from being downloaded onto the cluster.|


> [!NOTE]
> Custom plugin deployment uses user-assigned Managed Identity (MSI) tied to the cluster to authenticate against the storage account. Ensure that the storage account holding the plugins has appropriate access granted for the Managed Identity tied to the cluster.

The following example demonstrates how a sample plugin is made available to a Trino cluster. Add this sample json under `[*].properties.clusterProfile` in the ARM template.

```json
"trinoProfile": { 
  "userPluginsSpec": { 
    "plugins": [ 
      { 
        "name": "exampleplugin", 
        "path": "https://examplestorageaccount.blob.core.windows.net/plugins/myplugins/", 
        "enabled": true 
      }
    ] 
  } 
}
```

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
	
> [!NOTE]
> To update the plugins on an existing cluster, it requires a deployment so that the new changes are picked up.
