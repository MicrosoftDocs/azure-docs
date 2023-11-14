---
title: Autodetect assets using Azure IoT Akri
description: How to autodetect OPC UA assets by using Azure IoT Akri Preview
author: timlt
ms.author: timlt
# ms.subservice: akri
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/6/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to autodetect and create assets in my
# industrial edge environment so that I can reduce manual configuration overhead.
---

# Discover assets using Azure IoT Akri Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to discover OPC UA assets. After you deploy Azure IoT Operations, you configure Akri to discover OPC UA assets at the edge by using Azure IoT Akri and Akri will create custom resources into the Azure IoT Operations namespace on your cluster. The capability to discover assets simplifies the process of manually configuring assets from the cloud and onboarding them to your cluster.  

Azure IoT Akri enables you to detect and create `Assets` in the address space of an OPC UA Server. The OPC UA asset detection generates `AssetType` and `Asset` Kubernetes custom resources (CRs) for [OPC UA Device Integration (DI) specification](https://reference.opcfoundation.org/DI/v104/docs/) compliant `Assets`.  

## Prerequisites

- Azure IoT Operations Preview installed. The installation includes Azure IoT Akri. For more information, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).
- Ensure that Azure IoT Akri agent pod is properly configured by running the following code:

    ```bash
    kubectl get pods -n azure-iot-operations
    ```

    You should see the agent and discovery handler pod running:
    
    ```output
    NAME                                             READY   STATUS    RESTARTS   AGE
    aio-akri-agent-daemonset-hwpc7                   1/1     Running   0          17m
    aio-akri-opcua-asset-discovery-daemonset-dwn2q   1/1     Running   0          8m28s
    ```

## Deploy the UPC UA discovery handler

To deploy the custom OPC UA discovery handler with asset detection, first you create a YAML configuration file using the values described in this section. Before you create the file, note the following configuration details:

- The specified server contains a sample address model that uses the Robotics companion specification, which is based on the DI specification.  A model that uses these specifications is required for asset detection. The Robot contains five assets with observable variables and a `DeviceHealth` node that is automatically detected for monitoring.
- You can specify other servers by providing the `endpointUrl` and ensuring that a security `None` profile is enabled.
- To enable Azure IoT Akri to discover the servers, confirm that you specified the correct discovery endpoint URL during installation.
- Discovery URLs appear as `opc.tcp://<FQDN>:50000/`. To find the FQDNs of your OPC PLC servers, navigate to your deployments in the Azure portal. For each server, copy and paste the **FQDN** value into your discovery URLs. The following example demonstrates discovery of two OPC PLC servers. You can add the asset parameters for each OPC PLC server.  If you only have one OPC PLC server, delete one of the assets.
    

    > [!div class="mx-tdBreakAll"]
    > | Name                              | Mandatory         | Datatype | Default | Comment                                                                                                                                                                                                                                      |
    > | --------------------------------- | ----------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    > | `EndpointUrl`                     | true              | String   | null    | The OPC UA endpoint URL to use for asset discovery                                                                                                                                                                                           |
    > | `AutoAcceptUntrustedCertificates` | true ¹ | Boolean  | false   | Whether the client auto accepts untrusted certificates. A certificate can only be auto-accepted as trusted if no non-suppressible errors occurred during chain validation. For example, a certificate with incomplete chain is not accepted. |
    > | `UseSecurity`                     | true ¹ | Boolean  | true    | Whether the client should use a secure connection                                                                                                                                                                                            |
    > | `UserName`                        | false             | String   | null    | The username for user authentication. ²                                                                                                                                                                                           |
    > | `Password`                        | false             | String   | null    | The user password for user authentication. ²                                                                                                                                                                                      |
    
    ¹ The current version of the discovery handler only supports no security `UseSecurity=false` and requires `autoAcceptUntrustedCertificates=true`.  
    ² Temporary implementation until Azure IoT Akri can pass K8S secrets.


1. To create the YAML configuration file, copy and paste the following content into a new file, and save it as `opcua-configuration.yaml`. 
    
    If you're using the simulated PLC server that was deployed with the Azure IoT Operations Quickstart, you don't need to change the `endpointUrl`. If you have your own OPC UA servers running or are using the simulated PLC servers deployed on Azure, add in your endpoint URL accordingly.

    ```yaml
    apiVersion: akri.sh/v0
    kind: Configuration
    metadata:
      name: aio-akri-opcua-asset
    spec:
      discoveryHandler: 
        name: opcua-asset
        discoveryDetails: "opcuaDiscoveryMethod:\n  - asset:\n      endpointUrl: \"	opc.tcp://opcplc-000000:50000\"\n      useSecurity: false\n      autoAcceptUntrustedCertificates: true\n"
      brokerProperties: {}
      capacity: 1
    ```


