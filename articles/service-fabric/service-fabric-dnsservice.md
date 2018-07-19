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
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 7/27/2017
ms.author: msfussell

---
# DNS Service in Azure Service Fabric
The DNS Service is an optional system service that you can enable in your cluster to discover other services using the DNS protocol. 

Many services, especially containerized services, are addressable through a pre-existing URL. Being able to resolve these services using the standard DNS protocol, rather than the Service Fabric Naming Service protocol, is desirable. The DNS service enables you to map DNS names to a service name and hence resolve endpoint IP addresses. Such functionality maintains the portablity of containerized services across different platforms and can make  "lift and shift" scenarios easier, by letting you use existing service URLs rather than having to rewrite code to leverage the Naming Service. 

The DNS service maps DNS names to service names, which in turn are resolved by the Naming Service to return the service endpoint. The DNS name for the service is provided at the time of creation. The following diagram shows how the DNS service works for stateless services.

![service endpoints](./media/service-fabric-dnsservice/dns.png)

Beginning with Service Fabric version 6.3, the Service Fabric DNS protocol has been extended to include a scheme for addressing partitioned stateful services. These extensions make it possible to resolve specific partition IP addresses using a combination of stateful service DNS name and the partition name. All three partitioning schemes are supported:

- Named partitioning
- Ranged partitioning
- Singleton partitioning

With the Service Fabric DNS extensions, you can use the DNS service to provide the same kind of portability to your stateful Service Fabric services as was previously available only to stateless services. The following diagram shows how the DNS service works for partitioned stateful services.

![stateful service endpoints](./media/service-fabric-dnsservice/stateful-dns.png)

Dynamic ports are not supported by the DNS service. To resolve services exposed on dynamic ports, use the [reverse proxy service](./service-fabric-reverseproxy.md).

## Enabling the DNS service
When you create a cluster using the portal, the DNS service is enabled by default in the **Include DNS service** check box on the **Cluster configuration** menu:

![Enabling DNS service through the portal][2]

If you're not using the portal to create your cluster or you're updating an existing cluster, you'll need to enable the DNS service in a template:

- To deploy a new cluster, you can either use the [sample templates](https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype) or create a your own Resource Manager template. 
- To update an existing cluster, you can navigate to the cluster's resource group on the portal and click **Automation Script** to work with a template that reflects the current state of the cluster and other resources in the group. To learn more, see [Export the template from resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-export-template#export-the-template-from-resource-group).

After you have a template, you can enable the DNS service with the following steps:

1. Check that the `apiversion` is set to `2017-07-01-preview` or later for the `Microsoft.ServiceFabric/clusters` resource, and, if not, update it as shown in the following snippet:

    ```json
    {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

2. Now enable the DNS service by adding the following `addonFeatures` section after the `fabricSettings` section as shown in the following snippet: 

    ```json
        "fabricSettings": [
        ...      
        ],
        "addonFeatures": [
            "DnsService"
        ],
    ```

3. Once you have updated your cluster template with the preceding changes, apply them and let the upgrade complete. When the upgrade completes, the DNS system service starts running in your cluster. The service name is `fabric:/System/DnsService`, and you can find it under the **System** service section in Service Fabric explorer. 


## Setting the DNS name for your service
Once the DNS service is running in your cluster, you can set a DNS name for your services either declaratively for default services in the `ApplicationManifest.xml` or through PowerShell commands.

The DNS name for your service is resolvable throughout the cluster so it is important to ensure the uniqueness of the DNS name across the cluster. 

For stateless services, it is highly recommended that you use a naming scheme of `<ServiceDnsName>.<AppInstanceName>`; for example, `service1.application1`. If an application is deployed using Docker compose, services are automatically assigned DNS names using this naming scheme.

For stateful services, use the following naming scheme:
`<First-Label-Of-Partitioned-Service-DNSName><PartitionPrefix><Target-Partition-Name>< PartitionSuffix>.<Remaining- Partitioned-Service-DNSName>`

Where:

- `First-Label-Of-Partitioned-Service-DNSName` is recommended to be the service name.
- `PartitionPrefix` can be set in the DnsService section of the cluster manifest. The default value is "-".
- `Target-Partition-Name` is the name of the partition. The following restrictions apply: 
   - Partition names should be DNS compliant.
   - Multi label Partition names (that include dot, '.', in the name) should not be used.
   - Partition names should be in lower case. This is because DNS protocol and queries are case insensitive, while Service Fabric partition names are case sensitive. Keeping partition names in lower case prevents potential collisions with partitions 
- `PartitionSuffix` can be set in the DnsService section of the cluster manifest. The default value is empty string.
- `Remaining-Partitioned-Service-DNSName` is recommended to be the app instance name.

The following examples show DNS queries for a partitioned service running on a cluster that has default settings for `PartitionPrefix` and `PartitionSuffix`: 

- To resolve partition “0” of a partitioned service with DNS name `BackendRangedSchemeSvc.Application`, use `BackendRangedSchemeSvc-0.Application`.
- To resolve partition “first” of a partitioned service with DNS name `BackendNamedSchemeSvc.Application`, use `BackendNamedSchemeSvc-first.Application`

For stateful services, the DNS service returns the IP address of the primary replica of the partition. If no partition is specified, the service returns the IP address of the primary replica of a randomly selected partition.


### Setting the DNS name for a default service in the ApplicationManifest.xml
Open your project in Visual Studio, or your favorite editor, and open the `ApplicationManifest.xml` file. Go to the default services section, and for each service add the `ServiceDnsName` attribute. The following example shows how to set the DNS name of the service to `service1.application1`

```xml
    <Service Name="Stateless1" ServiceDnsName="service1.application1">
      <StatelessService ServiceTypeName="Stateless1Type" InstanceCount="[Stateless1_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
```
Once the application is deployed, the service instance in the Service Fabric Explorer shows the DNS name for this instance, as shown in the following figure: 

![service endpoints][1]

The following example shows the setting a DNS name for a stateful partitioned service to `statefulsvc.app`. Notice that the partition names are lower-case in observance of the guidance in the previous section.

```xml
    <Service Name="StatefulSvc" ServiceDnsName="statefulsvc.app" />
      <StatefulService ServiceTypeName="ProcessingType" TargetReplicaSetSize="2" MinReplicaSetSize="2">
        <NamedPartition>
         <Partition Name="partition1" />
         <Partition Name="partition2" />
        </NamedPartition>
      </StatefulService>
    </Service>
```

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
If you deploy more than one service, you can find the endpoints of other services to communicate with  by using a DNS name. The DNS service works for stateless services, and, in Service Fabric version 6.3 and later, for stateful services. For stateful services running on versions of Service Fabric prior to 6.3, you can use the built-in [reverse proxy service](./service-fabric-reverseproxy.md) for http calls to call a particular service partition. 

Dynamic ports are not supported by the DNS service. You can use the built-in [reverse proxy service](./service-fabric-reverseproxy.md) to resolve services that use dynamic ports.

The following code shows how to call a stateless service through DNS. It is simply regular http call where you provide the DNS name, the port, and any optional path as part of the URL.

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

The following code shows a call on a specific partition of a stateful service. In this case, the DNS name contains the partition name (partition1). The call assumes a cluster with default values for `PartitionPrefix` and `PartitionSuffix`.

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
            Uri uri = new Uri("http://service2-partition1.application1:8080/api/values");
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
[2]: ./media/service-fabric-dnsservice/DNSService.PNG
