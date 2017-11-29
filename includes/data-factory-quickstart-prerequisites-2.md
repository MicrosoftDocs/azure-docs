### Windows PowerShell

#### Install PowerShell
Install the latest PowerShell if you don't have it on your machine. 

1. In your web browser, navigate to [Azure SDK Downloads and SDKS](https://azure.microsoft.com/downloads/) page. 
2. Click **Windows install** in the **Command-line tools** -> **PowerShell** section. 
3. To install PowerShell, run the **MSI** file. 

For detailed instructions, see [How to install and configure PowerShell](/powershell/azure/install-azurerm-ps). 

#### Log in to PowerShell

1. Launch **PowerShell** on your machine. Keep PowerShell open until the end of this quickstart. If you close and reopen, you need to run these commands again.

    ![Launch PowerShell](media/data-factory-quickstart-prerequisites-2/search-powershell.png)
1. Run the following command, and enter the same Azure user name and password that you use to sign in to the Azure portal:
       
    ```powershell
    Login-AzureRmAccount
    ```        
2. If you have multiple Azure subscriptions, run the following command to view all the subscriptions for this account:

    ```powershell
    Get-AzureRmSubscription
    ```
3. Run the following command to select the subscription that you want to work with. Replace **SubscriptionId** with the ID of your Azure subscription:

    ```powershell
    Select-AzureRmSubscription -SubscriptionId "<SubscriptionId>"   	
    ```
