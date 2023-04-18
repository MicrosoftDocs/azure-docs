The following steps demonstrate how to create a user-assigned managed identity for various web hosting services. The managed identity can securely connect to other Azure services using the app configurations you set up previously.

### [Service Connector](#tab/service-connector)

Some app hosting environments support Service Connector, which helps you connect Azure compute services to other backing services. Service Connector automatically configures network settings and connection information.

The following compute services are currently supported:

* Azure App Service
* Azure Spring Cloud
* Azure Container Apps (preview)

For this migration guide, you'll use App Service. The steps are similar on Azure Spring Apps and Azure Container Apps.

> [!NOTE]
> Azure Spring Apps currently only supports Service Connector using connection strings.

1. On the main overview page of your App Service, select **Service Connector** from the left navigation.

1. Select **+ Create** from the top menu and the **Create connection** panel will open.  Enter the following values:

   * **Service type**: Choose **Service bus**.
   * **Subscription**: Select the subscription you would like to use.
   * **Connection Name**: Enter a name for your connection, such as *connector_appservice_servicebus*.
   * **Client type**: Leave the default value selected or choose the specific client you'd like to use.

   Select **Next: Authentication**.

1. Select **User assigned managed identity**.
1. Select the subscription and **MigrationIdentity** user identity you configured in the previous section.
1. Select **Next: Networking**.
1. Leave the default values selected, and then choose **Next: Review + Create**.
1. After Azure validates your settings, select **Create**.

The Service Connector will automatically assign the managed identity an **Azure Service Bus Data Owner** role for the service bus you selected.

### [Azure portal](#tab/app-service)

You can assign the correct roles to your user-assigned managed identity through the storage account settings pages.

1. On the overview page of your storage account, select **Access control (IAM)**.
1. Select **+ Add** at the top of the page and then choose **Add role assignment** from the drop down menu.
1. On the **Add role assignment** page, leave the default **Assignment type** toggled and select **Next**.
1. On the **Role** tab, search for *Storage Blob Data Contributor* and select the matching result. Then select **Next**.
1. On the **Members** tab, make sure the following values are set:
    * **Selected Role**: Storage Blob Data Contributor
    * **Assign access to**: Select **Managed identity**.
    * **Members**: Select **+ Select members**.
        
        In the flyout menu, make sure the following values are set:

         * **Subscription**: Select the subscription you want to use.
         * **Managed identity**: Select **User-assigned managed identity**.
         * **Select**: Search for the **Migration Identity** you created earlier and select it from the results below the input.

         
1. Choose **Select** to close the flyout.
1. Select **Review and assign** at the bottom of the page.
1. After Azure validates your inputs, select **Assign** to complete the workflow.

The correct role is assigned to the user-assigned managed identity used by your app.