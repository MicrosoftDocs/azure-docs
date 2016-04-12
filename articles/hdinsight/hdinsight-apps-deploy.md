<properties
   	pageTitle="Package and deploy HDInsight applications | Microsoft Azure"
   	description="Learn how to package and deploy HDInsight applications."
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
   	ms.date="04/12/2016"
   	ms.author="jgao"/>

# Package and deploy HDInsight applications

Azure HDInsight makes it easy for you to deploy Hadoop applications to HDInsight clusters. HDInsight Application deployment first creates a virtual machine called **edgenode** in the same virtual network as the cluster, and then utilizes HDInsight [Script Action](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster) to deploy HDInsight applications to the edgenode. The centerpiece for deploying an HDInsight application is configuring an ARM template.  In this article, you will learn how to develop ARM templates for deploying HDInsight applications, and use the ARM templates to deploy the applications.

Other HDInsight application related articles:

- [Install HDInsight applications](hdinsight-apps-install-applications.md): learn how to deploy a published HDInsight application from the Azure portal.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an un-published HDInsight application to HDInsight.


## Prerequisites

- HDInsight cluster: HDInsight applications can only be installed on existing HDInsight clusters.  To create one, see [Create clusters](hdinsight-hadoop-linux-tutorial-get-started.md#create-cluster).
- Knowledge of ARM template: See [Azure Resource Manager overview](../resource-group-overview.md), [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

## The architecture

Because the edgenode resides in the same virtual network as the Hadoop cluster in HDInsight, the applications can communicate with the Hadoop cluster in HDInsight freely. 
HDInsight applications allow you to define HTTP routes (HTTP endpoints) that will be internet addressable. This leverages HDInsight's secure HTTP gateway as a reverse proxy and provides SSL and Authorization for free to the application. 

[jgao: insert the architecture diagram here]

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

>[AZURE.NOTE] The uninstall feature will be released later.

    "installScriptActions": [
        {
            "name": "hue-install_v0",
            "uri": "https://hditutorialdata.blob.core.windows.net/hdinsightapps/Hue-install_v0.sh",
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


## Publish application (Feature pending Matthew Hicks)


## Install applications

After you have completed your ARM template, you can deploy the application using one of the following methods:

- Azure portal: See a sample at [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md).
- Azure CLI: See [Use the Azure CLI for Mac, Linux, and Windows with Azure Resource Manager](../xplat-cli-azure-resource-manager.md#use-resource-group-templates).
- Azure PowerShell: See [Using Azure PowerShell with Azure Resource Manager](../powershell-azure-resource-manager.md#deploy-the-template)

## Uninstall applications

This feature will be released soon.

## Next steps

- [Install HDInsight applications](hdinsight-apps-install-applications.md): learn how to deploy a published HDInsight application from the Azure portal.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an un-published HDInsight application to HDInsight.
