---
title: Easy Button Deployments
description: Easy Button Deployments
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Deploy a Multi-Enclave Community

In this Quickstart, you deploy an E2E Azure Virtual Enclaves environment using the "Deploy to Azure" deployment button.

## What gets deployed
![Nightly-docs.svg](./media/Nightly-docs.svg)

- Community (x1)
- Enclaves (x2)
- Workload (x1, empty, created in `enc-1`)
- Community Endpoints: 
    - `plx`
        - `plx-vpaw`; sample values of demonstrating PrivateNetwork connectivity
        - `plx-dataplane`, 
    - `bing-outlook`; sample values of demonstrating Internet connectivity
        - `bing.com`
        - `outlook.com`
- Enclave Endpoint:
    - `ADDS-TCP` and `ADDS-UDP` - Ports/Protocols covering a fake AD DS instance
- Transit Hub:
    - Input parameter to a remote virtual network; covering Gateway connection
- Enclave Connections
    - | Source | Destination |
      |--|--|
      | Enclave 2 | Enclave 1 Endpoint `ADDS-TCP/UDP` |
      | Enclave 2 | Community Endpoint `bing-outlook` |
      | Enclave 2 | Community Endpoint `plx` |
      | Community (via Transit hub) | Enclave 1 Endpoint `ADDS-TCP/UDP` |

## Deploy the template

The "Deploy to Azure" deployment button will take you to a custom deployment UX for Azure Virtual Enclaves.

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](
https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjadean-msft%2FAzure-Unified-Launchpad%2Fmain%2FAVE-Templates%2Fnightly%2Ftemplate.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2Fjadean-msft%2FAzure-Unified-Launchpad%2Fmain%2FAVE-Templates%2Fnightly%2FdeploymentUI.json)
