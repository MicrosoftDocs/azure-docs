---
title: Export API definitions from Azure API Management to Postman
description: Learn how to export API definitions from Azure API Management to Postman for API testing, monitoring, collaboration, and development workflows.
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 06/26/2025
ms.author: danlep
ms.custom: sfi-image-blocked

#customer intent: As an API developer, I want to export APIs from Azure API Management to Postman for testing, collaboration, monitoring, and development.
---

# Export API definitions from Azure API Management to Postman

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article explains how to export API definitions from Azure API Management to Postman. Exporting APIs as Postman collections helps developers streamline API testing, documentation, monitoring, and collaborative development workflows.

You can use Postman collections generated from API Management to:

- Test API endpoints and responses
- Monitor API availability and performance
- Collaborate across development teams
- Document API behavior and examples
- Accelerate API prototyping and debugging

API Management exports API definitions to Postman collections that can be imported directly into Postman workspaces.

> [!NOTE]
> Only API definitions are exported directly from API Management to Postman. Other API Management configurations such as policies, products, named values, or subscription keys aren't exported.

## Prerequisites

Before you begin, complete the following requirements :

- Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.
- Make sure your API Management instance already contains an API that you want to export.

    > [!NOTE]
    > Currently, only HTTP APIs can be exported directly from API Management to Postman.

- Create a [Postman](https://www.postman.com) account to access Postman for Web.
- Optionally, [download and install the Postman desktop app](https://learning.postman.com/docs/getting-started/installation-and-updates/) for local development workflows.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Export an API to Postman

Follow these steps to export an API definition from Azure API Management to Postman.

1. In the Azure portal, under **APIs**, select an API.
1. Open the context menu (**...**) for the API.
1. Select **Export** > **Postman**.
1. In the **Run in** dialog, select the Postman environment where you want to open the API.

    - Select the browser-based Postman option to use Postman for Web.
    - Select the desktop option if the Postman desktop application is installed locally.

1. In Postman, select the workspace where you want to import the API definition.

    The default workspace is:

    ```text
    My Workspace
    ```

1. Select **Generate collection from this API** to automatically generate a Postman collection from the imported API definition.
1. Optionally configure advanced import settings, or accept the default configuration.
1. Select **Import**.

After the import completes:

- The API collection is added to your Postman workspace.
- Generated API documentation becomes available in Postman.
- Requests can be tested directly from the imported collection.

:::image type="content" source="media/export-api-postman/postman-collection-documentation.png" alt-text="Screenshot showing a Postman collection and generated API documentation imported from Azure API Management.":::

## Test and monitor APIs in Postman

After exporting an API definition, you can use Postman features to validate and monitor API behavior.

Common Postman capabilities include:

- Sending API requests interactively
- Testing request and response behavior
- Creating automated API test scripts
- Monitoring API uptime and latency
- Sharing collections with teams
- Managing environments and variables

> [!TIP]
> Use Postman environments to separate development, staging, and production API configurations. Environment variables simplify switching between backend endpoints and credentials.

## Develop APIs collaboratively

Postman enables collaborative API development workflows across teams.

You can :

- Share collections across workspaces
- Version API definitions
- Review request examples and responses
- Standardize testing workflows
- Reuse authentication and environment settings

API definitions updated in Postman can later be exported and re-imported into Azure API Management as API revisions.

This workflow allows teams to iterate on APIs in Postman while continuing to use Azure API Management for runtime management, governance, and security.

For more information, see [Deploy to Azure API Management from the Postman API Builder](https://learning.postman.com/v11/docs/integrations/available-integrations/azure-api-management/deploying-an-api-azure).

## Security considerations

> [!CAUTION]
> Use caution when working with API Management subscription keys, access tokens, or other sensitive credentials in Postman.

Recommended practices include:

- Store secrets securely by using [Postman Vault](https://learning.postman.com/docs/sending-requests/postman-vault/postman-vault-secrets/).
- Avoid hardcoding credentials in collections.
- Use environment variables for sensitive values.
- Restrict workspace access to authorized users only.

## Best practices

Consider the following best practices when exporting APIs to Postman:

- Use descriptive collection and request names.
- Organize APIs into dedicated Postman workspaces.
- Use environments to manage multiple deployment stages.
- Regularly update exported collections after API changes.
- Validate authentication and authorization settings before sharing collections.

## Related content

- [Deploy to Azure API Management from the Postman API Builder](https://learning.postman.com/v11/docs/integrations/available-integrations/azure-api-management/deploying-an-api-azure)
- [Import API definitions into Postman](https://learning.postman.com/docs/designing-and-developing-your-api/importing-an-api/)
- [Authorize requests in Postman](https://learning.postman.com/docs/sending-requests/authorization/)
- [Enhanced API developer experience with the Microsoft-Postman partnership](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/enhanced-api-developer-experience-with-the-microsoft-postman/ba-p/3650304)