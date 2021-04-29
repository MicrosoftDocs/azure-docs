---
# Mandatory fields.
title: Integrate with Logic Apps
titleSuffix: Azure Digital Twins
description: See how to connect Logic Apps to Azure Digital Twins, using a custom connector
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 9/11/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
ms.reviewer: baanders
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Integrate with Logic Apps using a custom connector

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) is a cloud service that helps you automate workflows across apps and services. By connecting Logic Apps to the Azure Digital Twins APIs, you can create such automated flows around Azure Digital Twins and their data.

Azure Digital Twins does not currently have a certified (pre-built) connector for Logic Apps. Instead, the current process for using Logic Apps with Azure Digital Twins is to create a [**custom Logic Apps connector**](../logic-apps/custom-connector-overview.md), using a [custom Azure Digital Twins Swagger](/samples/azure-samples/digital-twins-custom-swaggers/azure-digital-twins-custom-swaggers/) that has been modified to work with Logic Apps.

> [!NOTE]
> There are multiple versions of the Swagger contained in the custom Swagger sample linked above. The latest version will be found in the subfolder with the most recent date, but earlier versions contained in the sample are also still supported.

In this article, you will use the [Azure portal](https://portal.azure.com) to **create a custom connector** that can be used to connect Logic Apps to an Azure Digital Twins instance. You will then **create a logic app** that uses this connection for an example scenario, in which events triggered by a timer will automatically update a twin in your Azure Digital Twins instance. 

## Prerequisites

If you don't have an Azure subscription, **create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)** before you begin.
Sign in to the [Azure portal](https://portal.azure.com) with this account. 

You also need to complete the following items as part of prerequisite setup. The remainder of this section will walk you through these steps:
- Set up an Azure Digital Twins instance
- Add a digital twin

### Set up Azure Digital Twins instance

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

### Add a digital twin

This article uses Logic Apps to update a twin in your Azure Digital Twins instance. To proceed, you should add at least one twin in your instance. 

You can add twins using the [DigitalTwins APIs](/rest/api/digital-twins/dataplane/twins), the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client), or the [Azure Digital Twins CLI](how-to-use-cli.md). For detailed steps on how to create twins using these methods, see [*How-to: Manage digital twins*](how-to-manage-twin.md).

You will need the **_Twin ID_** of a twin in your instance that you've created.

## Set up app registration

[!INCLUDE [digital-twins-prereq-registration.md](../../includes/digital-twins-prereq-registration.md)]

### Get app registration client secret

You will also need to create a **_Client secret_** for your Azure AD app registration. To do this, navigate to the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) page in the Azure portal (you can use this link or look for it in the portal search bar). Select your registration that you created in the previous section from the list, in order to open its details. 

Hit *Certificates and secrets* from the registration's menu, and select *+ New client secret*.

:::image type="content" source="media/how-to-integrate-logic-apps/client-secret.png" alt-text="Portal view of an Azure AD app registration. There's a highlight around 'Certificates and secrets' in the resource menu, and a highlight on the page around 'New client secret'":::

Enter whatever values you would like for *Description* and *Expires*, and hit *Add*.

:::image type="content" source="media/how-to-integrate-logic-apps/add-client-secret.png" alt-text="Add client secret":::

Now, verify that the client secret is visible on the _Certificates & secrets_ page with _Expires_ and _Value_ fields. Take note of its _Value_ to use later (you can also copy it to the clipboard with the Copy icon)

:::image type="content" source="media/how-to-integrate-logic-apps/client-secret-value.png" alt-text="Copy client secret value":::

## Create custom Logic Apps connector

Now, you're ready to create a [custom Logic Apps connector](../logic-apps/custom-connector-overview.md) for the Azure Digital Twins APIs. After doing this, you'll be able to hook up Azure Digital Twins when creating a logic app in the next section.

Navigate to the [Logic Apps Custom Connector](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Web%2FcustomApis) page in the Azure portal (you can use this link or search for it in the portal search bar). Hit *+ Add*.

:::image type="content" source="media/how-to-integrate-logic-apps/logic-apps-custom-connector.png" alt-text="The 'Logic Apps Custom Connector' page in the Azure portal. Highlight around the 'Add' button":::

In the *Create Logic Apps Custom Connector* page that follows, select your subscription and resource group, and a name and deployment location for your new connector. Hit *Review + create*. 

:::image type="content" source="media/how-to-integrate-logic-apps/create-logic-apps-custom-connector.png" alt-text="The 'Create Logic Apps Custom Connector' page in the Azure portal.":::

This will take you to the *Review + create* tab, where you can hit *Create* at the bottom to create your resource.

:::image type="content" source="media/how-to-integrate-logic-apps/review-logic-apps-custom-connector.png" alt-text="The 'Review + create' tab of the 'Review Logic Apps Custom Connector' page in the Azure portal. Highlight around the 'Create' button":::

