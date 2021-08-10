---
title: Configure Azure RBAC for the DICOM service - Azure Healthcare APIs
description: This article describes how to configure Azure RBAC for the DICOM service
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to 
ms.date: 07/13/2020
ms.author: aersoy
---
# Configure Azure RBAC for the DICOM service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. 

In this article, you will learn how to use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/index.yml) to assign access to the DICOM service. 

## Assign roles

To grant users, service principals, or groups access to the DICOM data plane, select the **Access control (IAM)** blade. Select the**Role assignments** tab, and select **+ Add**.

[ ![dicom access control.](media/dicom-access-control.png) ](media/dicom-access-control.png#lightbox)


In the **Role** selection, search for one of the built-in roles for the DICOM data plane:

[ ![Add RBAC role assignment.](media/rbac-add-role-assignment.png) ](media/rbac-add-role-assignment.png#lightbox)

You can choose between:

* DICOM Data Owner:  Full access to DICOM data.
* DICOM Data Reader: Read and search DICOM data.

If these roles are not sufficient for your need, you can use PowerShell to create custom roles.  For information about creating custom roles, see [Create a custom role using Azure PowerShell](../../role-based-access-control/tutorial-custom-role-powershell.md).

In the **Select** box, search for a user, service principal, or group that you want to assign the role to.

## Caching behavior

The DICOM service will cache decisions for up to five minutes. If you grant a user access to the DICOM service by adding them to the list of allowed object IDs, or you remove them from the list, you should expect it to take up to five minutes for changes in permissions to propagate.

## Next steps

In this article, you learned how to assign Azure roles for the DICOM service data plane. 
 
>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)