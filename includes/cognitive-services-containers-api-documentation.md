---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 03/22/2019
---

## Validate container is running 

There are several ways to validate the container is running: visually verifying the homepage, read the swagger at `/swagger` endpoint, read the documentation from the container, ping the container's `/status` endpoint.

### Container's Homepage

The container provides a homepage at `\` as a visual validation that the container is running. 

![Container's homepage](./media/container-webpage.png)

### Container's Status API documentation

The container provides a `/status` endpoints requested with GET to validate the container is running without causing an endpoint query. This can be used for Kubernetes [liveness and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).

### Container's API documentation

The container provides a full set of documentation for the endpoints as well as a `Try it now` feature. This feature allows you to enter your settings into a web-based HTML form and make the query without having to write any code. Once the query returns, an example CURL command is provided to demonstrate the HTTP headers and body format required. 

> [!TIP]
> Read the [OpenAPI specification](https://swagger.io/docs/specification/about/), describing the API operations supported by the container, from the `/swagger` relative URI. For example:
>
>  ```http
>  http://localhost:5000/swagger
>  ```