You'll be taken to the deployment page for the connector. When it is finished deploying, hit the *Go to resource* button to view the connector's details in the portal.

### Configure connector for Azure Digital Twins

Next, you'll configure the connector you've created to reach Azure Digital Twins.

First, download a custom Azure Digital Twins Swagger that has been modified to work with Logic Apps. Download the **Azure Digital Twins custom Swaggers (Logic Apps connector)** sample from [**this link**](/samples/azure-samples/digital-twins-custom-swaggers/azure-digital-twins-custom-swaggers/) by hitting the *Download ZIP* button. Navigate to the downloaded *Azure_Digital_Twins_custom_Swaggers__Logic_Apps_connector_.zip* folder and unzip it. 

The custom Swagger for this tutorial is located in the ***Azure_Digital_Twins_custom_Swaggers__Logic_Apps_connector_\LogicApps*** folder. This folder contains subfolders called *stable* and *preview*, both of which hold different versions of the Swagger organized by date. The folder with the most recent date will contain the latest copy of the Swagger. Whichever version you select, the Swagger file is named _**digitaltwins.json**_.

> [!NOTE]
> Unless you're working with a preview feature, it's generally recommended to use the most recent *stable* version of the Swagger. However, earlier versions and preview versions of the Swagger are also still supported. 

Next, go to your connector's Overview page in the [Azure portal](https://portal.azure.com) and hit *Edit*.

:::image type="content" source="media/how-to-integrate-logic-apps/edit-connector.png" alt-text="The 'Overview 'page for the connector created in the previous step. Highlight around the 'Edit' button":::

In the *Edit Logic Apps Custom Connector* page that follows, configure this information:
* **Custom connectors**
    - API Endpoint: REST (leave default)
    - Import mode: OpenAPI file (leave default)
    - File: This will be the custom Swagger file you downloaded earlier. Hit *Import*, locate the file on your machine (*Azure_Digital_Twins_custom_Swaggers__Logic_Apps_connector_\LogicApps\...\digitaltwins.json*), and hit *Open*.
* **General information**
    - Icon: Upload an icon that you like
    - Icon background color: Enter hexadecimal code in the format '#xxxxxx' for your color.
    - Description: Fill whatever values you would like.
    - Scheme: HTTPS (leave default)
    - Host: The *host name* of your Azure Digital Twins instance.
    - Base URL: / (leave default)

Then, hit the *Security* button at the bottom of the window to continue to the next configuration step.

:::image type="content" source="media/how-to-integrate-logic-apps/configure-next.png" alt-text="Screenshot of the bottom of the 'Edit Logic Apps Custom Connector' page. Highlight around button to continue to Security":::

In the Security step, hit *Edit* and configure this information:
* **Authentication type**: OAuth 2.0
* **OAuth 2.0**:
    - Identity provider: Azure Active Directory
    - Client ID: The *Application (client) ID* for your Azure AD app registration
    - Client secret: The *Client secret* you created in [*Prerequisites*](#prerequisites) for your Azure AD app registration
    - Login URL: https://login.windows.net (leave default)
    - Tenant ID: The *Directory (tenant) ID* for your Azure AD app registration
    - Resource URL: 0b07f429-9f4b-4714-9392-cc5e8e80c8b0
    - Scope: Directory.AccessAsUser.All
    - Redirect URL: (leave default for now)

Note that the Redirect URL field says *Save the custom connector to generate the redirect URL*. Do this now by hitting *Update connector* across the top of the pane to confirm your connector settings.

:::image type="content" source="media/how-to-integrate-logic-apps/update-connector.png" alt-text="Screenshot of the top of the 'Edit Logic Apps Custom Connector' page. Highlight around 'Update connector' button":::

<!-- Success message? didn't see one -->

Return to the Redirect URL field and copy the value that has been generated. You will use it in the next step.

:::image type="content" source="media/how-to-integrate-logic-apps/copy-redirect-url.png" alt-text="The Redirect URL field in the 'Edit Logic Apps Custom Connector' page now has a value of 'https://logic-apis-westus2.consent.azure-apim.net/redirect'. The button to copy the value is highlighted.":::

This is all the information that is required to create your connector (no need to continue past Security to the Definition step). You can close the *Edit Logic Apps Custom Connector* pane.

>[!NOTE]
>Back on your connector's Overview page where you originally hit *Edit*, note that hitting *Edit* again will restart the entire process of entering your configuration choices. It will not populate your values from the last time you went through it, so if you want to save an updated configuration with any changed values, you must re-enter all the other values as well to avoid their being overwritten by the defaults.

### Grant connector permissions in the Azure AD app

Next, use the custom connector's *Redirect URL* value you copied in the last step to grant the connector permissions in your Azure AD app registration.

Navigate to the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) page in the Azure portal and select your registration from the list. 

