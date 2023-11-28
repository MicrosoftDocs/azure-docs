---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 10/17/2023
---

<!-- 
To reuse the Spring Apps instance creation steps in other articles, a separate markdown file is used to describe how to update your application configuration.

[!INCLUDE [update-application-configuration](update-application-configuration.md)]

-->

Use the following steps to update the YAML file to use your Microsoft Entra registered application information to establish a relationship with the RESTful API application:

1. Locate *src/main/resources/application.yml* file for the `simple-todo-api` app. Update the configuration in the `spring.cloud.azure.active-directory` section to match the following example. Be sure to replace the placeholders with the values you created previously.

   ```yaml
   spring:
     cloud:
       azure:
         active-directory:
           profile:
             tenant-id: <tenant>
           credential:
             client-id: <your-application-ID-of-ToDo>
           app-id-uri: <your-application-ID-URI-of-ToDo>
   ```

   > [!NOTE]
   > In v1.0 tokens, the configuration requires the client ID of the API, while in v2.0 tokens, you can use the client ID or the application ID URI in the request. You can configure both to properly complete the audience validation.
   > 
   > The \<tenant> values are: `common`, `organizations`, `consumers`, or `tenant id`. For more information on the account types, see [Used the wrong endpoint (personal and organization accounts)](/troubleshoot/azure/active-directory/error-code-aadsts50020-user-account-identity-provider-does-not-exist##cause-3-used-the-wrong-endpoint-personal-and-organization-accounts). For more information on converting your single-tenant app, see [Convert single-tenant app to multitenant on Microsoft Entra ID](/entra/identity-platform/howto-convert-app-to-be-multi-tenant).

1. Use the following command to rebuild the sample project:

   ```bash
   ./mvnw clean package
   ```

