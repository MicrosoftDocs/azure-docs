<properties 
	pageTitle="Using load-balanced sets to clusterize MySQL on Linux" 
	description="An article that illustrates patterns to setup a load-balanced, high availability Linux cluster on Azure using MySQL as an example" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="bureado" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="4/14/2015" 
	ms.author="jparrel"/>

# Using load-balanced sets to clusterize MySQL on Linux

* [Getting ready](#getting-ready)
* [Setting up the cluster](#setting-up-the-cluster)
* [Setting up MySQL](#setting-up-mysql)
* [Setting up Corosync](#setting-up-corosync)
* [Setting up Pacemaker](#setting-up-pacemaker)
* [Testing](#testing)
* [STONITH](#stonith)
* [Limitations](#limitations)

## Introduction

The purpose of this article is to explore and illustrate the different approaches available to deploy highly available Linux-based services on Microsoft Azure, exploring MySQL Server high availability as a primer. A video illustrating this approach is available on [Channel 9](http://channel9.msdn.com/Blogs/Open/Load-balancing-highly-available-Linux-services-on-Windows-Azure-OpenLDAP-and-MySQL).

We outline a shared-nothing two-node single-master MySQL high availability solution based on DRBD, Corosync and Pacemaker. Only one node is running MySQL at a time. Reading and writing from the DRBD resource is also limited to only one node at a time.

There is no need for a VIP solution like LVS since we use Microsoft Azure's Load Balanced Sets to provide both the round-robin functionality and the endpoint detection, removal and graceful recovery of the VIP. The VIP is a globally routable IPv4 address assigned by Microsoft Azure when we first create the cloud service.

There are other possible architectures for MySQL including NBD Cluster, Percona and Galera as well as several middleware solutions, including at least one available as a VM on [VM Depot](http://vmdepot.msopentech.com). As long as these solutions can replicate on unicast vs. multicast or broadcast and don't rely on shared storage or multiple network interfaces, the scenarios should be easy to deploy on Microsoft Azure.

Of course these clustering architectures can be extended to other products like PostgreSQL and OpenLDAP on a similar fashion. For example, this load balancing procedure with shared nothing was successfully tested with multi-master OpenLDAP, and you can watch it on our Channel 9 blog.

## Getting ready

You will need a Microsoft Azure account with a valid subscription able to create at least two (2) VMs (XS was used in this example), a network and a subnet, an affinity group and an availability set, as well as the ability to create new VHDs in the same region as the cloud service, and to attach them to the Linux VMs.

### Tested environment

- Ubuntu 13.10
  - DRBD
  - MySQL Server
  - Corosync and Pacemaker

### Affinity group

An affinity group for the solution is created by logging into the Azure Portal scrolling down to Settings and creating a new affinity group. Allocated resources created later will be assigned to this affinity group.

### Networks

A new network is created, and a subnet is created inside the network. We chose a 10.10.10.0/24 network with only one /24 subnet inside.

### Virtual machines

The first Ubuntu 13.10 VM is created using an Endorsed Ubuntu Gallery image, and called `hadb01`. A new cloud service is created in the process, called hadb. We call it this way to illustrate the shared, load-balanced nature that the service will have when we add more resources. The creation of `hadb01` is uneventful and completed using the portal. An endpoint for SSH is automatically created, and our created network is selected. We also choose to create a new availability set for the VMs.

Once the first VM is created (technically, when the cloud service is created) we proceed to create the second VM, `hadb02`. For the second VM we will also use Ubuntu 13.10 VM from the Gallery using the Portal but we will choose to use an existing cloud service, `hadb.cloudapp.net`, instead of creating a new one. The network and availability set should be automatically selected for us. An SSH endpoint will be created, too.

After both VMs have been created, we will take note of the SSH port for `hadb01` (TCP 22) and `hadb02` (automatically assigned by Azure)

### Attached storage

We attach a new disk to both VMs, and create new 5 GB disks in the process. The disks will be hosted in the VHD container in use for our main operating system disks. Once disks are created and attached there is no need for us to restart Linux as the kernel will see the new device (usually `/dev/sdc`, you can check `dmesg` for the output)

On each VM we proceed to create a new partition using `cfdisk` (primary, Linux partition) and write the new partition table. **Do not create a filesystem on this partition** .

## Setting up the cluster

In both Ubuntu VMs, we need to use APT to install Corosync, Pacemaker and DRBD. Using `apt-get`:

    sudo apt-get install corosync pacemaker drbd8-utils.

**Do not install MySQL at this time** . Debian and Ubuntu installation scripts will initialize a MySQL data directory on `/var/lib/mysql`, but since the directory will be superseded by a DRBD filesystem, we need to do this later.

At this point we should also verify (using `/sbin/ifconfig`) that both VMs are using addresses in the 10.10.10.0/24 subnet and that they can ping each other by name. If desired you can also use `ssh-keygen` and `ssh-copy-id` to make sure both VMs can communicate via SSH without requiring a password.

### Setting up DRBD

We will create a DRBD resource that uses the underlying `/dev/sdc1` partition to produce a `/dev/drbd1` resource able to be formatted using ext3 and used in both primary and secondary nodes. To do this, open `/etc/drbd.d/r0.res` and copy the following resource definition. Do this in both VMs:

    resource r0 {
      on `hadb01` {
        device  /dev/drbd1;
        disk   /dev/sdc1;
        address  10.10.10.4:7789;
        meta-disk internal;
      }
      on `hadb02` {
        device  /dev/drbd1;
        disk   /dev/sdc1;
        address  10.10.10.5:7789;
        meta-disk internal;
      }
    }

After doing this, initialize the resource using `drbdadm` in both VMs:

    sudo drbdadm -c /etc/drbd.conf role r0
    sudo drbdadm up r0

And finally, on the primary (`hadb01`) force ownership (primary) of the DRBD resource:

    sudo drbdadm primary --force r0

If you examine the contents of /proc/drbd (`sudo cat /proc/drbd`) on both VMs, you should see `Primary/Secondary` on `hadb01` and `Secondary/Primary` on `hadb02`, consistent with the solution at this point. The 5 GB disk will be synchronized over the 10.10.10.0/24 network at no charge to customers.

Once the disk is synchronized you can create the filesystem on `hadb01`. For testing purposes we used ext2 but the following instruction will create an ext3 filesystem:

    mkfs.ext3 /dev/drbd1

### Mounting the DRBD resource

On `hadb01` we're now ready to mount the DRBD resources. Debian and derivatives use `/var/lib/mysql` as MySQL's data directory. Since we haven't installed MySQL, we'll create the directory and mount the DRBD resource. On `hadb01`:

    sudo mkdir /var/lib/mysql
    sudo mount /dev/drbd1 /var/lib/mysql

## Setting up MySQL

Now you're ready to install MySQL on `hadb01`:

    sudo apt-get install mysql-server

For `hadb02`, you have two options. You can install mysql-server now, which will create /var/lib/mysql and fill it with a new data directory, and then proceed to remove the contents. On `hadb02`:

    sudo apt-get install mysql-server
    sudo service mysql stop
    sudo rm –rf /var/lib/mysql/*

The second option is to failover to `hadb02` and then install mysql-server there (installation scripts will notice the existing installation and won't touch it)

On `hadb01`:

    sudo drbdadm secondary –force r0

On `hadb02`:

    sudo drbdadm primary –force r0
    sudo apt-get install mysql-server

If you don't plan to failover DRBD now, the first option is easier although arguably less elegant. After you set this up, you can start working on your MySQL database. On `hadb02` (or whichever one of the servers is active, according to DRBD):

    mysql –u root –p
    CREATE DATABASE azureha;
    CREATE TABLE things ( id SERIAL, name VARCHAR(255) );
    INSERT INTO things VALUES (1, "Yet another entity");
    GRANT ALL ON things.\* TO root;

**Warning**: this last statement effectively disables authentication for the root user in this table. This should be replaced by your production-grade GRANT statements and is included only for illustrative purposes.

You also need to enable networking for MySQL if you want to make queries from outside the VMs, which is the purpose of this guide. On both VMs, open `/etc/mysql/my.cnf` and browse to `bind-address`, changing it from 127.0.0.1 to 0.0.0.0. After saving the file, issue a `sudo service mysql restart` on your current primary.

### Creating the MySQL Load Balanced Set

We will go back to the Azure Portal and browse to the `hadb01` VM, then Endpoints. We will create a new Endpoint, choose MySQL (TCP 3306) from the dropdown and tick on the *Create new load balanced set* box. We will call our load balanced endpoint `lb-mysql`. We will leave most of the options alone except for time which we'll reduce to 5 (seconds, minimum)

After the endpoint is created we go to `hadb02`, Endpoints, and create a new endpoint but we will choose `lb-mysql`, then select MySQL from the dropdown menu. You can also use the Azure CLI for this step.

At this moment we have everything we need for a manual operation of the cluster.

### Testing the load balanced set

Tests can be performed from an outside machine, by using any MySQL client, as well as applications (for example, phpMyAdmin running as an Azure Website) In this case we used MySQL's command line tool on another Linux box:

    mysql azureha –u root –h hadb.cloudapp.net –e "select * from things;"

### Manually failing over

You can simulate failovers now by shutting MySQL down, switching DRBD's primary, and starting MySQL again.

On hadb01:

    service mysql stop && umount /var/lib/mysql ; drbdadm secondary r0

Then, on hadb02:

    drbdadm primary r0 ; mount /dev/drbd1 /var/lib/mysql && service mysql start

Once you failover manually you can repeat your remote query and it should be working perfectly.

## Setting up Corosync

Corosync is the underlying cluster infrastructure required for Pacemaker to work. For Heartbeat v1 and v2 users (and other methodologies like Ultramonkey) Corosync is a split of the CRM functionalities, while Pacemaker remains more similar to Hearbeat in functionality.

The main constraint for Corosync on Azure is that Corosync prefers multicast over broadcast over unicast communications, but Microsoft Azure networking only supports unicast.

Fortunately, Corosync has a working unicast mode and the only real constraint is that, since all nodes are not communicating among themselves *automagically*, you need to define the nodes in your configuration files, including their IP addresses. We can use the Corosync example files for Unicast and just change bind address, node lists and logging directory (Ubuntu uses `/var/log/corosync` while the example files use `/var/log/cluster`) and enabling quorum tools. 

**Note the `transport: udpu` directive below and the manually defined IP addresses for the nodes**.

On `/etc/corosync/corosync.conf` for both nodes:

    totem {
      version: 2
      crypto_cipher: none
      crypto_hash: none
      interface {
        ringnumber: 0
        bindnetaddr: 10.10.10.0
        mcastport: 5405
        ttl: 1
      }
      transport: udpu
    }

    logging {
      fileline: off
      to_logfile: yes
      to_syslog: yes
      logfile: /var/log/corosync/corosync.log
      debug: off
      timestamp: on
      logger_subsys {
        subsys: QUORUM
        debug: off
        }
      }

    nodelist {
      node {
        ring0_addr: 10.10.10.4
        nodeid: 1
      }

      node {
        ring0_addr: 10.10.10.5
        nodeid: 2
      }
    }

    quorum {
      provider: corosync_votequorum
    }

We copy this configuration file in both VMs and start Corosync in both nodes:

    sudo service start corosync

Shortly after starting the service the cluster should be established in the current ring and quorum should be constituted. We can check this functionality by reviewing logs or:

    sudo corosync-quorumtool –l

An output similar to the image below should follow:

![corosync-quorumtool -l sample output](media/virtual-machines-linux-mysql-cluster/image001.png)

## Setting up Pacemaker

Pacemaker uses the cluster to monitor for resources, define when primaries go down and switch those resources to secondaries. Resources can be defined from a set of available scripts or from LSB (init-like) scripts, among other choices.

We want Pacemaker to "own" the DRBD resource, the mountpoint and the MySQL service. If Pacemaker can turn on and off DRBD, mount it/umount it and start/stop MySQL in the right order when something bad happens with the primary, our setup is complete.

When you first install Pacemaker, your configuration should be simple enough, something like:

    node $id="1" hadb01
      attributes standby="off"
    node $id="2" hadb02
      attributes standby="off"

Check it by running `sudo crm configure show`. Now, create a file (say, `/tmp/cluster.conf`) with the following resources:

    primitive drbd_mysql ocf:linbit:drbd \
          params drbd_resource="r0" \
          op monitor interval="29s" role="Master" \
          op monitor interval="31s" role="Slave"
    
    ms ms_drbd_mysql drbd_mysql \
          meta master-max="1" master-node-max="1" \
            clone-max="2" clone-node-max="1" \
            notify="true"

    primitive fs_mysql ocf:heartbeat:Filesystem \
          params device="/dev/drbd/by-res/r0" \
          directory="/var/lib/mysql" fstype="ext3"

    primitive mysqld lsb:mysql

    group mysql fs_mysql mysqld

    colocation mysql_on_drbd \
           inf: mysql ms_drbd_mysql:Master

    order mysql_after_drbd \
           inf: ms_drbd_mysql:promote mysql:start

    property stonith-enabled=false

    property no-quorum-policy=ignore

And now load it into the configuration (you only need to do this in one node):

    sudo crm configure
      load update /tmp/cluster.conf
      commit
      exit

Also, make sure that Pacemaker starts at boot in both nodes:

    sudo update-rc.d pacemaker defaults

After a few seconds, and using `sudo crm_mon –L`, verify that one of your nodes has become the master for the cluster, and is running all the resources. You can use mount and ps to check that the resources are running.

The following screenshot shows `crm_mon` with one node stopped (exit using Control-C)

![crm_mon node stopped](media/virtual-machines-linux-mysql-cluster/image002.png)

And this screenshot shows both nodes, with one master and one slave:

![crm_mon operational master/slave](media/virtual-machines-linux-mysql-cluster/image003.png) 

## Testing

We're ready for an automatic failover simulation. There are two ways to doing this: soft and hard. The soft way is using the cluster's shutdown function: ``crm_standby -U `uname -n` -v on``. Using this on the master, the slave will take over. Remember to set this back to off (crm_mon will tell you one node is on standby otherwise)

The hard way is shutting down the primary VM (hadb01) via the Portal or changing the runlevel on the VM (i.e., halt, shutdown) then we're helping Corosync and Pacemaker by signaling master's going down. We can test this (useful for maintenance windows) but we can also force the scenario by just freezing the VM.

## STONITH

It should be possible to issue a VM shutdown via Azure Command Line Tools for Linux in lieu of a STONITH script that controls a physical device. You can use `/usr/lib/stonith/plugins/external/ssh` as a base and enable STONITH in the cluster's configuration. Azure CLI should be globally installed and the publish settings/profile should be loaded for the cluster's user.

Sample code for the resource available on [GitHub](https://github.com/bureado/aztonith). You need to change the cluster's configuration by adding the following to `sudo crm configure`:

    primitive st-azure stonith:external/azure \
      params hostlist="hadb01 hadb02" \
      clone fencing st-azure \
      property stonith-enabled=true \
      commit

**Note:** the script doesn't perform up/down checks. The original SSH resource had 15 ping checks but recovery time for an Azure VM might be more variable.

## Limitations

The following limitations apply:

- The linbit DRBD resource script that manages DRBD as a resource in Pacemaker uses `drbdadm down` when shutting down a node, even if the node is just going standby. This is not ideal since the slave will not be synchronizing the DRBD resource while the master gets writes. If the master does not fail graciously, the slave can take over an older filesystem state. There are two potential ways of solving this:
  - Enforcing a `drbdadm up r0` in all cluster nodes via a local (not clusterized) watchdog, or,
  - Editing the linbit DRBD script making sure that `down` is not called, in `/usr/lib/ocf/resource.d/linbit/drbd`.
- Load balancer needs at least 5 seconds to respond, so applications should be cluster aware and be more tolerant of timeout; other architectures can also help, for example in-app queues, query middlewares, etc.
- MySQL tuning is necessary to ensure writing is done at a sane pace and caches are flushed to disk as frequently as possible to minimize memory loss
- Write performance will be dependent in VM interconnect in the virtual switch as this is the mechanism used by DRBD to replicate the device
