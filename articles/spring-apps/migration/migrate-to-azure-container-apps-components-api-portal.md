---
title: Migrate API Portal with Azure Spring Apps Enterprise Plan to Azure API Management
description: Describes how to migrate API Portal to Azure API Management.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate API Portal with Azure Spring Apps Enterprise plan to Azure API Management

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article describes how to migrate API Portal to Azure API Management.

Azure API Management provides a centralized interface for viewing API definitions and testing specific API routes directly from the browser. It also supports single sign-on (SSO) for improved security and seamless access. Migrating from API Portal with Azure Spring Apps to Azure API Management enhances scalability, security, and integration with other Azure services.

## Prerequisites

- An existing Azure Spring Apps Enterprise plan instance with API Portal enabled.
- An existing Azure container app. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).

## Create an API Management instance

Use the following steps to create an API Management instance:

1. In the Azure portal, search for **API Management** in the search bar.
1. Select **API Management services** from the results and then select **Create**.
1. Provide the following required information:

   - **Subscription**: Select the Azure subscription for your service.
   - **Resource Group**: Either select an existing resource group or select **Create new** to create a new one.
   - **Region**: Choose the location or region for your API Management instance.
   - **Resource Name**: Provide a globally unique name for the API Management instance.
   - **Organization Name**: Specify the name of your organization.
   - **Administrator Email**: Provide an email address that is used for notifications related to the API Management instance.

1. Choose the pricing tier based on your use case. You can always upgrade or change the pricing tier later.
1. Configure optional settings like monitoring and virtual network settings.
1. Select **Review + create** to review the settings and validate the configuration.
1. After validation is complete, select **Create**. Deployment can take 30 to 40 minutes.
1. After the deployment is complete, navigate to the **API Management service** page to view the newly created service.

## Import exposed APIs in API Management

There are two options to import APIs in API Management: manually adding APIs or importing an API specification file.

### Manually add APIs

Use the following steps to manually add APIs:

1. Navigate to the API Management instance in the Azure portal. Under the **APIs** section, select **Add API**.

1. On the **Define a new API** pane, select the **HTTP** option to manually define an HTTP API.

1. Provide the following **API Basics** values, and then select **Create** to save:

   - **Display Name**: Provide a name for your API.
   - **Name**: Enter a unique identifier for the API.
   - **Web Service URL**: Specify the base URL of your backend API of your Container Apps.
   - **API URL Suffix**: Define the suffix for this API - for example, **/api/customers-service**.

1. To create new API endpoints, select **Add Operation**, then use the following steps:

   1. Provide the general information. Input **Display name** and **Name**.
   1. Provide the details for the operation, such as the **HTTP verb** - `GET`, `POST`, and so on - **URL**, **Query Parameters**, **Request**, and **Response**.
   1. After you add all operations, save your API.

1. Select the names of the APIs added. You can see all operations added in the **Design** tab.

### Import an API specification file

If you have an OpenAPI specification - a Swagger definition - of your APIs, you can directly import to API Management by using the following steps:

1. Navigate to the API Management instance in the Azure portal.

1. Open the **APIs** section under **APIs**.

1. Select **Add API**.

1. For **Create from definition**, choose the **OpenAPI** option, which creates a standard, language-agnostic interface to REST APIs.

1. Use the following steps to create an API from an OpenAPI specification:

   1. If you have a local API spec file, select **Select a file** to upload the file. Alternatively, provide a publicly accessible **URL** to the OpenAPI specification.
   1. You can further refine the API settings by providing values for **Display Name**, **Name**, and **API URL suffix** for the APIs.
   1. To save the configurations, select **Create**.

1. Select the name of APIs added. You can see all the operations added on the **Design** tab.

## Try out APIs in API Management

Azure API Management provides a built-in **Test Console** within the Azure portal, making it easy to interact with your APIs without needing external tools. Use the following steps to test your APIs:

1. Navigate to the API Management instance in the Azure portal.

1. Under the **APIs** section, select the API you want to test from the list.

1. Choose an operation. Inside the API's overview page, you can see a list of available operations (endpoints). Select the operation you want to test.

1. Select the **Test** tab to open it within the Azure portal.

1. Configure request parameters. Enter the necessary parameters for the request such as **Path Parameters**, **Query Parameters**, **Headers**, or **Body**, depending on the API method. If an API requires an `Authorization Token`, make sure to include it in the header.

1. Send the request. After you provide the request details, select **Send**. The response from the API is shown directly in the Azure portal, including the **Response Code**, **Response Body**, and **Headers**.

1. Inspect the response. Review the response data, status codes, and any error messages that might indicate issues with the API or request.

## Migrate single sign-on to API Management

If you enable single sign-on (SSO) in  API Portal, and want to authenticate requests to API Management as well, use the following steps to configure the identity in API Management:

1. In the Azure portal, go to your API Management instance.

1. Navigate to **Developer portal** > **identities**.

1. Select **Add** and then select **Azure Active Directory**.

1. Fill in the required fields:

   - **Client ID**: The application or client ID of your registered Microsoft Entra ID application.
   - **Client Secret**: The secret of the Microsoft Entra ID application.
   - **Signin tenant**: The domain name of your Microsoft Entra ID tenant, such as `yourcompany.onmicrosoft.com`
   - **Redirect URL**: Typically `https://{your-apim-instance}.developer.azure-api.net/signin`.

1. Select **Add** to save the identity provider.

You need to add the redirect URL to the list of allowed redirect URLs of your Microsoft Entra ID client app before saving the new added identity provider.

For more configurations for API Management, see the [API Management documentation](../../api-management/index.yml).
