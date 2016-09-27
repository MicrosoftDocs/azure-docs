<properties
   pageTitle="Connect and communicate with services in Azure Service Fabric | Microsoft Azure"
   description="Learn how to resolve, connect, and communicate with services in Service Fabric."
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor="msfussell"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/05/2016"
   ms.author="vturecek"/>

# Connect and communicate with services in Service Fabric
In Service Fabric, a service runs somewhere in a Service Fabric cluster, typically distributed across multiple VMs. It can be moved from one place to another, either by the service owner, or automatically by Service Fabric. Services are not statically tied to a particular machine or address.
 
A Service Fabric application is generally composed of many different services, where each service performs a specialized task. These services may communicate with each other to form a complete function, such as rendering different parts of a web application. There are also client applications that connect to and communicate with services. This document discusses how to set up communication with and between your services in Service Fabric.

## Bring your own protocol
Service Fabric helps manage the lifecycle of your services but it does not make decisions about what your services do. This includes communication. When your service is opened by Service Fabric, that's your service's opportunity to set up an endpoint for incoming requests, using whatever protocol or communication stack you want. Your service will listen on a normal **IP:port** address using any addressing scheme, such as a URI. Multiple service instances or replicas may share a host process, in which case they will either need to use different ports or use a port-sharing mechanism, such as the http.sys kernel driver in Windows. In either case, each service instance or replica in a host process must be uniquely addressable.

![service endpoints][1]

## Service discovery and resolution
In a distributed system, services may move from one machine to another over time. This can happen for various reasons, including resource balancing, upgrades, failovers, or scale-out. This means service endpoint addresses change as the service moves to nodes with different IP addresses, and may open on different ports if the service uses a dynamically selected port.

![Distribution of services][7]

Service Fabric provides a discovery and resolution service called the Naming Service. The Naming Service maintains a table that maps named service instances to the endpoint addresses they listen on. All named service instances in Service Fabric have unique names represented as URIs, for example, `"fabric:/MyApplication/MyService"`. The name of the service does not change over the lifetime of the service, it's only the endpoint addresses that can change when services move. This is analogous to websites that have constant URLs but where the IP address may change. And similar to DNS on the web, which resolves website URLs to IP addresses, Service Fabric has a registrar that maps service names to their endpoint address.

![service endpoints][2]

Resolving and connecting to services involves the following steps run in a loop:

* **Resolve**: Get the endpoint that a service has published from the Naming Service.

* **Connect**: Connect to the service over whatever protocol it uses on that endpoint.

* **Retry**: A connection attempt may fail for any number of reasons, for example if the service has moved since the last time the endpoint address was resolved. In that case, the preceding resolve and connect steps need to be retried, and this cycle is repeated until the connection succeeds.

## Connections from external clients

Services connecting to each other inside a cluster generally can directly access the endpoints of other services because the nodes in a cluster are usually on the same local network. In some environments, however, a cluster may be behind a load balancer that routes external ingress traffic through a limited set of ports. In these cases, services can still communicate with each other and resolve addresses using the Naming Service, but extra steps must be taken to allow external clients to connect to services.

## Service Fabric in Azure

A Service Fabric cluster in Azure is placed behind an Azure Load Balancer. All external traffic to the cluster must pass through the load balancer. The load balancer will automatically forward traffic inbound on a given port to a random *node* that has the same port open. The Azure Load Balancer only knows about ports open on the *nodes*, it does not know about ports open by individual *services*. 

![Azure Load Balancer and Service Fabric topology][3]

For example, in order to accept external traffic on port **80**, the following things must be configured:

1. Write a service the listens on port 80. Configure port 80 in the service's ServiceManifest.xml and open a listener in the service, for example, a self-hosted web server.
 
    ```xml
    <Resources>
        <Endpoints>
            <Endpoint Name="WebEndpoint" Protocol="http" Port="80" />
        </Endpoints>
    </Resources>
    ```
    ```csharp
        class HttpCommunicationListener : ICommunicationListener
        {
            ...
            
            public Task<string> OpenAsync(CancellationToken cancellationToken)
            {
                EndpointResourceDescription endpoint = 
                    serviceContext.CodePackageActivationContext.GetEndpoint("WebEndpoint");

                string uriPrefix = $"{endpoint.Protocol}://+:{endpoint.Port}/myapp/";

                this.httpListener = new HttpListener();
                this.httpListener.Prefixes.Add(uriPrefix);
                this.httpListener.Start();

                string uriPublished = uriPrefix.Replace("+", FabricRuntime.GetNodeContext().IPAddressOrFQDN);

                return Task.FromResult(this.publishUri);
            }
            
            ...
        }
        
        class WebService : StatelessService
        {
            ...
            
            protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
            {
                return new[] {new ServiceInstanceListener(context => new HttpCommunicationListener(context))};
            }
            
            ...
        }
    ```
  
