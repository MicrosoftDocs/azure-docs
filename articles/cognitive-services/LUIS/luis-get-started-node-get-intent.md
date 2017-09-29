---
title: Call a Language Understanding Intelligent Services (LUIS) app using Node.js | Microsoft Docs 
description: Learn to call a LUIS app using Node.js. 
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 04/26/2017
ms.author: v-demak
---

# Call a LUIS app using JavaScript

This Quickstart shows you how to call your Language Understanding Intelligent Service (LUIS) app in just a few minutes. When you're finished, you'll be able to use JavaScript code to pass utterances to a LUIS endpoint and get results.

## Before you begin
You need a Cognitive services API key to make calls to the sample LUIS app we use in this walkthrough. 
To get an API key follow these steps: 
  1. You first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  2. Log in to the Azure portal at https://portal.azure.com. 
  3. Follow the steps in [Creating Subscription Keys using Azure](./AzureIbizaSubscription.md) to get a key.
  4. Go back to https://www.luis.ai and log in using your Azure account. 

## Understand what LUIS returns

To understand what a LUIS app returns, you can paste the URL of a sample LUIS app into a browser window. The sample app you'll use is an IoT app that detects whether the user wants to turn on or turn off lights.

1. The endpoint of the sample app is in this format: `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/60340f5f-99c1-4043-8ab9-c810ff16252d?subscription-key=<YOUR_API_KEY>&verbose=false&q=turn%20on%20the%20left%20light`. Copy the URL and paste in your subscription key for the value of the `subscription-key` field.
2. Paste the URL into a browser window and press Enter. The browswer displays a JSON result that indicates that LUIS detects the `TurnOn` intent and the `Light` entity with the value `left`.

    ![JSON result detects the intent TurnOn](./media/luis-get-started-node-get-intent/json-turn-on-left.png)
3. Change the value of the `q=` parameter in the URL to `turn off the floor light`, and press enter. The result now indicates that the LUIS detected the `TurnOff` intent and the `Light` entity with value `floor`. 

    ![JSON result detects the intent TurnOff](./media/luis-get-started-node-get-intent/json-turn-off-floor.png)


## Consume a LUIS result using the Endpoint API with JavaScript 

You can use JavaScript to access to the same results you saw in the browser window in the previous step. 
1. Copy the code that follows and save it into an HTML file:

```javascript
<!DOCTYPE html>
<html>
<head>
    <title>JSSample</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
</head>
<body>

<script type="text/javascript">
    $(function() {
        var params = {
            // Request parameters
            "timezoneOffset": "0",
            "verbose": "false",
            "spellCheck": "false",
            "staging": "false",
        };
      
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/60340f5f-99c1-4043-8ab9-c810ff16252d?q=turn%20on%20the%20left%20light" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","YOUR SUBSCRIPTION KEY");
            },
            type: "GET",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            alert("Detected the following intent: " + data.topScoringIntent.intent);
        })
        .fail(function() {
            alert("error");
        });
    });
</script>
</body>
</html>
```
2. Replace `"YOUR SUBSCRIPTION KEY"` with your subscription key in this line of code

3. Open the file you saved using a web browser.  An alert window should pop up that says `Detected the following intent: TurnOn`.

![Popup that says TurnOn](./media/luis-get-started-node-get-intent/popup-turn-on.png)

## Next steps

* Try adding a parameter to the code to test some other utterances to the sample app.
