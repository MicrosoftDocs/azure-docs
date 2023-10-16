---
author: KarlErickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 08/31/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Consumption plan.

[!INCLUDE [authenticate-client-with-gateway-consumption-plan](includes/tutorial-authenticate-client-with-gateway/authenticate-client-with-gateway-consumption-plan.md)]

-->

## 2. Prepare the Spring project

Use the following steps to clone and run the app locally:

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/azure-spring-apps-sso-client-credential.git -b consumption-plan
   ```

1. Use the following command to build the Books backend services:

   ```bash
   cd azure-spring-apps-sso-client-credential
   ./mvnw clean package
   ```

1. Enter the SPA project directory, and use the following command to install the dependencies:

   ```bash
   npm install @azure/msal-node
   ```

## 3. Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance and an Azure Database for PostgreSQL instance. This section provides the steps to create these resources.

### 3.1. Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the Azure portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

Use the following steps to create a service instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. Select **Compute** > **Azure Spring Apps**.

   :::image type="content" source="../../media/tutorial-authenticate-client-with-gateway/create-service-instance.png" alt-text="Screenshot of the Azure portal that shows the Create a resource page with Azure Spring Apps highlighted." lightbox="../../media/tutorial-authenticate-client-with-gateway/create-service-instance.png":::

1. Fill out the **Basics** form with the following information:

   | Setting                    | Suggested value                              | Description                                                                                                                                                                                                                                                                                        |
   |----------------------------|----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | Subscription               | Your subscription name                       | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                        |
   | Resource group             | *myresourcegroup*                            | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | Name                       | *myasa*                                      | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | Plan                       | **Standard consumption & dedicated (preview)** | The pricing plan determines the resources and cost associated with your instance.                                                                                                                                                                                                                  |
   | Region                     | The region closest to your users             | The location that is closest to your users.                                                                                                                                                                                                                                                        |
   | Container Apps Environment | *myacaenv*                                   | Select which Container Apps environment instance to share the same virtual network with other services and resources.                                                                                                                                                                              |

   :::image type="content" source="../../media/tutorial-authenticate-client-with-gateway/create-consumption-service-basics.png" alt-text="Screenshot of the Azure portal that shows the Create Azure Spring Apps consumption plan page." lightbox="../../media/tutorial-authenticate-client-with-gateway/create-consumption-service-basics.png":::

   Use the following table as a guide to create the Container Apps Environment:

   | Setting          | Suggested value | Description                                                                              |
   |------------------|-----------------|------------------------------------------------------------------------------------------|
   | Environment name | *myacaenv*      | A unique name that identifies your Azure Container Apps Environment service.             |
   | Plan             | **Consumption**   | The pricing plan determines the resources and cost associated with your instance.        |
   | Zone Redundant   | **Disabled**      | Whether to create your Container Apps Environment service in an Azure availability zone. |

   :::image type="content" source="../../media/tutorial-authenticate-client-with-gateway/create-apps-container-environment-basics.png" alt-text="Screenshot of the Azure portal that shows the Create Azure Container Apps page." lightbox="../../media/tutorial-authenticate-client-with-gateway/create-apps-container-environment-basics.png":::

   > [!IMPORTANT]
   > The Consumption workload profile has a pay-as-you-go billing model, with no starting cost. You're billed for the dedicated workload profile based on the provisioned resources. For more information, see [Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)](../../../container-apps/workload-profiles-overview.md) and [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/).

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page. Select **Go to resource** to open the service's **Overview** page.

   :::image type="content" source="../../media/tutorial-authenticate-client-with-gateway/notifications.png" alt-text="Screenshot of the Azure portal that shows the Overview page with the Notifications pane open." lightbox="../../media/tutorial-authenticate-client-with-gateway/notifications.png":::

1. Use the following command to enable the Eureka server. Be sure to replace the placeholders with your own values you created in the previous step.

   ```azurecli
   az spring eureka-server enable \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-instance-name>
   ```

### 3.3. Register the Books application

This section provides the steps to register an application to add app roles in Microsoft Entra ID, which is used for protecting the RESTful APIs in Azure Spring Apps.

1. Go to the Azure portal homepage.

1. If you have access to multiple tenants, use the **Directory + subscription** filter (:::image type="icon" source="../../media/tutorial-authenticate-client-with-gateway/portal-directory-subscription-filter.png" border="false":::) to select the tenant in which you want to register an application.

1. Search for and select **Microsoft Entra ID**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a name for your application in the **Name** field, for example *Books*. Users of your app might see this name, and you can change it later.

1. For **Supported account types**, select **Accounts in this organizational directory only**.

1. Select **Register** to create the application.

1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You need it to configure the YAML configuration file for this project.

1. Under **Manage**, select **Expose an API**, find the **Application ID URI** at the beginning of the page, and then select **Add**.

1. On the **Edit application ID URI** page, accept the proposed Application ID URI (`api://{client ID}`) or use a meaningful name instead of the client ID, such as `api://books`, and then select **Save**.

