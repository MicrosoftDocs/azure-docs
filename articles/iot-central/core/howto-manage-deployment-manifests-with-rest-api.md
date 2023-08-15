---
title: Azure IoT Central deployment manifests and the REST API
description: How to use the IoT Central REST API to manage IoT Edge deployment manifests in an IoT Central application.
author: dominicbetts
ms.author: dobett
ms.date: 11/22/2022
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to manage deployment manifests

A deployment manifest lets you specify the modules the IoT Edge runtime should download and configure. An IoT Edge device can download a deployment manifest when it first connects to your IoT Central application. This article describes how to manage deployment manifests stored in your IoT Central application by using the REST API.

To learn more about IoT Edge and IoT Central, see [Connect Azure IoT Edge devices to an Azure IoT Central application](concepts-iot-edge.md).

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

To learn how to manage deployment manifests by using the IoT Central UI, see [Manage IoT Edge deployment manifests in your IoT Central application](howto-manage-deployment-manifests.md).

## Deployment manifests REST API

The IoT Central REST API lets you:

* Add a deployment manifest to your application
* Update a deployment manifest in your application
* Get a list of the deployment manifests in the application
* Get a deployment manifest by ID
* Delete a deployment manifest in your application

> [!NOTE]
> The deployment manifests REST API is currently in preview.

## Add a deployment manifest

Use the following request to create a new deployment manifest.

```http
PUT https://{your app subdomain}/api/deploymentManifests/{deploymentManifestId}?api-version=2022-10-31-preview
```

The following example shows a request body that adds a deployment manifest that defines three modules:

```json
{
  "id": "envsensorv1",
  "displayName": "Environmental sensor deployment manifest",
  "data": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.0",
          "runtime": {
            "type": "docker",
            "settings": {
              "minDockerVersion": "v1.25",
              "loggingOptions": "",
              "registryCredentials": {}
            }
          },
          "systemModules": {
            "edgeAgent": {
              "type": "docker",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
                "createOptions": "{}"
              }
            }
          },
          "modules": {
            "SimulatedTemperatureSensor": {
              "version": "1.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
                "createOptions": "{}"
              }
            }
          }
        }
      },
      "$edgeHub": {
        "properties.desired": {
          "schemaVersion": "1.0",
          "routes": {
            "route": "FROM /* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 10
        }
      }
    }
  }
}
```

The request body has some required fields:

* `id`: a unique ID for the deployment manifest in the IoT Central application.
* `displayName`: a name for the deployment manifest that's displayed in the UI.
* `data`: the IoT Edge deployment manifest.

The response to this request looks like the following example:

```json
{
  "id": "envsensorv1",
  "data": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "runtime": {
            "type": "docker",
            "settings": {
              "minDockerVersion": "v1.25",
              "loggingOptions": "",
              "registryCredentials": {}
            }
          },
          "systemModules": {
            "edgeAgent": {
              "type": "docker",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
                "createOptions": "{}"
              }
            }
          },
          "modules": {
            "SimulatedTemperatureSensor": {
              "version": "1.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
                "createOptions": "{}"
              }
            }
          }
        }
      },
      "$edgeHub": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "routes": {
            "route": "FROM /* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 10
        }
      }
    }
  },
  "displayName": "Environmental sensor deployment manifest",
  "etag": "\"0500f164-0000-1100-0000-637cf09c0000\""
}
```

## Get a deployment manifest

Use the following request to retrieve details of a deployment manifest from your application:

```http
GET https://{your app subdomain}/api/deploymentManifests/{deploymentManifestId}?api-version=2022-10-31-preview
```

