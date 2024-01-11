---
title: Security levels in Azure Business Continuity center
description: An overview of the levels of Security available in Azure Business Continuity center.
ms.topic: conceptual
ms.date: 11/15/2023
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# About Security levels (preview)

This article describes the levels of Security available in Azure Business Continuity center (preview).

Concerns about security issues, such as malware, ransomware, and intrusion, are increasing. These issues pose threats to both money and data. The Security level indicates how well the security settings are configured to guard against such attacks.

Azure Business Continuity center allows you to assess how secure your resources are, based on the security level.

> [!Note]
> Security level values are computed for Azure Backup only in this preview of Azure Business Continuity center. 

Azure Backup offers security features at the vault level to safeguard backup data stored within it. These security measures encompass the settings associated with the Azure Backup solution, for the vault itself, and the protected data sources contained within the vault.

Security levels for Azure Backup vaults and their protected data sources are categorized as follows: 
- **Maximum (Excellent)**: This level represents the utmost security, ensuring comprehensive protection. It is achieved when all backup data is safeguarded from accidental deletions and defends against ransomware attacks. To achieve this high level of security, the following conditions must be met:                   
    - Immutability or soft-delete vault setting must be enabled and irreversible (locked/always-on).
    - Multi-user authorization (MUA) must be enabled on the vault.
- **Adequate (Good)**: Signifies a robust security level, ensuring dependable data protection. It shields existing backups from unintended removal and enhances the potential for data recovery. To attain this level of security, one must enable either immutability with a lock or soft-delete.
- **Minimum (Fair)**: Represents a basic level of security, appropriate for standard protection requirements. Essential backup operations benefit from an extra layer of safeguarding. To attain minimal security, Multi-user Authorization (MUA) must be enabled on the vault.
- **None (Poor)**: Indicates a deficiency in security measures, rendering it less suitable for data protection. Neither advanced protective features nor solely reversible capabilities are in place. The **None** level security only offers protection primarily against accidental deletions.
- **Not available**: For resources safeguarded by solutions other than Azure Backup, the security level is labeled as **Not available**.

In the Azure Business Continuity center, you can view the security level:
 - For each vault from **Vaults** view under **Manage**.

    :::image type="content" source="./media/security-levels-concept/security-level-vault.png" alt-text="Screenshot shows how to start creating a project." lightbox="./media/security-levels-concept/security-level-vault.png":::

 - For each datasource protected by Azure Backup from **Security posture** view under **Security + Threat management**. 

    :::image type="content" source="./media/security-levels-concept/security-level-posture.png" alt-text="Screenshot shows how to start creating a project for security." lightbox="./media/security-levels-concept/security-level-posture.png":::
 
## Next steps
- [Manage vaults](manage-vault.md).
- [Review security posture](tutorial-view-protected-items-and-perform-actions.md).