2. Apply the YAML to configure Azure Iot Akri to discover the assets:

    ```bash
    kubectl apply -f opcua-configuration.yaml -n azure-iot-operations
    ```

3. To confirm that the asset discovery container is deployed and started, check the pod logs with the following command: 

    ```bash
    kubectl logs <insert aio-akri-opcua-asset-discovery pod name> -n azure-iot-operations
    ```

    A log from the `aio-akri-opcua-asset-discovery` pod indicates after a few seconds that the discovery handler registered itself with Azure IoT Akri:

    ```console
    2023-06-07 10:45:27.395 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Akri OPC UA Asset Detection (0.2.0-alpha.203+Branch.main.Sha.cd4045345ad0d148cca4098b68fc7da5b307ce13) is starting with the process id: 1
    2023-06-07 10:45:27.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Got IP address of the pod from POD_IP environment variable.
    2023-06-07 10:45:28.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Registered with Akri system with Name opcua-asset for http://10.1.0.92:80 with type: Network as shared: True
    2023-06-07 10:45:28.696 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Press CTRL+C to exit
    ```

    After about a minute, Azure IoT Akri issues the first discovery request based on the configuration:

    ```console
    2023-06-07 12:49:17.344 +00:00 dbug: Grpc.AspNetCore.Server.ServerCallHandler[10]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Reading message.
    2023-06-07 12:49:18.046 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Got discover request opcuaDiscoveryMethod:
            - asset:
                endpointUrl: "opc.tcp://opcplc-000000:50000"
                useSecurity: false
                autoAcceptUntrustedCertificates: true
           from ipv6:[::ffff:10.1.7.47]:39708
    2023-06-07 12:49:20.238 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Start asset discovery
    2023-06-07 12:49:20.242 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Discovering OPC UA endpoint opc.tcp://opcplc-000000:50000 using Asset Discovery
    ...
    2023-06-07 14:20:03.905 +00:00 info: OpcUa.Common.Dtdl.DtdlGenerator[6901]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Created DTDL_2 model for boiler_1 with 35 telemetries in 0 ms
    2023-06-07 14:20:04.208 +00:00 info: OpcUa.AssetDiscovery.Akri.CustomResources.CustomResourcesManager[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Generated 1 asset CRs from discoveryUrl opc.tcp://opcplc-000000:50000
    2023-06-07 14:20:04.208 +00:00 info: OpcUa.Common.Client.OpcUaClient[1005]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Session ns=8;i=1828048901 is closing
    ...
    2023-06-07 14:20:05.002 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Sending response to caller ...
    2023-06-07 14:20:05.003 +00:00 dbug: Grpc.AspNetCore.Server.ServerCallHandler[15]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Sending message.
    2023-06-07 14:20:05.004 +00:00 info: OpcUa.AssetDiscovery.Akri.Services.DiscoveryHandlerService[0]
          => SpanId:603279c62c9ccbb0, TraceId:15ad328e1e803c55bc6731266aae8725, ParentId:0000000000000000 => ConnectionId:0HMR7AMCHHG2G => RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HMR7AMCHHG2G:00000001
          Sent successfully
    
    ```

    After the discovery is completed, the result is sent back to Azure IoT Akri to create an Akri instance custom resource with asset information and observable variables. The discovery handler repeats the discovery every 10 minutes to detect changes on the server.

4. To view the discovered Azure IoT Akri instances, run the following command:

    ```bash
    kubectl get akrii -n azure-iot-operations
    ```

    You can inspect the instance custom resource by using an editor such as OpenLens, under `CustomResources/akri.sh/Instance`.

    The OPC UA Connector supervisor watches for new Azure IoT Akri instance custom resources of type `opc-ua-asset`, and generates the initial asset types and asset custom resources for them. You can modify asset custom resources to add settings such as extending publishing for more data points, or to add OPC UA Broker observability settings.


## Related content

- [Azure IoT Akri overview](overview-akri.md)
