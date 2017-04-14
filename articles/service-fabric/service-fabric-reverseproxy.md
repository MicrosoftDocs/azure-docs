---
title: Azure Service Fabric reverse proxy | Microsoft Docs
description: Use Service Fabric's reverse proxy for communication to microservices from inside and outside the cluster.
services: service-fabric
documentationcenter: .net
author: BharatNarasimman
manager: timlt
editor: vturecek

ms.assetid: 47f5c1c1-8fc8-4b80-a081-bc308f3655d3
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: required
ms.date: 04/07/2017
ms.author: bharatn

---
# Reverse proxy in Azure Service Fabric
The reverse proxy that's built into Azure Service Fabric addresses microservices in the Service Fabric cluster that exposes HTTP endpoints.

## Microservices communication model
Microservices in Service Fabric typically run on a subset of virtual machines in the cluster and can move from one virtual machine to another for various reasons. So, the endpoints for microservices can change dynamically. The typical pattern to communicate to the microservice is the following resolve loop:

1. Resolve the service location initially through the naming service.
2. Connect to the service.
3. Determine the cause of connection failures, and resolve the service location again when necessary.

This process generally involves wrapping client-side communication libraries in a retry loop that implements the service resolution and retry policies.
For more information, see [Connect and communicate with services](service-fabric-connect-and-communicate-with-services.md).

### Communicating by using the reverse proxy
The reverse proxy in Service Fabric runs on all the nodes in the cluster. It performs the entire service resolution process on a client's behalf and then forwards the client request. So, clients that run on the cluster can use any client-side HTTP communication libraries to talk to the target service by using the reverse proxy that runs locally on the same node.

![Internal communication][1]

## Reaching microservices from outside the cluster
The default external communication model for microservices is an opt-in model where each service cannot be accessed directly from external clients. [Azure Load Balancer](../load-balancer/load-balancer-overview.md), which is a network boundary between microservices and external clients, performs network address translation and forwards external requests to internal IP:port endpoints. To make a microservice's endpoint directly accessible to external clients, you must first configure Load Balancer to forward traffic to each port that the service uses in the cluster. Furthermore, most microservices, especially stateful microservices, don't live on all nodes of the cluster. The microservices can move between nodes on failover. In such cases, Load Balancer cannot effectively determine the location of the target node of the replicas to which it should forward traffic.

### Reaching microservices via the reverse proxy from outside the cluster
Instead of configuring the port of an individual service in Load Balancer, you can configure just the port of the reverse proxy in Load Balancer. This configuration lets clients outside the cluster reach services inside the cluster by using the reverse proxy without additional configuration.

![External communication][0]

> [!WARNING]
> When you configure the reverse proxy's port in Load Balancer, all microservices in the cluster that expose an HTTP endpoint are addressable from outside the cluster.
>
>


## URI format for addressing services by using the reverse proxy
The reverse proxy uses a specific uniform resource identifier (URI) format to identify the service partition to which the incoming request should be forwarded:

```
http(s)://<Cluster FQDN | internal IP>:Port/<ServiceInstanceName>/<Suffix path>?PartitionKey=<key>&PartitionKind=<partitionkind>&ListenerName=<listenerName>&TargetReplicaSelector=<targetReplicaSelector>&Timeout=<timeout_in_seconds>
```

* **http(s):** The reverse proxy can be configured to accept HTTP or HTTPS traffic. For HTTPS traffic, Secure Sockets Layer (SSL) termination occurs at the reverse proxy. The reverse proxy uses HTTP to forward requests to services in the cluster.

    Note that HTTPS services are not currently supported.
