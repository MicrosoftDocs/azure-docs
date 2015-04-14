<properties 
   pageTitle="Application Scenarios" 
   description="Categories of applications and services" 
   services="service-fabric" 
   documentationCenter=".net" 
   authors="msfussell" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="02/18/2015"
   ms.author="mfussell"/>

# Application Scenarios 

Service Fabric and Azure offer a reliable and flexible cloud infrastructure platform that enables you to run many types of business applications and services. These applications and services can be stateless or stateful, and they are resource balanced across the underlying hardware to maximize efficiency. The unique architecture of Service Fabric enables you to perform real-time data analysis, in-memory computation, parallel transaction, and event processing in your applications. You can easily scale your applications up or down, depending on your changing resource requirements. 

The Service Fabric platform in Azure is ideal for the following categories of applications and services:

- **Highly available, scalable services**: Service Fabric services provide extremely fast failover. Multiple secondary service replicas remain available. If a node goes down due to hardware failure, one of the secondary replicas is immediately promoted to a primary replica with negligible loss of service to customers. Services can be quickly and easily scaled up from a few instances to thousands of instances and then scaled down to a few instances, depending on your resource needs. You can use Service Fabric to build and manage the lifecycle of these scalable cloud services.
 
- **Computation on non-static data**: Service Fabric enables you to build data I/O and compute intensive, stateful applications. The processing and data resources in Service Fabric applications are located together, so when your application requires fast reads and writes the network latency that is associated with an external data cache or storage tier is eliminated. Service Fabric is ideal to use for real-time advertisement selection applications that have updating rules or for applications that require heavy computation for business information data. 
 
- **Session based interactive applications**: Service Fabric is useful if your applications, such as online gaming or instant messaging, require low latency reads and writes. Service Fabric enables you to build these interactive, stateful applications without having to create a separate store or cache. You can simply build, deploy, and run your applications.
 
- **Distributed graph processing**: The growth of social networks has greatly increased the need to analyze large-scale graphs in parallel. Fast scaling and parallel load processing make Service Fabric a natural platform for processing large-scale graphs. Service Fabric enables you to build highly scalable and distributed systems and services for groups such as social networking, business intelligence, and scientific research.
 
- **Data analytics and workflows**: The fast read/writes of Service Fabric enables applications that must reliably process events or streams of data. Service Fabric also enables applications that describe a processing pipeline, where results must be reliable and then passed on without loss to the next processing stage.



<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

 