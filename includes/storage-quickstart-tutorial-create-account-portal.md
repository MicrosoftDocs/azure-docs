## Create a storage account by using the Azure portal

First, create a new general-purpose storage account to use for this quickstart. 

1. Go to the [Azure portal](https://portal.azure.com) and log in using your Azure account. 
2. On the Hub menu, select **Create a resource** > **Storage** > **Storage account - blob, file, table, queue**. 
3. Enter a unique name for your storage account. Keep these rules in mind for naming your storage account:
    - The name must be between 3 and 24 characters in length.
    - The name may contain numbers and lowercase letters only.
4. Make sure that the following default values are set: 
    - **Deployment model** is set to **Resource manager**.
    - **Account kind** is set to **General purpose**.
    - **Performance** is set to **Standard**.
    - **Replication** is set to **Locally Redundant storage (LRS)**.
4. Select your subscription. 
5. For **Resource group**, create a new one and give it a unique name. 
6. Select the location to use for your storage account.
7. Select **Pin to dashboard** and select **Create** to create your storage account. 

After your storage account is created, it's pinned to the dashboard. Select it to open it. Under **Settings**, select **Access keys**. Select the primary key and copy the associated connection string to the clipboard. Then paste the string into a text editor for later use.
