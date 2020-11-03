---
title: Using authoring and runtime keys - LUIS
description: When you first use LUIS, you don't need to create an authoring key. When you want to publish the app and then use your runtime endpoint, you need to create and assign the runtime key to the app.
services: cognitive-services
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 09/07/2020
ms.custom: devx-track-azurecli
---

# Create LUIS resources

Authoring and query prediction runtime resources provide authentication to your Language Understanding (LUIS) app and prediction endpoint.

<a name="azure-resources-for-luis"></a>
<a name="programmatic-key" ></a>
<a name="endpoint-key"></a>
<a name="authoring-key"></a>

## LUIS resources

LUIS allows three types of Azure resources and one non-Azure resource:

|Resource|Purpose|Cognitive service `kind`|Cognitive service `type`|
|--|--|--|--|
|Authoring resource|Allows you to create, manage, train, test, and publish your applications. [Create a LUIS authoring resource](luis-how-to-azure-subscription.md#create-luis-resources-in-azure-portal) if you intend to author LUIS apps programtically or from the LUIS portal. You need to [migrate your LUIS account](luis-migration-authoring.md#what-is-migration) before you link your Azure authoring resources to your application. You can control permissions to the authoring resource by assigning people [the contributor role](#contributions-from-other-authors). <br><br> One tier is available for the LUIS authoring resource:<br> <ul> <li>**Free F0 authoring resource**, which gives you 1 million free authoring transactions and 1,000 free testing prediction endpoint requests monthly. |`LUIS.Authoring`|`Cognitive Services`|
|Prediction resource| After you publish your LUIS application, use the prediction resource/key to query prediction endpoint requests. Create a LUIS prediction resource before your client app requests predictions beyond the 1,000 requests provided by the authoring or starter resource. <br><br> Two tiers are available for the prediction resource:<br><ul> <li> **Free F0 prediction resource**, which gives you 10,000 free prediction endpoint requests monthly.<br> <li> **Standard S0 prediction resource**, which is the paid tier. [Learn more about pricing.](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/)|`LUIS`|`Cognitive Services`|
|Starter/Trial resource|Allows you to create, manage, train, test, and publish your applications. This resource is created by default if you choose the starter resource option when you first sign in to LUIS. The starter key will eventually be deprecated. All LUIS users will need to [migrate their accounts](luis-migration-authoring.md#what-is-migration) and link their LUIS applications to an authoring resource. Unlike the authoring resource, this resource doesn't give you permissions for Azure role-based access control. <br><br> Like the authoring resource, the starter resource gives you 1 million free authoring transactions and 1,000 free testing prediction endpoint requests.|-|Not an Azure resource.|
|[Cognitive Services multiservice resource key](../cognitive-services-apis-create-account-cli.md?tabs=windows#create-a-cognitive-services-resource)|Query prediction endpoint requests shared with LUIS and other supported cognitive services.|`CognitiveServices`|`Cognitive Services`|


> [!Note]
> LUIS provides two types of F0 (free tier) resources: one for authoring transactions and one for prediction transactions. If you're running out of free quota for prediction transactions, make sure you're using the F0 prediction resource that gives you a 10,000 free transactions monthly and not the authoring resource that gives you 1,000 prediction transactions monthly.

When the Azure resource creation process is finished, [assign the resource](#assign-a-resource-to-an-app) to the app in the LUIS portal.

> [!important]
> You should author LUIS apps in the [regions](luis-reference-regions.md#publishing-regions) where you want to publish and query.

## Resource ownership

An Azure resource, like a LUIS resource, is owned by the subscription that contains the resource.

To change the ownership of a resource, you can take one of these actions:
* Transfer the [ownership](../../cost-management-billing/manage/billing-subscription-transfer.md) of your subscription.
* Export the LUIS app as a file, and then import the app on a different subscription. Export is available on the **My apps** page in the LUIS portal.


## Resource limits

### Authoring key creation limits

You can create as many as 10 authoring keys per region, per subscription.

For more information, see [key limits](luis-limits.md#key-limits) and [Azure regions](luis-reference-regions.md).

Publishing regions are different from authoring regions. Make sure you create an app in the authoring region that corresponds to the publishing region where you want your client application to be located.

### Errors for key usage limits

Usage limits are based on the pricing tier.

If you exceed your transactions-per-second (TPS) quota, you receive an HTTP 429 error. If you exceed your transaction-per-month (TPM) quota, you receive an HTTP 403 error.


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


### Contributions from other authors

For [migrated authoring resource](luis-migration-authoring.md) apps: You can manage _contributors_ for an authoring resource in the Azure portal by using the **Access control (IAM)** page. Learn [how to add a user](luis-how-to-collaborate.md) by using the collaborator's email address and the contributor role.

For apps that have not migrated yet: You can manage all _collaborators_ on the **Manage -> Collaborators** page in the LUIS portal.

### Query prediction access for private and public apps

For private apps, query prediction runtime access is available for owners and contributors. For public apps, runtime access is available to users who have their own Azure [Cognitive Service](../cognitive-services-apis-create-account.md) or [LUIS](#create-resources-in-the-azure-portal) runtime resource and the public app's ID.

There isn't currently a catalog of public apps.

### Authoring permissions and access
Access to an app from the [LUIS](luis-reference-regions.md#luis-website) portal or the [authoring APIs](https://go.microsoft.com/fwlink/?linkid=2092087) is controlled by the Azure authoring resource.

The owner and all contributors have access to author the app.

|Authoring access includes:|Notes|
|--|--|
|Add or remove endpoint keys||
|Export version||
|Export endpoint logs||
|Import version||
|Make app public|When an app is public, anyone who has an authoring or endpoint key can query the app.|
|Modify model|
|Publish|
|Review endpoint utterances for [active learning](luis-how-to-review-endpoint-utterances.md)|
|Train|

<a name="prediction-endpoint-runtime-key"></a>

### Prediction endpoint runtime access

Access for querying the prediction endpoint is controlled by a setting on the **Application Information** page in the **Manage** section.

|[Private endpoint](#runtime-security-for-private-apps)|[Public endpoint](#runtime-security-for-public-apps)|
|:--|:--|
|Available to owner and contributors|Available to owner, contributors, and anyone else who knows the app ID|

You can control who sees your LUIS runtime key by calling it in a server-to-server environment. If you're using LUIS from a bot, the connection between the bot and LUIS is already more secure. If you're calling the LUIS endpoint directly, you should create a server-side API (like an Azure [function](https://azure.microsoft.com/services/functions/)) with controlled access (via something like [Azure AD](https://azure.microsoft.com/services/active-directory/)). When the server-side API is called and authenticated and authorization is verified, pass the call on to LUIS. This strategy doesn't prevent man-in-the-middle attacks. But it does obfuscate your key and endpoint URL from your users, allow you to track access, and allow you to add endpoint response logging (like [Application Insights](https://azure.microsoft.com/services/application-insights/)).

### Runtime security for private apps

A private app's runtime is available only to the following keys:

|Key and user|Explanation|
|--|--|
|Owner's authoring key| Up to 1,000 endpoint hits|
|Collaborator/contributor authoring keys| Up to 1,000 endpoint hits|
|Any key assigned to LUIS by an author or collaborator/contributor|Based on key usage tier|

### Runtime security for public apps

When your app is configured as public, _any_ valid LUIS authoring key or LUIS endpoint key can query it, as long as the key hasn't used the entire endpoint quota.

A user who isn't an owner or contributor can access a public app's runtime only if given the app ID. LUIS doesn't have a public market or any other way for users to search for a public app.

A public app is published in all regions, so a user with a region-based LUIS resource key can access the app in whichever region is associated with the resource key.


### Control access to your query prediction endpoint

You can control who can see your LUIS prediction runtime endpoint key by calling it in a server-to-server environment. If you're using LUIS from a bot, the connection between the bot and LUIS is already more secure. If you're calling the LUIS endpoint directly, you should create a server-side API (like an Azure [function](https://azure.microsoft.com/services/functions/)) with controlled access (via something like [Azure AD](https://azure.microsoft.com/services/active-directory/)). When the server-side API is called and authentication and authorization are verified, pass the call on to LUIS. This strategy doesn't prevent man-in-the-middle attacks. But it does obfuscate your endpoint from your users, allow you to track access, and allow you to add endpoint response logging (like [Application Insights](https://azure.microsoft.com/services/application-insights/)).

<a name="starter-key"></a>

## Sign in to the LUIS portal and begin authoring

1. Sign in to the [LUIS portal](https://www.luis.ai) and agree to the terms of use.
1. Begin your LUIS app by choosing your Azure LUIS authoring key:

   ![Screenshot that shows the welcome screen.](./media/luis-how-to-azure-subscription/sign-in-create-resource.png)

1. When you're done with the resource selection process, [create a new app](luis-how-to-start-new-app.md#create-new-app-in-luis).


<a name="create-azure-resources"></a>
<a name="create-resources-in-the-azure-portal"></a>

[!INCLUDE [Create LUIS resource in Azure portal](includes/create-luis-resource.md)]

### Create resources in Azure CLI

Use [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to create each resource individually.

Resource `kind`:

* Authoring: `LUIS.Authoring`
* Prediction: `LUIS`

1. Sign in to Azure CLI:

    ```azurecli
    az login
    ```

    This command opens a browser so you can select the correct account and provide authentication.

1. Create a LUIS authoring resource of kind `LUIS.Authoring`, named `my-luis-authoring-resource`. Create it in the _existing_ resource group named `my-resource-group` for the `westus` region.

    ```azurecli
    az cognitiveservices account create -n my-luis-authoring-resource -g my-resource-group --kind LUIS.Authoring --sku F0 -l westus --yes
    ```

1. Create a LUIS prediction endpoint resource of kind `LUIS`, named `my-luis-prediction-resource`. Create it in the _existing_ resource group named `my-resource-group` for the `westus` region. If you want higher throughput than the free tier provides, change `F0` to `S0`. [Learn more about pricing tiers and throughput.](luis-limits.md#key-limits)

    ```azurecli
    az cognitiveservices account create -n my-luis-prediction-resource -g my-resource-group --kind LUIS --sku F0 -l westus --yes
    ```

    > [!Note]
    > This keys are **not** used by the LUIS portal until they are assigned in the LUIS portal on the **Manage -> Azure resources**.

<a name="assign-an-authoring-resource-in-the-luis-portal-for-all-apps"></a>

### Assign resource in the LUIS portal

You can assign an authoring resource for a single app or for all apps in LUIS. The following procedure assigns all apps to a single authoring resource.

1. Sign in to the [LUIS portal](https://www.luis.ai).
1. At the top navigation bar, to the far right, select your user account, then select **Settings**.
1. On the **User Settings** page, select **Add authoring resource** then select an existing authoring resource. Select **Save**.

## Assign a resource to an app

Please note that if you do not have an Azure subscription, you will not be able to assign or create a new resource. You will have to first go and create an [Azure Free Trial](https://azure.microsoft.com/en-us/free/) then return to LUIS to create a new resource from the portal.

You can assign or create an authoring or a prediction resource to an application with the following procedure:

1. Sign in to the [LUIS portal](https://www.luis.ai), then select an app from the **My apps** list
1. Navigate to the **Manage -> Azure resources** page

    ![Select the Manage -> Azure resources in the LUIS portal to assign a resource to the app.](./media/luis-how-to-azure-subscription/manage-azure-resources-prediction.png)

1. Select the Prediction or Authoring resource tab then select the **Add prediction resource** or **Add authoring resource** button
1. Select the fields in the form to find the correct resource, then select **Save**
1. If you dont have an exisiting resource, you can create one by selecting "Create a new LUIS resource?" from the bottom of the window


### Assign query prediction runtime resource without using LUIS portal

For automation purposes such as a CI/CD pipeline, you may want to automate the assignment of a LUIS runtime resource to a LUIS app. In order to do that, you need to perform the following steps:

1. Get an Azure Resource Manager token from this [website](https://resources.azure.com/api/token?plaintext=true). This token does expire so use it immediately. The request returns an Azure Resource Manager token.

    ![Request Azure Resource Manager token and receive Azure Resource Manager token](./media/luis-manage-keys/get-arm-token.png)

1. Use the token to request the LUIS runtime resources across subscriptions, from the [Get LUIS Azure accounts API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be313cec181ae720aa2b26c), which your user account has access to.

    This POST API requires the following settings:

    |Header|Value|
    |--|--|
    |`Authorization`|The value of `Authorization` is `Bearer {token}`. Notice that the token value must be preceded by the word `Bearer` and a space.|
    |`Ocp-Apim-Subscription-Key`|Your authoring key.|

    This API returns an array of JSON objects of your LUIS subscriptions including subscription ID, resource group, and resource name, returned as account name. Find the one item in the array that is the LUIS resource to assign to the LUIS app.

1. Assign the token to the LUIS resource with the [Assign a LUIS Azure accounts to an application](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5be32228e8473de116325515) API.

    This POST API requires the following settings:

    |Type|Setting|Value|
    |--|--|--|
    |Header|`Authorization`|The value of `Authorization` is `Bearer {token}`. Notice that the token value must be preceded by the word `Bearer` and a space.|
    |Header|`Ocp-Apim-Subscription-Key`|Your authoring key.|
    |Header|`Content-type`|`application/json`|
    |Querystring|`appid`|The LUIS app ID.
    |Body||{"AzureSubscriptionId":"ddda2925-af7f-4b05-9ba1-2155c5fe8a8e",<br>"ResourceGroup": "resourcegroup-2",<br>"AccountName": "luis-uswest-S0-2"}|

    When this API is successful, it returns a 201 - created status.

## Unassign resource

1. Sign in to the [LUIS portal](https://www.luis.ai), then select an app from the **My apps** list.
1. Navigate to the **Manage -> Azure resources** page.
1. Select the Prediction or Authoring resource tab then select the **Unassign resource** button for the resource.

When you unassign a resource, it is not deleted from Azure. It is only unlinked from LUIS.


## Delete account

See [Data storage and removal](luis-concept-data-storage.md#accounts) for information about what data is deleted when you delete your account.

## Change pricing tier

1.  In [Azure](https://portal.azure.com), find your LUIS subscription. Select the LUIS subscription.
    ![Find your LUIS subscription](./media/luis-usage-tiers/find.png)
1.  Select **Pricing tier** in order to see the available pricing tiers.
    ![View pricing tiers](./media/luis-usage-tiers/subscription.png)
1.  Select the pricing tier and select **Select** to save your change.
    ![Change your LUIS payment tier](./media/luis-usage-tiers/plans.png)
1.  When the pricing change is complete, a pop-up window verifies the new pricing tier.
    ![Verify your LUIS payment tier](./media/luis-usage-tiers/updated.png)
1. Remember to [assign this endpoint key](#assign-a-resource-to-an-app) on the **Publish** page and use it in all endpoint queries.

## Viewing Azure resource metrics

### Viewing Azure resource summary usage
You can view LUIS usage information in Azure. The **Overview** page shows recent summary information including calls and errors. If you make a LUIS endpoint request, then immediately watch the **Overview page**, allow up to five minutes for the usage to show up.

![Viewing summary usage](./media/luis-usage-tiers/overview.png)

### Customizing Azure resource usage charts
Metrics provides a more detailed view into the data.

![Default metrics](./media/luis-usage-tiers/metrics-default.png)

You can configure your metrics charts for time period and metric type.

![Custom metrics](./media/luis-usage-tiers/metrics-custom.png)

### Total transactions threshold alert
If you would like to know when you have reached a certain transaction threshold, for example 10,000 transactions, you can create an alert.

![Default alerts](./media/luis-usage-tiers/alert-default.png)

Add a metric alert for the **total calls** metric for a certain time period. Add email addresses of all people that should receive the alert. Add webhooks for all systems that should receive the alert. You can also run a logic app when the alert is triggered.

## Next steps

* Learn [how to use versions](luis-how-to-manage-versions.md) to control your app life cycle.
* Migrate to the new [authoring resource](luis-migration-authoring.md)
