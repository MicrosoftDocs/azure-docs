
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

## Modeling a Service Fabric cluster in AAD

AAD enables organizations (known as tenants) to manage user access to applications, which are divided into applications with a web-based login UI and applications with a native client experience. Service Fabric clusters offer a variety of entry points to their management functionality, including the web-based [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) and the [Visual Studio native client](service-fabric-manage-application-in-visual-studio.md). As a result, you will represent every Service Fabric cluster as a set of two applications in AAD, one web application and one native application.

There are two ways to create the applications and add users to them: the Azure classic portal or using the Windows PowerShell scripts provided.

### Using the Azure classic portal

// todo

### Using the helper Windows PowerShell scripts

To simplify some of the steps involved in configuring AAD with a Service Fabric cluster, we have created a set of Windows PowerShell scripts.

>[AZURE.NOTE] You must perform these steps *before* creating the cluster so in cases where the scripts expect cluster names and endpoints, these should be the planned values, not ones which you have already created.

1. [Download the scripts][sf-aad-ps-script-download] and extract them.
2. Run `SetupApplications.ps1`, providing the TenantId, ClusterName, and WebApplicationReplyUrl as parameters. For example:

  ```powershell
  .\SetupApplications.ps1 -TenantId '690ec069-8200-4068-9d01-5aaf188e557a' -ClusterName 'mycluster' -WebApplicationReplyUrl 'https://mycluster.westus.cloudapp.azure.com:19080/Explorer/index.html'
  ```

  You can find your AAD TenantId by looking at the URL for the tenant in the Azure classic portal. The GUID embedded in that URL is the TenantId. For example:

  https://manage.windowsazure.com/microsoft.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/**690ec069-8200-4068-9d01-5aaf188e557a**/users

  The cluster name will be used to prefix the AAD applications created by the script. It does not need to match the actual cluster name exactly. It is just intended to make it easier for you to map AAD artifacts to the Service Fabric cluster that they're being used with.

  The WebApplicationReplyUrl is the default endpoint that AAD will return your users to after completing the sign-in process. You should set this to the Service Fabric Explorer endpoint for your cluster, which by default is:

  http://&lt;fully_qualified_cluster_URL&gt;:19080/Explorer

## Creating the cluster

## Connecting to the cluster

## Next steps


<!-- Links -->
[sf-aad-ps-script-download]:http://todo
