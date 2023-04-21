---
title: Update session hosts using Microsoft Configuration Manager to automatically deploy software updates to Azure Virtual Desktop session hosts - Azure
description: How to configure Microsoft Configuration Manager to deploy software updates to Windows 10 Enterprise multi-session on Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 07/05/2022
ms.author: daknappe
ms.reviewer: v-cawood; clemr
manager: femila
---
# Use Microsoft Configuration Manager to automatically deploy software updates to Azure Virtual Desktop session hosts

Azure Virtual Desktop session hosts running Windows 10 Enterprise multi-session and Windows 11 Enterprise multi-session can be grouped together in Microsoft Configuration Manager to automatically apply updates. A collection is created based on a query which you can then use as the target collection for a servicing plan.

You can update Windows 10 Enterprise multi-session and Windows 11 Enterprise multi-session with the corresponding Windows client updates. For example, you can update Windows 10 Enterprise multi-session, version 21H2 by installing the client updates for Windows 10, version 21H2.

## Prerequisites

To create this query-based collection, you'll need to do the following:

   - Make sure you've installed the Microsoft Configuration Manager Agent on your session host virtual machines (VMs) and they're assigned to a site in Configuration Manager.
   - Make sure your version of Microsoft Configuration Manager is at least on branch level 1910 for Windows 10, or 2107 for Windows 11.

## Create a query-based collection

You can use a query statement based on the specific operating system SKU to identify which of your devices managed by Configuration Manager are running Windows 10 Enterprise multi-session and Windows 11 Enterprise multi-session operating systems.

> [!TIP]
> The operating system SKU for Windows 10 Enterprise multi-session and Windows 11 Enterprise multi-session is **175**. You can use PowerShell to find the operating system SKU by running the following command:
>
> ```powershell
> Get-WmiObject -Class Win32_OperatingSystem | FT Caption,OperatingSystemSKU
> ```

To create the collection:

1. In the Configuration Manager console, select **Assets and Compliance**.
2. Go to **Overview** > **Device Collections** and right-click **Device collections** and select **Create Device Collection** from the drop-down menu.
3. In the **General** tab of the menu that opens, enter a name that describes your collection in the **Name** field. In the **Comment** field, you can give additional information describing what the collection is. In **Limiting Collection**, define which machines you're including in the collection query.
4. In the **Membership Rules** tab, add a rule for your query by selecting **Add Rule**, then selecting **Query Rule**.
5. In **Query Rule Properties**, enter a name for your rule, then define the parameters of the rule by selecting **Edit Query Statement**.
6. Select **Show Query Statement**.
7. In the statement, enter the following string:

    ```WQL
    select
    SMS_R_SYSTEM.ResourceID,SMS_R_SYSTEM.ResourceType,SMS_R_SYSTEM.Name,SMS_R_SYSTEM.SMSUniqueIdentifier,SMS_R_SYSTEM.ResourceDomainORWorkgroup,SMS_R_SYSTEM.Client
    from SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM on
    SMS_G_System_OPERATING_SYSTEM.ResourceId = SMS_R_System.ResourceId where
    SMS_G_System_OPERATING_SYSTEM.OperatingSystemSKU = 175
    ```

8. Select **OK** to create the collection.
9. To check if you successfully created the collection, go to **Assets and Compliance** > **Overview** > **Device Collections**.

## Deploy software updates

You can use an automatic deployment rule (ADR) in Microsoft Configuration Manager to automatically approve and deploy software updates. You specify the collection you created above as the target collection for deployment to deploy these updates to your session host VMs.

For more information about deploying software updates with Microsoft Configuration Manager, see [Deploy software updates](/mem/configmgr/sum/deploy-use/deploy-software-updates). For the steps to create an ADR, see [Automatically deploy software updates](/mem/configmgr/sum/deploy-use/automatically-deploy-software-updates).
