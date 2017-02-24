1. Log on to the [Azure portal][Azure portal].
2. In the left navigation pane of the portal, click **New**, then click **Enterprise Integration**, and then click **Relay**.
3. In the **Create namespace** dialog, enter a namespace name. The system immediately checks to see if the name is available.
4. In the **Subscription** field, choose an Azure subscription in which to create the namespace.
5. In the **[Resource group](../articles/azure-resource-manager/resource-group-portal.md)** field, choose an existing resource group in which the namespace will live, or create a new one.      
6. In **Location**, choose the country or region in which your namespace should be hosted.
   
    ![Create namespace][create-namespace]
7. Click **Create**. The system now creates your namespace and enables it. After a few minutes, the system provisions resources for your account.

### Obtain the management credentials
1. In the list of namespaces, click the newly created namespace name.
2. In the namespace blade, click **Shared access policies**.
3. In the **Shared access policies** blade, click **RootManageSharedAccessKey**.
   
    ![connection-info][connection-info]
4. In the **Policy: RootManageSharedAccessKey** blade, click the copy button next to **Connection string–primary key**, to copy the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
   
    ![connection-string][connection-string]

5. Repeat the previous step, copying and pasting the value of **Primary key** to a temporary location for later use.  

<!--Image references-->

[create-namespace]: ./media/relay-create-namespace-portal/create-namespace.png
[connection-info]: ./media/relay-create-namespace-portal/connection-info.png
[connection-string]: ./media/relay-create-namespace-portal/connection-string.png
[Azure portal]: https://portal.azure.com
