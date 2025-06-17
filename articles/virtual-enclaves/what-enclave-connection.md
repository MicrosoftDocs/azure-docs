---
title: What is an enclave connection?
description: What is an enclave connection?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# What is an enclave connection?

Enclave connections enable network traffic to flow between an enclave and a trusted destination defined within the community boundary. The destination of every enclave is either an enclave or community endpoint. Enclave connections allow resources within your Enclave to access services and data running within another Enclave (Enclave Endpoint), or to trusted private and/or public destinations defined at the community level (Community Endpoint). 

Enclave connections can also enable secured public access to resources within an enclave through a transit hub connection. In these cases, the transit hub would be the source of the Connection and an enclave endpoint would be the destination. 

## Architecture of an enclave connection

![Diagram showing connections between two enclaves and connections to external resources.](./media/connections-two-enclaves-enclave-external.png)

## Template
See [template documentation](./virtual-enclaves-templates.md#connections-template)
