---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Enabling Audio Only Mode in the UI Library
description: Enabling audio only calling experiences
author:      ahammer # GitHub alias
ms.author:   adamhammer # Microsoft alias
ms.service: azure-communication-services
ms.topic: conceptual
ms.date:     01/08/2024
ms.subservice: calling
zone_pivot_groups: acs-programming-languages-support-kotlin-swift
---

# Enable Audio Only mode in the UI Library

The UI Library provides the ability to customize it's Audio Video mode. 

In this article, you will learn how to enable Audio only mode, which will disable local and remote video capabilities.

## Prerequisites

- An integration of the ACS Calling UI SDK
- Alternative: Completion of the [quickstart for getting started with the ACS UI Library composites](../../quickstarts/ui-library/get-started-composites.md).

## Set up the features

::: zone pivot="programming-language-kotlin"
[!INCLUDE [Audio Only Mode with the Android ACS UI Library](./includes/audio-only/android.md)]
::: zone-end

::: zone pivot="programming-language-swift"
[!INCLUDE [Audio Only Mode with the iOS ACS UI Library](./includes/audio-only/ios.md)]
::: zone-end

## Next steps

- [Learn more about the UI Library](../../concepts/ui-library/ui-library-overview.md)
