---
title: Use the REST API to manage dashboards in Azure IoT Central
description: How to use the IoT Central REST API to create, update, delete, and manage dashboards in an application
author: dominicbetts
ms.author: dobett
ms.date: 10/06/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage dashboards

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to manage dashboards in your IoT Central application.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

To learn how to manage dashboards by using the IoT Central UI, see [How to manage dashboards.](../core/howto-manage-dashboards.md)

## Dashboards

You can create dashboards that are associated with a specific organization. An organization dashboard is only visible to users who have access to the organization the dashboard is associated with. Only users in a role that has [organization dashboard permissions](howto-manage-users-roles.md#customizing-the-app) can create, edit, and delete organization dashboards.

All users can create *personal dashboards*, visible only to themselves. Users can switch between organization and personal dashboards.

> [!NOTE]
> Creating personal dashboards using API is currently not supported.

## Dashboards REST API

The IoT Central REST API lets you:

* Add a dashboard to your application
* Update a dashboard in your application
* Get a list of the dashboard in the application
* Get a dashboard by ID
* Delete a dashboard in your application

## Add a dashboard

Use the following request to create a dashboard.

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-10-31-preview
```

`dashboardId` - A unique [DTMI](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/DTDL.v2.md#digital-twin-model-identifier) identifier for the dashboard.

The request body has some required fields:

* `@displayName`: Display name of the dashboard.
* `@favorite`: Is the dashboard in the favorites list?
* `group`: Device group ID.
* `Tile` : Configuration specifying tile object, including the layout, display name, and configuration.

Tile has some required fields:

| Name | Description |
| ---- | ----------- |
| `displayName` | Display name of the tile |
| `height` | Height of the tile |
| `width` | Width of the tile |
| `x` | Horizontal position of the tile |
| `y` | Vertical position of the tile |

The dimensions and location of a tile both use integer units. The smallest possible tile has a height and width of one.

You can configure a tile object to display multiple types of data. This article includes examples of tiles that show line charts, markdown, and last known value. To learn more about the different tile types you can add to a dashboard, see [Tile types](howto-manage-dashboards.md#tile-types).

### Line chart tile

Plot one or more aggregate telemetry values for one or more devices over a time period. For example, you can display a line chart to plot the average temperature and pressure of one or more devices during the past hour.

The line chart tile has the following configuration:

| Name | Description |
|--|--|
| `capabilities` | Specifies the aggregate value of the telemetry to display. |
| `devices` | The list of devices to display. |
| `format` | The format configuration of the chart such as the axes to use. |
| `group` | The ID of the device group to display. |
| `queryRange` | The time range and resolution to display.|
| `type` | `lineChart` |

### Markdown tile

Clickable tiles that display a heading and description text formatted in Markdown. The URL can be a relative link to another page in the application or an absolute link to an external site.
The markdown tile has the following configuration:

| Name | Description |
|--|--|
| `description` | The markdown string to render inside the tile. |
| `href` | The link to visit when the tile is selected. |
| `image` | A base64 encoded image to display. |
| `type` | `markdown` |

### Last known value tile

Display the latest telemetry values for one or more devices. For example, you can use this tile to display the most recent temperature, pressure, and humidity values for one or more devices.

The last known value (LKV) tile has the following configuration:

| Name | Description |
|--|--|
| `capabilities` | Specifies the telemetry to display. |
| `devices` | The list of devices to display. |
| `format` | The format configuration of the LKV tile such as text size of word wrapping. |
| `group` | The ID of the device group to display. |
| `showTrend` | Show the difference between the last known value and the previous value. |
| `type` | `lkv` |

The following example shows a request body that adds a new dashboard with line chart, markdown, and last known value tiles. The LKV and line chart tiles are `2x2` tiles. The markdown tile is a `1x1` tile. The tiles are arranged on the top row of the dashboard:

```json
{
    "displayName": "My Dashboard ",
    "tiles": [
        {
            "displayName": "LKV Temperature",
            "configuration": {
                "type": "lkv",
                "capabilities": [
                    {
                        "capability": "temperature",
                        "aggregateFunction": "avg"
                    }
                ],
                "group": "0fb6cf08-f03c-4987-93f6-72103e9f6100",
                "devices": [
                    "3xksbkqm8r",
                    "1ak6jtz2m5q",
                    "h4ow04mv3d"
                ],
                "format": {
                    "abbreviateValue": false,
                    "wordWrap": false,
                    "textSize": 14
                }
            },
            "x": 0,
            "y": 0,
            "width": 2,
            "height": 2
        },
        {
            "displayName": "Documentation",
            "configuration": {
                "type": "markdown",
                "description": "Comprehensive help articles and links to more support.",
                "href": "https://aka.ms/iotcentral-pnp-docs",
                "image": "4d6c6373-0220-4191-be2e-d58ca2a289e1"
            },
            "x": 2,
            "y": 0,
            "width": 1,
            "height": 1
        },
        {
            "displayName": "Average temperature",
            "configuration": {
                "type": "lineChart",
                "capabilities": [
                    {
                        "capability": "temperature",
                        "aggregateFunction": "avg"
                    }
                ],
                "devices": [
                    "3xksbkqm8r",
                    "1ak6jtz2m5q",
                    "h4ow04mv3d"
                ],
                "group": "0fb6cf08-f03c-4987-93f6-72103e9f6100",
                "format": {
                    "xAxisEnabled": true,
                    "yAxisEnabled": true,
                    "legendEnabled": true
                },
                "queryRange": {
                    "type": "time",
                    "duration": "PT30M",
                    "resolution": "PT1M"
                }
            },
            "x": 3,
            "y": 0,
            "width": 2,
            "height": 2
        }
    ],
    "favorite": false
}
```
<!-- TODO: Fix this - also check the image example above... -->
The response to this request looks like the following example:

```json
{
    "id": "dtmi:kkfvwa2xi:p7pyt5x38",
    "displayName": "My Dashboard",
    "personal": false,
    "tiles": [
        {
            "displayName": "lineChart",
            "configuration": {
                "type": "lineChart",
                "capabilities": [
                    {
                        "capability": "temperature",
                        "aggregateFunction": "avg"
                    }
                ],
                "devices": [
                    "1cfqhp3tue3",
                    "mcoi4i2qh3"
                ],
                "group": "da48c8fe-bac7-42bc-81c0-d8158551f066",
                "format": {
                    "xAxisEnabled": true,
                    "yAxisEnabled": true,
                    "legendEnabled": true
                },
                "queryRange": {
                    "type": "time",
                    "duration": "PT30M",
                    "resolution": "PT1M"
                }
            },
            "x": 5,
            "y": 0,
            "width": 2,
            "height": 2
        }
    ],
    "favorite": false
}
```

## Get a dashboard

Use the following request to retrieve the details of a dashboard by using a dashboard ID.

```http
GET https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-10-31-preview
```

The response to this request looks like the following example:

```json
{
    "id": "dtmi:kkfvwa2xi:p7pyt5x38",
    "displayName": "My Dashboard",
    "personal": false,
    "tiles": [
        {
            "displayName": "lineChart",
            "configuration": {
                "type": "lineChart",
                "capabilities": [
                    {
                        "capability": "AvailableMemory",
                        "aggregateFunction": "avg"
                    }
                ],
                "devices": [
                    "1cfqhp3tue3",
                    "mcoi4i2qh3"
                ],
                "group": "da48c8fe-bac7-42bc-81c0-d8158551f066",
                "format": {
                    "xAxisEnabled": true,
                    "yAxisEnabled": true,
                    "legendEnabled": true
                },
                "queryRange": {
                    "type": "time",
                    "duration": "PT30M",
                    "resolution": "PT1M"
                }
            },
            "x": 5,
            "y": 0,
            "width": 2,
            "height": 2
        }
    ],
    "favorite": false
}
```

## Update a dashboard

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-10-31-preview
```

The following example shows a request body that updates the display name of a dashboard and adds the dashboard to the list of favorites:

```json

{
    "displayName": "New Dashboard Name",
    "favorite": true
}

```

The response to this request looks like the following example:

```json
{
    "id": "dtmi:kkfvwa2xi:p7pyt5x38",
    "displayName": "New Dashboard Name",
    "personal": false,
    "tiles": [
        {
            "displayName": "lineChart",
            "configuration": {
                "type": "lineChart",
                "capabilities": [
                    {
                        "capability": "AvailableMemory",
                        "aggregateFunction": "avg"
                    }
                ],
                "devices": [
                    "1cfqhp3tue3",
                    "mcoi4i2qh3"
                ],
                "group": "da48c8fe-bac7-42bc-81c0-d8158551f066",
                "format": {
                    "xAxisEnabled": true,
                    "yAxisEnabled": true,
                    "legendEnabled": true
                },
                "queryRange": {
                    "type": "time",
                    "duration": "PT30M",
                    "resolution": "PT1M"
                }
            },
            "x": 5,
            "y": 0,
            "width": 5,
            "height": 5
        }
    ],
    "favorite": true
}
```

## Delete a dashboard

Use the following request to delete a dashboard by using the dashboard ID:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-10-31-preview
```

## List dashboards

Use the following request to retrieve a list of dashboards from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/dashboards?api-version=2022-10-31-preview
```

The response to this request looks like the following example:

```json
{
    "value": [
        {
            "id": "dtmi:kkfvwa2xi:p7pyt5x3o",
            "displayName": "Dashboard",
            "personal": false,
            "tiles": [
                {
                    "displayName": "Device templates",
                    "configuration": {
                        "type": "markdown",
                        "description": "Get started by adding your first device.",
                        "href": "/device-templates/new/devicetemplates",
                        "image": "f5ba1b00-1d24-4781-869b-6f954df48736"
                    },
                    "x": 1,
                    "y": 0,
                    "width": 1,
                    "height": 1
                },
                {
                    "displayName": "Quick start demo",
                    "configuration": {
                        "type": "markdown",
                        "description": "Learn how to use Azure IoT Central in minutes.",
                        "href": "https://aka.ms/iotcentral-pnp-video",
                        "image": "9eb01d71-491a-44e5-8fac-7af3bc9f9acd"
                    },
                    "x": 2,
                    "y": 0,
                    "width": 1,
                    "height": 1
                },
                {
                    "displayName": "Tutorials",
                    "configuration": {
                        "type": "markdown",
                        "description": "Step-by-step articles teach you how to create apps and devices.",
                        "href": "https://aka.ms/iotcentral-pnp-tutorials",
                        "image": "7d9fc12c-d46e-41c6-885f-0a67c619366e"
                    },
                    "x": 3,
                    "y": 0,
                    "width": 1,
                    "height": 1
                },
                {
                    "displayName": "Documentation",
                    "configuration": {
                        "type": "markdown",
                        "description": "Comprehensive help articles and links to more support.",
                        "href": "https://aka.ms/iotcentral-pnp-docs",
                        "image": "4d6c6373-0220-4191-be2e-d58ca2a289e1"
                    },
                    "x": 4,
                    "y": 0,
                    "width": 1,
                    "height": 1
                },
                {
                    "displayName": "IoT Central Image",
                    "configuration": {
                        "type": "image",
                        "format": {
                            "backgroundColor": "#FFFFFF",
                            "fitImage": true,
                            "showTitle": false,
                            "textColor": "#FFFFFF",
                            "textSize": 0,
                            "textSizeUnit": "px"
                        },
                        "image": ""
                    },
                    "x": 0,
                    "y": 0,
                    "width": 1,
                    "height": 1
                },
                {
                    "displayName": "Contoso Image",
                    "configuration": {
                        "type": "image",
                        "format": {
                            "backgroundColor": "#FFFFFF",
                            "fitImage": true,
                            "showTitle": false,
                            "textColor": "#FFFFFF",
                            "textSize": 0,
                            "textSizeUnit": "px"
                        },
                        "image": "c9ac5af4-f38e-4cd3-886a-e0cb107f391c"
                    },
                    "x": 0,
                    "y": 1,
                    "width": 5,
                    "height": 3
                },
                {
                    "displayName": "Available Memory",
                    "configuration": {
                        "type": "lineChart",
                        "capabilities": [
                            {
                                "capability": "AvailableMemory",
                                "aggregateFunction": "avg"
                            }
                        ],
                        "devices": [
                            "1cfqhp3tue3",
                            "mcoi4i2qh3"
                        ],
                        "group": "da48c8fe-bac7-42bc-81c0-d8158551f066",
                        "format": {
                            "xAxisEnabled": true,
                            "yAxisEnabled": true,
                            "legendEnabled": true
                        },
                        "queryRange": {
                            "type": "time",
                            "duration": "PT30M",
                            "resolution": "PT1M"
                        }
                    },
                    "x": 5,
                    "y": 0,
                    "width": 2,
                    "height": 2
                }
            ],
            "favorite": false
        }
    ]
}
```

## Next steps

Now that you've learned how to manage dashboards with the REST API, a suggested next step is to [How to manage file upload with rest api.](howto-upload-file-rest-api.md)
