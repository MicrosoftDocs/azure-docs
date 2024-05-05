---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 02/01/2024
---

<!--
For clarity of structure, a separate markdown file is used to describe how to prepare project for enterprise plan locally.

[!INCLUDE [prepare-spring-project-enterprise-plan](prepare-spring-project-enterprise-plan.md)]

-->

Use the following steps on your local machine when you want to verify the application before deploying it to the cloud:

1. Use the following command to clone the [Pet Clinic application](https://github.com/Azure-Samples/spring-petclinic-microservices.git) from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/spring-petclinic-microservices.git
   ```

1. Navigate to the project root directory and then use the following command to build the project:

   ```bash
   ./mvnw clean package -DskipTests
   ```

Use the following steps if you want to run the application locally. Otherwise, you can skip these steps.

1. Open a new Bash window and then use the following command to start Config Server:

   ```bash
   ./mvnw spring-boot:run -pl spring-petclinic-config-server
   ```

1. Open a new Bash window and then use the following command to start Discovery Server:

   ```bash
   ./mvnw spring-boot:run -pl spring-petclinic-discovery-server
   ```

1. For the Customers, Vets, Visits, and Spring Cloud Gateway services, open a new Bash window and use the following commands to start the services:

   ```bash
   ./mvnw spring-boot:run -pl spring-petclinic-customers-service
   ./mvnw spring-boot:run -pl spring-petclinic-vets-service
   ./mvnw spring-boot:run -pl spring-petclinic-visits-service
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=default,development \
       -pl spring-petclinic-api-gateway
   ```

1. Open a new Bash window and navigate to the project `spring-petclinic-frontend` directory. Use the following commands to install dependencies and run the frontend application:

   ```bash
   npm install
   npm run start
   ````

1. After the script completes successfully, go to `http://localhost:8080` in your browser to access the PetClinic application.