* **Cluster fully qualified domain name (FQDN) | internal IP:** For external clients, you can configure the reverse proxy so that it is reachable through the cluster domain, such as mycluster.eastus.cloudapp.azure.com. By default, the reverse proxy runs on every node. For internal traffic, the reverse proxy can be reached on localhost or on any internal node IP, such as 10.0.0.1.
* **Port:** This is the port, such as 19008, that has been specified for the reverse proxy.
* **ServiceInstanceName:** This is the fully-qualified name of the deployed service instance that you are trying to reach without the "fabric:/" scheme. For example, to reach the *fabric:/myapp/myservice/* service, you would use *myapp/myservice*.
* **Suffix path:** This is the actual URL path, such as *myapi/values/add/3*, for the service that you want to connect to.
* **PartitionKey:** For a partitioned service, this is the computed partition key of the partition that you want to reach. Note that this is *not* the partition ID GUID. This parameter is not required for services that use the singleton partition scheme.
* **PartitionKind:** This is the service partition scheme. This can be 'Int64Range' or 'Named'. This parameter is not required for services that use the singleton partition scheme.
* **ListenerName** The endpoints from the service are of the form {"Endpoints":{"Listener1":"Endpoint1","Listener2":"Endpoint2" ...}}. When the service exposes multiple endpoints, this identifies the endpoint that the client request should be forwarded to. This can be omitted if the service has only one listener.
* **TargetReplicaSelector** This specifies how the target replica or instance should be selected.
  * When the target service is stateful, the TargetReplicaSelector can be one of the following:  'PrimaryReplica', 'RandomSecondaryReplica', or 'RandomReplica'. When this parameter is not specified, the default is 'PrimaryReplica'.
  * When the target service is stateless, reverse proxy picks a random instance of the service partition to forward the request to.
* **Timeout:**  This specifies the timeout for the HTTP request created by the reverse proxy to the service on behalf of the client request. The default value is 60 seconds. This is an optional parameter.

### Example usage
As an example, let's take the *fabric:/MyApp/MyService* service that opens an HTTP listener on the following URL:

```
http://10.0.0.5:10592/3f0d39ad-924b-4233-b4a7-02617c6308a6-130834621071472715/
```

Following are the resources for the service:

* `/index.html`
* `/api/users/<userId>`

If the service uses the singleton partitioning scheme, the *PartitionKey* and *PartitionKind* query string parameters are not required, and the service can be reached by using the gateway as:

* Externally: `http://mycluster.eastus.cloudapp.azure.com:19008/MyApp/MyService`
* Internally: `http://localhost:19008/MyApp/MyService`

If the service uses the Uniform Int64 partitioning scheme, the *PartitionKey* and *PartitionKind* query string parameters must be used to reach a partition of the service:

* Externally: `http://mycluster.eastus.cloudapp.azure.com:19008/MyApp/MyService?PartitionKey=3&PartitionKind=Int64Range`
* Internally: `http://localhost:19008/MyApp/MyService?PartitionKey=3&PartitionKind=Int64Range`

To reach the resources that the service exposes, simply place the resource path after the service name in the URL:

* Externally: `http://mycluster.eastus.cloudapp.azure.com:19008/MyApp/MyService/index.html?PartitionKey=3&PartitionKind=Int64Range`
* Internally: `http://localhost:19008/MyApp/MyService/api/users/6?PartitionKey=3&PartitionKind=Int64Range`

The gateway will then forward these requests to the service's URL:

* `http://10.0.0.5:10592/3f0d39ad-924b-4233-b4a7-02617c6308a6-130834621071472715/index.html`
* `http://10.0.0.5:10592/3f0d39ad-924b-4233-b4a7-02617c6308a6-130834621071472715/api/users/6`

## Special handling for port-sharing services
Azure Application Gateway attempts to resolve a service address again and retry the request when a service cannot be reached. This is a major benefit of Application Gateway because client code does not need to implement its own service resolution and resolve loop.

Generally, when a service cannot be reached, the service instance or replica has moved to a different node as part of its normal lifecycle. When this happens, Application Gateway might receive a network connection error indicating that an endpoint is no longer open on the originally resolved address.

However, replicas or service instances can share a host process and might also share a port when hosted by an http.sys-based web server, including:

* [System.Net.HttpListener](https://msdn.microsoft.com/library/system.net.httplistener%28v=vs.110%29.aspx)
* [ASP.NET Core WebListener](https://docs.asp.net/latest/fundamentals/servers.html#weblistener)
* [Katana](https://www.nuget.org/packages/Microsoft.AspNet.WebApi.OwinSelfHost/)

In this situation, it is likely that the web server is available in the host process and responding to requests, but the resolved service instance or replica is no longer available on the host. In this case, the gateway will receive an HTTP 404 response from the web server. Thus, an HTTP 404 has two distinct meanings:

- Case #1: The service address is correct, but the resource that the user requested does not exist.
- Case #2: The service address is incorrect, and the resource that the user requested might exist on a different node.

The first case is a normal HTTP 404, which is considered a user error. However, in the second case, the user has requested a resource that does exist. Application Gateway was unable to locate it because the service itself has moved. Application Gateway needs to resolve the address again and retry the request.

Application Gateway thus needs a way to distinguish between these two cases. To make that distinction, a hint from the server is required.

* By default, Application Gateway assumes case #2 and attempts to resolve and issue the request again.
* To indicate case #1 to Application Gateway, the service should return the following HTTP response header:

  `X-ServiceFabric : ResourceNotFound`

This HTTP response header indicates a normal HTTP 404 situation in which the requested resource does not exist, and Application Gateway will not attempt to resolve the service address again.

## Setup and configuration
You can use the [Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md) to enable the reverse proxy in Service Fabric for the cluster.

Refer to [Configure HTTPS Reverse Proxy in a secure cluster](https://github.com/ChackDan/Service-Fabric/tree/master/ARM Templates/ReverseProxySecureSample#configure-https-reverse-proxy-in-a-secure-cluster) for Azure Resource Manager template samples to configure secure reverse proxy with a certificate and handling certificate rollover.

First, you get the template for the cluster that you want to deploy. You can either use the sample templates or create a custom Resource Manager template. Then, you can enable the reverse proxy by using the following steps:

1. Define a port for the reverse proxy in the [Parameters section](../azure-resource-manager/resource-group-authoring-templates.md) of the template.

    ```json
    "SFReverseProxyPort": {
        "type": "int",
        "defaultValue": 19008,
        "metadata": {
            "description": "Endpoint for Service Fabric Reverse proxy"
        }
    },
    ```
2. Specify the port for each of the nodetype objects in the **Cluster** [Resource type section](../azure-resource-manager/resource-group-authoring-templates.md).

    The port is identified by the parameter name, reverseProxyEndpointPort.

    ```json
    {
        "apiVersion": "2016-09-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
       "nodeTypes": [
          {
           ...
           "reverseProxyEndpointPort": "[parameters('SFReverseProxyPort')]",
           ...
          },
        ...
        ],
        ...
    }
    ```
3. To address the reverse proxy from outside the Azure cluster, set up the Azure Load Balancer rules for the port that you specified in step 1.

    ```json
    {
        "apiVersion": "[variables('lbApiVersion')]",
        "type": "Microsoft.Network/loadBalancers",
        ...
        ...
        "loadBalancingRules": [
            ...
            {
                "name": "LBSFReverseProxyRule",
                "properties": {
                    "backendAddressPool": {
                        "id": "[variables('lbPoolID0')]"
                    },
                    "backendPort": "[parameters('SFReverseProxyPort')]",
                    "enableFloatingIP": "false",
                    "frontendIPConfiguration": {
                        "id": "[variables('lbIPConfig0')]"
                    },
                    "frontendPort": "[parameters('SFReverseProxyPort')]",
                    "idleTimeoutInMinutes": "5",
                    "probe": {
                        "id": "[concat(variables('lbID0'),'/probes/SFReverseProxyProbe')]"
                    },
                    "protocol": "tcp"
                }
            }
        ],
        "probes": [
            ...
            {
                "name": "SFReverseProxyProbe",
                "properties": {
                    "intervalInSeconds": 5,
                    "numberOfProbes": 2,
                    "port":     "[parameters('SFReverseProxyPort')]",
                    "protocol": "tcp"
                }
            }  
        ]
    }
    ```
4. To configure SSL certificates on the port for the reverse proxy, add the certificate to the ***reverseProxyCertificate*** property in the **Cluster** [Resource type section](../resource-group-authoring-templates.md).

    ```json
    {
        "apiVersion": "2016-09-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        "dependsOn": [
            "[concat('Microsoft.Storage/storageAccounts/', parameters('supportLogStorageAccountName'))]"
        ],
        "properties": {
            ...
            "reverseProxyCertificate": {
                "thumbprint": "[parameters('sfReverseProxyCertificateThumbprint')]",
                "x509StoreName": "[parameters('sfReverseProxyCertificateStoreName')]"
            },
            ...
            "clusterState": "Default",
        }
    }
    ```

### Supporting a reverse proxy certificate that's different from the cluster certificate
 If the reverse proxy certificate is different from the certificate that secures the cluster, then the previously specified certificate should be installed on the virtual machine and added to the access control list (ACL) so that Service Fabric can access it. This can be done in the **virtualMachineScaleSets** [Resource type section](../resource-group-authoring-templates.md). For installation, add that certificate to the osProfile. The extension section of the template can update the certificate in the ACL.

  ```json
  {
    "apiVersion": "[variables('vmssApiVersion')]",
    "type": "Microsoft.Compute/virtualMachineScaleSets",
    ....
      "osProfile": {
          "adminPassword": "[parameters('adminPassword')]",
          "adminUsername": "[parameters('adminUsername')]",
          "computernamePrefix": "[parameters('vmNodeType0Name')]",
          "secrets": [
            {
              "sourceVault": {
                "id": "[parameters('sfReverseProxySourceVaultValue')]"
              },
              "vaultCertificates": [
                {
                  "certificateStore": "[parameters('sfReverseProxyCertificateStoreValue')]",
                  "certificateUrl": "[parameters('sfReverseProxyCertificateUrlValue')]"
                }
              ]
            }
          ]
        }
   ....
   "extensions": [
          {
              "name": "[concat(parameters('vmNodeType0Name'),'_ServiceFabricNode')]",
              "properties": {
                      "type": "ServiceFabricNode",
                      "autoUpgradeMinorVersion": false,
                      ...
                      "publisher": "Microsoft.Azure.ServiceFabric",
                      "settings": {
                        "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
                        "nodeTypeRef": "[parameters('vmNodeType0Name')]",
                        "dataPath": "D:\\\\SvcFab",
                        "durabilityLevel": "Bronze",
                        "testExtension": true,
                        "reverseProxyCertificate": {
                          "thumbprint": "[parameters('sfReverseProxyCertificateThumbprint')]",
                          "x509StoreName": "[parameters('sfReverseProxyCertificateStoreValue')]"
                        },
                  },
                  "typeHandlerVersion": "1.0"
              }
          },
      ]
    }
  ```
> [!NOTE]
> When you use certificates that are different from the cluster certificate to enable the reverse proxy on an existing cluster, install the reverse proxy certificate and update the ACL on the cluster before you enable the reverse proxy. Complete the [Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md) deployment by using the settings mentioned previously before you start a deployment to enable the reverse proxy in steps 1-4.

## Next steps
* See an example of HTTP communication between services in a [sample project on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started).
* [Remote procedure calls with Reliable Services remoting](service-fabric-reliable-services-communication-remoting.md)
* [Web API that uses OWIN in Reliable Services](service-fabric-reliable-services-communication-webapi.md)
* [WCF communication by using Reliable Services](service-fabric-reliable-services-communication-wcf.md)

[0]: ./media/service-fabric-reverseproxy/external-communication.png
[1]: ./media/service-fabric-reverseproxy/internal-communication.png
