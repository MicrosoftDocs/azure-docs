---
title: Troubleshoot Azure NetApp Files using diagnose and solve problems tool 
description: Describes how to use the Azure diagnose and solve problems tool to troubleshoot issues of Azure NetApp Files.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 10/15/2023
ms.author: anfdocs
---

# Troubleshoot Azure NetApp Files using diagnose and solve problems tool 

You can use Azure **diagnose and solve problems** tool to troubleshoot issues of Azure NetApp Files. 

## Steps

1. From the Azure portal, select **diagnose and solve problems** in the navigation pane. 

2. Choose a problem type for the issue you are experiencing, for example, **Capacity Pools**.   
    You can select the problem type by clicking the corresponding tile on the diagnose and solve problems page or using the search bar above the tiles. 

    The following screenshot shows an example of issue types that you can troubleshoot for Azure NetApp Files: 

    :::image type="content" source="../media/azure-netapp-files/troubleshoot-issue-types.png" alt-text="Screenshot that shows an example of issue types in diagnose and solve problems page." lightbox="../media/azure-netapp-files/troubleshoot-issue-types.png":::

3. After specifying the problem type, select an option (problem subtype) from the pull-down menu to describe the specific problem you are experiencing. Then follow the on-screen directions to troubleshoot the problem. 

    :::image type="content" source="../media/azure-netapp-files/troubleshoot-diagnose-pull-down.png" alt-text="Screenshot that shows the pull-down menu for problem subtype selection." lightbox="../media/azure-netapp-files/troubleshoot-diagnose-pull-down.png":::

    This page presents general guidelines and relevant resources for the problem subtype you select. In some situations, you might be prompted to fill out a questionnaire to trigger diagnostics. If issues are identified, the tool presents a diagnosis and possible solutions.  

    :::image type="content" source="../media/azure-netapp-files/troubleshoot-problem-subtype.png" alt-text="Screenshot that shows the capacity pool troubleshoot page." lightbox="../media/azure-netapp-files/troubleshoot-problem-subtype.png":::

For more information about using this tool, see [Diagnostics and solve tool - Azure App Service](../app-service/overview-diagnostics.md).  

## Next steps

* [Troubleshoot capacity pool errors](troubleshoot-capacity-pools.md)
* [Troubleshoot volume errors](troubleshoot-volumes.md)
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
* [Troubleshoot snapshot policy errors](troubleshoot-snapshot-policies.md)
* [Troubleshoot cross-region replication errors](troubleshoot-cross-region-replication.md)
* [Troubleshoot Resource Provider errors](azure-netapp-files-troubleshoot-resource-provider-errors.md)
* [Troubleshoot user access on LDAP volumes](troubleshoot-user-access-ldap.md)
* [Troubleshoot file locks](troubleshoot-file-locks.md)