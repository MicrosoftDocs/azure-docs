# How to create a file share
You can create Azure File shares using [Azure Portal](https://portal.azure.com/), the Azure Storage PowerShell cmdlets, the Azure Storage client libraries, or the Azure Storage REST API. Additionally, because these file shares are SMB shares, you can access them via standard and familiar file system APIs.

## Create file share through the Portal
1. **Go to Storage Account blade on Azure Portal**
    
    ![Storage Account Blade](media/storage-file/create-file-share-portal1.png)

2. **Click on add File share**
    
    ![Click the add file share button](media/storage-file/create-file-share-portal2.png)

3. **Provide Name and Quota. Quota currently can be maximum 5TB.**
    
    ![Provide a name and a desired quota for the new file share](media/storage-file/create-file-share-portal3.png)

4. **View your new file share**

    ![View your new file share](media/storage-file/create-file-share-portal4.png)

5. **Upload a file**

    ![Upload a file](media/storage-file/create-file-share-portal5.png)

6. Browse into your file share and manage your directories and files

    ![Browse file share](media/storage-file/create-file-share-portal6.png)

## Create file share through PowerShell
1. **Install the PowerShell cmdlets for Azure Storage**  
    To prepare to use PowerShell, download and install the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/) for the install point and installation instructions.

    > [!Note]  
    > It's recommended that you download and install or upgrade to the latest Azure PowerShell module.

2. **Open a PowerShell window.**  
    One way to do this is to click **Start** and typing **Windows PowerShell**. The PowerShell session will load the Azure Powershell module for you.

3. **Create a context for your storage account and key**
    The context encapsulates the storage account name and account key. For instructions on copying your account key from the [Azure Portal](https://portal.azure.com/), see [View and copy storage access keys](../storage-create-storage-account.md#view-and-copy-storage-access-keys).

    Replace storage-account-name and storage-account-key with your storage account name and key in the following example:

    ```PowerShell
    $storageContext = New-AzureStorageContext <storage-account-name> <storage-account-key>
    ```

4. **Create a new file share**
    
    ```PowerShell
    $share = New-AzureStorageShare logs -Context $storageContext
    ```

You now have a file share in File storage. Next we'll add a directory and a file.

> [!Note]  
> The name of your file share must be all lowercase. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://msdn.microsoft.com/library/azure/dn167011.aspx).

## Create file share through Command Line Interface (CLI)
1. **To prepare to use Command Line Interface (CLI), download and install the Azure CLI.**  
    See [Install the Azure Command-Line Interface](../install-azure-cli.md) and [Get started with Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli).

2. **Create a connection string to the Storage Account where you want to create the share.**  
    Replace ```<storage-account>``` and ```<resource_group>``` with your storage account name and resource group in the following example.

    ```
    current_env_conn_string = $(az storage account show-connection-string -n <storage-account> -g <resource-group> --query 'connectionString' -o tsv)

    if [[ $current_env_conn_string == "" ]]; then  
        echo "Couldn't retrieve the connection string."
    fi
    ```

3. **Create file share**
    ```
    az storage share create --name files --quota 2048 --connection-string $current_env_conn_string 1 > /dev/null
    ```