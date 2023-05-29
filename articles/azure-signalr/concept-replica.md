# Azure SignalR Geo-Replication: Enhance Accessibility and Disaster Recovery

Azure SignalR now supports geo-replication, providing superior network accessibility and robust disaster fail-over protection.

## Understanding the SignalR Replica Process

The following diagram illustrates how the SignalR Replica operates:

![SignalR Replica Overview](https://github.com/bjqian/azure-docs/assets/16233725/375e8bd5-c153-40c8-9b6c-4942544ec21b)

1. The client determines the FQDN (Fully Qualified Domain Name) of the SignalR service. This FQDN points to a traffic manager, which returns the CNAME (Canonical Name) of the nearest regional SignalR instance.
2. Using this CNAME, the client connects to the regional instance.

## Advantages of Using SignalR Replica

1. **Automatic Regional Disaster Failover:** In the event of an outage in a replica region that causes the data-plane to cease functioning, the traffic manager will detect this failure and exclude the affected endpoint from its DNS results.
2. **Enhanced Network Speed via Azure BackBone:** If your clients are geographically dispersed, they will connect to the nearest replica instance. These instances communicate through Azure BackBone, ensuring faster, more reliable network quality.

## Creating and Enabling a SignalR Replica

Navigate to the SignalR **Replica** blade on the Azure portal and click **Add** to create a replication. 
![SignalR Replica Creation](https://github.com/bjqian/azure-docs/assets/16233725/9e314ee1-d164-4530-9b70-25540f401d5d)

Please note the following restrictions:
1. The replica feature is only available on the Premium tier.
2. A resource can support a maximum of 5 replicas.

## Impact on Performance After Adding Replicas

Post replica addition, your clients will be distributed across different locations based on their geographical locations. SignalR must synchronize data across these replicas. The synchronization cost is negligible if your use case primarily involves sending to large groups (size >100) or broadcasting. However, the cost becomes more apparent when sending to smaller groups (size < 10) or a single user.

To ensure effective failover management, it is recommended to set each replica's unit size to handle all traffic. Alternatively, you could enable auto-scaler to manage this.

## Pricing
Replica is a feature of Premium service tier of Azure SignalR Service. When you create a replica to your desired regions, you incur Premium registry fees for each region.

## Delete a replica
After you've created a replica for your Azure SignalR Service, you can delete it at any time if it's no longer needed. 

To delete a replica in the Azure portal:

1. Navigate to your Azure SignalR Service, and select Replications. Click the replica you want to delete
2. Click Delete button on the overview blade.

## Configuration Options

The following settings can be configured on the replica:

1. Diagnostic Log Setting
2. Scaling Out 

The following settings are configured on the Primary resource and synchronized to the replica:

1. Event Grid Settings
2. Connection String
3. CORS (Cross-Origin Resource Sharing) Configurations
4. Managed Identity / User-Assigned Identity
5. Networking
6. Custom Domain
7. Diagnostic Setting **Log Category**
