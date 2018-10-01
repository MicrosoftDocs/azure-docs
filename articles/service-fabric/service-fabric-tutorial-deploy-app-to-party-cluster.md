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

This tutorial is part two of a series. It shows you how to deploy an Azure Service Fabric application to a new cluster in Azure.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create a party cluster.
> * Deploy an application to a remote cluster by using Visual Studio.

In this tutorial series, you learn how to:
> [!div class="checklist"]
> * [Build a .NET Service Fabric application](service-fabric-tutorial-create-dotnet-app.md).
> * Deploy the application to a remote cluster.
> * [Add an HTTPS endpoint to an ASP.NET Core front-end service](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md).
> * [Configure CI/CD by using Azure Pipelines](service-fabric-tutorial-deploy-app-with-cicd-vsts.md).
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md).

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Install Visual Studio 2017](https://www.visualstudio.com/), and install the **Azure development** and **ASP.NET and web development** workloads.
* [Install the Service Fabric SDK](service-fabric-get-started.md).

## Download the voting sample application

If you didn't build the voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following code to clone the sample app repository to your local machine.

```git
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart 
```

## Publish to a Service Fabric cluster

Now that the application is ready, you can deploy it to a cluster directly from Visual Studio. A [Service Fabric cluster](https://docs.microsoft.com/en-gb/azure/service-fabric/service-fabric-deploy-anywhere) is a network-connected set of virtual or physical machines into which your microservices are deployed and managed.

For this tutorial, you have two options for deployment of the voting application to a Service Fabric cluster by using Visual Studio:

* Publish to a trial (party) cluster. 
* Publish to an existing cluster in your subscription. You can create Service Fabric clusters through the [Azure portal](https://portal.azure.com) by using [PowerShell](./scripts/service-fabric-powershell-create-secure-cluster-cert.md) or [Azure CLI](./scripts/cli-create-cluster.md) scripts, or from an [Azure Resource Manager template](service-fabric-tutorial-create-vnet-and-windows-cluster.md).

> [!NOTE]
> Many services use the reverse proxy to communicate with each other. Clusters created from Visual Studio and party clusters have reverse proxy enabled by default. If you're using an existing cluster, you must [enable the reverse proxy in the cluster](service-fabric-reverseproxy-setup.md).


### Find the voting web service endpoint for your Azure subscription

To publish the voting application to your own Azure subscription, find the endpoint of the front-end web service. If you use a party cluster, connect to port 8080 by using the automatically open voting sample. You don't need to configure it in the party cluster's load balancer.

The front-end web service is listening on a specific port. When the application deploys to a cluster in Azure, both the cluster and the application run behind an Azure load balancer. The application port must be opened by using a rule in the Azure load balancer for the cluster. The open port sends inbound traffic through to the web service. The port is found in the **VotingWeb/PackageRoot/ServiceManifest.xml** file in the **Endpoint** element. An example is port 8080.

```xml
<Endpoint Protocol="http" Name="ServiceEndpoint" Type="Input" Port="8080" />
```

For your Azure subscription, open this port by using a load-balancing rule in Azure through a [PowerShell script](./scripts/service-fabric-powershell-open-port-in-load-balancer.md) or via the load balancer for this cluster in the [Azure portal](https://portal.azure.com).

### Join a party cluster

> [!NOTE]
>  To publish the application to your own cluster within an Azure subscription, skip to the [Publish the application by using Visual Studio](#publish-the-application-by-using-visual-studio) section. 

Party clusters are free, limited-time Service Fabric clusters hosted on Azure and run by the Service Fabric team. Anyone can deploy applications and learn about the platform. The cluster uses a single self-signed certificate for both node-to-node and client-to-node security.

Sign in and [join a Windows cluster](http://aka.ms/tryservicefabric). To download the PFX certificate to your computer, select the **PFX** link. Select the **How to connect to a secure Party cluster?** link, and copy the certificate password. The certificate, certificate password, and **Connection endpoint** value are used in the following steps.

![PFX and connection endpoint](./media/service-fabric-quickstart-dotnet/party-cluster-cert.png)

> [!Note]
> A limited number of party clusters are available per hour. If you get an error when you try to sign up for a party cluster, wait and try again. Or follow these steps in the [Deploy a .NET app](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-deploy-app-to-party-cluster#deploy-the-sample-application) tutorial to create a Service Fabric cluster in your Azure subscription and deploy the application to it. If you don't already have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
>

On your Windows machine, install the PFX in the **CurrentUser\My** certificate store.

```powershell
PS C:\mycertificates> Import-PfxCertificate -FilePath .\party-cluster-873689604-client-cert.pfx -CertStoreLocation Cert:\CurrentUser\My -Password (ConvertTo-SecureString 873689604 -AsPlainText -Force)


   PSParentPath: Microsoft.PowerShell.Security\Certificate::CurrentUser\My

Thumbprint                                Subject
----------                                -------
3B138D84C077C292579BA35E4410634E164075CD  CN=zwin7fh14scd.westus.cloudapp.azure.com
```

Remember the thumbprint for the next step.

> [!Note]
> By default, the web front-end service is configured to listen on port 8080 for incoming traffic. Port 8080 is open in the party cluster. If you need to change the application port, change it to one of the ports that are open in the party cluster.
>

### Publish the application by using Visual Studio

Now that the application is ready, you can deploy it to a cluster directly from Visual Studio.

1. Right-click **Voting** in the Solution Explorer. Choose **Publish**. The **Publish** dialog box appears.

2. Copy the **Connection Endpoint** from either the party cluster page or your Azure subscription into the **Connection Endpoint** field. An example is `zwin7fh14scd.westus.cloudapp.azure.com:19000`. Select **Advanced Connection Parameters**.  Make sure that the **FindValue** and **ServerCertThumbprint** values match the thumbprint of the certificate installed in a previous step for a party cluster or the certificate that matches your Azure subscription.

    ![Publish a Service Fabric application](./media/service-fabric-quickstart-dotnet/publish-app.png)

    Each application in the cluster must have a unique name. Party clusters are a public, shared environment, so there might be a conflict with an existing application. If there's a name conflict, rename the Visual Studio project and deploy it again.

3. Select **Publish**.

4. To get to your voting application in the cluster, open a browser and enter the cluster address followed by **:8080**. Or enter another port if one is configured. An example is `http://zwin7fh14scd.westus.cloudapp.azure.com:8080`. You see the application running in the cluster in Azure. In the voting web page, try adding and deleting voting options and voting for one or more of these options.

    ![Service Fabric voting sample](./media/service-fabric-quickstart-dotnet/application-screenshot-new-azure.png)


## Next steps

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Enable HTTPS](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md)
