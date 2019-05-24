---
title: Create a Service Fabric cluster running Windows in Azure | Microsoft Docs
description: In this tutorial, you learn how to deploy a Windows Service Fabric cluster into an Azure virtual network and network security group by using PowerShell.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/13/2019
ms.author: aljo
ms.custom: mvc
---
# Tutorial: Deploy a Service Fabric cluster running Windows into an Azure virtual network

This tutorial is part one of a series. You learn how to deploy an Azure Service Fabric cluster running Windows into an [Azure virtual network](../virtual-network/virtual-networks-overview.md) and [network security group](../virtual-network/virtual-networks-nsg.md) by using PowerShell and a template. When you're finished, you have a cluster running in the cloud to which you can deploy applications. To create a Linux cluster that uses the Azure CLI, see [Create a secure Linux cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md).

This tutorial describes a production scenario. If you want to create a smaller cluster for testing purposes, see [Create a test cluster](./scripts/service-fabric-powershell-create-secure-cluster-cert.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a VNET in Azure using PowerShell
> * Create a key vault and upload a certificate
> * Setup Azure Active Directory authentication
> * Configure diagnostics collection
> * Set up the EventStore service
> * Set up Azure Monitor logs
> * Create a secure Service Fabric cluster in Azure PowerShell
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using PowerShell
> * Remove a cluster

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Create a secure cluster on Azure
> * [Monitor a cluster](service-fabric-tutorial-monitor-cluster.md)
> * [Scale a cluster in or out](service-fabric-tutorial-scale-cluster.md)
> * [Upgrade the runtime of a cluster](service-fabric-tutorial-upgrade-cluster.md)
> * [Delete a cluster](service-fabric-tutorial-delete-cluster.md)


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md).
* Install [Azure Powershell](https://docs.microsoft.com/powershell/azure/install-Az-ps).
* Review the key concepts of [Azure clusters](service-fabric-azure-clusters-overview.md).
* [Plan and prepare](service-fabric-cluster-azure-deployment-preparation.md) for a production cluster deployment.

The following procedures create a seven-node Service Fabric cluster. Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to calculate cost incurred by running a Service Fabric cluster in Azure.

## Download and explore the template

Download the following Azure Resource Manager template files:

* [azuredeploy.json][template]
* [azuredeploy.parameters.json][parameters]

This template deploys a secure cluster of seven virtual machines and three node types into a virtual network and a network security group.  Other sample templates can be found on [GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). The [azuredeploy.json][template] deploys a number of resources, including the following.

### Service Fabric cluster

In the **Microsoft.ServiceFabric/clusters** resource, a Windows cluster is configured with the following characteristics:

* Three node types.
* Five nodes in the primary node type (configurable in the template parameters), and one node in each of the other two node types.
* OS: Windows Server 2016 Datacenter with Containers (configurable in the template parameters).
* Certificate secured (configurable in the template parameters).
* [Reverse proxy](service-fabric-reverseproxy.md) is enabled.
* [DNS service](service-fabric-dnsservice.md) is enabled.
* [Durability level](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) of Bronze (configurable in the template parameters).
* [Reliability level](service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster) of Silver (configurable in the template parameters).
* Client connection endpoint: 19000 (configurable in the template parameters).
* HTTP gateway endpoint: 19080 (configurable in the template parameters).

### Azure Load Balancer

In the **Microsoft.Network/loadBalancers** resource, a load balancer is configured. Probes and rules are set up for the following ports:

* Client connection endpoint: 19000
* HTTP gateway endpoint: 19080
* Application port: 80
* Application port: 443
* Service Fabric reverse proxy: 19081

If other application ports are needed, you'll need to adjust the **Microsoft.Network/loadBalancers** resource and the **Microsoft.Network/networkSecurityGroups** resource to allow the traffic in.

### Virtual network, subnet, and network security group

The names of the virtual network, subnet, and network security group are declared in the template parameters. Address spaces of the virtual network and subnet are also declared in the template parameters and configured in the **Microsoft.Network/virtualNetworks** resource:

* Virtual network address space: 172.16.0.0/20
* Service Fabric subnet address space: 172.16.2.0/23

The following inbound traffic rules are enabled in the **Microsoft.Network/networkSecurityGroups** resource. You can change the port values by changing the template variables.

* ClientConnectionEndpoint (TCP): 19000
* HttpGatewayEndpoint (HTTP/TCP): 19080
* SMB: 445
* Internodecommunication: 1025, 1026, 1027
* Ephemeral port range: 49152 to 65534 (need a minimum of 256 ports).
* Ports for application use: 80 and 443
* Application port range: 49152 to 65534 (used for service to service communication. Other ports aren't opened on the Load balancer).
* Block all other ports

If other application ports are needed, you'll need to adjust the **Microsoft.Network/loadBalancers** resource and the **Microsoft.Network/networkSecurityGroups** resource to allow the traffic in.

### Windows Defender
By default, the [Windows Defender antivirus program](/windows/security/threat-protection/windows-defender-antivirus/windows-defender-antivirus-on-windows-server-2016) is installed and functional on Windows Server 2016. The user interface is installed by default on some SKUs, but isn't required. For each node type/VM scale set declared in the template, the [Azure VM Antimalware extension](/azure/virtual-machines/extensions/iaas-antimalware-windows) is used to exclude the Service Fabric directories and processes:

```json
{
"name": "[concat('VMIaaSAntimalware','_vmNodeType0Name')]",
"properties": {
        "publisher": "Microsoft.Azure.Security",
        "type": "IaaSAntimalware",
        "typeHandlerVersion": "1.5",
        "settings": {
        "AntimalwareEnabled": "true",
        "Exclusions": {
                "Paths": "D:\\SvcFab;D:\\SvcFab\\Log;C:\\Program Files\\Microsoft Service Fabric",
                "Processes": "Fabric.exe;FabricHost.exe;FabricInstallerService.exe;FabricSetup.exe;FabricDeployer.exe;ImageBuilder.exe;FabricGateway.exe;FabricDCA.exe;FabricFAS.exe;FabricUOS.exe;FabricRM.exe;FileStoreService.exe"
        },
        "RealtimeProtectionEnabled": "true",
        "ScheduledScanSettings": {
                "isEnabled": "true",
                "scanType": "Quick",
                "day": "7",
                "time": "120"
        }
        },
        "protectedSettings": null
}
}
```

## Set template parameters

The [azuredeploy.parameters.json][parameters] parameters file declares many values used to deploy the cluster and associated resources. The following are parameters to modify for your deployment:

**Parameter** | **Example value** | **Notes** 
|---|---|---|
|adminUserName|vmadmin| Admin username for the cluster VMs. [Username requirements for VM](https://docs.microsoft.com/azure/virtual-machines/windows/faq#what-are-the-username-requirements-when-creating-a-vm). |
|adminPassword|Password#1234| Admin password for the cluster VMs. [Password requirements for VM](https://docs.microsoft.com/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm).|
|clusterName|mysfcluster123| Name of the cluster. Can contain letters and numbers only. Length can be between 3 and 23 characters.|
|location|southcentralus| Location of the cluster. |
|certificateThumbprint|| <p>Value should be empty if creating a self-signed certificate or providing a certificate file.</p><p>To use an existing certificate previously uploaded to a key vault, fill in the certificate SHA1 thumbprint value. For example, "6190390162C988701DB5676EB81083EA608DCCF3".</p> |
|certificateUrlValue|| <p>Value should be empty if creating a self-signed certificate or providing a certificate file. </p><p>To use an existing certificate previously uploaded to a key vault, fill in the certificate URL. For example, "https:\//mykeyvault.vault.azure.net:443/secrets/mycertificate/02bea722c9ef4009a76c5052bcbf8346".</p>|
|sourceVaultValue||<p>Value should be empty if creating a self-signed certificate or providing a certificate file.</p><p>To use an existing certificate previously uploaded to a key vault, fill in the source vault value. For example, "/subscriptions/333cc2c84-12fa-5778-bd71-c71c07bf873f/resourceGroups/MyTestRG/providers/Microsoft.KeyVault/vaults/MYKEYVAULT".</p>|

## Set up Azure Active Directory client authentication
For Service Fabric clusters deployed in a public network hosted on Azure, the recommendation for client-to-node mutual authentication is:
* Use Azure Active Directory for client identity.
* Use a certificate for server identity and SSL encryption of HTTP communication.

Setting up Azure Active Directory (Azure AD) to authenticate clients for a Service Fabric cluster must be done before [creating the cluster](#createvaultandcert). Azure AD enables organizations (known as tenants) to manage user access to applications. 

A Service Fabric cluster offers several entry points to its management functionality, including the web-based [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) and [Visual Studio](service-fabric-manage-application-in-visual-studio.md). As a result, you create two Azure AD applications to control access to the cluster: one web application and one native application.  After the applications are created, you assign users to read-only and admin roles.

> [!NOTE]
> You must complete the following steps before you create the cluster. Because the scripts expect cluster names and endpoints, the values should be planned and not values that you have already created.

In this article, we assume that you've already created a tenant. If you haven't, start by reading [How to get an Azure Active Directory tenant](../active-directory/develop/quickstart-create-new-tenant.md).

To simplify steps involved in configuring Azure AD with a Service Fabric cluster, we've created a set of Windows PowerShell scripts. [Download the scripts](https://github.com/robotechredmond/Azure-PowerShell-Snippets/tree/master/MicrosoftAzureServiceFabric-AADHelpers/AADTool) to your computer.

### Create Azure AD applications and assign users to roles
Create two Azure AD applications to control access to the cluster: one web application and one native application. After you've created the applications to represent your cluster, assign your users to the [roles supported by Service Fabric](service-fabric-cluster-security-roles.md): read-only and admin.

Run `SetupApplications.ps1`, and provide the tenant ID, cluster name, and web application reply URL as parameters. Specify usernames and passwords for the users. For example:

```powershell
$Configobj = .\SetupApplications.ps1 -TenantId '<MyTenantID>' -ClusterName 'mysfcluster123' -WebApplicationReplyUrl 'https://mysfcluster123.eastus.cloudapp.azure.com:19080/Explorer/index.html' -AddResourceAccess
.\SetupUser.ps1 -ConfigObj $Configobj -UserName 'TestUser' -Password 'P@ssword!123'
.\SetupUser.ps1 -ConfigObj $Configobj -UserName 'TestAdmin' -Password 'P@ssword!123' -IsAdmin
```

> [!NOTE]
> For national clouds (for example Azure Government, Azure China, Azure Germany), specify the `-Location` parameter.

You can find your *TenantId*, or directory ID, in the [Azure portal](https://portal.azure.com). Select **Azure Active Directory** > **Properties** and copy the **Directory ID** value.

*ClusterName* is used to prefix the Azure AD applications that are created by the script. It doesn't need to exactly match the actual cluster name. It only makes it easier to map Azure AD artifacts to the Service Fabric cluster in use.

*WebApplicationReplyUrl* is the default endpoint that Azure AD returns to your users after they finish signing in. Set this endpoint as the Service Fabric Explorer endpoint for your cluster, which by default is:

https://&lt;cluster_domain&gt;:19080/Explorer

You're prompted to sign in to an account that has administrative privileges for the Azure AD tenant. After you sign in, the script creates the web and native applications to represent your Service Fabric cluster. In the tenant's applications in the [Azure portal](https://portal.azure.com), you should see two new entries:

   * *ClusterName*\_Cluster
   * *ClusterName*\_Client

The script prints the JSON required by the Resource Manager template when you create the cluster, so it's a good idea to keep the PowerShell window open.

```json
"azureActiveDirectory": {
  "tenantId":"<guid>",
  "clusterApplication":"<guid>",
  "clientApplication":"<guid>"
},
```

### Add Azure AD configuration to use Azure AD for client access
In the [azuredeploy.json][template], configure Azure AD in the **Microsoft.ServiceFabric/clusters** section. Add parameters for the tenant ID, cluster application ID, and client application ID.  

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
  "contentVersion": "1.0.0.0",
  "parameters": {
    ...

    "aadTenantId": {
      "type": "string",
      "defaultValue": "0e3d2646-78b3-4711-b8be-74a381d9890c"
    },
    "aadClusterApplicationId": {
      "type": "string",
      "defaultValue": "cb147d34-b0b9-4e77-81d6-420fef0c4180"
    },
    "aadClientApplicationId": {
      "type": "string",
      "defaultValue": "7a8f3b37-cc40-45cc-9b8f-57b8919ea461"
    }
  },

...

{
  "apiVersion": "2018-02-01",
  "type": "Microsoft.ServiceFabric/clusters",
  "name": "[parameters('clusterName')]",
  ...
  "properties": {
    ...
    "azureActiveDirectory": {
      "tenantId": "[parameters('aadTenantId')]",
      "clusterApplication": "[parameters('aadClusterApplicationId')]",
      "clientApplication": "[parameters('aadClientApplicationId')]"
    },
    ...
  }
}
```

Add the parameter values in the [azuredeploy.parameters.json][parameters] parameters file. For example:

```json
"aadTenantId": {
"value": "0e3d2646-78b3-4711-b8be-74a381d9890c"
},
"aadClusterApplicationId": {
"value": "cb147d34-b0b9-4e77-81d6-420fef0c4180"
},
"aadClientApplicationId": {
"value": "7a8f3b37-cc40-45cc-9b8f-57b8919ea461"
}
```
<a id="configurediagnostics" name="configurediagnostics_anchor"></a>

## Configure diagnostics collection on the cluster
When you're running a Service Fabric cluster, it's a good idea to collect the logs from all the nodes in a central location. Having the logs in a central location helps you analyze and troubleshoot issues in your cluster, or issues in the applications and services running in that cluster.

One way to upload and collect logs is to use the Azure Diagnostics (WAD) extension, which uploads logs to Azure Storage, and also has the option to send logs to Azure Application Insights or Event Hubs. You can also use an external process to read the events from storage and place them in an analysis platform product, such as Azure Monitor logs or another log-parsing solution.

If you are following this tutorial, diagnostics collection is already configured in the [template][template].

If you have an existing cluster that doesn't have Diagnostics deployed, you can add or update it via the cluster template. Modify the Resource Manager template that's used to create the existing cluster or download the template from the portal. Modify the template.json file by performing the following tasks:

Add a new storage resource to the resources section in the template:
```json
"resources": [
...
{
  "apiVersion": "2015-05-01-preview",
  "type": "Microsoft.Storage/storageAccounts",
  "name": "[parameters('applicationDiagnosticsStorageAccountName')]",
  "location": "[parameters('computeLocation')]",
  "sku": {
    "accountType": "[parameters('applicationDiagnosticsStorageAccountType')]"
  },
  "tags": {
    "resourceType": "Service Fabric",
    "clusterName": "[parameters('clusterName')]"
  }
},
...
]
```

Next, add parameters for the storage account name and type to the parameters section of the template. Replace the placeholder text storage account name goes here with the name of the storage account you'd like.

```json
"parameters": {
...
"applicationDiagnosticsStorageAccountType": {
    "type": "string",
    "allowedValues": [
    "Standard_LRS",
    "Standard_GRS"
    ],
    "defaultValue": "Standard_LRS",
    "metadata": {
    "description": "Replication option for the application diagnostics storage account"
    }
},
"applicationDiagnosticsStorageAccountName": {
    "type": "string",
    "defaultValue": "**STORAGE ACCOUNT NAME GOES HERE**",
    "metadata": {
    "description": "Name for the storage account that contains application diagnostics data from the cluster"
    }
},
...
}
```

Next, add the **IaaSDiagnostics** extension to the extensions array of the **VirtualMachineProfile** property of each **Microsoft.Compute/virtualMachineScaleSets** resource in the cluster.  If you're using the [sample template][template], there are three virtual machine scale sets (one for each node type in the cluster).

```json
"apiVersion": "2018-10-01",
"type": "Microsoft.Compute/virtualMachineScaleSets",
"name": "[variables('vmNodeType1Name')]",
"properties": {
    ...
    "virtualMachineProfile": {
        "extensionProfile": {
            "extensions": [
                {
                    "name": "[concat(parameters('vmNodeType0Name'),'_Microsoft.Insights.VMDiagnosticsSettings')]",
                    "properties": {
                        "type": "IaaSDiagnostics",
                        "autoUpgradeMinorVersion": true,
                        "protectedSettings": {
                        "storageAccountName": "[parameters('applicationDiagnosticsStorageAccountName')]",
                        "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('applicationDiagnosticsStorageAccountName')),'2015-05-01-preview').key1]",
                        "storageAccountEndPoint": "https://core.windows.net/"
                        },
                        "publisher": "Microsoft.Azure.Diagnostics",
                        "settings": {
                        "WadCfg": {
                            "DiagnosticMonitorConfiguration": {
                            "overallQuotaInMB": "50000",
                            "EtwProviders": {
                                "EtwEventSourceProviderConfiguration": [
                                {
                                    "provider": "Microsoft-ServiceFabric-Actors",
                                    "scheduledTransferKeywordFilter": "1",
                                    "scheduledTransferPeriod": "PT5M",
                                    "DefaultEvents": {
                                    "eventDestination": "ServiceFabricReliableActorEventTable"
                                    }
                                },
                                {
                                    "provider": "Microsoft-ServiceFabric-Services",
                                    "scheduledTransferPeriod": "PT5M",
                                    "DefaultEvents": {
                                    "eventDestination": "ServiceFabricReliableServiceEventTable"
                                    }
                                }
                                ],
                                "EtwManifestProviderConfiguration": [
                                {
                                    "provider": "cbd93bc2-71e5-4566-b3a7-595d8eeca6e8",
                                    "scheduledTransferLogLevelFilter": "Information",
                                    "scheduledTransferKeywordFilter": "4611686018427387904",
                                    "scheduledTransferPeriod": "PT5M",
                                    "DefaultEvents": {
                                    "eventDestination": "ServiceFabricSystemEventTable"
                                    }
                                }
                                ]
                            }
                            }
                        },
                        "StorageAccount": "[parameters('applicationDiagnosticsStorageAccountName')]"
                        },
                        "typeHandlerVersion": "1.5"
                    }
                }
            ...
            ]
        }
    }
}
```
<a id="configureeventstore" name="configureeventstore_anchor"></a>

## Configure the EventStore service
The EventStore service is a monitoring option in Service Fabric. EventStore provides a way to understand the state of your cluster or workloads at a given point in time. The EventStore is a stateful Service Fabric service that maintains events from the cluster. The event are exposed through the Service Fabric Explorer, REST and APIs. EventStore queries the cluster directly to get diagnostics data on any entity in your cluster and should be used to help:

* Diagnose issues in development or testing, or where you might be using a monitoring pipeline
* Confirm that management actions you are taking on your cluster are being processed correctly
* Get a "snapshot" of how Service Fabric is interacting with a particular entity



To enable the EventStore service on your cluster, add the following to the **fabricSettings** property of the **Microsoft.ServiceFabric/clusters** resource:

```json
"apiVersion": "2018-02-01",
"type": "Microsoft.ServiceFabric/clusters",
"name": "[parameters('clusterName')]",
"properties": {
    ...
    "fabricSettings": [
        ...
        {
            "name": "EventStoreService",
            "parameters": [
                {
                "name": "TargetReplicaSetSize",
                "value": "3"
                },
                {
                "name": "MinReplicaSetSize",
                "value": "1"
                }
            ]
        }
    ]
}
```
<a id="configureloganalytics" name="configureloganalytics_anchor"></a>

## Set up Azure Monitor logs for the cluster

Azure Monitor logs is our recommendation to monitor cluster level events. To set up Azure Monitor logs to monitor your cluster, you need to have [diagnostics enabled to view cluster-level events](#configure-diagnostics-collection-on-the-cluster).  

The workspace needs to be connected to the diagnostics data coming from your cluster.  This log data is stored in the *applicationDiagnosticsStorageAccountName* storage account, in the WADServiceFabric*EventTable, WADWindowsEventLogsTable, and WADETWEventTable tables.

Add the Azure Log Analytics workspace and add the solution to the workspace:

```json
"resources": [
    ...
    {
        "apiVersion": "2015-11-01-preview",
        "location": "[parameters('omsRegion')]",
        "name": "[parameters('omsWorkspacename')]",
        "type": "Microsoft.OperationalInsights/workspaces",
        "properties": {
            "sku": {
                "name": "Free"
            }
        },
        "resources": [
            {
                "apiVersion": "2015-11-01-preview",
                "name": "[concat(variables('applicationDiagnosticsStorageAccountName'),parameters('omsWorkspacename'))]",
                "type": "storageinsightconfigs",
                "dependsOn": [
                    "[concat('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]",
                    "[concat('Microsoft.Storage/storageAccounts/', variables('applicationDiagnosticsStorageAccountName'))]"
                ],
                "properties": {
                    "containers": [],
                    "tables": [
                        "WADServiceFabric*EventTable",
                        "WADWindowsEventLogsTable",
                        "WADETWEventTable"
                    ],
                    "storageAccount": {
                        "id": "[resourceId('Microsoft.Storage/storageaccounts/', variables('applicationDiagnosticsStorageAccountName'))]",
                        "key": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('applicationDiagnosticsStorageAccountName')),'2015-06-15').key1]"
                    }
                }
            },
            {
                "apiVersion": "2015-11-01-preview",
                "type": "datasources",
                "name": "sampleWindowsPerfCounter",
                "dependsOn": [
                    "[concat('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]"
                ],
                "kind": "WindowsPerformanceCounter",
                "properties": {
                    "objectName": "Memory",
                    "instanceName": "*",
                    "intervalSeconds": 10,
                    "counterName": "Available MBytes"
                }
            },
            {
                "apiVersion": "2015-11-01-preview",
                "type": "datasources",
                "name": "sampleWindowsPerfCounter2",
                "dependsOn": [
                    "[concat('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]"
                ],
                "kind": "WindowsPerformanceCounter",
                "properties": {
                    "objectName": "Service Fabric Service",
                    "instanceName": "*",
                    "intervalSeconds": 10,
                    "counterName": "Average milliseconds per request"
                }
            }
        ]
    },
    {
        "apiVersion": "2015-11-01-preview",
        "location": "[parameters('omsRegion')]",
        "name": "[variables('solution')]",
        "type": "Microsoft.OperationsManagement/solutions",
        "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]"
        ],
        "properties": {
            "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename'))]"
        },
        "plan": {
            "name": "[variables('solution')]",
            "publisher": "Microsoft",
            "product": "[Concat('OMSGallery/', variables('solutionName'))]",
            "promotionCode": ""
        }
    }
]
```

Next, add parameters
```json
"parameters": {
    ...
    "omsWorkspacename": {
        "type": "string",
        "defaultValue": "mysfomsworkspace",
        "metadata": {
            "description": "Name of your OMS Log Analytics Workspace"
        }
    },
    "omsRegion": {
        "type": "string",
        "defaultValue": "West Europe",
        "allowedValues": [
            "West Europe",
            "East US",
            "Southeast Asia"
        ],
        "metadata": {
            "description": "Specify the Azure Region for your OMS workspace"
        }
    }
}
```

Next, add variables:
```json
"variables": {
    ...
    "solution": "[Concat('ServiceFabric', '(', parameters('omsWorkspacename'), ')')]",
    "solutionName": "ServiceFabric"
}
```

Add the Log Analytics agent extension to each virtual machine scale set in the cluster and connect the agent to the Log Analytics workspace. This enables collecting diagnostics data about containers, applications, and performance monitoring. By adding it as an extension to the virtual machine scale set resource, Azure Resource Manager ensures that it gets installed on every node, even when scaling the cluster.

```json
"apiVersion": "2018-10-01",
"type": "Microsoft.Compute/virtualMachineScaleSets",
"name": "[variables('vmNodeType1Name')]",
"properties": {
    ...
    "virtualMachineProfile": {
        "extensionProfile": {
            "extensions": [
                {
                    "name": "[concat(variables('vmNodeType0Name'),'OMS')]",
                    "properties": {
                        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
                        "type": "MicrosoftMonitoringAgent",
                        "typeHandlerVersion": "1.0",
                        "autoUpgradeMinorVersion": true,
                        "settings": {
                            "workspaceId": "[reference(resourceId('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename')), '2015-11-01-preview').customerId]"
                        },
                        "protectedSettings": {
                            "workspaceKey": "[listKeys(resourceId('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspacename')),'2015-11-01-preview').primarySharedKey]"
                        }
                    }
                }
            ...
            ]
        }
    }
}
```

<a id="createvaultandcert" name="createvaultandcert_anchor"></a>

## Deploy the virtual network and cluster

Next, set up the network topology and deploy the Service Fabric cluster. The [azuredeploy.json][template] Resource Manager template creates a virtual network, subnet, and network security group for Service Fabric. The template also deploys a cluster with certificate security enabled. For production clusters, use a certificate from a certificate authority as the cluster certificate. A self-signed certificate can be used to secure test clusters.

The template in this article deploys a cluster that uses the certificate thumbprint to identify the cluster certificate. No two certificates can have the same thumbprint, which makes certificate management more difficult. Switching a deployed cluster from certificate thumbprints to certificate common names simplifies certificate management. To learn how to update the cluster to use certificate common names for certificate management, read [Change cluster to certificate common name management](service-fabric-cluster-change-cert-thumbprint-to-cn.md).

### Create a cluster by using an existing certificate

The following script uses the [New-AzServiceFabricCluster](/powershell/module/az.servicefabric/New-azServiceFabricCluster) cmdlet and a template to deploy a new cluster in Azure. The cmdlet creates a new key vault in Azure and uploads your certificate.

```powershell
# Variables.
$groupname = "sfclustertutorialgroup"
$clusterloc="southcentralus"  # Must match the location parameter in the template
$templatepath="C:\temp\cluster"

$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
$clustername = "mysfcluster123"  # Must match the clustername parameter in the template
$vaultname = "clusterkeyvault123"
$vaultgroupname="clusterkeyvaultgroup123"
$subname="$clustername.$clusterloc.cloudapp.azure.com"

# Sign in to your Azure account and select your subscription
Connect-AzAccount
Get-AzSubscription
Set-AzContext -SubscriptionId <guid>

# Create a new resource group for your deployment, and give it a name and a location.
New-AzResourceGroup -Name $groupname -Location $clusterloc

# Create the Service Fabric cluster.
New-AzServiceFabricCluster  -ResourceGroupName $groupname -TemplateFile "$templatepath\azuredeploy.json" `
-ParameterFile "$templatepath\azuredeploy.parameters.json" -CertificatePassword $certpwd `
-KeyVaultName $vaultname -KeyVaultResourceGroupName $vaultgroupname -CertificateFile $certpath
```

### Create a cluster by using a new, self-signed certificate

The following script uses the [New-AzServiceFabricCluster](/powershell/module/az.servicefabric/New-azServiceFabricCluster) cmdlet and a template to deploy a new cluster in Azure. The cmdlet creates a new key vault in Azure, adds a new self-signed certificate to the key vault, and downloads the certificate file locally.

```powershell
# Variables.
$groupname = "sfclustertutorialgroup"
$clusterloc="southcentralus"  # Must match the location parameter in the template
$templatepath="C:\temp\cluster"

$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
$certfolder="c:\mycertificates\"
$clustername = "mysfcluster123"
$vaultname = "clusterkeyvault123"
$vaultgroupname="clusterkeyvaultgroup123"
$subname="$clustername.$clusterloc.cloudapp.azure.com"

# Sign in to your Azure account and select your subscription
Connect-AzAccount
Get-AzSubscription
Set-AzContext -SubscriptionId <guid>

# Create a new resource group for your deployment, and give it a name and a location.
New-AzResourceGroup -Name $groupname -Location $clusterloc

# Create the Service Fabric cluster.
New-AzServiceFabricCluster  -ResourceGroupName $groupname -TemplateFile "$templatepath\azuredeploy.json" `
-ParameterFile "$templatepath\azuredeploy.parameters.json" -CertificatePassword $certpwd `
-CertificateOutputFolder $certfolder -KeyVaultName $vaultname -KeyVaultResourceGroupName $vaultgroupname -CertificateSubjectName $subname

```

## Connect to the secure cluster

Connect to the cluster by using the Service Fabric PowerShell module installed with the Service Fabric SDK.  First, install the certificate into the Personal (My) store of the current user on your computer. Run the following PowerShell command:

```powershell
$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath C:\mycertificates\mysfcluster20170531104310.pfx `
        -Password $certpwd
```

You're now ready to connect to your secure cluster.

The **Service Fabric** PowerShell module provides many cmdlets for managing Service Fabric clusters, applications, and services. Use the [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster) cmdlet to connect to the secure cluster. The certificate SHA1 thumbprint and connection endpoint details are found in the output from the previous step.

If you previously set up Azure AD client authentication, run the following command: 
```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint mysfcluster123.southcentralus.cloudapp.azure.com:19000 `
        -KeepAliveIntervalInSec 10 `
        -AzureActiveDirectory `
        -ServerCertThumbprint C4C1E541AD512B8065280292A8BA6079C3F26F10
```

If you didn't set up Azure AD client authentication, run the following command:
```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint mysfcluster123.southcentralus.cloudapp.azure.com:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -FindType FindByThumbprint -FindValue C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -StoreLocation CurrentUser -StoreName My
```

Check that you're connected and that the cluster is healthy by using the [Get-ServiceFabricClusterHealth](/powershell/module/servicefabric/get-servicefabricclusterhealth) cmdlet.

```powershell
Get-ServiceFabricClusterHealth
```

## Clean up resources

The other articles in this tutorial series use the cluster you've created. If you're not immediately moving on to the next article, you might want to [delete the cluster](service-fabric-cluster-delete.md) to avoid incurring charges.

## Next steps

Advance to the following tutorial to learn how to scale your cluster.

> [!div class="checklist"]
> * Create a VNET in Azure using PowerShell
> * Create a key vault and upload a certificate
> * Setup Azure Active Directory authentication
> * Configure diagnostics collection
> * Set up the EventStore service
> * Set up Azure Monitor logs
> * Create a secure Service Fabric cluster in Azure PowerShell
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using PowerShell
> * Remove a cluster

Next, advance to the following tutorial to learn how to monitor your cluster.
> [!div class="nextstepaction"]
> [Monitor a Cluster](service-fabric-tutorial-monitor-cluster.md)

[template]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Windows-3-NodeTypes-Secure-NSG/AzureDeploy.json
[parameters]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Windows-3-NodeTypes-Secure-NSG/AzureDeploy.Parameters.json
