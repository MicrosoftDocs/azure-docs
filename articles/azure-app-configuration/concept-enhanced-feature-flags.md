---
title: Enhanced feature flags in Azure App Configuration
description: Overview of enhanced feature flag capabilities, resource models, and tooling requirements in Azure App Configuration.
author: jimmyca15
ms.author: jimmyca
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 08/26/2026
---

# Enhanced feature flags (preview)

Azure App Configuration provides two types of feature flags: enhanced feature flags and feature flags.

Enhanced feature flags are the latest addition to feature management in App Configuration. They come with enhanced capabilities and improved usability. Enhanced feature flags are standalone App Configuration resources with dedicated API support for create, read, update, and delete operations, unlike feature flags which are stored inside key-values. This distinction makes them easier to manage through App Configuration APIs, deployment templates, and feature management tooling.

Feature flags are the original, key-value-based feature flag model in App Configuration. Azure App Configuration continues to support feature flags.

> [!IMPORTANT]
> Enhanced feature flags are currently in preview. For new applications and new feature management work, evaluate whether enhanced feature flags meet your requirements for using a preview feature. Existing applications that already use feature flags can continue to use them.

## Benefits of enhanced feature flags

Enhanced feature flags use a purpose-built resource model that improves feature management across APIs, deployment workflows, validation, and application integrations, as described in the following sections.

### New capabilities

Azure App Configuration continues to add new feature management capabilities to enhanced feature flags. Feature flags remain supported.

### Dedicated resource and API surface

Enhanced feature flags have dedicated endpoints for creating, reading, updating, and deleting enhanced feature flag definitions.

Feature flags are managed through key-value APIs, which treat their definitions as opaque serialized values. Clients and automation must understand feature flag naming, serialization, and content-type conventions. This model makes feature flags harder to author directly through APIs or to update individual properties.

### Separate access control

Enhanced feature flags provide a separate security boundary because they're independent resources at the API level. You can grant access to enhanced feature flags independently from key-value resources. This separation helps applications and administrators follow the principle of least privilege.

Feature flags are stored as key-values and use the same RBAC actions as other configuration data. You can't grant a user or application permission to manage feature flags without also granting permission to manage key-values.

### Server-side validation

Azure App Configuration can validate enhanced feature flag definitions before storing them. Key-value APIs treat feature flag payloads as opaque values and can't validate their definitions.

### Separate queries

You can query enhanced feature flags separately from configuration key-values. Feature flags are returned with key-values unless you filter them out.

### Application integration

