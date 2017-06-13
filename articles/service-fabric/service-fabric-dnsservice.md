---
title: Azure Service Fabric DNS service | Microsoft Docs
description: Use Service Fabric's dns service for discovering microservices from inside the cluster.
services: service-fabric
documentationcenter: .net
author: msfussell
manager: timlt
editor: vturecek

ms.assetid: 47f5c1c1-8fc8-4b80-a081-bc308f3655d3
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 5/9/2017
ms.author: msfussell

---
# DNS Service in Azure Service Fabric
The DNS Service is an optional system service that you can enable in your cluster to discover other services using the DNS protocol.

Many services, especially containerized services, can have an existing URL name, and being able to resolve these using the standard DNS protocol (rather than the Naming Service protocol) is very convenient, especially in application "lift and shift" scenarios. The DNS service enables you to map DNS names to a service name and hence resolve endpoint IP addresses. 

As shown in the following diagram, the DNS service, running in the Service Fabric cluster,maps DNS names to service names which are then resolved by the Naming Service to return the endpoint addresses to connect to. The DNS name for the service is provided at the time of creation. 

![service endpoints][0]

## Enabling the DNS service
First you need to enable the DNS service in your cluster. Get the template for the cluster that you want to deploy. You can either use the [sample templates](https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype)  or create a Resource Manager template. You can enable the DNS service with the following steps:

1. First check that the `apiversion` is set to `2017-07-01-preview` for the `Microsoft.ServiceFabric/clusters` resource as shown in the following snippet. If it is different then you need to update the `apiVersion` to the value `2017-07-01-preview`

    ```json
    {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

2. Now enable the DNS service by adding following `addonFeatures` section after the `fabricSettings` section as shown below

    ```json
        "fabricSettings": [
        ...      
        ],
        "addonFeatures": [
            "DnsService"
        ],
    ```

3. Once you have updated your cluster template with these change, apply them and let the upgrade complete. Once complete, you will now see the DNS system service running in your cluster which is called `fabric:/System/DnsService` under system service section in the Service Fabric explorer. 

## Setting the DNS name for your service
Now that the DNS service is running in your cluster, you can set a DNS name for your services either declaratively for default services in the `ApplicationManifest.xml` or through Powershell.

### Setting the DNS name for a default service in the ApplicationManifest.xml
Open your project in Visual Studio, or your favorite editor, and open the `ApplicationManifest.xml` file. Go to the default services section, and for each service add the `ServiceDnsName` attribute. The following example shows how to set the DNS name of the service to `service1.application1`

```xml
    <Service Name="Stateless1" ServiceDnsName="service1.application1">
    <StatelessService ServiceTypeName="Stateless1Type" InstanceCount="[Stateless1_InstanceCount]">
        <SingletonPartition />
    </StatelessService>
    </Service>
```
Now deploy your application. Once the application is deployed, navigate to the service instance in the Service Fabric explorer and you can see the DNS name for this instance, as shown below. 

![service endpoints][1]

### Setting the DNS name for a service using Powershell
You can set the DNS name for a service when creating it using the `New-ServiceFabricService` Powershell. The following example creates a new stateless service with the DNS name `service1.application1`

```powershell
    New-ServiceFabricService `
    -Stateless `
    -PartitionSchemeSingleton `
    -ApplicationName `fabric:/application1 `
    -ServiceName fabric:/application1/service1 `
    -ServiceTypeName Service1Type `
    -InstanceCount 1 `
    -ServiceDnsName service1.application1
```

## Using DNS in your services
If you deploy more than one service you can find the endpoints of other services to communicate with  by using a DNS name. This only applies to stateless services, since the DNS protocol does not know who to communicate with stateful services. For stateful services you can use the built in reverse proxy for http calls to call a particular service partition.

The following code shows how to call another service, which is simply a regular http call. Note that you will have to provide the port and any optional path as part of the URL.

```csharp
public class ValuesController : Controller
{
    // GET api
    [HttpGet]
    public async Task<string> Get()
    {
        string result = "";
        try
        {
            Uri uri = new Uri("http://service1.application1:8080/api/values");
            HttpClient client = new HttpClient();
            var response = await client.GetAsync(uri);
            result = await response.Content.ReadAsStringAsync();
            
        }
        catch (Exception e)
        {
            Console.Write(e.Message);
        }

        return result;
    }
}
```

## Next steps
Learn more about service communication within the cluster with  [connect and communicate with services](service-fabric-connect-and-communicate-with-services.md)

[0]: ./media/service-fabric-connect-and-communicate-with-services/dns.png
[1]: ./media/service-fabric-dnsservice/servicefabric-explorer-dns.PNG
