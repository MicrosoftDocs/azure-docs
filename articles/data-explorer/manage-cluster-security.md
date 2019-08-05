---
title: Secure your cluster in Azure Data Explorer
description: This article describes how to secure your cluster in Azure Data Explorer within the Azure portal.
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 07/22/2019
---

# Secure your cluster in Azure Data Explorer

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. It also integrates with [Azure Key Vault](/azure/key-vault/) to help you control and manage the disk encryption keys and secrets, and ensures all data on the VM disks are encrypted at rest while in Azure Storage. Your cluster security settings allow you to enable disk encryption on your cluster.
  
## Enable encryption at rest
  
Enabling [encryption at rest](/azure/security/fundamentals/encryption-atrest) on your cluster provides data protection for stored data (at rest). 

1. In the Azure portal, go to your Azure Data Explorer cluster resource. Under the **Settings** heading, select **Security**. 

    ![Turn on encryption at rest](media/manage-cluster-security/security-encryption-at-rest.png)

1. In the **Security** window, select **On** for the **Disk encryption** security setting. 

1. Select **Save**.

## Next steps

[Check cluster health](/azure/data-explorer/check-cluster-health)
