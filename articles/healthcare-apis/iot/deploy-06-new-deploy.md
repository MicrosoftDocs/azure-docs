---
title: Manually creating a deployment of the MedTech service using the Azure portal - Azure Health Data Services
description: In this article, you'll learn how to manually create a deployment of the MedTech service in the Azure portal.
author: mcevoy-building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 08/22/2022
ms.author: v-smcevoy
---

# Create your MedTech service

If you are satisfied with everything you've configured, do the following:

1. Select the **Create** button to begin the deployment of your MedTech service.

2. The deployment status of your MedTech service will be displayed. Be patient because the deployment may take several minutes. You will see a message saying that your Deployment is in progress.

3. When Azure has finished, you will see a message that tells you "Your Deployment is complete".

You will also receive the following information:

- Deployment name
- Subscription
- Resource group
- Deployment details

Your screen should look something like this:

   :::image type="content" source="media\iot-deploy-manual-in-portal\created-medtech-service.png" alt-text="Screenshot of the MedTech service deployment completion." lightbox="media\iot-deploy-manual-in-portal\created-medtech-service.png":::

## Post-deployment: Azure role-based access control using system-assigned managed identity

You are not quite finished deploying MedTech service. There are two post-deployment steps you must perform or the MedTech service won't be able to receive data from the event hub or send it to FHIR service. These two additional steps are needed because MedTech service uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for extra security and control of your MedTech service assets.

## Next steps

In this article, you learned how to manually deploy the MedTech service in Azure. After you deploy, you must grant MedTech service access to the device message event hub and also the FHIR service. To learn more about granting access, see

>[!div class="nextstepaction"]
>[Post-Deployment: Granting the MedTech service access to the device message event hub and FHIR service](deploy-07-new-post-deploy.md).

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
