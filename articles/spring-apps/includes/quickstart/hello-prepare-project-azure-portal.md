---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 08/11/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to prepare the project using Azure Portal.

[!INCLUDE [prepare-project-on-azure-portal](../../includes/quickstart/hello-prepare-project-azure-portal.md)]

-->

1. Use the following command to clone the [Spring Boot sample project for Azure](https://github.com/spring-guides/gs-spring-boot-for-azure.git) from GitHub.

   ```azurecli-interactive
   git clone https://github.com/spring-guides/gs-spring-boot-for-azure.git
   ```

1. Use the following command to move to the project folder:

   ```azurecli-interactive
   cd gs-spring-boot-for-azure/complete
   ```

1. Run the sample project locally by using the following command:

   ```bash
   ./mvnw spring-boot:run
   ```

1. Go to `http://localhost:8080` in your browser to access the application.
