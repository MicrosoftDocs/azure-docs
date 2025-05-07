---
title: Configure your environment for Datadog
description: This article describes how to configure your Azure environment to create an instance of Datadog.
ms.topic: conceptual
ms.date: 03/10/2025
---

# Configure your environment for Datadog

This article describes how to set up your environment before deploying your first instance of Datadog. 

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]

## Add enterprise application

To use the Security Assertion Markup Language (SAML) single sign-on (SSO) feature within the Datadog resource, you must set up an enterprise application. To add an enterprise application, you need one of these roles: Cloud Application Administrator, Application Administrator, or owner of the service principal.

Use the following steps to set up the enterprise application:

1. Go to [Azure portal](https://portal.azure.com). Select **Microsoft Entra ID**.
1. In the left pane, select **Manage > Enterprise applications**.
1. Select **New Application**.
1. In **Add from the gallery**, search for *Datadog*. Select the search result then select **Add**.

1. Once the app is created, go to properties from the side panel. Set **User assignment required?** to **No**, and select **Save**.

1. Go to **Single sign-on** from the side panel. Then select **SAML**.

1. Select **Yes** when prompted to save single sign-on settings.

The setup of single sign-on is now complete.

## Next step

- [QuickStart: Get started with Datadog](create.md)

