---
title: Publish your LUIS app | Microsoft Docs
description: After you build and test your app by using Language Understanding (LUIS), publish it as a web service on Azure. 
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/01/2017
ms.author: cahann
---


# Publish your trained app
When you finish building and testing your LUIS app, you publish it as a web service on Azure. The associated HTTP endpoint is then integrated into any client or backend application. 

You can optionally test your app before publishing it. For instructions, see [Train and test your app](Train-Test.md).

You can either publish your app directly to the **Production Slot**, or you can publish to a **Staging Slot** to validate changes before publishing to the production slot. 

## Publish your trained app to an HTTP endpoint

1. Open your app by clicking its name on the **My Apps** page, and then click **Publish** in the top panel. The following image shows the **Publish app** page before you publish your app.

    ![Publish page-](./media/luis-how-to-publish-app/luis-first-publish.png)
 
    If you have previously published this app, this page looks like the following image: 
 
    ![Publish page](./media/luis-how-to-publish-app/luis-republish.png)

2. The first time you publish, the **Publish app** page shows your starter key. If you want to use a key other than the key shown, click the **Add Key** button. This action opens a dialog that allows you to select an existing endpoint key to assign to the app. For more information on how to create and add endpoint keys to your LUIS app, see [Manage your keys](Manage-Keys.md).

3. Choose whether to publish to **Production** or to **Staging** by selecting from the drop-down menu under **Publish to**. 

4. If you want to enable Bing Spell Check, click the **Enable Bing Spell Checker** check box. 

    >[!NOTE]
    >For a limited time, the option to enable Bing Spell Check is included with your LUIS subscription. However, you need to add `spellCheck=true` to the URL when you call the LUIS app endpoint to turn on spell checking. Checking the **Enable Bing Spell Checker** check box appends `spellCheck=true` to the URL that displays in the **Publish app** page when publish is complete. 

    ![Bing Spell Checker](./media/luis-how-to-publish-app/luis-enable-bing-spell-checker.png)

5. If you want the JSON response of your published app to include all intents defined in your app and their prediction scores, click **Include all predicted scores** checkbox to append a `verbose=true` parameter to the end-point URL. Otherwise, it includes only the top scoring intent.

    ![Verbose Mode](./media/luis-how-to-publish-app/luis-verbose.png)

6. Click **Publish to production slot** if you have selected the **Production** option under **Publish to**. Click **Publish to staging slot** if you have selected **Staging**. When the publish succeeds, use the displayed endpoint URL to access your LUIS app. 

    >[!NOTE]
    >If the **Publish** button is disabled, then either your app does not have an assigned endpoint key, or you have not trained your app yet.

    ![Endpoint URL displayed in Publish page](./media/luis-how-to-publish-app/luis-publish-url.png)

The endpoint URL corresponds to the Azure region associated with the endpoint key. To see endpoints and keys associated with other regions, use the radio buttons to switch regions. Each row in the **Resources and Keys** table lists Azure resource associated with your account and the endpoint keys associated with that resource.


## Test your published endpoint in a browser
You can test your published endpoint in a browser using the generated URL. To open this URL in your browser, set the URL parameter "&q" to your test query. For example, append `&q=Book me a flight to Boston on May 4` to your URL, and then press Enter. The browser displays the JSON response of your HTTP endpoint. 

![JSON response from a published HTTP endpoint](./media/luis-how-to-publish-app/luis-publish-app-json-response.png)


## Next steps

* See [Manage keys](./Manage-Keys.md) to add keys to your LUIS app, and learn about how keys map to regions.
* See [Train and test your app](Train-Test.md) for instructions on how to test your published app in the test console.
