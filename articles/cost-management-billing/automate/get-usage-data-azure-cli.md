# Get usage data with the Azure CLI

\&lt;Content taken from article below. I have also made some changes. We should remove this content from this other article: [View and download Azure usage and charges | Microsoft Docs\&gt;](https://docs.microsoft.com/en-us/azure/cost-management-billing/understand/download-azure-daily-usage) We should also put a reference to usage details automation in this article.

This article outlines steps you can take to get cost and usage data using the Azure CLI.

# Set up the Azure CLI

Start by preparing your environment for the Azure CLI:

- Use the Bash environment in [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart).
- ![](RackMultipart20211008-4-h44kmg_html_f1aa5f2874a702a2.png)
- If you prefer, [install](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) the Azure CLI to run CLI reference commands.

  - If you&#39;re using a local installation, sign in to the Azure CLI by using the [az login](https://docs.microsoft.com/en-us/cli/azure/reference-index#az_login) command. To finish the authentication process, follow the steps displayed in your terminal. For additional sign-in options, see [Sign in with the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli).
  - When you&#39;re prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/azure-cli-extensions-overview).
  - Run [az version](https://docs.microsoft.com/en-us/cli/azure/reference-index?#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](https://docs.microsoft.com/en-us/cli/azure/reference-index?#az_upgrade).

# Configure an Export job to export your cost data to Azure storage

After you sign in, use the [az costmanagement export](https://docs.microsoft.com/en-us/cli/azure/costmanagement/export) commands to export usage data to an Azure storage account. You can download the data from there.

1. Create a resource group or use an existing resource group. To create a resource group, run the [az group create](https://docs.microsoft.com/en-us/cli/azure/group#az_group_create) command:
2. Azure CLICopy
3. az group create --name TreyNetwork --location&quot;East US&quot;
4. Create a storage account to receive the exports or use an existing storage account. To create an account, use the [az storage account create](https://docs.microsoft.com/en-us/cli/azure/storage/account#az_storage_account_create) command:
5. Azure CLICopy
6. az storage account create --resource-group TreyNetwork --name cmdemo
7. Run the [az costmanagement export create](https://docs.microsoft.com/en-us/cli/azure/costmanagement/export#az_costmanagement_export_create) command to create the export:
8. Azure CLICopy
9. az costmanagement export create --name DemoExport --type Usage \--scope&quot;subscriptions/00000000-0000-0000-0000-000000000000&quot;--storage-account-id cmdemo \--storage-container democontainer --timeframe MonthToDate --storage-directory demodirectory

# Get cost summaries for a scope

You also have the option of using the [az costmanagement query](https://docs.microsoft.com/en-us/cli/azure/costmanagement#az_costmanagement_query) command to query month-to-date usage information for your subscription. This will give you summarized cost data instead of the raw usage data. To learn more about querying your cost data, see [Query API](https://docs.microsoft.com/en-us/rest/api/cost-management/query/usage).

az costmanagement query --timeframe MonthToDate --type Usage \ --scope&quot;subscriptions/00000000-0000-0000-0000-000000000000&quot;

You can also narrow the query by using the **--dataset-filter** parameter or other parameters:

az costmanagement query --timeframe MonthToDate --type Usage \ --scope&quot;subscriptions/00000000-0000-0000-0000-000000000000&quot; \ --dataset-filter&quot;{\&quot;and\&quot;:[{\&quot;or\&quot;:[{\&quot;dimension\&quot;:{\&quot;name\&quot;:\&quot;ResourceLocation\&quot;,\&quot;operator\&quot;:\&quot;In\&quot;,\&quot;values\&quot;:[\&quot;East US\&quot;,\&quot;West Europe\&quot;]}},{\&quot;tag\&quot;:{\&quot;name\&quot;:\&quot;Environment\&quot;,\&quot;operator\&quot;:\&quot;In\&quot;,\&quot;values\&quot;:[\&quot;UAT\&quot;,\&quot;Prod\&quot;]}}]},{\&quot;dimension\&quot;:{\&quot;name\&quot;:\&quot;ResourceGroup\&quot;,\&quot;operator\&quot;:\&quot;In\&quot;,\&quot;values\&quot;:[\&quot;API\&quot;]}}]}&quot;

The **--dataset-filter** parameter takes a JSON string or @json-file.

## **Next steps**

- Get an overview of how to ingest usage data \&lt;Link needed\&gt;
- [Create and manage exported data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data) in the Azure Portal with Exports.
- [Automate Export creation](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale) and ingestion at scale using the API.
- Understand usage details fields \&lt;Link needed\&gt;
- Learn how to get small usage datasets on demand \&lt;Link needed\&gt;