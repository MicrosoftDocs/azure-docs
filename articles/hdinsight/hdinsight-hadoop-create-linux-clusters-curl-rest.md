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
   	ms.date="07/27/2016"
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

    [AZURE.INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-cli.md)]

- __cURL__. This utility is available through your package management system, or can be downloaded from [http://curl.haxx.se/](http://curl.haxx.se/).

    > [AZURE.NOTE] If you are using PowerShell to run the commands in this document, you must first remove the `curl` alias that it creates by default. This alias uses Invoke-WebRequest, a PowerShell cmdlet, instead of cURL when you use the `curl` command from a PowerShell prompt, and will return errors for many of the commands used in this document.
    > 
    > To remove this alias, use the following from the PowerShell prompt:
    >
    > `Remove-item alias:curl`
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

For example, the following is a merger of the template and parameters files from [https://github.com/Azure/azure-quickstart-templates/tree/master/101-hdinsight-linux-ssh-password](https://github.com/Azure/azure-quickstart-templates/tree/master/101-hdinsight-linux-ssh-password), which creates a Linux-based cluster using a password to secure the SSH user account.

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

Follow the steps documented in [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](../xplat-cli-connect.md) and connect to your subscription using the `azure login` command.

##Create a service principal

> [AZURE.NOTE] These steps are an abridged version of the information provided in the _Authenticate service principal with a password - Azure CLI_ section of the [Authenticating a service principal with Azure Resource Manager](../resource-group-authenticate-service-principal.md#authenticate-service-principal-with-password---azure-cli) document. These steps create a new service principal that can be used to authenticate the REST API requests used to create Azure resources such as an HDInsight cluster.

1. From the command prompt, terminal session, or shell, use the following command to list your Azure subscriptions.

        azure account list
        
    In the list, select the subscription that you want to use and note the __Id__ column. This is the __subscription ID__ and will be used in most of the steps in this document.

2. Create a new application in Azure Active Directory.

        azure ad app create --name "exampleapp" --home-page "https://www.contoso.org" --identifier-uris "https://www.contoso.org/example" --password <Your_Password>
        
    Replace the values for the `--name`, `--home-page`, and `--identifier-uris` with your own values. Provide a password for the new Active Directory entry.
    
    > [AZURE.NOTE] Since you are creating this application for authentication through a service principal, the `--home-page` and `--identifier-uris` values don't need to reference an actual web page hosted on the internet; they just need to be unique URIs.
    
    From the data returned, save the __AppId__ value.
    
        data:    AppId:          4fd39843-c338-417d-b549-a545f584a745
        data:    ObjectId:       4f8ee977-216a-45c1-9fa3-d023089b2962
        data:    DisplayName:    exampleapp
        ...
        info:    ad app create command OK
    
3. Create a service principal using the __AppId__ value returned previously.

        azure ad sp create 4fd39843-c338-417d-b549-a545f584a745
        
     From the data returned, save the __Object Id__ value.
     
        info:    Executing command ad sp create
        - Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
        data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
        data:    Display Name:     exampleapp
        data:    Service Principal Names:
        data:                      4fd39843-c338-417d-b549-a545f584a745
        data:                      https://www.contoso.org/example
        info:    ad sp create command OK
        
4. Assign the __Owner__ role to the service principal using the __Object ID__ value returned previously. You must also use the __subscription ID__ you obtained earlier.
    
        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Owner -c /subscriptions/{SubscriptionID}/
        
    Once this command completes, the service principal now has Owner access to the specified subscription ID.

##Get an authentication token

1. Use the following to find the __Tenant ID__ for your subscription.

        azure account show -s <subscription ID>
        
    From the data returned, find the __Tenant ID__.
    
        info:    Executing command account show
        data:    Name                        : MyAzureAccount
        data:    ID                          : 45a1014d-0f27-25d2-b838-b8f373d6d52e
        data:    State                       : Enabled
        data:    Tenant ID                   : 22f988bf-56f1-41af-91ab-3d7cd011db47
        data:    Is Default                  : true
        data:    Environment                 : AzureCloud
        data:    Has Certificate             : No
        data:    Has Access Token            : Yes
        data:    User name                   : myname@contoso.org
        data:    
        info:    account show command OK

2. Generate a new token using the Azure REST API.

        curl -X "POST" "https://login.microsoftonline.com/TenantID/oauth2/token" \
        -H "Cookie: flight-uxoptin=true; stsservicecookie=ests; x-ms-gateway-slice=productionb; stsservicecookie=ests" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        --data-urlencode "client_id=AppID" \
        --data-urlencode "grant_type=client_credentials" \
        --data-urlencode "client_secret=password" \
        --data-urlencode "resource=https://management.azure.com/"
    
    Replace __TenantID__, __AppID__, and __password__ with the values obtained or used previously.

    If this request is successful, you will receive a 200 series response and the response body will contain a JSON document.

    The JSON document returned by this request will contain an element named __access_token__; the value of this element is the access token you must use to authentication the requests used in the next sections of this document.
    
        {
            "token_type":"Bearer",
            "expires_in":"3599",
            "expires_on":"1463409994",
            "not_before":"1463406094",
            "resource":"https://management.azure.com/","access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWoNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI2Ny8iLCJpYXQiOjE0NjM0MDYwOTQsIm5iZiI6MTQ2MzQwNjA5NCwiZXhwIjoxNDYzNDA5OTk5LCJhcHBpZCI6IjBlYzcyMzM0LTZkMDMtNDhmYi04OWU1LTU2NTJiODBiZDliYiIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJvaWQiOiJlNjgxZTZiMi1mZThkLTRkZGUtYjZiMS0xNjAyZDQyNWQzOWYiLCJzdWIiOiJlNjgxZTZiMi1mZThkLTRkZGUtYjZiMS0xNjAyZDQyNWQzOWYiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ2ZXIiOiIxLjAifQ.nJVERbeDHLGHn7ZsbVGBJyHOu2PYhG5dji6F63gu8XN2Cvol3J1HO1uB4H3nCSt9DTu_jMHqAur_NNyobgNM21GojbEZAvd0I9NY0UDumBEvDZfMKneqp7a_cgAU7IYRcTPneSxbD6wo-8gIgfN9KDql98b0uEzixIVIWra2Q1bUUYETYqyaJNdS4RUmlJKNNpENllAyHQLv7hXnap1IuzP-f5CNIbbj9UgXxLiOtW5JhUAwWLZ3-WMhNRpUO2SIB7W7tQ0AbjXw3aUYr7el066J51z5tC1AK9UC-mD_fO_HUP6ZmPzu5gLA6DxkIIYP3grPnRVoUDltHQvwgONDOw"
        }

##Create a resource group

Use the following to create a new resource group. You must create the group first before you can create the resources such as the HDInsight cluster. 

* Replace __SubscriptionID__ with the subscription ID received while creating the service principal.
* Replace __AccessToken__ with the access token received in the previous step.
* Replace __DataCenterLocation__ with the data center you wish to create the resource group, and resources, in. For example, 'South Central US'. 
* Replace __ResourceGroupName__ with the name you wish to use for this group:

```
curl -X "PUT" "https://management.azure.com/subscriptions/SubscriptionID/resourcegroups/ResourceGroupName?api-version=2015-01-01" \
    -H "Authorization: Bearer AccessToken" \
    -H "Content-Type: application/json" \
    -d $'{
"location": "DataCenterLocation"
}'
```

If this request is successful, you will receive a 200 series response and the response body will contain a JSON document containing information about the group. The `"provisioningState"` element will contain a value of `"Succeeded"`.

##Create a deployment

Use the following to deploy the cluster configuration (template and parameter values,) to the resource group.

* Replace __SubscriptionID__ and __AccessToken__ with the values used previously. 
* Replace __ResourceGroupName__ with the resource group name you created in the previous section.
* Replace __DeploymentName__ with the name you wish to use for this deployment.

```
curl -X "PUT" "https://management.azure.com/subscriptions/SubscriptionID/resourcegroups/ResourceGroupName/providers/microsoft.resources/deployments/DeploymentName?api-version=2015-01-01" \
-H "Authorization: Bearer AccessToken" \
-H "Content-Type: application/json" \
-d "{set your body string to the template and parameters}"
```

> [AZURE.NOTE] If you have saved the JSON document containing the template and parameters to a file, you can use the following instead of `-d "{ template and parameters}"`:
>
> `--data-binary "@/path/to/file.json"`

If this request is successful, you will receive a 200 series response and the response body will contain a JSON document containing information about the deployment operation.

> [AZURE.IMPORTANT] Note that the deployment has been submitted, but has not completed at this time. It can take several minutes, usually around 15, for the deployment to complete.

##Check the status of a deployment

To check the status of the deployment, use the following:

* Replace __SubscriptionID__ and __AccessToken__ with the values used previously. 
* Replace __ResourceGroupName__ with the resource group name you created in the previous section.

```
curl -X "GET" "https://management.azure.com/subscriptions/SubscriptionID/resourcegroups/ResourceGroupName/providers/microsoft.resources/deployments/DeploymentName?api-version=2015-01-01" \
-H "Authorization: Bearer AccessToken" \
-H "Content-Type: application/json"
```

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
