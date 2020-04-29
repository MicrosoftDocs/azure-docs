---
title: Get Started With Chat
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---


# Get Started With Chat

This quickstart will teach you how to use Spool to send messages back and forth between two web application clients.




#### Meta:

-  Customer intent statements: 
   - I want to know how to get started with messaging on Spool.

- Discussion:
  - TODO

- TODOs:
  - Draft initial content
  
  
## Prerequisites

1. Install [Node.js](https://nodejs.org)
2. A valid Azure Communication Service resource id [see quickstart for ARM resources](https://msazure.visualstudio.com/One/_git/COSINE-DEP-Spool?path=%2Fsamples%2FExternal%2Fquickstarts%2Fquickstart-getspoolresource-armclient.md&_a=preview)

## Background
This sample will have three different parts: Two chat participants for sending/receiving chat messages and an entity to generate auth tokens for the two participants. 

## Steps
1. TODO: add steps to get the ACS jwt tokens/any other roles/permissions needed.
2. For installing the ACS SDK and project dependencies, create .npmrc file in the same directory as package.json file and add the following content into it.
    ```json
    @skype:registry=https://skype.pkgs.visualstudio.com/_packaging/csc/npm/registry/
    always-auth=true
    ```
    and run these commands in your terminal 
    ```ps
    vsts-npm-auth -config path-to-your\.npmrc
    npm install @skype/spool-sdk
    ```

    if `vsts-npm-auth` is not installed run following first:
    ```ps
    npm install -g vsts-npm-auth
    ```


    After installing the Spool SDK you can check that the packages were downloaded correctly by checking your `node_modules` folder.

    TODO: this will be moved to npm registry eventually, there will not be a need for this


4. Below code is minimal code to initialize the chat client and send a message from Alice to Bob.

    ```js
     import CpaasClient from '@skype/spool-sdk';

     let cpaasOptions = {
                config: {
                    credentialProvider: () => {
                        return {
                            serviceToken: { token: "<jwt auth token>", expiration: "<token expiry>" },
                            //TODO How MRIs are determined
                            mri: "AliceMri",
                            resourceId: "<spool resourceid>"
                        }
                    },
                    userDisplayName: "Alice"
                }
            };
    };
    
    let cpaasclient = new CpaasClient(cpaasOptions);

    let recieverChatMember = {
        userId: "BobMri",
        displayName: "Bob"
    }

    let chat = await cpaasclient.chat(receiverChatMember);

    chat.sendMessage({
        clientMessageId: 1234,
        messageType: "Text",
        priority: "Normal",
        content: "Hello Bob",
        senderDisplayName: "Bob"
    });
    //TODO: add exception handling.

    ```

    TODO: wire up events. Currently not supported by the SDk.

     See the [complete list of errors](https://review.docs.microsoft.com/en-us/azure/project-spool/?branch=pr-en-us-104477) that sendMessage repond back with.
    And its as simple as that!

5. Now on the Bob side, he will receive a notification with the message content. Below is a minimal code for the receiver. 

    ```js
    //TODO: receive is not supported yet. 
    ```

## Run the sample app

If you wanna play around with chat functionality, you can use the [sample app](https://skype.visualstudio.com/SCC/_git/client_crossplatform_spool-sdk?path=%2Fsrc%2FSDK%2Fweb%2Fchat-demo&version=GBmaster) which has all the code specified above and more.

1. Open a terminal window, navigate to the folder where you downloaded the sample to. Run `npm install` again just to make sure we have everything.
2. Next run `npm start`. This will run the `start` script inside package.json.

    ```ps
    npm run auth
    npm install
    npm start
    ```

TODO: sample app not ready yet. Add instructions for the sample app. 

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../communication-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../communication-services-apis-create-account-cli.md#clean-up-resources)

## Next steps
TODO: Advanced chat stuff: broadcast to the thread, sending messages using API key( form server side) etc, 
