---
title: Data collection and reporting | Azure Arc-enabled data services
description: Explains the type of data that is transmitted by Azure Arc-enabled Data services to Microsoft. 
author: dnethi
ms.author: dinethi
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: conceptual 
ms.date: 07/30/2021
ms.custom: template-concept
---

# Azure Arc-enabled data services data collection and reporting

This article describes the data that Azure Arc-enabled data services transmit to Microsoft. 

Neither Azure Arc-enabled data services nor any of the applicable data services store any customer data. This applies to:

- Azure Arc-enabled SQL Managed Instance
- Azure Arc-enabled PostgreSQL

## Azure Arc-enabled data services

Azure Arc-enabled data services may use some or all of the following products:

- Azure Arc-enabled SQL Managed Instance 
- Azure Arc-enabled PostgreSQL
- Azure Data Studio

   [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

- Azure CLI (az)

### Directly connected

When a cluster is configured to be directly connected to Azure, some data is automatically transmitted to Microsoft. 

The following table describes the type of data, how it is sent, and requirement.  

|Data category|What data is sent?|How is it sent?|Is it required?
|:----|:----|:----|:----|
|Operational Data|Metrics and logs|Automatically, when configured to do so|No
Billing & inventory data|Inventory such as number of instances, and usage such as number of vCores consumed|Automatically |Yes
Diagnostics|Diagnostic information for troubleshooting purposes|Manually exported and provided to Microsoft Support|Only for the scope of troubleshooting and follows the standard [privacy policies](https://privacy.microsoft.com/privacystatement)

### Indirectly connected

When a cluster not configured to be directly connected to Azure, it does not automatically transmit operational, or billing and inventory data to Microsoft. To transmit data to Microsoft, you need to configure the export. 

The following table describes the type of data, how it is sent, and requirement.  

|Data category|What data is sent?|How is it sent?|Is it required?
|:----|:----|:----|:----|
|Operational Data|Metrics and logs|Manually|No
Billing & inventory data|Inventory such as number of instances, and usage such as number of vCores consumed|Manually |Yes
Diagnostics|Diagnostic information for troubleshooting purposes|Manually exported and provided to Microsoft Support|Only for the scope of troubleshooting and follows the standard [privacy policies](https://privacy.microsoft.com/privacystatement)


## Operational data

Operational data is collected for all database instances and for the Azure Arc-enabled data services platform itself. There are two types of operational data: 

- Metrics – Performance and capacity related metrics, which are collected to an Influx DB provided as part of Azure Arc-enabled data services. You can view these metrics in the provided Grafana dashboard. 

- Logs – Records emitted by all components including failure, warning, and informational events are collected to an OpenSearch database provided as part of Azure Arc-enabled data services. You can view the logs in the provided Kibana dashboard. Prior to the May, 2023 release, the log database used Elasticsearch. Thereafter, it uses OpenSearch. 

The operational data stored locally requires built-in administrative privileges to view it in Grafana/Kibana.

The operational data does not leave your environment unless you chooses to export/upload (indirect connected mode) or automatically send (directly connected mode) the data to Azure Monitor/Log Analytics. The data goes into a Log Analytics workspace, which you control. 

If the data is sent to Azure Monitor or Log Analytics, you can choose which Azure region or datacenter the Log Analytics workspace resides in. After that, access to view or copy it from other locations can be controlled by you. 

## Inventory data 

The collected inventory data is represented by several Azure resource types.  The following sections show the properties, types, and descriptions that are collected for each resource type: 

Every database instance and the data controller itself will be reflected in Azure as an Azure resource in Azure Resource Manager. 

There are three resource types: 

- Azure Arc-enabled SQL Managed Instance 
- Azure Arc-enabled PostgreSQL server 
- Data controller

The following sections show the properties, types, and descriptions that are collected and stored about each type of resource: 

### SQL Server - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| Computer name | name | string |
| SQL Server instance name| instanceName | string  |
| SQL Server Version | version | string  |
| SQL Server Edition | edition | string  |
| Containing server resource ID | containerResourceId |  string  |
| Virtual cores | vCore | string  |
| Connectivity status | status | string  |
| SQL Server patch level | patchLevel | string  |
| Collation | collation | string |
| Current version | currentVersion | string |
| TCP dynamic ports | tcpDynamicPorts | string |
| TCP static ports | tcpStaticPorts | string  |
| Product ID | productId | string |
| License type | licenseType | string  |
| Microsoft Defender status | azureDefenderStatus | string  |
| Microsoft Defender status last updated | azureDefenderStatusLastUpdated | string |
| Provisioning state | provisioningState | string |

The following JSON document is an example of the SQL Server - Azure Arc resource. 

```json
{
  
    "name": "SQL22-EE_PAYGTEST",
    "version": "SQL Server 2022",
    "edition": "Enterprise",
    "containerResourceId": "/subscriptions/a5082b19-8a6e-4bc5-8fdd-8ef39dfebc39/resourcegroups/sashan-arc-eastasia/providers/Microsoft.HybridCompute/machines/SQL22-EE",
    "vCore": "8",
    "status": "Connected",
    "patchLevel": "16.0.1000.6",
    "collation": "SQL_Latin1_General_CP1_CI_AS",
    "currentVersion": "16.0.1000.6",
    "instanceName": "PAYGTEST",
    "tcpDynamicPorts": "61394",
    "tcpStaticPorts": "",
    "productId": "00488-00010-05000-AB944",
    "licenseType": "PAYG",
    "azureDefenderStatusLastUpdated": "2023-02-08T07:57:37.5597421Z",
    "azureDefenderStatus": "Protected",
    "provisioningState": "Succeeded"
}
```

### SQL Server database - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| Database name | name | string |
| Collation | collationName | string |
| Database creation date | databaseCreationDate | System.DateTime |
| Compatibility level | compatibilityLevel | string |
| Database state | state | string |
| Readonly mode | isReadOnly | boolean |
| Recovery mode | recoveryMode | boolean |
| Auto close enabled | isAutoCloseOn | boolean |
| Auto shrink enabled | isAutoShrinkOn | boolean |
| Auto create stats enabled | isAutoCreateStatsOn | boolean |
| Auto update stats enabled | isAutoUpdateStatsOn | boolean |
| Remote data archive enabled | isRemoteDataArchiveEnabled | boolean |
! Memory optimization enabled | isMemoryOptimizationEnabled | boolean |
| Encryption enabled | isEncrypted | boolean |
| Trustworthy mode enabled | isTrustworthyOn | boolean |
| Backup information | backupInformation | |
| Provisioning state | provisioningState | string |

The following JSON document is an example of the SQL Server database - Azure Arc resource. 

```json
{
    "name": "newDb80",
    "collationName": "SQL_Latin1_General_CP1_CI_AS",
    "databaseCreationDate": "2023-01-09T03:40:45Z",
    "compatibilityLevel": 150,
    "state": "Online",
    "isReadOnly": false,
    "recoveryMode": "Full",
    "databaseOptions": {
        "isAutoCloseOn": false,
        "isAutoShrinkOn": false,
        "isAutoCreateStatsOn": true,
        "isAutoUpdateStatsOn": true,
        "isRemoteDataArchiveEnabled": false,
        "isMemoryOptimizationEnabled": true,
        "isEncrypted": false,
        "isTrustworthyOn": false
    },
    "backupInformation": {},
    "provisioningState": "Succeeded"
}
```

### Azure Arc data controller

| Description | Property name | Property type|
|:--|:--|:--|
| Location information | OnPremiseProperty | public: OnPremiseProperty |
| The raw Kubernetes information (`kubectl get datacontroller`) | K8sRaw | object | 
| Last uploaded date from on-premises cluster | LastUploadedDate | System.DateTime | 
| Data controller state | ProvisioningState | string | 

The following JSON document is an example of the Azure Arc Data Controller resource. 





```json
{
    "id": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/Microsoft.AzureArcData/dataControllers/contosodc",
    "name": "contosodc",
    "type": "microsoft.azurearcdata/datacontrollers",
    "location": "eastus",
    "extendedLocation": {
        "name": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/Microsoft.ExtendedLocation/customLocations/contoso",
        "type": "CustomLocation"
    },
    "tags": {},
    "systemData": {
        "createdBy": "contosouser@contoso.com",
        "createdByType": "User",
        "createdAt": "2023-01-03T21:35:36.8412132Z",
        "lastModifiedBy": "319f651f-7ddb-4fc6-9857-7aef9250bd05",
        "lastModifiedByType": "Application",
        "lastModifiedAt": "2023-02-15T17:13:26.6429039Z"
    },
    "properties": {
        "infrastructure": "azure",
        "onPremiseProperty": {
            "id": "4eb0a7a5-5ed6-4463-af71-12590b2fad5d",
            "publicSigningKey": "MIIDWzCCAkOgAwIBAgIIA8OmTJKpD8AwDQYJKoZIhvcNAQELBQAwKDEmMCQGA1UEAxMdQ2x1c3RlciBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkwHhcNMjMwMTAzMjEzNzUxWhcNMjgwMTAyMjEzNzUxWjAaMRgwFgYDVQQDEw9iaWxsaW5nLXNpZ25pbmcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC3rAuXaXIeaipFiqGW5rtkdq/1+S58CRMEkANHvwFnimXEWIt8VnbG9foIm20r0RK+6XeRpn5r92jrOl/3R4Q9AAiF3Tgzy3NF9Dg9OsKo1bnrfWHMxmyX2w8TxyZSvWKEUVpVhjhqyhy/cqSJA5ASjEtthMx4Q1HTVcEDSTfnPHPz9EhfZqZ6ES3Yqun2D9MIatkSUpjHJbqYwRTzzrsPG84hJX7EGAWntvEzzCjmTUsouShEwUhi8c05CLBwzF5bxDNLhTdy+tj2ZyUzL7R+BmifwPR9jvOziYPlrbgIIs77sPbNlZjZvMeeBaJHktWZ0s8/UpUpV1W69m7hT2gbAgMBAAGjgZYwgZMwIAYDVR0lAQH/BBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMBMA4GA1UdDwEB/wQEAwIFoDBfBgNVHREEWDBWgg5jb250cm9sbGVyLXN2Y4IoY29udHJvbGxlci1zdmMuY29udG9zby5zdmMuY2x1c3Rlci5sb2NhbIIaY29udHJvbGxlci1zdmMuY29udG9zby5zdmMwDQYJKoZIhvcNAQELBQADggEBADcZNIZcDDUC79ElbRrXdbHo9bUUv/NJfY7Dx226jc8j0AdDq8MbHAnt+JiMH6+GDb88avleA448yZ9ujBP9zC8v8IyaWu4vQpPT7MagzlsAhb6VEWU0FQfM6R14WwbATWSOIwDlMn4I33mZULyJdZhk4TqzqTQ8F0I3TavHh8TWBbjnwg1IhR/8TQ9HfgceoI80SBE3BDI5at/CzYgoWcWS2pzfd3QYwD8DIPVLCdcx1LNSDjdlQCQTKal0yKMauGIzMuYpCF1M6Z0LunPU/Ns96T9mqLXJHu+wmAoJ2CwdXa4FruwTSgrQlY3pokjTMwGaP3uzpnCSI7ykvi5kp4Q=",
            "signingCertificateThumbprint": "8FB48D0DD44DCFB25ECC13B9CB5F493F5438D38C"
        },
        "k8sRaw": {
            "kind": "DataController",
            "spec": {
                "credentials": {
                    "dockerRegistry": "arc-private-registry",
                    "domainServiceAccount": "domain-service-account-secret",
                    "serviceAccount": "sa-arc-controller"
                },
                "security": {
                    "allowDumps": true,
                    "allowNodeMetricsCollection": true,
                    "allowPodMetricsCollection": true
                },
                "services": [
                    {
                        "name": "controller",
                        "port": 30080,
                        "serviceType": "LoadBalancer"
                    }
                ],
                "settings": {
                    "ElasticSearch": {
                        "vm.max_map_count": "-1"
                    },
                    "azure": {
                        "autoUploadMetrics": "true",
                        "autoUploadLogs": "false",
                        "subscription": "7894901a-dfga-rf4d-85r4-cc1234459df2",
                        "resourceGroup": "contoso-rg",
                        "location": "eastus",
                        "connectionMode": "direct"
                    },
                    "controller": {
                        "logs.rotation.days": "7",
                        "logs.rotation.size": "5000",
                        "displayName": "contosodc"
                    }
                },
                "storage": {
                    "data": {
                        "accessMode": "ReadWriteOnce",
                        "className": "managed-premium",
                        "size": "15Gi"
                    },
                    "logs": {
                        "accessMode": "ReadWriteOnce",
                        "className": "managed-premium",
                        "size": "10Gi"
                    }
                },
                "infrastructure": "azure",
                "docker": {
                    "registry": "mcr.microsoft.com",
                    "imageTag": "v1.14.0_2022-12-13",
                    "repository": "arcdata",
                    "imagePullPolicy": "Always"
                }
            },
            "metadata": {
                "namespace": "contoso",
                "name": "contosodc",
                "annotations": {
                    "management.azure.com/apiVersion": "2022-03-01-preview",
                    "management.azure.com/cloudEnvironment": "AzureCloud",
                    "management.azure.com/correlationId": "aa531c88-6dfb-46c3-af5b-d93f7eaaf0f6",
                    "management.azure.com/customLocation": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/Microsoft.ExtendedLocation/customLocations/contoso",
                    "management.azure.com/location": "eastus",
                    "management.azure.com/operationId": "265b98a7-0fc2-4dce-9cef-26f9b6dd000c*705EDFCA81D01028EFA1C3E9CB3CEC2BF472F25894ACB2FFDF955711236F486D",
                    "management.azure.com/resourceId": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/Microsoft.AzureArcData/dataControllers/contosodc",
                    "management.azure.com/systemData": "{\"createdBy\":\"9c1a17be-338f-4b3c-90e9-55eb526c5aef\",\"createdByType\":\"User\",\"createdAt\":\"2023-01-03T21:35:36.8412132Z\",\"resourceUID\":\"74087467-4f98-4a23-bacf-a1e40404457f\"}",
                    "management.azure.com/tenantId": "123488bf-8asd-41wf-91ab-211kl345db47",
                    "traceparent": "00-197d885376f938d6138babf8ed4d809c-1a584b84b3c8f5df-01"
                },
                "creationTimestamp": "2023-01-03T21:35:42Z",
                "generation": 2,
                "resourceVersion": "15446366",
                "uid": "4eb0a7a5-5ed6-4463-af71-12590b2fad5d"
            },
            "apiVersion": "arcdata.microsoft.com/v5",
            "status": {
                "observedGeneration": 2,
                "state": "Ready",
                "azure": {
                    "uploadStatus": {
                        "logs": {
                            "lastUploadTime": "0001-01-01T00:00:00Z",
                            "message": "Automatic upload of logs is disabled. Execution time: 02/15/2023 17:07:57"
                        },
                        "metrics": {
                            "lastUploadTime": "2023-02-15T17:00:57.047934Z",
                            "message": "Success"
                        },
                        "usage": {
                            "lastUploadTime": "2023-02-15T17:07:53.843439Z",
                            "message": "Success. Records uploaded: 1."
                        }
                    }
                },
                "lastUpdateTime": "2023-02-15T17:07:57.587925Z",
                "runningVersion": "v1.14.0_2022-12-13",
                "arcDataServicesK8sExtensionLatestVersion": "v1.16.0",
                "registryVersions": {
                    "available": [
                        "v1.16.0_2023-02-14",
                        "v1.15.0_2023-01-10"
                    ],
                    "behind": 2,
                    "current": "v1.14.0_2022-12-13",
                    "latest": "v1.16.0_2023-02-14",
                    "next": "v1.15.0_2023-01-10",
                    "previous": "v1.13.0_2022-11-08"
                }
            }
        },
        "provisioningState": "Succeeded"
    }
}
```



### PostgreSQL server - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| The data controller ID | DataControllerId | string |
| The instance admin name | Admin | string |
| Username and password for basic authentication | BasicLoginInformation | public: BasicLoginInformation | 
| The raw Kubernetes information (`kubectl get postgres12`) | K8sRaw | object |
| Last uploaded date from on premises cluster | LastUploadedDate | System.DateTime |
| Group provisioning state | ProvisioningState | string |

### SQL managed instance - Azure Arc

| Description | Property name | Property type|
|:--|:--|:--|
| The managed instance ID | DataControllerId | string |
| The instance admin username | Admin | string |
| The instance start time | StartTime | string |
| The instance end time | EndTime | string |
| The raw kubernetes information (`kubectl get sqlmi`) | K8sRaw | object |
| Username and password for basic authentication | BasicLoginInformation | BasicLoginInformation |
| Last uploaded date from on-premises cluster | LastUploadedDate | System.DateTime |
| SQL managed instance provisioning state | ProvisioningState | string |


The following JSON document is an example of the SQL Managed Instance - Azure Arc resource. 





```json

{
    "id": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/Microsoft.AzureArcData/sqlManagedInstances/sqlmi1",
    "name": "sqlmi1",
    "type": "microsoft.azurearcdata/sqlmanagedinstances",
    "sku": {
        "name": "vCore",
        "tier": "BusinessCritical"
    },
    "location": "eastus",
    "extendedLocation": {
        "name": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourcegroups/contoso-rg/providers/microsoft.extendedlocation/customlocations/contoso",
        "type": "CustomLocation"
    },
    "tags": {},
    "systemData": {
        "createdBy": "contosouser@contoso.com",
        "createdByType": "User",
        "createdAt": "2023-01-04T01:33:57.5232885Z",
        "lastModifiedBy": "319f651f-7ddb-4fc6-9857-7aef9250bd05",
        "lastModifiedByType": "Application",
        "lastModifiedAt": "2023-02-15T01:39:11.6582399Z"
    },
    "properties": {
        "dataControllerId": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/Microsoft.AzureArcData/dataControllers/contosodc",
        "admin": "sqladmin",
        "k8sRaw": {
            "spec": {
                "scheduling": {
                    "default": {
                        "resources": {
                            "requests": {
                                "cpu": "2",
                                "memory": "4Gi"
                            },
                            "limits": {
                                "cpu": "2",
                                "memory": "4Gi"
                            }
                        }
                    }
                },
                "replicas": 2,
                "dev": true,
                "services": {
                    "primary": {
                        "type": "LoadBalancer"
                    },
                    "readableSecondaries": {}
                },
                "readableSecondaries": 1,
                "syncSecondaryToCommit": 0,
                "storage": {
                    "data": {
                        "volumes": [
                            {
                                "size": "5Gi"
                            }
                        ]
                    },
                    "logs": {
                        "volumes": [
                            {
                                "size": "5Gi"
                            }
                        ]
                    },
                    "datalogs": {
                        "volumes": [
                            {
                                "size": "5Gi"
                            }
                        ]
                    },
                    "backups": {
                        "volumes": [
                            {
                                "className": "azurefile",
                                "size": "5Gi"
                            }
                        ]
                    }
                },
                "security": {
                    "adminLoginSecret": "sqlmi1-login-secret"
                },
                "tier": "BusinessCritical",
                "update": {},
                "backup": {
                    "retentionPeriodInDays": 7
                },
                "licenseType": "LicenseIncluded",
                "orchestratorReplicas": 1,
                "parentResource": {
                    "apiGroup": "arcdata.microsoft.com",
                    "kind": "DataController",
                    "name": "contosodc",
                    "namespace": "contoso"
                },
                "settings": {
                    "collation": "SQL_Latin1_General_CP1_CI_AS",
                    "language": {
                        "lcid": 1033
                    },
                    "network": {
                        "forceencryption": 0,
                        "tlsciphers": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384",
                        "tlsprotocols": "1.2"
                    },
                    "sqlagent": {
                        "enabled": false
                    },
                    "timezone": "UTC"
                }
            },
            "metadata": {
                "annotations": {
                    "management.azure.com/apiVersion": "2022-03-01-preview",
                    "management.azure.com/cloudEnvironment": "AzureCloud",
                    "management.azure.com/correlationId": "3a49178d-a09f-48d3-9292-3133f6591743",
                    "management.azure.com/customLocation": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/microsoft.extendedlocation/customlocations/contoso",
                    "management.azure.com/location": "eastus",
                    "management.azure.com/operationId": "dbf2e708-78da-4762-8fd5-75ba43721b24*4C234309E6735F28E751F5734D64E8F98A910A88E54A1AD35C6469BCD0E6EA84",
                    "management.azure.com/resourceId": "/subscriptions/7894901a-dfga-rf4d-85r4-cc1234459df2/resourceGroups/contoso-rg/providers/Microsoft.AzureArcData/sqlManagedInstances/sqlmi1",
                    "management.azure.com/systemData": "{\"createdBy\":\"9c1a17be-338f-4b3c-90e9-55eb526c5aef\",\"createdByType\":\"User\",\"createdAt\":\"2023-01-04T01:33:57.5232885Z\",\"resourceUID\":\"40fa8b55-4b7d-4d6a-b783-043169d7fd03\"}",
                    "management.azure.com/tenantId": "123488bf-8asd-41wf-91ab-211kl345db47",
                    "traceparent": "00-3c07cf4caa8b4778591b02b1bf3979ef-f2ee2c890c21ea8a-01"
                },
                "creationTimestamp": "2023-01-04T01:34:03Z",
                "generation": 1,
                "labels": {
                    "management.azure.com/resourceProvider": "Microsoft.AzureArcData"
                },
                "name": "sqlmi1",
                "namespace": "contoso",
                "resourceVersion": "15215035",
                "uid": "6d653cd8-f17e-437a-b0dc-48154164c1ad"
            },
            "status": {
                "lastUpdateTime": "2023-02-15T01:39:07.691211Z",
                "observedGeneration": 1,
                "readyReplicas": "2/2",
                "roles": {
                    "sql": {
                        "replicas": 2,
                        "lastUpdateTime": "2023-02-14T11:37:14.875705Z",
                        "readyReplicas": 2
                    }
                },
                "state": "Ready",
                "endpoints": {
                    "logSearchDashboard": "https://230.41.13.18:5601/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:sqlmi1'))",
                    "metricsDashboard": "https://230.41.13.18:3000/d/40q72HnGk/sql-managed-instance-metrics?var-hostname=sqlmi1-0",
                    "mirroring": "230.41.13.18:5022",
                    "primary": "230.41.13.18,1433",
                    "secondary": "230.41.13.18,1433"
                },
                "highAvailability": {
                    "lastUpdateTime": "2023-02-14T11:47:42.208708Z",
                    "mirroringCertificate": "-----BEGIN CERTIFICATE-----\nMIIDQzCCAiugAwIBAgIISqqmfCPaolkwDQYJKoZIhvcNAQELBQAwKDEmMCQGA1UEAxMdQ2x1c3Rl\r\nciBDZXJ0aWZpDEzNDA2WhcNMjgwMTAzMDEzNDA2WjAO\r\nMQwwCgYDVQQDEwNkYm0wggEiMA0GCSqgEKAoIBAQDEXj2nm2cGkyfu\r\npXWQ4s6G//AI1rbH4JStZOAHwJNYmBuESSHz0i6znjnQQloFe+g2KM+1m4TN1T39Lz+/ufEYQQX9\r\nx9WuGP2IALgH1LXc/0DGuOB16QXqN7ZWULQ4ovW4Aaz5NxTSDXWYPK+zpb1c8adsQyamLHwmSPs4\r\nMpsgfOR9EUCqdnuKjSHbWCtkJTYogpAFyZb5HOgY1TMICrTkXG6VYoCPS/EDNmtPOyVuykdjjsxx\r\nIC5KkVgHWTaYIDjim7L44FPh4HUIVM/OFScRijCZTJogN/Fe94+kGDWfgWIG36Jlz127BbWV3HNJ\r\nkH2oLchIABvgTXsdKnjK3i2TAgMBAAGjgYowgYcwIAYDVR0lAQH/BBYwFAYIKwYBBQUHAwIGCCsG\r\nAQUFBwMBMA4GA1UdDwEB/wQEAwIFoDBTBgNVHREETDBKggpzcWxtaTEtc3ZjgiRzcWxtaTEtc3Zj\r\nLmNvbnRvc28uc3ZjLmNsdXN0ZXIubG9jYWyCFnNxbG1pMS1zdmMuY29udG9zby5zdmMwDQYJKoZI\r\nhvcNAQELBQADggEBAA+Wj6WK9NgX4szxT7zQxPVIn+0iviO/2dFxHmjmvj+lrAffsgNdfeX5095f\r\natxIO+no6VW2eoHze2f6AECh4/KefyAzd+GL9MIksJcMLqSqAemXju3pUfGBS1SAW8Rh361D8tmA\r\nEFpPMwZG3uMidYMso0GqO0tpejz2+5Q4NpweHBGoq6jk+9ApTLD+s5qetZHrxGD6tS1Z/Lvt24lE\r\nKtSKEDw5O2qnqbsOe6xxtPAuIfTmpwIzIv2WiGC3aGuXSr0bNyPHzh5RL1MCIpwLMrnruFwVzB25\r\nA0xRalcXVZRZ1H0zbznGsecyBRJiA+7uxNB7/V6i+SjB/qxj2xKh4s8=\n-----END CERTIFICATE-----\n",
                    "healthState": "Error",
                    "replicas": []
                },
                "logSearchDashboard": "https://230.41.13.18:5601/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:sqlmi1'))",
                "metricsDashboard": "https://230.41.13.18:3000/d/40q72HnGk/sql-managed-instance-metrics?var-hostname=sqlmi1-0",
                "primaryEndpoint": "230.41.13.18,1433",
                "runningVersion": "v1.14.0_2022-12-13",
                "registryVersions": {
                    "available": [],
                    "behind": 0,
                    "current": "v1.14.0_2022-12-13",
                    "latest": "v1.14.0_2022-12-13",
                    "previous": "v1.13.0_2022-11-08"
                }
            }
        },
        "provisioningState": "Succeeded",
        "licenseType": "LicenseIncluded"
    }
}
```

## Examples

Example of resource inventory data JSON document that is sent to Azure to create Azure resources in your subscription. 

```json
{ 

        "customObjectName": "<resource type>-2020-29-5-23-13-17-164711", 
        "uid": "4bc3dc6b-9148-4c7a-b7dc-01afc1ef5373", 
        "instanceName": "sqlInstance001", 
        "instanceNamespace": "arc", 
        "instanceType": "<resource>", 
        "location": "eastus", 
        "resourceGroupName": "production-resources", 
        "subscriptionId": "<subscription_id>", 
        "isDeleted": false, 
        "externalEndpoint": "32.191.39.83:1433", 
        "vCores": "2", 
        "createTimestamp": "05/29/2020 23:13:17", 
        "updateTimestamp": "05/29/2020 23:13:17" 
    } 
```

## Billing data

Billing data is used for purposes of tracking usage that is billable. This data is essential for running of the service and needs to be transmitted manually or automatically in all modes. 

### Arc-enabled data services

Billing data captures the start time (“created”) and end time (“deleted”) of a given instance, as well as any start and time whenever a change in the number of cores available to a given instance (“core limit”) happens. 

```json
{ 
    "requestType": "usageUpload", 
    "clusterId": "4b0917dd-e003-480e-ae74-1a8bb5e36b5d", 
    "name": "DataControllerTestName", 
    "subscriptionId": "<subscription_id>", 
    "resourceGroup": "production-resources", 
    "location": "eastus", 
    "uploadRequest": { 
    "exportType": "usages", 
    "dataTimestamp": "2020-06-17T22:32:24Z", 
    "data": 
        "[{\"name\":\"sqlInstance001\", 
        \"namespace\":\"arc\", 
        \"type\":\"<resource type>\", 
        \"eventSequence\":1,  
        \"eventId\":\"50DF90E8-FC2C-4BBF-B245-CB20DC97FF24\", 
        \"startTime\":\"2020-06-17T19:11:47.7533333\", 
        \"endTime\":\"2020-06-17T19:59:00\", 
        \"quantity\":1, 
        \"id\":\"<subscription_id>\"}]", 
        "signature":"MIIE7gYJKoZIhvcNAQ...2xXqkK" 
```

### Arc-enabled SQL Server

Billing data captures a snapshot of the SQL Server instance properties as well as the machine properties every hour and compose the usage upload payload to report usage. There is a snapshot time in the payload for each SQL Server  instance. 

```json
{
    "hostType": "Unknown",
    "osType": "Windows",
    "manufacturer": "Microsoft",
    "model": "Hyper-V",
    "isVirtualMachine": true,
    "serverName": "TestArcServer",
    "serverId": "<server id>",
    "location": "eastus",
    "timestamp": "2021-07-08T01:42:15.0388467Z",
    "uploadRequest": {
        "exportType": "usages",
        "dataTimestamp": "2020-06-17T22:32:24Z",
        "data": 
            "[{\"hostType\":\"VirtualMachine\",
            \"numberOfCores\":4,
            \"numberOfProcessors\":1,
            \"numberOfLogicalProcessors\":4,
            \"subscriptionId\":\"<subscription id>\",\"resourceGroup\":\"ArceeBillingPipelineStorage_Test\",
            \"location\":\"eastus2euap\",
            \"version\":\"Sql2019\",
            \"edition\":\"Enterprise\",
            \"editionOriginalString\":\"Enterprise Edition: Core based licensing\",
            \"coreInfoOriginalString\":\"using 16 logical processors based on SQL Server licensing\",
            \"vCore\":4,
            \"instanceName\":\"INSTANCE01\",
            \"licenseType\":\"LicenseOnly\",
            \"hostLicenseType\":\"Paid\",
            \"instanceLicenseType\":\"Paid\",
            \"serverName\":\"TestArcServer\",
            \"isRunning\":false,
            \"eventId\":\"00000000-0000-0000-0000-000000000000\",
            \"snapshotTime\":\"2020-06-17T19:59:00\",
            \"isAzureBilled\":\"Enabled\",
            \"hasSoftwareAssurance\":\"Undefined\"}]"
    }
}
```

## Diagnostic data

In support situations, you may be asked to provide database instance logs, Kubernetes logs, and other diagnostic logs. The support team will provide a secure location for you to upload to. Dynamic management views (DMVs) may also provide diagnostic data. The DMVs or queries used could contain database schema metadata details but typically not customer data. Diagnostic data does not contain any passwords, cluster IPs or individually identifiable data. These are cleaned and the logs are made anonymous for storage when possible. They are not transmitted automatically and administrator has to manually upload them. 

|Field name  |Notes  |
|:--|:--|
|Error logs |Log files capturing errors may contain customer or personal data (see below) are restricted and shared by user |
|DMVs      |Dynamic management views can contain query and query plans but are restricted and shared by user     |
|Views    |Views can contain customer data but are restricted and shared only by user     |
|Crash dumps – customer data | Maximum 30-day retention of crash dumps – may contain access control data <br/><br/> Statistics objects, data values within rows, query texts could be in customer crash dumps    |
|Crash dumps – personal data | Machine, logins/ user names, emails, location information, customer identification – require user consent to be included  |

## Next steps
[Upload usage data to Azure Monitor](upload-usage-data.md)




