---
title: Troubleshooting guide for Azure Service Bus | Microsoft Docs
description: Learn about troubleshooting tips and recommendations for a few issues that you may see when using Azure Service Bus.
ms.topic: article
ms.date: 03/03/2021
---

# Troubleshooting guide for Azure Service Bus
This article provides troubleshooting tips and recommendations for a few issues that you may see when using Azure Service Bus. 

## Connectivity, certificate, or timeout issues
The following steps may help you with troubleshooting connectivity/certificate/timeout issues for all services under *.servicebus.windows.net. 

- Browse to or [wget](https://www.gnu.org/software/wget/) `https://<yournamespace>.servicebus.windows.net/`. It helps with checking whether you have IP filtering or virtual network or certificate chain issues, which are common when using java SDK.

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
- Run the following command to check if any port is blocked on the firewall. Ports used are 443 (HTTPS), 5671 (AMQP) and 9354 (Net Messaging/SBMP). Depending on the library you use, other ports are also used. Here is the sample command that check whether the 5671 port is blocked. 

    ```powershell
    tnc <yournamespacename>.servicebus.windows.net -port 5671
    ```

    On Linux:

    ```shell
    telnet <yournamespacename>.servicebus.windows.net 5671
    ```
- When there are intermittent connectivity issues, run the following command to check if there are any dropped packets. This command will try to establish 25 different TCP connections every 1 second with the service. Then, you can check how many of them succeeded/failed and also see TCP connection latency. You can download the `psping` tool from [here](/sysinternals/downloads/psping).

    ```shell
    .\psping.exe -n 25 -i 1 -q <yournamespace>.servicebus.windows.net:5671 -nobanner     
    ```
    You can use equivalent commands if you're using other tools such as `tnc`, `ping`, and so on. 
- Obtain a network trace if the previous steps don't help and analyze it using tools such as [Wireshark](https://www.wireshark.org/). Contact [Microsoft Support](https://support.microsoft.com/) if needed. 
- To find the right IP addresses to add to allow list for your connections, see [What IP addresses do I need to add to allow list](service-bus-faq.md#what-ip-addresses-do-i-need-to-add-to-allow-list). 


## Issues that may occur with service upgrades/restarts

### Symptoms
- Requests may be momentarily throttled.
- There may be a drop in incoming messages/requests.
- The log file may contain error messages.
- The applications may be disconnected from the service for a few seconds.

### Cause
Backend service upgrades and restarts may cause these issues in your applications.

### Resolution
If the application code uses SDK, the retry policy is already built in and active. The application will reconnect without significant impact to the application/workflow.

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

To learn how to assign permissions to roles, see [Authenticate a managed identity with Azure Active Directory to access Azure Service Bus resources](service-bus-managed-service-identity.md).

## Service Bus Exception: Put token failed

### Symptoms
When you try to send more than 1000 messages using the same Service Bus connection, you'll receive the following error message: 

`Microsoft.Azure.ServiceBus.ServiceBusException: Put token failed. status-code: 403, status-description: The maximum number of '1000' tokens per connection has been reached.` 

### Cause
There's a limit on number of tokens that are used to send and receive messages using a single connection to a Service Bus namespace. It's 1000. 

### Resolution
Open a new connection to the Service Bus namespace to send more messages.

## Next steps
See the following articles: 

- [Azure Resource Manager exceptions](service-bus-resource-manager-exceptions.md). It list exceptions generated when interacting with Azure Service Bus using Azure Resource Manager (via templates or direct calls).
- [Messaging exceptions](service-bus-messaging-exceptions.md). It provides a list of exceptions generated by .NET Framework for Azure Service Bus.