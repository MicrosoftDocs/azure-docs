---
title: High availability setup with STONITH for SAP HANA on Azure (Large Instances)| Microsoft Docs
description: Learn to establish high availability for SAP HANA on Azure (Large Instances) in SUSE by using the STONITH device.
services: virtual-machines-linux
documentationcenter:
author: Ajayan1008
manager: juergent
editor:
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 9/01/2021
ms.author: madhukan
ms.custom: H1Hack27Feb2017

---
# High availability setup in SUSE using the STONITH device

In this article, we'll go through the steps to set up high availability (HA) in HANA Large Instances on the SUSE operating system by using the STONITH device.

> [!NOTE]
> This guide is derived by successfully testing the setup in the Microsoft HANA Large Instances environment. The Microsoft Service Management team for HANA Large Instances doesn't support the operating system. So you may need to contact SUSE for any further troubleshooting or clarification on the operating system layer. 
>
> The Microsoft Service Management team does set up and fully support the STONITH device. It can help troubleshoot STONITH device problems.

## Prerequisites

To set up high availability by using SUSE clustering, you need to:

- Provision HANA Large Instances.
- Install and register the operating system with the latest patches.
- Connect HANA Large Instances servers to the SMT server to get patches and packages.
- Set up Network Time Protocol (NTP time server).
- Read and understand the latest version of the SUSE documentation on HA setup.

## Setup details

This guide uses the following setup:

- Operating system: SLES 12 SP1 for SAP
- HANA Large Instances: 2xS192 (four sockets, 2 TB)
- HANA version: HANA 2.0 SP1
- Server names: sapprdhdb95 (node1) and sapprdhdb96 (node2)
- STONITH device: iSCSI based
- NTP on one of the HANA Large Instance nodes

When you set up HANA Large Instances with HANA system replication, you can request that the Microsoft Service Management team set up the STONITH device. Do this at the time of provisioning. 

If you're an existing customer with HANA Large Instances already provisioned, you can still get the STONITH device set up. Provide the following information to the Microsoft Service Management team in the service request form (SRF). You can get the SRF through the Technical Account Manager or your Microsoft contact for HANA Large Instance onboarding.

- Server name and server IP address (for example, myhanaserver1, 10.35.0.1)
- Location (for example, US East)
- Customer name (for example, Microsoft)
- HANA system identifier (SID) (for example, H11)

After the STONITH device is configured, the Microsoft Service Management team will provide you with the STONITH block device (SBD) name and IP address of the iSCSI storage. You can use this information to configure STONITH setup. 

Follow the steps in the following sections to set up HA by using STONITH.

## Identify the SBD device

> [!NOTE]
> This section applies only to existing customers. If you're a new customer, the Microsoft Service Management team will give you the SBD device name, so skip this section.

1. Modify */etc/iscsi/initiatorname.isci* to: 

    ``` 
    iqn.1996-04.de.suse:01:<Tenant><Location><SID><NodeNumber> 
    ```
    
    Microsoft Service Management provides this string. Modify the file on *both* nodes. However, the node number is different on each node.
    
    ![Screenshot that shows an initiatorname file with InitiatorName values for a node.](media/HowToHLI/HASetupWithStonith/initiatorname.png)

2. Modify */etc/iscsi/iscsid.conf*: Set `node.session.timeo.replacement_timeout=5` and `node.startup = automatic`. Modify the file on *both* nodes.

3. Run the following discovery command on *both* nodes.

    ```
    iscsiadm -m discovery -t st -p <IP address provided by Service Management>:3260
    ```
    
    The results show four sessions.
    
    ![Screenshot that shows a console window with results of the discovery command.](media/HowToHLI/HASetupWithStonith/iSCSIadmDiscovery.png)

4. Run the following command on *both* nodes to sign in to the iSCSI device. 

    ```
    iscsiadm -m node -l
    ```
    
    The results show four sessions.
    
    ![Screenshot that shows a console window with results of the node command.](media/HowToHLI/HASetupWithStonith/iSCSIadmLogin.png)

5. Use the following command to run the *rescan-scsi-bus.sh* rescan script. This script shows the new disks created for you.  Run it on *both* nodes.

    ```
    rescan-scsi-bus.sh
    ```
    
    In the results, you should see a LUN number greater than zero (for example: 1, 2, and so on).
     
    ![Screenshot that shows a console window with results of the script.](media/HowToHLI/HASetupWithStonith/rescanscsibus.png)

