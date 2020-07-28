---
title: Configure NFSv4.1 Kerberos encryption for Azure NetApp Files | Microsoft Docs
description: Describes how to configure NFSv4.1 Kerberos encryption for Azure NetApp Files and the performance impact.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 07/27/2020
ms.author: b-juche
---
# Configure NFSv4.1 Kerberos encryption for Azure NetApp Files

Azure NetApp Files supports NFS client encryption in Kerberos modes (krb5, krb5i, and krb5p) with AES-256 encryption. This article describes the required configurations for using an NFSv4.1 volume with Kerberos encryption.

## Requirements

The following requirements apply to NFSv4.1 client encryption: 

* Active Directory Domain Services (AD DS) connection to facilitate Kerberos ticketing 
* DNS A/PTR record creation for both the client and Azure NetApp Files NFS server IP addresses
* A Linux client  
    This article provides guidance for RHEL and Ubuntu clients.  Other clients will work with similar configuration steps. 
* NTP server access  
    You can use one of the commonly used Active Directory Domain Controller (AD DC) domain controllers.

## Create an NFS Kerberos Volume

1.	Follow steps in [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md) to create the NFSv4.1 volume.   

    On the Create a Volume page, set the NFS version to **NFSv4.1**, and set Kerberos to **Enabled**.

    > [!IMPORTANT] 
    > You cannot modify the Kerberos enablement selection after the volume is created.

    ![Create NFSv4.1 Kerberos volume](../media/azure-netapp-files/create-kerberos-volume.png)  

