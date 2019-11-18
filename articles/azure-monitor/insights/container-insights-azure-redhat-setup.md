---
title: Configure Azure RedHat OpenShift clusters with Azure Monitor for containers | Microsoft Docs
description: This article describes how you can configure Azure Monitor for containers to monitor Kubernetes clusters hosted on Azure RedHat OpenShift.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 11/18/2019
---

# Configure Azure RedHat OpenShift clusters with Azure Monitor for containers

Azure Monitor for containers provides rich monitoring experience for the Azure Kubernetes Service (AKS) and AKS Engine clusters hosted in Azure. This article describes how to enable monitoring of Kubernetes clusters hosted on [Azure RedHat OpenShift](../../openshift/intro-openshift.md) to achieve a similar monitoring experience.

Azure Monitor for containers can be enabled for new, or one or more existing deployments of Azure RedHat Openshift using the following supported methods:

- For an existing cluster rom the Azure portal or Azure CLI
- For a new cluster using Azure CLI 

## Prerequisites

- To enable and access the features in Azure Monitor for containers, at a minimum you need to be a member of the Azure *Contributor* role in the Azure subscription, and a member of the *Log Analytics Contributor* role of the Log Analytics workspace configured with Azure Monitor for containers.

- To view the monitoring data, you are a member of the reader role permission with the Log Analytics workspace configured with Azure Monitor for containers.

- Using the latest CLI (version 2.0.65 or above)

## Enable for a new cluster

Perform the following steps to deploy an Azure RedHat OpenShift cluster with monitoring enabled. 

1. Download the ARM template and parameter file to create a cluster with the monitoring add-on using the following commands:

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/aro/enable_monitoring_to_new_cluster/newClusterWithMonitoring.json`

    `curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/aro/enable_monitoring_to_new_cluster/newClusterWithMonitoringParam.json` 

2. Sign in to Azure 

    ```azurecli
    az login    
    ```

3. Specify the subscription of the Azure RedHat OpenShift cluster.

    ```azurecli
    az account set --subscription "Subscription Name"  
    ```
 
4. Create a resource group for your cluster if you don't already have one. For a list of Azure regions that supports OpenShift on Azure, see [Supported Regions](../../openshift/supported-resources.md#azure-regions). 

    ```azurecli
    az group create -g <clusterResourceGroup> -l <location> 
    ```

5. Edit the JSON parameter file **newClusterWithMonitoringParam.json** and update the following values:

    - *location*
    - *clusterName*
    - *aadTenantId*
    - *aadClientId*
    - *aadClientSecret* 
    - *aadCustomerAdminGroupId* 
    - *workspaceResourceId*
    - *masterNodeCount*
    - *computeNodeCount*
    - *infraNodeCount*

6. The following step deploys the cluster with monitoring enabled by using the Azure CLI. 

    ```azurecli
    az group deployment create --resource-group <ClusterResourceGroupName> --template-file ./newClusterWithMonitoring.json --parameters @./newClusterWithMonitoringParam.json 
    ```
 
    The output resembles the following:

    ```azurecli
    provisioningState       : Succeeded
    ```



To an Existing Cluster 

Monitoring addon can bel enabled either using Ux or ARM template. 

 

UX 

 

1. Navigate to https://aka.ms/azmon-containers-aro 

2. Select the Non-Monitored Clusters tab 
3. Select your ARO cluster from the list given 
4. Selecting the Azure Log Analytics Workspace, you want to use for the Monitoring 
5. Click on Enable button 

 