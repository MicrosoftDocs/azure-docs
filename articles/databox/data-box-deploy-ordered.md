---
title: Tutorial to order Azure Data Box | Microsoft Docs
description: In this tutorial, learn about Azure Data Box, a hybrid solution that allows you to import on-premises data into Azure, and how to order Azure Data Box.
services: databox
author: stevenmatthew
ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 03/25/2024
ms.author: shaas
ms.custom: devx-track-azurepowershell, devx-track-azurecli
#Customer intent: As an IT admin, I need to be able to order Data Box to upload on-premises data from my server onto Azure.
---
# Tutorial: Order Azure Data Box

Azure Data Box is a hybrid solution that allows you to import your on-premises data into Azure in a quick, easy, and reliable way. You transfer your data to a Microsoft-supplied storage device with 80 TB of usable capacity, and then ship the device back. This data is then uploaded to Azure.

This tutorial describes how you can order an Azure Data Box. In this tutorial, you learn about:   

> [!div class="checklist"]
>
> * Prerequisites to deploy Data Box
> * Order a Data Box
> * Track the order
> * Cancel the order

> [!NOTE]
> To get answers to frequently asked questions about Data Box orders and shipments, see [Data Box FAQ](data-box-faq.yml).

## Prerequisites

Complete the following configuration prerequisites for the Data Box service and device before you deploy the device:

# [Portal](#tab/portal)

[!INCLUDE [Prerequisites](../../includes/data-box-deploy-ordered-prerequisites.md)]

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [Prerequisites](../../includes/data-box-deploy-ordered-prerequisites.md)]

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

You can sign in to Azure and run Azure CLI commands in one of two ways:

* You can install the CLI and run CLI commands locally.
* You can run CLI commands from within the Azure portal, in Azure Cloud Shell.

We use Azure CLI through Windows PowerShell for the tutorial, but you're free to choose either option.

### For Azure CLI

Before you begin, make sure that:

#### Install the CLI locally

