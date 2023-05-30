# Azure SignalR Geo-Replication

Companies seeking local presence or requiring a robust failover system often choose to deploy services across multiple Azure regions. With the integration of geo-replication in Azure SignalR, managing multi-region scenarios has become significantly easier.

A geo-replicated Azure SignalR Service provides the following benefits:

1. **More resilient to regional outage:** If a regional outage happens, the Azure SignalR DNS will be resolved to healthy replicas in other regions.
2. **Cross Region Communication**. Different replicas could communicate with each other as if they are the same instance.
3. **Enhanced Network Speed via Azure BackBone:** Geographically dispersed clients will connect to the nearest replica instance. These instances communicate through Azure BackBone, ensuring fast, dependable network quality..
4. **Shared configurations**. All replicas retain the primary Azure SignalR Service resource's configuration. 

## Prerequisites

* An Azure SignalR Service in [Premium tier](https://azure.microsoft.com/en-us/pricing/details/signalr-service/).
* The user needs following permissions to operate on replicas:

    | Permission                                        | Description                                       |
    |---------------------------------------------------|---------------------------------------------------|
    | Microsoft.SignalRService/signalr/replicas/write   | create, update or delete a replica. |
    | Microsoft.SignalRService/signalr/replicas/read    | get meta data of a replica.|
    | Microsoft.SignalRService/signalr/replicas/action  | perform actions on a replica, such as restarting. |


## Example use case
Contoso is a social media company with its customer base spread across the US and Canada. To serve those customers and let them communicate with each other, Contoso runs its services in Central US. Azure SignalR Service is used to handle user connections and facilitate communication among users. Contoso's end users are mostly phone users. Due to the long geographical distances, end-users in Canada might experience high latency and poor network quality.

<img width="633" alt="image" src="https://github.com/bjqian/azure-docs/assets/16233725/a353337f-9fd7-4be2-9b0f-1bf961f7eb1a">

Before the advent of the geo-replication feature, Contoso could setup another Azure SignalR Service in Canada Central to serve its Canadian users. By setting up geographically closer Azure SignalR Service, end users now have better network quality and lower latency. 

However, managing multiple Azure SignalR Services brings some challenges:
1. A cross-region communication mechanism would be required to enable conversation between Canada and US users
2. The development team would need to manage two separate Azure SignalR Services, each with distinct domains and connection strings.
3. If a regional outage happens, the traffic needs to be switched to another region.

<img width="633" alt="image" src="https://github.com/bjqian/azure-docs/assets/16233725/04c288f4-5868-42de-be20-807bbc016773">

## Harnessing Geo-replication
With the new geo-replication feature, Contoso can now establish a replica in Canada Central, effectively overcoming the above-mentioned hurdles.

<img width="762" alt="image" src="https://github.com/bjqian/azure-docs/assets/16233725/b2d7f946-bd5d-4c5d-b17f-3a1051a2f347">

The geo-replication feature of Azure SignalR Service has following benefits:

1. Communication across region is handled by Azure SignalR Service. 
2. There is only one Azure SignalR Service. The replicas in different regions share the configuration and domain.
3. It is more resilient to regional outages.

## Create a SignalR Replica

To create a replica, Navigate to the SignalR **Replicas** blade on the Azure portal and click **Add** to create a replica. It will be automatically enabled upon creation.
![SignalR Replica Creation](https://github.com/bjqian/azure-docs/assets/16233725/9e314ee1-d164-4530-9b70-25540f401d5d)
> [!NOTE]
> * The replica feature is available only for Premium tier.
> * Creating a replica incurs additional cost. Refer to below **Pricing** section for details. 

## Pricing
Replica is a feature of [Premium tier](https://azure.microsoft.com/en-us/pricing/details/signalr-service/) of Azure SignalR Service. When you create a replica in your desired regions, you incur Premium fees for each region.

In the preceding example, Contoso added one replica Canada Central. Contoso would pay for the replica in Canada Central according to its unit and message in Premium Price.


## Delete a replica
After you've created a replica for your Azure SignalR Service, you can delete it at any time if it's no longer needed. 

To delete a replica in the Azure portal:

1. Navigate to your Azure SignalR Service, and select **Replicas** blade. Click the replica you want to delete.
2. Click Delete button on the replica overview blade.

## Understanding how the SignalR Replica Works

The diagram below provides a brief illustration of the SignalR Replicas' functionality:

![replica_overview-Copy of Page-1 drawio](https://github.com/bjqian/azure-docs/assets/16233725/657a3daa-cc2f-4868-88d0-c2f228223790)

1. The client resolves the Fully Qualified Domain Name (FQDN) of the SignalR service. This FQDN points to a Traffic Manager, which returns the  Canonical Name (CNAME) of the nearest regional SignalR instance.
2. With this CNAME, the client establishes a connection to the regional instance.
3. The two replicas will synchronize data with each other
4. In case a replica fails the health check conducted by the Traffic Manager (TM), the TM will exclude the failed instance's endpoint from its domain resolution process.

> [!NOTE]
> * In the data plane, a primary Azure SignalR resource functions identically to its replicas

## Impact on Performance After Adding Replicas

Post replica addition, your clients will be distributed across different locations based on their geographical locations. SignalR must synchronize data across these replicas. The synchronization cost is negligible if your use case primarily involves sending to large groups (size >100) or broadcasting. However, the cost becomes more apparent when sending to smaller groups (size < 10) or a single user.

To ensure effective failover management, it is recommended to set each replica's unit size to handle all traffic. Alternatively, you could enable auto-scaler to manage this.
