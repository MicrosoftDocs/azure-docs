---
author: IEvangelist
ms.author: dapine
ms.date: 06/25/2019
ms.service: cognitive-services
ms.topic: include
---

If you need to configure an HTTP proxy for making outbound requests, use these two arguments:

| Name | Data type | Description |
|--|--|--|
|HTTP_PROXY|string|The proxy to use, for example, `http://proxy:8888`<br>`<proxy-url>`|
|HTTP_PROXY_CREDS|string|Any credentials needed to authenticate against the proxy, for example, `username:password`. This value **must be in lower-case**. |
|`<proxy-user>`|string|The user for the proxy.|
|`<proxy-password>`|string|The password associated with `<proxy-user>` for the proxy.|
||||


```bash
docker run --rm -it -p 5000:5000 \
--memory 2g --cpus 1 \
--mount type=bind,src=/home/azureuser/output,target=/output \
<registry-location>/<image-name> \
Eula=accept \
Billing=<endpoint> \
ApiKey=<api-key> \
HTTP_PROXY=<proxy-url> \
HTTP_PROXY_CREDS=<proxy-user>:<proxy-password> \
```
