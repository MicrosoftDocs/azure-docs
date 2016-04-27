<properties
   	pageTitle="Define HDInsight applications | Microsoft Azure"
   	description="Learn how to define HDInsight applications to be install to a Linux-based cluster."
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
   	ms.date="04/27/2016"
   	ms.author="jgao"/>

# Define custom HDInsight applications

An HDInsight application is an application that users can install to a Linux-based HDInsight cluster. HDInsight Application deployment first creates a virtual machine referred to as *edgenode* in the same virtual network as the cluster, and then utilizes HDInsight [Script Action](hdinsight-hadoop-customize-cluster-linux.md) to deploy HDInsight applications to the edgenode. The centerpiece for deploying an HDInsight application is configuring an ARM template.  In this article, you will learn how to develop ARM templates for deploying HDInsight applications, and use the ARM templates to deploy the applications.

HDInsight applications use the “Bring Your Own License” (BYOL) model, where application provider is responsible for licensing the application to end-users, and end-users are only charged by Azure for the resources they create, such as the HDInsight cluster and its VMs/nodes. At this time, billing for the application itself is not done through Azure.

Other HDInsight application related articles:

- [Install HDInsight applications](hdinsight-apps-install-applications.md): learn how to deploy a published HDInsight application from the Azure portal.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an un-published HDInsight application to HDInsight.

## Prerequisites

