---
title: Quickstart API-driven inbound provisioning with cURL
description: Learn how to get started with API-driven inbound provisioning using cURL.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: how-to
ms.date: 07/07/2023
ms.author: jfields
ms.reviewer: cmmdesai
---

# Quickstart API-driven inbound provisioning with cURL (Public preview)

## Introduction
[cURL](https://curl.se/) is a popular, free, open-source, command-line tool used by API developers, and it is [available by default on Windows 10/11](https://curl.se/windows/microsoft.html). This tutorial describes how you can quickly test [API-driven inbound provisioning](inbound-provisioning-api-concepts.md) with cURL. 

## Pre-requisites

* You have configured [API-driven inbound provisioning app](inbound-provisioning-api-configure-app.md). 
* You have [configured a service principal and it has access](inbound-provisioning-api-grant-access.md) to the inbound provisioning API.

## Upload user data to the inbound provisioning API using cURL

1. Retrieve the **client_id** and **client_secret** of the service principal that has access to the inbound provisioning API. 
1. Use OAuth **client_credentials** grant flow to get an access token. Replace the variables `[yourClientId]`, `[yourClientSecret]` and `[yourTenantId]` with values applicable to your setup and run the following cURL command. Copy the access token value generated 
     ```
     curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "client_id=[yourClientId]&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=[yourClientSecret]&grant_type=client_credentials" "https://login.microsoftonline.com/[yourTenantId]/oauth2/v2.0/token"
     ```
1. Copy the bulk request payload from the example [Bulk upload using SCIM core user and enterprise user schema](/graph/api/synchronization-synchronizationjob-post-bulkupload#example-1-bulk-upload-using-scim-core-user-and-enterprise-user-schema) and save the contents in a file called scim-bulk-upload-users.json.
1. Replace the variable `[InboundProvisioningAPIEndpoint]` with the provisioning API endpoint associated with your provisioning app. Use the `[AccessToken]` value from the previous step and run the following curl command to upload the bulk request to the provisioning API endpoint. 
     ```
     curl -v "[InboundProvisioningAPIEndpoint]" -d @scim-bulk-upload-users.json -H "Authorization: Bearer [AccessToken]" -H "Content-Type: application/scim+json"
     ```
1. Upon successful upload, you will receive HTTP 202 Accepted response code. 
1. The provisioning service starts processing the bulk request payload immediately and you can see the provisioning details by accessing the provisioning logs of the inbound provisioning app. 

## Verify processing of the bulk request payload

1. Log in to [Microsoft Entra portal](https://entra.microsoft.com) with *global administrator* or *application administrator* login credentials.
1. Browse to **Azure Active Directory -> Applications -> Enterprise applications**.
1. Under all applications, use the search filter text box to find and open your API-driven provisioning application.
1. Open the Provisioning blade. The landing page displays the status of the last run.
1. Click on **View provisioning logs** to open the provisioning logs blade. Alternatively, you can click on the menu option **Monitor -> Provisioning logs**.

      [![Screenshot of provisioning logs in menu.](media/inbound-provisioning-api-curl-tutorial/access-provisioning-logs.png)](media/inbound-provisioning-api-curl-tutorial/access-provisioning-logs.png#lightbox)

1. Click on any record in the provisioning logs to view additional processing details.
1. The provisioning log details screen displays all the steps executed for a specific user. 
      [![Screenshot of provisioning logs details.](media/inbound-provisioning-api-curl-tutorial/provisioning-log-details.png)](media/inbound-provisioning-api-curl-tutorial/provisioning-log-details.png#lightbox)
      * Under the **Import from API** step, see details of user data extracted from the bulk request.
      * The **Match user** step shows details of any user match based on the matching identifier. If a user match happens, then the provisioning service performs an update operation. If there is no user match, then the provisioning service performs a create operation.
      * The **Determine if User is in scope** step shows details of scoping filter evaluation. By default, all users are processed. If you have set a scoping filter (example, process only users belonging to the Sales department), the evaluation details of the scoping filter displays in this step.
      * The **Provision User** step calls out the final processing step and changes applied to the user account.
      * Use the **Modified properties** tab to view attribute updates.

## Next steps
- [Troubleshoot issues with the inbound provisioning API](inbound-provisioning-api-issues.md)
- [API-driven inbound provisioning concepts](inbound-provisioning-api-concepts.md)
- [Frequently asked questions about API-driven inbound provisioning](inbound-provisioning-api-faqs.md)
