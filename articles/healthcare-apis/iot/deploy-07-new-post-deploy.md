---
title: Post-deployment tasks needed after deploying the MedTech service using the Azure portal - Azure Health Data Services
description: In this article, you'll learn how to perform important post-deployment tasks needed after manually deploying the MedTech service in the Azure portal.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 08/22/2022
ms.author: v-smcevoy
---

# Necessary post-deployment tasks needed after a manual deployment of the MedTech service using the Azure portal

After your MedTech service is successfully deployed, select the **Go to resource** button to be taken to your MedTech service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\created-medtech-service.png" alt-text="Screenshot of the MedTech service deployment status and a red box around Go to resource button." lightbox="media\iot-deploy-manual-in-portal\created-medtech-service.png":::  

Now that your MedTech service has been deployed, we're going to walk through the steps of assigning access roles. Your MedTech service's system-assigned managed identity will require access to your device message event hub and your FHIR service.

   :::image type="content" source="media\iot-deploy-manual-in-portal\display-medtech-service-configurations.png" alt-text="Screenshot of the MedTech service main configuration page." lightbox="media\iot-deploy-manual-in-portal\display-medtech-service-configurations.png":::

## Granting the MedTech service access to the device message event hub and FHIR service

To ensure that your MedTech service works properly, it's system-assigned managed identity must be granted access via role assignments to your device message event hub and FHIR service. 

### Granting access to the device message event hub

1. In the **Search** bar at the top center of the Azure portal, enter and select the name of your **Event Hubs Namespace** that was previously created for your MedTech service device messages.

   :::image type="content" source="media\iot-deploy-manual-in-portal\search-for-event-hubs-namespace.png" alt-text="Screenshot of the Azure portal search bar with red box around the search bar and Azure Event Hubs Namespace." lightbox="media\iot-deploy-manual-in-portal\search-for-event-hubs-namespace.png":::

2. Select the **Event Hubs** button under **Entities**.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-medtech-service-event-hubs-button.png" alt-text="Screenshot of the MedTech service Azure Event Hubs Namespace with red box around the Event Hubs button." lightbox="media\iot-deploy-manual-in-portal\select-medtech-service-event-hubs-button.png":::  
   
3. Select the event hub that will be used for your MedTech service device messages. For this example, the device message event hub is named `devicedata'. 

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-for-device-messages.png" alt-text="Screenshot of the device message event hub with red box around the Access control (IAM) button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-for-device-messages.png":::

4. Select the **Access control (IAM)** button.
   
   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-access-control-iam-button.png" alt-text="Screenshot of event hub landing page and a red box around the Access control (IAM) button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-access-control-iam-button.png":::    

5. Select the **Add role assignment** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-add-role-assignment-button.png" alt-text="Screenshot of the Access control (IAM) page and a red box around the Add role assignment button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-add-role-assignment-button.png":::
 
6. On the **Add role assignment** page, select the **View** button directly across from the **Azure Event Hubs Data Receiver** role.

   :::image type="content" source="media\iot-deploy-manual-in-portal\event-hub-add-role-assignment-available-roles.png" alt-text="Screenshot of the Access control (IAM) page and a red box around the Azure Event Hubs Data Receiver text and View button." lightbox="media\iot-deploy-manual-in-portal\event-hub-add-role-assignment-available-roles.png":::

   The Azure Event Hubs Data Receiver role allows the MedTech service that's being assigned this role to receive device message data from this event hub.

   > [!TIP]
   >
   > For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).

7. Select the **Select role** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\event-hub-select-role-button.png" alt-text="Screenshot of the Azure Events Hubs Data Receiver role with a red box around the Select role button." lightbox="media\iot-deploy-manual-in-portal\event-hub-select-role-button.png":::

8. Select the **Next** button.

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hub-roles-next-button.png" alt-text="Screenshot of the Azure Events Hubs Data Receiver role with a red box around the Next button." lightbox="media\iot-deploy-manual-in-portal\select-event-hub-roles-next-button.png":::

9. In the **Add role assignment** page, select **Managed identity** next to **Assign access to** and **+ Select members** next to **Members**. 

   :::image type="content" source="media\iot-deploy-manual-in-portal\select-event-hubs-managed-identity-and-members-buttons.png" alt-text="Screenshot of the Add role assignment page with a red box around the Managed identity and + Select members buttons." lightbox="media\iot-deploy-manual-in-portal\select-event-hubs-managed-identity-and-members-buttons.png"::: 

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

    :::image type="content" source="media\iot-deploy-manual-in-portal\select-medtech-service-mi-for-event-hub-access.png" alt-text="Screenshot of the Select managed identities page with a red box around the Managed identity drop-down box, the selected managed identity and the Select button." lightbox="media\iot-deploy-manual-in-portal\select-medtech-service-mi-for-event-hub-access.png":::

11. On the **Add role assignment** page, select the **Review + assign** button.

    :::image type="content" source="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-add.png" alt-text="Screenshot of the Add role assignment page with a red box around the Review + assign button." lightbox="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-add.png":::

12. On the **Add role assignment** confirmation page, select the **Review + assign** button.

    :::image type="content" source="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-confirmation.png" alt-text="Screenshot of the Add role assignment confirmation page with a red box around the Review + assign button." lightbox="media\iot-deploy-manual-in-portal\select-review-assign-for-event-hub-managed-identity-confirmation.png":::

13. After the role assignment has been successfully added to the event hub, a notification will display on your screen with a green check mark. This notification indicates that your MedTech service can now read from your device message event hub.

    :::image type="content" source="media\iot-deploy-manual-in-portal\validate-medtech-service-managed-identity-added-to-event-hub.png" alt-text="Screenshot of the MedTech service system-assigned managed identity being successfully granted access to the event hub with a red box around the message." lightbox="media\iot-deploy-manual-in-portal\validate-medtech-service-managed-identity-added-to-event-hub.png":::

    > [!TIP]
    >
    > For more information about authorizing access to Event Hubs resources, see [Authorize access with Azure Active Directory](../../event-hubs/authorize-access-azure-active-directory.md).  

### Granting access to the FHIR service

The steps for granting your MedTech service system-assigned managed identity access to your FHIR service are the same steps that you took to grant access to your device message event hub. The only exception will be that your MedTech service system-assigned managed identity will require **FHIR Data Writer** access versus **Azure Event Hubs Data Receiver**.

The **FHIR Data Writer** role provides read and write access to your FHIR service, which your MedTech service uses to access or persist data. Because the MedTech service is deployed as a separate resource, the FHIR service will receive requests from the MedTech service. If the FHIR service doesn’t know who's making the request, it will deny the request as unauthorized.

:::image type="content" source="media\iot-deploy-manual-in-portal\select-fhir-data-writer-for-medtech-service-access-to-fhir-service.png" alt-text="Screenshot of Add role assignment page for your FHIR service and a red box around the FHIR Data Reader role and View button." lightbox="media\iot-deploy-manual-in-portal\select-fhir-data-writer-for-medtech-service-access-to-fhir-service.png":::

> [!TIP]
>
> For more information about assigning roles to the FHIR service, see [Configure Azure Role-based Access Control (RBAC)](.././configure-azure-rbac.md)
>
> For more information about application roles, see [Authentication & Authorization for Azure Health Data Services](.././authentication-authorization.md).


FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
