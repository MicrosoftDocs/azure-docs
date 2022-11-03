---
title: Workflow HTTP connector
description: This article describes how to use HTTP connector in Purview workflows
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-workflows
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 09/30/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Workflows HTTP connector

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

You can use [workflows](concept-workflow.md) to automate some business processes through Microsoft Purview. HTTP connector allows Purview workflows to integrate with external applications. HTTP connectors use Representational State Transfer (REST) architecture, which allows Microsoft Purview workflows to interact directly with third party applications by using web requests. 

HTTP connector is available in all workflow templates.

>[!NOTE]
> To create or edit a workflow, you need the [workflow admin role](catalog-permissions.md) in Microsoft Purview. You can also contact the workflow admin in your collection, or reach out to your collection administrator, for permissions.

1. To add a HTTP connector, click on the **+** icon in the template where you want to add and select HTTP connector.

    :::image type="content" source="./media/how-to-use-workflow-http-connector/add-http-connector.png" alt-text="Screenshot of how to add HTTP connector.":::

1. Once you select HTTP connector, you will see the following parameters:
    1. Host - Request URL you want to call when this connector is executed.
    1. Method - Select one of the following methods. GET, PUT, PATCH, POST and DELETE. These correspond to create, read, update and delete operations.
    1. Path - Optionally you can enter request URL Path. You can use dynamic content for this parameter.
    1. Headers - Optionally, you can enter HTTP headers. HTTP headers let the client and the server pass additional information with an HTTP request or response
    1. Queries - Optionally, you can pass queries. 
    1. Body - Optionally, you can pass HTTP body while invoking the URL
    1. Authentication - HTTP connector is integrated with Purview credentials. Depending on the URL you may invoke the endpoint with None (no authentication) or you can use credentials to create a basic authentication. To learn more about credentials see the [Microsoft Purview credentials article](manage-credentials.md).

    :::image type="content" source="./media/how-to-use-workflow-http-connector/add-http-properties.png" alt-text="Screenshot of how to add HTTP connector properties.":::

1. By default, secure settings are turned on for HTTP connectors. To turn OFF secure inputs and outputs select the ellipsis icon (**...**) to go to settings.

    :::image type="content" source="./media/how-to-use-workflow-http-connector/add-http-settings.png" alt-text="Screenshot of how to add HTTP connector settings."::: 

1. You will be now presented with the settings for HTTP connector and you can turn secure inputs and outputs OFF.

    :::image type="content" source="./media/how-to-use-workflow-http-connector/add-http-secure.png" alt-text="Screenshot of how to add HTTP connector secure input and outputs."::: 

## Next steps

For more information about workflows, see these articles:

- [Workflows in Microsoft Purview](concept-workflow.md)
- [Approval workflow for business terms](how-to-workflow-business-terms-approval.md)
- [Manage workflow requests and approvals](how-to-workflow-manage-requests-approvals.md)

