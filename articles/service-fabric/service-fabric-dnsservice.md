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

Many services, especially containerized services, can have an existing URL name, and being able to resolve them using the standard DNS protocol (rather than the Naming Service protocol) is desirable, particularly in "lift and shift" scenarios. The DNS service enables you to map DNS names to a service name and hence resolve endpoint IP addresses. 

The DNS service maps DNS names to service names, which in turn are resolved by the Naming Service to return the service endpoint. The DNS name for the service is provided at the time of creation.

![service endpoints](./media/service-fabric-dnsservice/dns.png)

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

The DNS name for your service is resolvable throughout the cluster. It is highly recommended that you use a naming scheme of `<ServiceDnsName>.<AppInstanceName>`; for example, `service1.application1`. Doing so ensures the uniqueness of the DNS name throughout the cluster. If an application is deployed using Docker compose, services are automatically assigned DNS names using this naming scheme.

### Setting the DNS name for a default service in the ApplicationManifest.xml
Open your project in Visual Studio, or your favorite editor, and open the `ApplicationManifest.xml` file. Go to the default services section, and for each service add the `ServiceDnsName` attribute. The following example shows how to set the DNS name of the service to `service1.application1`

```xml
    <Service Name="Stateless1" ServiceDnsName="service1.application1">
    <StatelessService ServiceTypeName="Stateless1Type" InstanceCount="[Stateless1_InstanceCount]">
        <SingletonPartition />
    </StatelessService>
    </Service>
```
Once the application is deployed, the service instance in the Service Fabric explorer shows the DNS name for this instance, as shown in the following figure: 

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
If you deploy more than one service, you can find the endpoints of other services to communicate with  by using a DNS name. The DNS service is only applicable to stateless services, since the DNS protocol cannot communicate with stateful services. For stateful services, you can use the built-in [reverse proxy service](./service-fabric-reverseproxy.md) for http calls to call a particular service partition. Dynamic ports are not supported by the DNS service. You can use the reverse proxy to resolve services that use dynamic ports.

The following code shows how to call another service, which is simply a regular http call where you provide the port and any optional path as part of the URL.

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
[2]: ./media/service-fabric-dnsservice/DNSService.PNG
