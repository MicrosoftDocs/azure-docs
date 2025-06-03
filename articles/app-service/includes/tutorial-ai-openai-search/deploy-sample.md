---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/07/2025
ms.author: cephalin
ms.custom:
  - build-2025
---

1. In the terminal, log into Azure using Azure Developer CLI:

   ```bash
   azd auth login
   ```

   Follow the instructions to complete the authentication process.

4. Provision the Azure resources with the AZD template:

   ```bash
   azd provision
   ```

1. When prompted, give the following answers:
    
    |Question  |Answer  |
    |---------|---------|
    |Enter a new environment name:     | Type a unique name. |
    |Select an Azure Subscription to use: | Select the subscription. |
    |Pick a resource group to use: | Select **Create a new resource group**. |
    |Select a location to create the resource group in:| Select any region. The resources will actually be created in **East US 2**.|
    |Enter a name for the new resource group:| Type **Enter**.|

6. Wait for the deployment to complete. This process will:
   - Create all required Azure resources.
   - Deploy the Blazor application to Azure App Service.
   - Configure secure service-to-service authentication using managed identities.
   - Set up the necessary role assignments for secure access between services.

   > [!NOTE]
   > To learn more about how managed identities work, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview) and [How to use managed identities with App Service](../../overview-managed-identity.md).

7. After successful deployment, you'll see a URL for your deployed application. Make note of this URL, but don't access it yet because you still need to set up the search index.

