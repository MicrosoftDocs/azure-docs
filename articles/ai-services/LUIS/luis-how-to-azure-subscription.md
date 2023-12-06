---
title: How to create and manage LUIS resources
titleSuffix: Azure AI services
description: Learn how to use and manage Azure resources for LUIS.the app.
#services: cognitive-services
author: aahill
ms.author: aahi
manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: how-to
ms.date: 07/19/2022
ms.custom: contperf-fy21q4, devx-track-azurecli 
ms.devlang: azurecli
---

# How to create and manage LUIS resources

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


Use this article to learn about the types of Azure resources you can use with LUIS, and how to manage them.

## Authoring Resource

An authoring resource lets you create, manage, train, test, and publish your applications. One [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/) is available for the LUIS authoring resource - the free (F0) tier, which gives you:

* 1 million authoring transactions 
* 1,000 testing prediction endpoint requests per month.

You can use the [v3.0-preview LUIS Programmatic APIs](https://westus.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f) to manage authoring resources. 

## Prediction resource

A prediction resource lets you query your prediction endpoint beyond the 1,000 requests provided by the authoring resource. Two [pricing tiers](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/) are available for the prediction resource:

* The free (F0) prediction resource, which gives you 10,000 prediction endpoint requests monthly.
* Standard (S0) prediction resource, which is the paid tier. 

You can use the [v3.0-preview LUIS Endpoint API](https://westus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0-preview/operations/5f68f4d40a511ce5a7440859) to manage prediction resources.

> [!Note]
> * You can also use a [multi-service resource](../multi-service-resource.md?pivots=azcli) to get a single endpoint you can use for multiple Azure AI services.
> * LUIS provides two types of F0 (free tier) resources: one for authoring transactions and one for prediction transactions. If you're running out of free quota for prediction transactions, make sure you're using the F0 prediction resource, which gives you a 10,000 free transactions monthly, and not the authoring resource, which gives you 1,000 prediction transactions monthly.
> * You should author LUIS apps in the [regions](luis-reference-regions.md#publishing-regions) where you want to publish and query.

## Create LUIS resources

To create LUIS resources, you can use the LUIS portal, [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne), or Azure CLI. After you've created your resources, you'll need to assign them to your apps to be used by them.

# [LUIS portal](#tab/portal)

### Create a LUIS authoring resource using the LUIS portal

1. Sign in to the [LUIS portal](https://www.luis.ai), select your country/region and agree to the terms of use. If you see the **My Apps** section in the portal, a LUIS resource already exists and you can skip the next step.

2. In the **Choose an authoring** window that appears, find your Azure subscription, and LUIS authoring resource. If you don't have a resource, you can create a new one.

    :::image type="content" source="./media/luis-how-to-azure-subscription/choose-authoring-resource.png" alt-text="Choose a type of Language Understanding authoring resource.":::
    
    When you create a new authoring resource, provide the following information:
    * **Tenant name**: the tenant your Azure subscription is associated with.
    * **Azure subscription name**: the subscription that will be billed for the resource.
    * **Azure resource group name**: a custom resource group name you choose or create. Resource groups allow you to group Azure resources for access and management.
    * **Azure resource name**: a custom name you choose, used as part of the URL for your authoring and prediction endpoint queries.
    * **Pricing tier**: the pricing tier determines the maximum transaction per second and month.

### Create a LUIS Prediction resource using the LUIS portal

[!INCLUDE [Create LUIS Prediction resource in LUIS portal](./includes/add-prediction-resource-portal.md)]

# [Without LUIS portal](#tab/without-portal)

### Create LUIS resources without using the LUIS portal

Use the [Azure CLI](/cli/azure/install-azure-cli) to create each resource individually.

> [!TIP]
> * The authoring resource `kind` is `LUIS.Authoring`  
> * The prediction resource `kind` is `LUIS` 

1. Sign in to the Azure CLI:

    ```azurecli
    az login
    ```

    This command opens a browser so you can select the correct account and provide authentication.

2. Create a LUIS authoring resource of kind `LUIS.Authoring`, named `my-luis-authoring-resource`. Create it in the _existing_ resource group named `my-resource-group` for the `westus` region.

    ```azurecli
    az cognitiveservices account create -n my-luis-authoring-resource -g my-resource-group --kind LUIS.Authoring --sku F0 -l westus --yes
    ```

3. Create a LUIS prediction endpoint resource of kind `LUIS`, named `my-luis-prediction-resource`. Create it in the _existing_ resource group named `my-resource-group` for the `westus` region. If you want higher throughput than the free tier provides, change `F0` to `S0`. [Learn more about pricing tiers and throughput.](luis-limits.md#resource-usage-and-limits)

    ```azurecli
    az cognitiveservices account create -n my-luis-prediction-resource -g my-resource-group --kind LUIS --sku F0 -l westus --yes
    ```

---


## Assign LUIS resources

Creating a resource doesn't necessarily mean that it is put to use, you need to assign it to your apps. You can assign an authoring resource for a single app or for all apps in LUIS.

# [LUIS portal](#tab/portal)

### Assign resources using the LUIS portal

**Assign an authoring resource to all your apps** 

 The following procedure assigns the authoring resource to all apps.

1. Sign in to the [LUIS portal](https://www.luis.ai).
1. In the upper-right corner, select your user account, and then select **Settings**.
1. On the **User Settings** page, select **Add authoring resource**, and then select an existing authoring resource. Select **Save**.

**Assign a resource to a specific app**

The following procedure assigns a resource to a specific app.

1. Sign in to the [LUIS portal](https://www.luis.ai). Select an app from the **My apps** list.
1. Go to **Manage** > **Azure Resources**:

    :::image type="content" source="./media/luis-how-to-azure-subscription/manage-azure-resources-prediction.png" alt-text="Choose a type of Language Understanding prediction resource." lightbox="./media/luis-how-to-azure-subscription/manage-azure-resources-prediction.png":::

1. On the **Prediction resource** or **Authoring resource** tab, select the **Add prediction resource** or **Add authoring resource** button.
1. Use the fields in the form to find the correct resource, and then select **Save**.

# [Without LUIS portal](#tab/without-portal)

## Assign prediction resource without using the LUIS portal

For automated processes like CI/CD pipelines, you can automate the assignment of a LUIS resource to a LUIS app with the following steps:

1. Get an [Azure Resource Manager token](https://resources.azure.com/api/token?plaintext=true) which is an alphanumeric string of characters. This token does expire, so use it right away. You can also use the following Azure CLI command.

    ```azurecli
    az account get-access-token --resource=https://management.core.windows.net/ --query accessToken --output tsv
    ```
    
1. Use the token to request the LUIS runtime resources across subscriptions. Use the API to [get the LUIS Azure account](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be313cec181ae720aa2b26c) that your user account has access to.

    This POST API requires the following values:

    |Header|Value|
    |--|--|
    |`Authorization`|The value of `Authorization` is `Bearer {token}`. The token value must be preceded by the word `Bearer` and a space.|
    |`Ocp-Apim-Subscription-Key`|Your authoring key.|

    The API returns an array of JSON objects that represent your LUIS subscriptions. Returned values include the subscription ID, resource group, and resource name, returned as `AccountName`. Find the item in the array that's the LUIS resource that you want to assign to the LUIS app.

1. Assign the token to the LUIS resource by using the [Assign a LUIS Azure accounts to an application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be32228e8473de116325515) API.

    This POST API requires the following values:

    |Type|Setting|Value|
    |--|--|--|
    |Header|`Authorization`|The value of `Authorization` is `Bearer {token}`. The token value must be preceded by the word `Bearer` and a space.|
    |Header|`Ocp-Apim-Subscription-Key`|Your authoring key.|
    |Header|`Content-type`|`application/json`|
    |Querystring|`appid`|The LUIS app ID.
    |Body||{`AzureSubscriptionId`: Your Subscription ID,<br>`ResourceGroup`: Resource Group name that has your prediction resource,<br>`AccountName`: Name of your prediction resource}|

    When this API is successful, it returns `201 - created status`.

---

## Unassign a resource

When you unassign a resource, it's not deleted from Azure. It's only unlinked from LUIS.

# [LUIS portal](#tab/portal)

## Unassign resources using LUIS portal

1. Sign in to the [LUIS portal](https://www.luis.ai), and then select an app from the **My apps** list.
1. Go to **Manage** > **Azure Resources**.
1. Select the **Unassign resource** button for the resource.

# [Without LUIS portal](#tab/without-portal)

## Unassign prediction resource without using the LUIS portal

1. Get an [Azure Resource Manager token](https://resources.azure.com/api/token?plaintext=true) which is an alphanumeric string of characters. This token does expire, so use it right away. You can also use the following Azure CLI command.

    ```azurecli
    az account get-access-token --resource=https://management.core.windows.net/ --query accessToken --output tsv
    ```
 
1. Use the token to request the LUIS runtime resources across subscriptions. Use the [Get LUIS Azure accounts API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be313cec181ae720aa2b26c), which your user account has access to.

    This POST API requires the following values:

    |Header|Value|
    |--|--|
    |`Authorization`|The value of `Authorization` is `Bearer {token}`. The token value must be preceded by the word `Bearer` and a space.|
    |`Ocp-Apim-Subscription-Key`|Your authoring key.|

    The API returns an array of JSON objects that represent your LUIS subscriptions. Returned values include the subscription ID, resource group, and resource name, returned as `AccountName`. Find the item in the array that's the LUIS resource that you want to assign to the LUIS app.

1. Assign the token to the LUIS resource by using the [Unassign a LUIS Azure account from an application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be32554f8591db3a86232e1/console) API.

    This DELETE API requires the following values:

    |Type|Setting|Value|
    |--|--|--|
    |Header|`Authorization`|The value of `Authorization` is `Bearer {token}`. The token value must be preceded by the word `Bearer` and a space.|
    |Header|`Ocp-Apim-Subscription-Key`|Your authoring key.|
    |Header|`Content-type`|`application/json`|
    |Querystring|`appid`|The LUIS app ID.
    |Body||{`AzureSubscriptionId`: Your Subscription ID,<br>`ResourceGroup`: Resource Group name that has your prediction resource,<br>`AccountName`: Name of your prediction resource}|

    When this API is successful, it returns `200 - OK status`.

---

## Resource ownership

An Azure resource, like a LUIS resource, is owned by the subscription that contains the resource.

To change the ownership of a resource, you can take one of these actions:
* Transfer the [ownership](../../cost-management-billing/manage/billing-subscription-transfer.md) of your subscription.
* Export the LUIS app as a file, and then import the app on a different subscription. Export is available on the **My apps** page in the LUIS portal.

## Resource limits

### Authoring key creation limits

You can create as many as 10 authoring keys per region, per subscription. Publishing regions are different from authoring regions. Make sure you create an app in the authoring region that corresponds to the publishing region where you want your client application to be located. For information on how authoring regions map to publishing regions, see [Authoring and publishing regions](luis-reference-regions.md). 

See [resource limits](luis-limits.md#resource-usage-and-limits) for more information.

### Errors for key usage limits

Usage limits are based on the pricing tier.

If you exceed your transactions-per-second (TPS) quota, you receive an HTTP 429 error. If you exceed your transaction-per-month (TPM) quota, you receive an HTTP 403 error.

## Change the pricing tier

1.  In [the Azure portal](https://portal.azure.com), Go to **All resources** and select your resource

    :::image type="content" source="./media/luis-usage-tiers/find.png" alt-text="Screenshot that shows a LUIS subscription in the Azure portal." lightbox="./media/luis-usage-tiers/find.png":::

1.  From the left side menu, select **Pricing tier** to see the available pricing tiers
1.  Select the pricing tier you want, and click **Select** to save your change. When the pricing change is complete, a notification will appear in the top right with the pricing tier update.

## View Azure resource metrics

## View a summary of Azure resource usage
You can view LUIS usage information in the Azure portal. The **Overview** page shows a summary, including recent calls and errors. If you make a LUIS endpoint request, allow up to five minutes for the change to appear.

:::image type="content" source="./media/luis-usage-tiers/overview.png" alt-text="Screenshot that shows the overview page." lightbox="./media/luis-usage-tiers/overview.png":::

## Customizing Azure resource usage charts
The **Metrics** page provides a more detailed view of the data. 
You can configure your metrics charts for a specific **time period** and **metric**.

:::image type="content" source="./media/luis-usage-tiers/metrics.png" alt-text="Screenshot that shows the metrics page." lightbox="./media/luis-usage-tiers/metrics.png":::

## Total transactions threshold alert
If you want to know when you reach a certain transaction threshold, for example 10,000 transactions, you can create an alert:

1. From the left side menu, select **Alerts**
2. From the top menu select **New alert rule**

    :::image type="content" source="./media/luis-usage-tiers/alerts.png" alt-text="Screenshot that shows the alert rules page." lightbox="./media/luis-usage-tiers/alerts.png":::

3. Select **Add condition**

    :::image type="content" source="./media/luis-usage-tiers/alerts-2.png" alt-text="Screenshot that shows the add condition page for alert rules." lightbox="./media/luis-usage-tiers/alerts-2.png":::

4. Select **Total calls**

    :::image type="content" source="./media/luis-usage-tiers/alerts-3.png" alt-text="Screenshot that shows the total calls page for alerts." lightbox="./media/luis-usage-tiers/alerts-3.png":::

5. Scroll down to the **Alert logic** section and set the attributes as you want and click **Done**

    :::image type="content" source="./media/luis-usage-tiers/alerts-4.png" alt-text="Screenshot that shows the alert logic page." lightbox="./media/luis-usage-tiers/alerts-4.png":::

6. To send notifications or invoke actions when the alert rule triggers go to the **Actions** section and add your action group.

    :::image type="content" source="./media/luis-usage-tiers/alerts-5.png" alt-text="Screenshot that shows the actions page for alerts." lightbox="./media/luis-usage-tiers/alerts-5.png":::

### Reset an authoring key

For [migrated authoring resource](luis-migration-authoring.md) apps: If your authoring key is compromised, reset the key in the Azure portal, on the **Keys** page for the authoring resource.

For apps that haven't been migrated: The key is reset on all your apps in the LUIS portal. If you author your apps via the authoring APIs, you need to change the value of `Ocp-Apim-Subscription-Key` to the new key.

### Regenerate an Azure key

You can regenerate an Azure key from the **Keys** page in the Azure portal.

<a name="securing-the-endpoint"></a>

## App ownership, access, and security

An app is defined by its Azure resources, which are determined by the owner's subscription.

You can move your LUIS app. Use the following resources to help you do so by using the Azure portal or Azure CLI:

* [Move an app between LUIS authoring resources](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/apps-move-app-to-another-luis-authoring-azure-resource)
* [Move a resource to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
* [Move a resource within the same subscription or across subscriptions](../../azure-resource-manager/management/move-limitations/app-service-move-limitations.md)


## Next steps

* Learn [how to use versions](luis-how-to-manage-versions.md) to control your app life cycle.


