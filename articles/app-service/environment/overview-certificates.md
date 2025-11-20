---
title: Certificates in App Service Environment
description: Explain the use of certificates in an App Service Environment. Learn how certificate bindings work on the single-tenanted apps in an App Service Environment.
author: seligj95
ms.topic: overview
ms.date: 10/30/2025
ms.author: jordanselig
ms.service: azure-app-service
---

# Certificates and the App Service Environment 

The App Service Environment is a deployment of the Azure App Service that runs within your Azure virtual network. It can be deployed with an internet accessible application endpoint or an application endpoint that is in your virtual network. If you deploy the App Service Environment with an internet accessible endpoint, that deployment is called an External App Service Environment. If you deploy the App Service Environment with an endpoint in your virtual network, that deployment is called an ILB App Service Environment. You can learn more about the ILB App Service Environment from the [Create and use an ILB App Service Environment](./creation.md) document.

## Application certificates

Applications that are hosted in an App Service Environment support the following app-centric certificate features, which are also available in the multitenant App Service. For requirements and instructions for uploading and managing those certificates, see [Add a TLS/SSL certificate in Azure App Service](../configure-ssl-certificate.md).

- [SNI certificates](../configure-ssl-certificate.md)
- [KeyVault hosted certificates](../configure-ssl-certificate.md#import-a-certificate-from-key-vault)

Once you add the certificate to your App Service app or function app, you can [secure a custom domain name with it](../configure-ssl-bindings.md) or [use it in your application code](../configure-ssl-certificate-in-code.md).

### Limitations

[App Service managed certificates](../configure-ssl-certificate.md#create-a-free-managed-certificate) aren't supported on apps that are hosted in an App Service Environment.

## TLS settings

You can [configure the TLS setting](../configure-ssl-bindings.md#enforce-tls-versions) at an app level.

## Root certificates for private client scenarios

When your app acts as a client connecting to services secured with private Certificate Authority (CA) certificates, you need to add root certificates to establish trust. App Service Environment v3 provides two methods for managing root certificates:

- **Root Certificate API** (Recommended): Environment-wide management for all apps
- **Private client certificate**: Per-app configuration using Application Settings

### Choosing the right method

| Method | Scope | Use when | Limitations |
|--------|-------|----------|-------------|
| **Root Certificate API** | All apps in the App Service Environment | - You manage multiple apps that need the same root certificates<br>- You want centralized certificate management<br>- You're deploying new environments with Infrastructure as Code | - Requires stopping and starting existing apps to pick up new certificates<br>- Requires API/CLI/IaC tools (not available in Azure portal at this time) |
| **Private client certificate** | Apps in a single App Service plan | - You need certificates for only a few apps<br>- You prefer portal-based configuration<br>- Different apps need different root certificates | - Windows code apps only<br>- Must configure each App Service plan separately<br>- Certificates not available outside app code (can't be used for container registry authentication or front-end TLS validation) |

The general recommendation is to use the Root Certificate API for new deployments and when managing certificates across multiple apps. It provides better scalability, automation support, and works for both Windows and Linux apps.

## Root Certificate API

The Root Certificate API allows you to programmatically add root certificates to your App Service Environment v3, making them available to all apps during startup. Root certificates are public certificates that identify a root certificate authority (CA) and are essential for establishing trust in secure communications. By adding root certificates to your App Service Environment, all apps hosted within that environment have them installed in their root store, ensuring secure communication with internal services or APIs that use certificates issued by private or enterprise CAs.

This capability is available for both Windows and Linux-based apps in App Service Environment v3. Root certificates added through this API are automatically injected into the trust store of apps at startup, eliminating the need for per-app configurations and simplifying certificate lifecycle management.

### Important considerations

- Certificates can be added to an App Service Environment using the REST API, Azure CLI, ARM templates, Bicep, or Terraform.
- If you add a certificate to an App Service Environment with existing or running apps, you must **stop** and then **start** each app for the certificate store to be updated with the new root certificate. Adding all certificates before creating your apps is recommended to eliminate the need to stop and start apps individually.
  - Stop and start operations are different from restarting your app. You must use the dedicated stop and start commands available in the Azure portal, Azure CLI, or REST API.
  - Starting and stopping apps causes temporary outages while the apps are stopped.
  - If you have multiple apps and want to automate this process, you can use the Azure CLI or REST API.
- During the certificate addition process, you must provide the entire certificate blob in the request. You can't upload a *.cer* file directly.

### Add a root certificate

To add a root certificate to your App Service Environment, use one of the following methods:

### [REST API](#tab/rest-api)

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates/{certificateName}?api-version=2024-04-01

Content-Type: application/json

{
  "location": "{location}",
  "properties": {
    "blob": "{raw certificate blob}",
    "isRoot": true
  }
}
```

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az rest --method put \
  --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates/{certificateName}?api-version=2024-04-01 \
  --body "{'location': '{location}', 'properties': {'blob': '{raw certificate blob}', 'isRoot': true}}"
```

### [ARM Template](#tab/arm-template)

To create a root certificate resource in your ARM template, add the following JSON:

```json
{
  "type": "Microsoft.Web/hostingEnvironments/publicCertificates",
  "apiVersion": "2024-04-01",
  "name": "{certificateName}",
  "location": "{location}",
  "properties": {
    "blob": "{raw certificate blob}",
    "isRoot": true
  }
}
```

### [Bicep](#tab/bicep)

```bicep
resource rootCertificate 'Microsoft.Web/hostingEnvironments/publicCertificates@2024-04-01' = {
  name: '{certificateName}'
  parent: ase
  location: location
  properties: {
    blob: '{raw certificate blob}'
    isRoot: true
  }
}
```

### [Terraform](#tab/terraform)

To create a root certificate resource in your Terraform configuration, add the following to your template. You must include `schema_validation_enabled = false` for the resource to be created successfully.

```hcl
resource "azapi_resource" "{certificateName}" {
  type      = "Microsoft.Web/hostingEnvironments/publicCertificates@2024-04-01"
  name      = "{certificateName}"
  parent_id = "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Web/hostingEnvironments/<aseName>"
  body = jsonencode({
    location = var.location
    properties = {
      blob   = "{raw certificate blob}"
      isRoot = true
    }
    kind = "string"
  })
  schema_validation_enabled = false
}
```

-----

Replace the following placeholders:

- `{subscriptionId}`: Your Azure subscription ID
- `{resourceGroupName}`: The resource group containing your App Service Environment
- `{aseName}`: The name of your App Service Environment
- `{certificateName}`: A name for your certificate resource
- `{location}`: The Azure region where your App Service Environment is deployed
- `{raw certificate blob}`: The raw certificate blob from your root certificate

### Remove a root certificate

To remove a root certificate from your App Service Environment:

### [REST API](#tab/rest-api-remove)

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates/{certificateName}?api-version=2024-04-01
```

### [Azure CLI](#tab/azure-cli-remove)

```azurecli-interactive
az rest --method delete \
  --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates/{certificateName}?api-version=2024-04-01
```

-----

### Retrieve a specific certificate

To retrieve a specific root certificate from your App Service Environment:

### [REST API](#tab/rest-api-get-specific)

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates/{certificateName}?api-version=2024-04-01
```

### [Azure CLI](#tab/azure-cli-get-specific)

```azurecli-interactive
az rest --method get \
  --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates/{certificateName}?api-version=2024-04-01
```

-----

### Retrieve all public certificates

To retrieve all public certificates from your App Service Environment:

### [REST API](#tab/rest-api-get-all)

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates?api-version=2024-04-01
```

### [Azure CLI](#tab/azure-cli-get-all)

```azurecli-interactive
az rest --method get \
  --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/hostingEnvironments/{aseName}/publicCertificates?api-version=2024-04-01
```

-----

### Stop and start apps

After adding a root certificate to an App Service Environment with existing apps, you must stop and start each app to update the certificate store.

### [Azure portal](#tab/portal)

1. Navigate to your app in the Azure portal.
1. Select **Stop** from the overview page.
1. Wait for the app to stop completely.
1. Select **Start** to restart the app.

### [REST API](#tab/rest-api-app)

Stop the app:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{appName}/stop?api-version=2024-04-01
```

Start the app:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{appName}/start?api-version=2024-04-01
```

### [Azure CLI](#tab/azure-cli-app)

Stop the app:

```azurecli-interactive
az webapp stop --name {appName} --resource-group {resourceGroupName}
```

Start the app:

```azurecli-interactive
az webapp start --name {appName} --resource-group {resourceGroupName}
```

---

## Private client certificate (per-app configuration)

> [!NOTE]
> For most scenarios, use the [Root Certificate API](#root-certificate-api) instead of this method. The Root Certificate API provides environment-wide certificate management for both Windows and Linux apps, while this method is limited to Windows code apps within a single App Service plan.

If you need to configure root certificates for specific apps only, or if you prefer using the Azure portal, you can use the private client certificate method. This approach uploads certificates to individual apps and makes them available to apps in the same App Service plan.

>[!IMPORTANT]
> Private client certificates are only supported from custom code in Windows code apps. Private client certificates aren't supported outside the app. This limits usage in scenarios such as pulling the app container image from a registry using a private certificate and TLS validating through the front-end servers using a private certificate.

Follow these steps to upload the certificate (*.cer* file) to your app in your App Service Environment. The *.cer* file can be exported from your certificate. For testing purposes, there's a PowerShell example at the end to generate a temporary self-signed certificate:

1. Go to the app that needs the certificate in the Azure portal
1. Go to **Certificates** in the app. Select **Public Key Certificate (.cer)**. Select **Add certificate**. Provide a name. Browse and select your *.cer* file. Select upload. 
1. Copy the thumbprint.
1. Go to **Configuration** > **Application Settings**. Create an app setting WEBSITE_LOAD_ROOT_CERTIFICATES with the thumbprint as the value. If you have multiple certificates, you can put them in the same setting separated by commas and no whitespace like 

	84EC242A4EC7957817B8E48913E50953552DAFA6,6A5C65DC9247F762FE17BF8D4906E04FE6B31819

The certificate is available by all the apps in the same App Service plan as the app, which configured that setting, but all apps that depend on the private CA certificate should have the Application Setting configured to avoid timing issues.

If you need it to be available for apps in a different App Service plan, you need to repeat the app setting operation for the apps in that App Service plan. To check that the certificate is set, go to the Kudu console and issue the following command in the PowerShell debug console:

```azurepowershell-interactive
dir Cert:\LocalMachine\Root
```

To perform testing, you can create a self signed certificate and generate a *.cer* file with the following PowerShell: 

```azurepowershell-interactive
$certificate = New-SelfSignedCertificate -CertStoreLocation "Cert:\LocalMachine\My" -DnsName "*.internal.contoso.com","*.scm.internal.contoso.com"

$certThumbprint = "Cert:\LocalMachine\My\" + $certificate.Thumbprint
$fileName = "exportedcert.cer"
Export-Certificate -Cert $certThumbprint -FilePath $fileName -Type CERT
```

---

## Private server certificate (TLS/SSL binding)

> [!NOTE]
> This section covers server certificates for TLS/SSL bindings, which is different from the root certificates discussed previously. Server certificates are used to secure your app's custom domain with HTTPS, while root certificates establish trust for outbound client connections.

If your app acts as a server in a client-server model, either behind a reverse proxy or directly with private client and you're using a private CA certificate, you need to upload the server certificate (*.pfx* file) with the full certificate chain to your app and bind the certificate to the custom domain. Because the infrastructure is dedicated to your App Service Environment, the full certificate chain is added to the trust store of the servers. You only need to upload the certificate once to use it with apps that are in the same App Service Environment.

>[!NOTE]
> If you uploaded your certificate before October 1, 2023, you need to reupload and rebind the certificate for the full certificate chain to be added to the servers.

Follow the [secure custom domain with TLS/SSL](../configure-ssl-bindings.md) tutorial to upload/bind your private CA rooted certificate to the app in your App Service Environment.

## Next steps

* Information on how to [use certificates in application code](../configure-ssl-certificate-in-code.md)