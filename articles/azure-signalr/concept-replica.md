# Azure SignalR Geo-Replication

Companies that want a local presence, or a hot backup, choose to run services from multiple Azure regions. Azure SignalR now supports geo-replication, simplifying the multi region scenarios.

A geo-replicated registry provides the following benefits:

1. **Automatic Regional Disaster Failover:** In the event of an outage in a replica region that causes the data-plane to cease functioning, the traffic manager will detect this failure and exclude the affected endpoint from its DNS results.
2. **Enhanced Network Speed via Azure BackBone:** If your clients are geographically dispersed, they will connect to the nearest replica instance. These instances communicate through Azure BackBone, ensuring faster, more reliable network quality.
3. **Shared configurations**. All the replications share the configuration of its primary Azure SignalR Service resource. No need to manage difference instances.
4. **Cross Region Communication**. Different replications could communicate with each other as if they are the same instance.

# Prerequisites

* An Azure SignalR Service in [Premium Tier](https://azure.microsoft.com/en-us/pricing/details/signalr-service/).
* The user needs following permissions to operate on replications:

    | Permission                                        | Description                                       |
    |---------------------------------------------------|---------------------------------------------------|
    | Microsoft.SignalRService/signalr/replicas/write   | create, update or delete a replication. |
    | Microsoft.SignalRService/signalr/replicas/read    | get meta data of a replication.|
    | Microsoft.SignalRService/signalr/replicas/action  | perform actions on a replication, such as restarting. |


# Example use case
Contoso is a social media company. Its customer now located across the US and Canada. To serve those customers and let them communicate with 
each other, Contoso runs its services in Central US. Azure SignalR Service is used to handling user connections and enabling communication among users. Contoso's end users are mostly phone users. Due to the long geo distance, the end users may suffer high latency and poor network quality.

<img width="633" alt="image" src="https://github.com/bjqian/azure-docs/assets/16233725/a353337f-9fd7-4be2-9b0f-1bf961f7eb1a">

Prior to the geo-replication feature, Contoso can setup another Azure SignalR Service at Canada Central to serve users in Canada. By setting up network-close Azure SignalR Service, end users now have better network quality. 

Typical chanllenges of multiple Azure SignalR Services includes:
1. A cross region communication mechanism is needed to enabling communication between Canada and US users
2. The development team needs to manage two Azure SignalR Service with separate domains and connection string.

<img width="633" alt="image" src="https://github.com/bjqian/azure-docs/assets/16233725/04c288f4-5868-42de-be20-807bbc016773">

# Using Geo-replication
With geo-replication feature, Contoso can create a replica in Canada Central. The above issues no longer exist.

<img width="762" alt="image" src="https://github.com/bjqian/azure-docs/assets/16233725/b2d7f946-bd5d-4c5d-b17f-3a1051a2f347">
The geo-replication feature of Azure SignalR Service has following benefits:
1. There is only one Azure SignalR Service. The replicas in different regions share the configuration and domain contoso.signalr.service.net
2. Communication across region is handled by Azure SignalR Service. The cross region data goes through Azure Back Bone and has good network quatlity.
3. It is more resilient to regional outages.

## Creating and Enabling a SignalR Replica

Navigate to the SignalR **Replica** blade on the Azure portal and click **Add** to create a replication. 
![SignalR Replica Creation](https://github.com/bjqian/azure-docs/assets/16233725/9e314ee1-d164-4530-9b70-25540f401d5d)

Please note the following restrictions:
1. The replica feature is only available on the Premium tier.
2. A resource can support a maximum of 3 replicas.

## Pricing
Replica is a feature of Premium service tier of Azure SignalR Service. When you create a replica to your desired regions, you incur Premium registry fees for each region.

## Delete a replica
After you've created a replica for your Azure SignalR Service, you can delete it at any time if it's no longer needed. 

To delete a replica in the Azure portal:

1. Navigate to your Azure SignalR Service, and select Replications. Click the replica you want to delete
2. Click Delete button on the replica overview blade.

## Understanding the SignalR Replica Process

The following diagram illustrates how the SignalR Replica operates:

![SignalR Replica Overview](https://github.com/bjqian/azure-docs/assets/16233725/375e8bd5-c153-40c8-9b6c-4942544ec21b)

1. The client determines the FQDN (Fully Qualified Domain Name) of the SignalR service. This FQDN points to a traffic manager, which returns the CNAME (Canonical Name) of the nearest regional SignalR instance.
2. Using this CNAME, the client connects to the regional instance.

## Impact on Performance After Adding Replicas

Post replica addition, your clients will be distributed across different locations based on their geographical locations. SignalR must synchronize data across these replicas. The synchronization cost is negligible if your use case primarily involves sending to large groups (size >100) or broadcasting. However, the cost becomes more apparent when sending to smaller groups (size < 10) or a single user.

To ensure effective failover management, it is recommended to set each replica's unit size to handle all traffic. Alternatively, you could enable auto-scaler to manage this.

## Configuration Options

The following settings can be configured on the replica:

1. Diagnostic Log Setting
2. Scaling Out 
