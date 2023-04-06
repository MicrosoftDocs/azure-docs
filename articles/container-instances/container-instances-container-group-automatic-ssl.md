---
title: Enable automatic HTTPS with Caddy as a sidecar container
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

In this example, only the Caddy container gets exposed on ports 80/TCP and 443/TCP. The application behind the reverse proxy remains private. The network communication between Caddy and your application happens via localhost. 

> [!NOTE]
> This stands in contrast to the intra container group communication known from docker compose, where containers can be referenced by name. 

The example mounts the [Caddyfile](https://caddyserver.com/docs/caddyfile), which is required to configure the reverse proxy, from a file share hosted on an Azure Storage account. 

> [!NOTE]
> For production deployments, most users will want to bake the Caddyfile into a custom docker image based on [caddy](https://hub.docker.com/_/caddy). This way, there is no need to mount files into the container. 

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.55 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
- 
## Prepare the Caddyfile

Create a file called `Caddyfile` and paste the configuration below. This will create a simple reverse proxy configuration, pointing to your application container listening on 5000/TCP. 

```console
my-app.westeurope.azurecontainer.io {
    reverse_proxy http://localhost:5000
}
```

It's important to note, that the configuration references a domain name instead of an IP address. Caddy needs to be reachable by this URL to carry out the challenge step required by the ACME protocol and to successfully retrieve a certificate from Let's Encrypt. 

> [!NOTE]
> For production deployment, users might want to use a domain name they control, e.g., `api.company.com` and create a CNAME record pointing to e.g. `my-app.westeurope.azurecontainer.io`. If so, it needs to be ensured, that the custom domain name is also used in the Caddyfile, instead of the one assigned by Azure (e.g., `*.westeurope.azurecontainer.io`). Further, the custom domain name, needs to be referenced in the ACI YAML configuration described later in this example. 

## Prepare Storage Account

Create a storage account

```azurecli
az storage account create \
  --name <storage-account> \
  --resource-group <resource-group> \
  --location westeurope
```

Store the connection string to an environment variable 

```azurecli
AZURE_STORAGE_CONNECTION_STRING=$(az storage account show-connection-string --name <storage-account> --resource-group <resource-group> --output tsv)
```

Create the file shares required to store the container state and caddy configuration.

```azurecli
az storage share create \
  --name proxy-caddyfile \
  --account-name <storage-account>

az storage share create \
  --name proxy-config \
  --account-name <storage-account>
  
  az storage share create \
  --name proxy-data \
  --account-name <storage-account>
```

Retrieve the storage account keys and make a note for later use 

```azurecli
az storage account keys list -g <resource-group> -n <storage-account>
```

## Deploy container group

### Create YAML file

Create a file called e.g., `ci-my-app.yaml` and paste the content below. Ensure to replace `<account-key>` with one of the access keys previously received and `<storage-account>` accordingly. 

This YAML file defines two containers `reverse-proxy` and `my-app`. Whereas the `reverse-proxy` container mounts the three previously created file shares. Further, the configuration exposes port 80/TCP and 443/TCP of the `reverse-proxy` container. The communication between both containers happens on localhost only. 

>[!NOTE]
> It's important to note, that the `dnsNameLabel` key, defines the public DNS name, under which the container instance group will be reachable, it needs to match the FQDN defined in the `Caddyfile`

```yml 
name: ci-my-app
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
        - port: 5000
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
    dnsNameLabel: my-app

  osType: Linux

  volumes:
    - name: proxy-caddyfile
      azureFile: 
        shareName: proxy-caddyfile
        storageAccountName: "<storage-account>" 
        storageAccountKey: "<account-key>"
    - name: proxy-data
      azureFile: 
        shareName: proxy-data
        storageAccountName: "<storage-account>"  
        storageAccountKey: "<account-key>"
    - name: proxy-config
      azureFile: 
        shareName: proxy-config
        storageAccountName: "<storage-account>"  
        storageAccountKey: "<account-key>"
```

### Deploy the container group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command:

```azurecli
az group create --name <resource-group> --location westeurope
```

Deploy the container group with the [az container create](/cli/azure/container#az-container-create) command, passing the YAML file as an argument.

```azurecli
az container create --resource-group <resource-group> --file ci-my-app.yaml
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
