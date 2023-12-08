---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 10/18/2023
---

<!-- 
Use the following line at the end of the heading Prerequisites, with blank lines before and after. App deployments with Spring Apps Maven plugin.

[!INCLUDE [web-spring-apps-maven-plugin](includes/quickstart-deploy-web-app/web-spring-apps-maven-plugin.md)]
-->

Use the following steps to deploy using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

1. Navigate to the *complete* directory, and then run the following command to configure the app in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.19.0:config
   ```

   The following list describes the command interactions:

   - **Select child modules to configure**: Select the module to configure, then enter the number of the **SimpleTodo Web** module.
   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Use existing Azure Spring Apps in Azure**: Press <kbd>y</kbd> to use the existing Azure Spring Apps instance.
   - **Select Azure Spring Apps for deployment**: Select the number of the Azure Spring Apps instance you created. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Expose public access for this app**: Press <kbd>y</kbd>.
   - **Confirm to save all the above configurations**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the POM files.

1. Use the following command to deploy the app:

   ```bash
   ./mvnw azure-spring-apps:deploy
   ```

   The following list describes the command interaction:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.

   After the command is executed, you can see from the following log messages that the deployment was successful:
