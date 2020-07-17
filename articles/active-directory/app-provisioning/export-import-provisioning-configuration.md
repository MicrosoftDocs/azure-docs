---
title: Export provisioning configuration and roll back to a known good state for disaster recovery
description: Learn how to export your provisioning configuration and roll back to a known good state for disaster recovery.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 03/19/2020
ms.author: kenwith
---

# How-to: Export provisioning configuration and roll back to a known good state

In this article, you'll learn how to:

- Export and import your provisioning configuration from the Azure portal
- Export and import your provisioning configuration by using the Microsoft Graph API

## Export and import your provisioning configuration from the Azure portal

### Export your provisioning configuration

To export your configuration:

1. In the [Azure portal](https://portal.azure.com/), on the left navigation panel, select **Azure Active Directory**.
1. In the **Azure Active Directory** pane, select **Enterprise applications** and choose your application.
1. In the left navigation pane, select **provisioning**. From the provisioning configuration page, click on **attribute mappings**, then **show advanced options**, and finally **review your schema**. This will take you to the schema editor.
1. Click on download in the command bar at the top of the page to download your schema.

### Disaster recovery - roll back to a known good state

Exporting and saving your configuration allows you to roll back to a previous version of your configuration. We recommend exporting your provisioning configuration and saving it for later use anytime you make a change to your attribute mappings or scoping filters. All you need to do is open up the JSON file that you downloaded in the steps above, copy the entire contents of the JSON file, replace the entire contents of the JSON payload in the schema editor, and then save. If there is an active provisioning cycle, it will complete and the next cycle will use the updated schema. The next cycle will also be an initial cycle, which reevaluates every user and group based on the new configuration. Consider the following when rolling back to a previous configuration:

- Users will be evaluated again to determine if they should be in scope. If the scoping filters have changed a user is not in scope any more they will be disabled. While this is the desired behavior in most cases, there are times where you may want to prevent this and can use the [skip out of scope deletions](https://docs.microsoft.com/azure/active-directory/app-provisioning/skip-out-of-scope-deletions) functionality. 
- Changing your provisioning configuration restarts the service and triggers an [initial cycle](https://docs.microsoft.com/azure/active-directory/app-provisioning/how-provisioning-works#provisioning-cycles-initial-and-incremental).

## Export and import your provisioning configuration by using the Microsoft Graph API

You can use the Microsoft Graph API and the Microsoft Graph Explorer to export your User Provisioning attribute mappings and schema to a JSON file and import it back into Azure AD. You can also use the steps captured here to create a backup of your provisioning configuration.

### Step 1: Retrieve your Provisioning App Service Principal ID (Object ID)

1. Launch the [Azure portal](https://portal.azure.com), and navigate to the Properties section of your  provisioning application. For example, if you want to export your *Workday to AD User Provisioning application* mapping navigate to the Properties section of that app.
1. In the Properties section of your provisioning app, copy the GUID value associated with the *Object ID* field. This value is also called the **ServicePrincipalId** of your App and it will be used in Microsoft Graph Explorer operations.

   ![Workday App Service Principal ID](./media/export-import-provisioning-configuration/wd_export_01.png)

### Step 2: Sign into Microsoft Graph Explorer

1. Launch [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
1. Click on the "Sign-In with Microsoft" button and sign-in using Azure AD Global Admin or App Admin credentials.

    ![Microsoft Graph Sign-in](./media/export-import-provisioning-configuration/wd_export_02.png)

1. Upon successful sign-in, you will see the user account details in the left-hand pane.

### Step 3: Retrieve the Provisioning Job ID of the Provisioning App

In the Microsoft Graph Explorer, run the following GET query replacing [servicePrincipalId]  with the **ServicePrincipalId** extracted from the [Step 1](#step-1-retrieve-your-provisioning-app-service-principal-id-object-id).

```http
   GET https://graph.microsoft.com/beta/servicePrincipals/[servicePrincipalId]/synchronization/jobs
```

You will get a response as shown below. Copy the "id attribute" present in the response. This value is the **ProvisioningJobId** and will be used to retrieve the underlying schema metadata.

   [![Provisioning Job ID](./media/export-import-provisioning-configuration/wd_export_03.png)](./media/export-import-provisioning-configuration/wd_export_03.png#lightbox)

### Step 4: Download the Provisioning Schema

In the Microsoft Graph Explorer, run the following GET query, replacing [servicePrincipalId] and [ProvisioningJobId] with the ServicePrincipalId and the ProvisioningJobId retrieved in the previous steps.

```http
   GET https://graph.microsoft.com/beta/servicePrincipals/[servicePrincipalId]/synchronization/jobs/[ProvisioningJobId]/schema
```

Copy the JSON object from the response and save it to a file to create a backup of the schema.

### Step 5: Import the Provisioning Schema

> [!CAUTION]
> Perform this step only if you need to modify the schema for configuration that cannot be changed using the Azure portal or if you need to restore the configuration from a previously backed up file with valid and working schema.

In the Microsoft Graph Explorer, configure the following PUT query, replacing [servicePrincipalId] and [ProvisioningJobId] with the ServicePrincipalId and the ProvisioningJobId retrieved in the previous steps.

```http
    PUT https://graph.microsoft.com/beta/servicePrincipals/[servicePrincipalId]/synchronization/jobs/[ProvisioningJobId]/schema
```

In the "Request Body" tab, copy the contents of the JSON schema file.

   [![Request Body](./media/export-import-provisioning-configuration/wd_export_04.png)](./media/export-import-provisioning-configuration/wd_export_04.png#lightbox)

In the "Request Headers" tab, add the Content-Type header attribute with value “application/json”

   [![Request Headers](./media/export-import-provisioning-configuration/wd_export_05.png)](./media/export-import-provisioning-configuration/wd_export_05.png#lightbox)

Select **Run Query** to import the new schema.
