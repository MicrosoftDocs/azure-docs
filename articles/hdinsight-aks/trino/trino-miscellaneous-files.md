---
title: Using miscellaneous files
description: Using miscellaneous files with Trino clusters in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 10/19/2023
---

# Using miscellaneous files

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article provides details on how to specify and use miscellaneous files configuration.

You can add the configurations for using miscellaneous files in your cluster using ARM template. For broader examples, refer to [Service configuration](./trino-service-configuration.md).

## Prerequisites
* An operational Trino cluster with HDInsight on AKS.
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Review complete cluster [ARM template](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json) sample.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).
  
## Add miscellaneous files

Each file specification in `miscfiles` component under `clusterProfile.serviceConfigsProfiles` in the ARM template requires:

* `fileName`: Symbolic name of the file to use as a reference in other configurations. This name isn't a physical file name. To use given miscellaneous file in other configurations, specify `${MISC:\<fileName\>}` and HDInsight on AKS substitutes this tag with actual file path at runtime provided value must satisfy the following conditions:
     * Contain no more than 253 characters
     * Contain only lowercase alphanumeric characters, `-` or `.`
     * Start and end with an alphanumeric character

* `path`: Relative file path including file name and extension if applicable. Trino with HDInsight on AKS only guarantees location of each given miscellaneous file relative to other miscellaneous files that is, base directory may change. You can't assume anything about absolute path of miscellaneous files, except that it ends with value specified in “path” property.

* `content`: JSON escaped string with file content. The format of the content is specific to certain Trino functionality and may vary, for example, json for [resource groups](https://trino.io/docs/current/admin/resource-groups.html).

> [!NOTE]
> Misconfiguration may prevent Trino cluster from starting. Be careful in adding the configurations.

The following example demonstrates
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

