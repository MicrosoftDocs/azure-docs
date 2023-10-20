---
title: Skip deletion of out of scope users in Microsoft Entra Application Provisioning
description: Learn how to override the default behavior of deprovisioning out of scope users in Microsoft Entra ID.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: arvinh
---
# Skip deletion of user accounts that go out of scope in Microsoft Entra ID

By default, the Microsoft Entra provisioning engine soft deletes or disables users that go out of scope. However, for certain scenarios like Workday to AD User Inbound Provisioning, this behavior may not be the expected and you may want to override this default behavior.  

This article describes how to use the Microsoft Graph API and the Microsoft Graph API explorer to set the flag ***SkipOutOfScopeDeletions*** that controls the processing of accounts that go out of scope. 
* If ***SkipOutOfScopeDeletions*** is set to 0 (false), accounts that go out of scope are disabled in the target.
* If ***SkipOutOfScopeDeletions*** is set to 1 (true), accounts that go out of scope aren't disabled in the target. This flag is set at the *Provisioning App* level and can be configured using the Graph API. 

Because this configuration is widely used with the *Workday to Active Directory user provisioning* app, the following steps include screenshots of the Workday application. However, the configuration can also be used with *all other apps*, such as ServiceNow, Salesforce, and Dropbox. To successfully complete this procedure, you must have first set up app provisioning for the app. Each app has its own configuration article. For example, to configure the Workday application, see [Tutorial: Configure Workday to Microsoft Entra user provisioning](../saas-apps/workday-inbound-cloud-only-tutorial.md). SkipOutOfScopeDeletions does not work for cross-tenant synchronization.

## Step 1: Retrieve your Provisioning App Service Principal ID (Object ID)

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Application Administrator](../roles/permissions-reference.md#application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select your application and go to Properties section of your provisioning app. In this example we are using Workday.
1. Copy the GUID value in the *Object ID* field. This value is also called the **ServicePrincipalId** of your app and it's used in Graph Explorer operations.

   ![Screenshot of Workday App Service Principal ID.](./media/skip-out-of-scope-deletions/wd_export_01.png)

## Step 2: Sign into Microsoft Graph Explorer

1. Launch [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
1. Click on the "Sign-In with Microsoft" button and sign-in using Microsoft Entra Global Administrator or App Admin credentials.

    ![Screenshot of Microsoft Graph Explorer Sign-in.](./media/skip-out-of-scope-deletions/wd_export_02.png)

1. Upon successful sign-in, the user account details appear in the left-hand pane.

## Step 3: Get existing app credentials and connectivity details

In the Microsoft Graph Explorer, run the following GET query replacing [servicePrincipalId]  with the **ServicePrincipalId** extracted from the [Step 1](#step-1-retrieve-your-provisioning-app-service-principal-id-object-id).

```http
   GET https://graph.microsoft.com/beta/servicePrincipals/[servicePrincipalId]/synchronization/secrets
```

   ![Screenshot of GET job query.](./media/skip-out-of-scope-deletions/skip-03.png)

Copy the Response into a text file. It looks like the JSON text shown, with values highlighted in yellow specific to your deployment. Add the lines highlighted in green to the end and update the Workday connection password highlighted in blue. 

   ![Screenshot of GET job response.](./media/skip-out-of-scope-deletions/skip-04.png)

Here's the JSON block to add to the mapping. 

```json
{
  "key": "SkipOutOfScopeDeletions",
  "value": "True"
}
```

## Step 4: Update the secrets endpoint with the SkipOutOfScopeDeletions flag

In the Graph Explorer, run the command to update the secrets endpoint with the ***SkipOutOfScopeDeletions*** flag. 

In the URL, replace [servicePrincipalId]  with the **ServicePrincipalId** extracted from the [Step 1](#step-1-retrieve-your-provisioning-app-service-principal-id-object-id). 

```http
   PUT https://graph.microsoft.com/beta/servicePrincipals/[servicePrincipalId]/synchronization/secrets
```
Copy the updated text from Step 3 into the "Request Body". 

   ![Screenshot of PUT request.](./media/skip-out-of-scope-deletions/skip-05.png)

Click on “Run Query”. 

You should get the output as "Success – Status Code 204". If you receive an error, you may need to check that your account has Read/Write permissions for ServicePrincipalEndpoint. You can find this permission by clicking on the *Modify permissions* tab in Graph Explorer.

   ![Screenshot of PUT response.](./media/skip-out-of-scope-deletions/skip-06.png)

## Step 5: Verify that out of scope users don’t get disabled

You can test this flag results in expected behavior by updating your scoping rules to skip a specific user. In the example, we're excluding the employee with ID 21173 (who was earlier in scope) by adding a new scoping rule: 

   ![Screenshot that shows the "Add Scoping Filter" section with an example user highlighted.](./media/skip-out-of-scope-deletions/skip-07.png)

In the next provisioning cycle, the Microsoft Entra provisioning service identifies that the user 21173 has gone out of scope. If the `SkipOutOfScopeDeletions` property is enabled, then the synchronization rule for that user displays a message as shown: 

   ![Screenshot of scoping example.](./media/skip-out-of-scope-deletions/skip-08.png)