Under *Authentication* from the registration's menu, add a URI.

:::image type="content" source="media/how-to-integrate-logic-apps/add-uri.png" alt-text="The Authentication page for the app registration in the Azure portal. 'Authentication' in the menu is highlighted, and on the page, the 'Add a URI' button is highlighted."::: 

Enter the custom connector's *Redirect URL* into the new field, and hit the *Save* icon.

:::image type="content" source="media/how-to-integrate-logic-apps/save-uri.png" alt-text="The Authentication page for the app registration in the Azure portal. The new redirect URL is highlighted, and the 'Save' button for the page.":::

You are now done setting up a custom connector that can access the Azure Digital Twins APIs. 

## Create logic app

Next, you'll create a logic app that will use your new connector to automate Azure Digital Twins updates.

In the [Azure portal](https://portal.azure.com), search for *Logic apps* in the portal search bar. Selecting it should take you to the *Logic apps* page. Hit the *Create logic app* button to create a new logic app.

:::image type="content" source="media/how-to-integrate-logic-apps/create-logic-app.png" alt-text="The 'Logic Apps' page in the Azure portal. Hit 'Add' button":::

In the *Logic App* page that follows, enter your subscription and resource group. Also, choose a name for your logic app and select the deployment location.

Hit the _Review + create_ button.

This will take you to the *Review + create* tab, where you can review your details and hit *Create* at the bottom to create your resource.

You'll be taken to the deployment page for the logic app. When it is finished deploying, hit the *Go to resource* button to continue to the *Logic Apps Designer*, where you will fill in the logic of the workflow.

### Design workflow

In the *Logic Apps Designer*, under *Start with a common trigger*, select _**Recurrence**_.

:::image type="content" source="media/how-to-integrate-logic-apps/logic-apps-designer-recurrence.png" alt-text="The 'Logic Apps Designer' page in the Azure portal. Highlight around the 'Recurrence' common trigger":::

In the *Logic Apps Designer* page that follows, change the **Recurrence** Frequency to *Second*, so that the event is triggered every 3 seconds. This will make it easy to see the results later without having to wait very long.

Hit *+ New step*.

This will open a *Choose an action* box. Switch to the *Custom* tab. You should see your custom connector from earlier in the top box.

:::image type="content" source="media/how-to-integrate-logic-apps/custom-action.png" alt-text="Creating a flow in the Logic Apps Designer in the Azure portal. In the 'Choose an action' box, the 'Custom' tab is selected. The user's custom connector from earlier is shown in the box, with a highlight around it.":::

Select it to display the list of APIs contained in that connector. Use the search bar or scroll through the list to select **DigitalTwins_Add**. (This is the API used in this article, but you could also select any other API as a valid choice for a Logic Apps connection).

You may be asked to sign in with your Azure credentials to connect to the connector. If you get a *Permissions requested* dialogue, follow the prompts to grant consent for your app and accept.

In the new *DigitalTwinsAdd* box, fill the fields as follows:
* _id_: Fill the *Twin ID* of the digital twin in your instance that you'd like the Logic App to update.
* _twin_: This field is where you'll enter the body that the chosen API request requires. For *DigitalTwinsUpdate*, this body is in the form of JSON Patch code. For more about structuring a JSON Patch to update your twin, see the [Update a digital twin](how-to-manage-twin.md#update-a-digital-twin) section of *How-to: Manage digital twins*.
* _api-version_: The latest API version. Currently, this value is *2020-10-31*.

Hit *Save* in the Logic Apps Designer.

You can choose other operations by selecting _+ New step_ on the same window.

:::image type="content" source="media/how-to-integrate-logic-apps/save-logic-app.png" alt-text="Finished view of the app in the Logic App Connector. The DigitalTwinsAdd box is filled with the values described above, including a sample JSON Patch body. The 'Save' button for the window is highlighted.":::

## Query twin to see the update

Now that your logic app has been created, the twin update event you defined in the Logic Apps Designer should occur on a recurrence of every three seconds. This means that after three seconds, you should be able to query your twin and see your new patched values reflected.

You can query your twin via your method of choice (such as a [custom client app](tutorial-command-line-app.md), the [Azure Digital Twins Explorer sample app](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/), the [SDKs and APIs](how-to-use-apis-sdks.md), or the [CLI](how-to-use-cli.md)). 

For more about querying your Azure Digital Twins instance, see [*How-to: Query the twin graph*](how-to-query-graph.md).

## Next steps

In this article, you created a logic app that regularly updates a twin in your Azure Digital Twins instance with a patch that you provided. You can try out selecting other APIs in the custom connector to create Logic Apps for a variety of actions on your instance.

To read more about the APIs operations available and the details they require, visit [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md).
