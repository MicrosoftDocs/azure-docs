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
   ms.date="04/14/2015"
   ms.author="jesseb"/>

# Visualizing your cluster using Service Fabric Explorer

Service Fabric Explorer is a useful GUI tool for inspecting and managing cloud applications and nodes in a Microsoft Azure Service Fabric cluster.  Service Fabric Explorer can connect to both local development clusters and Azure clusters.

## Introduction to Service Fabric Explorer

Ensure your local development environment is setup using the instructions at [Setting up your Service Fabric development environment](../service-fabric-setup-your-development-environment).

Run Service Fabric Explorer from your local installation path (%Program Files%\Microsoft SDKs\Service Fabric\Tools\ServiceFabricExplorer\ServiceFabricExplorer.exe). The tool will automatically connect to a local development cluster, if one exists.  It displays information on the cluster such as:

- Applications running on the cluster
- Information about the cluster's nodes
- Health events from the applications and nodes
- Load on the applications in the cluster
- Monitoring for application upgrade status

![Visual representation of the Service Fabric cluster and the deployed applications][servicefabricexplorer]

One of the important visualizations is the cluster map, visible on the dashboard for the cluster (e.g. clicking on **Onebox/Local cluster**). The cluster map shows the set of upgrade domains and failure domains, and which nodes are mapped to which domains.

![Cluster map shows which upgrade domains and failure domains each node belongs to.][clustermap]


## Viewing applications and services

Service Fabric Explorer allows you to explore the applications running on your cluster.  Expand the **Application View** to view detailed information on your applications, services, partitions, and replicas.

> [AZURE.NOTE] See the [Technical Overview](../service-fabric-technical-overview) to familiarize yourself with the key Service Fabric concepts.

The diagram below shows the application named **"fabric:/Stateful1Application"** has one stateful service named **"fabric:/Stateful1Application/Stateful1"** and one stateless application named **"fabric:/Stateful1Application/Stateless1"**.  The stateful service has two partitions, each with 3 replicas, running on several different nodes.  The stateless service has one partition with one replica running on **Node.5**.

![View of the applications running on the Service Fabric cluster][applicationview]

Clicking on an application, service, partition, or replica provides detailed information on that entity.  The diagram below shows the service replica health dashboard for one of the primaries of the stateful service.  This includes its role, the node it's running on, address it's listening on, the location of its files on disk, and health events.

![Detailed information on a Service Fabric replica][replicadetails]


## Connecting to a Service Fabric cluster in Azure

Service Fabric Explorer can connect to a cluster in Azure for visualizing the nodes running on actual virtual machines.  To view the cluster in Azure, click on **Connect** to bring up the **Connect to Service Fabric Cluster** dialog.  Enter the **ServiceFabric endpoint** for your cluster and click **Connect**.  The Service Fabric endpoint is typically the public name of your cluster service listening on port 19000.

![Setup a connection to your Service Fabric cluster in Azure][connecttoazurecluster]


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

- [Importance of testability](../service-fabric-testability-importance).
- [Managing your service](../service-fabric-fabsrv-managing-your-service).

<!--Image references-->
[applicationview]: ./media/service-fabric-visualizing-your-cluster/applicationview.png
[clustermap]: ./media/service-fabric-visualizing-your-cluster/clustermap.png
[connecttoazurecluster]: ./media/service-fabric-visualizing-your-cluster/connecttoazurecluster.png
[replicadetails]: ./media/service-fabric-visualizing-your-cluster/replicadetails.png
[servicefabricexplorer]: ./media/service-fabric-visualizing-your-cluster/servicefabricexplorer.png
