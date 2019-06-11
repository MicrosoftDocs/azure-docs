---
title: Azure HDInsight SDK for Go
description: Reference for Azure HDInsight SDK for Go
author: tylerfox

ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/8/2019
ms.author: tyfox
ms.custom: seodec18

---

# HDInsight SDK for Go (Preview)

## Overview
The HDInsight SDK for Go provides classes and functions that allow you to manage your HDInsight clusters. It includes operations to create, delete, update, list, resize, execute script actions, monitor, get properties of HDInsight clusters, and more.

> [!NOTE]  
>GoDoc reference material for this SDK is also [available here](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight).

## Prerequisites

* An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).
* [Go](https://golang.org/dl/).

## SDK installation

From your GOPATH location, run `go get github.com/Azure/azure-sdk-for-go/tree/master/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight`

## Authentication

The SDK first needs to be authenticated with your Azure subscription.  Follow the example below to create a service principal and use it to authenticate. After this is done, you will have an instance of a `ClustersClient`, which contains many functions (outlined in below sections) that can be used to perform management operations.

> [!NOTE]  
> There are other ways to authenticate besides the below example that could potentially be better suited for your needs. All functions are outlined here: [Authentication functions in the Azure SDK for Go](https://docs.microsoft.com/go/azure/azure-sdk-go-authorization)

### Authentication example using a service principal

First, login to [Azure Cloud Shell](https://shell.azure.com/bash). Verify you are currently using the subscription in which you want the service principal created. 

```azurecli-interactive
az account show
```

Your subscription information is displayed as JSON.

```json
{
  "environmentName": "AzureCloud",
  "id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "isDefault": true,
  "name": "XXXXXXX",
  "state": "Enabled",
  "tenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "user": {
    "cloudShellID": true,
    "name": "XXX@XXX.XXX",
    "type": "user"
  }
}
```

If you're not logged into the correct subscription, select the correct one by running: 
```azurecli-interactive
az account set -s <name or ID of subscription>
```

> [!IMPORTANT]  
> If you have not already registered the HDInsight Resource Provider by another function (such as by creating an HDInsight Cluster through the Azure portal), you need to do this once before you can authenticate. This can be done from the [Azure Cloud Shell](https://shell.azure.com/bash) by running the following command:
>```azurecli-interactive
>az provider register --namespace Microsoft.HDInsight
>```

Next, choose a name for your service principal and create it with the following command:

```azurecli-interactive
az ad sp create-for-rbac --name <Service Principal Name> --sdk-auth
```

The service principal information is displayed as JSON.

```json
{
  "clientId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "clientSecret": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "subscriptionId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "tenantId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```
Copy the below snippet and fill in `TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`, and `SUBSCRIPTION_ID` with the strings from the JSON that was returned after running the command to create the service principal.

```golang
package main

import (
    "context"
    "github.com/Azure/go-autorest/autorest/azure/auth"
    hdi "github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight"
    "github.com/Azure/go-autorest/autorest/to"
)

func main() {
    var err error

    // Tenant ID for your Azure Subscription
    var TENANT_ID = ""
    // Your Service Principal App Client ID
    var CLIENT_ID = ""
    // Your Service Principal Client Secret
    var CLIENT_SECRET = ""
    // Azure Subscription ID
    var SUBSCRIPTION_ID = ""

    var credentials = auth.NewClientCredentialsConfig(CLIENT_ID, CLIENT_SECRET, TENANT_ID)
    var client = hdi.NewClustersClient(SUBSCRIPTION_ID)

    client.Authorizer, err = credentials.Authorizer()
    if (err != nil) {
        fmt.Println("Error: ", err)
    }
```

## Cluster management

> [!NOTE]  
> This section assumes you have already authenticated and constructed a `ClusterClient` instance and store it in a variable called `client`. Instructions for authenticating and obtaining a `ClusterClient` can be found in the Authentication section above.

### Create a cluster

A new cluster can be created by calling `client.Create()`. 

#### Example

This example demonstrates how to create an [Apache Spark](https://spark.apache.org/) cluster with 2 head nodes and 1 worker node.

> [!NOTE]  
> You first need to create a Resource Group and Storage Account, as explained below. If you have already created these, you can skip these steps.

##### Creating a resource group

You can create a resource group using the [Azure Cloud Shell](https://shell.azure.com/bash) by running
```azurecli-interactive
az group create -l <Region Name (i.e. eastus)> --n <Resource Group Name>
```
##### Creating a storage account

You can create a storage account using the [Azure Cloud Shell](https://shell.azure.com/bash) by running:
```azurecli-interactive
az storage account create -n <Storage Account Name> -g <Existing Resource Group Name> -l <Region Name (i.e. eastus)> --sku <SKU i.e. Standard_LRS>
```
Now run the following command to get the key for your storage account (you will need this to create a cluster):
```azurecli-interactive
az storage account keys list -n <Storage Account Name>
```
---
The below Go snippet creates a Spark cluster with 2 head nodes and 1 worker node. Fill in the blank variables as explained in the comments and feel free to change other parameters to suit your specific needs.

```golang
// The name for the cluster you are creating
var clusterName = "";
// The name of your existing Resource Group
var resourceGroupName = "";
// Choose a username
var username = "";
// Choose a password
var password = "";
// Replace <> with the name of your storage account
var storageAccount = "<>.blob.core.windows.net";
// Storage account key you obtained above
var storageAccountKey = "";
// Choose a region
var location = "";
var container = "default";

var parameters = hdi.ClusterCreateParametersExtended {
    Location: to.StringPtr(location),
    Tags: make(map[string]*string),
    Properties: &hdi.ClusterCreateProperties {
        ClusterVersion: to.StringPtr("3.6"),
        OsType: hdi.Linux,
        ClusterDefinition: &hdi.ClusterDefinition {
            Kind: to.StringPtr("spark"),
            Configurations: map[string]map[string]interface{}{
                "gateway": {
                    "restAuthCredential.isEnabled": "True",
                    "restAuthCredential.username":  username,
                    "restAuthCredential.password":  password,
                },
            },
        },
        Tier: hdi.Standard,
        ComputeProfile: &hdi.ComputeProfile {
            Roles: &[]hdi.Role {
                hdi.Role {
                    Name: to.StringPtr("headnode"),
                    TargetInstanceCount: to.Int32Ptr(2),
                    HardwareProfile: &hdi.HardwareProfile {
                        VMSize: to.StringPtr("Large"),
                    },
                    OsProfile: &hdi.OsProfile {
                        LinuxOperatingSystemProfile: &hdi.LinuxOperatingSystemProfile {
                            Username: to.StringPtr(username),
                            Password: to.StringPtr(password),
                        },
                    },
                },
                hdi.Role {
                    Name: to.StringPtr("workernode"),
                    TargetInstanceCount: to.Int32Ptr(1),
                    HardwareProfile: &hdi.HardwareProfile {
                        VMSize: to.StringPtr("Large"),
                    },
                    OsProfile: &hdi.OsProfile {
                        LinuxOperatingSystemProfile: &hdi.LinuxOperatingSystemProfile {
                            Username: to.StringPtr(username),
                            Password: to.StringPtr(password),
                        },
                    },
                },
            },
        },
        StorageProfile: &hdi.StorageProfile {
            Storageaccounts: &[]hdi.StorageAccount {
                hdi.StorageAccount {
                    Name: to.StringPtr(storageAccount),
                    Key: to.StringPtr(storageAccountKey),
                    Container: to.StringPtr(container),
                    IsDefault: to.BoolPtr(true),
                },
            },
        },
    },
}
client.Create(context.Background(), resourceGroupName, clusterName, parameters)
```

### Get cluster details

To get properties for a given cluster:

```golang
client.Get(context.Background(), "<Resource Group Name>", "<Cluster Name>")
```

#### Example

You can use `get` to confirm that you have successfully created your cluster.

```golang
cluster, err := client.Get(context.Background(), resourceGroupName, clusterName)
if (err != nil) {
    fmt.Println("Error: ", err)
}
fmt.Println(*cluster.Name)
fmt.Println(*cluster.ID
```

The output should look like:

```
<Cluster Name>
/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<Resource Group Name>/providers/Microsoft.HDInsight/clusters/<Cluster Name>
```

### List clusters

#### List clusters under the subscription
```golang
client.List()
```
#### List clusters by resource group
```golang
client.ListByResourceGroup("<Resource Group Name>")
```

> [!NOTE]  
> Both `List()` and `ListByResourceGroup()` return a `ClusterListResultPage` struct. To get the next page, you can call `Next()`. This can be repeated until `ClusterListResultPage.NotDone()` returns `false`, as shown in the example below.

#### Example
The following example prints the properties of all clusters for the current subscription:

```golang
page, err := client.List(context.Background())
if (err != nil) {
    fmt.Println("Error: ", err)
}
for (page.NotDone()) {
    for _, cluster := range page.Values() {
        fmt.Println(*cluster.Name)
    }
    err = page.Next();
    if (err != nil) {
        fmt.Println("Error: ", err)
    }
}
```

### Delete a cluster

To delete a cluster:

```golang
client.Delete(context.Background(), "<Resource Group Name>", "<Cluster Name>")
```

### Update cluster tags

You can update the tags of a given cluster like so:

```golang
client.Update(context.Background(), "<Resource Group Name>", "<Cluster Name>", hdi.ClusterPatchParameters{<map[string]*string} of Tags>)
```
#### Example

```golang
client.Update(context.Background(), "SDKTestRG", "SDKTest", hdi.ClusterPatchParameters{map[string]*string{"tag1Name" : to.StringPtr("tag1Value"), "tag2Name" : to.StringPtr("tag2Value")}})
```

### Resize cluster

You can resize a given cluster's number of worker nodes by specifying a new size like so:

```golang
client.Resize(context.Background(), "<Resource Group Name>", "<Cluster Name>", hdi.ClusterResizeParameters{<Num of Worker Nodes (int)>})
```

## Cluster monitoring

The HDInsight Management SDK can also be used to manage monitoring on your clusters via the Operations Management Suite (OMS).

Similarly to how you created `ClusterClient` to use for management operations, you need to create an `ExtensionClient` to use for monitoring operations. Once you have completed the Authentication section above, you can create an `ExtensionClient` like so:

```golang
extClient := hdi.NewExtensionsClient(SUBSCRIPTION_ID)
extClient.Authorizer, _ = credentials.Authorizer()
```

> [!NOTE]  
> The below monitoring examples assume you have already initialized an `ExtensionClient` called `extClient` and set its `Authorizer` as shown above.

### Enable OMS monitoring

> [!NOTE]  
> To enable OMS Monitoring, you must have an existing Log Analytics workspace. If you have not already created one, you can learn how to do that here: [Create a Log Analytics workspace in the Azure portal](https://docs.microsoft.com/azure/log-analytics/log-analytics-quick-create-workspace).

To enable OMS Monitoring on your cluster:

```golang
extClient.EnableMonitoring(context.Background(), "<Resource Group Name", "Cluster Name", hdi.ClusterMonitoringRequest {WorkspaceID: to.StringPtr("<Workspace Id>")})
```

### View status of OMS monitoring

To get the status of OMS on your cluster:

```golang
extClient.GetMonitoringStatus(context.Background(), "<Resource Group Name", "Cluster Name")
```

### Disable OMS monitoring

To disable OMS on your cluster:

```golang
extClient.DisableMonitoring(context.Background(), "<Resource Group Name", "Cluster Name")
```

## Script actions

HDInsight provides a configuration function called script actions that invokes custom scripts to customize the cluster.

> [!NOTE]  
> More information on how to use script actions can be found here: [Customize Linux-based HDInsight clusters using script actions](https://docs.microsoft.com/azure/hdinsight/hdinsight-hadoop-customize-cluster-linux)

### Execute script actions

You can execute script actions on a given cluster like so:

```golang
var scriptAction1 = hdi.RuntimeScriptAction{Name: to.StringPtr("<Script Name>"), URI: to.StringPtr("<URL To Script>"), Roles: <&[]string of roles>} //valid roles are "headnode", "workernode", "zookeepernode", and "edgenode"
client.ExecuteScriptActions(context.Background(), "<Resource Group Name>", "<Cluster Name>", hdi.ExecuteScriptActionParameters{PersistOnSuccess: to.BoolPtr(true), ScriptActions: &[]hdi.RuntimeScriptAction{scriptAction1}}) //add more RuntimeScriptActions to the list to execute multiple scripts
```

For the 'Delete Script Action' and 'List Persisted Script Actions' operations, you need to create a `ScriptActionsClient`, similarly to how you created `ClusterClient` to use for management operations. Once you have completed the Authentication section above, you can create a `ScriptActionsClient` like so:

```golang
scriptActionsClient := hdi.NewScriptActionsClient(SUBSCRIPTION_ID)
scriptActionsClient.Authorizer, _ = credentials.Authorizer()
```

> [!NOTE]  
> The below script actions examples assume you have already initialized a `ScriptActionsClient` called `scriptActionsClient` and set its `Authorizer` as shown above.

### Delete script action

To delete a specified persisted script action on a given cluster:

```golang
scriptActionsClient.Delete(context.Background(), "<Resource Group Name>", "<Cluster Name>", "<Script Name>")
```

### List persisted script actions

> [!NOTE]  
> Both `ListByCluster()` returns a `ScriptActionsListPage` struct. To get the next page, you can call `Next()`. This can be repeated until `ClusterListResultPage.NotDone()` returns `false`, as shown in the example below.

To list all persisted script actions for the specified cluster:
```golang
scriptActionsClient.ListByCluster(context.Background(), "<Resource Group Name>", "<Cluster Name>")
```

#### Example

```golang
page, err := scriptActionsClient.ListByCluster(context.Background(), resourceGroupName, clusterName)
if (err != nil) {
    fmt.Println("Error: ", err)
}
for (page.NotDone()) {
    for _, script := range page.Values() {
        fmt.Println(*script.Name) //There are functions to get other properties of RuntimeScriptActionDetail besides Name, such as Status, Operation, StartTime, EndTime, etc. See reference documentation.
    }
    err = page.Next();
    if (err != nil) {
        fmt.Println("Error: ", err)
    }
}
```

### List all scripts' execution history

For this operation, you need to create a `ScriptExecutionHistoryClient`, similarly to how you created `ClusterClient` to use for management operations. Once you have completed the Authentication section above, you can create a `ScriptActionsClient` like so:

```golang
scriptExecutionHistoryClient := hdi.NewScriptExecutionHistoryClient(SUBSCRIPTION_ID)
scriptExecutionHistoryClient.Authorizer, _ = credentials.Authorizer()
```

> [!NOTE]  
> The below assumes you have already initialized a `ScriptExecutionHistoryClient` called `scriptExecutionHistoryClient` and set its `Authorizer` as shown above.

To list all scripts' execution history for the specified cluster:

```golang
scriptExecutionHistoryClient.ListByCluster(context.Background(), "<Resource Group Name>", "<Cluster Name>")
```

#### Example

This example prints all the details for all past script executions.

```golang
page, err := scriptExecutionHistoryClient.ListByCluster(context.Background(), resourceGroupName, clusterName)
if (err != nil) {
    fmt.Println("Error: ", err)
}
for (page.NotDone()) {
    for _, script := range page.Values() {
        fmt.Println(*script.Name) //There are functions to get other properties of RuntimeScriptActionDetail besides Name, such as Status, Operation, StartTime, EndTime, etc. See reference documentation.
    }
    err = page.Next();
    if (err != nil) {
        fmt.Println("Error: ", err)
    }
}
```

## Next steps

* Explore the [GoDoc reference material](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight). The GoDocs provide reference documentation for all functions in the SDK.