Applications can use enhanced feature flags without changing their feature evaluation logic. To access enhanced feature flags, use the applicable supported library versions listed in [Tool and library support](#tool-and-library-support).

## Resource models

The Azure App Configuration API represents enhanced feature flags and feature flags using different resource models. Creating an enhanced feature flag doesn't automatically replace, update, or delete a feature flag with the same name and label. If both types use the same name and label, App Configuration stores them as separate resources, and management operations on one don't affect the other. When App Configuration provider libraries load both types with the same name and label, they select the enhanced feature flag. The following sections describe how each type is represented and managed.

### Enhanced feature flags

The App Configuration API models enhanced feature flags as independent resources. An enhanced feature flag has its own fields, such as `name`, `label`, `enabled`, `conditions`, and `tags`.

The following example shows an enhanced feature flag. The enhanced feature flag fields are represented directly on the resource.

```json
{
	"etag": "7XpB48ET4VAlB9068ft6fKMyA3m",
	"name": "BetaFeature",
	"label": "production",
	"enabled": true,
	"conditions": {
		"filters": []
	},
	"last_modified": "2026-06-29T22:15:30+00:00",
	"tags": {
		"org": "ecom"
	}
}
```

Because App Configuration directly understands the enhanced feature flag resource, the service can validate enhanced feature flag definitions on the server and reject malformed flag data. The App Configuration API versions enhanced feature flags, which allows feature management behavior to evolve through the API surface.

Enhanced feature flags also keep application configuration and feature management data separate. You can query configuration key-values without enumerating enhanced feature flags, and you can manage enhanced feature flags without serializing their definitions into key-values.

### Feature flags

App Configuration stores feature flags as key-values. The key identifies the setting as a feature flag, and the feature flag definition appears as escaped JSON in the `value` field.

The following example shows a feature flag.

```json
{
	"etag": "7XpB48ET4VAlB9068ft6fKMyA3m",
	"key": ".appconfig.featureflag/BetaFeature",
	"label": "production",
	"content_type": "application/vnd.microsoft.appconfig.ff+json;charset=utf-8",
	"value": "{\"id\":\"BetaFeature\",\"enabled\":true,\"conditions\":{\"client_filters\":[]}}",
	"last_modified": "2026-06-29T22:15:30+00:00",
	"locked": false,
	"tags": {
		"org": "ecom"
	}
}
```

Feature flags remain supported. Existing feature flags continue to work, and App Configuration libraries continue to support them.

Because feature flags are key-values, clients must serialize and deserialize the feature flag definition. This model can make feature flags harder to author directly through the REST API or define in ARM and Bicep templates. It also means App Configuration key-value APIs can't validate the feature flag payload before storing it.

## Client and tooling differences

Because enhanced feature flags and feature flags use different resource models, clients, scripts, and deployment automation manage them through different APIs and commands.

### Azure SDK

_Enhanced feature flags_ provide a clear, purpose-built SDK experience. Their properties are represented directly, and clients manage them through dedicated enhanced feature flag APIs.

### [.NET](#tab/azure-sdk-enhanced-ff-dotnet)

```csharp
var client = new FeatureFlagClient();

var flag = new FeatureFlag("Beta");

client.SetFeatureFlag(flag);
```

### [Java](#tab/azure-sdk-enhanced-ff-java)

Enhanced feature flags aren't currently available in the Java SDK.

### [JavaScript](#tab/azure-sdk-enhanced-ff-javascript)

```javascript
const client = new FeatureFlagClient(endpoint, credential);

const flag = {
	name: "Beta",
	enabled: false,
};

await client.setFeatureFlag(flag);
```

### [Python](#tab/azure-sdk-enhanced-ff-python)

```python
client = FeatureFlagClient(endpoint, credential)

flag = FeatureFlag(name="Beta", enabled=False)

client.set_feature_flag(flag)
```

### [Go](#tab/azure-sdk-enhanced-ff-go)

```go
client,err := azappconfig.NewFeatureFlagClient(endpoint, credential, nil)

name := "Beta"
enabled := true

resp, err := client.AddFeatureFlag(
    context.Background(),
    azappconfig.FeatureFlag{
        Name:        &name,
        Enabled:     &enabled,
    },
    nil,
)
```

---

_App Configuration_ stores feature flags as key-values and you manage them through configuration setting APIs. This model requires clients to use key-value abstractions and understand feature flag conventions instead of working with a dedicated feature flag resource.

### [.NET](#tab/azure-sdk-ff-dotnet)

```csharp
var client = new ConfigurationClient();

var flag = new FeatureFlagConfigurationSetting("Beta");

client.SetConfigurationSetting(flag);
```

### [Java](#tab/azure-sdk-ff-java)

```java
ConfigurationClient client = new ConfigurationClientBuilder()
	.connectionString(connectionString)
	.buildClient();

FeatureFlagConfigurationSetting flag = new FeatureFlagConfigurationSetting("Beta", false);

client.setConfigurationSetting(flag);
```

### [JavaScript](#tab/azure-sdk-ff-javascript)

```javascript
const client = new AppConfigurationClient(endpoint, credential);

const flag = {
  key: `${featureFlagPrefix}Beta`,
  contentType: featureFlagContentType,
  value: {
    id: "Beta",
    enabled: false,
    conditions: { clientFilters: [] },
  },
};

await client.setConfigurationSetting(flag);
```

### [Python](#tab/azure-sdk-ff-python)

```python
client = AzureAppConfigurationClient(endpoint, credential)

flag = FeatureFlagConfigurationSetting("Beta")

client.set_configuration_setting(flag)
```

### [Go](#tab/azure-sdk-ff-go)

```go
client, err := azappconfig.NewClient(endpoint, credential, nil)

key := ".appconfig.featureflag/Beta"
value := `{"id":"Beta","enabled":false,"conditions":{"client_filters":[]}}`
contentType := "application/vnd.microsoft.appconfig.ff+json;charset=utf-8"

_, err = client.SetSetting(context.Background(), key, &value, &azappconfig.SetSettingOptions{
	ContentType: &contentType,
})
```

---

## Tool and library support

The Azure portal and App Configuration libraries and tools support enhanced feature flags. The following section details what version, if any, is required for a given library.

### [.NET](#tab/library-support-dotnet)

#### .NET configuration provider

Use version **8.7.0-preview** or later of any of the following packages to access enhanced feature flags:

- `Microsoft.Extensions.Configuration.AzureAppConfiguration`
- `Microsoft.Azure.AppConfiguration.AspNetCore`
- `Microsoft.Azure.AppConfiguration.Functions.Worker`

#### Azure SDK for .NET

Use version **1.12.0-beta.1** or later of the following package to manage enhanced feature flags:

- `Azure.Data.AppConfiguration`

#### Feature management for .NET

Use version **4.0.0** or later of the following package to evaluate enhanced feature flags:

- `Microsoft.FeatureManagement`

### [Java](#tab/library-support-java)

Enhanced feature flags aren't currently available in Java.

### [JavaScript](#tab/library-support-javascript)

#### JavaScript configuration provider

Use version **2.7.0-preview** or later of the following package to access enhanced feature flags:

- `@azure/app-configuration-provider`

#### Azure SDK for JavaScript

Use version **1.13.0-beta.1** or later of the following package to manage enhanced feature flags:

- `@azure/app-configuration`

#### Feature management for JavaScript

Use version **1.0.0** or later of the following package to evaluate enhanced feature flags:

- `@microsoft/feature-management`

### [Python](#tab/library-support-python)

#### Python configuration provider

Use version **2.6.0b1** or later of the following package to access enhanced feature flags:

- `azure-appconfiguration-provider`

#### Azure SDK for Python

Use version **1.10.0b1** or later of the following package to manage enhanced feature flags:

- `azure-appconfiguration`

#### Feature management for Python

Use version **1.0.0** or later of the following package to evaluate enhanced feature flags:

- `featuremanagement`

### [Go](#tab/library-support-go)

#### Go configuration provider

Use version **1.7.0-beta.1** or later of the following package to access enhanced feature flags:

- `azureappconfiguration`

#### Azure SDK for Go

Use version **2.2.1-beta.1** or later of the following package to manage enhanced feature flags:

- `azappconfig`

#### Feature management for Go

Use version **1.0.0** or later of the following package to evaluate enhanced feature flags:

- `featuremanagement`

### [Kubernetes](#tab/library-support-kubernetes)

#### Kubernetes provider

Use version **2.7.0-preview** or later of the following image to access enhanced feature flags:

- `mcr.microsoft.com/azure-app-configuration/kubernetes-provider`

---

## Next steps

To learn more about feature management in Azure App Configuration, see [Feature management overview](./concept-feature-management.md).