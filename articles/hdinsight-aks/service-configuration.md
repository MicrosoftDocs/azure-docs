---
title: Manage cluster configuration
description: How to update cluster configuration for HDInsight on AKS.
ms.topic: how-to
ms.date: 08/29/2023
---

# Manage cluster configuration

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS allows you to tweak the configuration properties to improve performance of your cluster with certain settings. For example, usage or memory settings. You can do the following actions: 

* Update the existing configurations or add new configurations.
* Export the configurations using REST API.

## Customize configurations

You can customize configurations using following options:

* [Using Azure portal](#using-azure-portal)
* [Using ARM template](#using-arm-template)

### Using Azure portal

1. Sign in to [Azure portal](https://portal.azure.com).
  
1. In the Azure portal search bar, type "HDInsight on AKS cluster" and select "Azure HDInsight on AKS clusters" from the drop-down list.
  
   :::image type="content" source="./media/service-configuration/get-started-portal-search-step-1.png" alt-text="Screenshot showing search option for getting started with HDInsight on AKS Cluster.":::
  
1. Select your cluster name from the list page.
  
   :::image type="content" source="./media/service-configuration/get-started-portal-list-view-step-2.png" alt-text="Screenshot showing selecting the HDInsight on AKS Cluster you require from the list.":::
   
1. Go to "Configuration management" blade in the left menu.
   
    :::image type="content" source="./media/service-configuration/configuration-management-tab.png" alt-text="Screenshot showing Configuration Management tab.":::
  
1. Depending on the cluster type, configurations files are listed. For more information, see [Trino](./trino/trino-service-configuration.md), [Flink](./flink/flink-configuration-management.md), and [Spark](./spark/configuration-management.md) configurations.
  
1. Add new or update the existing key-value pair for the configurations you want to modify.
  
1. Select **OK** and then click **Save**. 

> [!NOTE]
> Some configuration change may need service restart to reflect the changes.

### Using ARM template

#### Prerequisites

* [ARM template](./create-cluster-using-arm-template.md) for your cluster.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).

In the ARM template, you can edit **serviceConfigsProfiles** and specify the OSS configuration file name with the value you would like to overwrite.

If the OSS configuration file is in JSON/XML/YAML format, you can provide the OSS configuration file name via `fileName`. Provide the key value pairs that you want to overwrite in “values.” 

Here are some samples for each workload:

**Flink configuration example:**

```json
 "serviceConfigsProfiles": [
                {
                    "serviceName": "flink-operator",
                    "configs": [
                        {
                            "component": "flink-configs",
                            "files": [
                                {
                                    "fileName": "flink-conf.yaml",
                                    "values": {
                                        "taskmanager.memory.process.size": "4096mb",
                                        "classloader.check-leaked-classloader": "false",
                                        "jobmanager.memory.process.size": "4096mb",
                                        "classloader.parent-first-patterns.additional": "org.apache.parquet"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
```

**Spark configuration example:**

```json
  "serviceConfigsProfiles": [
                {
                    "serviceName": "spark-service",
                    "configs": [
                        {
                            "component": "livy-config",
                            "files": [
                                {
                                    "fileName": "livy-client.conf",
                                    "values": {
                                        "livy.client.http.connection.timeout": "11s"
                                    }
                                }
                            ]
                        },
                        {
                            "component": "spark-config",
                            "files": [
                                {
                                    "fileName": "spark-env.sh",
                                    "content": "# - SPARK_HISTORY_OPTS, to set config properties only for the history server (e.g. \"-Dx=y\")\nexport HDP_VERSION=3.3.3.5.2-83515052\n"
                                }
                            ]
                        }
                    ]
                }
          ]
```

**Trino configuration example:**

```json
 "serviceConfigsProfiles": [
                {
                    "serviceName": "trino",
                    "configs": [
                        {
                            "component": "coordinator",
                            "files": [
                                {
                                    "fileName": "config.properties",
                                    "values": {
                                        "query.cache.enabled": "true",
                                        "query.cache.ttl": "1h",
                                        "query.enable-multi-statement-set-session": "true",
                                        "query.max-memory": "301GB"
                                    }
                                },
                                {
                                    "fileName": "log.properties",
                                    "values": {
                                        "io.trino": "INFO"
                                    }
                                }
                            ]
                        }
          ]
```

For more information about Trino configuration options, see the sample ARM templates.

* [arm-trino-config-sample.json](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json)

## Export the configurations using REST API

You can also export cluster configurations to check the default and updated values. At this time, you can only export configurations via the REST API.

Get cluster configurations:

`GET Request: 
/subscriptions/{{USER_SUB}}/resourceGroups/{{USER_RG}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSTERPOOL}}/clusters/{{CLUSTERNAME}}/serviceConfigs?api-version={{HDINSIGHTONAKS_API_VERSION}}`

If you aren't familiar with how to send a REST API call, the following steps can help you.

1. Click the following button at the top right in the Azure portal to launch Azure Cloud Shell.

    :::image type="content" source="./media/service-configuration/cloud-shell.png" alt-text="Screenshot screenshot showing Cloud Shell icon.":::

1. Make sure Cloud Shell is set to PowerShell on the top left. Run the following command to get token and set HTTP request headers.

    ```
    $azContext = Get-AzContext
    $azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile

    $profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
    $token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
    $authHeader = @{
        'Content-Type'='application/json'
        'Authorization'='Bearer ' + $token.AccessToken
    }
    ```

1. Set the $restUri variable to the Get request URL.

    ```
    $restUri = 
    'https://management.azure.com/subscriptions/{{USER_SUB}}/resourceGroups/{{USER_RG}}/providers/Microsoft.HDInsight/clusterpools/{{CLUSTERPOOL}}/clusters/{{CLUSTERNAME}}/serviceConfigs?api-version={{HDINSIGHTONAKS_API_VERSION}}'
    ```
    For example: 
    `$restUri = 'https://management.azure.com/subscriptions/xxx-yyyy-zzz-00000/resourceGroups/contosoRG/providers/Microsoft.HDInsight/clusterpools/contosopool/clusters/contosocluster/serviceConfigs?api-version=2021-09-15-preview`
   
   > [!NOTE]
   > You can get the resource id and up-to-date api-version from the "JSON View" of your cluster in the Azure portal.
   > 
   > :::image type="content" source="./media/service-configuration/view-cost-json-view.png" alt-text="Screenshot view cost JSON View buttons.":::

1. Send the GET request by executing following command.

    `Invoke-RestMethod -Uri $restUri -Method Get -Headers $authHeader | ConvertTo-Json -Depth 10`

