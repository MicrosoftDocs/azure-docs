---
title: Tutorial - Embed a Teams call widget into your web application
titleSuffix: An Azure Communication Services tutorial
description: Learn how to use Azure Communication Services to embed a calling widget into your web application.
author: tophpalmer
manager: shahen
services: azure-communication-services
ms.author: chpalm
ms.date: 04/17/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
---

# Embed a Teams call widget into your web application

Enable your customers to talk with your support agent on Teams through a call interface directly embedded into your web application. 

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites
- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).

## Set up an Azure Function to provide access tokens

Follow instructions from our [trusted user access service tutorial](../trusted-service-tutorial.md) to deploy your Azure Function for access tokens. This service returns an access token that our widget uses to authenticate to Azure Communication Services and start the call to the Teams user we define.

## Set up boilerplate vanilla web application

1. Create an HTML file named `index.html` and add the following code to it:

    ``` html

        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Call Widget App - Vanilla</title>
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <div id="call-widget">
                    <div id="call-widget-header">
                        <div id="call-widget-header-title">Call Widget App</div>
                        <button  class='widget'> ? </button >
                        <div class='callWidget'></div>
                    </div>
                </div>
            </body>
        </html>

    ```

2. Create a CSS file named `style.css` and add the following code to it:

    ``` css

        .widget {
        height: 75px;
        width: 75px;
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: blue;
        margin-bottom: 35px;
        margin-right: 35px;
        border-radius: 50%;
        text-align: center;
        vertical-align: middle;
        line-height: 75px;  
        color: white;
        font-size: 30px;
      }

      .callWidget {
        height: 400px;
        width: 600px;
        background-color: blue;
        position: absolute;
        right: 35px;
        bottom: 120px;
        z-index: 10;
        display: none;
        border-radius: 5px;
        border-style: solid;
        border-width: 5px;
      }

    ```

3. Configure the call window to be hidden by default. We show it when the user clicks the button.

    ``` html

        <script>
            var open = false;
            const button = document.querySelector('.widget');
            const content = document.querySelector('.callWidget');
            button.addEventListener('click', async function() {
                if(!open){
                    open = !open;
                    content.style.display = 'block';
                    button.innerHTML = 'X';
                    //Add code to initialize call widget here
                } else if (open) {
                    open = !open;
                    content.style.display = 'none';
                    button.innerHTML = '?';
                }
            });

            async function getAccessToken(){
                //Add code to get access token here
            }
        </script>

    ```

At this point, we have set up a static HTML page with a button that opens a call widget when clicked. Next, we add the widget script code. It makes a call to our Azure Function to get the access token and then use it to initialize our call client for Azure Communication Services and start the call to the Teams user we define.

## Fetch an access token from your Azure Function

Add the following code to the `getAccessToken()` function:

``` javascript

    async function getAccessToken(){
        const response = await fetch('https://<your-function-name>.azurewebsites.net/api/GetAccessToken?code=<your-function-key>');
        const data = await response.json();
        return data.token;
    }

```
    
You need to add the URL of your Azure Function. You can find these values in the Azure portal under your Azure Function resource.


## Initialize the call widget

1. Add a script tag to load the call widget script:

    ``` html

        <script src="https://github.com/ddematheu2/ACS-UI-Library-Widget/releases/download/widget/callComposite.js"></script>

    ```

We provide a test script hosted on GitHub for you to use for testing. For production scenarios, we recommend hosting the script on your own CDN. For more information on how to build your own bundle, see [this article](https://azure.github.io/communication-ui-library/?path=/docs/use-composite-in-non-react-environment--page#build-your-own-composite-js-bundle-files).

2. Add the following code under the button event listener:

    ``` javascript

        button.addEventListener('click', async function() {
            if(!open){
                open = !open;
                content.style.display = 'block';
                button.innerHTML = 'X';
                let response = await getChatContext();
                console.log(response);
                const callAdapter = await callComposite.loadCallComposite(
                    {
                    displayName: "Test User",
                    locator: { participantIds: ['INSERT USER UNIQUE IDENTIFIER FROM MICROSOFT GRAPH']},
                    userId: response.user,
                    token: response.userToken
                    },
                    content,
                    {
                        formFactor: 'mobile',
                        key: new Date()
                    }
                );
            } else if (open) {
                open = !open;
                content.style.display = 'none';
                button.innerHTML = '?';
            }
        });

    ```

Add a Microsoft Graph [User](https://learn.microsoft.com/graph/api/resources/user?view=graph-rest-1.0) ID to the `participantIds` array. You can find this value through [Microsoft Graph](https://learn.microsoft.com/graph/api/user-get?view=graph-rest-1.0&tabs=http) or through [Microsoft Graph explorer](https://developer.microsoft.com/graph/graph-explorer) for testing purposes. There you can grab the `id` value from the response.

## Run code

Open the `index.html` in a browser. This code initializes the call widget when the button is clicked. It makes a call to our Azure Function to get the access token and then use it to initialize our call client for Azure Communication Services and start the call to the Teams user we define.
