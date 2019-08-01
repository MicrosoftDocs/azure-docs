---
title: How to create a Conversation Learner model using Node.js - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to create a Conversation Learner model using Node.js.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# Create a Conversation Learner model using Node.js

Conversation Learner reduces the complexity of building bots. It enables a hybrid development work-flow allowing hand-written code and machine learning to reduce the amount of code required to write bots. Certain fixed parts of your model, such as checking if the user is logged in, or making an API request to check store inventory, can still be coded. However, other changes in state and action selection can be learned from example dialogs given by the domain expert or developer.

## Invitation required

*An invitation is required to access Project Conversation Learner.*

Project Conversation Learner consists of an SDK you add to your bot, and a cloud service which the SDK accesses for machine learning.  At present, access to the Project Conversation Leaner cloud service requires an invitation.  If you haven't been invited already, [request an invitation](https://aka.ms/conversation-learner-request-invite).  If you have not received an invitation, you will be unable to access the cloud API.

## Prerequisites

- Node 8.5.0 or higher and npm 5.3.0 or higher. Install from [https://nodejs.org](https://nodejs.org).
  
- LUIS authoring key:

  1. Log into [https://www.luis.ai](https://www.luis.ai).

  2. Click on your name in the upper right, then on "settings"

  3. Authoring key is shown on the resulting page

  (Your LUIS authoring key serves 2 roles.  First, it will serve as your Conversation Learner authoring key.  Second, Conversation Learner uses LUIS for entity extraction; the LUIS authoring key is used to create LUIS models on your behalf)

- Google Chrome web browser. Install from [https://www.google.com/chrome/index.html](https://www.google.com/chrome/index.html).

- git. Install from [https://git-scm.com/downloads](https://git-scm.com/downloads).

- VSCode. Install from [https://code.visualstudio.com/](https://code.visualstudio.com/). Note this is recommended, not required.

## Quick start 

1. Install and build:

    ```bash    
    git clone https://github.com/Microsoft/ConversationLearner-Samples cl-bot-01
    cd cl-bot-01
    npm install
    npm run build
    ```

    > [!NOTE]
	> During `npm install`, you can ignore this error if it occurs: `gyp ERR! stack Error: Can't find Python executable`

2. Configure:

   Create a file called `.env` in the directory `cl-bot-01`.  The contents of the file should be:

   ```
   NODE_ENV=development
   LUIS_AUTHORING_KEY=<your LUIS authoring key>
   ```

3. Start bot:

    ```
    npm start
    ```

    This runs the generic empty bot in `cl-bot-01/src/app.ts`.

3. Open browser to `http://localhost:3978`

You're now using Conversation Learner and can create and teach a Conversation Learner model.  

> [!NOTE]
> At launch, Project Conversation Learner is available by invitation.  If `http://localhost:3978/ui` shows an HTTP `403` error, this means your account has not been invited.  Please [request an invitation](https://aka.ms/conversation-learner-request-invite).

## Tutorials, demos, and switching between bots

The instructions above started the generic empty bot.  To run a tutorial or demo bot instead:

1. If you have the Conversation Learner web UI open, return to the list of models at `http://localhost:3978/ui/home`.
    
2. If another bot is running (like `npm start` or `npm run demo-pizza`), stop it.  You do not need to stop the UI process, or close the web browser.

3. Run a demo bot from the command line (step 2 above).  Demos include:

   ```bash
   npm run tutorial-general
   npm run tutorial-entity-detection
   npm run tutorial-session-callbacks
   npm run tutorial-api-calls
   npm run tutorial-hybrid
   npm run demo-password
   npm run demo-pizza
   npm run demo-storage
   ```

4. If you're not already, switch to the Conversation Learner web UI in Chrome by loading `http://localhost:3978/ui/home`. 

5. Click on "Import tutorials" and select the demo model in the Conversation Learner UI that corresponds to the demo you started.

Source files for the demos are in `cl-bot-01/src/demos`

## Create a bot which includes back-end code

1. If you have the Conversation Learner web UI open, return to the list of models at `http://localhost:3978/ui/home`.
    
2. If a bot is running (like `npm run demo-pizza`), stop it.  You do not need to stop the UI process, or close the web browser.

3. If desired, edit code in `cl-bot-01/src/app.ts`.

4. Rebuild and re-start bot:

    ```bash    
    npm run build
    npm start
    ```

5. If you're not already, switch to the Conversation Learner web UI in Chrome by loading `http://localhost:3978/ui/home`. 

6. Create a new Conversation Learner model in the UI, and start teaching.

7. To make code changes in `cl-bot-01/src/app.ts`, repeat the steps above, starting from step 2.

## VSCode

In VSCode, there are run configurations for each demo, and for the "Empty bot" in `cl-bot-01/src/app.ts`.  Open the `cl-bot-01` folder in VSCode.

## Advanced configuration

There is a template `.env.example` file shows what environment variables you may set to configure the samples.

You can adjust these ports to avoid conflicts between other services running on your machine by adding a `.env` file to root of project:

```bash
cp .env.example .env
```

This uses the standard configuration, which lets you run your bot locally, and start using Conversation Learner.  (Later on, to deploy your bot to the Bot Framework, some edits to this file will be needed.)

## Support

- Tag questions on [Stack Overflow](https://stackoverflow.com) with "microsoft cognitive"
- Request a feature on our [User Voice page](https://aka.ms/conversation-learner-uservoice)
- Open an issue on our [GitHub repo](https://github.com/Microsoft/ConversationLearner-Samples)

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Source repositories

- [conversationlearner-samples](https://github.com/Microsoft/ConversationLearner-Samples)
- [conversationlearner-sdk](https://github.com/Microsoft/ConversationLearner-SDK)
- [conversationlearner-models](https://github.com/Microsoft/ConversationLearner-Models)
- [conversationlearner-ui](https://github.com/Microsoft/ConversationLearner-UI)
- [conversationlearner-webchat](https://github.com/Microsoft/ConversationLearner-WebChat)

## Next steps

> [!div class="nextstepaction"]
> [Hello world](./tutorials/01-hello-world.md)
