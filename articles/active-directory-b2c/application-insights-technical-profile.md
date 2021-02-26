

# Define an Application Insights technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In Azure Active Directory B2C (Azure AD B2C), you can send event data directly to [Application Insights](../azure-monitor/app/app-insights-overview.md) by using the instrumentation key provided to Azure AD B2C. With an Application Insights technical profile, you can get detailed and customized event logs for your user journeys to:

- Gain insights on user behavior.
- Troubleshoot your own policies in development or in production.
- Measure performance.
- Create notifications from Application Insights.

For more information, see [Track user behavior in Azure AD B2C by using Application Insights](analytics-with-application-insights.md).

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C:
`Web.TPEngine.Providers.Insights.AzureApplicationInsightsProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`.

The following example shows an Application Insights technical profile:

```xml
<TechnicalProfile Id="AppInsights-UserSignUp">
  <DisplayName>Application Insights tracking for new users</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.Insights.AzureApplicationInsightsProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  ...
```

## Input claims

The Application Insights provider requires an **InputClaim** be specified with a **PartnerClaimType** of `eventName` with an identifier of the event that will be reported.
. 
The **InputClaims** element additionally may contain a list of additional claims to send to Application Insights. You will need to map the name of your claim to a name that the Application Insight provider can process via the **PartnerClaimType** and the syntax **{property:NAME}**, where **NAME** is the property being added to the event.

```xml
<InputClaims>
  <InputClaim ClaimTypeReferenceId="EventType" PartnerClaimType="eventName" DefaultValue="NewUserRegistration" />
  <InputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="{property:TenantId}" DefaultValue="{Policy:TrustFrameworkTenantId}" />
  <InputClaim ClaimTypeReferenceId="correlationId" PartnerClaimType="{property:CorrelationId}" DefaultValue="{Context:CorrelationId}" />
  <InputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="{property:ObjectId}" />
  <InputClaim ClaimTypeReferenceId="aud" PartnerClaimType="{property:Audience}" DefaultValue="My Audience" />
</InputClaims>
```

The **InputClaimsTransformations** element may contain a collection of **InputClaimsTransformation** elements that are used to modify the input claims or generate new ones before sending to the REST API.

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| InstrumentationKey | Yes | The Instrumentation Key from the Application Insights resource |
| DeveloperMode | No | Runs the technical profile in developer mode. Possible values: `true`, or `false` (default).  Developer mode controls how events are buffered. In a development environment with minimal event volume, enabling developer mode results in events being sent immediately to Application Insights.  It is not recommended to enable developer mode in production environments. |
| DisableTelemetry | No | Disables the Application Insights logs. Possible values: `true`, or `false` (default). |
| IncludeClaimResolvingInClaimsHandling  | No | For input claims, specifies whether [claims resolution](claim-resolver-overview.md) is included in the technical profile. Possible values: `true`, or `false` (default). If you want to use a claims resolver in the technical profile, set this to `true`. |

## Cryptographic keys

The **CryptographicKeys** element is not used.

## Next Steps

See the following articles for more information on using Application Insights within your custom policies:

- [Track user behavior in Azure AD B2C by using Application Insights](analytics-with-application-insights)
- [Create custom KPI dashboards using Azure Application Insights](../azure-monitor/learn/tutorial-app-dashboards.md)
