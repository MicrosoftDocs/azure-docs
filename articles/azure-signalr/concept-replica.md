Azure SignalR now supports geo-replication to offer better network accessability and disaster fail-over.

## How SignalR Replica Works
Below is a graph showing how SignalR Replica works:

![replica_overview drawio](https://github.com/bjqian/azure-docs/assets/16233725/375e8bd5-c153-40c8-9b6c-4942544ec21b)

1. The client resolves fqnd of SignalR service. The fqdn is pointed to a traffic manager which will return the nearest regional signalr instance cname.
2. The client uses this cname to connect to the regional instance.
## What is the benefit of using SignalR Replica
1. Automatic failover for regional disaster. If one of the replica region has outage and the data-plane stops working, the traffic manager will detect this failing and exclude this endpoint from its dns result.
2. Faster network through Azure BackBone. If your clients are geo distributed far away, it would find the nearest replica instance. The replica instances communication through Azure back bone and has faster and more stable network quality.

## How to create and enable SignalR Replica

On Azure portal SignalR **Replica** blade, click **Add** to create a replication. 
![image](https://github.com/bjqian/azure-docs/assets/16233725/9e314ee1-d164-4530-9b70-25540f401d5d)
Restraints:
1. Replica is only supported on Premium tier.
2. A resource can have at most 5 replicas. 



## Performance impact of adding replicas
After adding replicas, your clients would be distributed to different locations according to their geo locatons. SignalR needs to sync data across different replicas. The syncing cost is ignorable if your scenario is mainly sending to large groups (size >100) or broadcast. The syncing cost becomes visible if the scenario is sending to small groups(size < 10) or a single user. 
To handle failover, it's recommended that you select each replica's unit size to handle all traffic. Also you could enable auto-scaler to handle this.

## Configurations
Thoses configurations are configurable on replica:
1. Diagnostic Log Setting
2. Scaling out 

Those configuration are configured on Primary resource and synced to replica:
1. Event grid settings
2. Connection String
3. Cors config
4. Managed Identity / User assigned Identity
5. Networking 
6. Custom domain
7. Diagnostic setting **Log cantegory**