6. To get the device name, run the following command on *both* nodes. 

    ```
      fdisk –l
    ```
    
    In the results, choose the device with the size of 178 MiB.
    
    ![Screenshot that shows a console window with results of the f disk command.](media/HowToHLI/HASetupWithStonith/fdisk-l.png)

## Initialize the SBD device

1. Use the following command to initialize the SBD device on *both* nodes.

    ```
    sbd -d <SBD Device Name> create
    ```
    ![Screenshot that shows a console window with the result of the s b d create command.](media/HowToHLI/HASetupWithStonith/sbdcreate.png)

2. Use the following command to check what has been written to the device. Do it on *both* nodes.

    ```
    sbd -d <SBD Device Name> dump
    ```

## Configure the SUSE HA cluster

1. First, install the package. Use the following command to check whether ha_sles and SAPHanaSR-doc patterns are installed on *both* nodes. If they're not installed, install them.

    ```
    zypper in -t pattern ha_sles
    zypper in SAPHanaSR SAPHanaSR-doc
    ```
    ![Screenshot that shows a console window with the result of the pattern command.](media/HowToHLI/HASetupWithStonith/zypperpatternha_sles.png)
    
    ![Screenshot that shows a console window with the result of the SAPHanaSR-doc command.](media/HowToHLI/HASetupWithStonith/zypperpatternSAPHANASR-doc.png)
    
2. Now, set up the cluster.	You can use either the `ha-cluster-init` command or the yast2 wizard. In this example, we're using the yast2 wizard. Do this step *only on the primary node*.

    1. Follow **yast2** > **High Availability** > **Cluster**.
    
        ![Screenshot that shows the YaST Control Center with High Availability and Cluster selected.](media/HowToHLI/HASetupWithStonith/yast-control-center.png)
        
        ![Screenshot that shows a dialog with Install and Cancel options.](media/HowToHLI/HASetupWithStonith/yast-hawk-install.png)
        
    1. Select **Cancel** because the halk2 package is already installed.
    
        ![Screenshot that shows a message about your cancel option.](media/HowToHLI/HASetupWithStonith/yast-hawk-continue.png)
    
    1. Select **Continue**.
    
        The expected value is the number of nodes deployed (in this case, 2).
        
        ![Screenshot that shows Cluster Security with an Enable Security Auth checkbox.](media/HowToHLI/HASetupWithStonith/yast-Cluster-Security.png)
        
    1. Select **Next**.        
        
    1. Add node names, and then select **Add suggested files**.

        ![Screenshot that shows the Cluster Configure window with Sync Host and Sync File lists.](media/HowToHLI/HASetupWithStonith/yast-cluster-configure-csync2.png)
        
    1. Select **Turn csync2 ON**.
    
    1. Select **Generate Pre-Shared-Keys**. The following pop-up message appears.
    
        ![Screenshot that shows a message that your key has been generated.](media/HowToHLI/HASetupWithStonith/yast-key-file.png)
        
    1. Select **OK**.
    
        The authentication is performed using the IP addresses and pre-shared keys in Csync2. The key file is generated with `csync2 -k /etc/csync2/key_hagroup`. The file *key_hagroup* should be copied to all members of the cluster manually after it's created. 
        
        Be sure to copy the file from node1 to node2.
        
        ![Screenshot that shows a Cluster Configure dialog box with options necessary to copy the key to all members of the cluster.](media/HowToHLI/HASetupWithStonith/yast-cluster-conntrackd.png)
        
    1. Select **Next**.
       
        In the default option, **Booting** was **Off**. Change it to **On**, so the pacemaker service is started on boot. You can make the choice based on your setup requirements.

        ![Screenshot that shows the Cluster Service window.](media/HowToHLI/HASetupWithStonith/yast-cluster-service.png)
    
    1. Select **Next**, and the cluster configuration is complete.

## Set up the softdog watchdog

1. Add the following line to */etc/init.d/boot.local* on *both* nodes.
    
    ```
    modprobe softdog
    ```
    ![Screenshot that shows a boot file with the softdog line added.](media/HowToHLI/HASetupWithStonith/modprobe-softdog.png)
    
2. Use the following command to update the file */etc/sysconfig/sbd* on *both* nodes.
    
    ```
    SBD_DEVICE="<SBD Device Name>"
    ```
    ![Screenshot that shows the s b d file with the S B D_DEVICE value added.](media/HowToHLI/HASetupWithStonith/sbd-device.png)
    
