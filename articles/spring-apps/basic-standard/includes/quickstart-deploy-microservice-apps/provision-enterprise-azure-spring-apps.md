---
author: karlerickson
ms.author: v-shilichen
ms.service: azure-spring-apps
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 02/01/2024
---

<!--
To reuse the Spring Apps instance creation steps in other articles, a separate markdown file is used to describe how to provision enterprise Spring Apps instance.

[!INCLUDE [provision-enterprise-azure-spring-apps](provision-enterprise-azure-spring-apps.md)]

-->

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

Use the following steps to create the service instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. Select **Compute** > **Azure Spring Apps**.

1. Fill out the form on the **Basics** tab. Use the following table as a guide for completing the form:

   | Setting                       | Suggested value                   | Description                                                                                                                                                                                                                                                                                        |
   |-------------------------------|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Subscription**              | Your subscription name.           | The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                        |
   | **Resource group**            | **myresourcegroup**                 | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | **Name**                      | **myasa**                           | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | **Region**                    | The region closest to your users. | The location that is closest to your users.                                                                                                                                                                                                                                                        |
   | **Hosting options and plans** | **Enterprise**                    | The pricing plan that determines the resource and cost associated with your instance.                                                                                                                                                                                                              |
   | **Zone Redundant**            | Unselected                        | The option to create your Azure Spring Apps service in an Azure availability zone. This feature isn't currently supported in all regions.                                                                                                                                                          |
   | **Software IP Plan**          | **Pay-as-you-go**                 | The pricing plan that lets you pay as you go with Azure Spring Apps.                                                                                                                                                                                                                               |
   | **Deploy sample project**     | Unselected                        | The option to use the built-in sample application.                                                                                                                                                                                                                                                 |

1. Navigate to the **Diagnostic settings** tab on the **Create Azure Spring Apps** page and then select **Create new** to create a new Log Analytics workspaces instance. On the **Create new Log Analytics workspace** page, update the name of the **Log Analytics workspace** as needed and then select **OK** to confirm the creation.

1. Navigate to the **Application Insights** tab on the **Create Azure Spring Apps** page and then select **Create new** to create a new Application Insights instance. On the **Create new Application Insights resource** page, update the **Application insights name** as needed, select **Workspace-based** for **Resource mode**, and then select **OK** to confirm the creation.

1. Select **Review and Create** to review your selections. Then, select **Create** to provision the Azure Spring Apps instance.

1. Select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment finishes, you can select **Pin to dashboard** to create a shortcut on your Azure portal dashboard to the service's **Overview** page.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-notifications.png" alt-text="Screenshot of the Azure portal that shows a deployment of a resource and the Notification pane with Go to resource and Pin to dashboard buttons." lightbox="../../media/quickstart-deploy-microservice-apps/azure-spring-apps-notifications.png":::

1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

### 3.3. Configure Azure Spring Apps instance

The following sections show you how to configure the service instance.

#### Create the apps

Use the following steps to create the apps:

1. From the navigation pane, select **Apps** and then select **Create App**.

1. On the **Create App** page, for the **App name**, use **frontend** and leave all the other fields with their default values.

1. Repeat the previous step using each of the following application names:

   - `customers-service`
   - `vets-service`
   - `visits-service`

1. Select **Create** to finish the app creation.

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/enterprise-app-creation.png" alt-text="Screenshot of the Azure portal that shows the Create App page." lightbox="../../media/quickstart-deploy-microservice-apps/enterprise-app-creation.png":::

#### Configure Service Registry

Use the following steps to configure Service Registry:

1. From the navigation pane, select **Service Registry**.

1. Select **App binding**, select **Bind app**, select `customers-service` from the list, and then select **Apply**.

1. Repeat the previous step to bind the following applications:

   - `vets-service`
   - `visits-service`

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/enterprise-bind-registry.png" alt-text="Screenshot of the Azure portal that shows the Service Registry page with the App binding tab selected." lightbox="../../media/quickstart-deploy-microservice-apps/enterprise-bind-registry.png":::

#### Configure Application Configuration Service

Use the following steps to configure Application Configuration Service:

1. From the navigation pane, select **Application Configuration Service** and then select **Settings**.

1. Fill out the repository with the following information, and then select **Validate**:

   - **Name**: **default**
   - **Patterns**: **application,api-gateway,customers-service,vets-service,visits-service**
   - **URI**: **https://github.com/Azure-Samples/spring-petclinic-microservices-config.git**.
   - **Label**: **master**

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/enterprise-validate-configuration-service.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service Settings tab." lightbox="../../media/quickstart-deploy-microservice-apps/enterprise-validate-configuration-service.png":::

1. After validation, select **Apply** to finish the Application Configuration Service configuration.

1. Select **App binding**, select **Bind app**, select `customers-service` from the list, and then select **Apply**.