2. Select **Export Policy** to match the desired level of access and security option (Kerberos 5, Kerberos 5i, or Kerberos 5p) for the volume.   

    For performance impact of Kerberos, see [Performance impact of Kerberos on NFSv4.1](#kerberos_performance).  

    You can also modify the Kerberos security methods for the volume by clicking Export Policy in the Azure NetApp Files navigation pane.

3.	Click **Review + Create** to create the NFSv4.1 volume.

## Configure the Azure portal 

1.	Follow the instructions in [Create an Active Directory connection](azure-netapp-files-create-volumes-smb.md#create-an-active-directory-connection).  

    Kerberos requires that you create at least one machine account in Active Directory. The account information you provide is used for creating the accounts for both SMB *and* NFSv4.1 Kerberos volumes. This machine is account is created automatically during volume creation.

2.	Under **Kerberos Realm**, enter the **AD Server Name** and the **KDC IP** address.

    AD Server and KDC IP can be the same server. This information is used to create the SPN machine account used by Azure NetApp Files. After the machine account is created, Azure NetApp Files will use DNS Server records to locate additional KDC servers as needed. 

    ![Kerberos Realm](../media/azure-netapp-files/kerberos-realm.png)
 
3.	Click **Join** to save the configuration.

## Configure Active Directory connection 

Configuration of NFSv4.1 Kerberos creates two computer accounts in Active Directory:
* A computer account for SMB shares
* A computer account for NFSv4.1 -- You can identify this account by way of the prefix `NFS-`. 

After creating the first NFSv4.1 Kerberos volume, set the encryption type or the computer account by using the following PowerShell command:

`Set-ADComputer $NFSCOMPUTERACCOUNT -KerberosEncryptionType AES256`

## Configure the NFS client 

A wide variety of Linux distributions are available to use with Azure NetApp Files. This section describes configurations for two of the more commonly used environments: RHEL 8 and Ubuntu 18.04.

Regardless of the Linux flavor you use, the following configurations are required:
* Configure an NTP client to avoid issues with time skew.
* Configure DNS entries of the Linux client for name resolution.  
    This configuration includes the “A” (forward) record and the PTR (reverse) record . 
* For domain join, create a computer account in the target Active Directory (which is created during the realm join command). 
    > [!NOTE] 
    > The `$SERVICEACCOUNT` variable used in the commands below should be a user account with permissions or delegation to create a computer account in the targeted Organizational Unit.
* Enable the client to mount NFS volumes and other relevant monitoring tools.

### RHEL 8 configuration 

1. Install packages:   
    `sudo yum -y install realmd sssd adcli samba-common krb5-workstation chrony`

2. Configure the NTP client:  
    RHEL 8 uses `chrony` by default.  Following the configuration guidelines in [Using the Chrony suite to configure NTP](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/using-chrony-to-configure-ntp).

3. Join the Active Directory domain:  
    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou= OU=$YOUROU,DC=$DOMAIN,DC=TLD`

### Ubuntu configuration 

1. Install packages:  
    `sudo yum -y install realmd packagekit sssd adcli samba-common krb5-workstation chrony`

2. Configure the NTP client.  
    Ubuntu 18.04 uses `chrony` by default.  Following the configuration guidelines in [Ubuntu Bionic: Using chrony to configure NTP](https://ubuntu.com/blog/ubuntu-bionic-using-chrony-to-configure-ntp).

3. Join the Active Directory Domain:  
    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou= OU=$YOUROU,DC=$DOMAIN,DC=TLD`

## <a name="kerberos_mount"></a>Mount the NFS Kerberos volume

1. From the **Volumes** page, select the NFS volume that you want to mount.

2. Select **Mount instructions** from the volume to display the instructions.

    For example: 

    ![Mount instructions for Kerberos volumes](../media/azure-netapp-files/mount-instructions-kerberos-volume.png)  

3. Create the directory (mount point) for the new volume.  

4. Set the default encryption type to AES 256 for the computer account:  
    `Set-ADComputer $COMPUTERACCOUNT -KerberosEncryptionType AES256 -Credential $ANFSERVICEACCOUNT`

    * You need to run this command only once for each computer account.
    * You can run this command from a domain controller or from a PC with [RSAT](https://support.microsoft.com/help/2693643/remote-server-administration-tools-rsat-for-windows-operating-systems) installed. 
    * The `$COMPUTERACCOUNT` variable is the computer account created in Active Directory when you deploy the Kerberos volume. This is the account that is prefixed with `NFS-`. 
    * The `$ANFSERVICEACCOUNT` variable is a non-privileged Active Directory user account with delegated controls over the Organizational Unit where the computer account has been created. 

5. Mount the volume on the host: 

    `sudo mount -t nfs -o sec=krb5p,rw,hard,rsize=1048576,wsize=1048576,vers=4.1,tcp $ANFEXPORT $ANFMOUNTPOINT`

    * The `$ANFEXPORT` variable is the `host:/export` path found in the mount instructions.
    * The `$ANFMOUNTPOINT` variable is the user-created folder on the Linux host.

## <a name="kerberos_performance"></a>Performance impact of Kerberos on NFSv4.1 

This section helps you understand the performance impact of Kerberos on NFSv4.1.

### Available security options 

The security options currently available for NFSv4.1 volumes are as follows: 

* **sec=sys** uses local UNIX UIDs and GIDs by using AUTH_SYS to authenticate NFS operations.
* **sec=krb5** uses Kerberos V5 instead of local UNIX UIDs and GIDs to authenticate users.
* **sec=krb5i** uses Kerberos V5 for user authentication and performs integrity checking of NFS operations using secure checksums to prevent data tampering.
* **sec=krb5p** uses Kerberos V5 for user authentication and integrity checking. It encrypts NFS traffic to prevent traffic sniffing. This option is the most secure setting, but it also involves the most performance overhead.

### Performance vectors tested

This section describes the single client-side performance impact of the various `sec=*` options.

* Performance impact was tested at two levels: low concurrency (low load) and high concurrency (upper limits of I/O and throughput).  
* Three types of workloads were tested:  
    * Small operation random read/write (using FIO)
    * Large operation sequential read/write (using FIO)
    * Metadata heavy workload as generated by applications such as git

### Expected performance impact 

There are two areas of focus: light load and upper limit. The following lists describe the performance impact security setting by security setting and scenario by scenario. All comparisons are made against the `sec=sys` security parameter.

Performance impact of krb5:

* Low concurrency (r/w):
    * Sequential latency increased 0.3 ms.
    * Random I/O latency increased 0.2 ms.
    * Metadata I/O latency increased 0.2 ms.
* High concurrency (r/w): 
    * Maximum sequential throughput was unimpacted by krb5.
    * Maximum random I/O decreased by 30% for pure read workloads with the overall impact dropping to zero as the workload shifts to pure write. 
    * Maximum metadata workload decreased 30%.

Performance impact of krb5i: 

* Low concurrency (r/w):
    * Sequential latency increased 0.5 ms.
    * Random I/O latency increased 0.2 ms.
    * Metadata I/O latency increased 0.2 ms.
* High concurrency (r/w): 
    * Maximum sequential throughput decreased by 70% overall regardless of the workload mixture.
    * Maximum random I/O decreased by 50% for pure read workloads with the overall impact decreasing to 25% as the workload shifts to pure write. 
    * Maximum metadata workload decreased 30%.

Performance impact of krb5p:

* Low concurrency (r/w):
    * Sequential latency increased 0.8 ms.
    * Random I/O latency increased 0.2 ms.
    * Metadata I/O latency increased 0.2 ms.
* High concurrency (r/w): 
    * Maximum sequential throughput decreased by 85% overall regardless of the workload mixture. 
    * Maximum random I/O decreased by 65% for pure read workloads with the overall impact decreasing to 43% as the workload shifts to pure write. 
    * Maximum metadata workload decreased 30%.

## Next steps  

* [FAQs About Azure NetApp Files](azure-netapp-files-faqs.md)
* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create an Active Directory connection](azure-netapp-files-create-volumes-smb.md#create-an-active-directory-connection)