3. Load the kernel module on *both* nodes by running the following command.
    
    ```
    modprobe softdog
    ```
    ![Screenshot that shows part of a console window with the command modprobe softdog.](media/HowToHLI/HASetupWithStonith/modprobe-softdog-command.png)

4. Ensure that softdog is running as follows on *both* nodes.
    
    ```
    lsmod | grep dog
    ```
    ![Screenshot that shows part of a console window with the result of running the l s mod command.](media/HowToHLI/HASetupWithStonith/lsmod-grep-dog.png)
    
5. Use the following command to start the SBD device on *both* nodes.

    ```
    /usr/share/sbd/sbd.sh start
    ```
    ![Screenshot that shows part of a console window with the start command.](media/HowToHLI/HASetupWithStonith/sbd-sh-start.png)
    
6. Use the following command to test the SBD daemon on *both* nodes. 
    
    ```
    sbd -d <SBD Device Name> list
    ```
    You'll see two entries after you configure it on both nodes.    
    
    ![Screenshot that shows part of a console window displaying two entries.](media/HowToHLI/HASetupWithStonith/sbd-list.png)
    
7. Send the following test message to *one* of your nodes.

    ```
    sbd  -d <SBD Device Name> message <node2> <message>
    ```
    ![Screenshot that shows part of a console window displaying two entries.](media/HowToHLI/HASetupWithStonith/sbd-list.png)
    
8. On the *second* node (node2), use the following command to check the message status.
    
    ```
    sbd  -d <SBD Device Name> list
    ```
    ![Screenshot that shows part of a console window with one of the members displaying a test value for the other member.](media/HowToHLI/HASetupWithStonith/sbd-list-message.png)
    
9. To adopt the SBD configuration, update the file */etc/sysconfig/sbd* as follows on *both* nodes.

    ```
    SBD_DEVICE=" <SBD Device Name>" 
    SBD_WATCHDOG="yes" 
    SBD_PACEMAKER="yes" 
    SBD_STARTMODE="clean" 
    SBD_OPTS=""
    ```
