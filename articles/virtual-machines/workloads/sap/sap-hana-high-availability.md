---
title: High Availability of SAP HANA on Azure Virtual Machines (VMs) | Microsoft Docs
description: Establish High Availability of SAP HANA on Azure Virtual Machines (VMs).
services: virtual-machines-linux
documentationcenter: 
author: MSSedusch
manager: timlt
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/25/2017
ms.author: sedusch

---
# High Availability of SAP HANA on Azure Virtual Machines (VMs)

[dbms-guide]:dbms-guide.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[hana-ha-guide-replication]:sap-hana-high-availability.md#14c19f65-b5aa-4856-9594-b81c7e4df73d
[hana-ha-guide-shared-storage]:sap-hana-high-availability.md#498de331-fa04-490b-997c-b078de457c9d
[2205917]:https://launchpad.support.sap.com/#/notes/2205917
[1944799]:https://launchpad.support.sap.com/#/notes/1944799
[suse-hana-ha-guide]:https://www.suse.com/docrep/documents/ir8w88iwu7/suse_linux_enterprise_server_for_sap_applications_12_sp1.pdf
[sap-swcenter]:https://launchpad.support.sap.com/#/softwarecenter
[template-multisid-db]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db%2Fazuredeploy.json
[template-converged]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-converged%2Fazuredeploy.json

On-premises, you can use either HANA System Replication or use shared storage to establish high availability for SAP HANA.
We currently only support setting up HANA System Replication on Azure. 
SAP HANA Replication consists of one master node and at least one slave node. Changes to the data on the master node are replicated to the slave nodes synchronously or asynchronously.

This article describes how to deploy the virtual machines, configure the virtual machines, install the cluster framework, install and configure SAP HANA System Replication.
In the example configurations, installation commands etc. instance number 03 and HANA System ID HDB is used.

Read the following SAP Notes and papers first

* SAP Note [2205917]  
  Recommended OS settings for SUSE Linux Enterprise Server for SAP Applications
* SAP Note [1944799]  
  SAP HANA Guidelines for SUSE Linux Enterprise Server for SAP Applications
* [SAP HANA SR Performance Optimized Scenario][suse-hana-ha-guide]  
  The guide contains all required information to set up SAP HANA System Replication on-premises. Use this guide as a baseline.
## Deploying Linux

The resource agent for SAP HANA is included in SUSE Linux Enterprise Server for SAP Applications.
The Azure Marketplace contains an image for SUSE Linux Enterprise Server for SAP Applications 12 with BYOS (Bring Your Own Subscription) that you can use to deploy new virtual machines.

### Manual Deployment

1. Create a Resource Group
1. Create a Virtual Network
1. Create two Storage Accounts
1. Create an Availability Set  
   Set max update domain
1. Create a Load Balancer (internal)  
   Select VNET of step above
1. Create Virtual Machine 1  
   https://portal.azure.com/#create/suse-byos.sles-for-sap-byos12-sp1  
   SLES For SAP Applications 12 SP1 (BYOS)  
   Select Storage Account 1  
   Select Availability Set  
1. Create Virtual Machine 2  
   https://portal.azure.com/#create/suse-byos.sles-for-sap-byos12-sp1  
   SLES For SAP Applications 12 SP1 (BYOS)  
   Select Storage Account 2   
   Select Availability Set  
1. Add Data Disks
1. Configure the load balancer
    1. Create a frontend IP pool
        1. Open the load balancer, select frontend IP pool and click Add
        1. Enter the name of the new frontend IP pool (for example hana-frontend)
       1. Click OK
        1. After the new frontend IP pool is created, write down its IP address
    1. Create a backend pool
        1. Open the load balancer, select backend pools and click Add
        1. Enter the name of the new backend pool (for example hana-backend)
        1. Click Add a virtual machine
        1. Select the Availability Set you created earlier
        1. Select the virtual machines of the SAP HANA cluster
        1. Click OK
    1. Create a health probe
       1. Open the load balancer, select health probes and click Add
        1. Enter the name of the new health probe (for example hana-hp)
        1. Select TCP as protocol, port 625**03**, keep Interval 5 and Unhealthy threshold 2
        1. Click OK
    1. Create load balancing rules
        1. Open the load balancer, select load balancing rules and click Add
        1. Enter the name of the new load balancer rule (for example hana-lb-3**03**15)
        1. Select the frontend IP address, backend pool and health probe you created earlier (for example hana-frontend)
        1. Keep protocol TCP, enter port 3**03**15
        1. Increase idle timeout to 30 minutes
       1. **Make sure to enable Floating IP**
        1. Click OK
        1. Repeat the steps above for port 3**03**17

