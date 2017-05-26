---
title: Azure Site Recovery troubleshooting from Azure to Azure | Microsoft Docs
description: Troubleshooting errors when replicating Azure virtual machines
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/13/2017
ms.author: sujayt

---
# Troubleshoot common issues

This article details the common issues in Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region and how to troubleshoot them. Refer to [support matrix for replicating Azure VMs](site-recovery-support-matrix-to-azure.md) for more details about supported configurations

## Trusted Root certificates

Your 'enable replication' job could fail if the all the latest trusted root certificates are not present on the VM. Without the certificates, the authentication and authorization of Site Recovery service calls from the VM would fail. You would see the below error details in the failed 'Enable replication' Site Recovery job.

**Error details** | **How to fix it**
--- | ---
***Error code - ***151066<br></br>***Message -***  Site recovery configuration failed. <br></br>***Possible causes***<br></br>The required trusted root certificates used for authorization and authentication are not present on the machine.<br></br>***Recommendations***<br></br>1. For a VM running Windows OS, ensure the trusted root certificates are present on the machine following the guidance in the below article.<br></br>https://technet.microsoft.com/en-in/library/dn265983.aspx <br></br>2. For a VM running Linux OS, follow the guidance for trusted root certificates published by the Linux OS version distributor." | ***Windows*** <br></br>Ensure you install all the latest Windows updates on the VM. This will ensure all the trusted root certificates are present on the machine. If you are in a disconnected environment, ensure you follow the standard Windows update process in your organization to get the certificates. Due to security reasons, the calls to Site Recovery service will fail in case the required certificates are not present on the VM.


## Next steps
- [Replicate Azure virtual machines](site-recovery-replicate-azure-to-azure.md)
