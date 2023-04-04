---
title: Enable automatic HTTPS with Caddy in a sidecar container
description: dadf
author: matthiasguentert
ms.author: #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/31/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a how-to article.
See the [how-to guidance](contribute-how-to-write-howto.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# Enable automatic HTTPS with Caddy in a sidecar container

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

This article describes how Caddy can be used as a sidecar container in a [container group](container-instances-container-groups.md) acting as a reverse proxy to provide an automatically managed HTTPS endpoint for your application. 

Caddy is a powerful, enterprise-ready, open source web server with automatic HTTPS written in Go and represents an alternative to Nginx. 

The automatization of certificates is possible because Caddy supports the ACMEv2 API ([RFC 8555](https://www.rfc-editor.org/rfc/rfc8555)) that interacts with [Let's Encrypt](https://letsencrypt.org/) to issue certificates. 

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.55 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Prepare the Caddyfile

* Required to configure caddy
* uses http on purpose
* intra-group communication via localhost only (different from docker compose)

```console
your-application.westeurope.azurecontainer.io {
    reverse_proxy http://localhost:5000
}
```

## Prepare Storage Account

- Create storage account and file shares
- Required to store state and caddy configuration

```azurecli
# Create storage account 
az storage account create \
  --name <my-storage-account> \
  --resource-group <my-rg> \
  --location westeurope

# Store connection string 
$env:AZURE_STORAGE_CONNECTION_STRING = $(az storage account show-connection-string --name <my-storage-account> --resource-group rg-demo --output tsv)

# Create file shares 
az storage share create \
  --name proxy-caddyfile \
  --account-name <my-storage-account>

az storage share create \
  --name proxy-config \
  --account-name <my-storage-account>
  
  az storage share create \
  --name proxy-data \
  --account-name <my-storage-account>
```

## Deploy container group 

### Create YAML file

Prepare the YAML file for the ACI configuration 

```yml 
name: ci-adventureworks-tls-api
apiVersion: "2021-10-01"
location: westeurope
properties:
  containers:
    - name: reverse-proxy
      properties:
        image: caddy:2.6
        ports:
          - protocol: TCP
            port: 80
          - protocol: TCP
            port: 443
        resources:
          requests:
            memoryInGB: 1
            cpu: 1
          limits:
            memoryInGB: 1
            cpu: 1
        volumeMounts:
          - name: proxy-caddyfile
            mountPath: /etc/caddy
          - name: proxy-data
            mountPath: /data
          - name: proxy-config
            mountPath: /config
    - name: my-app
      properties:
        image: mcr.microsoft.com/azuredocs/aci-helloworld
        ports:
        - port: 80
          protocol: TCP
        resources:
          requests:
            memoryInGB: 1
            cpu: 1
          limits: 
            memoryInGB: 1
            cpu: 1

  ipAddress:
    ports:
      - protocol: TCP
        port: 80
      - protocol: TCP
        port: 443
    type: Public        
    dnsNameLabel: my-application

  osType: Linux

  volumes:
    - name: proxy-caddyfile
      azureFile: 
        shareName: proxy-caddyfile
        storageAccountName: "<my-storage-account>" 
        storageAccountKey: "<your-key>"
    - name: proxy-data
      azureFile: 
        shareName: proxy-data
        storageAccountName: "<my-storage-account>"  
        storageAccountKey: "<your-key>"
    - name: proxy-config
      azureFile: 
        shareName: proxy-config
        storageAccountName: "<my-storage-account>"  
        storageAccountKey: "<your-key>"
```

### Deploy the container group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command:

```azurecli
az group create --name <resource-group> --location westeurope
```

Deploy the container group with the [az container create](/cli/azure/container#az-container-create) command, passing the YAML file as an argument.

```azurecli
az container create --resource-group <resource-group> --file deploy-aci.yaml
```

### View the deployment state 

To view the state of the deployment, use the following [az container show](/cli/azure/container#az-container-show) command:

```azurecli
az container show --resource-group <resource-group> --name my-app --output table
```

* TODO: alternatively check the caddy logs by using... 

### Verity TLS connection 

* Navigate to ... 
* Check cert with browser 
* Todo insert screenshot here

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
