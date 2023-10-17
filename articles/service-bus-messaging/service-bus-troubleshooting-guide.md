---
title: Troubleshooting guide for Azure Service Bus | Microsoft Docs
description: Learn about troubleshooting tips and recommendations for a few issues that you may see when using Azure Service Bus.
ms.topic: article
ms.date: 08/29/2022
---

# Troubleshooting guide for Azure Service Bus
This article provides troubleshooting tips and recommendations for a few issues that you may see when using Azure Service Bus. 

## Connectivity, certificate, or timeout issues
The following steps may help you with troubleshooting connectivity/certificate/timeout issues for all services under *.servicebus.windows.net. 

- Browse to or [wget](https://www.gnu.org/software/wget/) `https://<yournamespace>.servicebus.windows.net/`. It helps with checking whether you have IP filtering or virtual network or certificate chain issues, which are common when using Java SDK.

    An example of successful message:
    
    ```xml
    <feed xmlns="http://www.w3.org/2005/Atom"><title type="text">Publicly Listed Services</title><subtitle type="text">This is the list of publicly-listed services currently available.</subtitle><id>uuid:27fcd1e2-3a99-44b1-8f1e-3e92b52f0171;id=30</id><updated>2019-12-27T13:11:47Z</updated><generator>Service Bus 1.1</generator></feed>
    ```
    
    An example of failure error message:

    ```xml
    <Error>
        <Code>400</Code>
        <Detail>
            Bad Request. To know more visit https://aka.ms/sbResourceMgrExceptions. . TrackingId:b786d4d1-cbaf-47a8-a3d1-be689cda2a98_G22, SystemTracker:NoSystemTracker, Timestamp:2019-12-27T13:12:40
        </Detail>
    </Error>
    ```
- Run the following command to check if any port is blocked on the firewall. Ports used are 443 (HTTPS), 5671 and 5672 (AMQP) and 9354 (Net Messaging/SBMP). Depending on the library you use, other ports are also used. Here's the sample command that check whether the 5671 port is blocked. C 

    ```powershell
    tnc <yournamespacename>.servicebus.windows.net -port 5671
    ```

    On Linux:

    ```shell
    telnet <yournamespacename>.servicebus.windows.net 5671
    ```
- When there are intermittent connectivity issues, run the following command to check if there are any dropped packets. This command tries to establish 25 different TCP connections every 1 second with the service. Then, you can check how many of them succeeded/failed and also see TCP connection latency. You can download the `psping` tool from [here](/sysinternals/downloads/psping).

    ```shell
    .\psping.exe -n 25 -i 1 -q <yournamespace>.servicebus.windows.net:5671 -nobanner     
    ```
    You can use equivalent commands if you're using other tools such as `tnc`, `ping`, and so on. 
- Obtain a network trace if the previous steps don't help and analyze it using tools such as [Wireshark](https://www.wireshark.org/). Contact [Microsoft Support](https://support.microsoft.com/) if needed. 
- To find the right IP addresses to add to allowlist for your connections, see [What IP addresses do I need to add to allowlist](service-bus-faq.yml#what-ip-addresses-do-i-need-to-add-to-allowlist-). 

[!INCLUDE [service-bus-amqp-support-retirement](../../includes/service-bus-amqp-support-retirement.md)]

## Issues that may occur with service upgrades/restarts

### Symptoms
- Requests may be momentarily throttled.
- There may be a drop in incoming messages/requests.
- The log file may contain error messages.
- The applications may be disconnected from the service for a few seconds.

### Cause
Backend service upgrades and restarts may cause these issues in your applications.

### Resolution
If the application code uses SDK, the [retry policy](/azure/architecture/best-practices/retry-service-specific#service-bus) is already built in and active. The application reconnects without significant impact to the application/workflow.

## Unauthorized access: Send claims are required

### Symptoms 
You may see this error when attempting to access a Service Bus topic from Visual Studio on an on-premises computer using a user-assigned managed identity with send permissions.

```bash
Service Bus Error: Unauthorized access. 'Send' claim\(s\) are required to perform this operation.
```

### Cause
The identity doesn't have permissions to access the Service Bus topic. 

### Resolution
To resolve this error, install the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication/) library.  For more information, see [Local development authentication](/dotnet/api/overview/azure/service-to-service-authentication#local-development-authentication). 

To learn how to assign permissions to roles, see [Authenticate a managed identity with Microsoft Entra ID to access Azure Service Bus resources](service-bus-managed-service-identity.md).

## Service Bus Exception: Put token failed

### Symptoms
You receive the following error message: 

`Microsoft.Azure.ServiceBus.ServiceBusException: Put token failed. status-code: 403, status-description: The maximum number of '1000' tokens per connection has been reached.` 

[!INCLUDE [service-bus-track-0-and-1-sdk-support-retirement](../../includes/service-bus-track-0-and-1-sdk-support-retirement.md)]

### Cause
Number of authentication tokens for concurrent links in a single connection to a Service Bus namespace has exceeded the limit: 1000. 

### Resolution
Do one of the following steps:

- Reduce the number of concurrent links in a single connection or use a new connection
- Use SDKs for Azure Service Bus, which ensures that you don't get into this situation (recommended)


## Adding virtual network rule using PowerShell fails

### Symptoms
You have configured two subnets from a single virtual network in a virtual network rule. When you try to remove one subnet using the [Remove-AzServiceBusVirtualNetworkRule](/powershell/module/az.servicebus/remove-azservicebusvirtualnetworkrule) cmdlet, it doesn't remove the subnet from the virtual network rule. 

```azurepowershell-interactive
Remove-AzServiceBusVirtualNetworkRule -ResourceGroupName $resourceGroupName -Namespace $serviceBusName -SubnetId $subnetId
```

### Cause
The Azure Resource Manager ID that you specified for the subnet may be invalid. This issue may happen when the virtual network is in a different resource group from the one that has the Service Bus namespace. If you don't explicitly specify the resource group of the virtual network, the CLI command constructs the Azure Resource Manager ID by using the resource group of the Service Bus namespace. So, it fails to remove the subnet from the network rule. 

### Resolution
Specify the full Azure Resource Manager ID of the subnet that includes the name of the resource group that has the virtual network. For example:

```azurepowershell-interactive
Remove-AzServiceBusVirtualNetworkRule -ResourceGroupName myRG -Namespace myNamespace -SubnetId "/subscriptions/SubscriptionId/resourcegroups/ResourceGroup/myOtherRG/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/mySubnet"
```

## Resource locks don't work when using the data plane SDK

### Symptoms
You have configured a delete lock on a Service Bus namespace, but you're able to delete resources in the namespace (queues, topics, etc.) by using the Service Bus Explorer. 

### Cause
Resource lock is preserved in Azure Resource Manager (control plane) and it doesn't prevent the data plane SDK call from deleting the resource directly from the namespace. The standalone Service Bus Explorer uses the data plane SDK, so the deletion goes through. 

### Resolution
We recommend that you use the Azure Resource Manager based API via Azure portal, PowerShell, CLI, or Resource Manager template to delete entities so that the resource lock prevents the resources from being accidentally deleted.

## Entity is no longer available

### Symptoms
You see an error that the entity is no longer available. 

### Cause
The resource may have been deleted. Follow these steps to identify why the entity was deleted. 

- Check the activity log to see if there's an Azure Resource Manager request for deletion. 
- Check the operational log to see if there was a direct API call for deletion. To learn how to collect an operational log, see [Collection and routing](monitor-service-bus.md#collection-and-routing). For the schema and an example of an operation log, see [Operation logs](monitor-service-bus-reference.md#operational-logs)
- Check the operation log to see if there was an `autodeleteonidle` related deletion. 


## Next steps
See the following articles: 

- [Azure Resource Manager exceptions](service-bus-resource-manager-exceptions.md). It list exceptions generated when interacting with Azure Service Bus using Azure Resource Manager (via templates or direct calls).
- [Messaging exceptions](service-bus-messaging-exceptions.md). It provides a list of exceptions generated by .NET Framework for Azure Service Bus.
