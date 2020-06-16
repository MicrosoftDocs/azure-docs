---
title: Tutorial to order Azure Data Box | Microsoft Docs
description: Learn the deployment prerequisites and how to order an Azure Data Box
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 04/23/2019
ms.author: alkohli
#Customer intent: As an IT admin, I need to be able to order Data Box to upload on-premises data from my server onto Azure.
---
# Tutorial: Order Azure Data Box

Azure Data Box is a hybrid solution that allows you to import your on-premises data into Azure in a quick, easy, and reliable way. You transfer your data to a Microsoft-supplied 80 TB (usable capacity) storage device and then ship the device back. This data is then uploaded to Azure.

This tutorial describes how you can order an Azure Data Box. In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Prerequisites to deploy Data Box
> * Order a Data Box
> * Track the order
> * Cancel the order

# [Portal](#tab/portal)

## Prerequisites

Complete the following configuration prerequisites for Data Box service and device before you deploy the device:

[!INCLUDE [Prerequisites](../../includes/data-box-deploy-ordered-prerequisites.md)]

## Order Data Box

Perform the following steps in the Azure portal to order a device.

1. Use your Microsoft Azure credentials to sign in at this URL: [https://portal.azure.com](https://portal.azure.com).
2. Click **+ Create a resource** and search for *Azure Data Box*. Click **Azure Data Box**.

   [![Search Azure Data Box 1](media/data-box-deploy-ordered/search-azure-data-box1.png)](media/data-box-deploy-ordered/search-azure-data-box1.png#lightbox)

3. Click **Create**.

4. Check if Data Box service is available in your region. Enter or select the following information and click **Apply**.

    |Setting  |Value  |
    |---------|---------|
    |Subscription     | Select an EA, CSP, or Azure sponsorship subscription for Data Box service. <br> The subscription is linked to your billing account.       |
    |Transfer type     | Select **Import to Azure**.        |
    |Source country/region    |    Select the country/region where your data currently resides.         |
    |Destination Azure region     |     Select the Azure region where you want to transfer data.        |

5. Select **Data Box**. The maximum usable capacity for a single order is 80 TB. You can create multiple orders for larger data sizes.

      [![Select Data Box option 1](media/data-box-deploy-ordered/select-data-box-option1.png)](media/data-box-deploy-ordered/select-data-box-option1.png#lightbox)

6. In **Order**, specify the **Order details**. Enter or select the following information and click **Next**.

    |Setting  |Value  |
    |---------|---------|
    |Name     |  Provide a friendly name to track the order. <br> The name can have between 3 and 24 characters that can be letters, numbers, and hyphens. <br> The name must start and end with a letter or a number.      |
    |Resource group     |    Use an existing or create a new one. <br> A resource group is a logical container for the resources that can be managed or deployed together.         |
    |Destination Azure region     | Select a region for your storage account. <br> For more information, go to [region availability](data-box-overview.md#region-availability).        |
    |Storage destination     | Choose from storage account or managed disks or both. <br> Based on the specified Azure region, select one or more storage accounts from the filtered list of an existing storage account. Data Box can be linked with up to 10 storage accounts. <br> You can also create a new **General-purpose v1**, **General-purpose v2**, or **Blob storage account**. <br>Storage accounts with virtual networks are supported. To allow Data Box service to work with secured storage accounts, enable the trusted services within the storage account network firewall settings. For more information, see how to [Add Azure Data Box as a trusted service](../storage/common/storage-network-security.md#exceptions).|

    If using storage account as the storage destination, you see the following screenshot:

    ![Data Box order for storage account](media/data-box-deploy-ordered/order-storage-account.png)

    If using Data Box to create managed disks from the on-premises virtual hard disks (VHDs), you will also need to provide the following information:

    |Setting  |Value  |
    |---------|---------|
    |Resource groups     | Create new resource groups if you intend to create managed disks from on-premises VHDs. You can use an existing resource group only if the resource group was created previously when creating a Data Box order for managed disk by Data Box service. <br> Specify multiple resource groups separated by semi-colons. A maximum of 10 resource groups are supported.|

    ![Data Box order for managed disk](media/data-box-deploy-ordered/order-managed-disks.png)

    The storage account specified for managed disks is used as a staging storage account. The Data Box service uploads the VHDs as page blobs to the staging storage account before converting it into managed disks and moving it to the resource groups. For more information, see [Verify data upload to Azure](data-box-deploy-picked-up.md#verify-data-upload-to-azure).

7. In the **Shipping address**, provide your first and last name, name and postal address of the company, and a valid phone number. Click **Validate address**. The service validates the shipping address for service availability. If the service is available for the specified shipping address, you receive a notification to that effect.

   After the order is placed successfully, if self-managed shipping was selected, you will receive an email notification. For more information about self-managed shipping, see [Use self-managed shipping](data-box-portal-customer-managed-shipping.md).

8. Click **Next** once the shipping details have been validated successfully.

9. In the **Notification details**, specify email addresses. The service sends email notifications regarding any updates to the order status to the specified email addresses.

    We recommend that you use a group email so that you continue to receive notifications if an admin in the group leaves.

10. Review the information **Summary** related to the order, contact, notification, and privacy terms. Check the box corresponding to the agreement to privacy terms.

11. Click **Order**. The order takes a few minutes to be created.

## Track the order

After you have placed the order, you can track the status of the order from Azure portal. Go to your Data Box order and then go to **Overview** to view the status. The portal shows the order in **Ordered** state.

If the device is not available, you receive a notification. If the device is available, Microsoft identifies the device for shipment and prepares the shipment. During device preparation, following actions occur:

* SMB shares are created for each storage account associated with the device.
* For each share, access credentials such as username and password are generated.
* Device password that helps unlock the device is also generated.
* The Data Box is locked to prevent unauthorized access to the device at any point.

When the device preparation is complete, the portal shows the order in **Processed** state.

![Data Box order processed](media/data-box-overview/data-box-order-status-processed.png)

Microsoft then prepares and dispatches your device via a regional carrier. You receive a tracking number once the device is shipped. The portal shows the order in **Dispatched** state.

![Data Box order dispatched](media/data-box-overview/data-box-order-status-dispatched.png)

## Cancel the order

To cancel this order, in the Azure portal, go to **Overview** and click **Cancel** from the command bar.

After placing an order, you can cancel it at any point before the order status is marked processed.

To delete a canceled order, go to **Overview** and click **Delete** from the command bar.

# [Azure CLI](#tab/azure-cli)

## Prequisites

Before you begin, you must have:

* Installed [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) version 2.0.67 or later. Alternatively, you may [install using MSI](https://aka.ms/installazurecliwindows).

[!INCLUDE [Prerequisites](../../includes/data-box-deploy-ordered-prerequisites.md)]

[!INCLUDE [Azure Cloud Shell](../../includes/cloud-shell-try-it.md)]

### Azure Cloud Shell

For this tutorial, we use Windows PowerShell to run Azure CLI commands. Alternatively, you can use Azure Cloud Shell, an Azure hosted interactive shell environment through your browser. You can use either Bash or PowerShell with Cloud Shell to work with Azure services. You can use the Cloud Shell preinstalled commands to run the code in this article without having to install anything on your local environment.

To start Azure Cloud Shell:

| Option | Example/Link |
|-----------------------------------------------|---|
| Select **Try It** in the upper-right corner of a code block. Selecting **Try It** doesn't automatically copy the code to Cloud Shell. | ![Example of Try It for Azure Cloud Shell](./media/cloud-shell-try-it/hdi-azure-cli-try-it.png) |
| Go to [https://shell.azure.com](https://shell.azure.com), or select the **Launch Cloud Shell** button to open Cloud Shell in your browser. | [![Launch Cloud Shell in a new window](media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com) |
| Select the **Cloud Shell** button on the menu bar at the upper right in the [Azure portal](https://portal.azure.com). | ![Cloud Shell button in the Azure portal](./media/cloud-shell-try-it/hdi-cloud-shell-menu.png) |

To run the code in this article in Azure Cloud Shell:

1. Start Cloud Shell.

2. Select the **Copy** button on a code block to copy the code.

3. Paste the code into the Cloud Shell session by selecting **Ctrl**+**Shift**+**V** on Windows and Linux or by selecting **Cmd**+**Shift**+**V** on macOS.

4. Select **Enter** to run the code.

## Prepare your environment

1. Open up a Windows PowerShell command window and sign in to Azure with the [az login](/cli/azure/reference-index#az-login) command. Follow the steps displayed in Azure CLI  to complete the authentication process.

   Here is an example that shows how to sign in to Azure:

    ```azurecli

    PS C:\Windows> az login
    ```

    If you log in successfully, you will see the following output:

    ```azurecli

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

2. Install the Azure Data Box CLI extension.

   When working with extension references for the Azure CLI, you must first install the extension. Azure CLI extensions give you access to experimental and pre-release commands that have not yet shipped as part of the core CLI. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

   To install the extension for Azure Data Box, run the following command: `az extension add --name databox`.

   Here is an example of command usage:

    ```azurecli

    PS C:\Windows> az extension add --name databox
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

   For instructions to install CLI extensions, see [Use extensions with Azure CLI](https://docs.microsoft.com/cli/azure/azure-cli-extensions-overview?view=azure-cli-latest).

## Change the output format type

For all Azure CLI commands discussed in this tutorial, output format is set to .json by default. You can change the output format by using the global parameter `--output <output-type>`. For example:

```azurecli
PS C:\Windows>az databox job show --resource-group "myresourcegroup" --name "mydataboxorder" --output "yaml"

```

Azure Data Box CLI supports the following output formats:

* json (default setting)
* jsonc
* table
* tsv
* yaml
* yamlc
* none

You can use this parameter with all Azure Data Box job CLI commands.

## Create an order

Perform the following steps to create a device order:

1. Write down your settings for your Data Box order. These settings include your personal/business information, subscription name, device information, and shipping information. You will need to use these settings as parameters when running the CLI command to create the Data Box order. The following table shows the parameter settings used for `az databox job create`:

   | Setting (parameter) | Description |  Sample value |
   |---|---|---|
   |resource-group| Use an existing or create a new one. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name| The name of the order you are creating. | "mydataboxorder"|
   |contact-name| The name associated with the shipping address. | "Gus Poland"|
   |phone| The phone number of the person or business that will receive the order.| "14255551234"
   |location| The nearest Azure region to you that will be shipping your device.| "US West"|
   |sku| The specific Data Box device you are ordering. Valid values are: "DataBox", "DataBoxDisk", and "DataBoxHeavy"| "DataBox" |
   |email-list| The email addresses associated with the order.| "gusp@contoso.com" |
   |street-address1| The street address to where the order will be shipped. | "15700 NE 39th St" |
   |street-address2| The secondary address information, such as apartment number or building number. | "Bld 123" |
   |city| The city that the device will be shipped to. | "Redmond" |
   |state-or-province| The state where the device will be shipped.| "WA" |
   |country| The country that the device will be shipped. | "United States" |
   |postal-code| The zip code or postal code associated with the shipping address.| "98052"|
   |company-name| The name of your company you work for.| "Contoso, LTD" |
   |storage account| The Azure Storage account from where you want to import data.| "mystorageaccount"|
   |debug| Include debugging information to verbose logging (implies --verbose) | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query <string>|
   |verbose| Include verbose logging. | --verbose |

2. In your command-prompt of choice or terminal, use the [az databox job create](https://docs.microsoft.com/cli/azure/ext/databox/databox/job?view=azure-cli-latest#ext-databox-az-databox-job-create) to create your Azure Data Box order.

   ```azurecli
   az databox job create --resource-group <resource-group> --name <order-name> --location <azure-location> --sku <databox-device-type> --contact-name <contact-name> --phone <phone-number> --email-list <email-list> --street-address1 <street-address-1> --street-address2 <street-address-2> --city "contact-city" --state-or-province <state-province> --country <country> --postal-code <postal-code> --company-name <company-name> --storage-account "storage-account"
   ```

   Here's an example of command usage:

   ```azurecli
   az databox job create --resource-group "myresourcegroup" --name "mydataboxtest3" --location "westus" --sku "DataBox" --contact-name "Gus Poland" --phone "14255551234" --email-list "gusp@contoso.com" --street-address1 "15700 NE 39th St" --street-address2 "Bld 25" --city "Redmond" --state-or-province "WA" --country "US" --postal-code "98052" --company-name "Contoso" --storage-account mystorageaccount

   ```

   After you run the command, you see the following output:

   ```azurecli
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   {
     "cancellationReason": null,
     "deliveryInfo": {
        "scheduledDateTime": "0001-01-01T00:00:00+00:00"
   },
   "deliveryType": "NonScheduled",
   "details": null,
   "error": null,
   "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.DataBox/jobs/mydataboxtest3",
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

### Track an order

You can get tracking information about an existing Azure Data Box order using [az databox job show](https://docs.microsoft.com/cli/azure/ext/databox/databox/job?view=azure-cli-latest#ext-databox-az-databox-job-show). The command displays information about the order such as, but not limited to: name, resource group, order state, subscription ID, contact information, shipment type, and device sku.

   ```azurecli
   az databox job show --resource-group <resource-group> --name <order-name>
   ```

   The following table shows the parameter information for `az databox job show`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group associated with the order. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name [Required]| The name of the order to be displayed. | "mydataboxorder"|
   |debug| Include debugging information to verbose logging (implies --verbose) | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query <string>|
   |verbose| Include verbose logging. | --verbose |

   Here's an example of the command with output:

   ```azurecli
    PS C:\WINDOWS\system32> az databox job show --resource-group "myresourcegroup" --name "mydataboxtest3"

    Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
    {
      "cancellationReason": null,
      "deliveryInfo": {
        "scheduledDateTime": "0001-01-01T00:00:00+00:00"
      },
      "deliveryType": "NonScheduled",
      "details": {
        "chainOfCustodySasKey": null,
        "contactDetails": {
          "contactName": "Gus Poland",
          "emailList": [
            "gusp@contoso.com"
          ],
          "mobile": null,
          "notificationPreference": [
            {
              "sendNotification": true,
              "stageName": "DevicePrepared"
            },
            {
              "sendNotification": true,
              "stageName": "Dispatched"
            },
            {
              "sendNotification": true,
              "stageName": "Delivered"
            },
            {
              "sendNotification": true,
              "stageName": "PickedUp"
            },
            {
              "sendNotification": true,
              "stageName": "AtAzureDC"
            },
            {
              "sendNotification": true,
              "stageName": "DataCopy"
            }
          ],
          "phone": "14255551234",
          "phoneExtension": null
        },
        "copyLogDetails": [],
        "copyProgress": [],
        "dataImportDetails": [
          {
            "accountDetails": {
              "dataAccountType": "StorageAccount",
              "storageAccountId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
            }
          }
        ],
        "deliveryPackage": {
          "carrierName": "",
          "trackingId": "",
          "trackingUrl": ""
        },
        "destinationAccountDetails": [
          {
            "accountId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
            "dataDestinationType": "StorageAccount",
            "sharePassword": null,
            "storageAccountId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount"
          }
        ],
        "devicePassword": null,
        "errorDetails": null,
        "expectedDataSizeInTerabytes": null,
        "jobDetailsType": "DataBox",
        "jobStages": [
          {
            "displayName": "Ordered",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "DeviceOrdered",
            "stageStatus": "Succeeded",
            "stageTime": "2020-06-11T22:05:53.134066+00:00"
          },
          {
            "displayName": "Processed",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "DevicePrepared",
            "stageStatus": "None",
            "stageTime": null
          },
          {
            "displayName": "Dispatched",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "Dispatched",
            "stageStatus": "None",
            "stageTime": null
          },
          {
            "displayName": "Delivered",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "Delivered",
            "stageStatus": "None",
            "stageTime": null
          },
          {
            "displayName": "Picked up",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "PickedUp",
            "stageStatus": "None",
            "stageTime": null
          },
          {
            "displayName": "Received",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "AtAzureDC",
            "stageStatus": "None",
            "stageTime": null
          },
          {
            "displayName": "Data copy in progress",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "DataCopy",
            "stageStatus": "None",
            "stageTime": null
          },
          {
            "displayName": "Completed",
            "errorDetails": null,
            "jobStageDetails": null,
            "stageName": "Completed",
            "stageStatus": "None",
            "stageTime": null
          }
        ],
        "keyEncryptionKey": {
          "kekType": "MicrosoftManaged"
        },
        "preferences": null,
        "returnPackage": {
          "carrierName": "",
          "trackingId": "",
          "trackingUrl": ""
        },
        "reverseShipmentLabelSasKey": null,
        "shippingAddress": {
          "addressType": "None",
          "city": "Redmond",
          "companyName": "Contoso",
          "country": "US",
          "postalCode": "98052",
          "stateOrProvince": "WA",
          "streetAddress1": "15700 NE 39th St",
          "streetAddress2": "Bld 25",
          "streetAddress3": null,
          "zipExtendedCode": null
        }
      },
      "error": null,
      "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.DataBox/jobs/mydataboxtest3",
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
      "startTime": "2020-06-11T22:05:49.436622+00:00",
      "status": "DeviceOrdered",
      "tags": {},
      "type": "Microsoft.DataBox/jobs"
    }
    PS C:\WINDOWS\system32>

   ```

## List all orders

If you have ordered multiple devices, you can view all your Azure Data Box orders using [az databox job list](https://docs.microsoft.com/cli/azure/ext/databox/databox/job?view=azure-cli-latest#ext-databox-az-databox-job-list). The command lists all orders that belong to a specific resource group. Also displayed in the output: order name, shipping status, Azure region, delivery type, order status. Cancelled order are also included in the list.
The command also displays time stamps of each order.

   ```azurecli
   az databox job list --resource-group <resource-group>
   ```

The following table shows the parameter information for `az databox job list`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group that contains the orders. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |debug| Include debugging information to verbose logging (implies --verbose) | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query <string>|
   |verbose| Include verbose logging. | --verbose |

   Here's an example of the command with output:

   ```azurecli
   PS C:\Windows> az databox job list --resource-group "myresourcegroup"
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   [
      {
         "cancellationReason": "OtherReason This was a test order for documentation purposes.",
         "deliveryInfo": {
               "scheduledDateTime": "0001-01-01T00:00:00+00:00"
         },
         "deliveryType": "NonScheduled",
         "details": null,
         "error": null,
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.DataBox/jobs/mydataboxImportTest2",
         "identity": {
               "type": "None"
           },
         "isCancellable": false,
         "isCancellableWithoutFee": false,
         "isDeletable": true,
         "isShippingAddressEditable": false,
         "location": "westus",
         "name": "mydataboxImportTest2",
         "resourceGroup": "myresourcegroup",
         "sku": {
            "displayName": null,
            "family": null,
            "name": "DataBox"
         },
         "startTime": "2020-05-26T23:20:57.464075+00:00",
         "status": "Cancelled",
         "tags": {},
         "type": "Microsoft.DataBox/jobs"
      },
      {
         "cancellationReason": "I entered erroneous data for the order and needed to cancel.",
         "deliveryInfo": {
            "scheduledDateTime": "0001-01-01T00:00:00+00:00"
         },
         "deliveryType": "NonScheduled",
         "details": null,
         "error": null,
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.DataBox/jobs/mydataboxImportTest",
         "identity": {
            "type": "None"
         },
         "isCancellable": false,
         "isCancellableWithoutFee": false,
         "isDeletable": true,
         "isShippingAddressEditable": false,
         "location": "westus",
         "name": "mydataboxImportTest2",
         "resourceGroup": "myresourcegroup",
         "sku": {
            "displayName": null,
            "family": null,
            "name": "DataBox"
         },
         "startTime": "2020-05-27T00:04:16.640397+00:00",
         "status": "Cancelled",
         "tags": {},
         "type": "Microsoft.DataBox/jobs"
      },
      {
         "cancellationReason": "IncorrectOrder null",
         "deliveryInfo": {
            "scheduledDateTime": "0001-01-01T00:00:00+00:00"
         },
         "deliveryType": "NonScheduled",
         "details": null,
         "error": null,
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.DataBox/jobs/mydataboxtest2",
         "identity": {
            "type": "None"
         },
         "isCancellable": false,
         "isCancellableWithoutFee": false,
         "isDeletable": true,
         "isShippingAddressEditable": false,
         "location": "westus",
         "name": "mydataboxtest2",
         "resourceGroup": "myresourcegroup",
         "sku": {
            "displayName": null,
            "family": null,
            "name": "DataBox"
         },
         "startTime": "2020-06-10T16:54:23.509181+00:00",
         "status": "Cancelled",
         "tags": {},
         "type": "Microsoft.DataBox/jobs"
      },
      {
         "cancellationReason": "CancelTest",
         "deliveryInfo": {
            "scheduledDateTime": "0001-01-01T00:00:00+00:00"
         },
         "deliveryType": "NonScheduled",
         "details": null,
         "error": null,
         "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.DataBox/jobs/mydataboxtest3",
         "identity": {
            "type": "None"
         },
         "isCancellable": false,
         "isCancellableWithoutFee": false,
         "isDeletable": true,
         "isShippingAddressEditable": false,
         "location": "westus",
         "name": "mydataboxtest3",
         "resourceGroup": "myresourcegroup",
         "sku": {
            "displayName": null,
            "family": null,
            "name": "DataBox"
         },
         "startTime": "2020-06-10T23:28:27.354241+00:00",
         "status": "Cancelled",
         "tags": {},
         "type": "Microsoft.DataBox/jobs"
      }
   ]

```

## Cancel an order

You can cancel an Azure Data Box order using [az databox job cancel](https://docs.microsoft.com/cli/azure/ext/databox/databox/job?view=azure-cli-latest#ext-databox-az-databox-job-cancel).

   ```azurecli
   az databox job cancel --resource-group <resource-group> --name <order-name> --reason <cancel-description>
   ```

   The following table shows the parameter information for `az databox job cancel`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group associated with the order to be deleted. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name [Required]| The name of the order to be deleted. | "mydataboxorder"|
   |reason [Required]| The reason for cancelling the order. | "I entered erroneous information and needed to cancel the order." |
   |yes| Do not prompt for confirmation. | --yes (-y)| --yes -y |
   |debug| Include debugging information to verbose logging (implies --verbose) | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query <string>|
   |verbose| Include verbose logging. | --verbose |

   Here's an example of the command with output:

   ```azurecli
   PS C:\Windows> az databox job cancel --resource-group "myresourcegroup" --name "mydataboxtest3" --reason "Our budget was slashed due to **redacted** and we can no longer afford this device."
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   Are you sure you want to perform this operation? (y/n): y
   PS C:\Windows>
   ```

## Delete an order

If you have cancelled an Azure Data Box order, you may delete the order using [az databox job delete](https://docs.microsoft.com/cli/azure/ext/databox/databox/job?view=azure-cli-latest#ext-databox-az-databox-job-delete).

   ```azurecli
   az databox job delete --name [-n] <order-name> --resource-group <resource-group> [--yes] [--verbose]
   ```

   The following table shows the parameter information for `az databox job delete`:

   | Parameter | Description |  Sample value |
   |---|---|---|
   |resource-group [Required]| The name of the resource group associated with the order to be deleted. A resource group is a logical container for the resources that can be managed or deployed together. | "myresourcegroup"|
   |name [Required]| The name of the order to be deleted. | "mydataboxorder"|
   |subscription| The name or ID (GUID) of your Azure subscription. | "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" |
   |yes| Do not prompt for confirmation. | --yes (-y)| --yes -y |
   |debug| Include debugging information to verbose logging (implies --verbose) | --debug |
   |help| Display help information for this command. | --help -h |
   |only-show-errors| Only show errors, suppressing warnings. | --only-show-errors |
   |output -o| Sets the output format.  Allowed values: json, jsonc, none, table, tsv, yaml, yamlc. The default value is json. | --output "json" |
   |query| The JMESPath query string. For more information, see [JMESPath](http://jmespath.org/). | --query <string>|
   |verbose| Include verbose logging. | --verbose |

Here's an example of the command with output:

   ```azurecli
   PS C:\Windows> az databox job delete --resource-group "myresourcegroup" --name "mydataboxtest3" --yes --verbose
   Command group 'databox job' is experimental and not covered by customer support. Please use with discretion.
   command ran in 1.142 seconds.
   PS C:\Windows>
   ```

---

## Next steps

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
>
> * Prerequisites to deploy Data Box
> * Order Data Box
> * Track the order
> * Cancel the order

Advance to the next tutorial to learn how to set up your Data Box.

> [!div class="nextstepaction"]
> [Set up your Azure Data Box](./data-box-deploy-set-up.md)
