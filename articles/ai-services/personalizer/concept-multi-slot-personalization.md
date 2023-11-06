---
title: Multi-slot personalization
description: Learn where and when to use single-slot and multi-slot personalization with the Personalizer Rank and Reward APIs.
services: cognitive-services
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: conceptual
ms.date: 05/24/2021
ms.custom: mode-other
---

# Multi-slot personalization (Preview)

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Multi-slot personalization (Preview) allows you to target content in web layouts, carousels, and lists where more than one action (such as a product or piece of content) is shown to your users. With Personalizer multi-slot APIs, you can have the AI models in Personalizer learn what user contexts and products drive certain behaviors, considering and learning from the placement in your user interface. For example, Personalizer may learn that certain products or content drive more clicks as a sidebar or a footer than as a main highlight on a page.

In this article, you'll learn why multi-slot personalization improves results, how to enable it, and when to use it. This article assumes that you are familiar with the Personalizer APIs like `Rank` and `Reward`, and have a conceptual understanding of how you use it in your application. If you aren't familiar with Personalizer and how it works, review the following before you continue:

* [What is Personalizer](what-is-personalizer.md) 
* [How Personalizer Works](how-personalizer-works.md) 

> [!IMPORTANT] 
>  Multi-slot personalization is in Public Preview. Features, approaches and processes will change based on user feedback. Enabling the multi-slot preview will disable other Personalizer functionality in your loop permanently. Multi-slot personalization cannot be turned off once it is enabled for a Personalizer loop. Read this document and consider the impact before configuring a Personalizer loop for multi-slot personalization.

<!-- 
We encourage you to provide feedback on multi-slot personalization APIs via ...
-->

## When to use Multi-Slot personalization

Whenever you display products and/or content to users, you may want to show more than one item to your customers. For example:

* **Website layouts for home pages**: Many tiles and page areas are dedicated to highlighting content in boxes, banners, and sidebars of different shapes and sizes. Multi-slot personalization will learn how the characteristics of this layout affect customers' choices and actions.
* **Carousels**: Carousels of dynamically changing content need a handful of items to cycle. Multi-slot personalization can learn how sequence and even display duration affects clicks and engagement.
* **Related products/content and embedded references**: It is common to engage users by embedding or interspersing references to additional content and products in banners, side-bars, vignettes, and footer boxes. Multi-slot personalization can help you allocate your references where they are most likely to drive more use.
* **Search results or lists**: If your application search functionality, where you provide results as lists or tiles, you can use multi-slot personalization to choose which items to highlight at the top considering more metadata than traditional rankers.
* **Dynamic channels and playlists**: Multi-slot personalization can help determine a short sequence for a list of videos or songs to play next in a dynamic channel.

Multi-slot personalization allows you to declare the "slots" in the user interface that actions need to be chosen for. It also allows you to provide more information about the slots so that Personalizer can use to improve product placement - such as is this a big box or a small box? Does it display a caption or only a feature? Is it in a footer or a sidebar?


## How to use Multi-slot personalization 