1. Repeat the previous step to bind the following applications:

   - `vets-service`
   - `visits-service`

   :::image type="content" source="../../media/quickstart-deploy-microservice-apps/enterprise-bind-configuration.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with the App binding tab selected." lightbox="../../media/quickstart-deploy-microservice-apps/enterprise-bind-configuration.png":::

#### Set the config file patterns for apps

Use the following steps to set the config file patterns:

1. From the navigation pane, select **Apps** and then select the `customers-service` app.

1. On the **App overview** page, select **Configuration**, select **Config file patterns** in the **General settings** tab, and then select **application** and `customers-service`. Select **Save** to set the config file patterns.

1. Repeat the previous step to save the config file patterns for the following applications:

   - `vets-service`: Select **application** and `vets-service`.
   - `visits-service`: Select **application** and `visits-service`.

#### Configure Spring Cloud Gateway

This section shows you how to configure Spring Cloud Gateway.

First, use the following steps to assign an endpoint for the gateway access:

1. From the navigation pane, select **Spring Cloud Gateway**.

1. On the **Overview** tab, select **Yes** to assign an endpoint. Save the endpoint URL to use later.

Next, configure the routing for Spring Cloud Gateway. Because the Azure portal doesn't currently support route configuration for Spring Cloud Gateway, open a Bash window and use the following Azure CLI steps to configure the routing:

1. Use the following command to sign in to the Azure CLI:

   ```azurecli
   az login
   ```

1. Use the following commands to install the Azure Spring Apps extension for the Azure CLI and register the namespace `Microsoft.SaaS`:

   ```azurecli
   az extension add --name spring --upgrade
   az provider register --namespace Microsoft.SaaS
   ```

1. Use the following command to accept the legal terms and privacy statements:

   > [!NOTE]
   > This step is necessary only if your subscription has never been used to create an Enterprise plan instance of Azure Spring Apps.

   ```azurecli
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

   ```azurecli
   export SUBSCRIPTION_ID=<subscription-ID>
   export RESOURCE_GROUP=<resource-group-name>
   export SPRING_APPS_NAME=<Azure-Spring-Apps-instance-name>
   export APP_CUSTOMERS_SERVICE=customers-service
   export APP_VETS_SERVICE=vets-service
   export APP_VISITS_SERVICE=visits-service
   export APP_FRONTEND=frontend
   ```

1. Use the following command to set the default subscription:

   ```azurecli
   az account set --subscription ${SUBSCRIPTION_ID}
   ```

1. Use the following command to set the routing for the `customers-service` app:

   ```azurecli
   az spring gateway route-config create \
       --resource-group ${RESOURCE_GROUP} \
       --service ${SPRING_APPS_NAME} \
       --name ${APP_CUSTOMERS_SERVICE} \
       --app-name ${APP_CUSTOMERS_SERVICE} \
       --routes-json \
         '[
           {
             "predicates": [
               "Path=/api/customer/**"
             ],
             "filters": [
               "StripPrefix=2"
             ]
           }
         ]'
   ```

1. Use the following command to set the routing for the `vets-service` app:

   ```azurecli
   az spring gateway route-config create \
       --resource-group ${RESOURCE_GROUP} \
       --service ${SPRING_APPS_NAME} \
       --name ${APP_VETS_SERVICE} \
       --app-name ${APP_VETS_SERVICE} \
       --routes-json \
         '[
            {
              "predicates": [
                "Path=/api/vet/**"
              ],
              "filters": [
                "StripPrefix=2"
              ]
            }
          ]'
   ```

1. Use the following command to set the routing for the `visits-service` app:

   ```azurecli
   az spring gateway route-config create \
       --resource-group ${RESOURCE_GROUP} \
       --service ${SPRING_APPS_NAME} \
       --name ${APP_VISITS_SERVICE} \
       --app-name ${APP_VISITS_SERVICE} \
       --routes-json \
         '[
            {
              "predicates": [
                "Path=/api/visit/**"
              ],
              "filters": [
                "StripPrefix=2"
              ]
            }
          ]'
   ```

1. Use the following command to set the routing for the frontend app:

   ```azurecli
   az spring gateway route-config create \
       --resource-group ${RESOURCE_GROUP} \
       --service ${SPRING_APPS_NAME} \
       --name ${APP_FRONTEND} \
       --app-name ${APP_FRONTEND} \
       --routes-json \
         '[
            {
              "predicates": [
                "Path=/**"
              ],
              "filters": [
                "StripPrefix=0"
              ],
              "order": 1000
            }
          ]'
   ```

#### Configure Developer Tools

Use the following steps to configure the Developer Tools.

1. From the navigation pane, select **Developer Tools**.

1. Select **Assign endpoint** to assign an endpoint for **Developer Tools**.

1. Save the endpoint of **App Live View** to use later.
