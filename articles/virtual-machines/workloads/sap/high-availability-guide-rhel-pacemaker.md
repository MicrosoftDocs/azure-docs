---
title: Setting up Pacemaker on Red Hat Enterprise Linux in Azure | Microsoft Docs
description: Setting up Pacemaker on Red Hat Enterprise Linux in Azure
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: mssedusch
manager: timlt
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-windows
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 08/17/2018
ms.author: sedusch

---

# Setting up Pacemaker on Red Hat Enterprise Linux in Azure

[planning-guide]:planning-guide.md
[deployment-guide]:deployment-guide.md
[dbms-guide]:dbms-guide.md
[sap-hana-ha]:sap-hana-high-availability.md

> [!NOTE]
> Pacemaker on Red Hat Enterprise Linux uses the Azure Fence Agent to fence a cluster node if required. A failover can take up to 15 minutes if a resource stop fails or the cluster nodes cannot communicate which each other anymore.

![Pacemaker on SLES overview](./media/high-availability-guide-rhel-pacemaker/pacemaker-rhel.png)

## Cluster installation

The following items are prefixed with either **[A]** - applicable to all nodes, **[1]** - only applicable to node 1 or **[2]** - only applicable to node 2.

1. **[A]** Register

   Register your virtual machines and attach it to a pool that contains repositories for RHEL 7.

   <pre><code>sudo subscription-manager register
   sudo subscription-manager attach --pool=&lt;pool id&gt;
   </code></pre>

1. **[A]** Enable RHEL for SAP repos

   In order to install the required packages, enable the following repositories.

   <pre><code>sudo subscription-manager repos --disable "*"
   sudo subscription-manager repos --enable=rhel-7-server-rpms
   sudo subscription-manager repos --enable=rhel-ha-for-rhel-7-server-rpms
   sudo subscription-manager repos --enable="rhel-sap-for-rhel-7-server-rpms"
   </code></pre>

1. **[A]** Install HA extension

   <pre><code>sudo yum install -y pcs pacemaker fence-agents-azure-arm nmap-ncat
   </code></pre>

1. **[A]** Setup host name resolution

   You can either use a DNS server or modify the /etc/hosts on all nodes. This example shows how to use the /etc/hosts file.
   Replace the IP address and the hostname in the following commands. The benefit of using /etc/hosts is that your cluster become independent of DNS which could be a single point of failures too.

   <pre><code>sudo vi /etc/hosts
   </code></pre>

   Insert the following lines to /etc/hosts. Change the IP address and hostname to match your environment

   <pre><code># IP address of the first cluster node
   <b>10.0.0.6 prod-cl1-0</b>
   # IP address of the second cluster node
   <b>10.0.0.7 prod-cl1-1</b>
   </code></pre>

1. **[A]** Change hacluster password to the same password

   <pre><code>sudo passwd hacluster
   </code></pre>

1. **[A]** Add firewall rules for pacemaker

   Add the following firewall rules to all cluster communication between the cluster nodes.

   <pre><code>sudo firewall-cmd --add-service=high-availability --permanent
   sudo firewall-cmd --add-service=high-availability
   </code></pre>

1. **[A]** Enable and start Pacemaker

   Run the following commands to enable the Pacemaker service and start it.

   <pre><code>sudo systemctl start pcsd.service
   sudo systemctl enable pcsd.service
   sudo systemctl enable pacemaker
   </code></pre>

1. **[1]** Create Pacemaker cluster

   Run the following commands to authenticate the nodes and create the cluster

   <pre><code>sudo pcs cluster auth <b>prod-cl1-0</b> <b>prod-cl1-1</b> -u hacluster
   sudo pcs cluster setup --name <b>nw1-azr</b> <b>prod-cl1-0</b> <b>prod-cl1-1</b>
   sudo pcs cluster start --all
   
   # Run the following command until the status of both nodes is online
   sudo pcs status
   
   # Cluster name: nw1-azr
   # WARNING: no stonith devices and stonith-enabled is not false
   # Stack: corosync
   # Current DC: <b>prod-cl1-1</b> (version 1.1.18-11.el7_5.3-2b07d5c5a9) - partition with quorum
   # Last updated: Fri Aug 17 09:18:24 2018
   # Last change: Fri Aug 17 09:17:46 2018 by hacluster via crmd on <b>prod-cl1-1</b>
   #
   # 2 nodes configured
   # 0 resources configured
   #
   # Online: [ <b>prod-cl1-0</b> <b>prod-cl1-1</b> ]
   #
   # No resources
   #
   #
   # Daemon Status:
   #   corosync: active/disabled
   #   pacemaker: active/disabled
   #   pcsd: active/enabled
   </code></pre>

