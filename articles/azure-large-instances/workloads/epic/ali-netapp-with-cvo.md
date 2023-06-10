---
title: ArchitectureAzure Large Instances NETAPP storage data protection with Azure CVO   
description: Provides an overview of Epic for ALI architecture.
ms.topic: conceptual
author: jjaygbay
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Azure Large Instances NETAPP storage data protection with Azure CVO   

This article describes the end-to-end setup steps necessary to move data between BMI (BareMetal infrastructure)
NETAPP storage and Azure CVO (NETAPP Cloud volume ONTAP) enabling BMI NETAPP storage data
backup/restore/update use cases.
The intent here is to help the reader gain a better understanding of end to end solution architecture and 
all the key setup processes involved. For more detailed step by step implementation of the solution, 
NETAPP professional service/account presentative and MSFT account representative/BMI integration 
Confidential 24
support resources can be engaged if customer needs the assistance to carry out the complete integration 
and delivery tasks mentioned in the document.

End-to-End (E2E) solution architecture diagram

diagram

High level E2E key steps 
1. Setup BlueXP account (formerly NETAPP cloud manager) to support the creation of Azure 
Connector and subsequent CVO (Cloud Volume Ontap on Azure) setup. 
2. Create target CVO/storage volume and setup encryption at CVO data SVM.
3. Setup snap-Mirroring relationship between source volume of Azure BMI NETAPP storage array 
and target volume of Azure CVO followed by initial data transfer from source to target.
4. Enable Azure VM host setup with ISCSI.
 
Note: snap-mirror policy is created by cluster admin to be used for volume level snap-mirroring 
relationship.
5. Create read/writable Snap-mirrored target volumes using Flxclone technology and map to Azure 
VM host via ISCSI protocol to support various use cases (backup, testing, training/reporting).
6. Perform data update/restore between source Azure BMI NETAPP storage and target Azure CVO 
when needed.
High level E2E key steps 
1. Setup BlueXP account (formerly NETAPP cloud manager) to support the creation of Azure 
Connector and subsequent CVO (Cloud Volume Ontap on Azure) setup. 
2. Create target CVO/storage volume and setup encryption at CVO data SVM.
3. Setup snap-Mirroring relationship between source volume of Azure BMI NETAPP storage array 
and target volume of Azure CVO followed by initial data transfer from source to target.
4. Enable Azure VM host setup with ISCSI.
 
Note: snap-mirror policy is created by cluster admin to be used for volume level snap-mirroring 
relationship.
5. Create read/writable Snap-mirrored target volumes using Flxclone technology and map to Azure 
VM host via ISCSI protocol to support various use cases (backup, testing, training/reporting).
6. Perform data update/restore between source Azure BMI NETAPP storage and target Azure CVO 
when needed.



## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure for Large Instances?](../../what-is-azure-for-large-instances.md)


