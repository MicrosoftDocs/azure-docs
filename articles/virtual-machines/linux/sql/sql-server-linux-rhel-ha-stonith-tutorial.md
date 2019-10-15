---
title: Create RHEL Virtual machines in Azure and set up HA with STONITH - Linux Virtual Machines | Microsoft Docs
description: Learn about setting up High Availability in a RHEL cluster environment and set up STONITH
ms.service: virtual-machine-linux
ms.subservice: ???
ms.topic: tutorial
author: VanMSFT
ms.author: vanto
ms.reviewer: jroth
ms.date: 10/14/2019
---
# Tutorial: Create RHEL Virtual machines in Azure and set up High Availability with STONITH

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a new resource group, Availability Set, and Azure Linux Virtual Machines (VM)
> - Register a RHEL subscription and enable High Availability (HA)

This tutorial will use Azure command-line interface (CLI) to deploy resources in Azure.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create a Resource Group and a VNet

If you have more than one subscription, [set the subscription](/cli/azure/manage-azure-subscriptions-azure-cli) that you want deploy these resources to.

Use the following command to create a Resource Group `<resourceGroupName>` in a region. Replace `<resourceGroupName>` with a name of your choosing. We're using `East US 2` for this tutorial. For more information, see the following [Quickstart](../quick-create-cli.md).

```azurecli-interactive
az group create --name <resourceGroupName> --location eastus2
```

## Create an Availability Set

The next step is to create an Availability Set. Run the following command in Azure Cloud Shell, and replace `<resourceGroupName>` with your Resource Group name. Choose a name for `<availabilitySetName>`.

```azurecli-interactive
az vm availability-set create \
    --resource-group <resourceGroupName> \
    --name <availabilitySetName> \
    --platform-fault-domain-count 2 \
    --platform-update-domain-count 2
```

You should get the following results once the command completes:

```output
{
  "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/availabilitySets/<availabilitySetName>",
  "location": "eastus2",
  "name": "<availabilitySetName>",
  "platformFaultDomainCount": 2,
  "platformUpdateDomainCount": 2,
  "proximityPlacementGroup": null,
  "resourceGroup": "<resourceGroupName>",
  "sku": {
    "capacity": null,
    "name": "Aligned",
    "tier": null
  },
  "statuses": null,
  "tags": {},
  "type": "Microsoft.Compute/availabilitySets",
  "virtualMachines": []
}
```

## Create RHEL VMs inside the Availability Set

> [!IMPORTANT]
> Machine names must be less than 15 characters to set up Availability Group. Username cannot contain upper case characters, and passwords must have more than 12 characters.

We want to create 3 VMs in the Availability Set. Replace the following in the command below:

- `<resourceGroupName>`
- `<VM-basename>`
- `<availabilitySetName>`
- `<username>`
- `<adminPassword>`

```azurecli-interactive
for i in `seq 1 3`; do
   az vm create \
     --resource-group <resourceGroupName> \
     --name <VM-basename>$i \
     --availability-set <availabilitySetName> \
     --size "Standard_D16_v3"  \
     --image "RedHat:RHEL-HA:7.6:7.6.2019062019" \
     --admin-username "<username>" \
     --admin-password "<adminPassword>" \
     --authentication-type all \
     --generate-ssh-keys
done
```

You should get the following results once the command completes for each VM:

```output
{
  "fqdns": "",
  "id": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/virtualMachines/<VM1>",
  "location": "eastus2",
  "macAddress": "00-0D-3A-03-34-83",
  "powerState": "VM running",
  "privateIpAddress": "<IP1>",
  "publicIpAddress": "",
  "resourceGroup": "<resourceGroupName>",
  "zones": ""
}
```

### Test connection to the created VMs

