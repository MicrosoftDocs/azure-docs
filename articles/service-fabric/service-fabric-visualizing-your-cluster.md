<properties
   pageTitle="Visualizing your cluster using Service Fabric Explorer"
   description="Service Fabric Explorer is a useful GUI tool for inspecting and managing cloud applications and nodes in a Microsoft Azure Service Fabric cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/05/2015"
   ms.author="jesseb"/>

# Visualizing your cluster using Service Fabric Explorer

Service Fabric Explorer is a visual tool for inspecting and managing cloud applications and nodes in a Microsoft Azure Service Fabric cluster. Service Fabric Explorer can connect to both local development clusters and Azure clusters. For information on the Service Fabric PowerShell cmdlets, see the **Next Steps**.

> [AZURE.NOTE] Creation of Service Fabric clusters in Azure is not yet available.

## Introduction to Service Fabric Explorer

Ensure your local development environment is setup by following the instructions at [set up your Service Fabric development environment](service-fabric-get-started.md).

Run Service Fabric Explorer from your local installation path (%Program Files%\Microsoft SDKs\Service Fabric\Tools\ServiceFabricExplorer\ServiceFabricExplorer.exe). The tool will automatically connect to a local development cluster, if one exists.  It displays information on the cluster such as:

- Applications running on the cluster
- Information about the cluster's nodes
- Health events from the applications and nodes
- Load on the applications in the cluster
- Monitoring for application upgrade status

![Visual representation of the Service Fabric cluster and the deployed applications][servicefabricexplorer]

One of the important visualizations is the cluster map, visible on the dashboard for the cluster (e.g. clicking on **Onebox/Local cluster**). The cluster map shows the set of upgrade domains and failure domains, and which nodes are mapped to which domains.  See the [technical overview of Service Fabric](service-fabric-technical-overview.md) to familiarize yourself with key Service Fabric concepts.

![Cluster map shows which upgrade domains and failure domains each node belongs to.][clustermap]


## Viewing applications and services

Service Fabric Explorer allows you to explore the applications running on your cluster.  Expand the **Application View** to view detailed information on your applications, services, partitions, and replicas.

The diagram below shows that the application named **"fabric:/Stateful1Application"** has one stateless service named **"fabric:/Stateful1Application/MyFrontEnd"** and one stateful service named **"fabric:/Stateful1Application/Stateful1"**. The stateless service has one partition with one replica running on **Node.4**. The stateful service has two partitions, each with 3 replicas, running on several different nodes.

![View of the applications running on the Service Fabric cluster][applicationview]

Clicking on an application, service, partition, or replica provides detailed information on that entity.  The diagram below shows the service replica health dashboard for one of the primary replicas of the stateful service.  This includes its role, the node it's running on, address it's listening on, the location of its files on disk, and health events.

![Detailed information on a Service Fabric replica][replicadetails]


## Connecting to a remote Service Fabric cluster

To view a remote Service Fabric cluster, click on **Connect** to bring up the **Connect to Service Fabric Cluster** dialog.  Enter the **ServiceFabric endpoint** for your cluster and click **Connect**.  The Service Fabric endpoint is typically the public name of your cluster service listening on port 19000.

![Setup a connection to your remote Service Fabric cluster][connecttocluster]


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

- [Testability overview](service-fabric-testability-overview.md).
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric application deployment using PowerShell](service-fabric-deploy-remove-applications.md)

<!--Image references-->
[applicationview]: ./media/service-fabric-visualizing-your-cluster/applicationview.png
[clustermap]: ./media/service-fabric-visualizing-your-cluster/clustermap.png
[connecttocluster]: ./media/service-fabric-visualizing-your-cluster/connecttocluster.png
[replicadetails]: ./media/service-fabric-visualizing-your-cluster/replicadetails.png
[servicefabricexplorer]: ./media/service-fabric-visualizing-your-cluster/servicefabricexplorer.png
