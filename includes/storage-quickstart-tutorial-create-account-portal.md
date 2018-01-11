## Create a storage account using the Azure portal

First, create a new general-purpose storage account to use for this quickstart. 

1. Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) and log in using your Azure account. 
2. Enter a unique name for your storage account. Keep these rules in mind for naming your storage account:
    - The name must be between 3 and 24 characters in length.
    - The name may contain numbers and lowercase letters only.
3. Make sure that the following default values are set: 
    - **Deployment model** is set to **Resource manager**.
    - **Account kind** is set to **General purpose**.
    - **Performance** is set to **Standard**.
    - **Replication** is set to **Locally Redundant storage (LRS)**.
4. Select your subscription. 
5. For **Resource group**, create a new one and give it a unique name. 
6. Select the **Location** to use for your storage account.
7. Check **Pin to dashboard** and click **Create** to create your storage account. 

After your storage account is created, it is pinned to the dashboard. Click on it to open it. Under **Settings**, click **Access keys**. Select the primary key and copy the associated **Connection string** to the clipboard, then paste it into a text editor for later use.