- HDInsight cluster: If you choose to install applications to an existing HDInsight cluster, you will need create a cluster first. To create one, see [Create clusters](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster).
- Knowledge of ARM template: See [Azure Resource Manager overview](../resource-group-overview.md), [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

## The architecture

Because the edgenode resides in the same virtual network as the Hadoop cluster in HDInsight, the applications can communicate with the Hadoop cluster in HDInsight freely. 
HDInsight applications allow you to define HTTP routes (HTTP endpoints) that will be internet addressable. This leverages HDInsight's secure HTTP gateway as a reverse proxy and provides SSL and authorization for free to the applications. 

## Configure ARM templates

An HDInsight Application ARM templates is composed of 3 parts:

- [role](#role)
- [script actions](#script-action)
- [HTTP endpoints](#http-endpoint)

### <a id="role"></a>The role

The role definition of an HDInsight application is fixed to a single role named *edgenode*, and a single instance. You only need to configure vmSize in the role definition.

    "computeProfile": {
        "roles": [
            {
                "name": "edgenode",
                "targetInstanceCount": 1,
                "hardwareProfile": {
                    "vmSize": "Standard_D3"
                }
            }
        ]
    },

|Property name|Description|
|-------------|-----------|
|vmSize|The size of the virtual machine (the edgenode) to deploy for your application. See [Sizes for virtual machines in Azure](../virtual-machines/virtual-machines-windows-sizes.md).|

### <a id="script-actions"></a>Script actions

Each application has two types of script actions: [install](#install-applications) and [uninstall](#uninstall-applications). Install script actions are run when the application is added to a cluster and uninstall will be run if the application is removed from the cluster. Install and uninstall script actions have the same format. At least one install script action is required. 

>[AZURE.NOTE] The uninstall feature will be released soon.

    "installScriptActions": [
        {
            "name": "hue-install_v0",
            "uri": "https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/Hue/scripts/Hue-install_v0.sh",
            "roles": ["edgenode"],
            "parameters":""
        }
    ],
    "uninstallScriptActions": [],

|Property name|Description|
|-------------|-----------|
|name|Required. Script action name must be unique to a cluster.| 
|uri|Required. The publicly accessible HTTP endpoint the script can be downloaded from.|
|roles|	Required. The roles to run the script on. Valid values are: headnode, workernode, zookeepernode, and edgenode. edgenode is the role hosting the application and where your application will run.|
|parameters|Optional. A string of parameters that will passed to you the script when it is run.|


### <a id="http-endpoint"></a>HTTP endpoint

HTTP endpoints for HDInsight applications allow you to define HTTP routes that will be internet addressable. This leverages HDInsight's secure HTTP gateway as a reverse proxy and provides SSL and Authorization for free to the application. The maximum number of HTTP endpoints that an application can have is 5.

    "httpsEndpoints": [
        {
            "subDomainSuffix": "hue",
            "destinationPort": 8888,
            "accessModes": ["webpage"]
        },
        {
            "subDomainSuffix": "was",
            "destinationPort": 50073
        }
    ],

|Property name|Description|
|-------------|-----------|
|subDomainSuffix|Required. A 3-character alphanumeric string used to build the DNS name used to access the application. The DNS name will be of the format: <cluster name>-<subDomainSuffix>.apps.azurehdinsight.net|
|destinationPort|Required. The port to forward HTTP traffic to on the edgenode hosting your application.|
|accessModes|Optional. Metadata about the endpoint. If the endpoint hosts a webpage specify webpage as an access mode. This will enable our UX to display direct links to your application.|

Using ARM templates, you can create an ARM template which creates a cluster and installs an application on that cluster in a single deployment. Because application installation is dependent on the cluster coming up first, ARM allows you to define a depends on attribute that will orchestrate the deployment:

    {
      "name": "[concat(parameters('clusterName'),'/hue')]",
      "type": "Microsoft.HDInsight/clusters/applications",
      "apiVersion": "[variables('clusterApiVersion')]",
      "dependsOn": ["[parameters('clusterName')]"],
      "properties": {
          "computeProfile": {
            ...
          },
          "installScriptActions": [
            ...
          ],
          "uninstallScriptActions": [ ],
          "httpsEndpoints": [
            ...
          ],
          "applicationType": "CustomApplication"
      }
    }

See [Appendix A](#appendix-a) for a complete sample template for installing Hue on an existing HDInsight cluster.  See [Appendix B](#appendix-b) for a complete sample template for creating an HDInsight cluster and installing Hue on the cluster. 


## Publish application 

[jgao: to be provided by Travis and Matthew]


## Install applications

After you have completed your ARM template, you can deploy the application using one of the following methods:

- Azure portal: Browse to [https://ms.portal.azure.com/#create/Microsoft.Template](https://ms.portal.azure.com/#create/Microsoft.Template), and then paste your template  See samples in [Appendix A](appendix-a) and [Appendix B](appendix-b).
- Azure CLI: See [Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](../xplat-cli-azure-resource-manager.md#use-resource-group-templates).
- Azure PowerShell: See [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md#deploy-the-template)

## Uninstall applications

This feature will be released soon.

## Next steps

- [Install HDInsight applications](hdinsight-apps-install-applications.md): learn how to deploy a published HDInsight application from the Azure portal.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an un-published HDInsight application to HDInsight.
- [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
- [Create Linux-based Hadoop clusters in HDInsight using ARM templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call ARM templates to create HDInsight clusters.

##Appendix A 

Use this ARM template sample to install Hue on an existing HDInsight cluster. See [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md) for a tutorial about calling the ARM template:

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "clusterName": {
            "type": "string"
            }
        },
        "variables": {
            "clusterApiVersion": "2015-03-01-preview"
        },
        "resources": [
            {
            "name": "[concat(parameters('clusterName'),'/hue')]",
            "type": "Microsoft.HDInsight/clusters/applications",
            "apiVersion": "[variables('clusterApiVersion')]",
            "properties": {
                "computeProfile": {
                "roles": [
                    {
                    "name": "edgenode",
                    "targetInstanceCount": 1,
                    "hardwareProfile": {
                        "vmSize": "Standard_D3"
                    }
                    }
                ]
                },
                "installScriptActions": [
                {
                    "name": "hue-install",
                    "uri": "https://hditutorialdata.blob.core.windows.net/hdinsightapps/Hue-install_v0.sh",
                    "roles": [ "edgenode" ],
                    "parameters": "[parameters('clusterName')]"
                }
                ],
                "uninstallScriptActions": [ ],
                "httpsEndpoints": [
                {
                    "subDomainSuffix": "hue",
                    "destinationPort": 8888,
                    "accessModes": [ "webpage" ]
                },
                {
                    "subDomainSuffix": "was",
                    "destinationPort": 50073
                }
                ],
                "applicationType": "CustomApplication"
            }
            }
        ]
    }
    
##Appendix B 

Use this ARM template sample to create an HDInsight cluster and then install Hue on the cluster. See [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md) for a tutorial about calling the ARM template:

    {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
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
      },
      "location": {
        "type": "string",
        "defaultValue": "East US",
        "allowedValues": [
          "East US",
          "East US 2",
          "North Central US",
          "South Central US",
          "West US",
          "North Europe",
          "West Europe",
          "East Asia",
          "Southeast Asia",
          "Japan East",
          "Japan West",
          "Australia East",
          "Australia Southeast"
        ],
        "metadata": {
          "description": "The location where all azure resources will be deployed."
        }
      },
      "clusterType": {
        "type": "string",
        "defaultValue": "hadoop",
        "allowedValues": [
          "hadoop",
          "hbase",
          "storm",
          "spark"
        ],
        "metadata": {
          "description": "The type of the HDInsight cluster to create."
        }
      },
      "clusterWorkerNodeCount": {
        "type": "int",
        "defaultValue": 2,
        "metadata": {
          "description": "The number of nodes in the HDInsight cluster."
        }
      }
    },
    "variables": {
      "defaultApiVersion": "2015-05-01-preview",
      "clusterApiVersion": "2015-03-01-preview",
      "clusterStorageAccountName": "[concat(parameters('clusterName'),'store')]"
    },
    "resources": [
      {
        "name": "[variables('clusterStorageAccountName')]",
        "type": "Microsoft.Storage/storageAccounts",
        "location": "[parameters('location')]",
        "apiVersion": "[variables('defaultApiVersion')]",
        "dependsOn": [ ],
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
        "dependsOn": [ "[concat('Microsoft.Storage/storageAccounts/',variables('clusterStorageAccountName'))]" ],
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
            "storageaccounts": [
              {
                "name": "[concat(variables('clusterStorageAccountName'),'.blob.core.windows.net')]",
                "isDefault": true,
                "container": "[parameters('clusterName')]",
                "key": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('clusterStorageAccountName')), variables('defaultApiVersion')).key1]"
              }
            ]
          },
          "computeProfile": {
            "roles": [
              {
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
              }
            ]
          }
        }
      },

      {
        "name": "[concat(parameters('clusterName'),'/hue')]",
        "type": "Microsoft.HDInsight/clusters/applications",
        "apiVersion": "[variables('clusterApiVersion')]",
        "dependsOn": ["[parameters('clusterName')]"],
        "properties": {
          "computeProfile": {
            "roles": [
              {
                "name": "edgenode",
                "targetInstanceCount": 1,
                "hardwareProfile": {
                  "vmSize": "Standard_D3"
                }
              }
            ]
          },
          "installScriptActions": [
            {
              "name": "hue-install",
              "uri": "https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/Hue/scripts/Hue-install_v0.sh",
              "roles": [ "edgenode" ],
              "parameters": "[parameters('clusterName')]"
            }
          ],
          "uninstallScriptActions": [ ],
          "httpsEndpoints": [
            {
              "subDomainSuffix": "hue",
              "destinationPort": 8888,
              "accessModes": [ "webpage" ]
            },
            {
              "subDomainSuffix": "was",
              "destinationPort": 50073
            }
          ],
          "applicationType": "CustomApplication"
        }
      }
    ],
    "outputs": {
      "cluster": {
        "type": "object",
        "value": "[reference(resourceId('Microsoft.HDInsight/clusters',parameters('clusterName')))]"
      }
    }
  }
