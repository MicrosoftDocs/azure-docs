---
title: Migrate storage accounts, subscriptions for your StorSimple Device Manager service | Microsoft Docs
description: Learn how to migrate subscriptions, storage accounts for your StorSimple Device Manager service8000.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/12/2017
ms.author: alkohli

---
# Migrate subscriptions, storage accounts associated with StorSimple Device Manager service

You may need to move your StorSimple service to a new enrollment or to a new subscription. These migration scenarios are either account changes or datacenter changes. Use the following table to understand which of these scenarios are supported including the detailed steps to move.

## Account changes

| Can you move …| Supported| Downtime| Azure Support process| Approach|
|-----|-----|-----|-----|-----|
| An entire subscription (includes StorSimple service and storage accounts) to another enrollment? | Yes       | No       | **Enrollment Transfer**<br>Use :<li>When you  purchase a new Azure commitment under a new agreement.</li><li>You want to migrate all accounts and subscriptions from the old enrollment to the new. This includes all the Azure services under the old subscription.</li> | **Step 1: Open an Azure Enterprise Operation Support ticket.**<li>Go to [http://aka.ms/AzureEnt](http://aka.ms/AzureEnt).</li><li> Select **Enrollment Administration** and then select **Transfer from one enrollment to a new enrollment**.<br>**Step 2: Provide the requested information**<br>Include:<li>source enrollment number</li><li> destination enrollment number</li><li>transfer effective date|
| StorSimple service from an existing account to a new enrollment?    | Yes       | No       | **Account Transfer**<br>Use:<li>When you do not want a full enrollment transfer.</li><li>You only want to move specific accounts to a new enrollment.</li>| **Step 1: Open an Azure Enterprise Operation Support ticket.**<li>Go to [http://aka.ms/AzureEnt](http://aka.ms/AzureEnt).</li><li>Select **Enrollment Administration** and then select **Transfer an EA Account to a new enrollment**.<br>**Step 2: Provide the requested information**<br>Include:<li>source enrollment number</li><li> destination enrollment number</li><li>transfer effective date|
| StorSimple service from one subscription to another subscription?      | No        | Manual process            | None|<li>Migrate data off the StorSimple device.</li><li>Perform a factory reset of the device, this deletes any local data on the device.</li><li>Register the device with the new subscription to a StorSimple Device Manager service.</li><li>Migrate the data back to the device.|
| StorSimple device from one StorSimple Device Manager service to another service in a different region?      | No        | Manual process            | None |Same as above.|

## Datacenter changes

| Can you move …| Supported|Downtime| Azure Support process| Approach|
|-----|-----|-----|-----|-----|-----|
| A StorSimple service from one Azure datacenter to another? | No | Manual process |None  |<li>Migrate data off the StorSimple device.</li><li>Perform a factory reset of the device, this deletes any local data on the device.</li><li>Register the device with the new subscription to a new StorSimple Device Manager service.</li><li>Migrate the data back to the device.|
| A storage account from one Azure datacenter to another? | No |Manual process  |None  | Same as above.|