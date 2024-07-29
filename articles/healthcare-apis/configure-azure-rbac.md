---
title: Configure Azure RBAC role for the FHIR service in Azure Health Data Services
description: Learn how to configure Azure RBAC for the FHIR service in Azure Health Data Services. Assign roles, manage access, and safeguard your data plane.
author: chachachachami
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 06/06/2022
ms.author: chrupa
--- 
# Configure Azure RBAC roles for Azure Health Data Services

In this article, you learn how to use [Azure role-based access control (RBAC)](../role-based-access-control/index.yml) to assign access to the Azure Health Data Services data plane. Using Azure RBAC roles is the preferred method for assigning data plane access when data plane users are managed in the Microsoft Entra tenant associated with your Azure subscription.

You can complete role assignments in the Azure portal. The FHIR&reg; service and DICOM&reg; service define application roles differently. Add or remove one or more roles to manage user access controls.

## Assign roles for the FHIR service

To grant users, service principals, or groups access to the FHIR data plane, go to the FHIR service in the Azure portal. Select **Access control (IAM)**, and then select the **Role assignments** tab. Select **+Add**, and then select **Add role assignment**.

If the role assignment option is grayed out, ask your Azure subscription administrator to grant you with the permissions to the subscription or the resource group, for example, **User Access Administrator**. For more information, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).

:::image type="content" source="media/rbac/select-role-assignment.png" alt-text="Screenshot showing role assignment selection." lightbox="media/rbac/select-role-assignment.png":::

In the **Role** selection, search for one of the built-in roles for the FHIR data plane. You can choose from these roles:

* **FHIR Data Reader**: Can read (and search) FHIR data.
* **FHIR Data Writer**: Can read, write, and soft delete FHIR data.
* **FHIR Data Exporter**: Can read and export ($export operator) data.
* **FHIR Data Contributor**: Can perform all data plane operations.
* **FHIR Data Converter**: Can use the converter to perform data conversion.
* **FHIR SMART User**: Can read and write FHIR data according to the SMART IG V1.0.0 specifications.

In the **Select** section, type the client application registration name. If the name is found, the application name is listed. Select the application name, and then select **Save**.

If the client application isn’t found, check your application registration. This is to ensure that the name is correct. Ensure that the client application is created in the same tenant where the FHIR service in Azure Health Data Services (hereby called the FHIR service) is deployed in.

:::image type="content" source="media/rbac/select-role-assignment.png" alt-text="Screenshot showing selection of role assignment." lightbox="media/rbac/select-role-assignment.png":::

You can verify the role assignment by selecting the **Role assignments** tab from the **Access control (IAM)** menu option.

## Assign roles for the DICOM service

To grant users, service principals, or groups access to the DICOM data plane, select the **Access control (IAM)** blade. Select the**Role assignments** tab, and select **+ Add**.

:::image type="content" source="media/rbac/dicom-access-control.png" alt-text="Screenshot showing DICOM access control." lightbox="media/rbac/dicom-access-control.png":::

In the **Role** selection, search for one of the built-in roles for the DICOM data plane:

:::image type="content" source="media/rbac/rbac-add-role-assignment.png" alt-text="Screenshot showing how to add an RBAC role assignment." lightbox="media/rbac/rbac-add-role-assignment.png":::

You can choose between:

* DICOM Data Owner:  Full access to DICOM data.
* DICOM Data Reader: Read and search DICOM data.

If these roles aren’t sufficient, you can use PowerShell to create custom roles. For information about creating custom roles, see [Create a custom role by using Azure PowerShell](../role-based-access-control/custom-roles-powershell.md).

In the **Select** box, search for a user, service principal, or group that you want to assign the role to.

> [!NOTE]
> If you can't access the FHIR or DICOM service in your application or other tools, you might need to wait a few more minutes for the role assignment to finish propagating in the system.

## Next steps

[Access by using Postman](./fhir/use-postman.md)

[Access by using the REST Client](./fhir/using-rest-client.md)

[Access by using cURL](./fhir/using-curl.md)

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]
