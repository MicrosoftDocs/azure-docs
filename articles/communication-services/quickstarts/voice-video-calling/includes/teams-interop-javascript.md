---
title: Quickstart - Join a Teams meeting
author: chpalm
ms.author: mikben
ms.date: 10/10/2020
ms.topic: quickstart
ms.service: azure-communication-services
---

In this quickstart, you'll learn how your Azure application can join a Teams meeting

## Prerequisites

- A working Azure Communication Services Calling app. This quickstart picks off immediately after the [basic Calling quickstart](./getting-started-with-calling.md)
- A Teams deployment

## Enable Teams
The Teams interoperability feature is currently in private preview. To enable, please email [acsfeedback@microsoft.com](mailto:acsfeedback@microsoft.com) with:

1. Applicable Azure subscription id
2. Teams orgid

You must be the owning organization of both entities to use this feature.

## Add join Teams meeting input and button
Add a new text box for entering the Teams meeting context in `index.html` and a **Join Meeting** button:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Communication Client - Calling Sample</title>
  </head>
  <body>
    <h4>Azure Communication Services</h4>
    <h1>Calling Quickstart</h1>
    <input 
      id="callee-id-input"
      type="text"
      placeholder="Who would you like to call?"
      style="margin-bottom:1em; width: 200px;"
    />
    <input 
      id="teams-id-input"
      type="text"
      placeholder="Teams meeting context"
      style="margin-bottom:1em; width: 300px;"
    />
    <div>
      <button id="call-button" type="button" disabled="true">
        Start Call
      </button>
      &nbsp;
      <button id="hang-up-button" type="button" disabled="true">
        Hang Up
      </button>
         <button id="meeting-button" type="button" disabled="false">
        Join Teams Meeting
      </button>
    </div>
    <script src="./bundle.js"></script>
  </body>
</html>
```

## Schedule the Teams meeting
Schedule a meeting in Teams as [you normally would](https://support.microsoft.com/office/schedule-a-meeting-in-teams-943507a9-8583-4c58-b5d2-8ec8265e04e5). Note that in order for Azure Communication users to join, anonymous joins must be allowed in the [meeting settings](https://docs.microsoft.com/en-us/microsoftteams/meeting-settings-in-teams).

## Get the meeting context using Graph APIs
Programmatically you can get the Teams context using Graph APIs, this is detailed in [Graph documentation](https://docs.microsoft.com/graph/api/onlinemeeting-createorget?view=graph-rest-beta&tabs=http).

You can also get the required meeting information from the **Join Meeting** URL in the meeting invite itself.

## Add the join meeting code
Now we bind the **Join Teams Meeting** button to code that will join the provided Teams meeting:

```javascript
meetingButton.addEventListener("click", () => {
    // join a Teams meeting
    const userToCall = meetingInput.value;
    call = callAgent.call(
        [{ communicationUserId: userToCall }],
        {}
    );
    // toggle button states
    hangUpButton.disabled = false;
    callButton.disabled = true;
    meetingButton.disabled = true;
});
```

## Run the code

Use the `webpack-dev-server` to build and run your app. Run the following command to bundle application host in on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and navigate to http://localhost:8080/. You should see the following:

:::image type="content" source="../media/javascript/calling-javascript-app.png" alt-text="Screenshot of the completed JavaScript Application.":::

Inserting the Teams context into the applicable text box and pressing *Join Teams Meeting* will start a call to the meeting. 
