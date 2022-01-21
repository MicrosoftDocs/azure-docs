
# Disaster Recovery with Azure Arc enabled SQL Managed Instance (Preview)

Disaster Recovery in Azure Arc enabled SQL Managed Instance is achieved using Distributed Availability Groups.

## Pre-read

Coneptually the Distributed Availability Groups (DAGs) used in Azure Arc enabled SQL Managed Instance is the same technology that is in SQL Server as described in [Distributed Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/distributed-availability-groups?view=sql-server-ver15). In the case of Arc SQL MI, both geo-primary and geo-secondary sites are based on kubernetes and there is no Windows Failover Clustering involved. 

> [!NOTE]
> 1. The Azure Arc enabled SQL Managed Instances in both geo-primary and geo-secondary sites need to be identical in terms of their compute & capacity, as well as service tiers they are deployed in.
> 2. Distributed Availability Groups can be setup for both General Purpose and Business Critical service tiers. 


### Configure Distributed Availability groups 

1. Provision the Arc SQL MI in the primary site.
```
az sql mi-arc create --name sqlprimary --tier bc --replicas 3 --k8s-namespace my-namespace --use-k8s
```
2. Provision the Arc SQL MI in the secondary site and configur as a DR instance. At this point the system databases are not part of the Contained Availability Group (CAG) yet.
```
az sql mi-arc create --name sqlsecondary --tier bc --replicas 3 --disaster-recovery-site true --k8s-namespace my-namespace --use-k8s
```
3. Copy the mirroring certificates from each site to a location thats accessible to both the geo-primary and geo-secondary instances. 

```
az sql mi-arc get-mirroring-cert --name <primaryinstance> --cert-file $HOME/sqlcerts/<name>.pem​ --k8s-namespace <namespace> --use-k8s
az sql mi-arc get-mirroring-cert --name <secondaryinstance> --cert-file $HOME/sqlcerts/<name>.pem --k8s-namespace <namespace> --use-k8s
```

Example:
```
az sql mi-arc get-mirroring-cert --name sqlprimary --cert-file $HOME/sqlcerts/sqlprimary.pem​ --k8s-namespace my-namespace --use-k8s
az sql mi-arc get-mirroring-cert --name sqlsecondary --cert-file $HOME/sqlcerts/sqlsecondary.pem --k8s-namespace my-namespace --use-k8s
```

4. Create the DAG resource on both sites. System databases will be seeded into the DR instance CAG, from the primary instance CAG. 
> [!NOTE] The DAG name should be identical on both sites.

```
az sql mi-arc dag create --dag-name <name of DAG> --name <name for primary DAG resource> --local-instance-name <primary instance name> --role primary --remote-instance-name <secondary instance name>  --remote-mirroring-url tcp://<secondary IP> --remote-mirroring-cert-file <secondary.pem> --k8s-namespace <namespace> --use-k8s

az sql mi-arc dag create --dag-name <name of DAG> --name <name for secondary DAG resource> --local-instance-name <secondary instance name> --role secondary --remote-instance-name <primary instance name> --remote-mirroring-url tcp://<primary IP> --remote-mirroring-cert-file <primary.pem> --k8s-namespace <namespace> --use-k8s
```


Example:
```
az sql mi-arc dag create --dag-name dagtest --name dagPrimary --local-instance-name sqlPrimary --role primary --remote-instance-name sqlSecondary --remote-mirroring-url tcp://10.20.5.20:970 --remote-mirroring-cert-file $HOME/sqlcerts/sqlsecondary.pem --k8s-namespace my-namespace --use-k8s

az sql mi-arc dag create --dag-name dagtest --name dagSecondary --local-instance-name sqlSecondary  --role secondary --remote-instance-name sqlPrimary --remote-mirroring-url tcp://10.20.5.50:970 --remote-mirroring-cert-file $HOME/sqlcerts/sqlprimary.pem --k8s-namespace my-namespace --use-k8s
```

## Auto failover from primary to secondary instance

Following command initiates a failover from the primary instance to the secondary instance. Any pending transactions on the geo-primary instance are replicated over to the geo-secondary DR instance before the failover. 

```
az sql mi-arc dag edit --name <name of DAG> --role secondary --k8s-namespace <namespace> --use-k8s 
```

Example:
```
az sql mi-arc dag edit --name dagtest --role secondary --k8s-namespace <namespace> --use-k8s 
```


## Forced failover

In the circumstance when the geo-primary instance becomes unavailable, the following commands can be run on the geo-secondary DR instance to promote to primary with a forced failover incurring potential data loss.

Run the below command on geo-primary, if available:
```
az sql mi-arc dag edit -k test --name dagtestp --use-k8s --role force-secondary
```

On the geo-secondary DR instance, run the following command to promote it to primary role, with data loss.

```
az sql mi-arc dag edit -k test --name dagtests --use-k8s --role force-primary-allow-data-loss
```