### Deploy with template
You can use one of the quick start templates on github to deploy all required resources. The template deploys the virtual machines, the load balancer, availability set etc.
Follow these steps to deploy the template:

1. Open the [database template][template-multisid-db] or the [converged template][template-converged] on the Azure Portal
   The database template only creates the load-balancing rules for a database whereas the converged template also creates the load-balancing rules for an ASCS/SCS and ERS (Linux only) instance. If you plan to install an SAP NetWeaver based system and you also want to install the ASCS/SCS instance on the same machines, use the [converged template][template-converged].
1. Enter the following parameters
    1. Sap System Id  
       Enter the SAP system Id of the SAP system you want to install. The Id will be used as a prefix for the resources that are deployed.
    1. Stack Type (only applicable if you use the converged template)  
       Select the SAP NetWeaver stack type
    1. Os Type  
       Select one of the Linux distributions. For this example, select SLES 12 BYOS
    1. Db Type  
       Select HANA
    1. Sap System Size  
       The amount of SAPS the new system will provide. If you are not sure how many SAPS the system will require, please ask your SAP Technology Partner or System Integrator
    1. System Availability  
       Select HA
    1. Admin Username and Admin Password  
       A new user is created that can be used to log on to the machine.
    1. New Or Existing Subnet  
       Determines whether a new virtual network and subnet should be created or an existing subnet should be used. If you already have a virtual network that is connected to your on-premises network, select existing.
    1. Subnet Id  
    The ID of the subnet to which the virtual machines should be connected to. Select the subnet of your VPN or Express Route virtual network to connect the virtual machine to your on-premises network. The ID usually looks like /subscriptions/`<subscription id`>/resourceGroups/`<resource group name`>/providers/Microsoft.Network/virtualNetworks/`<virtual network name`>/subnets/`<subnet name`>

## Setting up Linux HA

The following items are prefixed with either [A] - applicable to all nodes, [1] - only applicable to node 1 or [2] - only applicable to node 2.

1. [A] SLES for SAP BYOS only - Register SLES to be able to use the repositories
1. [A] SLES for SAP BYOS only - Add public-cloud module
1. [A] Update SLES
    ```bash
    sudo zypper update

    ```

1. [1] Enable ssh access
    ```bash
    sudo ssh-keygen -tdsa
    
    # Enter file in which to save the key (/root/.ssh/id_dsa): -> ENTER
    # Enter passphrase (empty for no passphrase): -> ENTER
    # Enter same passphrase again: -> ENTER
    
    # copy the public key
    sudo cat /root/.ssh/id_dsa.pub
    ```

2. [2] Enable ssh access
    ```bash
    sudo ssh-keygen -tdsa

    # insert the public key you copied in the last step into the authorized keys file on the second server
    sudo vi /root/.ssh/authorized_keys
    
    # Enter file in which to save the key (/root/.ssh/id_dsa): -> ENTER
    # Enter passphrase (empty for no passphrase): -> ENTER
    # Enter same passphrase again: -> ENTER
    
    # copy the public key    
    sudo cat /root/.ssh/id_dsa.pub
    ```

1. [1] Enable ssh access
    ```bash
    # insert the public key you copied in the last step into the authorized keys file on the first server
    sudo vi /root/.ssh/authorized_keys
    
    ```

1. [A] Install HA extension
    ```bash
    sudo zypper install sle-ha-release fence-agents
    
    ```

