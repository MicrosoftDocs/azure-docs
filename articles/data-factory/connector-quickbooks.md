---
title: Copy Data from QuickBooks Online
description: Learn how to copy data from QuickBooks Online to supported sink data stores by using a copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
titleSuffix: Azure Data Factory & Azure Synapse
author: jianleishen
ms.author: jianleishen
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 10/14/2025
ms.custom:
  - synapse
  - sfi-image-nochange
---

# Copy data from QuickBooks Online by using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use the copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline to copy data from QuickBooks Online. It builds on the [overview article about the copy activity](copy-activity-overview.md).

> [!IMPORTANT]
> The QuickBooks connector version 1.0 is at [removal stage](connector-release-stages-and-timelines.md). You are recommended to [upgrade the QuickBooks connector](#quickbooks-connector-lifecycle-and-upgrade) from version 1.0 to 2.0.

## Supported capabilities

The QuickBooks connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks, see [Supported data stores](connector-overview.md#supported-data-stores).

The connector supports QuickBooks OAuth 2.0 authentication.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to QuickBooks by using the UI

1. In the [Azure portal](https://ms.portal.azure.com/), go to your Azure Data Factory or Azure Synapse workspace.

1. Go to the **Manage** tab, select **Linked services**, and then select **New**.

   # [Azure Data Factory](#tab/data-factory)

   :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of selections for creating a new linked service for Azure Data Factory.":::

   # [Azure Synapse](#tab/synapse-analytics)

   :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of selections for creating a new linked service for Azure Synapse.":::

1. Search for **QuickBooks**, and then select the QuickBooks connector.

   :::image type="content" source="media/connector-quickbooks/quickbooks-connector.png" alt-text="Screenshot of search results for the QuickBooks connector.":::

1. Configure the service details, test the connection, and create the new linked service.

   :::image type="content" source="media/connector-quickbooks/configure-quickbooks-linked-service.png" alt-text="Screenshot of the pane for linked service configuration for QuickBooks.":::

## Connector configuration details

You use properties to define Data Factory entities that are specific to the QuickBooks connector.

## Linked service properties

The QuickBooks connector now supports version 2.0. To upgrade your QuickBooks connector from version 1.0 to version 2.0, refer to the [procedure later in this article](#upgrade-the-quickbooks-connector-from-version-10-to-version-20). The following sections describe the property details for the two versions.

### Version 2.0

The QuickBooks linked service supports the following properties for connector version 2.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The type of the linked service. It must be set to `QuickBooks`. | Yes |
| `version` | The version that you specify. The value is `2.0`. | Yes |
| `endpoint` | The endpoint of the QuickBooks Online server. The value is `quickbooks.api.intuit.com`.  | Yes |
| `companyId` | The company ID of the QuickBooks company to authorize. For info about how to find the company ID, see the [QuickBooks Online help topic](https://quickbooks.intuit.com/community/Getting-Started/How-do-I-find-my-Company-ID/m-p/185551). | Yes |
| `consumerKey` | The client ID of your QuickBooks Online application for OAuth 2.0 authentication. [Learn more](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). | Yes |
| `consumerSecret` | The client secret of your QuickBooks Online application for OAuth 2.0 authentication. Mark this field as `SecureString` to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| `refreshToken` | The OAuth 2.0 refresh token associated with the QuickBooks application. [Learn more](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). Mark this field as `SecureString` to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). <br><br/>The refresh token expires after 180 days, so customers need to update it regularly.| Yes |

Here's an example:

```json
{
    "name": "QuickBooksLinkedService",
    "properties": {
        "type": "QuickBooks",
        "version": "2.0",
        "typeProperties": {
            "endpoint": "quickbooks.api.intuit.com",
            "companyId": "<company id>",
            "consumerKey": "<consumer key>", 
            "consumerSecret": {
                 "type": "SecureString",
                 "value": "<clientSecret>"
            },
            "refreshToken": {
                "type": "SecureString",
                "value": "<refresh token>"
            }
        }
    }
}
```

### Version 1.0

The QuickBooks linked service supports the following properties for connector version 1.0:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The type of the linked service. It must be set to `QuickBooks`. | Yes |
| `connectionProperties` | A group of properties that define how to connect to QuickBooks. | Yes |
| Under `connectionProperties`: | | |
| `endpoint` | The endpoint of the QuickBooks Online server. The value is `quickbooks.api.intuit.com`.  | Yes |
| `companyId` | The company ID of the QuickBooks company to authorize. For info about how to find the company ID, see the [QuickBooks Online help topic](https://quickbooks.intuit.com/community/Getting-Started/How-do-I-find-my-Company-ID/m-p/185551). | Yes |
| `consumerKey` | The client ID of your QuickBooks Online application for OAuth 2.0 authentication. [Learn more](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). | Yes |
| `consumerSecret` | The client secret of your QuickBooks Online application for OAuth 2.0 authentication. Mark this field as `SecureString` to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| `refreshToken` | The OAuth 2.0 refresh token associated with the QuickBooks application. [Learn more](https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0#obtain-oauth2-credentials-for-your-app). Mark this field as `SecureString` to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). <br><br/>The refresh token expires after 180 days, so customers need to update it regularly.| Yes |
| `useEncryptedEndpoints` | Specifies whether the data source endpoints are encrypted via HTTPS. The default value is `true`.  | No |

Here's an example:

```json
{
    "name": "QuickBooksLinkedService",
    "properties": {
        "type": "QuickBooks",
        "typeProperties": {
            "connectionProperties": {
                "endpoint": "quickbooks.api.intuit.com",
                "companyId": "<company id>",
                "consumerKey": "<consumer key>", 
                "consumerSecret": {
                     "type": "SecureString",
                     "value": "<clientSecret>"
              },
                "refreshToken": {
                     "type": "SecureString",
                     "value": "<refresh token>"
              },
                "useEncryptedEndpoints": true
            }
        }
    }
}
```

### Handling refresh tokens for the linked service

When you use the QuickBooks Online connector in a linked service, it's important to manage OAuth 2.0 refresh tokens from QuickBooks correctly.

The linked service uses a refresh token to obtain new access tokens. However, QuickBooks Online periodically updates the refresh token. This action invalidates the previous token.

The linked service doesn't automatically update the refresh token in Azure Key Vault, so you need to manage updating the refresh token to ensure uninterrupted connectivity. Otherwise, you might encounter authentication failures after the refresh token expires.

You can manually update the refresh token in Azure Key Vault based on the QuickBooks Online policy for expiry of refresh tokens. Another approach is to automate updates by using a scheduled task or an [Azure function](https://github.com/Azure-Samples/serverless-keyvault-secret-rotation-handling) that checks for a new refresh token and updates it in Azure Key Vault.

## Dataset properties

For a full list of available sections and properties for defining datasets, see [Datasets in Azure Data Factory and Azure Synapse Analytics](concepts-datasets-linked-services.md).

To copy data from QuickBooks Online, set the `type` property of the dataset to `QuickBooksObject`. The QuickBooks dataset supports the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The type of the dataset. It must be set to `QuickBooksObject`. | Yes |
| `tableName` | Name of the table.| No (if `query` in the activity source is specified) |

Here's an example:

```json
{
    "name": "QuickBooksDataset",
    "properties": {
        "type": "QuickBooksObject",
        "typeProperties": {},
        "schema": [],
        "linkedServiceName": {
            "referenceName": "<QuickBooks linked service name>",
            "type": "LinkedServiceReference"
        }
    }
}
```

The connector version 2.0 supports the following QuickBooks tables:

- Account
- Attachable
- Attachable_AttachableRef
- Attachable_AttachableRef_CustomField
- Bill
- BillPayment_Line
- BillPayment_Line_LinkedTxn
- Bill_Account_Based_Expense_Line
- Bill_Item_Based_Expense_Line
- Bill_LinkedTxn
- Bill_Payment
- Bill_TxnTaxDetail_TaxLine
- Budget
- Budget_Detail
- Class
- CompanyCurrency_CustomField
- CompanyInfo_NameValue
- Company_Currency
- Company_Info
- CreditCardPayment
- CreditMemo_CustomField
- CreditMemo_Description_Line
- CreditMemo_Discount_Line
- CreditMemo_Group_Individual_Item_Line
- CreditMemo_Group_Item_Line
- CreditMemo_Sales_Item_Line
- CreditMemo_Subtotal_Line
- CreditMemo_TxnTaxDetail_TaxLine
- Credit_Memo
- Customer
- CustomerType
- Department
- Deposit
- Deposit_CustomField
- Deposit_Line
- Deposit_Line_CustomField
- Deposit_Linked_Transaction_Detail
- Deposit_Linked_Transaction_Line
- Deposit_TxnTaxDetail_TaxLine
- Employee
- Estimate
- Estimate_CustomField
- Estimate_Description_Line
- Estimate_Discount_Line
- Estimate_Group_Individual_Item_Line
- Estimate_Group_Item_Line
- Estimate_LinkedTxn
- Estimate_Sales_Item_Line
- Estimate_Subtotal_Line
- Estimate_TxnTaxDetail_TaxLine
- Invoice
- Invoice_CustomField
- Invoice_Description_Line
- Invoice_Discount_Line
- Invoice_Group_Individual_Item_Line
- Invoice_Group_Item_Line
- Invoice_LinkedTxn
- Invoice_Sales_Item_Line
- Invoice_Subtotal_Line
- Invoice_TxnTaxDetail_TaxLine
- Item
- JournalCode_CustomField
- JournalEntry_Description_Line
- JournalEntry_Line
- JournalEntry_TxnTaxDetail_TaxLine
- Journal_Code
- Journal_Entry
- Payment
- Payment_Line
- Payment_Line_LinkedTxn
- Payment_Method
- Preferences
- Preferences_SalesFormsPrefs_CustomField
- Preferences_OtherPrefs_NameValue
- Preferences_VendorAndPurchasesPrefs_POCustomField
- Purchase
- Purchase_Account_Based_Expense_Line
- Purchase_Item_Based_Expense_Line
- Purchase_TxnTaxDetail_TaxLine
- Purchase_Order
- PurchaseOrder_CustomField
- PurchaseOrder_Account_Based_Expense_Line
- PurchaseOrder_Item_Based_Expense_Line
- PurchaseOrder_LinkedTxn
- PurchaseOrder_TxnTaxDetail_TaxLine
- RecurringTransaction
- RecurringTransactionLines
- RefundReceipt_CustomField
- RefundReceipt_Description_Line
- RefundReceipt_Discount_Line
- RefundReceipt_Group_Individual_Item_Line
- RefundReceipt_Group_Item_Line
- RefundReceipt_Sales_Item_Line
- RefundReceipt_Subtotal_Line
- RefundReceipt_TxnTaxDetail_TaxLine
- Refund_Receipt
- ReimburseCharge
- ReimburseCharge_Line
- SalesReceipt_CustomField
- SalesReceipt_Description_Line
- SalesReceipt_Discount_Line
- SalesReceipt_Group_Individual_Item_Line
- SalesReceipt_Group_Item_Line
- SalesReceipt_Sales_Item_Line
- SalesReceipt_Subtotal_Line
- SalesReceipt_TxnTaxDetail_TaxLine
- Sales_Receipt
- TaxClassification
- TaxCode_PurchaseTaxRateList_TaxRateDetail
- TaxCode_SalesTaxRateList_TaxRateDetail
- Tax_Agency
- Tax_Code
- Tax_Rate
- Term
- Time_Activity
- Transfer
- Vendor
- VendorCredit_Account_Based_Expense_Line
- VendorCredit_Item_Based_Expense_Line
- Vendor_Credit

## Copy activity properties

For a full list of sections and properties available for defining activities, see [Pipelines and activities in Azure Data Factory and Azure Synapse Analytics](concepts-pipelines-activities.md). This section provides a list of properties that the QuickBooks source supports.

### QuickBooks as source

To copy data from QuickBooks Online, set the source type in the copy activity to `QuickBooksSource`. The QuickBooks dataset supports the following properties in the copy activity's `source` section:

| Property | Description | Required |
|:--- |:--- |:--- |
| `type` | The type of the copy activity source. It must be set to `QuickBooksSource`. | Yes |
| `query` | Use the custom SQL query to read data. <br><br>For version 2.0 of the QuickBooks connector, you can use only the QuickBooks native query, with limitations. For more information, see [Query operations and syntax](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries) on the Intuit Developer site. <br><br>For version 1.0 of the QuickBooks connector, you can use the SQL-92 query. For example: `"SELECT * FROM "Bill" WHERE Id = '123'"`. | No (if `tableName` in the dataset is specified) |

Here's an example:

```json
"activities":[
    {
        "name": "CopyFromQuickBooks",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<QuickBooks input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "QuickBooksSource",
                "query": "SELECT * FROM \"Bill\" WHERE Id = '123' "
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

For a full list of available sections and properties for defining activities, see [Pipelines and activities in Azure Data Factory and Azure Synapse Analytics](concepts-pipelines-activities.md).

## Copy data from QuickBooks Desktop

The copy activity in the service can't copy data directly from QuickBooks Desktop. To copy data from QuickBooks Desktop, export your QuickBooks data to a comma-separated values (CSV) file and then upload the file to Azure Blob Storage. From there, you can use the service to copy the data to the sink of your choice.

## Data type mapping for Quickbooks

When you copy data from QuickBooks, the following mappings apply from the QuickBooks data types to the internal data types that the service uses. To learn about how the copy activity maps the source schema and data type to the sink, see [Schema and data type mapping in copy activity](copy-activity-schema-and-type-mapping.md).

| QuickBooks data type | Interim service data type (for version 2.0) | Interim service data type (for version 1.0) |
|:--- |:--- |:--- |
| `String`| `string`| `string` |
| `Boolean` | `bool` | `bool` |
| `DateTime` | `datetime` | `datetime` |
| `Decimal` | `decimal (15,2)`  | `decimal (15, 2)` |
| `Enum` | `string` | `string` |
| `Date` | `datetime` | `datetime` |
| `BigDecimal` | `decimal (15,2)` | `decimal (15, 2)` |
| `Integer` | `int` | `int` |

## Lookup activity properties

For details about the properties of the lookup activity, see [Lookup activity in Azure Data Factory and Azure Synapse Analytics](control-flow-lookup-activity.md).

## Quickbooks connector lifecycle and upgrade

The following table summarizes information about the versions of the QuickBooks connector:

| Version  | Release stage | Change log |  
| :----------- | :------- |:------- |
| 1.0 | Removed | Not applicable. |  
| 2.0 | General availability |QuickBooks native query is supported, with limitations. `GROUP BY` clauses, `JOIN` clauses, and aggregate functions (`Avg`, `Max`, `Sum`) aren't supported. For more information, see [Query operations and syntax](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries) on the Intuit Developer site. <br><br>The SQL-92 query is not supported. <br><br>The `useEncryptedEndpoints` property is not supported. <br><br>Support specific Quickbooks tables. For the supported table list, go to [Dataset properties](#dataset-properties). |

### Upgrade the Quickbooks connector from version 1.0 to version 2.0

1. In the Azure portal, go to your Azure Data Factory or Azure Synapse workspace.

1. Go to the **Manage** tab, select **Linked services**, and then select **Edit** for the linked service.

1. On the **Edit linked service** pane, select **2.0** for the version. For more information, see the [linked service properties for version 2.0](#version-20) earlier in this article.

1. If you use a SQL query in the copy activity source or the lookup activity that refers to the version 1.0 linked service, you need to convert it to the QuickBooks native query. Learn more about the native query from [Copy activity properties](#copy-activity-properties) earlier in this article and from [Query operations and syntax](https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries) on the Intuit Developer site.
1. Note that version 2.0 supports specific Quickbooks tables. For the supported table list, go to [Dataset properties](#dataset-properties).

## Related content

- For a list of data stores that the copy activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
