---
title: Troubleshoot custom policies with Application Insights
titleSuffix: Azure AD B2C
description: How to set up Application Insights to trace the execution of your custom policies.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: mimart
ms.subservice: B2C
---

# Collect Azure Active Directory B2C logs with Application Insights

This article provides steps for collecting logs from Active Directory B2C (Azure AD B2C) so that you can diagnose problems with your custom policies. Application Insights provides a way to diagnose exceptions and visualize application performance issues. Azure AD B2C includes a feature for sending data to Application Insights.

The detailed activity logs described here should be enabled **ONLY** during the development of your custom policies.

> [!WARNING]
> Do not enable development mode in production. Logs collect all claims sent to and from identity providers. You as the developer assume responsibility for any personal data collected in your Application Insights logs. These detailed logs are collected only when the policy is placed in **DEVELOPER MODE**.

## Set up Application Insights

If you don't already have one, create an instance of Application Insights in your subscription.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure subscription (not your Azure AD B2C directory).
1. Select **Create a resource** in the left-hand navigation menu.
1. Search for and select **Application Insights**, then select **Create**.
1. Complete the form, select **Review + create**, and then select **Create**.
1. Once the deployment has been completed, select **Go to resource**.
1. Under **Configure** in Application Insights menu, select **Properties**.
1. Record the **INSTRUMENTATION KEY** for use in a later step.

## Configure the custom policy

1. Open the relying party (RP) file, for example *SignUpOrSignin.xml*.
1. Add the following attributes to the `<TrustFrameworkPolicy>` element:

   ```XML
   DeploymentMode="Development"
   UserJourneyRecorderEndpoint="urn:journeyrecorder:applicationinsights"
   ```

1. If it doesn't already exist, add a `<UserJourneyBehaviors>` child node to the `<RelyingParty>` node. It must be located immediately after `<DefaultUserJourney ReferenceId="UserJourney Id" from your extensions policy, or equivalent (for example:SignUpOrSigninWithAAD" />`.
1. Add the following node as a child of the `<UserJourneyBehaviors>` element. Make sure to replace `{Your Application Insights Key}` with the Application Insights **Instrumentation Key** that you recorded earlier.

    ```XML
    <JourneyInsights TelemetryEngine="ApplicationInsights" InstrumentationKey="{Your Application Insights Key}" DeveloperMode="true" ClientEnabled="false" ServerEnabled="true" TelemetryVersion="1.0.0" />
    ```

    * `DeveloperMode="true"` tells ApplicationInsights to expedite the telemetry through the processing pipeline. Good for development, but constrained at high volumes.
    * `ClientEnabled="true"` sends the ApplicationInsights client-side script for tracking page view and client-side errors. You can view these in the **browserTimings** table in the Application Insights portal. By setting `ClientEnabled= "true"`, you add Application Insights to your page script and you get timings of page loads and AJAX calls, counts, details of browser exceptions and AJAX failures, and user and session counts. This field is **optional**, and is set to `false` by default.
    * `ServerEnabled="true"` sends the existing UserJourneyRecorder JSON as a custom event to Application Insights.

    For example:

    ```XML
    <TrustFrameworkPolicy
      ...
      TenantId="fabrikamb2c.onmicrosoft.com"
      PolicyId="SignUpOrSignInWithAAD"
      DeploymentMode="Development"
      UserJourneyRecorderEndpoint="urn:journeyrecorder:applicationinsights"
    >
    ...
    <RelyingParty>
      <DefaultUserJourney ReferenceId="UserJourney ID from your extensions policy, or equivalent (for example: SignUpOrSigninWithAzureAD)" />
      <UserJourneyBehaviors>
        <JourneyInsights TelemetryEngine="ApplicationInsights" InstrumentationKey="{Your Application Insights Key}" DeveloperMode="true" ClientEnabled="false" ServerEnabled="true" TelemetryVersion="1.0.0" />
      </UserJourneyBehaviors>
      ...
    </TrustFrameworkPolicy>
    ```

1. Upload the policy.

## See the logs in Application Insights

There is a short delay, typically less than five minutes, before you can see new logs in Application Insights.

1. Open the Application Insights resource that you created in the [Azure portal](https://portal.azure.com).
1. In the **Overview** menu, select **Analytics**.
1. Open a new tab in Application Insights.

Here is a list of queries you can use to see the logs:

| Query | Description |
|---------------------|--------------------|
`traces` | See all of the logs generated by Azure AD B2C |
`traces | where timestamp > ago(1d)` | See all of the logs generated by Azure AD B2C for the last day

The entries may be long. Export to CSV for a closer look.

For more information about querying, see [Overview of log queries in Azure Monitor](../azure-monitor/log-query/log-query-overview.md).

## Next steps

The community has developed a user journey viewer to help identity developers. It reads from your Application Insights instance and provides a well-structured view of the user journey events. You obtain the source code and deploy it in your own solution.

The user journey player is not supported by Microsoft, and is made available strictly as-is.

You can find the version of the viewer that reads events from Application Insights on GitHub, here:

[Azure-Samples/active-directory-b2c-advanced-policies](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/tree/master/wingtipgamesb2c/src/WingTipUserJourneyPlayerWebApplication)
