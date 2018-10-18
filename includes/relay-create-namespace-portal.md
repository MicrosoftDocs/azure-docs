1. Sign in to the [Azure portal][Azure portal].
2. In the left menu, select **+ Create a resource**. Then, select **Integration** > **Relay**. If you don't see **Relay** in the list, select **See All** in the top-right corner. 
3. Under **Create namespace**, enter a namespace name. The system immediately checks to see if the name is available.
4. In the **Subscription** box, select an Azure subscription in which to create the namespace.
5. In the [Resource group](../articles/azure-resource-manager/resource-group-portal.md) box, select an existing resource group in which to place the namespace, or create a new one.  
6. In **Location**, select the country or region in which your namespace should be hosted.
   
    ![Create namespace][create-namespace]
7. Select **Create**. The system creates your namespace and enables it. After a few minutes, the system provisions resources for your account.

### Get management credentials

1. Select **All resources**, and then select the newly created namespace name.
2. Under the Relay namespace, select **Shared access policies**.  
3. Under **Shared access policies**, select **RootManageSharedAccessKey**.
   
    ![connection-info][connection-info]
4. Under **Policy: RootManageSharedAccessKey**, select the **Copy** button next to **Connection string–Primary key**. This copies the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
   
    ![connection-string][connection-string]

5. Repeat the preceding step to copy and paste the value of **Primary key** to a temporary location for later use.  

<!--Image references-->

[create-namespace]: ./media/relay-create-namespace-portal/create-namespace.png
[connection-info]: ./media/relay-create-namespace-portal/connection-info.png
[connection-string]: ./media/relay-create-namespace-portal/connection-string.png
[Azure portal]: https://portal.azure.com
