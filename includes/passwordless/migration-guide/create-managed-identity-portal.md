The following steps demonstrate how to create a system-assigned managed identity for various web hosting services. The managed identity can securely connect to other Azure Services using the app configurations you set up previously.

### [Service Connector](#tab/service-connector)

Some app hosting environments support Service Connector, which helps you connect Azure compute services to other backing services. Service Connector automatically configures network settings and connection information.  You can learn more about Service Connector and which scenarios are supported on the [overview page](../../../articles/service-connector/overview.md).

The following compute services are currently supported:

* Azure App Service
* Azure Spring Cloud
* Azure Container Apps (preview)

For this migration guide you'll use App Service, but the steps are similar on Azure Spring Apps and Azure Container Apps.

> [!NOTE]
> Azure Spring Apps currently only supports Service Connector using connection strings.
1. On the main overview page of your App Service, select **Service Connector** from the left navigation.

1. Select **+ Create** from the top menu and the **Create connection** panel will open.  Enter the following values:

   * **Service type**: Choose **Service bus**.
   * **Subscription**: Select the subscription you would like to use.
   * **Connection Name**: Enter a name for your connection, such as *connector_appservice_servicebus*.
   * **Client type**: Leave the default value selected or choose the specific client you'd like to use.

   Select **Next: Authentication**.

1. Make sure **System assigned managed identity (Recommended)** is selected, and then choose **Next: Networking**.
1. Leave the default values selected, and then choose **Next: Review + Create**.
1. After Azure validates your settings, select **Create**.

The Service Connector will automatically create a system-assigned managed identity for the app service. The connector will also assign the managed identity a **Azure Service Bus Data Owner** role for the service bus you selected.

### [Azure App Service](#tab/app-service)

1. On the main overview page of your Azure App Service instance, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="../media/migration-create-identity-small.png" alt-text="Screenshot showing how to create a system assigned managed identity."  lightbox="../media/migration-create-identity.png":::

### [Azure Spring Apps](#tab/spring-apps)

1. On the main overview page of your Azure Spring Apps instance, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="../media/spring-apps-identity.png" alt-text="Screenshot showing how to enable managed identity for Azure Spring Apps.":::

### [Azure Container Apps](#tab/container-apps)

1. On the main overview page of your Azure Container Apps instance, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="../media/container-apps-identity.png" alt-text="Screenshot showing how to enable managed identity for Azure Container Apps.":::

### [Azure Virtual Machines](#tab/virtual-machines)

1. On the main overview page of your virtual machine, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="../media/virtual-machine-identity.png" alt-text="Screenshot showing how to enable managed identity for virtual machines.":::

---