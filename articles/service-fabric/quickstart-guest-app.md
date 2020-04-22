---
title: Quickly deploy an existing app to a cluster 
description: Use an Azure Service Fabric cluster to host an existing Node.js application with Visual Studio.

ms.topic: conceptual
ms.date: 12/06/2017
---

# Host a Node.js application on Azure Service Fabric

This quickstart helps you deploy an existing application (Node.js in this example) to a Service Fabric cluster running on Azure.

## Prerequisites

Before you get started, make sure that you have [set up your development environment](service-fabric-get-started.md). Which includes installing the Service Fabric SDK and Visual Studio 2019 or 2015.

You also need to have an existing Node.js application for deployment. This quickstart uses a simple Node.js website that can be downloaded [here][download-sample]. Extract this file to your `<path-to-project>\ApplicationPackageRoot\<package-name>\Code\` folder after you create the project in the next step.

If you don't have an Azure subscription, create a [free account][create-account].

## Create the service

Launch Visual Studio as an **administrator**.

Create a project with `CTRL`+`SHIFT`+`N`

In the **New Project** dialog, choose **Cloud > Service Fabric Application**.

Name the application **MyGuestApp** and press **OK**.

>[!IMPORTANT]
>Node.js can easily break the 260 character limit for paths that windows has. Use a short path for the project itself such as **c:\code\svc1**. Optionally, you can follow **[these instructions](https://stackoverflow.com/a/41687101/1664231)** to enable long file paths in Windows 10.
   
![New project dialog in Visual Studio][new-project]

You can create any type of Service Fabric service from the next dialog. For this quickstart, choose **Guest Executable**.

Name the service **MyGuestService** and set the options on the right to the following values:

| Setting                   | Value |
| ------------------------- | ------ |
| Code Package Folder       | _&lt;the folder with your Node.js app&gt;_ |
| Code Package Behavior     | Copy folder contents to project |
| Program                   | node.exe |
| Arguments                 | server.js |
| Working Folder            | CodePackage |

Press **OK**.

![New service dialog in Visual Studio][new-service]

Visual Studio creates the application project and the actor service project and displays them in Solution Explorer.

The application project (**MyGuestApp**) doesn't contain any code directly. The project references a set of service projects. Also, it contains three other types of content:

* **Publish profiles**  
Tooling preferences for different environments.

* **Scripts**  
PowerShell script for deploying/upgrading your application.

* **Application definition**  
Includes the application manifest under *ApplicationPackageRoot*. Associated application parameter files are under *ApplicationParameters*, which define the application and allow you to configure it specifically for a given environment.
    
For an overview of the contents of the service project, see [Getting started with Reliable Services](service-fabric-reliable-services-quick-start.md).

## Set up networking

The example Node.js app we're deploying uses port **80** and we need to tell Service Fabric that we need that port exposed.

Open the **ServiceManifest.xml** file in the project. At the bottom of the manifest, there's a `<Resources> \ <Endpoints>` with an entry already defined. Modify that entry to add `Port`, `Protocol`, and `Type`. 

```xml
  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
      <Endpoint Name="MyGuestAppServiceTypeEndpoint" Port="80" Protocol="http" Type="Input" />
    </Endpoints>
  </Resources>
```

## Deploy to Azure

If you press **F5** and run the project, it's deployed to the local cluster. However, let's deploy to Azure instead.

Right-click on the project and choose **Publish...** which opens a dialog to publish to Azure.

![Publish to azure dialog for a service fabric service][publish]

Select the **PublishProfiles\Cloud.xml** target profile.

If you haven't previously, choose an Azure account to deploy to. If you don't have one yet, [sign-up for one][create-account].

Under **Connection Endpoint**, select the Service Fabric cluster to deploy to. If you don't have one, select **&lt;Create New Cluster...&gt;** which opens up web browser window to the Azure portal. For more information, see [create a cluster in the portal](service-fabric-cluster-creation-via-portal.md#create-cluster-in-the-azure-portal). 

When you create the Service Fabric cluster, make sure to set the **Custom endpoints** setting to **80**.

![Service fabric node type configuration with custom endpoint][custom-endpoint]

Creating a new Service Fabric cluster takes some time to complete. Once it has been created, go back to the publish dialog and select **&lt;Refresh&gt;**. The new cluster is listed in the drop-down box; select it.

Press **Publish** and wait for the deployment to finish.

This may take a few minutes. After it completes, it may take a few more minutes for the application to be fully available.

## Test the website

After your service has been published, test it in a web browser. 

First, open the Azure portal and find your Service Fabric service.

Check the overview blade of the service address. Use the domain name from the _Client connection endpoint_ property. For example, `http://mysvcfab1.westus2.cloudapp.azure.com`.

![Service fabric overview blade on the Azure portal][overview]

Navigate to this address where you'll see the `HELLO WORLD` response.

## Delete the cluster

Don't forget to delete all of the resources you've created for this quickstart, as you're charged for those resources.

## Next steps
Read more about [guest executables](service-fabric-guest-executables-introduction.md).

<!-- Image References -->

[new-project]: ./media/quickstart-guest-app/new-project.png
[new-service]: ./media/quickstart-guest-app/template.png
[solution-exp]: ./media/quickstart-guest-app/solution-explorer.png
[publish]: ./media/quickstart-guest-app/publish.png
[overview]: ./media/quickstart-guest-app/overview.png
[custom-endpoint]: ./media/quickstart-guest-app/custom-endpoint.png

[download-sample]: https://github.com/MicrosoftDocs/azure-cloud-services-files/raw/temp/service-fabric-node-website.zip
[create-account]: https://azure.microsoft.com/free/?WT.mc_id=A261C142F
