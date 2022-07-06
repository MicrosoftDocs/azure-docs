---
title: Customer Managed Key Rotation
description: Learn how to rotate customer managed keys for confidential VM. 
author: reprasa
ms.author: reprasa
ms.service: virtual machines
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: template-how-to
---

# **Customer Managed Key Rotation**

Confidential VM supports customer managed key (CMK). CMK is needed for proper functioning of a Confidential VM and associated artifacts. A CMK for Confidential VM is managed in Azure Key Vault (AKV) or managed HSM (mHSM).  All references to AKV in this document apply to managed HSM as well unless stated otherwise. To use CMK with Confidential VM, a Disk Encryption Set (DES) resource, referencing the CMK, must be supplied at the time of Confidential VM creation. Typically, a single DES is associated with multiple Confidential VMs. 
From a security best practices standpoint, it's recommended to periodically rotate a CMK. The frequency of rotation is an organizational policy decision. CMK rotation is also necessary if a CMK is compromised. 

## **Rotate the key**
Confidential VM supports CMK rotation. To rotate CMK, a new key or a key version needs to be generated in AKV. All Confidential VMs associated with the same DES need to be stopped. Once all Confidential VMs are in the stopped state, the desired new key must be selected in DES and saved. The save operation will update the key for all Confidential VM artifacts. For the DES being updated, if one or more Confidential VMs isn't in stopped state, then none of the Confidential VMs will get the new CMK.  To retry the DES, update all Confidential VMs associated with this DES must be stopped.
You can change the key that you're using for Confidential VM at any time. 

### **Azure portal**  
To change the key with Azure portal, follow the step:
1.	Navigate to Virtual Machines page and stop all the Confidential VMs associated with a single Disk Encryption Set.
2.	Ensure all Confidential VMs are in stopped state. 
3.	Navigate to DES page, click on Key under Settings
4.	Click on the Change key, select the Key Vault, Key and Version as applicable.
5.	Save your changes

## **Retry key rotation**
In rare cases, with all the Confidential VMs in stopped state, it's possible that the new CMK may not get updated. If CMK isn't updated, the DES resource will contain a reference to the old key. In this state where many Confidential VMs will have the new key, and some may have the old key. Retrying the DES update using the same new key will resolve this issue.

**Note:**
* Auto key rotation isn't currently supported for Confidential VM.
* Key rotation isn't supported for ephemeral disk. It's recommended to have separate DES for Confidential VM with an ephemeral disk. If Confidential VMs with ephemeral and non-ephemeral disks share the same DES, then Confidential VMs with ephemeral disks must be deleted prior to performing key rotation of Confidential VMs with non-ephemeral disks.
