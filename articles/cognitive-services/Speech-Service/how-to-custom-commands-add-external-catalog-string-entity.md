---
title: 'How To: Configure parameter as external entities entity'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to configure a string parameter to refer to catalog exposed over a web endpoint.
services: cognitive-services
author: singhsaumya
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: sausin
---

# Configure parameter as external catalog entity

In this article, you will learn how to configure string type parameters to refer to external catalogs hosted over a web endpoint. This way, you can update the external catalog independently without making edits to the Custom Commands application.

## Prerequisites
> [!div class="checklist"]
> * [How To: Create an empty application](./how-to-custom-commands-create-empty-project.md)
> * [How To: Add simple commands](./how-to-custom-commands-add-simple-commands.md)
> * [How To: Add parameters to commands](./how-to-custom-commands-add-simple-commands.md)

## Use external string catalog entity configuration

1. For this, let's reuse **SubjectDevice** parameter from the **TurnOnOff** command.
1. The current configuration for this parameter is **Accept predefined inputs from internal catalog**. This refers to static list of devices as defined in the parameter configuration. We want to move out this content to an external data source which can be updated independently.

### Add an external catalog endpoint

1. For this, start by adding a new web endpoint as defined in section [ReferJun1].......,

1. Go to **Web endpoints** section in the left pane and add a new web endpoint with configuration as:

     | Setting                           | Suggested value                     |
   | --------------------------------- | -----------------------------------------------------|
   | Name                              | `getDevices`                                |
   | URL                          |`https://dscprodsu01sa01.blob.core.windows.net/samples/getDevices.json`                                |
   | Method                              | GET                                |


    In case, the suggest value for URL doesn't work for you - you need to configure and host a simple web endpoint which returns json consisting of list of the devices which can be controlled. The web endpoint should return a json of below format:
        
    ```json
    {
        "fan" : [],
        "refrigerator" : [
            "fridge"
        ],
        "lights" : [
            "bulb",
            "bulbs",
            "light"
            "light bulb"
        ],
        "tv" : [
            "telly",
            "television"
            ]
    }
    
    ```


1. Next go the **SubjectDevice** parameter settings page and change the properties as follows-

   | Setting                           | Suggested value                     |
   | --------------------------------- | -----------------------------------------------------|
   | Configuration                     | Accept predefined inputs from external catalog |                                |
   | Catalog endpoint                  | getDevices                                 |
   | Method                            | GET                             |
1. Select **Save**.
> [!IMPORTANT]
> You wouldn't see an option to configure a parameter to accept inputs from an external catalog unless you have the web endpoint set in the **Web endpoint** section in the left pane.

## Try it out

1. Select **Train** and wait for training completion.

1. Once, training completes, select **Test** and try a few interactions.

    * Input: turn on
    * Output: Which device do you want to control?
    * Input: lights
    * Output: Ok, turning the lights on



> [!NOTE]
>Notice how you can control all the devices hosted on the web endpoint now. You still need to train the application for testing out the new changes and re-publish the application.



## Next steps

> [!div class="nextstepaction"]
> [How To: Add validations to custom command parameters](./how-to-custom-commands-add-validations.md)
