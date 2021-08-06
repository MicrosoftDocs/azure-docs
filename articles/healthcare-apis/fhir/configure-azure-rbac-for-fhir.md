---
title: Configure Azure RBAC for FHIR service - Azure Healthcare APIs
description: This article describes how to configure Azure RBAC for FHIR.
author: ginalee-dotcom
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 08/03/2021
ms.author: zxue
---

# Configure Azure RBAC for the FHIR service

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to use [Azure role-based access control (Azure RBAC)](https://docs.microsoft.com/azure/role-based-access-control/) to assign access to the Healthcare APIs data plane. Azure RBAC is the preferred methods for assigning data plane access when data plane users are managed in the Azure Active Directory tenant associated with your Azure subscription. 

## Assign roles

To grant users, service principals, or groups access to the FHIR data plane, select the FHIR service from the Azure portal. Select **Access control (IAM)**, and then select the **Role assignments** tab. Select **+Add**, and then select **Add role assignment**.
 
If the role assignment option is grayed out, ask your Azure subscription administrator to grant you with the permissions to the subscription or the resource group, for example, “User Access Administrator”. For more information about the Azure built-in roles, see [Azure built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

[ ![Access control role assignment.](media/rbac/role-assignment.png) ](media/rbac/role-assignment.png#lightbox)

In the Role selection, search for one of the built-in roles for the FHIR data plane, for example, “FHIR Data Contributor”. You can choose other roles below.

* **FHIR Data Reader**: Can read (and search) FHIR data.
* **FHIR Data Writer**: Can read, write, and soft delete FHIR data.
* **FHIR Data Exporter**: Can read and export ($export operator) data.
* **FHIR Data Contributor**: Can perform all data plane operations.
* **FHIR Data Converter**: Can use the converter to perform data conversion

In the **Select** section, type the client application registration name. If the name is found, the application name is listed. Select the application name, and then select **Save**. 

If the client application is not found, check your application registration, to ensure that the name is correct. Ensure that the client application is created in the same tenant where the FHIR service is deployed in.


[ ![Select role assignment.](media/rbac/select-role-assignment.png) ](media/rbac/select-role-assignment.png#lightbox)

You can verify the role assignment by selecting the **Role assignments** tab from the **Access control (IAM)** menu option.
 

> [!NOTE]
> The role assignment may take a few minutes to propagate in the system. If you can't access the FHIR service in your application or other testing tools, you may wait for a few minutes. Also, check that you’ve granted the user_impersonation permissions to the Azure Healthcare APIs in your application registration.

## Next steps

In this article, you've learned how to assign Azure roles for the FHIR data plane. To learn how to access the FHIR service using Postman, see

>[!div class="nextstepaction"]
>[Access FHIR service with Postman](using-postman.md)




