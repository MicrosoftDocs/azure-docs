<properties
   	pageTitle="Create Hadoop, HBase, or Storm clusters on Linux in HDInsight using cURL and the Azure REST API | Microsoft Azure"
   	description="Learn how to create Linux-based HDInsight clusters using cURL, Azure Resource Manager templates, and the Azure REST API. You can specify the cluster type (Hadoop, HBase, or Storm,) or use scripts to install custom components."
   	services="hdinsight"
   	documentationCenter=""
   	authors="Blackmist"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="03/08/2016"
   	ms.author="larryfr"/>

#Create Linux-based clusters in HDInsight using cURL and the Azure REST API

[AZURE.INCLUDE [selector](../../includes/hdinsight-selector-create-clusters.md)]

The Azure REST API allows you to perform management operations on services hosted in the Azure platform, including the creation of new resources such as Linux-based HDInsight clusters. In this document, you will learn how to create Azure Resource Manager templates to configure an HDInsight cluster and associated storage, then use cURL to deploy the template to the Azure REST API to create a new HDInsight cluster.

> [AZURE.IMPORTANT] The steps in this document use the default number of worker nodes (4) for an HDInsight cluster. If you plan on more than 32 worker nodes, either at cluster creation or by scaling the cluster after creation, then you must select a head node size with at least 8 cores and 14GB ram.
>
> For more information on node sizes and associated costs, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

##Prerequisites

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]


- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

- __Azure CLI__. The Azure CLI is used to create a service principal, which is then used to generate authentication tokens for requests to the Azure REST API.

    For information on installing the CLI, see [Install the Azure CLI](../xplat-cli-install.md).