1. [A] Setup disk layout
    1. LVM  
    We generally recommend to use LVM for volumes that store data and log files. The example below assume that the virtual machines have four data disks attached that should be used to create two volumes.
        * Create physical volumes for all disks that you want to use.
    <pre><code>
    sudo pvcreate /dev/sdc
    sudo pvcreate /dev/sdd
    sudo pvcreate /dev/sde
    sudo pvcreate /dev/sdf
    </code></pre>
        * Create a volume group for the data files, one volume group for the log files and one for the shared directory of SAP HANA
    <pre><code>
    sudo vgcreate vg_hana_data /dev/sdc /dev/sdd
    sudo vgcreate vg_hana_log /dev/sde
    sudo vgcreate vg_hana_shared /dev/sdf
    </code></pre>
        * Create the logical volumes
    <pre><code>
    sudo lvcreate -l 100%FREE -n hana_data vg_hana_data
    sudo lvcreate -l 100%FREE -n hana_log vg_hana_log
    sudo lvcreate -l 100%FREE -n hana_shared vg_hana_shared
    sudo mkfs.xfs /dev/vg_hana_data/hana_data
    sudo mkfs.xfs /dev/vg_hana_log/hana_log
    sudo mkfs.xfs /dev/vg_hana_shared/hana_shared
    </code></pre>
        * Create the mount directories and copy the UUID of all logical volumes
    <pre><code>
    sudo mkdir -p /hana/data
    sudo mkdir -p /hana/log
    sudo mkdir -p /hana/shared
    # write down the id of /dev/vg_hana_data/hana_data, /dev/vg_hana_log/hana_log and /dev/vg_hana_shared/hana_shared
    sudo blkid
    </code></pre>
        * Create fstab entries for the three logical volumes
    <pre><code>
    sudo vi /etc/fstab
    </code></pre>
    Insert this line to /etc/fstab
    <pre><code>
    /dev/disk/by-uuid/<b>&lt;UUID of /dev/vg_hana_data/hana_data&gt;</b> /hana/data xfs  defaults,nofail  0  2
    /dev/disk/by-uuid/<b>&lt;UUID of /dev/vg_hana_log/hana_log&gt;</b> /hana/log xfs  defaults,nofail  0  2
    /dev/disk/by-uuid/<b>&lt;UUID of /dev/vg_hana_shared/hana_shared&gt;</b> /hana/shared xfs  defaults,nofail  0  2
    </code></pre>
        * Mount the new volumes
    <pre><code>
    sudo mount -a
    </code></pre>
    1. Plain Disks  
       For small or demo systems, you can place your HANA data and log files on one disk. The following commands create a partition on /dev/sdc and format it with xfs.
    ```bash
    sudo fdisk /dev/sdc
    sudo mkfs.xfs /dev/sdc1
    
    # write down the id of /dev/sdc1
    sudo /sbin/blkid
    sudo vi /etc/fstab
    ```

    Insert this line to /etc/fstab
    <pre><code>
    /dev/disk/by-uuid/<b>&lt;UUID&gt;</b> /hana xfs  defaults,nofail  0  2
    </code></pre>

    Create the target directory and mount the disk.

    ```bash
    sudo mkdir /hana
    sudo mount -a
    ```

1. [A] Setup host name resolution for all hosts  
    You can either use a DNS server or modify the /etc/hosts on all nodes. This example shows how to use the /etc/hosts file.
    Replace the IP address and the hostname in the following commands
    ```bash
    sudo vi /etc/hosts
    ```
    Insert the following lines to /etc/hosts. Change the IP address and hostname to match your environment    
    
    <pre><code>
    <b>&lt;IP address of host 1&gt; &lt;hostname of host 1&gt;</b>
    <b>&lt;IP address of host 2&gt; &lt;hostname of host 2&gt;</b>
    </code></pre>

1. [1] Install Cluster
    ```bash
    sudo ha-cluster-init
    
    # Do you want to continue anyway? [y/N] -> y
    # Network address to bind to (e.g.: 192.168.1.0) [10.79.227.0] -> ENTER
    # Multicast address (e.g.: 239.x.x.x) [239.174.218.125] -> ENTER
    # Multicast port [5405] -> ENTER
    # Do you wish to use SBD? [y/N] -> N
    # Do you wish to configure an administration IP? [y/N] -> N
    ```
        
