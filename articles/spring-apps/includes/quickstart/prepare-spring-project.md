---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/09/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [prepare-spring-project](../../includes/quickstart/prepare-spring-project.md)]

-->

Use the following steps to prepare the project:

1. Use the following command to clone the [Spring Boot sample project for Azure](https://github.com/spring-guides/gs-spring-boot-for-azure.git) from GitHub.

   ```azurecli-interactive
   git clone https://github.com/spring-guides/gs-spring-boot-for-azure.git
   ```

1. Use the following command to move to the project folder:

   ```azurecli-interactive
   cd gs-spring-boot-for-azure/complete
   ```

1. Use the following [Maven](https://maven.apache.org/what-is-maven.html) command to build the project:

   ```azurecli-interactive
   ./mvnw clean package
   ```

1. Run the sample project locally by using the following command:

   ```azurecli-interactive
   ./mvnw spring-boot:run
   ```
