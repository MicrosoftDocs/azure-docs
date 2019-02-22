---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 01/22/2019
---

If you need to configure an HTTP proxy for making outbound requests, use these two arguments:

| Name | Data type | Description |
|--|--|--|
|HTTP_PROXY|string|the proxy to use, for example, http://proxy:8888|
|HTTP_PROXY_CREDS|string|any credentials needed to authenticate against the proxy, for example, username:password.|

```bash
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
--mount type=bind,src=/home/azureuser/output,target=/output \
<registry-location>/<image-name> \
Eula=accept \
Billing=<billing-endpoint> \
ApiKey=<api-key> \
HTTP_PROXY=http://190.169.1.6:3128 \
HTTP_PROXY_CREDS=jerry:123456 \
Logging:Disk:LogLevel=Debug Logging:Disk:Format=json
```