
<properties
   pageTitle="Service Fabric cluster security: client authentication with Azure Active Directory | Microsoft Azure"
   description="This article describes how to create a Service Fabric cluster using Azure Active Directory (AAD) for client authentication"
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/05/2016"
   ms.author="seanmck"/>

# Creating a Service Fabric cluster using Azure Active Directory for client authentication

You can secure access to the management endpoints of a Service Fabric cluster using Azure Active Directory (AAD). This article covers how to create the necessary AAD artifacts, how to populate them during cluster creation, and how to connect to those clusters afterwards.

## Modeling a Service Fabric cluster and users in AAD

AAD enables organizations (known as tenants) to manage user access to applications, which are divided into applications with a web-based login UI and applications with a native client experience. Service Fabric clusters offer a variety of entry points to their management functionality, including the web-based [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) and the [Visual Studio native client](service-fabric-manage-application-in-visual-studio.md). As a result, you will represent every Service Fabric cluster as a set of two applications in AAD, one web application and one native application.

There are two ways to create the applications and add users to them: the Azure classic portal or using the Windows PowerShell scripts provided.

### Using the Azure classic portal

// todo

### Using the helper Windows PowerShell scripts

To simplify some of the steps involved in configuring AAD with a Service Fabric cluster, we have created a set of Windows PowerShell scripts.

#### Download the helper scripts

[Download the scripts][sf-aad-ps-script-download] and extract them before proceeding.

#### Create the applications

>[AZURE.NOTE] You must perform these steps *before* creating the cluster so in cases where the scripts expect cluster names and endpoints, these should be the planned values, not ones which you have already created.

Run `SetupApplications.ps1`, providing the TenantId, ClusterName, and WebApplicationReplyUrl as parameters. For example:

  ```powershell
  .\SetupApplications.ps1 -TenantId '690ec069-8200-4068-9d01-5aaf188e557a' -ClusterName 'mycluster' -WebApplicationReplyUrl 'https://mycluster.westus.cloudapp.azure.com:19080/Explorer/index.html'
  ```

  You can find your **TenantId** by looking at the URL for the tenant in the Azure classic portal. The GUID embedded in that URL is the TenantId. For example:

  https://<i></i>manage.windowsazure.com/microsoft.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/**690ec069-8200-4068-9d01-5aaf188e557a**/users

  The **ClusterName** will be used to prefix the AAD applications created by the script. It does not need to match the actual cluster name exactly as it is only intended to make it easier for you to map AAD artifacts to the Service Fabric cluster that they're being used with.

  The **WebApplicationReplyUrl** is the default endpoint that AAD will return your users to after completing the sign-in process. You should set this to the Service Fabric Explorer endpoint for your cluster, which by default is:

  https://&lt;cluster_domain&gt;:19080/Explorer

  You will be prompted to sign into an account which has administrative privileges for the AAD tenant. Once you do, the script will proceed to create the web and native applications to represent your Service Fabric cluster. If you look at the tenant's applications in the Azure classic portal, you should see two new entries (assuming "myCluster" is the cluster name):

  - myCluster_Cluster
  - myCluster_Client

#### Assign users to roles

// todo

## Creating the cluster

Now that you have created the AAD applications, you can create the Service Fabric cluster. At this time, the Azure portal does not support configuring AAD authentication for Service Fabric clusters so you will need to do it using an Azure Resource Manager (ARM) template in PowerShell or Visual Studio.

Note that AAD is only used for client authentication to the cluster. To create a secure cluster, you must also provide a certificate, which will be used to secure communication between the nodes in the cluster and to provide server authentication for the cluster's management endpoints. You can find an [ARM template for a secure cluster in the Azure quickstart gallery][secure-cluster-arm-template] or you can follow the instructions provided in the readme of the [Service Fabric resource group project in Visual Studio](service-fabric-cluster-creation-via-visual-studio.md).

Add the following snippet to the template in the Microsoft.ServiceFabric/clusters section, as a peer to fabricSettings, managementEndpoint, etc.

```json
  "azureActiveDirectory": {
    "tenantId": "<your_tenant_id>",
    "clusterApplication": "<your_cluster_application_client_id>",
    "clientApplication": "<your_native_application_client_id>"
  }
```

The clusterApplication refers to the web application created in the previous section. You can find its ID in the output of the SetupApplication script, where it is referred to as `WebAppId`. The clientApplication refers to the native application and its client ID is available in the SetupApplication output as NativeClientAppId.

Once these values are in place, you can proceed with cluster provisioning.

## Connecting to the cluster

When you navigate to Service Fabric Explorer on an AAD-enabled cluster, you will be automatically redirected to a secure login page.

To connect from a native client like Windows PowerShell or Visual Studio, you will need to indicate AAD as your sign-in mechanism and then provide a server cert thumbprint, which serves to validate the identity of the endpoint. The details for these two entry points are shown below.

### Connecting from Visual Studio

In Visual Studio, you can modify the publish profile to add the necessary attributes as shown below:

```xml
<ClusterConnectionParameters     
    ConnectionEndpoint="kzfab0328e.westus.cloudapp.azure.com:19000"  
    AzureActiveDirectory="true"
    ServerCertThumbprint="65E3F2A1FCA73AE4819B4BB401EBFA65AE161733"
    />
```

### Connecting from Windows PowerShell

In PowerShell, you can provide the necessary parameters to the Connect-ServiceFabricCluster cmdlet as shown below:  

```PowerShell
Connect-ServiceFabricCluster -AzureActiveDirectory -ConnectionEndpoint <cluster_endpoint>:19000 -ServerCertThumbprint <server_cert_thumbprint>
```

PowerShell will pop up a secure login window where you can authenticate to the cluster.

## Next steps


<!-- Links -->
[sf-aad-ps-script-download]:http://todo
[secure-cluster-arm-template]:https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype-wad
