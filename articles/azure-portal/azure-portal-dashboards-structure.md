---
title: The structure of Azure dashboards
description: Walk through the JSON structure of an Azure dashboard using an example dashboard. Includes reference to resource properties.
ms.topic: conceptual
ms.date: 09/05/2023
---

# The structure of Azure dashboards

This document walks through the structure of an Azure dashboard, using the following dashboard as an example:

:::image type="content" source="media/azure-portal-dashboards-structure/sample-dashboard.png" alt-text="Screenshot of a sample dashboard in the Azure portal.":::

Since shared [Azure dashboards are resources](../azure-resource-manager/management/overview.md), this dashboard can be represented as JSON. You can download the JSON representation of a dashboard by selecting **Export** and then **Download** in the Azure portal.

The following JSON represents the dashboard shown above.

```json
{
{
  "properties": {
    "lenses": {
      "0": {
        "order": 0,
        "parts": {
          "0": {
            "position": {
              "x": 0,
              "y": 0,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [],
              "type": "Extension/HubsExtension/PartType/MarkdownPart",
              "settings": {
                "content": {
                  "settings": {
                    "content": "## Azure Virtual Machines Overview\r\nNew team members should watch this video to get familiar with Azure Virtual Machines.",
                    "markdownUri": null
                  }
                }
              }
            }
          },
          "1": {
            "position": {
              "x": 3,
              "y": 0,
              "colSpan": 8,
              "rowSpan": 4
            },
            "metadata": {
              "inputs": [],
              "type": "Extension/HubsExtension/PartType/MarkdownPart",
              "settings": {
                "content": {
                  "settings": {
                    "content": "This is the team dashboard for the test VM we use on our team. Here are some useful links:\r\n\r\n1. [Create a Linux virtual machine](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal)\r\n1. [Create a Windows virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal)\r\n1. [Create a virtual machine scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/quick-create-portal)",
                    "title": "Test VM Dashboard",
                    "subtitle": "Contoso",
                    "markdownUri": null
                  }
                }
              }
            }
          },
          "2": {
            "position": {
              "x": 0,
              "y": 2,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [],
              "type": "Extension/HubsExtension/PartType/VideoPart",
              "settings": {
                "content": {
                  "settings": {
                    "src": "https://www.youtube.com/watch?v=rOiSRkxtTeU",
                    "autoplay": false
                  }
                }
              }
            }
          },
          "3": {
            "position": {
              "x": 0,
              "y": 4,
              "colSpan": 11,
              "rowSpan": 3
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Percentage CPU",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "4": {
            "position": {
              "x": 0,
              "y": 7,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Disk Read Operations/Sec",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      },
                      {
                        "name": "Disk Write Operations/Sec",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "5": {
            "position": {
              "x": 3,
              "y": 7,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Disk Read Bytes",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      },
                      {
                        "name": "Disk Write Bytes",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "6": {
            "position": {
              "x": 6,
              "y": 7,
              "colSpan": 3,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "queryInputs",
                  "value": {
                    "timespan": {
                      "duration": "PT1H"
                    },
                    "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
                    "chartType": 0,
                    "metrics": [
                      {
                        "name": "Network In Total",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      },
                      {
                        "name": "Network Out Total",
                        "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                      }
                    ]
                  }
                }
              ],
              "type": "Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart",
              "settings": {}
            }
          },
          "7": {
            "position": {
              "x": 9,
              "y": 7,
              "colSpan": 2,
              "rowSpan": 2
            },
            "metadata": {
              "inputs": [
                {
                  "name": "id",
                  "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
                }
              ],
              "type": "Extension/HubsExtension/PartType/ResourcePart",
              "asset": {
                "idInputName": "id",
                "type": "VirtualMachine"
              }
            }
          }
        }
      }
    },
    "metadata": {
      "model": {
        "timeRange": {
          "value": {
            "relative": {
              "duration": 24,
              "timeUnit": 1
            }
          },
          "type": "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange"
        }
      }
    }
  },
  "name": "Simple VM Dashboard",
  "type": "Microsoft.Portal/dashboards",
  "location": "INSERT LOCATION",
  "tags": {
    "hidden-title": "Simple VM Dashboard"
  },
  "apiVersion": "2015-08-01-preview"
}
```

## Common resource properties

Let’s break down the relevant sections of the JSON. The common resource properties appear near the end of the example above. These properties are shared across all Azure resource types. They don't relate specifically to the dashboard's content.

### ID

The `ID` represents the dashboard's Azure resource ID, subject to the [naming conventions of Azure resources](/azure/azure-resource-manager/management/resource-name-rules). When the portal creates a dashboard, it generally chooses an ID in the form of a guid, but you can use any valid name when you create a dashboard programmatically.

When you export a dashboard from the Azure portal, the `id` field isn't included. If you create a new dashboard by importing a JSON file that includes the `id` field, the value will be ignored and a new ID value will be assigned to each new dashboard.

### Name

The resource name that Azure portal uses for the dashboard.

### Type

