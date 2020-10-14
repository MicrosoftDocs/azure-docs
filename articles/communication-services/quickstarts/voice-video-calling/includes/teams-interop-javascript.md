---
title: Quickstart - Join a Teams meeting
author: chpalm
ms.author: mikben
ms.date: 10/10/2020
ms.topic: quickstart
ms.service: azure-communication-services
---

## Prerequisites

- A working [Communication Services calling app](../getting-started-with-calling.md).
- A [Teams deployment](https://docs.microsoft.com/deployoffice/teams-install).

## Enable Teams Interoperability

The Teams interoperability feature is currently in private preview. To enable this feature for your Communication Services resource, please email [acsfeedback@microsoft.com](mailto:acsfeedback@microsoft.com) with:

1. The Subscription ID of the Azure subscription that contains your Communication Services resource.
2. Your Teams tenant ID. The easiest way to obtain this is to [obtain and share a link to the Team](https://support.microsoft.com/office/create-a-link-or-a-code-for-joining-a-team-11b0de3b-9288-4cb4-bc49-795e7028296f#:~:text=Create%20a%20link%20If%20you%E2%80%99re%20a%20team%20owner%2C,link%20into%20any%20browser%20to%20join%20the%20team).

You must be a member of the owning organization of both entities to use this feature.

## Add the Teams UI controls

Add a new text box and button within your HTML. The text box will be used to enter the Teams meeting context and the button will be used to join the specified meeting:

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

## Enable the Teams UI controls

We can now bind the **Join Teams Meeting** button to the code that joins the provided Teams meeting:

```javascript
meetingButton.addEventListener("click", () => {
    
    // join with meeting link
    call = callAgent.join({meetingLink: 'MEETING_LINK'}, {});

     // join with meeting coordinates
     call = callAgent.join({
        threadId: 'CHAT_THREAD_ID,
        organizerId: 'ORGANIZER_ID',
        tenantId: 'TENANT_ID',
        messageId: 'MESSAGE_ID'
    }, {})
    
    // toggle button states
    hangUpButton.disabled = false;
    callButton.disabled = true;
    meetingButton.disabled = true;
});
```

## Get the meeting context

The Teams context can be retrieved using Graph APIs. This is detailed in [Graph documentation](https://docs.microsoft.com/graph/api/onlinemeeting-createorget?view=graph-rest-beta&tabs=http).

You can also get the required meeting information from the **Join Meeting** URL in the meeting invite itself.

## Run the code

Webpack users can use the `webpack-dev-server` to build and run your app. Run the following command to bundle your application host on a local webserver:

```console
npx webpack-dev-server --entry ./client.js --output bundle.js --debug --devtool inline-source-map
```

Open your browser and navigate to http://localhost:8080/. You should see the following:

:::image type="content" source="../media/javascript/calling-javascript-app.png" alt-text="Screenshot of the completed JavaScript Application.":::

Insert the Teams context into the text box and press *Join Teams Meeting* to join the Teams meeting from within your Communication Services application.


## Schedule the Teams meeting

Schedule a meeting in Teams as [you normally would](https://support.microsoft.com/office/schedule-a-meeting-in-teams-943507a9-8583-4c58-b5d2-8ec8265e04e5). Note that in order for Azure Communication users to join, anonymous joins must be allowed in the [meeting settings](https://docs.microsoft.com/en-us/microsoftteams/meeting-settings-in-teams).



