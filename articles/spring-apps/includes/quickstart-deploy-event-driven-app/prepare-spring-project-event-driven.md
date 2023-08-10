---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 07/19/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to prepare event-driven project.

[!INCLUDE [prepare-spring-project-event-driven](../../includes/quickstart-deploy-event-driven-app/prepare-spring-project-event-driven.md)]

-->

Use the following steps to prepare the sample locally.

### [Azure portal](#tab/Azure-portal)

[!INCLUDE [prepare-spring-project-git-event-driven](../../includes/quickstart-deploy-event-driven-app/prepare-spring-project-git-event-driven.md)]

### [Azure Developer CLI](#tab/Azure-Developer-CLI)

These steps use AZD to initialize the event-driven application from the Azure Developer CLI templates.

1. Open a terminal, create a new, empty folder, then navigate to it.
1. Use the following command to initialize the project:

   ```bash
   azd init --template Azure-Samples/ASA-Samples-Event-Driven-Application
   ```

   The following list describes the command interactions:

   - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.
   - **Please enter a new environment name**: Provide an environment name, which is used as a suffix for the resource group that is created to hold all Azure resources. This name should be unique within your Azure subscription.

   The console outputs messages similar to the following example:

   ```output
   Initializing a new project (azd init)
   
   (✓) Done: Initialized git repository
   (✓) Done: Downloading template code to: <your-local-path>

   Enter a new environment name: <your-env-name>


   SUCCESS: New project initialized!
   You can view the template code in your directory: <your-local-path>
   Learn more about running 3rd party code on our DevHub: https://aka.ms/azd-third-party-code-notice
   ```

---