Connect to VM1 or the other VMs using the following command in Azure Cloud Shell. If you are unable to find your VM IPs, follow this [Quickstart on Azure Cloud Shell](../../../cloud-shell/quickstart.md#ssh-into-your-linux-vm).

```azurecli-interactive
ssh <username>@publicipaddress
```

If the connection is successful, you should see the following output representing the Linux terminal:

```output
[<username>@<VM1> ~]$
```

## Register VMs to a RHEL subscription and enable HA

> [!IMPORTANT]
> In order to complete this portion of the tutorial, you must have a subscription for RHEL and the High Availability Add on.
 
Connect to each VM node and follow the guide to [enable the high availability subscription for RHEL](/sql/linux/sql-server-linux-availability-group-cluster-rhel#enable-the-high-availability-subscription-for-rhel).


```bash
[<username>@<VM1> ~]$ sudo subscription-manager register
Registering to: subscription.rhsm.redhat.com:443/subscription
Username:
Password:
The system has been registered with ID: <ID>
The registered system name is: <VM1>
 
WARNING
 
The yum/dnf plugins: /etc/yum/pluginconf.d/subscription-manager.conf were automatically enabled for the benefit of Red Hat Subscription Management. If not desired, use "subscription-manager config --rhsm.auto_enable_yum_plugins=0" to block this behavior.
 
# get Pool ID by running
subscription-manager list --available --all | less

[<username>@<VM1> ~]$ sudo subscription-manager attach --pool=<Pool ID>
Successfully attached a subscription for: Red Hat Developer Subscription
[<username>@<VM1> ~]$ sudo subscription-manager repos --enable=rhel-ha-for-rhel-7-server-rpms
Repository 'rhel-ha-for-rhel-7-server-rpms' is enabled for this system.
[<username>@<VM1> ~]$ sudo firewall-cmd --permanent --add-service=high-availability
success
[<username>@<VM1> ~]$ sudo firewall-cmd --reload
success
```

```
[<username>@<VM1> ~]$ sudo yum update -y
[<username>@<VM1> ~]$ sudo yum install -y pacemaker pcs fence-agents-all resource-agents fence-agents-azure-arm nmap
[<username>@<VM1> ~]$ sudo reboot
```

Change hacluster password to the same password on all nodes

```bash
sudo passwd hacluster
```

Setup host name resolution

```
sudo vi /etc/hosts
```

```
<IP1> <VM1>
<IP2> <VM2>
<IP3> <VM3>
```

## Install SQL Server, SQLcmd and SQL HA agents
 
Following <https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-red-hat?view=sql-server-2017>
Point to the repo first:

```bash
sudo curl -o /etc/yum.repos.d/mssql-server.repo https://packages.microsoft.com/config/rhel/7/mssql-server-2017.repo
sudo yum install -y mssql-server
sudo /opt/mssql/bin/mssql-conf setup
sudo yum install mssql-server-ha mssql-server-agent
```

### Install mssql-tools, and open firewall 1433 for remote connection
Following <https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-red-hat?view=sql-server-2017>

Open port 1433

```
sudo firewall-cmd --zone=public --add-port=1433/tcp --permanent
sudo firewall-cmd --reload
```

```
# Download the Microsoft Red Hat repository configuration file.
sudo curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/7/prod.repo
# If you had a previous version of mssql-tools installed, remove any older unixODBC packages.
sudo yum remove unixODBC-utf16 unixODBC-utf16-devel
sudo yum install -y mssql-tools unixODBC-devel
 
# For convenience, add /opt/mssql-tools/bin/ to your PATH environment variable. This enables you to run the tools without specifying the full path. Run the following commands to modify the PATH for both login sessions and interactive/non-login sessions:
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Check status for SQL server

```
systemctl status mssql-server --no-pager
```

Expecting:

```
● mssql-server.service - Microsoft SQL Server Database Engine
   Loaded: loaded (/usr/lib/systemd/system/mssql-server.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2019-08-21 18:20:55 UTC; 15min ago
```

### Enable AlwaysOn availability groups and restart mssql-server

Enable AlwaysOn availability groups on each node that hosts a SQL Server instance. Then restart mssql-server. Run the following script:

```
sudo /opt/mssql/bin/mssql-conf set hadr.hadrenabled  1
sudo systemctl restart mssql-server
```

### Create certificate
 
Connect on SQL Server Management Studio, on the primary replica:

```
ALTER EVENT SESSION  AlwaysOn_health ON SERVER WITH (STARTUP_STATE=ON);
GO
```

On new query,

```sql
ALTER EVENT SESSION  AlwaysOn_health ON SERVER WITH (STARTUP_STATE=ON);
GO
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '**<Master_Key_Password>**';
CREATE CERTIFICATE dbm_certificate WITH SUBJECT = 'dbm';
BACKUP CERTIFICATE dbm_certificate
   TO FILE = '/var/opt/mssql/data/dbm_certificate.cer'
   WITH PRIVATE KEY (
           FILE = '/var/opt/mssql/data/dbm_certificate.pvk',
           ENCRYPTION BY PASSWORD = '**<Private_Key_Password>**'
       );
```

At this point, your primary SQL Server replica has a certificate at `/var/opt/mssql/data/dbm_certificate.cer` and a private key at `var/opt/mssql/data/dbm_certificate.pvk`. Copy these two files to the same location on all servers that will host availability replicas.
 
### Copy certificate
 
On primary server, copy certificate to target servers

```
sudo -i
scp /var/opt/mssql/data/dbm_certificate.* <username>@<VM2>:/home/<username>
```

On target Server

```
sudo -i
mv /home/<username>/dbm_certificate.* /var/opt/mssql/data/
cd /var/opt/mssql/data
chown mssql:mssql dbm_certificate.*
```

### Create the certificate on secondary servers
The following Transact-SQL script creates a master key and a certificate from the backup that you created on the primary SQL Server replica. Update the script with strong passwords. The decryption password is the same password that you used to create the .pvk file in a previous step. To create the certificate, run the following script on all secondary servers:

```sql
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '**<Master_Key_Password>**';
CREATE CERTIFICATE dbm_certificate
    FROM FILE = '/var/opt/mssql/data/dbm_certificate.cer'
    WITH PRIVATE KEY (
    FILE = '/var/opt/mssql/data/dbm_certificate.pvk',
    DECRYPTION BY PASSWORD = '**<Private_Key_Password>**'
            );
```

### Create the database mirroring endpoints on all replicas
Run on all SQL instances (SSMS connect database engine)

```sql
CREATE ENDPOINT [Hadr_endpoint]
    AS TCP (LISTENER_PORT = 5022)
    FOR DATABASE_MIRRORING (
    ROLE = ALL,
    AUTHENTICATION = CERTIFICATE dbm_certificate,
ENCRYPTION = REQUIRED ALGORITHM AES
);
ALTER ENDPOINT [Hadr_endpoint] STATE = STARTED;
```

### Create the AG `ag1`
Run on the SQL Server instance that hosts the primary replica.

```
CREATE AVAILABILITY GROUP [ag1]
     WITH (DB_FAILOVER = ON, CLUSTER_TYPE = EXTERNAL)
     FOR REPLICA ON
         N'<VM1>'
          WITH (
             ENDPOINT_URL = N'tcp://<VM1>:5022',
             AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
             FAILOVER_MODE = EXTERNAL,
             SEEDING_MODE = AUTOMATIC
             ),
         N'<VM2>'
          WITH (
             ENDPOINT_URL = N'tcp://<VM2>:5022',
             AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
             FAILOVER_MODE = EXTERNAL,
             SEEDING_MODE = AUTOMATIC
             ),
         N'<VM3>'
         WITH(
            ENDPOINT_URL = N'tcp://<VM3>:5022',
            AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
            FAILOVER_MODE = EXTERNAL,
            SEEDING_MODE = AUTOMATIC
            );
 
ALTER AVAILABILITY GROUP [ag1] GRANT CREATE ANY DATABASE;
```

### Create a SQL Server login for Pacemaker
On all SQL Servers, create a Server login for Pacemaker. The following Transact-SQL creates a login:

```sql
USE [master]
GO
CREATE LOGIN [pacemakerLogin] with PASSWORD= N'ComplexP@$$w0rd!'
 
ALTER SERVER ROLE [sysadmin] ADD MEMBER [pacemakerLogin]
```

On all SQL Servers, save the credentials for the SQL Server login.

```
sudo vi /var/opt/mssql/secrets/passwd

# Add the following 2 lines to the file
pacemakerLogin
ComplexP@$$w0rd!

sudo chown root:root /var/opt/mssql/secrets/passwd
sudo chmod 400 /var/opt/mssql/secrets/passwd # Only readable by root
```

### On each SQL Server instance that hosts a secondary replica, run the following Transact-SQL to join the AG.

Need to open port 5022 to join the AG

```
sudo firewall-cmd --zone=public --add-port=5022/tcp --permanent
sudo firewall-cmd --reload
```

On SSMS

```
ALTER AVAILABILITY GROUP [ag1] JOIN WITH (CLUSTER_TYPE = EXTERNAL);
 
ALTER AVAILABILITY GROUP [ag1] GRANT CREATE ANY DATABASE;
```

Otherwise, receiving: Msg 47106, Level 16, State 3, Line 1
Cannot join availability group 'ag1'. Download configuration timeout. Please check primary configuration, network connectivity and firewall setup, then retry the operation.
 
### Join secondary replicas to the AG

The pacemaker user requires ALTER, CONTROL, and VIEW DEFINITION permissions on the availability group on all replicas. To grant permissions, run the following Transact-SQL script after the availability group is created on the primary replica and each secondary replica immediately after they are added to the availability group. Before you run the script, replace <pacemakerLogin> with the name of the pacemaker user account.

```
GRANT ALTER, CONTROL, VIEW DEFINITION ON AVAILABILITY GROUP::ag1 TO <pacemakerLogin>
GRANT VIEW SERVER STATE TO <pacemakerLogin>
```

Grant permissions and all 3 replicas should be online

### Add a database to the AG

On the primary SQL Server, run the following Transact-SQL script to create and back up a database called db1:

```
CREATE DATABASE [db1];
ALTER DATABASE [db1] SET RECOVERY FULL;
BACKUP DATABASE [db1]
   TO DISK = N'/var/opt/mssql/data/db1.bak';
```

add a database called db1 to an availability group called ag1:

```
ALTER AVAILABILITY GROUP [ag1] ADD DATABASE [db1];
```

### Verify that the database is created on the secondary servers
On each secondary SQL Server replica, run the following query to see if the db1 database was created and is synchronized:

```
SELECT * FROM sys.databases WHERE name = 'db1';
GO
SELECT DB_NAME(database_id) AS 'database', synchronization_state_desc FROM sys.dm_hadr_database_replica_states;
```

This means the replicas are synchronized. Secondaries are showing `db1` in Primary.
 
## Create the Cluster

### Enable and start pcsd service and Pacemaker

The following command enables and starts pcsd service. Run on all nodes. This allows the nodes to rejoin the cluster after reboot.

`sudo systemctl enable --now pcsd`

Remove any existing cluster configuration from all nodes

`sudo pcs cluster destroy --all`

On the primary node (auth and enable Pacemaker on boot) with the following commands.

```bash
sudo pcs cluster auth <VM1> <VM2> <VM3> -u hacluster
sudo pcs cluster setup --name az-hacluster <VM1> <VM2> <VM3> --token 30000
sudo pcs cluster start --all
sudo pcs cluster enable --all
```

Run `sudo pcs status` until all nodes online. From:

```
Node <VM1>: UNCLEAN (offline)
Node <VM2>: UNCLEAN (offline)
Node <VM3>: UNCLEAN (offline)
```

to:

```bash
Cluster name: az-hacluster
 
WARNINGS:
No stonith devices and stonith-enabled is not false
 
Stack: corosync
Current DC: <VM2> (version 1.1.19-8.el7_6.5-c3c624ea3d) - partition with quorum
Last updated: Fri Aug 23 18:27:57 2019
Last change: Fri Aug 23 18:27:56 2019 by hacluster via crmd on <VM2>
 
3 nodes configured
0 resources configured
 
Online: [ <VM1> <VM2> <VM3> ]
 
No resources
 
 
Daemon Status:
  corosync: active/enabled
  pacemaker: active/enabled
  pcsd: active/enabled
 
```

>> NOT SURE IF THIS IS NEEDED, AND IT DOESNT APPEAR LIKE IT GETS SAVED

```
    expected-votes <votes>
        Set expected votes in the live cluster to specified value.  This only
        affects the live cluster, not changes any configuration files.
```

On all nodes, Set Expected Votes

```bash
sudo pcs quorum expected-votes 3
```

### Create availability group resource
create a `ocf:mssql:ag` master/slave type resource for availability group with name `ag1`

```
sudo pcs resource create ag_cluster ocf:mssql:ag ag_name=ag1 meta failure-timeout=30s --master meta notify=true
```

### Create virtual IP resource
Use an available static IP address from the network. Find one with `nmap`

```
nmap -sP <IPRange>
```

>> DISABLED STONITH HERE TO LET RESOURCES START (IT'S ENABLED AFTER SETUP LATER)

```
sudo pcs property set stonith-enabled=false
sudo pcs resource create virtualip ocf:heartbeat:IPaddr2 ip=<availableIP>
```

### Add Constraints
Add colocation constraint

```
sudo pcs constraint order promote ag_cluster-master then start virtualip
```

### Test Failover
Before

```
Location Constraints:
Ordering Constraints:
  promote ag_cluster-master then start virtualip (kind:Mandatory) (id:order-ag_cluster-master-virtualip-mandatory)
Colocation Constraints:
  virtualip with ag_cluster-master (score:INFINITY) (with-rsc-role:Master) (id:colocation-virtualip-ag_cluster-master-INFINITY)
Ticket Constraints:
```

```
sudo pcs resource move ag_cluster-master <VM2> --master
 
sudo pcs constraint list --full
```

```
Location Constraints:
  Resource: ag_cluster-master
    Enabled on: <VM2> (score:INFINITY) (role: Master) (id:cli-prefer-ag_cluster-master)
Ordering Constraints:
  promote ag_cluster-master then start virtualip (kind:Mandatory) (id:order-ag_cluster-master-virtualip-mandatory)
Colocation Constraints:
  virtualip with ag_cluster-master (score:INFINITY) (with-rsc-role:Master) (id:colocation-virtualip-ag_cluster-master-INFINITY)
Ticket Constraints:
```

`sudo pcs constraint remove cli-prefer-ag_cluster-master`
 
Current status

```bash
 
[<username>@<VM1> ~]$ sudo pcs status
Cluster name: az-hacluster
 
WARNINGS:
No stonith devices and stonith-enabled is not false
 
Stack: corosync
Current DC: <VM2> (version 1.1.19-8.el7_6.5-c3c624ea3d) - partition with quorum
Last updated: Fri Aug 23 18:32:53 2019
Last change: Fri Aug 23 18:30:41 2019 by root via cibadmin on <VM1>
 
3 nodes configured
4 resources configured
 
Online: [ <VM1> <VM2> <VM3> ]
 
Full list of resources:
 
Master/Slave Set: ag_cluster-master [ag_cluster]
     Masters: [ <VM1> ]
     Slaves: [ <VM2> <VM3> ]
virtualip      (ocf::heartbeat:IPaddr2):       Stopped
 
Daemon Status:
  corosync: active/enabled
  pacemaker: active/enabled
  pcsd: active/enabled
```

after fail VM1

```
[<username>@<VM1> ~]$ sudo pcs resource
Master/Slave Set: ag_cluster-master [ag_cluster]
     Slaves: [ <VM1> <VM2> <VM3> ]
virtualip      (ocf::heartbeat:IPaddr2):       Stopped
```

To

```
[<username>@<VM1> ~]$ sudo pcs resource
Master/Slave Set: ag_cluster-master [ag_cluster]
     ag_cluster (ocf::mssql:ag):        FAILED <VM1> (Monitoring)
     Masters: [ <VM2> ]
     Slaves: [ <VM3> ]
virtualip      (ocf::heartbeat:IPaddr2):       Started <VM2>
[<username>@<VM1> ~]$ sudo pcs resource
Master/Slave Set: ag_cluster-master [ag_cluster]
     Masters: [ <VM2> ]
     Slaves: [ <VM1> <VM3> ]
virtualip      (ocf::heartbeat:IPaddr2):       Started <VM2>
 
```
 
## Fencing
 
Check the version of the Azure Fence Agent

```bash
[<username>@<VM1> ~]$  sudo yum info fence-agents-azure-arm
Loaded plugins: langpacks, product-id, search-disabled-repos, subscription-manager
Installed Packages
Name        : fence-agents-azure-arm
Arch        : x86_64
Version     : 4.2.1
Release     : 11.el7_6.8
Size        : 28 k
Repo        : installed
From repo   : rhel-ha-for-rhel-7-server-eus-rhui-rpms
Summary     : Fence agent for Azure Resource Manager
URL         : https://github.com/ClusterLabs/fence-agents
License     : GPLv2+ and LGPLv2+
Description : The fence-agents-azure-arm package contains a fence agent for Azure instances.
```

## Create STONITH device
The STONITH device uses a Service Principal to authorize against Microsoft Azure. Follow these steps to create a Service Principal.
 
 1. Go to https://portal.azure.com
 2. Open the [Azure Active Directory blade](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties)
Go to Properties and write down the Directory ID. This is the `tenant ID`
 3. Click [App registrations](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
 4. Click New Registration
 5. Enter a Name (<resourceGroupName>-app), select "Accounts in this organization directory only"
 6. Select Application Type "Web", enter a sign-on URL (for example http://localhost) and click Add
The sign-on URL is not used and can be any valid URL
 7. Select Certificates and Secrets, then click New client secret
 8. Enter a description for a new key (client secret), select "Never expires" and click Add
 9. Write down the Value. It is used as the password for the Service Principal
10. Select Overview. Write down the Application ID. It is used as the username (login ID in the steps below) of the Service Principal
 
### Create a custom role for the fence agent
on Node1, following https://docs.microsoft.com/en-us/azure/role-based-access-control/tutorial-custom-role-cli

```json
{
  "Name": "Linux Fence Agent Role-<username>",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows to power-off and start virtual machines",
  "Actions": [
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/virtualMachines/powerOff/action",
    "Microsoft.Compute/virtualMachines/start/action"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/<subscriptionId>"
  ]
}
```

Created a `LinuxFenceAgentRole.json` on `/home/<user>/clouddrive/CustomRoles`, run `az role definition create --role-definition "~/CustomRoles/LinuxFenceAgentRole.json"`
Update the `Name` to avoid "A role definition cannot be updated with a name that already exists."

```bash
<user>@Azure:~/clouddrive/CustomRoles$ az role definition create --role-definition "LinuxFenceAgentRole.json"
{
  "assignableScopes": [
    "/subscriptions/<subscriptionId>"
  ],
  "description": "Allows to power-off and start virtual machines",
  "id": "/subscriptions/<subscriptionId>/providers/Microsoft.Authorization/roleDefinitions/<roleNameId>",
  "name": "<roleNameId>",
  "permissions": [
    {
      "actions": [
        "Microsoft.Compute/*/read",
        "Microsoft.Compute/virtualMachines/powerOff/action",
        "Microsoft.Compute/virtualMachines/start/action"
      ],
      "dataActions": [],
      "notActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Linux Fence Agent Role-<username>",
  "roleType": "CustomRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Assign the custom role to the Service Principal
Assign the custom role "Linux Fence Agent Role" that was created in the last chapter to the Service Principal. Do not use the Owner role anymore!
 
1. Go to https://portal.azure.com
2. Open the [All resources blade](https://ms.portal.azure.com/#blade/HubsExtension/BrowseAll)
3. Select the virtual machine of the first cluster node
4. Click Access control (IAM)
5. Click Add role assignment
6. Select the role "Linux Fence Agent Role"
7. Enter the name of the application you created above (<resourceGroupName>-app)
8. Click Save
Repeat the steps above for the all cluster node. (<resourceGroupName>-app was added as Linux Fence Agent Role-<username> for <VM3>.)

```bash
sudo pcs property set stonith-timeout=900
sudo pcs stonith create rsc_st_azure fence_azure_arm login="<ApplicationID>" passwd="<servicePrincipalPassword>" resourceGroup="<resourceGroupName>" tenantId="<tenantID>" subscriptionId="<subscriptionId>" power_timeout=240 pcmk_reboot_timeout=900
sudo pcs property set stonith-enabled=true
```

Current

```
Cluster name: az-hacluster
Stack: corosync
Current DC: <VM2> (version 1.1.19-8.el7_6.5-c3c624ea3d) - partition with quorum
Last updated: Fri Aug 23 18:44:43 2019
Last change: Fri Aug 23 18:44:38 2019 by root via cibadmin on <VM1>
3 nodes configured
5 resources configured
Online: [ <VM1> <VM2> <VM3> ]
Full list of resources:
 
Master/Slave Set: ag_cluster-master [ag_cluster]
     Masters: [ <VM1> ]
     Slaves: [ <VM2> <VM3> ]
virtualip      (ocf::heartbeat:IPaddr2):       Started <VM1>
rsc_st_azure   (stonith:fence_azure_arm):      Started <VM2>
Daemon Status:
  corosync: active/enabled
  pacemaker: active/enabled
  pcsd: active/enabled
```

Open port 2224, 3121, 21064, 5405

```
sudo firewall-cmd --zone=public --add-port=2224/tcp --add-port=3121/tcp --add-port=21064/tcp --add-port=5405/tcp --permanent
sudo firewall-cmd --reload
```

## Test Fencing
For Azure Fencing

```
[<username>@<VM2> ~]$ sudo pcs stonith describe fence_azure_arm
fence_azure_arm - Fence agent for Azure Resource Manager
```

By default, the fence action bring the node off then on. If you want to bring the node offline only, use option `--off`

```
sudo pcs stonith fence <VM2> --debug
```

Get

```
[<username>@<VM1> ~]$ sudo pcs stonith fence <VM2> --debug
Running: stonith_admin -B <VM2>
Return Value: 0
--Debug Output Start--
--Debug Output End--
 
Node: <VM2> fenced
```

 
From [Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_reference/s1-stonithtest-haar), test fencing with the pcs stonith fence command from any node (or even multiple times from different nodes). The `pcs stonith fence` command reads the cluster configuration from the CIB and calls the fence agent as configured to execute the fence action. This verifies that the cluster configuration is correct.
`pcs stonith fence node_name`
If the pcs stonith fence command works properly, that means the fencing configuration for the cluster should work when a fence event occurs.
 
# Add listener
 
Following <https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-alwayson-int-listener>
<https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-ps-alwayson-int-listener>
An availability group listener is a virtual network name that clients connect to for database access. On Azure virtual machines, a load balancer holds the IP address for the listener. The load balancer routes traffic to the instance of SQL Server that is listening on the probe port.