1. [Enable multi-slot Personalization](#enable-multi-slot-personalization)
1. [Create JSON object for Rank request](#create-json-object-for-a-rank-request)
1. [Call the Rank API defining slots and baseline actions](#use-the-response-of-the-rank-api)
1. [Call the Rewards APIs](#call-the-reward-api)


### Enable multi-slot personalization 

See [Differences between single-slot and multi-slot Personalization](#differences-between-single-slot-and-multi-slot-personalization) below to understand and decide whether multi-slot personalization is useful to you. *Multi-slot personalization is a preview feature*: We encourage you to create a new Personalizer loop if you are wanting to test multi-slot personalization APIs, as enabling it is non-reversible, and will have effects on a Personalizer loop running in production.

Once you have decided to convert a loop to multi-slot personalization, you must follow these steps once for this Personalizer loop:

[!INCLUDE [Upgrade Personalizer instance to Multi-Slot](./includes/upgrade-personalizer-multi-slot.md)]

### Create JSON object for a Rank request
Using multi-slot personalization requires an API that differs slightly from the single-slot personalization API.

You declare the slots available to assign actions to in each Rank call request, in the slots object:

* **Array of slots**: You need to declare an array of slots. Slots are *ordered*: the position of each slot in the array matters. We strongly recommend ordering your slot definitions based on how many rewards/clicks/conversions each slot tends to get, starting with the one that gets the most. For example, you'd put a large home page "hero" box for a website as slot 1, rather than a small footer.  All other things being equal, Personalizer will assign actions with more chances of getting rewards earlier in the sequence.
* **Slot ID**: You need to give a slotId to each slot - a string unique for all other slots in this Rank call.
* **Slot features**: You should provide additional metadata that describes and further distinguishes it from other slots. These are called *features*. When determining slot features, you must follow the same guidelines recommended for the features of context and actions (See: [Features for context and actions]()).  Typical slot features help identify size, position, or visual characteristics of a user interface element. For example `position: "top-left"`, `size: "big"`, `animated: "no"`, `sidebar: "true"` or  `sequence: "1"`.
* **Baseline actions**: You need to specify the baseline action ID for each slot. That is, the ID of the Action that would be shown in that slot if Personalizer didn't exist. This is required to train Personalizer in [Apprentice Mode]() and to have a meaningful number when doing [Offline Evaluations]().
* **Have enough actions**: Make sure you call Rank with more Actions than slots, so that Personalizer can assign at least one action to each slot. Personalizer won't repeat action recommendations across slots: The rank response will assign each action at most to one slot. 

It is OK if you add or remove slots over time, add and change their features, or re-order the array: Personalizer will adapt and keep training based on the new information.

Here is an example `slots` object with some example features. While the majority of the `slots` object will be stable (since UIs tend to change slowly), most of it won't change often: But you must make sure to assign the appropriate baselineAction Ids to each Rank call. 


```json
"slots": [ 
    { 
      "id": "BigHighlight", 
      "features": [ 
            { 
              "size": "Large", 
              "position": "Left-Middle" 
            }
        ],
        "baselineAction": "BlackBoot_4656" 
    }, 

    { 
      "id": "Sidebar1", 
      "features": [ 
            { 
              "size": "Small", 
              "position": "Right-Top" 
            } 
        ],
        "baselineAction": "TrekkingShoe_1122"  
    }  
  ]

```


### Use the Response of the Rank API

A multi-slot Rank response from the request above may look like the following: 

```json
{ 
  "slots": [ 
        { 
          "id": "BigHighlight", 
          "rewardActionId": "WhiteSneaker_8181" 
        }, 
        { 
          "id": "SideBar1", 
          "rewardActionId": "BlackBoot_4656" 
        } 
    ], 
  "eventId": "123456D0-BFEE-4598-8196-C57383D38E10" 
} 
```

Take the rewardActionId for each slot, and use it to render your user interface appropriately.

### Call the Reward API

Personalizer learns how to choose actions that will maximize the reward obtained. Your application will observe user behavior and compute a "reward score" for Personalizer based on the observed reaction. For example, if the user clicked on the action in the `"slotId": "SideBar1",`, you will send a "1" to Personalizer to provide positive reinforcement for the action choices.

The reward API specifies the eventId for the reward in the URL:

```http
https://{endpoint}/personalizer/v1.0/events/{eventId}/reward
``` 

For example, the reward for the event above with ID: 123456D0-BFEE-4598-8196-C57383D38E10/reward will be sent to `https://{endpoint}/personalizer/v1.0/events/123456D0-BFEE-4598-8196-C57383D38E10/reward/reward`:

```json
{ 
  "reward": [ 
    { 
      "slotId": "BigHighlight", 
      "value": 0.2 
    }, 
    { 
      "slotId": "SideBar1", 
     "value": 1.0 
    }, 
  ] 
} 
```

You don't need to provide all reward scores in just one call of the Reward API. You can call the Reward API multiple times, each with the appropriate eventId and slotIds. 
If no reward score is received for a slot in an event, Personalizer will implicitly assign theDefault Reward configured for the loop (typically 0).


## Differences between single-slot and multi-slot personalization

There are differences in how you use the Rank and Reward APIs with single and multi-slot personalization:

|  Description	| Single-slot Personalization 	| Multi-slot Personalization 	|  
|---------------|-------------------------------|-------------------------------|
| Rank API call request elements | You send a Context object and a list of Actions 	| You send Context, a list of Actions, and an ordered list of Slots  	| 
| Rank request specifying baseline | Personalizer will take the first Action in the action list as the baseline action (The item your application would have chosen if Personalizer didn't exist).|You must specify the baseline ActionID that would have been used in each Slot.|
| Rank API call response | Your application highlights the action indicated in the rewardActionId field 	| The response includes a different rewardActionId for each Slot that was specified in the request. Your application will show those rewardActionId actions in each slot. | 
| Reward API call | You call the Reward API with a reward score, which you calculate from how the users interacted with rewardActionId for this particular eventId. For example, if the user clicked on it, you send a reward of 1. 	| You specify the Reward for each slot, given how well the action with rewardActionId elicited desired user behavior. This can be sent in one or multiple Reward API calls with the same eventId. 	| 


### Impact of enabling multi-slot for a Personalizer loop

Additionally, when you enable multi-slot, consider the following:

|  Description	| Single-slot Personalization 	| Multi-slot Personalization 	| 
|---------------|-------------------------------|-------------------------------|
| Inactive events and activation 	| When calling the activate API, Personalizer will activate the event, expecting a Reward score or assigning the configured Default Reward if Reward Wait Time is exceeded. | Personalizer activates and expects rewards for all slots that were specified in the eventId |  	
| Apprentice Mode | Personalizer Rank API always returns the baseline action, and trains internal models by imitating the baseline action.| Personalizer Rank API returns the baseline action for each slot specified in the baselineAction field. Personalizer will train internal models on imitating the first |
| Learning speed | Only learns from the one highlighted action | Can learn from interactions with any slot. This typically means more user behaviors that can yield rewards, which would result in faster learning for Personalizer. |  
| Offline Evaluations |Compares performance of Personalizer against baseline and optimized learning settings, based on which Action would have been chosen them.| (Preview Limitation) Only evaluates performance of the first slot in the array. For more accurate evaluations, we recommend making sure the slot with most rewards is the first one in your array. |
| Automatic Optimization (Preview) | Your Personalizer loop can periodically perform Offline Evaluations in the background and optimize Learning Settings without administrative intervention | (Preview Limitation) Automatic Optimization is disabled for Personalizer loops that have multi-slot APIs enabled. |

## Next steps
* [How to use multi-slot personalization](how-to-multi-slot.md)
* [Sample: Jupyter notebook running a multi-slot personalization loop](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/Personalizer/azure-notebook)
