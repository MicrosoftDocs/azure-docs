---
title: G Suite integration for Google Cloud Platform (GCP) Sentry configuration
description: How to integrate G Suite for Google Cloud Platform (GCP) Sentry configuration.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/29/2021
ms.author: v-ydequadros
---

# G Suite integration for Google Cloud Platform (GCP) Sentry configuration

You can configure the G Suite Domain-Wide Delegation of Authority to programmatically access a user's data without any manual authorization on the user's part.

## How to integrate G Suite for GCP Sentry configuration

1. Select **IAM & Admin**, and then select **Service Accounts**.
2. Select the service account that was created earlier: **knox-sentry-vm-service-account**.
3. Select **Show domain-wide delegation**, and then select **Enable G Suite Domain-wide Delegation**.
4. If you haven't already configured your app's OAuth consent screen, you must do so before you can enable domain-wide delegation. 

     Follow the on-screen instructions to configure the OAuth consent screen, then repeat Steps 1-3.
5. Select the ellipses (**...**), and then select **Create Key**.
6. Select **Key Type P12**.
7. Confirm that the P12 file has downloaded successfully.
8. Select **Create**, and then select **Close**.
9. To update the service account, select **Save**.
10. View the table of service accounts. A new column, **Domain-wide delegation** appears. 
11. To display the client ID, select **View Client ID**.

     Make a note of the client ID. You'll need it later, when you delegate domain-wide authority to your service account.

## How to delegate domain-wide authority to your service account

1. Select the [Admin console](https://admin.google.com/) for your G Suite domain.
2. Select **Security**, and then, from the list of controls, select **API Controls**.
3. Under **Domain-wide delegation**, select **Manage domain-wide delegation**.
4. Enter the client ID for the service account or the OAuth2 client ID for the application.
5. In the **OAuth Scope** box, enter the following list of scopes:

     - https://www.googleapis.com/auth/admin.directory.user.readonly
     - https://www.googleapis.com/auth/admin.directory.group.readonly
     - https://www.googleapis.com/auth/admin.directory.group.member.readonly
6. To authorize the service account with domain-wide access to the Google Admin SDK Directory API for all the users of your domain, select **Authorize** .


## How to delegate Admin API access to a user

You can delegate Admin API access to a user because the service account must impersonate a user to access the Admin SDK Directory API.

1. Select your G Suite domain’s [Admin console](https://admin.google.com/).
2. Create a custom role *GSuiteUserGroupReadOnlyAccess*, and then assign the following permissions:

     - Admin API Privileges
     - Organizational Units => Read
     - Users => Read
     - Groups

3. From the list of controls, select **Users**.
4. Select a user.
5. Select **Admin roles and privileges**.
6. Under **Roles**, select **GSuiteUserGroupReadOnlyAccess**.
7. Select **Sentry SSH shell**, and then:

     1. Run:

        `sudo /opt/cloudknox/sentrysoftwareservice/bin/runGCPConfigCLI.sh`
     2. Select option 2.
     3. Enter a user email associated with the **GSuiteUserGroupReadOnlyAccess** role you assigned in Step 6.
     4. From the service account, upload the p12 file to **/opt/cloudknox/config** as *gcp.p12*.

     <!---(You downloaded this p12 file in the How to integrate G Suite for GCP Sentry Configuration task.)--->

<!---## Next steps--->