<properties 
   pageTitle="Manage access control records in StorSimple | Microsoft Azure"
   description="Describes how to use access control records (ACRs) to determine which hosts can connect to a volume on the StorSimple device."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/24/2016"
   ms.author="alkohli" />

# Use the StorSimple Manager service to manage access control records

## Overview

Access control records (ACRs) allow you to specify which hosts can connect to a volume on the StorSimple device. ACRs are set to a specific volume and contain the iSCSI Qualified Names (IQNs) of the hosts. When a host tries to connect to a volume, the device checks the ACR associated with that volume for the IQN name and if there is a match, then the connection is established. The access control records section on the **Configure** page displays all the access control records with the corresponding IQNs of the hosts.

This tutorial explains the following common ACR-related tasks:

- Add an access control record 
- Edit an access control record 
- Delete an access control record 

> [AZURE.IMPORTANT] 
> 
> - When assigning an ACR to a volume, take care that the volume is not concurrently accessed by more than one non-clustered host because this could corrupt the volume. 
> - When deleting an ACR from a volume, make sure that the corresponding host is not accessing the volume because the deletion could result in a read-write disruption.

## Add an access control record

You use the StorSimple Manager service **Configure** page to add ACRs. Typically, you will associate one ACR with one volume.

Perform the following steps to add an ACR.

#### To add an access control record

1. On the service landing page, select your service, double-click the service name, and then click the **Configure** tab.

2. In the tabular listing under **Access control records**, supply a **Name** for your ACR.

3. Provide the IQN name of your Windows host under **iSCSI Initiator Name**. To get the IQN of your Windows Server host, do the following:

   - Start the Microsoft iSCSI initiator on your Windows host.
   - In the **iSCSI Initiator Properties** window, on the **Configuration** tab, select and copy the string from the **Initiator Name** field.
   - Paste this string in the **iSCSI Initiator Name** field on the ACRs table in the Azure classic portal.

4. Click **Save** to save the newly created ACR. The tabular listing will be updated to reflect this addition.

## Edit an access control record

You use the **Configure** page in the Azure classic portal to edit ACRs. 

> [AZURE.NOTE] You can modify only those ACRs that are currently not in use. To edit an ACR associated with a volume that is currently in use, you must first take the volume offline.

Perform the following steps to edit an ACR.

#### To edit an access control record

1. On the service landing page, select your service, double-click the service name, and then click the **Configure** tab.

2. In the tabular listing of the access control records, hover over the ACR that you wish to modify.

3. Supply a new name and/or IQN for the ACR.

4. Click **Save** to save the modified ACR. The tabular listing will be updated to reflect this change.

## Delete an access control record

You use the **Configure** page in the Azure classic portal to delete ACRs. 

> [AZURE.NOTE] You can delete only those ACRs that are currently not in use. To delete an ACR associated with a volume that is currently in use, you must first take the volume offline.

Perform the following steps to delete an access control record.

#### To delete an access control record

1. On the service landing page, select your service, double-click the service name, and then click the **Configure** tab.

2. In the tabular listing of the access control records (ACRs), hover over the ACR that you wish to delete.

3. A delete icon (**x**) will appear in the extreme right column for the ACR that you select. Click the **x** icon to delete the ACR.

4. When prompted for confirmation, click **YES** to continue with the deletion. The tabular listing will be updated to reflect the deletion.

## Next steps

- Learn more about [managing StorSimple volumes](storsimple-manage-volumes.md).

- Learn more about [using the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).
 
