---
title: #Required; page title is displayed in search results. Include the brand.
description: #Required; article description that is displayed in search results. 
author: #Required; your GitHub user alias, with correct capitalization.
ms.author: #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Quickstart: Deploy Azure Arc-enable data services - indirectly connected mode - Azure CLI

## What is Azure Arc?
Azure Arc is Microsoft’s solution for running your Azure data services on-premises, at the edge and in public clouds via Kubernetes. Customers can deploy SQL Managed Instance and PostgreSQL Hyperscale data services with Azure Arc. The benefits of using Azure Arc include staying current with constant service patches, elastic scale, self-service provisioning, unified management and support for disconnected mode.  

In today’s tutorial, we will be going through how to get started with Azure Arc-enabled Data Services for Indirectly Connected Mode with the Azure CLI.


## Install client tools

First, it is essential to install the [client tools](install-client-tools.md) needed on your machine. For the purpose of this guide, you
* Azure Data Studio
* the Azure Arc extension for Azure Data Studio
* Kubernetes CLI
* Azure CLI 
* arcdata extension for Azure CLI.


## Set metrics and logs

Additionally, using the Azure CLI, be sure to set the credentials for Grafana and Kibana logs metrics tools with the following command:

```console
export AZDATA_LOGSUI_USERNAME=<username for Kibana dashboard>
export AZDATA_LOGSUI_PASSWORD=<password for Kibana dashboard>
export AZDATA_METRICSUI_USERNAME=<username for Grafana dashboard>
export AZDATA_METRICSUI_PASSWORD=<password for Grafana dashboard>
```

## Access your Kubernetes cluster

After installing the client tools, we need access to a Kubernetes cluster. You can create  Kubernetes cluster with the [Azure CLI]( create-aks-cluster-data-controller.md), or you can follow the steps below to create the cluster in the Azure portal.  

As can be seen below, we first start by linking our subscription and resource group. After this, we provide a name for the cluster, region, availability zones, Kubernetes version, node size, scale method and node count. All these parameters are used for the configuration of the AKS cluster and then we can review and create it.


 


You will know that the cluster is created once the Azure Portal tells you that your deployment is complete as can be seen below.

 



### Connect to the cluster

After creating the cluster, it is essential to connect to the cluster through the Azure CLI withm the following command:

```azurecli
az aks get-credentials --resource-group <resource_group_name> --name <cluster_name>
```

      You should see the following appear via the command line after completing that step:


```output 
```

To confirm that your cluster is running, you can use the following command with the Azure CLI: kubectl get nodes

## Connect cluster to Azure

Now that the cluster is running, we need to connect our cluster to Azure. This can be done through the Azure CLI command: 

```azurecli
az connectedk8s connect --name <cluster_name> --resource-group <resource_group_name>
```

To validate this, we can see the shadow object created in the Azure Portal now under our resources section. We have a Kubernetes Service and a Kubernetes – Azure Arc service both ready to go as can be seen below. 

 


## Create the data controller

Now that our cluster is up and running, we are ready to create the data controller in indirectly connected mode.

The CLI command to create the data controller is: 

```azurecli
az arcdata dc create --profile-name azure-arc-aks-premium-storage --k8s-namespace <namespace> --name arc --azure-subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect --use-k8s
```


## Create Azure Arc-enabled SQL Managed Instance

Now, we can create the Azure MI for indirectly connected mode with the following command: 

```azurecli
az sql mi-arc create -n <instanceName> --k8s-namespace <namespace> --use-k8s 
```

## Connect to managed instance on Azure Data Studio

Now, we are finally ready to view our Azure MI on Azure Data Studio (ADS). 

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a quickstart article.
See the [quickstart guidance](contribute-how-to-mvc-quickstart.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Starts with "Quickstart: " Make the first word following "Quickstart:" a 
verb. Identify both the technology/service and the language or framework, if applicable.
-->

# Quickstart: <do something with X>

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental “why would I want to know this?” question. Keep it short.
-->

[Add your introductory paragraph]

<!-- 3. Create a free trial account 
Required if a free trial account exists. Include a link to a free trial before the 
first H2, if one exists. You can find listed examples in [Write quickstart]
(contribute-how-to-mvc-quickstart.md)
-->

If you don’t have a <service> subscription, create a free trial account...

<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this quickstart.
-->

## Prerequisites

- <!-- An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F). -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->

<!-- 5. Open Azure Cloud Shell
Optional. Only include the Cloud Shell section if ALL commands can be run in the cloud shell.
-->

## Open Azure Cloud Shell

<!-- [!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)] -->

<!-- 6. H2s
Required. Prescriptively guide the customer through an end-to-end procedure. Avoid 
linking off to other content - include whatever the customer needs to complete the scenario in the article.
-->

## [Section 1 heading]
<!-- Introduction paragraph -->

1. Sign in to the [<service> portal](url).
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 7. Clean up resources
Required. If resources were created during the quickstart. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 8. Next steps
Required: A single link in the blue box format. Point to the next logical quickstart 
or tutorial in a series, or, if there are no other quickstarts or tutorials, to some 
other cool thing the customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-quickstart.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->