- __cURL__. This utility is available through your package management system, or can be downloaded from [http://curl.haxx.se/](http://curl.haxx.se/).

    > [AZURE.NOTE] If you are using PowerShell to run the commands in this document, you must first remove the `curl` alias that it creates by default. This alias uses Invoke-WebRequest, a PowerShell cmdlet, instead of cURL when you use the `curl` command from a PowerShell prompt, and will return errors for many of the commands used in this document.
    > 
    > To remove this alias, use the following from the PowerShell prompt:
    >
    > ```Remove-item alias:curl`
    >
    > Once the alias has been removed, you should be able to use the version of cURL that you have installed on your system.

##Create a template

Azure Resource Management templates are JSON documents that describe a __resource group__ and all resources in it (such as HDInsight.) This template based approach allows you to define all the resources that you need for HDInsight in one template, and to manage changes to the group as a whole through __deployments__ that apply changes to the group.

Templates are usually provided in two parts; the template itself, and a parameters file that you populate with values specific to your configuration. For exmaple, the cluster name, admin name and password. When directly using the REST API, you must combine these into one file. The format of this JSON document is:

    {
        "properties": {
            "template": {
                contents of template file
            },
            "mode": "deploymentmode",
            "Parameters": {
                contents of the parameters element from parameters file
            }
        }
    }

For example, the following is a merger of the template and parameters files from [https://github.com/Azure/azure-quickstart-templates/tree/master/hdinsight-linux-ssh-password](https://github.com/Azure/azure-quickstart-templates/tree/master/hdinsight-linux-ssh-password), which creates a Linux-based cluster using a password to secure the SSH user account.

    {
        "properties": {
            "template": {
                "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {
                    "location": {
                        "type": "string",
                        "allowedValues": ["Central US",
                        "East Asia",
                        "East US",
                        "Japan East",
                        "Japan West",
                        "North Europe",
                        "South Central US",
                        "Southeast Asia",
                        "West Europe",
                        "West US"],
                        "metadata": {
                            "description": "The location where all azure resources will be deployed."
                        }
                    },
                    "clusterType": {
                        "type": "string",
                        "allowedValues": ["hadoop",
                        "hbase",
                        "storm",
                        "spark"],
                        "metadata": {
                            "description": "The type of the HDInsight cluster to create."
                        }
                    },
                    "clusterName": {
                        "type": "string",
                        "metadata": {
                            "description": "The name of the HDInsight cluster to create."
                        }
                    },
                    "clusterLoginUserName": {
                        "type": "string",
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
                    "sshUserName": {
                        "type": "string",
                        "metadata": {
                            "description": "These credentials can be used to remotely access the cluster."
                        }
                    },
                    "sshPassword": {
                        "type": "securestring",
                        "metadata": {
                            "description": "The password must be at least 10 characters in length and must contain at least one digit, one non-alphanumeric character, and one upper or lower case letter."
                        }
                    },
                    "clusterStorageAccountName": {
                        "type": "string",
                        "metadata": {
                            "description": "The name of the storage account to be created and be used as the cluster's storage."
                        }
                    },
                    "clusterWorkerNodeCount": {
                        "type": "int",
                        "defaultValue": 4,
                        "metadata": {
                            "description": "The number of nodes in the HDInsight cluster."
                        }
                    }
                },
                "variables": {
                    "defaultApiVersion": "2015-05-01-preview",
                    "clusterApiVersion": "2015-03-01-preview"
                },
                "resources": [{
                    "name": "[parameters('clusterStorageAccountName')]",
                    "type": "Microsoft.Storage/storageAccounts",
                    "location": "[parameters('location')]",
                    "apiVersion": "[variables('defaultApiVersion')]",
                    "dependsOn": [],
                    "tags": {
                        
                    },
                    "properties": {
                        "accountType": "Standard_LRS"
                    }
                },
                {
                    "name": "[parameters('clusterName')]",
                    "type": "Microsoft.HDInsight/clusters",
                    "location": "[parameters('location')]",
                    "apiVersion": "[variables('clusterApiVersion')]",
                    "dependsOn": ["[concat('Microsoft.Storage/storageAccounts/',parameters('clusterStorageAccountName'))]"],
                    "tags": {
                        
                    },
                    "properties": {
                        "clusterVersion": "3.2",
                        "osType": "Linux",
                        "clusterDefinition": {
                            "kind": "[parameters('clusterType')]",
                            "configurations": {
                                "gateway": {
                                    "restAuthCredential.isEnabled": true,
                                    "restAuthCredential.username": "[parameters('clusterLoginUserName')]",
                                    "restAuthCredential.password": "[parameters('clusterLoginPassword')]"
                                }
                            }
                        },
                        "storageProfile": {
                            "storageaccounts": [{
                                "name": "[concat(parameters('clusterStorageAccountName'),'.blob.core.windows.net')]",
                                "isDefault": true,
                                "container": "[parameters('clusterName')]",
                                "key": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('clusterStorageAccountName')), variables('defaultApiVersion')).key1]"
                            }]
                        },
                        "computeProfile": {
                            "roles": [{
                                "name": "headnode",
                                "targetInstanceCount": "2",
                                "hardwareProfile": {
                                    "vmSize": "Standard_D3"
                                },
                                "osProfile": {
                                    "linuxOperatingSystemProfile": {
                                        "username": "[parameters('sshUserName')]",
                                        "password": "[parameters('sshPassword')]"
                                    }
                                }
                            },
                            {
                                "name": "workernode",
                                "targetInstanceCount": "[parameters('clusterWorkerNodeCount')]",
                                "hardwareProfile": {
                                    "vmSize": "Standard_D3"
                                },
                                "osProfile": {
                                    "linuxOperatingSystemProfile": {
                                        "username": "[parameters('sshUserName')]",
                                        "password": "[parameters('sshPassword')]"
                                    }
                                }
                            }]
                        }
                    }
                }],
                "outputs": {
                    "cluster": {
                        "type": "object",
                        "value": "[reference(resourceId('Microsoft.HDInsight/clusters',parameters('clusterName')))]"
                    }
                }
            },
            "mode": "incremental",
            "Parameters": {
                "location": {
                    "value": "North Europe"
                },
                "clusterName": {
                    "value": "newclustername"
                },
                "clusterType": {
                    "value": "hadoop"
                },
                "clusterStorageAccountName": {
                    "value": "newstoragename"
                },
                "clusterLoginUserName": {
                    "value": "admin"
                },
                "clusterLoginPassword": {
                    "value": "changeme"
                },
                "sshUserName": {
                    "value": "sshuser"
                },
                "sshPassword": {
                    "value": "changeme"
                }
            }
        }
    }

This example will be used in the steps in this document. You must replace the placeholder _values_ in the __Parameters__ section at the end of the document with the values you wish to use for your cluster.

##Login to your Azure subscription

Follow the steps documented in [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](../xplat-cli-connect.md) and connect to your subscription using the __login__ method.

##Create a service principal

> [AZURE.IMPORTANT] When following the steps in the article linked below, you must make the following change:
> 
> * When the steps say to use a value of __reader__, you must instead use __owner__. This will create a service principal that can make changes to services on your subscription, which is required for the creation of an HDInsight cluster.
>
> You must also save the following information used in this process:
> 
> * Subscription ID - received when using `azure account list`
> * Tenant ID - received when using `azure account list`
> * Application ID - returned when creating the service principal
> * Password for the service principal - used when creating the service principal

