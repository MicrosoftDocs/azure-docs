---
title: Configure application volume groups for SAP HANA API | Microsoft Docs
description: Setting up your application volume groups for the SAP HANA API requires special configurations. 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 08/31/2022
ms.author: b-ahibbard
---
# Configure application volume groups for the SAP HANA API

Application volume group (AVG) enables customers to deploy all volumes for a single HANA host in one atomic step. The portal GUI and the Azure Resource Manager template have implemented pre-checks and recommendations for deployment: for example size and throughput as well as volume naming conventions, the user can change during the GUI workflow. As an API user, those checks, and recommendations are not available.

In lieu of these checks, you should understand the basic architecture and workflow the application volume group is built upon as well as the HANA requirements for running HANA on Azure NetApp Files. 

SAP HANA can be installed as single-host (scale-up) or in a multiple-host (scale-out) configuration. The volumes required for each of the HANA nodes differ for the first HANA node (single-host) and for additional HANA hosts (multiple-host). Since an application volume group creates the volumes for a single HANA host, the number and type of volumes created differ for the first HANA host and all subsequent HANA hosts in case of a multiple-host setup. 

Application volume groups allows you to define volume size and throughput according to your requirements. To do this, only manual QoS capacity pools can be used. According to the SAP HANA certification, only a subset of volume features can be used for the different volumes. Since enterprise applications such as SAP HANA require an application consistent data protection it is **not** recommended to configure automated snapshot policies for any of the volumes. Instead consider using specific data protection applications such as [AzAcSnap](azacsnap-introduction.md) or Commvault. 

## Rules and restrictions

Using AVG application volume groups requires understanding the rules and restrictions:.
* A single volume group is used to create the volumes for a single HANA host only. 
* In a HANA multiple-host setup (scale-out) it is best practice to start with the volume group for the first HANA host, and continue host by host
* HANA requires different volume types for the first HANA host and all additional multiple-hosts hosts you add. 
* Available volume types are: data, log, shared, log-backup, and data-backup.
* The first node can have all 5 different volumes (one for each type).
    * data, log and shared volumes must be provided
    * log-backup and data-backup are optional, since customers may choose to use a central share to store the backups or even use backint for the log-backup
* All additional hosts in a multiple-host setup may only add one data and one log volume each. 
* For data, log and shared volumes NFSv4.1 protocol is mandatory based on the SAP HANA certification.
* Log-backup and file-backup volumes, if created with the volume group of the first HANA host as they are optional, may use NFSv4.1 or NFSv3 protocol.
* Each volume must have at least one export policy defined. To install SAP, root access must be enabled.
* Kerberos nor LDAP enablement are currently not supported.
* It is strongly recommended to follow the naming convention proposal as outlined in the next list.

The following list describes all the possible volume types for application volume groups for SAP HANA.

| Volume type | Creation limits | Supported Protocol | Recommended naming | Data protection recommendation |
| ---- | ----- | ------- | ------ | ----- |
| **SAP HANA data volume** | One data volume must be created for every HANA host. | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-mnt<00001>`: <ol><li> `<SID>` is the SAP system ID </li><li> `<00001>` refers to host number, for example first host or single is 00001, the next host is 00002 </li></ol> | No initial data protection recommendation | 
| ** SAP HANA log volume | One log volume bust must be created for every HANA host | NFSv4.1 (LDAP nor Kerberos are supported) | `<SID>-data-mnt<00001>`: <ol><li> `<SID>` is the SAP system ID </li><li> `<00001>` refers to host number, for example first host or single is 00001, the next host is 00002 </li></ol> | No initial data protection recommendation | 
| **SAP HANA shared volume** | One shared volume must be created for the first host HANA host of a multiple-host setup, or for a single-host HANA installation.


1. **SAP HANA data volume**
    One data volume must be created for every HANA host.
    Supported protocol: NFSv4.1, no LDAP or Kerberos.
Recommended naming: `<SID>-data-mnt<00001>`:
* `<SID>` is the SAP system ID
* `<00001>` refers to host number, for example first host or single is 00001, the next host is 00002
    No initial data protection recommended.

2.	SAP HANA log volume
One log volume must be created for every HANA host
Supported protocol: NFSv4.1, no LDAP or Kerberos.
Recommended naming: <SID>-log-mnt<00001>, where <SID> is the SAP system Id and <00001> the host number, i.e., first host or single host=00001, next host=00002,…
No data protection recommended.

3.	SAP HANA shared volume
One shared volume must be created for the first host HANA host of a multiple-host setup, or for a single-host HANA installation.
Supported protocol: NFSv4.1, no LDAP or Kerberos.
Recommended naming: <SID>-shared, where <SID> is the SAP system Id.
No initial data protection recommended.

4.	SAP HANA data backup volume
This is an optional volume created only for the first HANA node.
Supported protocols: NFSv4.1 or NFSv3 no LDAP or Kerberos.
Recommended naming: <SID>-data-backup, where <SID> is the SAP system Id.
No initial data protection recommended.

5.	SAP HANA log backup volume
This is an optional volume created only for the first HANA node.
Supported protocols: NFSv4.1 or NFSv3 no LDAP or Kerberos.
Recommended naming: <SID>-log-backup, where <SID> is the SAP system Id.
No initial data protection recommended.

The following examples refer to the online documentation How-to section. 


## Prepare your environment