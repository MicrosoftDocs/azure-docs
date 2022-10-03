---
title: Post-deployment granting MedTech service access to the device message event hub and FHIR service
description: In this article, you'll learn how to grant the MedTech service access to the device message event hub and the FHIR service.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 09/17/2022
ms.author: v-smcevoy
---

# Post-Deployment: Granting the MedTech service access to the device message event hub and FHIR service

There are two final post-deployment steps you must make before the MedTech service can operate fully:

1. Grant access to the device message event hub.
2. Grant access to the FHIR service.

## Granting the MedTech service access to the device message event hub and FHIR service

MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for extra security and control of your MedTech service assets. Once the MedTech service is deployed, it needs to use system-assigned managed identity to access your device message event hub and your instance of the FHIR service. Without these steps, MedTech service can't read device data from the device message event hub, and it also can't read or write to the FHIR service.

### Granting access to the device message event hub

Follow these steps to grant access to the device message event hub:

1. In the **Search** bar at the top center of the Azure portal, enter and select the name of your **Event Hubs Namespace** that was previously created for your MedTech service device messages.

2. Select the **Event Hubs** button under **Entities**.

3. Select the event hub that will be used for your MedTech service device messages. For this example, the device message event hub is named `devicedata'.

4. Select the **Access control (IAM)** button.

5. Select the **Add role assignment** button.

6. On the **Add role assignment** page, select the **View** button directly across from the **Azure Event Hubs Data Receiver** role.

   The Azure Event Hubs Data Receiver role allows the MedTech service that's being assigned this role to receive device message data from this event hub.

   > [!TIP]
   >
   > For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).

7. Select the **Select role** button.

8. Select the **Next** button.

9. In the **Add role assignment** page, select **Managed identity** next to **Assign access to** and **+ Select members** next to **Members**. 

10. When the **Select managed identities** box opens, under the **Managed identity** box, select **MedTech service,** and find your MedTech service system-assigned managed identity under the **Select** box. Once the system-assigned managed identity for your MedTech service is found, select it, and then select the **Select** button.

    > [!TIP]
    >   
    > The system-assigned managed identify name for your MedTech service is a concatenation of the workspace name and the name of your MedTech service.
    >
    > **"your workspace name"/"your MedTech service name"** or **"your workspace name"/iotconnectors/"your MedTech service name"**
    >
    > For example:
    >
    > **azuredocsdemo/mt-azuredocsdemo** or **azuredocsdemo/iotconnectors/mt-azuredocsdemo**

11. On the **Add role assignment** page, select the **Review + assign** button.

12. On the **Add role assignment** confirmation page, select the **Review + assign** button.

13. After the role assignment has been successfully added to the event hub, a notification will display on your screen with a green check mark. This notification indicates that your MedTech service can now read from your device message event hub.

    :::image type="content" source="media\iot-deploy-manual-in-portal\validate-medtech-service-managed-identity-added-to-event-hub.png" alt-text="Screenshot of the MedTech service system-assigned managed identity being successfully granted access to the event hub with a red box around the message." lightbox="media\iot-deploy-manual-in-portal\validate-medtech-service-managed-identity-added-to-event-hub.png":::

    > [!TIP]
    >
    > For more information about authorizing access to Event Hubs resources, see [Authorize access with Azure Active Directory](../../event-hubs/authorize-access-azure-active-directory.md).  

### Granting access to the FHIR service

The steps for granting your MedTech service system-assigned managed identity access to your FHIR service are the same steps that you took to grant access to your device message event hub. The only exception will be that your MedTech service system-assigned managed identity will require **FHIR Data Writer** access versus **Azure Event Hubs Data Receiver**.

The **FHIR Data Writer** role provides read and write access to your FHIR service, which your MedTech service uses to access or persist data. Because the MedTech service is deployed as a separate resource, the FHIR service will receive requests from the MedTech service. If the FHIR service doesn’t know who's making the request, it will deny the request as unauthorized.

> [!TIP]
>
> For more information about assigning roles to the FHIR service, see [Configure Azure Role-based Access Control (RBAC)](.././configure-azure-rbac.md)
>
> For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).

## Next steps

In this article, you learned how to perform post-deployment steps to make the MedTech service work properly. To learn more about other methods of deployment, see

>[!div class="nextstepaction"]
>[How to manually deploy MedTech service with Azure portal](deploy-03-new-manual.md)

>[!div class="nextstepaction"]
>[Deploy the MedTech service with a QuickStart template](deploy-02-new-button.md)

To learn about choosing a deployment method for the MedTech service, see

>[!div class="nextstepaction"]
>[Choosing a method of deployment for MedTech service in Azure](deploy-iot-connector-in-azure.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
