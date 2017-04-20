---
title: 'Azure Active Directory B2C: Troubleshoot Custom Policies | Microsoft Docs'
description: A topic on how to get troubleshoot problems with Azure Active Directory B2C custom policies
services: active-directory-b2c
documentationcenter: ''
author: saeeda
manager: krassk
editor: parakhj

ms.assetid: 658c597e-3787-465e-b377-26aebc94e46d
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/04/2017
ms.author: saeeda
---

# Azure Active Directory B2C: Collecting Logs

This article provides steps to collect logs and telemetry from your Azure AD B2C so that you can diagnose problems with your custom policy.

## Use App Insights (Preview)

Azure AD B2C supports a feature for sending data to Application Insights.  Application Insights provides a way to diagnose exceptions and visualize application performance issues.

1. Go to the [Azure Portal](https://portal.azure.com), click **+ New** and search for "Application Insights" select it, then click **Create**.

2. Update the UserJourneyRecorderEndpoint="urn:journeyrecorder:applicationinsights" attribute in the Base file of your policy to indicate that ApplicationInsights is being used.

3. In your custom policy update the UserJourneyBehavoirs element to include the populated element that follows

```
<JourneyInsights TelemetryEngine="ApplicationInsights" InstrumentationKey="{YOUR APPLICATION INSIGHTS KEY}" DeveloperMode="true" ClientEnabled="false" ServerEnabled="true" TelemetryVersion="1.0.0" />
```

> [!NOTE]
> DeveloperMode=true tells ApplicationInsights to expedite the telemetry through the processing pipeline, good for development, constrained at high volumes.
>
> ClientEnabled = true sends the ApplicationInsights client side script for tracking page view and client side errors
>
> ServerEnabled = true sends the existing UserJourneyRecorder JSON as a custom event to ApplicationInisghts
>
> TelemetryEngine is for future proofing.
>
> TelemetryVersion only 1.0/0 is currently supported.

## Use a web app

> [!NOTE]
> This will be deprecated.

1. [Generate a random GUID](https://www.guidgen.com/).
2. Open the RP file of your policy (e.g. SignUpOrSignInWithAAD.xml).
3. Add the following attributes to the \<TrustFrameworkPolicy\> element:

```XML
DeploymentMode="Development"
UserJourneyRecorderEndpoint="https://b2crecorder.azurewebsites.net/stream?id={GUID}"
```

4. Update `{GUID}` with the randomly generated GUID.

The final XML will look like the following:

```XML
<TrustFrameworkPolicy
  ...
  TenantId="fabrikamb2c.onmicrosoft.com"
  PolicyId="SignUpOrSignInWithAAD"
  DeploymentMode="Development"
  UserJourneyRecorderEndpoint="https://b2crecorder.azurewebsites.net/stream?id=00000000-0000-0000-0000-000000000000"
>

  ...

</TrustFrameworkPolicy>
```

You can see the troubleshooting details by replacing `{GUID}` with your randomly generated GUID in the following URL:

```
https://b2crecorder.azurewebsites.net/trace\_102.html?id={GUID}
```

