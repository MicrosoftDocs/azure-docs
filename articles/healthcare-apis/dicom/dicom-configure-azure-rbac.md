---
title: Configure Azure RBAC for the DICOM service - Azure Health Data Services
description: This article describes how to configure Azure RBAC for the DICOM service
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to 
ms.date: 10/09/2023
ms.author: mmitrik
---
# Configure Azure RBAC for the DICOM service

In this article, you'll learn how to use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/index.yml) to assign access to the DICOM&reg; service. 

## Assign roles

To grant users, service principals, or groups access to the DICOM data plane, select the **Access control (IAM)** blade. Select the**Role assignments** tab, and select **+ Add**.

[ ![Screenshot of DICOM access control.](media/dicom-access-control.png) ](media/dicom-access-control.png#lightbox)


In the **Role** selection, search for one of the built-in roles for the DICOM data plane:

[ ![Screenshot of add RBAC role assignment.](media/rbac-add-role-assignment.png) ](media/rbac-add-role-assignment.png#lightbox)

You can choose between:

* DICOM Data Owner:  Full access to DICOM data.
* DICOM Data Reader: Read and search DICOM data.

If these roles aren't sufficient for your need, you can use PowerShell to create custom roles.  For information about creating custom roles, see [Create a custom role using Azure PowerShell](../../role-based-access-control/tutorial-custom-role-powershell.md).

In the **Select** box, search for a user, service principal, or group that you want to assign the role to.

## Caching behavior

The DICOM service will cache decisions for up to five minutes. If you grant a user access to the DICOM service by adding them to the list of allowed object IDs, or you remove them from the list, you should expect it to take up to five minutes for changes in permissions to propagate.

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
