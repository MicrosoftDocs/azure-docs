---
title: Trino cluster configuration
description: How to perform service configuration for Trino clusters for HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Trino configuration management

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

HDInsight on AKS Trino cluster comes with most of the default configurations of open-source Trino. This article describes how to update config files, and adds your own supplemental config files to the cluster.

You can add/update the configurations in two ways:

* [Using Azure portal](#using-azure-portal)
* [Using ARM template](#using-arm-template)

> [!NOTE]
> HDInsight on AKS Trino enforces certain configurations and prohibits modification of some files and/or properties. This is done to ensure proper security/connectivity via configuration. Example of prohibited files/properties includes, but is not limited to: 
> * jvm.config file with the exception of Heap size settings.
> * Node.properties: node.id, node.data-dir, log.path etc.
> * `Config.properties: http-server.authentication.*, http-server.https.* etc.`


## Using Azure portal

In the Azure portal, you can modify three sets of standard [Trino configurations](https://trino.io/docs/current/admin/properties.html):
* log.properties
* config.properties
* node.properties

Follow the steps to modify the configurations:

1. Sign in to [Azure portal](https://portal.azure.com).
  
2. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/trino-service-configuration/portal-search.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster.":::
  
3. Select your cluster name from the list page.
  
   :::image type="content" source="./media/trino-service-configuration/portal-search-result.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list.":::

4. Navigate to "Configuration Management" blade.

   :::image type="content" source="./media/trino-service-configuration/azure-portal-configuration-management.png" alt-text="Screenshot showing Azure portal configuration management.":::

6. Add new or update the existing key value pairs for the configurations you want to modify. For example, config.properties -> Custom configurations -> click "Add" to add new configuration setting and then click Ok.

   :::image type="content" source="./media/trino-service-configuration/configuration-properties.png" alt-text="Screenshot showing custom configuration.":::
   
8. Click "Save" to save the configurations.

   :::image type="content" source="./media/trino-service-configuration/save-configuration.png" alt-text="Screenshot showing how to save the configuration.":::
   
## Using ARM template

### Prerequisites

* An operational HDInsight on AKS Trino cluster.
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Review complete cluster [ARM template](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json) sample.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).

### Cluster management

All HDInsight on AKS Trino configurations can be specified in `serviceConfigsProfiles.serviceName[“trino”]` under `properties.clusterProfile`.

The following example focuses on `coordinator/worker/miscfiles`. For catalogs, see [Add catalogs to an existing cluster](trino-add-catalogs.md):

```json
"serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "catalogs",
                "files": [<file-spec>,…]
            },
            {
                "component": "coordinator",
                "files": [<file-spec>,…]
            },
            {
                "component": "worker",
                "files": [<file-spec>,…]
            },
            {
                "component": " miscfiles",
                "files": [<file-spec>,…]
            },
        ]
    }
]
```

There are several components that control different configuration aspects:

|Component name|Required/allowed properties for each file spec|Description|
|---|---|---|
|common|`filename`, `values`|Contains config files for both coordinator and worker.|
|coordinator|`filename`, `values`|Contains config files for coordinator only, overrides common if present.|
|worker|`filename`, `values`|Contains config files for workers only, overrides common if present.|
|`miscfiles`|`filename`, `content`|Contains miscellaneous configuration files supplied by user for entire cluster.|
|catalogs|`filename`, either content or values|Contains catalog files for entire cluster.|

The following example demonstrates:
* Override default node.environment for cluster (displayed in Trino UI).
* Override default config.properties values for coordinator and worker.
* Add sample [resource groups](https://trino.io/docs/current/admin/resource-groups.html) json and configure coordinator to use it.

```json
"serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "common",
                "files": [
                    {
                        "fileName": "node.properties",
                        "values": {
                            "node.environment": "preview"
                        }
                    },
                    {
                        "fileName": "config.properties",
                        "values": {
                            "join-distribution-type": "AUTOMATIC",
                            "query.max-execution-time": "5d",
                            "shutdown.grace-period": "5m"
                        }
                    }
                ]                
            },
            {
                "component": "coordinator",
                "files": [
                    {
                        "fileName": "resource-groups.properties",
                        "values": {
                            "resource-groups.configuration-manager": "file",
                            "resource-groups.config-file": "${MISC:resource-groups}"
                        }                                            
                    }
                ]
            },
            {
                "component": "miscfiles",
                "files": [
                    {
                        "fileName": "resource-groups",
                        "path": "/customDir/resource-groups.json",
                        "content": "{\"rootGroups\":[{\"name\":\"global\",\"softMemoryLimit\":\"80%\",\"hardConcurrencyLimit\":100,\"maxQueued\":1000,\"schedulingPolicy\":\"weighted\",\"jmxExport\":true,\"subGroups\":[{\"name\":\"data_definition\",\"softMemoryLimit\":\"10%\",\"hardConcurrencyLimit\":5,\"maxQueued\":100,\"schedulingWeight\":1},{\"name\":\"adhoc\",\"softMemoryLimit\":\"10%\",\"hardConcurrencyLimit\":50,\"maxQueued\":1,\"schedulingWeight\":10,\"subGroups\":[{\"name\":\"other\",\"softMemoryLimit\":\"10%\",\"hardConcurrencyLimit\":2,\"maxQueued\":1,\"schedulingWeight\":10,\"schedulingPolicy\":\"weighted_fair\",\"subGroups\":[{\"name\":\"${USER}\",\"softMemoryLimit\":\"10%\",\"hardConcurrencyLimit\":1,\"maxQueued\":100}]}]}]},{\"name\":\"admin\",\"softMemoryLimit\":\"100%\",\"hardConcurrencyLimit\":50,\"maxQueued\":100,\"schedulingPolicy\":\"query_priority\",\"jmxExport\":true}],\"selectors\":[{\"group\":\"global.adhoc.other.${USER}\"}],\"cpuQuotaPeriod\":\"1h\"}"
                    }
                ]
            }
        ]
    }

```

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
