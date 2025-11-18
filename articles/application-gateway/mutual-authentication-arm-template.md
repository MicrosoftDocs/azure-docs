---
title: Configure mutual authentication with Application Gateway through ARM template
titleSuffix: Azure Application Gateway
description: Deploy an Azure Application Gateway with mutual TLS (mTLS) passthrough using an ARM template.
services: application-gateway
author: mbender-ms
ms.author: mbender
ms.date: 11/18/2025
ms.topic: quickstart
ms.service: azure-application-gateway
ms.custom: mvc, subject-armqs, mode-arm, devx-track-arm-template
# Customer intent: As a cloud architect, I want to deploy an Azure Application Gateway with an mTLS passthrough mode so that my web applications can handle mixed traffic (certificate-based and token-based) securely and at scale.
---

# Deploy an Azure Application Gateway with mTLS passthrough listener


This quickstart shows how to deploy an Azure Application Gateway with **mutual TLS (mTLS) passthrough** using an ARM template and API version `2025-03-01`. In passthrough mode, the gateway requests a client certificate but does **not validate it**. Certificate validation and policy enforcement occur at the backend.

## Key features
- Associate an SSL profile with the listener for mTLS passthrough.
- No client CA certificate required at the gateway.
- `verifyClientAuthMode` supports `Strict` and `Passthrough`.

> [!NOTE]
> Portal, PowerShell, and CLI support for passthrough configuration are currently unavailable. For the purpose of this guide, use ARM templates.

## Prerequisites
- Azure subscription and resource group.
- Azure CLI installed.
- SSL certificate (Base64-encoded PFX) and password.
- SSH key for Linux VM admin (if applicable).
- API version `2025-03-01` for passthrough property.


## Deploy Application Gateway with mTLS passthrough listener

This template creates:
- A **Virtual Network** with two subnets (one delegated to Application Gateway).
- A **Public IP address** for the gateway frontend.
- An **Application Gateway (Standard_v2)** with:
  - SSL certificate and SSL profile for client certificate passthrough.
  - HTTPS listener and routing rule.
  - Backend pool pointing to an app service.

### Parameter file: `deploymentParameters.json`

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "addressPrefix": { "value": "10.0.0.0/16" },
    "subnetPrefix": { "value": "10.0.0.0/24" },
    "skuName": { "value": "Standard_v2" },
    "capacity": { "value": 2 },
    "adminUsername": { "value": "ubuntu" },
    "adminSSHKey": { "value": "<your-ssh-public-key>" },
    "certData": { "value": "<Base64-encoded-PFX-data>" },
    "certPassword": { "value": "<certificate-password>" }
  }
}

```
### Template file: deploymentTemplate.json

```
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "addressPrefix": { "type": "String", "defaultValue": "10.0.0.0/16" },
    "subnetPrefix": { "type": "String", "defaultValue": "10.0.0.0/24" },
    "skuName": { "type": "String", "defaultValue": "Standard_v2" },
    "capacity": { "type": "Int", "defaultValue": 2 },
    "adminUsername": { "type": "String" },
    "adminSSHKey": { "type": "SecureString" },
    "certData": { "type": "String" },
    "certPassword": { "type": "SecureString" }
  },
  "variables": {
    "applicationGatewayName": "mtlsAppGw",
    "publicIPAddressName": "mtlsPip",
    "virtualNetworkName": "mtlsVnet",
    "subnetName": "appgwsubnet"
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2024-07-01",
      "name": "[variables('virtualNetworkName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "addressSpace": { "addressPrefixes": [ "[parameters('addressPrefix')]" ] },
        "subnets": [
          {
            "name": "[variables('subnetName')]",
            "properties": {
              "addressPrefix": "[parameters('subnetPrefix')]",
              "delegations": [
                {
                  "name": "Microsoft.Network/applicationGateways",
                  "properties": { "serviceName": "Microsoft.Network/applicationGateways" }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Network/applicationGateways",
      "apiVersion": "2025-03-01",
      "name": "[variables('applicationGatewayName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "sku": { "name": "[parameters('skuName')]", "tier": "[parameters('skuName')]", "capacity": "[parameters('capacity')]" },
        "sslCertificates": [
          {
            "name": "sslCert",
            "properties": { "data": "[parameters('certData')]", "password": "[parameters('certPassword')]" }
          }
        ],
        "sslProfiles": [
          {
            "name": "sslPassthrough",
            "properties": {
              "clientAuthConfiguration": {
                "VerifyClientAuthMode": "Passthrough",
                "VerifyClientCertIssuerDN": false,
                "VerifyClientRevocation": "None"
              }
            }
          }
        ]
      }
    }
  ]
}
```

### Deploy the template

```
az deployment group create \
  --resource-group <your-resource-group> \
  --template-file deploymentTemplate.json \
  --parameters @deploymentParameters.json
```

### Validate and test


 **Validate deployment**
   - In Azure portal, check the Application Gateway resource JSON file
   - Select API version 2025-03-01 and verify sslprofile
   - Validate `verifyClientAuthMode` is set to "passthrough"
   ```
   "sslProfiles": [
            {
                "name": "sslnotrustedcert",
                "id": "samplesubscriptionid",
                "etag": "W/\"851e4e20-d2b1-4338-9135-e0beac11aa0e\"",
                "properties": {
                    "provisioningState": "Succeeded",
                    "clientAuthConfiguration": {
                        "verifyClientCertIssuerDN": false,
                        "verifyClientRevocation": "None",
                        "verifyClientAuthMode": "Passthrough"
                    },
                    "httpListeners": [
                        {
                            "id": "samplesubscriptionid"
                        }
                    ]
  ```

**Send client certificate to backend**
  - If you need to forward the client certificate to the backend, configure a rewrite rule as described in [mutual-authentication-server-variables.](rewrite-http-headers-url.md)

  - If the client has sent a certificate, this rewrite ensures the client certificate is included in the request headers for backend processing.

**Test connectivity**
   - Connections should be established even if a client certificate is not provided.




## mTLS passthrough parameters

| Name                    | Type   | Description                                                                 |
|-------------------------|--------|-----------------------------------------------------------------------------|
| verifyClientCertIssuerDN| boolean| Verify client certificate issuer name on the gateway                        |
| verifyClientRevocation  | options| Verify client certificate revocation                                        |
| VerifyClientAuthMode    | options| Set client certificate mode (`Strict` or `Passthrough`)                     |

**Passthrough Mode:** Gateway requests a client certificate but does not enforce it. Backend validates certificate and enforces policy.

## Security notice

This solution is classified as **Microsoft Confidential**. Please ensure you follow your organization’s security and data handling best practices when deploying and managing this solution.