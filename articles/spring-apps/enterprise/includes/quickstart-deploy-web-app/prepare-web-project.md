---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 08/11/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to prepare the project.

[!INCLUDE [prepare-project-on-azure-portal](../../includes/quickstart-deploy-web-app/prepare-web-project.md)]

-->

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/ASA-Samples-Web-Application.git
   ```

1. Use the following command to build the sample project with Maven:

   ```bash
   cd ASA-Samples-Web-Application
   ./mvnw clean package
   ```

1. Use the following command to run the sample application:

   ```bash
   java -jar web/target/simple-todo-web-0.0.2-SNAPSHOT.jar
   ```

1. Go to `http://localhost:8080` in your browser to access the application.

