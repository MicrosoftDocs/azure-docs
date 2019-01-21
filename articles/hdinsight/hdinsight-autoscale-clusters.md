---
title: Automatically scale HDInsight clusters 
description: Use the HDInsight Autoscale feature to automatically scale clusters
services: hdinsight
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/21/2019
ms.author: hrasheed

---
# Automatically scale HDInsight clusters

Azure HDInsight’s Cluster Autoscale feature automatically scales the cluster size up and down based on load within a predefined range. During creation of a new HDInsight cluster, a minimum and maximum number of worker nodes can be set. Autoscale will keep monitoring the resource requirements of the analytics load and intelligently scale the number of worker nodes up and down This feature will allow enterprise to become more cost effective.

## Getting Started

## Enable Autoscale

### Create cluster with UX portal

During creation of a new cluster, you can select ‘Custom (size, settings, apps)’ tab. When it goes to ‘Cluster size’ step, you will see the ‘worker node Autoscale (preview) ’ option. By checking this option, you can specify:

* The initial number of worker nodes
* The minimum number of worker nodes
* The maximum number of worker nodes

The initial number of worker nodes must fall within the minimum and maximum, inclusive. It defines the initial size of the cluster when it is created.

After you choose the VM type of each node type, you will be able to see the estimated cost range for the whole cluster. You can adjust the above settings to fit the cost to your budget.

Your subscription has a capacity quota for each region. The total number of cores of your head nodes combined with the maximum number of worker nodes can’t exceed the capacity quota. However, this quota is a soft limit; you can always create a support ticket to get it increased easily.

### Create cluster with ARM template

When you create an HDInsight cluster with an ARM template, you need to add the following settings in the “computeProfile” “workernode” section:

```json
{                            
    "name": "workernode",
    "targetInstanceCount": 4,
    "autoscale": {
        "minInstanceCount": 2,
        "maxInstanceCount": 10
    },
    "hardwareProfile": {
        "vmSize": "Standard_D13_V2"
    },
    "osProfile": {
        "linuxOperatingSystemProfile": {
            "username": "[parameters('sshUserName')]",
            "password": "[parameters('sshPassword')]"
        }
    },
    "virtualNetworkProfile": null,
    "scriptActions": []
}
```

A complete ARM template example is included in the appendix.  
Enable Autoscale for a running cluster
Enabling Autoscale for a running cluster is not supported during private preview. It must be enabled during cluster creation.

## Monitoring 

You can view the cluster scale up and down history as part of the cluster metrics. You can list all scale actions over the past day, week or longer period of time. 


## Disable and Modify Autoscale

Disable Autoscale for a running cluster and  modifying Autoscale settings for a running cluster is not supported in private preview. You have to delete this cluster and create a new cluster to delete or modify the settings.


## How it works

### Metrics Monitoring

Autoscale continuously monitors the cluster and collects the following metrics:

1. Total Pending CPU : The total number of cores required to start execution of all pending containers.
2. Total Pending Memory: The total memory (in MB) required to start execution of all pending containers.
3. Total Free CPU: The sum of all unused cores on the active worker nodes.
4. Total Free Memory: The sum of unused memory (in MB) on the active worker nodes.
5. Used Memory per Node: This represents the load on a worker node. A worker node on which 10 GB of memory is used is considered under more load than a worker with 2 GB of used memory.
6. Number of Application Masters per Node: This represents the number of Application Master (AM) containers running on a worker node. A worker node hosting 2 AM containers is considered more important than a worker node hosting 0 AM containers.

The above metrics are checked every 60 seconds. Autoscale will make scale up and scale down decisions based on these metrics.

### Cluster scale up

When the following conditions are detected, Autoscale will issue a scale up request:

* Total pending CPU is greater than total free CPU for more than 1 minute.
* Total pending memory is greater than total free memory for more than 1 minute.

We will calculate that N new worker nodes are needed to meet the current CPU and memory requirements and then issue a scale up request by requesting N new worker nodes.

### Cluster scale down

When the following conditions are detected, Autoscale will issue a scale down request:

* Total pending CPU is less than total free CPU for more than 10 minutes.
* Total pending memory is less than total free memory for more than 10 minutes.

Based on the number of AM containers per node as well as the current CPU and memory requirements, Autoscale will issue a request to remove N nodes, specifying which nodes are potential candidates for removal. By default, 2 nodes will be removed in one cycle.

## FAQ