You can get the `deploymentManifestId` values by using the [List deployment manifests](#list-deployment-manifests) API.

The response to this request looks like the following example:

```json
{
  "id": "envsensor",
  "data": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "runtime": {
            "type": "docker",
            "settings": {
              "minDockerVersion": "v1.25",
              "loggingOptions": "",
              "registryCredentials": {}
            }
          },
          "systemModules": {
            "edgeAgent": {
              "type": "docker",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
                "createOptions": "{}"
              }
            }
          },
          "modules": {
            "SimulatedTemperatureSensor": {
              "version": "1.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
                "createOptions": "{}"
              }
            }
          }
        }
      },
      "$edgeHub": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "routes": {
            "route": "FROM /* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 10
        }
      }
    }
  },
  "displayName": "Environmental sensor deployment manifest",
  "etag": "\"0500f663-0000-1100-0000-637cec590000\""
}
```

## Update a deployment manifest

```http
PATCH https://{your app subdomain}/api/deploymentManifests/{deploymentManifestId}?api-version=2022-10-31-preview
```

The following sample request body updates the `SendInterval` desired property setting for the `SimuatedTemperatureSetting` module:

```json
{
  "data": {
    "modulesContent": {
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendInterval": 30
        }
      }
    }
  }
}
```

The response to this request looks like the following example:

```json
{
  "id": "envsensorv1",
  "data": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "runtime": {
            "type": "docker",
            "settings": {
              "minDockerVersion": "v1.25",
              "loggingOptions": "",
              "registryCredentials": {}
            }
          },
          "systemModules": {
            "edgeAgent": {
              "type": "docker",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
                "createOptions": "{}"
              }
            }
          },
          "modules": {
            "SimulatedTemperatureSensor": {
              "version": "1.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.2",
                "createOptions": "{}"
              }
            }
          }
        }
      },
      "$edgeHub": {
        "properties.desired": {
          "schemaVersion": "1.1",
          "routes": {
            "route": "FROM /* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 30
        }
      }
    }
  },
  "displayName": "Environmental sensor deployment manifest",
  "etag": "\"05003065-0000-1100-0000-637cf1b00000\""
}
```

## Delete a deployment manifest

Use the following request to delete a deployment manifest:

```http
DELETE https://{your app subdomain}/api/deploymentManifests/{deploymentManifestId}?api-version=2022-10-31-preview
```

## List deployment manifests

Use the following request to retrieve a list of deployment manifests from your application:

```http
GET https://{your app subdomain}/api/deploymentManifests?api-version=2022-10-31-preview
```

The response to this request looks like the following example:

```json
{
  "value": [
    {
      "id": "envsensor",
      "data": {
        "modulesContent": {
          "$edgeAgent": {
            "properties.desired": {
              "schemaVersion": "1.1",
              "runtime": {
                "type": "docker",
                "settings": {
                  "minDockerVersion": "v1.25",
                  "loggingOptions": "",
                  "registryCredentials": {}
                }
              },
              "systemModules": {
                "edgeAgent": {
                  "type": "docker",
                  "settings": {
                    "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
                    "createOptions": "{}"
                  }
                },
                "edgeHub": {
                  "type": "docker",
                  "status": "running",
                  "restartPolicy": "always",
                  "settings": {
                    "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
                    "createOptions": "{}"
                  }
                }
              },
              "modules": {
                "SimulatedTemperatureSensor": {
                  "version": "1.0",
                  "type": "docker",
                  "status": "running",
                  "restartPolicy": "always",
                  "settings": {
                    "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
                    "createOptions": "{}"
                  }
                }
              }
            }
          },
          "$edgeHub": {
            "properties.desired": {
              "schemaVersion": "1.1",
              "routes": {
                "route": "FROM /* INTO $upstream"
              },
              "storeAndForwardConfiguration": {
                "timeToLiveSecs": 7200
              }
            }
          },
          "SimulatedTemperatureSensor": {
            "properties.desired": {
              "SendData": true,
              "SendInterval": 10
            }
          }
        }
      },
      "displayName": "Environmental sensor deployment manifest",
      "etag": "\"0500f663-0000-1100-0000-637cec590000\""
    },
    {
        // More deployment manifests
    }
  ]
}
```

## Assign a deployment manifest to a device

To use a deployment manifest that's already stored in your IoT Central application, first use the [Get a deployment manifest](#get-a-deployment-manifest) API to fetch it.
Use the following request to assign a deployment manifest to an IoT Edge device in your IoT Central application:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/devices/{your IoT Edge device ID}/applyDeploymentManifest?api-version=2022-10-31-preview
```

The following sample request body assigns the deployment manifest to the IoT Edge device:

```json
{
  "data": {
    "modulesContent": {
      "$edgeAgent": {
        "properties.desired": {
          "schemaVersion": "1.0",
          "runtime": {
            "type": "docker",
            "settings": {
              "minDockerVersion": "v1.25",
              "loggingOptions": "",
              "registryCredentials": {}
            }
          },
          "systemModules": {
            "edgeAgent": {
              "type": "docker",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-agent:1.4",
                "createOptions": "{}"
              }
            },
            "edgeHub": {
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-hub:1.4",
                "createOptions": "{}"
              }
            }
          },
          "modules": {
            "SimulatedTemperatureSensor": {
              "version": "1.0",
              "type": "docker",
              "status": "running",
              "restartPolicy": "always",
              "settings": {
                "image": "mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0",
                "createOptions": "{}"
              }
            }
          }
        }
      },
      "$edgeHub": {
        "properties.desired": {
          "schemaVersion": "1.0",
          "routes": {
            "route": "FROM /* INTO $upstream"
          },
          "storeAndForwardConfiguration": {
            "timeToLiveSecs": 7200
          }
        }
      },
      "SimulatedTemperatureSensor": {
        "properties.desired": {
          "SendData": true,
          "SendInterval": 10
        }
      }
    }
  }
}
```

## Next steps

Now that you've learned how to manage deployment manifests with the REST API, a suggested next step is to learn [How to use the IoT Central REST API to manage devices](howto-manage-devices-with-rest-api.md).