* Install [Azure CLI](/cli/azure/install-azure-cli) version 2.0.67 or later. Or [install using MSI](https://aka.ms/installazurecliwindows) instead.

**Sign in to Azure**

Open up a Windows PowerShell command window and sign in to Azure with the [az sign in](/cli/azure/reference-index#az-login) command:

```azurecli
PS C:\Windows> az login
```

The output confirms a successful sign-in:

```output
You have logged in. Now let us find all the subscriptions to which you have access.
[
   {
      "cloudName": "AzureCloud",
      "homeTenantId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "isDefault": true,
      "managedByTenants": [],
      "name": "My Subscription",
      "state": "Enabled",
      "tenantId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "user": {
          "name": "gusp@contoso.com",
          "type": "user"
      }
   }
]
```

**Install the Azure Data Box CLI extension**

Before you can use the Azure Data Box CLI commands, you need to install the extension. Azure CLI extensions give you access to experimental and prerelease commands before shipping as part of the core CLI. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

To install the extension for Azure Data Box, run the following command: `az extension add --name databox`:

```azurecli

    PS C:\Windows> az extension add --name databox
```

If the extension is installed successfully, the following output is displayed:

```output
    The installed extension 'databox' is experimental and not covered by customer support. Please use with discretion.
    PS C:\Windows>

    # az databox help

    PS C:\Windows> az databox -h

    Group
        az databox

    Subgroups:
        job [Experimental] : Commands to manage databox job.

    For more specific examples, use: az find "az databox"

        Please let us know how we are doing: https://aka.ms/clihats
```

#### Use Azure Cloud Shell

You can use [Azure Cloud Shell](https://shell.azure.com/), an Azure hosted interactive shell environment, through your browser to run CLI commands. Azure Cloud Shell supports Bash or Windows PowerShell with Azure services. The Azure CLI is preinstalled and configured to use with your account. Select the Cloud Shell button on the menu in the upper-right section of the Azure portal:

![Cloud Shell menu selection](../storage/common/media/storage-quickstart-create-account/cloud-shell-menu.png)

The button launches an interactive shell that you can use to run the steps outlined in this how-to article.

# [PowerShell](#tab/azure-ps)

[!INCLUDE [Prerequisites](../../includes/data-box-deploy-ordered-prerequisites.md)]

### For Azure PowerShell

Before you begin, make sure that you:

* Install Windows PowerShell 6.2.4 or higher.
* Install Azure PowerShell (AZ) module.
* Install Azure Data Box (Az.DataBox) module.
* Sign in to Azure.

#### Install Azure PowerShell and modules locally

**Install or upgrade Windows PowerShell**

You need to have Windows PowerShell version 6.2.4 or higher installed. To find out what version of PowerShell is installed, run: `$PSVersionTable`.

The following sample output confirms that version 6.2.3 is installed:

```azurepowershell
    PS C:\users\gusp> $PSVersionTable
    
    Name                           Value
    ----                           -----
    PSVersion                      6.2.3
    PSEdition                      Core
    GitCommitId                    6.2.3
    OS                             Microsoft Windows 10.0.18363
    Platform                       Win32NT
    PSCompatibleVersions           {1.0, 2.0, 3.0, 4.0…}
    PSRemotingProtocolVersion      2.3
    SerializationVersion           1.1.0.1
    WSManStackVersion              3.0
```

If your version is lower than 6.2.4, you need to upgrade your version of Windows PowerShell. To install the latest version of Windows PowerShell, see [Install Azure PowerShell](/powershell/scripting/install/installing-powershell).

**Install Azure PowerShell and Data Box modules**

You need to install the Azure PowerShell modules to use Azure PowerShell to order an Azure Data Box. To install the Azure PowerShell modules:

1. Install the [Az PowerShell module](/powershell/azure/new-azureps-module-az).
2. Then install Az.DataBox using the command `Install-Module -Name Az.DataBox`.

```azurepowershell
PS C:\PowerShell\Modules> Install-Module -Name Az.DataBox
PS C:\PowerShell\Modules> Get-InstalledModule -Name "Az.DataBox"

Version              Name                                Repository           Description
-------              ----                                ----------           -----------
0.1.1                Az.DataBox                          PSGallery            Microsoft Azure PowerShell - DataBox ser…
```

#### Sign in to Azure

Open up a Windows PowerShell command window and sign in to Azure with the [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) command:

```azurepowershell
PS C:\Windows> Connect-AzAccount
```

The following sample output confirms a successful sign-in:

```output
WARNING: To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FSBFZMBKC to authenticate.

Account              SubscriptionName                          TenantId                             Environment
-------              ----------------                          --------                             -----------
gusp@contoso.com     MySubscription                            aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa AzureCloud

PS C:\Windows\System32>
```

For detailed information on how to sign in to Azure using Windows PowerShell, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

---

## Order Data Box

To order a device, perform the following steps:

# [Portal](#tab/portal)

[!INCLUDE [order-data-box-via-portal](../../includes/data-box-order-portal.md)]

# [Azure CLI](#tab/azure-cli)

1. Write down your settings for your Data Box order. These settings include your personal/business information, subscription name, device information, and shipping information. These settings are used as parameters when running the CLI command to create the Data Box order. The following table shows the parameter settings used for `az databox job create`:

   | Setting (parameter) | Description |  Sample value |
   |---|---|---|
   |resource-group| Use an existing or create a new one. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name| The name of the order you're creating. | "mydataboxorder"|
   |contact-name| The name associated with the shipping address. | "Gus Poland"|
   |phone| The phone number of the person or business receiving the order.| "14255551234" |
   |location| The nearest Azure region used to ship the device.| "US West"|
   |sku| The specific Data Box device you're ordering. Valid values are: "DataBox", "DataBoxDisk", and "DataBoxHeavy"| "DataBox" |
   |email-list| The email addresses associated with the order.| "gusp@contoso.com" |
   |street-address1| The street address to which the order is shipped. | "15700 NE 39th St" |
   |street-address2| The secondary address information, such as apartment number or building number. | "Building 123" |
   |city| The city to which the device is shipped. | "Redmond" |
   |state-or-province| The state to which the device is shipped.| "WA" |
   |country| The country to which the device is shipped. | "United States" |
   |postal-code| The zip code or postal code associated with the shipping address.| "98052"|
   |company-name| The name of your company you work for.| "Contoso, LTD" |
   |storage account| The Azure Storage account from where you want to import data.| "mystorageaccount"|
   |debug| Include debugging information to verbose logging  | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query &lt;string&gt;|
   |verbose| Include verbose logging. | --verbose |

2. In your command-prompt of choice or terminal, run [az data box job create](/cli/azure/databox/job#az-databox-job-create) to create your Azure Data Box order.

   ```azurecli
   az databox job create --resource-group <resource-group> --name <order-name> --location <azure-location> --sku <databox-device-type> --contact-name <contact-name> --phone <phone-number> --email-list <email-list> --street-address1 <street-address-1> --street-address2 <street-address-2> --city "contact-city" --state-or-province <state-province> --country <country> --postal-code <postal-code> --company-name <company-name> --storage-account "storage-account"
   ```

   The following sample command illustrates the command's usage:

   ```azurecli
   az databox job create --resource-group "myresourcegroup" \
                         --name "mydataboxtest3" \
                         --location "westus" \
                         --sku "DataBox" \
                         --contact-name "Gus Poland" \
                         --phone "14255551234" \
                         --email-list "gusp@contoso.com" \
                         --street-address1 "15700 NE 39th St" \
                         --street-address2 "Bld 25" \
                         --city "Redmond" \
                         --state-or-province "WA" \
                         --country "US" \
                         --postal-code "98052" \
                         --company-name "Contoso" \
                         --storage-account mystorageaccount
   ```

   The following sample output confirms successful job creation:

   ```output
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   {
     "cancellationReason": null,
     "deliveryInfo": {
        "scheduledDateTime": "0001-01-01T00:00:00+00:00"
   },
   "deliveryType": "NonScheduled",
   "details": null,
   "error": null,
   "id": "/subscriptions/[GUID]/resourceGroups/myresourcegroup/providers/Microsoft.DataBox/jobs/mydataboxtest3",
   "identity": {
     "type": "None"
   },
   "isCancellable": true,
   "isCancellableWithoutFee": true,
   "isDeletable": false,
   "isShippingAddressEditable": true,
   "location": "westus",
   "name": "mydataboxtest3",
   "resourceGroup": "myresourcegroup",
   "sku": {
     "displayName": null,
     "family": null,
     "name": "DataBox"
   },
   "startTime": "2020-06-10T23:28:27.354241+00:00",
   "status": "DeviceOrdered",
   "tags": {},
   "type": "Microsoft.DataBox/jobs"

   }
   PS C:\Windows>

   ```

3. Unless the default output is modified, all Azure CLI commands return a json response. You can change the output format by using the global parameter `--output <output-format>`. Changing the format to "table" improves output readability.

   The following example contains the same command, but with the modified `--output` parameter value to alter the formatted response:

    ```azurecli
    az databox job create --resource-group "myresourcegroup" --name "mydataboxtest4" --location "westus" --sku "DataBox" --contact-name "Gus Poland" --phone "14255551234" --email-list "gusp@contoso.com" --street-address1 "15700 NE 39th St" --street-address2 "Bld 25" --city "Redmond" --state-or-province "WA" --country "US" --postal-code "98052" --company-name "Contoso" --storage-account mystorageaccount --output "table"
   ```

   The following sample response illustrates the modified output format:

   ```output

    Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
    DeliveryType    IsCancellable    IsCancellableWithoutFee    IsDeletable    IsShippingAddressEditable    Location    Name            ResourceGroup    StartTime                         Status
    --------------  ---------------  -------------------------  -------------  ---------------------------  ----------  --------------  ---------------  --------------------------------  -------------
    NonScheduled    True             True                       False          True                         westus      mydataboxtest4  myresourcegroup  2020-06-18T03:48:00.905893+00:00  DeviceOrdered

    ```

# [PowerShell](#tab/azure-ps)

Do the following steps using Azure PowerShell to order a device:

1. Before creating the import order, fetch your storage account and save the object in a variable.

   ```azurepowershell
    $storAcct = Get-AzStorageAccount -Name "mystorageaccount" -ResourceGroup "myresourcegroup"
   ```

2. Write down your settings for your Data Box order. These settings include your personal/business information, subscription name, device information, and shipping information. These settings are used as parameters when running the PowerShell cmdlet to create the Data Box order. The following table shows the parameter settings used for [New-AzDataBoxJob](/powershell/module/az.databox/New-AzDataBoxJob).

    | Setting (parameter) | Description |  Sample value |
    |---|---|---|
    |ResourceGroupName [Required]| Use an existing resource group. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
    |Name [Required]| The name of the order you're creating. | "mydataboxorder"|
    |ContactName [Required]| The name associated with the shipping address. | "Gus Poland"|
    |PhoneNumber [Required]| The phone number of the person or business receiving the order.| "14255551234"
    |Location [Required]| The nearest Azure region to you that ships your device.| "WestUS"|
    |DataBoxType [Required]| The specific Data Box device you're ordering. Valid values are: "DataBox", "DataBoxDisk", and "DataBoxHeavy"| "DataBox" |
    |EmailId [Required]| The email addresses associated with the order.| "gusp@contoso.com" |
    |StreetAddress1 [Required]| The street address to where the order is shipped. | "15700 NE 39th St" |
    |StreetAddress2| The secondary address information, such as apartment number or building number. | "Building 123" |
    |StreetAddress3| The tertiary address information. | |
    |City [Required]| The city to which the device is shipped. | "Redmond" |
    |StateOrProvinceCode [Required]| The state to which the device is shipped.| "WA" |
    |CountryCode [Required]| The country to which the device is shipped. | "United States" |
    |PostalCode [Required]| The zip code or postal code associated with the shipping address.| "98052"|
    |CompanyName| The name of your company you work for.| "Contoso, LTD" |
    |StorageAccountResourceId [Required]| The Azure Storage account ID from where you want to import data.| &lt;AzstorageAccount&gt;.id |

3. Use the [New-AzDataBoxJob](/powershell/module/az.databox/New-AzDataBoxJob) cmdlet to create your Azure Data Box order as shown in the following example.

   ```azurepowershell
    PS> $storAcct = Get-AzureStorageAccount -StorageAccountName "mystorageaccount"
    PS> New-AzDataBoxJob -Location "WestUS" \
                         -StreetAddress1 "15700 NE 39th St" \
                         -PostalCode "98052" \
                         -City "Redmond" \
                         -StateOrProvinceCode "WA" \
                         -CountryCode "US" \
                         -EmailId "gusp@contoso.com" \
                         -PhoneNumber 4255551234 \
                         -ContactName "Gus Poland" \
                         -StorageAccount $storAcct.id \
                         -DataBoxType DataBox \
                         -ResourceGroupName "myresourcegroup" \
                         -Name "myDataBoxOrderPSTest"
   ```

   The following sample output confirms job creation:

   ```output
    jobResource.Name     jobResource.Sku.Name jobResource.Status jobResource.StartTime jobResource.Location ResourceGroup
    ----------------     -------------------- ------------------ --------------------- -------------------- -------------
    myDataBoxOrderPSTest DataBox              DeviceOrdered      07-06-2020 05:25:30   westus               myresourcegroup
   ```

---

## Track the order

# [Portal](#tab/portal)

After you place the order, you can track the status of the order from Azure portal. Go to your Data Box order and then go to **Overview** to view the status. The portal shows the order in **Ordered** state.

If the device isn't available, you receive a notification. If the device is available, Microsoft identifies the device and prepares it for shipment. The following actions occur during device preparation:

* SMB shares are created for each storage account associated with the device.
* For each share, access credentials such as username and password are generated.
* The device password is generated. This password is used to unlock the device.
* The device is locked to prevent unauthorized access at any point.

When the device preparation is complete, the portal shows the order in a **Processed** state.

:::image type="content" source="media/data-box-overview/data-box-order-status-processed.png" alt-text="Screenshot of a Data Box order that's been processed." lightbox="media/data-box-overview/data-box-order-status-processed-lrg.png":::

Microsoft then prepares and dispatches your device via a regional carrier. You receive a tracking number after the device is shipped. The portal shows the order in **Dispatched** state.

:::image type="content" source="media/data-box-overview/data-box-order-status-dispatched.png" alt-text="Screenshot of a Data Box order that's been dispatched." lightbox="media/data-box-overview/data-box-order-status-dispatched-lrg.png":::

# [Azure CLI](#tab/azure-cli)

### Track a single order

To get tracking information about a single, existing Azure Data Box order, run [`az databox job show`](/cli/azure/databox/job#az-databox-job-show). The command displays information about the order such as, but not limited to: name, resource group, tracking information, subscription ID, contact information, shipment type, and device sku.

   ```azurecli
   az databox job show --resource-group <resource-group> --name <order-name>
   ```

   The following table shows the parameter information for `az databox job show`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group associated with the order. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name [Required]| The name of the order to be displayed. | "mydataboxorder"|
   |debug| Include debugging information to verbose logging | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query &lt;string&gt;|
   |verbose| Include verbose logging. | --verbose |

   The following example contains the same command, but with the `output` parameter value set to "table":

   ```azurecli
    PS C:\WINDOWS\system32> az databox job show --resource-group "myresourcegroup" \
                                                --name "mydataboxtest4" \
                                                --output "table"
   ```

   The following sample response shows the modified output format:

   ```output
    Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
    DeliveryType    IsCancellable    IsCancellableWithoutFee    IsDeletable    IsShippingAddressEditable    Location    Name            ResourceGroup    StartTime                         Status
    --------------  ---------------  -------------------------  -------------  ---------------------------  ----------  --------------  ---------------  --------------------------------  -------------
    NonScheduled    True             True                       False          True                         westus      mydataboxtest4  myresourcegroup  2020-06-18T03:48:00.905893+00:00  DeviceOrdered
   ```

> [!NOTE]
> List order can be supported at subscription level, making the `resource group` parameter optional rather than required.

### List all orders

When ordering multiple devices, you can run [`az databox job list`](/cli/azure/databox/job#az-databox-job-list) to view all your Azure Data Box orders. The command lists all orders that belong to a specific resource group. Also displayed in the output: order name, shipping status, Azure region, delivery type, order status. Canceled orders are also included in the list.
The command also displays time stamps of each order.

```azurecli
az databox job list --resource-group <resource-group>
```

The following table shows the parameter information for `az databox job list`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group that contains the orders. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |debug| Include debugging information to verbose logging | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query &lt;string&gt;|
   |verbose| Include verbose logging. | --verbose |

   The following example shows the command with the output format specified as "table":

   ```azurecli
    PS C:\WINDOWS\system32> az databox job list --resource-group "GDPTest" --output "table"
   ```

   The following sample response displays the output with modified formatting:

   ```output
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   CancellationReason                                               DeliveryType    IsCancellable    IsCancellableWithoutFee    IsDeletable    IsShippingAddressEditable    Location    Name                 ResourceGroup    StartTime                         Status
   ---------------------- ----------------------------------------  --------------  ---------------  -------------------------  -------------  ---------------------------  ----------  -------------------  ---------------  --------------------------------  -------------
   OtherReason This was a test order for documentation purposes.    NonScheduled    False            False                      True           False                        westus      gdpImportTest        MyResGrp         2020-05-26T23:20:57.464075+00:00  Cancelled
   NoLongerNeeded This order was created for documentation purposes.NonScheduled    False            False                      True           False                        westus      mydataboxExportTest  MyResGrp         2020-05-27T00:04:16.640397+00:00  Cancelled
   IncorrectOrder                                                   NonScheduled    False            False                      True           False                        westus      mydataboxtest2       MyResGrp         2020-06-10T16:54:23.509181+00:00  Cancelled
                                                                    NonScheduled    True             True                       False          True                         westus      mydataboxtest3       MyResGrp         2020-06-11T22:05:49.436622+00:00  DeviceOrdered
                                                                    NonScheduled    True             True                       False          True                         westus      mydataboxtest4       MyResGrp         2020-06-18T03:48:00.905893+00:00  DeviceOrdered
   PS C:\WINDOWS\system32>
   ```

# [PowerShell](#tab/azure-ps)

### Track a single order

To get tracking information about a single, existing Azure Data Box order, run [Get-AzDataBoxJob](/powershell/module/az.databox/Get-AzDataBoxJob). The command displays information about the order such as, but not limited to: name, resource group, tracking information, subscription ID, contact information, shipment type, and device sku.

> [!NOTE]
> `Get-AzDataBoxJob` is used for displaying both single and multiple orders. The difference is that you specify the order name for single orders.

   ```azurepowershell
    Get-AzDataBoxJob -ResourceGroupName <String> -Name <String>
   ```

   The following table shows the parameter information for `Get-AzDataBoxJob`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |ResourceGroup [Required]| The name of the resource group associated with the order. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |Name [Required]| The name of the order to get information for. | "mydataboxorder"|
   |ResourceId| The ID of the resource associated with the order. |  |

   The following example can be used to retrieve details about a specific order:

   ```azurepowershell
   Get-AzDataBoxJob -ResourceGroupName "myResourceGroup" -Name "myDataBoxOrderPSTest"
   ```

   The following example output indicates that the command was completed successfully:

   ```output
   jobResource.Name     jobResource.Sku.Name jobResource.Status jobResource.StartTime jobResource.Location ResourceGroup
   ----------------     -------------------- ------------------ --------------------- -------------------- -------------
   myDataBoxOrderPSTest DataBox              DeviceOrdered      7/7/2020 12:37:16 AM  WestUS               myResourceGroup
   ```

### List all orders

To view all your Azure Data Box orders, run the [`Get-AzDataBoxJob`](/powershell/module/az.databox/Get-AzDataBoxJob) cmdlet. The cmdlet lists all orders that belong to a specific resource group. The resulting output also contains additional data such as order name, shipping status, Azure region, delivery type, order status, and the time stamp associated with each order. Canceled orders are also included in the list. 

The following example can be used to retrieve details about all orders associated to a specific Azure resource group:

```azurepowershell
Get-AzDataBoxJob -ResourceGroupName <String>
```

The following example output indicates that the command was completed successfully:

```output
jobResource.Name     jobResource.Sku.Name jobResource.Status jobResource.StartTime jobResource.Location ResourceGroup
----------------     -------------------- ------------------ --------------------- -------------------- -------------
guspImportTest       DataBox              Cancelled          5/26/2020 11:20:57 PM WestUS               myResourceGroup
mydataboxExportTest  DataBox              Cancelled          5/27/2020 12:04:16 AM WestUS               myResourceGroup
mydataboximport1     DataBox              Cancelled          6/26/2020 11:00:34 PM WestUS               myResourceGroup
myDataBoxOrderPSTest DataBox              Cancelled          7/07/2020 12:37:16 AM WestUS               myResourceGroup
mydataboxtest2       DataBox              Cancelled          6/10/2020 4:54:23  PM WestUS               myResourceGroup
mydataboxtest4       DataBox              DeviceOrdered      6/18/2020 3:48:00  AM WestUS               myResourceGroup
PS C:\WINDOWS\system32>
```

---

## Cancel the order

After placing an order, you can cancel it at any point before the order status is marked processed.

# [Portal](#tab/portal)

To cancel and delete an order using the Azure portal, select **Overview** from within the command bar. To cancel the order, select the **Cancel** option. To delete a canceled order, select the **Delete** option.

# [Azure CLI](#tab/azure-cli)

### Cancel an order

Use the [`az databox job cancel`](/cli/azure/databox/job#az-databox-job-cancel) command to cancel a Data Box order. You're required to specify your reason for canceling the order.

   The following table provides parameter information for the `az databox job cancel` command:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group associated with the order to be deleted. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name [Required]| The name of the order to be deleted. | "mydataboxorder"|
   |reason [Required]| The reason for canceling the order. | "I entered erroneous information and needed to cancel the order." |
   |yes| Don't prompt for confirmation. | --yes (-y)| 
   |debug| Include debugging information to verbose logging | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query &lt;string&gt;|
   |verbose| Include verbose logging. | --verbose |

   The following sample command can be used to cancel a specific Data Box order:

   ```azurecli
   az databox job cancel --resource-group "myresourcegroup" --name "mydataboxtest3" --reason "Our migration plan was modified and we are ordering a device using a different cost center."
   ```

   The following example output indicates that the command was completed successfully:

   ```output
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   Are you sure you want to perform this operation? (y/n): y
   ```

### Delete an order

After you cancel an Azure Data Box order, use the [`az databox job delete`](/cli/azure/databox/job#az-databox-job-delete) command to delete the order.

   The following table shows the parameter information for `az databox job delete`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group associated with the order to be deleted. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name [Required]| The name of the order to be deleted. | "mydataboxorder"|
   |subscription| The name or ID (GUID) of your Azure subscription. | "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" |
   |yes| Don't prompt for confirmation. | --yes (-y)|
   |debug| Include debugging information to verbose logging | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query &lt;string&gt;|
   |verbose| Include verbose logging. | --verbose |

The following example can be used to delete a specific Data Box order after being canceled:

   ```azurecli
   az databox job delete --resource-group "myresourcegroup" --name "mydataboxtest3" --yes --verbose
   ```

   The following example output indicates that the command was completed successfully:

   ```output
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   command ran in 1.142 seconds.
   ```

# [PowerShell](#tab/azure-ps)

### Cancel an order

You can cancel an Azure Data Box order using the [Stop-AzDataBoxJob](/powershell/module/az.databox/stop-azdataboxjob) cmdlet. You're required to specify your reason for canceling the order.

The following table shows the parameter information for `Stop-AzDataBoxJob`:

| Parameter | Description |  Sample value |
|---|---|---|
|ResourceGroup [Required]| The name of the resource group associated with the order to be canceled. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
|Name [Required]| The name of the order to be deleted. | "mydataboxorder"|
|Reason [Required]| The reason for canceling the order. | "I entered erroneous information and needed to cancel the order." |
|Force | Forces the cmdlet to run without user confirmation. | -Force |

The following example can be used to delete a specific Data Box order after being canceled:

```azurepowershell
Stop-AzDataBoxJob -ResourceGroupName myResourceGroup \
    -Name "myDataBoxOrderPSTest" \
    -Reason "I entered erroneous information and need to cancel and re-order."
```

  The following example output indicates that the command was completed successfully:

```output
Confirm
"Cancelling Databox Job "myDataBoxOrderPSTest
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): y
```

### Delete an order

After canceling an Azure Data Box order, you can delete it using the [`Remove-AzDataBoxJob`](/powershell/module/az.databox/remove-azdataboxjob) cmdlet.

The following table shows parameter information for `Remove-AzDataBoxJob`:

| Parameter | Description |  Sample value |
|---|---|---|
|ResourceGroup [Required]| The name of the resource group associated with the order to be deleted. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
|Name [Required]| The name of the order to be deleted. | "mydataboxorder"|
|Force | Forces the cmdlet to run without user confirmation. | -Force |

The following example can be used to delete a specific Data Box order after canceling:

```azurepowershell
Remove-AzDataBoxJob -ResourceGroup "myresourcegroup" \
    -Name "mydataboxtest3"
```

The following example output indicates that the command was completed successfully:

```output
Confirm
"Removing Databox Job "mydataboxtest3
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): y
```

---

## Next steps

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
>
> * Prerequisites to deploy Data Box
> * Ordering Data Box
> * Tracking the Data Box order
> * Canceling the Data Box order

Advance to the next tutorial to learn how to set up your Data Box.

> [!div class="nextstepaction"]
> [Set up your Azure Data Box](./data-box-deploy-set-up.md)