1. Under **Manage**, select **App roles** > **Create app role**, and then enter the following information:

   - For **Display name**, enter *Write*.
   - For **Allowed member types**, select **Applications**.
   - For **Value**, enter *Books.Write*.
   - For **Description**, enter *Adding books*.

1. Repeat the previous step to add another app role: `Books.Read`.

   :::image type="content" source="../../media/tutorial-authenticate-client-with-gateway/app-roles.png" alt-text="Screenshot of the Books app registration page that shows the App roles." lightbox="../../media/tutorial-authenticate-client-with-gateway/app-roles.png":::

### 3.4. Register the SPA application

The Books RESTful API app acts as a resource server, which is protected by Microsoft Entra ID. Before acquiring an access token, you're required to register another application in Microsoft Entra ID and grant permissions to the client application, which is named `SPA`.

1. Go back to your tenant in **Microsoft Entra ID**.

1. Under **Manage**, select **App registrations** > **New registration**.

1. Enter a name for your application in the **Name** field, for example `SPA`.

1. For **Supported account types**, use the default **Accounts in this organizational directory only**.

1. Select **Register** to create the application.

1. On the app **Overview** page, look for the **Application (client) ID** value, and then record it for later use. You need it to acquire access token.

1. Select **API permissions** > **Add a permission** > **APIs my organization uses**. Select the `Books` application that you registered earlier, select the permissions **Books.Read** and **Books.Write**, and then select **Add permissions**.

1. Select **Grant admin consent for \<your-tenant-name>** to grant admin consent for the permissions you added.

   :::image type="content" source="../../media/tutorial-authenticate-client-with-gateway/api-permissions.png" alt-text="Screenshot of the SPA API permissions page that shows the API permissions of a web application." lightbox="../../media/tutorial-authenticate-client-with-gateway/api-permissions.png":::

1. Navigate to **Certificates & secrets** and then select **New client secret**. 

1. On the **Add a client secret** page, enter a description for the secret, select an expiration date, and then select **Add**.

1. Look for the **Value** of the secret and then record it for later use. You need it to acquire an access token.

### 3.5. Update the configuration of Books Service app

Locate to the file `books-service/src/main/resources/application.yml` of the `books-service` app, and update the configuration of the `spring.cloud.azure.active-directory` section.
Be sure to replace the placeholders with your own values you created in the previous step.

```yaml
spring:
  cloud:
    azure:
      active-directory:
        credential:
          client-id: <your-application-ID-of-Books>
        app-id-uri: <your-application-ID-URI-of-Books>
```

Use the following command to rebuild the sample project:

```bash
./mvnw clean package
```

## 4. Deploy the apps to Azure Spring Apps

The following steps show you how to deploy the apps to Azure.

### 4.1. Deploy the microservice apps to Azure Spring Apps

Use the following steps to deploy the apps to Azure Spring Apps using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

1. Navigate to the sample project directory and then use the following command to configure the app in Azure Spring Apps:

   ```bash
   ./mvnw com.microsoft.azure:azure-spring-apps-maven-plugin:1.18.0:config
   ```

   The following list describes the command interactions:

   - **Select child modules to configure (input numbers separated by comma, eg: [1-2,4,6], ENTER to select ALL)**: Press <kbd>Enter</kbd> to select all.
   - **OAuth2 login**: Authorize the login to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you created. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Select apps to expose public access: (input numbers separated by comma, eg: [1-2,4,6], ENTER to select NONE)**: Enter *1* for `gateway-service`.
   - **Confirm to save all the above configurations (Y/n)**: Enter <kbd>y</kbd>. If you enter <kbd>n</kbd>, the configuration isn't saved in the POM files.

1. Use the following command to deploy the app:

   ```bash
   ./mvnw azure-spring-apps:deploy
   ```

   The following list describes the command interaction:

   - **OAuth2 login**: You need to authorize the login to Azure based on the OAuth2 protocol.

   After the command is executed, you can see the following log messages, which indicate that the deployment was successful.

   ```output
   [INFO] Getting public url of app(gateway-service)...
   [INFO] Application url: https://gateway-service.xxxxxxxxxxxxxx-xxxxxxxx.eastasia.azurecontainerapps.io

   ...
   
   [INFO] Artifact(books-service-0.0.1-SNAPSHOT.jar) is uploaded and deployment(default) is successfully updated.
   
   ...
   ```

   The output **Application url** is the base endpoint to access the ToDo RESTful API application.

### 4.2. Run the SPA app locally

Update the configuration in the `SPA` application script file *spa/server.js* to match the following example. Be sure to replace the placeholders with your own values you created in the previous step.

```javascript
const SpringCloudGatewayURL = "<URL exposed by app gateway-service>"

const msalConfig = {
    auth: {
        clientId: "< SPA App Registration ClientId>",
        authority: "https://login.microsoftonline.com/< TenantId >/",
        clientSecret: "<SPA App Registration ClientSecret>",
    },
};

const tokenRequest = {
    scopes: ["<Application ID URI of Books>/.default"]
};
```

In the SPA project directory, use the following command to run locally:

```shell
node server.js
```

> [!NOTE]
> The SPA app is a static web application, which can be deployed to any web server.