10.	Use the following command to start the pacemaker service on the *primary node* (node1).

    ```
    systemctl start pacemaker
    ```
    ![Screenshot that shows a console window displaying the status after starting pacemaker.](media/HowToHLI/HASetupWithStonith/start-pacemaker.png)
    
    If the pacemaker service fails, see the section [Scenario 5: Pacemaker service fails](#pacemaker-service-fails) later in this article.

## Join the node to the cluster

Run the following command on **node2** to let node2 join the cluster.

```
ha-cluster-join
```

If you receive an error during joining of the cluster, see the section [Scenario 6: Node 2 unable to join the cluster](#node-2-unable-to-join-the-cluster) later in this article.

## Validate the cluster

1. Start the cluster service. Use the following commands to check and optionally start the cluster for the first time on *both* nodes:
    
     ```
    systemctl status pacemaker
    systemctl start pacemaker
    ```
    ![Screenshot that shows a console window with the status of pacemaker.](media/HowToHLI/HASetupWithStonith/systemctl-status-pacemaker.png)
        
2. Monitor the status. Run the following command to ensure that *both* nodes are online. You can run it on *any of the nodes* of the cluster.
    
    ```
    crm_mon
    ```
    ![Screenshot that shows a console window with the results of the c r m_mon command.](media/HowToHLI/HASetupWithStonith/crm-mon.png)
    
    You can also sign in to hawk to check the cluster status: `https://\<node IP>:7630`. The default user is **hacluster**, and the password is **linux**. If needed, you can change the password by using the `passwd` command.
    
## Configure cluster properties and resources

This section describes the steps to configure the cluster resources.
In this example, you set up the following resources. You can configure the rest (if needed) by referencing the SUSE HA guide.

- Cluster bootstrap
- STONITH device
- Virtual IP address

Do the configuration in *the primary node* only.

1. Create the cluster bootstrap file and configure it by adding the following text:
    
    ```
    sapprdhdb95:~ # vi crm-bs.txt
    # enter the following to crm-bs.txt
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
    ```

2. Use the following command to add the configuration to the cluster.

    ```
    crm configure load update crm-bs.txt
    ```
    ![Screenshot that shows part of a console window running the c r m command.](media/HowToHLI/HASetupWithStonith/crm-configure-crmbs.png)
    
3. Configure the STONITH device by adding the resource, creating the file, and adding text as follows.

    ```
    # vi crm-sbd.txt
    # enter the following to crm-sbd.txt
    primitive stonith-sbd stonith:external/sbd \
    params pcmk_delay_max="15"
    ```
    Use the following command to add the configuration to the cluster.
        
    ```
    crm configure load update crm-sbd.txt
    ```
        
4. Add the virtual IP address for the resource by creating the file and adding the following text.

    ```
    # vi crm-vip.txt
    primitive rsc_ip_HA1_HDB10 ocf:heartbeat:IPaddr2 \
    operations $id="rsc_ip_HA1_HDB10-operations" \
    op monitor interval="10s" timeout="20s" \
    params ip="10.35.0.197"
    ```
    
    Use the folowing command to add the configuration to the cluster:
    
    ```
    crm configure load update crm-vip.txt
    ```
        
5. Use the `crm_mon` command to validate the resources. 

    In the results, you can see the two resources.

    ![Screenshot that shows a console window with two resources.](media/HowToHLI/HASetupWithStonith/crm_mon_command.png)

    You can also see the status at *https://\<node IP address>:7630/cib/live/state*.
    
    ![Screenshot that shows the status of the two resources.](media/HowToHLI/HASetupWithStonith/hawlk-status-page.png)
    
## Test the failover process

1. To test the failover process, use the following command to stop the pacemaker service on node1.

    ```
    Service pacemaker stop
    ```
    
    The resources fail over to node2.

2. Stop the pacemaker service on node2, and resources fail over to node1.

    **Before failover**  
    ![Screenshot that shows the status of the two resources before failover.](media/HowToHLI/HASetupWithStonith/Before-failover.png)  
    
    **After failover**  
    ![Screenshot that shows the status of the two resources after failover.](media/HowToHLI/HASetupWithStonith/after-failover.png)
    
    ![Screenshot that shows a console window with the status of resources after failover.](media/HowToHLI/HASetupWithStonith/crm-mon-after-failover.png)  
    

## Troubleshooting
This section describes the few failure scenarios that can be encountered during setup. You may not necessarily face these issues.

### Scenario 1: Cluster node not online

If any of the nodes don't show online in cluster manager, you can try the following to bring it online.

1. Start the iSCSI service:

    ```
    service iscsid start
    ```
    
2. Now sign in to that iSCSI node.

    ```
    iscsiadm -m node -l
    ```
    The expected output looks like:

    ```
    sapprdhdb45:~ # iscsiadm -m node -l
    Logging in to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.11,3260] (multiple)
    Logging in to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.12,3260] (multiple)
    Logging in to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.22,3260] (multiple)
    Logging in to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.21,3260] (multiple)
    Login to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.11,3260] successful.
    Login to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.12,3260] successful.
    Login to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.22,3260] successful.
    Login to [iface: default, target: iqn.1992-08.com.netapp:hanadc11:1:t020, portal: 10.250.22.21,3260] successful.
    ```
### Scenario 2: yast2 doesn't show graphical view

The yast2 graphical screen is used to set up the high availability cluster in this document. If yast2 doesn't open with the graphical window as shown, and throws a Qt error, do the following steps. If it opens with the graphical window, you can skip the steps.

**Error**

![Screenshot that shows part of a console window with an error message.](media/HowToHLI/HASetupWithStonith/yast2-qt-gui-error.png)

**Expected Output**

![Screenshot that shows the YaST Control Center with High Availability and Cluster highlighted.](media/HowToHLI/HASetupWithStonith/yast-control-center.png)

If the yast2 doesn't open with the graphical view, follow these steps:

1. Install the required packages. You must be logged in as user “root” and have SMT set up to download/install the packages.

2. To install the packages, use yast>Software>Software Management>Dependencies> option “Install recommended packages…”. The following screenshot illustrates the expected screens.

    >[!NOTE]
    >You need to perform the steps on both nodes, so that you can access the yast2 graphical view from both nodes.
    
    ![Screenshot that shows a console window displaying the YaST Control Center.](media/HowToHLI/HASetupWithStonith/yast-sofwaremanagement.png)
    
3. Under Dependencies, select **Install Recommended Packages**.

    ![Screenshot that shows a console window with Install Recommended Packages selected.](media/HowToHLI/HASetupWithStonith/yast-dependencies.png)

4. Review the changes and select **OK**.

    ![yast](media/HowToHLI/HASetupWithStonith/yast-automatic-changes.png)

    The package installation proceeds.

    ![Screenshot that shows a console window displaying progress of the installation.](media/HowToHLI/HASetupWithStonith/yast-performing-installation.png)

5. Select **Next**.

    ![Screenshot that shows a console window with a success message.](media/HowToHLI/HASetupWithStonith/yast-installation-report.png)

6. Select **Finish**.

7. You also need to install the libqt4 and libyui-qt packages.
    
    ```
    zypper -n install libqt4
    ```
    ![Screenshot that shows a console window installing the libqt4 package.](media/HowToHLI/HASetupWithStonith/zypper-install-libqt4.png)
    
    ```
    zypper -n install libyui-qt
    ```
    ![Screenshot that shows a console window installing the libyui-qt package.](media/HowToHLI/HASetupWithStonith/zypper-install-ligyui.png)
    
    ![Screenshot that shows a console window installing the libyui-qt package, continued.](media/HowToHLI/HASetupWithStonith/zypper-install-ligyui_part2.png)
    
    Yast2 can now open the graphical view as shown here.

    ![Screenshot that shows the YaST Control Center with Software and Online Update selected.](media/HowToHLI/HASetupWithStonith/yast2-control-center.png)

### Scenario 3: yast2 doesn't show the high availability option

For the high availability option to be visible on the yast2 control center, you need to install the other packages.

1. Using Yast2>Software>Software management, select the following patterns:

    - SAP HANA server base
    - C/C++ Compiler and tools
    - High availability
    - SAP Application server base

    The following screen shows the steps to install the patterns.

    Using yast2 > Software > Software Management

    ![Screenshot that shows the YaST Control Center with Software and Online Update selected to begin the installation.](media/HowToHLI/HASetupWithStonith/yast2-control-center.png)

2. Select the patterns.

    ![Screenshot that shows selecting the first pattern in the C / C++ Compiler and Tools item.](media/HowToHLI/HASetupWithStonith/yast-pattern1.png)

    ![Screenshot that shows selecting the second pattern in the C / C++ Compiler and Tools item.](media/HowToHLI/HASetupWithStonith/yast-pattern2.png)

3. Select **Accept**.

    ![Screenshot that shows the Changed Packages dialog box with packages changed to resolve dependencies.](media/HowToHLI/HASetupWithStonith/yast-changed-packages.png)

4. Select **Continue**.

    ![Screenshot that shows the Performing Installation status page.](media/HowToHLI/HASetupWithStonith/yast2-performing-installation.png)

5. Select **Next** when the installation is complete.

    ![Screenshot that shows the installation report.](media/HowToHLI/HASetupWithStonith/yast2-installation-report.png)

### Scenario 4: HANA installation fails with gcc assemblies error
The HANA installation fails with the following error.

![Screenshot that shows an error message that the operating system isn't ready to perform g c c 5 assemblies.](media/HowToHLI/HASetupWithStonith/Hana-installation-error.png)

- To fix the issue, you need to install libraries (libgcc_sl and libstdc++6) as per the following screenshot.

    ![Screenshot that shows a console window installing required libraries.](media/HowToHLI/HASetupWithStonith/zypper-install-lib.png)

### Scenario 5: Pacemaker service fails

The following issue occurred during the pacemaker service start.

```
sapprdhdb95:/ # systemctl start pacemaker
A dependency job for pacemaker.service failed. See 'journalctl -xn' for details.
```
```
sapprdhdb95:/ # journalctl -xn
-- Logs begin at Thu 2017-09-28 09:28:14 EDT, end at Thu 2017-09-28 21:48:27 EDT. --
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [SERV  ] Service engine unloaded: corosync configuration map
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [QB    ] withdrawing server sockets
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [SERV  ] Service engine unloaded: corosync configuration ser
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [QB    ] withdrawing server sockets
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [SERV  ] Service engine unloaded: corosync cluster closed pr
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [QB    ] withdrawing server sockets
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [SERV  ] Service engine unloaded: corosync cluster quorum se
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [SERV  ] Service engine unloaded: corosync profile loading s
Sep 28 21:48:27 sapprdhdb95 corosync[68812]: [MAIN  ] Corosync Cluster Engine exiting normally
Sep 28 21:48:27 sapprdhdb95 systemd[1]: Dependency failed for Pacemaker High Availability Cluster Manager
-- Subject: Unit pacemaker.service has failed
-- Defined-By: systemd
-- Support: https://lists.freedesktop.org/mailman/listinfo/systemd-devel
--
-- Unit pacemaker.service has failed.
--
-- The result is dependency.
```
```
sapprdhdb95:/ # tail -f /var/log/messages
2017-09-28T18:44:29.675814-04:00 sapprdhdb95 corosync[57600]:   [QB    ] withdrawing server sockets
2017-09-28T18:44:29.676023-04:00 sapprdhdb95 corosync[57600]:   [SERV  ] Service engine unloaded: corosync cluster closed process group service v1.01
2017-09-28T18:44:29.725885-04:00 sapprdhdb95 corosync[57600]:   [QB    ] withdrawing server sockets
2017-09-28T18:44:29.726069-04:00 sapprdhdb95 corosync[57600]:   [SERV  ] Service engine unloaded: corosync cluster quorum service v0.1
2017-09-28T18:44:29.726164-04:00 sapprdhdb95 corosync[57600]:   [SERV  ] Service engine unloaded: corosync profile loading service
2017-09-28T18:44:29.776349-04:00 sapprdhdb95 corosync[57600]:   [MAIN  ] Corosync Cluster Engine exiting normally
2017-09-28T18:44:29.778177-04:00 sapprdhdb95 systemd[1]: Dependency failed for Pacemaker High Availability Cluster Manager.
2017-09-28T18:44:40.141030-04:00 sapprdhdb95 systemd[1]: [/usr/lib/systemd/system/fstrim.timer:8] Unknown lvalue 'Persistent' in section 'Timer'
2017-09-28T18:45:01.275038-04:00 sapprdhdb95 cron[57995]: pam_unix(crond:session): session opened for user root by (uid=0)
2017-09-28T18:45:01.308066-04:00 sapprdhdb95 CRON[57995]: pam_unix(crond:session): session closed for user root
```

- To fix it, delete the following line from the file */usr/lib/systemd/system/fstrim.timer*

    ```
    Persistent=true
    ```
    
    ![Screenshot that shows the f s trim file with the value of Persistent=true to be deleted.](media/HowToHLI/HASetupWithStonith/Persistent.png)

### Scenario 6: Node 2 unable to join the cluster

When joining the node2 to the existing cluster using the *ha-cluster-join* command, the following error occurred.

```
ERROR: Can’t retrieve SSH keys from <Primary Node>
```

![Screenshot that shows a console window with the error message Can’t retrieve S S H keys from an I P address.](media/HowToHLI/HASetupWithStonith/ha-cluster-join-error.png)

1. To fix it, run the following on both nodes:

    ```
    ssh-keygen -q -f /root/.ssh/id_rsa -C 'Cluster Internal' -N ''
    cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys
    ```

    ![Screenshot that shows part of a console window running the command on the first node.](media/HowToHLI/HASetupWithStonith/ssh-keygen-node1.PNG)

    ![Screenshot that shows part of a console window running the command on the second node.](media/HowToHLI/HASetupWithStonith/ssh-keygen-node2.PNG)

2. After the preceding fix, node2 should be added to the cluster.

    ![Screenshot that shows a console window with a successful ha-cluster-join command.](media/HowToHLI/HASetupWithStonith/ha-cluster-join-fix.png)

## Next steps

You can find more information on SUSE HA setup in the following articles: 

- [SAP HANA SR Performance Optimized Scenario](https://www.suse.com/support/kb/doc/?id=000019450 )
- [Storage-based fencing](https://www.suse.com/documentation/sle_ha/book_sleha/data/sec_ha_storage_protect_fencing.html)
- [Blog - Using Pacemaker Cluster for SAP HANA- Part 1](https://blogs.sap.com/2017/11/19/be-prepared-for-using-pacemaker-cluster-for-sap-hana-part-1-basics/)
- [Blog - Using Pacemaker Cluster for SAP HANA- Part 2](https://blogs.sap.com/2017/11/19/be-prepared-for-using-pacemaker-cluster-for-sap-hana-part-2-failure-of-both-nodes/)

Learn how to do an operating system file level backup and restore.

> [!div class="nextstepaction"]
> [OS backup and restore](large-instance-os-backup.md)
