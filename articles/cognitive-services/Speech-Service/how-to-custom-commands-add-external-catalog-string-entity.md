---
title: 'How To: Configure parameter as external catalog entries'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to configure a string parameter to refer to catalog exposed over a web endpoint.
services: cognitive-services
author: sausin
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: singhsaumya
---

# Configure parameter as external catalog entries

In this article, you will learn how to configure string type parameters to refer to external catalogs hosted over a web endpoint.

## Prerequisites
> [!div class="checklist"]
> * 
> * 

## Use external string catalog entity configuration

1. For this, let's reuse **SubjectDevice** parameter from the **TurnOnOff** command.
1. The current configuration for this parameter is `Accept predefined inputs from internal catalog`. This refers to static list of devices as defined in the parameter configuration. We want to move out this content to an external data source which can be updated independently.

### Add an external catalog endpoint

1. For this, start by adding a new web endpoint as defined in section [ReferJun1].......,

1. You will need a simple web endpoint which returns json consisting of list of the devices which can be controlled. For sake of simplicity, we will be using azure blob storage for this.
1. Create a blob storage and a container. Host a file in with content as

    ```json
    {
        "fan" : [],
        "tubelight" : [],
        "tv" : [
            "telly",
            "television"
        ]
    }
    ```

1. Go to **Web endpoints** section in the left pane and add a new web endpoint with configuration as-

 | Setting                           | Suggested value                     |
   | --------------------------------- | -----------------------------------------------------|
   | Name                              | getDevices                                |
   | URL                          | URL for the web endpoint                                 |
   | Method                              | GET                                |

1. Next go the **SubjectDevice** parameter settings page and change the Configuration as follows-

   | Setting                           | Suggested value                     |
   | --------------------------------- | -----------------------------------------------------|
   | Configuration                     | Accept predefined inputs from external catalog |                                |
   | Catalog endpoint                          | getDevices                                 |
   | Method                              | GET                             |

## Try it out

1. Select **Train** and wait for training completion.

1. Once, training completes, select **Test** and try a few interactions.

    * Input: turn on
    * Output: which device?
    * Input: tubelight
    * Output: Ok, turning on the tubelight



> [!NOTE]
>Now, you can update the external catalog file independently without making edits to the Custom Commands application.
You still need to train the application for testing out the new changes and re-publish the application.


## Next steps

> [!div class="nextstepaction"]
> [How To: Add validations to Custom Command parameters](./how-to-custom-commands-add-validations.md)
