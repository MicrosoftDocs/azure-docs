---
title: Analyze Microsoft Entra sign-in logs with the Microsoft Graph API 
description: Learn how to access the sign-in log and analyze a single sign-in attempt using the Microsoft Graph API.
services: active-directory
ms.service: active-directory
ms.subservice: report-monitor
ms.topic: quickstart
ms.date: 08/25/2023
ms.author: sarahlipsey
author: shlipsey3
manager: amycolannino
ms.reviewer: besiler

#Customer intent: As an IT admin, you need to how to use the Graph API to access the log files so that you can fix issues.
---
# Quickstart: Access Microsoft Entra logs with the Microsoft Graph API 

With the information in the Microsoft Entra sign-in logs, you can figure out what happened if a sign-in of a user failed. This quickstart shows you how to access the sign-in log using the Microsoft Graph API.


## Prerequisites

To complete the scenario in this quickstart, you need:

- **Access to a Microsoft Entra tenant**: If you don't have access to a Microsoft Entra tenant, see [Create your Azure free account today](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- **A test account called Isabella Simonsen**: If you don't know how to create a test account, see [Add cloud-based users](../fundamentals/add-users.md#add-a-new-user).
- **Access to the Microsoft Graph API**: If you haven't configured access yet, see [How to configure the prerequisites for the reporting API](howto-configure-prerequisites-for-reporting-api.md).


## Perform a failed sign-in

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

The goal of this step is to create a record of a failed sign-in in the Microsoft Entra sign-in log.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as Isabella Simonsen using an incorrect password.

2. Wait for 5 minutes to ensure that you can find a record of the sign-in in the sign-in log.


## Find the failed sign-in

This section provides the steps to locate the failed sign-in attempt using the Microsoft Graph API.

 ![Microsoft Graph Explorer query](./media/quickstart-access-log-with-graph-api/graph-explorer-query.png)   

1. Navigate to [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer).

2. Follow the prompts to authenticate into your tenant.

    ![Microsoft Graph Explorer authentication](./media/quickstart-access-log-with-graph-api/graph-explorer-authentication.png)   

3. In the **HTTP verb drop-down list**, select **GET**.

4. In the **API version drop-down list**, select **beta**.

5. In the **Request query address bar**, type `https://graph.microsoft.com/beta/auditLogs/signIns?$top=100&$filter=userDisplayName eq 'Isabella Simonsen'`
 
6. Select **Run query**.

Review the outcome of your query.

 ![Microsoft Graph Explorer response preview](./media/quickstart-access-log-with-graph-api/response-preview.png)   


## Clean up resources

When no longer needed, delete the test user. If you don't know how to delete a Microsoft Entra user, see [Delete users from Microsoft Entra ID](../fundamentals/add-users.md#delete-a-user).

## Next steps

> [!div class="nextstepaction"]
> [Integrate Microsoft Entra activity logs with Azure Monitor logs](./howto-integrate-activity-logs-with-azure-monitor-logs.md)
