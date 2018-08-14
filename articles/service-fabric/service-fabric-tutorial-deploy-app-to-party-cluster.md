---
title: Deploy a Service Fabric app to a cluster in Azure | Microsoft Docs
description: Learn how to deploy an application to a cluster from Visual Studio.
services: service-fabric
documentationcenter: .net
author: rwike77 
manager: msfussell 
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/12/2018
ms.author: ryanwi,mikhegn
ms.custom: mvc

---
# Tutorial: Deploy a Service Fabric application to a cluster in Azure

This tutorial is part two of a series and shows you how to deploy an Azure Service Fabric application to a new cluster in Azure.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Create a Party cluster.
> * Deploy an application to a remote cluster using Visual Studio.

In this tutorial series, you learn how to:
> [!div class="checklist"]
> * [Build a .NET Service Fabric application](service-fabric-tutorial-create-dotnet-app.md)
> * Deploy the application to a remote cluster
> * [Add an HTTPS endpoint to an ASP.NET Core front-end service](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md)
> * [Configure CI/CD using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Install Visual Studio 2017](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
* [Install the Service Fabric SDK](service-fabric-get-started.md).

## Download the voting sample application

If you did not build the voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```git
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```

## Publish to a Service Fabric cluster

Now that the application is ready, you can deploy it to a cluster directly from Visual Studio. A [Service Fabric cluster](https://docs.microsoft.com/en-gb/azure/service-fabric/service-fabric-deploy-anywhere) is a network-connected set of virtual or physical machines into which your microservices are deployed and managed.

For this tutorial, you have two options for deployment of the Voting application to a Service Fabric cluster using Visual Studio:

* Publish to a trial (party) cluster.
* Publish to an existing cluster in your subscription.  You can create Service Fabric clusters through the [Azure portal](https://portal.azure.com), using [PowerShel](./scripts/service-fabric-powershell-create-secure-cluster-cert.md) or [Azure CLI](./scripts/cli-create-cluster.md) scripts, or from a [Azure Resource Manager template](service-fabric-tutorial-create-vnet-and-windows-cluster.md).

> [!NOTE]
> Many services use the reverse proxy to communicate with each other. Clusters created from Visual Studio and party clusters have reverse proxy enabled by default.  If using an existing cluster, you must [enable the reverse proxy in the cluster](service-fabric-reverseproxy-setup.md#).


### Find the VotingWeb service endpoint for your Azure subscription

If you are going to publish the Voting application to your own Azure subscription, find the endpoint of the front-end web service. If you are using a party cluster, port 8080 using by the Voting sample is automatically open and you will not need to configure it in the party cluster's load balancer.

The front-end web service is listening on a specific port.  When the application deploys to a cluster in Azure, both the cluster and the application run behind an Azure load balancer.  The application port must be open using a rule in the Azure Load balancer for this cluster so that inbound traffic can get through to the web service.  The port (8080, for example) is found in the *VotingWeb/PackageRoot/ServiceManifest.xml* file in the **Endpoint** element:

```xml
<Endpoint Protocol="http" Name="ServiceEndpoint" Type="Input" Port="8080" />
```

For your Azure subscription, open this port using a Load balancing rule in Azure through a [PowerShell script](./scripts/service-fabric-powershell-open-port-in-load-balancer.md) or via the Load balancer for this cluster in the [Azure portal](https://portal.azure.com).

### Join a Party cluster

> [!NOTE]
> Jump to the Deploy the application using Visual Studio in the next section if you are going to publish the application to your own cluster within an Azure subscription.

Party clusters are free, limited-time Service Fabric clusters hosted on Azure and run by the Service Fabric team where anyone can deploy applications and learn about the platform. The cluster uses a single self-signed certificate for node-to-node as well as client-to-node security.

Sign in and [join a Windows cluster](http://aka.ms/tryservicefabric). Download the PFX certificate to your computer by clicking the **PFX** link. Click the **How to connect to a secure Party cluster?** link and copy the certificate password. The certificate, certificate password, and the **Connection endpoint** value are used in following steps.

![PFX and connection endpoint](./media/service-fabric-quickstart-dotnet/party-cluster-cert.png)

> [!Note]
> There are a limited number of Party clusters available per hour. If you get an error when you try to sign up for a party cluster, you can wait for a period and try again, or you can follow these steps in the [Deploy a .NET app](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-deploy-app-to-party-cluster#deploy-the-sample-application) tutorial to create a Service Fabric cluster in your Azure subscription and deploy the application to it. If you don't already have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
>

On your Windows machine, install the PFX in *CurrentUser\My* certificate store.

```powershell
PS C:\mycertificates> Import-PfxCertificate -FilePath .\party-cluster-873689604-client-cert.pfx -CertStoreLocation Cert:\CurrentUser\My -Password (ConvertTo-SecureString 873689604 -AsPlainText -Force)


   PSParentPath: Microsoft.PowerShell.Security\Certificate::CurrentUser\My

Thumbprint                                Subject
----------                                -------
3B138D84C077C292579BA35E4410634E164075CD  CN=zwin7fh14scd.westus.cloudapp.azure.com
```

Remember the thumbprint for a following step.

> [!Note]
> By default, the web front-end service is configured to listen on port 8080 for incoming traffic. Port 8080 is open in the Party Cluster.  If you need to change the application port, change it to one of the ports that are open in the Party Cluster.
>

### Publish the application using Visual Studio

Now that the application is ready, you can deploy it to a cluster directly from Visual Studio.

1. Right-click **Voting** in the Solution Explorer and choose **Publish**. The Publish dialog appears.

2. Copy the **Connection Endpoint** from the Party cluster page or from your Azure subscription into the **Connection Endpoint** field. For example, `zwin7fh14scd.westus.cloudapp.azure.com:19000`. Click **Advanced Connection Parameters** and ensure that the *FindValue* and *ServerCertThumbprint* values match the thumbprint of the certificate installed in a previous step for a party cluster or the certificate that matches your Azure subscription.

    ![Publish Dialog](./media/service-fabric-quickstart-dotnet/publish-app.png)

    Each application in the cluster must have a unique name.  Party clusters are a public, shared environment however and there may be a conflict with an existing application.  If there is a name conflict, rename the Visual Studio project and deploy again.

3. Click **Publish**.

4. Open a browser and type in the cluster address followed by ':8080' (or other port if configured) to get to your Voting application in the cluster - for example, `http://zwin7fh14scd.westus.cloudapp.azure.com:8080`. You should now see the application running in the cluster in Azure. In the Voting web page, try adding and deleting voting options, and voting for one or more of these options.

    ![Application front end](./media/service-fabric-quickstart-dotnet/application-screenshot-new-azure.png)


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a party cluster.
> * Deploy an application to a remote cluster using Visual Studio.

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Enable HTTPS](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md)
