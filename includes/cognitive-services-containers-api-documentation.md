---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 03/25/2019
---

## Validate container is running 

There are several ways to validate the container is running: 

|Request|Purpose|
|--|--|
|`http://localhost:5000/`|The container provides a homepage.|
|`http://localhost:5000/status`|Requested with GET, to validate the container is running without causing an endpoint query. This can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).|
|`http://localhost:5000/swagger`|The container provides a full set of documentation for the endpoints as well as a `Try it now` feature. This feature allows you to enter your settings into a web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required. |

![Container's homepage](./media/cognitive-services-containers-api-documentation/container-webpage.png)
