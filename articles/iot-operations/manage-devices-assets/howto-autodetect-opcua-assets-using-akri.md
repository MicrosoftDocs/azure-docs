---
title: Discover OPC UA data sources using Azure IoT Akri
description: How to discover and configure OPC UA data sources at  the edge automatically by using Azure IoT Akri
author: dominicbetts
ms.author: dobett
ms.subservice: akri
ms.topic: how-to 
ms.date: 05/15/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to discover and create OPC UA data sources in my industrial edge environment so that I can reduce manual configuration overhead. 
---

# Discover OPC UA data sources using Azure IoT Akri Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to discover OPC UA data sources automatically. After you deploy Azure IoT Operations Preview, you configure Azure IoT Akri Preview to discover OPC UA data sources at the edge. Azure IoT Akri creates custom resources in your Kubernetes cluster that represent the data sources it discovers. The ability to discover OPC UA data sources removes the need to [manually configure them by using the Azure IoT Operations (preview) portal](howto-manage-assets-remotely.md).

> [!IMPORTANT]
> Currently, you can't use Azure Device Registry to manage the assets that Azure IoT Akri discovers and creates.

Azure IoT Akri enables you to detect and create assets in the address space of an OPC UA server. The OPC UA asset detection generates `AssetType` and `Asset` custom resources for [OPC UA Device Integration (DI) specification](https://reference.opcfoundation.org/DI/v104/docs/) compliant assets.

## Prerequisites

- Install Azure IoT Operations Preview. To install Azure IoT Operations for demonstration and exploration purposes, see [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).
- Verify that the Azure IoT Akri pods are properly configured by running the following command:

    ```bash
    kubectl get pods -n azure-iot-operations
    ```

    The output includes lines that show the Akri agent and discovery handler pods are running:

    ```output
    NAME                                             READY   STATUS    RESTARTS   AGE
    aio-akri-agent-daemonset-hwpc7                   1/1     Running   0          17m
    akri-opcua-asset-discovery-daemonset-dwn2q       1/1     Running   0          8m28s
    ```

## Configure the OPC UA discovery handler

To configure the OPC UA discovery handler for asset detection, create a YAML configuration file that contains the values described in this section:

| Name | Mandatory | Datatype | Default | Comment |
| ---- | --------- | -------- | ------- | ------- |
| `EndpointUrl`                     | true    | String   | null    | The OPC UA endpoint URL to use for asset discovery |
| `AutoAcceptUntrustedCertificates` | true ¹ | Boolean  | false   | Should the client autoaccept untrusted certificates? A certificate can only be autoaccepted as trusted if no nonsuppressible errors occurred during chain validation. For example, a certificate with incomplete chain isn't accepted. |
| `UseSecurity`                     | true ¹ | Boolean  | true    | Should the client use a secure connection? |
| `UserName`                        | false             | String   | null    | The username for user authentication. ² |
| `Password`                        | false             | String   | null    | The password for user authentication. ² |

¹ The current version of the discovery handler only supports `UseSecurity=false` and requires `autoAcceptUntrustedCertificates=true`.  
² A temporary implementation until Azure IoT Akri can pass Kubernetes secrets.

The following example demonstrates discovery of an OPC PLC server. You can add the asset parameters for multiple OPC PLC servers.

1. To create the YAML configuration file, copy and paste the following content into a new file, and save it as `opcua-configuration.yaml`:

    If you're using the simulated PLC server that was deployed with the Azure IoT Operations Quickstart, you don't need to change the `endpointUrl`. If you have your own OPC UA servers running or are using the simulated PLC servers deployed on Azure, add in your endpoint URL accordingly. Discovery endpoint URLs look like `opc.tcp://<FQDN>:50000/`. To find the FQDNs of your OPC PLC servers, navigate to your deployment in the Azure portal. For each server, copy and paste the **FQDN** value into your endpoint URLs.

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

1. To apply the configuration, run the following command:

    ```bash
    kubectl apply -f opcua-configuration.yaml -n azure-iot-operations
    ```

## Verify the configuration

To confirm that the asset discovery container is configured and running:

1. Use the following command to check the pod logs:

    ```bash
    kubectl logs <insert aio-akri-opcua-asset-discovery pod name> -n azure-iot-operations
    ```

    A log from the `aio-akri-opcua-asset-discovery` pod indicates after a few seconds that the discovery handler registered itself with Azure IoT Akri:

    ```output
    2023-06-07 10:45:27.395 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Akri OPC UA Asset Detection (0.2.0-alpha.203+Branch.main.Sha.cd4045345ad0d148cca4098b68fc7da5b307ce13) is starting with the process id: 1
    2023-06-07 10:45:27.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Got IP address of the pod from POD_IP environment variable.
    2023-06-07 10:45:28.695 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Registered with Akri system with Name opcua-asset for http://10.1.0.92:80 with type: Network as shared: True
    2023-06-07 10:45:28.696 +00:00 info: OpcUaAssetDetection.Akri.Program[0]      Press CTRL+C to exit
    ```

    After about a minute, Azure IoT Akri issues the first discovery request based on the configuration:

    ```output
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

    After the discovery is complete, the discovery handler sends the result back to Azure IoT Akri to create an Akri instance custom resource with asset information and observable variables. The discovery handler repeats the discovery every 10 minutes to detect any changes on the server.

1. To view the discovered Azure IoT Akri instances, run the following command:

    ```bash
    kubectl get akrii -n azure-iot-operations
    ```

    The output from the previous command looks like the following example. You might need to wait for a few seconds for the Akri instance to be created:

    ```output
    NAMESPACE              NAME                      CONFIG             SHARED   NODES            AGE
    azure-iot-operations   akri-opcua-asset-dbdef0   akri-opcua-asset   true     ["my-aio-vm"]   35m
    ```

    The OPC UA Connector supervisor watches for new Azure IoT Akri instance custom resources of type `opc-ua-asset`, and generates the initial asset types and asset custom resources for them. You can modify asset custom resources by adding settings such as extended publishing for more data points, or OPC UA Broker observability settings.

1. To confirm that the Akri instance properly connected to the OPC UA Broker, run the following command. Replace the placeholder with the name of the Akri instance that was included in the output of the previous command:

    ```bash
    kubectl get akrii <AKRI_INSTANCE_NAME> -n azure-iot-operations -o json
    ```

    The command output includes a section that looks like the following example. The snippet shows the Akri instance `brokerProperties` values and confirms that the OPC UA Broker is connected.

    ```json
    "spec": {
    
            "brokerProperties": {
                "ApplicationUri": "Boiler #2",
                "AssetEndpointProfile": "{\"spec\":{\"uuid\":\"opc-ua-broker-opcplc-000000-azure-iot-operation\"……   
    ```
