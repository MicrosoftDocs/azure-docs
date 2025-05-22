---
author: karlerickson
ms.author: v-shilichen
ms.service: azure-spring-apps
ms.topic: include
ms.date: 11/06/2023
---

<!-- 
Use the following line at the end of the heading Prerequisites, with blank lines before and after. App deployments with Spring Apps Maven plugin.

[!INCLUDE [event-driven-spring-apps-maven-plugin](includes/quickstart-deploy-event-driven-app/event-driven-spring-apps-maven-plugin.md)]
-->

Use the following steps to deploy using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

1. Navigate to the **complete** directory, and then run the following command to configure the app in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.19.0:config
   ```

   The following list describes the command interactions:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Use existing Azure Spring Apps in Azure**: Press <kbd>y</kbd> to use the existing Azure Spring Apps instance.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you created. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Use existing app in Azure Spring Apps \<your-instance-name\>**: Press <kbd>y</kbd> to use the app created.
   - **Confirm to save all the above configurations**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the POM files.
