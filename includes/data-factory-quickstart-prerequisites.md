## Prerequisites

### Azure subscription
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

### Azure roles
To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription. In the Azure portal, click your **user name** at the top-right corner, and select **Permissions** to view the permissions you have in the subscription. If you have access to multiple subscriptions, select the appropriate subscription. For sample instructions on adding a user to a role, see the [Add roles](../articles/billing/billing-add-change-azure-subscription-administrator.md) article.

### Azure Storage Account
You use a general-purpose Azure Storage Account (specifically Blob Storage) as both **source** and **destination** data stores in this quickstart. If you don't have a general-purpose Azure storage account, see [Create a storage account](../articles/storage/common/storage-create-storage-account.md#create-a-storage-account) on creating one. 

#### Get storage account name and account key
You use the name and key of your Azure storage account in this quickstart. The following procedure provides steps to get the name and key of your storage account. 

1. Launch a Web browser and navigate to [Azure portal](https://portal.azure.com). Log in using your Azure user name and password. 
2. Click **More services >** in the left menu, and filter with **Storage** keyword, and select **Storage accounts**.

    ![Search for storage account](media/data-factory-quickstart-prerequisites/search-storage-account.png)
3. In the list of storage accounts, filter for your storage account (if needed), and then select **your storage account**. 
4. In the **Storage account** page, select **Access keys** on the menu.

    ![Get storage account name and key](media/data-factory-quickstart-prerequisites/storage-account-name-key.png)
5. Copy the values for **Storage account name** and **key1** fields to the clipboard. Paste them into a notepad or any other editor and save it. You use them later in this quickstart.   

#### Create input folder and files
In this section, you create a blob container named **adftutorial** in your Azure blob storage. Then, you create a folder named **input** in the container, and then upload a sample file to the input folder. 

1. In the **Storage account** page, switch to the **Overview**, and then click **Blobs**. 

    ![Select Blobs option](media/data-factory-quickstart-prerequisites/select-blobs.png)
2. In the **Blob service** page, click **+ Container** on the toolbar. 

    ![Add container button](media/data-factory-quickstart-prerequisites/add-container-button.png)    
3. In the **New container** dialog, enter **adftutorial** for the name, and click **OK**. 

    ![Enter container name](media/data-factory-quickstart-prerequisites/new-container-dialog.png)
4. Click **adftutorial** in the list of containers. 

    ![Select the container](media/data-factory-quickstart-prerequisites/seelct-adftutorial-container.png)
1. In the **Container** page, click **Upload** on the toolbar.  

    ![Upload button](media/data-factory-quickstart-prerequisites/upload-toolbar-button.png)
6. In the **Upload blob** page, click **Advanced**.

    ![Click Advanced link](media/data-factory-quickstart-prerequisites/upload-blob-advanced.png)
7. Launch **Notepad** and create a file named **emp.txt** with the following content: Save it in the **c:\ADFv2QuickStartPSH** folder: Create the folder **ADFv2QuickStartPSH** if it does not already exist.
    
    ```
    John, Doe
    Jane, Doe
    ```    
8. In the Azure portal, in the **Upload blob** page, browse, and select the **emp.txt** file for the **Files** field. 
9. Enter **input** as a value **Upload to folder** filed. 

    ![Upload blob settings](media/data-factory-quickstart-prerequisites/upload-blob-settings.png)    
10. Confirm that the folder is **input** and file is **emp.txt**, and click **Upload**.
11. You should see the **emp.txt** file and the status of the upload in the list. 
12. Close the **Upload blob** page by clicking **X** in the corner. 

    ![Close upload blob page](media/data-factory-quickstart-prerequisites/close-upload-blob.png)
1. Keep the **container** page open. You use it to verify the output at the end of this quickstart.