Follow the steps in the _Authenticate service principal with a password - Azure CLI_ section of the [Authenticating a service principal with Azure Resource Manager](https://azure.microsoft.com/documentation/articles/resource-group-authenticate-service-principal/#authenticate-service-principal-with-password---azure-cli) document. This will create a new service principal that can be used to authenticate the cluster creation request.

##Get an authentication token

Use the following to get a new token from Azure. Replace __TENANTID__, __APPLICATIONID__, and __PASSWORD__ with the information save while creating a service principal:

    curl -X "POST" "https://login.microsoftonline.com/TENANTID/oauth2/token" \
    -H "Cookie: flight-uxoptin=true; stsservicecookie=ests; x-ms-gateway-slice=productionb; stsservicecookie=ests" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --data-urlencode "client_id=APPLICATIONID" \
    --data-urlencode "grant_type=client_credentials" \
    --data-urlencode "client_secret=PASSWORD" \
    --data-urlencode "resource=https://management.azure.com/"

If this request is successful, you will receive a 200 series response and the response body will contain a JSON document.

> [AZURE.IMPORTANT] The JSON document returned by this request will contain an element named __access_token__; the value of this element is the access token you must use to authentication the requests used in the next sections of this document.

##Create a resource group

Use the following to create a new resource group. You must create the group first before you can create the resources such as the HDInsight cluster. 

* Replace __SUBSCRIPTIONID__ with the subscription ID received while creating the service principal.
* Replace __ACCESSTOKEN__ with the access token received in the previous step.
* Replace __DATACENTERLOCATION__ with the data center you wish to create the resource group, and resources, in. For example, 'South Central US'. 
* Replace __GROUPNAME__ with the name you wish to use for this group:

    curl -X "PUT" "https://management.azure.com/subscriptions/SUBSCRIPTIONID/resourcegroups/GROUPNAME?api-version=2015-01-01" \
        -H "Authorization: Bearer ACCESSTOKEN" \
        -H "Content-Type: application/json" \
        -d $'{
    "location": "DATACENTERLOCATION"
    }’

If this request is successful, you will receive a 200 series response and the response body will contain a JSON document containing information about the group. The `"provisioningState"` element will contain a value of `"Succeeded"`.

##Create a deployment

Use the following to deploy the cluster configuration (template and parameter values,) to the resource group.

* Replace __SUBSCRIPTIONID__ and __ACCESSTOKEN__ with the values used previously. 
* Replace __GROUPNAME__ with the resource group name you created in the previous section.
* Replace __DEPLOYMENTNAME__ with the name you wish to use for this deployment.

    curl -X "PUT" "https://management.azure.com/subscriptions/SUBSCRIPTIONID/resourcegroups/GROUPNAME/providers/microsoft.resources/deployments/DEPLOYMENTNAME?api-version=2015-01-01" \
    -H "Authorization: Bearer ACCESSTOKEN" \
    -H "Content-Type: application/json" \
    -d "{set your body string to the template and parameters}"

> [AZURE.NOTE] If you have saved the JSON document containing the template and parameters to a file, you can use the following instead of `-d "{ template and parameters}"':
>
> ```--data-binary "@/path/to/file.json"```

If this request is successful, you will receive a 200 series response and the response body will contain a JSON document containing information about the deployment operation.

> [AZURE.IMPORTANT] Note that the deployment has been submitted, but has not completed at this time. It can take several minutes, usually around 15, for the deployment to complete.

##Check the status of a deployment

To check the status of the deployment, use the following:

* Replace __SUBSCRIPTIONID__ and __ACCESSTOKEN__ with the values used previously. 
* Replace __GROUPNAME__ with the resource group name you created in the previous section.

    curl -X "GET" "https://management.azure.com/subscriptions/SUBSCRIPTIONID/resourcegroups/GROUPNAME/providers/microsoft.resources/deployments/DEPLOYMENTNAME?api-version=2015-01-01" \
    -H "Authorization: Bearer ACCESSTOKEN" \
    -H "Content-Type: application/json"

This will return information a JSON document containing information about the deployment operation. The `"provisioningState"` element will contain the status of the deployment; if this contains a value of `"Succeeded"`, then the deployment has completed successfully. At this point, your cluster should be available for use.

##Next steps

Now that you have successfully created an HDInsight cluster, use the following to learn how to work with your cluster. 

###Hadoop clusters

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

###HBase clusters

* [Get started with HBase on HDInsight](hdinsight-hbase-tutorial-get-started-linux.md)
* [Develop Java applications for HBase on HDInsight](hdinsight-hbase-build-java-maven-linux.md)

###Storm clusters

* [Develop Java topologies for Storm on HDInsight](hdinsight-storm-develop-java-topology.md)
* [Use Python components in Storm on HDInsight](hdinsight-storm-develop-python-topology.md)
* [Deploy and monitor topologies with Storm on HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)