All dashboards are of type `Microsoft.Portal/dashboards`.

### Location

Unlike other resources, dashboards don’t have a runtime component. For dashboards, `location`` indicates the primary geographic location that stores the dashboard’s JSON representation. The value should be one of the location codes that can be fetched using the [locations API on the subscriptions resource](/rest/api/resources/subscriptions).

### Tags

Tags are a common feature of Azure resources that let you organize your resource by arbitrary name value pairs. Dashboards include one special tag called `hidden-title`. If your dashboard has this property populated, then that value is used as the display name for your dashboard in the portal. This tag gives you a way to have a renamable display name for your dashboard

## Properties

The properties object contains two properties, `lenses` and `metadata`. The `lenses` property contains information about the tiles on the dashboard.  The `metadata` property is reserved for potential future features.

### Lenses

The `lenses` property contains the dashboard. The lens object in this example contains a single property called "0". Lenses are a grouping concept that isn't currently implemented. For now, all of your dashboards have this single "0" property on the lens object.

### Parts

The object underneath the "0" contains two properties, `order` and `parts`. Currently, `order` is always set to 0. The `parts` property contains an object that defines the individual parts (also referred to as tiles) on the dashboard.

The `parts` object contains a property for each part, where the name of the property is a number. The number isn't significant.

Each individual part object contains `position` and `metadata`.

### Position

The `position` property contains the size and location information for the part expressed as `x`, `y`, `rowSpan`, and `colSpan`. The values are in terms of grid units. These grid units are visible when the dashboard is in the customize mode as shown here.

:::image type="content" source="media/azure-portal-dashboards-structure/grid-units.png" alt-text="Screenshot showing the grid units for a dashboard in the Azure portal.":::

For example, if you want a tile to have a width of two grid units, a height of one grid unit, and a location in the top left corner of the dashboard, then the position object looks like this:

`position: { x: 0, y: 0, rowSpan: 2, colSpan: 1 }`

### Metadata

Each part has a metadata property. An object has only one required property: `type`. This string tells the portal which [tile type](azure-portal-dashboards.md#add-tiles-from-the-tile-gallery) to show. Our example dashboard uses these types of tiles:

1. `Extension/Microsoft_Azure_Monitoring/PartType/MetricsChartPart` – Used to show monitoring metrics
1. `Extension[azure]/HubsExtension/PartType/MarkdownPart` – Used to show customized markdown content, such as text or images, with basic formatting for lists, links, etc.
1. `Extension[azure]/HubsExtension/PartType/VideoPart` – Used to show videos from YouTube, Channel 9, and any other type of video that works in an HTML video tag.

Each type of part has its own options for configuration. The possible configuration properties are called `inputs`, `settings`, and `asset`.

### Inputs

The inputs object generally contains information that binds a tile to a resource instance.

Each `MetricsChartPart` in our example has a single input that expresses the resource to bind to, representing the Azure resource ID of the VM, along with information about the data being displayed. For example, here's the `inputs` object for the tile that shows the **Network In Total** and **Network Out Total** metrics.

```json
"inputs":
[
  {
    "name": "queryInputs",
    "value": {
      "timespan": {
        "duration": "PT1H"
      },
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
      "chartType": 0,
      "metrics": [
        {
          "name": "Network In Total",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
        },
        {
          "name": "Network Out Total",
          "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SimpleWinVMResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1"
        }
      ]
    }
  }
]

```

### Settings

The settings object contains the configurable elements of a part.  In our sample dashboard, the Markdown part uses settings to store the custom markdown content, along with a configurable title and subtitle.

```json
"settings": {
  "content": {
    "settings": {
      "content": "This is the team dashboard for the test VM we use on our team. Here are some useful links:\r\n\r\n1. [Create a Linux virtual machine](https://docs.microsoft.com/azure/virtual-machines/linux/quick-create-portal)\r\n1. [Create a Windows virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal)\r\n1. [Create a virtual machine scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/quick-create-portal)",
      "title": "Test VM Dashboard",
      "subtitle": "Contoso"
    }
  }
}
```

Similarly, the video tile has its own settings that contain a pointer to the video to play, an autoplay setting, and optional title information.

```json

"settings": {
  "content": {
    "settings": {
      "src": "https://www.youtube.com/watch?v=rOiSRkxtTeU",
      "autoplay": false
    }
  }
}
```

### Asset

Tiles that are bound to first class manageable portal objects (called assets) have this relationship expressed via the `asset` object. In our example dashboard, the virtual machine tile contains this asset description. The `idInputName` property tells the portal that the ID input contains the unique identifier for the asset, in this case the resource ID. Most Azure resource types have assets defined in the portal.

`"asset": {    "idInputName": "id",    "type": "VirtualMachine"    }`

## Next steps

- Learn how to create a dashboard [in the Azure portal](azure-portal-dashboards.md) or [programmatically](azure-portal-dashboards-create-programmatically.md).
- Learn how to [use markdown tiles on Azure dashboards to show custom content](azure-portal-markdown-tile.md).
