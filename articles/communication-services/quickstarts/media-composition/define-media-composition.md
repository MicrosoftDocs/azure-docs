---
title: Quickstart - Introducing the Media Composition inputs, layouts, and outputs
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn about the different Media Composition inputs, layouts, and outputs.
author: peiliu
manager: alexokun
services: azure-communication-services

ms.author: peiliu
ms.date: 12/06/2022
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: Introducing the Media Composition inputs, layouts, and outputs
[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication Services Media Composition is made up of three parts: inputs, layouts, and outputs. Follow this document to learn more about the options available and how to define each of the parts.

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Inputs
To retrieve the media sources that will be used in the layout composition, you'll need to define inputs. Inputs can be either multi-source or single source.

### Multi-source inputs
ACS Group Calls and ACS Rooms are typically made up of multiple participants. We define these as multi-source inputs. They can be used in layouts as a single input or destructured to reference a single participant.

ACS Group Call json:
```json
{
  "inputs": {
    "groupCallInput": {
      "kind": "groupCall",
      "id": "5a22165a-f952-4a56-8009-6d39b8868971"
    }
  }
}
```

ACS Rooms Input json:
```json
{
  "inputs": {
    "roomCallInput": {
      "kind": "room",
      "id": "0294781882919201"
    }
  }
}
```

### Single source inputs
Unlike multi-source inputs, single source inputs reference a single media source. If the single source input is from a multi-source input such as an ACS group call or rooms, it will reference the multi-source input's ID in the `call` property. The following are examples of single source inputs:

Participant json:
```json
{
  "inputs": {
    "groupCallInput": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
    "participantInput": {
      "kind": "participant",
      "call": "groupCallInput",
      "id": {
        "communicationUser": {
          "userId": "8:acs:c3015709-b45a-4c9d-be36-26a9a108cd88_00000030-45lk-9dp0-04c8-3ed0023d0ds"
        }
      }
    }
  }
}
```

Active Presenter json:
```json
{
  "inputs": {
    "groupCallInput": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
    "activePresenterInput": {
      "kind": "activePresenter",
      "call": "groupCallInput"
    }
  }
}
```

Dominant Speaker json:
```json
{
  "inputs": {
    "groupCallInput": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
    "dominantSpeakerInput": {
      "kind": "dominantSpeaker",
      "call": "groupCallInput"
    }
  }
}
```

## Layouts
Media Composition supports several layouts. These include grid, auto grid, presentation, presenter, and custom.

### Grid
The grid layout will compose the specified media sources into a grid with a constant number of cells. You can customize the number of rows and columns in the grid as well as specify the media source that should be place in each cell of the grid.

Sample grid layout json:
```json
{
  "layout": {
    "kind": "grid",
    "rows": 2,
    "columns": 2,
    "inputIds": [
      ["active", "jill"],
      ["jon", "janet"]
    ]
  },
  "inputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
    "active": {
      "kind": "dominantSpeaker",
      "call": "meeting"
    },
    "jill": {
      "kind": "participant",
      "call": "meeting",
      "id": {
        "communicationUser": {
          "userId": "8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000030-45lk-9dp0-04c8-3ed0023d0ds"
        }
      }
    },
    "jon": {
      "kind": "participant",
      "call": "meeting",
      "id": {
        "communicationUser": {
          "userId": "8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000090-20e2-430d-9c34-0e4b72c98636"
        }
      }
    },
    "janet": {
      "kind": "participant",
      "call": "meeting",
       "id": {
        "communicationUser": {
          "userId": "8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000030-b1a5-4047-b238-e515602e9b94"
        }
      }
    }
  },
  "outputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    }
  }
}
```
The sample grid layout json will take the dominant speaker and put it in the first cell. Then, `jill`, `jon`, `janet` will fill the next three cells:
:::image type="content" source="../media/two-by-two-grid-layout.png" alt-text="A diagram showing an example of the grid layout.":::

If only three participants are defined in the inputs, then the fourth cell will be left blank.

### Auto grid
The auto grid layout is ideal for a multi-source scenario where you want to display all sources in the scene. This layout should be the default multi-source scene and would adjust based on the number of sources.

Sample auto grid layout json:
```json
{
  "layout": {
    "kind": "autoGrid",
    "inputIds": ["meeting"],
  },
  "inputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    }
  },
  "outputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    }
  }
}
```
The sample auto grid layout will take all the media sources in the `meeting` input and compose them into an optimized grid:
:::image type="content" source="../media/five-cell-auto-grid.png" alt-text="A diagram showing an example of the auto grid layout.":::

### Presentation
The presentation layout features the presenter that covers the majority of the scene. The other sources are the audience members and are arranged in either a row or column in the remaining space. The position of the audience can be one of: `top`, `bottom`, `left`, or `right`.

Sample presentation layout json:
```json
{
  "layout": {
    "kind": "presentation",
    "presenterId": "presenter",
    "audienceIds": ["meeting:not('presenter')"],
    "audiencePosition": "top"
  },
  "inputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
    "presenter": {
      "kind": "participant",
      "call": "meeting",
      "id": {
        "communicationUser": {
          "userId": "8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000090-20e2-430d-9c34-0e4b72c98636"
        }
      }
    }
  },
  "outputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
  }
}
```

The sample presentation layout will feature the `presenter` and place the rest of the audience members at the top of the scene:
:::image type="content" source="../media/top-presentation.png" alt-text="A diagram showing an example of the presentation layout.":::

### Presenter
The presenter layout is a picture-in-picture layout composed of two inputs. One source is the background of the scene. This represents the content being presented or the main presenter. The secondary source is the support and is cropped and positioned at a corner of the scene. The support position can be one of: `bottomLeft`, `bottomRight`, `topLeft`, or `topRight`.

Sample presenter layout json:
```json
{
  "layout": {
    "kind": "presenter",
    "presenterId": "presenter",
    "supportId": "support",
    "supportPosition": "topLeft",
    "supportAspectRatio": 3/2
  },
  "inputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
    "presenter": {
      "kind": "participant",
      "call": "meeting",
      "id": {
        "communicationUser": {
          "userId": "8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000090-20e2-430d-9c34-0e4b72c98636"
        }
      }
    },
    "support": {
      "kind": "participant",
      "call": "meeting",
       "id": {
        "communicationUser": {
          "userId": "8:acs:5110fbea-014a-45aa-a839-d6dc967b4175_00000030-b1a5-4047-b238-e515602e9b94"
        }
      }
    }
  },
  "outputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    }
  }
}
```

The sample presenter layout will feature the `presenter` media source, which takes most of the scene. The support media source will be cropped according to the `supportAspectRatio` and placed at the position specified, which is `topLeft`.
:::image type="content" source="../media/top-left-presenter.png" alt-text="A diagram showing an example of the presenter layout.":::

### Custom
If none of the pre-defined layouts fit your needs, then you can use custom layouts to fit your exact scenario. With custom layouts, you can define sources with different sizes and place them at any position on the scene.

```json
{
  "layout": {
    "kind": "custom",
    "inputGroups": {
      "main": {
        "position": {
          "x": 0,
          "y": 0
        },
        "width": "100%",
        "height": "100%",
        "rows": 2,
        "columns": 2,
        "inputIds": [ [ "meeting:not('active')" ] ]
        },
      "overlay": {
        "position": {
            "x": 480,
            "y": 270
          },
          "width": "50%",
          "height": "50%",
          "layer": "overlay",
          "inputIds": [[ "active" ]]
          }
    },
    "layers": {
      "overlay": {
        "zIndex": 2,
        "visibility": "visible"
      }
    }
  },
  "inputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    },
    "active": {
      "kind": "dominantSpeaker",
      "call": "meeting"
    }
  },
  "outputs": {
    "meeting": {
      "kind": "groupCall",
      "id": "d9e13117-4679-47a5-8cd5-1c3fdbbe6a6e"
    }
  }
}
```

The custom layout example above will result in the following composition:
:::image type="content" source="../media/custom-grid-with-single-cell-overlayed.png" alt-text="A diagram showing an example of the custom layout.":::

## Outputs
After media has been composed according to a layout, they can be outputted to your audience in various ways. Currently, you can either send the composed stream to a call or to an RTMP server.

ACS Group Call json:
```json
{
  "outputs": {
    "groupCallOutput": {
      "kind": "groupCall",
      "id": "CALL_ID"
    }
  }
}
```

ACS Rooms Output json:
```json
{
  "outputs": {
    "roomOutput": {
      "kind": "room",
      "id": "ROOM_ID"
    }
  }
}
```

RTMP Output json
```json
{
  "outputs": {
    "rtmpOutput": {
      "kind": "rtmp",
      "streamUrl": "rtmp://rtmpendpoint",
      "streamKey": "STREAM_KEY",
      "resolution": {
        "width": 1920,
        "height": 1080
      },
      "mode": "push"
    }
  }
}
```

## Next steps

In this section you learned how to:
> [!div class="checklist"]
> - Create a multi-source or single source input
> - Create various predefined and custom layouts
> - Create an output

You may also want to:
 - Learn about [media composition concept](../../concepts/voice-video-calling/media-comp.md)
 - Get started on [media composition](./get-started-media-composition.md)

<!--  -->
