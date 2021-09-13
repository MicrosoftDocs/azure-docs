---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 09/10/2021
ms.author: danlep
---
If you don't have an existing scope map for the required repositories, use the following command to create one:

```azurecli
az acr scope-map create \
  --description "Connected registry repo pull scope map" \
  --name connected-registry-pull \
  --registry $REGISTRY_NAME \
  --repository "acr/connected-registry" content/read \
  --repository "azureiotedge-api-proxy" content/read \
  --repository "azureiotedge-agent" content/read \
  --repository "azureiotedge-hub" content/read
```

Next, use the following command to create a client token for the IoT Edge device and associate it to the scope map:

```azurecli
az acr token create \
  --name crimagepulltoken \
  --registry $REGISTRY_NAME \
  --scope-map connected-registry-pull
```

Output includes credential information similar to the following:

```json
  ...
  "credentials": {
    "activeDirectoryObject": null,
    "certificates": [],
    "passwords": [
      {
        "creationTime": "2020-12-10T00:06:15.356846+00:00",
        "expiry": null,
        "name": "password1",
        "value": "xxxxxxxxxxxxxxxxxxxxx"
      },
      {
        "creationTime": "2020-12-10T00:06:15.356846+00:00",
        "expiry": null,
        "name": "password2",
        "value": "xxxxxxxxxxxxxxxxxxxxx
      }
    ],
    "username": "crimagepulltoken"
  }
  ...
```

You will need the `username` and one of the `passwords` values for the IoT Edge manifest used in a later step in this quickstart.

  > [!IMPORTANT]
  > Make sure that you save the generated passwords. Those are one-time passwords and cannot be retrieved. You can generate new passwords using the [az acr token credential generate][az-acr-token-credential-generate] command.

For more information about tokens and scope maps, see [Create a token with repository-scoped permissions](../articles/container-registry/container-registry-repository-scoped-permissions.md).