1. Which type of clusters will support Autoscale?
Answer:  In the first private preview release, Spark, MapReduce and Hive cluster types will support Autoscale. 
2. Which types of node can scale up and down?
Answer: Only the worker nodes can be scaled up and down. Head nodes and edge nodes can’t be scaled.
3.	When can I enable/disable Autoscale?
Answer: You can only enable/disable Autoscale during cluster creation.
4.	How will this feature be charged to customers?
Answer: There is no separate charge for this feature. It is included in the HDI markup.
5.	What will happen if this customer exceeds the total core quota limit?
Answer: You will receive an error message saying ‘the maximum node exceeded the available cores in this region, please choose another region or contact the support to increase the quota.’
6.	Will Autoscale follow a predefined time schedule?
Answer: Customized scheduling rules are on our roadmap, but are not included in the private preview. We are targeting to support them in the GA version.
7.	Can I specify 0 as the minimum number of worker nodes?
Answer: No. At least 1 worker node needs to be kept active.
8.	Which version of HDI is supported?
Answer: Autoscale is supported in HDI 3.6. HDI 4.0 support will be added later.
9.	Will ESP clusters be supported?
Answer: ESP clusters are not supported at the beginning of the private preview. Support will be added later in the private preview.

 
## Appendix
ARM Template
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "0.9.0.0",
    "parameters": {
        "clusterName": {
            "type": "string",
            "metadata": {
                "description": "The name of the HDInsight cluster to create."
            }
        },
        "clusterLoginUserName": {
            "type": "string",
            "defaultValue": "admin",
            "metadata": {
                "description": "These credentials can be used to submit jobs to the cluster and to log into cluster dashboards."
            }
        },
        "clusterLoginPassword": {
            "type": "securestring",
            "metadata": {
                "description": "The password must be at least 10 characters in length and must contain at least one digit, one non-alphanumeric character, and one upper or lower case letter."
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "eastus2",
            "metadata": {
                "description": "The location where all azure resources will be deployed."
            }
        },
        "clusterVersion": {
            "type": "string",
            "defaultValue": "3.6",
            "metadata": {
                "description": "HDInsight cluster version."
            }
        },
        "clusterWorkerNodeCount": {
            "type": "int",
            "defaultValue": 4,
            "metadata": {
                "description": "The number of nodes in the HDInsight cluster."
            }
        },
        "clusterKind": {
            "type": "string",
            "defaultValue": "SPARK",
            "metadata": {
                "description": "The type of the HDInsight cluster to create."
            }
        },
        "sshUserName": {
            "type": "string",
            "defaultValue": "sshuser",
            "metadata": {
                "description": "These credentials can be used to remotely access the cluster."
            }
        },
        "sshPassword": {
            "type": "securestring",
            "metadata": {
                "description": "The password must be at least 10 characters in length and must contain at least one digit, one non-alphanumeric character, and one upper or lower case letter."
            }
        }
    },
    "resources": [
        {
            "apiVersion": "2015-03-01-preview",
            "name": "[parameters('clusterName')]",
            "type": "Microsoft.HDInsight/clusters",
            "location": "[parameters('location')]",
            "dependsOn": [],
            "properties": {
                "clusterVersion": "[parameters('clusterVersion')]",
                "osType": "Linux",
                "tier": "standard",
                "clusterDefinition": {
                    "kind": "[parameters('clusterKind')]",
                    "componentVersion": {
                        "Spark": "2.3"
                    },
                    "configurations": {
                        "gateway": {
                            "restAuthCredential.isEnabled": true,
                            "restAuthCredential.username": "[parameters('clusterLoginUserName')]",
                            "restAuthCredential.password": "[parameters('clusterLoginPassword')]"
                        }
                    }
                },
                "storageProfile": {
                    "storageaccounts": [
                        {
                            "name": "testsdktorage.blob.core.windows.net",
                            "isDefault": true,
                            "container": "testcluster111-2018-11-01t15-53-20-856z",
                            "key": "[listKeys('/subscriptions/d66b1168-d835-4066-8c45-7d2ed713c082/resourceGroups/TestSDK/providers/Microsoft.Storage/storageAccounts/testsdktorage', '2015-05-01-preview').key1]"
                        }
                    ]
                },
                "computeProfile": {
                    "roles": [
                        {                            
                            "name": "headnode",
                            "minInstanceCount": 1,
                            "targetInstanceCount": 2,
                            "hardwareProfile": {
                                "vmSize": "Standard_D12_V2"
                            },
                            "osProfile": {
                                "linuxOperatingSystemProfile": {
                                    "username": "[parameters('sshUserName')]",
                                    "password": "[parameters('sshPassword')]"
                                }
                            },
                            "virtualNetworkProfile": null,
                            "scriptActions": []
                        },
                        {                            
                            "name": "workernode",
                            "targetInstanceCount": 4,
                            "autoscale": {
                                "minInstanceCount": 2,
                                "maxInstanceCount": 10
                            },
                            "hardwareProfile": {
                                "vmSize": "Standard_D13_V2"
                            },
                            "osProfile": {
                                "linuxOperatingSystemProfile": {
                                    "username": "[parameters('sshUserName')]",
                                    "password": "[parameters('sshPassword')]"
                                }
                            },
                            "virtualNetworkProfile": null,
                            "scriptActions": []
                        }
                    ]
                }
            }
        }
    ]
}
