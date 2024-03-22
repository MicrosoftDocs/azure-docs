---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 01/10/2024
---

<!--
For clarity of structure, a separate markdown file is used to describe how to prepare project locally.

[!INCLUDE [prepare-spring-project](includes/quickstart-deploy-microservice-apps/prepare-spring-project.md)]

-->

Use the following steps to prepare the sample locally:

1. Clone the sample project by using the following command:

   ```bash
   git clone https://github.com/Azure-Samples/spring-petclinic-microservices.git
   ```

1. Navigate to the project root directory and then use the following command to run the sample project locally:

   ```bash
   bash ./scripts/run_all_without_infra.sh
   ```

1. After the script completes successfully, go to `http://localhost:8080` in your browser to access the PetClinic application.
