---
author: IEvangelist
ms.author: dapine
ms.date: 06/25/2019
ms.service: cognitive-services
ms.topic: include
---

## Validate that a container is running 

There are several ways to validate that the container is running. 

|Request|Purpose|
|--|--|
|`http://localhost:5000/`|The container provides a home page.|
|`http://localhost:5000/status`|Requested with GET, to validate that the container is running without causing an endpoint query. This request can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).|
|`http://localhost:5000/swagger`|The container provides a full set of documentation for the endpoints and a `Try it now` feature. With this feature, you can enter your settings into a web-based HTML form and make the query without having to write any code. After the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format that's required. |

![Container's home page](./media/cognitive-services-containers-api-documentation/container-webpage.png)
