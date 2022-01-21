
# High Availability with Azure Arc enabled SQL Managed Instance (Preview)


## Overview

Azure Arc enabled SQL Managed Instance provides different levels of high availability depending on whether the SQL managed instance was deployed as a ```General Purpose``` service tier or ```Business Critical``` service tier. 

In the General Purpose servie tier, there is only one replica available, and the high availability is achieved via kubernetes orchestration. For instance, if a pod or node containing the Azure Arc enabled SQL managed instance container image crashes, then kubernetes will attempt to stand up another pod or node, bind the storage and bring up the instance in this new pod. During this time, the SQL managed instance is unavailable to the applications. Applications will need to reconnect and retry the transaction when the new pod is up. If ```load balancer``` is the service type used, then applications can simply reconnect to the same primary endpoint and kubernetes will redirect the connection to the new primary. If the service type is ```nodeport``` then the applications will need to reconnect to the new IP address. 

In the Business Critical service tier, in addition to what is natively provided by kubernetes orchestration, there is a new technology called Contained Availability Group (CAG) that provides higher levels of availability. Azure Arc enabled SQL managed instances deployed with ```Business Critical``` service tier can be deployed with either 2 or 3 replicas. These replcias are always kept in sync with each other. Contained Availability Group is built on top of existing SQL Server Always On Availability Groups. With Contained Availability Groups, any pod crashes/node failures etc are transparent to the application as there is at least one other pod that has the SQL managed instance that has all the data from the primary and ready to take on connections.  

## Contained Availability Groups

Always On Availability Group is a way to bind one or more user databases into a logical group so that when there is a failover, the entire group of databases fails over to the secondary replica as a single unit. Always On Availability Groups only replicates data in the user databases but not the data in system databases such as logins, permissions, agent jobs etc. Contained Availibility Group now extends Always On Availabiilty Group to also incude metadata from system databases such as msdb and master databases. When a login is created or modified in the primary replica, its automaticaly also created in the Always On replicas. Similarly, when an agent job is created or modified in the primary replica, the secondary replicas also receive those changes.

Azure Arc enabled SQL Managed Instance takes this concept of Contained Availability Group and adds kubernetes operator so these can be deployed and managed at scale. 

### Deploy Azure Arc enabled SQL managed instance with multiple replicas using Azure portal

From Azure portal, on the create Azure Arc enabled SQL managed instance page:
1. Select **Configure Compute + Storage** under Compute + Storage. This should open a new blade with advances settings.
2. Under Service tier, select **Business Critical**
3. Check the "For development use only", if using for development purposes
4. Under High availability, select either **2 replicas** or **3 replicas**

![High availability settings](.\media\business-continuity\service-tier-replicas.png)



### Deploy Azure Arc enabled SQL managed instance with multiple replicas using Azure CLI


When an Azure Arc enabled SQL managed instance is deployed in Business Critical service tier, this enables multiple replicas to be created. The setup and configuration of Contained Availability Groups among those instances is automatically done during provisioning. 

For instance, the following command creates a Arc SQL managed instance with 3 replicas.

Indirectly connected mode:
```Azure CLI
az sql mi-arc create -n <instanceName> --k8s-namespace <namespace> --use-k8s --tier <tier> --replicas <number of replicas>
```
Example:
```Azure CLI
az sql mi-arc create -n sqldemo --k8s-namespace my-namespace --use-k8s --tier bc --replicas 3
```

Directly connected mode:

```Azure CLI
az sql mi-arc create --name <name> --resource-group <group>  --location <Azure location> –subscription <subscription>  --custom-location <custom-location> --tier <tier> --replicas <number of replicas>
```
Example:
```Azure CLI
az sql mi-arc create --name sqldemo --resource-group rg  --location uswest2 –subscription a97da202-47ad-4de9-8991-9f7cf689eeb9  --custom-location private-location --tier bc --replcias 3
```

By default, all the replicas are configured in synchronous mode. This means any updates on the primary instance will be synchronously replicated to each of the secondary instances.

## View and Monitor Availability Group status

Once the deployment is complete, connect to the primary endpoint from SQL Server Management Studio.  

Verify and retrieve the endpoint of the primary replica, and connect to it from SQL Server Management Studio. 
For instance, if the SQL instance was deployed using ```service-type=loadbalancer```, run the below command to retieve the endpoint to connect to:

```Azure CLI
az sql mi-arc list --k8s-namespace my-namespace --use-k8s
```

or
```bash
kubectl get sqlmi -A
```

### Get the primary and secondary endpoints and AG status

Use the ```kubectl describe sqlmi``` or ```az sql mi-arc show``` commands to view the primary and secondary endpoints, and Contained Availability Group status.

Example:

```
kubectl describe sqlmi sqldemo -n my-namespace
```
or 
```
az sql mi-arc show sqldemo --k8s-namespace my-namespace --use-k8s
```
The corresponding DMV, when connected to the SQL managed instance is:
```
SELECT * FROM sys.dm_hadr_availability_replica_states
```



![Availability Group](.\media\business-continuity\availability-group.png)

And the Contained Availability Dashboard:

![Container Availability Group dashboard](.\media\business-continuity\ag-dashboard.png)


## Failover scenarios

Unlike SQL Server Always on Availability Groups, the Contained Availability Groups is a managed high availability solution. Hence, the failover modes are limited compared to the typical modes available with SQL Server Always on Availability Groups.

Busines Critical service tier SQL managed instances can be deployed in either 2 replica configuration or 3 replica congiguration and the impact of failures and the subsequent recoverability is different with each configuration. A 3-replica instance provides a much higher level of availability and recovery in case of failures, than a 2-replica instance. 

When Arc SQL MI is deployed in a 2-replica configuration and both the nodes state is ```SYNCHRONIZED```, if the primary replica becomes unavailable, the secondary replica is automatically promoted to the primary status and can take on transactions. When the failed replica becomes available, it will be updated with all the pending changes. If there are connectivity issues between the replicas, then the primary replica may not commit any transactions as every transaction needs to be committed on both replicas before a success is returned back on the primary. 

When Arc SQL MI is deployed in a 3-replica configuration, a transaction needs to commit in at least 2 of the 3 replicas before returning a success message back to the application. In the event of a failure, one of the secondaries is automaticaly promoted to primary while kubernetes attemps to recover the failed replica. When the replica becomes available it is automatically joined back with the Contained Availability Group and pending changes are synchronized. If there are connectivity issues between the replicas, and more than 2 replicas are out of sync, primary replica will not commit any transactions. 

> [!NOTE]
> It is recommended to deploy a Business Critical SQL managed instance in a 3-replica configuration than a 2-repica configuration to achieve near-zero data loss. 


In order to failover from the primary replica to one of the secondaries, for a planned event, run the following command:

If you connect to primary, you can use following T-SQL to failover the SQL instance to one of the secondaries:
```code
ALTER AVAILABILITY GROUP current SET (ROLE = SECONDARY);
```


If you connect to the secondary, you can use following T-SQL to promote the desired secondary to primary replica.
```code
ALTER AVAILABILITY GROUP current SET (ROLE = PRIMARY);
```
### Preferred primary replica

You can also set a specific replica to be the primary replica using AZ CLI as follows:
```Azure CLI
az sql mi-arc update --name <sqlinstance name> --k8s-namespace <namespace> --use-k8s --preferred-primary-replica <replica>
```

Example:
```Azure CLI
az sql mi-arc update --name sqldemo --k8s-namespace my-namespace --use-k8s --preferred-primary-replica sqldemo-3
```

> [!NOTE]
> Kubernetes will attempt to set the preferred replica, however it is not guaranteed.


 