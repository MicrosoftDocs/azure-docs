---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 01/10/2024
---

<!--
Use the following line at the end of the heading Prerequisites, with blank lines before and after. App deployments with Spring Apps Maven plugin.

[!INCLUDE [microservice-spring-apps-maven-plugin](includes/quickstart-deploy-microservice-apps/microservice-spring-apps-maven-plugin.md)]
-->

Use the following steps to deploy using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

1. Navigate to the project root directory and then run the following command to configure the apps in Azure Spring Apps:

   ```bash
   ./mvnw -P spring-apps-enterprise com.microsoft.azure:azure-spring-apps-maven-plugin:1.19.0:config
   ```

   The following list describes the command interactions:

   - **Select child modules to configure**: Press <kbd>Enter</kbd> to select all.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Use existing Azure Spring Apps in Azure**: Press <kbd>y</kbd> to use the existing Azure Spring Apps instance.
   - **Select apps to expose public access**: Press <kbd>Enter</kbd> to select none.
   - **Confirm to save all the above configurations**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the POM files.
