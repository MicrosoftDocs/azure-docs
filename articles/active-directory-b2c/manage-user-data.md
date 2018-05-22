---
title: Manage user data in Azure AD B2C | Microsoft Docs
description: Learn how to delete or export user data in Azure AD B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory-b2c
ms.workload: identity
ms.topic: article
ms.date: 05/06/2018
ms.author: davidmu

---
# Manage user data in Azure AD B2C

 This article provides information about how you can manage the user data in Azure Active Directory (AD) B2C using the operations provided by the [Azure Active Directory Graph API](https://msdn.microsoft.com/en-us/library/azure/ad/graph/api/api-catalog). Managing user data includes the ability to delete data or export data from audit logs.

[!INCLUDE [gdpr-intro-sentence.md](../../includes/gdpr-intro-sentence.md)]

## Delete user data

User data is stored in the Azure AD B2C directory and in the audit logs. All user audit data is retained for 30 days data retention in Azure AD B2C. If you want to delete user data within that 30 days, you can use the [Delete a user](https://msdn.microsoft.com/library/azure/ad/graph/api/users-operations#DeleteUser) operation. A DELETE operation is required for each of the Azure AD B2C tenants where data might reside. 

Every user in Azure AD B2C is assigned an object ID. The object ID provides an unambiguous identifier for you to use to delete user data in Azure AD B2C.  Depending on your architecture, the object ID may be a useful correlation identifier across other services such as financial, marketing, and customer relationship management databases.  

The most accurate way to get the object ID for a user is to obtain it as part of an authentication journey with Azure AD B2C.  If a valid request for data is received from a user using other methods, an offline process, such as a search by a customer service support agent, may be necessary to find the user and note the associated object ID. 

The following example shows a possible data deletion flow:

1. The user signs in and selects **Delete my data**.
2. The application offers an option to delete the data within an administration section of the application.
3. The application forces an authentication to Azure AD B2C. Azure AD B2C provides a token with the object ID of the user back to the application. 
4. The token is received by the application and the object ID is used to delete the user data through a call to Azure AD Graph API. Azure AD Graph API deletes the user data and returns a status code of 200 OK.
5. The application orchestrates deletion of user data in other organizational systems as needed using the object ID or other identifiers.
6. The application confirms the deletion of data and provides next steps to the user.

## Export customer data

The process to export customer data from Azure AD B2C is similar to the deletion process.

Azure AD B2C user data is limited to:

- **Data stored in the Azure Active Directory** - Data may be retrieved in an Azure AD B2C authentication user journey using the object ID or any sign-in name such as email or username.  
- **User-specific Audit events report** - Data is indexed using the object ID.

In the following example of an export data flow, steps described as being performed by the application can also be performed by a backend process or by a user with an administrator role in the Directory:

1. The user signs in to the application. Azure AD B2C enforces authentication with multifactor authorization if needed.
2. The application uses the user credentials to call an Azure AD Graph API operation to retrieve user attributes. The Azure AD Graph API provides the attribute data in JSON format. Depending on the schema, the id token contents may be set to include all personal data about a user.
3. The application retrieves end-user audit activity. Azure AD Graph API provides the event data to the application.
4. the application aggregates the data and makes it available to the user.

## Next steps

- Learn how to manage how users can access your application in [Manage user access](manage-user-access.md)




