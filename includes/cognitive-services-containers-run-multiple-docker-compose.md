--- 
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 05/07/2019
--- 

### Run separate containers with Docker Compose

Use the following Docker Compose yaml file to start 2 Cognitive Services containers.

The top section should only use information for the first container. The bottom section should only use information for the second container. Each container can have the same `{BILLING_ENDPOINT_URI}` but will have different values for for `{BILLING_KEY}`.

```docker
version: '3.3'
services:
  myfirstcontainer:
    image:  <container-registry path including first container-name>
    environment:
       eula: accept
       billing: "{BILLING_ENDPOINT_URI}"
       apiKey: {BILLING_KEY}
    volumes:
       - type: bind
         source: c:\output
         target: /output
    ports:
      - "5000:5000"

  mysecondcontainer:
    image: <container-registry path including second container-name>
    environment:
      eula: accept
       billing: "{BILLING_ENDPOINT_URI}"
       apiKey: {BILLING_KEY}
    volumes:
       - type: bind
         source: c:\output
         target: /output
    ports:
      - "5001:5000"

```