---
title: Add SMS To Your Web App
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

# Quickstart: Add SMS to your web app

Get started with the SMS SDK. Follow these steps to install the package and try out the example code to send SMS.

## Prerequisites

1. Install [Node.js](https://nodejs.org)
2. A valid Communication Services resource key [see quickstart for ARM resources](https://msazure.visualstudio.com/One/_git/COSINE-DEP-Spool?path=%2Fsamples%2FExternal%2Fquickstarts%2Fquickstart-getspoolresource-armclient.md&_a=preview)
3. A valid phone number to be used as the sender. [See the quickstart for acquiring and configuring a phone number](https://review.docs.microsoft.com/en-us/azure/project-spool/tutorials/provision-and-release-phone-numbers?branch=pr-en-us-104477).
Todo: This should have details about UI config needed to enable SMS and any roles and permissions needed to setup the phone number to work.

## Steps

1. Install the ACS Server SDK and project dependencies. This is done by adding the packages as dependencies in [package.json](https://docs.npmjs.com/files/package.json) for your project. Then run `npm run auth` and `npm install`.

    ```json
    "dependencies": {
        "@azure/acs-auth": "https://www.myget.org/F/acs-sdk/auth/de20e499-3c4d-4204-bada-c209d6b770b6/npm/@azure/acs-auth/-/0.1.4.tgz",
        "@azure/acs-server": "https://www.myget.org/F/acs-sdk/server/de20e499-3c4d-4204-bada-c209d6b770b6/npm/@azure/acs-server/-/0.1.4.tgz"
        }
    ```

    ```ps
    npm run auth
    npm install
    ```

    You can check that the packages were downloaded correctly by checking your `node_modules` folder.
    Todo: Update the package names and urls. 

2. Todo: Once the auth story for SMS is locked down, need to add step to get ACS token and any other roles/pwrmissions needed.

3. To store all configurations needed by your server, create a file called Config.js. This file should include the connectionString and endpoint that you will need to connect to your azure subscription. For SMS, you will need sender id as well. All this info will be available from prereq steps 2 & 3.

    ```js
    let config = {
    // Replace <SPOOL CONNECTION STRING> with your Spool connection string provided by Azure.
    spoolConnectionString: "<SPOOL CONNECTION STRING>",
    // Replace <SPOOL RESOURCE ENDPOINT STRING> with your Spool Endpoint e.g."https://myspoolresource.westus2.spool.azure.net/";
    spoolResourceEndpoint: "<SPOOL RESOURCE ENDPOINT STRING>",
    port: 3000,
    SMS_SENDER_ID: "<SENDER ID>"
    // Replace <SENDER ID> with the phone number you want to send SMS to. It should be in the format of `+<country_code><area_code><phone_number>`
    };

    module.exports = config;
    ```

    Todo:  Verify the property names and replace Spool keyword with actual brand name.

4. Now lets add the code to send a SMS from your app server. We will be using sendSMS API for that.

    ```js
    const config = require("./Config");

    let recipientId = "<update_with_recipient_number>";
    let contents = "Hello from Contoso! Reminder that your order pickup is scheduled for 3pm today. Our staff will be looking forward to meet you at the pickup counter.";

    // Instantiate SmsAPI object.
    const smsSdk = new SpoolSmsAPI({ baseUri: config.spoolResourceEndpoint });

    await smsSdk.sendSMS({
        body: {
            senderId: config.SMS_SENDER_ID,
            recipientId: recipientId,
            contents: contents
        }
    }, responseCallback(res));
    ```

    Todo: add the package to import once its locked down.

5. To avoid unexpected behaviour, always parse the response to check for success/failure and accordingly handle the scenario in the callback func. Lets look into what `responseCallback` can looks like.

    ```js
    function responseCallback(appResponse) {
        return (err, result, request, response) => {
            if (response) {
                console.log(JSON.stringify(response));

                if (response.status == 200 || response.status == 202) {
                    console.log("Success");
                }
                else {
                    console.log("Error sending message with status " + response.status);
                }
            }
            else {
                console.log("Error: No Response");
            }
        }
    }
    ```

    See the [complete list of errors](https://review.docs.microsoft.com/en-us/azure/project-spool/?branch=pr-en-us-104477) that sendSMS SDK can repond back with.
    And its as simple as that!

## Run the sample app

If you wanna play around with SMS functionality, you can use the [sample app](https://skype.visualstudio.com/SCC/_git/client_crossplatform_spool-sdk?path=%2Fsrc%2FSDK%2Fweb%2Fsms-demo&version=GBmaster) which has all the code specified above and more.

1. Open a terminal window, navigate to the folder where you downloaded the sample to. Run `npm install` again just to make sure we have everything.
2. Next run `npm start`. This will run the `start` script inside package.json.

    ```ps
    npm run auth
    npm install
    npm start
    ```

3. Open a tab in your web browser and navigate to <http://localhost:3000> In that tab, you can mention the recipient
phone number and text body and click Send!

## Debugging the sample app

With a current version of [VS Code](https://code.visualstudio.com/), just open the _sample_ folder and hit F5, then select _Node_. VS Code will automatically run the server with `node app.js` and attach a debugger so you can set breakpoints. No extra _launch.json_ needed.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../communication-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../communication-services-apis-create-account-cli.md#clean-up-resources)

## Next steps
Todo: more enhanced steps like recieving SMS, analysing text using AI, etc.


#### meta:

-  Customer intent statements: 
   - I want to know how to send SMS messages to my users.
   - I want to know how to receive and process SMS messages.
   - I want to know how to send MMS messages to my users.

- Resources: 
  - [Spool Contributor Quickstart](https://review.docs.microsoft.com/en-us/azure/project-spool/contribute?branch=pr-en-us-104477)

- Gold Standard Docs:
  - TODO

- Discussion:
  - {shawn} This is about more than just web services - simple outbound scenarios may be mature, but Spool's offering includes "inbound IVR scenarios". This isn't coming in as soon - still needs work. 
  - {shawn} While there's a mature M365 SDK, leveraging through spool isn't very easy.

- TODOs:
  - Find related gold standard docs
  - Editorial Pass
  - Test links
  - Add context
  - Remove relative links
  
<br>
<br>
<br>
