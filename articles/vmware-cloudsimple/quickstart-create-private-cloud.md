---
title: Azure VMware Solution by CloudSimple Quickstart - Create a private cloud 
description: Learn how to create and configure a private cloud with Azure VMware Solution by CloudSimple 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Quickstart - Configure a private cloud environment

In this article, learn how to create a CloudSimple private cloud and set up your private cloud environment.

## Create a private cloud

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the **Resources** or **CloudSimple Dedicated VMware Nodes** page, select **Create Private Cloud**.
3. Select the location to host the private cloud resources.
4. Select the node type for your private cloud. You can choose the [CS28 or CS36 option](cloudsimple-node.md#vmware-solution-by-cloudsimple-nodes-sku). The latter option includes the maximum compute and memory capacity.
5. Select the number of nodes for the private cloud. You can select up to the number of nodes that you've [purchased](create-nodes.md) or [reserved](reserve-nodes.md).
6. Select **Next: Advanced options**.
7. Enter the CIDR range for vSphere/vSAN subnets. Make sure that the CIDR range doesn't overlap with any of your on-premises or other Azure subnets.
8. Select **Next: Review and create**.
9. Review the settings. If you need to change any settings, click **Previous**.
10. Select **Create**.

## Create a VLAN for your workload VMs

After creating a private cloud, create a VLAN where you'll deploy your workload/application VMs.

1. In the CloudSimple Portal, select **Network > VLAN/Subnets**.
2. Click **Create VLAN/Subnet**.
3. Select the **Private Cloud** for the new VLAN/subnet.
4. Enter a VLAN ID.
5. Enter an optional subnet name.
6. To enable routing on the VLAN (subnet), specify the subnet CIDR range.
7. Click **Submit**.
8. (Optional) To make the subnet you created accessible over point-to-site or site-to-site VPN, open a support ticket with [CloudSimple Support](http://support.cloudsimple.com).

## Connect your environment to an Azure virtual network

CloudSimple provides you with an ExpressRoute circuit for your private cloud. You can connect your virtual network on Azure to the ExpressRoute circuit. For full details on setting up the connection, follow the steps in [Azure Virtual Network Connection using ExpressRoute](https://docs.azure.cloudsimple.com/azure-er-connection)

## Sign in to vCenter

You can now sign in to vCenter to set up virtual machines and policies.

1. To access vCenter, start from the CloudSimple Portal. On the Home page, under **Common Tasks**, click **Launch vSphere Client** and then click **Launch vSphere Client**.
2. Select your preferred vSphere client to access vCenter and sign in with your username and password.  The defaults are:
    * User name: **CloudOwner@cloudsimple.local**
    * Password: **CloudSimple123!**  

    If your private cloud was created in link mode, sign in as your on-premises administrator user or as a user who is a member of the administrator group.

## Change your vCenter password

CloudSimple recommends that you change your password the first time you sign in to vCenter.  
The password you set must meet the following requirements:

* Maximum lifetime: Password must be changed every 365 days
* Restrict reuse: Users can't reuse any of the previous five passwords
* Length: 8 - 20 characters
* Special character: At least one special character
* Alphabetic characters: At least one uppercase character, A-Z, and at least one lowercase character, a-z
* Numbers: At least one numeric character, 0-9
* Maximum identical adjacent characters: Three

    Example: CC or CCC is acceptable as a part of the password, but CCCC isn't.

If you set a password that doesn't meet the requirements:

* if you use the vSphere Flash Client, it reports an error
* If you use the HTML5 client, it doesn't report an error. The client doesn't accept the change and the old password continues to work.

## Add users and identity sources to vCenter

CloudSimple assigns a default vCenter user account with username: **cloudowner@cloudsimple.local**. No additional account setup is required for you to get started. However, you can request additional user accounts and permission to add identity sources.

* If you require additional user accounts, provide the user information to [CloudSimple Support](http://support.cloudsimple.com). Support will set up the user accounts for you.
* CloudSimple normally assigns administrators the privileges they need to do normal operations, but restricts doing operations such as adding identity sources. If you want to add an identity source, you can temporarily [escalate your privileges](https://docs.azure.cloudsimple.com/vsphere-access/#escalate-privileges).

## Create a port group

To create a distributed port group in vSphere:

1. Follow the instructions in "Add a distributed port group," in the [vSphere Networking Guide](https://docs.vmware.com/en/VMware-vSphere/6.5/vsphere-esxi-vcenter-server-65-networking-guide.pdf).
2. When setting up the distributed port group, provide the VLAN ID created in [Create a VLAN for your Workload VMs](#create-a-vlan-for-your-workload-vms).

## Upload an ISO or vSphere template

For ISO upload, use the vSphere HTML5 client.  Using the Flash client may result in an error.

1. Obtain the ISO or vSphere template that you want to upload to vCenter to create a VM.
2. Make the ISO or vSphere template available on your local system.
3. In vCenter, in the upper left, click the **Disk** icon, and then below it select **vsanDatastore**.
4. In the middle top, click **Files**, and then click **New Folder**.
5. Create a folder entitled ‘ISOs and Templates’.
6. Navigate to the **ISOs and Templates** folder, and click **Upload Files**. Follow the on-screen instructions to upload the ISO.


## Create a virtual machine in vCenter

1. In vCenter, in the upper left, click the **Hosts and Clusters** icon.

2. Right-click **Workload**, and then click **New Virtual Machine**.

3. In the **New Virtual Machine** screen, click **Create new virtual machine**, and then click **Next**.

4. In **Virtual machine name** enter the machine name, select the **Workload VMs** location, and then click **Next**.

5. Select the **Workload** compute resource, and then click **Next**.
  
6. Select **vsanDatastore**, and then click **Next**.

7. Keep the default ESXi 6.5 compatibility selection, and then click **Next**.

8. Select the guest OS of the ISO for the VM that you're creating, and then click **Next**.

9. Select hard disk and network options. For **New DC/DVD Drive**, select **Datastore ISO file**.  If you want to allow traffic from the Public IP address to this VM, select the network as **vm-1**.

10. A selection window opens. Select the file you previously uploaded to the ISOs and Templates folder, and then click **OK**.

11. Review the settings and click **Finish** to create the VM.

The VM is now added to the Workload compute resources and is ready for use.

The basic setup is now complete. You can start using your private cloud similar to how you would use your on-premises VM infrastructure.

The following sections contain optional information about setting up DNS and DHCP servers for private cloud workloads and modifying the default networking configuration.

## Create a DNS and DHCP server (Optional)

Running applications and workloads in a private cloud environment requires a proper DHCP and DNS infrastructure. These provide name resolution and DHCP services for lookup and IP address assignment. You can configure a VM in vCenter to provide these services in your private cloud environment.

### Prerequisites

* A distributed port group with VLAN configured

* Route setup to on-premises or Internet-based DNS servers

* Virtual machine template or ISO to create a virtual machine

The following sections provide guidance on setting up DHCP and DNS servers on Linux and Windows.

### Linux-based DNS server setup

Linux offers various packages for setting up DNS servers. For instructions setting up an open-source BIND DNS server, refer to [Example setup](https://www.digitalocean.com/community/tutorials/how-to-configure-bind-as-a-private-network-dns-server-on-centos-7).

### Windows-based setup

The following Microsoft articles describe how to set up a Windows server as a DNS server and as a DHCP server.

* [Windows Server as DNS Server](https://docs.microsoft.com/windows-server/networking/dns/dns-top)

* [Windows Server as DHCP Server](https://docs.microsoft.com/windows-server/networking/technologies/dhcp/dhcp-top)

## Customize networking configuration (Optional)

The Network pages in the CloudSimple Portal allow you to specify the configuration for firewall tables and public IP addresses for VMs.

### Allocate public IPs

1. In the CloudSimple portal, navigate to **Network > Public IP**.
2. Click **Allocate Public IP**.
3. Enter a name to identify the IP address entry.
4. Keep the default location.
5. (Optional) Use the slider to change the idle timeout.
6. Enter the local IP address for which you want to assign a public IP address.
7. (Optional) Enter an associated DNS name.
8. Click **Submit**. Public IP address allocation begins.

9. (Optional) Check the status of the task on the **Activity** > **Tasks** page.

    When allocation is done, the new entry appears on the **Public IPs** page.

The VM to which this IP address must be mapped needs to be configured with the local address specified above. The specific procedure to configure an IP address depends on the VM operating system. Consult your VM operating system documentation for the correct procedure.

### Example

The following example provides details for Ubuntu 16.04.

Add the static method to the INET address family configuration in the file /etc/network/interfaces. Change the address, netmask, and gateway values. For this example, we're using:


* The eth0 interface
* Internal IP address: 192.168.24.10
* Gateway address: 192.168.24.1
* Netmask 255.255.255.0

For your environment, the available subnet information is provided in the welcome email.

```bash
sudo vi /etc/network/interfaces
```


The output will look similar to the following example:


```console
auto eth0
Iface eth0 inet static
iface eth0 inet static
address 192.168.24.10
netmask 255.255.255.0
gateway 192.168.24.1
dns-nameservers 8.8.8.8
dns-domain acme.com
dns-search acme.com
```

Manually disable the interface.

```bash
sudo ifdown eth0
```

Manually enable the interface again.

```bash
sudo ifup eth0
```

By default, all incoming traffic from the Internet is **denied**. If you would like to open any other port, file a ticket with CloudSimple Support.

After configuring an internal IP address as the static IP address, verify that you can reach the Internet from within the VM.

```bash
ping 8.8.8.8
```

Also verify that you can reach the VM from the Internet using the public IP address.

* Ensure that any iptable rules on the VM aren't blocking port 80 inbound.

```bash
netstat -an | grep 80
```

* Start an http server that listens on port 80.

```bash
python2.7 -m SimpleHTTPServer 80 or python3 -m http.server 80
```

* Start a browser on your desktop and point it to port 80 for the public IP address to browse the files on your VM.

## Default CloudSimple firewall rules for public IP

Explicitly allocated workload public IP traffic:

* VPN traffic: All traffic between (from/to) the VPN and all the workload networks and management network is allowed.
* Private cloud internal traffic: All east-west traffic between (from/to) workload networks and the management network (shown above) is allowed.
* Internet traffic:
  * All incoming traffic from the Internet is denied to workload networks and the management network.
  * All outgoing traffic to the Internet from workload networks or the management network is allowed.

You can also modify the way your traffic is secured, using the Firewall Rules feature. For more information, see [Set up firewall tables and rules](https://docs.azure.cloudsimple.com/firewall).

## Install solutions (Optional)

You can install solutions on your CloudSimple private cloud to take full advantage of your private cloud vCenter environment. To protect your virtual machines, you can set up solutions for:

* Backup
* Disaster recovery
* Replication
* Other functions
For example, you can set up VMware Site Recovery Manager (VMware SRM) and Veeam Backup & Replication.

To install a solution, you must request additional privileges for a limited period. See [Escalate privileges](https://docs.azure.cloudsimple.com/vsphere-access#escalate-privileges).

## Next steps

* [Consume VMware VMs on Azure](quickstart-create-vmware-virtual-machine.md)