1. [2] Add node to cluster
    ```bash
    sudo ha-cluster-join
        
    # WARNING: NTP is not configured to start at system boot.
    # WARNING: No watchdog device found. If SBD is used, the cluster will be unable to start without a watchdog.
    # Do you want to continue anyway? [y/N] -> y
    # IP address or hostname of existing node (e.g.: 192.168.1.1) [] -> IP address of node 1 e.g. 10.0.0.5
    # /root/.ssh/id_dsa already exists - overwrite? [y/N] N
    ```

1. [A] Change hacluster password to the same password
    ```bash
    sudo passwd hacluster
    
    ```

1. [A] Configure corosync to use other transport and add nodelist. Cluster will not work otherwise.
    ```bash
    sudo vi /etc/corosync/corosync.conf    
    
    ```

    Add the following bold content to the file.
    
    <pre><code> 
    [...]
      interface { 
          [...] 
      }
      <b>transport:      udpu</b>
    } 
    <b>nodelist {
      node {
        ring0_addr:     < ip address of note 1 >
      }
      node {
        ring0_addr:     < ip address of note 2 > 
      } 
    }</b>
    logging {
      [...]
    </code></pre>

    Then restart the corosync service

    ```bash
    sudo service corosync restart
    
    ```

1. [A] Install HANA HA packages  
    ```bash
    sudo zypper install SAPHanaSR
    
    ```

## Installing SAP HANA

Follow chapter 4 of the [SAP HANA SR Performance Optimized Scenario guide][suse-hana-ha-guide] to install SAP HANA System Replication.

1. [A] Run hdblcm from the HANA DVD
    * Choose installation -> 1
    * Select additional components for installation -> 1
    * Enter Installation Path [/hana/shared]: -> ENTER
    * Enter Local Host Name [..]: -> ENTER
    * Do you want to add additional hosts to the system? (y/n) [n]: -> ENTER
    * Enter SAP HANA System ID: <SID of HANA e.g. HDB>
    * Enter Instance Number [00]:   
  HANA Instance number. Use 03 if you used the Azure Template or followed the example above
    * Select Database Mode / Enter Index [1]: -> ENTER
    * Select System Usage / Enter Index [4]:  
  Select the system Usage
    * Enter Location of Data Volumes [/hana/data/HDB]: -> ENTER
    * Enter Location of Log Volumes [/hana/log/HDB]: -> ENTER
    * Restrict maximum memory allocation? [n]: -> ENTER
    * Enter Certificate Host Name For Host '...' [...]: -> ENTER
    * Enter SAP Host Agent User (sapadm) Password:
    * Confirm SAP Host Agent User (sapadm) Password:
    * Enter System Administrator (hdbadm) Password:
    * Confirm System Administrator (hdbadm) Password:
    * Enter System Administrator Home Directory [/usr/sap/HDB/home]: -> ENTER
    * Enter System Administrator Login Shell [/bin/sh]: -> ENTER
    * Enter System Administrator User ID [1001]: -> ENTER
    * Enter ID of User Group (sapsys) [79]: -> ENTER
    * Enter Database User (SYSTEM) Password:
    * Confirm Database User (SYSTEM) Password:
    * Restart system after machine reboot? [n]: -> ENTER
    * Do you want to continue? (y/n):  
  Validate the summary and enter y to continue
1. [A] Upgrade SAP Host Agent  
  Download the latest SAP Host Agent archive from the [SAP Softwarecenter][sap-swcenter] and run the following command to upgrade the agent. Replace the path to the archive to point to the file you downloaded.
    ```bash
    sudo /usr/sap/hostctrl/exe/saphostexec -upgrade -archive <path to SAP Host Agent SAR>
    ```

1. [1] Create HANA replication (as root)  
    Run the following command. Make sure to replace bold strings (HANA System ID HDB and instance number 03) with the values of your SAP HANA installation.
    <pre><code>
    PATH="$PATH:/usr/sap/<b>HDB</b>/HDB<b>03</b>/exe"
    hdbsql -u system -i <b>03</b> 'CREATE USER <b>hdb</b>hasync PASSWORD "<b>passwd</b>"' 
    hdbsql -u system -i <b>03</b> 'GRANT DATA ADMIN TO <b>hdb</b>hasync' 
    hdbsql -u system -i <b>03</b> 'ALTER USER <b>hdb</b>hasync DISABLE PASSWORD LIFETIME' 
    </code></pre>

1. [A] Create keystore entry (as root)
    <pre><code>
    PATH="$PATH:/usr/sap/<b>HDB</b>/HDB<b>03</b>/exe"
    hdbuserstore SET <b>hdb</b>haloc localhost:3<b>03</b>15 <b>hdb</b>hasync <b>passwd</b>
    </code></pre>
1. [1] Backup database (as root)
    <pre><code>
    PATH="$PATH:/usr/sap/<b>HDB</b>/HDB<b>03</b>/exe"
    hdbsql -u system -i <b>03</b> "BACKUP DATA USING FILE ('<b>initialbackup</b>')" 
    </code></pre>
1. [1] Switch to the sapsid user (for example hdbadm) and create the primary site.
    <pre><code>
    su - <b>hdb</b>adm
    hdbnsutil -sr_enable –-name=<b>SITE1</b>
    </code></pre>
1. [2] Switch to the sapsid user (for example hdbadm) and create the secondary site.
    <pre><code>
    su - <b>hdb</b>adm
    sapcontrol -nr <b>03</b> -function StopWait 600 10
    hdbnsutil -sr_register --remoteHost=<b>saphanavm1</b> --remoteInstance=<b>03</b> --replicationMode=sync --name=<b>SITE2</b> 
    </code></pre>

## Configure Cluster Framework

Change the default settings

<pre>
sudo vi crm-defaults.txt
# enter the following to crm-saphana.txt
<code>
property $id="cib-bootstrap-options" \
  no-quorum-policy="ignore" \
  stonith-enabled="true" \
  stonith-action="reboot" \
  stonith-timeout="150s"
rsc_defaults $id="rsc-options" \
  resource-stickiness="1000" \
  migration-threshold="5000"
op_defaults $id="op-options" \
  timeout="600"
</code>

# now we load the file to the cluster
sudo crm configure load update crm-defaults.txt
</pre>

### Create STONITH device

The STONITH device uses a Service Principal to authorize against Microsoft Azure. Please follow these steps to create a Service Principal.

1. Go to <https://portal.azure.com>
1. Open the Azure Active Directory blade  
   Go to Properties and write down the Directory Id. This is the **tenant id**.
1. Click App registrations
1. Click Add
1. Enter a Name, select Application Type "Web app/API", enter a sign-on URL (for example http://localhost) and click Create
1. The sign-on URL is not used and can be any valid URL
1. Select the new App and click Keys in the Settings tab
1. Enter a description for a new key, select "Never expires" and click Save
1. Write down the Value. It is used as the **password** for the Service Principal
1. Write down the Application Id. It is used as the username (**login id** in the steps below) of the Service Principal

The Service Principal does not have permissions to access your Azure resources by default. You need to give the Service Principal permissions to start and stop (deallocate) all virtual machines of the cluster.

1. Go to https://portal.azure.com
1. Open the All resources blade
1. Select the virtual machine
1. Click Access control (IAM)
1. Click Add
1. Select the role Owner
1. Enter the name of the application you created above
1. Click OK

After you edited the permissions for the virtual machines, you can configure the STONITH devices in the cluster.

<pre>
sudo vi crm-fencing.txt
# enter the following to crm-fencing.txt
# replace the bold string with your subscription id, resource group, tenant id, service principal id and password
<code>
primitive rsc_st_azure_1 stonith:fence_azure_arm \
    params subscriptionId="<b>subscription id</b>" resourceGroup="<b>resource group</b>" tenantId="<b>tenant id</b>" login="<b>login id</b>" passwd="<b>password</b>"

primitive rsc_st_azure_2 stonith:fence_azure_arm \
    params subscriptionId="<b>subscription id</b>" resourceGroup="<b>resource group</b>" tenantId="<b>tenant id</b>" login="<b>login id</b>" passwd="<b>password</b>"

colocation col_st_azure -2000: rsc_st_azure_1:Started rsc_st_azure_2:Started
</code>

# now we load the file to the cluster
sudo crm configure load update crm-fencing.txt
</pre>

### Create SAP HANA resources

<pre>
sudo vi crm-saphanatop.txt
# enter the following to crm-saphana.txt
# replace the bold string with your instance number and HANA system id
<code>
primitive rsc_SAPHanaTopology_<b>HDB</b>_HDB<b>03</b> ocf:suse:SAPHanaTopology \
    operations $id="rsc_sap2_<b>HDB</b>_HDB<b>03</b>-operations" \
    op monitor interval="10" timeout="600" \
    op start interval="0" timeout="600" \
    op stop interval="0" timeout="300" \
    params SID="<b>HDB</b>" InstanceNumber="<b>03</b>"

clone cln_SAPHanaTopology_<b>HDB</b>_HDB<b>03</b> rsc_SAPHanaTopology_<b>HDB</b>_HDB<b>03</b> \
    meta is-managed="true" clone-node-max="1" target-role="Started" interleave="true"
</code>

# now we load the file to the cluster
sudo crm configure load update crm-saphanatop.txt
</pre>

<pre>
sudo vi crm-saphana.txt
# enter the following to crm-saphana.txt
# replace the bold string with your instance number, HANA system id and the frontend IP address of the Azure load balancer. 
<code>
primitive rsc_SAPHana_<b>HDB</b>_HDB<b>03</b> ocf:suse:SAPHana \
    operations $id="rsc_sap_<b>HDB</b>_HDB<b>03</b>-operations" \
    op start interval="0" timeout="3600" \
    op stop interval="0" timeout="3600" \
    op promote interval="0" timeout="3600" \
    op monitor interval="60" role="Master" timeout="700" \
    op monitor interval="61" role="Slave" timeout="700" \
    params SID="<b>HDB</b>" InstanceNumber="<b>03</b>" PREFER_SITE_TAKEOVER="true" \
    DUPLICATE_PRIMARY_TIMEOUT="7200" AUTOMATED_REGISTER="false"

ms msl_SAPHana_<b>HDB</b>_HDB<b>03</b> rsc_SAPHana_<b>HDB</b>_HDB<b>03</b> \
    meta is-managed="true" notify="true" clone-max="2" clone-node-max="1" \
    target-role="Started" interleave="true"

primitive rsc_ip_<b>HDB</b>_HDB<b>03</b> ocf:heartbeat:IPaddr2 \ 
    meta target-role="Started" is-managed="true" \ 
    operations $id="rsc_ip_<b>HDB</b>_HDB<b>03</b>-operations" \ 
    op monitor interval="10s" timeout="20s" \ 
    params ip="<b>10.0.0.21</b>" 
primitive rsc_nc_<b>HDB</b>_HDB<b>03</b> anything \ 
    params binfile="/usr/bin/nc" cmdline_options="-l -k 625<b>03</b>" \ 
    op monitor timeout=20s interval=10 depth=0 
group g_ip_<b>HDB</b>_HDB<b>03</b> rsc_ip_<b>HDB</b>_HDB<b>03</b> rsc_nc_<b>HDB</b>_HDB<b>03</b>
 
colocation col_saphana_ip_<b>HDB</b>_HDB<b>03</b> 2000: g_ip_<b>HDB</b>_HDB<b>03</b>:Started \ 
    msl_SAPHana_<b>HDB</b>_HDB<b>03</b>:Master  
order ord_SAPHana_<b>HDB</b>_HDB<b>03</b> 2000: cln_SAPHanaTopology_<b>HDB</b>_HDB<b>03</b> \ 
    msl_SAPHana_<b>HDB</b>_HDB<b>03</b>
</code>

# now we load the file to the cluster
sudo crm configure load update crm-saphana.txt
</pre>

### Test cluster setup
The following chapter describe how you can test your setup. Every test assumes that you are root and the SAP HANA master is running on the virtual machine saphanavm1.

#### Fencing Test

You can test the setup of the fencing agent by disabling the network interface on node saphanavm1.

<pre><code>
sudo ifdown eth0
</code></pre>

The virtual machine should now get restarted or stopped depending on your cluster configuration.
If you set the stonith-action to off, the virtual machine will be stopped and the resources are migrated to the running virtual machine.

Once you start the virtual machine again, the SAP HANA resource will fail to start as secondary if you set AUTOMATED_REGISTER="false". In this case, you need to configure the HANA instance as secondary by executing the following command:

<pre><code>
su - <b>hdb</b>adm

# Stop the HANA instance just in case it is running
sapcontrol -nr <b>03</b> -function StopWait 600 10
hdbnsutil -sr_register --remoteHost=<b>saphanavm2</b> --remoteInstance=<b>03</b> --replicationMode=sync --name=<b>SITE1</b>

# switch back to root and cleanup the failed state
exit
crm resource cleanup msl_SAPHana_<b>HDB</b>_HDB<b>03</b> <b>saphanavm1</b>
</code></pre>

#### Testing a manual failover

You can test a manual failover by stopping the pacemaker service on node saphanavm1.
<pre><code>
service pacemaker stop
</code></pre>

After the failover, you can start the service again. The SAP HANA resource on saphanavm1 will fail to start as secondary if you set AUTOMATED_REGISTER="false". In this case, you need to configure the HANA instance as secondary by executing the following command:

<pre><code>
service pacemaker start
su - <b>hdb</b>adm

# Stop the HANA instance just in case it is running
sapcontrol -nr <b>03</b> -function StopWait 600 10
hdbnsutil -sr_register --remoteHost=<b>saphanavm2</b> --remoteInstance=<b>03</b> --replicationMode=sync --name=<b>SITE1</b> 


# switch back to root and cleanup the failed state
exit
crm resource cleanup msl_SAPHana_<b>HDB</b>_HDB<b>03</b> <b>saphanavm1</b>
</code></pre>

#### Testing a migration

You can migrate the SAP HANA master node by executing the following command
<pre><code>
crm resource migrate msl_SAPHana_<b>HDB</b>_HDB<b>03</b> <b>saphanavm2</b>
crm resource migrate g_ip_<b>HDB</b>_HDB<b>03</b> <b>saphanavm2</b>
</code></pre>

This should migrate the SAP HANA master node and the group that contains the virtual IP address to saphanavm2.
The SAP HANA resource on saphanavm1 will fail to start as secondary if you set AUTOMATED_REGISTER="false". In this case, you need to configure the HANA instance as secondary by executing the following command:

<pre><code>
su - <b>hdb</b>adm

# Stop the HANA instance just in case it is running
sapcontrol -nr <b>03</b> -function StopWait 600 10
hdbnsutil -sr_register --remoteHost=<b>saphanavm2</b> --remoteInstance=<b>03</b> --replicationMode=sync --name=<b>SITE1</b> 
</code></pre>

The migration creates location contraints that need to be deleted again.

<pre><code>
crm configure edited

# delete location contraints that are named like the following contraint. You should have two contraints, one for the SAP HANA resource and one for the IP address group.
location cli-prefer-g_ip_<b>HDB</b>_HDB<b>03</b> g_ip_<b>HDB</b>_HDB<b>03</b> role=Started inf: <b>saphanavm2</b>
</code></pre>

You also need to cleanup the state of the secondary node resource

<pre><code>
# switch back to root and cleanup the failed state
exit
crm resource cleanup msl_SAPHana_<b>HDB</b>_HDB<b>03</b> <b>saphanavm1</b>
</code></pre>

## Next steps
* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure (large instances), see [SAP HANA (large instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md). 