2. Create a Service Fabric Cluster in Azure and specify port **80** as a custom endpoint port for the node type that will host the service. If you have more than one node type, you can set up a *placement constraint* on the service to ensure it only runs on the node type that has the custom endpoint port opened.

    ![Open a port on a node type][4]

3. Once the cluster has been created, configure the Azure Load Balancer in the cluster's Resource Group to forward traffic on port 80. When creating a cluster through the Azure portal, this is set up automatically for each custom endpoint port that was configured.

    ![Forward traffic in the Azure Load Balancer][5]

4. The Azure Load Balancer uses a probe to determine whether or not to send traffic to a particular node. The probe periodically checks an endpoint on each node to determine whether or not the node is responding. If the probe fails to receive a response after a configured number of times, the load balancer stops sending traffic to that node. When creating a cluster through the Azure portal, a probe is automatically set up for each custom endpoint port that was configured.

    ![Forward traffic in the Azure Load Balancer][8]

It's important to remember that the Azure Load Balancer and the probe only know about the *nodes*, not the *services* running on the nodes. The Azure Load Balancer will always send traffic to nodes that respond to the probe, so care must be taken to ensure services are available on the nodes that are able to respond to the probe.

## Built-in communication API options
The Reliable Services framework ships with several pre-built communication options. The decision about which one will work best for you depends on the choice of the programming model, the communication framework, and the programming language that your services are written in.

* **No specific protocol:**  If you don't have a particular choice of communication framework, but you want to get something up and running quickly, then the ideal option for you is [service remoting](service-fabric-reliable-services-communication-remoting.md), which allows strongly-typed remote procedure calls for Reliable Services and Reliable Actors. This is the easiest and fastest way to get started with service communication. Service remoting handles resolution of service addresses, connection, retry, and error handling. Note that service remoting is only available to C# applications.

* **HTTP**: For language-agnostic communication, HTTP provides an industry-standard choice with tools and HTTP servers available in many different langauges, all supported by Service Fabric. Services can use any HTTP stack available, including [ASP.NET Web API](service-fabric-reliable-services-communication-webapi.md). Clients written in C# can leverage the [`ICommunicationClient` and `ServicePartitionClient` classes](service-fabric-reliable-services-communication.md) for service resolution, HTTP connections, and retry loops.

* **WCF**: If you have existing code that uses WCF as your communication framework, then you can use the `WcfCommunicationListener` for the server side and `WcfCommunicationClient` and `ServicePartitionClient` classes for the client. For more details, see this article about [WCF-based implementation of the communication stack](service-fabric-reliable-services-communication-wcf.md).

## Using custom protocols and other communication frameworks
Services can use any protocol or framework for communication, whether its a custom binary protocol over TCP sockets, or streaming events through [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) or [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/). Service Fabric provides communication APIs that you can plug your communication stack into, while all the work to discover and connect is abstracted from you. See this article about the [Reliable Service communication model](service-fabric-reliable-services-communication.md) for more details.

## Next steps

Learn more about the concepts and APIs available in the [Reliable Services communication model](service-fabric-reliable-services-communication.md), then get started quickly with [service remoting](service-fabric-reliable-services-communication-remoting.md) or go in-depth to learn how to write a communication listener using [Web API with OWIN self-host](service-fabric-reliable-services-communication-webapi.md).

[1]: ./media/service-fabric-connect-and-communicate-with-services/serviceendpoints.png
[2]: ./media/service-fabric-connect-and-communicate-with-services/namingservice.png
[3]: ./media/service-fabric-connect-and-communicate-with-services/loadbalancertopology.png
[4]: ./media/service-fabric-connect-and-communicate-with-services/nodeport.png
[5]: ./media/service-fabric-connect-and-communicate-with-services/loadbalancerport.png
[7]: ./media/service-fabric-connect-and-communicate-with-services/distributedservices.png
[8]: ./media/service-fabric-connect-and-communicate-with-services/loadbalancerprobe.png