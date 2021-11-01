---
title: "Tutorial: Get user profile from a web API"
titleSuffix: Microsoft identity platform
description: In this tutorial, you will use a React single-page application to call a web API and get user data
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.workload: identity
ms.date: 09/27/2021
ms.author: dmwendia
ms.reviewer: marsma, dhruvmu
ms.custom: include
---

## Acquire a token

Before calling an API, such as Microsoft Graph, you'll need to acquire an access token. Add the following code to index.js

```
const getGraphToken =  async (msalInstance, accounts) => {
  const tokenRequest = {
    scopes: ["User.Read", "openid", "profile"],
    account: accounts
  }
  
  try{
    const {accessToken} = await msalInstance.acquireTokenSilent(tokenRequest);
    return accessToken;
  } catch (e) {
    const {accessToken} = await msalInstance.acquireTokenPopup(tokenRequest);
    return accessToken;
  }
  
```


## Call MS Graph API

```
const MICROSOFT_GRAPH_URL = "https://graph.microsoft.com/v1.0"

const fetchUserDetails = async (msalInstance, accounts, setUserDetails) => {
  const bearer = `Bearer ${await getGraphToken(msalInstance, accounts)}`;
  const response = await fetch(`${MICROSOFT_GRAPH_URL}/me`, { 
    method: 'get', 
    headers: new Headers({
      'Authorization': bearer
    })
  }).then(res => res.json());

  setUserDetails(response)
}
```

## Next steps

In this tutorial, you <!-- $TASKS_COMPLETED_AND_LEARNINGS_HERE -->.

Now that you have an app that can sign in users and call a web API, $NEXT_STEP_DESCRIPTION_HERE.

> [!div class="nextstepaction"]
> [$NEXT_STEP_HERE](../../authorization-basics.md)
