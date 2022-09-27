---
title: Use the REST API to manage dashboards in Azure IoT Central
description: How to use the IoT Central REST API to manage dashboards in an application
author: v-krishnag
ms.author: v-krishnag
ms.date: 09/23/2022
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

You can create dashboards that are associated with a specific organization. An organization dashboard is only visible to users who have access to the organization the dashboard is associated with. Only users in a role that has [organization dashboard permissions](howto-manage-users-roles.md#customizing-the-app) can create, edit, and delete organization dashboards..

All users can create *personal dashboards*, visible only to themselves. Users can switch between organization and personal dashboards.

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
PUT https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-06-30-preview
```

The following example shows a request body that adds a new dashboard with bar chart tile

```json
{
    "displayName": "My Dashboard",
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

The request body has some required fields:

* `@displayName`: Display name of the dashboard.
* `@favorite`: Whether the dashboard is favorited or not.
* `group`: Device group ID.
* `tiles` : The tiles displayed by the dashboard.

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

## Get a dashboard

Use the following request to retreive the details of a dashboard.

```http
GET https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-06-30-preview
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

## Update a dashbboard

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-06-30-preview
```

The following example shows a request body that updates the display name of a dashboard:

```json

{
  "displayName": "New Dashboard Name"
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
            "width": 2,
            "height": 2
        }
    ],
    "favorite": false
}
```

## Delete a dashboard

Use the following request to delete a dashboard:

```http
DELETE https://{your app subdomain}.azureiotcentral.com/api/dashboards/{dashboardId}?api-version=2022-06-30-preview
```

## List dashboards

Use the following request to retrieve a list of dashboards from your application:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/dashboards?api-version=2022-06-30-preview
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

Now that you've learned how to manage device templates with the REST API, a suggested next step is to [How to create device templates from IoT Central GUI.](howto-set-up-template.md#create-a-device-template)