1. **[A]** Increase the token timeout of corosync.

   <pre><code>sudo vi /etc/corosync/corosync.conf
   </code></pre>

   Add the following bold content to the file if the values are not there or different. Make sure to change the host names and cluster name if you copy and paste the corosync config.

   <pre><code>totem {
    version: 2
    cluster_name: nw1-azr
    secauth: off
    transport: udpu
    <b>token: 30000</b>
   }
   nodelist {
    node {
        ring0_addr: prod-cl1-0
        nodeid: 1
    }
    node {
        ring0_addr: prod-cl1-1
        nodeid: 2
    }
   }
   quorum {
    provider: corosync_votequorum
    two_node: 1
    <b>expected_votes: 2</b>
   }
   logging {
    to_logfile: yes
    logfile: /var/log/cluster/corosync.log
    to_syslog: yes
   }
   </code></pre>

   Then restart the corosync service

   <pre><code>sudo service corosync restart
   </code></pre>

## Create STONITH device

The STONITH device uses a Service Principal to authorize against Microsoft Azure. Follow these steps to create a Service Principal.

1. Go to <https://portal.azure.com>
1. Open the Azure Active Directory blade  
   Go to Properties and write down the Directory ID. This is the **tenant ID**.
1. Click App registrations
1. Click Add
1. Enter a Name, select Application Type "Web app/API", enter a sign-on URL (for example http://localhost) and click Create
1. The sign-on URL is not used and can be any valid URL
1. Select the new App and click Keys in the Settings tab
1. Enter a description for a new key, select "Never expires" and click Save
1. Write down the Value. It is used as the **password** for the Service Principal
1. Write down the Application ID. It is used as the username (**login ID** in the steps below) of the Service Principal

### **[1]** Create a custom role for the fence agent

The Service Principal does not have permissions to access your Azure resources by default. You need to give the Service Principal permissions to start and stop (deallocate) all virtual machines of the cluster. If you did not already create the custom role, you can create it using [PowerShell](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-powershell#create-a-custom-role) or [Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli#create-a-custom-role)

Use the following content for the input file. You need to adapt the content to your subscriptions that is, replace c276fc76-9cd4-44c9-99a7-4fd71546436e and e91d47c4-76f3-4271-a796-21b4ecfe3624 with the Ids of your subscription. If you only have one subscription, remove the second entry in AssignableScopes.

```json
{
  "Name": "Linux Fence Agent Role",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows to deallocate and start virtual machines",
  "Actions": [
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/virtualMachines/deallocate/action",
    "Microsoft.Compute/virtualMachines/start/action"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e",
    "/subscriptions/e91d47c4-76f3-4271-a796-21b4ecfe3624"
  ]
}
```

### **[1]** Assign the custom role to the Service Principal

Assign the custom role "Linux Fence Agent Role" that was created in the last chapter to the Service Principal. Do not use the Owner role anymore!

1. Go to https://portal.azure.com
1. Open the All resources blade
1. Select the virtual machine of the first cluster node
1. Click Access control (IAM)
1. Click Add
1. Select the role "Linux Fence Agent Role"
1. Enter the name of the application you created above
1. Click OK

Repeat the steps above for the second cluster node.

### **[1]** Create the STONITH devices

After you edited the permissions for the virtual machines, you can configure the STONITH devices in the cluster.

<pre><code>
sudo pcs property set stonith-timeout=900
</code></pre>

Use the following command to configure the fence device.

> [!NOTE]
> If the RHEL host names and the Azure node names are identical, then pcmk_host_map is not required in the command. Refer to the bold section in the command.

<pre><code>sudo pcs stonith create rsc_st_azure fence_azure_arm login="<b>login ID</b>" passwd="<b>password</b>" resourceGroup="<b>resource group</b>" tenantId="<b>tenant ID</b>" subscriptionId="<b>subscription id</b>" <b>pcmk_host_map="prod-cl1-0:10.0.0.6;prod-cl1-1:10.0.0.7"</b> power_timeout=240 pcmk_reboot_timeout=900</code></pre>

### **[1]** Enable the use of a STONITH device

<pre><code>sudo pcs property set stonith-enabled=true
</code></pre>

## Next steps

* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha]
