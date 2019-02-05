---
title: Run a Cassandra cluster on Linux in Azure from Node.js
description: Learn how to run a Cassandra cluster on Linux in Azure Virtual Machines from a Node.js app
services: virtual-machines-linux
documentationcenter: nodejs
author: craigshoemaker
manager: routlaw
editor: ''
tags: azure-service-management
ms.assetid: 30de1f29-e97d-492f-ae34-41ec83488de0
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/17/2017
ms.author: cshoe
---

# Run a Cassandra cluster on Linux in Azure with Node.js

> [!IMPORTANT]
> Azure has two deployment models for creating and working with resources: [Azure Resource Manager and classic](../../../resource-manager-deployment-model.md). This article uses the classic deployment model. We recommend that most new deployments use the Resource Manager model. See Resource Manager templates for [Datastax Enterprise](https://azure.microsoft.com/documentation/templates/datastax) and [Spark cluster and Cassandra on CentOS](https://azure.microsoft.com/documentation/templates/spark-and-cassandra-on-centos/).

## Overview
Microsoft Azure is an open cloud platform that runs Microsoft and non-Microsoft software. This software includes operating systems, application servers, messaging middleware, and SQL and NoSQL databases from both commercial and open-source models. Building resilient services on public clouds like Azure requires careful planning and deliberate architecture for applications, servers, and storage layers. 

Cassandra’s distributed storage architecture helps in building highly available systems that are fault tolerant for cluster failures. Cassandra is a cloud-scale NoSQL database maintained by [Apache Software Foundation](http://cassandra.apache.org/). Cassandra is written in Java, so it runs on Windows and Linux platforms.

This article shows Cassandra deployment on Ubuntu as a single- and multiple-datacenter cluster that uses Azure Virtual Machines and Azure Virtual Networks. The cluster deployment for production-optimized workloads is out of scope for this article. It requires multiple-disk node configuration, appropriate ring topology design, and data modeling to support the needed replication, data consistency, throughput, and high-availability requirements.

This article shows what's involved in building the Cassandra cluster, as compared to Docker, Chef, or Puppet. This approach can make the infrastructure deployment a lot easier.

## Deployment models
Microsoft Azure networking allows the deployment of isolated private clusters. You can restrict the access of the clusters to get detailed network security. This article shows the Cassandra deployment at a fundamental level. It doesn't focus on the consistency level and the optimal storage design for throughput. 

Here are the networking requirements for the hypothetical cluster:

* External systems can’t access the Cassandra database from within or outside Azure.
* The Cassandra cluster must be behind a load balancer for thrift traffic.
* You deploy Cassandra nodes in two groups in each datacenter for enhanced cluster availability.
* You lock down the cluster so that only the application server farm has access to the database directly.
* No public networking endpoints exist, other than SSH.
* Each Cassandra node needs a fixed internal IP address.

Cassandra can be deployed to a single Azure region or to multiple regions. Deployment is based on the distributed nature of the workload. A multiple-region deployment model can serve users who are closer to a particular geography through the same Cassandra infrastructure. 

Cassandra’s built-in node replication takes care of the synchronization of multi-master writes that originate from multiple datacenters. It presents a consistent view of the data to applications. 

Multiple-region deployment also can help with the risk mitigation of broader Azure service outages. Cassandra’s tunable consistency and replication topology help to meet the diverse recovery point objectives (RPOs) of applications.

### Single-region deployment
Let's start with a single-region deployment and use what we learn to create a multiple-region model. We use an Azure virtual network to create isolated subnets that meet network security requirements. 

The process described in creating the single-region deployment uses Ubuntu 14.04 LTS and Cassandra 2.08. But the process can easily be adopted to the other Linux variants. The single-region deployment includes the following characteristics:

**High availability:** The Cassandra nodes shown in Figure 1 are deployed to two availability sets. The nodes are spread between multiple fault domains for high availability. VMs annotated with each availability set are mapped to two fault domains. 

Azure uses the concept of fault domains to manage unplanned downtime, such as hardware or software failures. The concept of upgrade domains is used to manage scheduled downtime. Examples are host or guest OS patching or upgrades or application upgrades. For more information on the role of fault and upgrade domains to reach high availability, see [Disaster recovery and high availability for Azure applications](https://msdn.microsoft.com/library/dn251004.aspx).

![Single-region deployment](./media/cassandra-nodejs/cassandra-linux1.png)

Figure 1: Single-region deployment

Azure doesn’t allow the explicit mapping of a group of VMs to a specific fault domain. Even with the deployment model shown in Figure 1, it's statistically probable that all the virtual machines are mapped to two fault domains instead of four.

**Load-balancing thrift traffic:** Thrift client libraries inside the web server connect to the cluster through an internal load balancer. This process requires adding the internal load balancer to the “data” subnet in the context of the cloud service that hosts the Cassandra cluster, as shown in Figure 1. 

After the internal load balancer is defined, each node requires the load-balanced endpoint to be added with the annotations of a load-balanced set with the previously defined load-balancer name. For more information, see [Azure internal load balancing](../../../load-balancer/load-balancer-internal-overview.md).

**Cluster seeds:** Select the most highly available nodes for seeds. The new nodes communicate with seed nodes to discover the topology of the cluster. To avoid a single point of failure, make one node from each availability set the seed node.

**Replication factor and consistency level:** Cassandra’s built-in high availability and data durability are characterized by the: 
- Replication factor (RF), which is the number of copies of each row stored on the cluster. 
- Consistency level, which is the number of replicas to be read or written before the result is returned to the caller. 

The replication factor is specified during the creation of a keyspace, which is similar to a relational database. The consistency level is specified while you issue the CRUD query. For consistency details and the formula for quorum computation, see the Cassandra documentation at [Configure for consistency](https://docs.datastax.com/en/cassandra/3.0/cassandra/dml/dmlConfigConsistency.html).

Cassandra supports two types of data integrity models: consistency and eventual consistency. When a write operation is finished, the replication factor and consistency level together determine if the data is consistent or eventually consistent. For example, specifying QUORUM as the consistency level always ensures data consistency. Any consistency level below the number of replicas to be written as needed to achieve QUORUM, for example, ONE, results in data being eventually consistent.

The eight-node cluster shown in Figure 1 has a replication factor of 3 and a QUORUM (two nodes are read or written for consistency) read/write consistency level. The cluster can survive the theoretical loss of one node per replication group before applications start to notice the failure. This scenario assumes that all the keyspaces have well-balanced read/write requests. 

The following parameters are used for the deployed cluster:

**Single-region Cassandra cluster**

| Cluster parameter | Value | Remarks |
| --- | --- | --- |
| Number of nodes (N) |8 |Total number of nodes in the cluster. |
| Replication factor (RF) |3 |Number of replicas of a given row. |
| Consistency level (write) |QUORUM [(RF/2) +1) = 2] The result of the formula is rounded down. |Writes at the most two replicas before the response is sent to the caller. A third replica is written in an eventually consistent manner. |
| Consistency level (read) |QUORUM [(RF/2) +1 = 2] The result of the formula is rounded down. |Reads two replicas before a response is sent to the caller. |
| Replication strategy |NetworkTopologyStrategy For more information, see [Data replication](https://docs.datastax.com/en/cassandra/3.0/cassandra/architecture/archDataDistributeAbout.html) in the Cassandra documentation. |Understands the deployment topology and places replicas on nodes so that all the replicas don’t end up on the same rack. |
| Snitch |GossipingPropertyFileSnitch For more information, see [Snitches](https://docs.datastax.com/en/cassandra/3.0/cassandra/architecture/archSnitchesAbout.html) in the Cassandra documentation. |NetworkTopologyStrategy uses the snitch concept to understand the topology. GossipingPropertyFileSnitch gives better control in mapping each node to the datacenter and the rack. The cluster then uses gossip to propagate this information. This configuration is simpler in a dynamic IP setting compared to PropertyFileSnitch. |

**Azure considerations for a Cassandra cluster:** Microsoft Azure Virtual Machines uses Azure Blob storage for disk persistence. Azure Storage saves three replicas of each disk for high durability. This redundancy means that each row of data inserted into a Cassandra table is already stored in three replicas. So, data consistency is already taken care of even if the replication factor is 1. 

The main problem with the replication factor being 1 is that the application experiences downtime even if a single Cassandra node fails. A node might be down for problems such as hardware or system software failures. If Azure Fabric Controller recognizes the problem, it uses the same storage drives to provision a new node in its place. Provisioning a new node to replace the old one might take a few minutes. 

Azure Fabric Controller also carries out rolling upgrades of the nodes in the cluster for planned maintenance activities. These activities include guest OS changes, Cassandra upgrades, and application changes. Rolling upgrades might take down a few nodes at a time, so the cluster might experience brief downtime for a few partitions. Data isn't lost because of the built-in Azure Storage redundancy.

For systems deployed to Azure that don’t require high availability, for example, around 99.9, which is about to 8.76 hours per year, you might run with RF=1 and consistency level=ONE. For more information, see [High availability](http://en.wikipedia.org/wiki/High_availability). 

For applications with high-availability requirements, RF=3 and consistency level=QUORUM tolerate the downtime of one of the nodes of one replica. You can’t use RF=1 in traditional deployments like on-premises. Data loss might result from problems like disk failures.

## Multiple-region deployment
Cassandra’s datacenter-aware replication and consistency model helps with multiple-region deployment without the need for any external tooling. This setup is different from traditional relational databases where the setup for database mirroring for multi-master writes can be complex. Using Cassandra in a multiple-region setup can help with the following usage scenarios:

**Proximity-based deployment:** Multi-tenant applications, with clear mapping of tenant users-to-region, benefit from the multiple-region cluster’s low latencies. For example, a learning management system for educational institutions might deploy a distributed cluster in East US and West US regions to serve respective campuses for transactional and analytics. The data can be locally consistent at the time of reads and writes and can be eventually consistent across both regions. There are other examples like media distribution and e-commerce. Anything that serves a geo-concentrated user base is a good use case for this deployment model.

**High availability:** Redundancy is a key factor in achieving high availability of software and hardware. For more information, see [Build reliable cloud systems on Microsoft Azure](https://dzone.com/articles/building-reliable-cloud).

On Microsoft Azure, the only reliable way to achieve true redundancy is to deploy a multiple-region cluster. You can deploy applications in an active-active or active-passive mode. If one region is down, Azure Traffic Manager redirects traffic to the active region. With single-region deployment, if availability is 99.9, a two-region deployment can achieve availability of 99.9999 computed by the formula (1-(1-0.999) * (1-0.999)) * 100). For more information, see the previous paper.

**Disaster recovery:** A multiple-region Cassandra cluster, if properly designed, can withstand catastrophic datacenter outages. If one region is down, the application deployed to other regions can start serving the users. Like any other business continuity implementations, the application must be tolerant of some data loss that results from the data in the asynchronous pipeline. Cassandra makes recovery much faster than the time required by traditional database recovery processes. 

Figure 2 shows a typical multiple-region deployment model with eight nodes in each region. Both regions are mirror images of each other for the sake of symmetry. Real-world designs depend on the workload type (for example, transactional or analytical), RPO, recovery time objective (RTO), data consistency, and availability requirements.

![Multiple-region deployment](./media/cassandra-nodejs/cassandra-linux2.png)

Figure 2: Multiple-region Cassandra deployment

### Network integration
Sets of virtual machines that are deployed to private networks located on two regions use a VPN tunnel to communicate with each other. The VPN tunnel connects two software gateways provisioned during the network deployment process. Both regions have similar network architecture in terms of "web" and "data" subnets. 

Azure networking allows for the creation of as many subnets as are needed and applies ACLs as needed by network security. Consider inter-datacenter communication latency and the economic effect of network traffic in your cluster topology design. 

### Data consistency for multiple-datacenter deployment
Distributed deployments must be aware of the cluster topology impact on throughput and high availability. The RF and consistency level must be selected in such a way that the quorum doesn’t depend on the availability of all the datacenters.

For a system that needs high consistency, LOCAL_QUORUM for consistency level (for reads and writes) makes sure that the local reads and writes are satisfied from the local nodes while data is replicated asynchronously to the remote datacenters. The following table summarizes the configuration details for the multiple-region cluster deployment discussed in this article.

**Two-region Cassandra cluster configuration**

| Cluster parameter | Value | Remarks |
| --- | --- | --- |
| Number of nodes (N) |8 + 8 |Total number of nodes in the cluster. |
| Replication factor (RF) |3 |Number of replicas of a given row. |
| Consistency level (write) |LOCAL_QUORUM [(sum(RF)/2) +1) = 4] The result of the formula is rounded down. |Two nodes are written to the first datacenter synchronously. The additional two nodes needed for quorum are written asynchronously to the second datacenter. |
| Consistency level (read) |LOCAL_QUORUM ((RF/2) +1) = 2 The result of the formula is rounded down. |Read requests are satisfied from only one region. Two nodes are read before the response is sent back to the client. |
| Replication strategy |NetworkTopologyStrategy For more information, see [Data replication](https://docs.datastax.com/en/cassandra/3.0/cassandra/architecture/archDataDistributeAbout.html) in the Cassandra documentation. |Understands the deployment topology and places replicas on nodes so that all the replicas don’t end up on the same rack. |
| Snitch |GossipingPropertyFileSnitch For more information, see [Snitches](https://docs.datastax.com/en/cassandra/3.0/cassandra/architecture/archSnitchesAbout.html) in the Cassandra documentation. |NetworkTopologyStrategy uses the snitch concept to understand the topology. GossipingPropertyFileSnitch gives better control in mapping each node to the datacenter and the rack. The cluster then uses gossip to propagate this information. This configuration is simpler in a dynamic IP setting compared to PropertyFileSnitch. |

## Software configuration
The following software versions are used during deployment:

| Software | Source | Version |
| --- | ---| ---|
| JRE    | [JRE 8](https://aka.ms/azure-jdks) | 8U5 |
| JNA    | [JNA](https://github.com/twall/jna) | 3.2.7 |
| Cassandra | [Apache Cassandra 2.0.8](http://www.apache.org/dist/cassandra/) | 2.0.8 |
| Ubuntu    | [Microsoft Azure](https://azure.microsoft.com/) | 14.04 LTS |

To simplify the deployment, download all the required software to the desktop. Then upload it to the Ubuntu template image to create a precursor to the cluster deployment.

Download the software into a well-known download directory on the local computer. Use a directory such as %TEMP%/downloads on Windows or ~/Downloads for most Linux distributions or Mac.

### Create an Ubuntu VM
Create an Ubuntu image with the prerequisite software. You reuse the image to provision several Cassandra nodes.

#### Step 1: Generate an SSH key pair
Azure needs an X509 public key that is either PEM or DER encoded at the provisioning time. Generate a public/private key pair by following the instructions in [Use SSH with Linux on Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/ssh-from-windows). If you plan to use putty.exe as an SSH client either on Windows or Linux, convert the PEM-encoded RSA private key to public/private key format by using puttygen.exe. For instructions on how to do this conversion, see the previous webpage.

#### Step 2: Create an Ubuntu template VM
To create the template VM, sign in to the Azure portal. Select **New** > **Compute** > **Virtual Machine** >  **From Gallery** > **Ubuntu** > **Ubuntu Server 14.04 LTS**. Then select the right arrow. For a tutorial that describes how to create a Linux VM, see [Create a virtual machine running Linux](https://azure.microsoft.com/en-us/resources/videos/building-a-linux-virtual-machine-tutorial/).

Enter the following information on the first **Virtual machine configuration** screen:

<table>
<tr><th>Field name              </td><th>       Field value               </td><th>         Remarks               </td><tr>
<tr><td>VERSION RELEASE DATE    </td><td> Select a date from the drop-down list.</td><td></td><tr>
<tr><td>VIRTUAL MACHINE NAME    </td><td> cass-template                   </td><td> This name is the hostname of the VM. </td><tr>
<tr><td>TIER                     </td><td> STANDARD                           </td><td> Leave the default.              </td><tr>
<tr><td>SIZE                     </td><td> A1                              </td><td>Select the VM based on the IO needs. For this purpose, leave the default. </td><tr>
<tr><td> NEW USER NAME             </td><td> localadmin                       </td><td> "Admin" is a reserved user name in Ubuntu 12.xx and after.</td><tr>
<tr><td> AUTHENTICATION         </td><td> Select the check box.                 </td><td>Check if you want to secure with an SSH key. </td><tr>
<tr><td> CERTIFICATE             </td><td> File name of the public key certificate. </td><td> Use the public key generated previously.</td><tr>
<tr><td> New Password    </td><td> Strong password. </td><td> </td><tr>
<tr><td> Confirm Password    </td><td> Strong password. </td><td></td><tr>
</table>

Enter the following information on the second **Virtual machine configuration** screen:

<table>
<tr><th>Field name             </th><th> Field value                       </th><th> Remarks                                 </th></tr>
<tr><td> CLOUD SERVICE    </td><td> Create a new cloud service.    </td><td>Cloud service is a container compute resource like virtual machines.</td></tr>
<tr><td> CLOUD SERVICE DNS NAME    </td><td>ubuntu-template.cloudapp.net    </td><td>Give a machine-agnostic load-balancer name.</td></tr>
<tr><td> REGION/AFFINITY GROUP/VIRTUAL NETWORK </td><td>    West US    </td><td> Select a region from which your web applications access the Cassandra cluster.</td></tr>
<tr><td>STORAGE ACCOUNT </td><td>    Use the default.    </td><td>Use the default storage account or a pre-created storage account in a particular region.</td></tr>
<tr><td>AVAILABILITY SET </td><td>    None. </td><td>    Leave it blank.</td></tr>
<tr><td>ENDPOINTS    </td><td>Use the default. </td><td>    Use the default SSH configuration. </td></tr>
</table>

Select the right arrow, and leave the defaults as shown on the third screen. Select the **Check mark** button to finish the VM provisioning process. After a few minutes, the VM with the name **ubuntu-template** appears in the **running** status.

### Install the necessary software
#### Step 1: Upload tarballs
Using scp or pscp, copy the previously downloaded software to the ~/downloads directory by using the following command format:

##### pscp server-jre-8u5-linux-x64.tar.gz localadmin@hk-cas-template.cloudapp.net:/home/localadmin/downloads/server-jre-8u5-linux-x64.tar.gz
Repeat the previous command for JRE and for the Cassandra bits.

#### Step 2: Prepare the directory structure and extract the archives
Sign in to the VM, create the directory structure, and extract software as a super user by using the following bash script:

```bash
#!/bin/bash
CASS_INSTALL_DIR="/opt/cassandra"
JRE_INSTALL_DIR="/opt/java"
CASS_DATA_DIR="/var/lib/cassandra"
CASS_LOG_DIR="/var/log/cassandra"
DOWNLOADS_DIR="~/downloads"
JRE_TARBALL="server-jre-8u5-linux-x64.tar.gz"
CASS_TARBALL="apache-cassandra-2.0.8-bin.tar.gz"
SVC_USER="localadmin"

RESET_ERROR=1
MKDIR_ERROR=2

reset_installation ()
{
  rm -rf $CASS_INSTALL_DIR 2> /dev/null
  rm -rf $JRE_INSTALL_DIR 2> /dev/null
  rm -rf $CASS_DATA_DIR 2> /dev/null
  rm -rf $CASS_LOG_DIR 2> /dev/null
}
make_dir ()
{
  if [ -z "$1" ]
  then
    echo "make_dir: invalid directory name"
    exit $MKDIR_ERROR
  fi

  if [ -d "$1" ]
  then
    echo "make_dir: directory already exists"
    exit $MKDIR_ERROR
  fi

  mkdir $1 2>/dev/null
  if [ $? != 0 ]
  then
    echo "directory creation failed"
    exit $MKDIR_ERROR
  fi
}

unzip()
{
  if [ $# == 2 ]
  then
    tar xzf $1 -C $2
  else
    echo "archive error"
  fi

}

if [ -n "$1" ]
then
  SVC_USER=$1
fi

reset_installation
make_dir $CASS_INSTALL_DIR
make_dir $JRE_INSTALL_DIR
make_dir $CASS_DATA_DIR
make_dir $CASS_LOG_DIR

#Unzip JRE and Cassandra.
unzip $HOME/downloads/$JRE_TARBALL $JRE_INSTALL_DIR
unzip $HOME/downloads/$CASS_TARBALL $CASS_INSTALL_DIR

#Change the ownership to the service credentials.

chown -R $SVC_USER:$GROUP $CASS_DATA_DIR
chown -R $SVC_USER:$GROUP $CASS_LOG_DIR
echo "edit /etc/profile to add JRE to the PATH"
echo "installation is complete"
```

If you paste this script into the vim window, remove the carriage return ('\r') by using the following command:

    tr -d '\r' <infile.sh >outfile.sh

#### Step 3: Edit etc/profile
Append the following script at the end:

    JAVA_HOME=/opt/java/jdk1.8.0_05
    CASS_HOME= /opt/cassandra/apache-cassandra-2.0.8
    PATH=$PATH:$HOME/bin:$JAVA_HOME/bin:$CASS_HOME/bin
    export JAVA_HOME
    export CASS_HOME
    export PATH

#### Step 4: Install JNA for production systems
Use this command sequence.
The following command installs jna-3.2.7.jar and jna-platform-3.2.7.jar to the /usr/share.java directory
sudo apt-get install libjna-java.

Create symbolic links in the $CASS_HOME/lib directory so that the Cassandra startup script can find these jars:

    ln -s /usr/share/java/jna-3.2.7.jar $CASS_HOME/lib/jna.jar

    ln -s /usr/share/java/jna-platform-3.2.7.jar $CASS_HOME/lib/jna-platform.jar

#### Step 5: Configure cassandra.yaml
Edit cassandra.yaml on each VM to show the configuration needed by all the virtual machines. You tweak this configuration during the actual provisioning.

<table>
<tr><th>Field name   </th><th> Value  </th><th>    Remarks </th></tr>
<tr><td>cluster_name </td><td>    “CustomerService”    </td><td> Use the name of your deployment.</td></tr>
<tr><td>listen_address    </td><td>[leave it blank]    </td><td> Delete “localhost.” </td></tr>
<tr><td>rpc_address   </td><td>[leave it blank]    </td><td> Delete “localhost.” </td></tr>
<tr><td>seeds    </td><td>"10.1.2.4, 10.1.2.6, 10.1.2.8"    </td><td>List of all the IP addresses that are assigned as seeds.</td></tr>
<tr><td>endpoint_snitch </td><td> org.apache.cassandra.locator.GossipingPropertyFileSnitch </td><td> This value is used by NetworkTopologyStrategy to infer the datacenter and the rack of the VM.</td></tr>
</table>

#### Step 6: Capture the VM image
Sign in to the virtual machine by using the hostname (hk-cas-template.cloudapp.net) and the SSH private key that was previously created. For information on how to sign in by using SSH or putty.exe, see [Use SSH with Linux on Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/ssh-from-windows).

To capture the image, follow these steps.

##### 1. Deprovision
Use the command **sudo waagent –deprovision+user** to remove virtual machine instance-specific information. For more information on the image capture process, see [Capture a Linux virtual machine](capture-image-classic.md).

##### 2. Shut down the VM
Highlight the virtual machine, and select **SHUTDOWN** on the bottom command bar.

##### 3. Capture the image
Highlight the virtual machine, and select **CAPTURE** on the bottom command bar. On the next screen, name the image, for example, hk-cas-2-08-ub-14-04-2014071. Enter an image description. Select the **Check mark** button to finish the capture process.

This process takes a few seconds. The image appears in the **MY IMAGES** section of the image gallery. The source VM is automatically deleted after the image is successfully captured. 

## Single-region deployment process
**Step 1: Create the virtual network**

Sign in to the Azure portal. Use the classic deployment model to create a virtual network with the attributes shown in this table. For information on the steps, see [Create a virtual network (classic) by using the Azure portal](../../../virtual-network/virtual-networks-create-vnet-classic-pportal.md).

<table>
<tr><th>VM attribute name</th><th>Value</th><th>Remarks</th></tr>
<tr><td>Name</td><td>vnet-cass-west-us</td><td></td></tr>
<tr><td>Region</td><td>West US</td><td></td></tr>
<tr><td>DNS servers</td><td>None</td><td>Ignore this attribute because we aren't using an Azure DNS server.</td></tr>
<tr><td>Address space</td><td>10.1.0.0/16</td><td></td></tr>
<tr><td>Starting IP</td><td>10.1.0.0</td><td></td></tr>
<tr><td>CIDR </td><td>/16 (65531)</td><td></td></tr>
</table>

Add the following subnets:

<table>
<tr><th>Name</th><th>Starting IP</th><th>CIDR</th><th>Remarks</th></tr>
<tr><td>web</td><td>10.1.1.0</td><td>/24 (251)</td><td>Subnet for the web farm</td></tr>
<tr><td>data</td><td>10.1.2.0</td><td>/24 (251)</td><td>Subnet for the database nodes</td></tr>
</table>

Data and web subnets can be protected through network security groups. That subject is out of scope for this article.

**Step 2: Provision virtual machines**

Using the image you created previously, create the following virtual machines in the cloud server **hk-c-svc-west** and bind them to the respective subnets as shown:

<table>
<tr><th>Machine name    </th><th>Subnet    </th><th>IP address    </th><th>Availability set</th><th>DC/Rack</th><th>Seed?</th></tr>
<tr><td>hk-c1-west-us    </td><td>data    </td><td>10.1.2.4    </td><td>hk-c-aset-1    </td><td>dc =WESTUS rack =rack1 </td><td>Yes</td></tr>
<tr><td>hk-c2-west-us    </td><td>data    </td><td>10.1.2.5    </td><td>hk-c-aset-1    </td><td>dc =WESTUS rack =rack1    </td><td>No </td></tr>
<tr><td>hk-c3-west-us    </td><td>data    </td><td>10.1.2.6    </td><td>hk-c-aset-1    </td><td>dc =WESTUS rack =rack2    </td><td>Yes</td></tr>
<tr><td>hk-c4-west-us    </td><td>data    </td><td>10.1.2.7    </td><td>hk-c-aset-1    </td><td>dc =WESTUS rack =rack2    </td><td>No </td></tr>
<tr><td>hk-c5-west-us    </td><td>data    </td><td>10.1.2.8    </td><td>hk-c-aset-2    </td><td>dc =WESTUS rack =rack3    </td><td>Yes</td></tr>
<tr><td>hk-c6-west-us    </td><td>data    </td><td>10.1.2.9    </td><td>hk-c-aset-2    </td><td>dc =WESTUS rack =rack3    </td><td>No </td></tr>
<tr><td>hk-c7-west-us    </td><td>data    </td><td>10.1.2.10    </td><td>hk-c-aset-2    </td><td>dc =WESTUS rack =rack4    </td><td>Yes</td></tr>
<tr><td>hk-c8-west-us    </td><td>data    </td><td>10.1.2.11    </td><td>hk-c-aset-2    </td><td>dc =WESTUS rack =rack4    </td><td>No </td></tr>
<tr><td>hk-w1-west-us    </td><td>web    </td><td>10.1.1.4    </td><td>hk-w-aset-1    </td><td>                       </td><td>N/A</td></tr>
<tr><td>hk-w2-west-us    </td><td>web    </td><td>10.1.1.5    </td><td>hk-w-aset-1    </td><td>                       </td><td>N/A</td></tr>
</table>

To create the list of VMs, follow these steps.

1. Create an empty cloud service in a particular region.
2. Create a VM from the previously captured image. Attach it to the virtual network that you created previously. Repeat this step for all the VMs.
3. Add an internal load balancer to the cloud service. Attach it to the “data” subnet.
4. For each VM you created, add a load-balanced endpoint for thrift traffic. The traffic runs through a load-balanced set connected to the internal load balancer you created previously.

You can use the Azure portal to do these steps. Use a Windows machine, or use a VM on Azure if you don't have access to a Windows machine. Use the following PowerShell script to provision all eight VMs automatically.

**PowerShell script used to provision virtual machines**

```powershell
#Tested with Azure Powershell - November 2014
#This PowerShell script deploys a number of VMs from an existing image inside an Azure region.
#Import your Azure subscription into the current PowerShell session before proceeding.
#The process: 1. Create an Azure Storage account. 2. Create a virtual network. 3. Create the VM template. 4. Create a list of VMs from the template.

#Fundamental variables - Change these to reflect your subscription.
$country="us"; $region="west"; $vnetName = "your_vnet_name";$storageAccount="your_storage_account"
$numVMs=8;$prefix = "hk-cass";$ilbIP="your_ilb_ip"
$subscriptionName = "Azure_subscription_name";
$vmSize="ExtraSmall"; $imageName="your_linux_image_name"
$ilbName="ThriftInternalLB"; $thriftEndPoint="ThriftEndPoint"

#Generated variables
$serviceName = "$prefix-svc-$region-$country"; $azureRegion = "$region $country"

$vmNames = @()
for ($i=0; $i -lt $numVMs; $i++)
{
    $vmNames+=("$prefix-vm"+($i+1) + "-$region-$country" );
}

#Select an Azure subscription already imported into the PowerShell session.
Select-AzureSubscription -SubscriptionName $subscriptionName -Current
Set-AzureSubscription -SubscriptionName $subscriptionName -CurrentStorageAccountName $storageAccount

#Create an empty cloud service.
New-AzureService -ServiceName $serviceName -Label "hkcass$region" -Location $azureRegion
Write-Host "Created $serviceName"

$VMList= @()   # stores the list of azure vm configuration objects
#Create the list of VMs.
foreach($vmName in $vmNames)
{
    $VMList += New-AzureVMConfig -Name $vmName -InstanceSize ExtraSmall -ImageName $imageName |
            Add-AzureProvisioningConfig -Linux -LinuxUser "localadmin" -Password "Local123" |
            Set-AzureSubnet "data"
}

New-AzureVM -ServiceName $serviceName -VNetName $vnetName -VMs $VMList

#Create an internal load balancer.
Add-AzureInternalLoadBalancer -ServiceName $serviceName -InternalLoadBalancerName $ilbName -SubnetName "data" -StaticVNetIPAddress "$ilbIP"
Write-Host "Created $ilbName"
#Add the thrift endpoint to the internal load balancer for all the VMs.
foreach($vmName in $vmNames)
{
    Get-AzureVM -ServiceName $serviceName -Name $vmName |
            Add-AzureEndpoint -Name $thriftEndPoint -LBSetName "ThriftLBSet" -Protocol tcp -LocalPort 9160 -PublicPort 9160 -ProbePort 9160 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 -InternalLoadBalancerName $ilbName |
            Update-AzureVM

    Write-Host "created $vmName"
}
```

**Step 3: Configure Cassandra on each VM**

Sign in to the VM, and do the following:

* Edit **$CASS_HOME/conf/cassandra-rackdc.properties** to specify the datacenter and rack properties.
  
       dc =EASTUS, rack =rack1
* Edit cassandra.yaml to configure the seed nodes.
  
       Seeds: "10.1.2.4,10.1.2.6,10.1.2.8,10.1.2.10"

**Step 4: Start the VMs, and test the cluster**

Sign in to one of the nodes, for example, hk-c1-west-us. To see the status of the cluster, run the following command:

       nodetool –h 10.1.2.4 –p 7199 status

A display similar to this one for an eight-node cluster appears:

<table>
<tr><th>Status</th><th>Address    </th><th>Load    </th><th>Tokens    </th><th>Owns </th><th>Host ID    </th><th>Rack</th></tr>
<tr><th>UN    </td><td>10.1.2.4     </td><td>87.81 KB    </td><td>256    </td><td>38.0%    </td><td>Guid (removed)</td><td>rack1</td></tr>
<tr><th>UN    </td><td>10.1.2.5     </td><td>41.08 KB    </td><td>256    </td><td>68.9%    </td><td>Guid (removed)</td><td>rack1</td></tr>
<tr><th>UN    </td><td>10.1.2.6     </td><td>55.29 KB    </td><td>256    </td><td>68.8%    </td><td>Guid (removed)</td><td>rack2</td></tr>
<tr><th>UN    </td><td>10.1.2.7     </td><td>55.29 KB    </td><td>256    </td><td>68.8%    </td><td>Guid (removed)</td><td>rack2</td></tr>
<tr><th>UN    </td><td>10.1.2.8     </td><td>55.29 KB    </td><td>256    </td><td>68.8%    </td><td>Guid (removed)</td><td>rack3</td></tr>
<tr><th>UN    </td><td>10.1.2.9     </td><td>55.29 KB    </td><td>256    </td><td>68.8%    </td><td>Guid (removed)</td><td>rack3</td></tr>
<tr><th>UN    </td><td>10.1.2.10     </td><td>55.29 KB    </td><td>256    </td><td>68.8%    </td><td>Guid (removed)</td><td>rack4</td></tr>
<tr><th>UN    </td><td>10.1.2.11     </td><td>55.29 KB    </td><td>256    </td><td>68.8%    </td><td>Guid (removed)</td><td>rack4</td></tr>
</table>

## Test the single-region cluster
To test the cluster, follow these steps.

1. Using the **PowerShell Get-AzureInternalLoadbalancer** cmdlet, get the IP address of the internal load balancer, for example, 10.1.2.101. The syntax of the command is Get-AzureLoadbalancer –ServiceName "hk-c-svc-west-us." The details of the internal load balancer display along with its IP address.
2. Sign in to the web farm VM, for example, hk-w1-west-us, by using PuTTY or SSH.
3. Run **$CASS_HOME/bin/cqlsh 10.1.2.101 9160**.
4. To verify if the cluster is working, use the following CQL commands:
   
         CREATE KEYSPACE customers_ks WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };
         USE customers_ks;
         CREATE TABLE Customers(customer_id int PRIMARY KEY, firstname text, lastname text);
         INSERT INTO Customers(customer_id, firstname, lastname) VALUES(1, 'John', 'Doe');
         INSERT INTO Customers(customer_id, firstname, lastname) VALUES (2, 'Jane', 'Doe');
       
         SELECT * FROM Customers;
    
Results like the following appear:

<table>
  <tr><th> customer_id </th><th> firstname </th><th> lastname </th></tr>
  <tr><td> 1 </td><td> John </td><td> Doe </td></tr>
  <tr><td> 2 </td><td> Jane </td><td> Doe </td></tr>
</table>

The keyspace created in step 4 uses SimpleStrategy with a replication factor of 3. We recommend SimpleStrategy for single datacenter deployments. Use NetworkTopologyStrategy for multiple-datacenter deployments. A replication factor of 3 gives tolerance for node failures.

## <a id="tworegion"> </a>Multiple-region deployment process
Use the single-region deployment process, and repeat the process to install the second region. The key difference between single- and multiple-region deployment is the VPN tunnel setup for inter-region communication. You start with the network installation, provision the VMs, and configure Cassandra.

**Step 1: Create the virtual network at the second region**

Sign in to the Azure portal, and create a virtual network with the attributes shown in the table. For instructions, see [Configure a cloud-only virtual network in the Azure portal](../../../virtual-network/virtual-networks-create-vnet-classic-pportal.md).

<table>
<tr><th>Attribute name    </th><th>Value    </th><th>Remarks</th></tr>
<tr><td>Name    </td><td>vnet-cass-east-us</td><td></td></tr>
<tr><td>Region    </td><td>East US</td><td></td></tr>
<tr><td>DNS servers        </td><td></td><td>Ignore this attribute because we aren't using an Azure DNS server.</td></tr>
<tr><td>Configure a point-to-site VPN</td><td></td><td>        Ignore this attribute.</td></tr>
<tr><td>Configure a site-to-site VPN</td><td></td><td>        Ignore this attribute.</td></tr>
<tr><td>Address space    </td><td>10.2.0.0/16</td><td></td></tr>
<tr><td>Starting IP    </td><td>10.2.0.0    </td><td></td></tr>
<tr><td>CIDR    </td><td>/16 (65531)</td><td></td></tr>
</table>

Add the following subnets:

<table>
<tr><th>Name    </th><th>Starting IP    </th><th>CIDR    </th><th>Remarks</th></tr>
<tr><td>web    </td><td>10.2.1.0    </td><td>/24 (251)    </td><td>Subnet for the web farm</td></tr>
<tr><td>data    </td><td>10.2.2.0    </td><td>/24 (251)    </td><td>Subnet for the database nodes</td></tr>
</table>


**Step 2: Create local networks**

A local network in Azure virtual networking is a proxy address space that maps to a remote site that includes a private cloud or another Azure region. This proxy address space is bound to a remote gateway that's used to route networks to the right networking destinations. For information on how to establish a network-to-network connection, see [Configure a VNet-to-VNet connection](../../../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md).

Create two local networks based on the following information:

| Network name | VPN gateway address | Address space | Remarks |
| --- | --- | --- | --- |
| hk-lnet-map-to-east-us |23.1.1.1 |10.2.0.0/16 |When you create the local network, use a placeholder gateway address. The real gateway address is filled after the gateway is created. Make sure the address space exactly matches the respective remote virtual network. In this case, it's the virtual network created in the East US region. |
| hk-lnet-map-to-west-us |23.2.2.2 |10.1.0.0/16 |When you create the local network, use a placeholder gateway address. The real gateway address is filled after the gateway is created. Make sure the address space exactly matches the respective remote virtual network. In this case, it's the virtual network created in the West US region. |

**Step 3: Map a local network to the respective virtual networks**

In the Azure portal, select each virtual network. Select **Configure** > **Connect to the local network**. Select the local networks based on the following information:

| Virtual network | Local network |
| --- | --- |
| hk-vnet-west-us |hk-lnet-map-to-east-us |
| hk-vnet-east-us |hk-lnet-map-to-west-us |

**Step 4: Create gateways on both virtual networks**

On the dashboards for both virtual networks, select **CREATE GATEWAY** to start the VPN gateway provisioning process. After a few minutes, the dashboard of each virtual network displays the actual gateway address.

**Step 5: Update the local networks with the respective gateway addresses**

Edit both local networks to replace the placeholder gateway IP address with the real IP address of the gateways you provisioned. Use the following mapping:

<table>
<tr><th>Local network    </th><th>Virtual network gateway</th></tr>
<tr><td>hk-lnet-map-to-east-us </td><td>Gateway of hk-vnet-west-us</td></tr>
<tr><td>hk-lnet-map-to-west-us </td><td>Gateway of hk-vnet-east-us</td></tr>
</table>

**Step 6: Update the shared key**

Use the following PowerShell script to update the IPSec key of each VPN gateway. Use the same key for both  gateways.

    Set-AzureVNetGatewayKey -VNetName hk-vnet-east-us -LocalNetworkSiteName hk-lnet-map-to-west-us -SharedKey D9E76BKK
    Set-AzureVNetGatewayKey -VNetName hk-vnet-west-us -LocalNetworkSiteName hk-lnet-map-to-east-us -SharedKey D9E76BKK

**Step 7: Establish the network-to-network connection**

In the Azure portal, use the **DASHBOARD** menu of both virtual networks to establish a gateway-to-gateway connection. Use the **CONNECT** menu items in the bottom toolbar. After a few minutes, the dashboard displays the connection information.

**Step 8: Create the virtual machines in region #2**

Create the Ubuntu image as described in the region #1 deployment by following the same steps. Or copy the image VHD file to the Azure Storage account located in region #2, and create the image. Use this image to create the following list of virtual machines into a new cloud service hk-c-svc-east-us:

| Machine name | Subnet | IP address | Availability set | DC/Rack | Seed? |
| --- | --- | --- | --- | --- | --- |
| hk-c1-east-us |data |10.2.2.4 |hk-c-aset-1 |dc =EASTUS rack =rack1 |Yes |
| hk-c2-east-us |data |10.2.2.5 |hk-c-aset-1 |dc =EASTUS rack =rack1 |No |
| hk-c3-east-us |data |10.2.2.6 |hk-c-aset-1 |dc =EASTUS rack =rack2 |Yes |
| hk-c5-east-us |data |10.2.2.8 |hk-c-aset-2 |dc =EASTUS rack =rack3 |Yes |
| hk-c6-east-us |data |10.2.2.9 |hk-c-aset-2 |dc =EASTUS rack =rack3 |No |
| hk-c7-east-us |data |10.2.2.10 |hk-c-aset-2 |dc =EASTUS rack =rack4 |Yes |
| hk-c8-east-us |data |10.2.2.11 |hk-c-aset-2 |dc =EASTUS rack =rack4 |No |
| hk-w1-east-us |web |10.2.1.4 |hk-w-aset-1 |N/A |N/A |
| hk-w2-east-us |web |10.2.1.5 |hk-w-aset-1 |N/A |N/A |

Follow the same instructions as for region #1, but use the 10.2.xxx.xxx address space.

**Step 9: Configure Cassandra on each VM**

Sign in to the VM, and do the following:

- Edit **$CASS_HOME/conf/cassandra-rackdc.properties** to specify the datacenter and rack properties in the format:

       dc =EASTUS
       rack =rack1
- Edit cassandra.yaml to configure seed nodes:

       Seeds: "10.1.2.4,10.1.2.6,10.1.2.8,10.1.2.10,10.2.2.4,10.2.2.6,10.2.2.8,10.2.2.10"

**Step 10: Start Cassandra**

Sign in to each VM, and start Cassandra in the background by running the following command:

    $CASS_HOME/bin/cassandra

## Test the multiple-region cluster
By now, Cassandra is deployed to 16 nodes with 8 nodes in each Azure region. These nodes are in the same cluster because of the common cluster name and the seed node configuration. Use the following process to test the cluster.

**Step 1: Get the internal load balancer IP for both the regions by using PowerShell**

* Get-AzureInternalLoadbalancer -ServiceName "hk-c-svc-west-us"
* Get-AzureInternalLoadbalancer -ServiceName "hk-c-svc-east-us"
  
    Note the IP addresses, for example, west - 10.1.2.101, east - 10.2.2.101, that display.

**Step 2: Run the following commands in the West region after you sign into hk-w1-west-us**

1. Run **$CASS_HOME/bin/cqlsh 10.1.2.101 9160**.
2. Run the following CQL commands:
   
         CREATE KEYSPACE customers_ks
         WITH REPLICATION = { 'class' : 'NetworkToplogyStrategy', 'WESTUS' : 3, 'EASTUS' : 3};
         USE customers_ks;
         CREATE TABLE Customers(customer_id int PRIMARY KEY, firstname text, lastname text);
         INSERT INTO Customers(customer_id, firstname, lastname) VALUES(1, 'John', 'Doe');
         INSERT INTO Customers(customer_id, firstname, lastname) VALUES (2, 'Jane', 'Doe');
         SELECT * FROM Customers;

A display like this one appears:

| customer_id | firstname | Lastname |
| --- | --- | --- |
| 1 |John |Doe |
| 2 |Jane |Doe |

**Step 3: Run the following commands in the East region after you sign into hk-w1-east-us**

1. Run **$CASS_HOME/bin/cqlsh 10.2.2.101 9160**.
2. Run the following CQL commands:
   
         USE customers_ks;
         CREATE TABLE Customers(customer_id int PRIMARY KEY, firstname text, lastname text);
         INSERT INTO Customers(customer_id, firstname, lastname) VALUES(1, 'John', 'Doe');
         INSERT INTO Customers(customer_id, firstname, lastname) VALUES (2, 'Jane', 'Doe');
         SELECT * FROM Customers;

The same display as seen for the West region appears:

| customer_id | firstname | Lastname |
| --- | --- | --- |
| 1 |John |Doe |
| 2 |Jane |Doe |

Run a few more inserts, and see that those inserts get replicated to the west-us part of the cluster.

## Test the Cassandra cluster from Node.js
Using one of the Linux VMs you created in the "web" tier previously, run a Node.js script to read the previously inserted data.

**Step 1: Install Node.js and the Cassandra client**

1. Install Node.js and npm.
2. Install the node package **cassandra-client** by using npm.
3. Run the following script at the shell prompt that displays the json string of the retrieved data:
    
    ```
    var pooledCon = require('cassandra-client').PooledConnection;
    var ksName = "custsupport_ks";
    var cfName = "customers_cf";
    var hostList = ['internal_loadbalancer_ip:9160'];
    var ksConOptions = { hosts: hostList,
                         keyspace: ksName, use_bigints: false };

    function createKeyspace(callback) {
        var cql = 'CREATE KEYSPACE ' + ksName + ' WITH strategy_class=SimpleStrategy AND strategy_options:replication_factor=1';
        var sysConOptions = { hosts: hostList,
                              keyspace: 'system', use_bigints: false };
        var con = new pooledCon(sysConOptions);
        con.execute(cql,[],function(err) {
            if (err) {
                console.log("Failed to create Keyspace: " + ksName);
                console.log(err);
            }
            else {
                console.log("Created Keyspace: " + ksName);
                callback(ksConOptions, populateCustomerData);
            }
        });
        con.shutdown();
    }

    function createColumnFamily(ksConOptions, callback) {
        var params = ['customers_cf','custid','varint','custname',
                      'text','custaddress','text'];
        var cql = 'CREATE COLUMNFAMILY ? (? ? PRIMARY KEY,? ?, ? ?)';
        var con =  new pooledCon(ksConOptions);
        con.execute(cql,params,function(err) {
            if (err) {
                console.log("Failed to create column family: " + params[0]);
                console.log(err);
            }
            else {
                console.log("Created column family: " + params[0]);
                callback();
            }
        });
        con.shutdown();
    }

    //populate Data
    function populateCustomerData() {
        var params = ['John','Infinity Dr, TX', 1];
        updateCustomer(ksConOptions,params);

        params = ['Tom','Fermat Ln, WA', 2];
        updateCustomer(ksConOptions,params);
    }

    //update also inserts the record if none exists
    function updateCustomer(ksConOptions,params) {
        var cql = 'UPDATE customers_cf SET custname=?,custaddress=? where custid=?';
        var con = new pooledCon(ksConOptions);
        con.execute(cql,params,function(err) {
            if (err) console.log(err);
            else console.log("Inserted customer : " + params[0]);
        });
        con.shutdown();
    }

    //read the two rows inserted above
    function readCustomer(ksConOptions) {
        var cql = 'SELECT * FROM customers_cf WHERE custid IN (1,2)';
        var con = new pooledCon(ksConOptions);
        con.execute(cql,[],function(err,rows) {
            if (err)
                console.log(err);
            else
                for (var i=0; i<rows.length; i++)
                    console.log(JSON.stringify(rows[i]));
            });
        con.shutdown();
    }

    //execute the code
    createKeyspace(createColumnFamily);
    readCustomer(ksConOptions)
    ```

## Conclusion
Microsoft Azure is a flexible platform that runs Microsoft and open-source software, as demonstrated by this exercise. You can deploy highly available Cassandra clusters on a single datacenter by spreading the cluster nodes across multiple fault domains. Cassandra clusters also can be deployed across multiple geographically distant Azure regions for disaster-proof systems. Use Azure and Cassandra together to construct highly scalable, highly available, and disaster-recoverable cloud services for your internet-scale services.

## References
* [Apache Cassandra](http://cassandra.apache.org)
* [DataStax](http://www.datastax.com)
* [Node.js](http://www.nodejs.org)
