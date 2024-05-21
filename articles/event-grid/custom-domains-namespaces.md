---
title: Custom domains for Azure Event Grid hostnames
description: This article describes how custom domain names can be assigned to your Event Grid namespace's MQTT and HTTP host names along with the default host names.
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 05/21/2024
author: george-guirguis
ms.author: geguirgu
---

# Custom domain names for Event Grid namespace's MQTT and HTTP host names
The Event Grid namespace is automatically assigned an HTTP hostname at the time of creation. If MQTT is enabled on the namespace, the MQTT hostname is also assigned to the namespace. Your clients use these host names to communicate with the Event Grid namespace.  

You can assign your custom domain names to your Event Grid namespace’s MQTT and HTTP host names, along with the default host names. Custom domain configurations not only help you to meet your security and compliance requirements, but also eliminates the need to modify your clients that are already linked to your domain. 

## High-level steps 

To use custom domains for namespaces, follow these steps: 

1. Add DNS entries to point your custom domain to the Event Grid namespace endpoint. 
1. Enable managed identity on your Event Grid namespace. 
1. Create an Azure Key Vault account that hosts the server certificate for your custom domain. 
1. Add role assignment in Azure Key Vault for the namespace’s managed identity. 
1. Associate your Event Grid namespace with the custom domain, specifying your custom domain name, certificate name, and key vault instance reference. 
1. The Event Grid namespace generates a TXT record that you use to prove ownership of the custom domain. 
1. Prove your domain ownership by creating a TXT record based on the value that Event Grid generated in the previous step. 
1. Event Grid validates the TXT records of the custom domain before activating the custom domain for your clients’ usage. 
1. Your clients can connect to the Event Grid namespace through the custom domain. 

## Limitations

- Custom domain configuration is unique per region across MQTT and HTTP host names.
- Custom domain configuration can't be identical for the MQTT and HTTP host names under the same namespace. 
- Custom domain configuration can't clash with any MQTT or HTTP hostname for any namespace in the same region. 

## Next step
For step-by-step instructions, see [Assign custom domain names to Event Grid namespace's MQTT and HTTP host names](assign-custom-domain-name.md).
