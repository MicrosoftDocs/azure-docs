---
title: Use a Windows VM MSI to access Azure Cosmos DB
description: A tutorial that walks you through the process of using a System-Assigned Managed Service Identity (MSI) on a Windows VM, to access Azure Cosmos DB.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: daveba
ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2018
ms.author: daveba
---

# Tutorial: Use a Windows VM MSI to access Azure Cosmos DB

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to create and use a Windows VM MSI to access Cosmos DB. You learn how to:

> [!div class="checklist"]
> * Create a MSI enabled Windows VM 
> * Create a Cosmos DB account
> * Grant Windows VM MSI access to the Cosmos DB account access keys
> * Get an access token using the Windows VM's MSI to call Azure Resource Manager
> * Get access keys from Azure Resource Manager to make Cosmos DB calls

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]


## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Windows virtual machine in a new resource group

For this tutorial, we create a new Windows VM.  You can also enable MSI on an existing VM.

1. Click the **Create a resource** button found on the upper left-hand corner of the Azure portal.
2. Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3. Enter the virtual machine information. The **Username** and **Password** created here is the credentials you use to login to the virtual machine.
4. Choose the proper **Subscription** for the virtual machine in the dropdown.
5. To select a new **Resource Group** in which to create your virtual machine, choose **Create New**. When complete, click **OK**.
6. Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the Settings page, keep the defaults, and click **OK**.

   ![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable MSI on your VM 

A Virtual Machine MSI enables you to get access tokens from Azure AD without needing to put credentials into your code. Under the covers, enabling MSI on a Virtual Machine via the Azure portal does two things: it registers your VM with Azure AD to create a managed identity and configures the identity on the VM.

1. Select the **Virtual Machine** that you want to enable MSI on.  
2. On the left navigation bar click **Configuration**. 
3. You see **Managed Service Identity**. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No. 
4. Ensure you click **Save** to save the configuration.  
   ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

## Create a Cosmos DB account 

If you don't already have one, create a Cosmos DB account. You can skip this step and use an existing Cosmos DB account. 

1. Click the **+/Create new service** button found on the upper left-hand corner of the Azure portal.
2. Click **Databases**, then **Azure Cosmos DB**, and a new "New account" panel  displays.
3. Enter an **ID** for the Cosmos DB account, which you use later.  
4. **API** should be set to "SQL." The approach described in this tutorial can be used with the other available API types, but the steps in this tutorial are for the SQL API.
5. Ensure the **Subscription** and **Resource Group** match the ones you specified when you created your VM in the previous step.  Select a **Location** where Cosmos DB is available.
6. Click **Create**.

## Create a collection in the Cosmos DB account

Next, add a data collection in the Cosmos DB account that you can query in later steps.

1. Navigate to your newly created Cosmos DB account.
2. On the **Overview** tab click the **+/Add Collection** button, and an "Add Collection" panel slides out.
3. Give the collection a database ID, collection ID, select a storage capacity, enter a partition key, enter a throughput value, then click **OK**.  For this tutorial, it is sufficient to use "Test" as the database ID and collection ID, select a fixed storage capacity and lowest throughput (400 RU/s).  

## Grant Windows VM MSI access to the Cosmos DB account access keys

Cosmos DB does not natively support Azure AD authentication. However, you can use an MSI to retrieve a Cosmos DB access key from the Resource Manager, and use the key to access Cosmos DB. In this step, you grant your MSI access to the keys to the Cosmos DB account.

To grant the MSI identity access to the Cosmos DB account in Azure Resource Manager using PowerShell, update the values for `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>`, and `<COSMOS DB ACCOUNT NAME>` for your environment. Replace `<MSI PRINCIPALID>` with the `principalId` property returned by the `az resource show` command in [Retrieve the principalID of the Linux VM's MSI](#retrieve-the-principalID-of-the-linux-VM's-MSI).  Cosmos DB supports two levels of granularity when using access keys:  read/write access to the account, and read-only access to the account.  Assign the `DocumentDB Account Contributor` role if you want to get read/write keys for the account, or assign the `Cosmos DB Account Reader Role` role if you want to get read-only keys for the account:

```azurepowershell
$spID = (Get-AzureRMVM -ResourceGroupName myRG -Name myVM).identity.principalid
New-AzureRmRoleAssignment -ObjectId $spID -RoleDefinitionName "Reader" -Scope "/subscriptions/<mySubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.Storage/storageAccounts/<myStorageAcct>"
```

## Get an access token using the Windows VM's MSI to call Azure Resource Manager

For the remainder of the tutorial, we will work from the VM we created earlier. 

You will need to use the Azure Resource Manager PowerShell cmdlets in this portion.  If you don’t have it installed, [download the latest version](https://docs.microsoft.com/powershell/azure/overview) before continuing.

You will also need to install the latest version of [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) on your Windows VM.

1. In the Azure portal, navigate to **Virtual Machines**, go to your Windows virtual machine, then from the **Overview** page click **Connect** at the top. 
2. Enter in your **Username** and **Password** for which you added when you created the Windows VM. 
3. Now that you have created a **Remote Desktop Connection** with the virtual machine, open PowerShell in the remote session.
4. Using Powershell’s Invoke-WebRequest, make a request to the local MSI endpoint to get an access token for Azure Resource Manager.

    ```powershell
        $response = Invoke-WebRequest -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F' -Method GET -Headers @{Metadata="true"}
    ```

    > [!NOTE]
    > The value of the "resource" parameter must be an exact match for what is expected by Azure AD. When using the Azure Resource Manager resource ID, you must include the trailing slash on the URI.
    
    Next, extract the "Content" element, which is stored as a JavaScript Object Notation (JSON) formatted string in the $response object. 
    
    ```powershell
    $content = $response.Content | ConvertFrom-Json
    ```
    Next, extract the access token from the response.
    
    ```powershell
    $ArmToken = $content.access_token
    ```

## Get access keys from Azure Resource Manager to make Cosmos DB calls

Now use PowerShell to call Resource Manager using the access token retrieved in the previous section to retrieve the Cosmos DB account access key. Once we have the access key, we can query Cosmos DB. Be sure to replace the `<SUBSCRIPTION ID>`, `<RESOURCE GROUP>`, and `<COSMOS DB ACCOUNT NAME>` parameter values with your own values. Replace the `<ACCESS TOKEN>` value with the access token you retrieved earlier.  If you want to retrieve read/write keys, use key operation type `listKeys`.  If you want to retrieve read-only keys, use the key operation type `readonlykeys`:

```powershell
Invoke-WebRequest -Uri https://management.azure.com/subscriptions/<SUBSCRIPTION-ID>/resourceGroups/<RESOURCE-GROUP>/providers/Microsoft.DocumentDb/databaseAccounts/<COSMOS DB ACCOUNT NAME>/listKeys/?api-version=2016-12-01 -Method POST -Headers @{Authorization="Bearer $ARMToken"}
```
The response give you the list of Keys.  For example, if you get read-only keys:

```powershell
{"primaryReadonlyMasterKey":"bWpDxS...dzQ==",
"secondaryReadonlyMasterKey":"38v5ns...7bA=="}
```
Now that you have the access key for the Cosmos DB account you can pass it to a Cosmos DB SDK and make calls to access the account.  For a quick example, you can pass the access key to the Azure CLI.  You can get the <COSMOS DB CONNECTION URL> from the **Overview** tab on the Cosmos DB account blade in the Azure portal.  Replace the <ACCESS KEY> with the value you obtained above:

```bash
az cosmosdb collection show -c <COLLECTION ID> -d <DATABASE ID> --url-connection "<COSMOS DB CONNECTION URL>" --key <ACCESS KEY>
```

This CLI command returns details about the collection:

```bash
{
  "collection": {
    "_conflicts": "conflicts/",
    "_docs": "docs/",
    "_etag": "\"00006700-0000-0000-0000-5a8271e90000\"",
    "_rid": "Es5SAM2FDwA=",
    "_self": "dbs/Es5SAA==/colls/Es5SAM2FDwA=/",
    "_sprocs": "sprocs/",
    "_triggers": "triggers/",
    "_ts": 1518498281,
    "_udfs": "udfs/",
    "id": "Test",
    "indexingPolicy": {
      "automatic": true,
      "excludedPaths": [],
      "includedPaths": [
        {
          "indexes": [
            {
              "dataType": "Number",
              "kind": "Range",
              "precision": -1
            },
            {
              "dataType": "String",
              "kind": "Range",
              "precision": -1
            },
            {
              "dataType": "Point",
              "kind": "Spatial"
            }
          ],
          "path": "/*"
        }
      ],
      "indexingMode": "consistent"
    }
  },
  "offer": {
    "_etag": "\"00006800-0000-0000-0000-5a8271ea0000\"",
    "_rid": "f4V+",
    "_self": "offers/f4V+/",
    "_ts": 1518498282,
    "content": {
      "offerIsRUPerMinuteThroughputEnabled": false,
      "offerThroughput": 400
    },
    "id": "f4V+",
    "offerResourceId": "Es5SAM2FDwA=",
    "offerType": "Invalid",
    "offerVersion": "V2",
    "resource": "dbs/Es5SAA==/colls/Es5SAM2FDwA=/"
  }
}
```

## Next steps

In this tutorial, you learned how to create a Windows Managed Service Identity to access Cosmos DB.  To learn more about Cosmos DB see:

> [!div class="nextstepaction"]
>[Azure Cosmos DB overview](/azure/cosmos-db/introduction)


