---
title: 'Create an Internet Analyzer test using CLI | Microsoft Docs'
description: In this article, learn how to create your first Internet Analyzer test by using Azure CLI. 
services: internet-analyzer
author: KumudD

ms.service: internet-analyzer
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 10/16/2019
ms.author: kumud
# Customer intent: As someone interested in migrating to Azure/ AFD/ CDN, I want to set up an Internet Analyzer test to understand the expected performance impact to my end users.
---
# Create an Internet Analyzer test using CLI (Preview)

There are two ways to create an Internet Analyzer resource - using the [Azure portal](internet-analyzer-create-test-portal.md) or using CLI. This section helps you create a new Azure Internet Analyzer resource using our CLI experience. 


> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

The public preview is available to use globally; however, data storage is limited to *US West 2* during preview.

## Object model
The Internet Analyzer CLI exposes the following types of resources:
* **Tests** - A test compares the end-user performance of two internet endpoints (A and B) over time.
* **Profiles** - Tests are created under an Internet Analyzer profile. Profiles allow for related tests to be grouped; a single profile may contain one or more tests.
* **Preconfigured Endpoints** - We have set up endpoints with a variety of configurations (regions, acceleration technologies, etc.). You may use any of these preconfigured endpoints in your tests.
* **Scorecards** - A scorecard provides quick and meaningful summaries of measurement results. Refer to [Interpreting your Scorecard](internet-analyzer-scorecard.md).
* **Time Series** - A time series shows how a metric changes over time.

## Profile and Test Creation
1. Get Internet Analyzer preview access by following the **How do I participate in the preview?** instructions from the [Azure Internet Analyzer FAQ](internet-analyzer-faq.md).
2. [Install the Azure CLI](/cli/azure/install-azure-cli).
3. Run the `login` command to start a CLI session:
    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.
    Otherwise, open a browser page at https://aka.ms/devicelogin and enter the authorization code displayed in your terminal.

4. Sign in with your account credentials in the browser.

5. Select your Subscription ID that has been granted access to the Internet Analyzer public preview.

    After logging in, you see a list of subscriptions associated with your Azure account. The subscription information with `isDefault: true` is the currently activated subscription after logging in. To select another subscription, use the [az account set](/cli/azure/account#az-account-set) command with the subscription ID to switch to. For more information about subscription selection, see [Use multiple Azure subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli).

    There are ways to sign in non-interactively, which are covered in detail in [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

6. **[Optional]** Create a new Azure Resource Group:
    ```azurecli-interactive
    az group create --location eastus --name "MyInternetAnalyzerResourceGroup"
    ```

7. Install the Azure CLI Internet Analyzer Extension:
     ```azurecli-interactive
    az extension add --name internet-analyzer
    ```

8. Create a new Internet Analyzer profile:
    ```azurecli-interactive
    az internet-analyzer profile create --location eastus --resource-group "MyInternetAnalyzerResourceGroup" --name "MyInternetAnalyzerProfile" --enabled-state Enabled
    ```

9. List all preconfigured endpoints available to the newly created profile:
    ```azurecli-interactive
    az internet-analyzer preconfigured-endpoint list --resource-group "MyInternetAnalyzerResourceGroup" --profile-name "MyInternetAnalyzerProfile"
    ```

10. Create a new test under the newly created InternetAnalyzer profile:
    ```azurecli-interactive
    az internet-analyzer test create --resource-group "MyInternetAnalyzerResourceGroup" --profile-name "MyInternetAnalyzerProfile" --endpoint-a-name "contoso" --endpoint-a-endpoint "www.contoso.com/some/path/to/trans.gif" --endpoint-b-name "microsoft" --endpoint-b-endpoint "www.microsoft.com/another/path/to/trans.gif" --name "MyFirstInternetAnalyzerTest" --enabled-state Enabled
    ```

    The command above assumes that both `www.contoso.com` and `www.microsoft.com` are hosting the one-pixel image ([trans.gif](https://fpc.msedge.net/apc/trans.gif)) under custom paths. If an object path isn't specified explicitly, Internet Analyzer will use `/apc/trans.gif` as the object path by default, which is where the preconfigured endpoints are hosting the one-pixel image. Also note that the schema (https/http) doesn't need to be specified; Internet Analyzer only supports HTTPS endpoints, so HTTPS is assumed.

11. The new test should appear under the Internet Analyzer profile:
    ```azurecli-interactive
    az internet-analyzer test list --resource-group "MyInternetAnalyzerResourceGroup" --profile-name "MyInternetAnalyzerProfile"
    ```

    Example output:
    ````
    [
        {
            "description": null,
            "enabledState": "Enabled",
            "endpointA": {
            "endpoint": "www.contoso.com/some/path/to/1k.jpg",
            "name": "contoso"
            },
            "endpointB": {
            "endpoint": "www.microsoft.com/another/path/to/1k.jpg",
            "name": "microsoft"
            },
            "id": "/subscriptions/faa9ddd0-9137-4659-99b7-cdc55a953342/resourcegroups/MyInternetAnalyzerResourceGroup/providers/Microsoft.Network/networkexperimentprofiles/MyInternetAnalyzerProfile/experiments/MyFirstInternetAnalyzerTest",
            "location": null,
            "name": "MyFirstInternetAnalyzerTest",
            "resourceGroup": "MyInternetAnalyzerResourceGroup",
            "resourceState": "Enabled",
            "scriptFileUri": "https://fpc.msedge.net/client/v2/d8c6fc64238d464c882cee4a310898b2/ab.min.js",
            "status": "Created",
            "tags": null,
            "type": "Microsoft.Network/networkexperimentprofiles/experiments"
        }
    ]
    ````

12. To begin generating measurements, the JavaScript file pointed to by the test's **scriptFileUri** must be embedded in your Web application. Specific instructions can be found on the [Embed Internet Analyzer Client](internet-analyzer-embed-client.md) page.

13. You can monitor the test's progress by keeping track of its "status" value:
    ```azurecli-interactive
    az internet-analyzer test show --resource-group "MyInternetAnalyzerResourceGroup" --profile-name "MyInternetAnalyzerProfile" --name "MyFirstInternetAnalyzerTest"
    ```

14. You can inspect the test's collected results by generating timeseries or scorecards for it:
    ```azurecli-interactive
    az internet-analyzer show-scorecard --resource-group "MyInternetAnalyzerResourceGroup" --profile-name "MyInternetAnalyzerProfile" --name "MyFirstInternetAnalyzerTest" --aggregation-interval "Daily" --end-date-time-utc "2019-10-24T00:00:00"
    ```

    ```azurecli-interactive
    az internet-analyzer show-timeseries --resource-group "MyInternetAnalyzerResourceGroup" --profile-name "MyInternetAnalyzerProfile" --name "MyFirstInternetAnalyzerTest" --aggregation-interval "Hourly" --start-date-time-utc "2019-10-23T00:00:00" --end-date-time-utc "2019-10-24T00:00:00" --timeseries-type MeasurementCounts
    ```


## Next steps

* Browse the [Internet Analyzer CLI reference](/cli/azure/internet-analyzer) for the full list of supported commands and usage examples.
* Read the [Internet Analyzer FAQ](internet-analyzer-faq.md).
* Learn more about embedding the [Internet Analyzer Client](internet-analyzer-embed-client.md) and creating a [custom endpoint](internet-analyzer-custom-endpoint.md).
